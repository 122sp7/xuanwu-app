/**
 * Module: search
 * Layer: domain/repositories
 * Purpose: Repository port for Wiki RAG content operations (query + reindex).
 */

import type {
  WikiParsedDocument,
  WikiRagQueryResult,
  WikiReindexInput,
} from "../entities/WikiRagTypes";

export interface WikiContentRepository {
  runRagQuery(
    query: string,
    accountId: string,
    workspaceId: string,
    topK: number,
    options?: {
      taxonomyFilters?: string[];
      maxAgeDays?: number;
      requireReady?: boolean;
    },
  ): Promise<WikiRagQueryResult>;
  reindexDocument(input: WikiReindexInput): Promise<void>;
  listParsedDocuments(accountId: string, limitCount: number): Promise<WikiParsedDocument[]>;
}
