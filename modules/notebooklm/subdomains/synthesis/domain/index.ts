// ── Canonical domain types ────────────────────────────────────────────────────
export type { GenerationCitation, GenerateAnswerInput, GenerateAnswerOutput, GenerateAnswerResult } from "./entities/SynthesisResult";
export type { RetrievedChunk, RetrievalSummary } from "./entities/RetrievedChunk";
export type { Citation, GroundingEvidence } from "./entities/GroundingEvidence";
export type { FeedbackRating, QualityFeedback, SubmitFeedbackInput } from "./entities/QualityFeedback";

// ── Active pipeline types (legacy naming, used by use cases & adapters) ──────
export * from "./entities/generation.entities";
export * from "./entities/rag-feedback.entities";
export * from "./entities/rag-query.entities";
export * from "./entities/retrieval.entities";

// ── Events ───────────────────────────────────────────────────────────────────
export type { SynthesisCompletedEvent, SynthesisFailedEvent } from "./events/SynthesisEvents";
export type { RetrievalCompletedEvent, RetrievalFailedEvent } from "./events/RetrievalEvents";
export type { GroundingCompletedEvent } from "./events/GroundingEvents";
export type { FeedbackSubmittedEvent } from "./events/EvaluationEvents";
export * from "./events/SynthesisPipelineDomainEvent";

// ── Ports ────────────────────────────────────────────────────────────────────
export type { GenerationPort } from "./ports/GenerationPort";
export type { ChunkRetrievalPort, RetrieveChunksInput } from "./ports/ChunkRetrievalPort";
export type { FeedbackPort } from "./ports/FeedbackPort";
export type { VectorStore, VectorDocument, VectorSearchResult } from "./ports/VectorStore";

// ── Repositories (output port interfaces) ────────────────────────────────────
export * from "./repositories/RagGenerationRepository";
export * from "./repositories/RagQueryFeedbackRepository";
export * from "./repositories/RagRetrievalRepository";
export * from "./repositories/KnowledgeContentRepository";

// ── Domain services ──────────────────────────────────────────────────────────
export * from "./services/RagCitationBuilder";
export * from "./services/RagPromptBuilder";
export * from "./services/RagScoringService";
export type { CitationBuilderInput, ICitationBuilder } from "./services/ICitationBuilder";

// ── Value objects ────────────────────────────────────────────────────────────
export * from "./value-objects";
