/**
 * Module: event-core
 * Layer: infrastructure/persistence
 * Purpose: Persistence and dispatch baseline config for adapter implementations.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export const EVENT_CORE_CONFIG = {
  DISPATCH: {
    BATCH_SIZE: 100,
    RETRY_LIMIT: 3,
  },
  STORE: {
    TABLE: 'domain_events',
  },
} as const
