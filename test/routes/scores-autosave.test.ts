import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase, type FakeSupabase } from "../helpers/supabase-mock";

// Mutable mock state, hoisted so the vi.mock factory can read it.
const h = vi.hoisted(() => ({ state: { configured: true, client: null as FakeSupabase | null } }));
vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: () => h.state.configured,
  getSupabaseServiceClient: async () => h.state.client,
}));

import { POST, GET } from "@/app/api/scores/autosave/route";

const SUB = "11111111-1111-1111-1111-111111111111";
const JUDGE_A = "22222222-2222-2222-2222-222222222222";
const JUDGE_B = "33333333-3333-3333-3333-333333333333";
const CRIT = "44444444-4444-4444-4444-444444444444";

function post(body: unknown): Request {
  return new Request("https://app/api/scores/autosave", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  h.state.configured = true;
  h.state.client = null;
});

describe("POST /api/scores/autosave — validation", () => {
  it("rejects an invalid payload with 400", async () => {
    const res = await POST(post({}));
    expect(res.status).toBe(400);
  });
  it("rejects a score above the coarse 100 bound (S1 schema layer)", async () => {
    const res = await POST(post({ submission_id: SUB, judge_id: JUDGE_A, scores: { [CRIT]: 9999 } }));
    expect(res.status).toBe(400);
  });
  it("rejects a negative score", async () => {
    const res = await POST(post({ submission_id: SUB, judge_id: JUDGE_A, scores: { [CRIT]: -1 } }));
    expect(res.status).toBe(400);
  });
});

describe("POST /api/scores/autosave — demo branch", () => {
  it("acknowledges without persisting when Supabase is unconfigured", async () => {
    h.state.configured = false;
    const res = await POST(post({ submission_id: SUB, judge_id: JUDGE_A, scores: { [CRIT]: 5 } }));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toMatchObject({ status: "saved", demo: true });
  });
  it("acknowledges non-UUID (demo) ids without persisting", async () => {
    h.state.client = createFakeSupabase();
    const res = await POST(post({ submission_id: "demo-1", judge_id: "demo-j", scores: { c1: 5 } }));
    const body = await res.json();
    expect(body.demo).toBe(true);
    // never touched the DB
    expect(h.state.client.calls.length).toBe(0);
  });
});

describe("POST /api/scores/autosave — S1 clamp + judge isolation", () => {
  function configuredClient() {
    return createFakeSupabase({
      "submissions:select": { data: [{ hackathon_id: "hack-1" }] },
      "rubric_criteria:select": { data: [{ id: CRIT, max_points: 20 }] },
      "judge_scores:upsert": { data: [] },
      "judge_assignments:update": { data: [] },
    });
  }

  it("clamps an over-max score down to the criterion max_points before persisting", async () => {
    const fake = configuredClient();
    h.state.client = fake;
    const res = await POST(post({ submission_id: SUB, judge_id: JUDGE_A, scores: { [CRIT]: 95 } }));
    expect(res.status).toBe(200);
    const upsert = fake.calls.find((c) => c.table === "judge_scores" && c.op === "upsert");
    expect(upsert).toBeTruthy();
    const row = (upsert!.payload as any[])[0];
    expect(row.score).toBe(20); // clamped from 95 → 20 (criterion max)
    expect(row.judge_id).toBe(JUDGE_A);
    // isolation: upsert keyed by the composite so judges never overwrite each other
    expect(upsert!.options).toMatchObject({ onConflict: "submission_id,judge_id,criterion_id" });
  });

  it("keeps a valid in-range score as-is", async () => {
    const fake = configuredClient();
    h.state.client = fake;
    await POST(post({ submission_id: SUB, judge_id: JUDGE_A, scores: { [CRIT]: 12 } }));
    const upsert = fake.calls.find((c) => c.table === "judge_scores" && c.op === "upsert")!;
    expect((upsert.payload as any[])[0].score).toBe(12);
  });

  it("two judges writing the same submission produce independent, judge-keyed rows", async () => {
    const fakeA = configuredClient();
    h.state.client = fakeA;
    await POST(post({ submission_id: SUB, judge_id: JUDGE_A, scores: { [CRIT]: 10 } }));
    const rowA = (fakeA.calls.find((c) => c.table === "judge_scores")!.payload as any[])[0];

    const fakeB = configuredClient();
    h.state.client = fakeB;
    await POST(post({ submission_id: SUB, judge_id: JUDGE_B, scores: { [CRIT]: 18 } }));
    const rowB = (fakeB.calls.find((c) => c.table === "judge_scores")!.payload as any[])[0];

    expect(rowA.judge_id).toBe(JUDGE_A);
    expect(rowB.judge_id).toBe(JUDGE_B);
    expect(rowA.submission_id).toBe(rowB.submission_id);
    expect(rowA.criterion_id).toBe(rowB.criterion_id);
  });
});

describe("GET /api/scores/autosave — hydration isolation", () => {
  it("returns empty maps for a non-UUID judge id", async () => {
    const res = await GET(new Request("https://app/api/scores/autosave?judge_id=demo"));
    const body = await res.json();
    expect(body).toEqual({ scores: {}, presentation: {}, finalized: {} });
  });

  it("hydrates only the requesting judge's own scores", async () => {
    const fake = createFakeSupabase({
      "judge_scores:select": {
        data: [{ submission_id: SUB, criterion_id: CRIT, score: 9, is_final: true }],
      },
      "presentation_scores:select": { data: [] },
    });
    h.state.client = fake;
    const res = await GET(new Request(`https://app/api/scores/autosave?judge_id=${JUDGE_A}`));
    const body = await res.json();
    expect(body.scores[SUB][CRIT]).toBe(9);
    expect(body.finalized[SUB]).toBe(true);
    // every query filtered by this judge_id (isolation)
    const judgeFilters = fake.calls.flatMap((c) => c.filters).filter((f) => f.column === "judge_id");
    expect(judgeFilters.length).toBeGreaterThan(0);
    expect(judgeFilters.every((f) => f.value === JUDGE_A)).toBe(true);
  });
});
