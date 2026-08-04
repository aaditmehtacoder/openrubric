import { MarketingNav } from "@/components/marketing/marketing-nav";
import { LandingHero } from "@/components/marketing/landing-hero";
import { JudgingRoom } from "@/components/marketing/judging-room";
import { Differentiators } from "@/components/marketing/differentiators";
import { Partnership } from "@/components/marketing/partnership";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";
import { SITE } from "@/lib/constants";

const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === "production" ? "https://openrubric.vercel.app" : "http://localhost:3000")
).replace(/\/+$/, "");

/**
 * Structured data. Deliberately claims nothing that isn't true: no ratings, no user
 * counts, and the license is stated as proprietary to match the LICENSE file.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE.name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: APP_URL,
  description:
    "Managed judging infrastructure for hackathons. Imports submissions, keeps judges on one weighted rubric, surfaces GitHub timeline questions for organizers, and produces final rankings with a CSV backup.",
  license: `${SITE.githubUrl}/blob/main/LICENSE`,
  author: { "@type": "Person", name: "Aadit Mehta" },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "First managed partner event provided in kind. Managed events afterwards are a flat per-event fee.",
    url: `${APP_URL}/pricing`,
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, author-controlled object; no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <MarketingNav />
      <main id="main-content" tabIndex={-1}>
        <LandingHero />
        <JudgingRoom />
        <Differentiators />
        <Partnership />
        <Faq />
        <FinalCta />
      </main>
    </>
  );
}
