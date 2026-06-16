import type { Metadata } from "next";
import { AppShell } from "@/components/app/app-shell";
import { JudgeDashboard } from "@/components/judge/judge-dashboard";

export const metadata: Metadata = { title: "Judge · Projects" };

export default function JudgeDashboardPage() {
  return (
    <AppShell role="judge">
      <JudgeDashboard />
    </AppShell>
  );
}
