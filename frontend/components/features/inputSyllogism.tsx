"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SyllogismPayload } from "@/lib/api";

type SyllogismFormProps = {
  onAnalyze: (payload: SyllogismPayload) => void;
  loading: boolean;
};

const EXAMPLES: { label: string; lineOne: string; lineTwo: string }[] = [
  {
    label: "Socrates",
    lineOne: "all men are mortal",
    lineTwo: "socrates is a man",
  },
  {
    label: "Retrievers",
    lineOne: "all dogs are animals",
    lineTwo: "all retrievers are dogs",
  },
  {
    label: "Greeks",
    lineOne: "all philosophers are thinkers",
    lineTwo: "some greeks are philosophers",
  },
];

export default function SyllogismForm({ onAnalyze, loading }: SyllogismFormProps) {
  const [lineOne, setLineOne] = useState("");
  const [lineTwo, setLineTwo] = useState("");

  const canSubmit = lineOne.trim() !== "" && lineTwo.trim() !== "" && !loading;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    onAnalyze({ lineOne: lineOne.trim(), lineTwo: lineTwo.trim() });
  }

  function loadExample(example: (typeof EXAMPLES)[number]) {
    setLineOne(example.lineOne);
    setLineTwo(example.lineTwo);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="premise-one"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            Premise 01 · Major
          </Label>
          <Input
            id="premise-one"
            value={lineOne}
            onChange={(event) => setLineOne(event.target.value)}
            placeholder="all men are mortal"
            autoComplete="off"
            className="h-12 font-mono text-base"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="premise-two"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            Premise 02 · Minor
          </Label>
          <Input
            id="premise-two"
            value={lineTwo}
            onChange={(event) => setLineTwo(event.target.value)}
            placeholder="socrates is a man"
            autoComplete="off"
            className="h-12 font-mono text-base"
          />
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Try
          </span>
          {EXAMPLES.map((example) => (
            <Button
              key={example.label}
              type="button"
              variant="outline"
              size="xs"
              onClick={() => loadExample(example)}
              disabled={loading}
            >
              {example.label}
            </Button>
          ))}
        </div>

        <Button type="submit" size="lg" disabled={!canSubmit} className="sm:w-40">
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Analyzing
            </>
          ) : (
            <>
              Analyze
              <ArrowRight />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
