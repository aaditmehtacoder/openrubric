import { Eyebrow } from "@/components/ui/eyebrow";

const STEPS = [
  {
    title: "We configure your rubric and import submissions.",
    body: "Send us your rubric and your Devpost URL or CSV. We set up criteria, weights, tracks, and every project before judging opens.",
  },
  {
    title: "Judges receive a simple scoring workspace.",
    body: "Each judge gets one link, a search box, and the rubric. Scores autosave, and no judge can overwrite another judge's record.",
  },
  {
    title: "Organizers monitor progress and review timeline signals.",
    body: "You see which judges have finished, which projects still need scores, and any GitHub timeline questions worth asking a team.",
  },
  {
    title: "OpenRubric calculates rankings and exports a complete backup.",
    body: "Weighted totals per track and overall, plus a CSV of submissions, scores, and rankings you keep after the event.",
  },
];

export function JudgingRoom() {
  return (
    <section id="how-it-works" className="border-b border-line bg-canvas scroll-mt-24">
      <div className="container-marketing py-20 sm:py-24">
        <Eyebrow className="mb-4">How it works</Eyebrow>
        <h2 className="mb-4 max-w-[26ch] font-serif text-[clamp(28px,3.6vw,46px)] font-normal leading-[1.06] tracking-[-0.015em]">
          Your judging room, handled
        </h2>
        <p className="mb-12 max-w-[56ch] text-[15.5px] leading-[1.6] text-dim">
          Pilot events are set up by us. You bring the rubric and the submissions link, we do the
          configuration and stay on call while judging runs.
        </p>

        <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-line bg-line md:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={s.title} className="bg-surface p-7">
              <div className="mb-4 font-mono text-[11px] text-faint">Step {i + 1}</div>
              <h3 className="mb-2.5 max-w-[30ch] text-[16.5px] font-semibold leading-[1.35] tracking-[-0.01em]">
                {s.title}
              </h3>
              <p className="max-w-[46ch] text-[14px] leading-[1.6] text-dim">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
