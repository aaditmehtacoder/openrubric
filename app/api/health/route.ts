import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { isGithubConfigured } from "@/lib/github";
import { isAiConfigured } from "@/lib/ai";

export const dynamic = "force-dynamic";

/** GET /api/health — liveness + which integrations are wired (for ops dashboards). */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    time: new Date().toISOString(),
    integrations: {
      supabase: isSupabaseConfigured(),
      github: isGithubConfigured(),
      ai: isAiConfigured(),
    },
  });
}
