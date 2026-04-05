/**
 * modules/shared — public API barrel.
 * Re-exports all shared domain primitives for cross-module consumption.
 */

export type { BaseEntity, CreatedBy, QueryScope } from "../domain/types";
export { BaseEntitySchema } from "../domain/types";
export type { DomainEvent } from "../domain/events";
export type { KnowledgeUpdatedEvent } from "../domain/events/knowledge-updated.event";
export {
  KNOWLEDGE_UPDATED_EVENT_TYPE,
  createKnowledgeUpdatedEvent,
} from "../domain/events/knowledge-updated.event";
export type { KnowledgePageCreatedEvent } from "../domain/events/knowledge-page-created.event";
export {
  KNOWLEDGE_PAGE_CREATED_EVENT_TYPE,
  createKnowledgePageCreatedEvent,
} from "../domain/events/knowledge-page-created.event";
export { SimpleEventBus } from "../infrastructure/SimpleEventBus";
export type { EventHandler } from "../infrastructure/SimpleEventBus";

// ── Slug utilities (moved from modules/namespace) ─────────────────────────────
export { deriveSlugCandidate, isValidSlug } from "../domain/slug-utils";

// ── Event-store primitives (moved from modules/event) ─────────────────────────
export { EventRecord } from "../domain/event-record";
export type {
  EventRecordPayload,
  EventMetadata,
  IEventStoreRepository,
  IEventBusRepository,
} from "../domain/event-record";
export { PublishDomainEventUseCase } from "../application/publish-domain-event";
export type { PublishDomainEventDTO } from "../application/publish-domain-event";
export { InMemoryEventStoreRepository } from "../infrastructure/InMemoryEventStoreRepository";
export { NoopEventBusRepository } from "../infrastructure/NoopEventBusRepository";
