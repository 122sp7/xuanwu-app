/**
 * Daily 模組公開 Barrel
 *
 * 外部呼叫端一律透過 interfaces/api/daily-facade 取得 Daily 功能。
 * 此 barrel 僅作為模組對外的唯一入口，不直接暴露內部實作層（application、infrastructure）。
 */

// ── 公開 API（施工動態 — DailyPost 系統） ─────────────────────────────────
export {
  // Mutations
  createDailyPost,
  // Queries
  getDailyFeed,
  // Components
  DailyFeed,
  DailyPostCard,
  // Types & constants
  AttachmentSchema,
  DAILY_POST_TYPES,
  DailyPostSchema,
} from "./interfaces/api/daily-facade";

export type {
  Attachment,
  CreateDailyPostInput,
  DailyFeedPage,
  DailyPost,
  DailyPostType,
} from "./interfaces/api/daily-facade";
