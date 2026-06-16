<div align="center">

<img src="public/icon.svg" width="56" height="56" alt="OpenRubric" />

# OpenRubric

**Open judging infrastructure for fairer hackathons.**

A nonprofit, open-source hackathon judging system — import Devpost submissions, paste a
rubric, invite judges, score projects live, review GitHub commit timelines, and publish
track winners transparently.

[Demo](#-quickstart) · [Docs](/docs) · [Self-hosting](#-self-hosting) · [Ethics](#-ethical-use)

</div>

---

## What OpenRubric is

OpenRubric gives hackathon organizers a rubric-first judging workspace:

- **Import** submissions from a public Devpost URL, a CSV, or by hand.
- **Score** every project against a shared, weighted rubric — each judge keeps an
  independent record, and the organizer aggregates.
- **Review** each repo's GitHub timeline for *signals* (pre-event commits, post-deadline
  activity, unlisted contributors) framed as questions, never accusations.
- **Publish** per-track and overall winners, with review cases resolved first.

It is **not** a cheating detector and **not** an "AI judge." Every score is a human
judgment and every award is made by a person.

> **OpenRubric does not determine cheating or automatically penalize teams. It surfaces
> evidence for human organizers to review.**

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + React + TypeScript |
| Styling | Tailwind CSS + a small shadcn-style component set |
| Data / auth | Supabase (Postgres + Auth + Realtime) — ready, optional |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Motion | Framer Motion (subtle polish only) |
| Icons | Lucide (used sparingly) |
| Integrations | GitHub REST API · OpenAI-compatible AI provider · Devpost/CSV import |

Typography: **Newsreader** (editorial serif headlines) · **Geist** (UI) · **Geist Mono**
(labels, metadata, scores). Light + dark themes with a no-flash toggle. The design system
lives in `tailwind.config.ts` and `app/globals.css` (≈14 CSS variables drive both themes);
the full spec is preserved in `design-reference/HANDOFF.md`.

## 🚀 Quickstart

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. **No environment variables are required** — the app runs in
fully working **demo mode** with realistic data (the "Bay Area AI Hacks 2026" hackathon,
five projects spanning every timeline/score state, and three judges).

Try these routes:

| Route | What it is |
|---|---|
| `/` | Landing page |
| `/docs` | Documentation |
| `/sign-in`, `/sign-up` | Auth (with one-click demo logins) |
| `/organize` | 5-step organizer setup wizard |
| `/organizer/import` | Devpost / CSV / manual import |
| `/dashboard/organizer` | Organizer dashboard |
| `/dashboard/organizer/rankings` | Final rankings + winner guidance |
| `/dashboard/judge` | Search-first judge dashboard |
| `/judge/project/lighthouse` | The judge grading workspace |
| `/submit`, `/dashboard/team` | Participant flow |

## 🔧 Self-hosting

Copy the env template and fill in only what you need:

```bash
cp .env.example .env.local
```

Every variable is optional; each unlocks one capability:

| Variable | Enables |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth, database, realtime |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side imports & aggregation (never exposed to the browser) |
| `GITHUB_TOKEN` | Live GitHub timeline scans |
| `OPENAI_API_KEY` / `OPENAI_BASE_URL` / `AI_MODEL` | AI project summaries |
| `NEXT_PUBLIC_APP_URL` | Correct absolute URLs / OG metadata |

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql). It creates every
   table, the `judge_scores` uniqueness constraint that keeps judges isolated, starter
   Row Level Security policies, and an `auth.users → profiles` trigger so each sign-up
   gets a profile with its role.
3. (Optional) run [`supabase/seed.sql`](supabase/seed.sql) to load the demo hackathon so
   there's real data to judge immediately. It's idempotent.
4. Put the project URL + publishable (anon) key in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
   ```
   The app detects them automatically: `middleware.ts` keeps the session fresh, and the
   sign-in/sign-up forms use real Supabase Auth (the auth card shows "● Connected to
   Supabase"). With email confirmation on (the default), new sign-ups get a confirmation
   email before they can sign in — toggle it under Auth → Providers if you want instant
   access for a live event.

### Scaling to ~250 participants

The marketing site, docs, and auth are static/edge-rendered and scale to thousands on any
CDN (Vercel, Netlify). Live judging concurrency lives in Supabase, which comfortably
handles a 250-person event when configured correctly:

- **Use the pooled connection.** Point server-side data access at Supabase's connection
  pooler (Supavisor, port `6543`, transaction mode) rather than the direct Postgres port —
  this is what prevents connection exhaustion when hundreds of judges submit scores at once.
- **Indexes + RLS are already in `schema.sql`** — every foreign key is indexed and judges
  can only read/write their own `judge_scores`, so the hot path (one judge scoring) is a
  single indexed upsert.
- **Realtime presence** ("also viewing") uses one channel per submission; Supabase Realtime
  handles this load fine, but cap presence payloads to names only (already the case).
- **Rate limiting** on the GitHub/AI/import routes ([`lib/rate-limit.ts`](lib/rate-limit.ts))
  protects external APIs from bursts. For multi-instance deploys, swap its in-memory Map for
  Upstash Redis / Vercel KV (same interface).
- **Free tier** is fine for a single event; for headroom during 250 concurrent users, the
  Supabase Pro plan raises connection and Realtime limits. Deploy the app on Vercel and the
  static/SSG pages are served from the edge automatically.

### GitHub token setup

Create a **read-only** [Personal Access Token](https://github.com/settings/tokens) — no
scopes are needed for public repositories — and set `GITHUB_TOKEN`. `POST /api/github/scan`
then derives review signals from real commit history. Without a token, scans return
realistic demo timelines.

### AI provider setup

The summary endpoint speaks the OpenAI `/chat/completions` format, so it works with OpenAI,
Azure OpenAI, Together, Groq, or a local Ollama. Set `OPENAI_API_KEY`, optionally override
`OPENAI_BASE_URL`, and pick a model via `AI_MODEL`.

## 📥 Devpost import limitations

Devpost does **not** expose a stable public judging API. OpenRubric imports only **public
project metadata** and **never bypasses authentication or scrapes private data**. If an
automatic import fails, the UI falls back gracefully:

> "Couldn't import automatically. Upload CSV or paste project links manually."

CSV columns: `project_name, team_name, participant_names, repo_url, devpost_url, demo_url,
live_url, track, description`.

## 🧭 GitHub review — language policy

Timeline observations are always framed as a question for a human, mapped to a priority:
`clean → light → needs review → high priority`. OpenRubric **never auto-deducts points** and
**never accuses**. Example wording:

> "GitHub timeline shows 9 commits before the hackathon start. This does not prove a rule
> violation, but judges may want to ask which parts were built during the event."

A project with an unresolved **high-priority** review case cannot be marked a winner until an
organizer resolves it. (Enforced in `lib/scoring.ts`; accusatory language is blocked in
`lib/github.ts`.)

## 📡 API

All routes work in demo mode and upgrade to live data when Supabase is configured:

```
POST /api/hackathons            GET  /api/hackathons/[id]
POST /api/import/devpost        POST /api/import/csv
POST /api/submissions           GET  /api/submissions/search
GET  /api/submissions/[id]      POST /api/scores/autosave
POST /api/scores/submit         GET  /api/rankings/[hackathonId]
POST /api/github/scan           GET  /api/github/scan/[submissionId]
POST /api/ai/summary            POST /api/review-cases/[id]/resolve
```

## 🗂 Project structure

```
app/                 # App Router routes (marketing, auth, organizer, judge, api)
components/
  marketing/         # Landing-page sections
  app/               # Shell, sidebar, auth, demo store
  organizer/         # Dashboard, wizard, import
  judge/             # Search dashboard + cards
  grading/           # The judge grading workspace
  rankings/          # Leaderboards + chart + export
  ui/                # Reusable primitives (button, badge, logo, …)
lib/                 # demo-data, scoring, github, ai, supabase, validators, types
supabase/schema.sql  # Postgres schema + RLS
design-reference/    # Original HTML prototypes + the full design handoff
```

## Scripts

```bash
npm run dev        # start the dev server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## ⚖️ Ethical use

OpenRubric is built to make judging **more transparent and fairer**, not to automate
accusations. Review signals are evidence, not verdicts — the closing line on every signal
is, literally, "this is a signal, not a verdict."

> **OpenRubric does not determine cheating or automatically penalize teams. It surfaces
> evidence for human organizers to review.** Self-hostable. Transparent. Exportable.
> Human final decisions.

## License

MIT — free to use, self-host, and modify. Built as nonprofit, open-source infrastructure
for the hackathon community.
