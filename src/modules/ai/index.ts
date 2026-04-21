/**
 * AI Module — public API surface.
 * All cross-module consumers must import from here only.
 */

// generation
export * from "./subdomains/generation/domain";
export * from "./subdomains/generation/application";

// chunk
export * from "./subdomains/chunk/domain";
export * from "./subdomains/chunk/application";
export { InMemoryChunkRepository } from "./subdomains/chunk/adapters/outbound/memory/InMemoryChunkRepository";

// embedding
export * from "./subdomains/embedding/domain";
export * from "./subdomains/embedding/application";

// retrieval
export type {
  VectorSearchResult,
  VectorSearchInput,
  VectorSearchPort,
  SemanticSearchInput,
  SemanticSearchPort,
} from "./subdomains/retrieval/domain/ports/RetrievalPorts";
export { SemanticSearchUseCase } from "./subdomains/retrieval/application/use-cases/RetrievalUseCases";

// context
export type { ContextSessionSnapshot, ContextMessage, ContextRole, ContextSessionId } from "./subdomains/context/domain/entities/ContextSession";
export { ContextSession } from "./subdomains/context/domain/entities/ContextSession";
export type { ContextSessionRepository } from "./subdomains/context/domain/repositories/ContextSessionRepository";
export { CreateContextSessionUseCase, AddContextMessageUseCase } from "./subdomains/context/application/use-cases/ContextUseCases";

// safety (content safety policy)
export * from "./subdomains/safety/domain";
export * from "./subdomains/safety/application";

// pipeline
export type {
  PromptTemplate,
  PromptTemplateRepository,
  RenderedPrompt,
  PromptRenderPort,
  AiOrchestrationInput,
  AiOrchestrationResult,
  AiOrchestrationPort,
} from "./subdomains/pipeline/domain";

// prompt registry
export type { PromptRegistryPort } from "./prompts/registry/PromptRegistry";
export type { PromptKey, PromptRegistryInput, PromptRegistryResult, PromptRunner } from "./prompts/registry/prompt-types";
export { PROMPT_KEYS } from "./prompts/versions";

// citation
export type { Citation, CitationSource, CitationRepository } from "./subdomains/citation/domain/entities/Citation";

// evaluation
export type { EvaluationResult, EvaluationCriterion, EvaluationVerdict, EvaluationPort } from "./subdomains/evaluation/domain/entities/EvaluationResult";

// memory
export type { MemoryItem, MemoryRepository } from "./subdomains/memory/domain/entities/MemoryItem";

// tool-calling
export type { AiTool, ToolCallInput, ToolCallOutput, ToolRuntimePort } from "./subdomains/tool-calling/domain/entities/AiTool";
