/**
 * Module: notebooklm/subdomains/ai/grounding
 * Public boundary for the grounding subdomain.
 *
 * Exports: domain types and the two concrete adapters needed to compose
 * the retrieval factory at the notebooklm API layer.
 */

// Domain types
export type { RagRetrievedChunk, RagCitation, RagRetrievalSummary } from "./domain/entities/retrieval.entities";
export type { IVectorStore, VectorDocument, VectorSearchResult } from "./domain/ports/IVectorStore";
export type { IRagRetrievalRepository, RetrieveChunksInput } from "./domain/repositories/IRagRetrievalRepository";
export type {
  IWikiContentRepository,
  WikiCitation,
  WikiParsedDocument,
  WikiRagQueryResult,
  WikiReindexInput,
} from "./domain/repositories/IWikiContentRepository";

// Infrastructure adapters (server-side only)
export { FirebaseRagRetrievalAdapter } from "./infrastructure/firebase/FirebaseRagRetrievalAdapter";
export { FirebaseWikiContentAdapter } from "./infrastructure/firebase/FirebaseWikiContentAdapter";
