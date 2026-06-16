import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <Link href={ROUTES.home} className="mb-8 text-ink">
        <Logo />
      </Link>
      <div className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">Error 404</div>
      <h1 className="mt-3 max-w-[16ch] font-serif text-[clamp(32px,5vw,52px)] font-normal leading-[1.05] tracking-[-0.015em]">
        This page isn&apos;t on the rubric.
      </h1>
      <p className="mt-4 max-w-[44ch] text-[15px] leading-[1.6] text-dim">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href={ROUTES.home}>Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.docs}>Read the docs</Link>
        </Button>
      </div>
    </div>
  );
}
