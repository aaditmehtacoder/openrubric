"use client";

import { useEffect } from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to your observability tool of choice (Sentry, etc.) in production.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <span className="mb-8 text-ink">
        <Logo />
      </span>
      <div className="font-mono text-[12px] uppercase tracking-[0.16em] text-signal-high">
        Something went wrong
      </div>
      <h1 className="mt-3 max-w-[18ch] font-serif text-[clamp(30px,4.5vw,48px)] font-normal leading-[1.05] tracking-[-0.015em]">
        We hit an unexpected error.
      </h1>
      <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.6] text-dim">
        Your scores are safe. Try again, and if it keeps happening, reload the page.
      </p>
      {error.digest && (
        <p className="mt-3 font-mono text-[11px] text-faint">ref: {error.digest}</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" onClick={() => window.location.assign("/")}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
