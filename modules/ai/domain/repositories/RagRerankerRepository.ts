import type { RagRetrievedChunk } from "../entities/RagQuery";

export interface RerankInput {
  readonly userQuery: string;
  readonly chunks: readonly RagRetrievedChunk[];
  /** Maximum number of chunks to return after reranking. */
  readonly topN: number;
}

export interface RagRerankerRepository {
  /**
   * Re-score and re-order previously retrieved chunks using a cross-encoder or
   * LLM-based relevance assessment (Layer 12 — ADR-004 §4).
   *
   * Implementations must return at most `topN` chunks, sorted by descending
   * relevance score. The returned chunks may carry updated `score` values.
   */
  rerank(input: RerankInput): Promise<readonly RagRetrievedChunk[]>;
}
