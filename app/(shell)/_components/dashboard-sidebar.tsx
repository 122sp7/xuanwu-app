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
