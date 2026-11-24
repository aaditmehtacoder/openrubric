import { prettyUrl } from "@/lib/utils";
import { TechIcon } from "@/components/ui/tech-icon";
import { ScreenshotGallery } from "./screenshot-gallery";
import { ReadmeCard } from "./readme-card";
import type { ProjectView } from "@/lib/types";

/**
 * The judge page's Screenshots and GitHub tabs: real screenshots scraped from the public
 * Devpost gallery, and the GitHub repo at a glance. Missing data shows a plain one-line
 * empty state rather than fake tiles.
 */

function ext(url: string | null): string {
  if (!url) return "#";
  return url.startsWith("http") ? url : `https://${url}`;
}

/**
 * ISO timestamp → "May 23, 2026, 7:01 PM PDT" rendered in the hackathon's timezone.
 * An explicit `timeZone` makes the output identical on server and client (no hydration
 * drift) and shows judges the time in the event's local zone, not raw UTC.
 */
function fmtDateTime(iso: string, timeZone: string | null): string {
  if (!iso) return "N/A";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone || "UTC",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }).format(d);
  } catch {
    // Invalid IANA zone, fall back to UTC.
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }).format(d);
  }
}

/** Card header: a plain sentence-case title, with optional right-aligned meta. */
function CardTitle({ children, meta }: { children: React.ReactNode; meta?: string }) {
  return (
    <div className="mb-3.5 flex items-baseline justify-between gap-3">
      <h3 className="text-[15px] font-semibold text-ink">{children}</h3>
      {meta && <span className="text-[12px] text-faint">{meta}</span>}
    </div>
  );
}

/** Demo video (when there is one) + the real screenshots scraped from Devpost. */
export function ProjectMedia({ project }: { project: ProjectView }) {
  const shots = project.screenshots ?? [];
  return (
    <div className="flex flex-col gap-4">
      {project.demo_video_url && (
        <section className="rounded-[16px] border border-line bg-surface p-6">
          <CardTitle>Demo video</CardTitle>
          <div className="aspect-video w-full overflow-hidden rounded-[10px] border border-line bg-black">
            <iframe
              src={project.demo_video_url}
              title={`${project.project_name} demo video`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      <section className="rounded-[16px] border border-line bg-surface p-6">
        <CardTitle meta={shots.length ? `${shots.length} from Devpost` : undefined}>Screenshots</CardTitle>
        {shots.length === 0 ? (
          <p className="text-[13.5px] text-dim">No screenshots for this project.</p>
        ) : (
          <ScreenshotGallery shots={shots} name={project.project_name} />
        )}
      </section>
    </div>
  );
}

/** The GitHub repo at a glance (languages, commits, contributors) + its README. */
export function ProjectCode({
  project,
  timezone = null,
  readme = null,
}: {
  project: ProjectView;
  timezone?: string | null;
  /** The repo's README markdown (scan-cached or fetched on demand by the page). */
  readme?: string | null;
}) {
  const scan = project.scan;
  const contributors = scan.contributors_json ?? [];
  const readmeText = readme ?? scan.readme_md ?? null;

  if (!project.repo_url) {
    return (
      <section className="rounded-[16px] border border-line bg-surface p-6">
        <CardTitle>GitHub repository</CardTitle>
        <p className="text-[13.5px] text-dim">No repository linked for this project.</p>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-[16px] border border-line bg-surface p-6">
        <div className="mb-1 flex items-center gap-2 text-[12.5px] font-medium text-dim">
          <TechIcon name="GitHub" className="h-3.5 w-3.5 text-ink" />
          GitHub repository
        </div>
        <a
          href={ext(project.repo_url)}
          target="_blank"
          rel="noreferrer"
          className="text-[17px] font-semibold text-ink underline-offset-2 hover:underline"
        >
          {scan.repo_owner && scan.repo_name ? `${scan.repo_owner}/${scan.repo_name}` : prettyUrl(project.repo_url)}
        </a>

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line-soft pt-4">
          <Stat label="Commits" value={String(scan.total_commits)} />
          <Stat label="Contributors" value={String(contributors.length)} />
          <Stat label="Last commit" value={fmtDateTime(scan.last_commit_at, timezone)} wrap />
        </div>

        <LanguagesBar languages={scan.languages_json ?? []} />

        <a
          href={ext(project.repo_url)}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-control border border-line bg-raised px-4 py-2.5 text-[13.5px] font-medium text-ink transition-colors hover:border-ink"
        >
          <TechIcon name="GitHub" className="h-4 w-4" />
          Open on GitHub ↗
        </a>
      </section>

      {/* The repo's real README, rendered inline */}
      {readmeText && <ReadmeCard readme={readmeText} repoUrl={project.repo_url} />}
    </div>
  );
}

const LANG_COLORS = ["#3178c6", "#f1e05a", "#2b7489", "#e34c26", "#563d7c", "#89e051", "#dea584", "#b07219"];

/** GitHub-style stacked language breakdown bar + legend. */
function LanguagesBar({ languages }: { languages: { name: string; pct: number }[] }) {
  if (!languages.length) return null;
  const top = languages.slice(0, 6);
  return (
    <div className="mt-4 border-t border-line-soft pt-4">
      <div className="mb-2 text-[12.5px] font-medium text-dim">Languages</div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-sunken">
        {top.map((l, i) => (
          <span
            key={l.name}
            title={`${l.name} ${l.pct}%`}
            style={{ width: `${l.pct}%`, background: LANG_COLORS[i % LANG_COLORS.length] }}
          />
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
        {top.map((l, i) => (
          <span key={l.name} className="inline-flex items-center gap-1.5 text-[11.5px] text-dim">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: LANG_COLORS[i % LANG_COLORS.length] }}
            />
            <span className="font-medium text-ink">{l.name}</span>
            <span className="tabular-nums text-faint">{l.pct}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, wrap = false }: { label: string; value: string; wrap?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="text-[12px] text-dim">{label}</div>
      <div className={`mt-0.5 text-[14px] font-semibold tabular-nums leading-snug text-ink ${wrap ? "" : "truncate"}`}>
        {value}
      </div>
    </div>
  );
}
