import { NextResponse } from "next/server";
import { manualSubmissionSchema } from "@/lib/validators";
import { isSupabaseConfigured } from "@/lib/supabase";

/** POST /api/submissions — create a single submission (manual entry). */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = manualSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const id = parsed.data.project_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return NextResponse.json(
    {
      submission: { id, status: "imported", source: "manual", ...parsed.data },
      demo: !isSupabaseConfigured(),
    },
    { status: 201 },
  );
}
