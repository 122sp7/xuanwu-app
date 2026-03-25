/**
 * Module: retrieval
 * Layer: domain/entities
 * Purpose: WikiBeta-style RAG document and query result types — the
 *          lightweight RAG interface types used by the wiki-beta UI components
 *          during the transitional decomposition period. Lives in retrieval
 *          because RAG query/answer is a retrieval-domain concern.
 */

export interface WikiBetaCitation {
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

export interface WikiBetaRagQueryResult {
  answer: string;
  citations: WikiBetaCitation[];
  cache: "hit" | "miss";
  vectorHits: number;
  searchHits: number;
  accountScope: string;
  workspaceScope?: string;
  taxonomyFilters?: string[];
  maxAgeDays?: number;
  requireReady?: boolean;
}

export interface WikiBetaParsedDocument {
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

export interface WikiBetaReindexInput {
  accountId: string;
  docId: string;
  jsonGcsUri: string;
  sourceGcsUri: string;
  filename: string;
  pageCount: number;
}
