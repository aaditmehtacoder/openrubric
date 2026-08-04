"use client";

import { Fragment, useMemo, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Restrained entrance animations for marketing pages.
 *
 * Deliberately modest: a single fade with a small rise, once, on scroll into view.
 * There is no per-word choreography and no long easing curves, because the site
 * should read as dependable operational software rather than a showreel. Both
 * components honor prefers-reduced-motion by fading only.
 *
 * Note: do NOT wrap content containing a position:fixed overlay — the lingering
 * transform would re-anchor it. (The hero preview panel is intentionally unwrapped.)
 */

const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Renders a headline where `*starred*` segments are emphasized in the accent
 * colour. Emphasis can span several words: a leading `*` opens it and a trailing
 * `*` closes it, e.g. `text="Let's judge *your hackathon.*"`.
 *
 * Renders as spans inside whatever element wraps it, so keep it inside an
 * <h1>/<h2> to preserve semantics and SEO. The whole line fades in as one piece.
 */
export function SplitWords({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  const words = useMemo(() => {
    let inEm = false;
    return text.split(/\s+/).map((raw) => {
      const opens = raw.startsWith("*");
      const closes = raw.endsWith("*") && raw.length > 1;
      const em = inEm || opens;
      if (opens) inEm = true;
      if (closes) inEm = false;
      return { word: raw.replace(/\*/g, ""), em };
    });
  }, [text]);

  return (
    <motion.span
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className={w.em ? "text-accent" : undefined}>{w.word}</span>
        </Fragment>
      ))}
    </motion.span>
  );
}
