"use client";

/**
 * Module: shell layout
 * Purpose: compose authenticated shell frame with sidebar, header, and content area.
 * Responsibilities: account switching, route guards, and shell-level UI composition.
 * Constraints: keep business logic in modules and providers, not layout rendering.
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import type { AccountEntity } from "@/modules/account/domain/entities/Account";
import { AccountSwitcher } from "./_components/account-switcher";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { HeaderControls } from "./_components/header-controls";
import { HeaderUserAvatar } from "./_components/header-user-avatar";
import { ShellGuard } from "./_components/shell-guard";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workspace", label: "Workspace" },
  { href: "/settings", label: "Personal Settings" },
];

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/organization": "Organization Governance",
  "/workspace": "Workspace Hub",
  "/settings": "Personal Settings",
};

const organizationManagementItems = [
  { label: "成員", href: "/organization?section=members" },
  { label: "團隊", href: "/organization?section=teams" },
  { label: "權限", href: "/organization?section=permissions" },
  { label: "工作區", href: "/organization?section=workspaces" },
  { label: "知識", href: "/organization?section=knowledge" },
  { label: "排程", href: "/organization?section=schedule" },
  { label: "每日", href: "/organization?section=daily" },
  { label: "稽核", href: "/organization?section=audit" },
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

  if (pathname === "/settings" && nextAccountIsOrganization) {
    return "/organization";
  }

  if (pathname === "/organization" && !nextAccountIsOrganization) {
    return "/settings";
  }

  return null;
}

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state: authState, logout } = useAuth();
  const { state: appState, dispatch } = useApp();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const pageTitle = routeTitles[pathname] ?? "Workspace";
  const organizationAccounts = Object.values(appState.accounts ?? {});
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

  useEffect(() => {
    if (!appState.accountsHydrated || !appState.activeAccount) {
      return;
    }

    const nextRoute = resolveShellRouteForAccount(pathname, appState.activeAccount);
    if (nextRoute && nextRoute !== pathname) {
      router.replace(nextRoute);
    }
  }, [appState.accountsHydrated, appState.activeAccount, pathname, router]);

  async function handleLogout() {
    setLogoutError(null);
    try {
      await logout();
    } catch {
      setLogoutError("Sign out failed. Please retry.");
    }
  }

  return (
    <ShellGuard>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar
          pathname={pathname}
          navItems={navItems}
          user={authState.user}
          activeAccount={appState.activeAccount}
          organizationAccounts={organizationAccounts}
          onSelectPersonal={handleSelectPersonal}
          onSelectOrganization={handleSelectOrganization}
          onOrganizationCreated={handleOrganizationCreated}
          onSignOut={() => {
            void handleLogout();
          }}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="border-b border-border/50 bg-background/80 px-4 backdrop-blur md:px-6">
            <div className="flex h-16 items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-tight">{pageTitle}</p>
                <p className="max-w-[240px] truncate text-xs text-muted-foreground">
                  Active: {appState.activeAccount?.name ?? authState.user?.name ?? "—"}
                </p>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <HeaderControls />
                <HeaderUserAvatar
                  name={authState.user?.name ?? "Dimension Member"}
                  email={authState.user?.email ?? "—"}
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

              {showAccountManagement && (
                <nav aria-label="Organization management" className="flex gap-2 overflow-auto">
                  {organizationManagementItems.map((item) => {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="whitespace-nowrap rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted"
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>

            <nav aria-label="Main navigation" className="flex gap-2 overflow-auto pb-3 md:hidden">
              {navItems.map((item) => {
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
            <div className="px-4 pt-3 text-xs text-destructive md:px-6">{logoutError}</div>
          )}

          <main className="flex-1 overflow-auto p-6">{children}</main>

          <footer className="border-t border-border/50 px-4 py-3 text-xs text-muted-foreground md:px-6">
            Xuanwu App Workspace
          </footer>
        </div>
      </div>
    </ShellGuard>
  );
}
