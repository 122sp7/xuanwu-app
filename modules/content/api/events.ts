/**
 * Module: content
 * Layer: api/events
 * Purpose: Public event contracts emitted by the Content domain.
 *
 * External modules (e.g. workspace-flow) MUST import event types only from
 * this path. Never import from content/domain/events directly.
 */

export type {
  ContentPageCreatedEvent,
  ContentPageRenamedEvent,
  ContentPageMovedEvent,
  ContentPageArchivedEvent,
  ContentPageApprovedEvent,
  ContentBlockAddedEvent,
  ContentBlockUpdatedEvent,
  ContentBlockDeletedEvent,
  ContentVersionPublishedEvent,
  ContentDomainEvent,
  ExtractedTask,
  ExtractedInvoice,
} from "../domain/events/content.events";

// ── Event-type constants (for switch/case subscribers) ────────────────────────

export const CONTENT_EVENT_TYPES = {
  PAGE_CREATED: "content.page_created",
  PAGE_RENAMED: "content.page_renamed",
  PAGE_MOVED: "content.page_moved",
  PAGE_ARCHIVED: "content.page_archived",
  PAGE_APPROVED: "content.page_approved",
  BLOCK_ADDED: "content.block_added",
  BLOCK_UPDATED: "content.block_updated",
  BLOCK_DELETED: "content.block_deleted",
  VERSION_PUBLISHED: "content.version_published",
} as const;

export type ContentEventType = (typeof CONTENT_EVENT_TYPES)[keyof typeof CONTENT_EVENT_TYPES];
