"use client";

/**
 * ShellAppRail — app/(shell)/_shell composition layer.
 * Moved from modules/platform/interfaces/web/shell/sidebar/ShellAppRail.tsx
 * because it composes downstream modules (workspace).
 *
 * Platform is upstream and must not import downstream modules.
 * app/ is the designated composition layer.
 */

import Link from "next/link";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  NotebookText,
  Plus,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { AuthUser, ActiveAccount, AccountEntity } from "../AppContext";
import { CreateOrganizationDialog } from "../platform-ui-stubs";
import {
  listShellRailCatalogItems,
  isExactOrChildPath,
  resolveShellNavSection,
  buildShellContextualHref,
  type ShellRailCatalogItem,
} from "../../../../index";
import type { WorkspaceEntity } from "../../../../../workspace/adapters/inbound/react/WorkspaceContext";
import { CreateWorkspaceDialogRail } from "../../../../../workspace/adapters/inbound/react/workspace-ui-stubs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/packages/ui-shadcn/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/packages/ui-shadcn/ui/tooltip";

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
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  show?: boolean;
  isActive?: (pathname: string) => boolean;
}

function getInitial(name: string | undefined | null): string {
  return name?.trim().charAt(0).toUpperCase() || "U";
}

const RAIL_ICON_MAP: Record<string, React.ReactNode> = {
  workspace: <Building2 className="size-[18px]" />,
  dashboard: <LayoutDashboard className="size-[18px]" />,
  "org-members": <UserRound className="size-[18px]" />,
  "org-teams": <Users className="size-[18px]" />,
  "org-daily": <NotebookText className="size-[18px]" />,
  "org-schedule": <CalendarDays className="size-[18px]" />,
  "org-audit": <ClipboardList className="size-[18px]" />,
  "org-permissions": <SlidersHorizontal className="size-[18px]" />,
  "dev-tools": <FlaskConical className="size-[18px]" />,
};

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

  const visibleRailItems: RailItem[] = useMemo(() => {
    const catalogItems = listShellRailCatalogItems(isOrganizationAccount);
    return catalogItems.map((item: ShellRailCatalogItem) => ({
      id: item.id,
      href: buildShellContextualHref(item.href, {
        accountId: activeAccount?.id,
        workspaceId: activeWorkspaceId,
      }),
      label: item.label,
      icon: RAIL_ICON_MAP[item.id] ?? null,
      isActive: item.id === "workspace"
        ? (currentPathname: string) => resolveShellNavSection(currentPathname) === "workspace"
        : item.activeRoutePrefix
          ? (currentPathname: string) => isExactOrChildPath(
            buildShellContextualHref(item.activeRoutePrefix!, {
              accountId: activeAccount?.id,
              workspaceId: activeWorkspaceId,
            }),
            currentPathname,
          )
          : undefined,
    }));
  }, [isOrganizationAccount, activeAccount?.id, activeWorkspaceId]);

  const workspaceHubHref = activeAccount?.id
    ? `/${encodeURIComponent(activeAccount.id)}`
    : "/";

  function buildWorkspaceDetailHref(workspaceId: string): string {
    if (activeAccount?.id) {
      return `/${encodeURIComponent(activeAccount.id)}/${encodeURIComponent(workspaceId)}`;
    }
    return "/";
  }

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
                onClick={() => { onSelectOrganization(account); }}
                className={activeAccount?.id === account.id ? "bg-primary/10 text-primary" : ""}
              >
                <span className="truncate">{account.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => { setIsCreateOrgOpen(true); }}
              className="gap-2 text-primary"
            >
              <Plus className="size-3.5 shrink-0" />
              <span>建立組織</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="my-2 h-px w-7 bg-border/50" />

        <nav className="flex flex-col items-center gap-0.5" aria-label="主要導覽">
          {visibleRailItems.map((item) => {
            const active = item.isActive?.(pathname) ?? isActive(item.href);

            if (item.id === "workspace") {
              return (
                <DropdownMenu key={item.id}>
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
                      onClick={() => { router.push(workspaceHubHref); }}
                      className={
                        resolveShellNavSection(pathname) === "workspace" && !activeWorkspaceId
                          ? "bg-primary/10 text-primary"
                          : ""
                      }
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
                            router.push(buildWorkspaceDetailHref(workspace.id));
                          }}
                          className={activeWorkspaceId === workspace.id ? "bg-primary/10 text-primary" : ""}
                        >
                          <span className="truncate">{workspace.name}</span>
                        </DropdownMenuItem>
                      ))
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => { setIsCreateWorkspaceOpen(true); }}
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
              <Tooltip key={item.id}>
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

        <div className="flex-1" />
        <div className="h-1" />
      </aside>

      <CreateOrganizationDialog
        open={isCreateOrgOpen}
        onOpenChange={setIsCreateOrgOpen}
        user={user}
        onOrganizationCreated={onOrganizationCreated}
        onNavigate={(href) => { router.push(href); }}
      />

      <CreateWorkspaceDialogRail
        open={isCreateWorkspaceOpen}
        onOpenChange={setIsCreateWorkspaceOpen}
        accountId={activeAccount?.id ?? null}
        accountType={activeAccount ? (isOrganizationAccount ? "organization" : "user") : null}
        creatorUserId={user?.id}
        onNavigate={(href: string) => { router.push(href); }}
      />
    </TooltipProvider>
  );
}
