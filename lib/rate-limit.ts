/**
 * Lightweight in-memory rate limiter (fixed window per key).
 *
 * Good enough for a single instance or a small event. For multi-instance/serverless
 * production at scale, swap the Map for Upstash Redis or Vercel KV — the interface
 * stays the same. Used to protect the routes that call external APIs (GitHub, AI,
 * imports) from accidental hammering when 250 people are active.
 */

interface Bucket {
  count: number;
  reset: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  reset: number;
}

export function rateLimit(key: string, limit = 30, windowMs = 10_000): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, reset: now + windowMs };
  }

  bucket.count += 1;
  const ok = bucket.count <= limit;
  return { ok, remaining: Math.max(0, limit - bucket.count), reset: bucket.reset };
}

/** Derive a stable client key from a request (best-effort behind proxies). */
export function clientKey(req: Request, scope = ""): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return `${scope}:${ip}`;
}

/** Standard 429 response with Retry-After. */
export function tooManyRequests(reset: number): Response {
  const retry = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return new Response(JSON.stringify({ error: "Too many requests. Please slow down." }), {
    status: 429,
    headers: { "Content-Type": "application/json", "Retry-After": String(retry) },
  });
}
