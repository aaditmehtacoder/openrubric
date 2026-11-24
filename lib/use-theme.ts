"use client";

import { useCallback, useEffect, useState } from "react";
import { THEME_EVENT, THEME_KEY } from "./theme-boot";

/**
 * Dashboard theme preference (light / dark), persisted to localStorage and shared
 * across every dashboard surface in the tab via a window event. While an app surface is
 * mounted, `useDocumentTheme` mirrors it onto <html> (so the page background, portals and
 * fixed widgets follow it); a boot script in the root layout does the same before first
 * paint (lib/theme-boot.ts). Leaving the app removes it, so the marketing site stays light.
 *
 * First visit falls back to the OS preference; after that the user's choice sticks.
 */

export type Theme = "light" | "dark";

const KEY = THEME_KEY;
const EVENT = THEME_EVENT;

function readTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(KEY);
  if (saved === "dark" || saved === "light") return saved;
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function useTheme() {
  // SSR-safe default; the real value is read on mount to avoid a hydration mismatch.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readTheme());
    const sync = () => setTheme(readTheme());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setThemeValue = useCallback((next: Theme) => {
    window.localStorage.setItem(KEY, next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const toggle = useCallback(() => {
    setThemeValue(readTheme() === "dark" ? "light" : "dark");
  }, [setThemeValue]);

  return { theme, toggle, setTheme: setThemeValue };
}

/**
 * Put `.dark` on <html> while this app surface is mounted, following the saved theme
 * live. Reads storage directly (not the SSR-safe "light" initial state), so it never
 * strips the class the boot script set before first paint. Removed on unmount.
 */
export function useDocumentTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => root.classList.toggle("dark", readTheme() === "dark");
    apply();
    window.addEventListener(EVENT, apply);
    window.addEventListener("storage", apply);
    return () => {
      window.removeEventListener(EVENT, apply);
      window.removeEventListener("storage", apply);
      root.classList.remove("dark");
    };
  }, []);
}
