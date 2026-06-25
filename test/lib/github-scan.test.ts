import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { scanRepository, fetchReadme, isGithubConfigured, assertSafeLanguage } from "@/lib/github";

/**
 * Deterministic scanRepository tests: mock the GitHub REST API and compare the code's
 * derived metrics against a hand computation, plus verify the S5 pagination fix.
 */

function ghResponse(body: unknown, ok = true) {
  return {
    ok,
    status: ok ? 200 : 404,
    headers: { get: () => null },
    json: async () => body,
    text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
  } as unknown as Response;
}

function commit(dateIso: string) {
  return { commit: { committer: { date: dateIso }, author: { date: dateIso } }, author: { login: "alice" } };
}

// Event window: start 2026-06-01, deadline 2026-06-03 (UTC). grace 0 to make the
// hand count exact.
const eventStart = "2026-06-01T00:00:00Z";
const submissionDeadline = "2026-06-03T00:00:00Z";

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("GITHUB_TOKEN", "test-token");
});
afterEach(() => vi.unstubAllEnvs());

describe("scanRepository (mocked GitHub API)", () => {
  it("derives pre/post-event counts and priority matching a hand computation", async () => {
    // 2 before start, 3 in window, 1 after deadline = 6 total.
    const commits = [
      commit("2026-05-20T00:00:00Z"),
      commit("2026-05-25T00:00:00Z"),
      commit("2026-06-01T06:00:00Z"),
      commit("2026-06-02T06:00:00Z"),
      commit("2026-06-02T20:00:00Z"),
      commit("2026-06-04T00:00:00Z"),
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL) => {
        const u = String(url);
        if (u.includes("/commits?")) return ghResponse(u.includes("page=1") ? commits : []);
        if (u.endsWith("/repos/o/r")) return ghResponse({ created_at: "2026-05-15T00:00:00Z" });
        if (u.includes("/contributors")) return ghResponse([{ login: "alice" }]);
        if (u.includes("/languages")) return ghResponse({ TypeScript: 100 });
        throw new Error(`unexpected ${u}`);
      }),
    );

    const scan = await scanRepository({
      submissionId: "sub-1",
      repoUrl: "o/r",
      eventStart,
      submissionDeadline,
      graceMinutes: 0,
    });

    // Hand-computed truth:
    expect(scan.total_commits).toBe(6);
    expect(scan.pre_event_commits).toBe(2);
    expect(scan.post_deadline_commits).toBe(1);
    // post-deadline > 0 → at least "needs"; pre-event (2) is <= 20 → light; worst = needs
    expect(scan.review_priority).toBe("needs");
    expect(() => assertSafeLanguage(scan.summary)).not.toThrow();
  });

  it("S5: paginates beyond 100 commits and labels the capped count", async () => {
    // 5 full pages of 100 (all pre-event) → MAX_COMMIT_PAGES reached, capped.
    const page = Array.from({ length: 100 }, () => commit("2026-05-01T00:00:00Z"));
    const fetchMock = vi.fn(async (url: string | URL) => {
      const u = String(url);
      if (u.includes("/commits?")) return ghResponse(page); // every page returns 100 → capped
      if (u.endsWith("/repos/o/r")) return ghResponse({ created_at: "2026-04-01T00:00:00Z" });
      if (u.includes("/contributors")) return ghResponse([]);
      if (u.includes("/languages")) return ghResponse({});
      throw new Error(`unexpected ${u}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const scan = await scanRepository({
      submissionId: "sub-2",
      repoUrl: "o/r",
      eventStart,
      submissionDeadline,
      graceMinutes: 0,
    });

    // 5 pages × 100 — far past the old 100-commit ceiling.
    expect(scan.total_commits).toBe(500);
    expect(scan.pre_event_commits).toBe(500);
    expect(scan.review_priority).toBe("high"); // > 20 pre-event
    expect(scan.summary).toMatch(/most recent 500 commits/i);
    const commitPageCalls = fetchMock.mock.calls.filter((c) => String(c[0]).includes("/commits?"));
    expect(commitPageCalls.length).toBe(5);
  });

  it("open-ended window (null start/deadline) + invalid timezone falls back cleanly", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL) => {
        const u = String(url);
        if (u.includes("/commits?")) return ghResponse([commit("2020-01-01T00:00:00Z")]);
        if (u.endsWith("/repos/o/r")) return ghResponse({ created_at: "2019-01-01T00:00:00Z" });
        if (u.includes("/contributors")) return ghResponse([]);
        if (u.includes("/languages")) return ghResponse({});
        throw new Error(`unexpected ${u}`);
      }),
    );
    const scan = await scanRepository({
      submissionId: "sub-tz",
      repoUrl: "o/r",
      eventStart: null,
      submissionDeadline: null,
      timezone: "Not/ARealZone", // exercises the fmtInZone UTC fallback
    });
    // no window bounds → nothing flagged early/late
    expect(scan.pre_event_commits).toBe(0);
    expect(scan.post_deadline_commits).toBe(0);
    expect(scan.review_priority).toBe("clean");
  });

  it("falls back to a demo scan when the repo URL can't be parsed", async () => {
    const scan = await scanRepository({
      submissionId: "sub-3",
      repoUrl: "not a url",
      eventStart: null,
      submissionDeadline: null,
    });
    expect(scan.total_commits).toBe(0);
    expect(scan.review_priority).toBe("clean");
  });

  it("falls back to a demo scan when the GitHub API errors (never blocks judging)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ghResponse("nope", false)));
    const scan = await scanRepository({
      submissionId: "sub-4",
      repoUrl: "o/r",
      eventStart,
      submissionDeadline,
    });
    expect(scan.review_priority).toBe("clean");
    expect(scan.total_commits).toBe(0);
  });

  it("flags an unlisted contributor and a placeholder repo, no-commit timeline branch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL) => {
        const u = String(url);
        if (u.includes("/commits?")) return ghResponse([]); // empty history
        if (u.endsWith("/repos/o/r")) return ghResponse({ created_at: "2026-04-01T00:00:00Z" });
        if (u.includes("/contributors")) return ghResponse([{ login: "stranger" }]);
        if (u.includes("/languages")) return ghResponse({ Python: 50, HTML: 50 });
        throw new Error(`unexpected ${u}`);
      }),
    );
    const scan = await scanRepository({
      submissionId: "sub-5",
      repoUrl: "o/r",
      eventStart,
      submissionDeadline,
      listedHandles: ["alice"], // "stranger" is unlisted
      graceMinutes: 0,
    });
    expect(scan.contributors_json.some((c) => c.login === "stranger" && !c.listed)).toBe(true);
    expect(scan.total_commits).toBe(0);
    expect(scan.review_priority).toBe("needs"); // empty history + unlisted
    expect(scan.languages_json?.length).toBe(2);
  });

  it("returns a demo scan when no token is configured (no network)", async () => {
    delete process.env.GITHUB_TOKEN;
    const scan = await scanRepository({ submissionId: "s", repoUrl: "o/r", eventStart: null, submissionDeadline: null });
    expect(scan.total_commits).toBe(0);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("fetchReadme", () => {
  it("returns null with no token", async () => {
    delete process.env.GITHUB_TOKEN;
    expect(await fetchReadme("o/r")).toBeNull();
  });
  it("returns trimmed README text when present", async () => {
    vi.stubEnv("GITHUB_TOKEN", "t");
    vi.stubGlobal("fetch", vi.fn(async () => ghResponse("# Hello\n\nworld")));
    const md = await fetchReadme("o/r");
    expect(md).toContain("Hello");
  });
  it("returns null on a non-OK response", async () => {
    vi.stubEnv("GITHUB_TOKEN", "t");
    vi.stubGlobal("fetch", vi.fn(async () => ghResponse("x", false)));
    expect(await fetchReadme("o/r")).toBeNull();
  });
  it("returns null when the fetch throws (never blocks)", async () => {
    vi.stubEnv("GITHUB_TOKEN", "t");
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("network down");
    }));
    expect(await fetchReadme("o/r")).toBeNull();
  });
  it("returns null for an empty README body", async () => {
    vi.stubEnv("GITHUB_TOKEN", "t");
    vi.stubGlobal("fetch", vi.fn(async () => ghResponse("   ")));
    expect(await fetchReadme("o/r")).toBeNull();
  });
  it("isGithubConfigured reflects the token", () => {
    vi.stubEnv("GITHUB_TOKEN", "t");
    expect(isGithubConfigured()).toBe(true);
    delete process.env.GITHUB_TOKEN;
    expect(isGithubConfigured()).toBe(false);
  });
});
