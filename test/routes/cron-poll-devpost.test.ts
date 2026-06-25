import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createFakeSupabase, type FakeSupabase } from "../helpers/supabase-mock";

const h = vi.hoisted(() => ({ state: { configured: true, client: null as FakeSupabase | null } }));
vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: () => h.state.configured,
  getSupabaseServiceClient: async () => h.state.client,
}));
vi.mock("@/lib/devpost", () => ({ scrapeDevpost: async () => ({ base: "x", projects: [], truncated: false }) }));
vi.mock("@/lib/import-pipeline", () => ({
  importDevpostProjects: async () => ({ imported: 0, submissions: [] }),
  enrichSubmission: async () => ({}),
}));

import { GET } from "@/app/api/cron/poll-devpost/route";

function req(auth?: string): Request {
  return new Request("https://app/api/cron/poll-devpost", {
    headers: auth ? { authorization: auth } : {},
  });
}

beforeEach(() => {
  h.state.configured = true;
  h.state.client = createFakeSupabase({ hackathons: { data: [] }, submissions: { data: [] } });
  vi.unstubAllEnvs();
});
afterEach(() => vi.unstubAllEnvs());

describe("S7: cron auth gating", () => {
  it("fails closed in production when CRON_SECRET is unset (503)", async () => {
    vi.stubEnv("NODE_ENV", "production");
    delete process.env.CRON_SECRET;
    const res = await GET(req());
    expect(res.status).toBe(503);
  });

  it("rejects a wrong bearer token when CRON_SECRET is set (401)", async () => {
    vi.stubEnv("CRON_SECRET", "s3cret");
    const res = await GET(req("Bearer wrong"));
    expect(res.status).toBe(401);
  });

  it("accepts the correct bearer token (200)", async () => {
    vi.stubEnv("CRON_SECRET", "s3cret");
    const res = await GET(req("Bearer s3cret"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it("returns 503 when Supabase is unconfigured (graceful, not a crash)", async () => {
    h.state.configured = false;
    const res = await GET(req());
    expect(res.status).toBe(503);
  });
});
