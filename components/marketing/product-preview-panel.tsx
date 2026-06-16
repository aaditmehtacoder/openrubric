import { Search } from "lucide-react";

/**
 * The hero "infrastructure UI" panel — a realistic OpenRubric workspace, not a fake
 * dashboard. Dark rounded panel: browser bar → search with blinking caret → selected
 * project (Lighthouse) + AI summary + rubric score, with track ranking and a GitHub
 * timeline mini on the right.
 */

const RUBRIC_BARS = [
  { name: "Innovation", score: "18/20", pct: "90%" },
  { name: "Technical", score: "22/25", pct: "88%" },
  { name: "Functionality", score: "17/20", pct: "85%" },
  { name: "Design / UX", score: "13/15", pct: "87%" },
];

const TRACK_RANK = [
  { rank: "01", name: "Lighthouse", score: "87", active: true },
  { rank: "02", name: "MediScan", score: "83", active: false },
  { rank: "03", name: "CampusLoop", score: "79", active: false },
  { rank: "04", name: "StudyForge", score: "76", active: false },
];

const TIMELINE = [
  { label: "Repo created", meta: "Feb 14 · 9:12 AM · within window" },
  { label: "First commit", meta: "Feb 14 · 10:40 AM · 3 contributors" },
  { label: "Last commit", meta: "Feb 16 · 5:55 PM · before deadline" },
];

export function ProductPreviewPanel() {
  return (
    <div className="overflow-hidden rounded-panel border border-line-dark bg-panel-900 shadow-panel">
      {/* browser bar */}
      <div className="flex items-center gap-2 border-b border-line-darker bg-panel-700 px-[18px] py-3">
        <span className="h-[11px] w-[11px] rounded-full bg-[#2A2A2A]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#2A2A2A]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#2A2A2A]" />
        <div className="flex flex-1 justify-center">
          <div className="rounded-md border border-[#1A1A1A] bg-[#080808] px-4 py-[5px] font-mono text-[12px] text-[#6B6B6B]">
            openrubric.org
          </div>
        </div>
        <span className="font-mono text-[11px] text-[#4A4A4A]">demo</span>
      </div>

      {/* panel body */}
      <div className="relative p-[22px]">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(#121212 1px,transparent 1px),linear-gradient(90deg,#121212 1px,transparent 1px)",
            backgroundSize: "34px 34px",
          }}
          aria-hidden
        />

        {/* search */}
        <div className="relative mb-[18px] flex items-center gap-2.5 rounded-[11px] border border-line-dark bg-panel px-4 py-3">
          <Search className="h-[15px] w-[15px] text-dim" strokeWidth={1.6} />
          <span className="font-mono text-[13.5px] text-[#9A9A9A]">Search project, team, or participant…</span>
          <span className="inline-block h-4 w-[1.5px] animate-blink bg-accent" />
          <span className="flex-1" />
          <span className="rounded-[5px] border border-line-dark px-[7px] py-[2px] font-mono text-[11px] text-dim">
            ⌘K
          </span>
        </div>

        <div className="relative grid grid-cols-1 gap-4 md:grid-cols-[1.5fr_1fr]">
          {/* left column */}
          <div className="flex flex-col gap-3.5">
            {/* selected project */}
            <div className="rounded-[13px] border border-line-dark bg-panel-800 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[18px] font-semibold tracking-[-0.01em] text-white">Lighthouse</div>
                  <div className="mt-1 font-mono text-[11.5px] text-[#7A7A7A]">Team Beacon · Health AI</div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(79,178,134,0.22)] bg-[rgba(79,178,134,0.08)] px-[11px] py-[5px] font-mono text-[11px] text-signal-clean-dot">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal-clean-dot" />
                  Clean timeline
                </div>
              </div>
            </div>

            {/* AI summary */}
            <div className="rounded-[13px] border border-line-dark bg-panel-800 p-4">
              <div className="mb-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">
                AI Summary
              </div>
              <p className="text-[13.5px] leading-relaxed text-[#C4C4C4]">
                A triage assistant for rural clinics that routes patient intake photos to the right
                specialist. Built on a fine-tuned vision model with an offline-first PWA front end.
              </p>
              <div className="mt-3 flex flex-wrap gap-[7px]">
                {["Next.js", "PyTorch", "Supabase"].map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-line-dark px-[9px] py-[3px] font-mono text-[11px] text-[#9A9A9A]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* rubric score */}
            <div className="rounded-[13px] border border-line-dark bg-panel-800 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#7A7A7A]">
                  Rubric Score
                </div>
                <div className="text-[15px] font-semibold">
                  <span className="text-white">87</span>
                  <span className="text-dim"> / 100</span>
                </div>
              </div>
              <div className="flex flex-col gap-[9px]">
                {RUBRIC_BARS.map((row) => (
                  <div key={row.name} className="flex items-center gap-[11px]">
                    <span className="w-24 flex-shrink-0 text-[12.5px] text-[#B4B4B4]">{row.name}</span>
                    <div className="h-[5px] flex-1 overflow-hidden rounded-[3px] bg-[#181818]">
                      <div className="h-full rounded-[3px] bg-accent" style={{ width: row.pct }} />
                    </div>
                    <span className="w-11 text-right font-mono text-[11.5px] text-[#8A8A8A]">{row.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* right column */}
          <div className="flex flex-col gap-3.5">
            {/* track rank */}
            <div className="rounded-[13px] border border-line-dark bg-panel-800 p-4">
              <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#7A7A7A]">
                Track · Health AI
              </div>
              <div className="flex flex-col gap-0.5">
                {TRACK_RANK.map((t) => (
                  <div
                    key={t.rank}
                    className="flex items-center gap-[11px] rounded-lg px-[9px] py-2"
                    style={{ background: t.active ? "rgba(37,99,235,0.10)" : "transparent" }}
                  >
                    <span
                      className="w-[18px] font-mono text-[12px]"
                      style={{ color: t.active ? "#2563EB" : "#6A6A6A" }}
                    >
                      {t.rank}
                    </span>
                    <span
                      className="flex-1 text-[13px]"
                      style={{ color: t.active ? "#fff" : "#C4C4C4", fontWeight: t.active ? 600 : 400 }}
                    >
                      {t.name}
                    </span>
                    <span className="font-mono text-[12px] text-[#8A8A8A]">{t.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* timeline mini */}
            <div className="flex-1 rounded-[13px] border border-line-dark bg-panel-800 p-4">
              <div className="mb-3.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#7A7A7A]">
                GitHub Timeline
              </div>
              <div className="flex flex-col">
                {TIMELINE.map((ev) => (
                  <div key={ev.label} className="flex gap-[11px]">
                    <div className="flex flex-col items-center">
                      <span className="mt-[3px] h-2 w-2 rounded-full bg-signal-clean-dot" />
                      <span className="w-px flex-1 bg-line-dark" />
                    </div>
                    <div className="pb-3.5">
                      <div className="text-[12.5px] text-[#C4C4C4]">{ev.label}</div>
                      <div className="mt-0.5 font-mono text-[10.5px] text-[#6A6A6A]">{ev.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-0.5 inline-flex items-center gap-1.5 font-mono text-[11px] text-signal-clean-dot">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-clean-dot" />
                All commits within event window
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
