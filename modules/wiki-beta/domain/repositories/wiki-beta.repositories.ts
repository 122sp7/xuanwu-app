import type {
  WikiBetaParsedDocument,
  WikiBetaRagQueryResult,
  WikiBetaReindexInput,
  WikiBetaWorkspaceRef,
} from "../entities/wiki-beta.types";
import type { WikiBetaPage as WikiBetaPageEntity } from "../entities/wiki-beta-page.types";

export interface WikiBetaKnowledgeRepository {
  runRagQuery(query: string, accountId: string, topK: number): Promise<WikiBetaRagQueryResult>;
  reindexDocument(input: WikiBetaReindexInput): Promise<void>;
  listParsedDocuments(accountId: string, limitCount: number): Promise<WikiBetaParsedDocument[]>;
}

export interface WikiBetaWorkspaceRepository {
  listByAccountId(accountId: string): Promise<WikiBetaWorkspaceRef[]>;
}

export interface WikiBetaPageRepository {
  listByAccountId(accountId: string): Promise<WikiBetaPageEntity[]>;
  findById(accountId: string, pageId: string): Promise<WikiBetaPageEntity | null>;
  create(page: WikiBetaPageEntity): Promise<void>;
  update(page: WikiBetaPageEntity): Promise<void>;
}