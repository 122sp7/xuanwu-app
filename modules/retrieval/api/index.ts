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

export type {
  AnswerRagQueryInput,
  AnswerRagQueryOutput,
  AnswerRagQueryResult,
  RagCitation,
  RagRetrievedChunk,
  RagRetrievalSummary,
  RagStreamEvent,
} from "../domain/entities/RagQuery";

export type {
  RagRetrievalRepository,
  RetrieveRagChunksInput,
} from "../domain/repositories/RagRetrievalRepository";

export type {
  GenerateRagAnswerInput,
  GenerateRagAnswerOutput,
  GenerateRagAnswerResult,
  RagGenerationRepository,
} from "../domain/repositories/RagGenerationRepository";

export { AnswerRagQueryUseCase } from "../application/use-cases/answer-rag-query.use-case";
export { FirebaseRagRetrievalRepository } from "../infrastructure/firebase/FirebaseRagRetrievalRepository";
export { GenkitRagGenerationRepository } from "../infrastructure/genkit/GenkitRagGenerationRepository";

// ── WikiBeta RAG types (transitional — owned by retrieval domain) ─────────────
export type {
  WikiBetaCitation,
  WikiBetaParsedDocument,
  WikiBetaRagQueryResult,
  WikiBetaReindexInput,
} from "../domain/entities/WikiBetaRagTypes";

// ── WikiBeta RAG use-cases (transitional) ─────────────────────────────────────
export {
  runWikiBetaRagQuery,
  reindexWikiBetaDocument,
  listWikiBetaParsedDocuments,
} from "../application/use-cases/wiki-beta-rag.use-case";

// ── UI components ─────────────────────────────────────────────────────────────
export { RagQueryView } from "../interfaces/components/RagQueryView";
export { RagView } from "../interfaces/components/RagView";
