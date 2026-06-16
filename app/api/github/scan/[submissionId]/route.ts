import { NextResponse } from "next/server";
import { demoScanFor, isGithubConfigured } from "@/lib/github";

/** GET /api/github/scan/[submissionId] — the latest stored scan for a submission. */
export async function GET(_req: Request, { params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = await params;
  return NextResponse.json({ scan: demoScanFor(submissionId), live: isGithubConfigured() });
}
