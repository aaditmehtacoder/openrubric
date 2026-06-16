# Handoff: OpenRubric — Open-source hackathon judging platform

## Overview
OpenRubric is a nonprofit, open-source hackathon **judging workspace**. Organizers import submissions
(Devpost / CSV / manual), paste a rubric, invite judges, let judges score projects live against shared
criteria, review GitHub commit timelines for *review signals*, and publish track + overall winners with
clear evidence. The product positioning is deliberate: **OpenRubric is not a cheating detector and not an
"AI judge."** It surfaces evidence for **human** organizers to review. The final decision is always human.

Tagline: *Open judging infrastructure for fairer hackathons.*

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show the intended
look, copy, and behavior. They are **not production code to copy directly.** The task is to **recreate
these designs in the target codebase's environment.** The intended stack (from the product brief) is:

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS + shadcn/ui**
- **Supabase** (auth, Postgres, realtime presence)
- **React Hook Form + Zod**, **Recharts**, **Framer Motion** (subtle polish only)
- **Lucide** icons (use very few), **GitHub API** integration, **Devpost public import + CSV fallback**

If you are dropping this into an existing codebase, follow that codebase's established patterns instead.
Recreate the UI faithfully (this is high-fidelity) using the codebase's component primitives.

The prototypes are built as self-contained HTML. The two `.dc.html` files are the editable source; the two
`.html` files are fully-inlined standalone builds (open them directly in any browser, no server needed).

## Fidelity
**High-fidelity.** Final colors, typography, spacing, radii, copy, and interactions are all specified below
and present in the files. Recreate pixel-faithfully, swapping in the codebase's own component library.

---

## Design Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| `bg.offwhite` | `#F7F5F0` | Primary light canvas (editorial body, app) |
| `bg.card` | `#FBFAF6` | Slightly raised panels / inputs on light |
| `surface.white` | `#FFFFFF` | Cards, tables, modals |
| `bg.black` | `#070707` | Hero, dark product panels, footer |
| `surface.dark` | `#0B0B0B` / `#0D0D0D` | Cards inside dark sections |
| `ink` | `#0A0A0A` | Primary text on light; primary buttons |
| `white` | `#FAFAFA` | Primary text on dark |
| `muted.light` | `#737373` | Secondary text on light |
| `muted.faint` | `#A8A29A` | Tertiary / mono metadata on light |
| `muted.dark` | `#A8A8A8` / `#8A8A8A` | Secondary text on dark |
| `border.light` | `#E5E1D8` | Borders/dividers on light (`#F0EDE5`, `#F4F1EA` for inner rows) |
| `border.dark` | `#1D1D1D` | Borders on dark (`#161616` for inner) |
| `accent` | `#2F6BFF` | Selected states, links, highlights, progress, focus rings. Used sparingly. |
| `success` | `#2E8A5E` (text) / `#4FB286` (dot, on dark) | "Clean timeline" |
| `warning` | `#A8791F` (text) / `#C99A3A` (dot) | "Light review" / "Needs review" |
| `danger` | `#B4453C` (text) / `#C0584E` (dot) | "High priority" — muted, never aggressive |

Status badge fills are the text color at low alpha, e.g. success bg `rgba(46,138,94,0.07)`, border `rgba(46,138,94,0.28)`.

### Typography
- **Display serif** — `Newsreader` (weights 300–500). Landing headlines only. `line-height: 1.02–1.06`, `letter-spacing: -0.015em`.
- **UI sans** — `Hanken Grotesk` (400/500/600/700). All body + every heading inside the app.
- **Mono** — `JetBrains Mono` (400/500/600). Eyebrow labels, tags, metadata, table headers, CLI, scores.

Type scale in use: hero `clamp(40px,5.4vw,74px)` · section H2 `clamp(30px,4vw,50px)` · app page title `24–30px/600` ·
card title `16–19px/600` · body `13.5–17px` · mono eyebrow `10–12px`, `letter-spacing 0.12–0.16em`, `text-transform:uppercase`.

### Radius & spacing
- Radii: major panels `18–22px`, cards `12–14px`, buttons/inputs `9–11px`, pills/badges `20px`, small chips `5–8px`.
- Borders: hairline `1px` everywhere. No heavy outlines.
- Containers: marketing max-width `1200px`; app content `1080–1180px`; wizard `780px`. Generous section padding `96–120px` vertical on marketing.
- Section shadow (dark product panel): `0 40px 120px -40px rgba(0,0,0,0.9)`.

### Logo
Abstract bracket mark `[ ]` (two square brackets) with a small accent square between them, beside the
"OpenRubric" wordmark. No gavel, scales, or judge iconography. SVG paths are in every file's nav.

### Icon policy
Minimal. Search glass, arrows (`→ ↗ ←`), em-dash bullets. Avoid icon walls. Status is communicated with
colored dots + mono text, not icons.

---

## Screens / Views

### 1. Landing page  (`OpenRubric.dc.html`)
- **Purpose**: Marketing site. Convert organizers; let judges enter a demo.
- **Layout**: Single scroll. Sticky black header (announcement bar + nav). Alternating sections:
  black hero → off-white editorial → black product panel → off-white → black CTA/footer.
- **Sections, in order**:
  1. **Announcement bar** (black, mono): "Open-source judging infrastructure for hackathons →"
  2. **Nav**: bracket logo + wordmark · center: Product / Docs / GitHub / Demo · right: "Sign in" + white "Organize a hackathon" button. Sticky, `rgba(7,7,7,0.82)` + `backdrop-filter: blur(14px)`.
  3. **Hero**: mono eyebrow "OPEN SOURCE JUDGING"; serif H1 "Judge hackathons with a rubric everyone can trust."; subhead; two CTAs (white "Organize a hackathon", outlined "Try judge demo →").
  4. **Product panel** (the centerpiece): dark rounded panel with a browser bar (`openrubric.org`), a search field with a blinking accent caret, and a workspace grid — selected project *Lighthouse* + "Clean timeline" badge, AI Summary card, Rubric Score card with accent progress bars + "87 / 100", Track ranking mini-table, GitHub Timeline mini. Faint `34px` grid lines behind (`linear-gradient` `#121212`).
  5. **"Built for real judging rooms"** — 3 bordered cells (Import submissions / Score with a shared rubric / Publish winners by track), mono `01/02/03`.
  6. **"From Devpost to final rankings"** — 6-step horizontal workflow strip.
  7. **"A rubric-first judging workspace"** (black) — copy + dark rubric card showing the 6 criteria with accent bars and a serif `87 / 100`.
  8. **"Review signals, not accusations"** — copy + accent left-border callout ("OpenRubric never makes the final call. It gives organizers evidence to review.") + a list of 5 signal types with status pills.
  9. **"Open-source by design"** — 4 cells (Transparent scoring / Self-hostable / Exportable data / Human final decisions).
  10. **Final CTA** (black, centered serif) + **footer** (logo, "MIT licensed · Self-hostable · Nonprofit", links).
- **Interactions**: smooth-scroll anchor nav; button hover `translateY(-1px)`; nav link hover → white; CTAs link to the app (`OpenRubric App.html`). Blinking caret = `@keyframes blink 1.1s step-end infinite`.

### 2. Auth  (`OpenRubric App.html`, screen `auth`)
- **Purpose**: Sign in / pick a demo role.
- **Layout**: Centered `420px` card on off-white. Logo above. Card: H1 "Sign in to your hackathon", email + password inputs (mono uppercase labels, focus → accent border + white bg), black "Continue" button, "DEMO LOGIN" divider, three demo buttons (**Demo Organizer / Demo Judge / Demo Participant**) each with a mono hint. "Create an account" / "Back to site" footer.
- **Behavior**: Demo Organizer → organizer dashboard (role=organizer). Demo Judge / Continue → judge dashboard (role=judge). Sign-up roles are **Organizer / Judge / Participant**.

### 3. Judge Dashboard  (`OpenRubric App.html`, screen `judgeDash`)
- **Purpose**: Search-first project list. "Do not make judges think."
- **Layout**: Left sidebar (236px, role-aware) + main column. Header: mono "JUDGING · PRIYA SHAH", H1 "Projects to judge", subtext with remaining count. Big search field (focus-within → accent). Filter pills: **All / Not scored / Scored / Needs review** (active = black). Responsive card grid (`minmax(330px,1fr)`).
- **Project card**: name + timeline badge (top-right), mono "Team · Track", status row (dot + "Not scored / In progress / Finalized") with score if complete, full-width action button ("Grade" black, "Review score" / "Continue grading" outlined).
- **Behavior**: typing filters live across name/team/track/participants; filter pills narrow the set; empty state shows "No projects match …"; card button → grading workspace.

### 4. Judge Grading Workspace  (`OpenRubric App.html`, screen `grading`) — the core screen
- **Purpose**: Score one project against the rubric.
- **Layout**: Sticky top bar (back button, project name/track, autosave indicator, live `NN / 100`, black "Submit final score") + **3 columns**: `280px | 1fr | 320px`.
  - **Left — identity**: project name, team, accent track chip, description, participants, link buttons (Devpost / GitHub / Live demo / Video).
  - **Center — workspace**: segmented tabs **Rubric / Presentation / Comments**; always-visible **AI Quick Summary** card (What it does / Who it helps / How it works / Tech stack chips / Strongest part / Worth asking about) and **Suggested questions** card.
    - *Rubric tab*: card listing the 6 criteria — each row: name + description, big current value `/ max`, a **range slider** (0…max), mono helper text. Header shows live total.
    - *Presentation tab*: 5 rows (Clarity / Demo quality / Technical explanation / Answers / Team confidence) each a 1–5 dot selector (accent when filled).
    - *Comments tab*: autosaving textarea (private to the judge).
  - **Right — evidence**: presence ("Alex & Maya also viewing", overlapping avatars), autosave chip, **GitHub timeline** card (events on a connector rail + timeline badge), **Review signals** card (✓/! rows + a framed note ending "This is a signal, not a verdict."), organizer note.
- **Behavior**: moving any slider updates the live total **and** flips autosave to "Saving…" (pulsing) then "All changes saved" after ~850ms. Tabs switch instantly. Each judge keeps their own score record — judges never overwrite each other; the organizer aggregates.

### 5. Organizer Dashboard  (`OpenRubric App.html`, screen `organizerDash`)
- **Purpose**: Executive overview. Kept intentionally simple.
- **Layout**: sidebar + header ("Edit setup" outlined, "View rankings" black). 4 metric cells (**Submissions / Judges active / Scores completed / Needs review** — last in danger red). Judging-progress bar. Then `1.65fr | 1fr`:
  - **Submissions table** (div grid, not an HTML `<table>`): columns Project (+team) / Track / Judges (n/n) / Avg / Timeline badge / Status badge. Rows hover + clickable → grading.
  - **Right rail**: Track leaders list, accent-bordered "Overall winner · suggested" card (Lighthouse), Review queue (open count + clickable cases).

### 6. Rankings  (`OpenRubric App.html`, screen `rankings`)
- **Purpose**: Final standings + winner guidance.
- **Layout**: header + "Export CSV ↓". Two callouts: accent **"Suggested overall winner" (Lighthouse)** and danger **"Hold before award" (CodePilot — top score, but a high-priority review is unresolved)**. Overall leaderboard (rank / project+team / track / avg / judges / timeline; #1 row tinted with a "Suggested winner" or "Review first" pill). Track winners — 4 cards.
- **Winner logic**: rank by average judge score; track winners separate from overall; **a project with an unresolved high-priority review cannot be marked winner** — show "Top score, but review required before award."

### 7. Organizer Setup Wizard  (`OpenRubric App.html`, screen `organizerSetup`)
- **Purpose**: 5-step setup. Clickable stepper; completed steps get a ✓.
- **Steps**:
  1. **Hackathon** — name, website URL, Devpost URL, start time, submission deadline, judging deadline.
  2. **Import** — Devpost hackathon URL (accent, with Import), Paste project URLs, Upload CSV, Add manually. Includes the Devpost-limitation note (public metadata only, never bypass auth; graceful fallback copy).
  3. **Rubric** — paste box + "Generate criteria" + editable criteria list (name + points). Default rubric below.
  4. **Tracks** — removable track chips + "Add track". Defaults below.
  5. **Judges** — table (name / email / tracks / scope) + "Invite a judge".
  - Footer: "← Back" + black "Continue" / "Finish & open dashboard" (last step → organizer dashboard).

---

## Interactions & Behavior (summary)
- **Routing**: single-page router via a `screen` state value (`auth · judgeDash · grading · organizerDash · rankings · organizerSetup`). A "View as" Organizer/Judge switcher in the sidebar swaps persona.
- **Live scoring**: slider `onInput` → update that criterion → recompute total → debounced autosave state machine (`saving` → `saved`, 850ms).
- **Search**: case-insensitive substring over name/team/track/participants, combined with the active filter pill.
- **Hover**: buttons `translateY(-1px)`; cards `translateY(-2px)` + border → ink; table rows tint `#FBFAF6`.
- **Animations** (keep subtle): caret blink; autosave dot pulse (`@keyframes pulse .8s`). No flashy motion.
- **Responsive**: desktop-first. On mobile collapse to single column; keep search prominent; sticky bottom "Submit final score" on the grading page.

## State Management
Per-screen state needed: `currentUser/role`, `activeHackathon`, `submissions[]`, `tracks[]`,
`rubricCriteria[]`, **per-judge** `scores[submissionId][criterionId]`, `presentationScores`,
`comments`, `autosaveStatus`, `reviewCases[]`, `githubScans[]`, `aiSummaries[]`, plus wizard `setupStep`.
Scores are keyed by `(submission, judge, criterion)` so judges are isolated; organizer aggregates to averages.
Use Supabase realtime presence for the "also viewing" indicator.

## Suggested data model (from the brief)
Tables: `profiles`, `hackathons`, `tracks`, `submissions`, `participants`, `rubric_criteria`,
`judge_assignments`, `judge_scores`, `presentation_scores`, `judge_comments`, `github_scans`,
`ai_summaries`, `review_cases`. (See the product brief for full columns.)

API routes: `POST /api/hackathons`, `GET /api/hackathons/[id]`, `POST /api/import/devpost`,
`POST /api/import/csv`, `POST /api/submissions`, `GET /api/submissions/search`,
`GET /api/submissions/[id]`, `POST /api/scores/autosave`, `POST /api/scores/submit`,
`GET /api/rankings/[hackathonId]`, `POST /api/github/scan`, `GET /api/github/scan/[submissionId]`,
`POST /api/ai/summary`, `POST /api/review-cases/[id]/resolve`.

## GitHub timeline review — IMPORTANT language rules
Scan repo creation/first/last commit, pre-event & post-deadline commits, contributors, large single commits,
README/metadata referencing other projects, masked secrets. Map to review priority
(Clean → Light → Needs review → High priority). **Never auto-deduct points. Never accuse.** Always frame as a
question for the organizer, e.g. *"GitHub timeline shows N commits before the hackathon start. This does not
prove a rule violation, but judges may want to ask which parts were built during the event."*

**Allowed language**: "review signal", "timeline concern", "needs organizer review", "clean timeline",
"pre-event commits detected", "post-deadline activity detected", "this is a signal, not a verdict".
**Forbidden language**: cheater, fraud, guilty, stolen, plagiarized, caught.

## Default rubric (100 pts)
Innovation 20 · Technical Complexity 25 · Functionality 20 · Design / UX 15 · Impact 10 · Presentation 10.

## Default tracks
Overall · Beginner · Advanced · AI · Health · Education · Social Impact · Developer Tools · Sponsor Prize.

## Demo data (used in the prototype)
Hackathon **Bay Area AI Hacks 2026**. Projects: **Lighthouse** (Health AI, clean, finalized 87),
**MediScan** (Health AI, post-deadline → needs review), **StudyForge** (Education, light review, in progress),
**CampusLoop** (Social Impact, clean), **CodePilot** (Developer Tools, 38 pre-event commits → high priority).
Judges: Priya Shah, Alex Chen, Maya Patel.

## Assets
- **Fonts**: Google Fonts — Newsreader, Hanken Grotesk, JetBrains Mono. (Inlined in the standalone `.html`.)
- **Logo**: inline SVG bracket mark (in every file). No raster assets, no external images.
- **Icons**: a handful of inline SVGs (search, brackets) + text arrows. Replace with Lucide equivalents.

## Files in this bundle
| File | What it is |
|---|---|
| `OpenRubric.html` | Standalone, fully-inlined **landing page** — open directly in a browser. |
| `OpenRubric App.html` | Standalone, fully-inlined **app** (auth → judge → grading → organizer → rankings → setup). |
| `OpenRubric.dc.html` | Editable source for the landing page. |
| `OpenRubric App.dc.html` | Editable source for the app. |

> Note: the two standalone files link to each other (landing ⇄ app). Keep them in the same folder.

## Ethical disclaimer (include in the product + repo README)
**OpenRubric does not determine cheating or automatically penalize teams. It surfaces evidence for human
organizers to review.** Self-hostable. Transparent. Exportable. Human final decisions.
