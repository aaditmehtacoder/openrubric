/**
 * Phase 6 functional check — REAL GitHub API.
 *
 * Skipped by default. Run explicitly:
 *   RUN_LIVE_GITHUB=1 npx vitest run e2e/live-github.e2e.ts --config e2e/vitest.e2e.config.ts
 *
 * Loads GITHUB_TOKEN from .env.local, scans the OpenRubric repo against a chosen event
 * window via the production lib, then independently re-counts commits straight from the
 * GitHub REST API and asserts the code's numbers match the hand computation. Responses
 * are cached to e2e/.cache so re-runs are reproducible and don't re-hit the API.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, mkdirSync, existsSync, writeFileSync } from "node:fs";
import path from "node:path";

const RUN = process.env.RUN_LIVE_GITHUB === "1";
const CACHE = path.join(process.cwd(), "e2e", ".cache");

function loadEnvLocal() {
  try {
    const raw = readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local */
  }
}

async function cachedJson(key: string, url: string, token: string) {
  mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, `${key}.json`);
  if (existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${url}`);
  const body = await res.json();
  writeFileSync(file, JSON.stringify(body, null, 2));
  return body;
}

describe.skipIf(!RUN)("LIVE: scanRepository vs hand-computed truth", () => {
  beforeAll(loadEnvLocal);

  it("matches an independent commit count for aaditmehtacoder/openrubric", async () => {
    const token = process.env.GITHUB_TOKEN!;
    expect(token, "GITHUB_TOKEN must be set in .env.local").toBeTruthy();

    const { scanRepository } = await import("@/lib/github");

    // Open-ended window → no early/late flags; total_commits reflects the real history
    // (capped at MAX_COMMIT_PAGES × 100).
    const scan = await scanRepository({
      submissionId: "live-1",
      repoUrl: "aaditmehtacoder/openrubric",
      eventStart: null,
      submissionDeadline: null,
    });

    // Independent count: page through the same endpoint by hand (cap 5 pages = 500).
    let handCount = 0;
    for (let page = 1; page <= 5; page++) {
      const batch = (await cachedJson(
        `commits-p${page}`,
        `https://api.github.com/repos/aaditmehtacoder/openrubric/commits?per_page=100&page=${page}`,
        token,
      )) as unknown[];
      handCount += batch.length;
      if (batch.length < 100) break;
    }

    expect(scan.total_commits).toBe(handCount);
    expect(scan.repo_owner).toBe("aaditmehtacoder");
    expect(scan.repo_name).toBe("openrubric");
  });

  it("S2 live: a www. URL resolves to the same owner/repo", async () => {
    const { parseRepoUrl } = await import("@/lib/github");
    expect(parseRepoUrl("https://www.github.com/aaditmehtacoder/openrubric")).toEqual({
      owner: "aaditmehtacoder",
      repo: "openrubric",
    });
  });
});
