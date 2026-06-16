import * as React from "react";
import { cn } from "@/lib/utils";

/** Mono uppercase field label — the form-field counterpart to <Eyebrow>. */
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "mb-2 block font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
