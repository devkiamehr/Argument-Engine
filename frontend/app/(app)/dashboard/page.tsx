import type { Metadata } from "next";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { DashboardView } from "@/components/features/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "An overview of your Inferex activity.",
};

export default function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <DashboardView />
    </ContentLayout>
  );
}
