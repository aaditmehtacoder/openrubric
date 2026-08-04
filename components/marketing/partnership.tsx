import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { ROUTES, MAILTO } from "@/lib/constants";

const PILOT = [
  "Managed setup before your event",
  "Judge onboarding and a walkthrough for your team",
  "Live support during judging",
  "CSV backup of submissions, scores, and rankings",
];

const WE_PROVIDE = [
  "Event setup",
  "Devpost or CSV import",
  "Weighted rubric configuration",
  "Judge onboarding",
  "Live judging support",
  "Rankings and CSV export",
];

const YOU_PROVIDE = [
  "“Official Judging Technology Partner” recognition",
  "Logo placement on your sponsor page",
  "A brief opening or awards ceremony mention",
  "Permission for an anonymized case study",
  "A short testimonial only if the event goes well",
];

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((i) => (
        <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[1.5] text-ink">
          <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
          {i}
        </li>
      ))}
    </ul>
  );
}

export function Partnership() {
  return (
    <section id="partners" className="border-b border-line bg-raised scroll-mt-24">
      <div className="container-marketing py-20 sm:py-24">
        {/* Managed pilot */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Eyebrow className="mb-4">Managed pilot</Eyebrow>
            <h2 className="mb-4 max-w-[20ch] font-serif text-[clamp(28px,3.6vw,44px)] font-normal leading-[1.06] tracking-[-0.015em]">
              OpenRubric is onboarding its first pilot hackathons.
            </h2>
            <p className="mb-4 max-w-[52ch] text-[15.5px] leading-[1.62] text-dim">
              The product is young and we are honest about that. It is why pilot events are run with
              us in the room rather than handed over as a login and a wish of luck.
            </p>
            <p className="max-w-[52ch] text-[15.5px] leading-[1.62] text-dim">
              If a pilot event is a fit, here is exactly what you get.
            </p>
          </div>
          <div className="rounded-[14px] border border-line bg-surface p-7">
            <Checklist items={PILOT} />
            <div className="mt-6 flex flex-col gap-3 border-t border-line-soft pt-6 sm:flex-row sm:flex-wrap">
              <Button asChild className="w-full sm:w-auto">
                <a href={MAILTO.pilot}>Run a pilot</a>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={ROUTES.pricing}>See what it costs</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* In-kind partnership */}
        <div className="mt-20 border-t border-line pt-16">
          <Eyebrow className="mb-4">Partner events</Eyebrow>
          <h2 className="mb-4 max-w-[24ch] font-serif text-[clamp(26px,3.2vw,40px)] font-normal leading-[1.06] tracking-[-0.015em]">
            Become an OpenRubric partner event
          </h2>
          <p className="mb-10 max-w-[58ch] text-[15.5px] leading-[1.62] text-dim">
            An in-kind sponsorship. We run your judging operation at no cost to the event, and you
            list us as the judging technology behind it.
          </p>

          <div className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line md:grid-cols-2">
            <div className="bg-surface p-7">
              <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
                OpenRubric provides
              </div>
              <Checklist items={WE_PROVIDE} />
            </div>
            <div className="bg-surface p-7">
              <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
                The event provides
              </div>
              <Checklist items={YOU_PROVIDE} />
            </div>
          </div>

          <div className="mt-8">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={MAILTO.partnership}>Discuss a partnership</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
