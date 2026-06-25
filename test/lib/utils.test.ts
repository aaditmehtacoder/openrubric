import { describe, it, expect } from "vitest";
import { cn, initials, prettyUrl, clamp, colorForId } from "@/lib/utils";

describe("cn", () => {
  it("merges and dedupes conflicting tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", false && "hidden", "font-bold")).toBe("text-sm font-bold");
  });
});

describe("initials", () => {
  it("takes the first letter of the first two words, uppercased", () => {
    expect(initials("Dana Okafor")).toBe("DO");
    expect(initials("madonna")).toBe("M");
    expect(initials("Jean  Luc  Picard")).toBe("JL");
  });
  it("handles empty input", () => {
    expect(initials("")).toBe("");
  });
});

describe("prettyUrl", () => {
  it("strips protocol and trailing slash", () => {
    expect(prettyUrl("https://example.com/")).toBe("example.com");
    expect(prettyUrl("http://x.io/path")).toBe("x.io/path");
  });
});

describe("clamp", () => {
  it("clamps into [min,max]", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});

describe("colorForId", () => {
  it("is deterministic and returns a palette hex", () => {
    const a = colorForId("judge-1");
    expect(a).toBe(colorForId("judge-1"));
    expect(a).toMatch(/^#[0-9A-F]{6}$/i);
  });
});
