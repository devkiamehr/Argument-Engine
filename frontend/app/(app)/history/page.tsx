import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { PageHeading } from "@/components/features/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SavedSyllogism } from "@/lib/api";

export const metadata: Metadata = {
  title: "History",
  description: "Your past syllogisms and their conclusions.",
};

// Illustrative row so the layout is visible. Real rows arrive with the
// accounts DB — nothing is persisted yet (UI shell).
const SAMPLE: SavedSyllogism = {
  id: "example",
  lineOne: "all men are mortal",
  lineTwo: "socrates is a man",
  conclusion: "socrates is mortal",
  valid: true,
  mood: "AA-1",
  figure: 1,
  createdAt: "2026-05-29T10:24:00.000Z",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function HistoryPage() {
  return (
    <ContentLayout title="History">
      <div className="space-y-8">
        <PageHeading
          eyebrow="Library"
          title="Past syllogisms"
          description="Every syllogism you analyze while signed in will be saved here, with its conclusion and form."
        />

        {/* Toolbar — controls are a preview and not yet interactive. */}
        <div className="flex animate-rise flex-col gap-3 [animation-delay:80ms] sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              disabled
              placeholder="Search premises…"
              className="pl-9"
              aria-label="Search history (coming soon)"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" disabled>
              All
            </Button>
            <Button variant="outline" size="sm" disabled>
              Valid
            </Button>
            <Button variant="outline" size="sm" disabled>
              Invalid
            </Button>
            <Badge variant="beta">read-only</Badge>
          </div>
        </div>

        <Card className="animate-rise [animation-delay:160ms]">
          <CardContent className="px-0 py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Premises</TableHead>
                  <TableHead>Conclusion</TableHead>
                  <TableHead>Mood</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead className="pr-6">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="opacity-55">
                  <TableCell className="pl-6 align-top">
                    <div className="space-y-0.5 font-mono text-xs text-muted-foreground">
                      <p>{SAMPLE.lineOne}</p>
                      <p>{SAMPLE.lineTwo}</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top font-medium">
                    {SAMPLE.conclusion}
                  </TableCell>
                  <TableCell className="align-top font-mono text-xs">
                    {SAMPLE.mood}
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="valid">valid</Badge>
                  </TableCell>
                  <TableCell className="pr-6 align-top font-mono text-xs text-muted-foreground">
                    {formatDate(SAMPLE.createdAt)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="flex flex-col items-center gap-3 border-t border-dashed border-border px-6 py-12 text-center">
              <p className="font-medium">Your history is empty</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                The row above is an example. Sign in to start saving the
                syllogisms you analyze.
              </p>
              <div className="mt-1 flex gap-2">
                <Button render={<Link href="/login" />} nativeButton={false}>
                  Sign in
                </Button>
                <Button
                  variant="outline"
                  render={<Link href="/" />}
                  nativeButton={false}
                >
                  Analyze one now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
