import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { FinalCta } from "@/components/marketing/final-cta";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ROUTES, SITE, MAILTO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "OpenRubric runs your hackathon judging for you. The first partner event is free as an in-kind sponsorship; managed events after that are a flat fee.",
};

const PARTNER = [
  "Event setup and rubric configuration",
  "Devpost or CSV import",
  "Judge onboarding",
  "Live support during judging",
  "Rankings and CSV export",
  "Recognition as your judging technology partner",
];

const MANAGED = [
  "Everything in the partner event package",
  "AI credits for project summaries, added by us",
  "Rubric, tracks, and judge assignments configured for you",
  "GitHub timeline review enabled across submissions",
  "Email support before and during your event",
  "CSV backup of submissions, scores, and rankings",
];

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mb-7 flex flex-col gap-2.5">
      {items.map((f) => (
        <li key={f} className="flex items-start gap-2.5 text-[13.5px] leading-[1.5] text-ink">
          <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
          {f}
        </li>
      ))}
    </ul>
  );
}

export default function PricingPage() {
  return (
    <>
      <MarketingNav />
      <main id="main-content" tabIndex={-1} className="bg-canvas">
        <div className="container-marketing max-w-[980px] py-16 sm:py-20">
          <div className="mb-12 max-w-[60ch]">
            <Eyebrow className="mb-3">Pricing</Eyebrow>
            <h1 className="mb-4 max-w-[20ch] font-serif text-[clamp(32px,4.4vw,52px)] font-normal leading-[1.05] tracking-[-0.015em]">
              We run the judging. You run the event.
            </h1>
            <p className="text-[15.5px] leading-[1.65] text-dim">
              OpenRubric is a managed service. There is no license to buy and no infrastructure for
              you to stand up. We set the event up, support it live, and hand you the exported
              results.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Partner event */}
            <div className="relative flex flex-col rounded-[14px] border border-accent bg-accent-soft p-7">
              <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent">
                Partner event
              </div>
              <div className="mb-1 flex items-baseline gap-2">
                <span className="text-[34px] font-bold tracking-[-0.02em]">Free</span>
                <span className="text-[14px] text-dim">first event, in kind</span>
              </div>
              <p className="mb-5 text-[13.5px] leading-[1.55] text-dim">
                We run your judging at no cost. In return you list OpenRubric as your official
                judging technology partner, place our logo on your sponsor page, and let us write an
                anonymized case study.
              </p>
              <Checklist items={PARTNER} />
              <div className="mt-auto">
                <Button asChild className="w-full">
                  <a href={MAILTO.partnership}>Discuss a partnership</a>
                </Button>
              </div>
            </div>

            {/* Managed event */}
            <div className="flex flex-col rounded-[14px] border border-line bg-surface p-7">
              <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint">
                Managed event
              </div>
              <div className="mb-1 flex items-baseline gap-2">
                <span className="text-[34px] font-bold tracking-[-0.02em]">
                  {"$"}50 to {"$"}100
                </span>
                <span className="text-[14px] text-dim">per event</span>
              </div>
              <p className="mb-5 text-[13.5px] leading-[1.55] text-dim">
                A flat fee per hackathon once you are past the partner event, or if you would rather
                not offer sponsor recognition. It covers the AI credits and our support time. Larger
                events are quoted before anything is agreed.
              </p>
              <Checklist items={MANAGED} />
              <div className="mt-auto">
                <Button asChild variant="outline" className="w-full">
                  <a href={MAILTO.pilot}>Run a pilot</a>
                </Button>
                <p className="mt-3 text-center text-[12px] text-dim">
                  Or email{" "}
                  <a
                    className="rounded-sm text-accent underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                    href={`mailto:${SITE.supportEmail}`}
                  >
                    {SITE.supportEmail}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-[14px] border border-line bg-raised p-6">
            <h2 className="mb-2 text-[15px] font-semibold tracking-[-0.01em]">
              About the software itself
            </h2>
            <p className="max-w-[70ch] text-[13.5px] leading-[1.65] text-dim">
              OpenRubric is proprietary software owned by its author. The source is published so
              organizers can inspect what runs their judging, and the{" "}
              <a
                href={`${SITE.githubUrl}/blob/main/LICENSE`}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm text-accent underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                license
              </a>{" "}
              permits running an unmodified copy to evaluate it or to operate your own event. It does
              not permit redistributing or modifying it. Full terms are in the{" "}
              <Link
                href={ROUTES.terms}
                className="rounded-sm text-accent underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                terms of service
              </Link>
              .
            </p>
          </div>
        </div>
        <FinalCta />
      </main>
    </>
  );
}
