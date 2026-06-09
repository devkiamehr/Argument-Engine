"use client";

import { Loader2 } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { Landing } from "@/components/marketing/landing";

/**
 * Auth boundary for the product surface:
 *  - while the session check runs → a centered spinner
 *  - signed out → the marketing landing (no sidebar)
 *  - signed in → the full sidebar app shell
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
