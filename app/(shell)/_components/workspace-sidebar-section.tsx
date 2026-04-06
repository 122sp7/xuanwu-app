"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

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
  isWorkspaceSpacesExpanded: boolean;
  setIsWorkspaceSpacesExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isWorkspaceDatabasesExpanded: boolean;
  setIsWorkspaceDatabasesExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isWorkspaceModulesExpanded: boolean;
  setIsWorkspaceModulesExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  primaryItems: readonly TabLinkItem[];
  spaceItems: readonly TabLinkItem[];
  databaseItems: readonly TabLinkItem[];
  libraryItems: readonly TabLinkItem[];
  moduleItems: readonly TabLinkItem[];
  buildWorkspaceTabHref: (workspaceId: string, tab: WorkspaceTabValue) => string;
  sidebarItemClass: (active: boolean) => string;
  sidebarGroupButtonClass: string;
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

function tGroup(
  groupKey: string,
  fallback: string,
  localeBundle: SidebarLocaleBundle | null,
): string {
  return localeBundle?.workspace?.groups?.[groupKey] ?? fallback;
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
  isWorkspaceSpacesExpanded,
  setIsWorkspaceSpacesExpanded,
  isWorkspaceDatabasesExpanded,
  setIsWorkspaceDatabasesExpanded,
  isWorkspaceModulesExpanded,
  setIsWorkspaceModulesExpanded,
  primaryItems,
  spaceItems,
  databaseItems,
  libraryItems,
  moduleItems,
  buildWorkspaceTabHref,
  sidebarItemClass,
  sidebarGroupButtonClass,
}: WorkspaceSidebarSectionProps) {
  return (
    <nav className="space-y-3" aria-label="Workspace navigation">
      {/* ── Primary tabs ── */}
      <div className="space-y-0.5">
        {sortByPreferenceOrder(primaryItems, navPrefs)
          .filter((item) => isItemEnabled(getPrefId(item.value), navPrefs))
          .map((item) => {
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

      {/* ── Workspace Modules group ── */}
      {isItemEnabled("workspace-modules", navPrefs) && (
        <>
          <div className="my-1.5 border-t border-border/40" />
          <div className="space-y-0.5">
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => { setIsWorkspaceModulesExpanded((prev) => !prev); }}
                className={sidebarGroupButtonClass}
                aria-expanded={isWorkspaceModulesExpanded}
              >
                <span>{tGroup("workspaceModules", "Workspace Modules", localeBundle)}</span>
                {isWorkspaceModulesExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
              </button>
              {isWorkspaceModulesExpanded && (
                <div className="space-y-0.5 pl-2">
                  {sortByPreferenceOrder(moduleItems, navPrefs)
                    .filter((item) => isItemEnabled(getPrefId(item.value), navPrefs))
                    .map((item) => {
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
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Spaces group ── */}
      {isItemEnabled("spaces", navPrefs) && (
        <div className="space-y-0.5">
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => { setIsWorkspaceSpacesExpanded((prev) => !prev); }}
              className={sidebarGroupButtonClass}
              aria-expanded={isWorkspaceSpacesExpanded}
            >
              <span>{tGroup("spaces", "Spaces", localeBundle)}</span>
              {isWorkspaceSpacesExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
            </button>
            {isWorkspaceSpacesExpanded && (
              <div className="space-y-0.5 pl-2">
                {sortByPreferenceOrder(spaceItems, navPrefs)
                  .filter((item) => isItemEnabled(getPrefId(item.value), navPrefs))
                  .map((item) => {
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
            )}
          </div>
        </div>
      )}

      {/* ── Databases group ── */}
      {isItemEnabled("databases", navPrefs) && (
        <div className="space-y-0.5">
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => { setIsWorkspaceDatabasesExpanded((prev) => !prev); }}
              className={sidebarGroupButtonClass}
              aria-expanded={isWorkspaceDatabasesExpanded}
            >
              <span>{tGroup("databases", "Databases", localeBundle)}</span>
              {isWorkspaceDatabasesExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
            </button>
            {isWorkspaceDatabasesExpanded && (
              <div className="space-y-0.5 pl-2">
                {sortByPreferenceOrder(databaseItems, navPrefs)
                  .filter((item) => isItemEnabled(getPrefId(item.value), navPrefs))
                  .map((item) => {
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
            )}
          </div>
        </div>
      )}

      {/* ── Library items ── */}
      <div className="space-y-0.5">
        {sortByPreferenceOrder(libraryItems, navPrefs)
          .filter((item) => isItemEnabled(getPrefId(item.value), navPrefs))
          .map((item) => {
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
    </nav>
  );
}
