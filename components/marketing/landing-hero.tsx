import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductPreviewPanel } from "./product-preview-panel";
import { ROUTES, MAILTO } from "@/lib/constants";

const FACTS = [
  "Devpost or CSV import",
  "One weighted rubric",
  "GitHub timeline review",
  "CSV export after every round",
];

export function LandingHero() {
  return (
    <section className="border-b border-line bg-canvas text-ink">
      <div className="container-marketing pb-12 pt-16 sm:pt-20">
        <div className="grid items-end gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <h1 className="max-w-[16ch] font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1.04] tracking-[-0.015em]">
            Judging shouldn&rsquo;t be the messiest part of your hackathon.
          </h1>
          <div className="lg:pb-2">
            <p className="mb-7 max-w-[46ch] text-[17px] leading-[1.55] text-dim">
              OpenRubric imports submissions, keeps every judge on the same rubric, and gives
              organizers a clear path from final demos to verified winners.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href={MAILTO.pilot}>Run a pilot</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href={ROUTES.video}>Watch the 2-minute demo</Link>
              </Button>
            </div>
          </div>
        </div>

        <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5 font-mono text-[12px] text-faint">
          {FACTS.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      {/* Compact interactive product preview. */}
      <div className="container-marketing pb-20">
        <ProductPreviewPanel />
      </div>
    </section>
  );
}
