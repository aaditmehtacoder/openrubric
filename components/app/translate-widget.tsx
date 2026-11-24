"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Google Translate web widget, a lightweight, free way to translate the whole site into
 * any language. Client-only: the GT script is injected once after mount, and the dropdown
 * renders into #google_translate_element. Kept isolated so it doesn't fight React hydration
 * (the container is hydration-suppressed; GT mutates its DOM after load).
 *
 * Note: this is the drop-in web widget (cosmetic GT banner may appear). A full i18n setup
 * (next-intl) remains a future option for higher-quality, SEO-friendly translations.
 *
 * It rests as one small button and opens the language list on request, so it does not
 * sit over the page (or over the demo film's controls) for visitors who never need it.
 */
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement: new (opts: unknown, el: string) => void } };
  }
}

export function TranslateWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element",
        );
      }
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div data-translate-widget className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2">
      {/* Google fills this in after load. Hidden, not unmounted, so its list survives. */}
      <div
        id="google_translate_element"
        suppressHydrationWarning
        className={cn(
          "rounded-[9px] border border-line bg-surface/95 px-2 py-1 shadow-card backdrop-blur",
          !open && "hidden",
        )}
        // role="group" so the accessible name below is permitted (aria-label is
        // prohibited on a plain generic container).
        role="group"
        aria-label="Languages"
      />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="google_translate_element"
        aria-label="Translate this site"
        title="Translate this site"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface/95 text-dim shadow-card backdrop-blur transition-colors hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <Languages className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
      </button>
    </div>
  );
}
