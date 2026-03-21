"use server"

/**
 * Module: wiki
 * Layer: interfaces/actions
 * Purpose: Server Action for wiki document search — thin orchestrator that:
 *   1. Embeds the user query via OpenAI to get a query vector.
 *   2. Delegates to SearchWikiDocumentsUseCase for hybrid metadata + vector search.
 *   3. Returns serialisable search results to the client.
 *
 * The action wires the domain use-case with the real Upstash-backed retrieval
 * repository so callers (e.g. RagSearchBar) only need to pass a plain text query.
 *
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { vectorIndex } from '../../infrastructure/persistence/upstash-vector'
import { redisClient } from '../../infrastructure/persistence/upstash-redis'
import { SearchWikiDocumentsUseCase } from '../../application/use-cases/search-wiki-documents.use-case'
import { UpstashRetrievalRepository } from '../../infrastructure/repositories/upstash-retrieval.repository'
import { OpenAIEmbeddingRepository } from '../../infrastructure/repositories/openai-embedding.repository'
import { SearchFilter } from '../../domain/value-objects/search-filter.vo'

// ── Result types ────────────────────────────────────────────────────────────

/** A single document hit returned to the client. */
export interface WikiSearchHit {
  id: string
  title: string
  scope: string
  category: string
  /** ISO-8601 date string. */
  createdAt: string
}

export interface WikiSearchResult {
  ok: boolean
  hits: WikiSearchHit[]
  error?: string
}

// ── Server Action ───────────────────────────────────────────────────────────

/**
 * Search wiki documents by natural language query.
 *
 * @param query         Free-text search query.
 * @param organizationId  Scope results to this organization (used for metadata filter).
 * @param workspaceId   Optional — further scope results to a workspace.
 * @param category      Optional — filter by taxonomy category.
 */
export async function searchWikiDocuments(
  query: string,
  organizationId: string,
  workspaceId?: string | null,
  category?: string,
): Promise<WikiSearchResult> {
  if (!query.trim()) {
    return { ok: false, hits: [], error: '搜尋詞不能為空' }
  }
  if (!organizationId.trim()) {
    return { ok: false, hits: [], error: 'organizationId is required' }
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return { ok: false, hits: [], error: 'OPENAI_API_KEY environment variable is not set' }
  }

  try {
    // 1. Embed the query text to obtain a query vector.
    const embedder = new OpenAIEmbeddingRepository(apiKey)
    const embedding = await embedder.embed({ text: query, documentId: '__query__' })

    // 2. Build a SearchFilter scoped to the organization (and optionally workspace / category).
    const filter = new SearchFilter(
      category ?? undefined,
      workspaceId ? [`ws:${workspaceId}`] : [],
      undefined,
    )

    // 3. Execute the search use-case with the real Upstash retrieval adapter.
    const retrieval = new UpstashRetrievalRepository(vectorIndex, redisClient)
    const useCase = new SearchWikiDocumentsUseCase(retrieval)
    const docs = await useCase.execute({
      filter,
      queryVector: embedding.values,
    })

    // 4. Map domain entities to serialisable DTOs.
    const hits: WikiSearchHit[] = docs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      scope: doc.scope,
      category: doc.taxonomy.category,
      createdAt: doc.createdAt.toISOString(),
    }))

    return { ok: true, hits }
  } catch (error) {
    return {
      ok: false,
      hits: [],
      error: error instanceof Error ? error.message : 'Unexpected search error',
    }
  }
}
