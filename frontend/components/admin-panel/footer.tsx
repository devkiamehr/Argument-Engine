import Link from "next/link";

export function Footer() {
  return (
    <div className="z-20 w-full border-t border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-8">
        <p className="font-mono text-xs leading-loose text-muted-foreground">
          Inferex — categorical syllogism analysis.{" "}
          <Link
            href="/learn"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Learn the method
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
