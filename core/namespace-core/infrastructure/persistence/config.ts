/**
 * Module: namespace-core
 * Layer: infrastructure/persistence
 * Purpose: Persistence baseline config for namespace adapter implementations.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export const NAMESPACE_CORE_CONFIG = {
  STORE: {
    COLLECTION: 'namespaces',
  },
  SLUG: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 63,
  },
} as const
