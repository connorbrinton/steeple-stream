import assert from "node:assert/strict";
import test from "node:test";
import { AppRateLimiter, clientIp } from "../src/rateLimit.js";

test("trusted proxy client IP is opt-in", () => {
  const req = {
    headers: { "cf-connecting-ip": "203.0.113.10", "x-forwarded-for": "203.0.113.11, 10.0.0.1" },
    socket: { remoteAddress: "127.0.0.1" },
  };

  assert.equal(clientIp(req, { trustedProxy: false }), "127.0.0.1");
  assert.equal(clientIp(req, { trustedProxy: true }), "203.0.113.10");
});

test("auth limiter returns retry metadata after threshold", async () => {
  const limiter = new AppRateLimiter({ authPoints: 1 });
  const req = { headers: {}, socket: { remoteAddress: "198.51.100.20" } };

  await limiter.authStartFor(req, {});
  await assert.rejects(
    () => limiter.authStartFor(req, {}),
    (error) => {
      assert.equal(error.status, 429);
      assert.equal(typeof error.retryAfter, "number");
      return true;
    },
  );
});
