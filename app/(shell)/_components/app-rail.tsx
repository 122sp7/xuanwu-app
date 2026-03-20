"use client";

/**
 * Module: app-rail.tsx
 * Purpose: render the narrow leftmost icon rail (app rail) of the authenticated shell.
 * Responsibilities: top-level section navigation via icon buttons, account context
 *   indicator, and quick sign-out via user avatar dropdown.
 * Constraints: UI-only; business logic stays in providers and module use-cases.
 *   Follows the two-column sidebar pattern referenced from Plane's AppRailRoot.
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
      icon: <LayoutDashboard className="size-5" />,
    },
    {
      href: "/workspace",
      label: "Workspace Hub",
      icon: <Building2 className="size-5" />,
    },
    {
      href: "/organization",
      label: "Organization",
      icon: <Users className="size-5" />,
      show: isOrganizationAccount,
    },
    {
      href: "/settings",
      label: "Personal Settings",
      icon: <Settings className="size-5" />,
      show: !isOrganizationAccount,
    },
  ];

  const visibleRailItems = railItems.filter((item) => item.show !== false);

  const accountName = activeAccount?.name ?? user?.name ?? "—";

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        aria-label="App navigation rail"
        className="hidden w-12 shrink-0 flex-col items-center border-r border-border/50 bg-card/20 py-3 md:flex"
      >
        {/* ── App logo ──────────────────────────────────────────────── */}
        <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary select-none">
          玄
        </div>

        <div className="my-2 h-px w-7 bg-border/50" />

        {/* ── Account context bubble ────────────────────────────────── */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Switch account context"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-foreground transition hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {getInitial(accountName)}
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[160px]">
              <p className="text-xs font-medium">{accountName}</p>
              <p className="text-[10px] text-muted-foreground">
                {isOrganizationAccount ? "Organization" : "Personal"}
              </p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent side="right" align="start" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Account</DropdownMenuLabel>
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
        <nav className="flex flex-col items-center gap-1">
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
      </aside>
    </TooltipProvider>
  );
}
