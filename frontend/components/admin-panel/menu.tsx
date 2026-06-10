"use client";

import Link from "next/link";
import { Ellipsis, LogIn, LogOut, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";

interface MenuProps {
  isOpen: boolean | undefined;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "∴";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const menuList = getMenuList(pathname);
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <nav className="mt-8 flex w-full min-h-0 flex-1 flex-col">
        <ul className="flex flex-1 flex-col items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  !submenus || submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger render={<Button variant={
                                                                                                                (active === undefined &&
                                                                                                                  pathname.startsWith(href)) ||
                                                                                                                active
                                                                                                                  ? "secondary"
                                                                                                                  : "ghost"
                                                                                                              } className="w-full justify-start h-10 mb-1" render={<Link href={href} />} nativeButton={false} />}><span
                                                                                                                  className={cn(isOpen === false ? "" : "mr-4")}
                                                                                                                >
                                                                                                                  <Icon size={18} />
                                                                                                                </span><p
                                                                                                                  className={cn(
                                                                                                                    "max-w-[200px] truncate",
                                                                                                                    isOpen === false
                                                                                                                      ? "-translate-x-96 opacity-0"
                                                                                                                      : "translate-x-0 opacity-100"
                                                                                                                  )}
                                                                                                                >
                                                                                                                  {label}
                                                                                                                </p></TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={
                          active === undefined
                            ? pathname.startsWith(href)
                            : active
                        }
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
          <li className="w-full grow flex items-end">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-10 mt-5",
                        isOpen === false ? "justify-center" : "justify-start"
                      )}
                      aria-label="Account"
                    />
                  }
                >
                  <Avatar className={cn("h-6 w-6", isOpen === false ? "" : "mr-4")}>
                    <AvatarFallback className="bg-transparent font-mono text-xs">
                      {initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <p
                    className={cn(
                      "max-w-[160px] truncate",
                      isOpen === false ? "opacity-0 hidden" : "opacity-100"
                    )}
                  >
                    Account
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" sideOffset={12} align="end" className="w-60">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="truncate text-sm font-medium leading-none">{user.name}</p>
                      <p className="truncate font-mono text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    render={<Link href="/account" className="flex items-center" />}
                  >
                    <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                    Account settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="outline"
                        className="w-full justify-center h-10 mt-5"
                        render={<Link href="/login" />}
                        nativeButton={false}
                      />
                    }
                  >
                    <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <LogIn size={18} />
                    </span>
                    <p
                      className={cn(
                        "whitespace-nowrap",
                        isOpen === false ? "opacity-0 hidden" : "opacity-100"
                      )}
                    >
                      Sign in
                    </p>
                  </TooltipTrigger>
                  {isOpen === false && (
                    <TooltipContent side="right">Sign in</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}
          </li>
        </ul>
    </nav>
  );
}
