export const WORKSPACE_FEED_EVENT_TYPES = [
  "workspace.feed.post-created",
  "workspace.feed.reply-created",
  "workspace.feed.repost-created",
  "workspace.feed.post-liked",
  "workspace.feed.post-viewed",
  "workspace.feed.post-bookmarked",
  "workspace.feed.post-shared",
] as const;

export type WorkspaceFeedEventType = (typeof WORKSPACE_FEED_EVENT_TYPES)[number];

interface WorkspaceFeedBaseEvent {
  type: WorkspaceFeedEventType;
  accountId: string;
  workspaceId: string;
  postId: string;
  actorAccountId: string;
  occurredAtISO: string;
}

export interface WorkspaceFeedPostCreatedEvent extends WorkspaceFeedBaseEvent {
  type: "workspace.feed.post-created";
}

export interface WorkspaceFeedReplyCreatedEvent extends WorkspaceFeedBaseEvent {
  type: "workspace.feed.reply-created";
  parentPostId: string;
}

export interface WorkspaceFeedRepostCreatedEvent extends WorkspaceFeedBaseEvent {
  type: "workspace.feed.repost-created";
  sourcePostId: string;
}

export interface WorkspaceFeedPostLikedEvent extends WorkspaceFeedBaseEvent {
  type: "workspace.feed.post-liked";
}

export interface WorkspaceFeedPostViewedEvent extends WorkspaceFeedBaseEvent {
  type: "workspace.feed.post-viewed";
}

export interface WorkspaceFeedPostBookmarkedEvent extends WorkspaceFeedBaseEvent {
  type: "workspace.feed.post-bookmarked";
}

export interface WorkspaceFeedPostSharedEvent extends WorkspaceFeedBaseEvent {
  type: "workspace.feed.post-shared";
}

export type WorkspaceFeedDomainEvent =
  | WorkspaceFeedPostCreatedEvent
  | WorkspaceFeedReplyCreatedEvent
  | WorkspaceFeedRepostCreatedEvent
  | WorkspaceFeedPostLikedEvent
  | WorkspaceFeedPostViewedEvent
  | WorkspaceFeedPostBookmarkedEvent
  | WorkspaceFeedPostSharedEvent;
