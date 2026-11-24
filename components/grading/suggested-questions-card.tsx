"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * AI-generated, product-specific questions for the judge to ask the team. Each row is
 * clickable, click to copy it (handy to paste into the shared notes or read aloud).
 */
export function SuggestedQuestionsCard({ questions }: { questions: string[] }) {
  const [copied, setCopied] = useState<number | null>(null);
  if (!questions?.length) return null;

  function copy(q: string, i: number) {
    navigator.clipboard
      ?.writeText(q)
      .then(() => {
        setCopied(i);
        setTimeout(() => setCopied((c) => (c === i ? null : c)), 1500);
      })
      .catch(() => {});
  }

  return (
    <section className="rounded-[16px] border border-line bg-surface p-6">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-ink">Questions to ask</h3>
        <span className="text-[12px] text-faint">Click one to copy it</span>
      </div>
      <ol className="-mx-2 flex flex-col">
        {questions.map((q, i) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => copy(q, i)}
              className="group flex w-full items-start gap-3 rounded-[10px] px-2 py-2.5 text-left transition-colors hover:bg-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <span className="mt-px flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11.5px] font-semibold tabular-nums text-accent">
                {i + 1}
              </span>
              <span className="flex-1 text-[14px] leading-[1.5] text-ink">{q}</span>
              <span className="mt-0.5 flex-shrink-0 text-faint" aria-live="polite">
                {copied === i ? (
                  <Check className="h-3.5 w-3.5 text-signal-clean" strokeWidth={3} aria-label="Copied" />
                ) : (
                  <Copy
                    className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                    strokeWidth={2}
                    aria-hidden
                  />
                )}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
