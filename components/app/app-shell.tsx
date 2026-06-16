import { CleanSidebar } from "./clean-sidebar";

/** Sidebar + scrollable main column. Used by all dashboard screens (not grading). */
export function AppShell({
  role,
  children,
}: {
  role: "organizer" | "judge";
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <CleanSidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
