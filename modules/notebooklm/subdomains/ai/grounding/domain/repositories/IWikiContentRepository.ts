/**
 * Module: notebooklm/subdomains/ai/grounding
 * Layer: domain/repositories
 * Purpose: IWikiContentRepository — output port for wiki-style RAG document
 *          operations (run query, reindex, list parsed documents).
 *
 * Design notes:
 * - "Wiki" here refers to the knowledge-base document corpus used for RAG.
 * - Firebase Functions back-end implements this port; the domain remains clean.
 */

export interface WikiCitation {
  provider?: "vector" | "search";
  chunk_id?: string;
  doc_id?: string;
  filename?: string;
  json_gcs_uri?: string;
  search_id?: string;
  score?: number;
  text?: string;
  account_id?: string;
  workspace_id?: string;
  taxonomy?: string;
  processing_status?: string;
  indexed_at?: string;
}

export interface WikiRagQueryResult {
  readonly answer: string;
  readonly citations: readonly WikiCitation[];
  readonly cache: "hit" | "miss";
  readonly vectorHits: number;
  readonly searchHits: number;
  readonly accountScope: string;
  readonly workspaceScope?: string;
  readonly taxonomyFilters?: string[];
  readonly maxAgeDays?: number;
  readonly requireReady?: boolean;
}

export interface WikiParsedDocument {
  readonly id: string;
  readonly filename: string;
  readonly workspaceId: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
  readonly status: string;
  readonly ragStatus: string;
  readonly uploadedAt: Date | null;
}

export interface WikiReindexInput {
  readonly accountId: string;
  readonly docId: string;
  readonly jsonGcsUri: string;
  readonly sourceGcsUri: string;
  readonly filename: string;
  readonly pageCount: number;
}

export interface IWikiContentRepository {
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
