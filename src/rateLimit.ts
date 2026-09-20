import { RateLimiterMemory } from "rate-limiter-flexible";
import type { IncomingMessage } from "node:http";

interface ProxyConfig {
  trustedProxy?: boolean;
}

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

  authStartFor(req: IncomingMessage, config: ProxyConfig) {
    return consume(this.authStart, clientIp(req, config));
  }

  authCallbackFor(req: IncomingMessage, config: ProxyConfig) {
    return consume(this.authCallback, clientIp(req, config));
  }

  unauthenticatedApiFor(req: IncomingMessage, config: ProxyConfig) {
    return consume(this.apiUnauthenticated, clientIp(req, config));
  }
}

export function clientIp(req: IncomingMessage, config: ProxyConfig = {}) {
  if (config.trustedProxy) {
    const connectingIp = header(req, "cf-connecting-ip");
    if (connectingIp) return connectingIp;
    const forwardedFor = header(req, "x-forwarded-for");
    if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return req.socket?.remoteAddress || "unknown";
}

async function consume(limiter: RateLimiterMemory, key: string) {
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

function header(req: IncomingMessage, name: string) {
  const value = req.headers?.[name];
  return Array.isArray(value) ? value[0] : value;
}
