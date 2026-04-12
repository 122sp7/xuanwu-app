import type { RagRetrievedChunk } from "../entities/retrieval.entities";

const CJK_REGEX = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/u;

export class RagScoringService {
  /**
   * Tokenize text into searchable tokens (CJK-aware).
   * CJK characters are treated as individual tokens; Latin words split by whitespace/punctuation.
   */
  tokenize(text: string): readonly string[] {
    const tokens: string[] = [];
    const normalized = text.toLowerCase();
    let currentWord = "";

    for (const char of normalized) {
      if (CJK_REGEX.test(char)) {
        if (currentWord) {
          tokens.push(currentWord);
          currentWord = "";
        }
        tokens.push(char);
      } else if (/\s|[^\w]/u.test(char)) {
        if (currentWord) {
          tokens.push(currentWord);
          currentWord = "";
        }
      } else {
        currentWord += char;
      }
    }

    if (currentWord) {
      tokens.push(currentWord);
    }

    return tokens.filter((token) => token.length > 0);
  }

  /**
   * Compute token-overlap score between query tokens and chunk text.
   * Returns score in [0, 1] = matchedTokens / queryTokens.length
   */
  computeTokenOverlapScore(queryTokens: readonly string[], chunkText: string): number {
    if (queryTokens.length === 0) return 0;

    const chunkTokenSet = new Set(this.tokenize(chunkText));
    if (chunkTokenSet.size === 0) return 0;

    const matchedCount = queryTokens.filter((token) => chunkTokenSet.has(token)).length;
    return matchedCount / queryTokens.length;
  }

  /**
   * Rank chunks by relevance score, returning top-K.
   */
  rankChunks(
    chunks: readonly RagRetrievedChunk[],
    queryTokens: readonly string[],
    topK: number,
  ): RagRetrievedChunk[] {
    if (topK <= 0 || !Number.isFinite(topK)) return [];
    const limit = Math.trunc(topK);
    if (limit <= 0) return [];

    return chunks
      .map((chunk) => ({
        ...chunk,
        score: this.computeTokenOverlapScore(queryTokens, chunk.text),
      }))
      .filter((chunk) => chunk.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, limit);
  }
}
