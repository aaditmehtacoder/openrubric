"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DEMO_FILM } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Lets a button elsewhere on the page (the hero's) start the film. */
const PLAY_EVENT = "openrubric:play-demo";

export type DemoChapter = {
  /** Where the chapter starts, in seconds. */
  at: number;
  /** Whose screen it is. */
  role: "Organizer" | "Judge";
  title: string;
  body: string;
};

function clock(seconds: number) {
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * The product film. It rests on a still with one play button, so nothing moves and no
 * sound plays until a visitor asks for it; the browser's own controls take over once it
 * starts. Only the film's index is fetched before then (`preload="metadata"`).
 *
 * `chapters` adds an index under the player. It doubles as the text alternative for a
 * film that has music and on-screen lines but no speech.
 */
export function DemoFilm({
  chapters,
  priority = false,
  className,
}: {
  chapters?: readonly DemoChapter[];
  /** Load the still eagerly when the player is at the top of the page. */
  priority?: boolean;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "started" | "ended">("idle");
  const [active, setActive] = useState(-1);

  const play = useCallback((at?: number, block: ScrollLogicalPosition = "nearest") => {
    const v = video.current;
    if (!v) return;
    // Bring the whole picture, controls included, clear of the sticky header and the fold.
    frame.current?.scrollIntoView({ block });
    if (typeof at === "number") v.currentTime = at;
    else if (v.ended) v.currentTime = 0;
    setState("started");
    // Rejects when the browser refuses or the file fails; the controls are on screen
    // by then, so the visitor can press play there.
    void v.play().catch(() => {});
  }, []);

  // Keyboard users land on the player's controls, not back at the top of the page.
  useEffect(() => {
    if (state === "started") video.current?.focus({ preventScroll: true });
  }, [state]);

  useEffect(() => {
    function onRequest() {
      play(undefined, "center");
    }
    window.addEventListener(PLAY_EVENT, onRequest);
    return () => window.removeEventListener(PLAY_EVENT, onRequest);
  }, [play]);

  function onTime() {
    if (!chapters) return;
    const t = video.current?.currentTime ?? 0;
    let index = -1;
    chapters.forEach((c, i) => {
      if (t >= c.at - 0.25) index = i;
    });
    setActive(index);
  }

  return (
    <div className={className}>
      {/* Never taller than the window: on a short screen the picture narrows instead. */}
      <div
        ref={frame}
        className="relative mx-auto max-w-[calc((100svh-7rem)*16/9)] scroll-mb-5 scroll-mt-24 overflow-hidden rounded-[14px] border border-line bg-raised shadow-lift"
      >
        <video
          ref={video}
          src={DEMO_FILM.src}
          poster={DEMO_FILM.poster}
          width={1920}
          height={1080}
          controls={state === "started"}
          playsInline
          preload="metadata"
          onTimeUpdate={onTime}
          onEnded={() => setState("ended")}
          aria-label={`OpenRubric demo film, ${DEMO_FILM.seconds} seconds`}
          className="block aspect-video h-auto w-full focus-visible:outline-none"
        >
          <a href={DEMO_FILM.src}>Download the OpenRubric demo film</a>
        </video>

        {state !== "started" && (
          <button
            type="button"
            onClick={() => play()}
            className="group absolute inset-0 block w-full cursor-pointer focus-visible:outline-none"
          >
            <Image
              src={DEMO_FILM.poster}
              alt=""
              fill
              priority={priority}
              quality={85}
              sizes="(min-width: 1256px) 1144px, calc(100vw - 56px)"
              className="object-cover"
            />
            <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 whitespace-nowrap rounded-full bg-ink py-2.5 pl-4 pr-5 text-[13.5px] font-semibold text-canvas shadow-lift transition-transform duration-150 group-hover:-translate-y-[calc(50%+1px)] group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-canvas group-active:scale-[0.985] motion-reduce:transition-none sm:gap-3 sm:py-3.5 sm:pl-6 sm:pr-7 sm:text-[15px]">
              <svg viewBox="0 0 12 14" aria-hidden="true" className="h-3.5 w-3 flex-shrink-0">
                <path d="M1 1.2v11.6a.6.6 0 0 0 .92.5l9.1-5.8a.6.6 0 0 0 0-1L1.92.7A.6.6 0 0 0 1 1.2Z" fill="currentColor" />
              </svg>
              {state === "ended" ? "Watch again" : "Watch the demo"}
              <span className="font-mono text-[12px] font-normal text-canvas/65 sm:text-[13px]">
                {DEMO_FILM.length}
              </span>
            </span>
          </button>
        )}
      </div>

      {chapters && (
        <ol className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {chapters.map((c, i) => (
            <li key={c.at} className="bg-surface">
              <button
                type="button"
                onClick={() => play(c.at)}
                aria-current={i === active ? "true" : undefined}
                className="flex h-full w-full flex-col items-start p-5 text-left transition-colors hover:bg-raised focus-visible:bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50 aria-[current]:bg-raised"
              >
                <span
                  className={cn(
                    "block font-mono text-[11.5px]",
                    i === active ? "text-accent" : "text-faint",
                  )}
                >
                  {clock(c.at)} <span aria-hidden="true">·</span> {c.role}
                </span>
                <span className="mt-2 block text-[14.5px] font-semibold leading-[1.35] tracking-[-0.01em] text-ink">
                  {c.title}
                </span>
                <span className="mt-1 block text-[13px] leading-[1.55] text-dim">{c.body}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/**
 * A link that starts the film on the same page. Without JavaScript it is a plain
 * anchor to the player.
 */
export const PlayDemoLink = forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<"a">>(
  function PlayDemoLink({ onClick, children, ...props }, ref) {
    return (
      <a
        ref={ref}
        href="#demo"
        {...props}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented) return;
          e.preventDefault();
          window.dispatchEvent(new Event(PLAY_EVENT));
        }}
      >
        {children}
      </a>
    );
  },
);
