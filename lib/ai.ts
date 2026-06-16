/**
 * AI project summaries via an OpenAI-compatible provider.
 *
 * Works with OpenAI, Azure, Together, Groq, Ollama, or any /chat/completions API by
 * setting OPENAI_BASE_URL + AI_MODEL. With no OPENAI_API_KEY, generateSummary()
 * returns the deterministic demo summary so the grading screen always renders.
 *
 * The summary is an aid for a human judge — "What it does / Who it helps / How it
 * works / Strongest part / Worth asking about" — never a score or a verdict.
 */

import { DEMO_PROJECTS, SUGGESTED_QUESTIONS } from "./demo-data";
import type { AiSummary } from "./types";

export function isAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export interface SummaryInput {
  submissionId: string;
  projectName: string;
  description: string;
  repoUrl?: string | null;
  readme?: string | null;
}

const SYSTEM_PROMPT = `You help a hackathon judge quickly understand a project before scoring it.
You are an aid, not a judge: never assign scores, never accuse a team of anything, never use words like cheater, fraud, stolen, or plagiarized.
Return ONLY compact JSON with this exact shape:
{
  "what": string,        // one sentence: what it does
  "who": string,         // who it helps
  "how": string,         // how it works, one sentence
  "tech": string[],      // 2-5 technologies
  "strength": string,    // the single strongest part
  "unclear": string      // one thing a judge might want to ask about
}`;

interface RawSummary {
  what: string;
  who: string;
  how: string;
  tech: string[];
  strength: string;
  unclear: string;
}

export async function generateSummary(input: SummaryInput): Promise<AiSummary> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return demoSummaryFor(input.submissionId, input);

  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Project: ${input.projectName}\nDescription: ${input.description}\nRepo: ${
              input.repoUrl ?? "n/a"
            }\n${input.readme ? `README excerpt:\n${input.readme.slice(0, 4000)}` : ""}`,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`AI provider ${res.status}`);
    const data = (await res.json()) as { choices: { message: { content: string } }[] };
    const raw = JSON.parse(data.choices[0]?.message?.content ?? "{}") as RawSummary;

    return {
      id: `ai-${input.submissionId}`,
      submission_id: input.submissionId,
      summary: raw.what ?? input.description,
      what: raw.what ?? input.description,
      who: raw.who ?? "",
      how: raw.how ?? "",
      tech: Array.isArray(raw.tech) ? raw.tech.slice(0, 5) : [],
      strengths_json: raw.strength ? [raw.strength] : [],
      weaknesses_json: raw.unclear ? [raw.unclear] : [],
      suggested_questions_json: SUGGESTED_QUESTIONS,
      created_at: new Date().toISOString(),
    };
  } catch {
    return demoSummaryFor(input.submissionId, input);
  }
}

/** Demo summary — uses the canned project summary when known, else a generic one. */
export function demoSummaryFor(submissionId: string, input?: Partial<SummaryInput>): AiSummary {
  const project = DEMO_PROJECTS.find((p) => p.id === submissionId);
  if (project) return project.ai;

  const description = input?.description ?? "A hackathon project.";
  return {
    id: `ai-${submissionId}`,
    submission_id: submissionId,
    summary: description,
    what: description,
    who: "The project's target users.",
    how: "See the demo and repository for details.",
    tech: [],
    strengths_json: ["Connect an AI provider to generate a full summary."],
    weaknesses_json: ["Running in demo mode — set OPENAI_API_KEY for live summaries."],
    suggested_questions_json: SUGGESTED_QUESTIONS,
    created_at: new Date().toISOString(),
  };
}
