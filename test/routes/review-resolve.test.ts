import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase, type FakeSupabase } from "../helpers/supabase-mock";

const h = vi.hoisted(() => ({ state: { configured: true, client: null as FakeSupabase | null } }));
vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: () => h.state.configured,
  getSupabaseServiceClient: async () => h.state.client,
}));

import { POST } from "@/app/api/review-cases/[id]/resolve/route";

const CASE_ID = "55555555-5555-5555-5555-555555555555";

function post(body: unknown): Request {
  return new Request("https://app/api/review-cases/x/resolve", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  h.state.configured = true;
  h.state.client = null;
});

describe("POST /api/review-cases/[id]/resolve", () => {
  it("404s for a non-UUID id", async () => {
    const res = await POST(post({ status: "resolved" }), { params: Promise.resolve({ id: "not-a-uuid" }) });
    expect(res.status).toBe(404);
  });

  it("resolving a high case flips status to resolved (which unblocks a winner)", async () => {
    const fake = createFakeSupabase({
      "review_cases:update": {
        data: [{ id: CASE_ID, submission_id: "sub-1", status: "resolved", priority: "high" }],
      },
    });
    h.state.client = fake;
    const res = await POST(post({ status: "resolved" }), { params: Promise.resolve({ id: CASE_ID }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.review_case.status).toBe("resolved");
    // the update targeted this case id
    const upd = fake.calls.find((c) => c.table === "review_cases" && c.op === "update")!;
    expect(upd.filters.some((f) => f.column === "id" && f.value === CASE_ID)).toBe(true);
  });

  it("404s when the case does not exist", async () => {
    h.state.client = createFakeSupabase({ "review_cases:update": { data: [] } });
    const res = await POST(post({ status: "resolved" }), { params: Promise.resolve({ id: CASE_ID }) });
    expect(res.status).toBe(404);
  });
});
