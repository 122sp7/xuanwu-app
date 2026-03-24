/**
 * Module: knowledge
 * Layer: domain/event
 * Purpose: Discriminated-union event types emitted by the Knowledge domain.
 *
 * Events capture business facts — they are immutable records of what happened.
 * Consumers publish via the @/modules/event IEventBusRepository.
 *
 * Event flow sketch:
 *   PageCreated → BlockAdded → BlockUpdated → VersionPublished → PageMoved → PageArchived
 *
 * RAG integration note:
 *   PageCreatedEvent and BlockUpdatedEvent carry `contentText` (the plain-text
 *   excerpt) which the infrastructure layer can forward to an Upstash Vector
 *   ingestion job without any domain-level I/O.
 */

// ── Individual event shapes ───────────────────────────────────────────────────

export interface KnowledgePageCreatedEvent {
  readonly type: "knowledge.page_created";
  readonly pageId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly createdByUserId: string;
  readonly occurredAtISO: string;
}

export interface KnowledgePageRenamedEvent {
  readonly type: "knowledge.page_renamed";
  readonly pageId: string;
  readonly accountId: string;
  readonly previousTitle: string;
  readonly newTitle: string;
  readonly occurredAtISO: string;
}

export interface KnowledgePageMovedEvent {
  readonly type: "knowledge.page_moved";
  readonly pageId: string;
  readonly accountId: string;
  readonly previousParentPageId: string | null;
  readonly newParentPageId: string | null;
  readonly occurredAtISO: string;
}

export interface KnowledgePageArchivedEvent {
  readonly type: "knowledge.page_archived";
  readonly pageId: string;
  readonly accountId: string;
  readonly occurredAtISO: string;
}

export interface KnowledgeBlockAddedEvent {
  readonly type: "knowledge.block_added";
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  /** Plain-text excerpt — forwarded to Upstash Vector for RAG indexing. */
  readonly contentText: string;
  readonly occurredAtISO: string;
}

export interface KnowledgeBlockUpdatedEvent {
  readonly type: "knowledge.block_updated";
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  /** Plain-text excerpt — forwarded to Upstash Vector for RAG re-indexing. */
  readonly contentText: string;
  readonly occurredAtISO: string;
}

export interface KnowledgeBlockDeletedEvent {
  readonly type: "knowledge.block_deleted";
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly occurredAtISO: string;
}

export interface KnowledgeVersionPublishedEvent {
  readonly type: "knowledge.version_published";
  readonly versionId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly label: string;
  readonly createdByUserId: string;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type KnowledgeDomainEvent =
  | KnowledgePageCreatedEvent
  | KnowledgePageRenamedEvent
  | KnowledgePageMovedEvent
  | KnowledgePageArchivedEvent
  | KnowledgeBlockAddedEvent
  | KnowledgeBlockUpdatedEvent
  | KnowledgeBlockDeletedEvent
  | KnowledgeVersionPublishedEvent;
