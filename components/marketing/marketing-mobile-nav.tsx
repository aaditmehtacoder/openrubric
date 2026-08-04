"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

/**
 * Small-screen disclosure for the marketing nav. Renders a plain, in-flow panel
 * (no portal, no scroll lock) so it can never trap focus or shift layout above it.
 */
export function MarketingMobileNav({ links }: { links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onPointer(e: PointerEvent) {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="marketing-mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-control border border-line text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 lg:hidden"
      >
        {open ? (
          <X className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
        ) : (
          <Menu className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          id="marketing-mobile-menu"
          className="absolute inset-x-0 top-full border-b border-line bg-background shadow-lift lg:hidden"
        >
          <ul className="container-marketing flex flex-col py-2">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-control px-2 py-3 text-[15px] text-ink transition-colors hover:bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
