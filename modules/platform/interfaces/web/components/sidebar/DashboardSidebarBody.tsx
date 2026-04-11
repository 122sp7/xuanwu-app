"use client";

import Link from "next/link";

import { KnowledgeSidebarSection } from "@/modules/notion/api";
import type { NavPreferences, SidebarLocaleBundle } from "@/modules/workspace/api";

import {
  type NavSection,
  sidebarItemClass,
  sidebarSectionTitleClass,
} from "../../navigation/sidebar-nav-data";
import { ContextScopedNavSection } from "./ContextScopedNavSection";
import { WorkspaceSectionContent } from "./WorkspaceSectionContent";

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

interface DashboardSidebarBodyProps {
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
}: DashboardSidebarBodyProps) {
  return (
    <div className="flex-1 overflow-y-auto px-2.5 py-2.5">
      {section === "account" && (
        <div className="space-y-2">
          {showAccountManagement && visibleAccountItems.length > 0 && (
            <ManagedNavGroup
              title="Account"
              ariaLabel="Account navigation"
              items={visibleAccountItems}
              isActiveRoute={isActiveRoute}
            />
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
            <ManagedNavGroup
              title="組織管理"
              ariaLabel="Organization management"
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

      {section === "knowledge-base" && (
        <ContextScopedNavSection
          title="知識庫"
          items={[{ href: "/knowledge-base/articles", label: "文章" }]}
          isActiveRoute={isActiveRoute}
          activeAccountId={activeAccountId}
          activeWorkspaceId={currentSearchWorkspaceId || activeWorkspaceId}
        />
      )}

      {section === "knowledge-database" && (
        <ContextScopedNavSection
          title="資料庫"
          items={[{ href: "/knowledge-database/databases", label: "資料庫" }]}
          isActiveRoute={isActiveRoute}
          activeAccountId={activeAccountId}
          activeWorkspaceId={currentSearchWorkspaceId || activeWorkspaceId}
        />
      )}

      {section === "source" && (
        <ContextScopedNavSection
          title="來源文件"
          items={[{ href: "/source/libraries", label: "Libraries" }]}
          isActiveRoute={isActiveRoute}
          activeAccountId={activeAccountId}
          activeWorkspaceId={currentSearchWorkspaceId || activeWorkspaceId}
        />
      )}

      {section === "notebook" && (
        <ContextScopedNavSection
          title="Notebook"
          items={[{ href: "/notebook/rag-query", label: "Ask / Cite" }]}
          isActiveRoute={isActiveRoute}
          activeAccountId={activeAccountId}
          activeWorkspaceId={currentSearchWorkspaceId || activeWorkspaceId}
        />
      )}

      {section === "ai-chat" && (
        <ContextScopedNavSection
          title="Notebook / AI"
          items={[{ href: "/ai-chat", label: "Notebook shell" }]}
          isActiveRoute={isActiveRoute}
          activeAccountId={activeAccountId}
          activeWorkspaceId={currentSearchWorkspaceId || activeWorkspaceId}
        />
      )}
    </div>
  );
}
