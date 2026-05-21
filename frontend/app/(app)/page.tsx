"use client";

import SyllogismForm from "@/components/features/inputSyllogism";
import { ResultPanel } from "@/components/features/result-panel";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useSyllogism } from "@/hooks/use-syllogism";

export default function AnalyzerPage() {
  const { analyze, loading, error, result, status } = useSyllogism();

  return (
    <ContentLayout title="Analyzer">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="animate-rise space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Categorical inference
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            State two premises. Infer the conclusion.
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Inferex parses ordinary-language premises, finds the shared middle
            term, and derives a valid categorical conclusion — if one follows.
          </p>
        </header>

        <div className="animate-rise [animation-delay:80ms]">
          <SyllogismForm onAnalyze={analyze} loading={loading} />
        </div>

        <div className="animate-rise [animation-delay:160ms]">
          <ResultPanel status={status} result={result} error={error} />
        </div>
      </div>
    </ContentLayout>
  );
}
