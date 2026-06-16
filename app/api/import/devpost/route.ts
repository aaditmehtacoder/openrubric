import { NextResponse } from "next/server";
import { devpostImportSchema } from "@/lib/validators";
import { DEMO_PROJECTS } from "@/lib/demo-data";
import { rateLimit, clientKey, tooManyRequests } from "@/lib/rate-limit";

/**
 * POST /api/import/devpost
 *
 * SAFETY: OpenRubric only reads PUBLIC Devpost metadata and never bypasses
 * authentication or scrapes private data. Devpost exposes no stable public judging
 * API, so automatic import is best-effort. On failure, callers fall back to CSV or
 * manual entry with the message below.
 */
export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req, "import-devpost"), 10, 10_000);
  if (!rl.ok) return tooManyRequests(rl.reset);

  const body = await req.json().catch(() => ({}));
  const parsed = devpostImportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Demo mode: return the public demo projects as the import preview.
  const projects = DEMO_PROJECTS.map((p) => ({
    project_name: p.project_name,
    team_name: p.team_name,
    track: p.track,
    repo_url: p.repo_url,
    devpost_url: p.devpost_url,
    live_url: p.live_url,
    description: p.description,
  }));

  return NextResponse.json({
    source: parsed.data.url,
    imported: projects.length,
    projects,
    note: "Imported public Devpost metadata only.",
    fallback: "Couldn't import automatically. Upload CSV or paste project links manually.",
  });
}
