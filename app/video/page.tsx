import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { FinalCta } from "@/components/marketing/final-cta";
import { DemoVideo } from "@/components/marketing/demo-video";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "Watch the 2-minute OpenRubric demo: importing submissions, scoring against one weighted rubric, reviewing GitHub timelines, and exporting final rankings.",
};

export default function VideoPage() {
  return (
    <>
      <MarketingNav />
      <main id="main-content" tabIndex={-1} className="bg-canvas">
        <DemoVideo
          eyebrow="Watch"
          heading="The 2-minute OpenRubric demo."
          sub="The full flow: importing submissions, scoring against one weighted rubric, reviewing GitHub timelines, and exporting final rankings."
        />
        <FinalCta />
      </main>
    </>
  );
}
