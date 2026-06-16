import { cn } from "@/lib/utils";
import type { TrackWinner } from "@/lib/scoring";

export function TrackWinnersPanel({ winners }: { winners: TrackWinner[] }) {
  return (
    <div>
      <div className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.12em] text-dim">
        Track winners
      </div>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {winners.map((w) => (
          <div key={w.track} className="rounded-[13px] border border-line bg-surface p-4">
            <div className="mb-2.5 font-mono text-[10.5px] text-faint">{w.track}</div>
            <div className="mb-1 flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em]">
              <span className="truncate">{w.project.project_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] text-dim">Avg {w.project.othersAvg}</span>
              {w.blocked && (
                <span
                  className={cn(
                    "rounded-full border border-signal-high px-[7px] py-px font-mono text-[9.5px] text-signal-high",
                  )}
                >
                  Review first
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
