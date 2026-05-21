import type { Metadata } from "next";

import { AuthForm } from "@/components/features/auth-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create an Inferex account to save your syllogisms.",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
