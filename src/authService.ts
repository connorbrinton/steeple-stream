import crypto from "node:crypto";
import { parseCookie, stringifySetCookie } from "cookie";
import * as oidc from "openid-client";

const SESSION_COOKIE = "steeple_session";
const MIN_SESSION_SECRET_BYTES = 32;

export class AuthService {
  [key: string]: any;
  constructor({ store, config }) {
    this.store = store;
    this.config = config;
    this.oidc = null;
    this.proxyCsrfSecret = crypto.randomBytes(32);
  }

  get enabled() {
    return this.config.mode === "trusted-proxy" || Boolean(this.config.clientId && this.config.clientSecret);
  }

  async initialize() {
    await this.store.load();
    this.validateStartupConfig();
    if (!this.enabled || this.config.mode === "trusted-proxy") return;
    this.oidc = await oidc.discovery(
      new URL("https://accounts.google.com"),
      this.config.clientId,
      this.config.clientSecret
    );
  }

  async begin(returnTo = "/admin") {
    if (!this.oidc) throw httpError(503, "Google sign-in is not configured");
    this.cleanupExpiredAuthRecords();
    const verifier = oidc.randomPKCECodeVerifier();
    const challenge = await oidc.calculatePKCECodeChallenge(verifier);
    const state = oidc.randomState();
    const nonce = oidc.randomNonce();
    const safeReturnTo = safeReturnPath(returnTo, this.config.channelId);
    this.store.db.prepare("INSERT INTO oauth_attempts(state_hash, verifier, nonce, return_to, expires_at) VALUES(?, ?, ?, ?, ?)")
      .run(hash(state), verifier, nonce, safeReturnTo, new Date(Date.now() + 10 * 60_000).toISOString());
    return oidc.buildAuthorizationUrl(this.oidc, {
      redirect_uri: this.config.redirectUri,
      scope: "openid email profile",
      code_challenge: challenge,
      code_challenge_method: "S256",
      state,
      nonce,
      prompt: "select_account"
    });
  }

  async complete(callbackUrl) {
    if (!this.oidc) throw httpError(503, "Google sign-in is not configured");
    const url = new URL(callbackUrl);
    const state = url.searchParams.get("state") || "";
    const attempt = this.store.db.prepare("SELECT * FROM oauth_attempts WHERE state_hash=?").get(hash(state));
    if (!attempt || new Date(attempt.expires_at) <= new Date()) throw httpError(400, "Sign-in attempt expired or is invalid");
    this.store.db.prepare("DELETE FROM oauth_attempts WHERE state_hash=?").run(hash(state));
    const tokens = await oidc.authorizationCodeGrant(this.oidc, url, {
      pkceCodeVerifier: attempt.verifier,
      expectedState: state,
      expectedNonce: attempt.nonce
    });
    const claims = tokens.claims();
    const email = String(claims?.email || "").trim().toLowerCase();
    if (!email || claims?.email_verified !== true) throw httpError(403, "Google account email is not verified");
    const role = this.roleFor(email);
    if (!role) throw httpError(403, "This Google account is not authorized for Steeple Stream");
    const token = randomToken();
    this.store.db.prepare("INSERT INTO auth_sessions(token_hash, email, role, created_at, expires_at) VALUES(?, ?, ?, ?, ?)")
      .run(hash(token), email, role, new Date().toISOString(), new Date(Date.now() + this.config.sessionHours * 3600_000).toISOString());
    return { token, returnTo: attempt.return_to };
  }

  roleFor(email) {
    if (this.config.adminEmails.has(email)) return "administrator";
    if (this.config.operatorEmails.has(email)) return "operator";
    return null;
  }

  authenticate(req) {
    if (this.config.mode === "trusted-proxy") {
      if (!["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(req.socket?.remoteAddress)) return null;
      const header = req.headers["cf-access-authenticated-user-email"];
      if (typeof header !== "string") return null;
      const email = header.trim().toLowerCase();
      const role = this.roleFor(email);
      if (!role) return null;
      return { email, role, csrfToken: csrf(email, this.proxyCsrfSecret) };
    }
    if (!this.enabled) {
      return { email: "development@localhost", role: "administrator", csrfToken: "development" };
    }
    const token = parseCookie(req.headers.cookie || "")[SESSION_COOKIE];
    if (!token) return null;
    const session = this.store.db.prepare("SELECT email, role, expires_at FROM auth_sessions WHERE token_hash=?").get(hash(token));
    if (!session || new Date(session.expires_at) <= new Date()) return null;
    return { email: session.email, role: session.role, csrfToken: csrf(token, this.config.sessionSecret) };
  }

  authorize(req, role = "operator", { csrfRequired = false } = {}) {
    const principal = this.authenticate(req);
    if (!principal) throw httpError(401, "Authentication required");
    if (role === "administrator" && principal.role !== "administrator") throw httpError(403, "Administrator access required");
    if (csrfRequired && !safeEqual(req.headers["x-steeple-csrf"], principal.csrfToken)) throw httpError(403, "Invalid CSRF token");
    return principal;
  }

  logout(req) {
    const token = parseCookie(req.headers.cookie || "")[SESSION_COOKIE];
    if (token) this.store.db.prepare("DELETE FROM auth_sessions WHERE token_hash=?").run(hash(token));
  }

  sessionCookie(token) {
    return stringifySetCookie({
      name: SESSION_COOKIE,
      value: token,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: this.config.sessionHours * 3600
    });
  }

  clearCookie() {
    return stringifySetCookie({
      name: SESSION_COOKIE,
      value: "",
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 0
    });
  }

  cleanupExpiredAuthRecords(referenceDate = new Date()) {
    const now = referenceDate.toISOString();
    this.store.db.prepare("DELETE FROM oauth_attempts WHERE expires_at <= ?").run(now);
    this.store.db.prepare("DELETE FROM auth_sessions WHERE expires_at <= ?").run(now);
  }

  validateStartupConfig() {
    if (![undefined, "google", "trusted-proxy"].includes(this.config.mode)) {
      throw new Error("Unsupported STEEPLE_AUTH_MODE");
    }
    if (this.config.mode === "trusted-proxy") {
      if (!isLoopbackHost(this.config.host)) throw new Error("Trusted-proxy authentication requires a loopback STEEPLE_HOST");
      if (!this.config.adminEmails?.size) throw new Error("Trusted-proxy authentication requires STEEPLE_ADMIN_EMAILS");
      if (new URL(this.config.publicBaseUrl).protocol !== "https:") throw new Error("Trusted-proxy authentication requires an HTTPS STEEPLE_PUBLIC_BASE_URL");
      return;
    }
    if (!this.config.requireProductionConfig || !isProductionAuthContext(this.config)) return;
    const missing = [];
    if (!this.config.clientId) missing.push("STEEPLE_GOOGLE_CLIENT_ID");
    if (!this.config.clientSecret) missing.push("STEEPLE_GOOGLE_CLIENT_SECRET");
    if (!this.config.publicBaseUrl || this.config.publicBaseUrl.startsWith("http://localhost")) missing.push("STEEPLE_PUBLIC_BASE_URL");
    if (!this.config.adminEmails?.size) missing.push("STEEPLE_ADMIN_EMAILS");
    if (!this.config.operatorEmails?.size && !this.config.adminEmails?.size) missing.push("STEEPLE_OPERATOR_EMAILS");
    if (!isStrongSecret(this.config.sessionSecret)) missing.push("STEEPLE_SESSION_SECRET");
    if (missing.length) {
      throw new Error(`Production auth configuration is incomplete: ${missing.join(", ")}`);
    }
  }
}

function randomToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function csrf(token, secret) {
  return crypto.createHmac("sha256", secret).update(token).digest("base64url");
}

export function safeReturnPath(value, channelId = "stakecenter") {
  const fallback = `/broadcasts/${channelId}/broadcaster`;
  const path = String(value || fallback);
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\") || /%5c/i.test(path)) return fallback;
  let parsed;
  try {
    parsed = new URL(path, "https://steeple.invalid");
  } catch {
    return fallback;
  }
  if (parsed.origin !== "https://steeple.invalid") return fallback;
  const allowed = new Set([
    "/",
    "/admin",
    "/broadcaster",
    `/broadcasts/${channelId}`,
    `/broadcasts/${channelId}/admin`,
    `/broadcasts/${channelId}/broadcaster`
  ]);
  if (!allowed.has(parsed.pathname)) return fallback;
  return `${parsed.pathname}${parsed.search}`;
}

function safeEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function isStrongSecret(secret) {
  if (!secret || secret === "development-only") return false;
  return Buffer.byteLength(secret, "utf8") >= MIN_SESSION_SECRET_BYTES;
}

function isLoopbackHost(host) {
  return ["127.0.0.1", "localhost", "::1"].includes(host);
}

function isProductionAuthContext(config) {
  if (!isLoopbackHost(config.host)) return true;
  try {
    const url = new URL(config.publicBaseUrl || "http://localhost");
    return !isLoopbackHost(url.hostname);
  } catch {
    return true;
  }
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}
