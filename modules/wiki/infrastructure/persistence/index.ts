/**
 * Module: wiki
 * Layer: infrastructure/persistence
 * Purpose: Barrel re-export for Upstash client setup and vendor configuration.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export { UPSTASH_CONFIG } from './config'
export { redisClient } from './upstash-redis'
export { vectorIndex } from './upstash-vector'
