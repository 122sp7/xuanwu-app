export interface FeedDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface FeedPostCreatedEvent extends FeedDomainEvent {
  readonly type: "workspace.feed.post-created";
  readonly payload: { readonly postId: string; readonly workspaceId: string; readonly authorAccountId: string };
}

export type FeedDomainEventType = FeedPostCreatedEvent;
