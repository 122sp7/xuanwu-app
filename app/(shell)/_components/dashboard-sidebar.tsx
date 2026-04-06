"use client";

/**
 * Module: dashboard-sidebar.tsx
 * Purpose: render the secondary navigation panel of the authenticated shell.
 * Responsibilities: account switcher, search hint, org management sub-nav, and
 *   recent workspace quick-access list.  Top-level section navigation is in AppRail.
 * Constraints: UI-only; workspace data sourced from module interfaces.
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Bot,
  Brain,
  Building2,
  ChevronDown,
  ChevronRight,
  Database,
  FileText,
  Home,
  Library,
  PanelLeftClose,
  Search,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { ActiveAccount } from "@/app/providers/app-context";
import type { AccountEntity } from "@/modules/account/api";
import {
  getWorkspaceTabLabel,
  getWorkspaceTabPrefId,
  getWorkspaceTabStatus,
  getWorkspaceTabsByGroup,
  isWorkspaceTabValue,
  type WorkspaceTabGroup,
  type WorkspaceTabValue,
  type WorkspaceEntity,
} from "@/modules/workspace/api";
import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";
import { CustomizeNavigationDialog,
  readNavPreferences,
  type NavPreferences,
} from "./customize-navigation-dialog";
import { KnowledgeSidebarSection } from "./knowledge-sidebar-section";
import {
  getWorkspaceIdFromPath,
  MAX_VISIBLE_RECENT_WORKSPACES,
  useRecentWorkspaces,
} from "./use-recent-workspaces";

interface DashboardSidebarProps {
  readonly pathname: string;
  readonly activeAccount: ActiveAccount | null;
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly activeWorkspaceId: string | null;
  readonly collapsed: boolean;
  readonly onToggleCollapsed: () => void;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
}

const ORGANIZATION_MANAGEMENT_ITEMS: readonly { id: string; label: string; href: string }[] = [];

const ACCOUNT_NAV_ITEMS = [
  { id: "schedule", label: "排程", href: "/organization/schedule" },
  { id: "dispatcher", label: "調度台", href: "/organization/schedule/dispatcher" },
  { id: "daily", label: "每日", href: "/organization/daily" },
  { id: "audit", label: "稽核", href: "/organization/audit" },
] as const;

const ACCOUNT_SECTION_MATCHERS = [
  "/organization/daily",
  "/organization/schedule",
  "/organization/audit",
] as const;



function createWorkspaceLinkItems(group: WorkspaceTabGroup): { value: WorkspaceTabValue; label: string }[] {
  return getWorkspaceTabsByGroup(group).map((value) => ({
    value,
    label: getWorkspaceTabLabel(value),
  }));
}

const WORKSPACE_PRIMARY_LINK_ITEMS = createWorkspaceLinkItems("primary");
const WORKSPACE_SPACE_ITEMS = createWorkspaceLinkItems("spaces");
const WORKSPACE_DATABASE_ITEMS = createWorkspaceLinkItems("databases");
const WORKSPACE_LIBRARY_LINK_ITEMS = createWorkspaceLinkItems("library");
const WORKSPACE_MODULE_LINK_ITEMS = createWorkspaceLinkItems("modules");

const QUICK_ACCESS_ITEMS: readonly {
  href: string;
  label: string;
  icon: React.ReactNode;
}[] = [
  { href: "/workspace", label: "首頁", icon: <Home className="size-3.5" /> },
  { href: "/knowledge/pages", label: "頁面", icon: <FileText className="size-3.5" /> },
  { href: "/knowledge-base/articles", label: "文章", icon: <BookOpen className="size-3.5" /> },
  { href: "/source/documents", label: "來源", icon: <Library className="size-3.5" /> },
];

interface SidebarLocaleBundle {
  workspace?: {
    groups?: Record<string, string>;
    tabLabels?: Record<string, string>;
  };
}

// ── Section helpers ──────────────────────────────────────────────────────────

type NavSection = "workspace" | "knowledge" | "knowledge-base" | "knowledge-database" | "source" | "notebook" | "ai-chat" | "account" | "organization" | "other";

function resolveNavSection(pathname: string): NavSection {
  if (pathname.startsWith("/workspace")) return "workspace";
  if (pathname.startsWith("/knowledge-base")) return "knowledge-base";
  if (pathname.startsWith("/knowledge-database")) return "knowledge-database";
  if (pathname.startsWith("/knowledge")) return "knowledge";
  if (pathname.startsWith("/source")) return "source";
  if (pathname.startsWith("/notebook")) return "notebook";
  if (pathname.startsWith("/ai-chat")) return "ai-chat";
  if (ACCOUNT_SECTION_MATCHERS.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return "account";
  if (pathname.startsWith("/organization")) return "organization";
  return "other";
}

// ── Section icon labels for the title bar ────────────────────────────────────

const SECTION_TITLES: Record<NavSection, { label: string; icon: React.ReactNode }> = {
  workspace: { label: "工作區", icon: <Building2 className="size-3" /> },
  knowledge: { label: "Knowledge", icon: <BookOpen className="size-3" /> },
  "knowledge-base": { label: "Knowledge Base", icon: <BookOpen className="size-3" /> },
  "knowledge-database": { label: "Knowledge Database", icon: <Database className="size-3" /> },
  source: { label: "Source", icon: <FileText className="size-3" /> },
  notebook: { label: "Notebook", icon: <Brain className="size-3" /> },
  "ai-chat": { label: "AI Chat", icon: <Bot className="size-3" /> },
  account: { label: "Account", icon: <UserRound className="size-3" /> },
  organization: { label: "組織", icon: <Users className="size-3" /> },
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

function sidebarItemClass(active: boolean) {
  return `group flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition ${
    active
      ? "border-primary/30 bg-primary/10 text-primary"
      : "border-transparent text-muted-foreground hover:border-border/60 hover:bg-muted/70 hover:text-foreground"
  }`;
}

const sidebarSectionTitleClass =
  "mb-1.5 px-2 text-[11px] font-semibold tracking-tight text-muted-foreground/85";

const sidebarGroupButtonClass =
  "flex w-full items-center justify-between rounded-md border border-transparent px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-border/60 hover:bg-muted/70 hover:text-foreground";

export function DashboardSidebar({
  pathname,
  activeAccount,
  workspaces,
  workspacesHydrated,
  activeWorkspaceId,
  collapsed,
  onToggleCollapsed,
  onSelectWorkspace,
}: DashboardSidebarProps) {
  const { isExpanded, setIsExpanded, recentWorkspaceLinks } = useRecentWorkspaces(
    activeAccount?.id,
    pathname,
    workspaces,
  );
  const [creatingKind, setCreatingKind] = useState<"page" | "database" | null>(null);
  const [isWorkspaceSpacesExpanded, setIsWorkspaceSpacesExpanded] = useState(true);
  const [isWorkspaceDatabasesExpanded, setIsWorkspaceDatabasesExpanded] = useState(true);
  const [isWorkspaceModulesExpanded, setIsWorkspaceModulesExpanded] = useState(false);
  const [navPrefs, setNavPrefs] = useState<NavPreferences>(() => readNavPreferences());
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [localeBundle, setLocaleBundle] = useState<SidebarLocaleBundle | null>(null);
  const searchParams = useSearchParams();

  function toggleCollapsed() {
    onToggleCollapsed();
  }

  const showAccountManagement = isActiveOrganizationAccount(activeAccount);

  const visibleOrganizationManagementItems = useMemo(() => {
    return ORGANIZATION_MANAGEMENT_ITEMS.filter((item) =>
      navPrefs.pinnedWorkspace.includes(item.id),
    );
  }, [navPrefs.pinnedWorkspace]);

  const visibleAccountItems = useMemo(() => {
    return ACCOUNT_NAV_ITEMS.filter((item) =>
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


  useEffect(() => {
    const pathWorkspaceId = getWorkspaceIdFromPath(pathname);
    if (pathWorkspaceId && pathWorkspaceId !== activeWorkspaceId) {
      onSelectWorkspace(pathWorkspaceId);
      return;
    }

    if (typeof window === "undefined" || !pathname.startsWith("/knowledge")) {
      return;
    }

    const searchWorkspaceId = new URLSearchParams(window.location.search).get("workspaceId")?.trim() || "";
    if (searchWorkspaceId && searchWorkspaceId !== activeWorkspaceId) {
      onSelectWorkspace(searchWorkspaceId);
    }
  }, [pathname, activeWorkspaceId, onSelectWorkspace]);


  const hasOverflow = recentWorkspaceLinks.length > effectiveMaxWorkspaces;
  const visibleRecentWorkspaceLinks = isExpanded
    ? recentWorkspaceLinks
    : recentWorkspaceLinks.slice(0, effectiveMaxWorkspaces);

  const buildWorkspaceContextHref = useCallback(
    (workspaceId: string): string => {
      if (pathname.startsWith("/knowledge")) {
        const targetPath = pathname === "/knowledge" ? "/knowledge/pages" : pathname;
        return `${targetPath}?workspaceId=${encodeURIComponent(workspaceId)}`;
      }
      return `/workspace/${workspaceId}`;
    },
    [pathname],
  );

  const allWorkspaceLinks = useMemo(() => {
    return workspaces
      .map((workspace) => ({
        id: workspace.id,
        name: workspace.name,
        href: buildWorkspaceContextHref(workspace.id),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));
  }, [workspaces, buildWorkspaceContextHref]);

  const section = resolveNavSection(pathname);
  const sectionMeta = SECTION_TITLES[section];
  const workspacePathId = getWorkspaceIdFromPath(pathname);
  const rawWorkspaceTab = searchParams.get("tab") ?? "Overview";
  const activeWorkspaceTab: WorkspaceTabValue = isWorkspaceTabValue(rawWorkspaceTab)
    ? rawWorkspaceTab
    : "Overview";

  function buildWorkspaceTabHref(workspaceId: string, tab: WorkspaceTabValue) {
    return `/workspace/${workspaceId}?tab=${encodeURIComponent(tab)}`;
  }

  function tWorkspaceTab(tab: WorkspaceTabValue, fallback: string) {
    return localeBundle?.workspace?.tabLabels?.[tab] ?? fallback;
  }

  function tWorkspaceTabWithDevStatus(tab: WorkspaceTabValue, fallback: string) {
    if (tab === "Wiki") {
      const status = getWorkspaceTabStatus(tab);
      return `${status} WorkSpace Wiki`;
    }
    const status = getWorkspaceTabStatus(tab);
    return `${status} ${tWorkspaceTab(tab, fallback)}`;
  }

  function tWorkspaceGroup(groupKey: string, fallback: string) {
    return localeBundle?.workspace?.groups?.[groupKey] ?? fallback;
  }

  function getWorkspacePrefId(tabValue: string) {
    if (isWorkspaceTabValue(tabValue)) {
      return getWorkspaceTabPrefId(tabValue);
    }
    return tabValue.toLowerCase().replace(/\s+/g, "-");
  }

  function isWorkspaceItemEnabled(prefId: string) {
    return navPrefs.pinnedWorkspace.includes(prefId);
  }

  function getWorkspaceItemOrder(prefId: string) {
    const index = navPrefs.workspaceOrder.indexOf(prefId);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  function sortWorkspaceItemsByPreferenceOrder<T extends { value: string }>(items: readonly T[]) {
    return [...items].sort(
      (left, right) =>
        getWorkspaceItemOrder(getWorkspacePrefId(left.value)) -
        getWorkspaceItemOrder(getWorkspacePrefId(right.value)),
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function loadSidebarLocale() {
      const isZhHant =
        typeof navigator !== "undefined" &&
        /^(zh-TW|zh-HK|zh-MO|zh-Hant)/i.test(navigator.language);
      const localeFile = isZhHant ? "zh-TW.json" : "en.json";

      try {
        const response = await fetch(`/localized-files/${localeFile}`, { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as SidebarLocaleBundle;
        if (!cancelled) {
          setLocaleBundle(data);
        }
      } catch {
        // Keep fallback labels when localization files are unavailable.
      }
    }

    void loadSidebarLocale();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleQuickCreatePage() {
    const accountId = activeAccount?.id ?? "";
    if (!accountId) {
      toast.error("目前沒有 active account，無法建立");
      return;
    }
    setCreatingKind("page");
    try {
      const db = getFirebaseFirestore();
      const payload: Record<string, unknown> = {
        title: "未命名頁面",
        kind: "page",
        accountId,
        createdAt: firestoreApi.serverTimestamp(),
        updatedAt: firestoreApi.serverTimestamp(),
      };
      if (activeWorkspaceId) payload.spaceId = activeWorkspaceId;
      await firestoreApi.addDoc(
        firestoreApi.collection(db, "accounts", accountId, "pages"),
        payload,
      );
      toast.success("已建立頁面");
    } catch (error) {
      console.error(error);
      toast.error("建立頁面失敗");
    } finally {
      setCreatingKind(null);
    }
  }

  return (
    <div className="contents">
    <aside
      aria-label="Secondary navigation"
      className={`hidden h-full shrink-0 flex-col overflow-hidden transition-[width] duration-200 md:flex ${
        collapsed ? "w-0" : "w-56 border-r border-border/50 bg-card/20"
      }`}
    >
          {/* ── Sidebar title bar ──────────────────────────────────── */}
          <div className="flex shrink-0 items-center border-b border-border/40 px-2 py-1.5">
            {/* Section label */}
            <span className="flex flex-1 items-center gap-1.5 px-1 text-[11px] font-semibold tracking-tight text-foreground/80">
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
                className="flex size-6 items-center justify-center rounded text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
              >
                <SlidersHorizontal className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-label="收起側欄"
                title="收起側欄"
                className="flex size-6 items-center justify-center rounded text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
              >
                <PanelLeftClose className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="shrink-0 border-b border-border/30 px-2 py-2">
            <div className="flex items-center gap-1">
              {QUICK_ACCESS_ITEMS.map((item) => {
                const active = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    aria-current={active ? "page" : undefined}
                    className={`flex size-7 items-center justify-center rounded-md transition ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                    <span className="sr-only">{item.label}</span>
                  </Link>
                );
              })}
              <button
                type="button"
                aria-label="搜尋"
                title="搜尋"
                className="ml-auto flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
              >
                <Search className="size-3.5" />
              </button>
            </div>
          </div>

          {/* ── Scrollable nav body ── section-specific ───────────── */}
          <div className="flex-1 overflow-y-auto px-2.5 py-2.5">
            {section === "account" && (
              <div className="space-y-2">
                {showAccountManagement && visibleAccountItems.length > 0 && (
                  <nav className="space-y-0.5" aria-label="Account navigation">
                    <p className={sidebarSectionTitleClass}>
                      Account
                    </p>
                    {visibleAccountItems.map((item) => {
                      const active = isActiveRoute(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={sidebarItemClass(active)}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                )}
                {!showAccountManagement && (
                  <p className="px-2 py-4 text-[11px] text-muted-foreground">
                    請切換到組織帳號以查看 Account 選項。
                  </p>
                )}
              </div>
            )}

            {section === "organization" && (
              <div className="space-y-2">
                {showAccountManagement && visibleOrganizationManagementItems.length > 0 && (
                  <nav className="space-y-0.5" aria-label="Organization management">
                    <p className={sidebarSectionTitleClass}>
                      組織管理
                    </p>
                    {visibleOrganizationManagementItems.map((item) => {
                      const active = isActiveRoute(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={sidebarItemClass(active)}
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
              </div>
            )}

            {section === "workspace" && (
              <div className="space-y-2">
                {workspacePathId ? (
                  <nav className="space-y-3" aria-label="Workspace navigation">
                    <div className="space-y-0.5">
                      {sortWorkspaceItemsByPreferenceOrder(WORKSPACE_PRIMARY_LINK_ITEMS)
                        .filter((item) => isWorkspaceItemEnabled(getWorkspacePrefId(item.value)))
                        .map((item) => {
                        const isActive = activeWorkspaceTab === item.value;
                        return (
                          <Link
                            key={item.value}
                            href={buildWorkspaceTabHref(workspacePathId, item.value)}
                            aria-current={isActive ? "page" : undefined}
                            className={sidebarItemClass(isActive)}
                          >
                            {tWorkspaceTabWithDevStatus(item.value, item.label)}
                          </Link>
                        );
                      })}
                    </div>

                    {isWorkspaceItemEnabled("workspace-modules") && (
                      <div className="my-1.5 border-t border-border/40" />
                    )}

                    <div className="space-y-0.5">
                      {isWorkspaceItemEnabled("workspace-modules") && (
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setIsWorkspaceModulesExpanded((prev) => !prev);
                            }}
                            className={sidebarGroupButtonClass}
                            aria-expanded={isWorkspaceModulesExpanded}
                          >
                            <span>{tWorkspaceGroup("workspaceModules", "Workspace Modules")}</span>
                            {isWorkspaceModulesExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                          </button>

                          {isWorkspaceModulesExpanded && (
                            <div className="space-y-0.5 pl-2">
                              {sortWorkspaceItemsByPreferenceOrder(WORKSPACE_MODULE_LINK_ITEMS)
                                .filter((item) => isWorkspaceItemEnabled(getWorkspacePrefId(item.value)))
                                .map((item) => {
                                const isActive = activeWorkspaceTab === item.value;
                                return (
                                  <Link
                                    key={item.value}
                                    href={buildWorkspaceTabHref(workspacePathId, item.value)}
                                    aria-current={isActive ? "page" : undefined}
                                    className={sidebarItemClass(isActive)}
                                  >
                                    {tWorkspaceTabWithDevStatus(item.value, item.label)}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      {isWorkspaceItemEnabled("spaces") && (
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setIsWorkspaceSpacesExpanded((prev) => !prev);
                            }}
                            className={sidebarGroupButtonClass}
                            aria-expanded={isWorkspaceSpacesExpanded}
                          >
                            <span>{tWorkspaceGroup("spaces", "Spaces")}</span>
                            {isWorkspaceSpacesExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                          </button>

                          {isWorkspaceSpacesExpanded && (
                            <div className="space-y-0.5 pl-2">
                                  {sortWorkspaceItemsByPreferenceOrder(WORKSPACE_SPACE_ITEMS)
                                    .filter((item) => isWorkspaceItemEnabled(getWorkspacePrefId(item.value)))
                                    .map((item) => {
                                const isActive = activeWorkspaceTab === item.value;
                                return (
                                  <Link
                                    key={item.value}
                                    href={buildWorkspaceTabHref(workspacePathId, item.value)}
                                    aria-current={isActive ? "page" : undefined}
                                    className={sidebarItemClass(isActive)}
                                  >
                                    {tWorkspaceTabWithDevStatus(item.value, item.label)}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      {isWorkspaceItemEnabled("databases") && (
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setIsWorkspaceDatabasesExpanded((prev) => !prev);
                            }}
                            className={sidebarGroupButtonClass}
                            aria-expanded={isWorkspaceDatabasesExpanded}
                          >
                            <span>{tWorkspaceGroup("databases", "Databases")}</span>
                            {isWorkspaceDatabasesExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                          </button>

                          {isWorkspaceDatabasesExpanded && (
                            <div className="space-y-0.5 pl-2">
                              {sortWorkspaceItemsByPreferenceOrder(WORKSPACE_DATABASE_ITEMS)
                                .filter((item) => isWorkspaceItemEnabled(getWorkspacePrefId(item.value)))
                                .map((item) => {
                                const isActive = activeWorkspaceTab === item.value;
                                return (
                                  <Link
                                    key={item.value}
                                    href={buildWorkspaceTabHref(workspacePathId, item.value)}
                                    aria-current={isActive ? "page" : undefined}
                                    className={sidebarItemClass(isActive)}
                                  >
                                    {tWorkspaceTabWithDevStatus(item.value, item.label)}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      {sortWorkspaceItemsByPreferenceOrder(WORKSPACE_LIBRARY_LINK_ITEMS)
                        .filter((item) => isWorkspaceItemEnabled(getWorkspacePrefId(item.value)))
                        .map((item) => {
                        const isActive = activeWorkspaceTab === item.value;
                        return (
                          <Link
                            key={item.value}
                            href={buildWorkspaceTabHref(workspacePathId, item.value)}
                            aria-current={isActive ? "page" : undefined}
                            className={sidebarItemClass(isActive)}
                          >
                            {tWorkspaceTabWithDevStatus(item.value, item.label)}
                          </Link>
                        );
                      })}
                    </div>

                  </nav>
                ) : (
                  // ── Workspace hub: show recent workspaces ──────────────
                  <div>
                    {showRecentWorkspaces && (
                      <div className="space-y-0.5">
                        <p className={sidebarSectionTitleClass}>
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
                                  ? "border border-primary/30 bg-primary/10 text-primary"
                                  : "border border-transparent text-foreground/80 hover:border-border/60 hover:bg-muted/70 hover:text-foreground"
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
                  </div>
                )}
              </div>
            )}

            {section === "knowledge" && (
              <KnowledgeSidebarSection
                pathname={pathname}
                workspacesHydrated={workspacesHydrated}
                allWorkspaceLinks={allWorkspaceLinks}
                activeWorkspaceId={activeWorkspaceId}
                creatingKind={creatingKind}
                onSelectWorkspace={onSelectWorkspace}
                onQuickCreatePage={() => {
                  void handleQuickCreatePage();
                }}
              />
            )}

            {section === "knowledge-base" && (
              <nav className="space-y-0.5" aria-label="Knowledge Base navigation">
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  知識庫
                </p>
                {(
                  [
                    { href: "/knowledge-base/articles", label: "文章" },
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

            {section === "knowledge-database" && (
              <nav className="space-y-0.5" aria-label="Knowledge Database navigation">
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  資料庫
                </p>
                {(
                  [
                    { href: "/knowledge-database/databases", label: "資料庫" },
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

            {section === "source" && (
              <nav className="space-y-0.5" aria-label="Source navigation">
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  來源文件
                </p>
                {(
                  [
                    { href: "/source/documents", label: "Documents" },
                    { href: "/source/libraries", label: "Libraries" },
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

            {section === "notebook" && (
              <nav className="space-y-0.5" aria-label="Notebook navigation">
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  Notebook
                </p>
                {(
                  [
                    { href: "/notebook/rag-query", label: "Ask / Cite" },
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

            {section === "ai-chat" && (
              <nav className="space-y-0.5" aria-label="Notebook navigation">
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  Notebook / AI
                </p>
                {(
                  [
                    { href: "/ai-chat", label: "Notebook shell" },
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
    </aside>

    <CustomizeNavigationDialog
      open={customizeOpen}
      onOpenChange={setCustomizeOpen}
      onPreferencesChange={setNavPrefs}
    />
    </div>
  );
}
