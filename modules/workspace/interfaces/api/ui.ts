/**
 * workspace public UI/composition boundary.
 *
 * Re-exports all web-layer components, hooks, and helpers so the single
 * modules/workspace/api entrypoint can delegate here without reaching into
 * interfaces/web directly.
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
} from "../web/navigation/workspace-tabs";

export { getWorkspaceStorageKey } from "../web/state/workspace-session";

export {
	resolveWorkspaceFromMap,
	toWorkspaceMap,
} from "../web/utils/workspace-map";

export type { WorkspaceNavItem } from "../web/navigation/workspace-nav-items";
export {
	WORKSPACE_NAV_ITEMS,
	normalizeWorkspaceOrder,
} from "../web/navigation/workspace-nav-items";

export type {
	WorkspaceQuickAccessItem,
	WorkspaceQuickAccessMatcherOptions,
} from "../web/components/navigation/workspace-quick-access";

export { buildWorkspaceQuickAccessItems } from "../web/components/navigation/workspace-quick-access";

export type {
	WorkspaceTabDevStatus,
	WorkspaceTabGroup,
	WorkspaceTabValue,
} from "../web/navigation/workspace-tabs";

export { useWorkspaceHub } from "../web/hooks/useWorkspaceHub";
export {
	MAX_VISIBLE_RECENT_WORKSPACES,
	getWorkspaceIdFromPath,
	useRecentWorkspaces,
} from "../web/hooks/useRecentWorkspaces";
