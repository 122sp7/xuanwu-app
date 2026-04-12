import type { RagRetrievedChunk } from "../entities/retrieval.entities";
import type { RagPrompt } from "../value-objects/RagPrompt";

export class RagPromptBuilder {
  /**
   * Format a single chunk for inclusion in the generation prompt.
   */
  formatChunkForPrompt(chunk: RagRetrievedChunk): string {
    const parts = [`[doc:${chunk.docId} chunk:${chunk.chunkIndex}`];
    if (chunk.page !== undefined) parts.push(` page:${chunk.page}`);
    if (chunk.taxonomy) parts.push(` taxonomy:${chunk.taxonomy}`);
    parts.push(`]\n${chunk.text}`);
    return parts.join("");
  }

  /**
   * Build the complete RAG generation prompt from retrieved chunks.
   */
  buildGenerationPrompt(userQuery: string, chunks: readonly RagRetrievedChunk[]): RagPrompt {
    const systemInstruction =
      "You are the Xuanwu RAG orchestration layer. Answer the user's question based ONLY on the provided context. " +
      "Cite sources using [doc:X chunk:Y] format. If the context is insufficient, say so honestly.";

    const formattedContext = chunks.map((chunk) => this.formatChunkForPrompt(chunk)).join("\n\n");

    return { systemInstruction, formattedContext, userQuery };
  }
}
