/**
 * Module: event-core
 * Layer: facade
 * Purpose: Integration facade that re-exports module contracts and local scaffolds.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export { DomainEvent } from './domain/entities/domain-event.entity'
export type { EventMetadata } from './domain/value-objects/event-metadata.vo'
export type { IEventBusRepository } from './domain/repositories/ievent-bus.repository'
export type { IEventStoreRepository } from './domain/repositories/ievent-store.repository'

export { PublishDomainEventUseCase } from './application/use-cases/publish-domain-event'
export { ListEventsByAggregateUseCase } from './application/use-cases/list-events-by-aggregate'

export { EventController } from './interfaces/api/event.controller'

export { InMemoryEventStoreRepository } from './infrastructure/repositories/in-memory-event-store.repository'
export { NoopEventBusRepository } from './infrastructure/repositories/noop-event-bus.repository'
