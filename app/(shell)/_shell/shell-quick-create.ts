/**
 * shell-quick-create — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it imports notion's createKnowledgePage.
 * Kept as a composition adapter at the app boundary.
 */

import { createKnowledgePage } from "@/modules/workspace/api";

export interface QuickCreatePageInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
}

export interface QuickCreatePageResult {
  readonly success: boolean;
  readonly error?: { message: string };
}

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
