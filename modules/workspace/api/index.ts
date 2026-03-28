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

// ─── Wiki content-tree types (transitional — workspace-owned) ─────────────

export type {
  WikiAccountContentNode,
  WikiAccountSeed,
  WikiAccountType,
  WikiContentItemNode,
  WikiWorkspaceContentNode,
  WikiWorkspaceRef,
} from "../domain/entities/WikiContentTree";

// ─── Wiki content-tree use-case (transitional) ────────────────────────────

import { FirebaseWikiWorkspaceRepository } from "../infrastructure/firebase/FirebaseWikiWorkspaceRepository";
import { buildWikiContentTree as _buildWikiContentTree } from "../application/use-cases/wiki-content-tree.use-case";
import type { WikiAccountContentNode, WikiAccountSeed } from "../domain/entities/WikiContentTree";

const _defaultWorkspaceRepository = new FirebaseWikiWorkspaceRepository();

export function buildWikiContentTree(seeds: WikiAccountSeed[]): Promise<WikiAccountContentNode[]> {
  return _buildWikiContentTree(seeds, _defaultWorkspaceRepository);
}

// ─── Server actions (client-callable via Next.js action proxy) ──────────────

export { createWorkspace } from "../interfaces/_actions/workspace.actions";

// ─── UI components (cross-module public) ─────────────────────────────────────

export { WorkspaceDetailScreen } from "../interfaces/components/WorkspaceDetailScreen";
export { WorkspaceHubScreen } from "../interfaces/components/WorkspaceHubScreen";

// ─── Workspace tab metadata helpers (UI-only helpers) ───────────────────────

export {
  getWorkspaceTabLabel,
  getWorkspaceTabPrefId,
  getWorkspaceTabStatus,
  getWorkspaceTabsByGroup,
  isWorkspaceTabValue,
} from "../interfaces/workspace-tabs";

export type { WorkspaceTabGroup, WorkspaceTabValue } from "../interfaces/workspace-tabs";
