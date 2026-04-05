/**
 * Module: knowledge
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

// ── Extracted-task shape (used inside ContentPageApprovedEvent) ───────────────

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

export interface ContentPageApprovedEvent {
  readonly type: "content.page_approved";
  /** ContentPage aggregate ID (also the Firestore document id). */
  readonly aggregateId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly extractedTasks: ReadonlyArray<ExtractedTask>;
  readonly extractedInvoices: ReadonlyArray<ExtractedInvoice>;
  /** Actor who triggered the approval. */
  readonly actorId: string;
  /** ID of the command (ApproveContentPageUseCase execution) that caused this event. */
  readonly causationId: string;
  /** Business-process correlation ID tracing the whole ingestion → approval → materialization flow. */
  readonly correlationId: string;
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
  | ContentPageApprovedEvent
  | ContentBlockAddedEvent
  | ContentBlockUpdatedEvent
  | ContentBlockDeletedEvent
  | ContentVersionPublishedEvent;
