import { describe, expect, it } from "vitest";
import { THEME_BOOT_SCRIPT } from "@/lib/theme-boot";

/** Run the <head> boot script against a fake page; returns whether <html> got `.dark`. */
function boot(path: string, saved: string | null, osDark = false): boolean {
  const classes = new Set<string>();
  const document = { documentElement: { classList: { add: (c: string) => classes.add(c) } } };
  const matchMedia = () => ({ matches: osDark });
  const window = { matchMedia };
  const localStorage = { getItem: () => saved };
  const location = { pathname: path };
  new Function("location", "localStorage", "document", "window", "matchMedia", THEME_BOOT_SCRIPT)(
    location,
    localStorage,
    document,
    window,
    matchMedia,
  );
  return classes.has("dark");
}

describe("THEME_BOOT_SCRIPT (no-flash dark mode)", () => {
  it("applies a saved dark theme on app routes before React loads", () => {
    expect(boot("/dashboard/judge", "dark")).toBe(true);
    expect(boot("/judge/project/abc", "dark")).toBe(true);
    expect(boot("/dashboard/organizer/rankings", "dark")).toBe(true);
    expect(boot("/organizer/import", "dark")).toBe(true);
  });

  it("leaves the marketing and auth pages light", () => {
    expect(boot("/", "dark")).toBe(false);
    expect(boot("/pricing", "dark")).toBe(false);
    expect(boot("/sign-in", "dark")).toBe(false);
    expect(boot("/dashboard/team", "dark")).toBe(false);
  });

  it("respects a saved light choice even when the OS is dark", () => {
    expect(boot("/dashboard/judge", "light", true)).toBe(false);
  });

  it("falls back to the OS preference on first visit", () => {
    expect(boot("/dashboard/judge", null, true)).toBe(true);
    expect(boot("/dashboard/judge", null, false)).toBe(false);
  });
});
