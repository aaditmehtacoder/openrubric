import { NextResponse } from "next/server";
import { hackathonSchema } from "@/lib/validators";
import { isSupabaseConfigured } from "@/lib/supabase";
import { DEMO_HACKATHON } from "@/lib/demo-data";

/** GET /api/hackathons — list hackathons (demo: the single seeded hackathon). */
export async function GET() {
  return NextResponse.json({ hackathons: [DEMO_HACKATHON], demo: !isSupabaseConfigured() });
}

/** POST /api/hackathons — create a hackathon. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = hackathonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // In demo mode we echo a created record. With Supabase configured, insert here.
  const slug = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return NextResponse.json(
    {
      hackathon: { id: slug, slug, ...parsed.data },
      demo: !isSupabaseConfigured(),
    },
    { status: 201 },
  );
}
