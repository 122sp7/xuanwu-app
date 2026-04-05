/**
 * Module: search
 * Layer: application/use-cases
 * Purpose: Wiki-style RAG use-cases — run query, reindex document, list documents.
 *          Thin delegation to the FirebaseWikiContentRepository, kept for
 *          backward compatibility during transitional decomposition.
 */

import type { WikiContentRepository } from "../../domain/repositories/WikiContentRepository";
import type {
  WikiParsedDocument,
  WikiRagQueryResult,
  WikiReindexInput,
} from "../../domain/entities/WikiRagTypes";

export async function runWikiRagQuery(
  query: string,
  accountId: string,
  workspaceId: string,
  topK = 4,
  options: {
    taxonomyFilters?: string[];
    maxAgeDays?: number;
    requireReady?: boolean;
  } = {},
  repository: WikiContentRepository,
): Promise<WikiRagQueryResult> {
  return repository.runRagQuery(query, accountId, workspaceId, topK, options);
}

export async function reindexWikiDocument(
  input: WikiReindexInput,
  repository: WikiContentRepository,
): Promise<void> {
  await repository.reindexDocument(input);
}

export async function listWikiParsedDocuments(
  accountId: string,
  limitCount = 20,
  repository: WikiContentRepository,
): Promise<WikiParsedDocument[]> {
  return repository.listParsedDocuments(accountId, limitCount);
}
