/**
 * Public API boundary for the ai subdomain.
 * Cross-module consumers must import through this entry point.
 */

// --- Domain types (grounding) ------------------------------------------------

export type { RagRetrievedChunk, RagCitation, RagRetrievalSummary } from "../domain/entities/retrieval.entities";
export type { IVectorStore, VectorDocument, VectorSearchResult } from "../domain/ports/IVectorStore";
export type { IRagRetrievalRepository, RetrieveChunksInput } from "../domain/repositories/IRagRetrievalRepository";
export type {
  IWikiContentRepository,
  WikiCitation,
  WikiParsedDocument,
  WikiRagQueryResult,
  WikiReindexInput,
} from "../domain/repositories/IWikiContentRepository";

// --- Domain types (qa) -------------------------------------------------------

export type { AnswerRagQueryInput, AnswerRagQueryOutput, AnswerRagQueryResult, RagStreamEvent } from "../domain/entities/rag-query.entities";
export type { RagQueryFeedback, RagFeedbackRating, SubmitRagQueryFeedbackInput } from "../domain/entities/rag-feedback.entities";
export type { IRagQueryFeedbackRepository } from "../domain/repositories/IRagQueryFeedbackRepository";

// --- Domain types (synthesis) ------------------------------------------------

export type {
  GenerateRagAnswerInput,
  GenerateRagAnswerOutput,
  GenerateRagAnswerResult,
  GenerationCitation,
} from "../domain/entities/generation.entities";
export type { IRagGenerationRepository } from "../domain/repositories/IRagGenerationRepository";

// --- Use-case classes (for DI composition) -----------------------------------

export { AnswerRagQueryUseCase } from "../application/use-cases/answer-rag-query.use-case";
export { SubmitRagQueryFeedbackUseCase } from "../application/use-cases/submit-rag-feedback.use-case";

// --- Wiki convenience wrappers with default repository -----------------------

import { FirebaseWikiContentAdapter } from "../infrastructure/firebase/FirebaseWikiContentAdapter";
import type { WikiParsedDocument, WikiRagQueryResult, WikiReindexInput } from "../domain/repositories/IWikiContentRepository";

let _wikiContentRepository: FirebaseWikiContentAdapter | undefined;

function getWikiContentRepository(): FirebaseWikiContentAdapter {
  if (!_wikiContentRepository) {
    _wikiContentRepository = new FirebaseWikiContentAdapter();
  }
  return _wikiContentRepository;
}

export function runWikiRagQuery(
  query: string,
  accountId: string,
  workspaceId: string,
  topK = 4,
  options: { taxonomyFilters?: string[]; maxAgeDays?: number; requireReady?: boolean } = {},
): Promise<WikiRagQueryResult> {
  return getWikiContentRepository().runRagQuery(query, accountId, workspaceId, topK, options);
}

export function reindexWikiDocument(input: WikiReindexInput): Promise<void> {
  return getWikiContentRepository().reindexDocument(input);
}

export function listWikiParsedDocuments(accountId: string, limitCount = 20): Promise<WikiParsedDocument[]> {
  return getWikiContentRepository().listParsedDocuments(accountId, limitCount);
}

// --- Infrastructure adapters (client-safe, for composition roots) ------------

export { FirebaseRagRetrievalAdapter } from "../infrastructure/firebase/FirebaseRagRetrievalAdapter";
export { FirebaseWikiContentAdapter } from "../infrastructure/firebase/FirebaseWikiContentAdapter";
export { FirebaseRagQueryFeedbackAdapter } from "../infrastructure/firebase/FirebaseRagQueryFeedbackAdapter";

// --- UI components -----------------------------------------------------------

export { RagQueryView } from "../interfaces/components/RagQueryView";
