"use client";

/**
 * ShellLayout — platform/interfaces/web component.
 * Authenticated shell frame: sidebar, header, and content area.
 *
 * Responsibilities: account switching, route guards, and shell-level UI composition.
 * Constraints: keep business logic in modules and providers, not layout rendering.
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PanelLeftOpen, Search } from "lucide-react";

import { useApp } from "../providers/app-provider";
import { useAuth, ShellGuard } from "../../../subdomains/identity/api";
import { type AccountEntity, HeaderUserAvatar } from "../../../subdomains/account/api";
import { subscribeToProfile, type AccountProfile } from "../../../subdomains/account-profile/api";
import { AccountSwitcher } from "../../../subdomains/organization/api";
import { AppBreadcrumbs } from "./AppBreadcrumbs";
import { AppRail } from "./AppRail";
import { DashboardSidebar } from "./DashboardSidebar";
import { GlobalSearchDialog, useGlobalSearch } from "./GlobalSearchDialog";
import { HeaderControls } from "./HeaderControls";

const routeTitles: Record<string, string> = {
  "/organization": "組織治理",
  "/organization/daily": "帳號 · 每日",
  "/organization/schedule": "帳號 · 排程",
  "/organization/schedule/dispatcher": "帳號 · 調度台",
  "/organization/audit": "帳號 · 稽核",
  "/workspace": "工作區中心",
  "/knowledge": "知識中心",
  "/knowledge/pages": "知識 · 頁面",
  "/knowledge/block-editor": "知識 · 區塊編輯器",
  "/knowledge-base/articles": "知識庫 · 文章",
  "/knowledge-database/databases": "知識資料庫 · 資料庫",
  "/source/documents": "來源 · 文件",
  "/source/libraries": "來源 · 資料庫",
  "/notebook/rag-query": "筆記本 · 問答 / 引用",
  "/ai-chat": "AI 對話",
  "/dev-tools": "開發工具",
};

/** Used only by the mobile header nav strip (md:hidden). Desktop nav is in AppRail. */
const mobileNavItems = [
  { href: "/workspace", label: "工作區" },
];

const orgPrimaryItems = [
  { label: "成員", href: "/organization/members" },
  { label: "團隊", href: "/organization/teams" },
  { label: "權限", href: "/organization/permissions" },
  { label: "工作區", href: "/organization/workspaces" },
] as const;

const orgSecondaryItems = [
  { label: "排程", href: "/organization/schedule" },
  { label: "每日", href: "/organization/daily" },
  { label: "稽核", href: "/organization/audit" },
] as const;

function isOrganizationAccount(
  activeAccount: ReturnType<typeof useApp>["state"]["activeAccount"],
): activeAccount is AccountEntity & { accountType: "organization" } {
  return (
    activeAccount != null &&
    "accountType" in activeAccount &&
    activeAccount.accountType === "organization"
  );
}

function resolveShellRouteForAccount(
  pathname: string,
  nextAccount: AccountEntity | ReturnType<typeof useAuth>["state"]["user"],
) {
  const nextAccountIsOrganization =
    nextAccount != null && "accountType" in nextAccount && nextAccount.accountType === "organization";

  if (pathname === "/organization" && !nextAccountIsOrganization) {
    return "/workspace";
  }

  return null;
}

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state: authState, logout } = useAuth();
  const { state: appState, dispatch } = useApp();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [accountProfileState, setAccountProfileState] = useState<{ actorId: string; profile: AccountProfile | null } | null>(null);
  const { open: searchOpen, setOpen: setSearchOpen } = useGlobalSearch();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("xuanwu:sidebar-collapsed") === "true";
  });

  function toggleSidebar() {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("xuanwu:sidebar-collapsed", String(next));
      }
      return next;
    });
  }

  const pageTitle = routeTitles[pathname] ?? "工作區";
  const organizationAccounts = Object.values(appState.accounts ?? {});
  const accountWorkspaces = Object.values(appState.workspaces ?? {});
  const showAccountManagement = isOrganizationAccount(appState.activeAccount);

  function isActiveRoute(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleSelectOrganization(account: AccountEntity) {
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: account });
    const nextRoute = resolveShellRouteForAccount(pathname, account);
    if (nextRoute) {
      router.replace(nextRoute);
    }
  }

  function handleSelectPersonal() {
    if (!authState.user) return;
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: authState.user });
    const nextRoute = resolveShellRouteForAccount(pathname, authState.user);
    if (nextRoute) {
      router.replace(nextRoute);
    }
  }

  function handleOrganizationCreated(account: AccountEntity) {
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: account });
  }

  function handleSelectWorkspace(workspaceId: string | null) {
    dispatch({ type: "SET_ACTIVE_WORKSPACE", payload: workspaceId });
  }

  useEffect(() => {
    if (!appState.accountsHydrated || !appState.activeAccount) {
      return;
    }

    const nextRoute = resolveShellRouteForAccount(pathname, appState.activeAccount);
    if (nextRoute && nextRoute !== pathname) {
      router.replace(nextRoute);
    }
  }, [appState.accountsHydrated, appState.activeAccount, pathname, router]);

  useEffect(() => {
    const actorId = authState.user?.id;
    if (!actorId) {
      return;
    }

    const unsubscribe = subscribeToProfile(actorId, (profile) => setAccountProfileState({ actorId, profile }));

    return () => unsubscribe();
  }, [authState.user?.id]);

  const scopedProfile = accountProfileState && accountProfileState.actorId === authState.user?.id
    ? accountProfileState.profile
    : null;

  async function handleLogout() {
    setLogoutError(null);
    try {
      await logout();
    } catch {
      setLogoutError("登出失敗，請稍後再試。");
    }
  }

  return (
    <ShellGuard>
      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <div className="flex h-screen overflow-hidden bg-background">
        <AppRail
          pathname={pathname}
          user={authState.user}
          activeAccount={appState.activeAccount}
          organizationAccounts={organizationAccounts}
          workspaces={accountWorkspaces}
          workspacesHydrated={appState.workspacesHydrated}
          isOrganizationAccount={showAccountManagement}
          onSelectPersonal={handleSelectPersonal}
          onSelectOrganization={handleSelectOrganization}
          activeWorkspaceId={appState.activeWorkspaceId}
          onSelectWorkspace={handleSelectWorkspace}
          onOrganizationCreated={handleOrganizationCreated}
          onSignOut={() => {
            void handleLogout();
          }}
        />
        <DashboardSidebar
          userId={authState.user?.id ?? null}
          pathname={pathname}
          activeAccount={appState.activeAccount}
          workspaces={accountWorkspaces}
          workspacesHydrated={appState.workspacesHydrated}
          activeWorkspaceId={appState.activeWorkspaceId}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={toggleSidebar}
          onSelectWorkspace={handleSelectWorkspace}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="shrink-0 border-b border-border/50 bg-background/80 px-4 backdrop-blur md:px-6">
            <div className="flex h-12 items-center justify-between gap-4">
              <div className="min-w-0 flex items-center gap-3">
                {sidebarCollapsed && (
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    aria-label="展開側欄"
                    title="展開側欄"
                    className="hidden size-7 items-center justify-center rounded text-muted-foreground transition hover:bg-muted hover:text-foreground md:flex"
                  >
                    <PanelLeftOpen className="size-4" />
                  </button>
                )}
                <p className="truncate text-sm font-semibold tracking-tight">{pageTitle}</p>
                <AppBreadcrumbs />
                {/* Global search */}
                <button
                  type="button"
                  aria-label="全域搜尋"
                  className="hidden items-center gap-1.5 rounded-md border border-border/50 bg-background/50 px-2.5 py-1 text-xs text-muted-foreground transition hover:border-border hover:bg-muted sm:flex"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="size-3 shrink-0" />
                  <span>搜尋…</span>
                  <kbd className="ml-1 rounded bg-muted px-1 text-[10px] text-muted-foreground/60">⌘K</kbd>
                </button>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <HeaderControls />
                <HeaderUserAvatar
                  name={scopedProfile?.displayName ?? authState.user?.name ?? "Dimension Member"}
                  email={scopedProfile?.email ?? authState.user?.email ?? "—"}
                  onSignOut={() => {
                    void handleLogout();
                  }}
                />
              </div>
            </div>

            <div className="space-y-3 pb-3 md:hidden">
              <AccountSwitcher
                personalAccount={authState.user}
                organizationAccounts={organizationAccounts}
                activeAccountId={appState.activeAccount?.id ?? null}
                onSelectPersonal={handleSelectPersonal}
                onSelectOrganization={handleSelectOrganization}
                onOrganizationCreated={handleOrganizationCreated}
              />
            </div>

            {showAccountManagement && (
              <>
                <nav aria-label="Organization primary navigation" className="flex gap-2 overflow-auto pb-2 md:hidden">
                  {orgPrimaryItems.map((item) => {
                    const isActive = isActiveRoute(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "border border-border/60 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <nav aria-label="Organization secondary navigation" className="flex gap-2 overflow-auto pb-2 md:hidden">
                  {orgSecondaryItems.map((item) => {
                    const isActive = isActiveRoute(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "border border-border/60 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </>
            )}
            <nav aria-label="Main navigation" className="flex gap-2 overflow-auto pb-3 md:hidden">
              {mobileNavItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "border border-border/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          {logoutError && (
            <div className="shrink-0 px-4 pt-3 text-xs text-destructive md:px-6">{logoutError}</div>
          )}

          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </ShellGuard>
  );
}
