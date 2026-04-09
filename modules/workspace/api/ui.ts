/**
 * workspace public UI/composition boundary.
 */

export { WorkspaceDetailScreen } from "../interfaces/web/components/screens/WorkspaceDetailScreen";
export { WorkspaceDetailRouteScreen } from "../interfaces/web/components/screens/WorkspaceDetailRouteScreen";
export { WorkspaceHubScreen } from "../interfaces/web/components/screens/WorkspaceHubScreen";
export { WorkspaceMembersTab } from "../interfaces/web/components/tabs/WorkspaceMembersTab";
export { WorkspaceSidebarSection } from "../interfaces/web/components/layout/WorkspaceSidebarSection";
export { CreateWorkspaceDialogRail } from "../interfaces/web/components/rails/CreateWorkspaceDialogRail";
export { OrganizationWorkspacesScreen } from "../interfaces/web/components/screens/OrganizationWorkspacesScreen";
export { WorkspaceContextCard } from "../interfaces/web/components/cards/WorkspaceContextCard";

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

export {
	getWorkspaceStorageKey,
} from "../interfaces/web/state/workspace-session";

export {
	resolveWorkspaceFromMap,
	toWorkspaceMap,
} from "../interfaces/web/utils/workspace-map";

export type { WorkspaceNavItem } from "../interfaces/web/navigation/workspace-nav-items";
export {
	WORKSPACE_NAV_ITEMS,
	normalizeWorkspaceOrder,
} from "../interfaces/web/navigation/workspace-nav-items";

export type {
	WorkspaceQuickAccessItem,
	WorkspaceQuickAccessMatcherOptions,
} from "../interfaces/web/components/navigation/workspace-quick-access";

export { buildWorkspaceQuickAccessItems } from "../interfaces/web/components/navigation/workspace-quick-access";

export type {
	WorkspaceTabDevStatus,
	WorkspaceTabGroup,
	WorkspaceTabValue,
} from "../interfaces/web/navigation/workspace-tabs";

export { useWorkspaceHub } from "../interfaces/web/hooks/useWorkspaceHub";
export {
	MAX_VISIBLE_RECENT_WORKSPACES,
	getWorkspaceIdFromPath,
	useRecentWorkspaces,
} from "../interfaces/web/hooks/useRecentWorkspaces";