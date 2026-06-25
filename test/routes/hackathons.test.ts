import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ state: { configured: false } }));
vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: () => h.state.configured,
  getSupabaseServiceClient: async () => null,
  getSupabaseServerClient: async () => null,
}));

import { POST } from "@/app/api/hackathons/route";

function post(body: unknown): Request {
  return new Request("https://app/api/hackathons", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  h.state.configured = false;
});

describe("POST /api/hackathons", () => {
  it("rejects a missing name with 400", async () => {
    const res = await POST(post({ name: "" }));
    expect(res.status).toBe(400);
  });

  it("S6: rejects out-of-order deadlines with 400", async () => {
    const res = await POST(
      post({
        name: "Hack The Planet",
        start_time: "2026-06-03T10:00",
        submission_deadline: "2026-06-02T10:00",
        judging_deadline: "2026-06-01T10:00",
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/after/i);
  });

  it("accepts well-ordered input but degrades to 503 when Supabase is unconfigured", async () => {
    const res = await POST(
      post({
        name: "Hack The Planet",
        start_time: "2026-06-01T10:00",
        submission_deadline: "2026-06-02T10:00",
        judging_deadline: "2026-06-03T10:00",
      }),
    );
    expect(res.status).toBe(503);
  });
});
