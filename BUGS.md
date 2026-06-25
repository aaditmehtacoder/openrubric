# OpenRubric — Bug Ledger

Validation run against the project guide (`OPENRUBRIC.md`), `README.md`, and the in-code
doc comments as the behavioral oracle. Every bug below has a regression test that fails
before the fix and passes after.

## Summary table

| ID  | Severity | Component                              | One-line summary                                            | Status |
|-----|----------|----------------------------------------|-------------------------------------------------------------|--------|
| B01 | Blocker  | app/api/scores/autosave, lib/validators | Scores not clamped to criterion `max_points` (inflates totals) | Fixed  |
| B02 | High     | lib/github `parseRepoUrl`              | Breaks on `www.` prefix, query strings, and non-GitHub hosts | Fixed  |
| B03 | Medium   | lib/validators, app/api/hackathons     | Deadlines accepted out of chronological order               | Fixed  |
| B04 | Medium   | lib/github `scanRepository`            | Commit fetch not paginated → undercounts on repos >100 commits | Fixed  |
| B05 | Medium   | app/api/cron/poll-devpost              | Not fail-closed in production when `CRON_SECRET` is unset    | Fixed  |
| B06 | Low      | lib/github `assertSafeLanguage`        | Substring match over-blocks benign words ("fraught")        | Fixed  |
| B07 | Low      | docs (README, OPENRUBRIC.md)           | "Weighted rubric" claim vs unweighted summation math (S4)   | Fixed  |
| B08 | Low      | docs + LICENSE                         | Docs claimed MIT/open-source/free, inconsistent with license | Fixed  |
| S3  | Low      | lib/scoring `isComplete`               | A genuine score of `0` blocks finalization (by design)      | Documented (accepted) |

No open **Blocker** or **High** bugs remain.

---

## Detailed entries

### B01 — Scores not clamped to criterion `max_points`  (suspect S1)
- **Severity:** Blocker (corrupts results — breaks an invariant of fair aggregation)
- **Component / files:** `app/api/scores/autosave/route.ts`, `lib/validators.ts`
- **Expected (oracle):** a judge's score for a criterion is bounded by that criterion's `max_points`; `totalScore` can never exceed `rubricMax`.
- **Actual:** `scoreAutosaveSchema` used `z.number().min(0)` with no upper bound and the route persisted the raw value. A score of e.g. `95` (or `9999`) on a 20-point criterion was stored unclamped, silently inflating `totalScore` and the rankings.
- **Repro:** `POST /api/scores/autosave` with `scores: { <criterionId>: 95 }` for a criterion whose `max_points` is 20; read back → 95 persisted.
- **Root cause:** no per-criterion bound anywhere on the write path.
- **Fix:** the route now fetches the submission's rubric `max_points` and clamps each score to `[0, max]` before upsert; `scoreAutosaveSchema` adds a coarse `.max(100)` bound (no criterion can exceed 100 `max_points`) as defense-in-depth.
- **Re-test:** `test/routes/scores-autosave.test.ts` (clamp 95→20, in-range kept, schema rejects >100), `test/lib/validators.test.ts`. Judge isolation re-verified in the same suite.

### B02 — `parseRepoUrl` breaks on `www.`, query strings, and non-GitHub hosts  (suspect S2)
- **Severity:** High (wrong result on a common input → wrong/blank scan)
- **Component / file:** `lib/github.ts`
- **Expected:** `https://www.github.com/o/r`, `https://github.com/o/r?tab=readme`, trailing slashes, `.git`, and extra path segments all resolve to `{owner:"o", repo:"r"}`; a non-GitHub URL returns `null`.
- **Actual:** `https://www.github.com/o/r` parsed to `owner:"www.github.com"`; query strings leaked into the repo name (`repo:"r?tab=readme"`); a non-GitHub URL produced a bogus owner.
- **Root cause:** the regex chain only stripped `github.com/`, never `www.`, and never the query/fragment; no host validation.
- **Fix:** strip `www.`, strip `?…`/`#…`, then reject a leading host-looking segment (one containing a dot) as a non-GitHub URL.
- **Re-test:** `test/lib/github.test.ts` (full URL matrix) + live confirmation in `e2e/live-github.e2e.ts`.

### B03 — Deadlines accepted out of order  (suspect S6)
- **Severity:** Medium
- **Component / files:** `lib/validators.ts` (`hackathonSchema`), `app/api/hackathons/route.ts`
- **Expected:** `start_time < submission_deadline < judging_deadline`.
- **Actual:** both the form schema and the API's own `createSchema` accepted any ordering (e.g. judging before start).
- **Fix:** `hackathonSchema` gains a `superRefine` enforcing ordering; the API route adds an `assertDateOrder` check (applied only when all three timestamps parse, so "required" errors still fire first).
- **Re-test:** `test/lib/validators.test.ts`, `test/routes/hackathons.test.ts`.

### B04 — Commit history not paginated  (suspect S5)
- **Severity:** Medium
- **Component / file:** `lib/github.ts` (`scanRepository`)
- **Expected:** pre/post-event commit counts reflect the real history (or are honestly labeled when capped).
- **Actual:** `commits?per_page=100` with no pagination → at most 100 commits seen, undercounting on larger repos and potentially mis-deriving priority.
- **Fix:** new `ghCommits` paginates up to `MAX_COMMIT_PAGES` (5 → 500 commits). When the cap is reached the summary is labeled "(Based on the most recent N commits.)" so the metric is honest rather than silently wrong.
- **Re-test:** `test/lib/github-scan.test.ts` (5-page pagination, capped label) + live count match in `e2e/live-github.e2e.ts`.

### B05 — Cron not fail-closed in production  (suspect S7)
- **Severity:** Medium (resource-abuse exposure: an open trigger runs scraping + AI work)
- **Component / file:** `app/api/cron/poll-devpost/route.ts`
- **Expected:** the cron endpoint requires authorization in production.
- **Actual:** auth was checked only when `CRON_SECRET` was set; with the secret unset in production the endpoint was open to anyone.
- **Fix:** in `NODE_ENV === "production"` a missing `CRON_SECRET` now returns `503` (fail-closed). Dev/demo stays open for testing.
- **Re-test:** `test/routes/cron-poll-devpost.test.ts` (503 when prod+unset, 401 wrong token, 200 correct token).

### B06 — `assertSafeLanguage` substring over-block  (suspect S8)
- **Severity:** Low (no user-influenced text currently reaches it — only machine-generated `reviewNote`)
- **Component / file:** `lib/github.ts`
- **Expected:** standalone forbidden words throw; benign words that merely contain a forbidden substring do not.
- **Actual:** `includes()` matched substrings, so e.g. "fraught" / "caughted" would wrongly throw.
- **Fix:** word-boundary regex match. The guard still throws on any standalone forbidden word (invariant preserved).
- **Re-test:** `test/lib/github.test.ts`.

### B07 — "Weighted rubric" docs vs unweighted math  (suspect S4)
- **Severity:** Low (documentation correctness)
- **Component:** `README.md`, `OPENRUBRIC.md`
- **Expected:** docs match code. `rubricMax`/`totalScore` are plain sums of `max_points`; the `weight` column on `rubric_criteria` is never applied.
- **Fix (chose docs over code, lower risk):** docs now say "points-based rubric" and "unweighted sum"; the guide notes the `weight` column is reserved for future weighting and not applied today. Code unchanged.

### B08 — License inconsistency in docs
- **Severity:** Low
- **Component:** `LICENSE`, `README.md`, `OPENRUBRIC.md`, `package.json`
- **Change:** `LICENSE` replaced with a proprietary "Evaluation & Hackathon-Use" license (run/evaluate for a hackathon allowed; copying, redistribution, modification, and competing use prohibited). All MIT / "open-source" / "free to modify" claims in the docs and `package.json` were updated to match.

---

## Investigated and intentionally NOT changed

### S3 — `isComplete` treats a genuine `0` as unscored
- **Finding (confirmed real):** `isComplete` returns `true` only when *every* criterion is `> 0`, so a judge who legitimately scores a `0` on any criterion can never reach `finalized` (`test/lib/scoring.test.ts` documents this).
- **Decision:** left as-is. The doc comment explicitly states "finished only when every criterion has a non-zero score," so code matches the stated contract. Distinguishing "unscored" from "scored 0" would require a presence map threaded through the autosave route, the grading store, and the hydration path — a behavior change broad enough to risk the judge-isolation and finalization invariants.
- **Recommended future fix:** track a per-criterion "touched" set (presence) separate from the numeric value, and base `isComplete` on presence. Captured here so the limitation is not lost.

### Secret-safety note (not a bug)
- The client bundle (`.next/static`) contains the string `openrubric@gmail.com`. This is the **public** `SITE.supportEmail` constant, not an env leak; `process.env.GMAIL_USER` is read only inside `server-only` `lib/mailer.ts`. All sensitive secrets (service-role key, GitHub token, AI key, SMTP app password, `EMAIL_TOKEN_SECRET`, Apify token) have **0** occurrences in the client bundle.

### Environment note (not a bug)
- `.nvmrc`/`package.json` pin Node 22.x; the validation ran on Node v24. All gates (build/lint/typecheck/test) pass on v24, but production should run the pinned 22.x.
