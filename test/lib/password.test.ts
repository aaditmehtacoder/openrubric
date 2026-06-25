import { describe, it, expect } from "vitest";
import { passwordMeetsRules, PASSWORD_RULES } from "@/lib/password";

describe("passwordMeetsRules", () => {
  it("accepts a password meeting all rules", () => {
    expect(passwordMeetsRules("Strong1pass")).toBe(true);
  });
  it("rejects too short", () => {
    expect(passwordMeetsRules("Ab1")).toBe(false);
  });
  it("rejects missing uppercase", () => {
    expect(passwordMeetsRules("lowercase1")).toBe(false);
  });
  it("rejects missing lowercase", () => {
    expect(passwordMeetsRules("UPPERCASE1")).toBe(false);
  });
  it("rejects missing number", () => {
    expect(passwordMeetsRules("NoNumbersHere")).toBe(false);
  });
  it("exposes four named rules", () => {
    expect(PASSWORD_RULES.map((r) => r.id).sort()).toEqual(["len", "lower", "number", "upper"]);
  });
});
