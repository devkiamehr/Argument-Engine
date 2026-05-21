import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { PageHeading } from "@/components/features/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "An overview of your Inferex activity.",
};

const STATS: { label: string; hint: string }[] = [
  { label: "Analyzed", hint: "total syllogisms" },
  { label: "Valid", hint: "conclusions found" },
  { label: "Invalid", hint: "rejected forms" },
  { label: "Top mood", hint: "most frequent" },
];

export default function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <div className="space-y-8">
        <PageHeading
          eyebrow="Overview"
          title="Your activity at a glance"
          description="Once accounts are connected, this dashboard summarizes the syllogisms you've analyzed and saved."
        />

        {/* Stat cards — placeholders until the accounts DB is wired up. */}
        <div className="grid animate-rise grid-cols-2 gap-4 [animation-delay:80ms] lg:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label} size="sm" className="justify-between">
              <CardContent className="space-y-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {stat.label}
                </p>
                <p className="font-display text-4xl font-semibold text-muted-foreground/45 tabular-nums">
                  —
                </p>
                <p className="text-xs text-muted-foreground">{stat.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent activity — empty state */}
        <div className="grid animate-rise gap-4 [animation-delay:160ms] lg:grid-cols-[1.6fr_1fr]">
          <Card>
            <CardContent className="space-y-4 py-6">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Recent activity
                </p>
                <Badge variant="beta">accounts soon</Badge>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
                  <Clock className="size-5" />
                </span>
                <p className="font-medium">No saved analyses yet</p>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Your analyzed syllogisms will appear here once you sign in.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex h-full flex-col justify-between gap-6 py-6">
              <div className="space-y-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground/70">
                  Start here
                </p>
                <h3 className="font-display text-2xl font-semibold leading-snug">
                  Analyze a syllogism
                </h3>
                <p className="text-sm text-primary-foreground/80">
                  Enter two premises and let Inferex infer the conclusion.
                </p>
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="w-fit"
                render={<Link href="/" />}
                nativeButton={false}
              >
                Open the Analyzer
                <ArrowRight />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  );
}
