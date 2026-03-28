/**
 * Module: retrieval
 * Layer: domain/entities
 * Purpose: Wiki-style RAG document and query result types — the
 *          lightweight RAG interface types used by the wiki UI components
 *          during the transitional decomposition period. Lives in retrieval
 *          because RAG query/answer is a retrieval-domain concern.
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
  answer: string;
  citations: WikiCitation[];
  cache: "hit" | "miss";
  vectorHits: number;
  searchHits: number;
  accountScope: string;
  workspaceScope?: string;
  taxonomyFilters?: string[];
  maxAgeDays?: number;
  requireReady?: boolean;
}

export interface WikiParsedDocument {
  id: string;
  filename: string;
  workspaceId: string;
  sourceGcsUri: string;
  jsonGcsUri: string;
  pageCount: number;
  status: string;
  ragStatus: string;
  uploadedAt: Date | null;
}

export interface WikiReindexInput {
  accountId: string;
  docId: string;
  jsonGcsUri: string;
  sourceGcsUri: string;
  filename: string;
  pageCount: number;
}
