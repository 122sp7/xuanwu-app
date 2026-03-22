import type {
  WikiBetaParsedDocument,
  WikiBetaRagQueryResult,
  WikiBetaReindexInput,
  WikiBetaWorkspaceRef,
} from "../entities/wiki-beta.types";
import type { WikiBetaPage } from "../entities/wiki-beta-page.types";
import type {
  WikiBetaLibrary,
  WikiBetaLibraryField,
  WikiBetaLibraryRow,
} from "../entities/wiki-beta-library.types";

export interface WikiBetaKnowledgeRepository {
  runRagQuery(query: string, accountId: string, topK: number): Promise<WikiBetaRagQueryResult>;
  reindexDocument(input: WikiBetaReindexInput): Promise<void>;
  listParsedDocuments(accountId: string, limitCount: number): Promise<WikiBetaParsedDocument[]>;
}

export interface WikiBetaWorkspaceRepository {
  listByAccountId(accountId: string): Promise<WikiBetaWorkspaceRef[]>;
}

export interface WikiBetaPageRepository {
  listByAccountId(accountId: string): Promise<WikiBetaPage[]>;
  findById(accountId: string, pageId: string): Promise<WikiBetaPage | null>;
  create(page: WikiBetaPage): Promise<void>;
  update(page: WikiBetaPage): Promise<void>;
}

export interface WikiBetaLibraryRepository {
  listByAccountId(accountId: string): Promise<WikiBetaLibrary[]>;
  findById(accountId: string, libraryId: string): Promise<WikiBetaLibrary | null>;
  create(library: WikiBetaLibrary): Promise<void>;
  createField(accountId: string, field: WikiBetaLibraryField): Promise<void>;
  listFields(accountId: string, libraryId: string): Promise<WikiBetaLibraryField[]>;
  createRow(accountId: string, row: WikiBetaLibraryRow): Promise<void>;
  listRows(accountId: string, libraryId: string): Promise<WikiBetaLibraryRow[]>;
}