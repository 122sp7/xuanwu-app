/**
 * Module: wiki
 * Layer: infrastructure/repository
 * Purpose: Upstash Vector adapter implementing the IRetrievalRepository port.
 *          Used by GetRAGAnswerUseCase and SearchWikiDocumentsUseCase for semantic retrieval.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { vectorIndex } from '@integration-upstash'
import type { IRetrievalRepository, RetrievalHit, WikiDocument } from '@wiki-core'
import {
  type WikiDocVectorMetadata,
  fromMetadata,
  escapeFilterValue,
} from './wiki-vector-metadata'

/**
 * Translates the serialized filter produced by serializeFilter() in @wiki-service
 * into an Upstash Vector metadata filter expression.
 *
 * Supported segments:
 *   category:<value>     → taxonomyCategory = '<value>'
 *   tags:<tag1>,<tag2>   → taxonomyTagsJson CONTAINS '"<tag1>"' (first tag only)
 *   dateRange:<iso>~<iso> → ignored (string date comparison not reliable in Upstash Vector)
 */
function toUpstashFilter(serialized: string): string | undefined {
  if (!serialized) return undefined

  const parts = serialized.split(';').filter(Boolean)
  const clauses: string[] = []

  for (const part of parts) {
    const colonIdx = part.indexOf(':')
    if (colonIdx === -1) continue
    const key = part.slice(0, colonIdx)
    const value = part.slice(colonIdx + 1)

    if (key === 'category' && value) {
      clauses.push(`taxonomyCategory = '${escapeFilterValue(value)}'`)
    } else if (key === 'tags' && value) {
      const firstTag = value.split(',')[0]
      if (firstTag) {
        clauses.push(`taxonomyTagsJson CONTAINS '"${escapeFilterValue(firstTag)}"'`)
      }
    }
  }

  return clauses.length > 0 ? clauses.join(' AND ') : undefined
}

const PLACEHOLDER_VECTOR: number[] = Array<number>(1536).fill(0)

export class UpstashRetrievalRepository implements IRetrievalRepository {
  private readonly index = vectorIndex<WikiDocVectorMetadata>()

  async searchByVector(vector: number[], topK: number): Promise<RetrievalHit[]> {
    const results = await this.index.query({
      vector,
      topK,
      includeMetadata: true,
    })

    return results
      .filter((r) => r.metadata !== undefined)
      .map((r) => ({
        entity: fromMetadata(String(r.id), r.metadata!),
        score: r.score,
      }))
  }

  async searchByMetadata(filter: string, vector: number[]): Promise<WikiDocument[]> {
    const upstashFilter = toUpstashFilter(filter)
    const queryVector = vector.length > 0 ? vector : PLACEHOLDER_VECTOR

    const queryParams: Parameters<typeof this.index.query>[0] = {
      vector: queryVector,
      topK: 100,
      includeMetadata: true,
    }

    if (upstashFilter) {
      queryParams.filter = upstashFilter
    }

    const results = await this.index.query(queryParams)

    return results
      .filter((r) => r.metadata !== undefined)
      .map((r) => fromMetadata(String(r.id), r.metadata!))
  }
}
