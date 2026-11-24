/** Shared, env-overridable constants. */

export const SITE = {
  name: "OpenRubric",
  tagline: "Managed judging infrastructure for hackathons.",
  /** External GitHub repo — override with NEXT_PUBLIC_GITHUB_URL. */
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/aaditmehtacoder/openrubric",
  /**
   * Where organizers reach the team when their platform isn't Devpost (or an import
   * needs a hand). Override with NEXT_PUBLIC_SUPPORT_EMAIL.
   */
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "openrubric@gmail.com",
  /** Short licence line shown in the footer. Must match the root LICENSE file. */
  licenseLine: "Proprietary software. All rights reserved.",
} as const;

/** Builds a mailto: link with a prefilled subject (and optional body). */
export function mailto(subject: string, body?: string) {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  return `mailto:${SITE.supportEmail}?${params.toString().replace(/\+/g, "%20")}`;
}

/** Prefilled mailto links used by the marketing CTAs. */
export const MAILTO = {
  pilot: mailto(
    "Pilot hackathon inquiry",
    "Hi OpenRubric team,\n\nWe would like to run a pilot with OpenRubric.\n\nEvent name:\nEvent dates:\nExpected submissions:\nExpected judges:\nSubmission platform (Devpost, CSV, other):\n\nThanks,\n",
  ),
  partnership: mailto(
    "Judging technology partnership for our hackathon",
    "Hi OpenRubric team,\n\nWe are interested in making OpenRubric our official judging technology partner.\n\nEvent name:\nEvent dates:\nExpected submissions:\nExpected judges:\nSponsor page URL:\n\nThanks,\n",
  ),
} as const;

/**
 * The product film, shown on the home page and on /demo. One place for its files and
 * its length, so buttons and metadata cannot drift from the film that is published.
 */
export const DEMO_FILM = {
  src: "/demo/openrubric-demo.mp4",
  poster: "/demo/openrubric-demo-poster.jpg",
  seconds: 78,
  /** Running time as shown on the player. */
  length: "1:18",
  /** How links and buttons name it. */
  label: "78-second demo",
  /** The day this cut was published (schema.org uploadDate). */
  published: "2026-11-23",
} as const;

/** Shown under the film wherever it plays: what in it is real and what is not. */
export const DEMO_FILM_NOTE =
  "Filmed in OpenRubric with the public project gallery of the Acalanes Data Fest. Scores for ten of the eleven projects, and two of the three judges, are sample data.";

export const ROUTES = {
  home: "/",
  docs: "/docs",
  signIn: "/sign-in",
  signUp: "/sign-up",
  verify: "/verify",
  authCallback: "/auth/callback",
  getStarted: "/get-started",
  organize: "/organize",
  organizerImport: "/organizer/import",
  organizerDashboard: "/dashboard/organizer",
  organizerTeam: "/dashboard/organizer/team",
  organizerApprovals: "/dashboard/organizer/approvals",
  rankings: "/dashboard/organizer/rankings",
  judgeDashboard: "/dashboard/judge",
  teamDashboard: "/dashboard/team",
  teamScores: "/dashboard/team/scores",
  submit: "/submit",
  pricing: "/pricing",
  demo: "/demo",
  contact: "/contact",
  feedback: "/feedback",
  request: "/request",
  terms: "/terms",
  privacy: "/privacy",
  project: (id: string) => `/judge/project/${id}`,
} as const;

/**
 * localStorage key holding a not-yet-created signup ({email, fullName, role,
 * password, invite}) between submitting the form and verifying the email. Lets the
 * email "Continue" magic link finish the deferred signup in the same browser.
 */
export const PENDING_SIGNUP_KEY = "openrubric-pending-signup";
