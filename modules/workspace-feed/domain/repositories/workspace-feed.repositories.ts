import type {
  CreateWorkspaceFeedPostInput,
  CreateWorkspaceFeedReplyInput,
  CreateWorkspaceFeedRepostInput,
  WorkspaceFeedCounterPatch,
  WorkspaceFeedPost,
} from "../entities/workspace-feed-post.entity";

export interface WorkspaceFeedPostRepository {
  createPost(input: CreateWorkspaceFeedPostInput): Promise<WorkspaceFeedPost>;
  createReply(input: CreateWorkspaceFeedReplyInput): Promise<WorkspaceFeedPost>;
  createRepost(input: CreateWorkspaceFeedRepostInput): Promise<WorkspaceFeedPost | null>;
  patchCounters(accountId: string, postId: string, patch: WorkspaceFeedCounterPatch): Promise<void>;
  findById(accountId: string, postId: string): Promise<WorkspaceFeedPost | null>;
  listByWorkspaceId(accountId: string, workspaceId: string, limit: number): Promise<WorkspaceFeedPost[]>;
  listByAccountId(accountId: string, limit: number): Promise<WorkspaceFeedPost[]>;
}

export interface WorkspaceFeedInteractionRepository {
  like(accountId: string, postId: string, actorAccountId: string): Promise<boolean>;
  bookmark(accountId: string, postId: string, actorAccountId: string): Promise<boolean>;
  view(accountId: string, postId: string, actorAccountId: string): Promise<void>;
  share(accountId: string, postId: string, actorAccountId: string): Promise<void>;
}
