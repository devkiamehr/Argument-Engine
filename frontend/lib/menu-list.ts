import {
  Settings,
  BookOpen,
  History,
  LayoutGrid,
  ScanSearch,
  LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

// `active` is computed explicitly so the Analyzer ("/") isn't always matched
// by the menu's default `pathname.startsWith(href)` rule.
export function getMenuList(pathname: string): Group[] {
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Analyzer",
          icon: ScanSearch,
          active: isActive("/"),
          submenus: []
        },
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          active: isActive("/dashboard"),
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Library",
      menus: [
        {
          href: "/history",
          label: "History",
          icon: History,
          active: isActive("/history")
        },
        {
          href: "/learn",
          label: "Learn",
          icon: BookOpen,
          active: isActive("/learn")
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/account",
          label: "Account",
          icon: Settings,
          active: isActive("/account")
        }
      ]
    }
  ];
}
