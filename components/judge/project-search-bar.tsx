"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type JudgeFilter = "all" | "notScored" | "scored" | "needsReview";

const FILTERS: { key: JudgeFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "notScored", label: "Not scored" },
  { key: "scored", label: "Scored" },
  { key: "needsReview", label: "Needs review" },
];

export function ProjectSearchBar({
  search,
  onSearch,
  filter,
  onFilter,
}: {
  search: string;
  onSearch: (value: string) => void;
  filter: JudgeFilter;
  onFilter: (value: JudgeFilter) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 rounded-[12px] border border-line bg-surface px-4 py-3.5 shadow-card focus-within:border-accent">
        <Search className="h-[17px] w-[17px] text-faint" strokeWidth={1.6} />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search project, team, or participant…"
          className="flex-1 border-none bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
          aria-label="Search projects"
        />
        <span className="rounded-[5px] border border-line px-[7px] py-0.5 font-mono text-[11px] text-faint">
          ⌘K
        </span>
      </div>

      <div className="flex flex-wrap gap-2 pt-[18px]">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => onFilter(f.key)}
              className={cn(
                "rounded-full border px-3.5 py-[7px] text-[13px] font-medium transition-colors",
                active
                  ? "border-ink bg-ink text-canvas"
                  : "border-line bg-surface text-dim hover:border-ink",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
