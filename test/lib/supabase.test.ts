import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
});
afterEach(() => vi.unstubAllEnvs());

describe("isSupabaseConfigured", () => {
  it("false without URL + anon key", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const { isSupabaseConfigured } = await import("@/lib/supabase");
    expect(isSupabaseConfigured()).toBe(false);
  });
  it("true with both set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    const { isSupabaseConfigured } = await import("@/lib/supabase");
    expect(isSupabaseConfigured()).toBe(true);
  });
});

describe("getSupabaseServiceClient", () => {
  it("returns null when the service-role key is absent (graceful degradation)", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co");
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const { getSupabaseServiceClient } = await import("@/lib/supabase");
    expect(await getSupabaseServiceClient()).toBeNull();
  });
});

describe("getSupabaseBrowserClient", () => {
  it("returns null on the server (no window)", async () => {
    const { getSupabaseBrowserClient } = await import("@/lib/supabase");
    expect(getSupabaseBrowserClient()).toBeNull();
  });
});
