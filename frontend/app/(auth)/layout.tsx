import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

// Centered, sidebar-free layout for authentication screens.
export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>

      <Link
        href="/"
        className="mb-10 flex items-center gap-2 font-display text-3xl font-semibold tracking-tight"
      >
        <span
          aria-hidden
          className="grid size-10 place-items-center rounded-lg bg-primary font-mono text-2xl leading-none text-primary-foreground"
        >
          ∴
        </span>
        Inferex
      </Link>

      <div className="w-full max-w-md">{children}</div>

      <p className="mt-10 max-w-md text-center font-mono text-xs text-muted-foreground">
        Your premises and conclusions, saved to your account.
      </p>
    </div>
  );
}
