/**
 * Module: workspace-feed
 * Layer: application/use-cases
 * Purpose: Re-export barrel for all workspace-feed use cases.
 *          Split by subdomain for IDDD single-responsibility:
 *  - workspace-feed-post.use-cases.ts        (create, reply, repost, get, list)
 *  - workspace-feed-interaction.use-cases.ts  (like, bookmark, view, share)
 */

export {
  CreateWorkspaceFeedPostUseCase,
  ReplyWorkspaceFeedPostUseCase,
  RepostWorkspaceFeedPostUseCase,
  GetWorkspaceFeedPostUseCase,
  ListWorkspaceFeedUseCase,
  ListAccountWorkspaceFeedUseCase,
} from "./workspace-feed-post.use-cases";

export {
  LikeWorkspaceFeedPostUseCase,
  BookmarkWorkspaceFeedPostUseCase,
  ViewWorkspaceFeedPostUseCase,
  ShareWorkspaceFeedPostUseCase,
} from "./workspace-feed-interaction.use-cases";
