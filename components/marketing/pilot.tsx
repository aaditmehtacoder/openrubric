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

/** What a pilot event gets. The terms of a partner event live on the pricing page. */
export function Pilot() {
  return (
    <section id="pilot" className="border-b border-line bg-raised scroll-mt-24">
      <div className="container-marketing py-20 sm:py-24">
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
              Your first partner event is free. We run the judging, and you list OpenRubric as your
              judging technology partner.
            </p>
          </div>
          <div className="rounded-[14px] border border-line bg-surface p-7">
            <ul className="flex flex-col gap-2.5">
              {PILOT.map((i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[1.5] text-ink">
                  <span
                    className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  {i}
                </li>
              ))}
            </ul>
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
      </div>
    </section>
  );
}
