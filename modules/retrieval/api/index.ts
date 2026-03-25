/**
 * modules/retrieval — public API barrel.
 *
 * Layer 3: RAG Query — Dense + Sparse + Rerank + Citation.
 * Other modules MUST import from here only.
 */

export type {
  IVectorStore,
  VectorDocument,
  VectorSearchResult,
} from "../domain/ports/vector-store";
