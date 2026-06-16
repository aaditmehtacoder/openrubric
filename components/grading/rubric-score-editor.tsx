"use client";

import { useDemo } from "@/components/app/demo-store";
import { totalScore } from "@/lib/scoring";
import type { RubricCriterion } from "@/lib/types";

export function RubricScoreEditor({
  submissionId,
  criteria,
}: {
  submissionId: string;
  criteria: RubricCriterion[];
}) {
  const { scoresFor, setScore } = useDemo();
  const scores = scoresFor(submissionId);
  const total = totalScore(scores, criteria);
  const max = criteria.reduce((a, c) => a + c.max_points, 0);

  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
        <span className="text-[15px] font-semibold">Rubric scoring</span>
        <span className="text-[15px] font-bold tabular-nums">
          {total}
          <span className="font-medium text-faint"> / {max}</span>
        </span>
      </div>

      {criteria.map((c) => {
        const value = scores[c.id] || 0;
        return (
          <div key={c.id} className="border-b border-line-soft px-5 py-[18px] last:border-b-0">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-0.5 text-[14.5px] font-semibold">{c.name}</div>
                <div className="text-[12.5px] leading-[1.45] text-dim">{c.description}</div>
              </div>
              <div className="flex flex-shrink-0 items-baseline gap-1">
                <span className="min-w-[26px] text-right text-[20px] font-bold tabular-nums tracking-[-0.01em]">
                  {value}
                </span>
                <span className="font-mono text-[12px] text-faint">/ {c.max_points}</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={c.max_points}
              value={value}
              onChange={(e) => setScore(submissionId, c.id, Number(e.target.value))}
              className="w-full"
              aria-label={`${c.name} score`}
            />
            {c.helper && <div className="mt-2 font-mono text-[11px] text-faint">{c.helper}</div>}
          </div>
        );
      })}
    </div>
  );
}
