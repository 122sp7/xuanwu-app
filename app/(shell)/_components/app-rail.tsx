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
import {
  Building2,
  CalendarDays,
  ClipboardList,
  FlaskConical,
  NotebookText,
  Plus,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { AuthUser } from "@/app/providers/auth-context";
import type { ActiveAccount } from "@/app/providers/app-context";
import type { AccountEntity } from "@/modules/platform/api";
import { type WorkspaceEntity } from "@/modules/workspace/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui-shadcn/ui/tooltip";
import { CreateOrganizationDialog } from "./create-organization-dialog";
import { CreateWorkspaceDialogRail } from "./create-workspace-dialog-rail";

interface AppRailProps {
  readonly pathname: string;
  readonly user: AuthUser | null;
  readonly activeAccount: ActiveAccount | null;
  readonly organizationAccounts: AccountEntity[];
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly isOrganizationAccount: boolean;
  readonly onSelectPersonal: () => void;
  readonly onSelectOrganization: (account: AccountEntity) => void;
  readonly activeWorkspaceId: string | null;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
  readonly onOrganizationCreated?: (account: AccountEntity) => void;
  readonly onSignOut: () => void;
}

interface RailItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** When false the item is hidden; defaults to true */
  show?: boolean;
  isActive?: (pathname: string) => boolean;
}

function isExactOrChildPath(targetPath: string, pathname: string) {
  return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}

function getInitial(name: string | undefined | null): string {
  return name?.trim().charAt(0).toUpperCase() || "U";
}

export function AppRail({
  pathname,
  user,
  activeAccount,
  organizationAccounts,
  workspaces,
  workspacesHydrated,
  isOrganizationAccount,
  onSelectPersonal,
  onSelectOrganization,
  activeWorkspaceId,
  onSelectWorkspace,
  onOrganizationCreated,
  onSignOut: _onSignOut,
}: AppRailProps) {
  const router = useRouter();
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const railItems: RailItem[] = [
    // ── Organization / hub layer ─────────────────────────────────────
    {
      href: "/workspace",
      label: "工作區中心",
      icon: <Building2 className="size-[18px]" />,
    },
    // ── People (org-only) ─────────────────────────────────────────
    {
      href: "/organization/members",
      label: "成員",
      icon: <UserRound className="size-[18px]" />,
      show: isOrganizationAccount,
      isActive: (currentPathname) => isExactOrChildPath("/organization/members", currentPathname),
    },
    {
      href: "/organization/teams",
      label: "團隊",
      icon: <Users className="size-[18px]" />,
      show: isOrganizationAccount,
      isActive: (currentPathname) => isExactOrChildPath("/organization/teams", currentPathname),
    },
    // ── Operations (org-only) ─────────────────────────────────────
    {
      href: "/organization/daily",
      label: "每日",
      icon: <NotebookText className="size-[18px]" />,
      show: isOrganizationAccount,
      isActive: (currentPathname) => isExactOrChildPath("/organization/daily", currentPathname),
    },
    {
      href: "/organization/schedule",
      label: "排程",
      icon: <CalendarDays className="size-[18px]" />,
      show: isOrganizationAccount,
      isActive: (currentPathname) => isExactOrChildPath("/organization/schedule", currentPathname),
    },
    // ── Admin (org-only) ──────────────────────────────────────────
    {
      href: "/organization/audit",
      label: "稽核",
      icon: <ClipboardList className="size-[18px]" />,
      show: isOrganizationAccount,
      isActive: (currentPathname) => isExactOrChildPath("/organization/audit", currentPathname),
    },
    {
      href: "/organization/permissions",
      label: "權限",
      icon: <SlidersHorizontal className="size-[18px]" />,
      show: isOrganizationAccount,
      isActive: (currentPathname) => isExactOrChildPath("/organization/permissions", currentPathname),
    },
    // ── Developer ────────────────────────────────────────────────
    {
      href: "/dev-tools",
      label: "開發工具",
      icon: <FlaskConical className="size-[18px]" />,
    },
  ];

  const visibleRailItems = railItems.filter((item) => item.show !== false);

  const sortedWorkspaces = useMemo(
    () => [...workspaces].sort((a, b) => a.name.localeCompare(b.name, "zh-Hant")),
    [workspaces],
  );

  const accountName = activeAccount?.name ?? user?.name ?? "—";

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
                  aria-label="切換帳號情境"
                  className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold tracking-tight text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {getInitial(accountName)}
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[180px]">
              <p className="text-xs font-medium">{accountName}</p>
              <p className="text-[10px] text-muted-foreground">
                {isOrganizationAccount ? "組織帳號" : "個人帳號"}
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
        <nav className="flex flex-col items-center gap-0.5" aria-label="主要導覽">
          {visibleRailItems.map((item) => {
            const active = item.isActive?.(pathname) ?? isActive(item.href);

            if (item.href === "/workspace") {
              return (
                <DropdownMenu key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-current={active ? "page" : undefined}
                          aria-label="工作區中心：切換工作區"
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {item.icon}
                        </button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-xs">工作區中心：切換工作區</p>
                    </TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent side="right" align="start" className="w-56">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">工作區</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/workspace");
                      }}
                      className={pathname === "/workspace" ? "bg-primary/10 text-primary" : ""}
                    >
                      工作區中心
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!workspacesHydrated ? (
                      <DropdownMenuItem disabled>工作區載入中...</DropdownMenuItem>
                    ) : sortedWorkspaces.length === 0 ? (
                      <DropdownMenuItem disabled>目前帳號沒有工作區</DropdownMenuItem>
                    ) : (
                      sortedWorkspaces.map((workspace) => (
                        <DropdownMenuItem
                          key={workspace.id}
                          onClick={() => {
                            onSelectWorkspace(workspace.id);
                            router.push(`/workspace/${workspace.id}`);
                          }}
                          className={activeWorkspaceId === workspace.id ? "bg-primary/10 text-primary" : ""}
                        >
                          <span className="truncate">{workspace.name}</span>
                        </DropdownMenuItem>
                      ))
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setIsCreateWorkspaceOpen(true);
                      }}
                      className="gap-2 text-primary"
                    >
                      <Plus className="size-3.5 shrink-0" />
                      <span>建立工作區</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

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

        <div className="h-1" />
      </aside>

      {/* ── Create organization dialog ─────────────────────────────── */}
      <CreateOrganizationDialog
        open={isCreateOrgOpen}
        onOpenChange={setIsCreateOrgOpen}
        user={user}
        onOrganizationCreated={onOrganizationCreated}
        onNavigate={(href) => { router.push(href); }}
      />

      {/* ── Create workspace dialog ────────────────────────────────── */}
      <CreateWorkspaceDialogRail
        open={isCreateWorkspaceOpen}
        onOpenChange={setIsCreateWorkspaceOpen}
        activeAccount={activeAccount}
        isOrganizationAccount={isOrganizationAccount}
        onNavigate={(href) => { router.push(href); }}
      />
    </TooltipProvider>
  );
}
