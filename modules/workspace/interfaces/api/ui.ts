/**
 * workspace API UI surface.
 *
 * Public interface-layer composition exports.
 */

export { WorkspaceDetailScreen } from "../web/components/screens/WorkspaceDetailScreen";
export { WorkspaceDetailRouteScreen } from "../web/components/screens/WorkspaceDetailRouteScreen";
export { WorkspaceHubScreen } from "../web/components/screens/WorkspaceHubScreen";
export { WorkspaceMembersTab } from "../web/components/tabs/WorkspaceMembersTab";
export { WorkspaceSidebarSection } from "../web/components/layout/WorkspaceSidebarSection";
export { CreateWorkspaceDialogRail } from "../web/components/rails/CreateWorkspaceDialogRail";
export { OrganizationWorkspacesScreen } from "../web/components/screens/OrganizationWorkspacesScreen";
export { WorkspaceContextCard } from "../web/components/cards/WorkspaceContextCard";

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
} from "../web/workspace-tabs";

export { getWorkspaceStorageKey, toWorkspaceMap, resolveWorkspaceFromMap } from "../web/workspace-session";

export type { WorkspaceNavItem } from "../web/workspace-nav-items";
export {
  WORKSPACE_NAV_ITEMS,
  normalizeWorkspaceOrder,
} from "../web/workspace-nav-items";

export type {
  WorkspaceQuickAccessItem,
  WorkspaceQuickAccessMatcherOptions,
} from "../web/workspace-quick-access";

export { buildWorkspaceQuickAccessItems } from "../web/workspace-quick-access";

export type {
  WorkspaceTabDevStatus,
  WorkspaceTabGroup,
  WorkspaceTabValue,
} from "../web/workspace-tabs";

export { useWorkspaceHub } from "../web/hooks/useWorkspaceHub";
export {
  MAX_VISIBLE_RECENT_WORKSPACES,
  getWorkspaceIdFromPath,
  useRecentWorkspaces,
} from "../web/hooks/useRecentWorkspaces";
