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
export { WorkspaceQuickAccessRow } from "../interfaces/web/components/layout/WorkspaceQuickAccessRow";
export { WorkspaceSectionContent } from "../interfaces/web/components/layout/WorkspaceSectionContent";

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

// ── Workspace context provider ────────────────────────────────────────────────

export {
  WorkspaceContextProvider,
  useWorkspaceContext,
} from "../interfaces/web/providers/WorkspaceContextProvider";
export type {
  WorkspaceContextState,
  WorkspaceContextAction,
  WorkspaceContextValue,
} from "../interfaces/web/providers/WorkspaceContextProvider";

// ── Navigation preferences ────────────────────────────────────────────────────

export type { NavPreferences, SidebarLocaleBundle } from "../interfaces/web/navigation/nav-preferences-data";
export {
  PERSONAL_ITEMS,
  ORGANIZATION_NAV_ITEMS,
  DIALOG_TEXT,
  DEFAULT_PREFS,
  readNavPreferences,
  writeNavPreferences,
} from "../interfaces/web/navigation/nav-preferences-data";

// ── Sidebar locale ────────────────────────────────────────────────────────────

export { useSidebarLocale } from "../interfaces/web/navigation/use-sidebar-locale";

export {
  appendWorkspaceContextQuery,
  buildWorkspaceContextHref,
  supportsWorkspaceSearchContext,
  type WorkspaceNavigationContext,
} from "../interfaces/web/navigation/workspace-context-links";

// ── Navigation customize dialog ───────────────────────────────────────────────

export { CustomizeNavigationDialog } from "../interfaces/web/components/dialogs/CustomizeNavigationDialog";
export { CheckRow, WorkspaceCheckRow } from "../interfaces/web/components/dialogs/NavCheckRow";

export {
  AuditStream,
  WorkspaceAuditTab,
} from "../subdomains/audit/api";

export {
  WorkspaceFeedAccountView,
  WorkspaceFeedWorkspaceView,
} from "../subdomains/feed/api";

export type { AccountMember } from "../subdomains/scheduling/api";
export {
  AccountSchedulingView,
  WorkspaceSchedulingTab,
} from "../subdomains/scheduling/api";

export { WorkspaceFlowTab } from "../subdomains/workspace-workflow/api";
