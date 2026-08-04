import type { Metadata } from "next";
import { Newsreader, Geist, Geist_Mono } from "next/font/google";
import { DemoProvider } from "@/components/app/demo-store";
import { TranslateWidget } from "@/components/app/translate-widget";
import { SessionProvider } from "@/lib/session";
import "./globals.css";

// Editorial serif — landing headlines only.
const serif = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-serif",
  display: "swap",
});

// Geist — the UI typeface (modern, infrastructure-grade). Variable weight.
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Geist Mono — labels, metadata, scores, tables.
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === "production" ? "https://openrubric.vercel.app" : "http://localhost:3000")
).replace(/\/+$/, "");

const DESCRIPTION =
  "OpenRubric is managed judging infrastructure for hackathons. We import submissions, keep every judge on the same weighted rubric, surface GitHub timeline questions for organizers, and produce final rankings with a CSV backup.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "OpenRubric — Managed judging infrastructure for hackathons",
    template: "%s · OpenRubric",
  },
  description: DESCRIPTION,
  applicationName: "OpenRubric",
  keywords: [
    "hackathon judging",
    "hackathon judging software",
    "judging rubric",
    "Devpost import",
    "judging infrastructure",
    "hackathon organizers",
  ],
  authors: [{ name: "Aadit Mehta" }],
  openGraph: {
    title: "OpenRubric — Managed judging infrastructure for hackathons",
    description:
      "Judging shouldn't be the messiest part of your hackathon. OpenRubric imports submissions, keeps every judge on the same rubric, and gives organizers a clear path from final demos to verified winners.",
    url: APP_URL,
    siteName: "OpenRubric",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenRubric — Managed judging infrastructure for hackathons",
    description:
      "Import submissions, keep every judge on one weighted rubric, and go from final demos to verified winners.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      {/* suppressHydrationWarning: browser extensions (Grammarly, password managers)
          inject attributes onto <body> before hydration — harmless, but noisy. */}
      <body suppressHydrationWarning>
        <SessionProvider>
          <DemoProvider>{children}</DemoProvider>
        </SessionProvider>
        <TranslateWidget />
      </body>
    </html>
  );
}
