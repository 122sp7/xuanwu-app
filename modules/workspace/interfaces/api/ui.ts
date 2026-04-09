/**
 * workspace API UI surface.
 *
 * Public interface-layer composition exports.
 */

export { WorkspaceDetailScreen } from "../components/WorkspaceDetailScreen";
export { WorkspaceDetailRouteScreen } from "../components/WorkspaceDetailRouteScreen";
export { WorkspaceHubScreen } from "../components/WorkspaceHubScreen";
export { WorkspaceMembersTab } from "../components/WorkspaceMembersTab";
export { WorkspaceSidebarSection } from "../components/WorkspaceSidebarSection";
export { CreateWorkspaceDialogRail } from "../components/CreateWorkspaceDialogRail";
export { OrganizationWorkspacesScreen } from "../components/OrganizationWorkspacesScreen";
export { WorkspaceContextCard } from "../components/WorkspaceContextCard";

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
} from "../workspace-tabs";

export { getWorkspaceStorageKey, toWorkspaceMap, resolveWorkspaceFromMap } from "../workspace-session";

export type { WorkspaceNavItem } from "../workspace-nav-items";
export {
  WORKSPACE_NAV_ITEMS,
  normalizeWorkspaceOrder,
} from "../workspace-nav-items";

export type {
  WorkspaceQuickAccessItem,
  WorkspaceQuickAccessMatcherOptions,
} from "../workspace-quick-access";

export { buildWorkspaceQuickAccessItems } from "../workspace-quick-access";

export type {
  WorkspaceTabDevStatus,
  WorkspaceTabGroup,
  WorkspaceTabValue,
} from "../workspace-tabs";

export { useWorkspaceHub } from "../hooks/useWorkspaceHub";
export {
  MAX_VISIBLE_RECENT_WORKSPACES,
  getWorkspaceIdFromPath,
  useRecentWorkspaces,
} from "../hooks/useRecentWorkspaces";
