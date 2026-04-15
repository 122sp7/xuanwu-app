import type { FeedPostSnapshot } from "../entities/FeedPost";

export interface FeedPostRepository {
  findById(accountId: string, postId: string): Promise<FeedPostSnapshot | null>;
  listByWorkspaceId(accountId: string, workspaceId: string, limit: number): Promise<FeedPostSnapshot[]>;
  listByAccountId(accountId: string, limit: number): Promise<FeedPostSnapshot[]>;
  save(post: FeedPostSnapshot): Promise<void>;
  incrementCounter(accountId: string, postId: string, field: "likeCount" | "replyCount" | "repostCount" | "viewCount" | "bookmarkCount" | "shareCount", delta: number): Promise<void>;
}
