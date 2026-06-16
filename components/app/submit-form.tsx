"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/lib/constants";
import { DEFAULT_TRACK_NAMES } from "@/lib/demo-data";
import { manualSubmissionSchema, type ManualSubmissionValues } from "@/lib/validators";

const FIELDS: { key: keyof ManualSubmissionValues; label: string; placeholder: string }[] = [
  { key: "repo_url", label: "GitHub repo", placeholder: "github.com/team/project" },
  { key: "devpost_url", label: "Devpost URL", placeholder: "devpost.com/software/project" },
  { key: "live_url", label: "Live demo", placeholder: "project.vercel.app" },
];

export function SubmitForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ManualSubmissionValues>({
    resolver: zodResolver(manualSubmissionSchema),
    defaultValues: { project_name: "", team_name: "", track: DEFAULT_TRACK_NAMES[0], description: "" },
  });

  if (done) {
    return (
      <div className="rounded-[16px] border border-line bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(46,138,94,0.1)] text-[18px] text-signal-clean">
          ✓
        </div>
        <h2 className="mb-1.5 text-[19px] font-semibold tracking-[-0.01em]">Submission received</h2>
        <p className="mx-auto mb-5 max-w-[42ch] text-sm text-dim">
          Your project is in the judging queue. Scores stay hidden until the organizer publishes
          results.
        </p>
        <Button asChild>
          <Link href={ROUTES.teamDashboard}>View submission status →</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(() => setDone(true))}
      noValidate
      className="rounded-[16px] border border-line bg-surface p-7"
    >
      <h2 className="mb-1 text-[19px] font-semibold tracking-[-0.01em]">Submit your project</h2>
      <p className="mb-6 text-sm text-dim">
        Tell judges what you built. You can edit this until the submission deadline.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="project_name">Project name</Label>
          <Input id="project_name" placeholder="Lighthouse" {...register("project_name")} />
          {errors.project_name && (
            <p className="mt-1.5 text-[12px] text-signal-high">{errors.project_name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="team_name">Team name</Label>
          <Input id="team_name" placeholder="Team Beacon" {...register("team_name")} />
        </div>
        <div>
          <Label htmlFor="track">Track</Label>
          <select
            id="track"
            {...register("track")}
            className="w-full rounded-control border border-line bg-raised px-3.5 py-3 text-sm text-ink outline-none focus:border-accent focus:bg-surface"
          >
            {DEFAULT_TRACK_NAMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        {FIELDS.map((f) => (
          <div key={f.key}>
            <Label htmlFor={f.key}>{f.label}</Label>
            <Input id={f.key} placeholder={f.placeholder} {...register(f.key)} />
          </div>
        ))}
        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="What it does, who it helps, and how it works."
            className="min-h-[110px]"
            {...register("description")}
          />
        </div>
      </div>

      <Button type="submit" className="mt-6 w-full">
        Submit project
      </Button>
    </form>
  );
}
