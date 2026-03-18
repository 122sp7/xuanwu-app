/**
 * Module: knowledge-core
 * Layer: infrastructure/persistence
 * Purpose: Upstash Vector index client setup for retrieval adapters.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { Index } from '@upstash/vector'

export const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL || '',
  token: process.env.UPSTASH_VECTOR_REST_TOKEN || '',
})
