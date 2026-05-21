"use client";

import { useState } from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "signup";

// Non-enforcing auth UI (shell). Submitting shows a preview notice — there is
// no session or backend wired up yet.
export function AuthForm({ mode }: { mode: Mode }) {
  const isSignup = mode === "signup";
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <Card>
      <CardContent className="space-y-6 py-8">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignup
              ? "Start saving the syllogisms you analyze."
              : "Sign in to reach your saved syllogisms."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" autoComplete="name" placeholder="Your name" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="••••••••"
            />
          </div>

          {submitted && (
            <p
              role="status"
              className="rounded-lg bg-muted px-3 py-2 font-mono text-xs text-muted-foreground"
            >
              Authentication isn&apos;t available yet — this screen is a preview.
            </p>
          )}

          <Button type="submit" size="lg" className="w-full">
            {isSignup ? "Create account" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account? " : "New to Inferex? "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
