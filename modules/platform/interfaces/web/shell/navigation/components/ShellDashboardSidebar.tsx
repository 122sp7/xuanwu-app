"use client";

/**
 * Module: shell-dashboard-sidebar.tsx
 * Purpose: render the secondary navigation panel of the authenticated shell.
 * Responsibilities: account switcher, search hint, org management sub-nav, and
 *   recent workspace quick-access list. Top-level section navigation is in ShellAppRail.
 * Constraints: UI-only; workspace data sourced from module interfaces.
 */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { quickCreateKnowledgePage } from "@/modules/platform/application/services/shell-quick-create";
import {
  buildWorkspaceQuickAccessItems,
  CustomizeNavigationDialog,
  getWorkspaceIdFromPath,
  MAX_VISIBLE_RECENT_WORKSPACES,
  readNavPreferences,
  buildWorkspaceContextHref,
  supportsWorkspaceSearchContext,
  type NavPreferences,
  useRecentWorkspaces,
  useSidebarLocale,
  WorkspaceQuickAccessRow,
} from "@/modules/workspace/api";

import {
  type DashboardSidebarProps,
  ORGANIZATION_MANAGEMENT_ITEMS,
  ACCOUNT_NAV_ITEMS,
  SECTION_TITLES,
  resolveNavSection,
  isActiveRoute,
  isActiveOrganizationAccount,
} from "../data/ShellSidebarNavData";
import { ShellSidebarHeader } from "../../sidebar/ShellSidebarHeader";
import { DashboardSidebarBody } from "../../sidebar/ShellSidebarBody";

export function ShellDashboardSidebar({
  pathname,
  userId,
  activeAccount,
  workspaces,
  workspacesHydrated,
  activeWorkspaceId,
  collapsed,
  onToggleCollapsed,
  onSelectWorkspace,
}: DashboardSidebarProps) {
  const searchParams = useSearchParams();

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

  const currentSearchWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";

  useEffect(() => {
    const pathWorkspaceId = getWorkspaceIdFromPath(pathname);
    if (pathWorkspaceId && pathWorkspaceId !== activeWorkspaceId) {
      onSelectWorkspace(pathWorkspaceId);
      return;
    }

    if (!supportsWorkspaceSearchContext(pathname)) {
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

  const allWorkspaceLinks = useMemo(
    () =>
      workspaces
        .map((workspace) => ({
          id: workspace.id,
          name: workspace.name,
          href: buildWorkspaceContextHref(pathname, workspace.id),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "zh-Hant")),
    [workspaces, pathname],
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
    if (!accountId || !activeWorkspaceId) {
      toast.error(!accountId ? "目前沒有 active account，無法建立" : "請先切換到工作區，再建立頁面");
      return;
    }
    setCreatingKind("page");
    try {
      const result = await quickCreateKnowledgePage({
        accountId,
        workspaceId: activeWorkspaceId,
        createdByUserId: userId ?? accountId,
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

  return (
    <div className="contents">
      <aside
        aria-label="Secondary navigation"
        className={`hidden h-full shrink-0 flex-col overflow-hidden transition-[width] duration-200 md:flex ${
          collapsed ? "w-0" : "w-56 border-r border-border/50 bg-card/20"
        }`}
      >
        <ShellSidebarHeader
          sectionLabel={sectionMeta.label}
          sectionIcon={sectionMeta.icon}
          onOpenCustomize={() => {
            setCustomizeOpen(true);
          }}
          onToggleCollapsed={onToggleCollapsed}
        />

        <WorkspaceQuickAccessRow
          items={workspaceQuickAccessItems}
          pathname={pathname}
          currentPanel={currentPanel}
          currentWorkspaceTab={currentWorkspaceTab}
          workspaceSettingsHref={workspaceSettingsHref}
          isActiveRoute={(href) => isActiveRoute(pathname, href)}
        />

        <DashboardSidebarBody
          section={section}
          isActiveRoute={(href) => isActiveRoute(pathname, href)}
          activeAccountId={activeAccount?.id ?? null}
          showAccountManagement={showAccountManagement}
          visibleAccountItems={visibleAccountItems}
          visibleOrganizationManagementItems={visibleOrganizationManagementItems}
          workspacePathId={workspacePathId}
          navPrefs={navPrefs}
          localeBundle={localeBundle}
          showRecentWorkspaces={showRecentWorkspaces}
          visibleRecentWorkspaceLinks={visibleRecentWorkspaceLinks}
          hasOverflow={hasOverflow}
          isExpanded={isExpanded}
          activeWorkspaceId={activeWorkspaceId}
          onSelectWorkspace={onSelectWorkspace}
          onToggleExpanded={() => {
            setIsExpanded((prev) => !prev);
          }}
          pathname={pathname}
          workspacesHydrated={workspacesHydrated}
          allWorkspaceLinks={allWorkspaceLinks}
          currentSearchWorkspaceId={currentSearchWorkspaceId}
          creatingKind={creatingKind}
          onQuickCreatePage={() => {
            void handleQuickCreatePage();
          }}
        />
      </aside>

      <CustomizeNavigationDialog
        open={customizeOpen}
        onOpenChange={setCustomizeOpen}
        onPreferencesChange={setNavPrefs}
      />
    </div>
  );
}
