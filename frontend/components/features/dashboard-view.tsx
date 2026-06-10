"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Loader2 } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { PageHeading } from "@/components/features/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listSyllogisms, type Syllogism } from "@/lib/api";

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

type Stat = { label: string; value: string; hint: string };

function StatCard({ stat }: { stat: Stat }) {
  return (
    <Card size="sm" className="justify-between">
      <CardContent className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {stat.label}
        </p>
        <p className="font-display text-4xl font-semibold tabular-nums text-foreground">
          {stat.value}
        </p>
        <p className="text-xs text-muted-foreground">{stat.hint}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardView() {
  const { user } = useAuth();
  const [items, setItems] = useState<Syllogism[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await listSyllogisms();
        if (active) setItems(data);
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo<Stat[]>(() => {
    const moods = items.map((s) => s.mood).filter((m): m is string => !!m);
    const figures = items.map((s) => s.figure).filter((f): f is string => !!f);

    const mostFrequent = (arr: string[]) =>
      arr.length
        ? [...new Set(arr)].sort(
            (a, b) =>
              arr.filter((x) => x === b).length -
              arr.filter((x) => x === a).length
          )[0]
        : null;

    return [
      {
        label: "Analyzed",
        value: String(items.length),
        hint: "total syllogisms",
      },
      {
        label: "Top mood",
        value: mostFrequent(moods) ?? "—",
        hint: "most frequent",
      },
      {
        label: "Top figure",
        value: mostFrequent(figures) ?? "—",
        hint: "most frequent",
      },
      {
        label: "Forms used",
        value: String(new Set(moods).size),
        hint: "distinct moods",
      },
    ];
  }, [items]);

  const recent = items.slice(0, 5);
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "there";

  return (
    <div className="space-y-8">
      <PageHeading
        eyebrow="Overview"
        title={`Welcome back, ${firstName}`}
        description="A summary of the syllogisms you've analyzed and saved."
      />

      <div className="grid animate-rise grid-cols-2 gap-4 [animation-delay:80ms] lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid animate-rise gap-4 [animation-delay:160ms] lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardContent className="space-y-4 py-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Recent activity
            </p>

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm">Loading…</span>
              </div>
            ) : recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
                  <Clock className="size-5" />
                </span>
                <p className="font-medium">Nothing here yet</p>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Your analyzed syllogisms will show up here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border/70">
                {recent.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{s.conclusion}</p>
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        {s.lineOne}; {s.lineTwo}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {formatDate(s.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {!loading && items.length > recent.length && (
              <Link
                href="/history"
                className="inline-block font-mono text-xs font-medium text-foreground underline underline-offset-4"
              >
                View all {items.length}
              </Link>
            )}
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
  );
}
