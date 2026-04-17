"use client";

/**
 * workspace-ui-stubs — workspace inbound adapter (React).
 *
 * Stub components and helpers for workspace UI elements that were previously
 * sourced from @/modules/workspace/api/ui. Replace with real implementations
 * when the workspace UI layer is available.
 */

import type { ReactNode } from "react";
import type { WorkspaceEntity } from "./WorkspaceContext";

// ── Nav preference types ──────────────────────────────────────────────────────

export interface NavPreferences {
  readonly pinnedWorkspace: string[];
  readonly pinnedPersonal: string[];
  readonly showLimitedWorkspaces: boolean;
  readonly maxWorkspaces: number;
}

export type SidebarLocaleBundle = Record<string, string>;

// ── Nav preference helpers ────────────────────────────────────────────────────

const DEFAULT_NAV_PREFS: NavPreferences = {
  pinnedWorkspace: [],
  pinnedPersonal: ["recent-workspaces"],
  showLimitedWorkspaces: false,
  maxWorkspaces: 5,
};

export const MAX_VISIBLE_RECENT_WORKSPACES = 5;

export function readNavPreferences(): NavPreferences {
  return DEFAULT_NAV_PREFS;
}

export function supportsWorkspaceSearchContext(_pathname: string): boolean {
  return false;
}

export function getWorkspaceIdFromPath(_pathname: string): string | null {
  return null;
}

export function appendWorkspaceContextQuery(
  href: string,
  _context: { accountId: string | null; workspaceId: string | null },
): string {
  return href;
}

export function buildWorkspaceQuickAccessItems(
  _workspaceId: string,
  _accountId: string | undefined,
): { id: string; label: string; href: string }[] {
  return [];
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

interface WorkspaceLink {
  id: string;
  name: string;
  href: string;
}

export function useRecentWorkspaces(
  _accountId: string | undefined,
  _pathname: string,
  _workspaces: WorkspaceEntity[],
): {
  isExpanded: boolean;
  setIsExpanded: (fn: (prev: boolean) => boolean) => void;
  recentWorkspaceLinks: WorkspaceLink[];
} {
  return {
    isExpanded: false,
    setIsExpanded: () => {},
    recentWorkspaceLinks: [],
  };
}

export function useSidebarLocale(): SidebarLocaleBundle | null {
  return null;
}

// ── Stub components ───────────────────────────────────────────────────────────

interface WorkspaceQuickAccessRowProps {
  items: { id: string; label: string; href: string }[];
  pathname: string;
  currentPanel: string | null;
  currentWorkspaceTab: string | null;
  workspaceSettingsHref: string;
  isActiveRoute: (href: string) => boolean;
}

export function WorkspaceQuickAccessRow(
  _props: WorkspaceQuickAccessRowProps,
): null {
  return null;
}

interface WorkspaceSectionContentProps {
  workspacePathId: string | null;
  navPrefs: NavPreferences;
  localeBundle: SidebarLocaleBundle | null;
  showRecentWorkspaces: boolean;
  visibleRecentWorkspaceLinks: WorkspaceLink[];
  hasOverflow: boolean;
  isExpanded: boolean;
  activeWorkspaceId: string | null;
  isActiveRoute: (href: string) => boolean;
  onSelectWorkspace: (id: string | null) => void;
  onToggleExpanded: () => void;
  getItemClassName: (active: boolean) => string;
  sectionTitleClassName: string;
}

export function WorkspaceSectionContent(
  _props: WorkspaceSectionContentProps,
): null {
  return null;
}

interface CustomizeNavigationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPreferencesChange: (prefs: NavPreferences) => void;
}

export function CustomizeNavigationDialog(
  _props: CustomizeNavigationDialogProps,
): null {
  return null;
}

interface CreateWorkspaceDialogRailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string | null;
  accountType: "user" | "organization" | null;
  creatorUserId?: string;
  onNavigate: (href: string) => void;
}

export function CreateWorkspaceDialogRail(
  _props: CreateWorkspaceDialogRailProps,
): null {
  return null;
}

// ── Stub route screens ────────────────────────────────────────────────────────

export function AccountDashboardRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Account Dashboard (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationWorkspacesRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Organization Workspaces (stub)
    </div>
  ) as React.ReactElement;
}

interface WorkspaceDetailRouteScreenProps {
  workspaceId: string;
  accountId: string;
  accountsHydrated: boolean;
  initialTab?: string;
  initialOverviewPanel?: string;
}

export function WorkspaceDetailRouteScreen(
  _props: WorkspaceDetailRouteScreenProps,
): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Workspace Detail (stub)
    </div>
  ) as React.ReactElement;
}

interface WorkspaceHubScreenProps {
  accountId: string | null;
  accountName: string | null;
  accountType: "organization" | "user" | null;
  accountsHydrated: boolean;
  isBootstrapSeeded: boolean;
  currentUserId: string | null;
}

export function WorkspaceHubScreen(
  _props: WorkspaceHubScreenProps,
): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Workspace Hub (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationTeamsRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Teams (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationScheduleRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Schedule (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationDailyRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Daily (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationAuditRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Audit (stub)
    </div>
  ) as React.ReactElement;
}

// ── Re-export type for consumers ──────────────────────────────────────────────

export type { ReactNode };
