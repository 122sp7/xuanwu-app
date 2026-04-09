"use client";

/**
 * Module: dashboard-sidebar.tsx
 * Purpose: render the secondary navigation panel of the authenticated shell.
 * Responsibilities: account switcher, search hint, org management sub-nav, and
 *   recent workspace quick-access list.  Top-level section navigation is in AppRail.
 * Constraints: UI-only; workspace data sourced from module interfaces.
 */

import Link from "next/link";
import {
  PanelLeftClose,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { createKnowledgePage } from "@/modules/knowledge/api";
import { buildWorkspaceQuickAccessItems } from "@/modules/workspace/interfaces/api";
import { useAuth } from "@/app/providers/auth-provider";
import {
  CustomizeNavigationDialog,
  readNavPreferences,
  type NavPreferences,
} from "./customize-navigation-dialog";
import { KnowledgeSidebarSection } from "./knowledge-sidebar-section";
import {
  getWorkspaceIdFromPath,
  MAX_VISIBLE_RECENT_WORKSPACES,
  useRecentWorkspaces,
} from "./use-recent-workspaces";
import { useSidebarLocale } from "./use-sidebar-locale";
import { WorkspaceSidebarSection } from "./workspace-sidebar-section";
import {
  type DashboardSidebarProps,
  ORGANIZATION_MANAGEMENT_ITEMS,
  ACCOUNT_NAV_ITEMS,
  SECTION_TITLES,
  sidebarItemClass,
  sidebarSectionTitleClass,
  resolveNavSection,
  isActiveOrganizationAccount,
  SimpleNavLinks,
} from "./sidebar-nav-data";

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
  const searchParams = useSearchParams();
  const quickAccessDragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    didDrag: boolean;
  } | null>(null);
  const suppressQuickAccessClickRef = useRef(false);
  const { state: authState } = useAuth();
  const { isExpanded, setIsExpanded, recentWorkspaceLinks } = useRecentWorkspaces(
    activeAccount?.id,
    pathname,
    workspaces,
  );
  const [creatingKind, setCreatingKind] = useState<"page" | "database" | null>(null);
  const [navPrefs, setNavPrefs] = useState<NavPreferences>(() => readNavPreferences());
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const localeBundle = useSidebarLocale();

  const showAccountManagement = isActiveOrganizationAccount(activeAccount);

  const visibleOrganizationManagementItems = useMemo(
    () => ORGANIZATION_MANAGEMENT_ITEMS.filter((item) => navPrefs.pinnedWorkspace.includes(item.id)),
    [navPrefs.pinnedWorkspace],
  );

  const visibleAccountItems = useMemo(
    () => ACCOUNT_NAV_ITEMS.filter((item) => navPrefs.pinnedWorkspace.includes(item.id)),
    [navPrefs.pinnedWorkspace],
  );

  const showRecentWorkspaces = navPrefs.pinnedPersonal.includes("recent-workspaces");

  const effectiveMaxWorkspaces = navPrefs.showLimitedWorkspaces
    ? navPrefs.maxWorkspaces
    : MAX_VISIBLE_RECENT_WORKSPACES;

  function isActiveRoute(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const currentSearchWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";

  useEffect(() => {
    const pathWorkspaceId = getWorkspaceIdFromPath(pathname);
    if (pathWorkspaceId && pathWorkspaceId !== activeWorkspaceId) {
      onSelectWorkspace(pathWorkspaceId);
      return;
    }

    const supportsWorkspaceSearchContext =
      pathname.startsWith("/knowledge") ||
      pathname.startsWith("/source") ||
      pathname.startsWith("/notebook");

    if (!supportsWorkspaceSearchContext) {
      return;
    }

    if (currentSearchWorkspaceId && currentSearchWorkspaceId !== activeWorkspaceId) {
      onSelectWorkspace(currentSearchWorkspaceId);
    }
  }, [pathname, activeWorkspaceId, currentSearchWorkspaceId, onSelectWorkspace]);

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

  const allWorkspaceLinks = useMemo(
    () =>
      workspaces
        .map((workspace) => ({
          id: workspace.id,
          name: workspace.name,
          href: buildWorkspaceContextHref(workspace.id),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "zh-Hant")),
    [workspaces, buildWorkspaceContextHref],
  );

  const section = resolveNavSection(pathname);
  const sectionMeta = SECTION_TITLES[section];
  const workspacePathId = getWorkspaceIdFromPath(pathname);
  const currentPanel = searchParams.get("panel");
  const currentWorkspaceTab = searchParams.get("tab");
  const hasSingleWorkspaceContext = section === "workspace" && Boolean(workspacePathId);
  const hasWorkspaceToolContext =
    Boolean(activeWorkspaceId || currentSearchWorkspaceId) &&
    (section === "knowledge" ||
      section === "knowledge-base" ||
      section === "source" ||
      section === "notebook");
  const workspaceQuickAccessId =
    workspacePathId || currentSearchWorkspaceId || (hasWorkspaceToolContext ? activeWorkspaceId ?? "" : "");
  const showWorkspaceQuickAccess = hasSingleWorkspaceContext || hasWorkspaceToolContext;
  const workspaceSettingsHref = workspaceQuickAccessId
    ? `/workspace/${encodeURIComponent(workspaceQuickAccessId)}?tab=Overview&panel=settings`
    : "";
  const workspaceQuickAccessItems = useMemo(
    () =>
      showWorkspaceQuickAccess && workspaceQuickAccessId
        ? buildWorkspaceQuickAccessItems(workspaceQuickAccessId)
        : [],
    [showWorkspaceQuickAccess, workspaceQuickAccessId],
  );

  async function handleQuickCreatePage() {
    const accountId = activeAccount?.id ?? "";
    if (!accountId) {
      toast.error("目前沒有 active account，無法建立");
      return;
    }
    if (!activeWorkspaceId) {
      toast.error("請先切換到工作區，再建立頁面");
      return;
    }
    setCreatingKind("page");
    try {
      const result = await createKnowledgePage({
        accountId,
        workspaceId: activeWorkspaceId,
        title: "未命名頁面",
        parentPageId: null,
        createdByUserId: authState.user?.id ?? accountId,
      });
      if (result.success) {
        toast.success("已建立頁面");
      } else {
        toast.error(result.error?.message ?? "建立頁面失敗");
      }
    } catch (error) {
      console.error(error);
      toast.error("建立頁面失敗");
    } finally {
      setCreatingKind(null);
    }
  }

  function handleQuickAccessPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const container = event.currentTarget;
    if (container.scrollWidth <= container.clientWidth) {
      return;
    }

    quickAccessDragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: container.scrollLeft,
      didDrag: false,
    };
  }

  function handleQuickAccessPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const dragState = quickAccessDragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    if (!dragState.didDrag && Math.abs(deltaX) > 4) {
      dragState.didDrag = true;
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }

    if (!dragState.didDrag) {
      return;
    }

    event.preventDefault();
    event.currentTarget.scrollLeft = dragState.startScrollLeft - deltaX;
  }

  function finishQuickAccessPointer(event: React.PointerEvent<HTMLDivElement>) {
    const dragState = quickAccessDragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    if (dragState.didDrag) {
      suppressQuickAccessClickRef.current = true;
      window.setTimeout(() => {
        suppressQuickAccessClickRef.current = false;
      }, 0);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    quickAccessDragStateRef.current = null;
  }

  function handleQuickAccessItemClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!suppressQuickAccessClickRef.current) {
      return;
    }

    suppressQuickAccessClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  function handleQuickAccessDragStart(event: React.DragEvent<HTMLAnchorElement>) {
    event.preventDefault();
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
          <span className="flex flex-1 items-center gap-1.5 px-1 text-[11px] font-semibold tracking-tight text-foreground/80">
            {sectionMeta.icon}
            {sectionMeta.label}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="設定"
              aria-label="設定"
              onClick={() => { setCustomizeOpen(true); }}
              className="flex size-6 items-center justify-center rounded text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
            >
              <SlidersHorizontal className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label="收起側欄"
              title="收起側欄"
              className="flex size-6 items-center justify-center rounded text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
            >
              <PanelLeftClose className="size-3.5" />
            </button>
          </div>
        </div>

        {/* ── Quick access row ───────────────────────────────────── */}
        {workspaceQuickAccessItems.length > 0 ? (
          <div className="shrink-0 border-b border-border/30 px-2 py-2">
            <div className="flex items-center gap-1">
              <div
                className="min-w-0 flex-1 cursor-grab overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing"
                onPointerDown={handleQuickAccessPointerDown}
                onPointerMove={handleQuickAccessPointerMove}
                onPointerUp={finishQuickAccessPointer}
                onPointerCancel={finishQuickAccessPointer}
              >
                <div className="flex w-max items-center gap-1 pr-1 select-none">
                  {workspaceQuickAccessItems.map((item) => {
                    const active = item.isActive?.(pathname, {
                      panel: currentPanel,
                      tab: currentWorkspaceTab,
                    }) ?? isActiveRoute(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-label={item.label}
                        aria-current={active ? "page" : undefined}
                        onClick={handleQuickAccessItemClick}
                        onDragStart={handleQuickAccessDragStart}
                        draggable={false}
                        className={`flex size-7 shrink-0 items-center justify-center rounded-md transition ${
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
                </div>
              </div>
              {workspaceSettingsHref ? (
                <Link
                  href={workspaceSettingsHref}
                  aria-label="工作區設定"
                  aria-current={currentPanel === "settings" ? "page" : undefined}
                  onClick={handleQuickAccessItemClick}
                  onDragStart={handleQuickAccessDragStart}
                  draggable={false}
                  className={`ml-auto flex size-7 items-center justify-center rounded-md transition ${
                    currentPanel === "settings"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  <Settings className="size-3.5" />
                  <span className="sr-only">工作區設定</span>
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* ── Scrollable nav body ─── section-specific ──────────── */}
        <div className="flex-1 overflow-y-auto px-2.5 py-2.5">

          {section === "account" && (
            <div className="space-y-2">
              {showAccountManagement && visibleAccountItems.length > 0 && (
                <nav className="space-y-0.5" aria-label="Account navigation">
                  <p className={sidebarSectionTitleClass}>Account</p>
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
                  <p className={sidebarSectionTitleClass}>組織管理</p>
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
                <WorkspaceSidebarSection
                  workspacePathId={workspacePathId}
                  navPrefs={navPrefs}
                  localeBundle={localeBundle}
                />
              ) : (
                <div>
                  {showRecentWorkspaces && (
                    <div className="space-y-0.5">
                      <p className={sidebarSectionTitleClass}>最近工作區</p>
                      {visibleRecentWorkspaceLinks.length === 0 ? (
                        <p className="px-2 py-2 text-[11px] text-muted-foreground">
                          尚無最近開啟的工作區。
                        </p>
                      ) : (
                        visibleRecentWorkspaceLinks.map((ws) => (
                          <Link
                            key={ws.id}
                            href={ws.href}
                            onClick={() => { onSelectWorkspace(ws.id); }}
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
                          onClick={() => { setIsExpanded((prev) => !prev); }}
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
              onQuickCreatePage={() => { void handleQuickCreatePage(); }}
            />
          )}

          {section === "knowledge-base" && (
            <SimpleNavLinks
              title="知識庫"
              items={[{ href: "/knowledge-base/articles", label: "文章" }]}
              isActiveRoute={isActiveRoute}
            />
          )}

          {section === "knowledge-database" && (
            <SimpleNavLinks
              title="資料庫"
              items={[{ href: "/knowledge-database/databases", label: "資料庫" }]}
              isActiveRoute={isActiveRoute}
            />
          )}

          {section === "source" && (
            <SimpleNavLinks
              title="來源文件"
              items={[
                { href: "/source/documents", label: "Documents" },
                { href: "/source/libraries", label: "Libraries" },
              ]}
              isActiveRoute={isActiveRoute}
            />
          )}

          {section === "notebook" && (
            <SimpleNavLinks
              title="Notebook"
              items={[{ href: "/notebook/rag-query", label: "Ask / Cite" }]}
              isActiveRoute={isActiveRoute}
            />
          )}

          {section === "ai-chat" && (
            <SimpleNavLinks
              title="Notebook / AI"
              items={[{ href: "/ai-chat", label: "Notebook shell" }]}
              isActiveRoute={isActiveRoute}
            />
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
