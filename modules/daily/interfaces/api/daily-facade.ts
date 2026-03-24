/**
 * Daily 模組 — 公開 API 層 (interfaces/api)
 *
 * 所有模組外部的呼叫端（app/、其他 modules/）**必須**透過此 facade 存取 Daily 功能。
 * 禁止直接引入 interfaces/_actions/、interfaces/queries/ 或 interfaces/components/ 的內部實作。
 *
 * Dependency Direction: interfaces/api → (_actions | queries | components) → application → domain ← infrastructure
 */

// ── 指令 (Mutations / Server Actions) ──────────────────────────────────────

export { createDailyPost } from "../_actions/daily-post.actions";
export type { CreateDailyPostInput } from "../_actions/daily-post.actions";

// ── 查詢 (Queries) ─────────────────────────────────────────────────────────

export { getDailyFeed } from "../queries/daily-post.queries";

// ── UI 元件 ────────────────────────────────────────────────────────────────

export { DailyFeed } from "../components/DailyFeed";
export { DailyPostCard } from "../components/DailyPostCard";

// ── 領域型別與常數 ─────────────────────────────────────────────────────────

export type {
  Attachment,
  DailyFeedPage,
  DailyPost,
  DailyPostType,
} from "../../domain/schema";
export { AttachmentSchema, DAILY_POST_TYPES, DailyPostSchema } from "../../domain/schema";
