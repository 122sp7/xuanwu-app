/**
 * Module: wiki
 * Layer: infrastructure/repository
 * Purpose: Upstash Vector-backed retrieval adapter — searches embeddings for RAG pipelines.
 *          Hydrates full WikiDocument entities from Redis after vector similarity ranking.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { Index } from '@upstash/vector'
import type { Redis } from '@upstash/redis'

import type { WikiDocument } from '../../domain/entities/wiki-document.entity'
import type { IRetrievalRepository, RetrievalHit } from '../../domain/repositories/iretrieval.repository'
import {
  type WikiVectorMetadata,
  REDIS_DOC_PREFIX,
  hydrateWikiDocument,
} from './upstash-shared'

export class UpstashRetrievalRepository implements IRetrievalRepository {
  constructor(
    private readonly vector: Index<WikiVectorMetadata>,
    private readonly redis: Redis,
  ) {}

  async searchByVector(vector: number[], topK: number): Promise<RetrievalHit[]> {
    if (vector.length === 0) return []

    const results = await this.vector.query<WikiVectorMetadata>({
      vector,
      topK,
      includeMetadata: true,
    })

    const hits: RetrievalHit[] = []

    for (const result of results) {
      if (!result.metadata?.documentId) continue
      const entity = await this.hydrateOne(result.metadata.documentId)
      if (entity) {
        hits.push({ entity, score: result.score })
      }
    }

    return hits
  }

  async searchByMetadata(filter: string, vector: number[]): Promise<WikiDocument[]> {
    if (vector.length === 0) return []

    const results = await this.vector.query<WikiVectorMetadata>({
      vector,
      topK: 20,
      includeMetadata: true,
      filter: filter || undefined,
    })

    const docs: WikiDocument[] = []

    for (const result of results) {
      if (!result.metadata?.documentId) continue
      const entity = await this.hydrateOne(result.metadata.documentId)
      if (entity) docs.push(entity)
    }

    return docs
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private async hydrateOne(id: string): Promise<WikiDocument | null> {
    const raw = await this.redis.get<string>(`${REDIS_DOC_PREFIX}${id}`)
    if (!raw) return null
    return hydrateWikiDocument(raw)
  }
}
