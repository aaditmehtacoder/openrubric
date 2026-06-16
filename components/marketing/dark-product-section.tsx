import { Eyebrow } from "@/components/ui/eyebrow";

const RUBRIC = [
  { name: "Innovation", score: 18, max: 20, pct: "90%" },
  { name: "Technical Complexity", score: 22, max: 25, pct: "88%" },
  { name: "Functionality", score: 17, max: 20, pct: "85%" },
  { name: "Design / UX", score: 13, max: 15, pct: "87%" },
  { name: "Impact", score: 9, max: 10, pct: "90%" },
  { name: "Presentation", score: 8, max: 10, pct: "80%" },
];

const POINTS = [
  "Weighted criteria with per-criterion comments",
  "Autosave every few seconds, no lost scores",
  "Organizer aggregates — judges never overwrite each other",
];

export function DarkProductSection({ id }: { id?: string }) {
  return (
    <section id={id} className="border-b border-line bg-canvas text-ink">
      <div className="container-marketing py-[104px]">
        <Eyebrow tone="accent" className="mb-5 tracking-[0.16em]">
          Live Scoring
        </Eyebrow>
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="mb-[22px] font-serif text-[clamp(30px,4vw,50px)] font-normal leading-[1.05] tracking-[-0.015em]">
              A rubric-first judging workspace.
            </h2>
            <p className="mb-[18px] max-w-[46ch] text-[16px] leading-[1.6] text-dim">
              Every score is tied to a criterion. Judges grade against the rubric you define — never
              a vague gut feeling — and each judge keeps their own record.
            </p>
            <div className="mt-6 flex flex-col gap-3.5">
              {POINTS.map((p) => (
                <div key={p} className="flex items-baseline gap-[11px]">
                  <span className="font-mono text-[13px] text-accent">—</span>
                  <span className="text-[14.5px] text-ink/85">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* dark rubric card — a product preview, fixed dark in both themes */}
          <div className="rounded-[18px] border border-line-dark bg-panel-900 p-6 text-white shadow-lift">
            <div className="mb-5 flex items-center justify-between border-b border-line-darker pb-4">
              <div>
                <div className="text-[16px] font-semibold">Lighthouse</div>
                <div className="mt-[3px] font-mono text-[11px] text-[#7A7A7A]">Rubric · 6 criteria</div>
              </div>
              <div className="text-right">
                <div className="font-serif text-[34px] leading-none">
                  87<span className="text-[20px] text-[#4A4A4A]"> / 100</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {RUBRIC.map((r) => (
                <div key={r.name}>
                  <div className="mb-[7px] flex items-center justify-between">
                    <span className="text-[14px] text-[#E4E4E4]">{r.name}</span>
                    <span className="font-mono text-[13px] text-[#9A9A9A]">
                      {r.score}
                      <span className="text-[#4A4A4A]"> / {r.max}</span>
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-[3px] bg-[#181818]">
                    <div className="h-full rounded-[3px] bg-accent" style={{ width: r.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
