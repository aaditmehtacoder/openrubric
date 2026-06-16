import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { PRIORITY_LABEL } from "@/lib/github";
import type { ReviewPriority, SubmissionStatus } from "@/lib/types";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-mono text-[11px] leading-none",
  {
    variants: {
      variant: {
        neutral: "border-line bg-raised text-dim",
        outline: "border-line bg-surface text-dim",
        accent: "border-accent-line bg-accent-soft text-accent",
        clean: "border-[rgba(46,138,94,0.28)] bg-[rgba(46,138,94,0.07)] text-signal-clean",
        review: "border-[rgba(168,121,31,0.28)] bg-[rgba(168,121,31,0.07)] text-signal-review",
        high: "border-[rgba(180,69,60,0.28)] bg-[rgba(180,69,60,0.07)] text-signal-high",
      },
      size: {
        sm: "px-2 py-[3px]",
        default: "px-2.5 py-1",
      },
    },
    defaultVariants: { variant: "neutral", size: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

// ── Review/timeline priority badge ──────────────────────────────────────────
const priorityToVariant: Record<ReviewPriority, "clean" | "review" | "high"> = {
  clean: "clean",
  light: "review",
  needs: "review",
  high: "high",
};
const priorityDot: Record<ReviewPriority, string> = {
  clean: "bg-signal-clean-dot",
  light: "bg-signal-review-dot",
  needs: "bg-signal-review-dot",
  high: "bg-signal-high-dot",
};

export function TimelineBadge({
  priority,
  withDot = false,
  className,
}: {
  priority: ReviewPriority;
  withDot?: boolean;
  className?: string;
}) {
  return (
    <Badge variant={priorityToVariant[priority]} className={className}>
      {withDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", priorityDot[priority])} aria-hidden />
      )}
      {PRIORITY_LABEL[priority]}
    </Badge>
  );
}

// ── Submission status badge ─────────────────────────────────────────────────
const STATUS_META: Record<SubmissionStatus, { label: string; className: string }> = {
  imported: { label: "Imported", className: "bg-raised text-dim" },
  not_scored: { label: "Not scored", className: "bg-sunken text-dim" },
  in_progress: { label: "In progress", className: "bg-[rgba(168,121,31,0.09)] text-signal-review" },
  finalized: { label: "Finalized", className: "bg-[rgba(46,138,94,0.08)] text-signal-clean" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: SubmissionStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold",
        meta.className,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
