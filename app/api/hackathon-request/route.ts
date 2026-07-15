import { NextResponse } from "next/server";
import { hackathonRequestSchema } from "@/lib/validators";
import { sendHostNotificationEmail } from "@/lib/mailer";
import { rateLimit, clientKey, tooManyRequests } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Where "want OpenRubric at your hackathon" requests land. */
const REQUEST_RECIPIENTS = "dlake003@gmail.com, aaditmehta1@gmail.com";

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * POST /api/hackathon-request — email an organizer's "bring OpenRubric to our
 * event" request to the team inbox. No database involved; the email IS the record.
 */
export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req, "hackathon-request"), 4, 60_000);
  if (!rl.ok) return tooManyRequests(rl.reset);

  const body = await req.json().catch(() => ({}));
  const parsed = hackathonRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }
  const { hackathonName, name, email, message } = parsed.data;

  const res = await sendHostNotificationEmail(REQUEST_RECIPIENTS, {
    subject: `Hackathon request · ${hackathonName}`,
    heading: `${escapeHtml(hackathonName)} wants OpenRubric`,
    body:
      `${escapeHtml(message).replace(/\n/g, "<br/>")}<br/><br/>` +
      `<strong>Hackathon:</strong> ${escapeHtml(hackathonName)}<br/>` +
      `<strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;`,
  });

  // demo = no SMTP configured in this deployment; tell the client so it can
  // surface a fallback (mailto) instead of pretending the email was sent.
  return NextResponse.json({ ok: res.sent || res.demo, emailed: res.sent, demo: res.demo });
}
