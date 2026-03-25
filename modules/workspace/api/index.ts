/**
 * workspace 模組公開跨域 API。
 * 所有跨模組呼叫均需透過此檔案，禁止直接引用 workspace 模組內部實作。
 */

// ─── 核心實體型別 ──────────────────────────────────────────────────────────────

export type {
  WorkspaceEntity,
  WorkspaceGrant,
  WorkspaceLifecycleState,
  WorkspaceVisibility,
  WorkspacePersonnel,
} from "../domain/entities/Workspace";

// ─── 查詢函數 (供 UI 層訂閱/讀取使用) ────────────────────────────────────────

export {
  getWorkspacesForAccount,
  subscribeToWorkspacesForAccount,
} from "../interfaces/queries/workspace.queries";

// ─── Server actions (client-callable via Next.js action proxy) ──────────────

export { createWorkspace } from "../interfaces/_actions/workspace.actions";

// ─── Workspace tab metadata helpers (UI-only helpers) ───────────────────────

export {
  getWorkspaceTabLabel,
  getWorkspaceTabPrefId,
  getWorkspaceTabStatus,
  getWorkspaceTabsByGroup,
  isWorkspaceTabValue,
} from "../interfaces/workspace-tabs";

export type { WorkspaceTabGroup, WorkspaceTabValue } from "../interfaces/workspace-tabs";
