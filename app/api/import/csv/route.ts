import { NextResponse } from "next/server";
import { parseCsv } from "@/lib/csv";

/**
 * POST /api/import/csv
 * Body: { csv: string }  — raw CSV text with columns:
 *   project_name, team_name, participant_names, repo_url, devpost_url,
 *   demo_url, live_url, track, description
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const csv = typeof body.csv === "string" ? body.csv : "";
  if (!csv.trim()) {
    return NextResponse.json({ error: "Provide CSV text in the `csv` field." }, { status: 400 });
  }

  const rows = parseCsv(csv);
  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Couldn't import automatically. Upload CSV or paste project links manually." },
      { status: 422 },
    );
  }

  return NextResponse.json({ imported: rows.length, projects: rows });
}
