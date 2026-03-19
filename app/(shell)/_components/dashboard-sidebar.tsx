"use client";

/**
 * Module: dashboard-sidebar.tsx
 * Purpose: render authenticated shell left sidebar navigation and account controls.
 * Responsibilities: main navigation, organization shortcuts, and recent workspace quick access.
 * Constraints: keep UI-only concerns in this component and source workspace records from module interfaces.
 */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { AuthUser } from "@/app/providers/auth-context";
import type { ActiveAccount } from "@/app/providers/app-context";
import type { AccountEntity } from "@/modules/account/domain/entities/Account";
import { getWorkspacesForAccount, type WorkspaceEntity } from "@/modules/workspace";
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

const MAX_VISIBLE_RECENT_WORKSPACES = 10;
const RECENT_WORKSPACES_STORAGE_PREFIX = "xuanwu:recent-workspaces:";

function getStorageKey(accountId: string) {
  return `${RECENT_WORKSPACES_STORAGE_PREFIX}${accountId}`;
}

function readRecentWorkspaceIds(accountId: string): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(accountId));
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
  } catch {
    return [];
  }
}

function persistRecentWorkspaceIds(accountId: string, workspaceIds: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getStorageKey(accountId), JSON.stringify(workspaceIds));
}

function trackWorkspaceFromPath(pathname: string, accountId: string) {
  const match = pathname.match(/^\/workspace\/([^/]+)/);
  if (!match) {
    return;
  }

  const workspaceId = decodeURIComponent(match[1]);
  const recentIds = readRecentWorkspaceIds(accountId);
  const deduped = [workspaceId, ...recentIds.filter((id) => id !== workspaceId)].slice(0, 50);
  persistRecentWorkspaceIds(accountId, deduped);
}

function getWorkspaceIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/workspace\/([^/]+)/);
  if (!match) {
    return null;
  }

  return decodeURIComponent(match[1]);
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
  const [workspacesById, setWorkspacesById] = useState<Record<string, WorkspaceEntity>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  function isActiveRoute(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const showAccountManagement = isActiveOrganizationAccount(activeAccount);

  useEffect(() => {
    const accountId = activeAccount?.id;
    if (!accountId) {
      return;
    }

    trackWorkspaceFromPath(pathname, accountId);
  }, [activeAccount?.id, pathname]);

  useEffect(() => {
    async function loadWorkspaces() {
      const accountId = activeAccount?.id;
      if (!accountId) {
        setWorkspacesById({});
        return;
      }

      try {
        const workspaceList = await getWorkspacesForAccount(accountId);
        setWorkspacesById(
          Object.fromEntries(workspaceList.map((workspace) => [workspace.id, workspace])),
        );
      } catch {
        setWorkspacesById({});
      }
    }

    void loadWorkspaces();
  }, [activeAccount?.id]);

  const recentWorkspaceIds = useMemo(() => {
    const accountId = activeAccount?.id;
    if (!accountId) {
      return [] as string[];
    }

    const stored = readRecentWorkspaceIds(accountId);
    const currentWorkspaceId = getWorkspaceIdFromPath(pathname);
    if (!currentWorkspaceId) {
      return stored;
    }

    return [
      currentWorkspaceId,
      ...stored.filter((workspaceId) => workspaceId !== currentWorkspaceId),
    ];
  }, [activeAccount?.id, pathname]);

  const recentWorkspaceLinks = useMemo(() => {
    return recentWorkspaceIds
      .map((workspaceId) => {
        const workspace = workspacesById[workspaceId];
        if (!workspace) {
          return null;
        }

        return {
          id: workspace.id,
          name: workspace.name,
          href: `/workspace/${workspace.id}`,
        };
      })
      .filter((item): item is { id: string; name: string; href: string } => item !== null);
  }, [recentWorkspaceIds, workspacesById]);

  const hasOverflow = recentWorkspaceLinks.length > MAX_VISIBLE_RECENT_WORKSPACES;
  const visibleRecentWorkspaceLinks = isExpanded
    ? recentWorkspaceLinks
    : recentWorkspaceLinks.slice(0, MAX_VISIBLE_RECENT_WORKSPACES);

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

      <section className="mt-5 space-y-2 rounded-lg border border-border/40 p-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Quick Access</h2>

        {visibleRecentWorkspaceLinks.length === 0 ? (
          <p className="text-xs text-muted-foreground">尚無最近開啟的工作區，先從 Workspace Hub 進入任一工作區。</p>
        ) : (
          <div className="space-y-1">
            {visibleRecentWorkspaceLinks.map((workspace) => (
              <Link
                key={workspace.id}
                href={workspace.href}
                className="block truncate rounded-md border border-border/40 px-2 py-1.5 text-xs font-medium text-foreground/90 transition hover:bg-muted"
                title={workspace.name}
              >
                {workspace.name}
              </Link>
            ))}
          </div>
        )}

        {hasOverflow && (
          <button
            type="button"
            onClick={() => {
              setIsExpanded((prev) => !prev);
            }}
            className="text-xs font-medium text-primary hover:underline"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </section>

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
