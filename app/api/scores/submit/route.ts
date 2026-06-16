import { NextResponse } from "next/server";
import { scoreSubmitSchema } from "@/lib/validators";
import { DEFAULT_CRITERIA } from "@/lib/demo-data";
import { totalScore } from "@/lib/scoring";
import { isSupabaseConfigured } from "@/lib/supabase";

/** POST /api/scores/submit — finalize a judge's score for a submission. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = scoreSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const total = totalScore(parsed.data.scores, DEFAULT_CRITERIA);
  return NextResponse.json({
    status: "submitted",
    total,
    submission_id: parsed.data.submission_id,
    judge_id: parsed.data.judge_id,
    demo: !isSupabaseConfigured(),
  });
}
