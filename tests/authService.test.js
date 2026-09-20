import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parseCookie } from "cookie";
import { AuthService, safeReturnPath } from "../src/authService.js";
import { SqliteStore } from "../src/sqliteStore.js";

async function makeAuth(config = {}) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "steeple-auth-"));
  const store = new SqliteStore(path.join(dir, "state.sqlite"));
  await store.load();
  return new AuthService({
    store,
    config: {
      clientId: "",
      clientSecret: "",
      publicBaseUrl: "http://localhost:8080",
      host: "127.0.0.1",
      adminEmails: new Set(["admin@example.org"]),
      operatorEmails: new Set(["operator@example.org"]),
      sessionSecret: "development-only",
      sessionHours: 12,
      channelId: "stakecenter",
      requireProductionConfig: true,
      ...config,
    },
  });
}

function trustedProxyRequest(email, address = "127.0.0.1") {
  return {
    socket: { remoteAddress: address },
    headers: { "cf-access-authenticated-user-email": email },
  };
}

test("return paths are constrained to known same-origin routes", () => {
  assert.equal(
    safeReturnPath("/broadcasts/stakecenter/broadcaster", "stakecenter"),
    "/broadcasts/stakecenter/broadcaster",
  );
  assert.equal(
    safeReturnPath("/broadcasts/stakecenter/admin?tab=sources", "stakecenter"),
    "/broadcasts/stakecenter/admin?tab=sources",
  );
  assert.equal(
    safeReturnPath("https://evil.example", "stakecenter"),
    "/broadcasts/stakecenter/broadcaster",
  );
  assert.equal(
    safeReturnPath("//evil.example/path", "stakecenter"),
    "/broadcasts/stakecenter/broadcaster",
  );
  assert.equal(
    safeReturnPath("/assets/app.css", "stakecenter"),
    "/broadcasts/stakecenter/broadcaster",
  );
  assert.equal(
    safeReturnPath("/broadcasts/other/admin", "stakecenter"),
    "/broadcasts/stakecenter/broadcaster",
  );
});

test("production auth config fails closed for public binds", async () => {
  const auth = await makeAuth({
    host: "0.0.0.0",
    publicBaseUrl: "https://broadcasts.example.org",
    clientId: "client",
    clientSecret: "secret",
    sessionSecret: "short",
  });

  assert.throws(() => auth.validateStartupConfig(), /STEEPLE_SESSION_SECRET/);
});

test("production auth config fails closed for public tunnel base URL", async () => {
  const auth = await makeAuth({
    host: "127.0.0.1",
    publicBaseUrl: "https://broadcasts.example.org",
    clientId: "",
    clientSecret: "",
    sessionSecret: "0123456789abcdef0123456789abcdef",
  });

  assert.throws(() => auth.validateStartupConfig(), /STEEPLE_GOOGLE_CLIENT_ID/);
});

test("session cookies use hardened attributes", async () => {
  const auth = await makeAuth();
  const cookie = auth.sessionCookie("token-value");

  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Lax/);
  assert.equal(parseCookie(cookie).steeple_session, "token-value");
});

test("authorization requires a constant-time CSRF match for mutations", async () => {
  const auth = await makeAuth({
    clientId: "client",
    clientSecret: "secret",
    sessionSecret: "0123456789abcdef0123456789abcdef",
  });
  const token = "session-token";
  auth.store.db
    .prepare(
      "INSERT INTO auth_sessions(token_hash, email, role, created_at, expires_at) VALUES(?, ?, ?, ?, ?)",
    )
    .run(
      hash(token),
      "operator@example.org",
      "operator",
      new Date().toISOString(),
      new Date(Date.now() + 60_000).toISOString(),
    );
  const req = { headers: { cookie: `steeple_session=${encodeURIComponent(token)}` } };

  assert.throws(
    () => auth.authorize(req, "operator", { csrfRequired: true }),
    /Invalid CSRF token/,
  );
  const principal = auth.authenticate(req);
  assert.equal(
    auth.authorize(
      { headers: { ...req.headers, "x-steeple-csrf": principal.csrfToken } },
      "operator",
      { csrfRequired: true },
    ).email,
    "operator@example.org",
  );
});

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

test("trusted proxy authenticates only assigned loopback identities and preserves role and CSRF checks", async () => {
  const auth = await makeAuth({
    mode: "trusted-proxy",
    publicBaseUrl: "https://broadcasts.example.org",
  });
  await auth.initialize();
  const req = trustedProxyRequest(" ADMIN@EXAMPLE.ORG ");
  assert.equal(auth.authorize(req).role, "administrator");
  assert.equal(auth.authorize(req, "administrator").email, "admin@example.org");
  assert.equal(auth.authenticate(trustedProxyRequest(undefined)), null);
  assert.equal(auth.authenticate(trustedProxyRequest("unknown@example.org")), null);
  assert.equal(auth.authenticate(trustedProxyRequest("admin@example.org", "192.168.1.2")), null);
  assert.equal(auth.authenticate(trustedProxyRequest(["admin@example.org"])), null);
  assert.equal(
    auth.authenticate(trustedProxyRequest("admin@example.org", "::ffff:127.0.0.1")).role,
    "administrator",
  );
  assert.throws(
    () => auth.authorize(trustedProxyRequest("operator@example.org"), "administrator"),
    /Administrator/,
  );
  assert.throws(() => auth.authorize(req, "operator", { csrfRequired: true }), /CSRF/);
  req.headers["x-steeple-csrf"] = auth.authenticate(req).csrfToken;
  assert.equal(auth.authorize(req, "operator", { csrfRequired: true }).role, "administrator");
  const other = trustedProxyRequest("operator@example.org");
  other.headers["x-steeple-csrf"] = req.headers["x-steeple-csrf"];
  assert.throws(() => auth.authorize(other, "operator", { csrfRequired: true }), /CSRF/);
  await assert.rejects(auth.begin(), /Google sign-in is not configured/);
});

test("trusted proxy requires explicit safe startup configuration even with production checks disabled", async () => {
  for (const overrides of [
    { host: "0.0.0.0" },
    { adminEmails: new Set() },
    { publicBaseUrl: "http://localhost:8080" },
  ]) {
    const auth = await makeAuth({
      mode: "trusted-proxy",
      publicBaseUrl: "https://broadcasts.example.org",
      requireProductionConfig: false,
      ...overrides,
    });
    assert.throws(() => auth.validateStartupConfig(), /Trusted-proxy/);
  }
  const auth = await makeAuth({ mode: "typo" });
  assert.throws(() => auth.validateStartupConfig(), /Unsupported/);
});
