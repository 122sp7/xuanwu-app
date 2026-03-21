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
import { BookOpen, Bot, Building2, Plus, Settings, Users } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { AuthUser } from "@/app/providers/auth-context";
import type { ActiveAccount } from "@/app/providers/app-context";
import type { AccountEntity } from "@/modules/account/domain/entities/Account";
import { createOrganization } from "@/modules/organization";
import { Avatar, AvatarFallback } from '@ui-shadcn';
import { Button } from '@ui-shadcn';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui-shadcn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui-shadcn';
import { Input } from '@ui-shadcn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui-shadcn';

interface AppRailProps {
  readonly pathname: string;
  readonly user: AuthUser | null;
  readonly activeAccount: ActiveAccount | null;
  readonly organizationAccounts: AccountEntity[];
  readonly isOrganizationAccount: boolean;
  readonly onSelectPersonal: () => void;
  readonly onSelectOrganization: (account: AccountEntity) => void;
  readonly onOrganizationCreated?: (account: AccountEntity) => void;
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
  onOrganizationCreated,
  onSignOut,
}: AppRailProps) {
  const router = useRouter();
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgError, setOrgError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  function resetDialog() {
    setOrgName("");
    setOrgError(null);
    setIsCreating(false);
  }

  async function handleCreateOrg(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      setOrgError("帳號資訊已失效，請重新登入後再建立組織。");
      return;
    }
    const name = orgName.trim();
    if (!name) {
      setOrgError("請輸入組織名稱。");
      return;
    }
    setIsCreating(true);
    setOrgError(null);
    const result = await createOrganization({
      organizationName: name,
      ownerId: user.id,
      ownerName: user.name,
      ownerEmail: user.email,
    });
    if (!result.success) {
      setOrgError(result.error.message);
      setIsCreating(false);
      return;
    }
    const newAccount: AccountEntity = {
      id: result.aggregateId,
      name,
      accountType: "organization",
      ownerId: user.id,
    };
    onOrganizationCreated?.(newAccount);
    resetDialog();
    setIsCreateOrgOpen(false);
    router.push("/organization");
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const railItems: RailItem[] = [
    {
      href: "/workspace",
      label: "Workspace Hub",
      icon: <Building2 className="size-[18px]" />,
    },
    {
      href: "/wiki",
      label: "Wiki",
      icon: <BookOpen className="size-[18px]" />,
    },
    {
      href: "/ai-chat",
      label: "AI Chat",
      icon: <Bot className="size-[18px]" />,
    },
    {
      href: "/organization",
      label: "Organization",
      icon: <Users className="size-[18px]" />,
      show: isOrganizationAccount,
    },
  ];

  /** Settings is pinned above the avatar, separate from main nav */
  const settingsHref = "/settings";

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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setIsCreateOrgOpen(true);
              }}
              className="gap-2 text-primary"
            >
              <Plus className="size-3.5 shrink-0" />
              <span>建立組織</span>
            </DropdownMenuItem>
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

        {/* ── Settings (pinned above avatar) ────────────────────────── */}
        <div className="mb-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={settingsHref}
                aria-current={isActive(settingsHref) ? "page" : undefined}
                aria-label="Personal Settings"
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                  isActive(settingsHref)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Settings className="size-[18px]" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Personal Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>

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

      {/* ── Create organization dialog ─────────────────────────────── */}
      <Dialog
        open={isCreateOrgOpen}
        onOpenChange={(open) => {
          setIsCreateOrgOpen(open);
          if (!open) resetDialog();
        }}
      >
        <DialogContent aria-describedby="rail-create-org-description">
          <DialogHeader>
            <DialogTitle>建立新組織</DialogTitle>
            <DialogDescription id="rail-create-org-description">
              輸入名稱後會直接建立組織並切換到新的組織內容。
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateOrg}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="rail-organization-name">
                組織名稱
              </label>
              <Input
                id="rail-organization-name"
                value={orgName}
                onChange={(e) => {
                  setOrgName(e.target.value);
                  if (orgError) setOrgError(null);
                }}
                placeholder="例如：Gig Team"
                autoFocus
                disabled={isCreating}
                maxLength={80}
              />
              {orgError && <p className="text-sm text-destructive">{orgError}</p>}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetDialog();
                  setIsCreateOrgOpen(false);
                }}
                disabled={isCreating}
              >
                取消
              </Button>
              <Button type="submit" disabled={isCreating || !user}>
                {isCreating ? "建立中…" : "直接建立"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
