export type {
  DailyDigestItem,
  DailyDigestSummary,
  WorkspaceDailyDigestEntity,
  OrganizationDailyDigestEntity,
} from "./domain/entities/DailyDigest";
export type {
  DailyEntry,
  DailyEntryStatus,
  DailyEntryType,
  DailyVisibility,
  PublishDailyEntryInput,
} from "./domain/entities/DailyEntry";
export type { DailyFeedItem } from "./domain/entities/DailyFeed";
export type { DailyDigestRepository } from "./domain/repositories/DailyDigestRepository";
export type { DailyEntryRepository } from "./domain/repositories/DailyEntryRepository";
export type { DailyFeedRepository } from "./domain/repositories/DailyFeedRepository";
export {
  GetWorkspaceDailyDigestUseCase,
  GetOrganizationDailyDigestUseCase,
} from "./application/use-cases/daily-digest.use-cases";
export {
  ListWorkspaceDailyFeedUseCase,
  ListOrganizationDailyFeedUseCase,
} from "./application/use-cases/list-daily-feed.use-cases";
export { PublishDailyEntryUseCase } from "./application/use-cases/publish-daily-entry.use-case";
export { DefaultDailyDigestRepository } from "./infrastructure/default/DefaultDailyDigestRepository";
export { FirebaseDailyEntryRepository } from "./infrastructure/firebase/FirebaseDailyEntryRepository";
export { FirebaseDailyFeedRepository } from "./infrastructure/firebase/FirebaseDailyFeedRepository";
export {
  getWorkspaceDailyDigest,
  getOrganizationDailyDigest,
} from "./interfaces/queries/daily-digest.queries";
export {
  getWorkspaceDailyFeed,
  getOrganizationDailyFeed,
} from "./interfaces/queries/daily-feed.queries";
export { publishDailyEntry } from "./interfaces/_actions/daily.actions";

// ── 新增：精簡領域 Schema 與施工社群動態元件（interfaces 層） ──────────────
export type { DailyPost, DailyPostType, Attachment, DailyFeedPage } from "./domain/schema";
export { DailyPostSchema, AttachmentSchema, DAILY_POST_TYPES } from "./domain/schema";
export { getDailyFeed } from "./interfaces/queries/daily-post.queries";
export { DailyFeed } from "./interfaces/components/DailyFeed";
export { DailyPostCard } from "./interfaces/components/DailyPostCard";
