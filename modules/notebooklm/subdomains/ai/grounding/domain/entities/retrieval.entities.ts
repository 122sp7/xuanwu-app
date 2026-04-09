/**
 * Module: notebooklm/subdomains/ai/grounding
 * Layer: domain/entities
 * Purpose: Core retrieval result types — the factual anchors used to ground
 *          AI-generated answers. These types flow from retrieval → synthesis.
 *
 * Design notes:
 * - RagRetrievedChunk is the atomic unit of grounding evidence.
 * - RagCitation links an answer claim back to its source chunk.
 * - RagRetrievalSummary reports the bibliographic scope of the retrieval pass.
 * - All fields are readonly; entities are value objects (compared by identity in the flow).
 */

/** A single text chunk fetched from the vector + sparse retrieval pass */
export interface RagRetrievedChunk {
  readonly chunkId: string;
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  /** Semantic / organisational taxonomy label (e.g. "規章制度") */
  readonly taxonomy: string;
  readonly text: string;
  /** Similarity score in [0, 1]; higher is more relevant */
  readonly score: number;
}

/** Attribution record that ties an answer claim to its source chunk */
export interface RagCitation {
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  readonly reason: string;
}

/** Summary of the retrieval execution scope for observability / UX */
export interface RagRetrievalSummary {
  readonly mode: "skeleton-metadata-filter";
  readonly scope: "organization" | "workspace";
  readonly retrievedChunkCount: number;
  readonly topK: number;
  readonly taxonomy?: string;
}
