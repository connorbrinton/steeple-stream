import crypto from "node:crypto";
import * as oidc from "openid-client";

const SESSION_COOKIE = "steeple_session";

export class AuthService {
  constructor({ store, config }) {
    this.store = store;
    this.config = config;
    this.oidc = null;
  }

  get enabled() {
    return Boolean(this.config.clientId && this.config.clientSecret);
  }

  async initialize() {
    await this.store.load();
    if (!this.enabled) return;
    this.oidc = await oidc.discovery(
      new URL("https://accounts.google.com"),
      this.config.clientId,
      this.config.clientSecret
    );
  }

  async begin(returnTo = "/admin") {
    if (!this.enabled) throw httpError(503, "Google sign-in is not configured");
    const verifier = oidc.randomPKCECodeVerifier();
    const challenge = await oidc.calculatePKCECodeChallenge(verifier);
    const state = oidc.randomState();
    const nonce = oidc.randomNonce();
    const safeReturnTo = String(returnTo).startsWith("/") ? String(returnTo) : "/admin";
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
    if (!this.enabled) {
      return { email: "development@localhost", role: "administrator", csrfToken: "development" };
    }
    const token = parseCookies(req.headers.cookie || "")[SESSION_COOKIE];
    if (!token) return null;
    const session = this.store.db.prepare("SELECT email, role, expires_at FROM auth_sessions WHERE token_hash=?").get(hash(token));
    if (!session || new Date(session.expires_at) <= new Date()) return null;
    return { email: session.email, role: session.role, csrfToken: csrf(token, this.config.sessionSecret) };
  }

  authorize(req, role = "operator", { csrfRequired = false } = {}) {
    const principal = this.authenticate(req);
    if (!principal) throw httpError(401, "Authentication required");
    if (role === "administrator" && principal.role !== "administrator") throw httpError(403, "Administrator access required");
    if (csrfRequired && req.headers["x-steeple-csrf"] !== principal.csrfToken) throw httpError(403, "Invalid CSRF token");
    return principal;
  }

  logout(req) {
    const token = parseCookies(req.headers.cookie || "")[SESSION_COOKIE];
    if (token) this.store.db.prepare("DELETE FROM auth_sessions WHERE token_hash=?").run(hash(token));
  }

  sessionCookie(token) {
    return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${this.config.sessionHours * 3600}`;
  }

  clearCookie() {
    return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
  }
}

function parseCookies(value) {
  return Object.fromEntries(value.split(";").map((part) => part.trim().split("=")).filter(([key]) => key).map(([key, val]) => [key, decodeURIComponent(val || "")]));
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

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}
