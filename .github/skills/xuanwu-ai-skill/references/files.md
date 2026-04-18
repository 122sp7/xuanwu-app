# Files

## File: src/modules/ai/orchestration/index.ts
````typescript
// ai — orchestration layer
// Cross-subdomain composition and facade lives here.
// TODO: implement AiFacade if needed.
````

## File: src/modules/ai/shared/errors/index.ts
````typescript
// ai shared/errors placeholder
````

## File: src/modules/ai/shared/events/index.ts
````typescript
// ai shared/events placeholder
````

## File: src/modules/ai/shared/index.ts
````typescript

````

## File: src/modules/ai/shared/types/index.ts
````typescript
// ai shared/types placeholder
````

## File: src/modules/ai/subdomains/chunk/adapters/inbound/index.ts
````typescript
// chunk — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/ai/subdomains/chunk/adapters/index.ts
````typescript
// chunk — adapters aggregate
````

## File: src/modules/ai/subdomains/chunk/adapters/outbound/memory/InMemoryChunkRepository.ts
````typescript
import type { ChunkSnapshot, ChunkStatus } from "../../../domain/entities/Chunk";
import type { ChunkRepository, ChunkQuery } from "../../../domain/repositories/ChunkRepository";
⋮----
export class InMemoryChunkRepository implements ChunkRepository {
⋮----
async save(snapshot: ChunkSnapshot): Promise<void>
⋮----
async saveAll(snapshots: ChunkSnapshot[]): Promise<void>
⋮----
async findById(id: string): Promise<ChunkSnapshot | null>
⋮----
async findBySourceId(sourceId: string): Promise<ChunkSnapshot[]>
⋮----
async query(params: ChunkQuery): Promise<ChunkSnapshot[]>
⋮----
async delete(id: string): Promise<void>
⋮----
async deleteBySourceId(sourceId: string): Promise<void>
````

## File: src/modules/ai/subdomains/chunk/domain/repositories/ChunkRepository.ts
````typescript
import type { ChunkSnapshot, ChunkStatus } from "../entities/Chunk";
⋮----
export interface ChunkQuery {
  readonly sourceId?: string;
  readonly status?: ChunkStatus;
  readonly limit?: number;
  readonly offset?: number;
}
⋮----
export interface ChunkRepository {
  save(snapshot: ChunkSnapshot): Promise<void>;
  saveAll(snapshots: ChunkSnapshot[]): Promise<void>;
  findById(id: string): Promise<ChunkSnapshot | null>;
  findBySourceId(sourceId: string): Promise<ChunkSnapshot[]>;
  query(params: ChunkQuery): Promise<ChunkSnapshot[]>;
  delete(id: string): Promise<void>;
  deleteBySourceId(sourceId: string): Promise<void>;
}
⋮----
save(snapshot: ChunkSnapshot): Promise<void>;
saveAll(snapshots: ChunkSnapshot[]): Promise<void>;
findById(id: string): Promise<ChunkSnapshot | null>;
findBySourceId(sourceId: string): Promise<ChunkSnapshot[]>;
query(params: ChunkQuery): Promise<ChunkSnapshot[]>;
delete(id: string): Promise<void>;
deleteBySourceId(sourceId: string): Promise<void>;
````

## File: src/modules/ai/subdomains/citation/adapters/inbound/index.ts
````typescript
// citation — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/ai/subdomains/citation/adapters/index.ts
````typescript
// citation — adapters aggregate
````

## File: src/modules/ai/subdomains/citation/adapters/outbound/index.ts
````typescript
// citation — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/ai/subdomains/citation/application/index.ts
````typescript
// citation — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/ai/subdomains/citation/application/use-cases/CitationUseCases.ts
````typescript
// TODO: implement citation building use-cases
````

## File: src/modules/ai/subdomains/citation/domain/entities/Citation.ts
````typescript
export interface CitationSource {
  readonly id: string;
  readonly sourceId: string;
  readonly chunkId: string;
  readonly title?: string;
  readonly excerpt: string;
  readonly score: number;
  readonly url?: string;
}
⋮----
export interface Citation {
  readonly id: string;
  readonly responseId: string;
  readonly sources: CitationSource[];
  readonly createdAtISO: string;
}
⋮----
export interface CitationRepository {
  save(citation: Citation): Promise<void>;
  findById(id: string): Promise<Citation | null>;
  findByResponseId(responseId: string): Promise<Citation | null>;
}
⋮----
save(citation: Citation): Promise<void>;
findById(id: string): Promise<Citation | null>;
findByResponseId(responseId: string): Promise<Citation | null>;
````

## File: src/modules/ai/subdomains/citation/domain/index.ts
````typescript
// citation — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/ai/subdomains/context/adapters/inbound/index.ts
````typescript
// context — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/ai/subdomains/context/adapters/index.ts
````typescript
// context — adapters aggregate
````

## File: src/modules/ai/subdomains/context/adapters/outbound/index.ts
````typescript
// context — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/ai/subdomains/context/application/index.ts
````typescript
// context — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/ai/subdomains/context/domain/index.ts
````typescript
// context — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/ai/subdomains/context/domain/repositories/ContextSessionRepository.ts
````typescript
import type { ContextSessionSnapshot } from "../entities/ContextSession";
⋮----
export interface ContextSessionRepository {
  save(snapshot: ContextSessionSnapshot): Promise<void>;
  findById(id: string): Promise<ContextSessionSnapshot | null>;
  findByActorId(actorId: string, limit?: number): Promise<ContextSessionSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: ContextSessionSnapshot): Promise<void>;
findById(id: string): Promise<ContextSessionSnapshot | null>;
findByActorId(actorId: string, limit?: number): Promise<ContextSessionSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/ai/subdomains/embedding/adapters/inbound/index.ts
````typescript
// embedding — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/ai/subdomains/embedding/adapters/index.ts
````typescript
// embedding — adapters aggregate
````

## File: src/modules/ai/subdomains/embedding/domain/repositories/EmbeddingRepository.ts
````typescript
import type { EmbeddingSnapshot } from "../entities/Embedding";
⋮----
export interface EmbeddingRepository {
  save(snapshot: EmbeddingSnapshot): Promise<void>;
  saveAll(snapshots: EmbeddingSnapshot[]): Promise<void>;
  findById(id: string): Promise<EmbeddingSnapshot | null>;
  findByChunkId(chunkId: string): Promise<EmbeddingSnapshot | null>;
  findBySourceId(sourceId: string): Promise<EmbeddingSnapshot[]>;
  delete(id: string): Promise<void>;
  deleteBySourceId(sourceId: string): Promise<void>;
}
⋮----
save(snapshot: EmbeddingSnapshot): Promise<void>;
saveAll(snapshots: EmbeddingSnapshot[]): Promise<void>;
findById(id: string): Promise<EmbeddingSnapshot | null>;
findByChunkId(chunkId: string): Promise<EmbeddingSnapshot | null>;
findBySourceId(sourceId: string): Promise<EmbeddingSnapshot[]>;
delete(id: string): Promise<void>;
deleteBySourceId(sourceId: string): Promise<void>;
````

## File: src/modules/ai/subdomains/evaluation/adapters/inbound/index.ts
````typescript
// evaluation — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/ai/subdomains/evaluation/adapters/index.ts
````typescript
// evaluation — adapters aggregate
````

## File: src/modules/ai/subdomains/evaluation/adapters/outbound/index.ts
````typescript
// evaluation — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/ai/subdomains/evaluation/application/index.ts
````typescript
// evaluation — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/ai/subdomains/evaluation/application/use-cases/EvaluationUseCases.ts
````typescript
// TODO: implement evaluation use-cases
````

## File: src/modules/ai/subdomains/evaluation/domain/entities/EvaluationResult.ts
````typescript
export type EvaluationVerdict = "pass" | "fail" | "needs_review";
⋮----
export interface EvaluationCriterion {
  readonly name: string;
  readonly weight: number;
  readonly description?: string;
}
⋮----
export interface EvaluationResult {
  readonly id: string;
  readonly responseId: string;
  readonly criteria: Array<{
    readonly criterion: EvaluationCriterion;
    readonly score: number;
    readonly verdict: EvaluationVerdict;
    readonly reasoning?: string;
  }>;
  readonly overallScore: number;
  readonly overallVerdict: EvaluationVerdict;
  readonly evaluatedAtISO: string;
}
⋮----
export interface EvaluationPort {
  evaluate(input: {
    response: string;
    context?: string;
    criteria: EvaluationCriterion[];
    model?: string;
  }): Promise<Omit<EvaluationResult, "id" | "responseId" | "evaluatedAtISO">>;
}
⋮----
evaluate(input: {
    response: string;
    context?: string;
    criteria: EvaluationCriterion[];
    model?: string;
  }): Promise<Omit<EvaluationResult, "id" | "responseId" | "evaluatedAtISO">>;
````

## File: src/modules/ai/subdomains/evaluation/domain/index.ts
````typescript
// evaluation — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/ai/subdomains/generation/adapters/inbound/index.ts
````typescript
// generation — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/ai/subdomains/generation/adapters/index.ts
````typescript
// generation — adapters aggregate
````

## File: src/modules/ai/subdomains/generation/adapters/outbound/index.ts
````typescript
// generation — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/ai/subdomains/generation/application/use-cases/GenerationUseCases.ts
````typescript
import type {
  TextGenerationPort,
  GenerateTextInput,
  GenerateTextOutput,
  ContentDistillationPort,
  DistillContentInput,
  DistillationOutput,
  TaskExtractionPort,
  TaskExtractionInput,
  TaskExtractionOutput,
} from "../../domain/ports/GenerationPorts";
⋮----
export class GenerateTextUseCase {
⋮----
constructor(private readonly port: TextGenerationPort)
⋮----
async execute(input: GenerateTextInput): Promise<
⋮----
export class DistillContentUseCase {
⋮----
constructor(private readonly port: ContentDistillationPort)
⋮----
async execute(input: DistillContentInput): Promise<
⋮----
export class ExtractTasksUseCase {
⋮----
constructor(private readonly port: TaskExtractionPort)
⋮----
async execute(input: TaskExtractionInput): Promise<
````

## File: src/modules/ai/subdomains/generation/domain/ports/GenerationPorts.ts
````typescript
/**
 * generation — domain ports
 * Distilled from modules/ai/domain/ports/AiTextGenerationPort.ts and DistillationPort.ts
 */
⋮----
export interface GenerateTextInput {
  readonly prompt: string;
  readonly system?: string;
  readonly model?: string;
}
⋮----
export interface GenerateTextOutput {
  readonly text: string;
  readonly model: string;
  readonly finishReason?: string;
  readonly traceId?: string;
  readonly completedAt?: string;
}
⋮----
export interface TextGenerationPort {
  generateText(input: GenerateTextInput): Promise<GenerateTextOutput>;
}
⋮----
generateText(input: GenerateTextInput): Promise<GenerateTextOutput>;
⋮----
export interface DistillationSource {
  readonly title?: string | null;
  readonly text: string;
}
⋮----
export interface DistillContentInput {
  readonly sources: readonly DistillationSource[];
  readonly objective?: string;
  readonly model?: string;
}
⋮----
export interface DistillationItem {
  readonly title: string;
  readonly summary: string;
  readonly sourceTitle?: string | null;
}
⋮----
export interface DistillationOutput {
  readonly overview: string;
  readonly items: readonly DistillationItem[];
  readonly model: string;
  readonly traceId: string;
  readonly completedAt: string;
}
⋮----
export interface ContentDistillationPort {
  distill(input: DistillContentInput): Promise<DistillationOutput>;
}
⋮----
distill(input: DistillContentInput): Promise<DistillationOutput>;
⋮----
export interface TaskExtractionItem {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
  readonly metadata?: Record<string, unknown>;
}
⋮----
export interface TaskExtractionInput {
  readonly content: string;
  readonly maxCandidates?: number;
  readonly model?: string;
  readonly promptFamily?: string;
  readonly context?: Record<string, unknown>;
}
⋮----
export interface TaskExtractionOutput {
  readonly tasks: readonly TaskExtractionItem[];
  readonly model: string;
  readonly traceId: string;
  readonly completedAt: string;
}
⋮----
export interface TaskExtractionPort {
  extractTasks(input: TaskExtractionInput): Promise<TaskExtractionOutput>;
}
⋮----
extractTasks(input: TaskExtractionInput): Promise<TaskExtractionOutput>;
````

## File: src/modules/ai/subdomains/memory/adapters/inbound/index.ts
````typescript
// memory — adapters/inbound placeholder
// TODO: export inbound adapters (HTTP handlers, action wrappers)
````

## File: src/modules/ai/subdomains/memory/adapters/index.ts
````typescript
// memory — adapters aggregate
````

## File: src/modules/ai/subdomains/memory/adapters/outbound/index.ts
````typescript
// memory — adapters/outbound placeholder
// TODO: export outbound adapters (repository implementations, external services)
````

## File: src/modules/ai/subdomains/memory/application/index.ts
````typescript
// memory — application layer placeholder
// TODO: export use-cases, DTOs, application services
````

## File: src/modules/ai/subdomains/memory/application/use-cases/MemoryUseCases.ts
````typescript
// TODO: implement memory upsert/query use-cases
````

## File: src/modules/ai/subdomains/memory/domain/entities/MemoryItem.ts
````typescript
export interface MemoryItem {
  readonly id: string;
  readonly actorId: string;
  readonly key: string;
  readonly value: string;
  readonly tags: string[];
  readonly expiresAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface MemoryRepository {
  save(item: MemoryItem): Promise<void>;
  findByActorAndKey(actorId: string, key: string): Promise<MemoryItem | null>;
  findByActor(actorId: string, tags?: string[]): Promise<MemoryItem[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(item: MemoryItem): Promise<void>;
findByActorAndKey(actorId: string, key: string): Promise<MemoryItem | null>;
findByActor(actorId: string, tags?: string[]): Promise<MemoryItem[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/ai/subdomains/memory/domain/index.ts
````typescript
// memory — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/ai/subdomains/pipeline/adapters/inbound/index.ts
````typescript
// pipeline — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/ai/subdomains/pipeline/adapters/index.ts
````typescript
// pipeline — adapters aggregate
````

## File: src/modules/ai/subdomains/pipeline/adapters/outbound/index.ts
````typescript
// pipeline — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/ai/subdomains/pipeline/application/index.ts
````typescript
// pipeline — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/ai/subdomains/pipeline/application/use-cases/PipelineUseCases.ts
````typescript
// TODO: implement pipeline use-cases for prompt rendering and pipeline orchestration
````

## File: src/modules/ai/subdomains/pipeline/domain/entities/PromptTemplate.ts
````typescript
export interface PromptTemplate {
  readonly id: string;
  readonly name: string;
  readonly family: string;
  readonly system?: string;
  readonly userTemplate: string;
  readonly variables: string[];
  readonly model?: string;
  readonly version: number;
  readonly createdAtISO: string;
}
⋮----
export interface PromptTemplateRepository {
  save(template: PromptTemplate): Promise<void>;
  findById(id: string): Promise<PromptTemplate | null>;
  findByFamily(family: string): Promise<PromptTemplate[]>;
  findLatestByName(name: string): Promise<PromptTemplate | null>;
}
⋮----
save(template: PromptTemplate): Promise<void>;
findById(id: string): Promise<PromptTemplate | null>;
findByFamily(family: string): Promise<PromptTemplate[]>;
findLatestByName(name: string): Promise<PromptTemplate | null>;
⋮----
export interface RenderedPrompt {
  readonly system?: string;
  readonly user: string;
  readonly model?: string;
}
⋮----
export interface PromptRenderPort {
  render(template: PromptTemplate, variables: Record<string, string>): RenderedPrompt;
}
⋮----
render(template: PromptTemplate, variables: Record<string, string>): RenderedPrompt;
````

## File: src/modules/ai/subdomains/pipeline/domain/index.ts
````typescript
// pipeline — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/ai/subdomains/retrieval/adapters/inbound/index.ts
````typescript
// retrieval — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/ai/subdomains/retrieval/adapters/index.ts
````typescript
// retrieval — adapters aggregate
````

## File: src/modules/ai/subdomains/retrieval/adapters/outbound/index.ts
````typescript
// retrieval — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/ai/subdomains/retrieval/application/index.ts
````typescript
// retrieval — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/ai/subdomains/retrieval/application/use-cases/RetrievalUseCases.ts
````typescript
import type { SemanticSearchPort, SemanticSearchInput, VectorSearchResult } from "../../domain/ports/RetrievalPorts";
⋮----
export class SemanticSearchUseCase {
⋮----
constructor(private readonly port: SemanticSearchPort)
⋮----
async execute(input: SemanticSearchInput): Promise<VectorSearchResult[]>
````

## File: src/modules/ai/subdomains/retrieval/domain/index.ts
````typescript
// retrieval — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/ai/subdomains/retrieval/domain/ports/RetrievalPorts.ts
````typescript
export interface VectorSearchResult {
  readonly id: string;
  readonly chunkId: string;
  readonly sourceId: string;
  readonly score: number;
  readonly content?: string;
  readonly metadata?: Record<string, unknown>;
}
⋮----
export interface VectorSearchInput {
  readonly queryVector: number[];
  readonly limit?: number;
  readonly minScore?: number;
  readonly filter?: Record<string, unknown>;
}
⋮----
export interface VectorSearchPort {
  search(input: VectorSearchInput): Promise<VectorSearchResult[]>;
  upsert(id: string, vector: number[], metadata?: Record<string, unknown>): Promise<void>;
  delete(id: string): Promise<void>;
}
⋮----
search(input: VectorSearchInput): Promise<VectorSearchResult[]>;
upsert(id: string, vector: number[], metadata?: Record<string, unknown>): Promise<void>;
delete(id: string): Promise<void>;
⋮----
export interface SemanticSearchInput {
  readonly query: string;
  readonly limit?: number;
  readonly minScore?: number;
  readonly filter?: Record<string, unknown>;
  readonly model?: string;
}
⋮----
export interface SemanticSearchPort {
  semanticSearch(input: SemanticSearchInput): Promise<VectorSearchResult[]>;
}
⋮----
semanticSearch(input: SemanticSearchInput): Promise<VectorSearchResult[]>;
````

## File: src/modules/ai/subdomains/tool-calling/adapters/inbound/index.ts
````typescript
// tool-calling — adapters/inbound placeholder
// TODO: export inbound adapters (HTTP handlers, action wrappers)
````

## File: src/modules/ai/subdomains/tool-calling/adapters/index.ts
````typescript
// tool-calling — adapters aggregate
````

## File: src/modules/ai/subdomains/tool-calling/adapters/outbound/index.ts
````typescript
// tool-calling — adapters/outbound placeholder
// TODO: export outbound adapters (repository implementations, external services)
````

## File: src/modules/ai/subdomains/tool-calling/application/index.ts
````typescript
// tool-calling — application layer placeholder
// TODO: export use-cases, DTOs, application services
````

## File: src/modules/ai/subdomains/tool-calling/application/use-cases/ToolCallingUseCases.ts
````typescript
// TODO: implement tool invocation and registration use-cases
````

## File: src/modules/ai/subdomains/tool-calling/domain/entities/AiTool.ts
````typescript
export interface AiTool {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: Record<string, unknown>;
  readonly outputSchema: Record<string, unknown>;
}
⋮----
export interface ToolCallInput {
  readonly toolName: string;
  readonly args: Record<string, unknown>;
  readonly actorId?: string;
}
⋮----
export interface ToolCallOutput {
  readonly toolName: string;
  readonly result: unknown;
  readonly traceId: string;
  readonly executedAtISO: string;
}
⋮----
export interface ToolRuntimePort {
  call(input: ToolCallInput): Promise<ToolCallOutput>;
  listAvailable(): Promise<AiTool[]>;
}
⋮----
call(input: ToolCallInput): Promise<ToolCallOutput>;
listAvailable(): Promise<AiTool[]>;
````

## File: src/modules/ai/subdomains/tool-calling/domain/index.ts
````typescript
// tool-calling — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/ai/index.ts
````typescript
/**
 * AI Module — public API surface.
 * All cross-module consumers must import from here only.
 */
⋮----
// generation
⋮----
// chunk
⋮----
// embedding
⋮----
// retrieval
⋮----
// context
⋮----
// pipeline
⋮----
// citation
⋮----
// evaluation
⋮----
// memory
⋮----
// tool-calling
````

## File: src/modules/ai/subdomains/chunk/adapters/outbound/dto/chunk-job-payload.ts
````typescript
/**
 * chunk-job-payload.ts
 *
 * Outbound DTO: QStash message payload for dispatching chunking jobs
 * to py_fn workers. This is an outbound contract (dispatcher → worker),
 * NOT a provider API contract.
 *
 * Discussion 08 — cross-runtime contract:
 * - TypeScript side (this file): Zod schema defining the payload shape
 * - Python side (py_fn/src/application/dto/chunk_job.py): Pydantic mirror
 *
 * Both sides must stay semantically aligned. Changes here require
 * corresponding updates to the py_fn Pydantic model.
 *
 * @see docs/structure/contexts/ai/cross-runtime-contracts.md
 */
⋮----
import { z } from "zod";
⋮----
/** Unique identifier for this job (used for idempotency) */
⋮----
/** The raw document content to be chunked */
⋮----
/** Workspace scope for multi-tenant isolation */
⋮----
/** Source type (e.g. "notion-page", "uploaded-file") */
⋮----
/** Optional hint for chunking strategy */
⋮----
/** Max token count per chunk; py_fn uses default if omitted */
⋮----
/** ISO 8601 timestamp when the job was requested */
⋮----
export type ChunkJobPayload = z.infer<typeof ChunkJobPayloadSchema>;
````

## File: src/modules/ai/subdomains/chunk/adapters/outbound/index.ts
````typescript
// chunk — outbound adapters
````

## File: src/modules/ai/subdomains/chunk/application/index.ts
````typescript

````

## File: src/modules/ai/subdomains/chunk/application/use-cases/ChunkUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Chunk, type CreateChunkInput } from "../../domain/entities/Chunk";
import type { ChunkRepository } from "../../domain/repositories/ChunkRepository";
⋮----
export class CreateChunkUseCase {
⋮----
constructor(private readonly repo: ChunkRepository)
⋮----
async execute(input: CreateChunkInput): Promise<CommandResult>
⋮----
export class BulkCreateChunksUseCase {
⋮----
async execute(inputs: CreateChunkInput[]): Promise<CommandResult>
⋮----
export class GetChunksBySourceUseCase {
⋮----
async execute(sourceId: string)
````

## File: src/modules/ai/subdomains/chunk/domain/entities/Chunk.ts
````typescript
import { z } from "zod";
import { v4 as uuid } from "uuid";
⋮----
export type ChunkId = z.infer<typeof ChunkIdSchema>;
⋮----
export type ChunkStatus = z.infer<typeof ChunkStatusSchema>;
⋮----
export interface ChunkSnapshot {
  readonly id: string;
  readonly sourceId: string;
  readonly sourceType: string;
  readonly content: string;
  readonly order: number;
  readonly tokenCount?: number;
  readonly metadata: Record<string, unknown>;
  readonly status: ChunkStatus;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateChunkInput {
  readonly sourceId: string;
  readonly sourceType: string;
  readonly content: string;
  readonly order: number;
  readonly tokenCount?: number;
  readonly metadata?: Record<string, unknown>;
}
⋮----
export class Chunk {
⋮----
private constructor(private _props: ChunkSnapshot)
⋮----
static create(input: CreateChunkInput): Chunk
⋮----
static reconstitute(snapshot: ChunkSnapshot): Chunk
⋮----
markEmbedded(): void
⋮----
markIndexed(): void
⋮----
markFailed(): void
⋮----
get id(): string
get sourceId(): string
get content(): string
get status(): ChunkStatus
⋮----
getSnapshot(): Readonly<ChunkSnapshot>
````

## File: src/modules/ai/subdomains/chunk/domain/index.ts
````typescript

````

## File: src/modules/ai/subdomains/context/application/use-cases/ContextUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { ContextSession } from "../../domain/entities/ContextSession";
import type { ContextSessionRepository } from "../../domain/repositories/ContextSessionRepository";
⋮----
export class CreateContextSessionUseCase {
⋮----
constructor(private readonly repo: ContextSessionRepository)
⋮----
async execute(input:
⋮----
export class AddContextMessageUseCase {
````

## File: src/modules/ai/subdomains/context/domain/entities/ContextSession.ts
````typescript
import { z } from "zod";
import { v4 as uuid } from "uuid";
⋮----
export type ContextSessionId = z.infer<typeof ContextSessionIdSchema>;
⋮----
export type ContextRole = "user" | "assistant" | "system";
⋮----
export interface ContextMessage {
  readonly id: string;
  readonly role: ContextRole;
  readonly content: string;
  readonly createdAtISO: string;
}
⋮----
export interface ContextSessionSnapshot {
  readonly id: string;
  readonly actorId?: string;
  readonly workspaceId?: string;
  readonly messages: ContextMessage[];
  readonly systemPrompt?: string;
  readonly model?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export class ContextSession {
⋮----
private constructor(private _props: ContextSessionSnapshot)
⋮----
static create(input: {
    actorId?: string;
    workspaceId?: string;
    systemPrompt?: string;
    model?: string;
}): ContextSession
⋮----
static reconstitute(snapshot: ContextSessionSnapshot): ContextSession
⋮----
addMessage(role: ContextRole, content: string): void
⋮----
get id(): string
get messages(): ContextMessage[]
⋮----
getSnapshot(): Readonly<ContextSessionSnapshot>
````

## File: src/modules/ai/subdomains/embedding/adapters/outbound/dto/embedding-job-payload.ts
````typescript
/**
 * embedding-job-payload.ts
 *
 * Outbound DTO: QStash message payload for dispatching embedding generation
 * jobs to py_fn workers. This is an outbound contract (dispatcher → worker),
 * NOT a provider API contract.
 *
 * Discussion 08 — cross-runtime contract:
 * - TypeScript side (this file): Zod schema defining the payload shape
 * - Python side (py_fn/src/application/dto/embedding_job.py): Pydantic mirror
 *
 * Both sides must stay semantically aligned. Changes here require
 * corresponding updates to the py_fn Pydantic model.
 *
 * @see docs/structure/contexts/ai/cross-runtime-contracts.md
 */
⋮----
import { z } from "zod";
⋮----
/** Unique identifier for this job (used for idempotency) */
⋮----
/** The document/artifact that sourced these chunks */
⋮----
/** Workspace scope for multi-tenant isolation */
⋮----
/** Chunk IDs to generate embeddings for (at least one required) */
⋮----
/** Optional model hint; py_fn selects default if omitted */
⋮----
/** ISO 8601 timestamp when the job was requested */
⋮----
export type EmbeddingJobPayload = z.infer<typeof EmbeddingJobPayloadSchema>;
````

## File: src/modules/ai/subdomains/embedding/adapters/outbound/index.ts
````typescript
// embedding — outbound adapters
````

## File: src/modules/ai/subdomains/embedding/application/index.ts
````typescript

````

## File: src/modules/ai/subdomains/embedding/application/use-cases/EmbeddingUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Embedding } from "../../domain/entities/Embedding";
import type { EmbeddingGenerationPort } from "../../domain/entities/Embedding";
import type { EmbeddingRepository } from "../../domain/repositories/EmbeddingRepository";
⋮----
export class GenerateAndStoreEmbeddingUseCase {
⋮----
constructor(
⋮----
async execute(input: {
    chunkId: string;
    sourceId: string;
    text: string;
    model?: string;
}): Promise<CommandResult>
````

## File: src/modules/ai/subdomains/embedding/domain/entities/Embedding.ts
````typescript
import { z } from "zod";
import { v4 as uuid } from "uuid";
⋮----
export type EmbeddingId = z.infer<typeof EmbeddingIdSchema>;
⋮----
export interface EmbeddingSnapshot {
  readonly id: string;
  readonly chunkId: string;
  readonly sourceId: string;
  readonly vector: number[];
  readonly model: string;
  readonly dimensions: number;
  readonly createdAtISO: string;
}
⋮----
export interface CreateEmbeddingInput {
  readonly chunkId: string;
  readonly sourceId: string;
  readonly vector: number[];
  readonly model: string;
}
⋮----
export class Embedding {
⋮----
private constructor(private readonly _props: EmbeddingSnapshot)
⋮----
static create(input: CreateEmbeddingInput): Embedding
⋮----
static reconstitute(snapshot: EmbeddingSnapshot): Embedding
⋮----
get id(): string
get chunkId(): string
get vector(): number[]
get model(): string
⋮----
getSnapshot(): Readonly<EmbeddingSnapshot>
⋮----
export interface EmbeddingGenerationPort {
  generateEmbedding(text: string, model?: string): Promise<{ vector: number[]; model: string }>;
  generateEmbeddingBatch(texts: string[], model?: string): Promise<Array<{ vector: number[]; model: string }>>;
}
⋮----
generateEmbedding(text: string, model?: string): Promise<
generateEmbeddingBatch(texts: string[], model?: string): Promise<Array<
````

## File: src/modules/ai/subdomains/embedding/domain/index.ts
````typescript

````

## File: src/modules/ai/subdomains/generation/application/index.ts
````typescript

````

## File: src/modules/ai/subdomains/generation/domain/index.ts
````typescript

````

## File: src/modules/ai/README.md
````markdown
# AI Module

## 子域清單（名詞域）

> **子域設計原則：** 每個子域以**名詞**命名，代表其核心管理實體，不以動詞流程命名。  
> **子域不重複原則：** `conversation`（使用者對話 UX）屬 `notebooklm`；`document` 屬 `notebooklm`；`task-formation` 屬 `workspace`。

| 子域 | 狀態 | 說明 |
|---|---|---|
| `chunk` | 🔨 骨架建立，實作進行中 | 文字分塊實體（分塊策略、Token 計量、Chunk ID）|
| `citation` | 🔨 骨架建立，實作進行中 | 引用實體（生成內容對應的來源 Chunk 溯源）|
| `context` | 🔨 骨架建立，實作進行中 | AI 上下文實體（記憶體、對話歷程、人格設定）|
| `embedding` | 🔨 骨架建立，實作進行中 | 向量嵌入實體（Embedding 生成與向量儲存）|
| `evaluation` | 🔨 骨架建立，實作進行中 | 評估實體（品質評分、安全過濾、模型可觀測性）|
| `generation` | 🔨 骨架建立，實作進行中 | AI 生成實體（模型選擇、Tool calling、生成結果）|
| `memory` | 🔨 骨架建立，實作進行中 | AI 記憶實體（長期記憶、跨會話持久化）|
| `pipeline` | 🔨 骨架建立，實作進行中 | 提示管線實體（Prompt 模板、多步驟 Pipeline 定義）|
| `retrieval` | 🔨 骨架建立，實作進行中 | 語意檢索實體（向量相似度搜尋、TopK 結果）|
| `tool-calling` | 🔨 骨架建立，實作進行中 | 工具呼叫實體（Tool 定義、執行、結果處理）|

---

## task-formation 歸屬決策

| 子域 | 歸屬 | 理由 |
|---|---|---|
| `task-formation` | **`workspace`** | Task 是 workspace 領域物件；AI 生成能力由 `ai/generation` Port 注入 |

---

## 預期目錄結構

```
src/modules/ai/
  index.ts                      ← 模組對外唯一入口（具名匯出）
  README.md
  AGENT.md
  orchestration/
    AiFacade.ts                 ← 對外統一 Facade
    AiCoordinator.ts            ← 跨子域協調（chunk→embedding→retrieval→generation）
  shared/
    domain/index.ts
    application/index.ts
    events/index.ts             ← Published Language Events（供 notebooklm / workspace 消費）
    errors/index.ts
    types/index.ts
  subdomains/
    embedding/
      domain/
      application/
      adapters/outbound/
    pipeline/
      domain/
      application/
      adapters/outbound/
    evaluation/
    generation/
    chunk/
    retrieval/
    context/
    citation/
    memory/
    tool-calling/
```

---

## 依賴方向

```
subdomains/*/adapters/inbound → subdomains/*/application → subdomains/*/domain
                                                                    ↑
                               subdomains/*/adapters/outbound  ───┘
                                                    ↑
                                             shared/domain
```

跨子域協調只能透過 `orchestration/` 或 `shared/events/`，不得直接跨 subdomain import。

---

## 子域邊界示意（ai vs notebooklm）

```
notebooklm/conversation  ←使用→  ai/generation（生成回答機制）
notebooklm/document      ←使用→  ai/embedding（向量化文件）
notebooklm/conversation  ←使用→  ai/retrieval（檢索相關 chunk）
notebooklm/conversation  ←使用→  ai/citation（標注引用來源）
notebooklm/document      ─切塊→  ai/chunk（分塊計算）
```

ai 提供**機制**；notebooklm 組合機制成**使用者體驗**。

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 在 `domain/` 中 import Genkit、Firebase SDK | 破壞 domain 純度 |
| 在 barrel 使用 `export *` | 破壞 tree-shaking 與邊界可追蹤性 |
| 在 ai 定義使用者對話 UX | 屬 notebooklm |
| 在 ai 定義 task-formation 業務流程 | 屬 workspace |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
````

## File: src/modules/ai/AGENT.md
````markdown
# AI Module — Agent Guide

## Purpose

`src/modules/ai` 是 **AI 機制能力模組**，為 Xuanwu 系統提供文字分塊（Chunk）、向量嵌入（Embedding）、語意檢索（Retrieval）、上下文管理（Context）、內容生成（Generation）、來源引用（Citation）、品質評估（Evaluation）、提示管線（Pipeline）等 AI 底層機制的實作落點。

> **⚠ 邊界警示：** `ai` 擁有 AI **機制**（模型呼叫、向量計算、提示建構），不擁有使用者對話 UX（屬 `notebooklm`）、知識文件管理（屬 `notion`）或任務生成流程（屬 `workspace`）。

## 子域清單（名詞域）

| 子域 | 說明 | 狀態 |
|---|---|---|
| `chunk` | 文字分塊實體（分塊策略、Token 計量）| 🔨 骨架建立，實作進行中 |
| `citation` | 引用實體（生成內容的來源溯源）| 🔨 骨架建立，實作進行中 |
| `context` | AI 上下文實體（記憶體、對話歷程、人格）| 🔨 骨架建立，實作進行中 |
| `embedding` | 向量嵌入實體（Embedding 生成與儲存）| 🔨 骨架建立，實作進行中 |
| `evaluation` | 評估實體（輸出品質、安全防護、模型可觀測性）| 🔨 骨架建立，實作進行中 |
| `generation` | AI 生成實體（模型選擇、Tool calling、內容生成）| 🔨 骨架建立，實作進行中 |
| `memory` | AI 記憶實體（長期記憶、跨會話持久化）| 🔨 骨架建立，實作進行中 |
| `pipeline` | 提示管線實體（提示模板、多步驟管線）| 🔨 骨架建立，實作進行中 |
| `retrieval` | 語意檢索實體（向量相似度搜尋）| 🔨 骨架建立，實作進行中 |
| `tool-calling` | 工具呼叫實體（Tool 定義、執行、結果處理）| 🔨 骨架建立，實作進行中 |

> **子域不重複原則：**  
> - `conversation`（使用者對話 UX）→ `notebooklm` 所有  
> - `document`（來源文件管理）→ `notebooklm` 所有  
> - `task-formation`（AI 輔助任務生成流程）→ `workspace` 所有；ai 提供 `generation` 能力支援  

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK、Genkit SDK、HTTP client 或任何框架。
- `application/` 只依賴 `domain/` 抽象，不依賴 adapter 實作。
- 跨子域協調透過 `orchestration/` 或 `shared/events/`，禁止直接跨 subdomain import。
- 外部消費者（notebooklm、workspace）只能透過 `src/modules/ai/index.ts` 存取。
- ai 模組不得依賴 notion、notebooklm、workspace（ai 是上游 AI 機制提供者）。

## task-formation 歸屬決策

`task-formation` 子域屬於 **`workspace`**，理由：
- 輸出物（Task entities）是 workspace 的領域物件
- 觸發者（使用者指定生成任務）是 workspace 層業務流程
- AI 模型呼叫透過 `ai/generation` Port 注入，由 workspace 消費

## Route Here When

- 撰寫 AI 機制的新 use case、entity、adapter 實作（embedding、retrieval、generation 等）。
- 實作 prompt template、tool calling port、embedding vector adapter 等骨架。
- 需要 `src/modules/ai/` 層的骨架結構作為起點。

## Route Elsewhere When

- 讀取 AI 模組邊界規則、published language → `src/modules/ai/AGENT.md`
- 使用者對話 / Notebook UX → `src/modules/notebooklm/`
- 知識文件 / Page 管理 → `src/modules/notion/`
- 任務生成業務流程 → `src/modules/workspace/`（`task-formation`）
- 跨模組 API boundary → `src/modules/ai/index.ts`

## 路由規則

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/ai/AGENT.md` |
| 撰寫新 use case / adapter / entity | `src/modules/ai/`（本層） |
| 跨模組 API boundary | `src/modules/ai/index.ts` |

**嚴禁事項：**
- ❌ 在 `domain/` 匯入 Genkit、Firebase SDK、React
- ❌ 在 barrel 使用 `export *`
- ❌ 在 ai 模組定義使用者對話 UX（屬 notebooklm）
- ❌ 在 ai 模組定義 task-formation 業務流程（屬 workspace）

## 文件網絡

- [README.md](README.md) — 模組目錄結構
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
````