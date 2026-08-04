import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { FinalCta } from "@/components/marketing/final-cta";
import { HackathonRequestForm } from "@/components/marketing/hackathon-request-form";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal, SplitWords } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Bring OpenRubric to your hackathon",
  description:
    "Tell us about your event and we will set up your rubric, import your submissions, and support judging while it runs.",
};

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ hackathon?: string }>;
}) {
  const { hackathon } = await searchParams;
  const eventName = (hackathon ?? "").slice(0, 140).trim();

  return (
    <>
      <MarketingNav />
      <main id="main-content" tabIndex={-1} className="bg-canvas text-ink">
        <div className="container-marketing max-w-[780px] pb-20 pt-16">
          <Reveal y={10}>
            <Eyebrow className="mb-4">Bring OpenRubric to your event</Eyebrow>
          </Reveal>
          <h1 className="mb-4 max-w-[18ch] font-serif text-[clamp(32px,4.4vw,52px)] font-normal leading-[1.06] tracking-[-0.015em]">
            <SplitWords
              text={eventName ? `Let's judge *${eventName}.*` : "Let's judge *your hackathon.*"}
            />
          </h1>
          <Reveal delay={0.15} y={14}>
            <p className="mb-10 max-w-[54ch] text-[16px] leading-[1.62] text-dim">
              We drafted the message below. Fill in the brackets, change whatever you like, and send
              it. It goes straight to the people who run OpenRubric.
            </p>
          </Reveal>
          <Reveal delay={0.2} y={18}>
            <HackathonRequestForm initialHackathon={eventName} />
          </Reveal>
        </div>
        <FinalCta />
      </main>
    </>
  );
}
