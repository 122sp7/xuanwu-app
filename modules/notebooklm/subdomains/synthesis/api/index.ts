/**
 * Public API boundary for the synthesis subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * This subdomain owns the complete RAG pipeline:
 *   retrieval → grounding → synthesis → evaluation
 *
 * Migrated from: ai subdomain (AGENTS.md violation fix)
 * Absorbed from: retrieval, grounding, evaluation stubs (Occam consolidation)
 */

// ── Canonical domain types (retrieval facet) ─────────────────────────────────
export type {
  RetrievedChunk,
  RetrievalSummary,
} from "../domain/entities/RetrievedChunk";

export type {
  RetrieveChunksInput,
  ChunkRetrievalPort,
} from "../domain/ports/ChunkRetrievalPort";

export type {
  RetrievalCompletedEvent,
  RetrievalFailedEvent,
} from "../domain/events/RetrievalEvents";

// ── Canonical domain types (grounding facet) ─────────────────────────────────
export type {
  Citation,
  GroundingEvidence,
} from "../domain/entities/GroundingEvidence";

export type {
  CitationBuilderInput,
  CitationBuilder,
} from "../domain/services/CitationBuilder";

export type {
  GroundingCompletedEvent,
} from "../domain/events/GroundingEvents";

// ── Canonical domain types (synthesis facet) ─────────────────────────────────
export type {
  GenerationCitation,
  GenerateAnswerInput,
  GenerateAnswerOutput,
  GenerateAnswerResult,
} from "../domain/entities/SynthesisResult";

export type {
  GenerationPort,
} from "../domain/ports/GenerationPort";

export type {
  SynthesisCompletedEvent,
  SynthesisFailedEvent,
} from "../domain/events/SynthesisEvents";

// ── Canonical domain types (evaluation facet) ────────────────────────────────
export type {
  FeedbackRating,
  QualityFeedback,
  SubmitFeedbackInput,
} from "../domain/entities/QualityFeedback";

export type {
  FeedbackPort,
} from "../domain/ports/FeedbackPort";

export type {
  FeedbackSubmittedEvent,
} from "../domain/events/EvaluationEvents";

// ── Active pipeline types (used by use cases & infrastructure) ───────────────

export type { RagRetrievedChunk, RagCitation, RagRetrievalSummary } from "../domain/entities/retrieval.entities";
export type { VectorStore, VectorDocument, VectorSearchResult } from "../domain/ports/VectorStore";
export type { RagRetrievalRepository, RetrieveChunksInput as LegacyRetrieveChunksInput } from "../domain/repositories/RagRetrievalRepository";
export type {
  KnowledgeContentRepository,
  KnowledgeCitation,
  KnowledgeParsedDocument,
  KnowledgeRagQueryResult,
  KnowledgeReindexInput,
} from "../domain/repositories/KnowledgeContentRepository";

export type { AnswerRagQueryInput, AnswerRagQueryOutput, AnswerRagQueryResult, RagStreamEvent } from "../domain/entities/rag-query.entities";
export type { RagQueryFeedback, RagFeedbackRating, SubmitRagQueryFeedbackInput } from "../domain/entities/rag-feedback.entities";
export type { RagQueryFeedbackRepository } from "../domain/repositories/RagQueryFeedbackRepository";

export type {
  GenerateRagAnswerInput,
  GenerateRagAnswerOutput,
  GenerateRagAnswerResult,
  GenerationCitation as LegacyGenerationCitation,
} from "../domain/entities/generation.entities";
export type { RagGenerationRepository } from "../domain/repositories/RagGenerationRepository";

// ── Use-case classes (for DI composition within synthesis subdomain) ──────────

export { AnswerRagQueryUseCase } from "../application/use-cases/answer-rag-query.use-case";
export { SubmitRagQueryFeedbackUseCase } from "../application/use-cases/submit-rag-feedback.use-case";

// UI components are exported from ./ui to keep this barrel semantic-only.
