import { describe, it, expect } from "vitest";
import {
  rubricMax,
  totalScore,
  hasAnyScore,
  isComplete,
  judgeStatus,
  pct,
  averageScore,
  severityRank,
  isBlockedByReview,
  rankProjects,
  trackWinners,
  suggestedOverallWinner,
} from "@/lib/scoring";
import type { ProjectView, ReviewCase, RubricCriterion, ScoreMap } from "@/lib/types";

// ── builders ────────────────────────────────────────────────────────────────
function crit(id: string, max_points: number, weight = 1): RubricCriterion {
  return {
    id,
    hackathon_id: "h1",
    name: id,
    description: "",
    max_points,
    weight,
    sort_order: 0,
  };
}

function project(id: string, othersAvg: number, track = "Overall"): ProjectView {
  return { id, othersAvg, track } as unknown as ProjectView;
}

function reviewCase(submission_id: string, status: "open" | "resolved", priority: ReviewCase["priority"]): ReviewCase {
  return {
    id: `rc-${submission_id}`,
    submission_id,
    status,
    priority,
    reason: "",
    organizer_notes: null,
    final_decision: null,
    created_at: "",
    updated_at: "",
  };
}

describe("rubricMax", () => {
  it("empty criteria is 0", () => {
    expect(rubricMax([])).toBe(0);
  });
  it("single criterion", () => {
    expect(rubricMax([crit("a", 25)])).toBe(25);
  });
  it("sums multiple criteria", () => {
    expect(rubricMax([crit("a", 25), crit("b", 25), crit("c", 50)])).toBe(100);
  });
  it("handles large values", () => {
    expect(rubricMax([crit("a", 100), crit("b", 100)])).toBe(200);
  });
});

describe("totalScore", () => {
  const criteria = [crit("a", 50), crit("b", 50)];
  it("all-max equals rubricMax", () => {
    const scores: ScoreMap = { a: 50, b: 50 };
    expect(totalScore(scores, criteria)).toBe(rubricMax(criteria));
  });
  it("missing criterion id treated as 0", () => {
    expect(totalScore({ a: 30 }, criteria)).toBe(30);
  });
  it("ignores score ids not present in criteria", () => {
    expect(totalScore({ a: 10, b: 10, zzz: 999 }, criteria)).toBe(20);
  });
  it("partial coverage sums correctly", () => {
    expect(totalScore({ a: 12, b: 7 }, criteria)).toBe(19);
  });
});

describe("hasAnyScore", () => {
  it("false for empty map", () => {
    expect(hasAnyScore({})).toBe(false);
  });
  it("false for all-zero map", () => {
    expect(hasAnyScore({ a: 0, b: 0 })).toBe(false);
  });
  it("true when any value > 0", () => {
    expect(hasAnyScore({ a: 0, b: 1 })).toBe(true);
  });
});

describe("isComplete", () => {
  const criteria = [crit("a", 10), crit("b", 10)];
  it("true only when every criterion > 0", () => {
    expect(isComplete({ a: 5, b: 5 }, criteria)).toBe(true);
  });
  it("false when one criterion missing", () => {
    expect(isComplete({ a: 5 }, criteria)).toBe(false);
  });
  // Documents suspect S3: a legitimate score of 0 makes isComplete false, so a judge
  // who genuinely scores a 0 can never reach `finalized`.
  it("S3: a genuine 0 on any criterion blocks completion", () => {
    expect(isComplete({ a: 5, b: 0 }, criteria)).toBe(false);
  });
});

describe("judgeStatus", () => {
  const criteria = [crit("a", 10), crit("b", 10)];
  it("finalized when complete", () => {
    expect(judgeStatus({ a: 5, b: 5 }, criteria)).toBe("finalized");
  });
  it("in_progress when partial", () => {
    expect(judgeStatus({ a: 5 }, criteria)).toBe("in_progress");
  });
  it("not_scored when empty", () => {
    expect(judgeStatus({}, criteria)).toBe("not_scored");
  });
});

describe("pct", () => {
  it("max <= 0 returns 0", () => {
    expect(pct(5, 0)).toBe(0);
    expect(pct(5, -3)).toBe(0);
  });
  it("rounds normally", () => {
    expect(pct(1, 3)).toBe(33);
    expect(pct(2, 3)).toBe(67);
  });
  it("value above max returns > 100", () => {
    expect(pct(15, 10)).toBe(150);
  });
});

describe("averageScore", () => {
  it("empty array returns 0 (not NaN)", () => {
    const a = averageScore([]);
    expect(a).toBe(0);
    expect(Number.isNaN(a)).toBe(false);
  });
  it("single value", () => {
    expect(averageScore([42])).toBe(42);
  });
  it("rounds the mean", () => {
    expect(averageScore([10, 11])).toBe(11); // 10.5 → 11
    expect(averageScore([10, 10, 11])).toBe(10); // 10.33 → 10
  });
});

describe("severityRank / SEVERITY ordering", () => {
  it("clean < light < needs < high", () => {
    expect(severityRank("clean")).toBeLessThan(severityRank("light"));
    expect(severityRank("light")).toBeLessThan(severityRank("needs"));
    expect(severityRank("needs")).toBeLessThan(severityRank("high"));
  });
});

describe("isBlockedByReview", () => {
  it("blocks only on open + high", () => {
    expect(isBlockedByReview("s1", [reviewCase("s1", "open", "high")])).toBe(true);
  });
  it("resolved high does not block", () => {
    expect(isBlockedByReview("s1", [reviewCase("s1", "resolved", "high")])).toBe(false);
  });
  it("open non-high does not block", () => {
    for (const p of ["needs", "light", "clean"] as const) {
      expect(isBlockedByReview("s1", [reviewCase("s1", "open", p)])).toBe(false);
    }
  });
  it("unrelated submission id does not block", () => {
    expect(isBlockedByReview("s2", [reviewCase("s1", "open", "high")])).toBe(false);
  });
});

describe("rankProjects", () => {
  it("descending by othersAvg, 1-indexed, carries blocked", () => {
    const projects = [project("a", 50), project("b", 90), project("c", 70)];
    const cases = [reviewCase("b", "open", "high")];
    const ranked = rankProjects(projects, cases);
    expect(ranked.map((r) => r.project.id)).toEqual(["b", "c", "a"]);
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 3]);
    expect(ranked[0].blocked).toBe(true);
    expect(ranked[1].blocked).toBe(false);
  });
  it("does not mutate the input array", () => {
    const projects = [project("a", 50), project("b", 90)];
    const snapshot = projects.map((p) => p.id);
    rankProjects(projects, []);
    expect(projects.map((p) => p.id)).toEqual(snapshot);
  });
});

describe("trackWinners", () => {
  it("one winner per track (max othersAvg), carries blocked", () => {
    const projects = [
      project("a", 50, "AI"),
      project("b", 90, "AI"),
      project("c", 70, "Climate"),
    ];
    const winners = trackWinners(projects, [reviewCase("b", "open", "high")]);
    const ai = winners.find((w) => w.track === "AI");
    const climate = winners.find((w) => w.track === "Climate");
    expect(ai?.project.id).toBe("b");
    expect(ai?.blocked).toBe(true);
    expect(climate?.project.id).toBe("c");
    expect(climate?.blocked).toBe(false);
  });
  it("empty input returns []", () => {
    expect(trackWinners([], [])).toEqual([]);
  });
});

describe("suggestedOverallWinner", () => {
  it("eligibleWinner is the highest non-blocked; heldBack null when top is clean", () => {
    const projects = [project("a", 90), project("b", 70)];
    const { eligibleWinner, heldBack } = suggestedOverallWinner(projects, []);
    expect(eligibleWinner?.project.id).toBe("a");
    expect(heldBack).toBeNull();
  });
  it("top blocked, second eligible → both returned correctly", () => {
    const projects = [project("a", 90), project("b", 70)];
    const cases = [reviewCase("a", "open", "high")];
    const { eligibleWinner, heldBack } = suggestedOverallWinner(projects, cases);
    expect(heldBack?.project.id).toBe("a");
    expect(eligibleWinner?.project.id).toBe("b");
  });
  it("both null on empty input", () => {
    const { eligibleWinner, heldBack } = suggestedOverallWinner([], []);
    expect(eligibleWinner).toBeNull();
    expect(heldBack).toBeNull();
  });
});
