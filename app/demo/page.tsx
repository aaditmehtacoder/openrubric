import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { FinalCta } from "@/components/marketing/final-cta";
import { DemoFilm, type DemoChapter } from "@/components/marketing/demo-film";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DEMO_FILM, DEMO_FILM_NOTE, ROUTES } from "@/lib/constants";

const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === "production" ? "https://openrubric.vercel.app" : "http://localhost:3000")
).replace(/\/+$/, "");

const TITLE = `OpenRubric in ${DEMO_FILM.seconds} seconds`;
const DESCRIPTION = `Both sides of a hackathon in ${DEMO_FILM.seconds} seconds. An organizer sets up the event and imports its Devpost projects, a judge reads and scores one, and the rankings come out with a CSV.`;

export const metadata: Metadata = {
  title: "Demo",
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.demo },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: ROUTES.demo,
    siteName: "OpenRubric",
    type: "video.other",
    locale: "en_US",
    // Absolute on purpose: unlike images, video addresses are not resolved for us.
    videos: [{ url: `${APP_URL}${DEMO_FILM.src}`, width: 1920, height: 1080, type: "video/mp4" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/** Scene starts, from the film's own clock. Also the film's text alternative. */
const CHAPTERS: DemoChapter[] = [
  { at: 9.5, role: "Organizer", title: "Set up the event", body: "Logo, name, and website." },
  {
    at: 15,
    role: "Organizer",
    title: "Import from Devpost",
    body: "Paste the link. Eleven projects arrive with summaries.",
  },
  {
    at: 23.5,
    role: "Organizer",
    title: "Rubric and judges",
    body: "Eight criteria, 100 points. Then invite the panel.",
  },
  { at: 29.5, role: "Judge", title: "Find a project", body: "One link and a search box. No training." },
  {
    at: 34,
    role: "Judge",
    title: "Read it",
    body: "Summary, write-up, and questions to ask on one page.",
  },
  {
    at: 40.5,
    role: "Judge",
    title: "Check the repo",
    body: "The commit timeline against the event window.",
  },
  { at: 45, role: "Judge", title: "Score it", body: "Eight sliders. Saved as you go." },
  { at: 52.5, role: "Judge", title: "Leave a note", body: "The whole panel sees it live." },
  {
    at: 56,
    role: "Organizer",
    title: "Watch scores arrive",
    body: "The dashboard fills in as judges finish.",
  },
  {
    at: 61.5,
    role: "Organizer",
    title: "Rankings and export",
    body: "A leaderboard and a CSV of everything.",
  },
];

/** Tells search engines this page is a video. Every value describes the real file. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: TITLE,
  description: DESCRIPTION,
  thumbnailUrl: [`${APP_URL}${DEMO_FILM.poster}`],
  contentUrl: `${APP_URL}${DEMO_FILM.src}`,
  uploadDate: `${DEMO_FILM.published}T12:00:00-08:00`,
  duration: `PT${Math.floor(DEMO_FILM.seconds / 60)}M${DEMO_FILM.seconds % 60}S`,
};

export default function DemoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, author-controlled object; no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <MarketingNav />
      <main id="main-content" tabIndex={-1} className="bg-canvas">
        <div className="container-marketing max-w-[1080px] pb-16 pt-10 sm:pb-20 sm:pt-12">
          <div className="mb-7 max-w-[62ch]">
            <Eyebrow className="mb-3">Demo</Eyebrow>
            <h1 className="mb-3 font-serif text-[clamp(30px,3.8vw,44px)] font-normal leading-[1.05] tracking-[-0.015em]">
              OpenRubric in {DEMO_FILM.seconds} seconds.
            </h1>
            <p className="text-[15.5px] leading-[1.6] text-dim">
              Both sides of a hackathon. An organizer sets up the event and reads the results. A
              judge finds a project, reads it, and scores it.
            </p>
          </div>

          <DemoFilm chapters={CHAPTERS} priority />

          <p className="mt-5 max-w-[78ch] text-[13px] leading-[1.6] text-faint">
            {DEMO_FILM_NOTE} Not playing?{" "}
            <a
              href={DEMO_FILM.src}
              className="rounded-sm text-accent underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              Open the video file
            </a>
            .
          </p>
        </div>
        <FinalCta secondary="pricing" />
      </main>
    </>
  );
}
