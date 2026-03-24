/**
 * Module: content
 * Layer: domain/event
 * Purpose: Discriminated-union event types emitted by the Content domain.
 */

export interface ContentPageCreatedEvent {
  readonly type: "content.page_created";
  readonly pageId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly createdByUserId: string;
  readonly occurredAtISO: string;
}

export interface ContentPageRenamedEvent {
  readonly type: "content.page_renamed";
  readonly pageId: string;
  readonly accountId: string;
  readonly previousTitle: string;
  readonly newTitle: string;
  readonly occurredAtISO: string;
}

export interface ContentPageMovedEvent {
  readonly type: "content.page_moved";
  readonly pageId: string;
  readonly accountId: string;
  readonly previousParentPageId: string | null;
  readonly newParentPageId: string | null;
  readonly occurredAtISO: string;
}

export interface ContentPageArchivedEvent {
  readonly type: "content.page_archived";
  readonly pageId: string;
  readonly accountId: string;
  readonly occurredAtISO: string;
}

export interface ContentBlockAddedEvent {
  readonly type: "content.block_added";
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly contentText: string;
  readonly occurredAtISO: string;
}

export interface ContentBlockUpdatedEvent {
  readonly type: "content.block_updated";
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly contentText: string;
  readonly occurredAtISO: string;
}

export interface ContentBlockDeletedEvent {
  readonly type: "content.block_deleted";
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly occurredAtISO: string;
}

export interface ContentVersionPublishedEvent {
  readonly type: "content.version_published";
  readonly versionId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly label: string;
  readonly createdByUserId: string;
  readonly occurredAtISO: string;
}

export type ContentDomainEvent =
  | ContentPageCreatedEvent
  | ContentPageRenamedEvent
  | ContentPageMovedEvent
  | ContentPageArchivedEvent
  | ContentBlockAddedEvent
  | ContentBlockUpdatedEvent
  | ContentBlockDeletedEvent
  | ContentVersionPublishedEvent;
