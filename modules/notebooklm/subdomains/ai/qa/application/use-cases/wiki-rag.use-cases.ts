/**
 * Module: notebooklm/subdomains/ai/qa
 * Layer: application/use-cases
 * Purpose: Wiki-style RAG use-cases — thin delegation to IWikiContentRepository.
 *
 * Functions are imported and re-exported by the qa public boundary for
 * use by callers via notebooklm/api.
 */

import type { IWikiContentRepository, WikiParsedDocument, WikiRagQueryResult, WikiReindexInput } from "../../../grounding/domain/repositories/IWikiContentRepository";

export type { WikiParsedDocument, WikiRagQueryResult, WikiReindexInput };
export type { WikiCitation } from "../../../grounding/domain/repositories/IWikiContentRepository";

export async function runWikiRagQuery(
  query: string,
  accountId: string,
  workspaceId: string,
  topK: number,
  options: {
    taxonomyFilters?: string[];
    maxAgeDays?: number;
    requireReady?: boolean;
  } = {},
  repository: IWikiContentRepository,
): Promise<WikiRagQueryResult> {
  return repository.runRagQuery(query, accountId, workspaceId, topK, options);
}

export async function reindexWikiDocument(
  input: WikiReindexInput,
  repository: IWikiContentRepository,
): Promise<void> {
  await repository.reindexDocument(input);
}

export async function listWikiParsedDocuments(
  accountId: string,
  limitCount: number,
  repository: IWikiContentRepository,
): Promise<WikiParsedDocument[]> {
  return repository.listParsedDocuments(accountId, limitCount);
}
