import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isMailerConfigured,
  sendVerificationEmail,
  sendVerificationCodeEmail,
} from "@/lib/mailer";

beforeEach(() => {
  vi.unstubAllEnvs();
  for (const k of ["GMAIL_USER", "GMAIL_APP_PASSWORD", "SMTP_HOST", "SMTP_USER", "SMTP_PASS"]) {
    delete process.env[k];
  }
});
afterEach(() => vi.unstubAllEnvs());

describe("isMailerConfigured", () => {
  it("false with no credentials", () => {
    expect(isMailerConfigured()).toBe(false);
  });
  it("true with Gmail credentials", () => {
    vi.stubEnv("GMAIL_USER", "a@gmail.com");
    vi.stubEnv("GMAIL_APP_PASSWORD", "app pass word here");
    expect(isMailerConfigured()).toBe(true);
  });
  it("true with generic SMTP credentials", () => {
    vi.stubEnv("SMTP_HOST", "smtp.example.com");
    vi.stubEnv("SMTP_USER", "u");
    vi.stubEnv("SMTP_PASS", "p");
    expect(isMailerConfigured()).toBe(true);
  });
});

describe("graceful degradation with no SMTP", () => {
  it("sendVerificationEmail returns a demo result without throwing", async () => {
    const res = await sendVerificationEmail("to@example.com", "https://app/verify?t=x");
    expect(res).toEqual({ sent: false, demo: true });
  });
  it("sendVerificationCodeEmail returns a demo result without throwing", async () => {
    const res = await sendVerificationCodeEmail("to@example.com", "123456");
    expect(res).toEqual({ sent: false, demo: true });
  });
});
