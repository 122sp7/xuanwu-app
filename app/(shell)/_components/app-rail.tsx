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
import { BookOpen, Bot, Building2, CalendarDays, ClipboardList, FlaskConical, NotebookText, Plus, Settings, SlidersHorizontal, UserRound, Users } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { AuthUser } from "@/app/providers/auth-context";
import type { ActiveAccount } from "@/app/providers/app-context";
import type { AccountEntity } from "@/modules/account/api";
import { createOrganization } from "@/modules/organization";
import { createWorkspace } from "@/modules/workspace";
import type { WorkspaceEntity } from "@/modules/workspace/api";
import { Avatar, AvatarFallback } from "@ui-shadcn/ui/avatar";
import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
import { Input } from "@ui-shadcn/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui-shadcn/ui/tooltip";

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
  onSignOut,
}: AppRailProps) {
  const router = useRouter();
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgError, setOrgError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceCreateError, setWorkspaceCreateError] = useState<string | null>(null);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  function resetDialog() {
    setOrgName("");
    setOrgError(null);
    setIsCreating(false);
  }

  function resetWorkspaceDialog() {
    setWorkspaceName("");
    setWorkspaceCreateError(null);
    setIsCreatingWorkspace(false);
  }

  async function handleCreateWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = workspaceName.trim();
    if (!name) {
      setWorkspaceCreateError("請輸入工作區名稱。");
      return;
    }
    if (!activeAccount) {
      setWorkspaceCreateError("帳號資訊已失效，請重新登入後再建立工作區。");
      return;
    }
    setIsCreatingWorkspace(true);
    setWorkspaceCreateError(null);
    const result = await createWorkspace({
      name,
      accountId: activeAccount.id,
      accountType: isOrganizationAccount ? "organization" : "user",
    });
    if (!result.success) {
      setWorkspaceCreateError(result.error.message);
      setIsCreatingWorkspace(false);
      return;
    }
    resetWorkspaceDialog();
    setIsCreateWorkspaceOpen(false);
    router.push("/workspace");
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
      label: "工作區中心",
      icon: <Building2 className="size-[18px]" />,
    },
    {
      href: "/wiki-beta",
      label: "Account Wiki-Beta",
      icon: <BookOpen className="size-[18px]" />,
    },
    {
      href: "/ai-chat",
      label: "AI 對話",
      icon: <Bot className="size-[18px]" />,
    },
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
    {
      href: "/organization/permissions",
      label: "權限",
      icon: <SlidersHorizontal className="size-[18px]" />,
      show: isOrganizationAccount,
      isActive: (currentPathname) => isExactOrChildPath("/organization/permissions", currentPathname),
    },
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
    {
      href: "/organization/audit",
      label: "稽核",
      icon: <ClipboardList className="size-[18px]" />,
      show: isOrganizationAccount,
      isActive: (currentPathname) => isExactOrChildPath("/organization/audit", currentPathname),
    },
    {
      href: "/dev-tools",
      label: "開發工具",
      icon: <FlaskConical className="size-[18px]" />,
    },
  ];

  /** Settings is pinned above the avatar, separate from main nav */
  const settingsHref = "/settings";

  const visibleRailItems = railItems.filter((item) => item.show !== false);

  const sortedWorkspaces = useMemo(
    () => [...workspaces].sort((a, b) => a.name.localeCompare(b.name, "zh-Hant")),
    [workspaces],
  );

  function buildWikiBetaWorkspaceHref(workspaceId: string): string {
    if (pathname.startsWith("/wiki-beta")) {
      const targetPath = pathname === "/wiki-beta" ? "/wiki-beta/documents" : pathname;
      return `${targetPath}?workspaceId=${encodeURIComponent(workspaceId)}`;
    }
    return `/wiki-beta/documents?workspaceId=${encodeURIComponent(workspaceId)}`;
  }

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

            if (item.href === "/wiki-beta") {
              return (
                <DropdownMenu key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-current={active ? "page" : undefined}
                          aria-label="Account Wiki-Beta: 切換工作區"
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
                      <p className="text-xs">Account Wiki-Beta: 切換工作區</p>
                    </TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent side="right" align="start" className="w-56">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">選擇工作區</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        onSelectWorkspace(null);
                        router.push("/wiki-beta");
                      }}
                      className={!activeWorkspaceId ? "bg-primary/10 text-primary" : ""}
                    >
                      Account Wiki-Beta 首頁
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
                            router.push(buildWikiBetaWorkspaceHref(workspace.id));
                          }}
                          className={activeWorkspaceId === workspace.id ? "bg-primary/10 text-primary" : ""}
                        >
                          <span className="truncate">{workspace.name}</span>
                        </DropdownMenuItem>
                      ))
                    )}
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

        {/* ── Settings (pinned above avatar) ────────────────────────── */}
        <div className="mb-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={settingsHref}
                aria-current={isActive(settingsHref) ? "page" : undefined}
                aria-label="個人設定"
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
              <p className="text-xs">個人設定</p>
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
                  aria-label="開啟使用者選單"
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
              登出
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

      {/* ── Create workspace dialog ────────────────────────────────── */}
      <Dialog
        open={isCreateWorkspaceOpen}
        onOpenChange={(open) => {
          setIsCreateWorkspaceOpen(open);
          if (!open) resetWorkspaceDialog();
        }}
      >
        <DialogContent aria-describedby="rail-create-workspace-description">
          <DialogHeader>
            <DialogTitle>建立新工作區</DialogTitle>
            <DialogDescription id="rail-create-workspace-description">
              輸入名稱後會直接建立工作區並加入目前帳號的工作區清單中。
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateWorkspace}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="rail-workspace-name">
                工作區名稱
              </label>
              <Input
                id="rail-workspace-name"
                value={workspaceName}
                onChange={(e) => {
                  setWorkspaceName(e.target.value);
                  if (workspaceCreateError) setWorkspaceCreateError(null);
                }}
                placeholder="例如：Project Alpha"
                autoFocus
                disabled={isCreatingWorkspace}
                maxLength={80}
              />
              {workspaceCreateError && <p className="text-sm text-destructive">{workspaceCreateError}</p>}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetWorkspaceDialog();
                  setIsCreateWorkspaceOpen(false);
                }}
                disabled={isCreatingWorkspace}
              >
                取消
              </Button>
              <Button type="submit" disabled={isCreatingWorkspace || !activeAccount}>
                {isCreatingWorkspace ? "建立中…" : "直接建立"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
