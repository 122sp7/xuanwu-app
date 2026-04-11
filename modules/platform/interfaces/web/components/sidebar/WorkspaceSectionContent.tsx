"use client";

import Link from "next/link";

import {
  type NavPreferences,
  type SidebarLocaleBundle,
  WorkspaceSidebarSection,
} from "@/modules/workspace/api";

import {
  sidebarItemClass,
  sidebarSectionTitleClass,
} from "../../navigation/sidebar-nav-data";

interface RecentWorkspaceLink {
  id: string;
  name: string;
  href: string;
}

interface WorkspaceSectionContentProps {
  workspacePathId: string | null;
  navPrefs: NavPreferences;
  localeBundle: SidebarLocaleBundle | null;
  showRecentWorkspaces: boolean;
  visibleRecentWorkspaceLinks: RecentWorkspaceLink[];
  hasOverflow: boolean;
  isExpanded: boolean;
  activeWorkspaceId: string | null;
  isActiveRoute: (href: string) => boolean;
  onSelectWorkspace: (workspaceId: string | null) => void;
  onToggleExpanded: () => void;
}

export function WorkspaceSectionContent({
  workspacePathId,
  navPrefs,
  localeBundle,
  showRecentWorkspaces,
  visibleRecentWorkspaceLinks,
  hasOverflow,
  isExpanded,
  activeWorkspaceId,
  isActiveRoute,
  onSelectWorkspace,
  onToggleExpanded,
}: WorkspaceSectionContentProps) {
  if (workspacePathId) {
    return (
      <WorkspaceSidebarSection
        workspacePathId={workspacePathId}
        navPrefs={navPrefs}
        localeBundle={localeBundle}
        getItemClassName={sidebarItemClass}
      />
    );
  }

  if (!showRecentWorkspaces) {
    return null;
  }

  return (
    <div className="space-y-0.5">
      <p className={sidebarSectionTitleClass}>最近工作區</p>
      {visibleRecentWorkspaceLinks.length === 0 ? (
        <p className="px-2 py-2 text-[11px] text-muted-foreground">
          尚無最近開啟的工作區。
        </p>
      ) : (
        visibleRecentWorkspaceLinks.map((workspace) => (
          <Link
            key={workspace.id}
            href={workspace.href}
            onClick={() => {
              onSelectWorkspace(workspace.id);
            }}
            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
              activeWorkspaceId === workspace.id || isActiveRoute(workspace.href)
                ? "border border-primary/30 bg-primary/10 text-primary"
                : "border border-transparent text-foreground/80 hover:border-border/60 hover:bg-muted/70 hover:text-foreground"
            }`}
            title={workspace.name}
          >
            <span className="truncate">{workspace.name}</span>
          </Link>
        ))
      )}
      {hasOverflow && (
        <button
          type="button"
          onClick={onToggleExpanded}
          className="px-2 py-1 text-[11px] font-medium text-primary hover:underline"
        >
          {isExpanded ? "收起" : "顯示更多"}
        </button>
      )}
    </div>
  );
}
