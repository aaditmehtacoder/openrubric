import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ROUTES, SITE, MAILTO } from "@/lib/constants";

const FOOTER_LINKS = [
  { label: "Pricing", href: ROUTES.pricing },
  { label: "Docs", href: ROUTES.docs },
  { label: "Demo", href: ROUTES.video },
  { label: "Request judging", href: ROUTES.request },
  { label: "Contact", href: ROUTES.contact },
  { label: "Terms", href: ROUTES.terms },
  { label: "Privacy", href: ROUTES.privacy },
];

export function FinalCta() {
  return (
    <>
      <section className="border-t border-line bg-canvas text-ink">
        <div className="container-marketing py-20 text-center sm:py-24">
          <h2 className="mx-auto mb-4 max-w-[20ch] font-serif text-[clamp(28px,3.8vw,48px)] font-normal leading-[1.06] tracking-[-0.015em]">
            Let&rsquo;s get your judging room ready.
          </h2>
          <p className="mx-auto mb-8 max-w-[52ch] text-[15.5px] leading-[1.6] text-dim">
            Tell us your event dates, your rubric, and how many submissions you expect. We will tell
            you honestly whether OpenRubric is a fit.
          </p>
          <div className="mx-auto flex max-w-[420px] flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={MAILTO.pilot}>Run a pilot</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href={ROUTES.video}>Watch the 2-minute demo</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-canvas">
        <div className="container-marketing flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <Link
            href={ROUTES.home}
            className="rounded-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <Logo />
            <span className="sr-only">OpenRubric home</span>
          </Link>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-dim">
              {FOOTER_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="rounded-sm transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={SITE.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-sm transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-line-soft">
          <p className="container-marketing py-5 font-mono text-[11.5px] leading-[1.6] text-faint">
            © {new Date().getFullYear()} Aadit Mehta. {SITE.licenseLine} See the{" "}
            <a
              href={`${SITE.githubUrl}/blob/main/LICENSE`}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm underline underline-offset-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              LICENSE
            </a>{" "}
            for the terms that apply to running it.
          </p>
        </div>
      </footer>
    </>
  );
}
