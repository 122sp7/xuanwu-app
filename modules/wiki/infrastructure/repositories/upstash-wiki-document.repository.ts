/**
 * Module: wiki
 * Layer: infrastructure/repository
 * Purpose: Upstash Vector adapter implementing wiki document persistence and vector search.
 *          Uses @integration-upstash directly — no local Upstash client setup needed.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { vectorIndex } from '@integration-upstash'
import type { IWikiDocumentRepository } from '@wiki-core'
import type { WikiDocument } from '@wiki-core'
import {
  type WikiDocVectorMetadata,
  toMetadata,
  fromMetadata,
  escapeFilterValue,
} from './wiki-vector-metadata'

/**
 * Placeholder vector used for metadata-only upserts and list queries.
 * The Python ingestion worker overwrites this with real OpenAI embeddings.
 * Dimension aligned with text-embedding-3-small (1536).
 */
const PLACEHOLDER_VECTOR: number[] = Array<number>(1536).fill(0)

export class UpstashWikiDocumentRepository implements IWikiDocumentRepository {
  private readonly index = vectorIndex<WikiDocVectorMetadata>()

  async save(entity: WikiDocument): Promise<void> {
    await this.index.upsert({
      id: entity.id,
      vector: PLACEHOLDER_VECTOR,
      metadata: toMetadata(entity),
    })
  }

  async findById(id: string): Promise<WikiDocument | null> {
    const results = await this.index.fetch([id], { includeMetadata: true })
    const result = results[0]
    if (!result?.metadata) {
      return null
    }
    return fromMetadata(String(result.id), result.metadata)
  }

  async findByOrganization(organizationId: string): Promise<WikiDocument[]> {
    const results = await this.index.query({
      vector: PLACEHOLDER_VECTOR,
      topK: 1000,
      filter: `organizationId = '${escapeFilterValue(organizationId)}'`,
      includeMetadata: true,
    })
    return results
      .filter((r) => r.metadata !== undefined)
      .map((r) => fromMetadata(String(r.id), r.metadata!))
  }

  async findByWorkspace(organizationId: string, workspaceId: string): Promise<WikiDocument[]> {
    const results = await this.index.query({
      vector: PLACEHOLDER_VECTOR,
      topK: 1000,
      filter: `organizationId = '${escapeFilterValue(organizationId)}' AND workspaceId = '${escapeFilterValue(workspaceId)}'`,
      includeMetadata: true,
    })
    return results
      .filter((r) => r.metadata !== undefined)
      .map((r) => fromMetadata(String(r.id), r.metadata!))
  }

  async search(vector: number[]): Promise<WikiDocument[]> {
    const results = await this.index.query({
      vector,
      topK: 20,
      includeMetadata: true,
    })
    return results
      .filter((r) => r.metadata !== undefined)
      .map((r) => fromMetadata(String(r.id), r.metadata!))
  }
}
