import { cn } from "@/lib/utils";
import type { GithubScan } from "@/lib/types";

/**
 * Review signals, framed as questions, never accusations. The closing line is
 * fixed copy: "This is a signal, not a verdict." (see lib/github language policy).
 */
export function OriginalityFlagCard({ scan }: { scan: GithubScan }) {
  return (
    <section className="mb-3.5 rounded-[14px] border border-line bg-surface p-4">
      <h3 className="mb-3 text-[13.5px] font-semibold text-ink">Review signals</h3>
      <ul className="flex flex-col gap-2.5">
        {scan.flags_json.map((f, i) => (
          <li key={`${f.label}-${i}`} className="flex items-start gap-2.5">
            <span
              className={cn(
                "mt-px flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                f.ok
                  ? "bg-[rgba(46,138,94,0.12)] text-signal-clean"
                  : "bg-[rgba(168,121,31,0.14)] text-signal-review",
              )}
              aria-hidden
            >
              {f.ok ? "✓" : "!"}
            </span>
            <span className="text-[13px] leading-[1.4] text-ink">{f.label}</span>
          </li>
        ))}
      </ul>
      {scan.summary && (
        <p className="mt-3.5 border-t border-line-soft pt-3 text-[12.5px] leading-[1.5] text-dim">
          {scan.summary}
        </p>
      )}
      <p className="mt-2 text-[11.5px] text-faint">This is a signal, not a verdict.</p>
    </section>
  );
}
