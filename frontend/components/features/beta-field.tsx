import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BetaFieldProps = {
  label: string;
  /**
   * The live value once the backend exposes it. While undefined, the field
   * renders as a "beta" placeholder. Wiring it up later is just passing a value
   * here from the result panel.
   */
  value?: string | null;
  className?: string;
};

// A single engine readout (mood / figure / validity). The backend doesn't
// return these yet, so they show as dimmed, "beta"-tagged placeholders.
export function BetaField({ label, value, className }: BetaFieldProps) {
  const pending = value === undefined || value === null;

  return (
    <div
      className={cn("flex items-center justify-between gap-4 py-2", className)}
      aria-disabled={pending}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "font-mono text-sm tabular-nums",
            pending ? "text-muted-foreground/45" : "text-foreground"
          )}
        >
          {pending ? "—" : value}
        </span>
        {pending && <Badge variant="beta">beta</Badge>}
      </div>
    </div>
  );
}
