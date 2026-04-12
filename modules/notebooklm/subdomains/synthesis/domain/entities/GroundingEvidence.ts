/**
 * Module: notebooklm/subdomains/grounding
 * Layer: domain/entities
 * Purpose: GroundingEvidence — attribution record tying an answer claim to its source.
 *
 * Migration source: ai/domain/entities/retrieval.entities.ts → RagCitation
 * Migration source: ai/domain/services/RagCitationBuilder.ts
 */

/** Attribution record that ties an answer claim to its source chunk */
export interface Citation {
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  readonly reason: string;
}

/** Grounding evidence aggregating citations with source metadata */
export interface GroundingEvidence {
  readonly traceId: string;
  readonly citations: readonly Citation[];
  readonly totalChunksConsidered: number;
  readonly groundedAt: string;
}
