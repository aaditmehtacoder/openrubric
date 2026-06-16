import { NextResponse } from "next/server";
import { reviewResolveSchema } from "@/lib/validators";
import { DEMO_REVIEW_CASES } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * POST /api/review-cases/[id]/resolve — record an organizer's decision on a review
 * case. Resolving a high-priority case is what unblocks a project for an award; the
 * decision is always the organizer's, never automatic.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = reviewResolveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = DEMO_REVIEW_CASES.find((rc) => rc.id === id);
  if (!existing && isSupabaseConfigured()) {
    return NextResponse.json({ error: "Review case not found" }, { status: 404 });
  }

  return NextResponse.json({
    review_case: {
      ...(existing ?? { id, submission_id: "", priority: "needs" }),
      status: parsed.data.status,
      organizer_notes: parsed.data.organizer_notes,
      final_decision: parsed.data.final_decision,
      updated_at: new Date().toISOString(),
    },
    demo: !isSupabaseConfigured(),
  });
}
