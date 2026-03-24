/**
 * Audit 模組領域 Schema — 不可變事件流（Immutable Event Stream）。
 * 遵循奧卡姆剃刀：稽核日誌只需記錄「誰、何時、做了什麼」。
 */

import { z } from "@lib-zod";
import { BaseEntitySchema } from "../../shared/domain/types";

// ── 操作類型 ────────────────────────────────────────────────────────────────

/**
 * 稽核操作類型：
 * - create（建立）：新增資源
 * - update（更新）：修改資源內容
 * - delete（刪除）：移除資源
 * - login（登入）：使用者登入事件
 * - export（匯出）：資料匯出操作
 */
export const AUDIT_ACTIONS = ["create", "update", "delete", "login", "export"] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

// ── 嚴重程度 ────────────────────────────────────────────────────────────────

/**
 * 事件嚴重程度：
 * - low（低）：一般日常操作
 * - medium（中）：需留意的操作
 * - high（高）：敏感操作，需主管審閱
 * - critical（嚴重）：高風險操作，需即時關注
 */
export const AUDIT_SEVERITIES = ["low", "medium", "high", "critical"] as const;
export type AuditSeverity = (typeof AUDIT_SEVERITIES)[number];

// ── 欄位變更紀錄 ──────────────────────────────────────────────────────────

const ChangeRecordSchema = z.object({
  /** 被修改的欄位名稱 */
  field: z.string(),
  /** 修改前的值 */
  oldValue: z.unknown(),
  /** 修改後的值 */
  newValue: z.unknown(),
});

export type ChangeRecord = z.infer<typeof ChangeRecordSchema>;

// ── 主要 Schema ────────────────────────────────────────────────────────────

/**
 * 稽核日誌 Schema — 不可變的操作事件紀錄。
 * 繼承 BaseEntitySchema 取得租戶隔離與操作者資訊。
 */
export const AuditLogSchema = BaseEntitySchema.extend({
  /** 操作類型 */
  action: z.enum(AUDIT_ACTIONS),
  /** 被操作資源的類型，例如 'contract'、'daily_post'、'user_settings' */
  resourceType: z.string(),
  /** 被操作資源的唯一識別碼 */
  resourceId: z.string(),
  /** 事件嚴重程度 */
  severity: z.enum(AUDIT_SEVERITIES),
  /** 欄位變更明細（選填，僅 update 操作有意義） */
  changes: z.array(ChangeRecordSchema).optional(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;
