/**
 * Module: wiki-core
 * Layer: application/use-case
 * Purpose: Metadata-driven search over indexed wiki documents using a SearchFilter and optional vector.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { WikiDocument } from '../../domain/entities/wiki-document.entity'
import type { IRetrievalRepository } from '../../domain/repositories/iretrieval.repository'
import type { SearchFilter } from '../../domain/value-objects/search-filter.vo'

export interface SearchWikiDocumentsDTO {
  filter: SearchFilter
  /** Optional query vector for hybrid metadata + vector search. */
  queryVector?: number[]
}

export class SearchWikiDocumentsUseCase {
  constructor(private readonly retrieval: IRetrievalRepository) {}

  async execute(dto: SearchWikiDocumentsDTO): Promise<WikiDocument[]> {
    const filterString = serializeFilter(dto.filter)

    if (dto.queryVector && dto.queryVector.length > 0) {
      return this.retrieval.searchByMetadata(filterString, dto.queryVector)
    }

    // Fall back to metadata-only search with an empty vector when no query vector is provided.
    return this.retrieval.searchByMetadata(filterString, [])
  }
}

/** Serializes a SearchFilter into a stable string for the retrieval adapter. */
function serializeFilter(filter: SearchFilter): string {
  const parts: string[] = []

  if (filter.category) {
    parts.push(`category:${filter.category}`)
  }

  if (filter.tags.length > 0) {
    parts.push(`tags:${filter.tags.join(',')}`)
  }

  if (filter.dateRange) {
    parts.push(
      `dateRange:${filter.dateRange.start.toISOString()}~${filter.dateRange.end.toISOString()}`,
    )
  }

  return parts.join(';')
}
