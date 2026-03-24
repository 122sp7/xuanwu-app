/**
 * Module: workspace-feed
 * Layer: module/barrel (public API)
 *
 * Cross-module calls must go through this module barrel.
 * Prefer `workspaceFeedFacade` for domain isolation.
 */

// Domain
export type {
  WorkspaceFeedPost,
  WorkspaceFeedPostType,
  CreateWorkspaceFeedPostInput,
  CreateWorkspaceFeedReplyInput,
  CreateWorkspaceFeedRepostInput,
  WorkspaceFeedCounterPatch,
} from "./domain";
export { WORKSPACE_FEED_POST_TYPES } from "./domain";

export type {
  WorkspaceFeedDomainEvent,
  WorkspaceFeedPostCreatedEvent,
  WorkspaceFeedReplyCreatedEvent,
  WorkspaceFeedRepostCreatedEvent,
  WorkspaceFeedPostLikedEvent,
  WorkspaceFeedPostViewedEvent,
  WorkspaceFeedPostBookmarkedEvent,
  WorkspaceFeedPostSharedEvent,
} from "./domain";
export { WORKSPACE_FEED_EVENT_TYPES } from "./domain";

export type {
  WorkspaceFeedPostRepository,
  WorkspaceFeedInteractionRepository,
} from "./domain";

// Application DTOs
export type {
  CreateWorkspaceFeedPostDto,
  ReplyWorkspaceFeedPostDto,
  RepostWorkspaceFeedPostDto,
  FeedInteractionDto,
  ListWorkspaceFeedDto,
  ListAccountFeedDto,
} from "./application/dto/workspace-feed.dto";

export {
  FeedLimitSchema,
  CreateWorkspaceFeedPostSchema,
  ReplyWorkspaceFeedPostSchema,
  RepostWorkspaceFeedPostSchema,
  FeedInteractionSchema,
  ListWorkspaceFeedSchema,
  ListAccountFeedSchema,
} from "./application/dto/workspace-feed.dto";

// Application use-cases
export {
  CreateWorkspaceFeedPostUseCase,
  ReplyWorkspaceFeedPostUseCase,
  RepostWorkspaceFeedPostUseCase,
  LikeWorkspaceFeedPostUseCase,
  ViewWorkspaceFeedPostUseCase,
  BookmarkWorkspaceFeedPostUseCase,
  ShareWorkspaceFeedPostUseCase,
  GetWorkspaceFeedPostUseCase,
  ListWorkspaceFeedUseCase,
  ListAccountWorkspaceFeedUseCase,
} from "./application/use-cases/workspace-feed.use-cases";

// Infrastructure
export {
  FirebaseWorkspaceFeedPostRepository,
  FirebaseWorkspaceFeedInteractionRepository,
} from "./infrastructure";

// Interfaces
export {
  createWorkspaceFeedPost,
  replyWorkspaceFeedPost,
  repostWorkspaceFeedPost,
  likeWorkspaceFeedPost,
  viewWorkspaceFeedPost,
  bookmarkWorkspaceFeedPost,
  shareWorkspaceFeedPost,
  getWorkspaceFeedPost,
  getWorkspaceFeed,
  getAccountWorkspaceFeed,
} from "./interfaces";

// API facade
export { WorkspaceFeedFacade, workspaceFeedFacade } from "./api";
export type {
  CreateWorkspaceFeedPostParams,
  ReplyWorkspaceFeedPostParams,
  RepostWorkspaceFeedPostParams,
  WorkspaceFeedInteractionParams,
} from "./api";
