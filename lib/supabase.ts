/**
 * Supabase client factories — auth + Postgres + realtime, "ready when you are".
 *
 * OpenRubric runs in DEMO MODE with no Supabase project. The moment you set
 * NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY (and run
 * supabase/schema.sql), isSupabaseConfigured() flips true and these factories
 * return real clients. next/headers is imported lazily so the browser bundle stays
 * clean.
 */

import { createBrowserClient } from "@supabase/ssr";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Browser client for Client Components. Returns null in demo mode or on the server. */
export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") return null;
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(URL, ANON);
}

/**
 * Server client for Server Components / Route Handlers / Server Actions.
 * Lazily imports next/headers + @supabase/ssr so this module is safe to import
 * from client code. Returns null in demo mode.
 */
export async function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;
  const { cookies } = await import("next/headers");
  const { createServerClient } = await import("@supabase/ssr");
  const cookieStore = await cookies();

  type CookieToSet = { name: string; value: string; options?: Record<string, unknown> };

  return createServerClient(URL, ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet: CookieToSet[]) {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2]),
          );
        } catch {
          // Called from a Server Component (read-only cookies). Safe to ignore —
          // middleware refreshes the session.
        }
      },
    },
  });
}

/**
 * Service-role client for trusted server-only work (imports, aggregation). Never
 * import this into a Client Component. Returns null when the key is absent.
 */
export async function getSupabaseServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!URL || !key) return null;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(URL, key, { auth: { persistSession: false } });
}
