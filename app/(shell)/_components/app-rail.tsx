"use client";

/**
 * Module: app-rail.tsx
 * Purpose: render the narrow leftmost icon rail (app rail) of the authenticated shell.
 * Responsibilities: app logo, account context switcher, top-level section icon nav with
 *   tooltips, and quick sign-out via user avatar dropdown at the bottom.
 * Constraints: UI-only; follows the two-column sidebar pattern from Plane's AppRailRoot.
 *   `h-full` ensures it fills the parent `h-screen` container.
 */

import Link from "next/link";
import { Building2, LayoutDashboard, Settings, Users } from "lucide-react";

import type { AuthUser } from "@/app/providers/auth-context";
import type { ActiveAccount } from "@/app/providers/app-context";
import type { AccountEntity } from "@/modules/account/domain/entities/Account";
import { Avatar, AvatarFallback } from "@/ui/shadcn/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/shadcn/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/shadcn/ui/tooltip";

interface AppRailProps {
  readonly pathname: string;
  readonly user: AuthUser | null;
  readonly activeAccount: ActiveAccount | null;
  readonly organizationAccounts: AccountEntity[];
  readonly isOrganizationAccount: boolean;
  readonly onSelectPersonal: () => void;
  readonly onSelectOrganization: (account: AccountEntity) => void;
  readonly onSignOut: () => void;
}

interface RailItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** When false the item is hidden; defaults to true */
  show?: boolean;
}

function getInitial(name: string | undefined | null): string {
  return name?.trim().charAt(0).toUpperCase() || "U";
}

/** Compact 8px colour strip shown at bottom of the workspace logo tile. */
function getAccountColour(name: string | undefined | null): string {
  const palette = [
    "bg-violet-500",
    "bg-blue-500",
    "bg-cyan-500",
    "bg-teal-500",
    "bg-green-500",
    "bg-amber-500",
    "bg-orange-500",
    "bg-rose-500",
  ];
  if (!name) return palette[0];
  const idx = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % palette.length;
  return palette[idx];
}

export function AppRail({
  pathname,
  user,
  activeAccount,
  organizationAccounts,
  isOrganizationAccount,
  onSelectPersonal,
  onSelectOrganization,
  onSignOut,
}: AppRailProps) {
  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const railItems: RailItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="size-[18px]" />,
    },
    {
      href: "/workspace",
      label: "Workspace Hub",
      icon: <Building2 className="size-[18px]" />,
    },
    {
      href: "/organization",
      label: "Organization",
      icon: <Users className="size-[18px]" />,
      show: isOrganizationAccount,
    },
    {
      href: "/settings",
      label: "Personal Settings",
      icon: <Settings className="size-[18px]" />,
    },
  ];

  const visibleRailItems = railItems.filter((item) => item.show !== false);

  const accountName = activeAccount?.name ?? user?.name ?? "—";
  const accentColour = getAccountColour(accountName);

  return (
    <TooltipProvider delayDuration={400}>
      <aside
        aria-label="App navigation rail"
        className="hidden h-full w-12 shrink-0 flex-col items-center border-r border-border/50 bg-card/40 py-2 md:flex"
      >
        {/* ── Workspace / account logo tile ─────────────────────────── */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Switch account context"
                  className="group mb-1 flex size-8 flex-col overflow-hidden rounded-lg border border-border/60 bg-background text-xs font-bold tracking-tight text-foreground shadow-sm transition hover:border-border hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {/* Logo area */}
                  <span className="flex flex-1 items-center justify-center text-[13px] font-semibold">
                    {getInitial(accountName)}
                  </span>
                  {/* Colour accent strip at bottom */}
                  <span className={`h-1 w-full rounded-b-lg ${accentColour}`} />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[180px]">
              <p className="text-xs font-medium">{accountName}</p>
              <p className="text-[10px] text-muted-foreground">
                {isOrganizationAccount ? "Organization" : "Personal"}
              </p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent side="right" align="start" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground">切換帳號</DropdownMenuLabel>
            {user && (
              <DropdownMenuItem
                onClick={onSelectPersonal}
                className={activeAccount?.id === user.id ? "bg-primary/10 text-primary" : ""}
              >
                <span className="truncate">{user.name} (Personal)</span>
              </DropdownMenuItem>
            )}
            {organizationAccounts.map((account) => (
              <DropdownMenuItem
                key={account.id}
                onClick={() => {
                  onSelectOrganization(account);
                }}
                className={activeAccount?.id === account.id ? "bg-primary/10 text-primary" : ""}
              >
                <span className="truncate">{account.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="my-2 h-px w-7 bg-border/50" />

        {/* ── Section nav icons ─────────────────────────────────────── */}
        <nav className="flex flex-col items-center gap-0.5" aria-label="Top-level navigation">
          {visibleRailItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    aria-label={item.label}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* ── Spacer ────────────────────────────────────────────────── */}
        <div className="flex-1" />

        {/* ── User avatar / sign-out ────────────────────────────────── */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Open user menu"
                  className="rounded-full ring-offset-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {getInitial(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs font-medium">{user?.name ?? "—"}</p>
              <p className="text-[10px] text-muted-foreground">{user?.email ?? "—"}</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent side="right" align="end" className="w-48">
            <DropdownMenuLabel className="space-y-0.5">
              <p className="truncate text-sm font-medium">{user?.name ?? "—"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email ?? "—"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onSignOut}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-1" />
      </aside>
    </TooltipProvider>
  );
}
