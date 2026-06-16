"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { signInSchema, signUpSchema, type SignInValues, type SignUpValues } from "@/lib/validators";
import type { Role } from "@/lib/types";

const DEMO_LOGINS: { label: string; hint: string; href: string }[] = [
  { label: "Demo Organizer", hint: "set up & rank →", href: ROUTES.organizerDashboard },
  { label: "Demo Judge", hint: "score live →", href: ROUTES.judgeDashboard },
  { label: "Demo Participant", hint: "view status →", href: ROUTES.teamDashboard },
];

const ROLES: { value: Role; label: string }[] = [
  { value: "organizer", label: "Organizer" },
  { value: "judge", label: "Judge" },
  { value: "participant", label: "Participant" },
];

const ROLE_DEST: Record<Role, string> = {
  organizer: ROUTES.organizerDashboard,
  judge: ROUTES.judgeDashboard,
  participant: ROUTES.teamDashboard,
};

export function AuthCard({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const isSignUp = mode === "sign-up";

  // Resolved on the client only (avoids any SSR access to browser APIs).
  const [live, setLive] = useState(false);
  useEffect(() => setLive(isSupabaseConfigured()), []);

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const signIn = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const signUp = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", password: "", role: "organizer" },
  });

  const role = signUp.watch("role");

  async function onSignIn(values: SignInValues) {
    setError(null);
    setInfo(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      router.push(ROUTES.judgeDashboard); // demo mode
      return;
    }
    setPending(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.refresh();
    router.push(ROUTES.judgeDashboard);
  }

  async function onSignUp(values: SignUpValues) {
    setError(null);
    setInfo(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      router.push(ROLE_DEST[values.role]); // demo mode
      return;
    }
    setPending(true);
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName, role: values.role },
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}${ROUTES.signIn}` : undefined,
      },
    });
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.refresh();
      router.push(ROLE_DEST[values.role]);
    } else {
      setInfo("Check your email to confirm your account, then sign in.");
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-canvas p-8">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-[420px]">
        <Link href={ROUTES.home} className="mb-7 flex items-center justify-center text-ink">
          <Logo />
        </Link>

        <div className="rounded-[18px] border border-line bg-surface p-8 shadow-card">
          <h1 className="mb-1.5 text-[22px] font-semibold tracking-[-0.02em]">
            {isSignUp ? "Create your account" : "Sign in to your hackathon"}
          </h1>
          <p className="mb-6 text-sm text-dim">
            {isSignUp
              ? "Organize, judge, or submit — pick a role to get started."
              : "Continue with your judging account, or jump into a demo workspace."}
          </p>

          {error && (
            <div className="mb-4 rounded-control border border-[rgba(180,69,60,0.3)] bg-[rgba(180,69,60,0.06)] px-3.5 py-2.5 text-[13px] text-signal-high">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-4 rounded-control border border-[rgba(46,138,94,0.3)] bg-[rgba(46,138,94,0.06)] px-3.5 py-2.5 text-[13px] text-signal-clean">
              {info}
            </div>
          )}

          {isSignUp ? (
            <form onSubmit={signUp.handleSubmit(onSignUp)} noValidate>
              <Label htmlFor="role">Role</Label>
              <div className="mb-4 grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => signUp.setValue("role", r.value)}
                    className={cn(
                      "rounded-control border py-2.5 font-mono text-[11.5px] uppercase tracking-[0.06em] transition-colors",
                      role === r.value
                        ? "border-ink bg-ink text-canvas"
                        : "border-line bg-raised text-dim hover:border-ink",
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" placeholder="Priya Shah" className="mb-3.5" {...signUp.register("fullName")} />
              {signUp.formState.errors.fullName && (
                <p className="-mt-2 mb-3 text-[12px] text-signal-high">{signUp.formState.errors.fullName.message}</p>
              )}

              <Label htmlFor="su-email">Email</Label>
              <Input id="su-email" type="email" placeholder="you@hackathon.org" className="mb-3.5" {...signUp.register("email")} />
              {signUp.formState.errors.email && (
                <p className="-mt-2 mb-3 text-[12px] text-signal-high">{signUp.formState.errors.email.message}</p>
              )}

              <Label htmlFor="su-password">Password</Label>
              <Input id="su-password" type="password" placeholder="••••••••" className="mb-[18px]" {...signUp.register("password")} />
              {signUp.formState.errors.password && (
                <p className="-mt-3 mb-3 text-[12px] text-signal-high">{signUp.formState.errors.password.message}</p>
              )}

              <Button type="submit" className="mt-1 w-full" disabled={pending}>
                {pending ? "Creating account…" : "Create account"}
              </Button>
            </form>
          ) : (
            <form onSubmit={signIn.handleSubmit(onSignIn)} noValidate>
              <Label htmlFor="si-email">Email</Label>
              <Input id="si-email" type="email" placeholder="you@hackathon.org" className="mb-3.5" {...signIn.register("email")} />
              {signIn.formState.errors.email && (
                <p className="-mt-2 mb-3 text-[12px] text-signal-high">{signIn.formState.errors.email.message}</p>
              )}
              <Label htmlFor="si-password">Password</Label>
              <Input id="si-password" type="password" placeholder="••••••••" className="mb-[18px]" {...signIn.register("password")} />
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Signing in…" : "Continue"}
              </Button>
            </form>
          )}

          <div className="my-[22px] flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="font-mono text-[11px] text-faint">DEMO LOGIN</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="flex flex-col gap-2.5">
            {DEMO_LOGINS.map((d) => (
              <Link
                key={d.label}
                href={d.href}
                className="flex items-center justify-between rounded-control border border-line bg-raised px-3.5 py-3 transition-colors hover:border-ink"
              >
                <span className="text-sm font-medium">{d.label}</span>
                <span className="font-mono text-[11px] text-dim">{d.hint}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-5 text-center text-[13px] text-dim">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <Link href={ROUTES.signIn} className="font-medium text-accent">
                Sign in
              </Link>
            </>
          ) : (
            <>
              New here?{" "}
              <Link href={ROUTES.signUp} className="font-medium text-accent">
                Create an account
              </Link>
            </>
          )}{" "}
          ·{" "}
          <Link href={ROUTES.home} className="underline">
            Back to site
          </Link>
        </div>

        <p className="mt-4 text-center font-mono text-[10.5px] text-faint">
          {live ? "● Connected to Supabase" : "○ Demo mode — no backend configured"}
        </p>
      </div>
    </div>
  );
}
