/**
 * workspace api/ui.ts
 *
 * Canonical public web UI surface for the workspace bounded context.
 * App-layer consumers that need workspace UI components, hooks, and
 * navigation utilities should import from here.
 *
 * Internal source: interfaces/web/
 */

// ── Screen components ────────────────────────────────────────────────────────

export { WorkspaceDetailScreen } from "../interfaces/web/components/screens/WorkspaceDetailScreen";
export { WorkspaceDetailRouteScreen } from "../interfaces/web/components/screens/WorkspaceDetailRouteScreen";
export { WorkspaceHubScreen } from "../interfaces/web/components/screens/WorkspaceHubScreen";
export { OrganizationWorkspacesScreen } from "../interfaces/web/components/screens/OrganizationWorkspacesScreen";

// ── Card components ──────────────────────────────────────────────────────────

export { WorkspaceContextCard } from "../interfaces/web/components/cards/WorkspaceContextCard";

// ── Tab components ───────────────────────────────────────────────────────────

export { WorkspaceMembersTab } from "../interfaces/web/components/tabs/WorkspaceMembersTab";

// ── Layout components ────────────────────────────────────────────────────────

export { WorkspaceSidebarSection } from "../interfaces/web/components/layout/WorkspaceSidebarSection";

// ── Rail components ──────────────────────────────────────────────────────────

export { CreateWorkspaceDialogRail } from "../interfaces/web/components/rails/CreateWorkspaceDialogRail";

// ── Navigation ────────────────────────────────────────────────────────────────

export type {
  WorkspaceTabDevStatus,
  WorkspaceTabGroup,
  WorkspaceTabValue,
} from "../interfaces/web/navigation/workspace-tabs";

export {
  WORKSPACE_TAB_GROUPS,
  WORKSPACE_TAB_META,
  WORKSPACE_TAB_VALUES,
  getWorkspaceTabLabel,
  getWorkspaceTabMeta,
  getWorkspaceTabPrefId,
  getWorkspaceTabStatus,
  getWorkspaceTabsByGroup,
  isWorkspaceTabValue,
} from "../interfaces/web/navigation/workspace-tabs";

export type { WorkspaceNavItem } from "../interfaces/web/navigation/workspace-nav-items";
export {
  WORKSPACE_NAV_ITEMS,
  normalizeWorkspaceOrder,
} from "../interfaces/web/navigation/workspace-nav-items";

// ── Quick-access navigation ───────────────────────────────────────────────────

export type {
  WorkspaceQuickAccessItem,
  WorkspaceQuickAccessMatcherOptions,
} from "../interfaces/web/components/navigation/workspace-quick-access";

export { buildWorkspaceQuickAccessItems } from "../interfaces/web/components/navigation/workspace-quick-access";

// ── State helpers ─────────────────────────────────────────────────────────────

export { getWorkspaceStorageKey } from "../interfaces/web/state/workspace-session";

// ── Map utilities ─────────────────────────────────────────────────────────────

export {
  resolveWorkspaceFromMap,
  toWorkspaceMap,
} from "../interfaces/web/utils/workspace-map";

// ── Hooks ─────────────────────────────────────────────────────────────────────

export { useWorkspaceHub } from "../interfaces/web/hooks/useWorkspaceHub";
export {
  MAX_VISIBLE_RECENT_WORKSPACES,
  getWorkspaceIdFromPath,
  useRecentWorkspaces,
} from "../interfaces/web/hooks/useRecentWorkspaces";
