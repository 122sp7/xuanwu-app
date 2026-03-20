/**
 * Module: wiki-core
 * Layer: application/use-case
 * Purpose: RAG query orchestration — embeds query, retrieves top-K chunks, and assembles context.
 *          LLM answer generation is delegated to the caller (modules/ai via Genkit).
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import type { IEmbeddingRepository } from '../../domain/repositories/iembedding.repository'
import type { IRetrievalRepository } from '../../domain/repositories/iretrieval.repository'
import { RAGQueryResult } from '../../domain/value-objects/rag-query-result.vo'
import type { RAGSource } from '../../domain/value-objects/rag-query-result.vo'

export interface GetRAGAnswerDTO {
  query: string
  organizationId: string
  workspaceId?: string
  /** Maximum number of retrieval hits to include in the context. Defaults to 5. */
  topK?: number
}

export class GetRAGAnswerUseCase {
  constructor(
    private readonly embedder: IEmbeddingRepository,
    private readonly retrieval: IRetrievalRepository,
  ) {}

  async execute(dto: GetRAGAnswerDTO): Promise<RAGQueryResult> {
    if (!dto.query.trim()) {
      throw new Error('RAG query cannot be empty')
    }

    const topK = dto.topK ?? 5

    // 1. Embed the user query to produce a query vector.
    const embedding = await this.embedder.embed({ text: dto.query })

    // 2. Retrieve top-K semantically similar document chunks.
    const hits = await this.retrieval.searchByVector(embedding.values, topK)

    // 3. Assemble context from retrieved hits and build source references.
    const sources: RAGSource[] = hits.map((hit) => ({
      documentId: hit.entity.id,
      title: hit.entity.title,
      excerpt: hit.entity.content.slice(0, 300),
      score: hit.score,
      taxonomy: hit.entity.taxonomy.category,
    }))

    const contextParts = hits.map(
      (hit, i) => `[${i + 1}] ${hit.entity.title}\n${hit.entity.content.slice(0, 500)}`,
    )
    const assembledContext = contextParts.join('\n\n---\n\n')

    // The assembled context is returned as the answer; wire a Genkit LLM flow at
    // the interfaces layer to convert the context into a natural-language response.
    const confidence = hits.length > 0 ? Math.min(hits[0].score, 1) : 0

    return new RAGQueryResult({
      answer: assembledContext,
      sources,
      confidence,
    })
  }
}
