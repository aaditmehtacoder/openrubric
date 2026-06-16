import type { Metadata } from "next";
import { AuthCard } from "@/components/app/auth-card";

export const metadata: Metadata = { title: "Create your account" };

export default function SignUpPage() {
  return <AuthCard mode="sign-up" />;
}
