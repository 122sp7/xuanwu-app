/**
 * Module: wiki
 * Layer: infrastructure/persistence
 * Purpose: Re-export the shared Upstash Redis singleton from @integration-upstash.
 *          Wiki-specific code should import `redisClient` from this file so that the
 *          module boundary stays clean while the actual client instance is centralised
 *          in the integration package (no duplicate clients).
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { redis } from '@integration-upstash'

export const redisClient = redis
