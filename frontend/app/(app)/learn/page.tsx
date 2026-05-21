import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { PageHeading } from "@/components/features/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FIGURES,
  INPUT_TIPS,
  PROPOSITION_TYPES,
  SUPPORTED_MOODS,
} from "@/lib/syllogism-reference";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "How categorical syllogisms work — proposition types, figures, and the forms Inferex validates.",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  );
}

export default function LearnPage() {
  return (
    <ContentLayout title="Learn">
      <div className="space-y-12">
        <PageHeading
          eyebrow="Reference"
          title="The method behind the machine"
          description="A categorical syllogism draws a conclusion from two premises that share a common term. Here's the vocabulary Inferex uses."
        />

        {/* Worked example */}
        <section className="animate-rise [animation-delay:80ms]">
          <Card className="bg-surface">
            <CardContent className="space-y-5 py-7">
              <SectionLabel>Anatomy of an argument</SectionLabel>
              <div className="space-y-2 font-display text-2xl leading-relaxed sm:text-3xl">
                <p>
                  All <span className="text-muted-foreground">men</span> are{" "}
                  <span className="text-primary">mortal</span>
                </p>
                <p>
                  <span className="font-medium">Socrates</span> is a{" "}
                  <span className="text-muted-foreground">man</span>
                </p>
                <p className="flex items-center gap-3 border-t border-border pt-3">
                  <span aria-hidden className="text-primary">
                    ∴
                  </span>
                  <span className="font-medium">Socrates</span> is{" "}
                  <span className="text-primary">mortal</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span>
                  <span className="text-muted-foreground">Middle term</span> ·
                  man — links the premises, dropped from the conclusion
                </span>
                <span>
                  <span className="text-primary">Major term</span> · mortal ·{" "}
                  <span className="font-medium text-foreground">Minor term</span>{" "}
                  · Socrates
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Proposition types */}
        <section className="animate-rise space-y-4 [animation-delay:120ms]">
          <div className="space-y-1">
            <SectionLabel>Four proposition types</SectionLabel>
            <h3 className="font-display text-2xl font-semibold">
              Every premise is an A, E, I, or O
            </h3>
          </div>
          <Card>
            <CardContent className="px-0 py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Form</TableHead>
                    <TableHead className="pr-6">Example</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PROPOSITION_TYPES.map((p) => (
                    <TableRow key={p.code}>
                      <TableCell className="pl-6">
                        <Badge variant="outline" className="font-mono text-sm">
                          {p.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {p.form}
                      </TableCell>
                      <TableCell className="pr-6 text-sm text-muted-foreground">
                        {p.example}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* Figures */}
        <section className="animate-rise space-y-4 [animation-delay:160ms]">
          <div className="space-y-1">
            <SectionLabel>Four figures</SectionLabel>
            <h3 className="font-display text-2xl font-semibold">
              Where the middle term sits
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FIGURES.map((f) => (
              <Card key={f.figure} size="sm">
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-semibold">
                      Figure {f.figure}
                    </span>
                    <Badge variant="secondary" className="font-mono">
                      {f.arrangement}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Supported moods */}
        <section className="animate-rise space-y-4 [animation-delay:200ms]">
          <div className="space-y-1">
            <SectionLabel>Supported forms</SectionLabel>
            <h3 className="font-display text-2xl font-semibold">
              The {SUPPORTED_MOODS.length} valid moods Inferex recognizes
            </h3>
            <p className="max-w-2xl text-sm text-muted-foreground">
              A mood pairs the two premise types with a figure (e.g. AA-1). These
              are the combinations the engine treats as valid.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_MOODS.map((mood) => (
              <Badge
                key={mood}
                variant="outline"
                className="font-mono text-sm tabular-nums"
              >
                {mood}
              </Badge>
            ))}
          </div>
        </section>

        {/* Writing premises */}
        <section className="animate-rise space-y-4 [animation-delay:240ms]">
          <div className="space-y-1">
            <SectionLabel>Writing premises</SectionLabel>
            <h3 className="font-display text-2xl font-semibold">
              How to phrase your input
            </h3>
          </div>
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {INPUT_TIPS.map((tip) => (
              <div key={tip.title} className="border-l-2 border-border pl-4">
                <p className="font-medium">{tip.title}</p>
                <p className="text-sm text-muted-foreground">{tip.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="animate-rise [animation-delay:280ms]">
          <Button size="lg" render={<Link href="/" />} nativeButton={false}>
            Try the Analyzer
            <ArrowRight />
          </Button>
        </section>
      </div>
    </ContentLayout>
  );
}
