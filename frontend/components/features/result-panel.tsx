"use client";

import { AlertTriangle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { BetaField } from "@/components/features/beta-field";
import type { SyllogismResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

type ResultPanelProps = {
  status: Status;
  result: SyllogismResponse | null;
  error: string | null;
};

function capitalize(text: string) {
  return text.length ? text[0].toUpperCase() + text.slice(1) : text;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  );
}

export function ResultPanel({ status, result, error }: ResultPanelProps) {
  // Error takes the full width — premises need attention before we can infer.
  if (status === "error") {
    return (
      <Card className="border-destructive/30 ring-destructive/15" aria-live="polite">
        <CardContent className="flex items-start gap-3 py-6">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-destructive/12 text-destructive">
            <AlertTriangle className="size-4" />
          </span>
          <div className="space-y-1">
            <Eyebrow>Could not infer</Eyebrow>
            <p className="font-medium text-foreground">{error}</p>
            <p className="text-sm text-muted-foreground">
              Each premise needs at least three words and a shared middle term —
              see{" "}
              <a
                href="/learn"
                className="font-medium text-foreground underline underline-offset-4"
              >
                how it works
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card aria-live="polite" aria-busy={status === "loading"}>
      <CardContent className="grid gap-8 py-7 md:grid-cols-[1fr_15rem]">
        {/* Conclusion */}
        <div className="min-w-0">
          <Eyebrow>Conclusion</Eyebrow>

          {status === "idle" && (
            <p className="mt-3 font-display text-2xl leading-snug text-muted-foreground/55 sm:text-3xl">
              Your inferred conclusion will appear here.
            </p>
          )}

          {status === "loading" && (
            <div className="mt-4 space-y-3" aria-hidden>
              <div className="h-7 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-7 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          )}

          {status === "success" && result && (
            <p className="mt-3 flex items-start gap-3 font-display text-3xl leading-snug font-medium text-foreground sm:text-4xl">
              <span aria-hidden className="text-primary">
                ∴
              </span>
              <span className="min-w-0 break-words">
                {capitalize(result.conclusion)}
              </span>
            </p>
          )}
        </div>

        {/* Engine readouts — beta */}
        <div
          className={cn(
            "md:border-l md:border-border md:pl-8",
            status === "loading" && "opacity-60"
          )}
        >
          <Eyebrow>Engine</Eyebrow>
          <div className="mt-1 divide-y divide-border/70">
            <BetaField label="Mood" value={result?.mood} />
            <BetaField
              label="Figure"
              value={result?.figure ? String(result.figure) : undefined}
            />
            <BetaField
              label="Validity"
              value={
                result?.valid === undefined
                  ? undefined
                  : result.valid
                    ? "valid"
                    : "invalid"
              }
            />
          </div>
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground/70">
            Mood, figure &amp; validity are coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
