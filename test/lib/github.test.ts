import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  parseRepoUrl,
  deriveReviewPriority,
  reviewNote,
  assertSafeLanguage,
  FORBIDDEN_LANGUAGE,
  graceMinutes,
  demoScanFor,
  DEFAULT_GRACE_MINUTES,
} from "@/lib/github";

type Metrics = Parameters<typeof deriveReviewPriority>[0];
function metrics(over: Partial<Metrics> = {}): Metrics {
  return {
    totalCommits: 10,
    preEventCommits: 0,
    postDeadlineCommits: 0,
    repoCreatedBeforeEvent: false,
    firstCommitInWindow: true,
    hasUnlistedContributors: false,
    ...over,
  };
}

describe("parseRepoUrl", () => {
  const owner_repo = { owner: "owner", repo: "repo" };
  const cases: Array<[string, { owner: string; repo: string } | null]> = [
    ["https://github.com/owner/repo", owner_repo],
    ["github.com/owner/repo", owner_repo],
    ["owner/repo", owner_repo],
    ["https://github.com/owner/repo.git", owner_repo],
    ["https://github.com/owner/repo/", owner_repo],
    ["https://github.com/owner/repo/tree/main/src", owner_repo],
    ["https://www.github.com/owner/repo", owner_repo], // S2: www. prefix
    ["https://github.com/owner/repo?tab=readme", owner_repo], // S2: query string
    ["", null],
    ["https://example.com/not/github", null], // S2: a non-GitHub host must not parse to a bogus owner
  ];
  for (const [input, expected] of cases) {
    it(`parses ${JSON.stringify(input)}`, () => {
      expect(parseRepoUrl(input)).toEqual(expected);
    });
  }
  it("non-github single-segment string returns null", () => {
    expect(parseRepoUrl("justone")).toBeNull();
  });
});

describe("deriveReviewPriority", () => {
  it("all-zero metrics with commits and no flags → clean", () => {
    expect(deriveReviewPriority(metrics({ totalCommits: 5 }))).toBe("clean");
  });
  it("totalCommits === 0 → needs", () => {
    expect(deriveReviewPriority(metrics({ totalCommits: 0 }))).toBe("needs");
  });
  it("postDeadlineCommits > 0 → needs", () => {
    expect(deriveReviewPriority(metrics({ postDeadlineCommits: 1 }))).toBe("needs");
  });
  it("preEventCommits === 20 → light (<= 20 rule)", () => {
    expect(deriveReviewPriority(metrics({ preEventCommits: 20 }))).toBe("light");
  });
  it("preEventCommits === 21 → high (> 20 rule)", () => {
    expect(deriveReviewPriority(metrics({ preEventCommits: 21 }))).toBe("high");
  });
  it("hasUnlistedContributors → at least needs", () => {
    expect(severityAtLeast(deriveReviewPriority(metrics({ hasUnlistedContributors: true })), "needs")).toBe(true);
  });
  it("interaction: many pre-event + post-deadline → high (most severe wins)", () => {
    expect(deriveReviewPriority(metrics({ preEventCommits: 25, postDeadlineCommits: 3 }))).toBe("high");
  });
  it("placeholder repo (created before + first commit in window) → light", () => {
    expect(
      deriveReviewPriority(metrics({ repoCreatedBeforeEvent: true, firstCommitInWindow: true })),
    ).toBe("light");
  });
});

const ORDER = ["clean", "light", "needs", "high"];
function severityAtLeast(p: string, floor: string): boolean {
  return ORDER.indexOf(p) >= ORDER.indexOf(floor);
}

describe("reviewNote", () => {
  it("every priority's note passes assertSafeLanguage and avoids verdicts", () => {
    const samples: Array<[Metrics, "clean" | "light" | "needs" | "high"]> = [
      [metrics({ totalCommits: 5 }), "clean"],
      [metrics({ preEventCommits: 25 }), "high"],
      [metrics({ postDeadlineCommits: 2 }), "needs"],
      [metrics({ preEventCommits: 3 }), "light"],
      [metrics({ totalCommits: 0 }), "needs"],
    ];
    for (const [m, p] of samples) {
      const note = reviewNote(m, p);
      expect(() => assertSafeLanguage(note)).not.toThrow();
      // no verdict language
      expect(note.toLowerCase()).not.toMatch(/\b(cheat|fraud|guilty|stole|plagiar)/);
    }
  });
  it("does not prove a violation — frames as a question", () => {
    const note = reviewNote(metrics({ preEventCommits: 25 }), "high");
    expect(note.toLowerCase()).toContain("does not prove");
  });
});

describe("assertSafeLanguage", () => {
  it("throws on each forbidden word, case-insensitively", () => {
    for (const w of FORBIDDEN_LANGUAGE) {
      expect(() => assertSafeLanguage(`This is ${w}.`)).toThrow();
      expect(() => assertSafeLanguage(`This is ${w.toUpperCase()}.`)).toThrow();
    }
  });
  it("a benign neutral note does not throw", () => {
    expect(() => assertSafeLanguage("This is a signal, not a verdict.")).not.toThrow();
  });
  // S8: substring matching over-blocks benign words that merely contain a forbidden
  // substring (e.g. "fraught" contains "fraud" → would wrongly throw). After the
  // word-boundary fix, benign words must NOT throw.
  it("S8: benign words containing a forbidden substring do not throw", () => {
    expect(() => assertSafeLanguage("The schedule was fraught with delays.")).not.toThrow();
    expect(() => assertSafeLanguage("They caughted nothing")).not.toThrow();
  });
});

describe("graceMinutes", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });
  afterEach(() => vi.unstubAllEnvs());

  it("respects a valid override", () => {
    expect(graceMinutes(15)).toBe(15);
    expect(graceMinutes(0)).toBe(0);
  });
  it("rejects a negative override, falls through to default", () => {
    expect(graceMinutes(-5)).toBe(DEFAULT_GRACE_MINUTES);
  });
  it("falls back to GITHUB_GRACE_MINUTES env", () => {
    vi.stubEnv("GITHUB_GRACE_MINUTES", "45");
    expect(graceMinutes()).toBe(45);
  });
  it("defaults to 30 with no override or env", () => {
    delete process.env.GITHUB_GRACE_MINUTES;
    expect(graceMinutes()).toBe(30);
  });
  it("falls back to default on a non-numeric env", () => {
    vi.stubEnv("GITHUB_GRACE_MINUTES", "abc");
    expect(graceMinutes()).toBe(30);
  });
  it("rejects a negative env value", () => {
    vi.stubEnv("GITHUB_GRACE_MINUTES", "-10");
    expect(graceMinutes()).toBe(30);
  });
});

describe("demoScanFor", () => {
  it("returns a neutral, clean, zero-commit placeholder with the right shape", () => {
    const scan = demoScanFor("sub-1");
    expect(scan.submission_id).toBe("sub-1");
    expect(scan.review_priority).toBe("clean");
    expect(scan.total_commits).toBe(0);
    expect(scan.pre_event_commits).toBe(0);
    expect(scan.post_deadline_commits).toBe(0);
    expect(scan.id).toBe("scan-sub-1");
    expect(() => assertSafeLanguage(scan.summary)).not.toThrow();
  });
});
