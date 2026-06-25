import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { rateLimit, clientKey, tooManyRequests } from "@/lib/rate-limit";

describe("rateLimit (fake clock)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("first call ok with remaining = limit - 1", () => {
    const r = rateLimit("k-first", 3, 1000);
    expect(r.ok).toBe(true);
    expect(r.remaining).toBe(2);
  });

  it("limit-th call still ok, limit+1-th is not", () => {
    const key = "k-edge";
    expect(rateLimit(key, 3, 1000).ok).toBe(true); // 1
    expect(rateLimit(key, 3, 1000).ok).toBe(true); // 2
    const third = rateLimit(key, 3, 1000); // 3 (== limit)
    expect(third.ok).toBe(true);
    expect(third.remaining).toBe(0);
    const fourth = rateLimit(key, 3, 1000); // 4 (> limit)
    expect(fourth.ok).toBe(false);
  });

  it("resets in a new window after reset", () => {
    const key = "k-window";
    rateLimit(key, 1, 1000); // ok
    expect(rateLimit(key, 1, 1000).ok).toBe(false); // over
    vi.advanceTimersByTime(1001);
    expect(rateLimit(key, 1, 1000).ok).toBe(true); // fresh window
  });

  it("different keys are isolated", () => {
    expect(rateLimit("k-a", 1, 1000).ok).toBe(true);
    expect(rateLimit("k-a", 1, 1000).ok).toBe(false);
    expect(rateLimit("k-b", 1, 1000).ok).toBe(true);
  });
});

describe("clientKey", () => {
  function reqWith(headers: Record<string, string>): Request {
    return new Request("https://example.com", { headers });
  }
  it("uses first token of x-forwarded-for", () => {
    expect(clientKey(reqWith({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }), "scan")).toBe("scan:1.2.3.4");
  });
  it("falls back to x-real-ip", () => {
    expect(clientKey(reqWith({ "x-real-ip": "9.9.9.9" }), "ai")).toBe("ai:9.9.9.9");
  });
  it("falls back to unknown", () => {
    expect(clientKey(reqWith({}), "imp")).toBe("imp:unknown");
  });
});

describe("tooManyRequests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("status 429 with Retry-After >= 1", async () => {
    const res = tooManyRequests(Date.now() + 5000);
    expect(res.status).toBe(429);
    const retry = Number(res.headers.get("Retry-After"));
    expect(retry).toBeGreaterThanOrEqual(1);
    const body = await res.json();
    expect(body.error).toMatch(/too many/i);
  });

  it("Retry-After is at least 1 even when reset is in the past", () => {
    const res = tooManyRequests(Date.now() - 5000);
    expect(Number(res.headers.get("Retry-After"))).toBeGreaterThanOrEqual(1);
  });
});
