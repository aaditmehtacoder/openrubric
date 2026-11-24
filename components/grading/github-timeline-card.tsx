import { cn } from "@/lib/utils";
import type { GithubScan, ReviewPriority } from "@/lib/types";

const TONE_DOT: Record<ReviewPriority, string> = {
  clean: "bg-signal-clean",
  light: "bg-signal-review-dot",
  needs: "bg-signal-review-dot",
  high: "bg-signal-high-dot",
};

const TONE_TEXT: Record<ReviewPriority, string> = {
  clean: "text-signal-clean",
  light: "text-signal-review",
  needs: "text-signal-review",
  high: "text-signal-high",
};

/** "Nov 21, 2:10 PM PST · within the event window" → time + a sentence-case status. */
function splitMeta(meta: string): { time: string; status: string } {
  const at = meta.lastIndexOf(" · ");
  if (at === -1) return { time: meta, status: "" };
  const status = meta.slice(at + 3).trim();
  return { time: meta.slice(0, at).trim(), status: status.charAt(0).toUpperCase() + status.slice(1) };
}

export function GitHubTimelineCard({ scan }: { scan: GithubScan }) {
  const events = scan.timeline_json ?? [];
  if (!events.length) return null;
  return (
    <section className="mb-3.5 rounded-[14px] border border-line bg-surface p-4">
      <h3 className="mb-3.5 text-[13.5px] font-semibold text-ink">GitHub timeline</h3>
      <ol>
        {events.map((ev, i) => {
          const { time, status } = splitMeta(ev.meta);
          return (
            <li key={`${ev.label}-${i}`} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={cn("mt-[5px] h-2 w-2 rounded-full", TONE_DOT[ev.tone])} />
                {i < events.length - 1 && <span className="w-px flex-1 bg-line" />}
              </div>
              <div className="min-w-0 pb-3.5">
                <div className="text-[13px] font-medium text-ink">{ev.label}</div>
                {time && <div className="mt-0.5 text-[12px] text-dim">{time}</div>}
                {status && <div className={cn("text-[12px] font-medium", TONE_TEXT[ev.tone])}>{status}</div>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
