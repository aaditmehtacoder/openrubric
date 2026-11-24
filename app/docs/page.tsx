import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { FinalCta } from "@/components/marketing/final-cta";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ROUTES, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "How OpenRubric judging works: the flow from import to rankings, the core concepts, configuration, and how to read GitHub timeline signals responsibly.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "workflow", label: "How it works" },
  { id: "concepts", label: "Core concepts" },
  { id: "github-review", label: "GitHub review" },
  { id: "configuration", label: "Configuration" },
  { id: "ethics", label: "Human decisions" },
];

const ENV = [
  ["NEXT_PUBLIC_SUPABASE_URL", "Supabase project URL (auth + database + realtime)"],
  ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "Supabase anon key for the browser client"],
  ["SUPABASE_SERVICE_ROLE_KEY", "Server-only key for imports and aggregation"],
  ["GITHUB_TOKEN", "Read-only token for live GitHub timeline scans"],
  ["GITHUB_API_MODEL_KEY", "GitHub Models token (free) for AI project summaries"],
  ["OPENAI_BASE_URL", "Override the model endpoint (defaults to GitHub Models)"],
  ["AI_MODEL", "Model id, e.g. gpt-4o-mini"],
  ["NEXT_PUBLIC_APP_URL", "Public base URL of your deployment"],
];

function H({ id, eyebrow, children }: { id: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-28">
      <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
      <h2 className="mb-4 font-serif text-[clamp(26px,3.2vw,38px)] font-normal leading-[1.08] tracking-[-0.015em]">
        {children}
      </h2>
    </div>
  );
}

const P = "mb-4 max-w-[62ch] text-[15px] leading-[1.65] text-ink";

export default function DocsPage() {
  return (
    <>
      <MarketingNav />
      <main id="main-content" tabIndex={-1} className="bg-canvas">
        <div className="container-marketing grid gap-12 py-20 lg:grid-cols-[200px_1fr]">
          {/* TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                On this page
              </div>
              <nav className="flex flex-col gap-2.5 border-l border-line pl-4">
                {TOC.map((t) => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className="text-[13.5px] text-dim transition-colors hover:text-ink"
                  >
                    {t.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* content */}
          <div>
            <Eyebrow tone="accent" className="mb-4">
              Documentation
            </Eyebrow>
            <h1 className="mb-5 max-w-[20ch] font-serif text-[clamp(34px,4.5vw,54px)] font-normal leading-[1.04] tracking-[-0.015em]">
              How OpenRubric judging works.
            </h1>
            <p className="mb-16 max-w-[60ch] text-[17px] leading-[1.6] text-dim">
              This guide covers the judging flow from import to rankings, the core concepts, the
              configuration behind a managed event, and how to read GitHub timeline signals
              responsibly.
            </p>

            <section className="mb-16">
              <H id="overview" eyebrow="Overview">
                What OpenRubric is, and isn&apos;t.
              </H>
              <p className={P}>
                OpenRubric helps organizers import submissions, define a shared rubric, invite
                judges, score projects live, review GitHub commit timelines, and publish track and
                overall winners with clear evidence behind every decision.
              </p>
              <p className={P}>
                It is <strong>not</strong> a cheating detector and <strong>not</strong> an “AI
                judge.” Every score is a human judgment against a criterion, and every award is made
                by a person. OpenRubric only surfaces evidence for organizers to review.
              </p>
            </section>

            <section className="mb-16">
              <H id="workflow" eyebrow="Workflow">
                From Devpost to final rankings.
              </H>
              <p className={P}>The end-to-end flow is six steps:</p>
              <ol className="mb-4 max-w-[62ch] list-inside list-decimal space-y-1.5 text-[15px] leading-[1.6] text-ink marker:font-mono marker:text-accent">
                <li>Paste a Devpost hackathon URL (or upload a CSV / add projects manually).</li>
                <li>Import projects. Only public metadata is read.</li>
                <li>Paste your rubric; OpenRubric turns it into scorable, weighted criteria.</li>
                <li>Invite judges and assign tracks or specific submissions.</li>
                <li>Judges score live; each judge keeps an independent record.</li>
                <li>Review GitHub timelines, resolve review cases, then export winners.</li>
              </ol>
            </section>

            <section className="mb-16">
              <H id="concepts" eyebrow="Concepts">
                Rubric, tracks, judges, signals.
              </H>
              <p className={P}>
                <strong>Rubric.</strong> A set of weighted criteria (default 100 points across
                Innovation, Technical Complexity, Functionality, Design / UX, Impact, and
                Presentation). Judges score each criterion with an optional per-line comment.
              </p>
              <p className={P}>
                <strong>Tracks.</strong> Prize categories. Each submission belongs to a track;
                winners are computed per track and overall.
              </p>
              <p className={P}>
                <strong>Judges.</strong> Each judge has their own score record. Judges never
                overwrite each other. The organizer aggregates judge scores into averages.
              </p>
              <p className={P}>
                <strong>Review signals.</strong> GitHub-timeline observations framed as questions,
                mapped to a priority: clean, light, needs review, or high priority.
              </p>
            </section>

            <section className="mb-16">
              <H id="github-review" eyebrow="GitHub Review">
                Signals, not verdicts.
              </H>
              <p className={P}>
                When a <code className="rounded bg-raised px-1.5 py-0.5 font-code text-[13px]">GITHUB_TOKEN</code>{" "}
                is configured, OpenRubric scans each repo&apos;s creation date, first and last commit,
                pre-event and post-deadline commits, and contributors. Each observation is phrased as
                something an organizer might ask about. For example:
              </p>
              <blockquote className="mb-4 max-w-[62ch] border-l-2 border-accent bg-raised px-5 py-4 text-[14.5px] leading-[1.55] text-ink">
                “GitHub timeline shows 9 commits before the hackathon start. This does not prove a
                rule violation, but judges may want to ask which parts were built during the event.”
              </blockquote>
              <p className={P}>
                OpenRubric <strong>never</strong> auto-deducts points and never uses accusatory
                language. A project with an unresolved high-priority review case cannot be marked a
                winner until an organizer resolves it.
              </p>
            </section>

            <section className="mb-16">
              <H id="configuration" eyebrow="Configuration">
                What powers a managed event.
              </H>
              <p className={P}>
                For a managed or partner event, we handle all of this for you. It is documented here
                so organizers know exactly what the system touches and where their data lives. The
                license permits running an unmodified copy yourself to evaluate OpenRubric or to
                operate your own event; it does not permit redistributing or modifying it.
              </p>
              <p className={P}>
                Data lives in a Supabase project (Postgres, auth, realtime). Judge scores are
                isolated per judge by row-level security, and every event can be exported to CSV at
                any time. These are the settings behind a live deployment:
              </p>
              <div className="mb-4 overflow-hidden rounded-[12px] border border-line bg-surface">
                {ENV.map(([key, desc]) => (
                  <div
                    key={key}
                    className="grid grid-cols-1 gap-1 border-b border-line-softer px-4 py-3 last:border-b-0 sm:grid-cols-[280px_1fr]"
                  >
                    <code className="font-code text-[12.5px] text-accent">{key}</code>
                    <span className="text-[13px] text-dim">{desc}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-4">
              <H id="ethics" eyebrow="Human decisions">
                Human final decisions.
              </H>
              <div className="max-w-[62ch] rounded-[14px] border border-accent bg-accent-soft p-6">
                <p className="text-[15.5px] font-medium leading-[1.6] text-ink">
                  OpenRubric does not determine cheating or automatically penalize teams. It surfaces
                  evidence for human organizers to review.
                </p>
              </div>
              <p className={`${P} mt-5`}>
                Want to see it working? Try the{" "}
                <Link href={ROUTES.judgeDashboard} className="font-medium text-accent underline underline-offset-2">
                  judge demo
                </Link>
                , watch the{" "}
                <Link href={ROUTES.video} className="font-medium text-accent underline underline-offset-2">
                  2-minute demo
                </Link>
                , or email{" "}
                <a
                  href={`mailto:${SITE.supportEmail}`}
                  className="font-medium text-accent underline underline-offset-2"
                >
                  {SITE.supportEmail}
                </a>{" "}
                about a pilot.
              </p>
            </section>
          </div>
        </div>
      </main>
      <FinalCta />
    </>
  );
}
