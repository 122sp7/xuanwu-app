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

// ─── WikiBeta content-tree types (transitional — workspace-owned) ─────────────

export type {
  WikiBetaAccountContentNode,
  WikiBetaAccountSeed,
  WikiBetaAccountType,
  WikiBetaContentItemNode,
  WikiBetaWorkspaceContentNode,
  WikiBetaWorkspaceRef,
} from "../domain/entities/WikiBetaContentTree";

// ─── WikiBeta content-tree use-case (transitional) ────────────────────────────

import { FirebaseWikiBetaWorkspaceRepository } from "../infrastructure/firebase/FirebaseWikiBetaWorkspaceRepository";
import { buildWikiBetaContentTree as _buildWikiBetaContentTree } from "../application/use-cases/wiki-beta-content-tree.use-case";
import type { WikiBetaAccountContentNode, WikiBetaAccountSeed } from "../domain/entities/WikiBetaContentTree";

const _defaultWorkspaceRepository = new FirebaseWikiBetaWorkspaceRepository();

export function buildWikiBetaContentTree(seeds: WikiBetaAccountSeed[]): Promise<WikiBetaAccountContentNode[]> {
  return _buildWikiBetaContentTree(seeds, _defaultWorkspaceRepository);
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
