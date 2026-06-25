import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateSummary, generateRubricFromImage, demoSummaryFor, isAiConfigured } from "@/lib/ai";

function jsonResponse(body: unknown, init: { status?: number; headers?: Record<string, string> } = {}) {
  const status = init.status ?? 200;
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: (k: string) => init.headers?.[k.toLowerCase()] ?? null },
    json: async () => body,
  } as unknown as Response;
}

const input = {
  submissionId: "sub-1",
  projectName: "Lumi",
  description: "Inspiration\nMy grandmother needed help. What it does\nLumi reminds elders to take meds.",
  repoUrl: "https://github.com/o/r",
};

beforeEach(() => {
  vi.unstubAllEnvs();
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("isAiConfigured", () => {
  it("false with no key", () => {
    delete process.env.GITHUB_API_MODEL_KEY;
    delete process.env.OPENAI_API_KEY;
    expect(isAiConfigured()).toBe(false);
  });
  it("true with a key", () => {
    vi.stubEnv("GITHUB_API_MODEL_KEY", "k");
    expect(isAiConfigured()).toBe(true);
  });
});

describe("generateSummary", () => {
  it("falls back to demo summary with no key (no network call)", async () => {
    delete process.env.GITHUB_API_MODEL_KEY;
    delete process.env.OPENAI_API_KEY;
    const res = await generateSummary(input);
    expect(res.submission_id).toBe("sub-1");
    expect(res.what).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns a neutral summary when the provider responds", async () => {
    vi.stubEnv("GITHUB_API_MODEL_KEY", "k");
    const content = JSON.stringify({
      what: "Reminds elders to take medication.",
      who: "Older adults",
      how: "Push notifications",
      tech: ["React Native", "Firebase"],
      strength: "Clean UX",
      unclear: "How are reminders scheduled?",
      questions: ["q1", "q2", "q3", "q4", "q5"],
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ choices: [{ message: { content } }] })),
    );
    const res = await generateSummary(input);
    expect(res.what).toBe("Reminds elders to take medication.");
    expect(res.tech).toEqual(["React Native", "Firebase"]);
    // never a score or verdict
    expect(res.summary).not.toMatch(/\b(score|winner|reject|accept|points)\b/i);
  });

  it("on persistent 429 degrades to a clean fallback (not the raw dump)", async () => {
    vi.stubEnv("GITHUB_API_MODEL_KEY", "k");
    const fetchMock = vi.fn(async () => jsonResponse({ error: "rate limited" }, { status: 429 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.useFakeTimers();
    const p = generateSummary(input);
    await vi.runAllTimersAsync();
    const res = await p;
    // retried multiple times
    expect(fetchMock.mock.calls.length).toBeGreaterThan(1);
    // fallback is a cleaned, bounded summary — not the full raw write-up, and free of
    // the Devpost section headers.
    expect(res.what.length).toBeLessThanOrEqual(280);
    expect(res.what).not.toContain("Inspiration");
    expect(res.what).not.toContain("What it does");
  });
});

describe("generateRubricFromImage", () => {
  it("returns [] with no key", async () => {
    delete process.env.GITHUB_API_MODEL_KEY;
    delete process.env.OPENAI_API_KEY;
    expect(await generateRubricFromImage("data:image/png;base64,xxx")).toEqual([]);
  });
  it("parses criteria from a provider response", async () => {
    vi.stubEnv("GITHUB_API_MODEL_KEY", "k");
    const content = JSON.stringify({ criteria: [{ name: "Tech", max: 20 }, { name: "Design", points: 0 }] });
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ choices: [{ message: { content } }] })));
    const res = await generateRubricFromImage("data:image/png;base64,xxx");
    expect(res).toEqual([{ name: "Tech", max: 20 }]); // zero-point row dropped
  });
  it("returns [] on a provider error", async () => {
    vi.stubEnv("GITHUB_API_MODEL_KEY", "k");
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({}, { status: 500 })));
    expect(await generateRubricFromImage("data:image/png;base64,xxx")).toEqual([]);
  });
});

describe("demoSummaryFor", () => {
  it("is neutral and never a verdict", () => {
    const s = demoSummaryFor("sub-9");
    expect(s.submission_id).toBe("sub-9");
    expect(s.suggested_questions_json.length).toBeGreaterThan(0);
  });
});
