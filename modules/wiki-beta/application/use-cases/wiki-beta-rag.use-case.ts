import type {
  WikiBetaContentRepository,
} from "../../domain/repositories/wiki-beta.repositories";
import type {
  WikiBetaParsedDocument,
  WikiBetaRagQueryResult,
  WikiBetaReindexInput,
} from "../../domain/entities/wiki-beta.types";
import { FirebaseWikiBetaContentRepository } from "../../infrastructure";

const defaultContentRepository: WikiBetaContentRepository = new FirebaseWikiBetaContentRepository();

export async function runWikiBetaRagQuery(
  query: string,
  accountId: string,
  workspaceId: string,
  topK = 4,
  options: {
    taxonomyFilters?: string[];
    maxAgeDays?: number;
    requireReady?: boolean;
  } = {},
  repository: WikiBetaContentRepository = defaultContentRepository,
): Promise<WikiBetaRagQueryResult> {
  return repository.runRagQuery(query, accountId, workspaceId, topK, options);
}

export async function reindexWikiBetaDocument(
  input: WikiBetaReindexInput,
  repository: WikiBetaContentRepository = defaultContentRepository,
): Promise<void> {
  await repository.reindexDocument(input);
}

export async function listWikiBetaParsedDocuments(
  accountId: string,
  limitCount = 20,
  repository: WikiBetaContentRepository = defaultContentRepository,
): Promise<WikiBetaParsedDocument[]> {
  return repository.listParsedDocuments(accountId, limitCount);
}