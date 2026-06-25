import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ state: { configured: false, client: null as any } }));
vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: () => h.state.configured,
  getSupabaseServiceClient: async () => h.state.client,
}));

import { GET } from "@/app/api/health/route";

beforeEach(() => {
  h.state.configured = false;
  h.state.client = null;
});

describe("GET /api/health", () => {
  it("returns 200 with a JSON body even when nothing is configured", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.integrations).toHaveProperty("supabase");
    expect(body.integrations).toHaveProperty("github");
    expect(body.integrations).toHaveProperty("ai");
    // schema probe degrades gracefully with no service client
    expect(body.schema.checked).toBe(false);
  });
});
