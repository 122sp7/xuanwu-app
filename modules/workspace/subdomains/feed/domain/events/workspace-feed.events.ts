export const WORKSPACE_FEED_EVENT_TYPES = [
  "WorkspaceFeedPostCreated",
  "WorkspaceFeedReplyCreated",
  "WorkspaceFeedRepostCreated",
  "WorkspaceFeedPostLiked",
  "WorkspaceFeedPostViewed",
  "WorkspaceFeedPostBookmarked",
  "WorkspaceFeedPostShared",
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
  type: "WorkspaceFeedPostCreated";
}

export interface WorkspaceFeedReplyCreatedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedReplyCreated";
  parentPostId: string;
}

export interface WorkspaceFeedRepostCreatedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedRepostCreated";
  sourcePostId: string;
}

export interface WorkspaceFeedPostLikedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedPostLiked";
}

export interface WorkspaceFeedPostViewedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedPostViewed";
}

export interface WorkspaceFeedPostBookmarkedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedPostBookmarked";
}

export interface WorkspaceFeedPostSharedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedPostShared";
}

export type WorkspaceFeedDomainEvent =
  | WorkspaceFeedPostCreatedEvent
  | WorkspaceFeedReplyCreatedEvent
  | WorkspaceFeedRepostCreatedEvent
  | WorkspaceFeedPostLikedEvent
  | WorkspaceFeedPostViewedEvent
  | WorkspaceFeedPostBookmarkedEvent
  | WorkspaceFeedPostSharedEvent;
