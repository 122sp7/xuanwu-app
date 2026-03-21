/**
 * Module: wiki
 * Layer: infrastructure/repository
 * Purpose: Adapter implementing wiki document repository contract via Upstash Vector + Redis.
 *          - Vector index: stores embeddings for similarity search.
 *          - Redis: stores serialized document JSON keyed by document id.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { Index } from '@upstash/vector'
import type { Redis } from '@upstash/redis'

import type { WikiDocument } from '../../domain/entities/wiki-document.entity'
import type { IWikiDocumentRepository } from '../../domain/repositories/iwiki-document.repository'
import {
  type WikiVectorMetadata,
  REDIS_DOC_PREFIX,
  REDIS_ORG_SET_PREFIX,
  REDIS_WS_SET_PREFIX,
  hydrateWikiDocument,
  serializeWikiDocument,
} from './upstash-shared'

export class UpstashWikiDocumentRepository implements IWikiDocumentRepository {
  constructor(
    private readonly vector: Index<WikiVectorMetadata>,
    private readonly redis: Redis,
  ) {}

  async save(entity: WikiDocument): Promise<void> {
    const record = serializeWikiDocument(entity)

    const pipeline = this.redis.pipeline()
    pipeline.set(`${REDIS_DOC_PREFIX}${entity.id}`, JSON.stringify(record))
    pipeline.sadd(`${REDIS_ORG_SET_PREFIX}${entity.organizationId}`, entity.id)
    if (entity.workspaceId) {
      pipeline.sadd(
        `${REDIS_WS_SET_PREFIX}${entity.organizationId}:${entity.workspaceId}`,
        entity.id,
      )
    }
    await pipeline.exec()
  }

  async findById(id: string): Promise<WikiDocument | null> {
    const raw = await this.redis.get<string>(`${REDIS_DOC_PREFIX}${id}`)
    if (!raw) return null
    return hydrateWikiDocument(raw)
  }

  async findByOrganization(organizationId: string): Promise<WikiDocument[]> {
    const ids = await this.redis.smembers<string[]>(`${REDIS_ORG_SET_PREFIX}${organizationId}`)
    if (!ids || ids.length === 0) return []
    return this.hydrateMany(ids)
  }

  async findByWorkspace(organizationId: string, workspaceId: string): Promise<WikiDocument[]> {
    const ids = await this.redis.smembers<string[]>(
      `${REDIS_WS_SET_PREFIX}${organizationId}:${workspaceId}`,
    )
    if (!ids || ids.length === 0) return []
    return this.hydrateMany(ids)
  }

  async search(vector: number[]): Promise<WikiDocument[]> {
    if (vector.length === 0) return []

    const results = await this.vector.query<WikiVectorMetadata>({
      vector,
      topK: 10,
      includeMetadata: true,
    })

    const ids = results
      .filter((r) => r.metadata?.documentId)
      .map((r) => r.metadata!.documentId)

    if (ids.length === 0) return []
    return this.hydrateMany(ids)
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private async hydrateMany(ids: string[]): Promise<WikiDocument[]> {
    const keys = ids.map((id) => `${REDIS_DOC_PREFIX}${id}`)
    const rawValues = await this.redis.mget<string[]>(...keys)

    return rawValues
      .filter((v): v is string => v !== null && v !== undefined)
      .map((v) => hydrateWikiDocument(v))
  }
}
