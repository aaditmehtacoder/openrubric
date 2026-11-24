import { Button } from "@/components/ui/button";
import { DemoFilm, PlayDemoLink } from "./demo-film";
import { DEMO_FILM, DEMO_FILM_NOTE, MAILTO } from "@/lib/constants";

export function LandingHero() {
  return (
    <section className="border-b border-line bg-canvas text-ink">
      <div className="container-marketing pb-12 pt-16 sm:pb-14 sm:pt-20">
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
              {/* On a phone the film's own play button is the next thing down the page. */}
              <Button asChild size="lg" variant="outline" className="hidden sm:inline-flex sm:w-auto">
                <PlayDemoLink>Watch the {DEMO_FILM.label}</PlayDemoLink>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* The product film, in place of a mock-up. */}
      <div id="demo" className="container-marketing scroll-mt-24 pb-16 sm:pb-20">
        <DemoFilm priority />
        <p className="mt-4 max-w-[78ch] text-[13px] leading-[1.6] text-faint">{DEMO_FILM_NOTE}</p>
      </div>
    </section>
  );
}
