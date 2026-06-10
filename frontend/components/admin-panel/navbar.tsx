import { ModeToggle } from "@/components/mode-toggle";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 flex h-16 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {title}
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-1">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
