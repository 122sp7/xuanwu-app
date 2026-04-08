/**
 * workspace API UI surface.
 *
 * Public interface-layer composition exports.
 */

export { WorkspaceDetailScreen } from "../interfaces/components/WorkspaceDetailScreen";
export { WorkspaceDetailRouteScreen } from "../interfaces/components/WorkspaceDetailRouteScreen";
export { WorkspaceHubScreen } from "../interfaces/components/WorkspaceHubScreen";
export { WorkspaceMembersTab } from "../interfaces/components/WorkspaceMembersTab";
export { WorkspaceSidebarSection } from "../interfaces/components/WorkspaceSidebarSection";
export { CreateWorkspaceDialogRail } from "../interfaces/components/CreateWorkspaceDialogRail";

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
} from "../interfaces/workspace-tabs";

export { getWorkspaceStorageKey, toWorkspaceMap } from "../interfaces/workspace-session";

export type { WorkspaceNavItem } from "../interfaces/workspace-nav-items";
export {
  WORKSPACE_NAV_ITEMS,
  normalizeWorkspaceOrder,
} from "../interfaces/workspace-nav-items";

export type {
  WorkspaceQuickAccessItem,
  WorkspaceQuickAccessMatcherOptions,
} from "../interfaces/workspace-quick-access";

export { buildWorkspaceQuickAccessItems } from "../interfaces/workspace-quick-access";

export type {
  WorkspaceTabDevStatus,
  WorkspaceTabGroup,
  WorkspaceTabValue,
} from "../interfaces/workspace-tabs";

export { useWorkspaceHub } from "../interfaces/hooks/useWorkspaceHub";
export {
  MAX_VISIBLE_RECENT_WORKSPACES,
  getWorkspaceIdFromPath,
  useRecentWorkspaces,
} from "../interfaces/hooks/useRecentWorkspaces";
