/**
 * 共用領域類型 — 所有模組的基礎建構塊。
 * 遵循奧卡姆剃刀：只定義跨模組真正共用的最小集合。
 */

import { z } from "@lib-zod";

// ── 建立者摘要 ─────────────────────────────────────────────────────────────

const CreatedBySchema = z.object({
  /** 使用者 ID */
  id: z.string(),
  /** 顯示名稱 */
  name: z.string(),
  /** 頭像 URL（選填） */
  avatarUrl: z.string().optional(),
});

// ── 基礎實體 Schema ────────────────────────────────────────────────────────

/**
 * 所有領域物件共用的基礎欄位。
 * 包含租戶隔離（accountId / workspaceId）與稽核追蹤（createdBy）。
 */
export const BaseEntitySchema = z.object({
  /** 唯一識別碼 */
  id: z.string(),
  /** 建立時間（ISO 8601） */
  createdAt: z.string(),
  /** 最後更新時間（ISO 8601） */
  updatedAt: z.string(),
  /** 所屬工作區（專案） */
  workspaceId: z.string(),
  /** 所屬租戶（帳號），用於跨工作區聚合 */
  accountId: z.string(),
  /** 建立者摘要 */
  createdBy: CreatedBySchema,
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;
export type CreatedBy = z.infer<typeof CreatedBySchema>;

// ── 查詢範圍 ────────────────────────────────────────────────────────────────

/**
 * 支援帳號層級或工作區層級的查詢範圍過濾。
 * workspaceId 為空時，查詢涵蓋該租戶所有工作區。
 */
export interface QueryScope {
  /** 租戶 ID（必填） */
  accountId: string;
  /** 工作區 ID（選填，空則跨工作區聚合） */
  workspaceId?: string;
}
