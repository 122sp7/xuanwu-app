import type { GenerationCitation } from "../entities/generation.entities";
import type { RagRetrievedChunk } from "../entities/retrieval.entities";

export class RagCitationBuilder {
  /**
   * Derive citations from the chunks used for generation.
   * Citations are taken directly from input chunks to avoid model hallucination.
   */
  buildCitations(chunks: readonly RagRetrievedChunk[]): GenerationCitation[] {
    return chunks.map((chunk) => ({
      docId: chunk.docId,
      chunkIndex: chunk.chunkIndex,
      ...(chunk.page !== undefined ? { page: chunk.page } : {}),
      reason: `Retrieved from ${chunk.taxonomy} context with relevance score ${chunk.score.toFixed(2)}.`,
    }));
  }
}
