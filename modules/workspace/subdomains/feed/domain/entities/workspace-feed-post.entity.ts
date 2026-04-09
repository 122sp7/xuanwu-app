export const WORKSPACE_FEED_POST_TYPES = ["post", "reply", "repost"] as const;
export type WorkspaceFeedPostType = (typeof WORKSPACE_FEED_POST_TYPES)[number];

export interface WorkspaceFeedPost {
  id: string;
  accountId: string;
  workspaceId: string;
  authorAccountId: string;
  type: WorkspaceFeedPostType;
  content: string;
  replyToPostId: string | null;
  repostOfPostId: string | null;
  likeCount: number;
  replyCount: number;
  repostCount: number;
  viewCount: number;
  bookmarkCount: number;
  shareCount: number;
  createdAtISO: string;
  updatedAtISO: string;
}

export interface CreateWorkspaceFeedPostInput {
  accountId: string;
  workspaceId: string;
  authorAccountId: string;
  content: string;
}

export interface CreateWorkspaceFeedReplyInput {
  accountId: string;
  workspaceId: string;
  parentPostId: string;
  authorAccountId: string;
  content: string;
}

export interface CreateWorkspaceFeedRepostInput {
  accountId: string;
  workspaceId: string;
  sourcePostId: string;
  actorAccountId: string;
  comment?: string;
}

export interface WorkspaceFeedCounterPatch {
  likeDelta?: number;
  replyDelta?: number;
  repostDelta?: number;
  viewDelta?: number;
  bookmarkDelta?: number;
  shareDelta?: number;
}
