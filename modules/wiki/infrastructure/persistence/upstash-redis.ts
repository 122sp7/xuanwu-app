/**
 * Module: wiki
 * Layer: infrastructure/persistence
 * Purpose: Upstash Redis client setup for analytics/cache adapters.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { Redis } from '@upstash/redis'

export const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})
