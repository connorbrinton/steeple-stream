import { RateLimiterMemory } from "rate-limiter-flexible";

export class AppRateLimiter {
  declare authStart: RateLimiterMemory;
  declare authCallback: RateLimiterMemory;
  declare apiUnauthenticated: RateLimiterMemory;

  constructor({ authPoints = 12, callbackPoints = 20, apiUnauthPoints = 60 } = {}) {
    this.authStart = new RateLimiterMemory({
      keyPrefix: "auth-start",
      points: authPoints,
      duration: 60,
      blockDuration: 120
    });
    this.authCallback = new RateLimiterMemory({
      keyPrefix: "auth-callback",
      points: callbackPoints,
      duration: 60,
      blockDuration: 120
    });
    this.apiUnauthenticated = new RateLimiterMemory({
      keyPrefix: "api-unauthenticated",
      points: apiUnauthPoints,
      duration: 60,
      blockDuration: 120
    });
  }

  authStartFor(req, config) {
    return consume(this.authStart, clientIp(req, config));
  }

  authCallbackFor(req, config) {
    return consume(this.authCallback, clientIp(req, config));
  }

  unauthenticatedApiFor(req, config) {
    return consume(this.apiUnauthenticated, clientIp(req, config));
  }
}

export function clientIp(req, config: any = {}) {
  if (config.trustedProxy) {
    const connectingIp = header(req, "cf-connecting-ip");
    if (connectingIp) return connectingIp;
    const forwardedFor = header(req, "x-forwarded-for");
    if (forwardedFor) return forwardedFor.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

async function consume(limiter, key) {
  try {
    await limiter.consume(key || "unknown");
  } catch (result) {
    const error = new Error("Too many requests");
    error.status = 429;
    const retry = typeof result === "object" && result !== null && "msBeforeNext" in result
      ? Number(result.msBeforeNext)
      : 1000;
    error.retryAfter = Math.max(1, Math.ceil((retry || 1000) / 1000));
    throw error;
  }
}

function header(req, name) {
  const value = req.headers?.[name];
  return Array.isArray(value) ? value[0] : value;
}
