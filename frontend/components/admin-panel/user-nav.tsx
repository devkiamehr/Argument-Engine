"use client";

import Link from "next/link";
import { LogIn, Settings, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Accounts are not wired up yet (UI shell). This reflects a signed-out
// "preview" state and links to the auth screens.
export function UserNav() {
  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger render={<DropdownMenuTrigger render={<Button variant="outline" className="relative h-8 w-8 rounded-full" />} />}><Avatar className="h-8 w-8">
                                                          <AvatarFallback className="bg-transparent font-mono text-base">∴</AvatarFallback>
                                                        </Avatar></TooltipTrigger>
          <TooltipContent side="bottom">Account</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Not signed in</p>
            <p className="font-mono text-xs leading-none text-muted-foreground">
              Preview mode
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" render={<Link href="/login" className="flex items-center" />}><LogIn className="mr-3 h-4 w-4 text-muted-foreground" />Sign in
                              </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" render={<Link href="/signup" className="flex items-center" />}><UserPlus className="mr-3 h-4 w-4 text-muted-foreground" />Create account
                              </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" render={<Link href="/account" className="flex items-center" />}><Settings className="mr-3 h-4 w-4 text-muted-foreground" />Account settings
                              </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
