/**
 * Module: workspace-feed
 * Layer: module/barrel (public API)
 *
 * Domain isolation rule:
 * - Cross-module callers must use `workspaceFeedFacade`.
 * - Internal layers remain private to this module.
 */

export { WorkspaceFeedFacade, workspaceFeedFacade } from "./api";
export type {
  CreateWorkspaceFeedPostParams,
  ReplyWorkspaceFeedPostParams,
  RepostWorkspaceFeedPostParams,
  WorkspaceFeedInteractionParams,
} from "./api";

// Read model exposed for API consumers.
export type { WorkspaceFeedPost, WorkspaceFeedPostType } from "./domain/entities/workspace-feed-post.entity";
export { WORKSPACE_FEED_POST_TYPES } from "./domain/entities/workspace-feed-post.entity";
