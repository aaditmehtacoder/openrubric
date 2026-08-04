import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * Framed product-demo video player, used on /video. `controls` + `preload="metadata"`
 * so the file only downloads when a visitor presses play. A visible direct link sits
 * under the frame as a fallback when embedded playback fails in their browser.
 */
export function DemoVideo({
  eyebrow = "Product demo",
  heading = "See OpenRubric in action.",
  sub,
  className = "",
}: {
  eyebrow?: string;
  heading?: string;
  sub?: string;
  className?: string;
}) {
  return (
    <section className={`bg-canvas ${className}`}>
      <div className="container-marketing py-16 sm:py-20">
        <div className="mb-9 max-w-[60ch]">
          <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
          <h1 className="font-serif text-[clamp(28px,4vw,46px)] font-normal leading-[1.05] tracking-[-0.015em]">
            {heading}
          </h1>
          {sub && <p className="mt-3.5 text-[15.5px] leading-[1.6] text-dim">{sub}</p>}
        </div>

        <div className="max-w-[940px]">
          <div className="overflow-hidden rounded-[14px] border border-line bg-black">
            <video
              src="/openrubricdemo.mp4"
              controls
              playsInline
              preload="metadata"
              className="block aspect-video w-full bg-black object-contain"
            >
              <a href="/openrubricdemo.mp4">Download the OpenRubric demo video</a>
            </video>
          </div>
          <p className="mt-3.5 text-[13px] leading-[1.6] text-dim">
            Video not playing?{" "}
            <a
              href="/openrubricdemo.mp4"
              target="_blank"
              rel="noreferrer"
              className="rounded-sm text-accent underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              Open the demo file directly
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
