/**
 * modules/shared — public API barrel.
 * Re-exports all shared domain primitives for cross-module consumption.
 */

export type { BaseEntity, CreatedBy, QueryScope } from "../domain/types";
export { BaseEntitySchema } from "../domain/types";
export type { DomainEvent } from "../domain/events";
export type { ContentUpdatedEvent } from "../domain/events/content-updated.event";
export {
  CONTENT_UPDATED_EVENT_TYPE,
  createContentUpdatedEvent,
} from "../domain/events/content-updated.event";
export { SimpleEventBus } from "../infrastructure/SimpleEventBus";
export type { EventHandler } from "../infrastructure/SimpleEventBus";
