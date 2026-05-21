import type { Metadata } from "next";

import { AuthForm } from "@/components/features/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Inferex account.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
