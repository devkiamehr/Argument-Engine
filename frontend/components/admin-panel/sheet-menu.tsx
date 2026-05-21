import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin-panel/menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@/components/ui/sheet";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" render={<Button className="h-8" variant="outline" size="icon" />}><MenuIcon size={20} /></SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button className="flex items-center justify-center gap-2 pb-2 pt-1 hover:no-underline" variant="link" render={<Link href="/" className="flex items-center gap-2" />} nativeButton={false}><span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-md bg-primary font-mono text-xl leading-none text-primary-foreground">∴</span><SheetTitle className="font-display text-xl font-semibold tracking-tight">Inferex</SheetTitle></Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
