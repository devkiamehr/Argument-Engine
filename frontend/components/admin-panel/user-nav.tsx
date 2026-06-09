"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutGrid, LogIn, LogOut, Settings, UserPlus } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
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

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "∴";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserNav() {
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger render={<DropdownMenuTrigger render={<Button variant="outline" className="relative h-8 w-8 rounded-full" />} />}><Avatar className="h-8 w-8">
                                                          <AvatarFallback className="bg-transparent font-mono text-sm">{user ? initials(user.name) : "∴"}</AvatarFallback>
                                                        </Avatar></TooltipTrigger>
          <TooltipContent side="bottom">Account</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        {user ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="truncate font-mono text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:cursor-pointer" render={<Link href="/dashboard" className="flex items-center" />}><LayoutGrid className="mr-3 h-4 w-4 text-muted-foreground" />Dashboard
                                  </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer" render={<Link href="/account" className="flex items-center" />}><Settings className="mr-3 h-4 w-4 text-muted-foreground" />Account
                                  </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
              Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Not signed in</p>
                <p className="font-mono text-xs leading-none text-muted-foreground">
                  Inferex
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:cursor-pointer" render={<Link href="/login" className="flex items-center" />}><LogIn className="mr-3 h-4 w-4 text-muted-foreground" />Sign in
                                  </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer" render={<Link href="/signup" className="flex items-center" />}><UserPlus className="mr-3 h-4 w-4 text-muted-foreground" />Create account
                                  </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
