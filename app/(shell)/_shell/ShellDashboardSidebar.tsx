"use client";

/**
 * ShellDashboardSidebar — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it composes workspace module components.
 */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  buildWorkspaceQuickAccessItems,
  CustomizeNavigationDialog,
  getWorkspaceIdFromPath,
  MAX_VISIBLE_RECENT_WORKSPACES,
  readNavPreferences,
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
} from "./ShellSidebarNavData";
import { ShellSidebarHeader } from "./ShellSidebarHeader";
import { DashboardSidebarBody } from "./ShellSidebarBody";

export function ShellDashboardSidebar({
  pathname,
  activeAccount,
  workspaces,
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

  const section = resolveNavSection(pathname);
  const sectionMeta = SECTION_TITLES[section];
  const workspacePathId = getWorkspaceIdFromPath(pathname);
  const currentPanel = searchParams.get("panel");
  const currentWorkspaceTab = searchParams.get("tab");
  const hasSingleWorkspaceContext = section === "workspace" && Boolean(workspacePathId);
  const hasWorkspaceToolContext = false;
  const workspaceQuickAccessId =
    workspacePathId || currentSearchWorkspaceId || "";
  const showWorkspaceQuickAccess = hasSingleWorkspaceContext || hasWorkspaceToolContext;
  const workspaceSettingsHref = workspaceQuickAccessId
    ? activeAccount?.id
      ? `/${encodeURIComponent(activeAccount.id)}/${encodeURIComponent(workspaceQuickAccessId)}?tab=Overview&panel=settings`
      : "/"
    : "";
  const workspaceQuickAccessItems = useMemo(
    () =>
      showWorkspaceQuickAccess && workspaceQuickAccessId
        ? buildWorkspaceQuickAccessItems(workspaceQuickAccessId, activeAccount?.id)
        : [],
    [showWorkspaceQuickAccess, workspaceQuickAccessId, activeAccount?.id],
  );

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
          currentSearchWorkspaceId={currentSearchWorkspaceId}
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
