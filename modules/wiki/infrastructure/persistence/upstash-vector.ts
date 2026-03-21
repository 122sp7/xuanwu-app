/**
 * Module: wiki
 * Layer: infrastructure/persistence
 * Purpose: Re-export a typed Upstash Vector index from @integration-upstash.
 *          Wiki-specific code should import `vectorIndex` from this file so that
 *          the module boundary stays clean while the actual client factory is
 *          centralised in the integration package (no duplicate clients).
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { vectorIndex as createVectorIndex } from '@integration-upstash'
import type { WikiVectorMetadata } from '../repositories/upstash-shared'

export const vectorIndex = createVectorIndex<WikiVectorMetadata>()
