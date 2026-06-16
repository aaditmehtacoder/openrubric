import { LogoMark } from "@/components/ui/logo";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <span className="animate-pulse text-ink">
        <LogoMark className="h-8 w-8" />
      </span>
    </div>
  );
}
