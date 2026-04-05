/**
 * Module: knowledge
 * Layer: domain/event
 * Purpose: Discriminated-union event types emitted by the Content domain.
 */

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

// ── Extracted-task shape (used inside KnowledgePageApprovedEvent) ───────────────

export interface ExtractedTask {
  readonly title: string;
  readonly dueDate?: string;
  readonly description?: string;
}

export interface ExtractedInvoice {
  readonly amount: number;
  readonly description: string;
  readonly currency?: string;
}

export interface KnowledgePageApprovedEvent {
  readonly type: "knowledge.page_approved";
  /** KnowledgePage aggregate ID (also the Firestore document id). */
  readonly aggregateId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly extractedTasks: ReadonlyArray<ExtractedTask>;
  readonly extractedInvoices: ReadonlyArray<ExtractedInvoice>;
  /** Actor who triggered the approval. */
  readonly actorId: string;
  /** ID of the command (ApproveKnowledgePageUseCase execution) that caused this event. */
  readonly causationId: string;
  /** Business-process correlation ID tracing the whole ingestion → approval → materialization flow. */
  readonly correlationId: string;
  readonly occurredAtISO: string;
}

export interface KnowledgeBlockAddedEvent {
  readonly type: "knowledge.block_added";
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly contentText: string;
  readonly occurredAtISO: string;
}

export interface KnowledgeBlockUpdatedEvent {
  readonly type: "knowledge.block_updated";
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
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

export type KnowledgeDomainEvent =
  | KnowledgePageCreatedEvent
  | KnowledgePageRenamedEvent
  | KnowledgePageMovedEvent
  | KnowledgePageArchivedEvent
  | KnowledgePageApprovedEvent
  | KnowledgeBlockAddedEvent
  | KnowledgeBlockUpdatedEvent
  | KnowledgeBlockDeletedEvent
  | KnowledgeVersionPublishedEvent;
