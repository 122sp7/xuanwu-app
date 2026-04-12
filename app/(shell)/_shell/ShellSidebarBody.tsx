"use client";

/**
 * ShellSidebarBody — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it imports from workspace and notion modules.
 */

import Link from "next/link";

import { KnowledgeSidebarSection } from "@/modules/notion/api";
import {
  WorkspaceSectionContent,
  type NavPreferences,
  type SidebarLocaleBundle,
} from "@/modules/workspace/api";
import { SHELL_CONTEXT_SECTION_CONFIG } from "@/modules/platform/api";

import {
  type NavSection,
  sidebarItemClass,
  sidebarSectionTitleClass,
} from "./ShellSidebarNavData";
import { ShellContextNavSection } from "./ShellContextNavSection";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface WorkspaceLink {
  id: string;
  name: string;
  href: string;
}

interface ShellSidebarBodyProps {
  section: NavSection;
  isActiveRoute: (href: string) => boolean;
  activeAccountId: string | null;
  showAccountManagement: boolean;
  visibleAccountItems: readonly NavItem[];
  visibleOrganizationManagementItems: readonly NavItem[];
  workspacePathId: string | null;
  navPrefs: NavPreferences;
  localeBundle: SidebarLocaleBundle | null;
  showRecentWorkspaces: boolean;
  visibleRecentWorkspaceLinks: WorkspaceLink[];
  hasOverflow: boolean;
  isExpanded: boolean;
  activeWorkspaceId: string | null;
  onSelectWorkspace: (workspaceId: string | null) => void;
  onToggleExpanded: () => void;
  pathname: string;
  workspacesHydrated: boolean;
  allWorkspaceLinks: WorkspaceLink[];
  currentSearchWorkspaceId: string;
  creatingKind: "page" | "database" | null;
  onQuickCreatePage: () => void;
}

function ManagedNavGroup({
  title,
  ariaLabel,
  items,
  isActiveRoute,
}: {
  title: string;
  ariaLabel: string;
  items: readonly NavItem[];
  isActiveRoute: (href: string) => boolean;
}) {
  return (
    <nav className="space-y-0.5" aria-label={ariaLabel}>
      <p className={sidebarSectionTitleClass}>{title}</p>
      {items.map((item) => {
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
  );
}

export function DashboardSidebarBody({
  section,
  isActiveRoute,
  activeAccountId,
  showAccountManagement,
  visibleAccountItems,
  visibleOrganizationManagementItems,
  workspacePathId,
  navPrefs,
  localeBundle,
  showRecentWorkspaces,
  visibleRecentWorkspaceLinks,
  hasOverflow,
  isExpanded,
  activeWorkspaceId,
  onSelectWorkspace,
  onToggleExpanded,
  pathname,
  workspacesHydrated,
  allWorkspaceLinks,
  currentSearchWorkspaceId,
  creatingKind,
  onQuickCreatePage,
}: ShellSidebarBodyProps) {
  const contextSection = SHELL_CONTEXT_SECTION_CONFIG[section];

  return (
    <div className="flex-1 overflow-y-auto px-2.5 py-2.5">
      {section === "account" && (
        <div className="space-y-2">
          {showAccountManagement && visibleAccountItems.length > 0 && (
            <ManagedNavGroup
              title="帳號"
              ariaLabel="帳號導覽"
              items={visibleAccountItems}
              isActiveRoute={isActiveRoute}
            />
          )}
          {!showAccountManagement && (
            <p className="px-2 py-4 text-[11px] text-muted-foreground">
              請切換到組織帳號以查看帳號選項。
            </p>
          )}
        </div>
      )}

      {section === "organization" && (
        <div className="space-y-2">
          {showAccountManagement && visibleOrganizationManagementItems.length > 0 && (
            <ManagedNavGroup
              title="組織管理"
              ariaLabel="組織管理導覽"
              items={visibleOrganizationManagementItems}
              isActiveRoute={isActiveRoute}
            />
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
          <WorkspaceSectionContent
            workspacePathId={workspacePathId}
            navPrefs={navPrefs}
            localeBundle={localeBundle}
            showRecentWorkspaces={showRecentWorkspaces}
            visibleRecentWorkspaceLinks={visibleRecentWorkspaceLinks}
            hasOverflow={hasOverflow}
            isExpanded={isExpanded}
            activeWorkspaceId={activeWorkspaceId}
            isActiveRoute={isActiveRoute}
            onSelectWorkspace={onSelectWorkspace}
            onToggleExpanded={onToggleExpanded}
            getItemClassName={sidebarItemClass}
            sectionTitleClassName={sidebarSectionTitleClass}
          />
        </div>
      )}

      {section === "knowledge" && (
        <KnowledgeSidebarSection
          pathname={pathname}
          workspacesHydrated={workspacesHydrated}
          allWorkspaceLinks={allWorkspaceLinks}
          activeAccountId={activeAccountId}
          activeWorkspaceId={currentSearchWorkspaceId || activeWorkspaceId}
          creatingKind={creatingKind}
          onSelectWorkspace={onSelectWorkspace}
          onQuickCreatePage={onQuickCreatePage}
        />
      )}

      {contextSection && (
        <ShellContextNavSection
          title={contextSection.title}
          items={contextSection.items}
          isActiveRoute={isActiveRoute}
          activeAccountId={activeAccountId}
          activeWorkspaceId={currentSearchWorkspaceId || activeWorkspaceId}
        />
      )}
    </div>
  );
}
