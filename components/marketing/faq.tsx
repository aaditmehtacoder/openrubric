import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ROUTES, SITE } from "@/lib/constants";

const QUESTIONS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Does OpenRubric replace Devpost?",
    a: (
      <>
        No. Devpost stays where teams submit. OpenRubric imports those submissions and handles the
        part Devpost is not built for: one weighted rubric, judge assignment, live scoring, timeline
        review, and final rankings. If you do not use Devpost, a CSV import works the same way.
      </>
    ),
  },
  {
    q: "Does AI choose the winners?",
    a: (
      <>
        No. Judges enter every score and organizers publish every award. AI is used only to draft a
        short project summary so a judge has context faster. You can turn it off, and nothing in the
        ranking math reads it.
      </>
    ),
  },
  {
    q: "What happens if something fails during judging?",
    a: (
      <>
        Scores autosave as judges work, and you can export a CSV of submissions, scores, and rankings
        at any moment, so a full backup is always one click away. During a pilot we are reachable
        throughout your judging window. If the app were unavailable, your exported CSV still contains
        everything needed to finish scoring by hand.
      </>
    ),
  },
  {
    q: "Can we customize our rubric and award categories?",
    a: (
      <>
        Yes. You set the criteria, the point weights, and the tracks. Rankings are calculated per
        track and overall, so category awards and a grand prize come out of the same scoring pass.
      </>
    ),
  },
  {
    q: "What does the pilot cost?",
    a: (
      <>
        The first managed partner event is free. It is an in-kind sponsorship: we run your judging
        operation and you list OpenRubric as your judging technology partner. After that, managed
        events are a flat {"$"}50 to {"$"}100 per event, which covers the AI credits and the support
        time. See{" "}
        <Link className="text-accent underline underline-offset-2" href={ROUTES.pricing}>
          pricing
        </Link>{" "}
        for the details.
      </>
    ),
  },
  {
    q: "What information do you need from our organizers?",
    a: (
      <>
        Your rubric, your track or category list, your Devpost URL or a CSV of submissions, the names
        and emails of your judges, and your judging window with its time zone. That is enough for us
        to have the event configured before judges arrive.
      </>
    ),
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-b border-line bg-canvas scroll-mt-24">
      <div className="container-marketing py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-16">
          <div>
            <Eyebrow className="mb-4">FAQ</Eyebrow>
            <h2 className="mb-4 font-serif text-[clamp(28px,3.4vw,42px)] font-normal leading-[1.06] tracking-[-0.015em]">
              Questions organizers ask
            </h2>
            <p className="max-w-[36ch] text-[14.5px] leading-[1.6] text-dim">
              Anything not covered here, email{" "}
              <a
                className="text-accent underline underline-offset-2"
                href={`mailto:${SITE.supportEmail}`}
              >
                {SITE.supportEmail}
              </a>
              .
            </p>
          </div>

          <div className="divide-y divide-line border-y border-line">
            {QUESTIONS.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-sm text-[16px] font-medium leading-[1.4] tracking-[-0.01em] text-ink [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-4 focus-visible:ring-offset-canvas">
                  {q}
                  <span
                    aria-hidden="true"
                    className="relative h-3 w-3 flex-shrink-0 text-faint before:absolute before:left-0 before:top-1/2 before:h-px before:w-3 before:-translate-y-1/2 before:bg-current after:absolute after:left-1/2 after:top-0 after:h-3 after:w-px after:-translate-x-1/2 after:bg-current after:transition-opacity group-open:after:opacity-0"
                  />
                </summary>
                <p className="mt-3 max-w-[62ch] text-[14.5px] leading-[1.65] text-dim">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
