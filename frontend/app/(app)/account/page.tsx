import type { Metadata } from "next";
import Link from "next/link";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { PageHeading } from "@/components/features/page-heading";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your Inferex profile and preferences.",
};

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  );
}

export default function AccountPage() {
  return (
    <ContentLayout title="Account">
      <div className="mx-auto max-w-2xl space-y-8">
        <PageHeading
          eyebrow="Settings"
          title="Account"
          description="Profile and preferences. Saving is part of the upcoming accounts release — appearance works today."
        />

        {/* Profile — preview only */}
        <Card className="animate-rise [animation-delay:80ms]">
          <CardContent className="space-y-5 py-6">
            <div className="flex items-center justify-between">
              <CardLabel>Profile</CardLabel>
              <Badge variant="beta">accounts soon</Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue=""
                placeholder="you@example.com"
              />
            </div>

            <Separator />
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Changes aren&apos;t saved yet.
              </p>
              <Button disabled>Save changes</Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance — fully functional */}
        <Card className="animate-rise [animation-delay:140ms]">
          <CardContent className="space-y-5 py-6">
            <CardLabel>Appearance</CardLabel>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark. This preference is saved locally.
                </p>
              </div>
              <ModeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="animate-rise border-destructive/30 ring-destructive/15 [animation-delay:200ms]">
          <CardContent className="space-y-4 py-6">
            <CardLabel>Danger zone</CardLabel>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="font-medium">Delete account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently remove your account and saved syllogisms.
                </p>
              </div>
              <Button variant="destructive" disabled>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Not signed in.{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign in
          </Link>{" "}
          or{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline underline-offset-4"
          >
            create an account
          </Link>
          .
        </p>
      </div>
    </ContentLayout>
  );
}
