/**
 * Public API boundary for the ai subdomain.
 * Cross-module consumers must import through this entry point.
 */

// --- Domain types (grounding) ------------------------------------------------

export type { RagRetrievedChunk, RagCitation, RagRetrievalSummary } from "../domain/entities/retrieval.entities";
export type { IVectorStore, VectorDocument, VectorSearchResult } from "../domain/ports/IVectorStore";
export type { IRagRetrievalRepository, RetrieveChunksInput } from "../domain/repositories/IRagRetrievalRepository";
export type {
  IKnowledgeContentRepository,
  KnowledgeCitation,
  KnowledgeParsedDocument,
  KnowledgeRagQueryResult,
  KnowledgeReindexInput,
} from "../domain/repositories/IKnowledgeContentRepository";

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

import { FirebaseKnowledgeContentAdapter } from "../infrastructure/firebase/FirebaseKnowledgeContentAdapter";
import type { KnowledgeParsedDocument, KnowledgeRagQueryResult, KnowledgeReindexInput } from "../domain/repositories/IKnowledgeContentRepository";

let _knowledgeContentRepository: FirebaseKnowledgeContentAdapter | undefined;

function getKnowledgeContentRepository(): FirebaseKnowledgeContentAdapter {
  if (!_knowledgeContentRepository) {
    _knowledgeContentRepository = new FirebaseKnowledgeContentAdapter();
  }
  return _knowledgeContentRepository;
}

export function runKnowledgeRagQuery(
  query: string,
  accountId: string,
  workspaceId: string,
  topK = 4,
  options: { taxonomyFilters?: string[]; maxAgeDays?: number; requireReady?: boolean } = {},
): Promise<KnowledgeRagQueryResult> {
  return getKnowledgeContentRepository().runRagQuery(query, accountId, workspaceId, topK, options);
}

export function reindexKnowledgeDocument(input: KnowledgeReindexInput): Promise<void> {
  return getKnowledgeContentRepository().reindexDocument(input);
}

export function listKnowledgeParsedDocuments(accountId: string, limitCount = 20): Promise<KnowledgeParsedDocument[]> {
  return getKnowledgeContentRepository().listParsedDocuments(accountId, limitCount);
}

// --- Infrastructure adapters (client-safe, for composition roots) ------------

export { FirebaseRagRetrievalAdapter } from "../infrastructure/firebase/FirebaseRagRetrievalAdapter";
export { FirebaseKnowledgeContentAdapter } from "../infrastructure/firebase/FirebaseKnowledgeContentAdapter";
export { FirebaseRagQueryFeedbackAdapter } from "../infrastructure/firebase/FirebaseRagQueryFeedbackAdapter";

// --- UI components -----------------------------------------------------------

export { RagQueryView } from "../interfaces/components/RagQueryView";
