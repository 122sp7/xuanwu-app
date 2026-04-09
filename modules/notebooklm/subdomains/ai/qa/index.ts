/**
 * Module: notebooklm/subdomains/ai/qa
 * Public boundary for the Q&A subdomain.
 *
 * Exports domain types, use-case classes, infrastructure adapters,
 * and wiki-rag convenience wrappers bound to default Firebase adapters.
 *
 * Design notes:
 * - Default repository instances are created lazily (not at import time) to
 *   avoid side effects before Firebase is initialised.
 * - Callers that need full DI (tests, Storybook) should import the use-case
 *   classes and inject their own adapters.
 */

// --- Domain types ------------------------------------------------------------

export type { AnswerRagQueryInput, AnswerRagQueryOutput, AnswerRagQueryResult, RagStreamEvent, RagCitation, RagRetrievalSummary } from "./domain/entities/rag-query.entities";
export type { RagQueryFeedback, RagFeedbackRating, SubmitRagQueryFeedbackInput } from "./domain/entities/rag-feedback.entities";
export type { IRagQueryFeedbackRepository } from "./domain/repositories/IRagQueryFeedbackRepository";

// --- Use-case classes (for DI composition) -----------------------------------

export { AnswerRagQueryUseCase } from "./application/use-cases/answer-rag-query.use-case";
export { SubmitRagQueryFeedbackUseCase } from "./application/use-cases/submit-rag-feedback.use-case";

// --- Wiki types (re-exported for consumer convenience) -----------------------

export type { WikiCitation, WikiParsedDocument, WikiRagQueryResult, WikiReindexInput } from "./application/use-cases/wiki-rag.use-cases";

// --- Wiki convenience wrappers with default repository -----------------------

import { FirebaseWikiContentAdapter } from "../grounding/infrastructure/firebase/FirebaseWikiContentAdapter";
import {
  runWikiRagQuery as _runWikiRagQuery,
  reindexWikiDocument as _reindexWikiDocument,
  listWikiParsedDocuments as _listWikiParsedDocuments,
} from "./application/use-cases/wiki-rag.use-cases";
import type { WikiParsedDocument, WikiRagQueryResult, WikiReindexInput } from "./application/use-cases/wiki-rag.use-cases";

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
  return _runWikiRagQuery(query, accountId, workspaceId, topK, options, getWikiContentRepository());
}

export function reindexWikiDocument(input: WikiReindexInput): Promise<void> {
  return _reindexWikiDocument(input, getWikiContentRepository());
}

export function listWikiParsedDocuments(accountId: string, limitCount = 20): Promise<WikiParsedDocument[]> {
  return _listWikiParsedDocuments(accountId, limitCount, getWikiContentRepository());
}

// --- Infrastructure adapters (for composition roots) ------------------------

export { FirebaseRagQueryFeedbackAdapter } from "./infrastructure/firebase/FirebaseRagQueryFeedbackAdapter";

// --- UI components -----------------------------------------------------------

export { RagQueryView } from "./interfaces/components/RagQueryView";
