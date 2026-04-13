/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/repositories
 * Purpose: KnowledgeContentRepository — output port for knowledge corpus RAG
 *          operations (run query, reindex, list parsed documents).
 *
 * Design notes:
 * - Knowledge content refers to the knowledge artifact corpus used for RAG retrieval.
 * - Firebase Functions back-end implements this port; the domain remains clean.
 */

export interface KnowledgeCitation {
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

export interface KnowledgeRagQueryResult {
  readonly answer: string;
  readonly citations: readonly KnowledgeCitation[];
  readonly cache: "hit" | "miss";
  readonly vectorHits: number;
  readonly searchHits: number;
  readonly accountScope: string;
  readonly workspaceScope?: string;
  readonly taxonomyFilters?: string[];
  readonly maxAgeDays?: number;
  readonly requireReady?: boolean;
}

export interface KnowledgeParsedDocument {
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

export interface KnowledgeReindexInput {
  readonly accountId: string;
  readonly docId: string;
  readonly jsonGcsUri: string;
  readonly sourceGcsUri: string;
  readonly filename: string;
  readonly pageCount: number;
}

export interface KnowledgeContentRepository {
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
  ): Promise<KnowledgeRagQueryResult>;
  reindexDocument(input: KnowledgeReindexInput): Promise<void>;
  listParsedDocuments(accountId: string, limitCount: number): Promise<KnowledgeParsedDocument[]>;
}
