/**
 * synthesis subdomain — server-only API.
 *
 * Factory functions and infrastructure adapters that depend on server-only
 * packages. Must only be imported in Server Actions, route handlers, or
 * server-side infrastructure.
 */

import { FirebaseRagRetrievalAdapter } from "../../../infrastructure/synthesis/firebase/FirebaseRagRetrievalAdapter";
import { FirebaseKnowledgeContentAdapter } from "../../../infrastructure/synthesis/firebase/FirebaseKnowledgeContentAdapter";
import { PlatformRagGenerationAdapter } from "../../../infrastructure/synthesis/platform/PlatformRagGenerationAdapter";
import { AnswerRagQueryUseCase } from "../application/use-cases/answer-rag-query.use-case";
import type {
  KnowledgeParsedDocument,
  KnowledgeRagQueryResult,
  KnowledgeReindexInput,
} from "../domain/repositories/IKnowledgeContentRepository";

export { PlatformRagGenerationAdapter } from "../../../infrastructure/synthesis/platform/PlatformRagGenerationAdapter";

let knowledgeContentRepository: FirebaseKnowledgeContentAdapter | undefined;

function getKnowledgeContentRepository(): FirebaseKnowledgeContentAdapter {
  if (!knowledgeContentRepository) {
    knowledgeContentRepository = new FirebaseKnowledgeContentAdapter();
  }
  return knowledgeContentRepository;
}

export function createAnswerRagQueryUseCase(): AnswerRagQueryUseCase {
  return new AnswerRagQueryUseCase(
    new FirebaseRagRetrievalAdapter(),
    new PlatformRagGenerationAdapter(),
  );
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
