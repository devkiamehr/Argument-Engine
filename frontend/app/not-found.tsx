import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Error 404
      </p>
      <span
        aria-hidden
        className="mt-6 font-mono text-6xl leading-none text-primary"
      >
        ∴
      </span>
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">
        This page doesn&apos;t follow
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        We couldn&apos;t infer a valid route from that address.
      </p>
      <Button
        className="mt-8"
        size="lg"
        render={<Link href="/" />}
        nativeButton={false}
      >
        Back to the Analyzer
      </Button>
    </main>
  );
}
