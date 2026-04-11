/**
 * Shell quick-create orchestrator.
 *
 * Context-wide application service that coordinates cross-bounded-context
 * creation actions triggered from the platform shell UI.
 * Delegates to the target module's public API boundary only.
 */

import { createKnowledgePage } from "@/modules/notion/api";

// ── Input / output contracts ──────────────────────────────────────────────────

export interface QuickCreatePageInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
}

export interface QuickCreatePageResult {
  readonly success: boolean;
  readonly error?: { message: string };
}

// ── Orchestration ─────────────────────────────────────────────────────────────

export async function quickCreateKnowledgePage(
  input: QuickCreatePageInput,
): Promise<QuickCreatePageResult> {
  if (!input.accountId) {
    return { success: false, error: { message: "目前沒有 active account，無法建立" } };
  }
  if (!input.workspaceId) {
    return { success: false, error: { message: "請先切換到工作區，再建立頁面" } };
  }
  return createKnowledgePage({
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    title: "未命名頁面",
    parentPageId: null,
    createdByUserId: input.createdByUserId,
  });
}
