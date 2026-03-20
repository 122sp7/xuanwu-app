"use client";

/**
 * Module: dashboard-sidebar.tsx
 * Purpose: render the secondary navigation panel of the authenticated shell.
 * Responsibilities: account switcher, search hint, org management sub-nav, and
 *   recent workspace quick-access list.  Top-level section navigation is in AppRail.
 * Constraints: UI-only; workspace data sourced from module interfaces.
 */

import Link from "next/link";
import { Search } from "lucide-react";
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
        setWorkspacesById(Object.fromEntries(workspaceList.map((ws) => [ws.id, ws])));
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
    <aside
      aria-label="Secondary navigation"
      className="hidden w-52 shrink-0 flex-col overflow-hidden border-r border-border/50 bg-card/30 md:flex"
    >
      {/* ── Account switcher ──────────────────────────────────────── */}
      <div className="shrink-0 border-b border-border/40 px-3 py-3">
        <AccountSwitcher
          personalAccount={user}
          organizationAccounts={organizationAccounts}
          activeAccountId={activeAccount?.id ?? null}
          onSelectPersonal={onSelectPersonal}
          onSelectOrganization={onSelectOrganization}
          onOrganizationCreated={onOrganizationCreated}
        />
      </div>

      {/* ── Search hint (like Plane's quick-actions) ──────────────── */}
      <div className="shrink-0 border-b border-border/40 px-3 py-2">
        <Link
          href="/workspace"
          className="flex items-center gap-2 rounded-md border border-border/50 bg-background/50 px-2.5 py-1.5 text-xs text-muted-foreground transition hover:border-border hover:bg-muted"
        >
          <Search className="size-3.5 shrink-0" />
          <span>工作區搜尋…</span>
        </Link>
      </div>

      {/* ── Scrollable nav body ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-3">

        {/* Organization management sub-nav */}
        {showAccountManagement && (
          <nav className="mb-4 space-y-0.5" aria-label="Organization management">
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              帳戶管理
            </p>
            {accountManagementItems.map((item) => {
              const active = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
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

        {/* Recent workspaces quick-access */}
        <div className="space-y-0.5">
          <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            最近工作區
          </p>

          {visibleRecentWorkspaceLinks.length === 0 ? (
            <p className="px-2 py-2 text-[11px] text-muted-foreground">
              尚無最近開啟的工作區。
            </p>
          ) : (
            visibleRecentWorkspaceLinks.map((ws) => (
              <Link
                key={ws.id}
                href={ws.href}
                className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
                  isActiveRoute(ws.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                }`}
                title={ws.name}
              >
                <span className="truncate">{ws.name}</span>
              </Link>
            ))
          )}

          {hasOverflow && (
            <button
              type="button"
              onClick={() => {
                setIsExpanded((prev) => !prev);
              }}
              className="px-2 py-1 text-[11px] font-medium text-primary hover:underline"
            >
              {isExpanded ? "收起" : "顯示更多"}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
