import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/live-data", () => ({
  getProjectView: async () => null,
  getEventWindowForSubmission: async () => ({ eventStart: null, submissionDeadline: null }),
}));

import { POST } from "@/app/api/github/scan/route";
import { assertSafeLanguage } from "@/lib/github";

function post(body: unknown, ip: string): Request {
  return new Request("https://app/api/github/scan", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
  });
}

beforeEach(() => {
  vi.unstubAllEnvs();
  delete process.env.GITHUB_TOKEN; // demo fallback path (no live network)
});
afterEach(() => vi.unstubAllEnvs());

describe("POST /api/github/scan", () => {
  it("rejects an invalid payload with 400", async () => {
    const res = await POST(post({}, "10.0.0.1"));
    expect(res.status).toBe(400);
  });

  it("returns a demo scan shape with a safe summary when GITHUB_TOKEN is absent", async () => {
    const res = await POST(post({ submission_id: "sub-x", repo_url: "owner/repo" }, "10.0.0.2"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.live).toBe(false);
    expect(body.scan.submission_id).toBe("sub-x");
    expect(() => assertSafeLanguage(body.scan.summary)).not.toThrow();
  });

  it("rate-limits past the threshold (429)", async () => {
    const ip = "10.0.0.99";
    let last: Response | null = null;
    for (let i = 0; i < 21; i++) {
      last = await POST(post({ submission_id: "s", repo_url: "owner/repo" }, ip));
    }
    expect(last!.status).toBe(429);
    expect(Number(last!.headers.get("Retry-After"))).toBeGreaterThanOrEqual(1);
  });
});
