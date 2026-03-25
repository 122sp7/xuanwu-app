/**
 * modules/shared — 跨模組共用的領域基礎類型。
 */
export type { BaseEntity, CreatedBy, QueryScope } from "./domain/types";
export { BaseEntitySchema } from "./domain/types";
export type { DomainEvent } from "./domain/events";
export type { ContentUpdatedEvent } from "./domain/events/content-updated.event";
export {
  CONTENT_UPDATED_EVENT_TYPE,
  createContentUpdatedEvent,
} from "./domain/events/content-updated.event";
export { SimpleEventBus } from "./infrastructure/SimpleEventBus";
export type { EventHandler } from "./infrastructure/SimpleEventBus";

// ── Slug utilities (moved from modules/namespace) ─────────────────────────────
export { deriveSlugCandidate, isValidSlug } from "./domain/slug-utils";

// ── Event-store primitives (moved from modules/event) ─────────────────────────
export { EventRecord } from "./domain/event-record";
export type {
  EventRecordPayload,
  EventMetadata,
  IEventStoreRepository,
  IEventBusRepository,
} from "./domain/event-record";
export { PublishDomainEventUseCase } from "./application/publish-domain-event";
export type { PublishDomainEventDTO } from "./application/publish-domain-event";
export { InMemoryEventStoreRepository } from "./infrastructure/InMemoryEventStoreRepository";
export { NoopEventBusRepository } from "./infrastructure/NoopEventBusRepository";
