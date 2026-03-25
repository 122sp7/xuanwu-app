/**
 * Module: retrieval
 * Layer: application/use-cases
 * Purpose: WikiBeta-style RAG use-cases — run query, reindex document, list documents.
 *          Thin delegation to the FirebaseWikiBetaContentRepository, kept for
 *          backward compatibility during transitional decomposition.
 */

import type { WikiBetaContentRepository } from "../../domain/repositories/WikiBetaContentRepository";
import type {
  WikiBetaParsedDocument,
  WikiBetaRagQueryResult,
  WikiBetaReindexInput,
} from "../../domain/entities/WikiBetaRagTypes";
import { FirebaseWikiBetaContentRepository } from "../../infrastructure/firebase/FirebaseWikiBetaContentRepository";

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
