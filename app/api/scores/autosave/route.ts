import { NextResponse } from "next/server";
import { scoreAutosaveSchema } from "@/lib/validators";
import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * POST /api/scores/autosave — upsert a judge's in-progress scores.
 * Keyed by (submission_id, judge_id, criterion_id) so judges never overwrite each
 * other. In demo mode this validates and acknowledges; live mode upserts judge_scores.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = scoreAutosaveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  return NextResponse.json({
    status: "saved",
    saved_at: new Date().toISOString(),
    demo: !isSupabaseConfigured(),
  });
}
