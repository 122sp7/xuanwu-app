/**
 * Module: retrieval
 * Layer: domain/repositories
 * Purpose: Repository port for WikiBeta RAG content operations (query + reindex).
 */

import type {
  WikiBetaParsedDocument,
  WikiBetaRagQueryResult,
  WikiBetaReindexInput,
} from "../entities/WikiBetaRagTypes";

export interface WikiBetaContentRepository {
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
  ): Promise<WikiBetaRagQueryResult>;
  reindexDocument(input: WikiBetaReindexInput): Promise<void>;
  listParsedDocuments(accountId: string, limitCount: number): Promise<WikiBetaParsedDocument[]>;
}
