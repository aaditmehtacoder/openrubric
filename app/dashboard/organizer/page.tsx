import type { Metadata } from "next";
import { AppShell } from "@/components/app/app-shell";
import { OrganizerDashboard } from "@/components/organizer/organizer-dashboard";

export const metadata: Metadata = { title: "Organizer · Dashboard" };

export default function OrganizerDashboardPage() {
  return (
    <AppShell role="organizer">
      <OrganizerDashboard />
    </AppShell>
  );
}
