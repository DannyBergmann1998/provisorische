// In-memory rate limiter for Next.js (use Redis in production for multi-instance)
import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt <= now) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyPrefix?: string;
}

export function rateLimit(config: RateLimitConfig) {
  const { windowMs, max, keyPrefix = "rl" } = config;

  return async function check(req: NextRequest): Promise<NextResponse | null> {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous";

    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return null; // allowed
    }

    if (entry.count >= max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return NextResponse.json(
        { success: false, error: "Zu viele Anfragen. Bitte warten." },
        {
          status: 429,
          headers: {
            "Retry-After":       String(retryAfter),
            "X-RateLimit-Limit": String(max),
            "X-RateLimit-Reset": String(Math.ceil(entry.resetAt / 1000)),
          },
        }
      );
    }

    entry.count++;
    return null; // allowed
  };
}

// Pre-configured limiters
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX ?? "10"),
  keyPrefix: "auth",
});

export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? "60000"),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? "100"),
  keyPrefix: "api",
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  keyPrefix: "upload",
});
