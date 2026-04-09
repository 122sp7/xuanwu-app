/**
 * workspace interfaces/web public boundary.
 *
 * Web-layer components, hooks, navigation, state helpers and utilities.
 * App-layer and cross-module consumers that need UI composition must import
 * from this path instead of reaching into individual sub-directories.
 */

export { WorkspaceDetailScreen } from "./components/screens/WorkspaceDetailScreen";
export { WorkspaceDetailRouteScreen } from "./components/screens/WorkspaceDetailRouteScreen";
export { WorkspaceHubScreen } from "./components/screens/WorkspaceHubScreen";
export { WorkspaceMembersTab } from "./components/tabs/WorkspaceMembersTab";
export { WorkspaceSidebarSection } from "./components/layout/WorkspaceSidebarSection";
export { CreateWorkspaceDialogRail } from "./components/rails/CreateWorkspaceDialogRail";
export { OrganizationWorkspacesScreen } from "./components/screens/OrganizationWorkspacesScreen";
export { WorkspaceContextCard } from "./components/cards/WorkspaceContextCard";

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
} from "./navigation/workspace-tabs";

export { getWorkspaceStorageKey } from "./state/workspace-session";

export {
	resolveWorkspaceFromMap,
	toWorkspaceMap,
} from "./utils/workspace-map";

export type { WorkspaceNavItem } from "./navigation/workspace-nav-items";
export {
	WORKSPACE_NAV_ITEMS,
	normalizeWorkspaceOrder,
} from "./navigation/workspace-nav-items";

export type {
	WorkspaceQuickAccessItem,
	WorkspaceQuickAccessMatcherOptions,
} from "./components/navigation/workspace-quick-access";

export { buildWorkspaceQuickAccessItems } from "./components/navigation/workspace-quick-access";

export type {
	WorkspaceTabDevStatus,
	WorkspaceTabGroup,
	WorkspaceTabValue,
} from "./navigation/workspace-tabs";

export { useWorkspaceHub } from "./hooks/useWorkspaceHub";
export {
	MAX_VISIBLE_RECENT_WORKSPACES,
	getWorkspaceIdFromPath,
	useRecentWorkspaces,
} from "./hooks/useRecentWorkspaces";
