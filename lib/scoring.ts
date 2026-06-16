/**
 * Scoring, aggregation, and winner-eligibility logic.
 *
 * Pure + dependency-free so it can run on the server (rankings API) or the client
 * (live grading total). The cardinal rule from the brief: a project with an
 * unresolved high-priority review case can never be auto-marked a winner.
 */

import type {
  ProjectView,
  ReviewCase,
  ReviewPriority,
  RubricCriterion,
  ScoreMap,
  SubmissionStatus,
} from "./types";

/** Total points available across the rubric (default rubric = 100). */
export function rubricMax(criteria: RubricCriterion[]): number {
  return criteria.reduce((sum, c) => sum + c.max_points, 0);
}

/** Sum of one judge's scores across all criteria. */
export function totalScore(scores: ScoreMap, criteria: RubricCriterion[]): number {
  return criteria.reduce((sum, c) => sum + (scores[c.id] || 0), 0);
}

export function hasAnyScore(scores: ScoreMap): boolean {
  return Object.values(scores).some((v) => v > 0);
}

/** A judge has finished only when every criterion has a non-zero score. */
export function isComplete(scores: ScoreMap, criteria: RubricCriterion[]): boolean {
  return criteria.every((c) => (scores[c.id] || 0) > 0);
}

/** This judge's own progress on a submission (not the aggregate). */
export function judgeStatus(scores: ScoreMap, criteria: RubricCriterion[]): SubmissionStatus {
  if (isComplete(scores, criteria)) return "finalized";
  if (hasAnyScore(scores)) return "in_progress";
  return "not_scored";
}

/** Percentage [0–100] of a single criterion, for progress bars. */
export function pct(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.round((value / max) * 100);
}

/** Mean of a set of judge totals, rounded. Returns 0 for an empty set. */
export function averageScore(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

// ─────────────────────────────────────────────────────────────────────────────
// Review-aware ranking
// ─────────────────────────────────────────────────────────────────────────────

const SEVERITY: Record<ReviewPriority, number> = { clean: 0, light: 1, needs: 2, high: 3 };

export function severityRank(p: ReviewPriority): number {
  return SEVERITY[p];
}

/**
 * A submission is blocked from being awarded while it has an OPEN, high-priority
 * review case. "needs review" is surfaced but does not hard-block an award.
 */
export function isBlockedByReview(submissionId: string, reviewCases: ReviewCase[]): boolean {
  return reviewCases.some(
    (rc) => rc.submission_id === submissionId && rc.status === "open" && rc.priority === "high",
  );
}

export interface RankedProject {
  project: ProjectView;
  rank: number;
  blocked: boolean;
}

/** Overall leaderboard: rank by aggregate average, descending. */
export function rankProjects(projects: ProjectView[], reviewCases: ReviewCase[]): RankedProject[] {
  return [...projects]
    .sort((a, b) => b.othersAvg - a.othersAvg)
    .map((project, i) => ({
      project,
      rank: i + 1,
      blocked: isBlockedByReview(project.id, reviewCases),
    }));
}

export interface TrackWinner {
  track: string;
  project: ProjectView;
  blocked: boolean;
}

/** Best project per track (excluding the synthetic "Overall" track). */
export function trackWinners(projects: ProjectView[], reviewCases: ReviewCase[]): TrackWinner[] {
  const byTrack = new Map<string, ProjectView>();
  for (const p of projects) {
    const cur = byTrack.get(p.track);
    if (!cur || p.othersAvg > cur.othersAvg) byTrack.set(p.track, p);
  }
  return [...byTrack.entries()].map(([track, project]) => ({
    track,
    project,
    blocked: isBlockedByReview(project.id, reviewCases),
  }));
}

/**
 * The single suggested overall winner: the highest average that is NOT blocked by
 * an unresolved high-priority review. Returns the blocked top scorer separately so
 * the UI can show "Top score, but review required before award."
 */
export function suggestedOverallWinner(projects: ProjectView[], reviewCases: ReviewCase[]) {
  const ranked = rankProjects(projects, reviewCases);
  const topOverall = ranked[0] ?? null;
  const eligibleWinner = ranked.find((r) => !r.blocked) ?? null;
  const heldBack = topOverall && topOverall.blocked ? topOverall : null;
  return { eligibleWinner, heldBack, ranked };
}
