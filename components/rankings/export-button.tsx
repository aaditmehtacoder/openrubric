"use client";

import { Button } from "@/components/ui/button";
import { DEMO_PROJECTS, DEMO_REVIEW_CASES } from "@/lib/demo-data";
import { rankProjects } from "@/lib/scoring";

/** Builds a rankings CSV in the browser and triggers a download — no server needed. */
export function ExportButton() {
  function onExport() {
    const ranked = rankProjects(DEMO_PROJECTS, DEMO_REVIEW_CASES);
    const header = ["rank", "project", "team", "track", "avg", "judges", "timeline", "eligible"];
    const rows = ranked.map(({ project, rank, blocked }) => [
      rank,
      project.project_name,
      project.team_name,
      project.track,
      project.othersAvg,
      `${project.judgesDone}/${project.judgesTotal}`,
      project.scan.review_priority,
      blocked ? "review-required" : "yes",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "openrubric-rankings.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="secondary" size="sm" onClick={onExport}>
      Export CSV ↓
    </Button>
  );
}
