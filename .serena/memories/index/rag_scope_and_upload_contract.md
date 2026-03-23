- RAG 5D enforcement index:
  1) permission isolation
  2) freshness window
  3) provenance
  4) semantic taxonomy
  5) processing status
- Required query contract: account_id + workspace_id + optional taxonomy_filters/max_age_days/require_ready.
- Required ingestion metadata: account_id, workspace_id, taxonomy/semantic_class, processing_status=ready, indexed_at, provenance URIs.
- UI contract: wiki-beta documents/rag-query must pass workspaceId (URL first, fallback activeWorkspaceId) into WikiBetaRagTestView.
- Storage trigger contract: missing workspace_id is rejected.
- Dev-tools contract: upload and rag_reindex_document must include workspace scope.