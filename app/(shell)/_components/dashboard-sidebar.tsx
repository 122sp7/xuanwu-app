"use client";

/**
 * Module: dashboard-sidebar.tsx
 * Purpose: render the secondary navigation panel of the authenticated shell.
 * Responsibilities: account switcher, org management sub-nav, and recent workspace
 *   quick-access list.  Top-level section navigation is handled by AppRail.
 * Constraints: keep UI-only concerns here; workspace data sourced from module interfaces.
 */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { AuthUser } from "@/app/providers/auth-context";
import type { ActiveAccount } from "@/app/providers/app-context";
import type { AccountEntity } from "@/modules/account/domain/entities/Account";
import { getWorkspacesForAccount, type WorkspaceEntity } from "@/modules/workspace";
import { AccountSwitcher } from "./account-switcher";

interface DashboardSidebarProps {
  readonly pathname: string;
  readonly user: AuthUser | null;
  readonly activeAccount: ActiveAccount | null;
  readonly organizationAccounts: AccountEntity[];
  readonly onSelectPersonal: () => void;
  readonly onSelectOrganization: (account: AccountEntity) => void;
  readonly onOrganizationCreated: (account: AccountEntity) => void;
}

const accountManagementItems = [
  { label: "成員", href: "/organization/members" },
  { label: "團隊", href: "/organization/teams" },
  { label: "權限", href: "/organization/permissions" },
  { label: "工作區", href: "/organization/workspaces" },
  { label: "知識", href: "/organization/knowledge" },
  { label: "排程", href: "/organization/schedule" },
  { label: "每日", href: "/organization/daily" },
  { label: "稽核", href: "/organization/audit" },
] as const;

const MAX_VISIBLE_RECENT_WORKSPACES = 10;
const RECENT_WORKSPACES_STORAGE_PREFIX = "xuanwu:recent-workspaces:";

function getStorageKey(accountId: string) {
  return `${RECENT_WORKSPACES_STORAGE_PREFIX}${accountId}`;
}

function readRecentWorkspaceIds(accountId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getStorageKey(accountId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
  } catch {
    return [];
  }
}

function persistRecentWorkspaceIds(accountId: string, workspaceIds: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getStorageKey(accountId), JSON.stringify(workspaceIds));
}

function trackWorkspaceFromPath(pathname: string, accountId: string) {
  const match = pathname.match(/^\/workspace\/([^/]+)/);
  if (!match) return;
  const workspaceId = decodeURIComponent(match[1]);
  const recentIds = readRecentWorkspaceIds(accountId);
  const deduped = [workspaceId, ...recentIds.filter((id) => id !== workspaceId)].slice(0, 50);
  persistRecentWorkspaceIds(accountId, deduped);
}

function getWorkspaceIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/workspace\/([^/]+)/);
  if (!match) return null;
  return decodeURIComponent(match[1]);
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
  user,
  activeAccount,
  organizationAccounts,
  onSelectPersonal,
  onSelectOrganization,
  onOrganizationCreated,
}: DashboardSidebarProps) {
  const [workspacesById, setWorkspacesById] = useState<Record<string, WorkspaceEntity>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const showAccountManagement = isActiveOrganizationAccount(activeAccount);

  function isActiveRoute(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // Track recently visited workspaces in localStorage
  useEffect(() => {
    const accountId = activeAccount?.id;
    if (!accountId) return;
    trackWorkspaceFromPath(pathname, accountId);
  }, [activeAccount?.id, pathname]);

  // Load workspace names for quick-access links
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
          Object.fromEntries(workspaceList.map((ws) => [ws.id, ws])),
        );
      } catch {
        setWorkspacesById({});
      }
    }
    void loadWorkspaces();
  }, [activeAccount?.id]);

  const recentWorkspaceIds = useMemo(() => {
    const accountId = activeAccount?.id;
    if (!accountId) return [] as string[];
    const stored = readRecentWorkspaceIds(accountId);
    const currentId = getWorkspaceIdFromPath(pathname);
    if (!currentId) return stored;
    return [currentId, ...stored.filter((id) => id !== currentId)];
  }, [activeAccount?.id, pathname]);

  const recentWorkspaceLinks = useMemo(() => {
    return recentWorkspaceIds
      .map((workspaceId) => {
        const ws = workspacesById[workspaceId];
        if (!ws) return null;
        return { id: ws.id, name: ws.name, href: `/workspace/${ws.id}` };
      })
      .filter((item): item is { id: string; name: string; href: string } => item !== null);
  }, [recentWorkspaceIds, workspacesById]);

  const hasOverflow = recentWorkspaceLinks.length > MAX_VISIBLE_RECENT_WORKSPACES;
  const visibleRecentWorkspaceLinks = isExpanded
    ? recentWorkspaceLinks
    : recentWorkspaceLinks.slice(0, MAX_VISIBLE_RECENT_WORKSPACES);

  return (
    <aside className="hidden w-52 shrink-0 flex-col border-r border-border/50 bg-card/30 p-4 md:flex">
      {/* ── Account switcher ──────────────────────────────────────── */}
      <AccountSwitcher
        personalAccount={user}
        organizationAccounts={organizationAccounts}
        activeAccountId={activeAccount?.id ?? null}
        onSelectPersonal={onSelectPersonal}
        onSelectOrganization={onSelectOrganization}
        onOrganizationCreated={onOrganizationCreated}
      />

      {/* ── Organization management sub-nav ───────────────────────── */}
      {showAccountManagement && (
        <nav className="mt-4 space-y-0.5" aria-label="Organization management">
          <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            帳戶管理
          </p>
          {accountManagementItems.map((item) => {
            const active = isActiveRoute(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-lg px-2 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}

      {/* ── Recent workspaces quick-access ────────────────────────── */}
      <section className="mt-4 space-y-1">
        <h2 className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Quick Access
        </h2>

        {visibleRecentWorkspaceLinks.length === 0 ? (
          <p className="px-2 py-2 text-[11px] text-muted-foreground">
            尚無最近開啟的工作區。
          </p>
        ) : (
          <div className="space-y-0.5">
            {visibleRecentWorkspaceLinks.map((ws) => (
              <Link
                key={ws.id}
                href={ws.href}
                className={`block truncate rounded-md px-2 py-1.5 text-xs font-medium transition ${
                  isActiveRoute(ws.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                }`}
                title={ws.name}
              >
                {ws.name}
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
            className="px-2 text-[11px] font-medium text-primary hover:underline"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </section>
    </aside>
  );
}
