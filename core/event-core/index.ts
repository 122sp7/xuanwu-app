/**
 * Module: event-core
 * Layer: facade
 * Purpose: Integration facade re-exporting all event-core public contracts.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

// ── Domain: Entities ────────────────────────────────────────────────────────
export { DomainEvent } from './domain/entities/domain-event.entity'
export type { DomainEventPayload } from './domain/entities/domain-event.entity'

// ── Domain: Repositories (ports) ────────────────────────────────────────────
export type { IEventBusRepository } from './domain/repositories/ievent-bus.repository'
export type { IEventStoreRepository } from './domain/repositories/ievent-store.repository'

// ── Domain: Services ────────────────────────────────────────────────────────
export {
  shouldRetry,
  nextRetryDelayMs,
  type DispatchAttempt,
  type DispatchPolicy,
} from './domain/services/dispatch-policy'

// ── Domain: Value Objects ───────────────────────────────────────────────────
export type { EventMetadata } from './domain/value-objects/event-metadata.vo'

// ── Application: Use Cases ──────────────────────────────────────────────────
export { PublishDomainEventUseCase } from './application/use-cases/publish-domain-event'
export type { PublishDomainEventDTO } from './application/use-cases/publish-domain-event'
export { ListEventsByAggregateUseCase } from './application/use-cases/list-events-by-aggregate'
export type { ListEventsByAggregateDTO } from './application/use-cases/list-events-by-aggregate'

// ── Infrastructure ──────────────────────────────────────────────────────────
export { InMemoryEventStoreRepository } from './infrastructure/repositories/in-memory-event-store.repository'
export { NoopEventBusRepository } from './infrastructure/repositories/noop-event-bus.repository'

// ── Interfaces ──────────────────────────────────────────────────────────────
export { EventController } from './interfaces/api/event.controller'
