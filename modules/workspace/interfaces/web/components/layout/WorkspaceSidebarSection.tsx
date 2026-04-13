"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  getWorkspaceTabLabel,
  getWorkspaceTabPrefId,
  getWorkspaceTabsByGroup,
  WORKSPACE_TAB_SIDEBAR_GROUP_ORDER,
  getWorkspaceTabStatus,
  resolveWorkspaceTabValue,
  type WorkspaceTabGroup,
  type WorkspaceTabValue,
} from "../../navigation/workspace-tabs";

export interface WorkspaceSidebarLocaleBundle {
  workspace?: {
    tabLabels?: Record<string, string>;
  };
}

export interface WorkspaceNavigationPreferences {
  pinnedWorkspace: string[];
  workspaceOrder: string[];
}

interface TabLinkItem {
  value: WorkspaceTabValue;
  label: string;
}

function createWorkspaceLinkItems(group: WorkspaceTabGroup): TabLinkItem[] {
  return getWorkspaceTabsByGroup(group).map((value) => ({
    value,
    label: getWorkspaceTabLabel(value),
  }));
}

const WORKSPACE_PRIMARY_LINK_ITEMS = createWorkspaceLinkItems("primary");
const WORKSPACE_LINK_ITEMS_BY_GROUP: Record<WorkspaceTabGroup, readonly TabLinkItem[]> = {
  primary: WORKSPACE_PRIMARY_LINK_ITEMS,
  modules: createWorkspaceLinkItems("modules"),
  spaces: createWorkspaceLinkItems("spaces"),
  databases: createWorkspaceLinkItems("databases"),
  library: createWorkspaceLinkItems("library"),
};

function buildWorkspaceTabHref(workspaceId: string, tab: WorkspaceTabValue): string {
  return `?tab=${encodeURIComponent(tab)}`;
}

function tTab(
  tab: WorkspaceTabValue,
  fallback: string,
  localeBundle: WorkspaceSidebarLocaleBundle | null,
): string {
  return localeBundle?.workspace?.tabLabels?.[tab] ?? fallback;
}

function tTabWithDevStatus(
  tab: WorkspaceTabValue,
  fallback: string,
  localeBundle: WorkspaceSidebarLocaleBundle | null,
): string {
  const label = tTab(tab, fallback, localeBundle);
  const status = getWorkspaceTabStatus(tab);
  return `${status} ${label}`;
}

function getPrefId(tabValue: string): string {
  return getWorkspaceTabPrefId(tabValue as WorkspaceTabValue) ?? tabValue;
}

function isItemEnabled(prefId: string, navPrefs: WorkspaceNavigationPreferences): boolean {
  return navPrefs.pinnedWorkspace.includes(prefId);
}

function getItemOrder(prefId: string, navPrefs: WorkspaceNavigationPreferences): number {
  const index = navPrefs.workspaceOrder.indexOf(prefId);
  return index === -1 ? 999 : index;
}

function sortByPreferenceOrder<T extends { value: string }>(
  items: readonly T[],
  navPrefs: WorkspaceNavigationPreferences,
): T[] {
  return [...items].sort(
    (left, right) =>
      getItemOrder(getPrefId(left.value), navPrefs) -
      getItemOrder(getPrefId(right.value), navPrefs),
  );
}

interface WorkspaceSidebarSectionProps {
  workspacePathId: string;
  navPrefs: WorkspaceNavigationPreferences;
  localeBundle: WorkspaceSidebarLocaleBundle | null;
  getItemClassName: (isActive: boolean) => string;
}

export function WorkspaceSidebarSection({
  workspacePathId,
  navPrefs,
  localeBundle,
  getItemClassName,
}: WorkspaceSidebarSectionProps) {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab") ?? "Overview";
  const activeWorkspaceTab: WorkspaceTabValue = resolveWorkspaceTabValue(rawTab) ?? "Overview";

  const groups: Array<{ key: WorkspaceTabGroup; items: readonly TabLinkItem[] }> =
    WORKSPACE_TAB_SIDEBAR_GROUP_ORDER.map((groupKey) => ({
      key: groupKey,
      items: WORKSPACE_LINK_ITEMS_BY_GROUP[groupKey],
    }));

  const visibleGroups = groups
    .map((g) => ({
      key: g.key,
      visible: sortByPreferenceOrder(g.items, navPrefs).filter((item) =>
        isItemEnabled(getPrefId(item.value), navPrefs),
      ),
    }))
    .filter((g) => g.visible.length > 0);

  return (
    <nav className="space-y-0.5" aria-label="Workspace navigation">
      {visibleGroups.map((group, groupIndex) => (
        <div key={group.key}>
          {groupIndex > 0 && <div className="my-1.5 border-t border-border/40" />}
          <div className="space-y-0.5">
            {group.visible.map((item) => {
              const isActive = activeWorkspaceTab === item.value;
              return (
                <Link
                  key={item.value}
                  href={buildWorkspaceTabHref(workspacePathId, item.value)}
                  aria-current={isActive ? "page" : undefined}
                  className={getItemClassName(isActive)}
                >
                  {tTabWithDevStatus(item.value, item.label, localeBundle)}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
