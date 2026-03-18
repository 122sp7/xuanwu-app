"use client";

import Link from "next/link";

import type { AuthUser } from "@/app/providers/auth-context";
import type { ActiveAccount } from "@/app/providers/app-context";
import type { AccountEntity } from "@/modules/account/domain/entities/Account";
import { AccountSwitcher } from "./account-switcher";
import { NavUser } from "./nav-user";

interface NavItem {
  href: string;
  label: string;
}

const accountManagementItems = [
  { label: "成員", href: "/organization?section=members" },
  { label: "團隊", href: "/organization?section=teams" },
  { label: "權限", href: "/organization?section=permissions" },
  { label: "排程", href: "/organization?section=schedule" },
  { label: "每日", href: "/organization?section=daily" },
  { label: "稽核", href: "/organization?section=audit" },
] as const;

interface DashboardSidebarProps {
  pathname: string;
  navItems: NavItem[];
  user: AuthUser | null;
  activeAccount: ActiveAccount | null;
  organizationAccounts: AccountEntity[];
  onSelectPersonal: () => void;
  onSelectOrganization: (account: AccountEntity) => void;
  onOrganizationCreated: (account: AccountEntity) => void;
  onSignOut: () => void;
}

function isActiveOrganizationAccount(
  activeAccount: ActiveAccount | null,
): activeAccount is AccountEntity & { accountType: "organization" } {
  return (
    activeAccount != null &&
    "accountType" in activeAccount &&
    activeAccount.accountType === "organization"
  );
}

export function DashboardSidebar({
  pathname,
  navItems,
  user,
  activeAccount,
  organizationAccounts,
  onSelectPersonal,
  onSelectOrganization,
  onOrganizationCreated,
  onSignOut,
}: DashboardSidebarProps) {
  function isActiveRoute(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const showAccountManagement = isActiveOrganizationAccount(activeAccount);

  return (
    <aside className="hidden w-64 border-r border-border/50 bg-card/30 p-5 md:flex md:flex-col">
      <div className="mb-6 space-y-1">
        <p className="text-sm font-semibold tracking-tight">Xuanwu App</p>
        <p className="text-xs text-muted-foreground">Authenticated Workspace</p>
      </div>

      <AccountSwitcher
        personalAccount={user}
        organizationAccounts={organizationAccounts}
        activeAccountId={activeAccount?.id ?? null}
        onSelectPersonal={onSelectPersonal}
        onSelectOrganization={onSelectOrganization}
        onOrganizationCreated={onOrganizationCreated}
      />

      <nav className="mt-5 space-y-1">
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        {showAccountManagement && (
          <details className="group mt-2 rounded-lg border border-border/40 px-3 py-2">
            <summary
              aria-label="切換帳戶管理選單"
              className="cursor-pointer list-none text-sm font-medium text-muted-foreground transition group-open:text-foreground"
            >
              <span className="flex items-center justify-between">
                帳戶管理
                <span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">
                  ˅
                </span>
              </span>
            </summary>
            <div className="mt-2 space-y-1 border-t border-border/40 pt-2">
              {accountManagementItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        )}
      </nav>

      <div className="mt-auto pt-6">
        <NavUser
          name={user?.name ?? "Dimension Member"}
          email={user?.email ?? "—"}
          onSignOut={onSignOut}
        />
      </div>
    </aside>
  );
}
