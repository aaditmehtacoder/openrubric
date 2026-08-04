import { Eyebrow } from "@/components/ui/eyebrow";
import { TimelineBadge } from "@/components/ui/badge";
import type { ReviewPriority } from "@/lib/types";

const RUBRIC = [
  { name: "Innovation", score: 18, max: 20 },
  { name: "Technical complexity", score: 22, max: 25 },
  { name: "Functionality", score: 17, max: 20 },
  { name: "Design and UX", score: 13, max: 15 },
  { name: "Impact", score: 9, max: 10 },
  { name: "Presentation", score: 8, max: 10 },
];

const SIGNALS: { label: string; priority: ReviewPriority }[] = [
  { label: "All commits inside the event window", priority: "clean" },
  { label: "Nine commits before the event started", priority: "light" },
  { label: "Activity after the submission deadline", priority: "needs" },
  { label: "No usable commit history found", priority: "high" },
];

const RANKINGS = [
  { rank: "1", name: "Lighthouse", track: "Health AI", score: "87.3" },
  { rank: "2", name: "MediScan", track: "Health AI", score: "83.0" },
  { rank: "3", name: "CampusLoop", track: "Health AI", score: "79.5" },
  { rank: "4", name: "StudyForge", track: "Health AI", score: "76.1" },
];

/** One differentiator: copy on one side, a concrete panel on the other. */
function Row({
  eyebrow,
  title,
  children,
  panel,
  flip = false,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  panel: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 border-b border-line py-16 last:border-b-0 lg:grid-cols-2 lg:gap-16">
      <div className={flip ? "lg:order-2" : undefined}>
        <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
        <h3 className="mb-4 max-w-[20ch] font-serif text-[clamp(24px,2.8vw,34px)] font-normal leading-[1.1] tracking-[-0.015em]">
          {title}
        </h3>
        <div className="max-w-[48ch] space-y-3.5 text-[15px] leading-[1.62] text-dim">{children}</div>
      </div>
      <div className={flip ? "lg:order-1" : undefined}>{panel}</div>
    </div>
  );
}

export function Differentiators() {
  return (
    <section id="product" className="border-b border-line bg-canvas scroll-mt-24">
      <div className="container-marketing pt-20 sm:pt-24">
        <Eyebrow className="mb-4">What OpenRubric does</Eyebrow>
        <h2 className="max-w-[22ch] font-serif text-[clamp(28px,3.6vw,46px)] font-normal leading-[1.06] tracking-[-0.015em]">
          Three things that decide whether judging goes smoothly.
        </h2>

        <Row
          eyebrow="Scoring"
          title="One shared weighted rubric"
          panel={
            <div className="rounded-[14px] border border-line bg-surface p-6">
              <div className="mb-5 flex items-baseline justify-between border-b border-line-soft pb-4">
                <div>
                  <div className="text-[15px] font-semibold tracking-[-0.01em]">Lighthouse</div>
                  <div className="mt-1 font-mono text-[11px] text-faint">6 criteria, 100 points</div>
                </div>
                <div className="font-mono text-[22px] tabular-nums text-ink">
                  87<span className="text-[14px] text-faint">/100</span>
                </div>
              </div>
              <ul className="flex flex-col gap-3.5">
                {RUBRIC.map((r) => (
                  <li key={r.name}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="text-[13.5px] text-ink">{r.name}</span>
                      <span className="font-mono text-[12px] tabular-nums text-faint">
                        {r.score}/{r.max}
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-sunken">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${Math.round((r.score / r.max) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          }
        >
          <p>
            You define the criteria and the weights once. Every judge scores the same way, on the
            same scale, with a comment box on each line.
          </p>
          <p>
            Judges keep independent records, so nobody overwrites anyone. Scores autosave while
            judges work, which matters when a laptop dies twenty minutes before awards.
          </p>
        </Row>

        <Row
          eyebrow="Review"
          title="GitHub timeline review for organizers"
          flip
          panel={
            <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
              <ul className="divide-y divide-line-soft">
                {SIGNALS.map((s) => (
                  <li key={s.label} className="flex items-center gap-4 px-5 py-4">
                    <span className="flex-1 text-[13.5px] leading-snug text-ink">{s.label}</span>
                    <TimelineBadge priority={s.priority} />
                  </li>
                ))}
              </ul>
              <p className="border-t border-line bg-raised px-5 py-4 text-[13px] leading-[1.55] text-dim">
                Every signal is a question for an organizer, not a verdict. OpenRubric never deducts
                points and never decides that a team broke a rule.
              </p>
            </div>
          }
        >
          <p>
            OpenRubric reads each project&rsquo;s public commit history and points out things worth
            asking about: work that predates the event, commits after the deadline, or a repo with no
            usable history.
          </p>
          <p>
            These are questions for organizers, not verdicts. You decide what they mean, and a
            project with an unresolved high-priority question stays out of the winners list until a
            human resolves it.
          </p>
        </Row>

        <Row
          eyebrow="Results"
          title="Rankings with exportable backups"
          panel={
            <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
                  Final rankings
                </span>
                <span className="rounded-control border border-line px-2.5 py-1 font-mono text-[11px] text-dim">
                  Export CSV
                </span>
              </div>
              <table className="w-full text-left">
                <caption className="sr-only">Example final rankings for the Health AI track</caption>
                <thead>
                  <tr className="border-b border-line-soft font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint">
                    <th scope="col" className="px-5 py-2.5 font-normal">
                      #
                    </th>
                    <th scope="col" className="px-2 py-2.5 font-normal">
                      Project
                    </th>
                    <th scope="col" className="px-2 py-2.5 font-normal">
                      Track
                    </th>
                    <th scope="col" className="px-5 py-2.5 text-right font-normal">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  {RANKINGS.map((r) => (
                    <tr key={r.name} className="text-[13.5px]">
                      <td className="px-5 py-3 font-mono text-faint">{r.rank}</td>
                      <td className="px-2 py-3 font-medium text-ink">{r.name}</td>
                      <td className="px-2 py-3 text-dim">{r.track}</td>
                      <td className="px-5 py-3 text-right font-mono tabular-nums text-ink">
                        {r.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        >
          <p>
            Judge scores aggregate into weighted totals per track and overall. Every number traces
            back to a criterion and the judge who entered it, so you can answer a question from a
            team on the spot.
          </p>
          <p>
            Export submissions, scores, and rankings as CSV at any point during judging, not just at
            the end. If anything goes wrong, you still have the numbers.
          </p>
        </Row>
      </div>
    </section>
  );
}
