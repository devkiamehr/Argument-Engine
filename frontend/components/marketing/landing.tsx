"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, MoveRight, PenLine, Workflow } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PROPOSITION_TYPES, SUPPORTED_MOODS } from "@/lib/syllogism-reference";

/* ------------------------------- utilities ------------------------------- */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

// Reveals children on scroll into view (transition-based, reduced-motion safe).
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out",
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </p>
  );
}

/* ----------------------------- live hero demo ---------------------------- */

const DEMOS = [
  {
    p1: "All men are mortal",
    p2: "Socrates is a man",
    conclusion: "Socrates is mortal",
    mood: "AAA",
    figure: "1",
  },
  {
    p1: "All dogs are animals",
    p2: "All retrievers are dogs",
    conclusion: "All retrievers are animals",
    mood: "AAA",
    figure: "1",
  },
  {
    p1: "All philosophers are thinkers",
    p2: "Some Greeks are philosophers",
    conclusion: "Some Greeks are thinkers",
    mood: "AII",
    figure: "1",
  },
];

function LiveDemo() {
  const reduced = usePrefersReducedMotion();
  const [idx, setIdx] = useState(0);
  const onCycle = useCallback(
    () => setIdx((i) => (i + 1) % DEMOS.length),
    []
  );

  // Remounting per example (key={idx}) resets the typewriter state cleanly, so
  // every setState happens inside a timeout callback rather than in the effect.
  return (
    <DemoExample
      key={idx}
      demo={DEMOS[idx]}
      reduced={reduced}
      onCycle={onCycle}
    />
  );
}

function DemoExample({
  demo,
  reduced,
  onCycle,
}: {
  demo: (typeof DEMOS)[number];
  reduced: boolean;
  onCycle: () => void;
}) {
  const [t1, setT1] = useState(() => (reduced ? demo.p1.length : 0));
  const [t2, setT2] = useState(() => (reduced ? demo.p2.length : 0));
  const [revealed, setRevealed] = useState(() => reduced);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (reduced) {
      timers.push(setTimeout(onCycle, 4200));
      return () => timers.forEach(clearTimeout);
    }

    const speed = 40;
    let clock = 450;
    for (let i = 1; i <= demo.p1.length; i++) {
      const n = i;
      timers.push(setTimeout(() => setT1(n), clock));
      clock += speed;
    }
    clock += 320;
    for (let i = 1; i <= demo.p2.length; i++) {
      const n = i;
      timers.push(setTimeout(() => setT2(n), clock));
      clock += speed;
    }
    clock += 520;
    timers.push(setTimeout(() => setRevealed(true), clock));
    clock += 3200;
    timers.push(setTimeout(onCycle, clock));

    return () => timers.forEach(clearTimeout);
  }, [demo, reduced, onCycle]);

  const caretLine = t1 < demo.p1.length ? 1 : t2 < demo.p2.length ? 2 : 0;

  return (
    <div className="relative rounded-2xl border border-border bg-card/80 p-1.5 shadow-2xl shadow-primary/10 ring-1 ring-foreground/5 backdrop-blur">
      {/* window chrome */}
      <div className="flex items-center gap-2 px-3.5 py-2.5">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="ml-2 font-mono text-[11px] tracking-wide text-muted-foreground">
          inferex · analyzer
        </span>
      </div>

      <div className="rounded-xl bg-surface px-6 py-7 sm:px-8 sm:py-9">
        {/* premises */}
        <div className="space-y-5">
          <div>
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Premise 01
            </p>
            <p className="min-h-[1.75rem] font-mono text-base text-foreground sm:text-lg">
              {demo.p1.slice(0, t1)}
              {caretLine === 1 && (
                <span className="ml-0.5 inline-block h-[1.05em] w-[2px] -translate-y-[1px] animate-caret bg-primary align-middle" />
              )}
            </p>
          </div>
          <div>
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Premise 02
            </p>
            <p className="min-h-[1.75rem] font-mono text-base text-foreground sm:text-lg">
              {demo.p2.slice(0, t2)}
              {caretLine === 2 && (
                <span className="ml-0.5 inline-block h-[1.05em] w-[2px] -translate-y-[1px] animate-caret bg-primary align-middle" />
              )}
            </p>
          </div>
        </div>

        {/* conclusion */}
        <div className="mt-7 border-t border-border pt-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Conclusion
          </p>
          <div
            className={cn(
              "transition-all duration-500 ease-out",
              revealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
          >
            <p className="flex items-start gap-3 font-display text-2xl font-medium leading-snug text-foreground sm:text-3xl">
              <span aria-hidden className="text-primary">
                ∴
              </span>
              <span>{demo.conclusion}</span>
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="font-mono tabular-nums">
                {demo.mood}
              </Badge>
              <Badge variant="outline" className="font-mono tabular-nums">
                Figure {demo.figure}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- sections ------------------------------- */

const STEPS = [
  {
    icon: PenLine,
    title: "Write",
    body: "Type two premises in ordinary English — no notation, no symbols.",
    sample: ["all men are mortal", "socrates is a man"],
  },
  {
    icon: Workflow,
    title: "Resolve",
    body: "Inferex classifies each premise as A, E, I, or O and locates the shared middle term.",
    sample: ["A · all men are mortal", "middle term → man"],
  },
  {
    icon: Check,
    title: "Conclude",
    body: "It checks the mood and figure against the valid forms and returns the conclusion.",
    sample: ["mood AAA · figure 1", "∴ socrates is mortal"],
  },
];

function LandingNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-md bg-primary font-mono text-xl leading-none text-primary-foreground"
          >
            ∴
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Inferex
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#how"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </a>
          <a
            href="#forms"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Forms
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/login" />}
            nativeButton={false}
          >
            Sign in
          </Button>
          <Button
            size="sm"
            render={<Link href="/signup" />}
            nativeButton={false}
          >
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}

export function Landing() {
  return (
    <div className="relative min-h-screen scroll-smooth">
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-[-12%] h-[55vh] w-[85vw] max-w-5xl -translate-x-1/2 animate-glow rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, color-mix(in oklch, var(--primary) 22%, transparent), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(var(--foreground) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <LandingNav />

      {/* hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <div className="animate-rise">
              <Eyebrow>Categorical inference engine</Eyebrow>
            </div>
            <h1 className="animate-rise mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight [animation-delay:60ms] sm:text-6xl">
              State your premises.
              <br />
              <span className="text-primary">Inferex finds</span> what
              follows.
            </h1>
            <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground [animation-delay:140ms]">
              Inferex reads two premises written in plain language, detects the
              shared middle term, and derives a valid categorical conclusion —
              the way Aristotle would, in an instant.
            </p>
            <div className="animate-rise mt-9 flex flex-wrap items-center gap-3 [animation-delay:220ms]">
              <Button
                size="lg"
                render={<Link href="/signup" />}
                nativeButton={false}
              >
                Get started — it&apos;s free
                <ArrowRight />
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={<Link href="/login" />}
                nativeButton={false}
              >
                Sign in
              </Button>
            </div>
            <p className="animate-rise mt-5 font-mono text-xs text-muted-foreground [animation-delay:300ms]">
              Free account · Your syllogisms, saved
            </p>
          </div>

          <div className="animate-rise [animation-delay:200ms]">
            <LiveDemo />
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="scroll-mt-24 border-t border-border/60 py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              From a sentence to a syllogism, in three moves
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 110}>
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/5">
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <step.icon className="size-5" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                  <div className="mt-auto space-y-1 rounded-lg bg-surface-muted px-3 py-2.5 font-mono text-xs text-muted-foreground">
                    {step.sample.map((line) => (
                      <p key={line} className="truncate">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* proposition types + forms */}
      <section
        id="forms"
        className="scroll-mt-24 border-t border-border/60 py-20"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <Eyebrow>The grammar of logic</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Four kinds of statement. Nineteen valid forms.
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Every premise is a universal or particular, affirmative or
                negative — an A, E, I, or O. Inferex recognises each, then
                validates the figure your two premises make.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-md">
                {PROPOSITION_TYPES.map((p) => (
                  <div
                    key={p.code}
                    className="rounded-xl border border-border bg-card px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {p.code}
                      </Badge>
                      <span className="font-mono text-xs text-muted-foreground">
                        {p.form}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {p.name}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/5 sm:p-8">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Valid moods
                  </span>
                  <span className="font-display text-3xl font-semibold tabular-nums">
                    {SUPPORTED_MOODS.length}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {SUPPORTED_MOODS.map((mood, i) => (
                    <Reveal key={mood} delay={i * 24}>
                      <span className="inline-flex rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-sm tabular-nums text-foreground">
                        {mood}
                      </span>
                    </Reveal>
                  ))}
                </div>
                <p className="mt-6 font-mono text-xs leading-relaxed text-muted-foreground">
                  Each mood pairs the two premise types with a figure — the
                  position of the middle term. Inferex treats exactly these as
                  valid.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* closing CTA */}
      <section className="border-t border-border/60 py-24">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <Reveal>
            <span
              aria-hidden
              className="font-mono text-5xl leading-none text-primary"
            >
              ∴
            </span>
            <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Put an argument to the test
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Create a free account and infer your first conclusion in seconds.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                render={<Link href="/signup" />}
                nativeButton={false}
              >
                Create your account
                <MoveRight />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid size-7 place-items-center rounded-md bg-primary font-mono text-base leading-none text-primary-foreground"
            >
              ∴
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Inferex
            </span>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            Categorical syllogism analysis
          </p>
          <div className="flex items-center gap-5 text-sm">
            <Link
              href="/login"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
