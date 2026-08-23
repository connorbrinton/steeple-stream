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
      ...config
    }
  });
}

test("return paths are constrained to known same-origin routes", () => {
  assert.equal(safeReturnPath("/broadcasts/stakecenter/broadcaster", "stakecenter"), "/broadcasts/stakecenter/broadcaster");
  assert.equal(safeReturnPath("/broadcasts/stakecenter/admin?tab=sources", "stakecenter"), "/broadcasts/stakecenter/admin?tab=sources");
  assert.equal(safeReturnPath("https://evil.example", "stakecenter"), "/broadcasts/stakecenter/broadcaster");
  assert.equal(safeReturnPath("//evil.example/path", "stakecenter"), "/broadcasts/stakecenter/broadcaster");
  assert.equal(safeReturnPath("/assets/app.css", "stakecenter"), "/broadcasts/stakecenter/broadcaster");
  assert.equal(safeReturnPath("/broadcasts/other/admin", "stakecenter"), "/broadcasts/stakecenter/broadcaster");
});

test("production auth config fails closed for public binds", async () => {
  const auth = await makeAuth({
    host: "0.0.0.0",
    publicBaseUrl: "https://broadcasts.example.org",
    clientId: "client",
    clientSecret: "secret",
    sessionSecret: "short"
  });

  assert.throws(() => auth.validateStartupConfig(), /STEEPLE_SESSION_SECRET/);
});

test("production auth config fails closed for public tunnel base URL", async () => {
  const auth = await makeAuth({
    host: "127.0.0.1",
    publicBaseUrl: "https://broadcasts.example.org",
    clientId: "",
    clientSecret: "",
    sessionSecret: "0123456789abcdef0123456789abcdef"
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
    sessionSecret: "0123456789abcdef0123456789abcdef"
  });
  const token = "session-token";
  auth.store.db.prepare("INSERT INTO auth_sessions(token_hash, email, role, created_at, expires_at) VALUES(?, ?, ?, ?, ?)")
    .run(hash(token), "operator@example.org", "operator", new Date().toISOString(), new Date(Date.now() + 60_000).toISOString());
  const req = { headers: { cookie: `steeple_session=${encodeURIComponent(token)}` } };

  assert.throws(() => auth.authorize(req, "operator", { csrfRequired: true }), /Invalid CSRF token/);
  const principal = auth.authenticate(req);
  assert.equal(auth.authorize({ headers: { ...req.headers, "x-steeple-csrf": principal.csrfToken } }, "operator", { csrfRequired: true }).email, "operator@example.org");
});

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
