import type { Metadata } from "next";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { AccountView } from "@/components/features/account-view";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your Inferex profile and preferences.",
};

export default function AccountPage() {
  return (
    <ContentLayout title="Account">
      <AccountView />
    </ContentLayout>
  );
}
