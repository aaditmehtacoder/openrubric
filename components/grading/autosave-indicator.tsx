"use client";

import { cn } from "@/lib/utils";
import { useDemo } from "@/components/app/demo-store";
import type { AutosaveStatus } from "@/lib/types";

const META: Record<AutosaveStatus, { label: string; dot: string; text: string }> = {
  saved: { label: "All changes saved", dot: "bg-signal-clean-dot", text: "text-signal-clean" },
  saving: { label: "Saving…", dot: "bg-signal-review-dot", text: "text-signal-review" },
  unsaved: { label: "Unsaved changes", dot: "bg-[#C9C4BA]", text: "text-dim" },
};

/** Reads the live autosave state from the demo store. */
export function AutosaveIndicator({ variant = "inline" }: { variant?: "inline" | "chip" }) {
  const { autosave } = useDemo();
  const m = META[autosave];

  if (variant === "chip") {
    return (
      <div className="mb-[18px] flex items-center gap-2 rounded-control border border-line bg-surface px-3 py-2.5">
        <span className={cn("h-2 w-2 rounded-full", m.dot, autosave === "saving" && "animate-pulse-dot")} />
        <span className={cn("text-[12.5px]", m.text)}>{m.label}</span>
        <span className="flex-1" />
        <span className="font-mono text-[10.5px] text-faint">autosave on</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-[7px] w-[7px] rounded-full", m.dot, autosave === "saving" && "animate-pulse-dot")} />
      <span className={cn("whitespace-nowrap font-mono text-[11.5px]", m.text)}>{m.label}</span>
    </div>
  );
}
