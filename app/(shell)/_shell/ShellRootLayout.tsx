"use client";

/**
 * ShellRootLayout — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it composes downstream modules.
 *
 * Uses useApp() from platform (accounts/auth) and useWorkspaceContext()
 * from workspace (workspaces/activeWorkspaceId).
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PanelLeftOpen, Search } from "lucide-react";

import {
  useApp,
  useAuth,
  ShellGuard,
  type AccountEntity,
  subscribeToProfile,
  type AccountProfile,
  isOrganizationActor,
  resolveOrganizationRouteFallback,
  AccountSwitcher,
} from "@/modules/platform/api";
import {
  resolveShellPageTitle,
  isExactOrChildPath,
  SHELL_MOBILE_NAV_ITEMS,
  SHELL_ORG_PRIMARY_NAV_ITEMS,
  SHELL_ORG_SECONDARY_NAV_ITEMS,
} from "@/modules/platform/subdomains/platform-config/api";
import { useWorkspaceContext, type WorkspaceEntity } from "@/modules/workspace/api";
import {
  ShellAppBreadcrumbs,
  ShellGlobalSearchDialog,
  useShellGlobalSearch,
  ShellHeaderControls,
  ShellUserAvatar,
} from "@/modules/platform/interfaces/web";

import { AppRail } from "./ShellAppRail";
import { ShellDashboardSidebar } from "./ShellDashboardSidebar";

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state: authState, logout } = useAuth();
  const { state: appState, dispatch: appDispatch } = useApp();
  const { state: wsState, dispatch: wsDispatch } = useWorkspaceContext();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [accountProfileState, setAccountProfileState] = useState<{ actorId: string; profile: AccountProfile | null } | null>(null);
  const { open: searchOpen, setOpen: setSearchOpen } = useShellGlobalSearch();
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

  const pageTitle = resolveShellPageTitle(pathname);
  const organizationAccounts = Object.values(appState.accounts ?? {});
  const accountWorkspaces: WorkspaceEntity[] = Object.values(wsState.workspaces ?? {});
  const showAccountManagement = isOrganizationActor(appState.activeAccount);

  function handleSelectOrganization(account: AccountEntity) {
    appDispatch({ type: "SET_ACTIVE_ACCOUNT", payload: account });
    const nextRoute = resolveOrganizationRouteFallback(pathname, account);
    if (nextRoute) {
      router.replace(nextRoute);
    }
  }

  function handleSelectPersonal() {
    if (!authState.user) return;
    appDispatch({ type: "SET_ACTIVE_ACCOUNT", payload: authState.user });
    const nextRoute = resolveOrganizationRouteFallback(pathname, authState.user);
    if (nextRoute) {
      router.replace(nextRoute);
    }
  }

  function handleOrganizationCreated(account: AccountEntity) {
    appDispatch({ type: "SET_ACTIVE_ACCOUNT", payload: account });
  }

  function handleSelectWorkspace(workspaceId: string | null) {
    wsDispatch({ type: "SET_ACTIVE_WORKSPACE", payload: workspaceId });
  }

  useEffect(() => {
    if (!appState.accountsHydrated || !appState.activeAccount) {
      return;
    }

    const nextRoute = resolveOrganizationRouteFallback(pathname, appState.activeAccount);
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
      <ShellGlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <div className="flex h-screen overflow-hidden bg-background">
        <AppRail
          pathname={pathname}
          user={authState.user}
          activeAccount={appState.activeAccount}
          organizationAccounts={organizationAccounts}
          workspaces={accountWorkspaces}
          workspacesHydrated={wsState.workspacesHydrated}
          isOrganizationAccount={showAccountManagement}
          onSelectPersonal={handleSelectPersonal}
          onSelectOrganization={handleSelectOrganization}
          activeWorkspaceId={wsState.activeWorkspaceId}
          onSelectWorkspace={handleSelectWorkspace}
          onOrganizationCreated={handleOrganizationCreated}
          onSignOut={() => {
            void handleLogout();
          }}
        />
        <ShellDashboardSidebar
          userId={authState.user?.id ?? null}
          pathname={pathname}
          activeAccount={appState.activeAccount}
          workspaces={accountWorkspaces}
          workspacesHydrated={wsState.workspacesHydrated}
          activeWorkspaceId={wsState.activeWorkspaceId}
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
                <ShellAppBreadcrumbs />
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
                <ShellHeaderControls />
                <ShellUserAvatar
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
                  {SHELL_ORG_PRIMARY_NAV_ITEMS.map((item) => {
                    const isActive = isExactOrChildPath(item.href, pathname);
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
                  {SHELL_ORG_SECONDARY_NAV_ITEMS.map((item) => {
                    const isActive = isExactOrChildPath(item.href, pathname);
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
              {SHELL_MOBILE_NAV_ITEMS.map((item) => {
                const isActive = isExactOrChildPath(item.href, pathname);
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
