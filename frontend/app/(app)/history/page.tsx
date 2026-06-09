import type { Metadata } from "next";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { HistoryView } from "@/components/features/history-view";

export const metadata: Metadata = {
  title: "History",
  description: "Your past syllogisms and their conclusions.",
};

export default function HistoryPage() {
  return (
    <ContentLayout title="History">
      <HistoryView />
    </ContentLayout>
  );
}
