"use client";

import { cn } from "@/lib/utils";
import { useDemo } from "@/components/app/demo-store";
import { PRESENTATION_FIELDS } from "@/lib/demo-data";

/** 1–5 dot selector per presentation dimension. Feeds the Presentation rubric line. */
export function PresentationScoreEditor({ submissionId }: { submissionId: string }) {
  const { presentationFor, setPresentation } = useDemo();
  const values = presentationFor(submissionId);

  return (
    <div className="rounded-[14px] border border-line bg-surface p-5">
      <div className="mb-1.5 text-[15px] font-semibold">Presentation &amp; demo</div>
      <p className="mb-[18px] text-[13px] text-dim">
        Captured during the live demo. These notes inform your Presentation rubric score.
      </p>
      <div className="flex flex-col gap-[18px]">
        {PRESENTATION_FIELDS.map((field) => {
          const current = (values[field.key as string] as number) || 0;
          return (
            <div key={field.key as string} className="flex items-center justify-between gap-4">
              <span className="text-[14px] text-ink">{field.label}</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => {
                  const on = n <= current;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPresentation(submissionId, field.key as string, n)}
                      aria-label={`${field.label}: ${n} of 5`}
                      className={cn(
                        "h-[26px] w-[26px] rounded-[7px] border transition-colors",
                        on ? "border-accent bg-accent" : "border-line bg-surface hover:border-ink",
                      )}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
