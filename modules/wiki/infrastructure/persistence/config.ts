/**
 * Module: wiki
 * Layer: infrastructure/persistence
 * Purpose: Wiki-specific Upstash adapter configuration.
 *          Connection credentials are centralised in @integration-upstash;
 *          this file only holds wiki-specific tuning knobs.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export const UPSTASH_CONFIG = {
  /** Timeout (ms) for Upstash Vector HTTP calls. */
  VECTOR_TIMEOUT: 5000,
  /** Default TTL (seconds) for cached entries in Upstash Redis. */
  CACHE_TTL: 3600,
} as const
