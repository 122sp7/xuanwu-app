/**
 * Module: wiki-core
 * Layer: infrastructure/persistence
 * Purpose: Vendor configuration values for Upstash adapters.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export const UPSTASH_CONFIG = {
  VECTOR: {
    URL: process.env.UPSTASH_VECTOR_REST_URL || '',
    TOKEN: process.env.UPSTASH_VECTOR_REST_TOKEN || '',
    TIMEOUT: 5000,
  },
  REDIS: {
    URL: process.env.UPSTASH_REDIS_REST_URL || '',
    TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  },
  CACHE_TTL: 3600,
} as const
