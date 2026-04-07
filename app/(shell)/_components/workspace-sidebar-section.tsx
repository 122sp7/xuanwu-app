"use client";

import Link from "next/link";

import {
  getWorkspaceTabStatus,
  getWorkspaceTabPrefId,
  type WorkspaceTabValue,
} from "@/modules/workspace/api";

import type { SidebarLocaleBundle } from "./use-sidebar-locale";
import type { NavPreferences } from "./customize-navigation-dialog";

// ── Re-usable tab link item shape ─────────────────────────────────────────────

interface TabLinkItem {
  value: WorkspaceTabValue;
  label: string;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface WorkspaceSidebarSectionProps {
  workspacePathId: string;
  activeWorkspaceTab: WorkspaceTabValue;
  navPrefs: NavPreferences;
  localeBundle: SidebarLocaleBundle | null;
  primaryItems: readonly TabLinkItem[];
  spaceItems: readonly TabLinkItem[];
  databaseItems: readonly TabLinkItem[];
  libraryItems: readonly TabLinkItem[];
  moduleItems: readonly TabLinkItem[];
  buildWorkspaceTabHref: (workspaceId: string, tab: WorkspaceTabValue) => string;
  sidebarItemClass: (active: boolean) => string;
}

// ── Helpers (workspace-scoped, no side effects) ───────────────────────────────

function tTab(
  tab: WorkspaceTabValue,
  fallback: string,
  localeBundle: SidebarLocaleBundle | null,
): string {
  return localeBundle?.workspace?.tabLabels?.[tab] ?? fallback;
}

function tTabWithDevStatus(
  tab: WorkspaceTabValue,
  fallback: string,
  localeBundle: SidebarLocaleBundle | null,
): string {
  const label = tTab(tab, fallback, localeBundle);
  const status = getWorkspaceTabStatus(tab);
  return `${status} ${label}`;
}

function getPrefId(tabValue: string): string {
  return getWorkspaceTabPrefId(tabValue as WorkspaceTabValue) ?? tabValue;
}

function isItemEnabled(prefId: string, navPrefs: NavPreferences): boolean {
  return navPrefs.pinnedWorkspace.includes(prefId);
}

function getItemOrder(prefId: string, navPrefs: NavPreferences): number {
  const index = navPrefs.workspaceOrder.indexOf(prefId);
  return index === -1 ? 999 : index;
}

function sortByPreferenceOrder<T extends { value: string }>(
  items: readonly T[],
  navPrefs: NavPreferences,
): T[] {
  return [...items].sort(
    (left, right) =>
      getItemOrder(getPrefId(left.value), navPrefs) -
      getItemOrder(getPrefId(right.value), navPrefs),
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WorkspaceSidebarSection({
  workspacePathId,
  activeWorkspaceTab,
  navPrefs,
  localeBundle,
  primaryItems,
  spaceItems,
  databaseItems,
  libraryItems,
  moduleItems,
  buildWorkspaceTabHref,
  sidebarItemClass,
}: WorkspaceSidebarSectionProps) {
  // Collect all visible item groups in order, separated by dividers
  const groups: Array<{ key: string; items: readonly TabLinkItem[] }> = [
    { key: "primary", items: primaryItems },
    { key: "modules", items: moduleItems },
    { key: "spaces", items: spaceItems },
    { key: "databases", items: databaseItems },
    { key: "library", items: libraryItems },
  ];

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
          {groupIndex > 0 && (
            <div className="my-1.5 border-t border-border/40" />
          )}
          <div className="space-y-0.5">
            {group.visible.map((item) => {
              const isActive = activeWorkspaceTab === item.value;
              return (
                <Link
                  key={item.value}
                  href={buildWorkspaceTabHref(workspacePathId, item.value)}
                  aria-current={isActive ? "page" : undefined}
                  className={sidebarItemClass(isActive)}
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
