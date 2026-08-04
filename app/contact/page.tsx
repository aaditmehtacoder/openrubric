import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { FinalCta } from "@/components/marketing/final-cta";
import { FeedbackForm } from "@/components/marketing/feedback-form";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SITE, MAILTO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the OpenRubric team about running a pilot hackathon, a judging technology partnership, or anything else.",
};

const CARDS = [
  {
    label: "Run a pilot",
    title: "Managed judging for your event",
    body: "Tell us your dates, your rubric, and how many submissions you expect.",
    href: MAILTO.pilot,
  },
  {
    label: "Partner events",
    title: "Judging technology partnership",
    body: "We run judging in kind, you list OpenRubric on your sponsor page.",
    href: MAILTO.partnership,
  },
  {
    label: "Anything else",
    title: SITE.supportEmail,
    body: "Support questions, an event that is not on Devpost, or a bug you hit.",
    href: `mailto:${SITE.supportEmail}`,
  },
];

export default function ContactPage() {
  return (
    <>
      <MarketingNav />
      <main id="main-content" tabIndex={-1} className="bg-canvas">
        <div className="container-marketing max-w-[820px] py-16 sm:py-20">
          <Eyebrow className="mb-3">Contact</Eyebrow>
          <h1 className="mb-4 font-serif text-[clamp(30px,4vw,48px)] font-normal leading-[1.05] tracking-[-0.015em]">
            Talk to us.
          </h1>
          <p className="mb-10 max-w-[58ch] text-[15.5px] leading-[1.65] text-dim">
            We answer every message ourselves, usually within a day. If your event is close, say so
            in the subject line and we will move first.
          </p>

          <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CARDS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="rounded-[14px] border border-line bg-surface p-5 transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint">
                  {c.label}
                </div>
                <div className="break-words text-[14.5px] font-semibold tracking-[-0.01em]">
                  {c.title}
                </div>
                <div className="mt-1.5 text-[13px] leading-[1.5] text-dim">{c.body}</div>
              </a>
            ))}
          </div>

          <div id="feedback" className="scroll-mt-28">
            <Eyebrow className="mb-3">Message</Eyebrow>
            <h2 className="mb-2 text-[22px] font-semibold tracking-[-0.015em]">
              Send us a note instead
            </h2>
            <p className="mb-6 max-w-[58ch] text-[14px] leading-[1.6] text-dim">
              Feature ideas, bugs, or a question about your event. This form delivers to the same
              inbox as the addresses above.
            </p>
            <FeedbackForm />
          </div>
        </div>
        <FinalCta />
      </main>
    </>
  );
}
