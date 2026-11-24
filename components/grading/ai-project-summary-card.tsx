import { Sparkles } from "lucide-react";
import type { AiSummary } from "@/lib/types";
import { TechIcon } from "@/components/ui/tech-icon";
import { cn } from "@/lib/utils";

/** One labeled row of the summary. Hidden by the caller when there's nothing to say. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-4">
      <dt className="text-[13px] font-medium text-dim sm:pt-px">{label}</dt>
      <dd className="text-[14px] leading-[1.55] text-ink">{children}</dd>
    </div>
  );
}

/** A short, tinted note: the strongest part, or the thing worth asking about. */
function Callout({ tone, label, text }: { tone: "good" | "ask"; label: string; text: string }) {
  return (
    <div
      className={cn(
        "rounded-[12px] border px-4 py-3",
        tone === "good"
          ? "border-[rgba(46,138,94,0.2)] bg-[rgba(46,138,94,0.06)]"
          : "border-[rgba(168,121,31,0.22)] bg-[rgba(168,121,31,0.06)]",
      )}
    >
      <div
        className={cn(
          "mb-1 text-[12.5px] font-semibold",
          tone === "good" ? "text-signal-clean" : "text-signal-review",
        )}
      >
        {label}
      </div>
      <div className="text-[13.5px] leading-[1.5] text-ink">{text}</div>
    </div>
  );
}

/**
 * Always-visible judge aid: the project in a few short lines, readable in seconds.
 * An overview, never a score or a verdict. Empty fields are left out, not dashed.
 */
export function AIProjectSummaryCard({ ai }: { ai: AiSummary }) {
  const tech = ai.tech ?? [];
  const strength = ai.strengths_json?.[0];
  const ask = ai.weaknesses_json?.[0];
  const hasRows = Boolean(ai.who || ai.how || tech.length);

  return (
    <section className="rounded-[16px] border border-line bg-surface p-6">
      <div className="mb-2.5 flex items-center gap-1.5 text-[12.5px] font-medium text-dim">
        <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
        AI summary
      </div>
      <p className="text-[18px] font-medium leading-[1.45] tracking-[-0.01em] text-ink">
        {ai.what || "No summary yet. Open the Devpost write-up below."}
      </p>

      {hasRows && (
        <dl className="mt-5 flex flex-col gap-3.5 border-t border-line-soft pt-5">
          {ai.who && <Row label="Who it helps">{ai.who}</Row>}
          {ai.how && <Row label="How it works">{ai.how}</Row>}
          {tech.length > 0 && (
            <Row label="Built with">
              <span className="flex flex-wrap gap-1.5">
                {tech.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-2.5 py-[3px] text-[12.5px] text-ink"
                  >
                    <TechIcon name={t} className="h-3 w-3" />
                    {t}
                  </span>
                ))}
              </span>
            </Row>
          )}
        </dl>
      )}

      {(strength || ask) && (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {strength && <Callout tone="good" label="Strongest part" text={strength} />}
          {ask && <Callout tone="ask" label="Worth asking about" text={ask} />}
        </div>
      )}
    </section>
  );
}
