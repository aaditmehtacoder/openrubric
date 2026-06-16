import { NextResponse } from "next/server";
import { getProject } from "@/lib/demo-data";

/** GET /api/submissions/[id] — a single submission with its scan + AI summary. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ submission: project });
}
