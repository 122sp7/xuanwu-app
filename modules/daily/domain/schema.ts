/**
 * Daily 模組領域 Schema — 施工動態貼文（Construction Social Feed）。
 * 以奧卡姆剃刀精簡設計：一條貼文 = 一筆施工現場的社群動態。
 */

import { z } from "@lib-zod";
import { BaseEntitySchema } from "../../shared/domain/types";

// ── 附件 ───────────────────────────────────────────────────────────────────

/**
 * 媒體附件 Schema（圖片、影片或文件）。
 */
export const AttachmentSchema = z.object({
  /** 附件唯一識別碼 */
  id: z.string(),
  /** 媒體類型 */
  type: z.enum(["image", "video", "document"]),
  /** 原始檔案 URL */
  url: z.string(),
  /** 縮圖 URL（選填） */
  thumbnailUrl: z.string().optional(),
});

export type Attachment = z.infer<typeof AttachmentSchema>;

// ── 貼文類型 ───────────────────────────────────────────────────────────────

/**
 * 施工動態貼文的分類標籤：
 * - progress（進度）：施工進度更新
 * - issue（問題）：需關注的施工問題
 * - safety（安全）：安全相關事項
 * - material（材料）：材料到貨或缺料通報
 */
export const DAILY_POST_TYPES = ["progress", "issue", "safety", "material"] as const;
export type DailyPostType = (typeof DAILY_POST_TYPES)[number];

// ── 主要 Schema ────────────────────────────────────────────────────────────

/**
 * 施工動態貼文 Schema。
 * 繼承 BaseEntitySchema 取得租戶隔離與建立者資訊。
 */
export const DailyPostSchema = BaseEntitySchema.extend({
  /** 貼文正文 */
  content: z.string(),
  /** 貼文分類 */
  type: z.enum(DAILY_POST_TYPES),
  /** 媒體附件清單 */
  attachments: z.array(AttachmentSchema).default([]),
  /** 點讚與反應數（Denormalized，優化讀取效能） */
  reactionCount: z.number().int().min(0).default(0),
  /** 留言數（Denormalized） */
  commentCount: z.number().int().min(0).default(0),
  /** 是否被標記需關注（危險/阻礙） */
  isFlagged: z.boolean().default(false),
});

export type DailyPost = z.infer<typeof DailyPostSchema>;

// ── 動態饋送回傳 ───────────────────────────────────────────────────────────

/**
 * getDailyFeed 的回傳型別。
 * items 為本頁貼文，nextCursor 為下一頁起點（null 表示已無更多）。
 */
export interface DailyFeedPage {
  items: DailyPost[];
  nextCursor: string | null;
}
