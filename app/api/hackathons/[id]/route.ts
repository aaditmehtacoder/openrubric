import { NextResponse } from "next/server";
import { DEMO_HACKATHON, DEMO_TRACKS, DEFAULT_CRITERIA } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/supabase";

/** GET /api/hackathons/[id] — a hackathon with its tracks + rubric criteria. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== DEMO_HACKATHON.id && isSupabaseConfigured()) {
    // Live lookup would go here.
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    hackathon: DEMO_HACKATHON,
    tracks: DEMO_TRACKS,
    criteria: DEFAULT_CRITERIA,
    demo: !isSupabaseConfigured(),
  });
}
