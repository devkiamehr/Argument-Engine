import { AppShell } from "@/components/admin-panel/app-shell";

// Signed-in product surface (Analyzer, Dashboard, History, Learn, Account).
// AppShell shows the marketing landing instead when signed out.
export default function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
