/**
 * Module: notebooklm/subdomains/grounding
 * Layer: domain/services
 * Purpose: CitationBuilder — domain service interface for constructing citations
 *          from retrieved chunks and generated answers.
 *
 * Migration source: ai/domain/services/RagCitationBuilder.ts
 */

import type { Citation } from "../entities/GroundingEvidence";

export interface CitationBuilderInput {
  readonly answer: string;
  readonly chunks: readonly {
    readonly docId: string;
    readonly chunkIndex: number;
    readonly page?: number;
    readonly text: string;
    readonly score: number;
  }[];
}

export interface CitationBuilder {
  build(input: CitationBuilderInput): readonly Citation[];
}
