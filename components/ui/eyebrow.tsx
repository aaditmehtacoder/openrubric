import { cn } from "@/lib/utils";

type Tone = "dim" | "accent" | "faint" | "ondark";

const toneClass: Record<Tone, string> = {
  dim: "text-dim",
  accent: "text-accent",
  faint: "text-faint",
  ondark: "text-ondark",
};

/** The mono uppercase metadata label used as a section/eyebrow marker everywhere. */
export function Eyebrow({
  children,
  tone = "dim",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.14em]",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
