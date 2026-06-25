import { describe, it, expect, vi, afterEach } from "vitest";
import {
  createVerificationToken,
  verifyToken,
  createEmailCode,
  verifyEmailCode,
} from "@/lib/tokens";

afterEach(() => vi.useRealTimers());

describe("verification token", () => {
  it("round-trips a valid token and lowercases the email", () => {
    const token = createVerificationToken("User@Example.com");
    const res = verifyToken(token);
    expect(res.valid).toBe(true);
    if (res.valid) expect(res.email).toBe("user@example.com");
  });
  it("rejects a malformed token", () => {
    expect(verifyToken("garbage")).toEqual({ valid: false, reason: "malformed" });
    expect(verifyToken("")).toEqual({ valid: false, reason: "malformed" });
  });
  it("rejects a tampered signature", () => {
    const token = createVerificationToken("a@b.com");
    const [payload] = token.split(".");
    const res = verifyToken(`${payload}.deadbeef`);
    expect(res.valid).toBe(false);
    if (!res.valid) expect(res.reason).toBe("bad-signature");
  });
  it("rejects a tampered payload", () => {
    const token = createVerificationToken("a@b.com");
    const sig = token.split(".")[1];
    const forged = Buffer.from(JSON.stringify({ e: "evil@x.com", p: "email-verify", x: Date.now() + 10000 })).toString("base64url");
    const res = verifyToken(`${forged}.${sig}`);
    expect(res.valid).toBe(false);
  });
  it("rejects an expired token", () => {
    const token = createVerificationToken("a@b.com", 1000);
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 2000);
    const res = verifyToken(token);
    expect(res.valid).toBe(false);
    if (!res.valid) expect(res.reason).toBe("expired");
  });
});

describe("email code", () => {
  it("round-trips the right code", () => {
    const { code, token } = createEmailCode("a@b.com");
    expect(code).toMatch(/^\d{6}$/);
    const res = verifyEmailCode(token, code);
    expect(res.valid).toBe(true);
    if (res.valid) expect(res.email).toBe("a@b.com");
  });
  it("normalizes formatted input (spaces/dashes stripped)", () => {
    const { code, token } = createEmailCode("a@b.com");
    const spaced = code.split("").join(" ");
    expect(verifyEmailCode(token, spaced).valid).toBe(true);
  });
  it("rejects a wrong code", () => {
    const { code, token } = createEmailCode("a@b.com");
    const wrong = code === "000000" ? "111111" : "000000";
    const res = verifyEmailCode(token, wrong);
    expect(res.valid).toBe(false);
    if (!res.valid) expect(res.reason).toBe("bad-code");
  });
  it("rejects a malformed token", () => {
    expect(verifyEmailCode("nope", "123456").valid).toBe(false);
  });
  it("rejects an expired code", () => {
    const { code, token } = createEmailCode("a@b.com", 1000);
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 2000);
    const res = verifyEmailCode(token, code);
    expect(res.valid).toBe(false);
    if (!res.valid) expect(res.reason).toBe("expired");
  });
  it("generates distinct tokens across calls", () => {
    const a = createEmailCode("a@b.com");
    const b = createEmailCode("a@b.com");
    expect(a.token).not.toBe(b.token);
  });
});
