"use client";

/**
 * Module: dashboard-sidebar.tsx
 * Purpose: render the secondary navigation panel of the authenticated shell.
 * Responsibilities: account switcher, search hint, org management sub-nav, and
 *   recent workspace quick-access list.  Top-level section navigation is in AppRail.
 * Constraints: UI-only; workspace data sourced from module interfaces.
 */

import Link from "next/link";
import { BookOpen, Bot, Building2, ChevronDown, ChevronRight, PanelLeftClose, Plus, Settings, SlidersHorizontal, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { ActiveAccount } from "@/app/providers/app-context";
import type { AccountEntity } from "@/modules/account/domain/entities/Account";
import { getWorkspacesForAccount, type WorkspaceEntity } from "@/modules/workspace";
import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";
import {
  CustomizeNavigationDialog,
  readNavPreferences,
  type NavPreferences,
} from "./customize-navigation-dialog";

interface DashboardSidebarProps {
  readonly pathname: string;
  readonly activeAccount: ActiveAccount | null;
  readonly activeWorkspaceId: string | null;
  readonly collapsed: boolean;
  readonly onToggleCollapsed: () => void;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
}

const ALL_ACCOUNT_MANAGEMENT_ITEMS = [
  { id: "members", label: "成員", href: "/organization/members" },
  { id: "teams", label: "團隊", href: "/organization/teams" },
  { id: "permissions", label: "權限", href: "/organization/permissions" },
  { id: "workspaces", label: "工作區", href: "/organization/workspaces" },
  { id: "schedule", label: "排程", href: "/organization/schedule" },
  { id: "daily", label: "每日", href: "/organization/daily" },
  { id: "audit", label: "稽核", href: "/organization/audit" },
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

// ── Section helpers ──────────────────────────────────────────────────────────

type NavSection = "workspace" | "wiki-beta" | "ai-chat" | "organization" | "settings" | "other";

function resolveNavSection(pathname: string): NavSection {
  if (pathname.startsWith("/workspace") || pathname.startsWith("/dashboard")) return "workspace";
  if (pathname.startsWith("/wiki-beta")) return "wiki-beta";
  if (pathname.startsWith("/ai-chat")) return "ai-chat";
  if (pathname.startsWith("/organization")) return "organization";
  if (pathname.startsWith("/settings")) return "settings";
  return "other";
}

// ── Section icon labels for the title bar ────────────────────────────────────

const SECTION_TITLES: Record<NavSection, { label: string; icon: React.ReactNode }> = {
  workspace: { label: "工作區", icon: <Building2 className="size-3" /> },
  "wiki-beta": { label: "Wiki Beta", icon: <BookOpen className="size-3" /> },
  "ai-chat": { label: "AI Chat", icon: <Bot className="size-3" /> },
  organization: { label: "組織", icon: <Users className="size-3" /> },
  settings: { label: "設定", icon: <Settings className="size-3" /> },
  other: { label: "導覽", icon: null },
};

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
  activeAccount,
  activeWorkspaceId,
  collapsed,
  onToggleCollapsed,
  onSelectWorkspace,
}: DashboardSidebarProps) {
  const [workspacesById, setWorkspacesById] = useState<Record<string, WorkspaceEntity>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isWikiBetaWorkspacesExpanded, setIsWikiBetaWorkspacesExpanded] = useState(false);
  const [wikiBetaQuickCreateOpen, setWikiBetaQuickCreateOpen] = useState(false);
  const [creatingKind, setCreatingKind] = useState<"page" | "database" | null>(null);
  const [navPrefs, setNavPrefs] = useState<NavPreferences>(() => readNavPreferences());
  const [customizeOpen, setCustomizeOpen] = useState(false);

  function toggleCollapsed() {
    onToggleCollapsed();
  }

  const showAccountManagement = isActiveOrganizationAccount(activeAccount);

  // Visible org management items filtered by user's nav preferences
  const visibleAccountManagementItems = useMemo(() => {
    return ALL_ACCOUNT_MANAGEMENT_ITEMS.filter((item) =>
      navPrefs.pinnedWorkspace.includes(item.id),
    );
  }, [navPrefs.pinnedWorkspace]);

  // Whether to show recent workspaces section (controlled by personal prefs)
  const showRecentWorkspaces = navPrefs.pinnedPersonal.includes("recent-workspaces");

  // Max workspaces to show (apply user preference)
  const effectiveMaxWorkspaces = navPrefs.showLimitedWorkspaces
    ? navPrefs.maxWorkspaces
    : MAX_VISIBLE_RECENT_WORKSPACES;

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

  useEffect(() => {
    const pathWorkspaceId = getWorkspaceIdFromPath(pathname);
    if (pathWorkspaceId && pathWorkspaceId !== activeWorkspaceId) {
      onSelectWorkspace(pathWorkspaceId);
      return;
    }

    if (typeof window === "undefined" || !pathname.startsWith("/wiki-beta")) {
      return;
    }

    const searchWorkspaceId = new URLSearchParams(window.location.search).get("workspaceId")?.trim() || "";
    if (searchWorkspaceId && searchWorkspaceId !== activeWorkspaceId) {
      onSelectWorkspace(searchWorkspaceId);
    }
  }, [pathname, activeWorkspaceId, onSelectWorkspace]);

  const recentWorkspaceLinks = useMemo(() => {
    return recentWorkspaceIds
      .map((workspaceId) => {
        const ws = workspacesById[workspaceId];
        if (!ws) return null;
        return { id: ws.id, name: ws.name, href: `/workspace/${ws.id}` };
      })
      .filter((item): item is { id: string; name: string; href: string } => item !== null);
  }, [recentWorkspaceIds, workspacesById]);

  const hasOverflow = recentWorkspaceLinks.length > effectiveMaxWorkspaces;
  const visibleRecentWorkspaceLinks = isExpanded
    ? recentWorkspaceLinks
    : recentWorkspaceLinks.slice(0, effectiveMaxWorkspaces);

  function buildWorkspaceContextHref(workspaceId: string): string {
    if (pathname.startsWith("/wiki-beta")) {
      const targetPath = pathname === "/wiki-beta" ? "/wiki-beta/documents" : pathname;
      return `${targetPath}?workspaceId=${encodeURIComponent(workspaceId)}`;
    }
    return `/workspace/${workspaceId}`;
  }

  const allWorkspaceLinks = useMemo(() => {
    return Object.values(workspacesById)
      .map((workspace) => ({
        id: workspace.id,
        name: workspace.name,
        href: buildWorkspaceContextHref(workspace.id),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));
  }, [workspacesById, pathname]);

  const activeWorkspaceName = useMemo(() => {
    if (!activeWorkspaceId) return "未選擇";
    return workspacesById[activeWorkspaceId]?.name ?? activeWorkspaceId;
  }, [activeWorkspaceId, workspacesById]);

  const section = resolveNavSection(pathname);
  const sectionMeta = SECTION_TITLES[section];

  async function handleWikiBetaQuickCreate(kind: "page" | "database") {
    const accountId = activeAccount?.id ?? "";
    if (!accountId) {
      toast.error("目前沒有 active account，無法建立");
      return;
    }

    setCreatingKind(kind);
    try {
      const db = getFirebaseFirestore();
      const collectionName = kind === "page" ? "pages" : "databases";
      const baseTitle = kind === "page" ? "未命名頁面" : "未命名資料庫";

      const payload: Record<string, unknown> = {
        title: baseTitle,
        kind,
        accountId,
        createdAt: firestoreApi.serverTimestamp(),
        updatedAt: firestoreApi.serverTimestamp(),
      };

      if (activeWorkspaceId) {
        payload.spaceId = activeWorkspaceId;
      }

      if (kind === "database") {
        payload.template = "task-governance";
        payload.metadata = {
          model: ["tasks", "task_dependencies", "skills", "task_skill_thresholds"],
          description: "任務依賴與技能門檻分類模板",
        };
      }

      await firestoreApi.addDoc(
        firestoreApi.collection(db, "accounts", accountId, collectionName),
        payload,
      );

      toast.success(kind === "page" ? "已建立頁面" : "已建立資料庫");
      setWikiBetaQuickCreateOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(kind === "page" ? "建立頁面失敗" : "建立資料庫失敗");
    } finally {
      setCreatingKind(null);
    }
  }

  return (
    <>
    <aside
      aria-label="Secondary navigation"
      className={`hidden h-full shrink-0 flex-col overflow-hidden transition-[width] duration-200 md:flex ${
        collapsed ? "w-0" : "w-52 border-r border-border/50 bg-card/30"
      }`}
    >
      <>
          {/* ── Sidebar title bar ──────────────────────────────────── */}
          <div className="flex shrink-0 items-center border-b border-border/40 px-2 py-1.5">
            {/* Section label */}
            <span className="flex flex-1 items-center gap-1 px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              {sectionMeta.icon}
              {sectionMeta.label}
            </span>
            {/* Customize + collapse buttons grouped on the right */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                title="設定"
                aria-label="設定"
                onClick={() => {
                  setCustomizeOpen(true);
                }}
                className="flex size-5 items-center justify-center rounded text-muted-foreground/70 transition hover:bg-muted hover:text-foreground"
              >
                <SlidersHorizontal className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-label="收起側欄"
                title="收起側欄"
                className="flex size-5 items-center justify-center rounded text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <PanelLeftClose className="size-3.5" />
              </button>
            </div>
          </div>

          {/* ── Scrollable nav body ── section-specific ───────────── */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            {section === "organization" && (
              <>
                {showAccountManagement && visibleAccountManagementItems.length > 0 && (
                  <nav className="space-y-0.5" aria-label="Organization management">
                    <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                      帳戶管理
                    </p>
                    {visibleAccountManagementItems.map((item) => {
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
                {!showAccountManagement && (
                  <p className="px-2 py-4 text-[11px] text-muted-foreground">
                    請切換到組織帳號以查看管理選項。
                  </p>
                )}
              </>
            )}

            {section === "workspace" && (
              <>
                {showRecentWorkspaces && (
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
                          onClick={() => {
                            onSelectWorkspace(ws.id);
                          }}
                          className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
                            activeWorkspaceId === ws.id || isActiveRoute(ws.href)
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
                )}
              </>
            )}

            {section === "wiki-beta" && (
              <nav className="space-y-0.5" aria-label="Wiki Beta navigation">
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  Wiki Beta
                </p>
                {(
                  [
                    { href: "/wiki-beta", label: "知識總覽" },
                    { href: "/wiki-beta/rag-query", label: "RAG Query" },
                  ] as const
                ).map((item) => {
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

                <div className="relative flex items-center rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                  <Link
                    href="/wiki-beta/documents"
                    aria-current={isActiveRoute("/wiki-beta/documents") ? "page" : undefined}
                    className={`flex-1 ${
                      isActiveRoute("/wiki-beta/documents")
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Documents
                  </Link>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setWikiBetaQuickCreateOpen((prev) => !prev);
                    }}
                    className="ml-1 inline-flex size-5 items-center justify-center rounded transition hover:bg-muted-foreground/15"
                    aria-label="快速新增頁面或資料庫"
                    title="快速新增"
                  >
                    <Plus className="size-3.5" />
                  </button>

                  {wikiBetaQuickCreateOpen ? (
                    <div className="absolute right-0 top-8 z-10 min-w-36 rounded-md border border-border/60 bg-popover p-1 shadow-md">
                      <button
                        type="button"
                        onClick={() => void handleWikiBetaQuickCreate("page")}
                        disabled={creatingKind !== null}
                        className="flex w-full items-center rounded px-2 py-1.5 text-left text-xs text-foreground transition hover:bg-muted disabled:opacity-50"
                      >
                        {creatingKind === "page" ? "建立中..." : "新增頁面"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleWikiBetaQuickCreate("database")}
                        disabled={creatingKind !== null}
                        className="flex w-full items-center rounded px-2 py-1.5 text-left text-xs text-foreground transition hover:bg-muted disabled:opacity-50"
                      >
                        {creatingKind === "database" ? "建立中..." : "新增資料庫"}
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="my-1.5 border-t border-border/40" />

                <button
                  type="button"
                  onClick={() => {
                    setIsWikiBetaWorkspacesExpanded((prev) => !prev);
                  }}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-expanded={isWikiBetaWorkspacesExpanded}
                >
                  <span>Workspaces</span>
                  {isWikiBetaWorkspacesExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                </button>

                {isWikiBetaWorkspacesExpanded && (
                  <div className="space-y-0.5 pl-2">
                    {allWorkspaceLinks.length === 0 ? (
                      <p className="px-2 py-1.5 text-[11px] text-muted-foreground">目前帳號沒有工作區</p>
                    ) : (
                      allWorkspaceLinks.map((workspace) => {
                        const active = activeWorkspaceId === workspace.id;
                        return (
                          <Link
                            key={workspace.id}
                            href={workspace.href}
                            onClick={() => {
                              onSelectWorkspace(workspace.id);
                            }}
                            aria-current={active ? "page" : undefined}
                            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
                              active
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                            title={workspace.name}
                          >
                            <span className="truncate">{workspace.name}</span>
                          </Link>
                        );
                      })
                    )}
                  </div>
                )}
              </nav>
            )}

            {section === "ai-chat" && (
              <nav className="space-y-0.5" aria-label="AI Chat navigation">
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  AI Chat
                </p>
                {(
                  [
                    { href: "/ai-chat", label: "對話紀錄" },
                  ] as const
                ).map((item) => {
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

            {section === "settings" && (
              <nav className="space-y-0.5" aria-label="Settings navigation">
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  個人設定
                </p>
                {(
                  [
                    { href: "/settings/profile", label: "個人資料" },
                    { href: "/settings/general", label: "一般" },
                    { href: "/settings/notifications", label: "推播通知" },
                  ] as const
                ).map((item) => {
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
          </div>
        </>
    </aside>

    <CustomizeNavigationDialog
      open={customizeOpen}
      onOpenChange={setCustomizeOpen}
      onPreferencesChange={setNavPrefs}
    />
    </>
  );
}
