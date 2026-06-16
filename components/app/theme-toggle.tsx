"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Light/dark toggle. The actual class is set pre-paint by an inline script in
 * app/layout.tsx (no flash); this just reflects + flips it and persists the choice.
 * Default is light.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("openrubric-theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-control border border-line text-dim transition-colors hover:border-ink hover:text-ink",
        className,
      )}
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      {mounted && dark ? <Sun className="h-[17px] w-[17px]" strokeWidth={1.8} /> : <Moon className="h-[17px] w-[17px]" strokeWidth={1.8} />}
    </button>
  );
}
