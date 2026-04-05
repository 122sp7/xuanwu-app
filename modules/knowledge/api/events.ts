/**
 * Module: knowledge
 * Layer: api/events
 * Purpose: Public event contracts emitted by the Content domain.
 *
 * External modules (e.g. workspace-flow) MUST import event types only from
 * this path. Never import from content/domain/events directly.
 */

export type {
  KnowledgePageCreatedEvent,
  KnowledgePageRenamedEvent,
  KnowledgePageMovedEvent,
  KnowledgePageArchivedEvent,
  KnowledgePageApprovedEvent,
  KnowledgeBlockAddedEvent,
  KnowledgeBlockUpdatedEvent,
  KnowledgeBlockDeletedEvent,
  KnowledgeVersionPublishedEvent,
  KnowledgeDomainEvent,
  ExtractedTask,
  ExtractedInvoice,
} from "../domain/events/knowledge.events";

// ── Event-type constants (for switch/case subscribers) ────────────────────────

export const KNOWLEDGE_EVENT_TYPES = {
  PAGE_CREATED: "knowledge.page_created",
  PAGE_RENAMED: "knowledge.page_renamed",
  PAGE_MOVED: "knowledge.page_moved",
  PAGE_ARCHIVED: "knowledge.page_archived",
  PAGE_APPROVED: "knowledge.page_approved",
  BLOCK_ADDED: "knowledge.block_added",
  BLOCK_UPDATED: "knowledge.block_updated",
  BLOCK_DELETED: "knowledge.block_deleted",
  VERSION_PUBLISHED: "knowledge.version_published",
} as const;

export type KnowledgeEventType = (typeof KNOWLEDGE_EVENT_TYPES)[keyof typeof KNOWLEDGE_EVENT_TYPES];
