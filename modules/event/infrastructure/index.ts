/**
 * Module: event
 * Layer: infrastructure
 * Purpose: Barrel re-export for all event infrastructure adapters.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export { InMemoryEventStoreRepository } from './repositories/in-memory-event-store.repository'
export { NoopEventBusRepository } from './repositories/noop-event-bus.repository'
