/**
 * modules/search — public API barrel.
 *
 * Layer 3: RAG Query — Dense + Sparse + Rerank + Citation.
 * Other modules MUST import from here only.
 */

export type {
  IVectorStore,
  VectorDocument,
  VectorSearchResult,
} from "../domain/ports/vector-store";

export type {
  AnswerRagQueryInput,
  AnswerRagQueryOutput,
  AnswerRagQueryResult,
  RagCitation,
  RagRetrievedChunk,
  RagRetrievalSummary,
  RagStreamEvent,
} from "../domain/entities/RagQuery";

export type {
  RagRetrievalRepository,
  RetrieveRagChunksInput,
} from "../domain/repositories/RagRetrievalRepository";

export type {
  GenerateRagAnswerInput,
  GenerateRagAnswerOutput,
  GenerateRagAnswerResult,
  RagGenerationRepository,
} from "../domain/repositories/RagGenerationRepository";

// ── RAG Feedback Loop ─────────────────────────────────────────────────────────
export type {
  RagQueryFeedback,
  RagFeedbackRating,
  SubmitRagQueryFeedbackInput,
} from "../domain/entities/RagQueryFeedback";

export type { RagQueryFeedbackRepository } from "../domain/repositories/RagQueryFeedbackRepository";

export { SubmitRagQueryFeedbackUseCase } from "../application/use-cases/submit-rag-feedback.use-case";

export { FirebaseRagQueryFeedbackRepository } from "../infrastructure/firebase/FirebaseRagQueryFeedbackRepository";

// ── Wiki RAG types (owned by search domain) ────────────────────────────────
export type {
  WikiCitation,
  WikiParsedDocument,
  WikiRagQueryResult,
  WikiReindexInput,
} from "../domain/entities/WikiRagTypes";

// ── Wiki RAG use-cases ─────────────────────────────────────────────────────
import { FirebaseWikiContentRepository } from "../infrastructure/firebase/FirebaseWikiContentRepository";
import {
  runWikiRagQuery as _runWikiRagQuery,
  reindexWikiDocument as _reindexWikiDocument,
  listWikiParsedDocuments as _listWikiParsedDocuments,
} from "../application/use-cases/wiki-rag.use-case";
import type {
  WikiParsedDocument,
  WikiRagQueryResult,
  WikiReindexInput,
} from "../domain/entities/WikiRagTypes";

const _defaultContentRepository = new FirebaseWikiContentRepository();

export function runWikiRagQuery(
  query: string,
  accountId: string,
  workspaceId: string,
  topK = 4,
  options: { taxonomyFilters?: string[]; maxAgeDays?: number; requireReady?: boolean } = {},
): Promise<WikiRagQueryResult> {
  return _runWikiRagQuery(query, accountId, workspaceId, topK, options, _defaultContentRepository);
}

export function reindexWikiDocument(input: WikiReindexInput): Promise<void> {
  return _reindexWikiDocument(input, _defaultContentRepository);
}

export function listWikiParsedDocuments(accountId: string, limitCount = 20): Promise<WikiParsedDocument[]> {
  return _listWikiParsedDocuments(accountId, limitCount, _defaultContentRepository);
}
