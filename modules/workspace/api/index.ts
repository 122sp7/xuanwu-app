/**
 * workspace 模組公開跨域 API。
 * 所有跨模組呼叫均需透過此檔案，禁止直接引用 workspace 模組內部實作。
 */

// ─── 核心實體型別 ──────────────────────────────────────────────────────────────

export type {
  Address,
  Capability,
  CapabilitySpec,
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceEntity,
  WorkspaceGrant,
  WorkspaceLifecycleState,
  WorkspaceLocation,
  WorkspacePersonnel,
  WorkspacePersonnelCustomRole,
  WorkspaceVisibility,
} from "../domain/entities/Workspace";

export type {
  WorkspaceMemberAccessChannel,
  WorkspaceMemberAccessSource,
  WorkspaceMemberPresence,
  WorkspaceMemberView,
} from "../domain/entities/WorkspaceMember";

export type {
  WorkspaceCreatedEvent,
  WorkspaceDomainEvent,
  WorkspaceLifecycleTransitionedEvent,
  WorkspaceVisibilityChangedEvent,
} from "../domain/events/workspace.events";

export {
  WORKSPACE_CREATED_EVENT_TYPE,
  WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE,
  WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE,
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../domain/events/workspace.events";

// ─── 查詢函數 (供 UI 層訂閱/讀取使用) ────────────────────────────────────────

export {
  getWorkspaceById,
  getWorkspaceByIdForAccount,
  getWorkspacesForAccount,
  subscribeToWorkspacesForAccount,
} from "../interfaces/queries/workspace.queries";

export { getWorkspaceMembers } from "../interfaces/queries/workspace-member.queries";

// ─── Wiki content-tree types (owned by workspace domain) ───────────────────

export type {
  WikiAccountContentNode,
  WikiAccountSeed,
  WikiAccountType,
  WikiContentItemNode,
  WikiWorkspaceContentNode,
  WikiWorkspaceRef,
} from "../domain/entities/WikiContentTree";

// ─── Wiki content-tree use-case ────────────────────────────────────────────

export { buildWikiContentTree } from "../interfaces/queries/wiki-content-tree.queries";

// ─── Server actions (client-callable via Next.js action proxy) ──────────────

export {
  authorizeWorkspaceTeam,
  createWorkspace,
  createWorkspaceLocation,
  createWorkspaceWithCapabilities,
  deleteWorkspace,
  grantIndividualWorkspaceAccess,
  mountCapabilities,
  updateWorkspaceSettings,
} from "../interfaces/_actions/workspace.actions";

// ─── UI components (cross-module public) ─────────────────────────────────────

export { WorkspaceDetailScreen } from "../interfaces/components/WorkspaceDetailScreen";
export { WorkspaceHubScreen } from "../interfaces/components/WorkspaceHubScreen";
export { WorkspaceMembersTab } from "../interfaces/components/WorkspaceMembersTab";

// ─── Workspace tab metadata helpers (UI-only helpers) ───────────────────────

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

export type {
  WorkspaceTabDevStatus,
  WorkspaceTabGroup,
  WorkspaceTabValue,
} from "../interfaces/workspace-tabs";

export { useWorkspaceHub } from "../interfaces/hooks/useWorkspaceHub";
