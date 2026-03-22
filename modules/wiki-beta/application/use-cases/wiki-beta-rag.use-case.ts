import type {
  WikiBetaKnowledgeRepository,
} from "../../domain/repositories/wiki-beta.repositories";
import type {
  WikiBetaParsedDocument,
  WikiBetaRagQueryResult,
  WikiBetaReindexInput,
} from "../../domain/entities/wiki-beta.types";
import { FirebaseWikiBetaKnowledgeRepository } from "../../infrastructure";

const defaultKnowledgeRepository: WikiBetaKnowledgeRepository = new FirebaseWikiBetaKnowledgeRepository();

export async function runWikiBetaRagQuery(
  query: string,
  accountId: string,
  topK = 4,
  repository: WikiBetaKnowledgeRepository = defaultKnowledgeRepository,
): Promise<WikiBetaRagQueryResult> {
  return repository.runRagQuery(query, accountId, topK);
}

export async function reindexWikiBetaDocument(
  input: WikiBetaReindexInput,
  repository: WikiBetaKnowledgeRepository = defaultKnowledgeRepository,
): Promise<void> {
  await repository.reindexDocument(input);
}

export async function listWikiBetaParsedDocuments(
  accountId: string,
  limitCount = 20,
  repository: WikiBetaKnowledgeRepository = defaultKnowledgeRepository,
): Promise<WikiBetaParsedDocument[]> {
  return repository.listParsedDocuments(accountId, limitCount);
}