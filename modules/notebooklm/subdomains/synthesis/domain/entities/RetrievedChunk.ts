/**
 * Module: notebooklm/subdomains/retrieval
 * Layer: domain/entities
 * Purpose: RetrievedChunk — atomic unit of grounding evidence from vector/sparse retrieval.
 *
 * Migration source: ai/domain/entities/retrieval.entities.ts → RagRetrievedChunk
 * This is the target canonical location after Strangler Pattern convergence.
 */

/** A single text chunk fetched from the vector + sparse retrieval pass */
export interface RetrievedChunk {
  readonly chunkId: string;
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  /** Semantic / organisational taxonomy label */
  readonly taxonomy: string;
  readonly text: string;
  /** Similarity score in [0, 1]; higher is more relevant */
  readonly score: number;
}

/** Summary of the retrieval execution scope for observability / UX */
export interface RetrievalSummary {
  readonly mode: string;
  readonly scope: "organization" | "workspace";
  readonly retrievedChunkCount: number;
  readonly topK: number;
  readonly taxonomy?: string;
}
