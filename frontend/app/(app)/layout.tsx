import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

// Shell layout for the signed-in product surface (Analyzer, Dashboard,
// History, Learn, Account). The collapsible sidebar + mobile sheet live here.
export default function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
