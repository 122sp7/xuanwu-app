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

import { WikiDocument } from '../../domain/entities/wiki-document.entity'
import type { IWikiDocumentRepository } from '../../domain/repositories/iwiki-document.repository'
import { Taxonomy } from '../../domain/value-objects/taxonomy.vo'

/** Metadata stored alongside each vector in the Upstash Vector index. */
interface WikiVectorMetadata {
  [key: string]: unknown
  documentId: string
  organizationId: string
  workspaceId: string | null
  title: string
  category: string
  scope: string
}

/** Shape of the serialised document stored in Redis. */
interface WikiDocumentRecord {
  id: string
  title: string
  content: string
  status: string
  createdAt: string
  organizationId: string
  workspaceId: string | null
  taxonomy: { category: string; tags: string[]; namespace: string }
  scope: string
  parentPageId: string | null
}

const REDIS_DOC_PREFIX = 'wiki:doc:'
const REDIS_ORG_SET_PREFIX = 'wiki:org:'
const REDIS_WS_SET_PREFIX = 'wiki:ws:'

export class UpstashWikiDocumentRepository implements IWikiDocumentRepository {
  constructor(
    private readonly vector: Index<WikiVectorMetadata>,
    private readonly redis: Redis,
  ) {}

  async save(entity: WikiDocument): Promise<void> {
    const record: WikiDocumentRecord = {
      id: entity.id,
      title: entity.title,
      content: entity.content,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      organizationId: entity.organizationId,
      workspaceId: entity.workspaceId,
      taxonomy: {
        category: entity.taxonomy.category,
        tags: entity.taxonomy.tags,
        namespace: entity.taxonomy.namespace,
      },
      scope: entity.scope,
      parentPageId: entity.parentPageId,
    }

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
    return UpstashWikiDocumentRepository.hydrate(raw)
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
      .map((v) => UpstashWikiDocumentRepository.hydrate(v))
  }

  private static hydrate(raw: string): WikiDocument {
    const data: WikiDocumentRecord = typeof raw === 'string' ? JSON.parse(raw) : raw
    return new WikiDocument(
      data.id,
      data.title,
      data.content,
      data.status as WikiDocument['status'],
      new Date(data.createdAt),
      data.organizationId,
      data.workspaceId,
      new Taxonomy(data.taxonomy.category, data.taxonomy.tags, data.taxonomy.namespace),
      data.scope as WikiDocument['scope'],
      data.parentPageId,
    )
  }
}
