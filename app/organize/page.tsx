import type { Metadata } from "next";
import { AppShell } from "@/components/app/app-shell";
import { OrganizerSetupWizard } from "@/components/organizer/organizer-setup-wizard";

export const metadata: Metadata = { title: "Set up judging" };

export default function OrganizePage() {
  return (
    <AppShell role="organizer">
      <OrganizerSetupWizard />
    </AppShell>
  );
}
