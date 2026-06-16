import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GradingWorkspace } from "@/components/grading/grading-workspace";
import { DEMO_PROJECTS, getProject } from "@/lib/demo-data";

export function generateStaticParams() {
  return DEMO_PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  return { title: project ? `Grade · ${project.project_name}` : "Grade project" };
}

export default async function GradeProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  return <GradingWorkspace project={project} />;
}
