"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronDown, FileText, Globe, PlayCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileMenu } from "@/components/app/profile-menu";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { useDemo } from "@/components/app/demo-store";
import { useTheme } from "@/lib/use-theme";
import { isComplete, rubricMax, totalScore } from "@/lib/scoring";
import { cn } from "@/lib/utils";
import { TechIcon } from "@/components/ui/tech-icon";
import { ROUTES } from "@/lib/constants";
import { DEFAULT_CRITERIA } from "@/lib/demo-data";
import type { ProjectView, RubricCriterion } from "@/lib/types";

import { AutosaveIndicator } from "./autosave-indicator";
import { RealtimeJudgePresence } from "./realtime-judge-presence";
import { AIProjectSummaryCard } from "./ai-project-summary-card";
import { SuggestedQuestionsCard } from "./suggested-questions-card";
import { RubricScoreEditor } from "./rubric-score-editor";
import { PresentationScoreEditor } from "./presentation-score-editor";
import { ProjectCode, ProjectMedia } from "./screenshots-github-card";
import { DevpostWriteup } from "./devpost-writeup";
import { CollaborativeNotes } from "./collaborative-notes";
import { GitHubTimelineCard } from "./github-timeline-card";
import { OriginalityFlagCard } from "./originality-flag-card";

function ext(url: string | null): string {
  if (!url) return "#";
  return url.startsWith("http") ? url : `https://${url}`;
}

/** Small sentence-case label for a sidebar group. */
function SideLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-[12.5px] font-medium text-dim">{children}</div>;
}

/** The full Devpost write-up, collapsed by default so the summary stays the focus. */
function WriteupDisclosure({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="overflow-hidden rounded-[16px] border border-line bg-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition-colors hover:bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/40"
      >
        <span className="text-[15px] font-semibold text-ink">Full Devpost write-up</span>
        <span className="flex items-center gap-1 text-[13px] font-medium text-dim">
          {open ? "Hide" : "Read"}
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden />
        </span>
      </button>
      {open && (
        <div className="border-t border-line-soft px-6 pb-6 pt-5">
          <DevpostWriteup text={text} />
        </div>
      )}
    </section>
  );
}


export function GradingWorkspace({
  project,
  criteria = DEFAULT_CRITERIA,
  viewerRole = "judge",
  backHref = ROUTES.judgeDashboard,
  timezone = null,
  readme = null,
}: {
  project: ProjectView;
  criteria?: RubricCriterion[];
  /** Organizers get a read-only review, no scoring, no final submit. */
  viewerRole?: "organizer" | "judge";
  /** Where the "← All projects" link goes (kept in the viewer's own lane). */
  backHref?: string;
  /** Hackathon IANA timezone, commit times render in this zone. */
  timezone?: string | null;
  /** The repo's README markdown, fetched server-side and shown in the GitHub view. */
  readme?: string | null;
}) {
  const { scoresFor, registerCriteria } = useDemo();
  const { theme } = useTheme();
  const reviewOnly = viewerRole === "organizer";
  const [tab, setTab] = useState("summary");

  const scores = scoresFor(project.id);
  const total = totalScore(scores, criteria);
  const max = rubricMax(criteria);
  const complete = !reviewOnly && isComplete(scores, criteria);
  const started = total > 0;

  // Register this submission's criteria so autosave knows when every one is scored and can
  // auto-finalize. There's no manual "submit", scoring saves and completes on its own.
  useEffect(() => {
    registerCriteria(
      project.id,
      criteria.map((c) => c.id),
    );
  }, [project.id, criteria, registerCriteria]);

  // Only the links the team actually submitted; missing ones are simply left out.
  const links = [
    { label: "Live demo", url: project.live_url, icon: <Globe className="h-4 w-4" /> },
    { label: "GitHub", url: project.repo_url, icon: <TechIcon name="GitHub" className="h-4 w-4" /> },
    { label: "Devpost", url: project.devpost_url, icon: <FileText className="h-4 w-4" /> },
    { label: "Video", url: project.demo_video_url, icon: <PlayCircle className="h-4 w-4" /> },
  ].filter((lk) => Boolean(lk.url));
  const teamNames = project.participants.map((p) => p.name).filter(Boolean);

  return (
    <div className={cn("flex min-h-screen flex-col bg-canvas text-ink", theme === "dark" && "dark")}>
      {/* top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-background/85 px-4 py-3.5 backdrop-blur-[12px] sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Button asChild variant="secondary" size="sm">
            <Link href={backHref} aria-label={reviewOnly ? "Back to dashboard" : "Back to all projects"}>
              <ArrowLeft className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{reviewOnly ? "Dashboard" : "All projects"}</span>
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="truncate text-[16px] font-semibold tracking-[-0.01em]">
              {project.project_name}
            </div>
            <div className="truncate text-[12.5px] text-dim">
              {[project.team_name, project.track].filter(Boolean).join(" · ")}
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2.5 sm:gap-4">
          {!reviewOnly && (
            <div className="hidden sm:block">
              <AutosaveIndicator variant="inline" />
            </div>
          )}
          {reviewOnly ? (
            <Badge variant="outline" className="whitespace-nowrap">
              Organizer review · read-only
            </Badge>
          ) : (
            <>
              <span className="whitespace-nowrap text-[15px] font-bold tracking-[-0.01em] tabular-nums">
                {total}
                <span className="font-medium text-faint"> / {max}</span>
              </span>
              {/* Status auto-updates as you score, no submit button, it all autosaves. */}
              <span
                className={cn(
                  "hidden items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12.5px] font-semibold sm:inline-flex",
                  complete
                    ? "border-[rgba(46,138,94,0.3)] bg-[rgba(46,138,94,0.08)] text-signal-clean"
                    : "border-line bg-surface text-dim",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    complete ? "bg-signal-clean-dot" : started ? "bg-signal-review-dot" : "bg-[#C9C4BA]",
                  )}
                />
                {complete ? "Completed" : started ? "In progress" : "Not started"}
              </span>
            </>
          )}
          <ThemeToggle variant="icon" />
          <ProfileMenu />
        </div>
      </div>

      {/* 3 columns */}
      <div className="grid flex-1 grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)_320px]">
        {/* LEFT, identity: who built it and where to find it. Kept short on purpose. */}
        {/* pb-28 keeps the last link clear of the fixed translate widget (bottom-left). */}
        <aside className="border-b border-line bg-raised p-6 md:border-b-0 md:border-r md:pb-28">
          {project.track && (
            <Badge variant="accent" className="mb-3">
              {project.track}
            </Badge>
          )}
          <h2 className="text-[22px] font-semibold leading-tight tracking-[-0.02em]">{project.project_name}</h2>

          {teamNames.length > 0 && (
            <div className="mt-6">
              <SideLabel>Team</SideLabel>
              <ul className="flex flex-col gap-1 text-[14px] text-ink">
                {teamNames.map((name, i) => (
                  <li key={`${name}-${i}`}>{name}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <SideLabel>Links</SideLabel>
            {links.length === 0 ? (
              <p className="text-[13.5px] text-dim">No links submitted.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {links.map((lk) => (
                  <a
                    key={lk.label}
                    href={ext(lk.url)}
                    target="_blank"
                    rel="noreferrer"
                    title={lk.url ?? undefined}
                    className="group flex items-center gap-2.5 rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[13.5px] font-medium text-ink transition-colors hover:border-ink"
                  >
                    <span className="text-dim group-hover:text-ink">{lk.icon}</span>
                    <span className="flex-1">{lk.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-faint group-hover:text-ink" aria-hidden />
                  </a>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* CENTER, workspace, organized into tabs */}
        <section className="min-w-0 px-6 pb-20 pt-6 md:px-[30px]">
          {/* Capped reading width: long lines are hard to skim on wide screens. */}
          <Tabs value={tab} onValueChange={setTab} className="mx-auto max-w-[880px]">
            <TabsList className="mb-[22px] flex-wrap">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              {!reviewOnly && <TabsTrigger value="scoring">Scoring</TabsTrigger>}
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
              <TabsTrigger value="github">GitHub</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            {/* Everything a judge needs before the demo, top to bottom: what it is,
                what to ask, and (on demand) the team's own write-up. */}
            <TabsContent value="summary">
              <div className="flex flex-col gap-4">
                <AIProjectSummaryCard ai={project.ai} />
                <SuggestedQuestionsCard questions={project.ai.suggested_questions_json} />
                {project.description && project.description.length > 80 && (
                  <WriteupDisclosure text={project.description} />
                )}
              </div>
            </TabsContent>

            {!reviewOnly && (
              <TabsContent value="scoring">
                <div className="flex flex-col gap-4">
                  <RubricScoreEditor submissionId={project.id} criteria={criteria} />
                  <PresentationScoreEditor submissionId={project.id} />
                </div>
              </TabsContent>
            )}

            <TabsContent value="screenshots">
              <ProjectMedia project={project} />
            </TabsContent>

            <TabsContent value="github">
              <ProjectCode project={project} timezone={timezone} readme={readme} />
            </TabsContent>

            <TabsContent value="comments">
              <CollaborativeNotes submissionId={project.id} />
            </TabsContent>
          </Tabs>
        </section>

        {/* RIGHT, evidence: the GitHub timeline and review signals, nothing else. */}
        <aside className="border-t border-line bg-raised p-6 md:border-l md:border-t-0">
          <RealtimeJudgePresence submissionId={project.id} />
          <GitHubTimelineCard scan={project.scan} />
          <OriginalityFlagCard scan={project.scan} />
        </aside>
      </div>
    </div>
  );
}
