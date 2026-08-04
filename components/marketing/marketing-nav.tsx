import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { MarketingAuthButtons } from "./marketing-auth-buttons";
import { MarketingMobileNav } from "./marketing-mobile-nav";
import { ROUTES } from "@/lib/constants";

export const NAV_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Product", href: "/#product" },
  { label: "Partner events", href: "/#partners" },
  { label: "Pricing", href: ROUTES.pricing },
  { label: "Docs", href: ROUTES.docs },
  { label: "Demo", href: ROUTES.video },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur-[14px]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-ink focus:px-4 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-canvas"
      >
        Skip to content
      </a>

      {/* Status strip. Honest about the stage of the product, without alarming organizers. */}
      <div className="border-b border-line-soft bg-raised">
        <p className="container-marketing flex items-center justify-center gap-2.5 py-2 text-center font-mono text-[11.5px] tracking-[0.02em] text-dim">
          <span
            className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-signal-clean-dot"
            aria-hidden="true"
          />
          Now onboarding pilot hackathons.{" "}
          <Link
            href={ROUTES.contact}
            className="rounded-sm underline underline-offset-[3px] transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            Talk to us
          </Link>
        </p>
      </div>

      <nav aria-label="Main" className="container-marketing flex items-center justify-between py-4">
        <Link
          href={ROUTES.home}
          className="rounded-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
        >
          <Logo />
          <span className="sr-only">OpenRubric home</span>
        </Link>

        <ul className="hidden items-center gap-7 text-sm text-dim lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="rounded-sm transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <MarketingAuthButtons />
          <MarketingMobileNav links={NAV_LINKS} />
        </div>
      </nav>
    </header>
  );
}
