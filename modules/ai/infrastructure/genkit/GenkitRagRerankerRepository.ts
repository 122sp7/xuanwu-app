/**
 * LLM-based reranker using Genkit (Layer 12 — ADR-004 §4).
 *
 * This adapter asks the configured Genkit LLM to score each chunk's relevance
 * to the user query on a 0-10 scale, then returns the top-N results sorted by
 * that score.  When the LLM call fails for any reason the adapter degrades
 * gracefully by returning the original chunks truncated to topN (no-op
 * reranking), so Layer 12 never blocks the RAG pipeline.
 */

import type { RagRetrievedChunk } from "../../domain/entities/RagQuery";
import type {
  RagRerankerRepository,
  RerankInput,
} from "../../domain/repositories/RagRerankerRepository";
import { aiClient } from "./client";

/** Maximum characters of chunk text included in the rerank prompt per chunk. */
const MAX_CHUNK_PREVIEW = 600;

function buildRerankPrompt(userQuery: string, chunks: readonly RagRetrievedChunk[]): string {
  const chunkEntries = chunks
    .map(
      (chunk, index) =>
        `[${index}] (docId=${chunk.docId}, chunkIndex=${chunk.chunkIndex})\n${chunk.text.slice(0, MAX_CHUNK_PREVIEW)}`,
    )
    .join("\n\n");

  return [
    `You are a relevance assessor. Given the user query and a list of text chunks, score each chunk's relevance to the query on a scale of 0 to 10 (10 = highly relevant).`,
    ``,
    `User query: "${userQuery}"`,
    ``,
    `Chunks:`,
    chunkEntries,
    ``,
    `Respond ONLY with a JSON array of objects, one per chunk, in the same order as the input:`,
    `[{"index": 0, "score": <number>}, {"index": 1, "score": <number>}, ...]`,
    `Do not include any other text.`,
  ].join("\n");
}

function parseScores(text: string, chunkCount: number): number[] | null {
  try {
    // Strip markdown code fences if present
    const cleaned = text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed: unknown = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) {
      return null;
    }

    const scores = new Array<number>(chunkCount).fill(0);

    for (const entry of parsed) {
      if (
        typeof entry === "object" &&
        entry !== null &&
        "index" in entry &&
        "score" in entry &&
        typeof (entry as { index: number }).index === "number" &&
        typeof (entry as { score: number }).score === "number"
      ) {
        const idx = (entry as { index: number }).index;
        const score = (entry as { score: number }).score;
        if (idx >= 0 && idx < chunkCount) {
          scores[idx] = Math.max(0, Math.min(10, score));
        }
      }
    }

    return scores;
  } catch {
    return null;
  }
}

export class GenkitRagRerankerRepository implements RagRerankerRepository {
  async rerank(input: RerankInput): Promise<readonly RagRetrievedChunk[]> {
    const { userQuery, chunks, topN } = input;

    if (chunks.length === 0) {
      return [];
    }

    // If we already have fewer or equal chunks than topN, skip the LLM call.
    if (chunks.length <= topN) {
      return chunks;
    }

    try {
      const response = await aiClient.generate({
        prompt: buildRerankPrompt(userQuery, chunks),
        system:
          "You are a relevance scoring engine. Output only valid JSON. Do not explain or annotate.",
      });

      const scores = parseScores(response.text, chunks.length);

      if (!scores) {
        // Graceful degradation: return original order truncated to topN.
        return chunks.slice(0, topN);
      }

      // Pair each chunk with its LLM-assigned score and sort descending.
      const reranked = chunks
        .map((chunk, index) => ({
          ...chunk,
          score: scores[index] / 10, // Normalize 0-10 to 0-1
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topN);

      return reranked;
    } catch {
      // Graceful degradation: Layer 12 must not block the pipeline.
      return chunks.slice(0, topN);
    }
  }
}
