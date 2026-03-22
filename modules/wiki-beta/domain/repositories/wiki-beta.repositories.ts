import type {
  WikiBetaParsedDocument,
  WikiBetaRagQueryResult,
  WikiBetaReindexInput,
  WikiBetaWorkspaceRef,
} from "../entities/wiki-beta.types";

export interface WikiBetaKnowledgeRepository {
  runRagQuery(query: string, accountId: string, topK: number): Promise<WikiBetaRagQueryResult>;
  reindexDocument(input: WikiBetaReindexInput): Promise<void>;
  listParsedDocuments(accountId: string, limitCount: number): Promise<WikiBetaParsedDocument[]>;
}

export interface WikiBetaWorkspaceRepository {
  listByAccountId(accountId: string): Promise<WikiBetaWorkspaceRef[]>;
}