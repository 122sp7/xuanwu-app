# Files

## File: src/app/(public)/page.tsx
````typescript
import { PublicLandingView } from "@/src/modules/iam/adapters/inbound/react";
⋮----
export default function PublicPage()
````

## File: src/app/(shell)/(account)/[accountId]/[[...slug]]/page.tsx
````typescript
import { AccountRouteDispatcher } from "@/src/modules/workspace/adapters/inbound/react";
⋮----
interface AccountSlugPageProps {
  params: Promise<{ accountId: string; slug?: string[] }>;
}
````

## File: src/app/(shell)/layout.tsx
````typescript
import { ShellFrame } from "@/src/modules/platform/adapters/inbound/react";
⋮----
export default function ShellLayout({
  children,
}: Readonly<
````

## File: src/app/globals.css
````css
@theme inline {
⋮----
:root {
⋮----
.dark {
⋮----
@layer base {
⋮----
* {
body {
html {
⋮----
@apply font-sans;
⋮----
/* ── Tiptap / ProseMirror editor styles ───────────────────────────────────── */
.tiptap-editor .ProseMirror {
.tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
.tiptap-editor .ProseMirror h1 { @apply text-3xl font-bold mb-3 mt-5; }
.tiptap-editor .ProseMirror h2 { @apply text-2xl font-semibold mb-2 mt-4; }
.tiptap-editor .ProseMirror h3 { @apply text-xl font-medium mb-2 mt-3; }
.tiptap-editor .ProseMirror p  { @apply mb-2 leading-relaxed; }
.tiptap-editor .ProseMirror ul { @apply list-disc pl-5 mb-2 space-y-0.5; }
.tiptap-editor .ProseMirror ol { @apply list-decimal pl-5 mb-2 space-y-0.5; }
.tiptap-editor .ProseMirror li { @apply leading-relaxed; }
.tiptap-editor .ProseMirror blockquote {
.tiptap-editor .ProseMirror hr {
.tiptap-editor .ProseMirror code {
.tiptap-editor .ProseMirror a {
.tiptap-editor .ProseMirror strong { @apply font-bold; }
.tiptap-editor .ProseMirror em { @apply italic; }
.tiptap-editor .ProseMirror u  { @apply underline; }
.tiptap-editor .ProseMirror s  { @apply line-through; }
/* ── Callout block ──────────────────────────────────────────────────────────── */
.tiptap-editor .ProseMirror .callout-block {
.tiptap-editor .ProseMirror .callout-emoji {
.tiptap-editor .ProseMirror .callout-content {
.tiptap-editor .ProseMirror .callout-content p { @apply mb-1; }
⋮----
/* ── Toggle (collapsible) block ─────────────────────────────────────────────── */
.tiptap-editor .ProseMirror .toggle-block {
.tiptap-editor .ProseMirror .toggle-block > summary {
.tiptap-editor .ProseMirror .toggle-block > summary::-webkit-details-marker { display: none; }
.tiptap-editor .ProseMirror .toggle-block > :not(summary) {
⋮----
/* ── Table of Contents block ─────────────────────────────────────────────────── */
.tiptap-editor .ProseMirror .toc-block {
.tiptap-editor .ProseMirror .toc-block::before {
````

## File: src/app/layout.tsx
````typescript
import { ThemeProvider } from "@packages";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cn } from "@/packages/ui-shadcn";
⋮----
import { PlatformBootstrap } from "@/src/modules/platform/adapters/inbound/react";
⋮----
export default function RootLayout({
  children,
}: Readonly<
````

## File: src/modules/ai/orchestration/AiFacade.ts
````typescript
import { GenkitPromptRegistry } from "../prompts/registry/GenkitPromptRegistry";
import type { PromptRegistryPort } from "../prompts/registry/PromptRegistry";
import { PROMPT_KEYS } from "../prompts/versions";
⋮----
interface GenerationPromptOutput {
  readonly text: string;
}
⋮----
interface QueryExpansionPromptOutput {
  readonly queries: readonly string[];
}
⋮----
/**
 * AiFacade is the orchestration entry for cross-subdomain AI prompt execution.
 * It keeps callers decoupled from prompt definitions by delegating all prompt
 * resolution and execution to the PromptRegistry boundary.
 */
export class AiFacade {
⋮----
constructor(private readonly promptRegistry: PromptRegistryPort = new GenkitPromptRegistry())
⋮----
async generateText(input:
⋮----
async expandQuery(query: string): Promise<readonly string[]>
````

## File: src/modules/ai/orchestration/index.ts
````typescript

````

## File: src/modules/ai/prompts/registry/GenkitPromptRegistry.ts
````typescript
import { ai } from "@/packages/integration-ai/genkit";
import { z } from "genkit";
⋮----
import { PROMPT_KEYS } from "../versions";
import type { PromptRegistryPort } from "./PromptRegistry";
import { loadPromptDefinitions } from "./prompt-loader";
import type { PromptKey, PromptRunner } from "./prompt-types";
⋮----
export class GenkitPromptRegistry implements PromptRegistryPort {
⋮----
constructor(knownKeys: readonly PromptKey[] = Object.values(PROMPT_KEYS))
⋮----
get<TOutput = unknown>(key: PromptKey): PromptRunner<TOutput>
⋮----
const runner: PromptRunner<TOutput> = async (input) =>
⋮----
list(): readonly PromptKey[]
⋮----
resolve(key: string): PromptKey | null
````

## File: src/modules/ai/prompts/registry/InMemoryPromptRegistry.ts
````typescript
import type { PromptRegistryPort } from "./PromptRegistry";
import type { PromptKey, PromptRunner } from "./prompt-types";
⋮----
export interface PromptRegistryEntry<TOutput = unknown> {
  readonly key: PromptKey;
  readonly runner: PromptRunner<TOutput>;
}
⋮----
export class InMemoryPromptRegistry implements PromptRegistryPort {
⋮----
constructor(entries: readonly PromptRegistryEntry[] = [])
⋮----
register<TOutput = unknown>(entry: PromptRegistryEntry<TOutput>): void
⋮----
get<TOutput = unknown>(key: PromptKey): PromptRunner<TOutput>
⋮----
list(): readonly PromptKey[]
⋮----
resolve(key: string): PromptKey | null
````

## File: src/modules/ai/prompts/registry/prompt-loader.ts
````typescript
import { registerGenerationPrompts } from "../../subdomains/generation/prompts/generate-text.prompt";
import { registerRetrievalPrompts } from "../../subdomains/retrieval/prompts/query-expansion.prompt";
⋮----
export const loadPromptDefinitions = (): void =>
````

## File: src/modules/ai/prompts/registry/prompt-types.ts
````typescript
export type PromptKey = `${string}.${string}`;
⋮----
export type PromptRegistryInput = Readonly<Record<string, unknown>>;
⋮----
export interface PromptRegistryResult<TOutput = unknown> {
  readonly output: TOutput;
  readonly text?: string;
}
⋮----
export type PromptRunner<TOutput = unknown> = (input: PromptRegistryInput) => Promise<PromptRegistryResult<TOutput>>;
````

## File: src/modules/ai/prompts/registry/PromptRegistry.ts
````typescript
import type { PromptKey, PromptRunner } from "./prompt-types";
⋮----
export interface PromptRegistryPort {
  get<TOutput = unknown>(key: PromptKey): PromptRunner<TOutput>;
  list(): readonly PromptKey[];
  resolve(key: string): PromptKey | null;
}
⋮----
get<TOutput = unknown>(key: PromptKey): PromptRunner<TOutput>;
list(): readonly PromptKey[];
resolve(key: string): PromptKey | null;
````

## File: src/modules/ai/prompts/versions.ts
````typescript
import type { PromptKey } from "./registry/prompt-types";
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

## File: src/modules/ai/subdomains/chunk/adapters/outbound/index.ts
````typescript
// chunk — outbound adapters
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

## File: src/modules/ai/subdomains/generation/application/index.ts
````typescript

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

## File: src/modules/ai/subdomains/generation/domain/index.ts
````typescript

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

## File: src/modules/ai/subdomains/generation/prompts/generate-text.prompt.ts
````typescript
import { ai } from "@/packages/integration-ai/genkit";
import { z } from "genkit";
⋮----
import { PROMPT_KEYS } from "../../../prompts/versions";
⋮----
export const registerGenerationPrompts = (): void =>
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

````

## File: src/modules/ai/subdomains/pipeline/domain/ports/AiOrchestrationPort.ts
````typescript
export interface AiOrchestrationInput {
  readonly promptKey: string;
  readonly variables: Readonly<Record<string, unknown>>;
}
⋮----
export interface AiOrchestrationResult<TOutput = unknown> {
  readonly output: TOutput;
  readonly text?: string;
}
⋮----
export interface AiOrchestrationPort {
  runPrompt<TOutput = unknown>(input: AiOrchestrationInput): Promise<AiOrchestrationResult<TOutput>>;
}
⋮----
runPrompt<TOutput = unknown>(input: AiOrchestrationInput): Promise<AiOrchestrationResult<TOutput>>;
````

## File: src/modules/ai/subdomains/pipeline/infrastructure/GenkitAiOrchestrationAdapter.ts
````typescript
import { GenkitPromptRegistry } from "../../../prompts/registry/GenkitPromptRegistry";
import type { PromptRegistryPort } from "../../../prompts/registry/PromptRegistry";
import type { AiOrchestrationInput, AiOrchestrationPort, AiOrchestrationResult } from "../domain/ports/AiOrchestrationPort";
⋮----
export class GenkitAiOrchestrationAdapter implements AiOrchestrationPort {
⋮----
constructor(private readonly promptRegistry: PromptRegistryPort = new GenkitPromptRegistry())
⋮----
async runPrompt<TOutput = unknown>(input: AiOrchestrationInput): Promise<AiOrchestrationResult<TOutput>>
````

## File: src/modules/ai/subdomains/pipeline/infrastructure/index.ts
````typescript

````

## File: src/modules/ai/subdomains/pipeline/infrastructure/prompts/synthesis.prompt
````
---
model: googleai/gemini-2.5-flash
input:
  schema:
    type: object
    properties:
      prompt:
        type: string
    required: [prompt]
output:
  format: json
  schema:
    type: object
    properties:
      text:
        type: string
    required: [text]
---
{{prompt}}
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

## File: src/modules/ai/subdomains/retrieval/prompts/query-expansion.prompt.ts
````typescript
import { ai } from "@/packages/integration-ai/genkit";
import { z } from "genkit";
⋮----
import { PROMPT_KEYS } from "../../../prompts/versions";
⋮----
export const registerRetrievalPrompts = (): void =>
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

## File: src/modules/analytics/index.ts
````typescript
/**
 * Analytics Module — public API surface.
 * All cross-module consumers must import from here only.
 */
⋮----
// event-contracts
⋮----
// metrics
⋮----
// event-ingestion domain types
⋮----
// event-projection domain types
⋮----
// insights domain types
⋮----
// realtime-insights domain types
⋮----
// experimentation domain types
````

## File: src/modules/analytics/orchestration/index.ts
````typescript
// analytics — orchestration layer
// Cross-subdomain composition and facade lives here.
// TODO: implement AnalyticsFacade if needed.
````

## File: src/modules/analytics/shared/errors/index.ts
````typescript
// analytics shared/errors placeholder
````

## File: src/modules/analytics/shared/events/index.ts
````typescript
// analytics shared events
````

## File: src/modules/analytics/shared/index.ts
````typescript

````

## File: src/modules/analytics/shared/types/index.ts
````typescript
// analytics shared types
````

## File: src/modules/analytics/subdomains/event-contracts/adapters/inbound/index.ts
````typescript
// event-contracts — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/analytics/subdomains/event-contracts/adapters/index.ts
````typescript
// event-contracts — adapters aggregate
````

## File: src/modules/analytics/subdomains/event-contracts/adapters/outbound/index.ts
````typescript
// event-contracts — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/analytics/subdomains/event-contracts/adapters/outbound/memory/InMemoryAnalyticsEventRepository.ts
````typescript
import type { AnalyticsEventSnapshot } from "../../../domain/entities/AnalyticsEvent";
import type {
  AnalyticsEventRepository,
  AnalyticsEventQuery,
} from "../../../domain/repositories/AnalyticsEventRepository";
⋮----
export class InMemoryAnalyticsEventRepository implements AnalyticsEventRepository {
⋮----
async save(snapshot: AnalyticsEventSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<AnalyticsEventSnapshot | null>
⋮----
async query(params: AnalyticsEventQuery): Promise<AnalyticsEventSnapshot[]>
⋮----
async countByName(name: string, fromDate?: string, toDate?: string): Promise<number>
````

## File: src/modules/analytics/subdomains/event-contracts/application/index.ts
````typescript

````

## File: src/modules/analytics/subdomains/event-contracts/application/use-cases/AnalyticsEventUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { AnalyticsEvent, type TrackEventInput } from "../../domain/entities/AnalyticsEvent";
import type { AnalyticsEventRepository } from "../../domain/repositories/AnalyticsEventRepository";
⋮----
export class TrackAnalyticsEventUseCase {
⋮----
constructor(private readonly repo: AnalyticsEventRepository)
⋮----
async execute(input: TrackEventInput): Promise<CommandResult>
⋮----
export class QueryAnalyticsEventsUseCase {
⋮----
async execute(params: {
    name?: string;
    source?: string;
    workspaceId?: string;
    actorId?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
})
````

## File: src/modules/analytics/subdomains/event-contracts/domain/entities/AnalyticsEvent.ts
````typescript
import { z } from "zod";
import { v4 as uuid } from "uuid";
⋮----
export type AnalyticsEventId = z.infer<typeof AnalyticsEventIdSchema>;
⋮----
export type AnalyticsEventSnapshot = z.infer<typeof AnalyticsEventSchema>;
⋮----
export interface TrackEventInput {
  readonly name: string;
  readonly source: string;
  readonly actorId?: string;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly properties?: Record<string, unknown>;
  readonly occurredAt?: string;
}
⋮----
export class AnalyticsEvent {
⋮----
private constructor(private readonly _props: AnalyticsEventSnapshot)
⋮----
static create(input: TrackEventInput): AnalyticsEvent
⋮----
static reconstitute(snapshot: AnalyticsEventSnapshot): AnalyticsEvent
⋮----
get id(): string
get name(): string
get source(): string
get actorId(): string | undefined
get workspaceId(): string | undefined
get occurredAt(): string
⋮----
getSnapshot(): Readonly<AnalyticsEventSnapshot>
````

## File: src/modules/analytics/subdomains/event-contracts/domain/events/AnalyticsDomainEvent.ts
````typescript
export type AnalyticsDomainEventType =
  | {
      type: "analytics.event.tracked";
      eventId: string;
      occurredAt: string;
      payload: { analyticsEventId: string; name: string; source: string };
    }
  | {
      type: "analytics.event.ingestion_failed";
      eventId: string;
      occurredAt: string;
      payload: { name: string; reason: string };
    };
````

## File: src/modules/analytics/subdomains/event-contracts/domain/index.ts
````typescript

````

## File: src/modules/analytics/subdomains/event-contracts/domain/repositories/AnalyticsEventRepository.ts
````typescript
import type { AnalyticsEventSnapshot } from "../entities/AnalyticsEvent";
⋮----
export interface AnalyticsEventQuery {
  readonly name?: string;
  readonly source?: string;
  readonly actorId?: string;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly limit?: number;
  readonly offset?: number;
}
⋮----
export interface AnalyticsEventRepository {
  save(snapshot: AnalyticsEventSnapshot): Promise<void>;
  findById(id: string): Promise<AnalyticsEventSnapshot | null>;
  query(params: AnalyticsEventQuery): Promise<AnalyticsEventSnapshot[]>;
  countByName(name: string, fromDate?: string, toDate?: string): Promise<number>;
}
⋮----
save(snapshot: AnalyticsEventSnapshot): Promise<void>;
findById(id: string): Promise<AnalyticsEventSnapshot | null>;
query(params: AnalyticsEventQuery): Promise<AnalyticsEventSnapshot[]>;
countByName(name: string, fromDate?: string, toDate?: string): Promise<number>;
````

## File: src/modules/analytics/subdomains/event-contracts/domain/value-objects/EventName.ts
````typescript
import { z } from "zod";
⋮----
export type EventName = z.infer<typeof EventNameSchema>;
⋮----
export function createEventName(value: string): EventName
````

## File: src/modules/analytics/subdomains/event-ingestion/adapters/inbound/index.ts
````typescript
// event-ingestion — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/analytics/subdomains/event-ingestion/adapters/index.ts
````typescript
// event-ingestion — adapters aggregate
````

## File: src/modules/analytics/subdomains/event-ingestion/adapters/outbound/index.ts
````typescript
// event-ingestion — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/analytics/subdomains/event-ingestion/application/index.ts
````typescript
// event-ingestion — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/analytics/subdomains/event-ingestion/application/use-cases/IngestionUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { AnalyticsEventSnapshot } from "../../../event-contracts/domain/entities/AnalyticsEvent";
import type { IngestionBatch, IngestionBatchRepository } from "../../domain/entities/IngestionBatch";
⋮----
export class IngestEventBatchUseCase {
⋮----
constructor(private readonly repo: IngestionBatchRepository)
⋮----
async execute(events: AnalyticsEventSnapshot[]): Promise<CommandResult>
````

## File: src/modules/analytics/subdomains/event-ingestion/domain/entities/IngestionBatch.ts
````typescript
import type { AnalyticsEventSnapshot } from "../../../event-contracts/domain/entities/AnalyticsEvent";
⋮----
export type IngestionStatus = "pending" | "processed" | "failed";
⋮----
export interface IngestionBatch {
  readonly id: string;
  readonly events: AnalyticsEventSnapshot[];
  readonly status: IngestionStatus;
  readonly processedAt?: string;
  readonly failedReason?: string;
  readonly createdAtISO: string;
}
⋮----
export interface IngestionBatchRepository {
  save(batch: IngestionBatch): Promise<void>;
  findById(id: string): Promise<IngestionBatch | null>;
  findPending(limit?: number): Promise<IngestionBatch[]>;
}
⋮----
save(batch: IngestionBatch): Promise<void>;
findById(id: string): Promise<IngestionBatch | null>;
findPending(limit?: number): Promise<IngestionBatch[]>;
````

## File: src/modules/analytics/subdomains/event-ingestion/domain/events/IngestionDomainEvent.ts
````typescript
export type IngestionDomainEventType =
  | {
      type: "analytics.ingestion.batch_created";
      eventId: string;
      occurredAt: string;
      payload: { batchId: string; eventCount: number };
    }
  | {
      type: "analytics.ingestion.batch_processed";
      eventId: string;
      occurredAt: string;
      payload: { batchId: string };
    }
  | {
      type: "analytics.ingestion.batch_failed";
      eventId: string;
      occurredAt: string;
      payload: { batchId: string; reason: string };
    };
````

## File: src/modules/analytics/subdomains/event-ingestion/domain/index.ts
````typescript
// event-ingestion — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/analytics/subdomains/event-projection/adapters/inbound/index.ts
````typescript
// event-projection — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/analytics/subdomains/event-projection/adapters/index.ts
````typescript
// event-projection — adapters aggregate
````

## File: src/modules/analytics/subdomains/event-projection/adapters/outbound/index.ts
````typescript
// event-projection — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/analytics/subdomains/event-projection/application/index.ts
````typescript
// event-projection — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/analytics/subdomains/event-projection/application/use-cases/ProjectionUseCases.ts
````typescript
// TODO: implement use-cases for computing and querying event projections
// Depends on EventProjectionRepository
````

## File: src/modules/analytics/subdomains/event-projection/domain/entities/EventProjection.ts
````typescript
export interface EventProjection {
  readonly id: string;
  readonly name: string;
  readonly filter: Record<string, unknown>;
  readonly aggregation: "count" | "sum" | "avg" | "distinct";
  readonly metricName?: string;
  readonly windowSeconds?: number;
  readonly result?: number;
  readonly computedAtISO?: string;
  readonly createdAtISO: string;
}
⋮----
export interface EventProjectionRepository {
  save(projection: EventProjection): Promise<void>;
  findById(id: string): Promise<EventProjection | null>;
  findByName(name: string): Promise<EventProjection | null>;
  listAll(): Promise<EventProjection[]>;
}
⋮----
save(projection: EventProjection): Promise<void>;
findById(id: string): Promise<EventProjection | null>;
findByName(name: string): Promise<EventProjection | null>;
listAll(): Promise<EventProjection[]>;
````

## File: src/modules/analytics/subdomains/event-projection/domain/index.ts
````typescript
// event-projection — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/analytics/subdomains/experimentation/adapters/inbound/index.ts
````typescript
// experimentation — adapters/inbound placeholder
// TODO: export inbound adapters (HTTP handlers, action wrappers)
````

## File: src/modules/analytics/subdomains/experimentation/adapters/index.ts
````typescript
// experimentation — adapters aggregate
````

## File: src/modules/analytics/subdomains/experimentation/adapters/outbound/index.ts
````typescript
// experimentation — adapters/outbound placeholder
// TODO: export outbound adapters (repository implementations, external services)
````

## File: src/modules/analytics/subdomains/experimentation/application/index.ts
````typescript
// experimentation — application layer placeholder
// TODO: export use-cases, DTOs, application services
````

## File: src/modules/analytics/subdomains/experimentation/application/use-cases/ExperimentUseCases.ts
````typescript
// TODO: implement experiment lifecycle and variant assignment use-cases
````

## File: src/modules/analytics/subdomains/experimentation/domain/entities/Experiment.ts
````typescript
export type ExperimentStatus = "draft" | "running" | "paused" | "completed";
⋮----
export interface Experiment {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly variants: string[];
  readonly trafficAllocation: Record<string, number>;
  readonly status: ExperimentStatus;
  readonly workspaceId?: string;
  readonly startedAtISO?: string;
  readonly endedAtISO?: string;
  readonly createdAtISO: string;
}
⋮----
export interface ExperimentRepository {
  save(experiment: Experiment): Promise<void>;
  findById(id: string): Promise<Experiment | null>;
  findRunning(workspaceId?: string): Promise<Experiment[]>;
  assignVariant(experimentId: string, actorId: string): Promise<string>;
}
⋮----
save(experiment: Experiment): Promise<void>;
findById(id: string): Promise<Experiment | null>;
findRunning(workspaceId?: string): Promise<Experiment[]>;
assignVariant(experimentId: string, actorId: string): Promise<string>;
````

## File: src/modules/analytics/subdomains/experimentation/domain/index.ts
````typescript
// experimentation — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/analytics/subdomains/insights/adapters/inbound/index.ts
````typescript
// insights — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/analytics/subdomains/insights/adapters/index.ts
````typescript
// insights — adapters aggregate
````

## File: src/modules/analytics/subdomains/insights/adapters/outbound/index.ts
````typescript
// insights — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/analytics/subdomains/insights/application/index.ts
````typescript
// insights — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/analytics/subdomains/insights/application/use-cases/InsightUseCases.ts
````typescript
// TODO: implement insight generation use-cases
// Depends on MetricRepository and InsightRepository
````

## File: src/modules/analytics/subdomains/insights/domain/entities/Insight.ts
````typescript
export interface Insight {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: "usage" | "performance" | "engagement" | "anomaly";
  readonly severity: "info" | "warning" | "critical";
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly data: Record<string, unknown>;
  readonly generatedAtISO: string;
}
⋮----
export interface InsightRepository {
  save(insight: Insight): Promise<void>;
  findById(id: string): Promise<Insight | null>;
  listForWorkspace(workspaceId: string, limit?: number): Promise<Insight[]>;
  listForOrganization(organizationId: string, limit?: number): Promise<Insight[]>;
}
⋮----
save(insight: Insight): Promise<void>;
findById(id: string): Promise<Insight | null>;
listForWorkspace(workspaceId: string, limit?: number): Promise<Insight[]>;
listForOrganization(organizationId: string, limit?: number): Promise<Insight[]>;
````

## File: src/modules/analytics/subdomains/insights/domain/index.ts
````typescript
// insights — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/analytics/subdomains/metrics/adapters/inbound/index.ts
````typescript
// metrics — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/analytics/subdomains/metrics/adapters/index.ts
````typescript
// metrics — adapters aggregate
````

## File: src/modules/analytics/subdomains/metrics/adapters/outbound/index.ts
````typescript
// metrics — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/analytics/subdomains/metrics/adapters/outbound/memory/InMemoryMetricRepository.ts
````typescript
import type { MetricSnapshot, MetricType } from "../../../domain/entities/Metric";
import type { MetricRepository, MetricQuery } from "../../../domain/repositories/MetricRepository";
⋮----
export class InMemoryMetricRepository implements MetricRepository {
⋮----
async save(snapshot: MetricSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<MetricSnapshot | null>
⋮----
async query(params: MetricQuery): Promise<MetricSnapshot[]>
⋮----
async sumByName(name: string, params?: MetricQuery): Promise<number>
⋮----
async avgByName(name: string, params?: MetricQuery): Promise<number>
````

## File: src/modules/analytics/subdomains/metrics/application/index.ts
````typescript

````

## File: src/modules/analytics/subdomains/metrics/application/use-cases/MetricUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Metric, type RecordMetricInput } from "../../domain/entities/Metric";
import type { MetricRepository, MetricQuery } from "../../domain/repositories/MetricRepository";
⋮----
export class RecordMetricUseCase {
⋮----
constructor(private readonly repo: MetricRepository)
⋮----
async execute(input: RecordMetricInput): Promise<CommandResult>
⋮----
export class QueryMetricsUseCase {
⋮----
async execute(params: MetricQuery)
⋮----
export class SumMetricUseCase {
⋮----
async execute(name: string, params?: MetricQuery): Promise<number>
````

## File: src/modules/analytics/subdomains/metrics/domain/entities/Metric.ts
````typescript
import { z } from "zod";
import { v4 as uuid } from "uuid";
⋮----
export type MetricId = z.infer<typeof MetricIdSchema>;
⋮----
export type MetricType = z.infer<typeof MetricTypeSchema>;
⋮----
export interface MetricSnapshot {
  readonly id: string;
  readonly name: string;
  readonly type: MetricType;
  readonly value: number;
  readonly labels: Record<string, string>;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly timestampISO: string;
}
⋮----
export interface RecordMetricInput {
  readonly name: string;
  readonly type: MetricType;
  readonly value: number;
  readonly labels?: Record<string, string>;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly timestampISO?: string;
}
⋮----
export class Metric {
⋮----
private constructor(private readonly _props: MetricSnapshot)
⋮----
static record(input: RecordMetricInput): Metric
⋮----
static reconstitute(snapshot: MetricSnapshot): Metric
⋮----
get id(): string
get name(): string
get type(): MetricType
get value(): number
get timestampISO(): string
⋮----
getSnapshot(): Readonly<MetricSnapshot>
````

## File: src/modules/analytics/subdomains/metrics/domain/index.ts
````typescript

````

## File: src/modules/analytics/subdomains/metrics/domain/repositories/MetricRepository.ts
````typescript
import type { MetricSnapshot, MetricType } from "../entities/Metric";
⋮----
export interface MetricQuery {
  readonly name?: string;
  readonly type?: MetricType;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly limit?: number;
}
⋮----
export interface MetricRepository {
  save(snapshot: MetricSnapshot): Promise<void>;
  findById(id: string): Promise<MetricSnapshot | null>;
  query(params: MetricQuery): Promise<MetricSnapshot[]>;
  sumByName(name: string, params?: MetricQuery): Promise<number>;
  avgByName(name: string, params?: MetricQuery): Promise<number>;
}
⋮----
save(snapshot: MetricSnapshot): Promise<void>;
findById(id: string): Promise<MetricSnapshot | null>;
query(params: MetricQuery): Promise<MetricSnapshot[]>;
sumByName(name: string, params?: MetricQuery): Promise<number>;
avgByName(name: string, params?: MetricQuery): Promise<number>;
````

## File: src/modules/analytics/subdomains/metrics/domain/value-objects/MetricName.ts
````typescript
import { z } from "zod";
⋮----
export type MetricName = z.infer<typeof MetricNameSchema>;
⋮----
export type MetricValue = z.infer<typeof MetricValueSchema>;
````

## File: src/modules/analytics/subdomains/realtime-insights/adapters/inbound/index.ts
````typescript
// realtime-insights — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/analytics/subdomains/realtime-insights/adapters/index.ts
````typescript
// realtime-insights — adapters aggregate
````

## File: src/modules/analytics/subdomains/realtime-insights/adapters/outbound/index.ts
````typescript
// realtime-insights — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/analytics/subdomains/realtime-insights/application/index.ts
````typescript
// realtime-insights — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/analytics/subdomains/realtime-insights/application/use-cases/RealtimeInsightUseCases.ts
````typescript
// TODO: implement use-cases for real-time metric ingestion and query
// Depends on RealtimeInsightPort
````

## File: src/modules/analytics/subdomains/realtime-insights/domain/entities/RealtimeMetric.ts
````typescript
export interface RealtimeMetricSample {
  readonly id: string;
  readonly name: string;
  readonly value: number;
  readonly labels: Record<string, string>;
  readonly sampledAtISO: string;
}
⋮----
export interface RealtimeMetricWindow {
  readonly metric: string;
  readonly windowSeconds: number;
  readonly samples: RealtimeMetricSample[];
  readonly aggregated: number;
}
⋮----
export interface RealtimeInsightPort {
  /** Pushes a sample to the real-time buffer. */
  push(sample: RealtimeMetricSample): Promise<void>;
  /** Returns aggregated window data. */
  queryWindow(metric: string, windowSeconds: number): Promise<RealtimeMetricWindow>;
}
⋮----
/** Pushes a sample to the real-time buffer. */
push(sample: RealtimeMetricSample): Promise<void>;
/** Returns aggregated window data. */
queryWindow(metric: string, windowSeconds: number): Promise<RealtimeMetricWindow>;
````

## File: src/modules/analytics/subdomains/realtime-insights/domain/index.ts
````typescript
// realtime-insights — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/billing/index.ts
````typescript
/**
 * Billing Module — public API surface.
 * All cross-module consumers must import from here only.
 */
⋮----
// entitlement
⋮----
// subscription
⋮----
// usage-metering
````

## File: src/modules/billing/orchestration/index.ts
````typescript
// billing — orchestration layer
// Cross-subdomain composition and facade lives here.
// TODO: implement BillingFacade if needed.
````

## File: src/modules/billing/shared/errors/index.ts
````typescript
// billing shared/errors placeholder
````

## File: src/modules/billing/shared/events/index.ts
````typescript
// billing shared/events placeholder
````

## File: src/modules/billing/shared/index.ts
````typescript

````

## File: src/modules/billing/shared/types/index.ts
````typescript
// billing shared/types placeholder
````

## File: src/modules/billing/subdomains/entitlement/adapters/inbound/http/EntitlementController.ts
````typescript
import type { CommandResult } from '../../../../../../shared';
import {
  GrantEntitlementUseCase,
  SuspendEntitlementUseCase,
  RevokeEntitlementUseCase,
  CheckFeatureEntitlementUseCase,
} from '../../../application/use-cases/EntitlementUseCases';
import type { EntitlementGrantRepository } from '../../../domain/repositories/EntitlementGrantRepository';
⋮----
export class EntitlementController {
⋮----
constructor(repo: EntitlementGrantRepository)
⋮----
async handleGrant(body: {
    contextId: string;
    featureKey: string;
    quota?: number | null;
    expiresAt?: string | null;
}): Promise<CommandResult>
⋮----
async handleSuspend(entitlementId: string): Promise<CommandResult>
⋮----
async handleRevoke(entitlementId: string): Promise<CommandResult>
⋮----
async handleCheck(contextId: string, featureKey: string): Promise<CommandResult>
````

## File: src/modules/billing/subdomains/entitlement/adapters/inbound/index.ts
````typescript
// entitlement — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/billing/subdomains/entitlement/adapters/index.ts
````typescript
// outbound
⋮----
// inbound
````

## File: src/modules/billing/subdomains/entitlement/adapters/outbound/firestore/FirestoreEntitlementGrantRepository.ts
````typescript
import type { EntitlementGrantSnapshot } from '../../../domain/entities/EntitlementGrant';
import type { EntitlementGrantRepository } from '../../../domain/repositories/EntitlementGrantRepository';
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
⋮----
export class FirestoreEntitlementGrantRepository implements EntitlementGrantRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(id: string): Promise<EntitlementGrantSnapshot | null>
⋮----
async findByContextId(_contextId: string): Promise<EntitlementGrantSnapshot[]>
⋮----
async findActiveByContextAndFeature(
    _contextId: string,
    _featureKey: string,
): Promise<EntitlementGrantSnapshot | null>
⋮----
async save(snapshot: EntitlementGrantSnapshot): Promise<void>
⋮----
async update(snapshot: EntitlementGrantSnapshot): Promise<void>
````

## File: src/modules/billing/subdomains/entitlement/adapters/outbound/index.ts
````typescript
// entitlement — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/billing/subdomains/entitlement/application/dto/EntitlementDTO.ts
````typescript
import type { EntitlementGrantSnapshot } from '../../domain/entities/EntitlementGrant';
⋮----
export type EntitlementGrantView = Readonly<EntitlementGrantSnapshot>;
⋮----
export interface EntitlementSignal {
  readonly contextId: string;
  readonly activeFeatures: string[];
  readonly grants: EntitlementGrantView[];
}
````

## File: src/modules/billing/subdomains/entitlement/application/index.ts
````typescript
// use-cases
⋮----
// dto
⋮----
// ports outbound
````

## File: src/modules/billing/subdomains/entitlement/application/ports/outbound/EntitlementRepositoryPort.ts
````typescript
import type { EntitlementGrantRepository } from '../../../domain/repositories/EntitlementGrantRepository';
⋮----
export type EntitlementRepositoryPort = EntitlementGrantRepository;
````

## File: src/modules/billing/subdomains/entitlement/application/use-cases/EntitlementUseCases.ts
````typescript
import { v4 as uuid } from 'uuid';
import { commandSuccess, commandFailureFrom, type CommandResult } from '../../../../../shared';
import { EntitlementGrant } from '../../domain/entities/EntitlementGrant';
import type { EntitlementGrantRepository } from '../../domain/repositories/EntitlementGrantRepository';
⋮----
export class GrantEntitlementUseCase {
⋮----
constructor(private readonly repo: EntitlementGrantRepository)
⋮----
async execute(input: {
    contextId: string;
    featureKey: string;
    quota?: number | null;
    expiresAt?: string | null;
}): Promise<CommandResult>
⋮----
export class SuspendEntitlementUseCase {
⋮----
async execute(entitlementId: string): Promise<CommandResult>
⋮----
export class RevokeEntitlementUseCase {
⋮----
export class ResolveEntitlementsUseCase {
⋮----
async execute(contextId: string): Promise<CommandResult>
⋮----
export class CheckFeatureEntitlementUseCase {
⋮----
async execute(contextId: string, featureKey: string): Promise<CommandResult>
````

## File: src/modules/billing/subdomains/entitlement/domain/entities/EntitlementGrant.ts
````typescript
import { v4 as uuid } from 'uuid';
import type { EntitlementGrantDomainEventType } from '../events/EntitlementGrantDomainEvent';
import { createEntitlementId } from '../value-objects/EntitlementId';
import { canSuspend, canRevoke } from '../value-objects/EntitlementStatus';
import type { EntitlementStatus } from '../value-objects/EntitlementStatus';
⋮----
export interface EntitlementGrantSnapshot {
  readonly id: string;
  readonly contextId: string;
  readonly featureKey: string;
  readonly quota: number | null;
  readonly status: EntitlementStatus;
  readonly grantedAt: string;
  readonly expiresAt: string | null;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateEntitlementGrantInput {
  readonly contextId: string;
  readonly featureKey: string;
  readonly quota?: number | null;
  readonly expiresAt?: string | null;
}
⋮----
export class EntitlementGrant {
⋮----
private constructor(private _props: EntitlementGrantSnapshot)
⋮----
static create(id: string, input: CreateEntitlementGrantInput): EntitlementGrant
⋮----
static reconstitute(snapshot: EntitlementGrantSnapshot): EntitlementGrant
⋮----
suspend(): void
⋮----
revoke(): void
⋮----
expire(): void
⋮----
get id(): string
get contextId(): string
get featureKey(): string
get quota(): number | null
get status(): EntitlementStatus
get grantedAt(): string
get expiresAt(): string | null
get isActive(): boolean
⋮----
getSnapshot(): Readonly<EntitlementGrantSnapshot>
⋮----
pullDomainEvents(): EntitlementGrantDomainEventType[]
````

## File: src/modules/billing/subdomains/entitlement/domain/events/EntitlementGrantDomainEvent.ts
````typescript
export interface EntitlementGrantDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface EntitlementGrantedEvent extends EntitlementGrantDomainEvent {
  readonly type: 'platform.entitlement.granted';
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
    readonly featureKey: string;
    readonly quota: number | null;
  };
}
⋮----
export interface EntitlementSuspendedEvent extends EntitlementGrantDomainEvent {
  readonly type: 'platform.entitlement.suspended';
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
  };
}
⋮----
export interface EntitlementRevokedEvent extends EntitlementGrantDomainEvent {
  readonly type: 'platform.entitlement.revoked';
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
  };
}
⋮----
export interface EntitlementExpiredEvent extends EntitlementGrantDomainEvent {
  readonly type: 'platform.entitlement.expired';
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
  };
}
⋮----
export type EntitlementGrantDomainEventType =
  | EntitlementGrantedEvent
  | EntitlementSuspendedEvent
  | EntitlementRevokedEvent
  | EntitlementExpiredEvent;
````

## File: src/modules/billing/subdomains/entitlement/domain/index.ts
````typescript
// entities
⋮----
// value-objects
⋮----
// events
⋮----
// repositories
````

## File: src/modules/billing/subdomains/entitlement/domain/repositories/EntitlementGrantRepository.ts
````typescript
import type { EntitlementGrantSnapshot } from '../entities/EntitlementGrant';
⋮----
export interface EntitlementGrantRepository {
  findById(id: string): Promise<EntitlementGrantSnapshot | null>;
  findByContextId(contextId: string): Promise<EntitlementGrantSnapshot[]>;
  findActiveByContextAndFeature(
    contextId: string,
    featureKey: string,
  ): Promise<EntitlementGrantSnapshot | null>;
  save(snapshot: EntitlementGrantSnapshot): Promise<void>;
  update(snapshot: EntitlementGrantSnapshot): Promise<void>;
}
⋮----
findById(id: string): Promise<EntitlementGrantSnapshot | null>;
findByContextId(contextId: string): Promise<EntitlementGrantSnapshot[]>;
findActiveByContextAndFeature(
    contextId: string,
    featureKey: string,
  ): Promise<EntitlementGrantSnapshot | null>;
save(snapshot: EntitlementGrantSnapshot): Promise<void>;
update(snapshot: EntitlementGrantSnapshot): Promise<void>;
````

## File: src/modules/billing/subdomains/entitlement/domain/value-objects/EntitlementId.ts
````typescript
import { z } from 'zod';
⋮----
export type EntitlementId = z.infer<typeof EntitlementIdSchema>;
⋮----
export function createEntitlementId(raw: string): EntitlementId
````

## File: src/modules/billing/subdomains/entitlement/domain/value-objects/EntitlementStatus.ts
````typescript
export type EntitlementStatus = (typeof ENTITLEMENT_STATUSES)[number];
⋮----
export function canSuspend(status: EntitlementStatus): boolean
⋮----
export function canRevoke(status: EntitlementStatus): boolean
⋮----
export function isActiveStatus(status: EntitlementStatus): boolean
````

## File: src/modules/billing/subdomains/entitlement/domain/value-objects/FeatureKey.ts
````typescript
import { z } from 'zod';
⋮----
export type FeatureKey = z.infer<typeof FeatureKeySchema>;
⋮----
export function createFeatureKey(raw: string): FeatureKey
````

## File: src/modules/billing/subdomains/subscription/adapters/inbound/http/SubscriptionController.ts
````typescript
import type { CommandResult } from '../../../../../../shared';
import {
  ActivateSubscriptionUseCase,
  CancelSubscriptionUseCase,
  RenewSubscriptionUseCase,
  GetActiveSubscriptionUseCase,
  MarkSubscriptionPastDueUseCase,
} from '../../../application/use-cases/SubscriptionUseCases';
import type { SubscriptionRepository } from '../../../domain/repositories/SubscriptionRepository';
import type { BillingCycle } from '../../../domain/value-objects/BillingCycle';
⋮----
export class SubscriptionController {
⋮----
constructor(repo: SubscriptionRepository)
⋮----
async handleActivate(body: {
    contextId: string;
    planCode: string;
    billingCycle: BillingCycle;
    currentPeriodEnd?: string | null;
}): Promise<CommandResult>
⋮----
async handleCancel(subscriptionId: string): Promise<CommandResult>
⋮----
async handleRenew(subscriptionId: string, newPeriodEnd: string): Promise<CommandResult>
⋮----
async handleGetActive(contextId: string): Promise<CommandResult>
⋮----
async handleMarkPastDue(subscriptionId: string): Promise<CommandResult>
````

## File: src/modules/billing/subdomains/subscription/adapters/inbound/index.ts
````typescript

````

## File: src/modules/billing/subdomains/subscription/adapters/index.ts
````typescript
// outbound
⋮----
// inbound
````

## File: src/modules/billing/subdomains/subscription/adapters/outbound/firestore/FirestoreSubscriptionRepository.ts
````typescript
import type { SubscriptionSnapshot } from '../../../domain/entities/Subscription';
import type { SubscriptionRepository } from '../../../domain/repositories/SubscriptionRepository';
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
⋮----
export class FirestoreSubscriptionRepository implements SubscriptionRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(id: string): Promise<SubscriptionSnapshot | null>
⋮----
async findActiveByContextId(_contextId: string): Promise<SubscriptionSnapshot | null>
⋮----
async findByContextId(_contextId: string): Promise<SubscriptionSnapshot[]>
⋮----
async save(snapshot: SubscriptionSnapshot): Promise<void>
⋮----
async update(snapshot: SubscriptionSnapshot): Promise<void>
````

## File: src/modules/billing/subdomains/subscription/adapters/outbound/index.ts
````typescript

````

## File: src/modules/billing/subdomains/subscription/application/dto/SubscriptionDTO.ts
````typescript
import type { SubscriptionSnapshot } from '../../domain/entities/Subscription';
⋮----
export type SubscriptionView = Readonly<SubscriptionSnapshot>;
⋮----
export interface SubscriptionSummary {
  readonly contextId: string;
  readonly planCode: string;
  readonly status: string;
  readonly isActive: boolean;
  readonly currentPeriodEnd: string | null;
}
````

## File: src/modules/billing/subdomains/subscription/application/index.ts
````typescript
// use-cases
⋮----
// dto
⋮----
// ports outbound
````

## File: src/modules/billing/subdomains/subscription/application/ports/outbound/SubscriptionRepositoryPort.ts
````typescript
import type { SubscriptionRepository } from '../../../domain/repositories/SubscriptionRepository';
⋮----
export type SubscriptionRepositoryPort = SubscriptionRepository;
````

## File: src/modules/billing/subdomains/subscription/application/use-cases/SubscriptionUseCases.ts
````typescript
import { v4 as uuid } from 'uuid';
import { commandSuccess, commandFailureFrom, type CommandResult } from '../../../../../shared';
import { Subscription } from '../../domain/entities/Subscription';
import type { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';
import type { BillingCycle } from '../../domain/value-objects/BillingCycle';
⋮----
export class ActivateSubscriptionUseCase {
⋮----
constructor(private readonly repo: SubscriptionRepository)
⋮----
async execute(input: {
    contextId: string;
    planCode: string;
    billingCycle: BillingCycle;
    currentPeriodEnd?: string | null;
}): Promise<CommandResult>
⋮----
export class CancelSubscriptionUseCase {
⋮----
async execute(subscriptionId: string): Promise<CommandResult>
⋮----
export class RenewSubscriptionUseCase {
⋮----
async execute(subscriptionId: string, newPeriodEnd: string): Promise<CommandResult>
⋮----
export class GetActiveSubscriptionUseCase {
⋮----
async execute(contextId: string): Promise<CommandResult>
⋮----
export class MarkSubscriptionPastDueUseCase {
````

## File: src/modules/billing/subdomains/subscription/domain/entities/Subscription.ts
````typescript
import { v4 as uuid } from 'uuid';
import type { SubscriptionDomainEventType } from '../events/SubscriptionDomainEvent';
import { createSubscriptionId } from '../value-objects/SubscriptionId';
import { canCancel, canRenew } from '../value-objects/SubscriptionStatus';
import type { SubscriptionStatus } from '../value-objects/SubscriptionStatus';
import type { BillingCycle } from '../value-objects/BillingCycle';
⋮----
export interface SubscriptionSnapshot {
  readonly id: string;
  readonly contextId: string;
  readonly planCode: string;
  readonly billingCycle: BillingCycle;
  readonly status: SubscriptionStatus;
  readonly currentPeriodStart: string;
  readonly currentPeriodEnd: string | null;
  readonly cancelledAt: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateSubscriptionInput {
  readonly contextId: string;
  readonly planCode: string;
  readonly billingCycle: BillingCycle;
  readonly currentPeriodStart?: string;
  readonly currentPeriodEnd?: string | null;
}
⋮----
export class Subscription {
⋮----
private constructor(private _props: SubscriptionSnapshot)
⋮----
static create(id: string, input: CreateSubscriptionInput): Subscription
⋮----
static reconstitute(snapshot: SubscriptionSnapshot): Subscription
⋮----
cancel(): void
⋮----
renew(newPeriodEnd: string): void
⋮----
markPastDue(): void
⋮----
expire(): void
⋮----
get id(): string
get contextId(): string
get planCode(): string
get billingCycle(): BillingCycle
get status(): SubscriptionStatus
get currentPeriodEnd(): string | null
get cancelledAt(): string | null
get isActive(): boolean
⋮----
getSnapshot(): Readonly<SubscriptionSnapshot>
⋮----
pullDomainEvents(): SubscriptionDomainEventType[]
````

## File: src/modules/billing/subdomains/subscription/domain/events/SubscriptionDomainEvent.ts
````typescript
import type { BillingCycle } from '../value-objects/BillingCycle';
⋮----
export interface SubscriptionDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface SubscriptionActivatedEvent extends SubscriptionDomainEvent {
  readonly type: 'platform.subscription.activated';
  readonly payload: {
    readonly subscriptionId: string;
    readonly contextId: string;
    readonly planCode: string;
    readonly billingCycle: BillingCycle;
  };
}
⋮----
export interface SubscriptionCancelledEvent extends SubscriptionDomainEvent {
  readonly type: 'platform.subscription.cancelled';
  readonly payload: { readonly subscriptionId: string; readonly contextId: string };
}
⋮----
export interface SubscriptionRenewedEvent extends SubscriptionDomainEvent {
  readonly type: 'platform.subscription.renewed';
  readonly payload: {
    readonly subscriptionId: string;
    readonly contextId: string;
    readonly newPeriodEnd: string;
  };
}
⋮----
export interface SubscriptionPastDueEvent extends SubscriptionDomainEvent {
  readonly type: 'platform.subscription.past_due';
  readonly payload: { readonly subscriptionId: string; readonly contextId: string };
}
⋮----
export interface SubscriptionExpiredEvent extends SubscriptionDomainEvent {
  readonly type: 'platform.subscription.expired';
  readonly payload: { readonly subscriptionId: string; readonly contextId: string };
}
⋮----
export type SubscriptionDomainEventType =
  | SubscriptionActivatedEvent
  | SubscriptionCancelledEvent
  | SubscriptionRenewedEvent
  | SubscriptionPastDueEvent
  | SubscriptionExpiredEvent;
````

## File: src/modules/billing/subdomains/subscription/domain/index.ts
````typescript
// entities
⋮----
// value-objects
⋮----
// events
⋮----
// repositories
````

## File: src/modules/billing/subdomains/subscription/domain/repositories/SubscriptionRepository.ts
````typescript
import type { SubscriptionSnapshot } from '../entities/Subscription';
⋮----
export interface SubscriptionRepository {
  findById(id: string): Promise<SubscriptionSnapshot | null>;
  findActiveByContextId(contextId: string): Promise<SubscriptionSnapshot | null>;
  findByContextId(contextId: string): Promise<SubscriptionSnapshot[]>;
  save(snapshot: SubscriptionSnapshot): Promise<void>;
  update(snapshot: SubscriptionSnapshot): Promise<void>;
}
⋮----
findById(id: string): Promise<SubscriptionSnapshot | null>;
findActiveByContextId(contextId: string): Promise<SubscriptionSnapshot | null>;
findByContextId(contextId: string): Promise<SubscriptionSnapshot[]>;
save(snapshot: SubscriptionSnapshot): Promise<void>;
update(snapshot: SubscriptionSnapshot): Promise<void>;
````

## File: src/modules/billing/subdomains/subscription/domain/value-objects/BillingCycle.ts
````typescript
export type BillingCycle = 'monthly' | 'annual' | 'lifetime';
⋮----
export function cycleMonths(cycle: BillingCycle): number | null
⋮----
return null; // lifetime
````

## File: src/modules/billing/subdomains/subscription/domain/value-objects/PlanCode.ts
````typescript
import { z } from 'zod';
⋮----
export type PlanCodeLiteral = (typeof PLAN_CODES)[number];
⋮----
export type PlanCode = z.infer<typeof PlanCodeSchema>;
⋮----
export function createPlanCode(raw: string): PlanCode
````

## File: src/modules/billing/subdomains/subscription/domain/value-objects/SubscriptionId.ts
````typescript
import { z } from 'zod';
⋮----
export type SubscriptionId = z.infer<typeof SubscriptionIdSchema>;
⋮----
export function createSubscriptionId(raw: string): SubscriptionId
````

## File: src/modules/billing/subdomains/subscription/domain/value-objects/SubscriptionStatus.ts
````typescript
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];
⋮----
export function canCancel(status: SubscriptionStatus): boolean
⋮----
export function canRenew(status: SubscriptionStatus): boolean
⋮----
export function isActive(status: SubscriptionStatus): boolean
````

## File: src/modules/billing/subdomains/usage-metering/adapters/inbound/index.ts
````typescript
// usage-metering — adapters/inbound placeholder
// TODO: export inbound adapters (HTTP handlers, action wrappers)
````

## File: src/modules/billing/subdomains/usage-metering/adapters/index.ts
````typescript
// usage-metering — adapters aggregate
````

## File: src/modules/billing/subdomains/usage-metering/adapters/outbound/index.ts
````typescript
// usage-metering — adapters/outbound placeholder
// TODO: export outbound adapters (repository implementations, external services)
````

## File: src/modules/billing/subdomains/usage-metering/adapters/outbound/memory/InMemoryUsageRecordRepository.ts
````typescript
import type { UsageRecordSnapshot, UsageUnit } from "../../../domain/entities/UsageRecord";
import type { UsageRecordRepository, UsageQuery } from "../../../domain/repositories/UsageRecordRepository";
⋮----
export class InMemoryUsageRecordRepository implements UsageRecordRepository {
⋮----
async save(snapshot: UsageRecordSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<UsageRecordSnapshot | null>
⋮----
async query(params: UsageQuery): Promise<UsageRecordSnapshot[]>
⋮----
async sumQuantity(featureKey: string, contextId: string, fromDate?: string, toDate?: string): Promise<number>
````

## File: src/modules/billing/subdomains/usage-metering/application/index.ts
````typescript
// usage-metering — application layer placeholder
// TODO: export use-cases, DTOs, application services
````

## File: src/modules/billing/subdomains/usage-metering/application/use-cases/UsageMeteringUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { UsageRecord, type RecordUsageInput } from "../../domain/entities/UsageRecord";
import type { UsageRecordRepository, UsageQuery } from "../../domain/repositories/UsageRecordRepository";
⋮----
export class RecordUsageUseCase {
⋮----
constructor(private readonly repo: UsageRecordRepository)
⋮----
async execute(input: RecordUsageInput): Promise<CommandResult>
⋮----
export class QueryUsageUseCase {
⋮----
async execute(params: UsageQuery)
⋮----
export class GetUsageSummaryUseCase {
⋮----
async execute(input: {
    featureKey: string;
    contextId: string;
    fromDate?: string;
    toDate?: string;
}): Promise<number>
````

## File: src/modules/billing/subdomains/usage-metering/domain/entities/UsageRecord.ts
````typescript
import { z } from "zod";
import { v4 as uuid } from "uuid";
⋮----
export type UsageRecordId = z.infer<typeof UsageRecordIdSchema>;
⋮----
export type UsageUnit = z.infer<typeof UsageUnitSchema>;
⋮----
export interface UsageRecordSnapshot {
  readonly id: string;
  readonly contextId: string;
  readonly featureKey: string;
  readonly quantity: number;
  readonly unit: UsageUnit;
  readonly metadata?: Record<string, unknown>;
  readonly recordedAtISO: string;
}
⋮----
export interface RecordUsageInput {
  readonly contextId: string;
  readonly featureKey: string;
  readonly quantity: number;
  readonly unit: UsageUnit;
  readonly metadata?: Record<string, unknown>;
}
⋮----
export class UsageRecord {
⋮----
private constructor(private readonly _props: UsageRecordSnapshot)
⋮----
static record(input: RecordUsageInput): UsageRecord
⋮----
static reconstitute(snapshot: UsageRecordSnapshot): UsageRecord
⋮----
get id(): string
get contextId(): string
get featureKey(): string
get quantity(): number
get unit(): UsageUnit
get recordedAtISO(): string
⋮----
getSnapshot(): Readonly<UsageRecordSnapshot>
````

## File: src/modules/billing/subdomains/usage-metering/domain/index.ts
````typescript
// usage-metering — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/billing/subdomains/usage-metering/domain/repositories/UsageRecordRepository.ts
````typescript
import type { UsageRecordSnapshot, UsageUnit } from "../entities/UsageRecord";
⋮----
export interface UsageQuery {
  readonly contextId?: string;
  readonly featureKey?: string;
  readonly unit?: UsageUnit;
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly limit?: number;
}
⋮----
export interface UsageRecordRepository {
  save(snapshot: UsageRecordSnapshot): Promise<void>;
  findById(id: string): Promise<UsageRecordSnapshot | null>;
  query(params: UsageQuery): Promise<UsageRecordSnapshot[]>;
  sumQuantity(featureKey: string, contextId: string, fromDate?: string, toDate?: string): Promise<number>;
}
⋮----
save(snapshot: UsageRecordSnapshot): Promise<void>;
findById(id: string): Promise<UsageRecordSnapshot | null>;
query(params: UsageQuery): Promise<UsageRecordSnapshot[]>;
sumQuantity(featureKey: string, contextId: string, fromDate?: string, toDate?: string): Promise<number>;
````

## File: src/modules/iam/adapters/inbound/react/AuthContext.tsx
````typescript
/**
 * AuthContext — iam inbound adapter (React).
 *
 * Provides the AuthProvider component and useAuth hook.
 * Uses the firebase-composition outbound adapter for all Firebase operations
 * so this file remains free of direct Firebase SDK imports.
 */
⋮----
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  subscribeToAuthState,
  firebaseSignOut,
  createClientAuthUseCases as buildAuthUseCases,
  createClientAccountUseCases as buildAccountUseCases,
} from "../../outbound/firebase-composition";
⋮----
// ─── Auth bootstrapping timeout ───────────────────────────────────────────────
// If Firebase hasn't resolved the auth state within this window, treat the
// session as unauthenticated so the UI isn't blocked indefinitely.
⋮----
// ─── Public types ─────────────────────────────────────────────────────────────
⋮----
export interface AuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}
⋮----
export type AuthStatus = "initializing" | "authenticated" | "unauthenticated" | "anonymous";
⋮----
export interface AuthState {
  readonly user: AuthUser | null;
  readonly status: AuthStatus;
}
⋮----
export interface AuthContextValue {
  readonly state: AuthState;
  readonly logout: () => Promise<void>;
}
⋮----
// ─── Context ──────────────────────────────────────────────────────────────────
⋮----
// ─── Provider ─────────────────────────────────────────────────────────────────
⋮----
export function AuthProvider(
⋮----
// Bootstrap timeout: if Firebase doesn't resolve within the window,
// fall back to unauthenticated so the UI is never permanently blocked.
⋮----
async function logout()
⋮----
// State will be updated by the onAuthStateChanged listener above.
⋮----
// ─── Hook ─────────────────────────────────────────────────────────────────────
⋮----
export function useAuth(): AuthContextValue
⋮----
// ─── Use-case factories (re-exported from outbound composition) ───────────────
⋮----
/**
 * Returns Firebase-backed auth use cases.
 * Calling this in a component is safe: each call shares singleton repositories.
 */
⋮----
/**
 * Returns Firebase-backed account use cases.
 */
````

## File: src/modules/iam/adapters/inbound/react/IamSessionProvider.tsx
````typescript
/**
 * IamSessionProvider — iam inbound adapter (React).
 *
 * Canonical mount point for IAM authentication session state.
 * Wraps the identity-layer AuthProvider and exposes the useIamSession() hook
 * so the rest of the src/ tree never imports directly from the old interfaces/.
 *
 * Internal source: modules/iam/subdomains/identity/interfaces/providers/auth-provider.tsx
 */
````

## File: src/modules/iam/adapters/inbound/react/index.ts
````typescript
/**
 * iam inbound React adapter — barrel.
 *
 * Public surface for all IAM React inbound adapters.
 * Consumed by src/app/ route shims and platform/adapters/inbound/react/.
 */
⋮----
// Re-export account subscription for consumers that don't go through AppContext.
````

## File: src/modules/iam/adapters/outbound/FirebaseAccountQueryRepository.ts
````typescript
/**
 * FirebaseAccountQueryRepository — module-level outbound adapter (read side).
 *
 * Implements AccountQueryRepository using Firestore real-time listeners.
 * Lives at the iam module outbound boundary so that @integration-firebase
 * is allowed per ESLint boundary rules (src/modules/<context>/adapters/outbound/**).
 */
⋮----
import { firebaseClientApp } from "@packages";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  onSnapshot,
  type Timestamp,
} from "firebase/firestore";
⋮----
import type {
  AccountQueryRepository,
  WalletBalanceSnapshot,
  Unsubscribe,
} from "../../subdomains/account/domain/repositories/AccountQueryRepository";
import type {
  WalletTransaction,
  AccountRoleRecord,
} from "../../subdomains/account/domain/repositories/AccountRepository";
import type { AccountSnapshot } from "../../subdomains/account/domain/entities/Account";
import type { AccountProfile } from "../../subdomains/account/domain/entities/AccountProfile";
⋮----
// ─── Mapper helpers ───────────────────────────────────────────────────────────
⋮----
function toISO(v: unknown): string
⋮----
function toAccountSnapshot(id: string, data: Record<string, unknown>): AccountSnapshot
⋮----
function toAccountProfile(snapshot: AccountSnapshot): AccountProfile
⋮----
// ─── Repository ───────────────────────────────────────────────────────────────
⋮----
export class FirebaseAccountQueryRepository implements AccountQueryRepository {
⋮----
private get db()
⋮----
async getUserProfile(userId: string): Promise<AccountSnapshot | null>
⋮----
subscribeToUserProfile(
    userId: string,
    onUpdate: (profile: AccountSnapshot | null) => void,
): Unsubscribe
⋮----
async getAccountProfile(actorId: string): Promise<AccountProfile | null>
⋮----
subscribeToAccountProfile(
    actorId: string,
    onUpdate: (profile: AccountProfile | null) => void,
): Unsubscribe
⋮----
async getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot>
⋮----
subscribeToWalletBalance(
    accountId: string,
    onUpdate: (snapshot: WalletBalanceSnapshot) => void,
): Unsubscribe
⋮----
subscribeToWalletTransactions(
    accountId: string,
    maxCount: number,
    onUpdate: (txs: WalletTransaction[]) => void,
): Unsubscribe
⋮----
async getAccountRole(accountId: string): Promise<AccountRoleRecord | null>
⋮----
subscribeToAccountRoles(
    accountId: string,
    onUpdate: (record: AccountRoleRecord | null) => void,
): Unsubscribe
⋮----
subscribeToAccountsForUser(
    userId: string,
    onUpdate: (accounts: Record<string, AccountSnapshot>) => void,
): Unsubscribe
⋮----
const emit = () =>
⋮----
// Organisations owned by the user
⋮----
// Organisations where the user is a member
````

## File: src/modules/iam/adapters/outbound/FirebaseAuthIdentityRepository.ts
````typescript
/**
 * FirebaseAuthIdentityRepository — module-level outbound adapter.
 *
 * Implements IdentityRepository using Firebase Authentication SDK.
 * Lives at the iam module outbound boundary so that @integration-firebase
 * is allowed per ESLint boundary rules (src/modules/<context>/adapters/outbound/**).
 *
 * Domain and application layers are isolated from Firebase via this adapter.
 */
⋮----
import { firebaseClientApp } from "@packages";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
⋮----
import type { IdentityRepository } from "../../subdomains/identity/domain/repositories/IdentityRepository";
import type {
  IdentityEntity,
  RegistrationInput,
  SignInCredentials,
} from "../../subdomains/identity/domain/entities/Identity";
⋮----
function toIdentityEntity(user: User): IdentityEntity
⋮----
export class FirebaseAuthIdentityRepository implements IdentityRepository {
⋮----
private get auth()
⋮----
async signInWithEmailAndPassword(
    credentials: SignInCredentials,
): Promise<IdentityEntity>
⋮----
async signInAnonymously(): Promise<IdentityEntity>
⋮----
async createUserWithEmailAndPassword(
    input: RegistrationInput,
): Promise<IdentityEntity>
⋮----
async updateDisplayName(uid: string, displayName: string): Promise<void>
⋮----
async sendPasswordResetEmail(email: string): Promise<void>
⋮----
async signOut(): Promise<void>
⋮----
getCurrentUser(): IdentityEntity | null
````

## File: src/modules/iam/index.ts
````typescript
/**
 * Iam Module — public API surface.
 * All cross-module consumers must import from here only.
 */
⋮----
// account
// Account aggregate root for account lifecycle and wallet state.
⋮----
// Read-only account projection used across module boundaries.
⋮----
// Account application use cases for profile, wallet, and role operations.
⋮----
// identity
// UserIdentity aggregate root for actor identity state.
⋮----
// Read-only identity projection exposed to other contexts.
⋮----
// access-control
// AccessPolicy aggregate root for permission policy modeling.
⋮----
// Read-only access policy projection for integration boundaries.
⋮----
// Repository contract for access policy persistence.
⋮----
// Policy effect value object type (allow/deny).
⋮----
// Subject reference value object type for policy scope.
⋮----
// Factory for validated subject references.
⋮----
// Resource reference value object type for policy scope.
⋮----
// Factory for validated resource references.
⋮----
// Access-control use cases for policy create/update/evaluate flows.
⋮----
// organization
// Organization aggregate root for organization lifecycle state.
⋮----
// Read-only organization projection for external consumers.
⋮----
// OrganizationTeam aggregate root for team topology and membership.
⋮----
// Repository contract for organization persistence.
⋮----
// Member role value object type for organization members.
⋮----
// Organization status value object type for lifecycle governance.
⋮----
// Organization lifecycle use cases (create/update/delete).
⋮----
// Organization member use cases (invite/recruit/remove/role change).
⋮----
// Team management use cases under organization boundary.
⋮----
// authorization — permission decision helpers
// Pure domain helper to build an allow permission decision.
⋮----
// Authorization domain contracts for permission checking.
⋮----
// Authorization application use cases for single/batch checks.
⋮----
// authentication
// Authentication domain contracts for credential-based sign-in/out flows.
⋮----
// Authentication application use cases for session entry/exit and password reset.
⋮----
// federation
// Federation domain contracts for external identity provider linking.
⋮----
// Federation application use cases for provider link lifecycle.
⋮----
// security-policy
// Security-policy domain contracts for MFA/security governance.
⋮----
// SecurityPolicy aggregate root for policy state changes.
⋮----
// Security policy application use cases for read/update.
⋮----
// session
// Session domain contracts for session snapshots and persistence.
⋮----
// Session aggregate root for authenticated session lifecycle.
⋮----
// Session application use cases for create/query/revoke operations.
⋮----
// tenant
// Factory for validated tenant identifiers.
⋮----
// Tenant domain contracts for tenancy state modeling.
⋮----
// Tenant aggregate root for tenant provisioning and status transitions.
⋮----
// Tenant application use cases for provision/suspend/query.
⋮----
// shared errors
// Shared IAM error types for not-found and permission-denied boundaries.
````

## File: src/modules/iam/orchestration/index.ts
````typescript
// iam — orchestration layer
// Cross-subdomain composition and facade lives here.
// TODO: implement IamFacade if needed.
````

## File: src/modules/iam/shared/errors/index.ts
````typescript
// iam shared errors
export class IamError extends Error {
⋮----
constructor(
    public readonly code: string,
    message: string,
)
⋮----
export class IamNotFoundError extends IamError {
⋮----
constructor(resource: string, id: string)
⋮----
export class IamPermissionDeniedError extends IamError {
⋮----
constructor(action: string)
````

## File: src/modules/iam/shared/events/index.ts
````typescript
// iam shared events — union of all domain events emitted by iam subdomains
````

## File: src/modules/iam/shared/index.ts
````typescript

````

## File: src/modules/iam/shared/types/index.ts
````typescript
// iam shared types
````

## File: src/modules/iam/subdomains/access-control/adapters/inbound/index.ts
````typescript
// access-control — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/iam/subdomains/access-control/adapters/index.ts
````typescript
// access-control — adapters aggregate
````

## File: src/modules/iam/subdomains/access-control/adapters/outbound/index.ts
````typescript
// access-control — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/iam/subdomains/access-control/adapters/outbound/memory/InMemoryAccessPolicyRepository.ts
````typescript
import type {
  AccessPolicyRepository,
} from "../../../domain/repositories/AccessPolicyRepository";
import type { AccessPolicySnapshot } from "../../../domain/aggregates/AccessPolicy";
⋮----
export class InMemoryAccessPolicyRepository implements AccessPolicyRepository {
⋮----
async findById(id: string): Promise<AccessPolicySnapshot | null>
⋮----
async findBySubject(subjectId: string): Promise<AccessPolicySnapshot[]>
⋮----
async findActiveBySubjectAndResource(
    subjectId: string,
    resourceType: string,
    resourceId?: string,
): Promise<AccessPolicySnapshot[]>
⋮----
async save(snapshot: AccessPolicySnapshot): Promise<void>
⋮----
async update(snapshot: AccessPolicySnapshot): Promise<void>
````

## File: src/modules/iam/subdomains/access-control/application/dto/AccessControlDTO.ts
````typescript
import type { AccessPolicySnapshot } from "../../domain/aggregates/AccessPolicy";
⋮----
export type AccessPolicyView = Readonly<AccessPolicySnapshot>;
⋮----
export interface PermissionEvaluationView {
  readonly subjectId: string;
  readonly resourceType: string;
  readonly resourceId?: string;
  readonly action: string;
  readonly allowed: boolean;
  readonly reason: string;
}
````

## File: src/modules/iam/subdomains/access-control/application/index.ts
````typescript

````

## File: src/modules/iam/subdomains/access-control/application/use-cases/AccessControlUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { AccessPolicy } from "../../domain/aggregates/AccessPolicy";
import type { AccessPolicyRepository } from "../../domain/repositories/AccessPolicyRepository";
import type { SubjectRef } from "../../domain/value-objects/SubjectRef";
import type { ResourceRef } from "../../domain/value-objects/ResourceRef";
import type { PolicyEffect } from "../../domain/value-objects/PolicyEffect";
⋮----
// ─── Evaluate Permission ──────────────────────────────────────────────────────
⋮----
export class EvaluatePermissionUseCase {
⋮----
constructor(private readonly repo: AccessPolicyRepository)
⋮----
async execute(input: {
    subjectId: string;
    resourceType: string;
    resourceId?: string;
    action: string;
}): Promise<CommandResult>
⋮----
// ─── Create Access Policy ─────────────────────────────────────────────────────
⋮----
export class CreateAccessPolicyUseCase {
⋮----
async execute(input: {
    subjectRef: SubjectRef;
    resourceRef: ResourceRef;
    actions: string[];
    effect: PolicyEffect;
    conditions?: string[];
}): Promise<CommandResult>
⋮----
// ─── Update Access Policy ─────────────────────────────────────────────────────
⋮----
export class UpdateAccessPolicyUseCase {
⋮----
async execute(
    policyId: string,
    input: { actions?: string[]; effect?: PolicyEffect; conditions?: string[] },
): Promise<CommandResult>
⋮----
// ─── Deactivate Access Policy ─────────────────────────────────────────────────
⋮----
export class DeactivateAccessPolicyUseCase {
⋮----
async execute(policyId: string): Promise<CommandResult>
````

## File: src/modules/iam/subdomains/access-control/domain/aggregates/AccessPolicy.ts
````typescript
import { v4 as uuid } from "uuid";
import type { AccessPolicyDomainEventType } from "../events/AccessPolicyDomainEvent";
import type { SubjectRef } from "../value-objects/SubjectRef";
import type { ResourceRef } from "../value-objects/ResourceRef";
import type { PolicyEffect } from "../value-objects/PolicyEffect";
⋮----
export interface AccessPolicySnapshot {
  readonly id: string;
  readonly subjectRef: SubjectRef;
  readonly resourceRef: ResourceRef;
  readonly actions: readonly string[];
  readonly effect: PolicyEffect;
  readonly conditions: readonly string[];
  readonly isActive: boolean;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateAccessPolicyInput {
  readonly subjectRef: SubjectRef;
  readonly resourceRef: ResourceRef;
  readonly actions: string[];
  readonly effect: PolicyEffect;
  readonly conditions?: string[];
}
⋮----
export class AccessPolicy {
⋮----
private constructor(private _props: AccessPolicySnapshot)
⋮----
static create(id: string, input: CreateAccessPolicyInput): AccessPolicy
⋮----
static reconstitute(snapshot: AccessPolicySnapshot): AccessPolicy
⋮----
update(input: {
    actions?: string[];
    effect?: PolicyEffect;
    conditions?: string[];
}): void
⋮----
deactivate(): void
⋮----
get id(): string
get subjectRef(): SubjectRef
get resourceRef(): ResourceRef
get actions(): readonly string[]
get effect(): PolicyEffect
get conditions(): readonly string[]
get isActive(): boolean
⋮----
getSnapshot(): Readonly<AccessPolicySnapshot>
⋮----
pullDomainEvents(): AccessPolicyDomainEventType[]
````

## File: src/modules/iam/subdomains/access-control/domain/events/AccessPolicyDomainEvent.ts
````typescript
import type { SubjectRef } from "../value-objects/SubjectRef";
import type { ResourceRef } from "../value-objects/ResourceRef";
import type { PolicyEffect } from "../value-objects/PolicyEffect";
⋮----
export interface AccessPolicyDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface AccessPolicyCreatedEvent extends AccessPolicyDomainEvent {
  readonly type: "iam.access_policy.created";
  readonly payload: {
    readonly policyId: string;
    readonly subjectRef: SubjectRef;
    readonly resourceRef: ResourceRef;
    readonly actions: readonly string[];
    readonly effect: PolicyEffect;
  };
}
⋮----
export interface AccessPolicyUpdatedEvent extends AccessPolicyDomainEvent {
  readonly type: "iam.access_policy.updated";
  readonly payload: { readonly policyId: string };
}
⋮----
export interface AccessPolicyDeactivatedEvent extends AccessPolicyDomainEvent {
  readonly type: "iam.access_policy.deactivated";
  readonly payload: { readonly policyId: string };
}
⋮----
export type AccessPolicyDomainEventType =
  | AccessPolicyCreatedEvent
  | AccessPolicyUpdatedEvent
  | AccessPolicyDeactivatedEvent;
````

## File: src/modules/iam/subdomains/access-control/domain/index.ts
````typescript

````

## File: src/modules/iam/subdomains/access-control/domain/repositories/AccessPolicyRepository.ts
````typescript
import type { AccessPolicySnapshot } from "../aggregates/AccessPolicy";
⋮----
export interface AccessPolicyRepository {
  findById(id: string): Promise<AccessPolicySnapshot | null>;
  findBySubject(subjectId: string): Promise<AccessPolicySnapshot[]>;
  findActiveBySubjectAndResource(
    subjectId: string,
    resourceType: string,
    resourceId?: string,
  ): Promise<AccessPolicySnapshot[]>;
  save(snapshot: AccessPolicySnapshot): Promise<void>;
  update(snapshot: AccessPolicySnapshot): Promise<void>;
}
⋮----
findById(id: string): Promise<AccessPolicySnapshot | null>;
findBySubject(subjectId: string): Promise<AccessPolicySnapshot[]>;
findActiveBySubjectAndResource(
    subjectId: string,
    resourceType: string,
    resourceId?: string,
  ): Promise<AccessPolicySnapshot[]>;
save(snapshot: AccessPolicySnapshot): Promise<void>;
update(snapshot: AccessPolicySnapshot): Promise<void>;
````

## File: src/modules/iam/subdomains/access-control/domain/value-objects/PolicyEffect.ts
````typescript
export type PolicyEffect = "allow" | "deny";
⋮----
export function isAllow(effect: PolicyEffect): boolean
````

## File: src/modules/iam/subdomains/access-control/domain/value-objects/ResourceRef.ts
````typescript
import { z } from "zod";
⋮----
export type ResourceRef = z.infer<typeof ResourceRefSchema>;
⋮----
export function createResourceRef(
  resourceType: string,
  resourceId?: string,
  workspaceId?: string,
): ResourceRef
````

## File: src/modules/iam/subdomains/access-control/domain/value-objects/SubjectRef.ts
````typescript
import { z } from "zod";
⋮----
export type SubjectRef = z.infer<typeof SubjectRefSchema>;
⋮----
export function createSubjectRef(
  subjectId: string,
  subjectType: SubjectRef["subjectType"],
): SubjectRef
````

## File: src/modules/iam/subdomains/account/adapters/inbound/index.ts
````typescript

````

## File: src/modules/iam/subdomains/account/adapters/index.ts
````typescript
// account — adapters aggregate
````

## File: src/modules/iam/subdomains/account/adapters/outbound/firestore/FirestoreAccountRepository.ts
````typescript
import { v4 as uuid } from "uuid";
import type { AccountRepository, OrganizationRole, UpdateProfileInput, WalletTransaction, AccountRoleRecord } from "../../../domain/repositories/AccountRepository";
import type { UpdateAccountProfileInput } from "../../../domain/entities/AccountProfile";
import type { AccountSnapshot } from "../../../domain/entities/Account";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
⋮----
export class FirestoreAccountRepository implements AccountRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(id: string): Promise<AccountSnapshot | null>
⋮----
async save(account: AccountSnapshot): Promise<void>
⋮----
async updateProfile(userId: string, data: UpdateProfileInput): Promise<void>
⋮----
async updateAccountProfile(userId: string, input: UpdateAccountProfileInput): Promise<void>
⋮----
async getWalletBalance(accountId: string): Promise<number>
⋮----
async creditWallet(
    accountId: string,
    amount: number,
    description: string,
): Promise<WalletTransaction>
⋮----
async debitWallet(
    accountId: string,
    amount: number,
    description: string,
): Promise<WalletTransaction>
⋮----
async assignRole(
    accountId: string,
    role: OrganizationRole,
    grantedBy: string,
): Promise<AccountRoleRecord>
⋮----
async revokeRole(accountId: string): Promise<void>
⋮----
async getRole(accountId: string): Promise<AccountRoleRecord | null>
````

## File: src/modules/iam/subdomains/account/adapters/outbound/index.ts
````typescript

````

## File: src/modules/iam/subdomains/account/application/dto/AccountDTO.ts
````typescript

````

## File: src/modules/iam/subdomains/account/application/index.ts
````typescript
// ── DTOs ──────────────────────────────────────────────────────────────────────
⋮----
// ── Use cases ─────────────────────────────────────────────────────────────────
⋮----
// ── Outbound ports ────────────────────────────────────────────────────────────
````

## File: src/modules/iam/subdomains/account/application/ports/outbound/AccountRepositoryPort.ts
````typescript
import type { AccountRepository } from "../../../domain/repositories/AccountRepository";
import type { AccountQueryRepository } from "../../../domain/repositories/AccountQueryRepository";
import type { AccountPolicyRepository } from "../../../domain/repositories/AccountPolicyRepository";
import type { TokenRefreshPort } from "../../../domain/ports/TokenRefreshPort";
⋮----
/** Outbound port contract for account persistence — mirrors AccountRepository. */
⋮----
/** Outbound port contract for account read queries. */
⋮----
/** Outbound port contract for account policy persistence. */
⋮----
/** Outbound port for token-refresh signaling. */
````

## File: src/modules/iam/subdomains/account/application/use-cases/AccountPolicyUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { AccountPolicyRepository } from "../../domain/repositories/AccountPolicyRepository";
import type { TokenRefreshPort } from "../../domain/ports/TokenRefreshPort";
import type { CreatePolicyInput, UpdatePolicyInput } from "../../domain/entities/AccountPolicy";
⋮----
// ─── Create Account Policy ────────────────────────────────────────────────────
⋮----
export class CreateAccountPolicyUseCase {
⋮----
constructor(
⋮----
async execute(input: CreatePolicyInput): Promise<CommandResult>
⋮----
// ─── Update Account Policy ────────────────────────────────────────────────────
⋮----
export class UpdateAccountPolicyUseCase {
⋮----
async execute(
    policyId: string,
    accountId: string,
    data: UpdatePolicyInput,
    traceId?: string,
): Promise<CommandResult>
⋮----
// ─── Delete Account Policy ────────────────────────────────────────────────────
⋮----
export class DeleteAccountPolicyUseCase {
⋮----
async execute(policyId: string, accountId: string): Promise<CommandResult>
````

## File: src/modules/iam/subdomains/account/application/use-cases/AccountUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { AccountRepository, OrganizationRole, UpdateProfileInput } from "../../domain/repositories/AccountRepository";
import type { AccountQueryRepository, Unsubscribe } from "../../domain/repositories/AccountQueryRepository";
import type { TokenRefreshPort } from "../../domain/ports/TokenRefreshPort";
import type { AccountProfile, UpdateAccountProfileInput } from "../../domain/entities/AccountProfile";
import { createUpdateAccountProfileInput } from "../../domain/entities/AccountProfile";
⋮----
// ─── Create User Account ──────────────────────────────────────────────────────
⋮----
export class CreateUserAccountUseCase {
⋮----
constructor(private readonly accountRepo: AccountRepository)
⋮----
async execute(userId: string, name: string, email: string): Promise<CommandResult>
⋮----
// ─── Update User Profile ──────────────────────────────────────────────────────
⋮----
export class UpdateUserProfileUseCase {
⋮----
async execute(userId: string, data: UpdateProfileInput): Promise<CommandResult>
⋮----
// ─── Credit Wallet ────────────────────────────────────────────────────────────
⋮----
export class CreditWalletUseCase {
⋮----
async execute(accountId: string, amount: number, description: string): Promise<CommandResult>
⋮----
// ─── Debit Wallet ─────────────────────────────────────────────────────────────
⋮----
export class DebitWalletUseCase {
⋮----
// ─── Assign Account Role ──────────────────────────────────────────────────────
⋮----
export class AssignAccountRoleUseCase {
⋮----
constructor(
⋮----
async execute(
    accountId: string,
    role: OrganizationRole,
    grantedBy: string,
    traceId?: string,
): Promise<CommandResult>
⋮----
// ─── Revoke Account Role ──────────────────────────────────────────────────────
⋮----
export class RevokeAccountRoleUseCase {
⋮----
async execute(accountId: string): Promise<CommandResult>
⋮----
// ─── Get Account Profile ──────────────────────────────────────────────────────
⋮----
export class GetAccountProfileUseCase {
⋮----
constructor(private readonly repo: AccountQueryRepository)
⋮----
async execute(actorId: string): Promise<AccountProfile | null>
⋮----
// ─── Subscribe Account Profile ────────────────────────────────────────────────
⋮----
export class SubscribeAccountProfileUseCase {
⋮----
execute(actorId: string, onUpdate: (profile: AccountProfile | null) => void): Unsubscribe
⋮----
// ─── Update Account Profile ───────────────────────────────────────────────────
⋮----
export class UpdateAccountProfileUseCase {
⋮----
async execute(actorId: string, input: UpdateAccountProfileInput): Promise<CommandResult>
````

## File: src/modules/iam/subdomains/account/domain/entities/Account.ts
````typescript
import { v4 as uuid } from "uuid";
import type { AccountDomainEventType } from "../events/AccountDomainEvent";
import {
  canClose,
  canReactivate,
  canSuspend,
  type AccountStatus,
} from "../value-objects/AccountStatus";
import {
  createAccountId,
  createAccountType,
  createWalletAmount,
} from "../value-objects";
⋮----
export interface AccountSnapshot {
  readonly id: string;
  readonly name: string;
  readonly accountType: "user" | "organization";
  readonly email: string | null;
  readonly photoURL: string | null;
  readonly bio: string | null;
  readonly status: "active" | "suspended" | "closed";
  readonly walletBalance: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateAccountInput {
  readonly name: string;
  readonly accountType: "user" | "organization";
  readonly email?: string | null;
  readonly photoURL?: string | null;
  readonly bio?: string | null;
}
⋮----
export class Account {
⋮----
private constructor(private _props: AccountSnapshot)
⋮----
static create(id: string, input: CreateAccountInput): Account
⋮----
static reconstitute(snapshot: AccountSnapshot): Account
⋮----
updateProfile(input: {
    name?: string;
    bio?: string | null;
    photoURL?: string | null;
}): void
⋮----
creditWallet(amount: number, description: string): void
⋮----
debitWallet(amount: number, description: string): void
⋮----
suspend(): void
⋮----
close(): void
⋮----
reactivate(): void
⋮----
get id(): string
⋮----
get name(): string
⋮----
get accountType(): "user" | "organization"
⋮----
get email(): string | null
⋮----
get photoURL(): string | null
⋮----
get bio(): string | null
⋮----
get status(): AccountStatus
⋮----
get walletBalance(): number
⋮----
get createdAtISO(): string
⋮----
get updatedAtISO(): string
⋮----
getSnapshot(): Readonly<AccountSnapshot>
⋮----
pullDomainEvents(): AccountDomainEventType[]
⋮----
private changeStatus(
    status: AccountStatus,
    eventType: "iam.account.suspended" | "iam.account.closed" | "iam.account.reactivated",
): void
````

## File: src/modules/iam/subdomains/account/domain/entities/AccountPolicy.ts
````typescript
export type PolicyEffect = "allow" | "deny";
⋮----
export interface PolicyRule {
  resource: string;
  actions: string[];
  effect: PolicyEffect;
  conditions?: Record<string, string>;
}
⋮----
export interface AccountPolicy {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
  readonly description: string;
  readonly rules: PolicyRule[];
  readonly isActive: boolean;
  readonly createdAt: string; // ISO-8601
  readonly updatedAt: string; // ISO-8601
  readonly traceId?: string;
}
⋮----
readonly createdAt: string; // ISO-8601
readonly updatedAt: string; // ISO-8601
⋮----
export interface CreatePolicyInput {
  readonly accountId: string;
  readonly name: string;
  readonly description: string;
  readonly rules: PolicyRule[];
  readonly traceId?: string;
}
⋮----
export interface UpdatePolicyInput {
  readonly name?: string;
  readonly description?: string;
  readonly rules?: PolicyRule[];
  readonly isActive?: boolean;
}
````

## File: src/modules/iam/subdomains/account/domain/entities/AccountProfile.ts
````typescript
import { z } from "zod";
⋮----
// ── Value objects ─────────────────────────────────────────────────────────────
⋮----
export type AccountProfileTheme = z.infer<typeof AccountProfileThemeSchema>;
⋮----
// ── Profile read-model ────────────────────────────────────────────────────────
⋮----
export type AccountProfile = z.infer<typeof AccountProfileSchema>;
⋮----
// ── Profile mutation command ──────────────────────────────────────────────────
⋮----
export type UpdateAccountProfileInput = z.infer<typeof UpdateAccountProfileInputSchema>;
⋮----
// ── Factories / mappers ───────────────────────────────────────────────────────
⋮----
export function createUpdateAccountProfileInput(raw: unknown): UpdateAccountProfileInput
````

## File: src/modules/iam/subdomains/account/domain/events/AccountDomainEvent.ts
````typescript
export interface AccountDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string; // ISO-8601
  readonly type: string;
  readonly payload: object;
}
⋮----
readonly occurredAt: string; // ISO-8601
⋮----
export interface AccountCreatedEvent extends AccountDomainEvent {
  readonly type: "iam.account.created";
  readonly payload: {
    readonly accountId: string;
    readonly name: string;
    readonly accountType: "user" | "organization";
    readonly email: string | null;
  };
}
⋮----
export interface ProfileUpdatedEvent extends AccountDomainEvent {
  readonly type: "iam.account.profile_updated";
  readonly payload: {
    readonly accountId: string;
    readonly name: string;
    readonly bio: string | null;
    readonly photoURL: string | null;
  };
}
⋮----
export interface WalletCreditedEvent extends AccountDomainEvent {
  readonly type: "iam.account.wallet_credited";
  readonly payload: {
    readonly accountId: string;
    readonly amount: number;
    readonly description: string;
    readonly balance: number;
  };
}
⋮----
export interface WalletDebitedEvent extends AccountDomainEvent {
  readonly type: "iam.account.wallet_debited";
  readonly payload: {
    readonly accountId: string;
    readonly amount: number;
    readonly description: string;
    readonly balance: number;
  };
}
⋮----
export interface AccountSuspendedEvent extends AccountDomainEvent {
  readonly type: "iam.account.suspended";
  readonly payload: {
    readonly accountId: string;
  };
}
⋮----
export interface AccountClosedEvent extends AccountDomainEvent {
  readonly type: "iam.account.closed";
  readonly payload: {
    readonly accountId: string;
  };
}
⋮----
export interface AccountReactivatedEvent extends AccountDomainEvent {
  readonly type: "iam.account.reactivated";
  readonly payload: {
    readonly accountId: string;
  };
}
⋮----
export type AccountDomainEventType =
  | AccountCreatedEvent
  | ProfileUpdatedEvent
  | WalletCreditedEvent
  | WalletDebitedEvent
  | AccountSuspendedEvent
  | AccountClosedEvent
  | AccountReactivatedEvent;
````

## File: src/modules/iam/subdomains/account/domain/index.ts
````typescript
// ── Entities / aggregate root ─────────────────────────────────────────────────
⋮----
// ── Value objects ─────────────────────────────────────────────────────────────
⋮----
// ── Domain events ─────────────────────────────────────────────────────────────
⋮----
// ── Repository interfaces ─────────────────────────────────────────────────────
⋮----
// ── Ports ─────────────────────────────────────────────────────────────────────
````

## File: src/modules/iam/subdomains/account/domain/ports/TokenRefreshPort.ts
````typescript
export type TokenRefreshReason = "role:changed" | "policy:changed";
⋮----
export interface TokenRefreshSignalInput {
  accountId: string;
  reason: TokenRefreshReason;
  traceId?: string;
}
⋮----
export interface TokenRefreshPort {
  emitTokenRefreshSignal(input: TokenRefreshSignalInput): Promise<void>;
}
⋮----
emitTokenRefreshSignal(input: TokenRefreshSignalInput): Promise<void>;
````

## File: src/modules/iam/subdomains/account/domain/repositories/AccountPolicyRepository.ts
````typescript
import type { AccountPolicy, CreatePolicyInput, UpdatePolicyInput } from "../entities/AccountPolicy";
⋮----
export interface AccountPolicyRepository {
  findById(id: string): Promise<AccountPolicy | null>;
  findAllByAccountId(accountId: string): Promise<AccountPolicy[]>;
  findActiveByAccountId(accountId: string): Promise<AccountPolicy[]>;
  create(input: CreatePolicyInput): Promise<AccountPolicy>;
  update(policyId: string, data: UpdatePolicyInput): Promise<void>;
  delete(policyId: string): Promise<void>;
}
⋮----
findById(id: string): Promise<AccountPolicy | null>;
findAllByAccountId(accountId: string): Promise<AccountPolicy[]>;
findActiveByAccountId(accountId: string): Promise<AccountPolicy[]>;
create(input: CreatePolicyInput): Promise<AccountPolicy>;
update(policyId: string, data: UpdatePolicyInput): Promise<void>;
delete(policyId: string): Promise<void>;
````

## File: src/modules/iam/subdomains/account/domain/repositories/AccountQueryRepository.ts
````typescript
import type { AccountProfile } from "../entities/AccountProfile";
import type { AccountSnapshot } from "../entities/Account";
import type { WalletTransaction, AccountRoleRecord } from "./AccountRepository";
⋮----
export interface WalletBalanceSnapshot {
  balance: number;
}
⋮----
export type Unsubscribe = () => void;
⋮----
export interface AccountQueryRepository {
  getUserProfile(userId: string): Promise<AccountSnapshot | null>;
  subscribeToUserProfile(
    userId: string,
    onUpdate: (profile: AccountSnapshot | null) => void,
  ): Unsubscribe;
  getAccountProfile(actorId: string): Promise<AccountProfile | null>;
  subscribeToAccountProfile(
    actorId: string,
    onUpdate: (profile: AccountProfile | null) => void,
  ): Unsubscribe;
  getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot>;
  subscribeToWalletBalance(
    accountId: string,
    onUpdate: (snapshot: WalletBalanceSnapshot) => void,
  ): Unsubscribe;
  subscribeToWalletTransactions(
    accountId: string,
    maxCount: number,
    onUpdate: (txs: WalletTransaction[]) => void,
  ): Unsubscribe;
  getAccountRole(accountId: string): Promise<AccountRoleRecord | null>;
  subscribeToAccountRoles(
    accountId: string,
    onUpdate: (record: AccountRoleRecord | null) => void,
  ): Unsubscribe;
  subscribeToAccountsForUser(
    userId: string,
    onUpdate: (accounts: Record<string, AccountSnapshot>) => void,
  ): Unsubscribe;
}
⋮----
getUserProfile(userId: string): Promise<AccountSnapshot | null>;
subscribeToUserProfile(
    userId: string,
    onUpdate: (profile: AccountSnapshot | null) => void,
  ): Unsubscribe;
getAccountProfile(actorId: string): Promise<AccountProfile | null>;
subscribeToAccountProfile(
    actorId: string,
    onUpdate: (profile: AccountProfile | null) => void,
  ): Unsubscribe;
getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot>;
subscribeToWalletBalance(
    accountId: string,
    onUpdate: (snapshot: WalletBalanceSnapshot) => void,
  ): Unsubscribe;
subscribeToWalletTransactions(
    accountId: string,
    maxCount: number,
    onUpdate: (txs: WalletTransaction[]) => void,
  ): Unsubscribe;
getAccountRole(accountId: string): Promise<AccountRoleRecord | null>;
subscribeToAccountRoles(
    accountId: string,
    onUpdate: (record: AccountRoleRecord | null) => void,
  ): Unsubscribe;
subscribeToAccountsForUser(
    userId: string,
    onUpdate: (accounts: Record<string, AccountSnapshot>) => void,
  ): Unsubscribe;
````

## File: src/modules/iam/subdomains/account/domain/repositories/AccountRepository.ts
````typescript
import type {
  AccountProfile,
  UpdateAccountProfileInput,
} from "../entities/AccountProfile";
⋮----
export type OrganizationRole = "Owner" | "Admin" | "Member" | "Guest";
⋮----
export interface WalletTransaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  createdAt: string; // ISO-8601
}
⋮----
createdAt: string; // ISO-8601
⋮----
export interface AccountRoleRecord {
  accountId: string;
  role: OrganizationRole;
  grantedBy: string;
  grantedAt: string; // ISO-8601
}
⋮----
grantedAt: string; // ISO-8601
⋮----
export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  photoURL?: string;
}
⋮----
export interface AccountRepository {
  findById(id: string): Promise<import("../entities/Account").AccountSnapshot | null>;
  save(account: import("../entities/Account").AccountSnapshot): Promise<void>;
  updateProfile(userId: string, data: UpdateProfileInput): Promise<void>;
  updateAccountProfile(userId: string, input: UpdateAccountProfileInput): Promise<void>;
  getWalletBalance(accountId: string): Promise<number>;
  creditWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
  debitWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
  assignRole(accountId: string, role: OrganizationRole, grantedBy: string): Promise<AccountRoleRecord>;
  revokeRole(accountId: string): Promise<void>;
  getRole(accountId: string): Promise<AccountRoleRecord | null>;
}
⋮----
findById(id: string): Promise<import("../entities/Account").AccountSnapshot | null>;
save(account: import("../entities/Account").AccountSnapshot): Promise<void>;
updateProfile(userId: string, data: UpdateProfileInput): Promise<void>;
updateAccountProfile(userId: string, input: UpdateAccountProfileInput): Promise<void>;
getWalletBalance(accountId: string): Promise<number>;
creditWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
debitWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
assignRole(accountId: string, role: OrganizationRole, grantedBy: string): Promise<AccountRoleRecord>;
revokeRole(accountId: string): Promise<void>;
getRole(accountId: string): Promise<AccountRoleRecord | null>;
````

## File: src/modules/iam/subdomains/account/domain/value-objects/AccountId.ts
````typescript
import { z } from "zod";
⋮----
export type AccountId = z.infer<typeof AccountIdSchema>;
⋮----
export function createAccountId(raw: string): AccountId
````

## File: src/modules/iam/subdomains/account/domain/value-objects/AccountStatus.ts
````typescript
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];
⋮----
export function canSuspend(status: AccountStatus): boolean
⋮----
export function canClose(status: AccountStatus): boolean
⋮----
export function canReactivate(status: AccountStatus): boolean
````

## File: src/modules/iam/subdomains/account/domain/value-objects/AccountType.ts
````typescript
import { z } from "zod";
⋮----
export type AccountTypeValue = (typeof ACCOUNT_TYPES)[number];
⋮----
export function createAccountType(raw: string): AccountTypeValue
````

## File: src/modules/iam/subdomains/account/domain/value-objects/index.ts
````typescript

````

## File: src/modules/iam/subdomains/account/domain/value-objects/WalletAmount.ts
````typescript
import { z } from "zod";
⋮----
export type WalletAmount = z.infer<typeof WalletAmountSchema>;
⋮----
export function createWalletAmount(raw: number): WalletAmount
````

## File: src/modules/iam/subdomains/authentication/adapters/inbound/index.ts
````typescript
// authentication — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/iam/subdomains/authentication/adapters/index.ts
````typescript
// authentication — adapters aggregate
````

## File: src/modules/iam/subdomains/authentication/adapters/outbound/index.ts
````typescript
// authentication — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/iam/subdomains/authentication/application/index.ts
````typescript

````

## File: src/modules/iam/subdomains/authentication/application/use-cases/AuthenticationUseCases.ts
````typescript
import type { AuthCredential, AuthenticationPort } from "../../domain/index";
⋮----
export class SignInWithEmailUseCase {
⋮----
constructor(private readonly authPort: AuthenticationPort)
⋮----
async execute(input:
⋮----
export class SignOutUseCase {
⋮----
export class SendPasswordResetEmailUseCase {
````

## File: src/modules/iam/subdomains/authentication/domain/index.ts
````typescript
// authentication — domain layer
// Owns authentication flows: sign-in, sign-up, sign-out, password reset.
// Firebase Auth is the external adapter; this layer defines the port contracts.
⋮----
export interface AuthenticationPort {
  signInWithEmail(email: string, password: string): Promise<{ uid: string; idToken: string }>;
  signOut(uid: string): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
}
⋮----
signInWithEmail(email: string, password: string): Promise<
signOut(uid: string): Promise<void>;
sendPasswordResetEmail(email: string): Promise<void>;
⋮----
export interface AuthCredential {
  readonly uid: string;
  readonly email: string | null;
  readonly idToken: string;
  readonly expiresAt: string;
}
⋮----
export interface AuthenticationDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: "iam.authentication.signed_in" | "iam.authentication.signed_out";
  readonly payload: { readonly uid: string };
}
````

## File: src/modules/iam/subdomains/authorization/adapters/inbound/index.ts
````typescript
// authorization — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/iam/subdomains/authorization/adapters/index.ts
````typescript
// authorization — adapters aggregate
````

## File: src/modules/iam/subdomains/authorization/adapters/outbound/index.ts
````typescript
// authorization — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/iam/subdomains/authorization/application/index.ts
````typescript

````

## File: src/modules/iam/subdomains/authorization/application/use-cases/AuthorizationUseCases.ts
````typescript
import type { PermissionDecision, PermissionCheckPort } from "../../domain/index";
⋮----
export class CheckPermissionUseCase {
⋮----
constructor(private readonly permissionPort: PermissionCheckPort)
⋮----
async execute(input: {
    actorId: string;
    action: string;
    resource: string;
}): Promise<PermissionDecision>
⋮----
export class BatchCheckPermissionsUseCase {
⋮----
async execute(
    checks: Array<{ actorId: string; action: string; resource: string }>,
): Promise<PermissionDecision[]>
````

## File: src/modules/iam/subdomains/authorization/domain/index.ts
````typescript
// authorization — domain layer
// Owns permission evaluation, RBAC policies, and entitlement signals.
⋮----
export interface PermissionDecision {
  readonly allowed: boolean;
  readonly reason: string;
}
⋮----
export function allowDecision(reason = "Allowed"): PermissionDecision
⋮----
export function denyDecision(reason = "Denied"): PermissionDecision
⋮----
export interface PermissionCheckPort {
  can(actorId: string, action: string, resource: string): Promise<PermissionDecision>;
}
⋮----
can(actorId: string, action: string, resource: string): Promise<PermissionDecision>;
````

## File: src/modules/iam/subdomains/federation/adapters/inbound/index.ts
````typescript
// federation — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/iam/subdomains/federation/adapters/index.ts
````typescript
// federation — adapters aggregate
````

## File: src/modules/iam/subdomains/federation/adapters/outbound/index.ts
````typescript
// federation — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/iam/subdomains/federation/application/index.ts
````typescript

````

## File: src/modules/iam/subdomains/federation/application/use-cases/FederationUseCases.ts
````typescript
import type { FederatedIdentity, FederationPort, FederationProvider } from "../../domain/index";
⋮----
export class LinkProviderUseCase {
⋮----
constructor(private readonly federationPort: FederationPort)
⋮----
async execute(input: {
    uid: string;
    provider: FederationProvider;
    idToken: string;
}): Promise<void>
⋮----
export class UnlinkProviderUseCase {
⋮----
export class GetLinkedProvidersUseCase {
````

## File: src/modules/iam/subdomains/federation/domain/index.ts
````typescript
// federation — domain layer
// Owns external IdP (OAuth / SAML) identity federation flows.
⋮----
export type FederationProvider = "google" | "github" | "microsoft" | "saml";
⋮----
export interface FederatedIdentity {
  readonly uid: string;
  readonly provider: FederationProvider;
  readonly externalId: string;
  readonly email: string | null;
  readonly linkedAtISO: string;
}
⋮----
export interface FederationPort {
  linkProvider(uid: string, provider: FederationProvider, idToken: string): Promise<void>;
  unlinkProvider(uid: string, provider: FederationProvider): Promise<void>;
  getLinkedProviders(uid: string): Promise<FederatedIdentity[]>;
}
⋮----
linkProvider(uid: string, provider: FederationProvider, idToken: string): Promise<void>;
unlinkProvider(uid: string, provider: FederationProvider): Promise<void>;
getLinkedProviders(uid: string): Promise<FederatedIdentity[]>;
````

## File: src/modules/iam/subdomains/identity/adapters/inbound/index.ts
````typescript

````

## File: src/modules/iam/subdomains/identity/adapters/index.ts
````typescript
// identity — adapters aggregate
````

## File: src/modules/iam/subdomains/identity/adapters/outbound/firestore/FirestoreIdentityRepository.ts
````typescript
import type { IdentityRepository } from "../../../domain/repositories/IdentityRepository";
import type { IdentityEntity, SignInCredentials, RegistrationInput } from "../../../domain/entities/Identity";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
⋮----
/**
 * Firestore stub for IdentityRepository.
 * Auth operations (sign-in, sign-out) are driven by Firebase Auth SDK in the real adapter.
 * This stub provides Firestore-backed storage for identity documents.
 */
export class FirestoreIdentityRepository implements IdentityRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async signInWithEmailAndPassword(_credentials: SignInCredentials): Promise<IdentityEntity>
⋮----
async signInAnonymously(): Promise<IdentityEntity>
⋮----
async createUserWithEmailAndPassword(_input: RegistrationInput): Promise<IdentityEntity>
⋮----
async updateDisplayName(uid: string, displayName: string): Promise<void>
⋮----
async sendPasswordResetEmail(_email: string): Promise<void>
⋮----
async signOut(): Promise<void>
⋮----
getCurrentUser(): IdentityEntity | null
````

## File: src/modules/iam/subdomains/identity/adapters/outbound/index.ts
````typescript

````

## File: src/modules/iam/subdomains/identity/application/dto/IdentityDTO.ts
````typescript

````

## File: src/modules/iam/subdomains/identity/application/index.ts
````typescript
// ── DTOs ──────────────────────────────────────────────────────────────────────
⋮----
// ── Use cases ─────────────────────────────────────────────────────────────────
````

## File: src/modules/iam/subdomains/identity/application/use-cases/IdentityUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { IdentityRepository } from "../../domain/repositories/IdentityRepository";
import type { SignInCredentials, RegistrationInput } from "../../domain/entities/Identity";
⋮----
function toIdentityErrorMessage(err: unknown, fallback: string): string
⋮----
export class SignInUseCase {
⋮----
constructor(private readonly identityRepo: IdentityRepository)
⋮----
async execute(credentials: SignInCredentials): Promise<CommandResult>
⋮----
export class SignInAnonymouslyUseCase {
⋮----
async execute(): Promise<CommandResult>
⋮----
export class RegisterUseCase {
⋮----
async execute(input: RegistrationInput): Promise<CommandResult>
⋮----
export class SendPasswordResetEmailUseCase {
⋮----
async execute(email: string): Promise<CommandResult>
⋮----
export class SignOutUseCase {
````

## File: src/modules/iam/subdomains/identity/application/use-cases/TokenRefreshUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { TokenRefreshRepository } from "../../domain/repositories/TokenRefreshRepository";
import type { TokenRefreshReason } from "../../domain/entities/TokenRefreshSignal";
⋮----
export class EmitTokenRefreshSignalUseCase {
⋮----
constructor(private readonly tokenRefreshRepo: TokenRefreshRepository)
⋮----
async execute(accountId: string, reason: TokenRefreshReason, traceId?: string): Promise<CommandResult>
````

## File: src/modules/iam/subdomains/identity/domain/entities/Identity.ts
````typescript
/** IdentityEntity — domain entity for a Firebase Auth user session. Zero external dependencies. */
export interface IdentityEntity {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  readonly isAnonymous: boolean;
  readonly emailVerified: boolean;
}
⋮----
export interface SignInCredentials {
  readonly email: string;
  readonly password: string;
}
⋮----
export interface RegistrationInput {
  readonly email: string;
  readonly password: string;
  readonly name: string;
}
````

## File: src/modules/iam/subdomains/identity/domain/entities/TokenRefreshSignal.ts
````typescript
export type TokenRefreshReason = "role:changed" | "policy:changed";
⋮----
/** Represents the signal written to Firestore when Custom Claims change. */
export interface TokenRefreshSignal {
  readonly accountId: string;
  readonly reason: TokenRefreshReason;
  readonly issuedAt: string; // ISO-8601
  readonly traceId?: string;
}
⋮----
readonly issuedAt: string; // ISO-8601
````

## File: src/modules/iam/subdomains/identity/domain/entities/UserIdentity.ts
````typescript
import { v4 as uuid } from "uuid";
import type { IdentityDomainEventType } from "../events/IdentityDomainEvent";
import { canReactivate, canSuspend, type IdentityStatus } from "../value-objects/IdentityStatus";
import { createDisplayName, createEmail, createUserId } from "../value-objects";
⋮----
export interface UserIdentitySnapshot {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  readonly isAnonymous: boolean;
  readonly emailVerified: boolean;
  readonly status: IdentityStatus;
  readonly lastSignInAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateIdentityInput {
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  readonly isAnonymous: boolean;
  readonly emailVerified: boolean;
}
⋮----
export class UserIdentity {
⋮----
private constructor(private _props: UserIdentitySnapshot)
⋮----
static create(uid: string, input: CreateIdentityInput): UserIdentity
⋮----
static reconstitute(snapshot: UserIdentitySnapshot): UserIdentity
⋮----
signIn(): void
⋮----
updateDisplayName(name: string): void
⋮----
verifyEmail(): void
⋮----
suspend(): void
⋮----
reactivate(): void
⋮----
get uid(): string
⋮----
get email(): string | null
⋮----
get displayName(): string | null
⋮----
get isActive(): boolean
⋮----
get isAnonymous(): boolean
⋮----
get emailVerified(): boolean
⋮----
getSnapshot(): Readonly<UserIdentitySnapshot>
⋮----
pullDomainEvents(): IdentityDomainEventType[]
````

## File: src/modules/iam/subdomains/identity/domain/events/IdentityDomainEvent.ts
````typescript
export interface IdentityDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string; // ISO-8601
  readonly type: string;
  readonly payload: object;
}
⋮----
readonly occurredAt: string; // ISO-8601
⋮----
export interface IdentityCreatedEvent extends IdentityDomainEvent {
  readonly type: "platform.identity.created";
  readonly payload: {
    readonly uid: string;
    readonly email: string | null;
    readonly isAnonymous: boolean;
  };
}
⋮----
export interface SignedInEvent extends IdentityDomainEvent {
  readonly type: "platform.identity.signed_in";
  readonly payload: {
    readonly uid: string;
    readonly signedInAtISO: string;
  };
}
⋮----
export interface DisplayNameUpdatedEvent extends IdentityDomainEvent {
  readonly type: "platform.identity.display_name_updated";
  readonly payload: {
    readonly uid: string;
    readonly previousDisplayName: string | null;
    readonly displayName: string;
  };
}
⋮----
export interface EmailVerifiedEvent extends IdentityDomainEvent {
  readonly type: "platform.identity.email_verified";
  readonly payload: {
    readonly uid: string;
    readonly email: string | null;
  };
}
⋮----
export interface IdentitySuspendedEvent extends IdentityDomainEvent {
  readonly type: "platform.identity.suspended";
  readonly payload: {
    readonly uid: string;
  };
}
⋮----
export interface IdentityReactivatedEvent extends IdentityDomainEvent {
  readonly type: "platform.identity.reactivated";
  readonly payload: {
    readonly uid: string;
  };
}
⋮----
export type IdentityDomainEventType =
  | IdentityCreatedEvent
  | SignedInEvent
  | DisplayNameUpdatedEvent
  | EmailVerifiedEvent
  | IdentitySuspendedEvent
  | IdentityReactivatedEvent;
````

## File: src/modules/iam/subdomains/identity/domain/index.ts
````typescript
// ── Aggregate root ────────────────────────────────────────────────────────────
⋮----
// ── Entities ──────────────────────────────────────────────────────────────────
⋮----
// ── Value objects ─────────────────────────────────────────────────────────────
⋮----
// ── Domain events ─────────────────────────────────────────────────────────────
⋮----
// ── Repository interfaces ─────────────────────────────────────────────────────
````

## File: src/modules/iam/subdomains/identity/domain/repositories/IdentityRepository.ts
````typescript
import type { IdentityEntity, RegistrationInput, SignInCredentials } from "../entities/Identity";
⋮----
export interface IdentityRepository {
  signInWithEmailAndPassword(credentials: SignInCredentials): Promise<IdentityEntity>;
  signInAnonymously(): Promise<IdentityEntity>;
  createUserWithEmailAndPassword(input: RegistrationInput): Promise<IdentityEntity>;
  updateDisplayName(uid: string, displayName: string): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUser(): IdentityEntity | null;
}
⋮----
signInWithEmailAndPassword(credentials: SignInCredentials): Promise<IdentityEntity>;
signInAnonymously(): Promise<IdentityEntity>;
createUserWithEmailAndPassword(input: RegistrationInput): Promise<IdentityEntity>;
updateDisplayName(uid: string, displayName: string): Promise<void>;
sendPasswordResetEmail(email: string): Promise<void>;
signOut(): Promise<void>;
getCurrentUser(): IdentityEntity | null;
````

## File: src/modules/iam/subdomains/identity/domain/repositories/TokenRefreshRepository.ts
````typescript
import type { TokenRefreshSignal } from "../entities/TokenRefreshSignal";
⋮----
export interface TokenRefreshRepository {
  emit(signal: TokenRefreshSignal): Promise<void>;
  subscribe(accountId: string, onSignal: () => void): () => void;
}
⋮----
emit(signal: TokenRefreshSignal): Promise<void>;
subscribe(accountId: string, onSignal: ()
````

## File: src/modules/iam/subdomains/identity/domain/value-objects/DisplayName.ts
````typescript
import { z } from "zod";
⋮----
export type DisplayName = z.infer<typeof DisplayNameSchema>;
⋮----
export function createDisplayName(raw: string): DisplayName
````

## File: src/modules/iam/subdomains/identity/domain/value-objects/Email.ts
````typescript
import { z } from "zod";
⋮----
export type Email = z.infer<typeof EmailSchema>;
⋮----
export function createEmail(raw: string): Email
⋮----
export function unsafeEmail(raw: string): Email
````

## File: src/modules/iam/subdomains/identity/domain/value-objects/IdentityStatus.ts
````typescript
export type IdentityStatus = (typeof IDENTITY_STATUSES)[number];
⋮----
export function canSuspend(status: IdentityStatus): boolean
⋮----
export function canReactivate(status: IdentityStatus): boolean
````

## File: src/modules/iam/subdomains/identity/domain/value-objects/index.ts
````typescript

````

## File: src/modules/iam/subdomains/identity/domain/value-objects/UserId.ts
````typescript
import { z } from "zod";
⋮----
export type UserId = z.infer<typeof UserIdSchema>;
⋮----
export function createUserId(raw: string): UserId
⋮----
export function unsafeUserId(raw: string): UserId
````

## File: src/modules/iam/subdomains/organization/adapters/inbound/index.ts
````typescript
// organization — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/iam/subdomains/organization/adapters/index.ts
````typescript
// organization — adapters aggregate
````

## File: src/modules/iam/subdomains/organization/adapters/outbound/firestore/FirestoreOrganizationRepository.ts
````typescript
/**
 * FirestoreOrganizationRepository — iam/organization outbound adapter.
 *
 * Implements OrganizationRepository using Firebase Firestore.
 *
 * Firestore schema:
 *   accounts/{orgId}          — account-level record (queried by subscribeToAccountsForUser)
 *     accountType: "organization"
 *     ownerId: string          — owner's Firebase uid
 *     memberIds: string[]      — array-contains index for member queries
 *   organizations/{orgId}     — organisation domain document
 *   org_members/{orgId}/members/{memberId}
 *   org_teams/{orgId}/teams/{teamId}
 *   org_partner_invites/{orgId}/invites/{inviteId}
 *
 * The `accounts/{orgId}` document is maintained in sync so that the existing
 * subscribeToAccountsForUser query (which filters on `ownerId` and `memberIds`)
 * surfaces the new organisation to the creator immediately.
 *
 * This file is in adapters/outbound/firestore/ — @integration-firebase is NOT
 * directly imported; callers at module/adapters/outbound/ use @integration-firebase
 * and pass Firebase-specific helpers via the FirestoreLike port.
 */
⋮----
import { v4 as uuid } from "uuid";
import type {
  OrganizationRepository,
} from "../../../domain/repositories/OrganizationRepository";
import type {
  MemberReference,
  Team,
  PartnerInvite,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
} from "../../../domain/entities/Organization";
import type { OrganizationSnapshot } from "../../../domain/aggregates/Organization";
⋮----
// ── Infrastructure port ───────────────────────────────────────────────────────
// We keep this file Firebase-SDK-free by accepting a narrow persistence port.
// The module-level composition root wires in the real Firebase implementation.
⋮----
export interface OrgFirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  getSubcollection(collection: string, parentId: string, sub: string): Promise<{ id: string; data: Record<string, unknown> }[]>;
  setSubdoc(collection: string, parentId: string, sub: string, id: string, data: Record<string, unknown>): Promise<void>;
  deleteSubdoc(collection: string, parentId: string, sub: string, id: string): Promise<void>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
getSubcollection(collection: string, parentId: string, sub: string): Promise<
setSubdoc(collection: string, parentId: string, sub: string, id: string, data: Record<string, unknown>): Promise<void>;
deleteSubdoc(collection: string, parentId: string, sub: string, id: string): Promise<void>;
⋮----
// ── Repository ────────────────────────────────────────────────────────────────
⋮----
export class FirestoreOrganizationRepository implements OrganizationRepository {
⋮----
constructor(private readonly db: OrgFirestoreLike)
⋮----
// ── Organisation lifecycle ─────────────────────────────────────────────────
⋮----
async create(command: CreateOrganizationCommand): Promise<string>
⋮----
// 1. Write organisation domain document
⋮----
// 2. Write account-level record so subscribeToAccountsForUser picks it up.
//    The owner is listed in both `ownerId` (owner query) and `memberIds`
//    (member query) to cover both Firestore subscription paths.
⋮----
// 3. Add owner as first member document
⋮----
async findById(id: string): Promise<OrganizationSnapshot | null>
⋮----
async save(snapshot: OrganizationSnapshot): Promise<void>
⋮----
// Keep the account document name in sync
⋮----
async updateSettings(command: UpdateOrganizationSettingsCommand): Promise<void>
⋮----
// Sync account display name
⋮----
async delete(organizationId: string): Promise<void>
⋮----
// ── Members ────────────────────────────────────────────────────────────────
⋮----
async inviteMember(input: InviteMemberInput): Promise<string>
⋮----
async recruitMember(
    organizationId: string,
    memberId: string,
    name: string,
    email: string,
): Promise<void>
⋮----
// Update memberIds array in the account document
⋮----
async removeMember(organizationId: string, memberId: string): Promise<void>
⋮----
async updateMemberRole(input: UpdateMemberRoleInput): Promise<void>
⋮----
async getMembers(organizationId: string): Promise<MemberReference[]>
⋮----
subscribeToMembers(
    _organizationId: string,
    _onUpdate: (members: MemberReference[]) => void,
): () => void
⋮----
// Real-time members subscription — implement when member management UI is built.
// For now, emit an empty list immediately and return a no-op unsubscribe.
⋮----
// ── Teams ──────────────────────────────────────────────────────────────────
⋮----
async createTeam(input: CreateTeamInput): Promise<string>
⋮----
async deleteTeam(organizationId: string, teamId: string): Promise<void>
⋮----
async addMemberToTeam(
    organizationId: string,
    teamId: string,
    memberId: string,
): Promise<void>
⋮----
async removeMemberFromTeam(
    organizationId: string,
    teamId: string,
    memberId: string,
): Promise<void>
⋮----
async getTeams(organizationId: string): Promise<Team[]>
⋮----
subscribeToTeams(
    _organizationId: string,
    _onUpdate: (teams: Team[]) => void,
): () => void
⋮----
// Real-time teams subscription — implement when team management UI is built.
⋮----
// ── Partner invites ────────────────────────────────────────────────────────
⋮----
async sendPartnerInvite(
    organizationId: string,
    teamId: string,
    email: string,
): Promise<string>
⋮----
async dismissPartnerMember(
    organizationId: string,
    teamId: string,
    memberId: string,
): Promise<void>
⋮----
async getPartnerInvites(organizationId: string): Promise<PartnerInvite[]>
````

## File: src/modules/iam/subdomains/organization/adapters/outbound/index.ts
````typescript
// organization — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/iam/subdomains/organization/adapters/outbound/memory/InMemoryOrganizationRepository.ts
````typescript
import type { OrganizationRepository } from "../../../domain/repositories/OrganizationRepository";
import type {
  OrganizationSnapshot,
} from "../../../domain/aggregates/Organization";
import type { MemberReference, Team, PartnerInvite, CreateOrganizationCommand, UpdateOrganizationSettingsCommand, InviteMemberInput, UpdateMemberRoleInput, CreateTeamInput } from "../../../domain/entities/Organization";
import { v4 as uuid } from "uuid";
⋮----
export class InMemoryOrganizationRepository implements OrganizationRepository {
⋮----
async create(command: CreateOrganizationCommand): Promise<string>
⋮----
async findById(id: string): Promise<OrganizationSnapshot | null>
⋮----
async save(snapshot: OrganizationSnapshot): Promise<void>
⋮----
async updateSettings(command: UpdateOrganizationSettingsCommand): Promise<void>
⋮----
async delete(organizationId: string): Promise<void>
⋮----
async inviteMember(input: InviteMemberInput): Promise<string>
⋮----
async recruitMember(organizationId: string, memberId: string, name: string, email: string): Promise<void>
⋮----
async removeMember(organizationId: string, memberId: string): Promise<void>
⋮----
async updateMemberRole(input: UpdateMemberRoleInput): Promise<void>
⋮----
async getMembers(organizationId: string): Promise<MemberReference[]>
⋮----
subscribeToMembers(organizationId: string, onUpdate: (members: MemberReference[]) => void): () => void
⋮----
async createTeam(input: CreateTeamInput): Promise<string>
⋮----
async deleteTeam(organizationId: string, teamId: string): Promise<void>
⋮----
async addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void>
⋮----
async removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void>
⋮----
async getTeams(organizationId: string): Promise<Team[]>
⋮----
subscribeToTeams(organizationId: string, onUpdate: (teams: Team[]) => void): () => void
⋮----
async sendPartnerInvite(organizationId: string, teamId: string, email: string): Promise<string>
⋮----
async dismissPartnerMember(organizationId: string, _teamId: string, memberId: string): Promise<void>
⋮----
async getPartnerInvites(organizationId: string): Promise<PartnerInvite[]>
````

## File: src/modules/iam/subdomains/organization/application/dto/OrganizationDTO.ts
````typescript

````

## File: src/modules/iam/subdomains/organization/application/index.ts
````typescript

````

## File: src/modules/iam/subdomains/organization/application/use-cases/OrganizationLifecycleUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";
import type {
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
} from "../../domain/entities/Organization";
⋮----
export class CreateOrganizationUseCase {
⋮----
constructor(private readonly orgRepo: OrganizationRepository)
async execute(command: CreateOrganizationCommand): Promise<CommandResult>
⋮----
export class CreateOrganizationWithTeamUseCase {
⋮----
async execute(
    command: CreateOrganizationCommand,
    teamName: string,
    teamType: "internal" | "external" = "internal",
): Promise<CommandResult>
⋮----
export class UpdateOrganizationSettingsUseCase {
⋮----
async execute(command: UpdateOrganizationSettingsCommand): Promise<CommandResult>
⋮----
export class DeleteOrganizationUseCase {
⋮----
async execute(organizationId: string): Promise<CommandResult>
````

## File: src/modules/iam/subdomains/organization/application/use-cases/OrganizationMemberUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";
import type {
  InviteMemberInput,
  MemberReference,
  UpdateMemberRoleInput,
} from "../../domain/entities/Organization";
⋮----
export class InviteMemberUseCase {
⋮----
constructor(private readonly orgRepo: OrganizationRepository)
async execute(input: InviteMemberInput): Promise<CommandResult>
⋮----
export class RecruitMemberUseCase {
⋮----
async execute(organizationId: string, memberId: string, name: string, email: string): Promise<CommandResult>
⋮----
export class RemoveMemberUseCase {
⋮----
async execute(organizationId: string, memberId: string): Promise<CommandResult>
⋮----
export class UpdateMemberRoleUseCase {
⋮----
async execute(input: UpdateMemberRoleInput): Promise<CommandResult>
⋮----
export class ListOrganizationMembersUseCase {
⋮----
async execute(organizationId: string): Promise<MemberReference[]>
````

## File: src/modules/iam/subdomains/organization/application/use-cases/OrganizationTeamUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";
import type { CreateTeamInput, Team } from "../../domain/entities/Organization";
⋮----
export class CreateTeamUseCase {
⋮----
constructor(private readonly orgRepo: OrganizationRepository)
async execute(input: CreateTeamInput): Promise<CommandResult>
⋮----
export class DeleteTeamUseCase {
⋮----
async execute(organizationId: string, teamId: string): Promise<CommandResult>
⋮----
export class AddMemberToTeamUseCase {
⋮----
async execute(organizationId: string, teamId: string, memberId: string): Promise<CommandResult>
⋮----
export class RemoveMemberFromTeamUseCase {
⋮----
export class ListOrganizationTeamsUseCase {
⋮----
async execute(organizationId: string): Promise<Team[]>
````

## File: src/modules/iam/subdomains/organization/domain/aggregates/Organization.ts
````typescript
import { v4 as uuid } from "uuid";
import type { OrganizationDomainEventType } from "../events/OrganizationDomainEvent";
import type { ThemeConfig } from "../entities/Organization";
import { createOrganizationId } from "../value-objects/OrganizationId";
import { createMemberRole, type MemberRole } from "../value-objects/MemberRole";
import { canSuspend, canDissolve, canReactivate, type OrganizationStatus } from "../value-objects/OrganizationStatus";
⋮----
export interface OrganizationSnapshot {
  readonly id: string;
  readonly name: string;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerEmail: string;
  readonly description: string | null;
  readonly photoURL: string | null;
  readonly theme: ThemeConfig | null;
  readonly memberCount: number;
  readonly teamCount: number;
  readonly status: OrganizationStatus;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateOrganizationInput {
  readonly name: string;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerEmail: string;
  readonly description?: string | null;
  readonly photoURL?: string | null;
  readonly theme?: ThemeConfig | null;
}
⋮----
export class Organization {
⋮----
private constructor(private _props: OrganizationSnapshot)
⋮----
static create(id: string, input: CreateOrganizationInput): Organization
⋮----
static reconstitute(snapshot: OrganizationSnapshot): Organization
⋮----
updateSettings(input:
⋮----
addMember(memberId: string, role: MemberRole): void
⋮----
removeMember(memberId: string): void
⋮----
updateMemberRole(memberId: string, newRole: MemberRole): void
⋮----
suspend(): void
⋮----
dissolve(): void
⋮----
reactivate(): void
⋮----
get id(): string
get name(): string
get ownerId(): string
get status(): OrganizationStatus
get memberCount(): number
⋮----
getSnapshot(): Readonly<OrganizationSnapshot>
⋮----
pullDomainEvents(): OrganizationDomainEventType[]
⋮----
private changeStatus(status: OrganizationStatus): void
⋮----
private ensureActive(message: string): void
⋮----
private recordEvent(event: OrganizationDomainEventType): void
⋮----
private static assertRequired(value: string, message: string): void
````

## File: src/modules/iam/subdomains/organization/domain/aggregates/OrganizationTeam.ts
````typescript
import { v4 as randomUUID } from "uuid";
import type { TeamId } from "../value-objects/TeamId";
import type { TeamType } from "../value-objects/TeamType";
import type { OrganizationTeamDomainEvent } from "../events/OrganizationTeamDomainEvent";
⋮----
export interface OrganizationTeamSnapshot {
  readonly id: string;
  readonly organizationId: string;
  readonly name: string;
  readonly description: string;
  readonly teamType: TeamType;
  readonly memberIds: readonly string[];
}
⋮----
export interface CreateOrganizationTeamProps {
  readonly organizationId: string;
  readonly name: string;
  readonly description?: string;
  readonly teamType: TeamType;
}
⋮----
export class OrganizationTeam {
⋮----
private constructor(private _props: OrganizationTeamSnapshot)
⋮----
static create(id: TeamId, props: CreateOrganizationTeamProps): OrganizationTeam
⋮----
static reconstitute(snapshot: OrganizationTeamSnapshot): OrganizationTeam
⋮----
addMember(memberId: string): void
⋮----
removeMember(memberId: string): void
⋮----
delete(): void
⋮----
get id(): TeamId
⋮----
getSnapshot(): Readonly<OrganizationTeamSnapshot>
⋮----
pullDomainEvents(): OrganizationTeamDomainEvent[]
````

## File: src/modules/iam/subdomains/organization/domain/entities/Organization.ts
````typescript
export type OrganizationRole = "Owner" | "Admin" | "Member" | "Guest";
export type Presence = "active" | "away" | "offline";
export type InviteState = "pending" | "accepted" | "expired";
⋮----
export interface MemberReference {
  id: string;
  name: string;
  email: string;
  role: OrganizationRole;
  presence: Presence;
  isExternal?: boolean;
  expiryDate?: string;
}
⋮----
export interface Team {
  id: string;
  name: string;
  description: string;
  type: "internal" | "external";
  memberIds: string[];
}
⋮----
export interface PartnerInvite {
  id: string;
  email: string;
  teamId: string;
  role: OrganizationRole;
  inviteState: InviteState;
  invitedAt: string;
  protocol: string;
}
⋮----
export interface ThemeConfig {
  primary: string;
  background: string;
  accent: string;
}
⋮----
export type OrgPolicyEffect = "allow" | "deny";
export type OrgPolicyScope = "workspace" | "member" | "global";
⋮----
export interface OrgPolicyRule {
  resource: string;
  actions: string[];
  effect: OrgPolicyEffect;
  conditions?: Record<string, string>;
}
⋮----
export interface OrgPolicy {
  readonly id: string;
  readonly orgId: string;
  readonly name: string;
  readonly description: string;
  readonly rules: OrgPolicyRule[];
  readonly scope: OrgPolicyScope;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}
⋮----
export interface CreateOrganizationCommand {
  readonly organizationName: string;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerEmail: string;
}
⋮----
export interface UpdateOrganizationSettingsCommand {
  readonly organizationId: string;
  readonly name?: string;
  readonly description?: string;
  readonly theme?: ThemeConfig | null;
  readonly photoURL?: string;
}
⋮----
export interface InviteMemberInput {
  organizationId: string;
  email: string;
  teamId: string;
  role: OrganizationRole;
  protocol: string;
}
⋮----
export interface UpdateMemberRoleInput {
  organizationId: string;
  memberId: string;
  role: OrganizationRole;
}
⋮----
export interface CreateTeamInput {
  organizationId: string;
  name: string;
  description: string;
  type: "internal" | "external";
}
⋮----
export interface CreateOrgPolicyInput {
  orgId: string;
  name: string;
  description: string;
  rules: OrgPolicyRule[];
  scope: OrgPolicyScope;
}
⋮----
export interface UpdateOrgPolicyInput {
  name?: string;
  description?: string;
  rules?: OrgPolicyRule[];
  scope?: OrgPolicyScope;
  isActive?: boolean;
}
````

## File: src/modules/iam/subdomains/organization/domain/events/OrganizationDomainEvent.ts
````typescript
export interface OrganizationDomainEventBase {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface OrganizationCreatedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.created";
  readonly payload: { readonly organizationId: string; readonly name: string; readonly ownerId: string };
}
⋮----
export interface OrganizationSettingsUpdatedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.settings_updated";
  readonly payload: { readonly organizationId: string; readonly name?: string; readonly description?: string };
}
⋮----
export interface OrganizationDeletedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.deleted";
  readonly payload: { readonly organizationId: string };
}
⋮----
export interface MemberRecruitedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.member_recruited";
  readonly payload: { readonly organizationId: string; readonly memberId: string };
}
⋮----
export interface MemberRemovedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.member_removed";
  readonly payload: { readonly organizationId: string; readonly memberId: string };
}
⋮----
export interface MemberRoleUpdatedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.member_role_updated";
  readonly payload: { readonly organizationId: string; readonly memberId: string; readonly role: string };
}
⋮----
export interface TeamCreatedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.team_created";
  readonly payload: { readonly organizationId: string; readonly teamId: string; readonly name: string; readonly teamType: "internal" | "external" };
}
⋮----
export interface TeamDeletedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.team_deleted";
  readonly payload: { readonly organizationId: string; readonly teamId: string };
}
⋮----
export type OrganizationDomainEventType =
  | OrganizationCreatedEvent
  | OrganizationSettingsUpdatedEvent
  | OrganizationDeletedEvent
  | MemberRecruitedEvent
  | MemberRemovedEvent
  | MemberRoleUpdatedEvent
  | TeamCreatedEvent
  | TeamDeletedEvent;
````

## File: src/modules/iam/subdomains/organization/domain/events/OrganizationTeamDomainEvent.ts
````typescript
import { z } from "zod";
⋮----
export type OrganizationTeamCreatedEvent = z.infer<typeof OrganizationTeamCreatedEventSchema>;
⋮----
export type OrganizationTeamDeletedEvent = z.infer<typeof OrganizationTeamDeletedEventSchema>;
⋮----
export type OrganizationTeamMemberAddedEvent = z.infer<typeof OrganizationTeamMemberAddedEventSchema>;
⋮----
export type OrganizationTeamMemberRemovedEvent = z.infer<typeof OrganizationTeamMemberRemovedEventSchema>;
⋮----
export type OrganizationTeamDomainEvent =
  | OrganizationTeamCreatedEvent
  | OrganizationTeamDeletedEvent
  | OrganizationTeamMemberAddedEvent
  | OrganizationTeamMemberRemovedEvent;
````

## File: src/modules/iam/subdomains/organization/domain/index.ts
````typescript

````

## File: src/modules/iam/subdomains/organization/domain/repositories/OrganizationRepository.ts
````typescript
import type {
  MemberReference,
  Team,
  PartnerInvite,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
} from "../entities/Organization";
import type { OrganizationSnapshot } from "../aggregates/Organization";
⋮----
export type Unsubscribe = () => void;
⋮----
export interface OrganizationRepository {
  create(command: CreateOrganizationCommand): Promise<string>;
  findById(id: string): Promise<OrganizationSnapshot | null>;
  save(snapshot: OrganizationSnapshot): Promise<void>;
  updateSettings(command: UpdateOrganizationSettingsCommand): Promise<void>;
  delete(organizationId: string): Promise<void>;
  inviteMember(input: InviteMemberInput): Promise<string>;
  recruitMember(organizationId: string, memberId: string, name: string, email: string): Promise<void>;
  removeMember(organizationId: string, memberId: string): Promise<void>;
  updateMemberRole(input: UpdateMemberRoleInput): Promise<void>;
  getMembers(organizationId: string): Promise<MemberReference[]>;
  subscribeToMembers(organizationId: string, onUpdate: (members: MemberReference[]) => void): Unsubscribe;
  createTeam(input: CreateTeamInput): Promise<string>;
  deleteTeam(organizationId: string, teamId: string): Promise<void>;
  addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  getTeams(organizationId: string): Promise<Team[]>;
  subscribeToTeams(organizationId: string, onUpdate: (teams: Team[]) => void): Unsubscribe;
  sendPartnerInvite(organizationId: string, teamId: string, email: string): Promise<string>;
  dismissPartnerMember(organizationId: string, teamId: string, memberId: string): Promise<void>;
  getPartnerInvites(organizationId: string): Promise<PartnerInvite[]>;
}
⋮----
create(command: CreateOrganizationCommand): Promise<string>;
findById(id: string): Promise<OrganizationSnapshot | null>;
save(snapshot: OrganizationSnapshot): Promise<void>;
updateSettings(command: UpdateOrganizationSettingsCommand): Promise<void>;
delete(organizationId: string): Promise<void>;
inviteMember(input: InviteMemberInput): Promise<string>;
recruitMember(organizationId: string, memberId: string, name: string, email: string): Promise<void>;
removeMember(organizationId: string, memberId: string): Promise<void>;
updateMemberRole(input: UpdateMemberRoleInput): Promise<void>;
getMembers(organizationId: string): Promise<MemberReference[]>;
subscribeToMembers(organizationId: string, onUpdate: (members: MemberReference[])
createTeam(input: CreateTeamInput): Promise<string>;
deleteTeam(organizationId: string, teamId: string): Promise<void>;
addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
getTeams(organizationId: string): Promise<Team[]>;
subscribeToTeams(organizationId: string, onUpdate: (teams: Team[])
sendPartnerInvite(organizationId: string, teamId: string, email: string): Promise<string>;
dismissPartnerMember(organizationId: string, teamId: string, memberId: string): Promise<void>;
getPartnerInvites(organizationId: string): Promise<PartnerInvite[]>;
````

## File: src/modules/iam/subdomains/organization/domain/repositories/OrgPolicyRepository.ts
````typescript
import type {
  OrgPolicy,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
} from "../entities/Organization";
⋮----
export interface OrgPolicyRepository {
  createPolicy(input: CreateOrgPolicyInput): Promise<OrgPolicy>;
  updatePolicy(policyId: string, data: UpdateOrgPolicyInput): Promise<void>;
  deletePolicy(policyId: string): Promise<void>;
  getPolicies(orgId: string): Promise<OrgPolicy[]>;
}
⋮----
createPolicy(input: CreateOrgPolicyInput): Promise<OrgPolicy>;
updatePolicy(policyId: string, data: UpdateOrgPolicyInput): Promise<void>;
deletePolicy(policyId: string): Promise<void>;
getPolicies(orgId: string): Promise<OrgPolicy[]>;
````

## File: src/modules/iam/subdomains/organization/domain/value-objects/MemberRole.ts
````typescript
import { z } from "zod";
⋮----
export type MemberRole = z.infer<typeof MemberRoleSchema>;
⋮----
export function createMemberRole(raw: string): MemberRole
⋮----
export function canManageRole(managerRole: MemberRole, targetRole: MemberRole): boolean
````

## File: src/modules/iam/subdomains/organization/domain/value-objects/OrganizationId.ts
````typescript
import { z } from "zod";
⋮----
export type OrganizationId = z.infer<typeof OrganizationIdSchema>;
⋮----
export function createOrganizationId(raw: string): OrganizationId
````

## File: src/modules/iam/subdomains/organization/domain/value-objects/OrganizationStatus.ts
````typescript
export type OrganizationStatus = (typeof ORGANIZATION_STATUSES)[number];
⋮----
export function canSuspend(status: OrganizationStatus): boolean
export function canDissolve(status: OrganizationStatus): boolean
export function canReactivate(status: OrganizationStatus): boolean
````

## File: src/modules/iam/subdomains/organization/domain/value-objects/TeamId.ts
````typescript
import { z } from "zod";
⋮----
export type TeamId = z.infer<typeof TeamIdSchema>;
⋮----
export function createTeamId(raw: string): TeamId
````

## File: src/modules/iam/subdomains/organization/domain/value-objects/TeamType.ts
````typescript
import { z } from "zod";
⋮----
export type TeamType = z.infer<typeof TeamTypeSchema>;
````

## File: src/modules/iam/subdomains/security-policy/adapters/inbound/index.ts
````typescript
// security-policy — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/iam/subdomains/security-policy/adapters/index.ts
````typescript
// security-policy — adapters aggregate
````

## File: src/modules/iam/subdomains/security-policy/adapters/outbound/index.ts
````typescript

````

## File: src/modules/iam/subdomains/security-policy/adapters/outbound/memory/InMemorySecurityPolicyRepository.ts
````typescript
import type { SecurityPolicySnapshot, SecurityPolicyRepository } from "../../../domain/index";
⋮----
export class InMemorySecurityPolicyRepository implements SecurityPolicyRepository {
⋮----
async findByOrgId(orgId: string): Promise<SecurityPolicySnapshot | null>
⋮----
async save(policy: SecurityPolicySnapshot): Promise<void>
````

## File: src/modules/iam/subdomains/security-policy/application/index.ts
````typescript

````

## File: src/modules/iam/subdomains/security-policy/application/use-cases/SecurityPolicyUseCases.ts
````typescript
import { SecurityPolicy } from "../../domain/index";
import type { SecurityPolicySnapshot, SecurityPolicyRepository } from "../../domain/index";
⋮----
export class GetSecurityPolicyUseCase {
⋮----
constructor(private readonly repo: SecurityPolicyRepository)
⋮----
async execute(input:
⋮----
export class UpdateSecurityPolicyUseCase {
⋮----
async execute(
    input: Omit<SecurityPolicySnapshot, "updatedAtISO">,
): Promise<SecurityPolicySnapshot>
````

## File: src/modules/iam/subdomains/security-policy/domain/index.ts
````typescript
// security-policy — domain layer
// Owns org-level security rules: password policy, MFA requirements, session limits.
import { v4 as randomUUID } from "uuid";
⋮----
export type MfaRequirement = "none" | "optional" | "required";
⋮----
export interface SecurityPolicySnapshot {
  readonly policyId: string;
  readonly orgId: string;
  readonly mfaRequirement: MfaRequirement;
  readonly minPasswordLength: number;
  readonly sessionTimeoutMinutes: number;
  readonly allowedDomains: readonly string[];
  readonly updatedAtISO: string;
}
⋮----
export interface SecurityPolicyRepository {
  findByOrgId(orgId: string): Promise<SecurityPolicySnapshot | null>;
  save(policy: SecurityPolicySnapshot): Promise<void>;
}
⋮----
findByOrgId(orgId: string): Promise<SecurityPolicySnapshot | null>;
save(policy: SecurityPolicySnapshot): Promise<void>;
⋮----
export type SecurityPolicyDomainEvent =
  | {
      readonly type: "iam.security_policy.created";
      readonly eventId: string;
      readonly occurredAt: string;
      readonly payload: { readonly policyId: string; readonly orgId: string };
    }
  | {
      readonly type: "iam.security_policy.updated";
      readonly eventId: string;
      readonly occurredAt: string;
      readonly payload: { readonly policyId: string; readonly orgId: string };
    };
⋮----
interface CreateSecurityPolicyProps {
  readonly policyId: string;
  readonly orgId: string;
  readonly mfaRequirement: MfaRequirement;
  readonly minPasswordLength: number;
  readonly sessionTimeoutMinutes: number;
  readonly allowedDomains: readonly string[];
}
⋮----
export class SecurityPolicy {
⋮----
private constructor(private _props: SecurityPolicySnapshot)
⋮----
static create(input: CreateSecurityPolicyProps): SecurityPolicy
⋮----
static reconstitute(snapshot: SecurityPolicySnapshot): SecurityPolicy
⋮----
update(input: {
    readonly mfaRequirement: MfaRequirement;
    readonly minPasswordLength: number;
    readonly sessionTimeoutMinutes: number;
    readonly allowedDomains: readonly string[];
}): void
⋮----
getSnapshot(): Readonly<SecurityPolicySnapshot>
⋮----
pullDomainEvents(): readonly SecurityPolicyDomainEvent[]
⋮----
private static assertInvariants(snapshot: SecurityPolicySnapshot): void
⋮----
private static normalizeDomains(domains: readonly string[]): readonly string[]
````

## File: src/modules/iam/subdomains/session/adapters/inbound/index.ts
````typescript
// session — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/iam/subdomains/session/adapters/index.ts
````typescript
// session — adapters aggregate
````

## File: src/modules/iam/subdomains/session/adapters/outbound/index.ts
````typescript

````

## File: src/modules/iam/subdomains/session/adapters/outbound/memory/InMemorySessionRepository.ts
````typescript
import type { SessionSnapshot, SessionRepository } from "../../../domain/index";
⋮----
export class InMemorySessionRepository implements SessionRepository {
⋮----
async save(session: SessionSnapshot): Promise<void>
⋮----
async saveMany(sessions: readonly SessionSnapshot[]): Promise<void>
⋮----
async findById(sessionId: string): Promise<SessionSnapshot | null>
⋮----
async findByUid(uid: string): Promise<SessionSnapshot[]>
````

## File: src/modules/iam/subdomains/session/application/index.ts
````typescript

````

## File: src/modules/iam/subdomains/session/application/use-cases/SessionUseCases.ts
````typescript
import { Session } from "../../domain/index";
import type { SessionSnapshot, SessionRepository } from "../../domain/index";
⋮----
export class CreateSessionUseCase {
⋮----
constructor(private readonly repo: SessionRepository)
⋮----
async execute(input: {
    sessionId: string;
    uid: string;
    idToken: string;
    refreshToken: string | null;
    expiresAtISO: string;
}): Promise<SessionSnapshot>
⋮----
export class GetSessionUseCase {
⋮----
export class RevokeSessionUseCase {
⋮----
export class RevokeAllSessionsUseCase {
````

## File: src/modules/iam/subdomains/session/domain/index.ts
````typescript
// session — domain layer
// Owns actor session lifecycle: creation, refresh, expiry, revocation.
import { v4 as randomUUID } from "uuid";
⋮----
export interface SessionSnapshot {
  readonly sessionId: string;
  readonly uid: string;
  readonly idToken: string;
  readonly refreshToken: string | null;
  readonly expiresAtISO: string;
  readonly createdAtISO: string;
  readonly isRevoked: boolean;
}
⋮----
export interface SessionRepository {
  save(session: SessionSnapshot): Promise<void>;
  saveMany(sessions: readonly SessionSnapshot[]): Promise<void>;
  findById(sessionId: string): Promise<SessionSnapshot | null>;
  findByUid(uid: string): Promise<SessionSnapshot[]>;
}
⋮----
save(session: SessionSnapshot): Promise<void>;
saveMany(sessions: readonly SessionSnapshot[]): Promise<void>;
findById(sessionId: string): Promise<SessionSnapshot | null>;
findByUid(uid: string): Promise<SessionSnapshot[]>;
⋮----
export type SessionDomainEvent =
  | {
      readonly type: "iam.session.created";
      readonly eventId: string;
      readonly occurredAt: string;
      readonly payload: { readonly sessionId: string; readonly uid: string };
    }
  | {
      readonly type: "iam.session.revoked";
      readonly eventId: string;
      readonly occurredAt: string;
      readonly payload: { readonly sessionId: string; readonly uid: string };
    };
⋮----
interface CreateSessionProps {
  readonly sessionId: string;
  readonly uid: string;
  readonly idToken: string;
  readonly refreshToken: string | null;
  readonly expiresAtISO: string;
}
⋮----
export class Session {
⋮----
private constructor(private _props: SessionSnapshot)
⋮----
static create(input: CreateSessionProps): Session
⋮----
static reconstitute(snapshot: SessionSnapshot): Session
⋮----
revoke(): void
⋮----
getSnapshot(): Readonly<SessionSnapshot>
⋮----
pullDomainEvents(): readonly SessionDomainEvent[]
⋮----
private static assertInvariants(snapshot: SessionSnapshot): void
````

## File: src/modules/iam/subdomains/tenant/adapters/inbound/index.ts
````typescript
// tenant — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/iam/subdomains/tenant/adapters/index.ts
````typescript
// tenant — adapters aggregate
````

## File: src/modules/iam/subdomains/tenant/adapters/outbound/index.ts
````typescript

````

## File: src/modules/iam/subdomains/tenant/adapters/outbound/memory/InMemoryTenantRepository.ts
````typescript
import type { TenantSnapshot, TenantRepository } from "../../../domain/index";
⋮----
export class InMemoryTenantRepository implements TenantRepository {
⋮----
async findByOrgId(orgId: string): Promise<TenantSnapshot | null>
⋮----
async save(tenant: TenantSnapshot): Promise<void>
````

## File: src/modules/iam/subdomains/tenant/application/index.ts
````typescript

````

## File: src/modules/iam/subdomains/tenant/application/use-cases/TenantUseCases.ts
````typescript
import { Tenant, createTenantId } from "../../domain/index";
import type { TenantId, TenantSnapshot, TenantRepository } from "../../domain/index";
⋮----
export class ProvisionTenantUseCase {
⋮----
constructor(private readonly repo: TenantRepository)
⋮----
async execute(input:
⋮----
export class SuspendTenantUseCase {
⋮----
export class GetTenantUseCase {
````

## File: src/modules/iam/subdomains/tenant/domain/index.ts
````typescript
// tenant — domain layer
// Owns multi-tenant data isolation: TenantId brand type and repository port.
import { v4 as randomUUID } from "uuid";
import { z } from "zod";
⋮----
export type TenantId = z.infer<typeof TenantIdSchema>;
export function createTenantId(raw: string): TenantId
⋮----
export type TenantStatus = "active" | "suspended" | "terminated";
⋮----
export interface TenantSnapshot {
  readonly tenantId: TenantId;
  readonly orgId: string;
  readonly status: TenantStatus;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface TenantRepository {
  findByOrgId(orgId: string): Promise<TenantSnapshot | null>;
  save(tenant: TenantSnapshot): Promise<void>;
}
⋮----
findByOrgId(orgId: string): Promise<TenantSnapshot | null>;
save(tenant: TenantSnapshot): Promise<void>;
⋮----
export type TenantDomainEvent =
  | {
      readonly type: "iam.tenant.provisioned";
      readonly eventId: string;
      readonly occurredAt: string;
      readonly payload: { readonly tenantId: TenantId; readonly orgId: string };
    }
  | {
      readonly type: "iam.tenant.suspended";
      readonly eventId: string;
      readonly occurredAt: string;
      readonly payload: { readonly tenantId: TenantId; readonly orgId: string };
    };
⋮----
interface CreateTenantProps {
  readonly tenantId: TenantId;
  readonly orgId: string;
}
⋮----
export class Tenant {
⋮----
private constructor(private _props: TenantSnapshot)
⋮----
static create(input: CreateTenantProps): Tenant
⋮----
static reconstitute(snapshot: TenantSnapshot): Tenant
⋮----
suspend(): void
⋮----
getSnapshot(): Readonly<TenantSnapshot>
⋮----
pullDomainEvents(): readonly TenantDomainEvent[]
⋮----
private static assertInvariants(snapshot: TenantSnapshot): void
````

## File: src/modules/notebooklm/adapters/inbound/react/index.ts
````typescript
/**
 * notebooklm/adapters/inbound/react — barrel.
 * Section components for notebooklm tabs in the workspace view.
 */
````

## File: src/modules/notebooklm/adapters/inbound/react/NotebooklmResearchSection.tsx
````typescript
/**
 * NotebooklmResearchSection — notebooklm.research tab — workspace synthesis.
 * Calls rag_query with a synthesis prompt to summarise all workspace documents.
 *
 * Closed-loop design: the synthesis result can be forwarded to
 * workspace.task-formation as the AI research source for task generation.
 */
⋮----
import { Button } from "@packages";
import { BookOpen, FlaskConical, ListPlus } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
⋮----
import type { RagQueryOutput } from "../../../adapters/outbound/callable/FirebaseCallableAdapter";
import { synthesizeWorkspaceAction } from "../server-actions/notebook-actions";
⋮----
interface NotebooklmResearchSectionProps {
  workspaceId: string;
  accountId: string;
}
⋮----
function taskFormationHref(accountId: string, workspaceId: string)
⋮----
const handleSynthesize = () =>
⋮----
{/* Closed-loop CTA: forward research result to task formation */}
⋮----
href=
````

## File: src/modules/notebooklm/adapters/outbound/TaskMaterializationWorkflowAdapter.ts
````typescript
/**
 * TaskMaterializationWorkflowAdapter — synchronous Server Action bridge for task handoff.
 *
 * ADR: Task bridge → synchronous Server Action callback (option A, not QStash).
 *
 * This adapter receives an injected `WorkspaceTaskFormationCallback` from the
 * composition root (source-processing-actions.ts). When `sourceText` is provided
 * in the input it delegates to workspace's full extract-and-confirm pipeline via
 * the callback. Pre-extracted `candidates` (legacy path) are counted as-is.
 *
 * ESLint: No @integration-firebase import — delegates only via injected callback.
 */
⋮----
import type {
  TaskMaterializationWorkflowPort,
  MaterializeTasksInput,
  MaterializeTasksResult,
} from "../../orchestration/TaskMaterializationWorkflowPort";
⋮----
/**
 * Injected workspace task-formation capability.
 * The composition root provides this callback using workspace's internal use cases;
 * the adapter stays decoupled from workspace internals.
 */
export interface WorkspaceTaskFormationCallback {
  run(input: {
    sourceText: string;
    workspaceId: string;
    actorId: string;
    knowledgePageId: string;
  }): Promise<{ taskCount: number; error?: string }>;
}
⋮----
run(input: {
    sourceText: string;
    workspaceId: string;
    actorId: string;
    knowledgePageId: string;
}): Promise<
⋮----
export class TaskMaterializationWorkflowAdapter implements TaskMaterializationWorkflowPort {
⋮----
constructor(private readonly workspaceTaskFormation: WorkspaceTaskFormationCallback)
⋮----
async materializeTasks(input: MaterializeTasksInput): Promise<MaterializeTasksResult>
⋮----
// Primary path: AI extraction via workspace Genkit flow
⋮----
// Legacy path: pre-extracted candidates provided directly
````

## File: src/modules/notebooklm/infrastructure/ai/synthesis.flow.ts
````typescript
import { ai } from "@/packages/integration-ai/genkit";
import { z } from "genkit";
⋮----
export type NotebooklmSynthesisInput = z.infer<typeof NotebooklmSynthesisInputSchema>;
export type NotebooklmSynthesisOutput = z.infer<typeof NotebooklmSynthesisOutputSchema>;
⋮----
const buildSynthesisPrompt = (input: NotebooklmSynthesisInput): string
````

## File: src/modules/notebooklm/orchestration/index.ts
````typescript
// notebooklm — orchestration layer
// Cross-subdomain composition and facade lives here.
````

## File: src/modules/notebooklm/orchestration/TaskMaterializationWorkflowPort.ts
````typescript
/**
 * TaskMaterializationWorkflowPort — outbound port for task materialization.
 *
 * notebooklm/source calls this port to hand off task candidates to the
 * workspace task flow. notebooklm does NOT directly write workspace repositories.
 *
 * Implementors: TaskMaterializationWorkflowAdapter (adapters/outbound/)
 */
⋮----
export interface TaskCandidate {
  readonly title: string;
  readonly description?: string;
  readonly sourceRef?: string;
}
⋮----
export interface MaterializeTasksInput {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly sourceDocumentId: string;
  readonly knowledgePageId: string;
  readonly candidates: readonly TaskCandidate[];
  /** Source text forwarded to workspace AI extraction when candidates is empty. */
  readonly sourceText?: string;
  /** Actor performing the materialization (defaults to requestedByUserId). */
  readonly actorId?: string;
  readonly requestedByUserId?: string;
}
⋮----
/** Source text forwarded to workspace AI extraction when candidates is empty. */
⋮----
/** Actor performing the materialization (defaults to requestedByUserId). */
⋮----
export interface MaterializeTasksResult {
  readonly ok: boolean;
  readonly taskCount: number;
  readonly workflowHref?: string;
  readonly error?: string;
}
⋮----
export interface TaskMaterializationWorkflowPort {
  materializeTasks(input: MaterializeTasksInput): Promise<MaterializeTasksResult>;
}
⋮----
materializeTasks(input: MaterializeTasksInput): Promise<MaterializeTasksResult>;
````

## File: src/modules/notebooklm/shared/errors/index.ts
````typescript
// notebooklm shared/errors placeholder
````

## File: src/modules/notebooklm/shared/events/index.ts
````typescript
// notebooklm shared/events placeholder
````

## File: src/modules/notebooklm/shared/index.ts
````typescript

````

## File: src/modules/notebooklm/shared/types/index.ts
````typescript
// notebooklm shared/types placeholder
````

## File: src/modules/notebooklm/subdomains/conversation/adapters/inbound/index.ts
````typescript
// conversation — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notebooklm/subdomains/conversation/adapters/index.ts
````typescript
// conversation — adapters aggregate
````

## File: src/modules/notebooklm/subdomains/conversation/adapters/outbound/index.ts
````typescript
// conversation — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notebooklm/subdomains/conversation/adapters/outbound/memory/InMemoryConversationRepository.ts
````typescript
import type { ConversationSnapshot } from "../../../domain/entities/Conversation";
import type { ConversationRepository } from "../../../domain/repositories/ConversationRepository";
⋮----
export class InMemoryConversationRepository implements ConversationRepository {
⋮----
async save(snapshot: ConversationSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<ConversationSnapshot | null>
⋮----
async findByNotebookId(notebookId: string): Promise<ConversationSnapshot[]>
⋮----
async findByAccountId(accountId: string, limit = 50): Promise<ConversationSnapshot[]>
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/notebooklm/subdomains/conversation/application/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/conversation/application/use-cases/ConversationUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Conversation, type StartConversationInput } from "../../domain/entities/Conversation";
import type { ConversationRepository } from "../../domain/repositories/ConversationRepository";
⋮----
export class StartConversationUseCase {
⋮----
constructor(private readonly repo: ConversationRepository)
⋮----
async execute(input: StartConversationInput): Promise<CommandResult>
⋮----
export class AddMessageToConversationUseCase {
⋮----
async execute(input: {
    conversationId: string;
    role: "user" | "assistant" | "system";
    content: string;
}): Promise<CommandResult>
⋮----
export class LoadConversationUseCase {
⋮----
async execute(conversationId: string)
````

## File: src/modules/notebooklm/subdomains/conversation/domain/entities/Conversation.ts
````typescript
/**
 * Conversation — distilled from modules/notebooklm/subdomains/conversation
 * Owns thread-based AI conversations linked to a notebook.
 */
import { v4 as uuid } from "uuid";
⋮----
export type MessageRole = "user" | "assistant" | "system";
⋮----
export interface ConversationMessage {
  readonly id: string;
  readonly role: MessageRole;
  readonly content: string;
  readonly createdAtISO: string;
}
⋮----
export interface ConversationSnapshot {
  readonly id: string;
  readonly notebookId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly messages: ConversationMessage[];
  readonly title?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface StartConversationInput {
  readonly notebookId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title?: string;
}
⋮----
export class Conversation {
⋮----
private constructor(private _props: ConversationSnapshot)
⋮----
static start(input: StartConversationInput): Conversation
⋮----
static reconstitute(snapshot: ConversationSnapshot): Conversation
⋮----
addMessage(role: MessageRole, content: string): string
⋮----
get id(): string
get notebookId(): string
get messages(): ConversationMessage[]
get workspaceId(): string
⋮----
getSnapshot(): Readonly<ConversationSnapshot>
⋮----
pullDomainEvents()
````

## File: src/modules/notebooklm/subdomains/conversation/domain/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/conversation/domain/repositories/ConversationRepository.ts
````typescript
import type { ConversationSnapshot } from "../entities/Conversation";
⋮----
export interface ConversationRepository {
  save(snapshot: ConversationSnapshot): Promise<void>;
  findById(id: string): Promise<ConversationSnapshot | null>;
  findByNotebookId(notebookId: string): Promise<ConversationSnapshot[]>;
  findByAccountId(accountId: string, limit?: number): Promise<ConversationSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: ConversationSnapshot): Promise<void>;
findById(id: string): Promise<ConversationSnapshot | null>;
findByNotebookId(notebookId: string): Promise<ConversationSnapshot[]>;
findByAccountId(accountId: string, limit?: number): Promise<ConversationSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notebooklm/subdomains/notebook/adapters/inbound/index.ts
````typescript
// notebook — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notebooklm/subdomains/notebook/adapters/index.ts
````typescript
// notebook — adapters aggregate
````

## File: src/modules/notebooklm/subdomains/notebook/adapters/outbound/index.ts
````typescript
// notebook — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notebooklm/subdomains/notebook/adapters/outbound/memory/InMemoryNotebookRepository.ts
````typescript
import type { NotebookSnapshot } from "../../../domain/entities/Notebook";
import type { NotebookRepository } from "../../../domain/repositories/NotebookRepository";
⋮----
export class InMemoryNotebookRepository implements NotebookRepository {
⋮----
async save(snapshot: NotebookSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<NotebookSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<NotebookSnapshot[]>
⋮----
async findByAccountId(accountId: string): Promise<NotebookSnapshot[]>
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/notebooklm/subdomains/notebook/application/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/notebook/application/use-cases/NotebookUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Notebook, type CreateNotebookInput } from "../../domain/entities/Notebook";
import type { NotebookRepository } from "../../domain/repositories/NotebookRepository";
import type { NotebookGenerationPort } from "../../domain/ports/NotebookGenerationPort";
⋮----
export class CreateNotebookUseCase {
⋮----
constructor(private readonly repo: NotebookRepository)
⋮----
async execute(input: CreateNotebookInput): Promise<CommandResult>
⋮----
export class AddDocumentToNotebookUseCase {
⋮----
async execute(notebookId: string, documentId: string): Promise<CommandResult>
⋮----
export class GenerateNotebookResponseUseCase {
⋮----
constructor(
⋮----
async execute(input: {
    notebookId: string;
    prompt: string;
    model?: string;
}): Promise<
````

## File: src/modules/notebooklm/subdomains/notebook/domain/entities/Notebook.ts
````typescript
/**
 * Notebook — distilled from modules/notebooklm/subdomains/notebook
 * Represents an AI-assisted notebook backed by documents.
 */
import { v4 as uuid } from "uuid";
⋮----
export type NotebookStatus = "active" | "archived";
⋮----
export interface NotebookSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly documentIds: readonly string[];
  readonly status: NotebookStatus;
  readonly model?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateNotebookInput {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly model?: string;
}
⋮----
export class Notebook {
⋮----
private constructor(private _props: NotebookSnapshot)
⋮----
static create(input: CreateNotebookInput): Notebook
⋮----
static reconstitute(snapshot: NotebookSnapshot): Notebook
⋮----
addDocument(documentId: string): void
⋮----
removeDocument(documentId: string): void
⋮----
archive(): void
⋮----
get id(): string
get title(): string
get status(): NotebookStatus
get workspaceId(): string
get documentIds(): readonly string[]
⋮----
getSnapshot(): Readonly<NotebookSnapshot>
⋮----
pullDomainEvents()
````

## File: src/modules/notebooklm/subdomains/notebook/domain/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/notebook/domain/ports/NotebookGenerationPort.ts
````typescript
export interface NotebookGenerationPort {
  generateResponse(input: {
    prompt: string;
    notebookId: string;
    model?: string;
    system?: string;
  }): Promise<{ text: string; model: string; finishReason?: string }>;
}
⋮----
generateResponse(input: {
    prompt: string;
    notebookId: string;
    model?: string;
    system?: string;
}): Promise<
````

## File: src/modules/notebooklm/subdomains/notebook/domain/repositories/NotebookRepository.ts
````typescript
import type { NotebookSnapshot } from "../entities/Notebook";
⋮----
export interface NotebookRepository {
  save(snapshot: NotebookSnapshot): Promise<void>;
  findById(id: string): Promise<NotebookSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<NotebookSnapshot[]>;
  findByAccountId(accountId: string): Promise<NotebookSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: NotebookSnapshot): Promise<void>;
findById(id: string): Promise<NotebookSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<NotebookSnapshot[]>;
findByAccountId(accountId: string): Promise<NotebookSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notion/adapters/inbound/react/index.ts
````typescript
/**
 * notion/adapters/inbound/react — barrel.
 * Section components for notion tabs in the workspace view.
 */
````

## File: src/modules/notion/adapters/inbound/react/NotionKnowledgeSection.tsx
````typescript
/**
 * NotionKnowledgeSection — top-level knowledge hub for the notion.knowledge tab.
 *
 * Closed-loop design: the knowledge hub is the central orchestrator showing
 * the full data flow pipeline:
 *   Sources (upload) → Pages/Database (structure) → AI (analysis) → Tasks (execution)
 */
⋮----
import { FileText, BookOpen, Layout, LayoutGrid, Upload, ListPlus, ArrowRight, Brain } from "lucide-react";
import Link from "next/link";
⋮----
interface NotionKnowledgeSectionProps {
  workspaceId: string;
  accountId: string;
}
⋮----
{/* Closed-loop pipeline visualization */}
⋮----
{/* Knowledge type quick access */}
````

## File: src/modules/notion/adapters/outbound/notion-page-stub.ts
````typescript
/**
 * notion-page-stub — notion outbound adapter stub.
 *
 * Stub implementation of createKnowledgePage. Replace with a real
 * Firestore-backed implementation when the notion infrastructure layer
 * is available.
 */
⋮----
export interface CreateKnowledgePageInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly parentPageId: string | null;
  readonly createdByUserId: string;
}
⋮----
export interface CreateKnowledgePageResult {
  readonly success: boolean;
  readonly error?: { message: string };
}
⋮----
/** Stub — replace with real Firestore implementation when available. */
export async function createKnowledgePage(
  _input: CreateKnowledgePageInput,
): Promise<CreateKnowledgePageResult>
````

## File: src/modules/notion/orchestration/index.ts
````typescript
// notion — orchestration layer
// Cross-subdomain composition and facade lives here.
// TODO: implement NotionFacade if needed.
````

## File: src/modules/notion/shared/errors/index.ts
````typescript
// notion shared/errors placeholder
````

## File: src/modules/notion/shared/events/index.ts
````typescript
// notion shared/events placeholder
````

## File: src/modules/notion/shared/index.ts
````typescript

````

## File: src/modules/notion/shared/types/index.ts
````typescript
// notion shared/types placeholder
````

## File: src/modules/notion/subdomains/block/adapters/inbound/index.ts
````typescript
// block — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notion/subdomains/block/adapters/index.ts
````typescript
// block — adapters aggregate
````

## File: src/modules/notion/subdomains/block/adapters/outbound/index.ts
````typescript
// block — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notion/subdomains/block/adapters/outbound/memory/InMemoryBlockRepository.ts
````typescript
import type { BlockSnapshot } from "../../../domain/entities/Block";
import type { BlockRepository } from "../../../domain/repositories/BlockRepository";
⋮----
export class InMemoryBlockRepository implements BlockRepository {
⋮----
async save(snapshot: BlockSnapshot): Promise<void>
⋮----
async saveAll(snapshots: BlockSnapshot[]): Promise<void>
⋮----
async findById(id: string): Promise<BlockSnapshot | null>
⋮----
async findByPageId(pageId: string): Promise<BlockSnapshot[]>
⋮----
async findChildren(parentBlockId: string): Promise<BlockSnapshot[]>
⋮----
async delete(id: string): Promise<void>
⋮----
async deleteByPageId(pageId: string): Promise<void>
````

## File: src/modules/notion/subdomains/block/application/index.ts
````typescript

````

## File: src/modules/notion/subdomains/block/application/use-cases/BlockUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Block, type CreateBlockInput, type BlockContent } from "../../domain/entities/Block";
import type { BlockRepository } from "../../domain/repositories/BlockRepository";
⋮----
export class CreateBlockUseCase {
⋮----
constructor(private readonly repo: BlockRepository)
⋮----
async execute(input: CreateBlockInput): Promise<CommandResult>
⋮----
export class UpdateBlockUseCase {
⋮----
async execute(blockId: string, content: Partial<BlockContent>): Promise<CommandResult>
⋮----
export class GetPageBlocksUseCase {
⋮----
async execute(pageId: string)
````

## File: src/modules/notion/subdomains/block/domain/entities/Block.ts
````typescript
/**
 * Block — distilled from modules/notion/subdomains/knowledge/domain/aggregates/ContentBlock.ts
 */
import { v4 as uuid } from "uuid";
⋮----
export type BlockType =
  | "paragraph"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "bulleted_list"
  | "numbered_list"
  | "todo"
  | "toggle"
  | "code"
  | "quote"
  | "callout"
  | "divider"
  | "image"
  | "file"
  | "embed";
⋮----
export interface BlockContent {
  readonly type: BlockType;
  readonly text?: string;
  readonly checked?: boolean;
  readonly url?: string;
  readonly language?: string;
  readonly attributes?: Record<string, unknown>;
}
⋮----
export interface BlockSnapshot {
  readonly id: string;
  readonly pageId: string;
  readonly parentBlockId?: string;
  readonly order: number;
  readonly content: BlockContent;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateBlockInput {
  readonly pageId: string;
  readonly parentBlockId?: string;
  readonly order: number;
  readonly content: BlockContent;
  readonly createdByUserId: string;
}
⋮----
export class Block {
⋮----
private constructor(private _props: BlockSnapshot)
⋮----
static create(input: CreateBlockInput): Block
⋮----
static reconstitute(snapshot: BlockSnapshot): Block
⋮----
update(content: Partial<BlockContent>): void
⋮----
reorder(order: number): void
⋮----
get id(): string
get pageId(): string
get content(): BlockContent
get order(): number
⋮----
getSnapshot(): Readonly<BlockSnapshot>
````

## File: src/modules/notion/subdomains/block/domain/index.ts
````typescript

````

## File: src/modules/notion/subdomains/block/domain/repositories/BlockRepository.ts
````typescript
import type { BlockSnapshot } from "../entities/Block";
⋮----
export interface BlockRepository {
  save(snapshot: BlockSnapshot): Promise<void>;
  saveAll(snapshots: BlockSnapshot[]): Promise<void>;
  findById(id: string): Promise<BlockSnapshot | null>;
  findByPageId(pageId: string): Promise<BlockSnapshot[]>;
  findChildren(parentBlockId: string): Promise<BlockSnapshot[]>;
  delete(id: string): Promise<void>;
  deleteByPageId(pageId: string): Promise<void>;
}
⋮----
save(snapshot: BlockSnapshot): Promise<void>;
saveAll(snapshots: BlockSnapshot[]): Promise<void>;
findById(id: string): Promise<BlockSnapshot | null>;
findByPageId(pageId: string): Promise<BlockSnapshot[]>;
findChildren(parentBlockId: string): Promise<BlockSnapshot[]>;
delete(id: string): Promise<void>;
deleteByPageId(pageId: string): Promise<void>;
````

## File: src/modules/notion/subdomains/collaboration/adapters/inbound/index.ts
````typescript
// collaboration — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notion/subdomains/collaboration/adapters/index.ts
````typescript
// collaboration — adapters aggregate
````

## File: src/modules/notion/subdomains/collaboration/adapters/outbound/index.ts
````typescript
// collaboration — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notion/subdomains/collaboration/application/index.ts
````typescript
// collaboration — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/notion/subdomains/collaboration/application/use-cases/CollaborationUseCases.ts
````typescript
// TODO: implement collaboration use-cases (commenting, presence, sharing)
````

## File: src/modules/notion/subdomains/collaboration/domain/entities/Comment.ts
````typescript
export type PresenceStatus = "online" | "idle" | "offline";
⋮----
export interface PagePresence {
  readonly pageId: string;
  readonly accountId: string;
  readonly cursorPosition?: number;
  readonly status: PresenceStatus;
  readonly lastSeenISO: string;
}
⋮----
export interface Comment {
  readonly id: string;
  readonly pageId: string;
  readonly blockId?: string;
  readonly accountId: string;
  readonly content: string;
  readonly resolved: boolean;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CommentRepository {
  save(comment: Comment): Promise<void>;
  findById(id: string): Promise<Comment | null>;
  findByPageId(pageId: string): Promise<Comment[]>;
  resolveComment(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
⋮----
save(comment: Comment): Promise<void>;
findById(id: string): Promise<Comment | null>;
findByPageId(pageId: string): Promise<Comment[]>;
resolveComment(id: string): Promise<void>;
delete(id: string): Promise<void>;
````

## File: src/modules/notion/subdomains/collaboration/domain/index.ts
````typescript
// collaboration — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/notion/subdomains/database/adapters/inbound/index.ts
````typescript
// database — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notion/subdomains/database/adapters/index.ts
````typescript
// database — adapters aggregate
````

## File: src/modules/notion/subdomains/database/adapters/outbound/index.ts
````typescript
// database — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notion/subdomains/database/application/index.ts
````typescript

````

## File: src/modules/notion/subdomains/database/application/use-cases/DatabaseUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Database, type CreateDatabaseInput, type DatabaseProperty } from "../../domain/entities/Database";
import type { DatabaseRepository } from "../../domain/repositories/DatabaseRepository";
⋮----
export class CreateDatabaseUseCase {
⋮----
constructor(private readonly repo: DatabaseRepository)
⋮----
async execute(input: CreateDatabaseInput): Promise<CommandResult>
⋮----
export class AddPropertyUseCase {
⋮----
async execute(databaseId: string, property: DatabaseProperty): Promise<CommandResult>
````

## File: src/modules/notion/subdomains/database/domain/index.ts
````typescript

````

## File: src/modules/notion/subdomains/page/adapters/inbound/index.ts
````typescript
// page — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notion/subdomains/page/adapters/index.ts
````typescript
// page — adapters aggregate
````

## File: src/modules/notion/subdomains/page/adapters/outbound/index.ts
````typescript
// page — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notion/subdomains/page/adapters/outbound/memory/InMemoryPageRepository.ts
````typescript
import type { PageSnapshot, PageStatus } from "../../../domain/entities/Page";
import type { PageRepository, PageQuery } from "../../../domain/repositories/PageRepository";
⋮----
export class InMemoryPageRepository implements PageRepository {
⋮----
async save(snapshot: PageSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<PageSnapshot | null>
⋮----
async findBySlug(slug: string, accountId: string): Promise<PageSnapshot | null>
⋮----
async findChildren(parentPageId: string): Promise<PageSnapshot[]>
⋮----
async query(params: PageQuery): Promise<PageSnapshot[]>
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/notion/subdomains/page/application/index.ts
````typescript

````

## File: src/modules/notion/subdomains/page/application/use-cases/PageUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Page, type CreatePageInput } from "../../domain/entities/Page";
import type { PageRepository, PageQuery } from "../../domain/repositories/PageRepository";
⋮----
export class CreatePageUseCase {
⋮----
constructor(private readonly repo: PageRepository)
⋮----
async execute(input: CreatePageInput): Promise<CommandResult>
⋮----
export class RenamePageUseCase {
⋮----
async execute(pageId: string, title: string): Promise<CommandResult>
⋮----
export class ArchivePageUseCase {
⋮----
async execute(pageId: string): Promise<CommandResult>
⋮----
export class QueryPagesUseCase {
⋮----
async execute(params: PageQuery)
````

## File: src/modules/notion/subdomains/page/domain/index.ts
````typescript

````

## File: src/modules/notion/subdomains/page/domain/repositories/PageRepository.ts
````typescript
import type { PageSnapshot, PageStatus } from "../entities/Page";
⋮----
export interface PageQuery {
  readonly accountId?: string;
  readonly workspaceId?: string;
  readonly parentPageId?: string | null;
  readonly status?: PageStatus;
  readonly limit?: number;
  readonly offset?: number;
}
⋮----
export interface PageRepository {
  save(snapshot: PageSnapshot): Promise<void>;
  findById(id: string): Promise<PageSnapshot | null>;
  findBySlug(slug: string, accountId: string): Promise<PageSnapshot | null>;
  findChildren(parentPageId: string): Promise<PageSnapshot[]>;
  query(params: PageQuery): Promise<PageSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: PageSnapshot): Promise<void>;
findById(id: string): Promise<PageSnapshot | null>;
findBySlug(slug: string, accountId: string): Promise<PageSnapshot | null>;
findChildren(parentPageId: string): Promise<PageSnapshot[]>;
query(params: PageQuery): Promise<PageSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notion/subdomains/template/adapters/inbound/index.ts
````typescript
// template — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notion/subdomains/template/adapters/index.ts
````typescript
// template — adapters aggregate
````

## File: src/modules/notion/subdomains/template/adapters/outbound/index.ts
````typescript
// template — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notion/subdomains/template/application/index.ts
````typescript
// template — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/notion/subdomains/template/domain/entities/Template.ts
````typescript
/**
 * Template — distilled from notion taxonomy subdomain
 * Represents a reusable page/database template.
 */
export type TemplateScope = "workspace" | "organization" | "global";
export type TemplateCategory = "page" | "database" | "workflow";
⋮----
export interface Template {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly scope: TemplateScope;
  readonly category: TemplateCategory;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly createdByUserId: string;
  readonly pageSnapshotId?: string;
  readonly databaseSnapshotId?: string;
  readonly tags: string[];
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface TemplateRepository {
  save(template: Template): Promise<void>;
  findById(id: string): Promise<Template | null>;
  findByScope(scope: TemplateScope, contextId?: string): Promise<Template[]>;
  listByCategory(category: TemplateCategory): Promise<Template[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(template: Template): Promise<void>;
findById(id: string): Promise<Template | null>;
findByScope(scope: TemplateScope, contextId?: string): Promise<Template[]>;
listByCategory(category: TemplateCategory): Promise<Template[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notion/subdomains/template/domain/index.ts
````typescript
// template — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/notion/subdomains/view/adapters/inbound/index.ts
````typescript
// view — inbound adapters placeholder
// TODO: export server actions / route handlers
````

## File: src/modules/notion/subdomains/view/adapters/index.ts
````typescript
// view — adapters aggregate
````

## File: src/modules/notion/subdomains/view/adapters/outbound/index.ts
````typescript
// view — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
````

## File: src/modules/notion/subdomains/view/application/index.ts
````typescript
// view — application layer placeholder
// TODO: export use-cases, DTOs, ports
````

## File: src/modules/notion/subdomains/view/application/use-cases/ViewUseCases.ts
````typescript
// TODO: implement view CRUD use-cases
````

## File: src/modules/notion/subdomains/view/domain/entities/View.ts
````typescript
/**
 * View — distilled from modules/notion/subdomains/knowledge (relations/filters)
 * Represents a filtered/sorted view of a database.
 */
export type ViewType = "table" | "board" | "gallery" | "list" | "calendar" | "timeline";
⋮----
export interface FilterCondition {
  readonly propertyId: string;
  readonly operator: "equals" | "not_equals" | "contains" | "not_contains" | "is_empty" | "is_not_empty" | "greater_than" | "less_than";
  readonly value?: unknown;
}
⋮----
export interface SortCondition {
  readonly propertyId: string;
  readonly direction: "asc" | "desc";
}
⋮----
export interface ViewSnapshot {
  readonly id: string;
  readonly databaseId: string;
  readonly name: string;
  readonly type: ViewType;
  readonly filters: FilterCondition[];
  readonly sorts: SortCondition[];
  readonly visiblePropertyIds: string[];
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface ViewRepository {
  save(snapshot: ViewSnapshot): Promise<void>;
  findById(id: string): Promise<ViewSnapshot | null>;
  findByDatabaseId(databaseId: string): Promise<ViewSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: ViewSnapshot): Promise<void>;
findById(id: string): Promise<ViewSnapshot | null>;
findByDatabaseId(databaseId: string): Promise<ViewSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notion/subdomains/view/domain/index.ts
````typescript
// view — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
````

## File: src/modules/platform/adapters/inbound/react/AccountScopeProvider.tsx
````typescript
/**
 * AccountScopeProvider — platform inbound adapter (React).
 *
 * Manages platform-owned account lifecycle: auth → accounts → activeAccount.
 * Ported from: app/(shell)/_providers/AppProvider.tsx
 *
 * Consumers use useAccountScope() to read account state.
 */
⋮----
import { useReducer, useEffect, type ReactNode } from "react";
⋮----
import {
  AppContext,
  APP_INITIAL_STATE,
  type AppState,
  type AppAction,
} from "./AppContext";
import {
  resolveActiveAccount,
  subscribeToAccountsForUser,
} from "./AppContext";
import { useAuth } from "../../../../iam/adapters/inbound/react/AuthContext";
⋮----
function appReducer(state: AppState, action: AppAction): AppState
⋮----
export function AccountScopeProvider(
⋮----
// eslint-disable-next-line react-hooks/exhaustive-deps
````

## File: src/modules/platform/adapters/inbound/react/AppContext.tsx
````typescript
/**
 * AppContext — platform inbound adapter (React).
 *
 * Defines app-level account state, context, and subscription helpers.
 * Firebase-backed implementations are consumed via the iam module's
 * outbound composition to preserve boundary direction.
 */
⋮----
import { createContext, useContext, type Dispatch } from "react";
import {
  subscribeToAccountsForUser as iamSubscribeToAccountsForUser,
} from "../../../../iam/adapters/outbound/firebase-composition";
import type { AccountSnapshot } from "../../../../iam/subdomains/account/domain/entities/Account";
import type { AccountProfile } from "../../../../iam/subdomains/account/domain/entities/AccountProfile";
⋮----
import type { AuthUser } from "../../../../iam/adapters/inbound/react/AuthContext";
⋮----
// ── Account types ─────────────────────────────────────────────────────────────
⋮----
export type AccountType = "user" | "organization";
⋮----
export interface AccountEntity {
  readonly id: string;
  readonly name: string;
  readonly accountType: AccountType;
  readonly email?: string;
  readonly photoURL?: string;
}
⋮----
export type ActiveAccount = AccountEntity | AuthUser;
⋮----
export type BootstrapPhase = "idle" | "seeded" | "hydrated";
⋮----
// ── AccountProfile (read-model) ───────────────────────────────────────────────
⋮----
// ── App state & actions ───────────────────────────────────────────────────────
⋮----
export interface AppState {
  readonly accounts: Record<string, AccountEntity>;
  readonly accountsHydrated: boolean;
  readonly activeAccount: ActiveAccount | null;
  readonly bootstrapPhase: BootstrapPhase;
}
⋮----
export type AppAction =
  | { type: "SEED_ACTIVE_ACCOUNT"; payload: { user: AuthUser } }
  | {
      type: "SET_ACCOUNTS";
      payload: {
        accounts: Record<string, AccountEntity>;
        user: AuthUser;
        preferredActiveAccountId: string | null;
      };
    }
  | { type: "SET_ACTIVE_ACCOUNT"; payload: ActiveAccount | null }
  | { type: "RESET_STATE" };
⋮----
export interface AppContextValue {
  readonly state: AppState;
  readonly dispatch: Dispatch<AppAction>;
}
⋮----
export function useApp(): AppContextValue
⋮----
// ── Account helpers ───────────────────────────────────────────────────────────
⋮----
export function isOrganizationActor(
  account: ActiveAccount | null | undefined,
): boolean
⋮----
export function isActiveOrganizationAccount(
  account: ActiveAccount | null | undefined,
): boolean
⋮----
export function resolveOrganizationRouteFallback(
  _pathname: string,
  _account: ActiveAccount | null | undefined,
): string | null
⋮----
export function resolveActiveAccount(opts: {
  currentActiveAccount: ActiveAccount | null;
  accounts: Record<string, AccountEntity>;
  personalAccount: AuthUser;
  preferredActiveAccountId: string | null;
  bootstrapPhase: BootstrapPhase;
}): ActiveAccount
⋮----
// ── Subscriptions ─────────────────────────────────────────────────────────────
⋮----
/**
 * Subscribes to real-time organisation account updates for the given userId.
 * Maps iam AccountSnapshot → platform AccountEntity (view model).
 */
export function subscribeToAccountsForUser(
  userId: string,
  onUpdate: (accounts: Record<string, AccountEntity>) => void,
): () => void
⋮----
/**
 * Stub — profile subscriptions are available via the iam AccountQueryRepository
 * when a profile panel requires them. Wire from firebase-composition if needed.
 */
export function subscribeToProfile(
  _actorId: string,
  _onUpdate: (profile: AccountProfile | null) => void,
): () => void
````

## File: src/modules/platform/adapters/inbound/react/index.ts
````typescript
/**
 * platform inbound React adapter — barrel.
 *
 * Public surface for all platform React inbound adapters.
 * Consumed by src/app/ route shims.
 */
````

## File: src/modules/platform/adapters/inbound/react/PlatformBootstrap.tsx
````typescript
/**
 * PlatformBootstrap — platform inbound adapter (React).
 *
 * Self-contained provider tree for the src/ migration layer.
 * Assembles: IamSessionProvider → AccountScopeProvider → WorkspaceScopeProvider + Toaster.
 *
 * src/app/layout.tsx mounts this as the single composition root.
 * After this point, the rest of the tree can use:
 *   - useIamSession()     (iam)
 *   - useAccountScope()   (platform)
 *   - useWorkspaceScope() (workspace)
 */
⋮----
import type { ReactNode } from "react";
import { Toaster } from "@/packages/ui-shadcn/ui/sonner";
⋮----
import { IamSessionProvider } from "@/src/modules/iam/adapters/inbound/react";
import { AccountScopeProvider } from "./AccountScopeProvider";
import { WorkspaceScopeProvider } from "@/src/modules/workspace/adapters/inbound/react";
⋮----
export function PlatformBootstrap(
````

## File: src/modules/platform/adapters/inbound/react/shell/AccountSwitcher.tsx
````typescript
/**
 * AccountSwitcher — platform inbound adapter (React).
 *
 * Renders an account switcher control that lets the user toggle between their
 * personal (Firebase Auth) account and any organisation accounts they belong to.
 *
 * Design:
 *  - Current active account is shown as the trigger label.
 *  - Dropdown lists personal account first, then organisation accounts.
 *  - Active item is visually highlighted (check mark).
 *  - "Create organisation" entry at the bottom opens CreateOrganizationDialog.
 *
 * Props follow the same interface established in the stubs so callers
 * (ShellRootLayout, ShellAppRail) need no changes.
 */
⋮----
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@packages";
import { useState } from "react";
import { Building2, Check, ChevronsUpDown, Plus, UserRound } from "lucide-react";
⋮----
import type { AuthUser } from "../../../../../iam/adapters/inbound/react/AuthContext";
import type { AccountEntity } from "../AppContext";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";
⋮----
// ── Types ─────────────────────────────────────────────────────────────────────
⋮----
interface AccountSwitcherProps {
  personalAccount: AuthUser | null;
  organizationAccounts: AccountEntity[];
  activeAccountId: string | null;
  onSelectPersonal: () => void;
  onSelectOrganization: (account: AccountEntity) => void;
  onOrganizationCreated?: (account: AccountEntity) => void;
}
⋮----
// ── Helpers ───────────────────────────────────────────────────────────────────
⋮----
function getActiveLabel(
  activeAccountId: string | null,
  personalAccount: AuthUser | null,
  organizationAccounts: AccountEntity[],
): string
⋮----
// ── Component ─────────────────────────────────────────────────────────────────
⋮----
{/* Personal account */}
⋮----
{/* Organisation accounts */}
⋮----
onClick=
⋮----
onOrganizationCreated=
````

## File: src/modules/platform/adapters/inbound/react/shell/index.ts
````typescript
/**
 * Shell UI components barrel — platform inbound React adapter.
 *
 * Shell chrome: app-rail, sidebar, header, and contextual nav.
 * Consumed internally by ShellFrame (parent directory).
 */
````

## File: src/modules/platform/adapters/inbound/react/shell/shell-quick-create.ts
````typescript
/**
 * shell-quick-create — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it imports notion's createKnowledgePage.
 * Kept as a composition adapter at the app boundary.
 */
⋮----
import { createKnowledgePage } from "../../../../../notion/adapters/outbound/notion-page-stub";
⋮----
export interface QuickCreatePageInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
}
⋮----
export interface QuickCreatePageResult {
  readonly success: boolean;
  readonly error?: { message: string };
}
⋮----
export async function quickCreateKnowledgePage(
  input: QuickCreatePageInput,
): Promise<QuickCreatePageResult>
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellContextNavSection.tsx
````typescript
/**
 * ShellContextNavSection — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it imports from workspace module.
 */
⋮----
import Link from "next/link";
import {
  AlertCircle,
  BadgeCheck,
  ClipboardCheck,
  Inbox,
  ListTodo,
  Receipt,
} from "lucide-react";
import type { ReactNode } from "react";
import { appendWorkspaceContextQuery } from "../../../../../workspace/adapters/inbound/react/workspace-ui-stubs";
import { buildShellContextualHref } from "../../../../index";
import { sidebarItemClass, sidebarSectionTitleClass } from "./ShellSidebarNavData";
⋮----
interface ContextScopedNavItem {
  href: string;
  label: string;
}
⋮----
interface ShellContextNavSectionProps {
  title: string;
  items: readonly ContextScopedNavItem[];
  isActiveRoute: (href: string) => boolean;
  activeAccountId: string | null;
  activeWorkspaceId: string | null;
}
⋮----
/** Resolve a lucide icon for context-section items by parsing ?tab= from the href. */
function getContextItemIcon(href: string): ReactNode | null
⋮----
className=
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellDashboardSidebar.tsx
````typescript
/**
 * ShellDashboardSidebar — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it composes workspace module components.
 */
⋮----
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
⋮----
import {
  buildWorkspaceQuickAccessItems,
  CustomizeNavigationDialog,
  getWorkspaceIdFromPath,
  MAX_VISIBLE_RECENT_WORKSPACES,
  readNavPreferences,
  supportsWorkspaceSearchContext,
  type NavPreferences,
  useRecentWorkspaces,
  useSidebarLocale,
  WorkspaceQuickAccessRow,
} from "../../../../../workspace/adapters/inbound/react/workspace-ui-stubs";
⋮----
import {
  type DashboardSidebarProps,
  ORGANIZATION_MANAGEMENT_ITEMS,
  ACCOUNT_NAV_ITEMS,
  SECTION_TITLES,
  resolveNavSection,
  isActiveRoute,
  isActiveOrganizationAccount,
} from "./ShellSidebarNavData";
import { ShellSidebarHeader } from "./ShellSidebarHeader";
import { DashboardSidebarBody } from "./ShellSidebarBody";
⋮----
export function ShellDashboardSidebar({
  pathname,
  activeAccount,
  workspaces,
  activeWorkspaceId,
  collapsed,
  onToggleCollapsed,
  onSelectWorkspace,
}: DashboardSidebarProps)
⋮----
isActiveRoute={(href) => isActiveRoute(pathname, href)}
          activeAccountId={activeAccount?.id ?? null}
          showAccountManagement={showAccountManagement}
          visibleAccountItems={visibleAccountItems}
          visibleOrganizationManagementItems={visibleOrganizationManagementItems}
          workspacePathId={workspacePathId}
          navPrefs={navPrefs}
          localeBundle={localeBundle}
          showRecentWorkspaces={showRecentWorkspaces}
          visibleRecentWorkspaceLinks={visibleRecentWorkspaceLinks}
          hasOverflow={hasOverflow}
          isExpanded={isExpanded}
          activeWorkspaceId={activeWorkspaceId}
          onSelectWorkspace={onSelectWorkspace}
onToggleExpanded=
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellGuard.tsx
````typescript
/**
 * ShellGuard — platform inbound adapter (React).
 *
 * Auth guard for the authenticated shell layout.
 * Renders nothing (redirects) while auth is initialising or when the user is
 * unauthenticated; renders children only for authenticated sessions.
 *
 * Redirect behaviour:
 *  - initializing → show full-screen spinner (do not redirect — avoids flash
 *    for returning users whose Firebase token is resolving)
 *  - unauthenticated | anonymous without explicit access → redirect to "/"
 *  - authenticated → render children
 *
 * Anonymous sessions (Continue as Guest) are currently treated as
 * authenticated at the shell level; individual routes may restrict further.
 */
⋮----
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
⋮----
import { useAuth } from "../../../../../iam/adapters/inbound/react/AuthContext";
⋮----
interface ShellGuardProps {
  children: ReactNode;
}
⋮----
export function ShellGuard(
⋮----
// Redirect is in-flight — render spinner to prevent content flash.
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellLanguageSwitcher.tsx
````typescript
/**
 * ShellLanguageSwitcher — platform inbound adapter (React).
 *
 * Lets users explicitly override the display language.
 *
 * Firebase Hosting i18n rewrites honour the `firebase-language-override`
 * cookie to select the content locale. Setting this cookie and reloading
 * the page asks Firebase Hosting to serve the matching localized files
 * (configured under hosting.i18n in firebase.json).
 *
 * Supported locales are defined in SUPPORTED_LOCALES below.
 * Add entries here when new locale directories are added to /localized-files.
 *
 * Rendered by ShellHeaderControls in the top-right header area.
 */
⋮----
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@packages";
import { Languages } from "lucide-react";
import { useState } from "react";
⋮----
// ── Locale catalogue ──────────────────────────────────────────────────────────
⋮----
type LocaleCode = (typeof SUPPORTED_LOCALES)[number]["code"];
⋮----
// ── Helpers ───────────────────────────────────────────────────────────────────
⋮----
function getStoredLocale(): LocaleCode | null
⋮----
// Check cookie first (Firebase Hosting override), then localStorage fallback.
⋮----
function applyLocale(code: LocaleCode): void
⋮----
// Set the Firebase Hosting language override cookie (1 year, root path).
⋮----
// Also persist in localStorage as a UI fallback.
⋮----
// Reload so Firebase Hosting can serve the correct locale variant.
⋮----
// ── Component ─────────────────────────────────────────────────────────────────
⋮----
// Lazy initializer: reads from storage on first client render only.
// typeof window guard ensures SSR safety.
⋮----
function handleSelect(code: LocaleCode): void
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellRootLayout.tsx
````typescript
/**
 * ShellRootLayout — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it composes downstream modules.
 *
 * Uses useApp() from platform (accounts/auth) and useWorkspaceContext()
 * from workspace (workspaces/activeWorkspaceId).
 */
⋮----
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PanelLeftOpen, Search } from "lucide-react";
⋮----
import { useAuth } from "../../../../../iam/adapters/inbound/react/AuthContext";
import {
  type AccountProfile,
  isOrganizationActor,
  resolveOrganizationRouteFallback,
  subscribeToProfile,
  type AccountEntity,
  useApp,
} from "../AppContext";
import {
  ShellGuard,
  AccountSwitcher,
  ShellAppBreadcrumbs,
  ShellGlobalSearchDialog,
  useShellGlobalSearch,
  ShellHeaderControls,
  ShellUserAvatar,
} from "../platform-ui-stubs";
import {
  resolveShellPageTitle,
  isExactOrChildPath,
  buildShellContextualHref,
  SHELL_MOBILE_NAV_ITEMS,
  SHELL_ORG_PRIMARY_NAV_ITEMS,
  SHELL_ORG_SECONDARY_NAV_ITEMS,
} from "../../../../index";
import type { WorkspaceEntity } from "../../../../../workspace/adapters/inbound/react/WorkspaceContext";
import { useWorkspaceContext } from "../../../../../workspace/adapters/inbound/react/WorkspaceContext";
⋮----
import { AppRail } from "./ShellAppRail";
import { ShellDashboardSidebar } from "./ShellDashboardSidebar";
⋮----
function toggleSidebar()
⋮----
function handleSelectOrganization(account: AccountEntity)
⋮----
function handleSelectPersonal()
⋮----
function handleOrganizationCreated(account: AccountEntity)
⋮----
function handleSelectWorkspace(workspaceId: string | null)
⋮----
async function handleLogout()
⋮----
void handleLogout();
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellSidebarBody.tsx
````typescript
/**
 * ShellSidebarBody — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it imports from workspace and notion modules.
 */
⋮----
import Link from "next/link";
⋮----
import {
  WorkspaceSectionContent,
  type NavPreferences,
  type SidebarLocaleBundle,
} from "../../../../../workspace/adapters/inbound/react/workspace-ui-stubs";
import { SHELL_CONTEXT_SECTION_CONFIG, buildShellContextualHref } from "../../../../index";
⋮----
import {
  type NavSection,
  sidebarItemClass,
  sidebarSectionTitleClass,
} from "./ShellSidebarNavData";
import { ShellContextNavSection } from "./ShellContextNavSection";
⋮----
interface NavItem {
  id: string;
  label: string;
  href: string;
}
⋮----
interface WorkspaceLink {
  id: string;
  name: string;
  href: string;
}
⋮----
interface ShellSidebarBodyProps {
  section: NavSection;
  isActiveRoute: (href: string) => boolean;
  activeAccountId: string | null;
  showAccountManagement: boolean;
  visibleAccountItems: readonly NavItem[];
  visibleOrganizationManagementItems: readonly NavItem[];
  workspacePathId: string | null;
  navPrefs: NavPreferences;
  localeBundle: SidebarLocaleBundle | null;
  showRecentWorkspaces: boolean;
  visibleRecentWorkspaceLinks: WorkspaceLink[];
  hasOverflow: boolean;
  isExpanded: boolean;
  activeWorkspaceId: string | null;
  onSelectWorkspace: (workspaceId: string | null) => void;
  onToggleExpanded: () => void;
  currentSearchWorkspaceId: string;
}
⋮----
className=
⋮----
// Show the context section only when a workspace is actually in scope.
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellSidebarHeader.tsx
````typescript
/**
 * ShellSidebarHeader — app/(shell)/_shell composition layer.
 * Moved from modules/platform alongside sibling shell files.
 * Pure UI component with no downstream imports.
 */
⋮----
import { PanelLeftClose, SlidersHorizontal } from "lucide-react";
⋮----
interface ShellSidebarHeaderProps {
  sectionLabel: string;
  sectionIcon: React.ReactNode;
  onOpenCustomize: () => void;
  onToggleCollapsed: () => void;
}
⋮----
export function ShellSidebarHeader({
  sectionLabel,
  sectionIcon,
  onOpenCustomize,
  onToggleCollapsed,
}: ShellSidebarHeaderProps)
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellSidebarNavData.tsx
````typescript
import {
  Building2,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  NotebookText,
  Settings2,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
⋮----
import {
  type ActiveAccount,
  isOrganizationActor,
  isActiveOrganizationAccount,
} from "../AppContext";
import {
  SHELL_ACCOUNT_SECTION_MATCHERS,
  SHELL_ACCOUNT_NAV_ITEMS,
  SHELL_ORGANIZATION_MANAGEMENT_ITEMS,
  SHELL_SECTION_LABELS,
  isExactOrChildPath,
  resolveShellNavSection,
  type ShellNavSection,
} from "../../../../index";
import type { WorkspaceEntity } from "../../../../../workspace/adapters/inbound/react/WorkspaceContext";
⋮----
// ── Types ─────────────────────────────────────────────────────────────────────
⋮----
export interface DashboardSidebarProps {
  readonly pathname: string;
  readonly userId: string | null;
  readonly activeAccount: ActiveAccount | null;
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly activeWorkspaceId: string | null;
  readonly collapsed: boolean;
  readonly onToggleCollapsed: () => void;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
}
⋮----
export type NavSection = ShellNavSection;
⋮----
// ── Static nav constants ──────────────────────────────────────────────────────
⋮----
// ── CSS class helpers ─────────────────────────────────────────────────────────
⋮----
export function sidebarItemClass(active: boolean)
⋮----
// ── Pure section helpers ──────────────────────────────────────────────────────
⋮----
export function resolveNavSection(pathname: string): NavSection
⋮----
export function isActiveRoute(pathname: string, href: string)
⋮----
// ── Simple section nav component ──────────────────────────────────────────────
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellThemeToggle.tsx
````typescript
/**
 * ShellThemeToggle — platform inbound adapter (React).
 *
 * Toggles between light, dark, and system themes in the shell header.
 * Relies on ThemeProvider (next-themes) being mounted at the layout root.
 *
 * Rendered by ShellHeaderControls in the top-right header area.
 */
⋮----
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
⋮----
export function ShellThemeToggle(): React.ReactElement
⋮----
function toggle()
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellUserAvatar.tsx
````typescript
/**
 * ShellUserAvatar — platform inbound adapter (React).
 *
 * Displays the authenticated user's avatar or initials in the shell header.
 * Opens a dropdown menu with the user's name, email, and a sign-out action.
 *
 * Design:
 *  - Avatar shows initials (up to 2 characters) derived from the display name.
 *  - Dropdown follows shadcn/ui DropdownMenu conventions.
 *  - Sign-out delegates to the onSignOut prop (ShellRootLayout handles the
 *    async logout and error state; this component stays presentation-only).
 */
⋮----
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@packages";
import { LogOut, UserRound } from "lucide-react";
⋮----
// ── Helpers ───────────────────────────────────────────────────────────────────
⋮----
function getInitials(name: string): string
⋮----
// ── Component ─────────────────────────────────────────────────────────────────
⋮----
interface ShellUserAvatarProps {
  name: string;
  email: string;
  onSignOut: () => void;
}
⋮----
export function ShellUserAvatar({
  name,
  email,
  onSignOut,
}: ShellUserAvatarProps): React.ReactElement
````

## File: src/modules/platform/adapters/inbound/react/ShellFrame.tsx
````typescript
/**
 * ShellFrame — platform inbound adapter (React).
 *
 * Shell chrome wrapper: app-rail, sidebar, top header, and main content slot.
 * Lives in src/modules/platform/adapters/inbound/react/ alongside sibling shell files.
 */
````

## File: src/modules/platform/adapters/inbound/react/useAccountRouteContext.ts
````typescript
/**
 * useAccountRouteContext — platform inbound adapter (React).
 *
 * Derives route-level account context by combining:
 *  - URL params (`accountId` segment from Next.js routing)
 *  - Auth state (current authenticated user)
 *  - App state (loaded organisation accounts + activeAccount)
 *
 * Consumed by AccountRouteDispatcher (workspace) and any route component that
 * needs to know whether the active route is a personal or organisation scope.
 *
 * Design invariants:
 *  - routeAccountId  : raw value from the URL, never derived
 *  - resolvedAccountId: equals routeAccountId; exists for explicit intent
 *  - accountType     : null while accounts are still loading (hydration guard)
 *  - No mutations — read-only derived state
 */
⋮----
import { useParams } from "next/navigation";
import { useApp, type ActiveAccount } from "./AppContext";
import { useAuth } from "../../../../iam/adapters/inbound/react/AuthContext";
⋮----
// ── Public contract ───────────────────────────────────────────────────────────
⋮----
export interface AccountRouteContextValue {
  /** Raw accountId segment from the URL (e.g. `/[accountId]/...`). */
  readonly routeAccountId: string;
  /**
   * Resolved account ID — currently mirrors routeAccountId.
   * Reserved for future alias / slug resolution without breaking callers.
   */
  readonly resolvedAccountId: string;
  /** UID of the currently authenticated user; null when unauthenticated. */
  readonly currentUserId: string | null;
  /**
   * Whether the route account is an organisation or personal account.
   * null while the account list has not yet been hydrated from Firestore.
   */
  readonly accountType: "organization" | "user" | null;
  /** True once the organisation account list has been loaded from Firestore. */
  readonly accountsHydrated: boolean;
  /** Currently active account (personal AuthUser or AccountEntity). */
  readonly activeAccount: ActiveAccount | null;
}
⋮----
/** Raw accountId segment from the URL (e.g. `/[accountId]/...`). */
⋮----
/**
   * Resolved account ID — currently mirrors routeAccountId.
   * Reserved for future alias / slug resolution without breaking callers.
   */
⋮----
/** UID of the currently authenticated user; null when unauthenticated. */
⋮----
/**
   * Whether the route account is an organisation or personal account.
   * null while the account list has not yet been hydrated from Firestore.
   */
⋮----
/** True once the organisation account list has been loaded from Firestore. */
⋮----
/** Currently active account (personal AuthUser or AccountEntity). */
⋮----
// ── Hook ──────────────────────────────────────────────────────────────────────
⋮----
export function useAccountRouteContext(): AccountRouteContextValue
⋮----
// Determine account type from available state.
// We only commit to a type once data is available to avoid transient
// misrouting while accounts are still loading.
⋮----
// The URL account is a known organisation — use the stored accountType
// (could be "user" personal account stored in Firestore or "organization").
⋮----
// The URL account is the authenticated user's personal (Firebase Auth) account.
⋮----
// else: either accounts not yet hydrated or an unknown ID — stay null
````

## File: src/modules/platform/adapters/inbound/react/useAccountScope.ts
````typescript
/**
 * useAccountScope — platform inbound adapter (React).
 *
 * Canonical hook for reading the active account scope in the src/ layer.
 * Aliases useApp() from the platform module.
 *
 * Returns: { state: AppState, dispatch: Dispatch<AppAction> }
 */
````

## File: src/modules/platform/orchestration/index.ts
````typescript
import {
  InMemoryBackgroundJobRepository,
} from "../subdomains/background-job/adapters/outbound";
import {
  RegisterJobDocumentUseCase,
  AdvanceJobStageUseCase,
  ListWorkspaceJobsUseCase,
  type RegisterJobDocumentInput,
  type AdvanceJobStageInput,
  type ListWorkspaceJobsInput,
  type JobResult,
} from "../subdomains/background-job/application";
import type { BackgroundJob } from "../subdomains/background-job/domain";
⋮----
export class PlatformFacade {
⋮----
registerBackgroundJob(input: RegisterJobDocumentInput): Promise<JobResult<BackgroundJob>>
⋮----
advanceBackgroundJob(input: AdvanceJobStageInput): Promise<JobResult<BackgroundJob>>
⋮----
listWorkspaceBackgroundJobs(input: ListWorkspaceJobsInput): Promise<readonly BackgroundJob[]>
````

## File: src/modules/platform/shared/errors/index.ts
````typescript
export class PlatformConfigurationError extends Error {
⋮----
constructor(message: string)
⋮----
export class PlatformAuthorizationError extends Error {
⋮----
constructor(message = "Platform access denied.")
⋮----
export class PlatformResourceNotFoundError extends Error {
````

## File: src/modules/platform/shared/events/index.ts
````typescript
export interface PlatformDomainEvent<TType extends string, TPayload extends object> {
  readonly type: TType;
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: TPayload;
}
⋮----
export type PlatformPublishedEvent =
  | PlatformDomainEvent<"platform.background-job.job_registered", {
      readonly jobId: string;
      readonly documentId: string;
      readonly organizationId: string;
      readonly workspaceId: string;
      readonly title: string;
      readonly mimeType: string;
    }>
  | PlatformDomainEvent<"platform.background-job.job_advanced", {
      readonly jobId: string;
      readonly documentId: string;
      readonly previousStatus: string;
      readonly nextStatus: string;
    }>
  | PlatformDomainEvent<"platform.notification.dispatched", {
      readonly notificationId: string;
      readonly recipientId: string;
      readonly notificationType: string;
    }>;
````

## File: src/modules/platform/shared/index.ts
````typescript

````

## File: src/modules/platform/shared/types/index.ts
````typescript
export interface PlatformScopeProps {
  readonly accountId: string;
  readonly organizationId?: string;
  readonly workspaceId?: string;
}
````

## File: src/modules/platform/subdomains/background-job/adapters/inbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/background-job/adapters/index.ts
````typescript
// background-job — adapters aggregate
````

## File: src/modules/platform/subdomains/background-job/adapters/outbound/firestore-like/InMemoryBackgroundJobRepository.ts
````typescript
import type { BackgroundJob, BackgroundJobStatus } from "../../../domain/entities/BackgroundJob";
import type { BackgroundJobRepository } from "../../../domain/repositories/BackgroundJobRepository";
⋮----
export class InMemoryBackgroundJobRepository implements BackgroundJobRepository {
⋮----
async findByDocumentId(documentId: string): Promise<BackgroundJob | null>
⋮----
async listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
}): Promise<readonly BackgroundJob[]>
⋮----
async save(job: BackgroundJob): Promise<void>
⋮----
async updateStatus(input: {
    readonly documentId: string;
    readonly status: BackgroundJobStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
}): Promise<BackgroundJob | null>
````

## File: src/modules/platform/subdomains/background-job/adapters/outbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/background-job/application/index.ts
````typescript

````

## File: src/modules/platform/subdomains/background-job/application/use-cases/background-job.use-cases.ts
````typescript
import { v4 as randomUUID } from "uuid";
import type { DomainError } from "../../../../../shared";
import type { JobDocument } from "../../domain/entities/JobDocument";
import {
  canTransitionJobStatus,
  type BackgroundJob,
  type BackgroundJobStatus,
} from "../../domain/entities/BackgroundJob";
import type { BackgroundJobRepository } from "../../domain/repositories/BackgroundJobRepository";
⋮----
export type JobResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: DomainError };
⋮----
function ok<T>(data: T): JobResult<T>
⋮----
function fail(code: string, message: string): JobResult<never>
⋮----
export interface RegisterJobDocumentInput {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly title: string;
  readonly mimeType: string;
}
⋮----
export class RegisterJobDocumentUseCase {
⋮----
constructor(private readonly repo: BackgroundJobRepository)
⋮----
async execute(input: RegisterJobDocumentInput): Promise<JobResult<BackgroundJob>>
⋮----
export interface AdvanceJobStageInput {
  readonly documentId: string;
  readonly nextStatus: BackgroundJobStatus;
  readonly statusMessage?: string;
}
⋮----
export class AdvanceJobStageUseCase {
⋮----
async execute(input: AdvanceJobStageInput): Promise<JobResult<BackgroundJob>>
⋮----
export interface ListWorkspaceJobsInput {
  readonly organizationId: string;
  readonly workspaceId: string;
}
⋮----
export class ListWorkspaceJobsUseCase {
⋮----
async execute(input: ListWorkspaceJobsInput): Promise<readonly BackgroundJob[]>
````

## File: src/modules/platform/subdomains/background-job/domain/entities/BackgroundJob.ts
````typescript
import type { JobDocument } from "./JobDocument";
⋮----
export type BackgroundJobStatus =
  | "uploaded"
  | "parsing"
  | "chunking"
  | "embedding"
  | "indexed"
  | "stale"
  | "re-indexing"
  | "failed";
⋮----
export function canTransitionJobStatus(from: BackgroundJobStatus, to: BackgroundJobStatus): boolean
⋮----
export interface BackgroundJob {
  readonly id: string;
  readonly document: JobDocument;
  readonly status: BackgroundJobStatus;
  readonly statusMessage?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
````

## File: src/modules/platform/subdomains/background-job/domain/entities/JobChunk.ts
````typescript
export interface JobChunkMetadata {
  readonly sourceDocId: string;
  readonly section?: string;
  readonly pageNumber?: number;
}
⋮----
export interface JobChunk {
  readonly id: string;
  readonly documentId: string;
  readonly chunkIndex: number;
  readonly content: string;
  readonly metadata: JobChunkMetadata;
}
````

## File: src/modules/platform/subdomains/background-job/domain/entities/JobDocument.ts
````typescript
export interface JobDocument {
  readonly id: string;
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly title: string;
  readonly mimeType: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
````

## File: src/modules/platform/subdomains/background-job/domain/events/BackgroundJobDomainEvent.ts
````typescript
import type { BackgroundJobStatus } from "../entities/BackgroundJob";
⋮----
export interface BackgroundJobDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface BackgroundJobRegisteredEvent extends BackgroundJobDomainEvent {
  readonly type: "platform.background-job.job_registered";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly title: string;
    readonly mimeType: string;
  };
}
⋮----
export interface BackgroundJobAdvancedEvent extends BackgroundJobDomainEvent {
  readonly type: "platform.background-job.job_advanced";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly previousStatus: BackgroundJobStatus;
    readonly nextStatus: BackgroundJobStatus;
  };
}
⋮----
export interface BackgroundJobFailedEvent extends BackgroundJobDomainEvent {
  readonly type: "platform.background-job.job_failed";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly reason: string;
  };
}
⋮----
export type BackgroundJobDomainEventType =
  | BackgroundJobRegisteredEvent
  | BackgroundJobAdvancedEvent
  | BackgroundJobFailedEvent;
````

## File: src/modules/platform/subdomains/background-job/domain/index.ts
````typescript

````

## File: src/modules/platform/subdomains/background-job/domain/repositories/BackgroundJobRepository.ts
````typescript
import type { BackgroundJob, BackgroundJobStatus } from "../entities/BackgroundJob";
⋮----
export interface BackgroundJobRepository {
  findByDocumentId(documentId: string): Promise<BackgroundJob | null>;
  listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly BackgroundJob[]>;
  save(job: BackgroundJob): Promise<void>;
  updateStatus(input: {
    readonly documentId: string;
    readonly status: BackgroundJobStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<BackgroundJob | null>;
}
⋮----
findByDocumentId(documentId: string): Promise<BackgroundJob | null>;
listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly BackgroundJob[]>;
save(job: BackgroundJob): Promise<void>;
updateStatus(input: {
    readonly documentId: string;
    readonly status: BackgroundJobStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<BackgroundJob | null>;
````

## File: src/modules/platform/subdomains/cache/adapters/inbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/cache/adapters/index.ts
````typescript
// cache — adapters aggregate
````

## File: src/modules/platform/subdomains/cache/adapters/outbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/cache/adapters/outbound/memory/InMemoryCacheRepository.ts
````typescript
import type { CacheEntry } from "../../../domain/entities/CacheEntry";
import type { CacheRepository } from "../../../domain/repositories/CacheRepository";
⋮----
export class InMemoryCacheRepository implements CacheRepository {
⋮----
async get(key: string): Promise<CacheEntry | null>
⋮----
async set(entry: CacheEntry): Promise<void>
⋮----
async delete(key: string): Promise<void>
````

## File: src/modules/platform/subdomains/cache/application/index.ts
````typescript

````

## File: src/modules/platform/subdomains/cache/application/use-cases/CacheUseCases.ts
````typescript
import type { CacheEntry } from "../../domain/entities/CacheEntry";
import type { CacheRepository } from "../../domain/repositories/CacheRepository";
⋮----
export interface WriteCacheEntryInput {
  readonly key: string;
  readonly value: unknown;
  readonly ttlSeconds?: number;
}
⋮----
export interface ReadCacheEntryInput {
  readonly key: string;
}
⋮----
export interface RemoveCacheEntryInput {
  readonly key: string;
}
⋮----
export class WriteCacheEntryUseCase {
⋮----
constructor(private readonly repository: CacheRepository)
⋮----
async execute(input: WriteCacheEntryInput): Promise<void>
⋮----
export class ReadCacheEntryUseCase {
⋮----
async execute(input: ReadCacheEntryInput): Promise<CacheEntry | null>
⋮----
export class RemoveCacheEntryUseCase {
⋮----
async execute(input: RemoveCacheEntryInput): Promise<void>
````

## File: src/modules/platform/subdomains/cache/domain/entities/CacheEntry.ts
````typescript
export interface CacheEntry {
  readonly key: string;
  readonly value: unknown;
  readonly expiresAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
````

## File: src/modules/platform/subdomains/cache/domain/index.ts
````typescript

````

## File: src/modules/platform/subdomains/cache/domain/repositories/CacheRepository.ts
````typescript
import type { CacheEntry } from "../entities/CacheEntry";
⋮----
export interface CacheRepository {
  get(key: string): Promise<CacheEntry | null>;
  set(entry: CacheEntry): Promise<void>;
  delete(key: string): Promise<void>;
}
⋮----
get(key: string): Promise<CacheEntry | null>;
set(entry: CacheEntry): Promise<void>;
delete(key: string): Promise<void>;
````

## File: src/modules/platform/subdomains/file-storage/adapters/inbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/file-storage/adapters/index.ts
````typescript
// file-storage — adapters aggregate
````

## File: src/modules/platform/subdomains/file-storage/adapters/outbound/firestore/FirestoreFileStorageRepository.ts
````typescript
/**
 * FirestoreFileStorageRepository — Firestore-backed FileStorageRepository.
 *
 * Collection: storedFiles/{fileId}
 * Schema: mirrors StoredFile (flat document, no nesting).
 * Soft-delete: deletedAtISO is set on deletion; listByOwner excludes soft-deleted files.
 *
 * Composite index required:
 *   collection: storedFiles
 *   fields: ownerId ASC, deletedAtISO ASC
 *   mode: COLLECTION
 */
⋮----
import { getFirebaseFirestore, firestoreApi } from "@packages";
import type { StoredFile } from "../../../domain/entities/StoredFile";
import type { FileStorageRepository } from "../../../domain/repositories/FileStorageRepository";
⋮----
export class FirestoreFileStorageRepository implements FileStorageRepository {
⋮----
async save(file: StoredFile): Promise<void>
⋮----
async findById(fileId: string): Promise<StoredFile | null>
⋮----
async listByOwner(ownerId: string): Promise<StoredFile[]>
⋮----
async delete(fileId: string): Promise<void>
````

## File: src/modules/platform/subdomains/file-storage/adapters/outbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/file-storage/application/index.ts
````typescript

````

## File: src/modules/platform/subdomains/file-storage/application/use-cases/FileStorageUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import type { StoredFile } from "../../domain/entities/StoredFile";
import type { FileStorageRepository } from "../../domain/repositories/FileStorageRepository";
⋮----
export interface CreateStoredFileInput {
  readonly ownerId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly url: string;
}
⋮----
export interface GetStoredFileInput {
  readonly fileId: string;
}
⋮----
export interface ListStoredFilesInput {
  readonly ownerId: string;
}
⋮----
export interface DeleteStoredFileInput {
  readonly fileId: string;
}
⋮----
export class CreateStoredFileUseCase {
⋮----
constructor(private readonly repository: FileStorageRepository)
⋮----
async execute(input: CreateStoredFileInput): Promise<StoredFile>
⋮----
export class GetStoredFileUseCase {
⋮----
async execute(input: GetStoredFileInput): Promise<StoredFile | null>
⋮----
export class ListStoredFilesUseCase {
⋮----
async execute(input: ListStoredFilesInput): Promise<StoredFile[]>
⋮----
export class DeleteStoredFileUseCase {
⋮----
async execute(input: DeleteStoredFileInput): Promise<void>
````

## File: src/modules/platform/subdomains/file-storage/domain/entities/StoredFile.ts
````typescript
export interface StoredFile {
  readonly fileId: string;
  readonly ownerId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly url: string;
  readonly createdAtISO: string;
  readonly deletedAtISO: string | null;
}
````

## File: src/modules/platform/subdomains/file-storage/domain/index.ts
````typescript

````

## File: src/modules/platform/subdomains/file-storage/domain/repositories/FileStorageRepository.ts
````typescript
import type { StoredFile } from "../entities/StoredFile";
⋮----
export interface FileStorageRepository {
  save(file: StoredFile): Promise<void>;
  findById(fileId: string): Promise<StoredFile | null>;
  listByOwner(ownerId: string): Promise<StoredFile[]>;
  delete(fileId: string): Promise<void>;
}
⋮----
save(file: StoredFile): Promise<void>;
findById(fileId: string): Promise<StoredFile | null>;
listByOwner(ownerId: string): Promise<StoredFile[]>;
delete(fileId: string): Promise<void>;
````

## File: src/modules/platform/subdomains/notification/adapters/inbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/notification/adapters/index.ts
````typescript
// notification — adapters aggregate
````

## File: src/modules/platform/subdomains/notification/adapters/outbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/notification/adapters/outbound/memory/InMemoryNotificationRepository.ts
````typescript
import { v4 as uuid } from "uuid";
import type { DispatchNotificationInput, NotificationEntity } from "../../../domain/entities/Notification";
import type { NotificationRepository } from "../../../domain/repositories/NotificationRepository";
⋮----
export class InMemoryNotificationRepository implements NotificationRepository {
⋮----
async dispatch(input: DispatchNotificationInput): Promise<NotificationEntity>
⋮----
async markAsRead(notificationId: string, recipientId: string): Promise<void>
⋮----
async markAllAsRead(recipientId: string): Promise<void>
⋮----
async findByRecipient(recipientId: string, limit = 50): Promise<NotificationEntity[]>
⋮----
async getUnreadCount(recipientId: string): Promise<number>
````

## File: src/modules/platform/subdomains/notification/adapters/outbound/memory/InMemoryWorkspaceNotificationPreferenceRepository.ts
````typescript
import type { WorkspaceNotificationPreference } from "../../../domain/entities/WorkspaceNotificationPreference";
import type { WorkspaceNotificationPreferenceRepository } from "../../../domain/repositories/WorkspaceNotificationPreferenceRepository";
⋮----
export class InMemoryWorkspaceNotificationPreferenceRepository implements WorkspaceNotificationPreferenceRepository {
⋮----
async findByMember(workspaceId: string, memberId: string): Promise<WorkspaceNotificationPreference | undefined>
⋮----
async save(preference: WorkspaceNotificationPreference): Promise<void>
⋮----
async findSubscribersByEventType(workspaceId: string, eventType: string): Promise<string[]>
⋮----
private key(workspaceId: string, memberId: string): string
````

## File: src/modules/platform/subdomains/notification/application/dto/notification.dto.ts
````typescript

````

## File: src/modules/platform/subdomains/notification/application/index.ts
````typescript

````

## File: src/modules/platform/subdomains/notification/application/queries/notification.queries.ts
````typescript
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import type { NotificationEntity } from "../../domain/entities/Notification";
⋮----
export class GetNotificationsForRecipientUseCase {
⋮----
constructor(private readonly repo: NotificationRepository)
⋮----
async execute(recipientId: string, limit?: number): Promise<NotificationEntity[]>
⋮----
export class GetUnreadCountUseCase {
⋮----
async execute(recipientId: string): Promise<number>
````

## File: src/modules/platform/subdomains/notification/application/queries/workspace-notification-preferences.queries.ts
````typescript
import type { WorkspaceNotificationPreferenceRepository } from "../../domain/repositories/WorkspaceNotificationPreferenceRepository";
import type { WorkspaceNotificationEventType } from "../../domain/value-objects/WorkspaceNotificationEventType";
import { WORKSPACE_NOTIFICATION_EVENT_TYPES } from "../../domain/value-objects/WorkspaceNotificationEventType";
⋮----
export interface WorkspaceNotificationPreferenceDto {
  readonly workspaceId: string;
  readonly memberId: string;
  readonly subscribedEvents: WorkspaceNotificationEventType[];
  readonly updatedAtISO: string;
}
⋮----
export class GetWorkspaceNotificationPreferencesQuery {
⋮----
constructor(private readonly repo: WorkspaceNotificationPreferenceRepository)
⋮----
async execute(workspaceId: string, memberId: string): Promise<WorkspaceNotificationPreferenceDto>
````

## File: src/modules/platform/subdomains/notification/application/use-cases/notification.use-cases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import type { DispatchNotificationInput } from "../../domain/entities/Notification";
⋮----
export class DispatchNotificationUseCase {
⋮----
constructor(private readonly repo: NotificationRepository)
⋮----
async execute(input: DispatchNotificationInput): Promise<CommandResult>
⋮----
export class MarkNotificationReadUseCase {
⋮----
async execute(notificationId: string, recipientId: string): Promise<CommandResult>
⋮----
export class MarkAllNotificationsReadUseCase {
⋮----
async execute(recipientId: string): Promise<CommandResult>
````

## File: src/modules/platform/subdomains/notification/application/use-cases/workspace-notification-preferences.use-case.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { WorkspaceNotificationPreferenceRepository } from "../../domain/repositories/WorkspaceNotificationPreferenceRepository";
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import { WorkspaceNotificationPreference } from "../../domain/entities/WorkspaceNotificationPreference";
import type { WorkspaceNotificationEventType } from "../../domain/value-objects/WorkspaceNotificationEventType";
⋮----
export interface UpdateNotificationPreferencesCommand {
  readonly workspaceId: string;
  readonly memberId: string;
  readonly subscribedEvents: WorkspaceNotificationEventType[];
}
⋮----
export class UpdateNotificationPreferencesUseCase {
⋮----
constructor(private readonly repo: WorkspaceNotificationPreferenceRepository)
⋮----
async execute(command: UpdateNotificationPreferencesCommand): Promise<CommandResult>
⋮----
export interface WorkspaceEventPayload {
  readonly eventType: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly message: string;
  readonly metadata?: Record<string, unknown>;
}
⋮----
export class NotifyWorkspaceMembersUseCase {
⋮----
constructor(
⋮----
async execute(event: WorkspaceEventPayload): Promise<void>
````

## File: src/modules/platform/subdomains/notification/domain/aggregates/NotificationAggregate.ts
````typescript
import { v4 as uuid } from "uuid";
import type {
  NotificationDomainEventType,
  NotificationDispatchedEvent,
  NotificationReadEvent,
} from "../events/NotificationDomainEvent";
import type { DispatchNotificationInput, NotificationEntity } from "../entities/Notification";
⋮----
export interface NotificationAggregateSnapshot {
  readonly id: string;
  readonly recipientId: string;
  readonly title: string;
  readonly message: string;
  readonly type: NotificationEntity["type"];
  readonly read: boolean;
  readonly timestamp: number;
  readonly sourceEventType: string | undefined;
  readonly metadata: Record<string, unknown> | undefined;
}
⋮----
export class NotificationAggregate {
⋮----
private constructor(private _props: NotificationAggregateSnapshot)
⋮----
static create(id: string, input: DispatchNotificationInput): NotificationAggregate
⋮----
static reconstitute(snapshot: NotificationAggregateSnapshot): NotificationAggregate
⋮----
markRead(): void
⋮----
getSnapshot(): Readonly<NotificationAggregateSnapshot>
⋮----
pullDomainEvents(): NotificationDomainEventType[]
⋮----
private recordEvent<TEvent extends NotificationDomainEventType>(event: TEvent): void
````

## File: src/modules/platform/subdomains/notification/domain/entities/Notification.ts
````typescript
export type NotificationType = "info" | "alert" | "success" | "warning";
⋮----
export interface NotificationEntity {
  readonly id: string;
  readonly recipientId: string;
  readonly title: string;
  readonly message: string;
  readonly type: NotificationType;
  readonly read: boolean;
  readonly timestamp: number;
  readonly sourceEventType?: string;
  readonly metadata?: Record<string, unknown>;
}
⋮----
export interface DispatchNotificationInput {
  readonly recipientId: string;
  readonly title: string;
  readonly message: string;
  readonly type: NotificationType;
  readonly sourceEventType?: string;
  readonly metadata?: Record<string, unknown>;
}
````

## File: src/modules/platform/subdomains/notification/domain/entities/WorkspaceNotificationPreference.ts
````typescript
import type { WorkspaceNotificationEventType } from "../value-objects/WorkspaceNotificationEventType";
import { WORKSPACE_NOTIFICATION_EVENT_TYPES } from "../value-objects/WorkspaceNotificationEventType";
⋮----
export interface WorkspaceNotificationPreferenceProps {
  readonly workspaceId: string;
  readonly memberId: string;
  readonly subscribedEvents: ReadonlySet<WorkspaceNotificationEventType>;
  readonly updatedAtISO: string;
}
⋮----
export class WorkspaceNotificationPreference {
⋮----
private constructor(private readonly _props: WorkspaceNotificationPreferenceProps)
⋮----
static create(workspaceId: string, memberId: string): WorkspaceNotificationPreference
⋮----
static reconstitute(props: WorkspaceNotificationPreferenceProps): WorkspaceNotificationPreference
⋮----
withSubscriptions(events: ReadonlySet<WorkspaceNotificationEventType>): WorkspaceNotificationPreference
⋮----
isSubscribedTo(eventType: WorkspaceNotificationEventType): boolean
⋮----
get workspaceId(): string
⋮----
get memberId(): string
⋮----
get subscribedEvents(): ReadonlySet<WorkspaceNotificationEventType>
⋮----
get updatedAtISO(): string
⋮----
getSnapshot(): Readonly<WorkspaceNotificationPreferenceProps>
````

## File: src/modules/platform/subdomains/notification/domain/events/NotificationDomainEvent.ts
````typescript
import type { NotificationType } from "../entities/Notification";
⋮----
export interface NotificationDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface NotificationDispatchedEvent extends NotificationDomainEvent {
  readonly type: "platform.notification.dispatched";
  readonly payload: {
    readonly notificationId: string;
    readonly recipientId: string;
    readonly notificationType: NotificationType;
  };
}
⋮----
export interface NotificationReadEvent extends NotificationDomainEvent {
  readonly type: "platform.notification.read";
  readonly payload: {
    readonly notificationId: string;
    readonly recipientId: string;
  };
}
⋮----
export interface AllNotificationsReadEvent extends NotificationDomainEvent {
  readonly type: "platform.notification.all_read";
  readonly payload: {
    readonly recipientId: string;
  };
}
⋮----
export type NotificationDomainEventType =
  | NotificationDispatchedEvent
  | NotificationReadEvent
  | AllNotificationsReadEvent;
````

## File: src/modules/platform/subdomains/notification/domain/index.ts
````typescript

````

## File: src/modules/platform/subdomains/notification/domain/repositories/NotificationRepository.ts
````typescript
import type { DispatchNotificationInput, NotificationEntity } from "../entities/Notification";
⋮----
export interface NotificationRepository {
  dispatch(input: DispatchNotificationInput): Promise<NotificationEntity>;
  markAsRead(notificationId: string, recipientId: string): Promise<void>;
  markAllAsRead(recipientId: string): Promise<void>;
  findByRecipient(recipientId: string, limit?: number): Promise<NotificationEntity[]>;
  getUnreadCount(recipientId: string): Promise<number>;
}
⋮----
dispatch(input: DispatchNotificationInput): Promise<NotificationEntity>;
markAsRead(notificationId: string, recipientId: string): Promise<void>;
markAllAsRead(recipientId: string): Promise<void>;
findByRecipient(recipientId: string, limit?: number): Promise<NotificationEntity[]>;
getUnreadCount(recipientId: string): Promise<number>;
````

## File: src/modules/platform/subdomains/notification/domain/repositories/WorkspaceNotificationPreferenceRepository.ts
````typescript
import type { WorkspaceNotificationPreference } from "../entities/WorkspaceNotificationPreference";
⋮----
export interface WorkspaceNotificationPreferenceRepository {
  findByMember(workspaceId: string, memberId: string): Promise<WorkspaceNotificationPreference | undefined>;
  save(preference: WorkspaceNotificationPreference): Promise<void>;
  findSubscribersByEventType(workspaceId: string, eventType: string): Promise<string[]>;
}
⋮----
findByMember(workspaceId: string, memberId: string): Promise<WorkspaceNotificationPreference | undefined>;
save(preference: WorkspaceNotificationPreference): Promise<void>;
findSubscribersByEventType(workspaceId: string, eventType: string): Promise<string[]>;
````

## File: src/modules/platform/subdomains/notification/domain/value-objects/WorkspaceNotificationEventType.ts
````typescript
import { z } from "zod";
⋮----
export type WorkspaceNotificationEventType = (typeof WORKSPACE_NOTIFICATION_EVENT_TYPES)[number];
⋮----
export function createWorkspaceNotificationEventType(raw: string): WorkspaceNotificationEventType
````

## File: src/modules/platform/subdomains/platform-config/adapters/inbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/platform-config/adapters/index.ts
````typescript
// platform-config — adapters aggregate
````

## File: src/modules/platform/subdomains/platform-config/adapters/outbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/platform-config/application/index.ts
````typescript

````

## File: src/modules/platform/subdomains/platform-config/domain/index.ts
````typescript
// platform-config — domain layer
// Owns shell navigation configuration: route contexts, nav sections, breadcrumbs.
⋮----
export interface NavConfigEntry {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}
⋮----
export interface PlatformNavSection {
  readonly sectionId: string;
  readonly label: string;
  readonly items: readonly NavConfigEntry[];
}
⋮----
export interface PlatformConfigRepository {
  getNavSections(): Promise<readonly PlatformNavSection[]>;
}
⋮----
getNavSections(): Promise<readonly PlatformNavSection[]>;
````

## File: src/modules/platform/subdomains/search/adapters/inbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/search/adapters/index.ts
````typescript
// search — adapters aggregate
````

## File: src/modules/platform/subdomains/search/adapters/outbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/search/application/index.ts
````typescript

````

## File: src/modules/platform/subdomains/search/domain/index.ts
````typescript
// search — domain layer
// Owns shell command catalog: searchable navigation items for quick-open palette.
⋮----
export interface SearchItem {
  readonly href: string;
  readonly label: string;
  readonly group: string;
}
⋮----
export interface SearchCatalogPort {
  listItems(): readonly SearchItem[];
}
⋮----
listItems(): readonly SearchItem[];
````

## File: src/modules/shared/index.ts
````typescript
import { z } from "zod";
⋮----
// ─── Domain Event base interface ─────────────────────────────────────────────
⋮----
/** All domain events must implement this interface. */
export interface DomainEvent {
  /** Unique event identifier */
  readonly eventId: string;
  /** Event type discriminant (e.g. "workspace.created") */
  readonly type: string;
  /** Aggregate root ID that triggered the event */
  readonly aggregateId: string;
  /** ISO 8601 occurrence timestamp */
  readonly occurredAt: string;
}
⋮----
/** Unique event identifier */
⋮----
/** Event type discriminant (e.g. "workspace.created") */
⋮----
/** Aggregate root ID that triggered the event */
⋮----
/** ISO 8601 occurrence timestamp */
⋮----
// ─── Base entity schema ───────────────────────────────────────────────────────
⋮----
/**
 * Shared base fields for all domain entities.
 * Includes tenant isolation (accountId / workspaceId) and audit trail (createdBy).
 */
⋮----
export type BaseEntity = z.infer<typeof BaseEntitySchema>;
export type CreatedBy = z.infer<typeof CreatedBySchema>;
⋮----
/**
 * Query scope for account-level or workspace-level queries.
 * When workspaceId is omitted, the query spans all workspaces for the tenant.
 */
export interface QueryScope {
  accountId: string;
  workspaceId?: string;
}
⋮----
// ─── Primitive types ──────────────────────────────────────────────────────────
⋮----
export type ID = string;
⋮----
export interface PaginationParams {
  page: number;
  limit: number;
}
⋮----
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
⋮----
// ─── Domain Error ─────────────────────────────────────────────────────────────
⋮----
/**
 * Structured domain error returned in CommandFailure.
 * Consumers MUST NOT use raw Error objects for command results.
 */
export interface DomainError {
  readonly code: string;
  readonly message: string;
  readonly context?: Record<string, unknown>;
}
⋮----
// ─── Command Result Contract ──────────────────────────────────────────────────
⋮----
export interface CommandSuccess {
  readonly success: true;
  readonly aggregateId: string;
  readonly version: number;
}
⋮----
export interface CommandFailure {
  readonly success: false;
  readonly error: DomainError;
}
⋮----
/** Union returned by every Command Handler / use-case. */
export type CommandResult = CommandSuccess | CommandFailure;
⋮----
export function commandSuccess(aggregateId: string, version: number): CommandSuccess
⋮----
export function commandFailure(error: DomainError): CommandFailure
⋮----
export function commandFailureFrom(
  code: string,
  message: string,
  context?: Record<string, unknown>,
): CommandFailure
⋮----
// ─── Firestore Timestamp shim ─────────────────────────────────────────────────
⋮----
/** Opaque Firestore Timestamp — Domain only carries seconds/nanoseconds, no SDK types. */
export interface Timestamp {
  readonly seconds: number;
  readonly nanoseconds: number;
  toDate(): Date;
}
⋮----
toDate(): Date;
````

## File: src/modules/template/index.ts
````typescript
/**
 * Template Module — aggregate export.
 * Cross-module consumers should only depend on symbols re-exported here.
 *
 * Source of truth: subdomains/document
 * Orchestration:   orchestration/TemplateFacade (composition root)
 * Shared types:    shared/types, shared/errors, shared/events
 */
⋮----
// ── document subdomain: domain ────────────────────────────────────────────────
⋮----
// ── document subdomain: application ──────────────────────────────────────────
⋮----
// ── shared ────────────────────────────────────────────────────────────────────
⋮----
// ── generation subdomain ──────────────────────────────────────────────────────
⋮----
// ── ingestion subdomain ───────────────────────────────────────────────────────
⋮----
// ── workflow subdomain ────────────────────────────────────────────────────────
````

## File: src/modules/template/orchestration/TemplateCoordinator.ts
````typescript
/**
 * TemplateCoordinator
 *
 * Handles cross-subdomain workflows that span more than one subdomain.
 * Example pipeline: document created → generation triggered → ingestion
 * queued → workflow initiated.
 *
 * Currently a stub. Wire subdomain use cases through the constructor once
 * each subdomain is activated and its cross-subdomain trigger points are
 * defined.
 *
 * Rules:
 * - Coordinator orchestrates only; it does NOT own business rules.
 * - Each step delegates to the responsible subdomain's use case.
 * - Cross-subdomain state is communicated via Published Language DTOs,
 *   never by sharing aggregate references.
 */
export class TemplateCoordinator {
⋮----
// Inject subdomain use cases or facades as constructor parameters when
// the corresponding subdomains are activated.
// Example:
//   constructor(
//     private readonly document: TemplateFacade,
//     private readonly generation: GenerationFacade,
//     private readonly ingestion: IngestionFacade,
//     private readonly workflow: WorkflowFacade,
//   ) {}
⋮----
/**
   * Full creation pipeline stub.
   * Expand this when generation / ingestion / workflow subdomains are live.
   */
async runCreationPipeline(_templateId: string): Promise<void>
⋮----
// 1. document subdomain: template already created — templateId provided
// 2. generation subdomain: trigger content generation
// 3. ingestion subdomain: queue generated content for ingestion
// 4. workflow subdomain: initiate review workflow
````

## File: src/modules/template/orchestration/TemplateFacade.ts
````typescript
import type { CreateTemplateUseCase } from '../subdomains/document/application/use-cases/CreateTemplateUseCase';
import type { UpdateTemplateUseCase } from '../subdomains/document/application/use-cases/UpdateTemplateUseCase';
import type { DeleteTemplateUseCase } from '../subdomains/document/application/use-cases/DeleteTemplateUseCase';
import type { CreateTemplateDTO } from '../subdomains/document/application/dto/CreateTemplateDTO';
import type { UpdateTemplateDTO } from '../subdomains/document/application/dto/UpdateTemplateDTO';
import type { TemplateResponseDTO } from '../subdomains/document/application/dto/TemplateResponseDTO';
⋮----
/**
 * TemplateFacade
 *
 * Unified public entry point for the template module.
 * Delegates each operation to the owning subdomain use case.
 * External callers (Server Actions, controllers, other modules) should
 * depend on this facade rather than individual use cases.
 *
 * Add new methods here as new subdomains activate.
 */
export class TemplateFacade {
⋮----
constructor(
⋮----
createTemplate(input: CreateTemplateDTO): Promise<TemplateResponseDTO>
⋮----
updateTemplate(input: UpdateTemplateDTO): Promise<TemplateResponseDTO>
⋮----
deleteTemplate(id: string): Promise<void>
````

## File: src/modules/template/shared/application/index.ts
````typescript
// shared/application — cross-subdomain application types
// Place shared DTOs, Ports, or ApplicationService interfaces used by
// more than one subdomain here.
````

## File: src/modules/template/shared/config/index.ts
````typescript
// shared/config — module-level configuration
// Place typed configuration interfaces and defaults here.
// Config values should be injected at the composition root, not read from
// process.env directly inside subdomains.
⋮----
export interface TemplateModuleConfig {
  /** Maximum number of templates per account. */
  maxTemplatesPerAccount: number;
  /** Default locale for template content. */
  defaultLocale: string;
}
⋮----
/** Maximum number of templates per account. */
⋮----
/** Default locale for template content. */
````

## File: src/modules/template/shared/constants/index.ts
````typescript
// shared/constants — module-wide constants
````

## File: src/modules/template/shared/domain/index.ts
````typescript
// shared/domain — cross-subdomain domain types
// Place shared Value Objects, Policies, or domain-level abstractions used by
// more than one subdomain here.
// Do NOT place subdomain-specific aggregates here.
````

## File: src/modules/template/shared/errors/index.ts
````typescript
// shared/errors — shared error types for the template module
⋮----
/**
 * Base error class for template module errors.
 * Subclass this for each subdomain error rather than throwing plain Error.
 */
export class TemplateModuleError extends Error {
⋮----
constructor(
    message: string,
    public readonly code: string,
)
⋮----
export class TemplateNotFoundError extends TemplateModuleError {
⋮----
constructor(id: string)
⋮----
export class TemplateDuplicateNameError extends TemplateModuleError {
⋮----
constructor(name: string)
````

## File: src/modules/template/shared/events/index.ts
````typescript
// shared/events — cross-subdomain Published Language events
// These are integration events emitted at the module boundary for other
// bounded contexts to consume. Do NOT mix these with subdomain-local
// domain events (those live in subdomains/*/domain/events/).
⋮----
export type TemplateModuleEventType =
  | 'template.created'
  | 'template.updated'
  | 'template.deleted'
  | 'template.generation.completed'
  | 'template.ingestion.completed'
  | 'template.workflow.completed';
⋮----
export interface TemplateModuleEvent<
  T extends TemplateModuleEventType = TemplateModuleEventType,
  P = unknown,
> {
  type: T;
  templateId: string;
  occurredAt: Date;
  payload?: P;
}
````

## File: src/modules/template/shared/infrastructure/index.ts
````typescript
// shared/infrastructure — shared infrastructure helpers
// Place cross-subdomain persistence helpers, connection factories, or
// shared adapter utilities here.
// Do NOT place business logic here.
````

## File: src/modules/template/shared/types/index.ts
````typescript
// shared/types — shared TypeScript types used across subdomains
⋮----
/** Lightweight read model for list views. */
export interface TemplateSummary {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
⋮----
/** Generic paginated result wrapper. */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
````

## File: src/modules/template/shared/utils/index.ts
````typescript
// shared/utils — shared utility functions
⋮----
/**
 * Strips leading/trailing whitespace and collapses inner whitespace.
 * Useful for normalising user-supplied template names.
 */
export function normaliseWhitespace(value: string): string
⋮----
/**
 * Returns true when the given string is a non-empty, non-whitespace value.
 */
export function isNonBlank(value: string): boolean
````

## File: src/modules/template/subdomains/document/adapters/inbound/http/routes.ts
````typescript
import type { TemplateController } from './TemplateController';
⋮----
/**
 * HTTP route definitions for the document subdomain.
 * Framework-agnostic registration descriptor; wired up at composition root.
 */
export interface HttpRoute {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  handler: (req: {
    body?: unknown;
    params?: Record<string, string>;
  }) => Promise<unknown>;
}
⋮----
export function buildTemplateRoutes(controller: TemplateController): HttpRoute[]
````

## File: src/modules/template/subdomains/document/adapters/inbound/http/TemplateController.ts
````typescript
import type { CreateTemplateUseCase } from '../../../application/use-cases/CreateTemplateUseCase';
import type { UpdateTemplateUseCase } from '../../../application/use-cases/UpdateTemplateUseCase';
import type { DeleteTemplateUseCase } from '../../../application/use-cases/DeleteTemplateUseCase';
import type { CreateTemplateDTO } from '../../../application/dto/CreateTemplateDTO';
import type { UpdateTemplateDTO } from '../../../application/dto/UpdateTemplateDTO';
⋮----
/**
 * HTTP inbound adapter — translates HTTP requests into application calls.
 */
export class TemplateController {
⋮----
constructor(
⋮----
async create(body: CreateTemplateDTO)
⋮----
async update(body: UpdateTemplateDTO)
⋮----
async delete(id: string)
````

## File: src/modules/template/subdomains/document/adapters/inbound/index.ts
````typescript
// http
⋮----
// queue
````

## File: src/modules/template/subdomains/document/adapters/inbound/queue/TemplateQueueHandler.ts
````typescript
/**
 * OPTIONAL ADAPTER
 * 僅在需要「非同步背景處理」時使用
 * 例如：AI 任務 / email / 長時間 job
 */
export class TemplateQueueHandler {
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
constructor(private createTemplateUseCase: any)
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async handle(message: any)
````

## File: src/modules/template/subdomains/document/adapters/index.ts
````typescript
// inbound
⋮----
// outbound
````

## File: src/modules/template/subdomains/document/adapters/outbound/cache/TemplateCacheAdapter.ts
````typescript
import type { CachePort } from '../../../application/ports/outbound/CachePort';
⋮----
interface CacheEntry<T = unknown> {
  value: T;
  expiresAt?: number;
}
⋮----
/**
 * In-memory reference implementation of CachePort.
 * Swap for Redis/Memcached adapter at the composition root if needed.
 */
export class TemplateCacheAdapter implements CachePort {
⋮----
async get<T>(key: string): Promise<T | null>
⋮----
async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>
⋮----
async delete(key: string): Promise<void>
````

## File: src/modules/template/subdomains/document/adapters/outbound/external-api/TemplateApiClient.ts
````typescript
import type { ExternalApiPort } from '../../../application/ports/outbound/ExternalApiPort';
⋮----
/**
 * External API adapter — concrete implementation of ExternalApiPort.
 */
export class TemplateApiClient implements ExternalApiPort {
⋮----
constructor(
⋮----
async fetchMetadata(resourceId: string): Promise<Record<string, unknown>>
````

## File: src/modules/template/subdomains/document/adapters/outbound/firestore/FirestoreMapper.ts
````typescript
import { Template } from '../../../domain/entities/Template';
import { TemplateId } from '../../../domain/value-objects/TemplateId';
import { TemplateName } from '../../../domain/value-objects/TemplateName';
⋮----
/**
 * Persistence model stored in Firestore.
 */
export interface TemplateDocument {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
⋮----
/**
 * Mapper between the Template aggregate and its Firestore document representation.
 */
⋮----
toDocument(template: Template): TemplateDocument
⋮----
toDomain(doc: TemplateDocument): Template
````

## File: src/modules/template/subdomains/document/adapters/outbound/firestore/FirestoreTemplateRepository.ts
````typescript
import { Template } from '../../../domain/entities/Template';
import { TemplateId } from '../../../domain/value-objects/TemplateId';
import type { TemplateRepository } from '../../../domain/repositories/TemplateRepository';
import { FirestoreMapper, type TemplateDocument } from './FirestoreMapper';
⋮----
/**
 * Minimal Firestore client surface required by this repository.
 * Keeps the adapter decoupled from any specific SDK version.
 */
export interface FirestoreLike {
  get(collection: string, id: string): Promise<TemplateDocument | null>;
  set(collection: string, id: string, data: TemplateDocument): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
}
⋮----
get(collection: string, id: string): Promise<TemplateDocument | null>;
set(collection: string, id: string, data: TemplateDocument): Promise<void>;
delete(collection: string, id: string): Promise<void>;
⋮----
/**
 * Firestore implementation of TemplateRepository.
 */
export class FirestoreTemplateRepository implements TemplateRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(id: TemplateId): Promise<Template | null>
⋮----
async save(template: Template): Promise<void>
⋮----
async delete(id: TemplateId): Promise<void>
````

## File: src/modules/template/subdomains/document/adapters/outbound/index.ts
````typescript
// firestore
⋮----
// cache
⋮----
// external-api
````

## File: src/modules/template/subdomains/document/application/dto/CreateTemplateDTO.ts
````typescript
/**
 * Input DTO for creating a Template.
 */
export interface CreateTemplateDTO {
  name: string;
  description?: string;
}
````

## File: src/modules/template/subdomains/document/application/dto/TemplateResponseDTO.ts
````typescript
/**
 * Output DTO returned to callers outside the application layer.
 */
export interface TemplateResponseDTO {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
````

## File: src/modules/template/subdomains/document/application/dto/UpdateTemplateDTO.ts
````typescript
/**
 * Input DTO for updating a Template.
 */
export interface UpdateTemplateDTO {
  id: string;
  name?: string;
  description?: string;
}
````

## File: src/modules/template/subdomains/document/application/index.ts
````typescript
// use-cases
⋮----
// dto
⋮----
// ports inbound
⋮----
// ports outbound
````

## File: src/modules/template/subdomains/document/application/ports/inbound/CreateTemplatePort.ts
````typescript
import type { CreateTemplateDTO } from '../../dto/CreateTemplateDTO';
import type { TemplateResponseDTO } from '../../dto/TemplateResponseDTO';
⋮----
/**
 * Inbound port — the contract exposed to adapters that drive the application.
 */
export interface CreateTemplatePort {
  execute(input: CreateTemplateDTO): Promise<TemplateResponseDTO>;
}
⋮----
execute(input: CreateTemplateDTO): Promise<TemplateResponseDTO>;
````

## File: src/modules/template/subdomains/document/application/ports/outbound/CachePort.ts
````typescript
/**
 * Outbound port — cache abstraction used by use cases.
 */
export interface CachePort {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}
⋮----
get<T>(key: string): Promise<T | null>;
set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
delete(key: string): Promise<void>;
````

## File: src/modules/template/subdomains/document/application/ports/outbound/ExternalApiPort.ts
````typescript
/**
 * Outbound port — abstraction over any external API dependency
 * consumed by template use cases.
 */
export interface ExternalApiPort {
  fetchMetadata(resourceId: string): Promise<Record<string, unknown>>;
}
⋮----
fetchMetadata(resourceId: string): Promise<Record<string, unknown>>;
````

## File: src/modules/template/subdomains/document/application/ports/outbound/TemplateRepositoryPort.ts
````typescript
import type { TemplateRepository } from '../../../domain/repositories/TemplateRepository';
⋮----
/**
 * Outbound port — application layer dependency on the repository contract.
 * Alias of the domain repository interface to keep adapter wiring explicit.
 */
export type TemplateRepositoryPort = TemplateRepository;
````

## File: src/modules/template/subdomains/document/application/use-cases/CreateTemplateUseCase.ts
````typescript
import { Template } from '../../domain/entities/Template';
import { TemplateName } from '../../domain/value-objects/TemplateName';
import type { CreateTemplateDTO } from '../dto/CreateTemplateDTO';
import type { TemplateResponseDTO } from '../dto/TemplateResponseDTO';
import type { CreateTemplatePort } from '../ports/inbound/CreateTemplatePort';
import type { TemplateRepositoryPort } from '../ports/outbound/TemplateRepositoryPort';
⋮----
/**
 * Use case: Create a new Template aggregate and persist it.
 */
export class CreateTemplateUseCase implements CreateTemplatePort {
⋮----
constructor(private readonly repository: TemplateRepositoryPort)
⋮----
async execute(input: CreateTemplateDTO): Promise<TemplateResponseDTO>
````

## File: src/modules/template/subdomains/document/application/use-cases/DeleteTemplateUseCase.ts
````typescript
import { TemplateId } from '../../domain/value-objects/TemplateId';
import type { TemplateRepositoryPort } from '../ports/outbound/TemplateRepositoryPort';
⋮----
/**
 * Use case: Delete a Template aggregate by id.
 */
export class DeleteTemplateUseCase {
⋮----
constructor(private readonly repository: TemplateRepositoryPort)
⋮----
async execute(id: string): Promise<void>
````

## File: src/modules/template/subdomains/document/application/use-cases/UpdateTemplateUseCase.ts
````typescript
import { TemplateId } from '../../domain/value-objects/TemplateId';
import { TemplateName } from '../../domain/value-objects/TemplateName';
import type { UpdateTemplateDTO } from '../dto/UpdateTemplateDTO';
import type { TemplateResponseDTO } from '../dto/TemplateResponseDTO';
import type { TemplateRepositoryPort } from '../ports/outbound/TemplateRepositoryPort';
⋮----
/**
 * Use case: Update a Template aggregate.
 */
export class UpdateTemplateUseCase {
⋮----
constructor(private readonly repository: TemplateRepositoryPort)
⋮----
async execute(input: UpdateTemplateDTO): Promise<TemplateResponseDTO>
````

## File: src/modules/template/subdomains/document/domain/entities/Template.ts
````typescript
import { TemplateId } from '../value-objects/TemplateId';
import { TemplateName } from '../value-objects/TemplateName';
⋮----
/**
 * Template — Aggregate Root
 * Encapsulates business invariants for a template.
 */
export interface TemplateProps {
  id: TemplateId;
  name: TemplateName;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
⋮----
export class Template {
⋮----
private constructor(private props: TemplateProps)
⋮----
static create(params: {
    id?: TemplateId;
    name: TemplateName;
    description?: string;
}): Template
⋮----
static restore(props: TemplateProps): Template
⋮----
get id(): TemplateId
⋮----
get name(): TemplateName
⋮----
get description(): string | undefined
⋮----
get createdAt(): Date
⋮----
get updatedAt(): Date
⋮----
rename(name: TemplateName): void
⋮----
changeDescription(description: string): void
````

## File: src/modules/template/subdomains/document/domain/events/TemplateCreatedEvent.ts
````typescript
import { TemplateId } from '../value-objects/TemplateId';
⋮----
/**
 * Domain Event — Emitted when a Template is created.
 */
export class TemplateCreatedEvent {
⋮----
constructor(
    readonly templateId: TemplateId,
    readonly name: string,
    occurredAt: string = new Date().toISOString(),
    eventId: string = crypto.randomUUID(),
)
````

## File: src/modules/template/subdomains/document/domain/events/TemplateUpdatedEvent.ts
````typescript
import { TemplateId } from '../value-objects/TemplateId';
⋮----
/**
 * Domain Event — Emitted when a Template is updated.
 */
export class TemplateUpdatedEvent {
⋮----
constructor(
    readonly templateId: TemplateId,
    readonly changes: Readonly<Record<string, unknown>>,
    occurredAt: string = new Date().toISOString(),
    eventId: string = crypto.randomUUID(),
)
````

## File: src/modules/template/subdomains/document/domain/index.ts
````typescript
// entities
⋮----
// value-objects
⋮----
// events
⋮----
// repositories
⋮----
// services
````

## File: src/modules/template/subdomains/document/domain/repositories/TemplateRepository.ts
````typescript
import { Template } from '../entities/Template';
import { TemplateId } from '../value-objects/TemplateId';
⋮----
/**
 * TemplateRepository — Domain Repository Interface
 * Abstract persistence contract owned by the domain layer.
 */
export interface TemplateRepository {
  findById(id: TemplateId): Promise<Template | null>;
  save(template: Template): Promise<void>;
  delete(id: TemplateId): Promise<void>;
}
⋮----
findById(id: TemplateId): Promise<Template | null>;
save(template: Template): Promise<void>;
delete(id: TemplateId): Promise<void>;
````

## File: src/modules/template/subdomains/document/domain/services/TemplateDomainService.ts
````typescript
import { Template } from '../entities/Template';
import { TemplateName } from '../value-objects/TemplateName';
⋮----
/**
 * TemplateDomainService
 * Cross-entity or stateless domain logic that does not belong to a single aggregate.
 */
export class TemplateDomainService {
⋮----
/**
   * Business rule: Two templates are considered duplicates when their normalized
   * names match (case-insensitive, whitespace-collapsed).
   */
isDuplicateName(existing: Template, candidate: TemplateName): boolean
⋮----
const normalize = (v: string)
````

## File: src/modules/template/subdomains/document/domain/value-objects/TemplateId.ts
````typescript
/**
 * TemplateId — Value Object
 * Immutable identifier for a Template aggregate.
 */
export class TemplateId {
⋮----
private constructor(private readonly value: string)
⋮----
static create(value: string): TemplateId
⋮----
static generate(): TemplateId
⋮----
toString(): string
⋮----
equals(other: TemplateId): boolean
````

## File: src/modules/template/subdomains/document/domain/value-objects/TemplateName.ts
````typescript
/**
 * TemplateName — Value Object
 * Validated template name with domain invariants.
 */
export class TemplateName {
⋮----
private constructor(private readonly value: string)
⋮----
static create(value: string): TemplateName
⋮----
toString(): string
⋮----
equals(other: TemplateName): boolean
````

## File: src/modules/template/subdomains/generation/adapters/inbound/http/GenerationController.ts
````typescript
import type { GenerateTemplatePort } from '../../../application/ports/inbound/GenerateTemplatePort';
⋮----
/**
 * GenerationController — Inbound HTTP Adapter (stub)
 * Translates HTTP requests into GenerateTemplateUseCase calls.
 * Framework-agnostic stub — wire to Next.js route handler or tRPC when activated.
 */
export class GenerationController {
⋮----
constructor(private readonly generateUseCase: GenerateTemplatePort)
⋮----
/**
   * POST /api/templates/:sourceId/generate
   */
async handleGenerate(request: {
    sourceTemplateId: string;
    prompt: string;
})
````

## File: src/modules/template/subdomains/generation/adapters/inbound/http/routes.ts
````typescript
/**
 * generation/routes.ts (stub)
 *
 * Register GenerationController routes here when activating this subdomain.
 * Example structure for a Next.js App Router route handler:
 *
 * ```ts
 * export async function POST(request: Request) {
 *   const body = await request.json();
 *   const controller = getGenerationController();
 *   const result = await controller.handleGenerate(body);
 *   return Response.json(result.body, { status: result.status });
 * }
 * ```
 */
````

## File: src/modules/template/subdomains/generation/adapters/inbound/index.ts
````typescript

````

## File: src/modules/template/subdomains/generation/adapters/inbound/queue/GenerationQueueHandler.ts
````typescript
import type { GenerateTemplatePort } from '../../../application/ports/inbound/GenerateTemplatePort';
⋮----
/**
 * GenerationQueueHandler — Inbound Queue Adapter (stub)
 * Handles async generation jobs delivered via a message queue (QStash, Pub/Sub, etc.).
 */
export class GenerationQueueHandler {
⋮----
constructor(private readonly generateUseCase: GenerateTemplatePort)
⋮----
async handle(message:
````

## File: src/modules/template/subdomains/generation/adapters/index.ts
````typescript
// generation subdomain — adapters stub
// Add inbound (http/queue) and outbound (persistence/external) adapters here.
````

## File: src/modules/template/subdomains/generation/adapters/outbound/ai/AiGenerationAdapter.ts
````typescript
import type { AiGenerationPort } from '../../../application/ports/outbound/AiGenerationPort';
⋮----
/**
 * AiGenerationAdapter — Outbound AI Adapter (stub)
 * Implements AiGenerationPort by calling an AI provider (Genkit, OpenAI, etc.).
 * Replace the stub body with a real Genkit runFlow call when activated.
 */
export class AiGenerationAdapter implements AiGenerationPort {
⋮----
async generate(sourceTemplateId: string, prompt: string): Promise<string>
⋮----
// TODO: Replace with real Genkit / AI SDK call.
// Example:
//   const result = await genkitClient.runFlow('generateTemplateContent', {
//     sourceTemplateId,
//     prompt,
//   });
//   return result.content;
````

## File: src/modules/template/subdomains/generation/adapters/outbound/firestore/FirestoreGenerationRepository.ts
````typescript
import { GeneratedTemplate } from '../../../domain/entities/GeneratedTemplate';
import { GenerationId } from '../../../domain/value-objects/GenerationId';
import type { GenerationRepository } from '../../../domain/repositories/GenerationRepository';
⋮----
/**
 * Minimal Firestore-compatible interface used to keep this adapter
 * free from direct Firebase SDK imports.
 * The real Firestore client satisfies this shape at runtime.
 */
interface FirestoreLike {
  get<T>(path: string): Promise<T | null>;
  set<T>(path: string, data: T): Promise<void>;
  delete(path: string): Promise<void>;
}
⋮----
get<T>(path: string): Promise<T | null>;
set<T>(path: string, data: T): Promise<void>;
delete(path: string): Promise<void>;
⋮----
/**
 * FirestoreGenerationRepository
 * Outbound adapter that implements GenerationRepository using Firestore.
 */
export class FirestoreGenerationRepository implements GenerationRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(id: GenerationId): Promise<GeneratedTemplate | null>
⋮----
async save(generated: GeneratedTemplate): Promise<void>
⋮----
async delete(id: GenerationId): Promise<void>
⋮----
/**
 * Persistence document shape (Firestore document).
 */
export interface GeneratedTemplateDoc {
  id: string;
  sourceTemplateId: string;
  content: string;
  createdAt: string;
}
⋮----
/**
 * GenerationMapper — maps between domain and persistence representations.
 */
⋮----
toPersistence(entity: GeneratedTemplate): GeneratedTemplateDoc
⋮----
toDomain(doc: GeneratedTemplateDoc): GeneratedTemplate
````

## File: src/modules/template/subdomains/generation/adapters/outbound/index.ts
````typescript

````

## File: src/modules/template/subdomains/generation/application/dto/GenerateTemplateDTO.ts
````typescript
/**
 * GenerateTemplateDTO — inbound command for template generation.
 */
export interface GenerateTemplateDTO {
  /** ID of the source Template to generate content from. */
  sourceTemplateId: string;
  /** Prompt or instructions to guide the generation model. */
  prompt: string;
}
⋮----
/** ID of the source Template to generate content from. */
⋮----
/** Prompt or instructions to guide the generation model. */
````

## File: src/modules/template/subdomains/generation/application/dto/GenerationResultDTO.ts
````typescript
/**
 * GenerationResultDTO — outbound read model returned after a successful generation run.
 */
export interface GenerationResultDTO {
  generationId: string;
  sourceTemplateId: string;
  content: string;
  generatedAt: string;
}
````

## File: src/modules/template/subdomains/generation/application/index.ts
````typescript
// generation subdomain — application stub
// Add use-cases, DTOs, and ports for AI/rule-based template generation here.
// Expand only when this subdomain has real business behavior.
````

## File: src/modules/template/subdomains/generation/application/ports/inbound/GenerateTemplatePort.ts
````typescript
import type { GenerateTemplateDTO } from '../../dto/GenerateTemplateDTO';
import type { GenerationResultDTO } from '../../dto/GenerationResultDTO';
⋮----
/**
 * GenerateTemplatePort — Inbound Port
 * Contract for the GenerateTemplateUseCase public entry point.
 */
export interface GenerateTemplatePort {
  execute(input: GenerateTemplateDTO): Promise<GenerationResultDTO>;
}
⋮----
execute(input: GenerateTemplateDTO): Promise<GenerationResultDTO>;
````

## File: src/modules/template/subdomains/generation/application/ports/outbound/AiGenerationPort.ts
````typescript
/**
 * AiGenerationPort — Outbound Port
 * Abstract contract for AI-powered content generation.
 * Infrastructure adapters (Genkit, OpenAI, mock) implement this interface.
 */
export interface AiGenerationPort {
  generate(sourceTemplateId: string, prompt: string): Promise<string>;
}
⋮----
generate(sourceTemplateId: string, prompt: string): Promise<string>;
````

## File: src/modules/template/subdomains/generation/application/ports/outbound/GenerationRepositoryPort.ts
````typescript
import type { GenerationRepository } from '../../../domain/repositories/GenerationRepository';
⋮----
/**
 * GenerationRepositoryPort — Outbound Port
 * Type alias that exposes the domain repository contract to the application layer.
 */
export type GenerationRepositoryPort = GenerationRepository;
````

## File: src/modules/template/subdomains/generation/application/use-cases/GenerateTemplateUseCase.ts
````typescript
import type { GenerateTemplatePort } from '../ports/inbound/GenerateTemplatePort';
import type { GenerationRepositoryPort } from '../ports/outbound/GenerationRepositoryPort';
import type { AiGenerationPort } from '../ports/outbound/AiGenerationPort';
import type { GenerateTemplateDTO } from '../dto/GenerateTemplateDTO';
import type { GenerationResultDTO } from '../dto/GenerationResultDTO';
import { GeneratedTemplate } from '../../domain/entities/GeneratedTemplate';
import { GenerationId } from '../../domain/value-objects/GenerationId';
import { GenerationDomainService } from '../../domain/services/GenerationDomainService';
⋮----
/**
 * GenerateTemplateUseCase
 * Orchestrates AI-driven generation of a new template artifact.
 */
export class GenerateTemplateUseCase implements GenerateTemplatePort {
⋮----
constructor(
⋮----
async execute(input: GenerateTemplateDTO): Promise<GenerationResultDTO>
````

## File: src/modules/template/subdomains/generation/domain/entities/GeneratedTemplate.ts
````typescript
import { GenerationId } from '../value-objects/GenerationId';
⋮----
/**
 * GeneratedTemplate — Aggregate Root
 *
 * Represents the output artefact produced by an AI / rule-based
 * template generation run.
 */
export interface GeneratedTemplateProps {
  id: GenerationId;
  sourceTemplateId: string;
  content: string;
  createdAt: Date;
}
⋮----
export class GeneratedTemplate {
⋮----
private constructor(private readonly props: GeneratedTemplateProps)
⋮----
static create(
    params: Omit<GeneratedTemplateProps, 'createdAt'>,
): GeneratedTemplate
⋮----
get id(): GenerationId
⋮----
get sourceTemplateId(): string
⋮----
get content(): string
⋮----
get createdAt(): Date
````

## File: src/modules/template/subdomains/generation/domain/events/GenerationCompletedEvent.ts
````typescript
/**
 * GenerationCompletedEvent — Domain Event
 * Emitted when AI/rule-based template generation completes successfully.
 */
export class GenerationCompletedEvent {
⋮----
constructor(
    public readonly generationId: string,
    public readonly sourceTemplateId: string,
    public readonly contentLength: number,
    occurredAt: string = new Date().toISOString(),
    eventId: string = crypto.randomUUID(),
)
````

## File: src/modules/template/subdomains/generation/domain/index.ts
````typescript

````

## File: src/modules/template/subdomains/generation/domain/repositories/GenerationRepository.ts
````typescript
import type { GeneratedTemplate } from '../entities/GeneratedTemplate';
import type { GenerationId } from '../value-objects/GenerationId';
⋮----
/**
 * GenerationRepository — Domain Repository Interface
 * Abstract persistence contract for GeneratedTemplate aggregates.
 */
export interface GenerationRepository {
  findById(id: GenerationId): Promise<GeneratedTemplate | null>;
  save(generated: GeneratedTemplate): Promise<void>;
  delete(id: GenerationId): Promise<void>;
}
⋮----
findById(id: GenerationId): Promise<GeneratedTemplate | null>;
save(generated: GeneratedTemplate): Promise<void>;
delete(id: GenerationId): Promise<void>;
````

## File: src/modules/template/subdomains/generation/domain/services/GenerationDomainService.ts
````typescript
/**
 * GenerationDomainService — Domain Service (stub)
 *
 * Handles business rules that span multiple GeneratedTemplate instances
 * or require coordination beyond a single aggregate.
 * Expand when generation subdomain is activated.
 */
export class GenerationDomainService {
⋮----
/**
   * Validate that a generation request is well-formed before the
   * AI generation port is invoked.
   */
validateGenerationRequest(sourceTemplateId: string, prompt: string): void
````

## File: src/modules/template/subdomains/generation/domain/value-objects/GenerationId.ts
````typescript
/**
 * GenerationId — Value Object
 * Immutable identifier for a GeneratedTemplate aggregate.
 */
export class GenerationId {
⋮----
private constructor(private readonly value: string)
⋮----
static create(value: string): GenerationId
⋮----
static generate(): GenerationId
⋮----
toString(): string
⋮----
equals(other: GenerationId): boolean
````

## File: src/modules/template/subdomains/ingestion/adapters/inbound/http/IngestionController.ts
````typescript
import type { StartIngestionPort } from '../../../application/ports/inbound/StartIngestionPort';
⋮----
/**
 * IngestionController — Inbound HTTP Adapter (stub)
 */
export class IngestionController {
⋮----
constructor(private readonly startUseCase: StartIngestionPort)
⋮----
/** POST /api/ingestion */
async handleStart(request:
````

## File: src/modules/template/subdomains/ingestion/adapters/inbound/http/routes.ts
````typescript

````

## File: src/modules/template/subdomains/ingestion/adapters/inbound/index.ts
````typescript

````

## File: src/modules/template/subdomains/ingestion/adapters/inbound/queue/IngestionQueueHandler.ts
````typescript
import type { StartIngestionPort } from '../../../application/ports/inbound/StartIngestionPort';
⋮----
/**
 * IngestionQueueHandler — Inbound Queue Adapter (stub)
 * Triggered by a queue message (QStash, Pub/Sub, etc.) to start or resume an ingestion job.
 */
export class IngestionQueueHandler {
⋮----
constructor(private readonly startUseCase: StartIngestionPort)
⋮----
async handle(message:
````

## File: src/modules/template/subdomains/ingestion/adapters/index.ts
````typescript
// ingestion subdomain — adapters stub
// Add inbound (queue) and outbound (storage/firestore) adapters here.
````

## File: src/modules/template/subdomains/ingestion/adapters/outbound/firestore/FirestoreIngestionJobRepository.ts
````typescript
import type { IngestionJobRepository } from '../../../domain/repositories/IngestionJobRepository';
import type { IngestionId } from '../../../domain/value-objects/IngestionId';
import { IngestionJob } from '../../../domain/entities/IngestionJob';
⋮----
interface FirestoreLike {
  get(path: string): Promise<Record<string, unknown> | null>;
  set(path: string, data: Record<string, unknown>): Promise<void>;
  delete(path: string): Promise<void>;
}
⋮----
get(path: string): Promise<Record<string, unknown> | null>;
set(path: string, data: Record<string, unknown>): Promise<void>;
delete(path: string): Promise<void>;
⋮----
const toData = (job: IngestionJob): Record<string, unknown> => (
⋮----
/**
 * FirestoreIngestionJobRepository — Outbound Firestore Adapter
 */
export class FirestoreIngestionJobRepository implements IngestionJobRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(id: IngestionId): Promise<IngestionJob | null>
⋮----
async save(job: IngestionJob): Promise<void>
⋮----
async delete(id: IngestionId): Promise<void>
````

## File: src/modules/template/subdomains/ingestion/adapters/outbound/index.ts
````typescript

````

## File: src/modules/template/subdomains/ingestion/adapters/outbound/storage/CloudStorageAdapter.ts
````typescript
import type { StoragePort } from '../../../application/ports/outbound/StoragePort';
⋮----
/**
 * CloudStorageAdapter — Outbound Storage Adapter (stub)
 * TODO: wire to Firebase Cloud Storage SDK in actual module implementation.
 */
export class CloudStorageAdapter implements StoragePort {
⋮----
async readFile(_path: string): Promise<Buffer>
````

## File: src/modules/template/subdomains/ingestion/application/dto/IngestionJobResponseDTO.ts
````typescript
/** IngestionJobResponseDTO — read model returned after a job is created or queried. */
export interface IngestionJobResponseDTO {
  jobId: string;
  sourceUrl: string;
  status: string;
  createdAt: string;
  completedAt?: string;
}
````

## File: src/modules/template/subdomains/ingestion/application/dto/StartIngestionDTO.ts
````typescript
/** StartIngestionDTO — inbound command to start a new ingestion job. */
export interface StartIngestionDTO {
  sourceUrl: string;
}
````

## File: src/modules/template/subdomains/ingestion/application/index.ts
````typescript
// ingestion subdomain — application stub
// Add use-cases, DTOs, and ports for source-document ingestion flows here.
````

## File: src/modules/template/subdomains/ingestion/application/ports/inbound/StartIngestionPort.ts
````typescript
import type { StartIngestionDTO } from '../../dto/StartIngestionDTO';
import type { IngestionJobResponseDTO } from '../../dto/IngestionJobResponseDTO';
⋮----
/** StartIngestionPort — Inbound Port for the StartIngestionUseCase. */
export interface StartIngestionPort {
  execute(input: StartIngestionDTO): Promise<IngestionJobResponseDTO>;
}
⋮----
execute(input: StartIngestionDTO): Promise<IngestionJobResponseDTO>;
````

## File: src/modules/template/subdomains/ingestion/application/ports/outbound/IngestionRepositoryPort.ts
````typescript
import type { IngestionJobRepository } from '../../../domain/repositories/IngestionJobRepository';
⋮----
/** IngestionRepositoryPort — Outbound Port (type alias). */
export type IngestionRepositoryPort = IngestionJobRepository;
````

## File: src/modules/template/subdomains/ingestion/application/ports/outbound/StoragePort.ts
````typescript
/**
 * StoragePort — Outbound Port
 * Abstract contract for reading source documents from object storage.
 */
export interface StoragePort {
  readFile(path: string): Promise<Buffer>;
}
⋮----
readFile(path: string): Promise<Buffer>;
````

## File: src/modules/template/subdomains/ingestion/application/use-cases/StartIngestionUseCase.ts
````typescript
import type { StartIngestionPort } from '../ports/inbound/StartIngestionPort';
import type { IngestionRepositoryPort } from '../ports/outbound/IngestionRepositoryPort';
import type { StartIngestionDTO } from '../dto/StartIngestionDTO';
import type { IngestionJobResponseDTO } from '../dto/IngestionJobResponseDTO';
import { IngestionJob } from '../../domain/entities/IngestionJob';
import { IngestionId } from '../../domain/value-objects/IngestionId';
import { IngestionDomainService } from '../../domain/services/IngestionDomainService';
⋮----
/**
 * StartIngestionUseCase
 * Creates a new IngestionJob and queues it for background processing.
 */
export class StartIngestionUseCase implements StartIngestionPort {
⋮----
constructor(private readonly repository: IngestionRepositoryPort)
⋮----
async execute(input: StartIngestionDTO): Promise<IngestionJobResponseDTO>
````

## File: src/modules/template/subdomains/ingestion/domain/entities/IngestionJob.ts
````typescript
import { IngestionId } from '../value-objects/IngestionId';
import {
  IngestionJobCompletedEvent,
  IngestionJobFailedEvent,
  IngestionJobStartedEvent,
} from '../events/IngestionJobEvents';
⋮----
/**
 * IngestionJob — Aggregate Root
 * Tracks the lifecycle of a single source-document ingestion run.
 */
export type IngestionStatus = 'pending' | 'processing' | 'completed' | 'failed';
⋮----
export interface IngestionJobProps {
  id: IngestionId;
  sourceUrl: string;
  status: IngestionStatus;
  createdAt: Date;
  completedAt?: Date;
}
⋮----
export class IngestionJob {
⋮----
private constructor(private props: IngestionJobProps)
⋮----
static create(
    params: Pick<IngestionJobProps, 'id' | 'sourceUrl'>,
): IngestionJob
⋮----
get id(): IngestionId
⋮----
get sourceUrl(): string
⋮----
get status(): IngestionStatus
⋮----
get createdAt(): Date
⋮----
get completedAt(): Date | undefined
⋮----
markProcessing(): void
⋮----
markCompleted(): void
⋮----
markFailed(): void
⋮----
pullDomainEvents(): Array<
````

## File: src/modules/template/subdomains/ingestion/domain/events/IngestionJobEvents.ts
````typescript
/**
 * IngestionJobStartedEvent — Domain Event
 * Emitted when a new ingestion job is created and submitted for processing.
 */
export class IngestionJobStartedEvent {
⋮----
constructor(
    public readonly jobId: string,
    public readonly sourceUrl: string,
    occurredAt: string = new Date().toISOString(),
    eventId: string = crypto.randomUUID(),
)
⋮----
/**
 * IngestionJobCompletedEvent — Domain Event
 * Emitted when an ingestion job finishes successfully.
 */
export class IngestionJobCompletedEvent {
⋮----
/**
 * IngestionJobFailedEvent — Domain Event
 * Emitted when an ingestion job fails.
 */
export class IngestionJobFailedEvent {
````

## File: src/modules/template/subdomains/ingestion/domain/index.ts
````typescript

````

## File: src/modules/template/subdomains/ingestion/domain/repositories/IngestionJobRepository.ts
````typescript
import type { IngestionJob } from '../entities/IngestionJob';
import type { IngestionId } from '../value-objects/IngestionId';
⋮----
/**
 * IngestionJobRepository — Domain Repository Interface
 */
export interface IngestionJobRepository {
  findById(id: IngestionId): Promise<IngestionJob | null>;
  save(job: IngestionJob): Promise<void>;
  delete(id: IngestionId): Promise<void>;
}
⋮----
findById(id: IngestionId): Promise<IngestionJob | null>;
save(job: IngestionJob): Promise<void>;
delete(id: IngestionId): Promise<void>;
````

## File: src/modules/template/subdomains/ingestion/domain/services/IngestionDomainService.ts
````typescript
/**
 * IngestionDomainService — Domain Service (stub)
 *
 * Business rules for ingestion job lifecycle that span multiple
 * aggregate instances or depend on external constraints.
 */
export class IngestionDomainService {
⋮----
validateSourceUrl(sourceUrl: string): void
````

## File: src/modules/template/subdomains/ingestion/domain/value-objects/IngestionId.ts
````typescript
/**
 * IngestionId — Value Object
 * Immutable identifier for an IngestionJob aggregate.
 */
export class IngestionId {
⋮----
private constructor(private readonly value: string)
⋮----
static create(value: string): IngestionId
⋮----
static generate(): IngestionId
⋮----
toString(): string
⋮----
equals(other: IngestionId): boolean
````

## File: src/modules/template/subdomains/workflow/adapters/inbound/http/routes.ts
````typescript

````

## File: src/modules/template/subdomains/workflow/adapters/inbound/http/WorkflowController.ts
````typescript
import type { InitiateWorkflowPort } from '../../../application/ports/inbound/InitiateWorkflowPort';
⋮----
/**
 * WorkflowController — Inbound HTTP Adapter (stub)
 */
export class WorkflowController {
⋮----
constructor(private readonly initiateUseCase: InitiateWorkflowPort)
⋮----
/** POST /api/workflows */
async handleInitiate(request:
````

## File: src/modules/template/subdomains/workflow/adapters/inbound/index.ts
````typescript

````

## File: src/modules/template/subdomains/workflow/adapters/index.ts
````typescript
// workflow subdomain — adapters stub
// Add inbound (http) and outbound (persistence) adapters here.
````

## File: src/modules/template/subdomains/workflow/adapters/outbound/firestore/FirestoreWorkflowRepository.ts
````typescript
import type { TemplateWorkflowRepository } from '../../../domain/repositories/TemplateWorkflowRepository';
import type { WorkflowId } from '../../../domain/value-objects/WorkflowId';
import { TemplateWorkflow } from '../../../domain/entities/TemplateWorkflow';
⋮----
interface FirestoreLike {
  get(path: string): Promise<Record<string, unknown> | null>;
  set(path: string, data: Record<string, unknown>): Promise<void>;
  delete(path: string): Promise<void>;
}
⋮----
get(path: string): Promise<Record<string, unknown> | null>;
set(path: string, data: Record<string, unknown>): Promise<void>;
delete(path: string): Promise<void>;
⋮----
/**
 * FirestoreWorkflowRepository — Outbound Firestore Adapter
 */
export class FirestoreWorkflowRepository implements TemplateWorkflowRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(id: WorkflowId): Promise<TemplateWorkflow | null>
⋮----
async save(workflow: TemplateWorkflow): Promise<void>
⋮----
async delete(id: WorkflowId): Promise<void>
````

## File: src/modules/template/subdomains/workflow/adapters/outbound/index.ts
````typescript

````

## File: src/modules/template/subdomains/workflow/application/dto/InitiateWorkflowDTO.ts
````typescript
/** InitiateWorkflowDTO — inbound command to start a new workflow for a template. */
export interface InitiateWorkflowDTO {
  templateId: string;
}
````

## File: src/modules/template/subdomains/workflow/application/dto/WorkflowResponseDTO.ts
````typescript
/** WorkflowResponseDTO — read model returned after a workflow is created or queried. */
export interface WorkflowResponseDTO {
  workflowId: string;
  templateId: string;
  status: string;
  startedAt: string;
  completedAt?: string;
}
````

## File: src/modules/template/subdomains/workflow/application/index.ts
````typescript
// workflow subdomain — application stub
// Add use-cases, DTOs, and ports for template lifecycle workflows here.
````

## File: src/modules/template/subdomains/workflow/application/ports/inbound/InitiateWorkflowPort.ts
````typescript
import type { InitiateWorkflowDTO } from '../../dto/InitiateWorkflowDTO';
import type { WorkflowResponseDTO } from '../../dto/WorkflowResponseDTO';
⋮----
/** InitiateWorkflowPort — Inbound Port for the InitiateWorkflowUseCase. */
export interface InitiateWorkflowPort {
  execute(input: InitiateWorkflowDTO): Promise<WorkflowResponseDTO>;
}
⋮----
execute(input: InitiateWorkflowDTO): Promise<WorkflowResponseDTO>;
````

## File: src/modules/template/subdomains/workflow/application/ports/outbound/WorkflowRepositoryPort.ts
````typescript
import type { TemplateWorkflowRepository } from '../../../domain/repositories/TemplateWorkflowRepository';
⋮----
/** WorkflowRepositoryPort — Outbound Port (type alias). */
export type WorkflowRepositoryPort = TemplateWorkflowRepository;
````

## File: src/modules/template/subdomains/workflow/application/use-cases/InitiateWorkflowUseCase.ts
````typescript
import type { InitiateWorkflowPort } from '../ports/inbound/InitiateWorkflowPort';
import type { WorkflowRepositoryPort } from '../ports/outbound/WorkflowRepositoryPort';
import type { InitiateWorkflowDTO } from '../dto/InitiateWorkflowDTO';
import type { WorkflowResponseDTO } from '../dto/WorkflowResponseDTO';
import { TemplateWorkflow } from '../../domain/entities/TemplateWorkflow';
import { WorkflowId } from '../../domain/value-objects/WorkflowId';
import { WorkflowDomainService } from '../../domain/services/WorkflowDomainService';
⋮----
/**
 * InitiateWorkflowUseCase
 * Creates a new TemplateWorkflow in 'pending' status.
 */
export class InitiateWorkflowUseCase implements InitiateWorkflowPort {
⋮----
constructor(private readonly repository: WorkflowRepositoryPort)
⋮----
async execute(input: InitiateWorkflowDTO): Promise<WorkflowResponseDTO>
````

## File: src/modules/template/subdomains/workflow/domain/entities/template-state-model.test.ts
````typescript
import { describe, expect, it } from 'vitest';
import { TemplateWorkflow } from './TemplateWorkflow';
import { WorkflowId } from '../value-objects/WorkflowId';
import { IngestionJob } from '../../../ingestion/domain/entities/IngestionJob';
import { IngestionId } from '../../../ingestion/domain/value-objects/IngestionId';
````

## File: src/modules/template/subdomains/workflow/domain/entities/TemplateWorkflow.ts
````typescript
import { WorkflowId } from '../value-objects/WorkflowId';
import {
  WorkflowCancelledEvent,
  WorkflowCompletedEvent,
  WorkflowInitiatedEvent,
} from '../events/WorkflowEvents';
⋮----
/**
 * TemplateWorkflow — Aggregate Root
 * Represents a lifecycle workflow bound to a Template aggregate
 * (e.g. pending → active → completed).
 */
export type WorkflowStatus =
  | 'pending'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';
⋮----
export interface TemplateWorkflowProps {
  id: WorkflowId;
  templateId: string;
  status: WorkflowStatus;
  startedAt: Date;
  completedAt?: Date;
}
⋮----
export class TemplateWorkflow {
⋮----
private constructor(private props: TemplateWorkflowProps)
⋮----
static initiate(
    params: Pick<TemplateWorkflowProps, 'id' | 'templateId'>,
): TemplateWorkflow
⋮----
get id(): WorkflowId
⋮----
get templateId(): string
⋮----
get status(): WorkflowStatus
⋮----
get startedAt(): Date
⋮----
get completedAt(): Date | undefined
⋮----
activate(): void
⋮----
pause(): void
⋮----
complete(): void
⋮----
cancel(): void
⋮----
pullDomainEvents(): Array<
⋮----
private ensureTransition(
    allowedFrom: readonly WorkflowStatus[],
    target: WorkflowStatus,
): void
````

## File: src/modules/template/subdomains/workflow/domain/events/WorkflowEvents.ts
````typescript
/**
 * WorkflowInitiatedEvent — Domain Event
 * Raised when a TemplateWorkflow is successfully created.
 */
export class WorkflowInitiatedEvent {
⋮----
constructor(
    public readonly workflowId: string,
    public readonly templateId: string,
    occurredAt: string = new Date().toISOString(),
    eventId: string = crypto.randomUUID(),
)
⋮----
/**
 * WorkflowCompletedEvent — Domain Event
 * Raised when a TemplateWorkflow reaches the 'completed' status.
 */
export class WorkflowCompletedEvent {
⋮----
constructor(
    public readonly workflowId: string,
    public readonly templateId: string,
    public readonly completedAt: string = new Date().toISOString(),
    occurredAt: string = new Date().toISOString(),
    eventId: string = crypto.randomUUID(),
)
⋮----
/**
 * WorkflowCancelledEvent — Domain Event
 * Raised when a TemplateWorkflow reaches the 'cancelled' status.
 */
export class WorkflowCancelledEvent {
⋮----
constructor(
    public readonly workflowId: string,
    public readonly templateId: string,
    public readonly cancelledAt: string = new Date().toISOString(),
    occurredAt: string = new Date().toISOString(),
    eventId: string = crypto.randomUUID(),
)
````

## File: src/modules/template/subdomains/workflow/domain/index.ts
````typescript

````

## File: src/modules/template/subdomains/workflow/domain/repositories/TemplateWorkflowRepository.ts
````typescript
import type { TemplateWorkflow } from '../entities/TemplateWorkflow';
import type { WorkflowId } from '../value-objects/WorkflowId';
⋮----
/** TemplateWorkflowRepository — Domain Port (interface). */
export interface TemplateWorkflowRepository {
  findById(id: WorkflowId): Promise<TemplateWorkflow | null>;
  save(workflow: TemplateWorkflow): Promise<void>;
  delete(id: WorkflowId): Promise<void>;
}
⋮----
findById(id: WorkflowId): Promise<TemplateWorkflow | null>;
save(workflow: TemplateWorkflow): Promise<void>;
delete(id: WorkflowId): Promise<void>;
````

## File: src/modules/template/subdomains/workflow/domain/services/WorkflowDomainService.ts
````typescript
/**
 * WorkflowDomainService
 * Business rules that do not belong to a single TemplateWorkflow instance.
 */
export class WorkflowDomainService {
⋮----
/**
   * Validates that a templateId is provided before initiating a workflow.
   */
validateInitiateRequest(params:
````

## File: src/modules/template/subdomains/workflow/domain/value-objects/WorkflowId.ts
````typescript
import { v4 as uuidv4 } from 'uuid';
⋮----
/**
 * WorkflowId — Value Object
 */
export class WorkflowId {
⋮----
private constructor(private readonly value: string)
⋮----
static create(raw: string): WorkflowId
⋮----
static generate(): WorkflowId
⋮----
toString(): string
⋮----
equals(other: WorkflowId): boolean
````

## File: src/modules/workspace/adapters/inbound/react/index.ts
````typescript
/**
 * workspace inbound React adapter — barrel.
 *
 * Public surface for all workspace React inbound adapters.
 * Consumed by src/app/ route shims and platform/adapters/inbound/react/.
 */
````

## File: src/modules/workspace/adapters/inbound/react/useWorkspaceScope.ts
````typescript
/**
 * useWorkspaceScope — workspace inbound adapter (React).
 *
 * Canonical hook for reading the active workspace scope in the src/ layer.
 * Aliases useWorkspaceContext() from the workspace module.
 *
 * Returns: { state: WorkspaceContextState, dispatch: Dispatch<WorkspaceContextAction> }
 */
````

## File: src/modules/workspace/adapters/inbound/react/workspace-nav-model.ts
````typescript
/**
 * workspace-nav-model — pure navigation model for the workspace context.
 *
 * Domain-aware tab/group model, URL utilities, and nav-preferences persistence.
 * No JSX, no React hooks — safe to import in Server Components or shared utils.
 *
 * Tab ID naming convention:
 *   <domainGroup>.<slug>  e.g. "notion.knowledge", "notebooklm.ai-chat"
 * Tab value naming convention (URL ?tab= query param):
 *   PascalCase, must remain stable to preserve bookmarked URLs.
 */
⋮----
// ── Types & interfaces ────────────────────────────────────────────────────────
⋮----
export interface NavPreferences {
  readonly pinnedWorkspace: string[];
  readonly pinnedPersonal: string[];
  readonly showLimitedWorkspaces: boolean;
  readonly maxWorkspaces: number;
}
⋮----
export type SidebarLocaleBundle = Record<string, string>;
⋮----
/**
 * WorkspaceTabValue — canonical URL ?tab= values.
 * These are stable URL identifiers; do not rename without a redirect layer.
 *
 * workspace group (業務運作 — Work Execution)
 *   Backed by: workspace/subdomains/task, issue, approval, settlement, membership
 *
 * notion group (知識與資料結構 — Knowledge & Structure)
 *   Backed by: notion/subdomains/page, block, database, view, template, collaboration
 *   Context7 alignment: Page = hierarchical content container; Database = structured
 *   collection with typed properties; View = filter/sort/layout of a Database
 *   (table/board/calendar/gallery/timeline); Template = reusable page/db scaffold.
 *
 * notebooklm group (AI 理解與推理 — AI Reasoning & Synthesis)
 *   Backed by: notebooklm/subdomains/notebook, document, conversation
 *   Notebook = AI-assisted notebook with documentIds[]; Document = ingested source
 *   (storageUrl, mimeType, classification, processing status); Conversation =
 *   thread-based RAG exchange linked to a notebook.
 */
export type WorkspaceTabValue =
  // workspace
  | "Overview"
  | "Daily"
  | "Schedule"
  | "Audit"
  | "Files"
  | "Members"
  | "WorkspaceSettings"
  | "TaskFormation"
  | "Tasks"
  | "Quality"
  | "Approval"
  | "Settlement"
  | "Issues"
  // notion
  | "Knowledge"
  | "Pages"
  | "Database"
  | "Templates"
  // notebooklm
  | "Notebook"
  | "AiChat"
  | "Sources"
  | "Research";
⋮----
// workspace
⋮----
// notion
⋮----
// notebooklm
⋮----
/**
 * WorkspaceDomainGroup — the owning domain module for a workspace tab.
 *
 * workspace   → 業務運作 (Work Execution)
 * notion      → 知識與資料結構 (Knowledge & Data)
 * notebooklm  → AI 理解與推理 (AI Reasoning)
 */
export type WorkspaceDomainGroup = "workspace" | "notion" | "notebooklm";
⋮----
export interface WorkspaceTabItem {
  /**
   * id — domain-prefixed stable identifier used in localStorage preferences.
   * Format: "<domainGroup>.<slug>", e.g. "notion.knowledge", "workspace.tasks".
   */
  readonly id: string;
  /** value — canonical URL ?tab= query param value. Never rename. */
  readonly value: WorkspaceTabValue;
  readonly label: string;
  readonly domainGroup: WorkspaceDomainGroup;
}
⋮----
/**
   * id — domain-prefixed stable identifier used in localStorage preferences.
   * Format: "<domainGroup>.<slug>", e.g. "notion.knowledge", "workspace.tasks".
   */
⋮----
/** value — canonical URL ?tab= query param value. Never rename. */
⋮----
// ── Tab catalogue ─────────────────────────────────────────────────────────────
⋮----
/**
 * WORKSPACE_TAB_ITEMS — authoritative ordered tab catalogue.
 *
 * id    — domain-prefixed localStorage key (workspace.*|notion.*|notebooklm.*)
 * value — URL ?tab= query param (must never be renamed without a redirect layer)
 */
⋮----
// workspace group — 業務運作
⋮----
// notion group — 知識與資料結構 (Knowledge & Structure)
// Subdomains: page (hierarchical pages) · block (content units) · database
//   (typed collections) · view (table/board/calendar/gallery) · template ·
//   collaboration (comments/presence)
⋮----
// notebooklm group — AI 理解與推理 (AI Reasoning & Synthesis)
// Subdomains: notebook (AI notebooks with documentIds[]) · document (ingested
//   sources; mimeType / classification / processing status) · conversation
//   (thread-based RAG exchanges linked to a notebook)
⋮----
/** Legacy aliases: allow old ?tab= values to resolve to current canonical values. */
⋮----
// notebooklm subdomain aliases
⋮----
// notion subdomain aliases
⋮----
// ── Tab resolution helpers ────────────────────────────────────────────────────
⋮----
export function resolveWorkspaceTabValue(value: string | null | undefined): WorkspaceTabValue | null
⋮----
/**
 * Returns the domain group for a given workspace tab value string.
 * Falls back to "workspace" when the tab is unknown or null (so the
 * workspace-specific sidebar sections remain visible by default).
 */
export function resolveTabDomainGroup(tab: string | null | undefined): WorkspaceDomainGroup
⋮----
// ── Nav preferences ───────────────────────────────────────────────────────────
⋮----
// Bump version suffix whenever default tab IDs change so stale localStorage
// entries are discarded and users see the updated defaults.
// v3: tab IDs are now domain-prefixed (workspace.*, notion.*, notebooklm.*)
⋮----
// notion section
⋮----
// workspace section (continued)
⋮----
// notebooklm section
⋮----
// workspace settings & dispatcher
⋮----
export function sanitizeNavPreferences(input: Partial<NavPreferences> | null | undefined): NavPreferences
⋮----
// Additive merge: always include every default tab ID so that new domain
// sections added to WORKSPACE_TAB_ITEMS remain visible even when an older
// version of stored preferences is present.
⋮----
export function writeNavPreferences(prefs: NavPreferences): void
⋮----
export function readNavPreferences(): NavPreferences
⋮----
// ── URL / path utilities ──────────────────────────────────────────────────────
⋮----
export function supportsWorkspaceSearchContext(pathname: string): boolean
⋮----
export function getWorkspaceIdFromPath(pathname: string): string | null
⋮----
export function appendWorkspaceContextQuery(
  href: string,
  context: { accountId: string | null; workspaceId: string | null },
): string
````

## File: src/modules/workspace/adapters/inbound/react/workspace-shell-interop.tsx
````typescript
/**
 * workspace-shell-interop — workspace shell integration components & hooks.
 *
 * Bridges the workspace module with the platform shell:
 *   - WorkspaceQuickAccessRow   (icon strip in sidebar header)
 *   - WorkspaceSectionContent   (domain-grouped tab nav in sidebar body)
 *   - CustomizeNavigationDialog (user nav-preference editor)
 *   - CreateWorkspaceDialogRail (workspace creation triggered from app rail)
 *   - useRecentWorkspaces       (recent workspace list hook)
 *   - useSidebarLocale          (locale bundle stub hook)
 *   - buildWorkspaceQuickAccessItems (URL builder for quick-access items)
 *
 * All pure navigation data (types, constants, URL helpers) lives in
 * workspace-nav-model.ts — import from there for non-React consumers.
 */
⋮----
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Button, Input } from "@packages";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  BadgeCheck,
  BookOpen,
  Brain,
  ClipboardCheck,
  FileStack,
  FileText,
  FolderOpen,
  Home,
  Inbox,
  LayoutTemplate,
  ListTodo,
  MessageSquare,
  Notebook,
  Receipt,
  Settings,
  Shield,
  Table2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
⋮----
import type { WorkspaceEntity } from "./WorkspaceContext";
import { createClientWorkspaceLifecycleUseCases } from "../../outbound/firebase-composition";
import {
  DEFAULT_NAV_PREFS,
  WORKSPACE_DOMAIN_GROUP_LABELS,
  WORKSPACE_TAB_ITEMS,
  getWorkspaceIdFromPath,
  readNavPreferences,
  resolveWorkspaceTabValue,
  sanitizeNavPreferences,
  writeNavPreferences,
  type NavPreferences,
  type SidebarLocaleBundle,
  type WorkspaceDomainGroup,
} from "./workspace-nav-model";
⋮----
// Re-export types so callers that previously imported from workspace-ui-stubs
// can keep working without change when workspace-ui-stubs becomes a barrel.
⋮----
// ── WorkspaceQuickAccessItem ──────────────────────────────────────────────────
⋮----
interface WorkspaceQuickAccessMatcherOptions {
  panel: string | null;
  tab: string | null;
}
⋮----
interface WorkspaceQuickAccessItem {
  id: string;
  href: string;
  label: string;
  icon: ReactNode;
  isActive?: (pathname: string, options?: WorkspaceQuickAccessMatcherOptions) => boolean;
}
⋮----
/**
 * WORKSPACE_TAB_ICONS — icon for each WorkspaceTabValue.
 *
 * This is the ONLY UI-specific data that cannot live in workspace-nav-model.ts
 * (nav-model is JSX-free). All other tab metadata (label, id, value, group)
 * is owned by WORKSPACE_TAB_ITEMS — never duplicate it here.
 */
⋮----
// workspace group
⋮----
// notion group
⋮----
// notebooklm group
⋮----
/**
 * WORKSPACE_QUICK_ACCESS_TEMPLATES — quick-access icon strip items.
 *
 * Tab-based items are auto-derived from WORKSPACE_TAB_ITEMS so that
 * labels and IDs always stay in sync with workspace-nav-model.ts.
 * Only non-tab panel shortcuts (e.g. governance panel) are defined manually.
 */
⋮----
// Non-tab panel shortcut — not backed by a top-level WorkspaceTabValue
⋮----
// All tab-based items — derived from WORKSPACE_TAB_ITEMS; labels stay in sync
⋮----
export function buildWorkspaceQuickAccessItems(
  workspaceId: string,
  accountId: string | undefined,
): WorkspaceQuickAccessItem[]
⋮----
// ── useRecentWorkspaces ───────────────────────────────────────────────────────
⋮----
interface WorkspaceLink {
  id: string;
  name: string;
  href: string;
}
⋮----
function getRecentStorageKey(accountId: string): string
⋮----
function readRecentWorkspaceIds(accountId: string): string[]
⋮----
function persistRecentWorkspaceIds(accountId: string, workspaceIds: string[]): void
⋮----
function trackWorkspaceFromPath(pathname: string, accountId: string): void
⋮----
export function useRecentWorkspaces(
  accountId: string | undefined,
  pathname: string,
  workspaces: WorkspaceEntity[],
):
⋮----
export function useSidebarLocale(): SidebarLocaleBundle | null
⋮----
// ── Module-level instantiation ────────────────────────────────────────────────
⋮----
// ── WorkspaceQuickAccessRow ───────────────────────────────────────────────────
⋮----
interface WorkspaceQuickAccessRowProps {
  items: WorkspaceQuickAccessItem[];
  pathname: string;
  currentPanel: string | null;
  currentWorkspaceTab: string | null;
  workspaceSettingsHref: string;
  isActiveRoute: (href: string) => boolean;
}
⋮----
// ── WorkspaceSectionContent ───────────────────────────────────────────────────
⋮----
className=
⋮----
onSelectWorkspace(workspace.id);
⋮----
// ── CustomizeNavigationDialog ─────────────────────────────────────────────────
⋮----
setDraft((prev) => (
⋮----
setDraft(DEFAULT_NAV_PREFS);
⋮----
// ── CreateWorkspaceDialogRail ─────────────────────────────────────────────────
⋮----
function reset()
⋮----
async function handleSubmit(event: FormEvent<HTMLFormElement>)
⋮----
onOpenChange(isOpen);
⋮----
reset();
onOpenChange(false);
````

## File: src/modules/workspace/adapters/inbound/react/workspace-ui-stubs.tsx
````typescript
/**
 * workspace-ui-stubs — re-export barrel (backward-compatible surface).
 *
 * This file was previously a monolithic stubs file.  It is now a thin barrel
 * that re-exports from three focused modules:
 *
 *   workspace-nav-model.ts        — pure tab/group/URL model (no JSX)
 *   workspace-shell-interop.tsx   — shell integration components & hooks
 *   workspace-route-screens.tsx   — workspace-scoped route screens
 *
 * Account / organization route screens (AccountDashboard, OrganizationTeams,
 * OrganizationSchedule, OrganizationDaily, OrganizationAudit,
 * OrganizationWorkspaces) now live in platform-ui-stubs because they are owned
 * by the platform bounded context, not the workspace bounded context.
 *
 * Direct consumers of those screens must import from platform-ui-stubs instead.
 * AccountRouteDispatcher has already been updated accordingly.
 */
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceApprovalSection.tsx
````typescript
/**
 * WorkspaceApprovalSection — workspace.approval tab — acceptance review queue.
 */
⋮----
import { Badge, Button } from "@packages";
import { ClipboardList, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
⋮----
import {
  listApprovalDecisionsAction,
  createApprovalDecisionAction,
  approveTaskAction,
  rejectApprovalAction,
} from "@/src/modules/workspace/adapters/inbound/server-actions/approval-actions";
import { listTasksByWorkspaceAction } from "@/src/modules/workspace/adapters/inbound/server-actions/task-actions";
import { openIssueAction, listIssuesByWorkspaceAction } from "@/src/modules/workspace/adapters/inbound/server-actions/issue-actions";
import type { ApprovalDecisionSnapshot } from "@/src/modules/workspace/subdomains/approval/domain/entities/ApprovalDecision";
import type { TaskSnapshot } from "@/src/modules/workspace/subdomains/task/domain/entities/Task";
import type { IssueSnapshot } from "@/src/modules/workspace/subdomains/issue/domain/entities/Issue";
⋮----
interface WorkspaceApprovalSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}
⋮----
export function WorkspaceApprovalSection({
  workspaceId,
  accountId: _accountId,
  currentUserId,
}: WorkspaceApprovalSectionProps): React.ReactElement
⋮----
// Count open acceptance-stage issues per taskId for block guard UI
⋮----
const handleCreateDecision = (taskId: string) =>
⋮----
const handleApprove = (decision: ApprovalDecisionSnapshot) =>
⋮----
const handleReject = (decision: ApprovalDecisionSnapshot) =>
⋮----
onClick=
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceContext.tsx
````typescript
/**
 * WorkspaceContext — workspace inbound adapter (React).
 *
 * Defines workspace scope state, context, and the WorkspaceContextProvider.
 * Consumed by WorkspaceScopeProvider and useWorkspaceScope in this adapter layer.
 */
⋮----
import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
⋮----
import type { WorkspaceSnapshot } from "../../../subdomains/lifecycle/domain/entities/Workspace";
⋮----
export type WorkspaceEntity = WorkspaceSnapshot;
⋮----
export interface WorkspaceContextState {
  readonly workspaces: Record<string, WorkspaceEntity>;
  readonly activeWorkspaceId: string | null;
  readonly workspacesHydrated: boolean;
}
⋮----
export type WorkspaceContextAction =
  | { type: "SET_ACTIVE_WORKSPACE"; payload: string | null }
  | { type: "SET_WORKSPACES"; payload: Record<string, WorkspaceEntity> }
  | { type: "RESET" };
⋮----
export interface WorkspaceContextValue {
  readonly state: WorkspaceContextState;
  readonly dispatch: Dispatch<WorkspaceContextAction>;
}
⋮----
function reducer(
  state: WorkspaceContextState,
  action: WorkspaceContextAction,
): WorkspaceContextState
⋮----
export function WorkspaceContextProvider({
  children,
}: {
  children: ReactNode;
})
⋮----
export function useWorkspaceContext(): WorkspaceContextValue
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceIssuesSection.tsx
````typescript
/**
 * WorkspaceIssuesSection — workspace.issues tab — issue tracker with full lifecycle management.
 *
 * Supports:
 * - Listing workspace issues with status filter
 * - Creating issues manually via dialog (task + stage + title + description)
 * - Transitioning issue status via FSM-derived action buttons
 * - Viewing closed issues separately
 */
⋮----
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@packages";
import { AlertCircle, Plus, AlertTriangle, Info, Loader2, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
⋮----
import {
  listIssuesByWorkspaceAction,
  openIssueAction,
  transitionIssueStatusAction,
  resolveIssueAction,
  closeIssueAction,
} from "@/src/modules/workspace/adapters/inbound/server-actions/issue-actions";
import {
  listTasksByWorkspaceAction,
  transitionTaskStatusAction,
} from "@/src/modules/workspace/adapters/inbound/server-actions/task-actions";
import { startQualityReviewAction } from "@/src/modules/workspace/adapters/inbound/server-actions/quality-actions";
import type { IssueSnapshot } from "@/src/modules/workspace/subdomains/issue/domain/entities/Issue";
import type { IssueStatus } from "@/src/modules/workspace/subdomains/issue/domain/value-objects/IssueStatus";
import type { IssueStage } from "@/src/modules/workspace/subdomains/issue/domain/value-objects/IssueStage";
import type { TaskSnapshot } from "@/src/modules/workspace/subdomains/task/domain/entities/Task";
import {
  getIssueTransitionEvents,
  ISSUE_EVENT_TO_STATUS,
  ISSUE_EVENT_LABEL,
} from "@/src/modules/workspace/subdomains/issue/application/machines/issueLifecycle.machine";
⋮----
// ── Types & constants ────────────────────────────────────────────────────────
⋮----
interface WorkspaceIssuesSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}
⋮----
type IssueFilter = "全部" | "開啟" | "處理中" | "已關閉";
⋮----
// ── CreateIssueDialog ────────────────────────────────────────────────────────
⋮----
interface CreateIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  currentUserId: string;
  tasks: TaskSnapshot[];
  onCreated: () => void;
}
⋮----
const handleClose = () =>
⋮----
const handleSubmit = () =>
⋮----
{/* Task selection */}
⋮----
onValueChange=
⋮----
{/* Title */}
⋮----
onChange=
⋮----
{/* Description */}
⋮----
// ── IssueRow ─────────────────────────────────────────────────────────────────
⋮----
// Resolved issues with a qa/acceptance stage get a re-route shortcut
⋮----
{/* Lifecycle transition buttons */}
⋮----
onClick=
⋮----
{/* Re-route CTA: send resolved issue's task back to QA or acceptance */}
⋮----
// ── WorkspaceIssuesSection ───────────────────────────────────────────────────
⋮----
const handleTransition = (issueId: string, targetStatus: IssueStatus) =>
⋮----
const handleReroute = (issue: IssueSnapshot) =>
⋮----
const handleCreated = () =>
⋮----
{/* Header */}
⋮----
{/* Status filter */}
⋮----
{/* Severity legend */}
⋮----
{/* Issues list */}
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceOverviewSection.tsx
````typescript
/**
 * WorkspaceOverviewSection — workspace.overview tab.
 *
 * Six-panel overview of a workspace:
 *   1. 基本工作區資訊  — workspace metadata
 *   2. 里程碑 · 甘特圖 · 進度表  — milestone / schedule timeline
 *   3. 人力與出勤  — staffing & attendance
 *   4. 成本與預算  — cost & budget
 *   5. 任務與問題  — tasks & issues summary
 *   6. 即時狀態   — live feed
 */
⋮----
import { Badge } from "@packages";
import {
  Activity,
  AlertCircle,
  BarChart3,
  CalendarRange,
  CheckCircle2,
  Circle,
  DollarSign,
  Flag,
  MapPin,
  Radio,
  Users,
} from "lucide-react";
⋮----
import { type WorkspaceEntity } from "./WorkspaceContext";
⋮----
interface WorkspaceOverviewSectionProps {
  workspaceId: string;
  accountId: string;
  workspace: WorkspaceEntity;
}
⋮----
// ── Shared layout helpers ─────────────────────────────────────────────────────
⋮----
function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
})
⋮----
function StatPill({
  label,
  value,
  color = "text-foreground",
}: {
  label: string;
  value: string | number;
  color?: string;
})
⋮----
function EmptyState(
⋮----
// ── 1. 基本工作區資訊 ─────────────────────────────────────────────────────────
⋮----
// ── 2. 里程碑 · 甘特圖 · 進度表 ───────────────────────────────────────────────
⋮----
// ── 3. 人力與出勤 ─────────────────────────────────────────────────────────────
⋮----
// ── 4. 成本與預算 ─────────────────────────────────────────────────────────────
⋮----
// ── 5. 任務與問題 ─────────────────────────────────────────────────────────────
⋮----
// ── 6. 即時狀態 ───────────────────────────────────────────────────────────────
⋮----
// ── Main export ───────────────────────────────────────────────────────────────
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceQualitySection.tsx
````typescript
/**
 * WorkspaceQualitySection — workspace.quality tab — quality review queue.
 */
⋮----
import { Badge, Button } from "@packages";
import { ShieldCheck, ClipboardCheck, ClipboardX, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
⋮----
import {
  listQualityReviewsAction,
  passQualityReviewAction,
  failQualityReviewAction,
  startQualityReviewAction,
} from "@/src/modules/workspace/adapters/inbound/server-actions/quality-actions";
import { listTasksByWorkspaceAction } from "@/src/modules/workspace/adapters/inbound/server-actions/task-actions";
import { openIssueAction } from "@/src/modules/workspace/adapters/inbound/server-actions/issue-actions";
import type { QualityReviewSnapshot } from "@/src/modules/workspace/subdomains/quality/domain/entities/QualityReview";
import type { TaskSnapshot } from "@/src/modules/workspace/subdomains/task/domain/entities/Task";
⋮----
interface WorkspaceQualitySectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}
⋮----
const handleStartReview = (task: TaskSnapshot) =>
⋮----
const handlePass = (review: QualityReviewSnapshot) =>
⋮----
const handleFail = (review: QualityReviewSnapshot) =>
⋮----
onClick=
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceScopeProvider.tsx
````typescript
/**
 * WorkspaceScopeProvider — workspace inbound adapter (React).
 *
 * Canonical workspace scope provider for the src/ layer.
 *
 * Responsibilities:
 *  1. Mount a WorkspaceContextProvider (holds workspace state + dispatch).
 *  2. Subscribe to real-time Firestore workspace updates for the currently
 *     active account (via the outbound Firebase composition root).
 *  3. Dispatch SET_WORKSPACES when data arrives; RESET when the account is
 *     cleared (e.g. on sign-out).
 *
 * Design notes:
 *  - The subscription is managed by an inner WorkspaceSubscription component so
 *    the effect only re-runs when activeAccountId changes, not on every render.
 *  - WorkspaceScopeProvider reads the active account from AccountScopeProvider
 *    (useApp). The dependency direction workspace → platform is correct:
 *    platform is upstream of workspace.
 *  - The composition root (PlatformBootstrap) mounts WorkspaceScopeProvider
 *    inside AccountScopeProvider, so useApp() is always available here.
 */
⋮----
import { type ReactNode } from "react";
import { useEffect } from "react";
⋮----
import { WorkspaceContextProvider, useWorkspaceContext } from "./WorkspaceContext";
import { useApp } from "../../../../platform/adapters/inbound/react/AppContext";
import { subscribeToWorkspacesForAccount } from "../../outbound/firebase-composition";
⋮----
// ── WorkspaceSubscription ─────────────────────────────────────────────────────
// Isolated inner component so the subscription effect's dependency array is
// minimal — only activeAccountId triggers a new subscription, not the full
// app state object.
⋮----
function WorkspaceSubscription(
⋮----
// ── WorkspaceScopeProvider ────────────────────────────────────────────────────
⋮----
export function WorkspaceScopeProvider(
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceSettingsSection.tsx
````typescript
/**
 * WorkspaceSettingsSection — workspace.settings tab — workspace configuration.
 */
⋮----
import { Badge, Button, Separator } from "@packages";
import { Settings, Globe, Lock, Trash2 } from "lucide-react";
⋮----
import type { WorkspaceEntity } from "./WorkspaceContext";
⋮----
interface WorkspaceSettingsSectionProps {
  workspaceId: string;
  accountId: string;
  workspace?: WorkspaceEntity | null;
}
⋮----
export function WorkspaceSettingsSection({
  workspaceId,
  accountId: _accountId,
  workspace,
}: WorkspaceSettingsSectionProps): React.ReactElement
⋮----
{/* Header */}
⋮----
{/* General section */}
⋮----
{/* Danger zone */}
````

## File: src/modules/workspace/adapters/inbound/server-actions/approval-actions.ts
````typescript
import { z } from "zod";
import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { createClientApprovalUseCases } from "../../outbound/firebase-composition";
import type { ApprovalDecisionSnapshot } from "../../../subdomains/approval/domain/entities/ApprovalDecision";
⋮----
export async function createApprovalDecisionAction(rawInput: unknown): Promise<CommandResult>
⋮----
export async function approveTaskAction(decisionId: string, rawInput?: unknown): Promise<CommandResult>
⋮----
export async function rejectApprovalAction(decisionId: string, rawInput?: unknown): Promise<CommandResult>
⋮----
export async function listApprovalDecisionsAction(workspaceId: string): Promise<ApprovalDecisionSnapshot[]>
````

## File: src/modules/workspace/adapters/inbound/server-actions/audit-actions.ts
````typescript
import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { RecordAuditEntrySchema } from "../../../subdomains/audit/application/dto/AuditDTO";
import { createClientAuditUseCases } from "../../outbound/firebase-composition";
import type { AuditEntrySnapshot } from "../../../subdomains/audit/domain/entities/AuditEntry";
⋮----
// actorId injection from session is pending GAP-05 ADR decision.
// Until platform.AuthAPI.requireAuth() is available, actorId is accepted from
// client input via RecordAuditEntrySchema — tracked as GAP-05.
⋮----
export async function recordAuditEntryAction(rawInput: unknown): Promise<CommandResult>
⋮----
export async function listAuditEntriesByWorkspaceAction(workspaceId: string): Promise<AuditEntrySnapshot[]>
````

## File: src/modules/workspace/adapters/inbound/server-actions/issue-actions.ts
````typescript
import { z } from "zod";
import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { createClientIssueUseCases } from "../../outbound/firebase-composition";
import type { IssueSnapshot } from "../../../subdomains/issue/domain/entities/Issue";
⋮----
export async function openIssueAction(rawInput: unknown): Promise<CommandResult>
⋮----
export async function transitionIssueStatusAction(issueId: string, rawInput: unknown): Promise<CommandResult>
⋮----
export async function resolveIssueAction(issueId: string): Promise<CommandResult>
⋮----
export async function closeIssueAction(issueId: string): Promise<CommandResult>
⋮----
export async function listIssuesByTaskAction(taskId: string): Promise<IssueSnapshot[]>
⋮----
export async function listIssuesByWorkspaceAction(workspaceId: string): Promise<IssueSnapshot[]>
````

## File: src/modules/workspace/adapters/inbound/server-actions/quality-actions.ts
````typescript
import { z } from "zod";
import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { createClientQualityUseCases } from "../../outbound/firebase-composition";
import type { QualityReviewSnapshot } from "../../../subdomains/quality/domain/entities/QualityReview";
⋮----
export async function startQualityReviewAction(rawInput: unknown): Promise<CommandResult>
⋮----
export async function passQualityReviewAction(reviewId: string, rawInput?: unknown): Promise<CommandResult>
⋮----
export async function failQualityReviewAction(reviewId: string, rawInput?: unknown): Promise<CommandResult>
⋮----
export async function listQualityReviewsAction(workspaceId: string): Promise<QualityReviewSnapshot[]>
````

## File: src/modules/workspace/adapters/inbound/server-actions/schedule-actions.ts
````typescript
import { z } from "zod";
import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { CreateWorkDemandSchema } from "../../../subdomains/schedule/application/dto/ScheduleDTO";
import { createClientScheduleUseCases } from "../../outbound/firebase-composition";
import type { WorkDemandSnapshot } from "../../../subdomains/schedule/domain/entities/WorkDemand";
⋮----
// actorId injection from session is pending GAP-05 ADR decision.
// Until platform.AuthAPI.requireAuth() is available, workspaceId membership is
// not verified here — tracked as GAP-05.
⋮----
export async function createWorkDemandAction(rawInput: unknown): Promise<CommandResult>
⋮----
export async function assignWorkDemandAction(demandId: string, rawInput: unknown): Promise<CommandResult>
⋮----
export async function listWorkDemandsByWorkspaceAction(workspaceId: string): Promise<WorkDemandSnapshot[]>
````

## File: src/modules/workspace/adapters/outbound/FirebaseWorkspaceQueryRepository.ts
````typescript
/**
 * FirebaseWorkspaceQueryRepository — workspace module outbound adapter (read side).
 *
 * Provides real-time Firestore subscription for workspace data belonging to a
 * given account.  Lives at workspace/adapters/outbound/ so @integration-firebase
 * is permitted per ESLint boundary rules
 * (src/modules/<context>/adapters/outbound/**).
 *
 * Firestore collection contract:
 *   workspaces/{workspaceId} → WorkspaceSnapshot shape
 *
 * Design:
 *  - Uses onSnapshot for live updates (no polling).
 *  - Maps raw Firestore data defensively; all unknown values fall back to safe defaults.
 *  - Timestamps may arrive as Firestore Timestamp objects or ISO strings — both handled.
 */
⋮----
import { firebaseClientApp } from "@packages";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  type Timestamp,
} from "firebase/firestore";
⋮----
import type {
  WorkspaceSnapshot,
  WorkspaceLifecycleState,
  WorkspaceVisibility,
} from "../../subdomains/lifecycle/domain/entities/Workspace";
⋮----
export type Unsubscribe = () => void;
⋮----
// ── Timestamp helper ──────────────────────────────────────────────────────────
⋮----
function toISO(v: unknown): string
⋮----
// ── Firestore data → WorkspaceSnapshot mapper ─────────────────────────────────
⋮----
function toWorkspaceSnapshot(
  id: string,
  data: Record<string, unknown>,
): WorkspaceSnapshot
⋮----
// ── Repository ────────────────────────────────────────────────────────────────
⋮----
export class FirebaseWorkspaceQueryRepository {
⋮----
/**
   * Opens a real-time Firestore listener for all workspaces belonging to
   * `accountId`.  Calls `onUpdate` immediately with the current snapshot and
   * again on every subsequent change.
   *
   * Returns an unsubscribe function — call it when the subscriber unmounts.
   */
subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: Record<string, WorkspaceSnapshot>) => void,
): Unsubscribe
````

## File: src/modules/workspace/index.ts
````typescript
/**
 * Workspace Module — public API surface.
 * All cross-module consumers must import from here only.
 */
⋮----
// lifecycle (workspace CRUD)
⋮----
// membership
⋮----
// task
⋮----
// issue
⋮----
// shared types and errors
````

## File: src/modules/workspace/orchestration/index.ts
````typescript
/**
 * workspace — orchestration layer
 * Cross-subdomain coordination and facade composition.
 */
````

## File: src/modules/workspace/shared/errors/index.ts
````typescript
export class WorkspaceNotFoundError extends Error {
⋮----
constructor(workspaceId: string)
⋮----
export class WorkspaceMemberNotFoundError extends Error {
⋮----
constructor(memberId: string)
⋮----
export class WorkspaceQuotaExceededError extends Error {
⋮----
constructor(resourceKind: string)
⋮----
export class WorkspaceInvalidTransitionError extends Error {
⋮----
constructor(from: string, to: string)
````

## File: src/modules/workspace/shared/events/index.ts
````typescript
// Workspace cross-subdomain domain event type re-exports
````

## File: src/modules/workspace/shared/index.ts
````typescript

````

## File: src/modules/workspace/shared/types/index.ts
````typescript
export type WorkspaceId = string & { readonly __brand: "WorkspaceId" };
export type ActorId = string & { readonly __brand: "ActorId" };
export type MemberId = string & { readonly __brand: "MemberId" };
⋮----
export interface WorkspaceReference {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name: string;
}
⋮----
export interface WorkspaceScopeProps {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly currentUserId?: string;
}
````

## File: src/modules/workspace/subdomains/activity/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/activity/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/activity/adapters/outbound/firestore/FirestoreActivityRepository.ts
````typescript
import type { ActivityRepository } from "../../../domain/repositories/ActivityRepository";
import type { ActivityEventSnapshot } from "../../../domain/entities/ActivityEvent";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreActivityRepository implements ActivityRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async save(entry: ActivityEventSnapshot): Promise<void>
⋮----
async listByWorkspace(workspaceId: string, limit = 50): Promise<ActivityEventSnapshot[]>
⋮----
async listByResource(workspaceId: string, resourceType: string, resourceId: string): Promise<ActivityEventSnapshot[]>
````

## File: src/modules/workspace/subdomains/activity/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/activity/application/dto/ActivityDTO.ts
````typescript
import { z } from "zod";
⋮----
export type RecordActivityDTO = z.infer<typeof RecordActivitySchema>;
````

## File: src/modules/workspace/subdomains/activity/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/activity/application/use-cases/ActivityUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { ActivityRepository } from "../../domain/repositories/ActivityRepository";
import { ActivityEvent } from "../../domain/entities/ActivityEvent";
import type { RecordActivityInput } from "../../domain/entities/ActivityEvent";
⋮----
export class RecordActivityUseCase {
⋮----
constructor(private readonly activityRepo: ActivityRepository)
⋮----
async execute(input: RecordActivityInput): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/activity/domain/entities/ActivityEvent.ts
````typescript
import { v4 as uuid } from "uuid";
import type { ActivityDomainEventType } from "../events/ActivityDomainEvent";
⋮----
export type ActivityEventType =
  | "task.created" | "task.status_changed" | "task.assigned"
  | "issue.opened" | "issue.resolved"
  | "member.added" | "member.removed"
  | "workspace.created" | "workspace.activated";
⋮----
export interface ActivityEventSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly activityType: ActivityEventType;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly occurredAtISO: string;
}
⋮----
export interface RecordActivityInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly activityType: ActivityEventType;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly metadata?: Record<string, unknown>;
}
⋮----
export class ActivityEvent {
⋮----
private constructor(private readonly _props: ActivityEventSnapshot)
⋮----
static record(id: string, input: RecordActivityInput): ActivityEvent
⋮----
static reconstitute(snapshot: ActivityEventSnapshot): ActivityEvent
⋮----
get id(): string
get workspaceId(): string
get activityType(): ActivityEventType
⋮----
getSnapshot(): Readonly<ActivityEventSnapshot>
⋮----
pullDomainEvents(): ActivityDomainEventType[]
````

## File: src/modules/workspace/subdomains/activity/domain/events/ActivityDomainEvent.ts
````typescript
export interface ActivityDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface ActivityRecordedEvent extends ActivityDomainEvent {
  readonly type: "workspace.activity.recorded";
  readonly payload: { readonly activityId: string; readonly workspaceId: string; readonly activityType: string };
}
⋮----
export type ActivityDomainEventType = ActivityRecordedEvent;
````

## File: src/modules/workspace/subdomains/activity/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/activity/domain/repositories/ActivityRepository.ts
````typescript
import type { ActivityEventSnapshot } from "../entities/ActivityEvent";
⋮----
export interface ActivityRepository {
  save(entry: ActivityEventSnapshot): Promise<void>;
  listByWorkspace(workspaceId: string, limit?: number): Promise<ActivityEventSnapshot[]>;
  listByResource(workspaceId: string, resourceType: string, resourceId: string): Promise<ActivityEventSnapshot[]>;
}
⋮----
save(entry: ActivityEventSnapshot): Promise<void>;
listByWorkspace(workspaceId: string, limit?: number): Promise<ActivityEventSnapshot[]>;
listByResource(workspaceId: string, resourceType: string, resourceId: string): Promise<ActivityEventSnapshot[]>;
````

## File: src/modules/workspace/subdomains/api-key/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/api-key/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/api-key/adapters/outbound/firestore/FirestoreApiKeyRepository.ts
````typescript
import type { ApiKeyRepository } from "../../../domain/repositories/ApiKeyRepository";
import type { ApiKeySnapshot } from "../../../domain/entities/ApiKey";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreApiKeyRepository implements ApiKeyRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(keyId: string): Promise<ApiKeySnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<ApiKeySnapshot[]>
⋮----
async findByHash(keyHash: string): Promise<ApiKeySnapshot | null>
⋮----
async save(key: ApiKeySnapshot): Promise<void>
⋮----
async revoke(keyId: string, nowISO: string): Promise<void>
````

## File: src/modules/workspace/subdomains/api-key/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/api-key/application/dto/ApiKeyDTO.ts
````typescript
import { z } from "zod";
⋮----
export type CreateApiKeyDTO = z.infer<typeof CreateApiKeySchema>;
````

## File: src/modules/workspace/subdomains/api-key/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/api-key/application/use-cases/ApiKeyUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { ApiKeyRepository } from "../../domain/repositories/ApiKeyRepository";
import { ApiKey } from "../../domain/entities/ApiKey";
⋮----
export class GenerateApiKeyUseCase {
⋮----
constructor(private readonly keyRepo: ApiKeyRepository)
⋮----
async execute(workspaceId: string, actorId: string, label: string, expiresAtISO?: string): Promise<CommandResult>
⋮----
export class RevokeApiKeyUseCase {
⋮----
async execute(keyId: string): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/api-key/domain/entities/ApiKey.ts
````typescript
import { v4 as uuid } from "uuid";
import type { ApiKeyDomainEventType } from "../events/ApiKeyDomainEvent";
⋮----
export type ApiKeyStatus = "active" | "revoked";
⋮----
export interface ApiKeySnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly label: string;
  readonly keyPrefix: string;
  readonly keyHash: string;
  readonly status: ApiKeyStatus;
  readonly lastUsedAtISO: string | null;
  readonly expiresAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateApiKeyInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly label: string;
  readonly keyPrefix: string;
  readonly keyHash: string;
  readonly expiresAtISO?: string;
}
⋮----
export class ApiKey {
⋮----
private constructor(private _props: ApiKeySnapshot)
⋮----
static create(id: string, input: CreateApiKeyInput): ApiKey
⋮----
static reconstitute(snapshot: ApiKeySnapshot): ApiKey
⋮----
revoke(): void
⋮----
isExpired(): boolean
⋮----
get id(): string
get status(): ApiKeyStatus
⋮----
getSnapshot(): Readonly<ApiKeySnapshot>
⋮----
pullDomainEvents(): ApiKeyDomainEventType[]
````

## File: src/modules/workspace/subdomains/api-key/domain/events/ApiKeyDomainEvent.ts
````typescript
export interface ApiKeyDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface ApiKeyCreatedEvent extends ApiKeyDomainEvent {
  readonly type: "workspace.api-key.created";
  readonly payload: { readonly apiKeyId: string; readonly workspaceId: string };
}
⋮----
export interface ApiKeyRevokedEvent extends ApiKeyDomainEvent {
  readonly type: "workspace.api-key.revoked";
  readonly payload: { readonly apiKeyId: string; readonly workspaceId: string };
}
⋮----
export type ApiKeyDomainEventType = ApiKeyCreatedEvent | ApiKeyRevokedEvent;
````

## File: src/modules/workspace/subdomains/api-key/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/api-key/domain/repositories/ApiKeyRepository.ts
````typescript
import type { ApiKeySnapshot } from "../entities/ApiKey";
⋮----
export interface ApiKeyRepository {
  findById(keyId: string): Promise<ApiKeySnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<ApiKeySnapshot[]>;
  findByHash(keyHash: string): Promise<ApiKeySnapshot | null>;
  save(key: ApiKeySnapshot): Promise<void>;
  revoke(keyId: string, nowISO: string): Promise<void>;
}
⋮----
findById(keyId: string): Promise<ApiKeySnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<ApiKeySnapshot[]>;
findByHash(keyHash: string): Promise<ApiKeySnapshot | null>;
save(key: ApiKeySnapshot): Promise<void>;
revoke(keyId: string, nowISO: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/api-key/domain/value-objects/ApiKeyId.ts
````typescript
import { z } from "zod";
⋮----
export type ApiKeyId = z.infer<typeof ApiKeyIdSchema>;
⋮----
export function createApiKeyId(raw: string): ApiKeyId
````

## File: src/modules/workspace/subdomains/approval/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/approval/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/approval/adapters/outbound/firestore/FirestoreApprovalDecisionRepository.ts
````typescript
import type { ApprovalDecisionRepository } from "../../../domain/repositories/ApprovalDecisionRepository";
import type { ApprovalDecisionSnapshot } from "../../../domain/entities/ApprovalDecision";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreApprovalDecisionRepository implements ApprovalDecisionRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(decisionId: string): Promise<ApprovalDecisionSnapshot | null>
⋮----
async findByTaskId(taskId: string): Promise<ApprovalDecisionSnapshot[]>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<ApprovalDecisionSnapshot[]>
⋮----
async save(decision: ApprovalDecisionSnapshot): Promise<void>
⋮----
async delete(decisionId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/approval/adapters/outbound/index.ts
````typescript
// Approval subdomain delegates persistence to task/issue subdomains
````

## File: src/modules/workspace/subdomains/approval/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/approval/application/use-cases/ApprovalUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { ApprovalDecisionRepository } from "../../domain/repositories/ApprovalDecisionRepository";
import type { TaskRepository } from "../../../task/domain/repositories/TaskRepository";
import type { IssueRepository } from "../../../issue/domain/repositories/IssueRepository";
import { ApprovalDecision } from "../../domain/entities/ApprovalDecision";
import type { CreateApprovalDecisionInput } from "../../domain/entities/ApprovalDecision";
import { canTransitionTaskStatus } from "../../../task/domain/value-objects/TaskStatus";
⋮----
export class CreateApprovalDecisionUseCase {
⋮----
constructor(
⋮----
async execute(input: CreateApprovalDecisionInput): Promise<CommandResult>
⋮----
export class ApproveTaskUseCase {
⋮----
async execute(decisionId: string, comments?: string): Promise<CommandResult>
⋮----
export class RejectApprovalUseCase {
⋮----
export class ListApprovalDecisionsUseCase {
⋮----
constructor(private readonly decisionRepo: ApprovalDecisionRepository)
⋮----
async execute(workspaceId: string): Promise<import("../../domain/entities/ApprovalDecision").ApprovalDecisionSnapshot[]>
````

## File: src/modules/workspace/subdomains/approval/domain/entities/ApprovalDecision.ts
````typescript
import { v4 as uuid } from "uuid";
import type { ApprovalDomainEventType } from "../events/ApprovalDomainEvent";
⋮----
export type ApprovalDecisionStatus = "pending" | "approved" | "rejected";
⋮----
export interface ApprovalDecisionSnapshot {
  readonly id: string;
  readonly taskId: string;
  readonly workspaceId: string;
  readonly approverId: string;
  readonly status: ApprovalDecisionStatus;
  readonly comments: string;
  readonly createdAtISO: string;
  readonly decidedAtISO: string | null;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateApprovalDecisionInput {
  readonly taskId: string;
  readonly workspaceId: string;
  readonly approverId: string;
  readonly comments?: string;
}
⋮----
export class ApprovalDecision {
⋮----
private constructor(private _props: ApprovalDecisionSnapshot)
⋮----
static create(id: string, input: CreateApprovalDecisionInput): ApprovalDecision
⋮----
static reconstitute(snapshot: ApprovalDecisionSnapshot): ApprovalDecision
⋮----
approve(comments?: string): void
⋮----
reject(comments?: string): void
⋮----
get id(): string
get taskId(): string
get workspaceId(): string
get status(): ApprovalDecisionStatus
⋮----
getSnapshot(): Readonly<ApprovalDecisionSnapshot>
⋮----
pullDomainEvents(): ApprovalDomainEventType[]
````

## File: src/modules/workspace/subdomains/approval/domain/events/ApprovalDomainEvent.ts
````typescript
export interface ApprovalDecisionCreatedEvent {
  readonly type: "workspace.approval.decision-created";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly decisionId: string;
    readonly taskId: string;
    readonly workspaceId: string;
    readonly approverId: string;
  };
}
⋮----
export interface ApprovalDecisionApprovedEvent {
  readonly type: "workspace.approval.decision-approved";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly decisionId: string;
    readonly taskId: string;
    readonly workspaceId: string;
  };
}
⋮----
export interface ApprovalDecisionRejectedEvent {
  readonly type: "workspace.approval.decision-rejected";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly decisionId: string;
    readonly taskId: string;
    readonly workspaceId: string;
  };
}
⋮----
export type ApprovalDomainEventType =
  | ApprovalDecisionCreatedEvent
  | ApprovalDecisionApprovedEvent
  | ApprovalDecisionRejectedEvent;
````

## File: src/modules/workspace/subdomains/approval/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/approval/domain/repositories/ApprovalDecisionRepository.ts
````typescript
import type { ApprovalDecisionSnapshot } from "../entities/ApprovalDecision";
⋮----
export interface ApprovalDecisionRepository {
  findById(decisionId: string): Promise<ApprovalDecisionSnapshot | null>;
  findByTaskId(taskId: string): Promise<ApprovalDecisionSnapshot[]>;
  findByWorkspaceId(workspaceId: string): Promise<ApprovalDecisionSnapshot[]>;
  save(decision: ApprovalDecisionSnapshot): Promise<void>;
  delete(decisionId: string): Promise<void>;
}
⋮----
findById(decisionId: string): Promise<ApprovalDecisionSnapshot | null>;
findByTaskId(taskId: string): Promise<ApprovalDecisionSnapshot[]>;
findByWorkspaceId(workspaceId: string): Promise<ApprovalDecisionSnapshot[]>;
save(decision: ApprovalDecisionSnapshot): Promise<void>;
delete(decisionId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/audit/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/audit/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/audit/adapters/outbound/firestore/FirestoreAuditRepository.ts
````typescript
import type { AuditRepository } from "../../../domain/repositories/AuditRepository";
import type { AuditEntrySnapshot } from "../../../domain/entities/AuditEntry";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreAuditRepository implements AuditRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async save(entry: AuditEntrySnapshot): Promise<void>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<AuditEntrySnapshot[]>
⋮----
async findByWorkspaceIds(workspaceIds: string[], maxCount = 100): Promise<AuditEntrySnapshot[]>
````

## File: src/modules/workspace/subdomains/audit/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/audit/application/dto/AuditDTO.ts
````typescript
import { z } from "zod";
import { AuditActionSchema } from "../../domain/value-objects/AuditAction";
import { AuditSeveritySchema } from "../../domain/value-objects/AuditSeverity";
⋮----
export type RecordAuditEntryDTO = z.infer<typeof RecordAuditEntrySchema>;
````

## File: src/modules/workspace/subdomains/audit/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/audit/application/use-cases/AuditUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { AuditRepository } from "../../domain/repositories/AuditRepository";
import { AuditEntry } from "../../domain/entities/AuditEntry";
import type { AuditEntrySnapshot, RecordAuditEntryInput } from "../../domain/entities/AuditEntry";
⋮----
export class RecordAuditEntryUseCase {
⋮----
constructor(private readonly auditRepo: AuditRepository)
⋮----
async execute(input: RecordAuditEntryInput): Promise<CommandResult>
⋮----
export class ListWorkspaceAuditEntriesUseCase {
⋮----
async execute(workspaceId: string): Promise<AuditEntrySnapshot[]>
````

## File: src/modules/workspace/subdomains/audit/domain/entities/AuditEntry.ts
````typescript
import { v4 as uuid } from "uuid";
import type { AuditAction } from "../value-objects/AuditAction";
import type { AuditSeverity } from "../value-objects/AuditSeverity";
import type { AuditDomainEventType } from "../events/AuditDomainEvent";
⋮----
export type AuditLogSource = "workspace" | "finance" | "notification" | "system";
⋮----
export interface ChangeRecord {
  readonly field: string;
  readonly oldValue: unknown;
  readonly newValue: unknown;
}
⋮----
export interface AuditEntrySnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly action: AuditAction;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly severity: AuditSeverity;
  readonly detail: string;
  readonly source: AuditLogSource;
  readonly changes: readonly ChangeRecord[];
  readonly recordedAtISO: string;
}
⋮----
export interface RecordAuditEntryInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly action: AuditAction;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly severity: AuditSeverity;
  readonly detail: string;
  readonly source: AuditLogSource;
  readonly changes?: readonly ChangeRecord[];
}
⋮----
export class AuditEntry {
⋮----
private constructor(private readonly _props: AuditEntrySnapshot)
⋮----
static record(id: string, input: RecordAuditEntryInput): AuditEntry
⋮----
static reconstitute(snapshot: AuditEntrySnapshot): AuditEntry
⋮----
isCritical(): boolean
⋮----
get id(): string
get workspaceId(): string
get actorId(): string
get action(): AuditAction
get severity(): AuditSeverity
get recordedAtISO(): string
⋮----
getSnapshot(): Readonly<AuditEntrySnapshot>
⋮----
pullDomainEvents(): AuditDomainEventType[]
````

## File: src/modules/workspace/subdomains/audit/domain/events/AuditDomainEvent.ts
````typescript
export interface AuditDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface AuditEntryRecordedEvent extends AuditDomainEvent {
  readonly type: "workspace.audit.entry-recorded";
  readonly payload: {
    readonly auditId: string;
    readonly workspaceId: string;
    readonly actorId: string;
    readonly action: string;
    readonly severity: string;
  };
}
⋮----
export type AuditDomainEventType = AuditEntryRecordedEvent;
````

## File: src/modules/workspace/subdomains/audit/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/audit/domain/repositories/AuditRepository.ts
````typescript
import type { AuditEntrySnapshot } from "../entities/AuditEntry";
⋮----
export interface AuditRepository {
  save(entry: AuditEntrySnapshot): Promise<void>;
  findByWorkspaceId(workspaceId: string): Promise<AuditEntrySnapshot[]>;
  findByWorkspaceIds(workspaceIds: string[], maxCount?: number): Promise<AuditEntrySnapshot[]>;
}
⋮----
save(entry: AuditEntrySnapshot): Promise<void>;
findByWorkspaceId(workspaceId: string): Promise<AuditEntrySnapshot[]>;
findByWorkspaceIds(workspaceIds: string[], maxCount?: number): Promise<AuditEntrySnapshot[]>;
````

## File: src/modules/workspace/subdomains/audit/domain/value-objects/AuditAction.ts
````typescript
import { z } from "zod";
⋮----
export type AuditAction = z.infer<typeof AuditActionSchema>;
⋮----
export function createAuditAction(raw: string): AuditAction
````

## File: src/modules/workspace/subdomains/audit/domain/value-objects/AuditSeverity.ts
````typescript
import { z } from "zod";
⋮----
export type AuditSeverity = z.infer<typeof AuditSeveritySchema>;
⋮----
export function createAuditSeverity(raw: string): AuditSeverity
⋮----
export function severityLevel(severity: AuditSeverity): number
````

## File: src/modules/workspace/subdomains/feed/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/feed/adapters/outbound/firestore/FirestoreFeedRepository.ts
````typescript
import type { FeedPostRepository } from "../../../domain/repositories/FeedPostRepository";
import type { FeedPostSnapshot } from "../../../domain/entities/FeedPost";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
  increment(collection: string, id: string, field: string, delta: number): Promise<void>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
increment(collection: string, id: string, field: string, delta: number): Promise<void>;
⋮----
export class FirestoreFeedRepository implements FeedPostRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(accountId: string, postId: string): Promise<FeedPostSnapshot | null>
⋮----
async listByWorkspaceId(accountId: string, workspaceId: string, limit: number): Promise<FeedPostSnapshot[]>
⋮----
async listByWorkspaceIdAndDate(
    accountId: string,
    workspaceId: string,
    dateKey: string,
    limit: number,
): Promise<FeedPostSnapshot[]>
⋮----
async listByAccountId(accountId: string, limit: number): Promise<FeedPostSnapshot[]>
⋮----
async save(post: FeedPostSnapshot): Promise<void>
⋮----
async incrementCounter(
    accountId: string,
    postId: string,
    field: "likeCount" | "replyCount" | "repostCount" | "viewCount" | "bookmarkCount" | "shareCount",
    delta: number,
): Promise<void>
⋮----
private toSnapshot(doc: Record<string, unknown>): FeedPostSnapshot
````

## File: src/modules/workspace/subdomains/feed/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/feed/domain/entities/FeedPost.ts
````typescript
import { v4 as uuid } from "uuid";
import type { FeedDomainEventType } from "../events/FeedDomainEvent";
⋮----
export type FeedPostType = "post" | "reply" | "repost";
⋮----
export interface FeedPostSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId: string;
  readonly authorAccountId: string;
  readonly type: FeedPostType;
  readonly content: string;
  /** ISO date key YYYY-MM-DD for efficient Firestore date-range queries. */
  readonly dateKey: string;
  /** Storage URLs for attached photos (zero or more). */
  readonly photoUrls: readonly string[];
  readonly replyToPostId: string | null;
  readonly repostOfPostId: string | null;
  readonly likeCount: number;
  readonly replyCount: number;
  readonly repostCount: number;
  readonly viewCount: number;
  readonly bookmarkCount: number;
  readonly shareCount: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
/** ISO date key YYYY-MM-DD for efficient Firestore date-range queries. */
⋮----
/** Storage URLs for attached photos (zero or more). */
⋮----
export interface CreateFeedPostInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly authorAccountId: string;
  readonly content: string;
  /** Storage URLs for attached photos (zero or more). */
  readonly photoUrls?: readonly string[];
  readonly replyToPostId?: string;
  readonly repostOfPostId?: string;
}
⋮----
/** Storage URLs for attached photos (zero or more). */
⋮----
export class FeedPost {
⋮----
private constructor(private _props: FeedPostSnapshot)
⋮----
static create(id: string, input: CreateFeedPostInput): FeedPost
⋮----
const dateKey = now.slice(0, 10); // YYYY-MM-DD
⋮----
static reconstitute(snapshot: FeedPostSnapshot): FeedPost
⋮----
get id(): string
get workspaceId(): string
⋮----
getSnapshot(): Readonly<FeedPostSnapshot>
⋮----
pullDomainEvents(): FeedDomainEventType[]
````

## File: src/modules/workspace/subdomains/feed/domain/events/FeedDomainEvent.ts
````typescript
export interface FeedDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface FeedPostCreatedEvent extends FeedDomainEvent {
  readonly type: "workspace.feed.post-created";
  readonly payload: { readonly postId: string; readonly workspaceId: string; readonly authorAccountId: string };
}
⋮----
export type FeedDomainEventType = FeedPostCreatedEvent;
````

## File: src/modules/workspace/subdomains/feed/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/feed/domain/repositories/FeedPostRepository.ts
````typescript
import type { FeedPostSnapshot } from "../entities/FeedPost";
⋮----
export interface FeedPostRepository {
  findById(accountId: string, postId: string): Promise<FeedPostSnapshot | null>;
  listByWorkspaceId(accountId: string, workspaceId: string, limit: number): Promise<FeedPostSnapshot[]>;
  /** List posts for a workspace scoped to a specific date key (YYYY-MM-DD). */
  listByWorkspaceIdAndDate(accountId: string, workspaceId: string, dateKey: string, limit: number): Promise<FeedPostSnapshot[]>;
  listByAccountId(accountId: string, limit: number): Promise<FeedPostSnapshot[]>;
  save(post: FeedPostSnapshot): Promise<void>;
  incrementCounter(accountId: string, postId: string, field: "likeCount" | "replyCount" | "repostCount" | "viewCount" | "bookmarkCount" | "shareCount", delta: number): Promise<void>;
}
⋮----
findById(accountId: string, postId: string): Promise<FeedPostSnapshot | null>;
listByWorkspaceId(accountId: string, workspaceId: string, limit: number): Promise<FeedPostSnapshot[]>;
/** List posts for a workspace scoped to a specific date key (YYYY-MM-DD). */
listByWorkspaceIdAndDate(accountId: string, workspaceId: string, dateKey: string, limit: number): Promise<FeedPostSnapshot[]>;
listByAccountId(accountId: string, limit: number): Promise<FeedPostSnapshot[]>;
save(post: FeedPostSnapshot): Promise<void>;
incrementCounter(accountId: string, postId: string, field: "likeCount" | "replyCount" | "repostCount" | "viewCount" | "bookmarkCount" | "shareCount", delta: number): Promise<void>;
````

## File: src/modules/workspace/subdomains/feed/README.md
````markdown
# feed — Workspace Feed Subdomain

每日動態貼文子域。讓工作區成員每天以 IG 風格發布文字與照片動態，未來將擴展為今日任務完成與出勤記錄的整合入口。

## 領域概念

| 概念 | 說明 |
|---|---|
| `FeedPost` | 聚合根。代表一則動態（post / reply / repost）|
| `dateKey` | ISO 日期字串 `YYYY-MM-DD`，用於 Firestore 按日期查詢 |
| `photoUrls` | 附圖 URL 陣列（最多 9 張），指向 Storage 或外部圖片 |
| `FeedPostType` | `post`（一般貼文）· `reply`（回覆）· `repost`（轉貼）|

## 狀態

| 層 | 狀態 |
|---|---|
| Domain | ✅ FeedPost 聚合根（含 photoUrls、dateKey）|
| Application | ✅ CreateFeedPostUseCase、ListFeedPostsUseCase |
| Outbound adapter | ✅ FirestoreFeedRepository（含按日期查詢）|
| Inbound adapter | ✅ feed-actions.ts server actions |
| UI | ✅ WorkspaceDailySection — 每日動態 IG 風格貼文牆 |

## 資料結構（Firestore）

Collection: `feed_posts`

```
{
  id: string (UUID),
  accountId: string,
  workspaceId: string,
  authorAccountId: string,
  type: "post" | "reply" | "repost",
  content: string,
  dateKey: string,       // YYYY-MM-DD — 用於日期過濾索引
  photoUrls: string[],   // Storage URLs，0–9 張
  replyToPostId: string | null,
  repostOfPostId: string | null,
  likeCount: number,
  replyCount: number,
  repostCount: number,
  viewCount: number,
  bookmarkCount: number,
  shareCount: number,
  createdAtISO: string,
  updatedAtISO: string,
}
```

建議 Firestore 複合索引：`(accountId, workspaceId, dateKey)` 以優化每日動態查詢。

## 未來擴展

- 今日任務完成統計（接入 workspace/task 子域）
- 出勤記錄 check-in（接入 workspace/membership 子域）
- 照片實際上傳（整合 platform FileAPI，替換 URL 輸入）
- 點讚 / 回覆互動

## 邊界規則

- `domain/` 不依賴任何外部框架或 Firebase SDK。
- 跨模組消費者只能透過 `workspace/index.ts` 或 server actions 存取。
- 照片上傳涉及所有權與 tenant 隔離時，必須走 platform FileAPI，而非直接呼叫 Storage SDK。
````

## File: src/modules/workspace/subdomains/invitation/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/invitation/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/invitation/adapters/outbound/firestore/FirestoreInvitationRepository.ts
````typescript
import type { InvitationRepository } from "../../../domain/repositories/InvitationRepository";
import type { WorkspaceInvitationSnapshot } from "../../../domain/entities/WorkspaceInvitation";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreInvitationRepository implements InvitationRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(invitationId: string): Promise<WorkspaceInvitationSnapshot | null>
⋮----
async findByToken(token: string): Promise<WorkspaceInvitationSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<WorkspaceInvitationSnapshot[]>
⋮----
async save(invitation: WorkspaceInvitationSnapshot): Promise<void>
⋮----
async delete(invitationId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/invitation/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/invitation/application/dto/InvitationDTO.ts
````typescript
import { z } from "zod";
⋮----
export type CreateInvitationDTO = z.infer<typeof CreateInvitationSchema>;
````

## File: src/modules/workspace/subdomains/invitation/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/invitation/application/use-cases/InvitationUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { InvitationRepository } from "../../domain/repositories/InvitationRepository";
import { WorkspaceInvitation } from "../../domain/entities/WorkspaceInvitation";
import type { CreateInvitationInput } from "../../domain/entities/WorkspaceInvitation";
⋮----
export class CreateInvitationUseCase {
⋮----
constructor(private readonly invitationRepo: InvitationRepository)
⋮----
async execute(input: CreateInvitationInput): Promise<CommandResult>
⋮----
export class AcceptInvitationUseCase {
⋮----
async execute(token: string): Promise<CommandResult>
⋮----
export class CancelInvitationUseCase {
⋮----
async execute(invitationId: string): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/invitation/domain/entities/WorkspaceInvitation.ts
````typescript
import { v4 as uuid } from "uuid";
import type { InvitationDomainEventType } from "../events/InvitationDomainEvent";
⋮----
export type InvitationStatus = "pending" | "accepted" | "rejected" | "expired" | "cancelled";
⋮----
export interface WorkspaceInvitationSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly invitedEmail: string;
  readonly invitedByActorId: string;
  readonly role: string;
  readonly status: InvitationStatus;
  readonly token: string;
  readonly expiresAtISO: string;
  readonly acceptedAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateInvitationInput {
  readonly workspaceId: string;
  readonly invitedEmail: string;
  readonly invitedByActorId: string;
  readonly role: string;
  readonly expiresAtISO: string;
}
⋮----
export class WorkspaceInvitation {
⋮----
private constructor(private _props: WorkspaceInvitationSnapshot)
⋮----
static create(id: string, input: CreateInvitationInput): WorkspaceInvitation
⋮----
static reconstitute(snapshot: WorkspaceInvitationSnapshot): WorkspaceInvitation
⋮----
accept(): void
⋮----
reject(): void
⋮----
cancel(): void
⋮----
get id(): string
get status(): InvitationStatus
get token(): string
⋮----
getSnapshot(): Readonly<WorkspaceInvitationSnapshot>
⋮----
pullDomainEvents(): InvitationDomainEventType[]
````

## File: src/modules/workspace/subdomains/invitation/domain/events/InvitationDomainEvent.ts
````typescript
export interface InvitationDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface InvitationCreatedEvent extends InvitationDomainEvent {
  readonly type: "workspace.invitation.created";
  readonly payload: { readonly invitationId: string; readonly workspaceId: string; readonly invitedEmail: string };
}
⋮----
export interface InvitationAcceptedEvent extends InvitationDomainEvent {
  readonly type: "workspace.invitation.accepted";
  readonly payload: { readonly invitationId: string; readonly workspaceId: string; readonly invitedEmail: string };
}
⋮----
export type InvitationDomainEventType = InvitationCreatedEvent | InvitationAcceptedEvent;
````

## File: src/modules/workspace/subdomains/invitation/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/invitation/domain/repositories/InvitationRepository.ts
````typescript
import type { WorkspaceInvitationSnapshot } from "../entities/WorkspaceInvitation";
⋮----
export interface InvitationRepository {
  findById(invitationId: string): Promise<WorkspaceInvitationSnapshot | null>;
  findByToken(token: string): Promise<WorkspaceInvitationSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceInvitationSnapshot[]>;
  save(invitation: WorkspaceInvitationSnapshot): Promise<void>;
  delete(invitationId: string): Promise<void>;
}
⋮----
findById(invitationId: string): Promise<WorkspaceInvitationSnapshot | null>;
findByToken(token: string): Promise<WorkspaceInvitationSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<WorkspaceInvitationSnapshot[]>;
save(invitation: WorkspaceInvitationSnapshot): Promise<void>;
delete(invitationId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/issue/adapters/inbound/http/IssueController.ts
````typescript
import type { IssueRepository } from "../../../domain/repositories/IssueRepository";
import { OpenIssueUseCase, TransitionIssueStatusUseCase } from "../../../application/use-cases/IssueUseCases";
⋮----
export class IssueController {
⋮----
constructor(issueRepo: IssueRepository)
````

## File: src/modules/workspace/subdomains/issue/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/issue/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/issue/adapters/outbound/firestore/FirestoreIssueRepository.ts
````typescript
import type { IssueRepository } from "../../../domain/repositories/IssueRepository";
import type { IssueSnapshot } from "../../../domain/entities/Issue";
import type { IssueStatus } from "../../../domain/value-objects/IssueStatus";
import type { IssueStage } from "../../../domain/value-objects/IssueStage";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(
    collection: string,
    filters: Array<{ field: string; op: string; value: unknown }>,
  ): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(
    collection: string,
    filters: Array<{ field: string; op: string; value: unknown }>,
  ): Promise<Record<string, unknown>[]>;
⋮----
export class FirestoreIssueRepository implements IssueRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(issueId: string): Promise<IssueSnapshot | null>
⋮----
async findByTaskId(taskId: string): Promise<IssueSnapshot[]>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<IssueSnapshot[]>
⋮----
async findByTaskIdAndStage(taskId: string, stage: IssueStage): Promise<IssueSnapshot[]>
⋮----
async countOpenByTaskId(taskId: string): Promise<number>
⋮----
async countOpenByTaskIdAndStage(taskId: string, stage: IssueStage): Promise<number>
⋮----
async save(issue: IssueSnapshot): Promise<void>
⋮----
async updateStatus(
    issueId: string,
    to: IssueStatus,
    nowISO: string,
): Promise<IssueSnapshot | null>
⋮----
async delete(issueId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/issue/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/issue/application/dto/IssueDTO.ts
````typescript
import { z } from "zod";
import { ISSUE_STATUSES } from "../../domain/value-objects/IssueStatus";
import { ISSUE_STAGES } from "../../domain/value-objects/IssueStage";
⋮----
export type OpenIssueDTO = z.infer<typeof OpenIssueInputSchema>;
export type TransitionIssueDTO = z.infer<typeof TransitionIssueInputSchema>;
````

## File: src/modules/workspace/subdomains/issue/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/issue/application/use-cases/IssueUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { Issue } from "../../domain/entities/Issue";
import type { OpenIssueInput } from "../../domain/entities/Issue";
import { canTransitionIssueStatus } from "../../domain/value-objects/IssueStatus";
import type { IssueStatus } from "../../domain/value-objects/IssueStatus";
⋮----
export class OpenIssueUseCase {
⋮----
constructor(private readonly issueRepo: IssueRepository)
⋮----
async execute(input: OpenIssueInput): Promise<CommandResult>
⋮----
export class TransitionIssueStatusUseCase {
⋮----
async execute(issueId: string, to: IssueStatus): Promise<CommandResult>
⋮----
export class ResolveIssueUseCase {
⋮----
async execute(issueId: string): Promise<CommandResult>
⋮----
export class CloseIssueUseCase {
````

## File: src/modules/workspace/subdomains/issue/domain/entities/Issue.ts
````typescript
import { v4 as uuid } from "uuid";
import type { IssueStatus } from "../value-objects/IssueStatus";
import { canTransitionIssueStatus } from "../value-objects/IssueStatus";
import type { IssueStage } from "../value-objects/IssueStage";
import type { IssueDomainEventType } from "../events/IssueDomainEvent";
⋮----
export interface IssueSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly title: string;
  readonly description: string;
  readonly status: IssueStatus;
  readonly createdBy: string;
  readonly assignedTo: string | null;
  readonly resolvedAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface OpenIssueInput {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly title: string;
  readonly description?: string;
  readonly createdBy: string;
  readonly assignedTo?: string;
}
⋮----
export class Issue {
⋮----
private constructor(private _props: IssueSnapshot)
⋮----
static open(id: string, input: OpenIssueInput): Issue
⋮----
static reconstitute(snapshot: IssueSnapshot): Issue
⋮----
transition(to: IssueStatus): void
⋮----
close(): void
⋮----
get id(): string
get taskId(): string
get status(): IssueStatus
⋮----
getSnapshot(): Readonly<IssueSnapshot>
⋮----
pullDomainEvents(): IssueDomainEventType[]
````

## File: src/modules/workspace/subdomains/issue/domain/events/IssueDomainEvent.ts
````typescript
import type { IssueStage } from "../value-objects/IssueStage";
import type { IssueStatus } from "../value-objects/IssueStatus";
⋮----
export interface IssueDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface IssueOpenedEvent extends IssueDomainEvent {
  readonly type: "workspace.issue.opened";
  readonly payload: {
    readonly issueId: string;
    readonly taskId: string;
    readonly stage: IssueStage;
    readonly createdBy: string;
  };
}
⋮----
export interface IssueStatusChangedEvent extends IssueDomainEvent {
  readonly type: "workspace.issue.status-changed";
  readonly payload: {
    readonly issueId: string;
    readonly taskId: string;
    readonly to: IssueStatus;
  };
}
⋮----
export interface IssueResolvedEvent extends IssueDomainEvent {
  readonly type: "workspace.issue.resolved";
  readonly payload: {
    readonly issueId: string;
    readonly taskId: string;
    readonly stage: IssueStage;
    readonly resolvedAtISO: string;
  };
}
⋮----
export interface IssueClosedEvent extends IssueDomainEvent {
  readonly type: "workspace.issue.closed";
  readonly payload: {
    readonly issueId: string;
    readonly taskId: string;
  };
}
⋮----
export type IssueDomainEventType =
  | IssueOpenedEvent
  | IssueStatusChangedEvent
  | IssueResolvedEvent
  | IssueClosedEvent;
````

## File: src/modules/workspace/subdomains/issue/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/issue/domain/repositories/IssueRepository.ts
````typescript
import type { IssueSnapshot } from "../entities/Issue";
import type { IssueStatus } from "../value-objects/IssueStatus";
import type { IssueStage } from "../value-objects/IssueStage";
⋮----
export interface IssueRepository {
  findById(issueId: string): Promise<IssueSnapshot | null>;
  findByTaskId(taskId: string): Promise<IssueSnapshot[]>;
  findByTaskIdAndStage(taskId: string, stage: IssueStage): Promise<IssueSnapshot[]>;
  findByWorkspaceId(workspaceId: string): Promise<IssueSnapshot[]>;
  countOpenByTaskId(taskId: string): Promise<number>;
  countOpenByTaskIdAndStage(taskId: string, stage: IssueStage): Promise<number>;
  save(issue: IssueSnapshot): Promise<void>;
  updateStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<IssueSnapshot | null>;
  delete(issueId: string): Promise<void>;
}
⋮----
findById(issueId: string): Promise<IssueSnapshot | null>;
findByTaskId(taskId: string): Promise<IssueSnapshot[]>;
findByTaskIdAndStage(taskId: string, stage: IssueStage): Promise<IssueSnapshot[]>;
findByWorkspaceId(workspaceId: string): Promise<IssueSnapshot[]>;
countOpenByTaskId(taskId: string): Promise<number>;
countOpenByTaskIdAndStage(taskId: string, stage: IssueStage): Promise<number>;
save(issue: IssueSnapshot): Promise<void>;
updateStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<IssueSnapshot | null>;
delete(issueId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/issue/domain/value-objects/IssueId.ts
````typescript
import { z } from "zod";
⋮----
export type IssueId = z.infer<typeof IssueIdSchema>;
⋮----
export function createIssueId(raw: string): IssueId
````

## File: src/modules/workspace/subdomains/issue/domain/value-objects/IssueStage.ts
````typescript
export type IssueStage = "task" | "qa" | "acceptance";
````

## File: src/modules/workspace/subdomains/lifecycle/adapters/inbound/http/WorkspaceController.ts
````typescript
import type { WorkspaceRepository } from "../../../domain/repositories/WorkspaceRepository";
import { CreateWorkspaceUseCase, ActivateWorkspaceUseCase, StopWorkspaceUseCase } from "../../../application/use-cases/WorkspaceLifecycleUseCases";
⋮----
export class WorkspaceController {
⋮----
constructor(workspaceRepo: WorkspaceRepository)
````

## File: src/modules/workspace/subdomains/lifecycle/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/lifecycle/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/lifecycle/adapters/outbound/firestore/FirestoreWorkspaceRepository.ts
````typescript
import type { WorkspaceRepository } from "../../../domain/repositories/WorkspaceRepository";
import type { WorkspaceSnapshot } from "../../../domain/entities/Workspace";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreWorkspaceRepository implements WorkspaceRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(workspaceId: string): Promise<WorkspaceSnapshot | null>
⋮----
async findByAccountId(accountId: string): Promise<WorkspaceSnapshot[]>
⋮----
async save(workspace: WorkspaceSnapshot): Promise<void>
⋮----
async delete(workspaceId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/lifecycle/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/lifecycle/application/dto/WorkspaceDTO.ts
````typescript
import { z } from "zod";
⋮----
export type CreateWorkspaceDTO = z.infer<typeof CreateWorkspaceInputSchema>;
export type UpdateWorkspaceSettingsDTO = z.infer<typeof UpdateWorkspaceSettingsSchema>;
````

## File: src/modules/workspace/subdomains/lifecycle/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/lifecycle/domain/entities/Workspace.ts
````typescript
import { v4 as uuid } from "uuid";
import type { WorkspaceDomainEventType } from "../events/WorkspaceDomainEvent";
⋮----
export type WorkspaceLifecycleState = "preparatory" | "active" | "stopped";
⋮----
export function canTransitionLifecycle(from: WorkspaceLifecycleState, to: WorkspaceLifecycleState): boolean
⋮----
export type WorkspaceVisibility = "private" | "internal" | "public";
⋮----
export interface WorkspaceSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly accountType: "user" | "organization";
  readonly name: string;
  readonly lifecycleState: WorkspaceLifecycleState;
  readonly visibility: WorkspaceVisibility;
  readonly photoURL: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateWorkspaceInput {
  readonly accountId: string;
  readonly accountType: "user" | "organization";
  readonly name: string;
  readonly visibility?: WorkspaceVisibility;
  readonly photoURL?: string;
}
⋮----
export class Workspace {
⋮----
private constructor(private _props: WorkspaceSnapshot)
⋮----
static create(id: string, input: CreateWorkspaceInput): Workspace
⋮----
static reconstitute(snapshot: WorkspaceSnapshot): Workspace
⋮----
activate(): void
⋮----
stop(): void
⋮----
updateSettings(input:
⋮----
get id(): string
get lifecycleState(): WorkspaceLifecycleState
get name(): string
⋮----
getSnapshot(): Readonly<WorkspaceSnapshot>
⋮----
pullDomainEvents(): WorkspaceDomainEventType[]
````

## File: src/modules/workspace/subdomains/lifecycle/domain/events/WorkspaceDomainEvent.ts
````typescript
export interface WorkspaceDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface WorkspaceCreatedEvent extends WorkspaceDomainEvent {
  readonly type: "workspace.lifecycle.created";
  readonly payload: { readonly workspaceId: string; readonly accountId: string; readonly name: string };
}
⋮----
export interface WorkspaceActivatedEvent extends WorkspaceDomainEvent {
  readonly type: "workspace.lifecycle.activated";
  readonly payload: { readonly workspaceId: string };
}
⋮----
export interface WorkspaceStoppedEvent extends WorkspaceDomainEvent {
  readonly type: "workspace.lifecycle.stopped";
  readonly payload: { readonly workspaceId: string };
}
⋮----
export type WorkspaceDomainEventType =
  | WorkspaceCreatedEvent
  | WorkspaceActivatedEvent
  | WorkspaceStoppedEvent;
````

## File: src/modules/workspace/subdomains/lifecycle/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/lifecycle/domain/repositories/WorkspaceRepository.ts
````typescript
import type { WorkspaceSnapshot } from "../entities/Workspace";
⋮----
export interface WorkspaceRepository {
  findById(workspaceId: string): Promise<WorkspaceSnapshot | null>;
  findByAccountId(accountId: string): Promise<WorkspaceSnapshot[]>;
  save(workspace: WorkspaceSnapshot): Promise<void>;
  delete(workspaceId: string): Promise<void>;
}
⋮----
findById(workspaceId: string): Promise<WorkspaceSnapshot | null>;
findByAccountId(accountId: string): Promise<WorkspaceSnapshot[]>;
save(workspace: WorkspaceSnapshot): Promise<void>;
delete(workspaceId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/membership/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/membership/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/membership/adapters/outbound/firestore/FirestoreMemberRepository.ts
````typescript
import type { WorkspaceMemberRepository } from "../../../domain/repositories/WorkspaceMemberRepository";
import type { WorkspaceMemberSnapshot } from "../../../domain/entities/WorkspaceMember";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreMemberRepository implements WorkspaceMemberRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(memberId: string): Promise<WorkspaceMemberSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberSnapshot[]>
⋮----
async findByActorAndWorkspace(actorId: string, workspaceId: string): Promise<WorkspaceMemberSnapshot | null>
⋮----
async save(member: WorkspaceMemberSnapshot): Promise<void>
⋮----
async delete(memberId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/membership/application/dto/MembershipDTO.ts
````typescript
import { z } from "zod";
import { MEMBER_ROLES } from "../../domain/entities/WorkspaceMember";
⋮----
export type AddMemberDTO = z.infer<typeof AddMemberInputSchema>;
export type ChangeMemberRoleDTO = z.infer<typeof ChangeMemberRoleSchema>;
````

## File: src/modules/workspace/subdomains/membership/domain/entities/WorkspaceMember.ts
````typescript
import { v4 as uuid } from "uuid";
import type { MembershipDomainEventType } from "../events/MembershipDomainEvent";
⋮----
export type MemberRole = "owner" | "admin" | "member" | "guest";
⋮----
export type MembershipStatus = "active" | "suspended" | "removed";
⋮----
export interface WorkspaceMemberSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly role: MemberRole;
  readonly status: MembershipStatus;
  readonly displayName: string;
  readonly email: string | null;
  readonly joinedAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface AddMemberInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly role: MemberRole;
  readonly displayName: string;
  readonly email?: string;
}
⋮----
export class WorkspaceMember {
⋮----
private constructor(private _props: WorkspaceMemberSnapshot)
⋮----
static add(id: string, input: AddMemberInput): WorkspaceMember
⋮----
static reconstitute(snapshot: WorkspaceMemberSnapshot): WorkspaceMember
⋮----
changeRole(role: MemberRole): void
⋮----
remove(): void
⋮----
get id(): string
get workspaceId(): string
get role(): MemberRole
⋮----
getSnapshot(): Readonly<WorkspaceMemberSnapshot>
⋮----
pullDomainEvents(): MembershipDomainEventType[]
````

## File: src/modules/workspace/subdomains/membership/domain/events/MembershipDomainEvent.ts
````typescript
import type { MemberRole } from "../entities/WorkspaceMember";
⋮----
export interface MembershipDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface MemberAddedEvent extends MembershipDomainEvent {
  readonly type: "workspace.membership.member-added";
  readonly payload: { readonly memberId: string; readonly workspaceId: string; readonly actorId: string; readonly role: MemberRole };
}
⋮----
export interface MemberRemovedEvent extends MembershipDomainEvent {
  readonly type: "workspace.membership.member-removed";
  readonly payload: { readonly memberId: string; readonly workspaceId: string };
}
⋮----
export type MembershipDomainEventType = MemberAddedEvent | MemberRemovedEvent;
````

## File: src/modules/workspace/subdomains/membership/domain/repositories/WorkspaceMemberRepository.ts
````typescript
import type { WorkspaceMemberSnapshot } from "../entities/WorkspaceMember";
⋮----
export interface WorkspaceMemberRepository {
  findById(memberId: string): Promise<WorkspaceMemberSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberSnapshot[]>;
  findByActorAndWorkspace(actorId: string, workspaceId: string): Promise<WorkspaceMemberSnapshot | null>;
  save(member: WorkspaceMemberSnapshot): Promise<void>;
  delete(memberId: string): Promise<void>;
}
⋮----
findById(memberId: string): Promise<WorkspaceMemberSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberSnapshot[]>;
findByActorAndWorkspace(actorId: string, workspaceId: string): Promise<WorkspaceMemberSnapshot | null>;
save(member: WorkspaceMemberSnapshot): Promise<void>;
delete(memberId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/orchestration/adapters/inbound/http/OrchestrationController.ts
````typescript
import type { TaskMaterializationJobRepository } from "../../../domain/repositories/TaskMaterializationJobRepository";
import { CreateMaterializationJobUseCase } from "../../../application/use-cases/OrchestrationUseCases";
⋮----
export class OrchestrationController {
⋮----
constructor(jobRepo: TaskMaterializationJobRepository)
````

## File: src/modules/workspace/subdomains/orchestration/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/orchestration/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/orchestration/adapters/outbound/firestore/FirestoreJobRepository.ts
````typescript
import type { TaskMaterializationJobRepository } from "../../../domain/repositories/TaskMaterializationJobRepository";
import type { TaskMaterializationJobSnapshot, CompleteJobInput } from "../../../domain/entities/TaskMaterializationJob";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreJobRepository implements TaskMaterializationJobRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(jobId: string): Promise<TaskMaterializationJobSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<TaskMaterializationJobSnapshot[]>
⋮----
async save(job: TaskMaterializationJobSnapshot): Promise<void>
⋮----
async markRunning(jobId: string): Promise<TaskMaterializationJobSnapshot | null>
⋮----
async markCompleted(jobId: string, input: CompleteJobInput): Promise<TaskMaterializationJobSnapshot | null>
⋮----
async markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskMaterializationJobSnapshot | null>
````

## File: src/modules/workspace/subdomains/orchestration/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/orchestration/application/dto/OrchestrationDTO.ts
````typescript
import { z } from "zod";
⋮----
export type CreateJobDTO = z.infer<typeof CreateJobInputSchema>;
````

## File: src/modules/workspace/subdomains/orchestration/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/orchestration/application/machines/settlement-lifecycle.machine.ts
````typescript
import { setup } from "xstate";
⋮----
export interface SettlementLifecycleContext {
  readonly invoiceId: string;
  readonly workspaceId: string;
}
⋮----
export type SettlementLifecycleEvent =
  | { type: "ADVANCE" }
  | { type: "ROLLBACK" };
⋮----
export type SettlementLifecycleMachine = typeof settlementLifecycleMachine;
````

## File: src/modules/workspace/subdomains/orchestration/application/machines/task-lifecycle.machine.ts
````typescript
import { setup, assign } from "xstate";
⋮----
/**
 * Task Lifecycle State Machine (XState v5)
 *
 * Purpose: UI-layer finite-state workflow for the full task lifecycle:
 *   task-formation → task → quality(QA) → approval(acceptance) → settlement
 *
 * KEY DESIGN DECISIONS:
 * - `qa_blocked` / `acceptance_blocked` exist only in this machine context.
 *   Firestore task.status stays `qa` / `acceptance` while an issue is open.
 *   Open issue count is the blocking signal, NOT a separate Firestore field.
 * - The machine is a UI/Server Action orchestration aid. Domain invariants
 *   are still enforced inside use cases and aggregate methods.
 * - Events are named after actor intent (ADVANCE, OPEN_ISSUE, ISSUE_RESOLVED),
 *   not domain events directly.
 */
⋮----
// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
⋮----
export interface TaskLifecycleContext {
  readonly taskId: string;
  readonly workspaceId: string;
  readonly openIssueCount: number;
  readonly blockedAtStage: "qa" | "acceptance" | null;
  readonly invoiceId: string | null;
  readonly errorMessage: string | null;
}
⋮----
// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
⋮----
export type TaskLifecycleEvent =
  | { type: "ADVANCE" }
  | { type: "OPEN_ISSUE"; stage: "qa" | "acceptance" }
  | { type: "ISSUE_RESOLVED"; stage: "qa" | "acceptance" }
  | { type: "ARCHIVE" }
  | { type: "SET_ERROR"; message: string }
  | { type: "CLEAR_ERROR" }
  | { type: "INVOICE_CREATED"; invoiceId: string };
⋮----
// ---------------------------------------------------------------------------
// Machine
// ---------------------------------------------------------------------------
⋮----
// -----------------------------------------------------------------------
// Core linear flow
// -----------------------------------------------------------------------
⋮----
/** qa_blocked: issue open at QA stage — Firestore status stays `qa` */
⋮----
/** acceptance_blocked: issue open at acceptance stage — Firestore status stays `acceptance` */
⋮----
/** settled: invoice draft created — flow is complete */
⋮----
export type TaskLifecycleMachine = typeof taskLifecycleMachine;
````

## File: src/modules/workspace/subdomains/orchestration/application/sagas/TaskLifecycleSaga.ts
````typescript
import type { IssueResolvedEvent, IssueOpenedEvent, TaskStatusChangedEvent } from "../../../../shared/events";
import type { ResumeTaskFlowUseCase } from "../use-cases/ResumeTaskFlowUseCase";
import type { CreateInvoiceFromAcceptedTasksUseCase } from "../../../settlement/application/use-cases/CreateInvoiceFromAcceptedTasksUseCase";
⋮----
export type SagaTriggerEvent =
  | TaskStatusChangedEvent
  | IssueOpenedEvent
  | IssueResolvedEvent;
⋮----
/**
 * TaskLifecycleSaga
 *
 * Reacts to domain events emitted across the task lifecycle and drives
 * cross-subdomain side effects:
 *
 * - workspace.task.status-changed → "accepted"
 *     → CreateInvoiceFromAcceptedTasksUseCase
 *
 * - workspace.issue.resolved (stage: "qa" | "acceptance")
 *     → ResumeTaskFlowUseCase (re-enters task at the blocked stage)
 *
 * The saga is an application-layer service; it never mutates domain state
 * directly but delegates to use cases that enforce domain invariants.
 *
 * Caller responsibility: wire this saga into an event bus or use-case
 * completion hook at the infrastructure/interfaces layer.
 */
export class TaskLifecycleSaga {
⋮----
constructor(
⋮----
async handle(event: SagaTriggerEvent): Promise<void>
⋮----
// Structured error log (Rule 10, 15).
// saga_failures Firestore persistence is pending ADR on saga wiring strategy.
⋮----
private async onTaskStatusChanged(event: TaskStatusChangedEvent): Promise<void>
⋮----
private async onIssueResolved(event: IssueResolvedEvent): Promise<void>
````

## File: src/modules/workspace/subdomains/orchestration/application/use-cases/OrchestrationUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { TaskMaterializationJobRepository } from "../../domain/repositories/TaskMaterializationJobRepository";
import { TaskMaterializationJob } from "../../domain/entities/TaskMaterializationJob";
import type { CreateJobInput } from "../../domain/entities/TaskMaterializationJob";
⋮----
export class CreateMaterializationJobUseCase {
⋮----
constructor(private readonly jobRepo: TaskMaterializationJobRepository)
⋮----
async execute(input: CreateJobInput): Promise<CommandResult>
⋮----
export class StartMaterializationJobUseCase {
⋮----
async execute(jobId: string): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/orchestration/application/use-cases/ResumeTaskFlowUseCase.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { TaskRepository } from "../../../task/domain/repositories/TaskRepository";
import { canTransitionTaskStatus } from "../../../task/domain/value-objects/TaskStatus";
import type { TaskStatus } from "../../../task/domain/value-objects/TaskStatus";
import type { IssueRepository } from "../../../issue/domain/repositories/IssueRepository";
import type { IssueStage } from "../../../issue/domain/value-objects/IssueStage";
⋮----
export interface ResumeTaskFlowInput {
  readonly taskId: string;
  readonly stage: IssueStage;
}
⋮----
/**
 * ResumeTaskFlowUseCase
 *
 * After an issue is resolved, this use case checks that no open issues remain
 * for the given stage, then re-enters the task into the stage that was blocked.
 *
 * Guard: if open issues still exist for the stage, resume is rejected.
 */
export class ResumeTaskFlowUseCase {
⋮----
constructor(
⋮----
async execute(input: ResumeTaskFlowInput): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/orchestration/domain/entities/TaskMaterializationJob.ts
````typescript
import { v4 as uuid } from "uuid";
import type { JobDomainEventType } from "../events/JobDomainEvent";
⋮----
export type JobStatus = "queued" | "running" | "partially_succeeded" | "succeeded" | "failed" | "cancelled";
⋮----
export interface TaskMaterializationJobSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
  readonly totalItems: number;
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
  readonly status: JobStatus;
  readonly startedAtISO: string | null;
  readonly completedAtISO: string | null;
  readonly errorCode: string | null;
  readonly errorMessage: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateJobInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
}
⋮----
export interface CompleteJobInput {
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
}
⋮----
export class TaskMaterializationJob {
⋮----
private constructor(private _props: TaskMaterializationJobSnapshot)
⋮----
static create(id: string, input: CreateJobInput): TaskMaterializationJob
⋮----
static reconstitute(snapshot: TaskMaterializationJobSnapshot): TaskMaterializationJob
⋮----
markRunning(): void
⋮----
markCompleted(input: CompleteJobInput): void
⋮----
markFailed(errorCode: string, errorMessage: string): void
⋮----
get id(): string
get status(): JobStatus
⋮----
getSnapshot(): Readonly<TaskMaterializationJobSnapshot>
⋮----
pullDomainEvents(): JobDomainEventType[]
````

## File: src/modules/workspace/subdomains/orchestration/domain/events/JobDomainEvent.ts
````typescript
export interface JobDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface JobCreatedEvent extends JobDomainEvent {
  readonly type: "workspace.orchestration.job-created";
  readonly payload: { readonly jobId: string; readonly workspaceId: string; readonly correlationId: string };
}
⋮----
export interface JobCompletedEvent extends JobDomainEvent {
  readonly type: "workspace.orchestration.job-completed";
  readonly payload: { readonly jobId: string; readonly workspaceId: string };
}
⋮----
export type JobDomainEventType = JobCreatedEvent | JobCompletedEvent;
````

## File: src/modules/workspace/subdomains/orchestration/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/orchestration/domain/repositories/TaskMaterializationJobRepository.ts
````typescript
import type { TaskMaterializationJobSnapshot, CompleteJobInput } from "../entities/TaskMaterializationJob";
⋮----
export interface TaskMaterializationJobRepository {
  findById(jobId: string): Promise<TaskMaterializationJobSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<TaskMaterializationJobSnapshot[]>;
  save(job: TaskMaterializationJobSnapshot): Promise<void>;
  markRunning(jobId: string): Promise<TaskMaterializationJobSnapshot | null>;
  markCompleted(jobId: string, input: CompleteJobInput): Promise<TaskMaterializationJobSnapshot | null>;
  markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskMaterializationJobSnapshot | null>;
}
⋮----
findById(jobId: string): Promise<TaskMaterializationJobSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<TaskMaterializationJobSnapshot[]>;
save(job: TaskMaterializationJobSnapshot): Promise<void>;
markRunning(jobId: string): Promise<TaskMaterializationJobSnapshot | null>;
markCompleted(jobId: string, input: CompleteJobInput): Promise<TaskMaterializationJobSnapshot | null>;
markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskMaterializationJobSnapshot | null>;
````

## File: src/modules/workspace/subdomains/quality/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/quality/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/quality/adapters/outbound/firestore/FirestoreQualityReviewRepository.ts
````typescript
import type { QualityReviewRepository } from "../../../domain/repositories/QualityReviewRepository";
import type { QualityReviewSnapshot } from "../../../domain/entities/QualityReview";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreQualityReviewRepository implements QualityReviewRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(reviewId: string): Promise<QualityReviewSnapshot | null>
⋮----
async findByTaskId(taskId: string): Promise<QualityReviewSnapshot[]>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<QualityReviewSnapshot[]>
⋮----
async save(review: QualityReviewSnapshot): Promise<void>
⋮----
async delete(reviewId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/quality/adapters/outbound/index.ts
````typescript
// Quality subdomain delegates persistence to task subdomain
````

## File: src/modules/workspace/subdomains/quality/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/quality/application/use-cases/QualityUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { QualityReviewRepository } from "../../domain/repositories/QualityReviewRepository";
import type { TaskRepository } from "../../../task/domain/repositories/TaskRepository";
import type { IssueRepository } from "../../../issue/domain/repositories/IssueRepository";
import { QualityReview } from "../../domain/entities/QualityReview";
import type { StartQualityReviewInput } from "../../domain/entities/QualityReview";
import { canTransitionTaskStatus } from "../../../task/domain/value-objects/TaskStatus";
⋮----
export class StartQualityReviewUseCase {
⋮----
constructor(
⋮----
async execute(input: StartQualityReviewInput): Promise<CommandResult>
⋮----
export class PassQualityReviewUseCase {
⋮----
async execute(reviewId: string, notes?: string): Promise<CommandResult>
⋮----
export class FailQualityReviewUseCase {
⋮----
export class ListQualityReviewsUseCase {
⋮----
constructor(private readonly reviewRepo: QualityReviewRepository)
⋮----
async execute(workspaceId: string): Promise<import("../../domain/entities/QualityReview").QualityReviewSnapshot[]>
````

## File: src/modules/workspace/subdomains/quality/domain/entities/QualityReview.ts
````typescript
import { v4 as uuid } from "uuid";
import type { QualityReviewDomainEventType } from "../events/QualityDomainEvent";
⋮----
export type QualityReviewStatus = "in_review" | "passed" | "failed";
⋮----
export interface QualityReviewSnapshot {
  readonly id: string;
  readonly taskId: string;
  readonly workspaceId: string;
  readonly reviewerId: string;
  readonly status: QualityReviewStatus;
  readonly notes: string;
  readonly startedAtISO: string;
  readonly completedAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface StartQualityReviewInput {
  readonly taskId: string;
  readonly workspaceId: string;
  readonly reviewerId: string;
  readonly notes?: string;
}
⋮----
export class QualityReview {
⋮----
private constructor(private _props: QualityReviewSnapshot)
⋮----
static start(id: string, input: StartQualityReviewInput): QualityReview
⋮----
static reconstitute(snapshot: QualityReviewSnapshot): QualityReview
⋮----
pass(notes?: string): void
⋮----
fail(notes?: string): void
⋮----
get id(): string
get taskId(): string
get workspaceId(): string
get status(): QualityReviewStatus
⋮----
getSnapshot(): Readonly<QualityReviewSnapshot>
⋮----
pullDomainEvents(): QualityReviewDomainEventType[]
````

## File: src/modules/workspace/subdomains/quality/domain/events/QualityDomainEvent.ts
````typescript
export interface QualityReviewStartedEvent {
  readonly type: "workspace.quality.review-started";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly reviewId: string;
    readonly taskId: string;
    readonly workspaceId: string;
    readonly reviewerId: string;
  };
}
⋮----
export interface QualityReviewPassedEvent {
  readonly type: "workspace.quality.review-passed";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly reviewId: string;
    readonly taskId: string;
    readonly workspaceId: string;
  };
}
⋮----
export interface QualityReviewFailedEvent {
  readonly type: "workspace.quality.review-failed";
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: {
    readonly reviewId: string;
    readonly taskId: string;
    readonly workspaceId: string;
  };
}
⋮----
export type QualityReviewDomainEventType =
  | QualityReviewStartedEvent
  | QualityReviewPassedEvent
  | QualityReviewFailedEvent;
````

## File: src/modules/workspace/subdomains/quality/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/quality/domain/repositories/QualityReviewRepository.ts
````typescript
import type { QualityReviewSnapshot } from "../entities/QualityReview";
⋮----
export interface QualityReviewRepository {
  findById(reviewId: string): Promise<QualityReviewSnapshot | null>;
  findByTaskId(taskId: string): Promise<QualityReviewSnapshot[]>;
  findByWorkspaceId(workspaceId: string): Promise<QualityReviewSnapshot[]>;
  save(review: QualityReviewSnapshot): Promise<void>;
  delete(reviewId: string): Promise<void>;
}
⋮----
findById(reviewId: string): Promise<QualityReviewSnapshot | null>;
findByTaskId(taskId: string): Promise<QualityReviewSnapshot[]>;
findByWorkspaceId(workspaceId: string): Promise<QualityReviewSnapshot[]>;
save(review: QualityReviewSnapshot): Promise<void>;
delete(reviewId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/resource/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/resource/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/resource/adapters/outbound/firestore/FirestoreQuotaRepository.ts
````typescript
import type { ResourceQuotaRepository } from "../../../domain/repositories/ResourceQuotaRepository";
import type { ResourceQuotaSnapshot, ResourceKind } from "../../../domain/entities/ResourceQuota";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreQuotaRepository implements ResourceQuotaRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(quotaId: string): Promise<ResourceQuotaSnapshot | null>
⋮----
async findByWorkspaceAndKind(workspaceId: string, resourceKind: ResourceKind): Promise<ResourceQuotaSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<ResourceQuotaSnapshot[]>
⋮----
async save(quota: ResourceQuotaSnapshot): Promise<void>
⋮----
async updateUsage(quotaId: string, current: number, nowISO: string): Promise<void>
````

## File: src/modules/workspace/subdomains/resource/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/resource/application/dto/ResourceDTO.ts
````typescript
import { z } from "zod";
import { RESOURCE_KINDS } from "../../domain/entities/ResourceQuota";
⋮----
export type ProvisionQuotaDTO = z.infer<typeof ProvisionQuotaSchema>;
export type ConsumeQuotaDTO = z.infer<typeof ConsumeQuotaSchema>;
````

## File: src/modules/workspace/subdomains/resource/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/resource/application/use-cases/ResourceUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { ResourceQuotaRepository } from "../../domain/repositories/ResourceQuotaRepository";
import { ResourceQuota } from "../../domain/entities/ResourceQuota";
import type { ProvisionResourceQuotaInput, ResourceKind } from "../../domain/entities/ResourceQuota";
⋮----
export class ProvisionResourceQuotaUseCase {
⋮----
constructor(private readonly quotaRepo: ResourceQuotaRepository)
⋮----
async execute(input: ProvisionResourceQuotaInput): Promise<CommandResult>
⋮----
export class ConsumeResourceQuotaUseCase {
⋮----
async execute(workspaceId: string, resourceKind: ResourceKind, amount: number): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/resource/domain/entities/ResourceQuota.ts
````typescript
import { v4 as uuid } from "uuid";
import type { ResourceQuotaDomainEventType } from "../events/ResourceQuotaDomainEvent";
⋮----
export type ResourceKind =
  | "members"
  | "storage_bytes"
  | "ai_requests_monthly"
  | "tasks"
  | "workspaces";
⋮----
export interface ResourceQuotaSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly resourceKind: ResourceKind;
  readonly limit: number;
  readonly current: number;
  readonly reservedAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface ProvisionResourceQuotaInput {
  readonly workspaceId: string;
  readonly resourceKind: ResourceKind;
  readonly limit: number;
}
⋮----
export class ResourceQuota {
⋮----
private constructor(private _props: ResourceQuotaSnapshot)
⋮----
static provision(id: string, input: ProvisionResourceQuotaInput): ResourceQuota
⋮----
static reconstitute(snapshot: ResourceQuotaSnapshot): ResourceQuota
⋮----
consume(amount: number): void
⋮----
release(amount: number): void
⋮----
isExceeded(): boolean
⋮----
get id(): string
get workspaceId(): string
get resourceKind(): ResourceKind
get limit(): number
get current(): number
⋮----
getSnapshot(): Readonly<ResourceQuotaSnapshot>
⋮----
pullDomainEvents(): ResourceQuotaDomainEventType[]
````

## File: src/modules/workspace/subdomains/resource/domain/events/ResourceQuotaDomainEvent.ts
````typescript
import type { ResourceKind } from "../entities/ResourceQuota";
⋮----
export interface ResourceQuotaDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface QuotaProvisionedEvent extends ResourceQuotaDomainEvent {
  readonly type: "workspace.resource.quota-provisioned";
  readonly payload: { readonly quotaId: string; readonly workspaceId: string; readonly resourceKind: ResourceKind; readonly limit: number };
}
⋮----
export interface QuotaExceededEvent extends ResourceQuotaDomainEvent {
  readonly type: "workspace.resource.quota-exceeded";
  readonly payload: { readonly quotaId: string; readonly workspaceId: string; readonly resourceKind: ResourceKind };
}
⋮----
export type ResourceQuotaDomainEventType = QuotaProvisionedEvent | QuotaExceededEvent;
````

## File: src/modules/workspace/subdomains/resource/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/schedule/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/schedule/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/schedule/adapters/outbound/firestore/FirestoreDemandRepository.ts
````typescript
import type { DemandRepository } from "../../../domain/repositories/DemandRepository";
import type { WorkDemandSnapshot } from "../../../domain/entities/WorkDemand";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreDemandRepository implements DemandRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(id: string): Promise<WorkDemandSnapshot | null>
⋮----
async listByWorkspace(workspaceId: string): Promise<WorkDemandSnapshot[]>
⋮----
async listByAccount(accountId: string): Promise<WorkDemandSnapshot[]>
⋮----
async save(demand: WorkDemandSnapshot): Promise<void>
⋮----
async update(demand: WorkDemandSnapshot): Promise<void>
````

## File: src/modules/workspace/subdomains/schedule/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/schedule/application/dto/ScheduleDTO.ts
````typescript
import { z } from "zod";
import { DEMAND_PRIORITIES } from "../../domain/entities/WorkDemand";
⋮----
export type CreateWorkDemandDTO = z.infer<typeof CreateWorkDemandSchema>;
````

## File: src/modules/workspace/subdomains/schedule/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/schedule/application/use-cases/ScheduleUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { DemandRepository } from "../../domain/repositories/DemandRepository";
import { WorkDemand } from "../../domain/entities/WorkDemand";
import type { CreateWorkDemandInput, WorkDemandSnapshot } from "../../domain/entities/WorkDemand";
⋮----
export class CreateWorkDemandUseCase {
⋮----
constructor(private readonly demandRepo: DemandRepository)
⋮----
async execute(input: CreateWorkDemandInput): Promise<CommandResult>
⋮----
export class AssignWorkDemandUseCase {
⋮----
async execute(demandId: string, assignedUserId: string): Promise<CommandResult>
⋮----
export class ListWorkspaceDemandsUseCase {
⋮----
async execute(workspaceId: string): Promise<WorkDemandSnapshot[]>
````

## File: src/modules/workspace/subdomains/schedule/domain/entities/WorkDemand.ts
````typescript
import { v4 as uuid } from "uuid";
import type { ScheduleDomainEventType } from "../events/ScheduleDomainEvent";
⋮----
export type DemandStatus = "draft" | "open" | "in_progress" | "completed";
export type DemandPriority = "low" | "medium" | "high";
⋮----
export interface WorkDemandSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly requesterId: string;
  readonly title: string;
  readonly description: string;
  readonly status: DemandStatus;
  readonly priority: DemandPriority;
  readonly scheduledAt: string;
  readonly assignedUserId: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateWorkDemandInput {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly requesterId: string;
  readonly title: string;
  readonly description: string;
  readonly priority: DemandPriority;
  readonly scheduledAt: string;
}
⋮----
export class WorkDemand {
⋮----
private constructor(private _props: WorkDemandSnapshot)
⋮----
static create(id: string, input: CreateWorkDemandInput): WorkDemand
⋮----
static reconstitute(snapshot: WorkDemandSnapshot): WorkDemand
⋮----
assign(userId: string): void
⋮----
// FSM guard: assignment is only valid from the 'draft' state (Rule 7)
⋮----
get id(): string
get workspaceId(): string
get status(): DemandStatus
⋮----
getSnapshot(): Readonly<WorkDemandSnapshot>
⋮----
pullDomainEvents(): ScheduleDomainEventType[]
````

## File: src/modules/workspace/subdomains/schedule/domain/events/ScheduleDomainEvent.ts
````typescript
export interface ScheduleDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface DemandCreatedEvent extends ScheduleDomainEvent {
  readonly type: "workspace.schedule.demand-created";
  readonly payload: { readonly demandId: string; readonly workspaceId: string };
}
⋮----
export type ScheduleDomainEventType = DemandCreatedEvent;
````

## File: src/modules/workspace/subdomains/schedule/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/schedule/domain/repositories/DemandRepository.ts
````typescript
import type { WorkDemandSnapshot } from "../entities/WorkDemand";
⋮----
export interface DemandRepository {
  findById(id: string): Promise<WorkDemandSnapshot | null>;
  listByWorkspace(workspaceId: string): Promise<WorkDemandSnapshot[]>;
  listByAccount(accountId: string): Promise<WorkDemandSnapshot[]>;
  save(demand: WorkDemandSnapshot): Promise<void>;
  update(demand: WorkDemandSnapshot): Promise<void>;
}
⋮----
findById(id: string): Promise<WorkDemandSnapshot | null>;
listByWorkspace(workspaceId: string): Promise<WorkDemandSnapshot[]>;
listByAccount(accountId: string): Promise<WorkDemandSnapshot[]>;
save(demand: WorkDemandSnapshot): Promise<void>;
update(demand: WorkDemandSnapshot): Promise<void>;
````

## File: src/modules/workspace/subdomains/settlement/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/settlement/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/settlement/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/settlement/application/dto/SettlementDTO.ts
````typescript
import { z } from "zod";
import { INVOICE_STATUSES } from "../../domain/value-objects/InvoiceStatus";
⋮----
export type CreateInvoiceDTO = z.infer<typeof CreateInvoiceSchema>;
export type TransitionInvoiceDTO = z.infer<typeof TransitionInvoiceSchema>;
````

## File: src/modules/workspace/subdomains/settlement/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/settlement/application/use-cases/SettlementUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { Invoice } from "../../domain/entities/Invoice";
import type { InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
⋮----
export class CreateInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepo: InvoiceRepository)
⋮----
async execute(workspaceId: string): Promise<CommandResult>
⋮----
export class TransitionInvoiceStatusUseCase {
⋮----
async execute(invoiceId: string, to: InvoiceStatus): Promise<CommandResult>
⋮----
// Aggregate enforces FSM guard — throws on invalid transition (Rule 6, 7, 18)
````

## File: src/modules/workspace/subdomains/settlement/domain/events/InvoiceDomainEvent.ts
````typescript
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
⋮----
export interface InvoiceDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface InvoiceCreatedEvent extends InvoiceDomainEvent {
  readonly type: "workspace.settlement.invoice-created";
  readonly payload: { readonly invoiceId: string; readonly workspaceId: string };
}
⋮----
export interface InvoiceStatusChangedEvent extends InvoiceDomainEvent {
  readonly type: "workspace.settlement.invoice-status-changed";
  readonly payload: { readonly invoiceId: string; readonly workspaceId: string; readonly to: InvoiceStatus };
}
⋮----
export type InvoiceDomainEventType = InvoiceCreatedEvent | InvoiceStatusChangedEvent;
````

## File: src/modules/workspace/subdomains/settlement/domain/value-objects/InvoiceStatus.ts
````typescript
export type InvoiceStatus = "draft" | "submitted" | "finance_review" | "approved" | "paid" | "closed";
⋮----
export function canTransitionInvoiceStatus(from: InvoiceStatus, to: InvoiceStatus): boolean
⋮----
export function isTerminalInvoiceStatus(status: InvoiceStatus): boolean
````

## File: src/modules/workspace/subdomains/share/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/share/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/share/adapters/outbound/firestore/FirestoreShareRepository.ts
````typescript
import type { WorkspaceShareRepository } from "../../../domain/repositories/WorkspaceShareRepository";
import type { WorkspaceShareSnapshot } from "../../../domain/entities/WorkspaceShare";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreShareRepository implements WorkspaceShareRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(shareId: string): Promise<WorkspaceShareSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<WorkspaceShareSnapshot[]>
⋮----
async save(share: WorkspaceShareSnapshot): Promise<void>
⋮----
async delete(shareId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/share/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/share/application/dto/ShareDTO.ts
````typescript
import { z } from "zod";
import { SHARE_SCOPES } from "../../domain/entities/WorkspaceShare";
⋮----
export type GrantShareDTO = z.infer<typeof GrantShareSchema>;
````

## File: src/modules/workspace/subdomains/share/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/share/application/use-cases/ShareUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { WorkspaceShareRepository } from "../../domain/repositories/WorkspaceShareRepository";
import { WorkspaceShare } from "../../domain/entities/WorkspaceShare";
import type { GrantShareInput } from "../../domain/entities/WorkspaceShare";
⋮----
export class GrantWorkspaceShareUseCase {
⋮----
constructor(private readonly shareRepo: WorkspaceShareRepository)
⋮----
async execute(input: GrantShareInput): Promise<CommandResult>
⋮----
export class RevokeWorkspaceShareUseCase {
⋮----
async execute(shareId: string): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/share/domain/entities/WorkspaceShare.ts
````typescript
import { v4 as uuid } from "uuid";
import type { ShareDomainEventType } from "../events/ShareDomainEvent";
⋮----
export type ShareScope = "read" | "write" | "admin";
⋮----
export interface WorkspaceShareSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly grantedToId: string;
  readonly grantedToType: "user" | "team";
  readonly scope: ShareScope;
  readonly grantedByActorId: string;
  readonly expiresAtISO: string | null;
  readonly createdAtISO: string;
}
⋮----
export interface GrantShareInput {
  readonly workspaceId: string;
  readonly grantedToId: string;
  readonly grantedToType: "user" | "team";
  readonly scope: ShareScope;
  readonly grantedByActorId: string;
  readonly expiresAtISO?: string;
}
⋮----
export class WorkspaceShare {
⋮----
private constructor(private readonly _props: WorkspaceShareSnapshot)
⋮----
static grant(id: string, input: GrantShareInput): WorkspaceShare
⋮----
static reconstitute(snapshot: WorkspaceShareSnapshot): WorkspaceShare
⋮----
isExpired(): boolean
⋮----
get id(): string
get workspaceId(): string
get scope(): ShareScope
⋮----
getSnapshot(): Readonly<WorkspaceShareSnapshot>
⋮----
pullDomainEvents(): ShareDomainEventType[]
````

## File: src/modules/workspace/subdomains/share/domain/events/ShareDomainEvent.ts
````typescript
import type { ShareScope } from "../entities/WorkspaceShare";
⋮----
export interface ShareDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface ShareGrantedEvent extends ShareDomainEvent {
  readonly type: "workspace.share.granted";
  readonly payload: { readonly shareId: string; readonly workspaceId: string; readonly scope: ShareScope };
}
⋮----
export interface ShareRevokedEvent extends ShareDomainEvent {
  readonly type: "workspace.share.revoked";
  readonly payload: { readonly shareId: string; readonly workspaceId: string };
}
⋮----
export type ShareDomainEventType = ShareGrantedEvent | ShareRevokedEvent;
````

## File: src/modules/workspace/subdomains/share/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/share/domain/repositories/WorkspaceShareRepository.ts
````typescript
import type { WorkspaceShareSnapshot } from "../entities/WorkspaceShare";
⋮----
export interface WorkspaceShareRepository {
  findById(shareId: string): Promise<WorkspaceShareSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceShareSnapshot[]>;
  save(share: WorkspaceShareSnapshot): Promise<void>;
  delete(shareId: string): Promise<void>;
}
⋮----
findById(shareId: string): Promise<WorkspaceShareSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<WorkspaceShareSnapshot[]>;
save(share: WorkspaceShareSnapshot): Promise<void>;
delete(shareId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/task-formation/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task-formation/adapters/inbound/server-actions/task-formation-actions.ts
````typescript
/**
 * task-formation-actions — Server Actions for AI task candidate extraction and confirmation.
 *
 * startExtractionAction: Creates a TaskFormationJob, runs extractor in Firebase-side workflow,
 *   persists candidates to Firestore, and returns the job snapshot (with candidates).
 *
 * confirmCandidatesAction: Takes selected candidate indices, creates Tasks in the
 *   workspace task subdomain, and records a candidates-confirmed domain event.
 */
⋮----
import { z } from "zod";
import { ExtractTaskCandidatesSchema, ConfirmCandidatesSchema } from "../../../application/dto/TaskFormationDTO";
import { createClientTaskFormationUseCases } from "../../../../../adapters/outbound/firebase-composition";
⋮----
// ── Actions ────────────────────────────────────────────────────────────────────
⋮----
/**
 * Starts AI extraction for the given workspace and source pages.
 * Returns the CommandResult plus the full candidates list from the persisted job.
 */
export async function startExtractionAction(rawInput: unknown)
⋮----
/**
 * Confirms selected candidates from a previously extracted job.
 * Creates Tasks in the workspace task subdomain for each confirmed candidate.
 */
export async function confirmCandidatesAction(rawInput: unknown)
⋮----
/**
 * Reads a previously extracted job snapshot (e.g. to restore reviewing state on page reload).
 */
export async function getTaskFormationJobSnapshotAction(rawInput: unknown)
````

## File: src/modules/workspace/subdomains/task-formation/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task-formation/adapters/outbound/firestore/FirestoreTaskFormationJobRepository.ts
````typescript
import type { TaskFormationJobRepository } from "../../../domain/repositories/TaskFormationJobRepository";
import type { TaskFormationJobSnapshot, CompleteTaskFormationJobInput } from "../../../domain/entities/TaskFormationJob";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreTaskFormationJobRepository implements TaskFormationJobRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(jobId: string): Promise<TaskFormationJobSnapshot | null>
⋮----
// Backward compat: old docs may lack `candidates` field.
⋮----
async findByWorkspaceId(workspaceId: string): Promise<TaskFormationJobSnapshot[]>
⋮----
async save(job: TaskFormationJobSnapshot): Promise<void>
⋮----
async markRunning(jobId: string): Promise<TaskFormationJobSnapshot | null>
⋮----
async markCompleted(jobId: string, input: CompleteTaskFormationJobInput): Promise<TaskFormationJobSnapshot | null>
⋮----
async markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskFormationJobSnapshot | null>
````

## File: src/modules/workspace/subdomains/task-formation/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task-formation/AGENTS.md
````markdown
# task-formation — Agent Guide

## Purpose

`task-formation` 子域負責「從 Notion 知識頁面 AI 提取任務候選，使用者確認後批次建立 Task」的完整流程。

---

## Route Here When

- 實作 AI 提取任務候選的流程（`ExtractTaskCandidatesUseCase`）
- 實作使用者審閱 / 確認候選任務的 UI（`TaskFormationPanel`）
- 修改 `TaskFormationJob` aggregate 行為或生命週期狀態轉換
- 撰寫 Genkit extraction flow（`adapters/outbound/genkit/`）
- 修改 `TaskFormationJobRepository` port 定義
- 建立 task-formation Server Actions

## Route Elsewhere When

| 需求 | 正確路徑 |
|---|---|
| 建立 Task 實體本身 | `src/modules/workspace/subdomains/task/` |
| 知識頁面內容讀取 | `src/modules/notion/index.ts` |
| AI model 選擇 / 安全護欄 | `src/modules/ai/index.ts`（透過 platform 路由）|
| 檔案上傳 / 權限檢查 | `src/modules/platform/index.ts` |
| 任務看板 / issue 追蹤 | `src/modules/workspace/subdomains/task/` 或 `issue/` |

---

## Boundary Rules

1. `domain/` 禁止匯入：React、Firebase SDK、Genkit、`uuid`（用 `@infra/uuid`）
2. `TaskFormationJob` 是唯一 Aggregate Root；狀態轉換只能透過 behavior method
3. AI extraction 結果（`candidates`）必須持久化進 Firestore Job document，不可只存在記憶體
4. 跨到 `task` 子域建立 Task 必須透過 `task` 子域的 use case 邊界，不可直接寫 Firestore
5. `adapters/inbound/` 只呼叫 `application/use-cases/`；不得直接呼叫 domain 實作或 repository
6. Genkit flow 放在 `adapters/outbound/genkit/`；use case 透過 port interface 呼叫，不直接 import flow

---

## ❌ / ✅ 設計範例

### ❌ 禁止這樣做

```typescript
// ❌ inbound adapter 直接呼叫 repository
const repo = new FirestoreTaskFormationJobRepository(db);
const job = await repo.findById(jobId);

// ❌ use case 直接 import Genkit
import { extractTaskCandidatesFlow } from '@genkit-ai/...';

// ❌ aggregate 不儲存 candidates，只存計數
class TaskFormationJob {
  markCompleted(input: { succeededItems: number }): void { /* 候選清單丟失 */ }
}

// ❌ candidates 只存 React state，不持久化
const [candidates, setCandidates] = useState<ExtractedTaskCandidate[]>([]);
```

### ✅ 應該這樣做

```typescript
// ✅ use case 透過 port 呼叫 AI（domain/ports/TaskCandidateExtractorPort.ts）
class ExtractTaskCandidatesUseCase {
  constructor(
    private readonly jobRepo: TaskFormationJobRepository,
    private readonly aiExtractor: TaskCandidateExtractorPort,
  ) {}
}

// ✅ aggregate 儲存候選清單並發出 domain event
class TaskFormationJob {
  setCandidates(candidates: ExtractedTaskCandidate[]): void {
    this._props = { ...this._props, candidates, status: 'succeeded' };
    this._domainEvents.push({
      type: 'workspace.task-formation.candidates-extracted',
      eventId: generateId(),
      occurredAt: new Date().toISOString(),
      payload: { jobId: this._props.id, candidateCount: candidates.length },
    });
  }
}

// ✅ 跨子域透過 use case 邊界建立 Task
class ConfirmCandidatesUseCase {
  constructor(
    private readonly jobRepo: TaskFormationJobRepository,
    private readonly createTask: CreateTaskUseCase,   // task 子域 use case
  ) {}
}
```

---

## 技術選型（Context7 驗證）

| 關注點 | 技術 | 版本 / 模式 |
|---|---|---|
| AI 提取 | Genkit `ai.defineFlow` | Zod `outputSchema` + `z.coerce.number()` for AI numeric strings |
| UI 狀態 | XState v5 `setup()` | `fromPromise<Output, Input>` 雙泛型；machine 放在 `application/machines/` |
| 入口層 | Next.js `useActionState` | `safeParse` + 早期 structured error 回傳 |
| 驗證 | Zod v4 | `z.object()` + `z.iso.datetime()` + `z.coerce.number()` |
| ID 生成 | `@infra/uuid` | 禁止在 domain 層直接 import `uuid` |

---

## 狀態機設計（UI 層）

```
idle ──START──→ extracting ──onDone──→ reviewing ──CONFIRM──→ confirming ──onDone──→ done
               ──onError──→ failed               ──onError──→ reviewing（保留選擇）
reviewing ──CANCEL──→ idle
failed ──RETRY──→ idle
```

XState v5 `setup()` 必填欄位：

```typescript
setup({
  types: {
    context: {} as TaskFormationContext,
    events: {} as TaskFormationEvent,
    input: {} as { workspaceId: string },  // ← input 型別聲明不可省略
  },
  actors: { /* fromPromise actors */ },
})
```

---

## Domain Events（discriminant 格式）

| Event type | 狀態 | 觸發時機 |
|---|---|---|
| `workspace.task-formation.job-created` | ✅ 已實作 | `CreateTaskFormationJobUseCase` 成功 |
| `workspace.task-formation.candidates-extracted` | ⚠️ 待補 | `setCandidates()` 呼叫後 |
| `workspace.task-formation.candidates-confirmed` | ⚠️ 待補 | `ConfirmCandidatesUseCase` 完成 |
| `workspace.task-formation.job-failed` | ⚠️ 待補 | `markFailed()` 呼叫後 |

Event discriminant 格式：`<module>.<subdomain>.<action>`（全 kebab-case）

---

## 現況差距快覽

| 項目 | 現況 | 目標 |
|---|---|---|
| Aggregate 存 candidates | ❌ 只有計數欄位 | ✅ `candidates: ExtractedTaskCandidate[]` + `setCandidates()` |
| `TaskCandidateExtractorPort` | ❌ 不存在 | ✅ `domain/ports/` 新建 |
| AI 提取流程 | ❌ 不存在 | ✅ Genkit flow via port |
| 確認流程 | ❌ 不存在 | ✅ `ConfirmCandidatesUseCase` |
| UI 狀態機 | ❌ 不存在 | ✅ XState v5 machine |
| Server Actions | ❌ inbound 空白 | ✅ `startExtraction` + `confirmCandidates` |

---

## 嚴禁事項

- ❌ 在 `domain/` 或 `application/` 直接 import `defineFlow`、`generate`、Firebase SDK
- ❌ candidates 只存在 React state，不寫回 Firestore Job doc
- ❌ 確認後直接呼叫 `task` 子域 repository（必須走 use case 邊界）
- ❌ `TaskFormationJob` 只存計數，不存候選清單本體
- ❌ `application/machines/` 內的 machine 直接 import Firebase SDK 或 Genkit
- ❌ 在 inbound server action 直接呼叫 Genkit `ai.generate()`
````

## File: src/modules/workspace/subdomains/task-formation/application/dto/TaskFormationDTO.ts
````typescript
import { z } from "zod";
⋮----
export type CreateTaskFormationJobDTO = z.infer<typeof CreateTaskFormationJobSchema>;
⋮----
export type ExtractTaskCandidatesDTO = z.infer<typeof ExtractTaskCandidatesSchema>;
⋮----
export type ConfirmCandidatesDTO = z.infer<typeof ConfirmCandidatesSchema>;
````

## File: src/modules/workspace/subdomains/task-formation/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task-formation/application/machines/task-formation.machine.ts
````typescript
import { setup, assign, fromPromise } from "xstate";
import type { ExtractedTaskCandidate } from "../../domain/value-objects/TaskCandidate";
⋮----
/**
 * Task Formation State Machine (XState v5)
 *
 * Models the UI-layer workflow for extracting and confirming task candidates:
 *
 *   idle ──START──→ extracting ──onDone──→ reviewing ──CONFIRM──→ confirming ──onDone──→ done
 *                  ──onError──→ failed                ──onError──→ reviewing（保留選擇）
 *   reviewing ──CANCEL──→ idle
 *   failed ──RETRY──→ idle
 *
 * The machine does NOT call repositories or Server Actions directly.
 * Callers must provide actor implementations via `provide()`.
 */
⋮----
// ── Context ────────────────────────────────────────────────────────────────────
⋮----
export interface TaskFormationContext {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly jobId: string | null;
  readonly candidates: ReadonlyArray<ExtractedTaskCandidate>;
  readonly selectedIndices: ReadonlyArray<number>;
  readonly errorMessage: string | null;
}
⋮----
// ── Events ─────────────────────────────────────────────────────────────────────
⋮----
export type TaskFormationMachineEvent =
  | { type: "START"; sourceType: "rule" | "ai"; sourcePageIds: string[] }
  | { type: "CONFIRM" }
  | { type: "CANCEL" }
  | { type: "RETRY" }
  | { type: "TOGGLE_CANDIDATE"; index: number }
  | { type: "SELECT_ALL" }
  | { type: "DESELECT_ALL" };
⋮----
// ── Machine ────────────────────────────────────────────────────────────────────
⋮----
// Replaced by `provide()` at the call site.
⋮----
// Replaced by `provide()` at the call site.
⋮----
export type TaskFormationMachine = typeof taskFormationMachine;
````

## File: src/modules/workspace/subdomains/task-formation/application/use-cases/TaskFormationUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { TaskFormationJobRepository } from "../../domain/repositories/TaskFormationJobRepository";
import { TaskFormationJob } from "../../domain/entities/TaskFormationJob";
import type { CreateTaskFormationJobInput, CompleteTaskFormationJobInput } from "../../domain/entities/TaskFormationJob";
import type { TaskCandidateExtractorPort } from "../../domain/ports/TaskCandidateExtractorPort";
import type { ExtractTaskCandidatesDTO, ConfirmCandidatesDTO } from "../dto/TaskFormationDTO";
import type { CreateTaskInput } from "../../../task/domain/entities/Task";
⋮----
export class CreateTaskFormationJobUseCase {
⋮----
constructor(private readonly jobRepo: TaskFormationJobRepository)
⋮----
async execute(input: CreateTaskFormationJobInput): Promise<CommandResult>
⋮----
export class CompleteTaskFormationJobUseCase {
⋮----
async execute(jobId: string, input: CompleteTaskFormationJobInput): Promise<CommandResult>
⋮----
/**
 * ExtractTaskCandidatesUseCase — creates a job, marks it running, calls the
 * AI extractor port, and persists extracted candidates back to the job.
 *
 * The port is injected (never imported directly) so the use case stays
 * infrastructure-agnostic.
 */
export class ExtractTaskCandidatesUseCase {
⋮----
constructor(
⋮----
async execute(input: ExtractTaskCandidatesDTO): Promise<CommandResult>
⋮----
/** Boundary callback — injected so the use case doesn't depend on task repository directly. */
export interface CreateTaskBoundary {
  createTask(input: CreateTaskInput): Promise<CommandResult>;
}
⋮----
createTask(input: CreateTaskInput): Promise<CommandResult>;
⋮----
/**
 * ConfirmCandidatesUseCase — user selects which extracted candidates to
 * promote into real Tasks. Creates Tasks via the injected boundary callback,
 * then records a `candidates-confirmed` domain event on the Job.
 */
export class ConfirmCandidatesUseCase {
⋮----
async execute(input: ConfirmCandidatesDTO): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/task-formation/domain/entities/TaskFormationJob.ts
````typescript
import { v4 as uuid } from "uuid";
import type { TaskFormationJobStatus } from "../value-objects/TaskFormationJobStatus";
import type { TaskFormationDomainEventType } from "../events/TaskFormationDomainEvent";
import type { ExtractedTaskCandidate } from "../value-objects/TaskCandidate";
⋮----
export interface TaskFormationJobSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
  readonly candidates: ReadonlyArray<ExtractedTaskCandidate>;
  readonly totalItems: number;
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
  readonly status: TaskFormationJobStatus;
  readonly startedAtISO: string | null;
  readonly completedAtISO: string | null;
  readonly errorCode: string | null;
  readonly errorMessage: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateTaskFormationJobInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
}
⋮----
export interface CompleteTaskFormationJobInput {
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
}
⋮----
export class TaskFormationJob {
⋮----
private constructor(private _props: TaskFormationJobSnapshot)
⋮----
static create(id: string, input: CreateTaskFormationJobInput): TaskFormationJob
⋮----
static reconstitute(snapshot: TaskFormationJobSnapshot): TaskFormationJob
⋮----
markRunning(): void
⋮----
markCompleted(input: CompleteTaskFormationJobInput): void
⋮----
markFailed(errorCode: string, errorMessage: string): void
⋮----
setCandidates(candidates: ExtractedTaskCandidate[]): void
⋮----
markCandidatesConfirmed(confirmedCount: number): void
⋮----
get id(): string
get status(): TaskFormationJobStatus
⋮----
getSnapshot(): Readonly<TaskFormationJobSnapshot>
⋮----
pullDomainEvents(): TaskFormationDomainEventType[]
````

## File: src/modules/workspace/subdomains/task-formation/domain/events/TaskFormationDomainEvent.ts
````typescript
export interface TaskFormationDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface TaskFormationJobCreatedEvent extends TaskFormationDomainEvent {
  readonly type: "workspace.task-formation.job-created";
  readonly payload: { readonly jobId: string; readonly workspaceId: string; readonly correlationId: string };
}
⋮----
export interface TaskCandidatesExtractedEvent extends TaskFormationDomainEvent {
  readonly type: "workspace.task-formation.candidates-extracted";
  readonly payload: { readonly jobId: string; readonly workspaceId: string; readonly candidateCount: number };
}
⋮----
export interface TaskCandidatesConfirmedEvent extends TaskFormationDomainEvent {
  readonly type: "workspace.task-formation.candidates-confirmed";
  readonly payload: { readonly jobId: string; readonly workspaceId: string; readonly confirmedCount: number };
}
⋮----
export interface TaskFormationJobFailedEvent extends TaskFormationDomainEvent {
  readonly type: "workspace.task-formation.job-failed";
  readonly payload: { readonly jobId: string; readonly workspaceId: string; readonly errorCode: string };
}
⋮----
export type TaskFormationDomainEventType =
  | TaskFormationJobCreatedEvent
  | TaskCandidatesExtractedEvent
  | TaskCandidatesConfirmedEvent
  | TaskFormationJobFailedEvent;
````

## File: src/modules/workspace/subdomains/task-formation/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task-formation/domain/repositories/TaskFormationJobRepository.ts
````typescript
import type { TaskFormationJobSnapshot, CompleteTaskFormationJobInput } from "../entities/TaskFormationJob";
⋮----
export interface TaskFormationJobRepository {
  findById(jobId: string): Promise<TaskFormationJobSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<TaskFormationJobSnapshot[]>;
  save(job: TaskFormationJobSnapshot): Promise<void>;
  markRunning(jobId: string): Promise<TaskFormationJobSnapshot | null>;
  markCompleted(jobId: string, input: CompleteTaskFormationJobInput): Promise<TaskFormationJobSnapshot | null>;
  markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskFormationJobSnapshot | null>;
}
⋮----
findById(jobId: string): Promise<TaskFormationJobSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<TaskFormationJobSnapshot[]>;
save(job: TaskFormationJobSnapshot): Promise<void>;
markRunning(jobId: string): Promise<TaskFormationJobSnapshot | null>;
markCompleted(jobId: string, input: CompleteTaskFormationJobInput): Promise<TaskFormationJobSnapshot | null>;
markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskFormationJobSnapshot | null>;
````

## File: src/modules/workspace/subdomains/task-formation/domain/value-objects/TaskCandidate.ts
````typescript
export type TaskCandidateSource = "rule" | "ai";
⋮----
export interface ExtractedTaskCandidate {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
  readonly source: TaskCandidateSource;
  readonly confidence: number;
  readonly sourceBlockId?: string;
  readonly sourceSnippet?: string;
}
````

## File: src/modules/workspace/subdomains/task-formation/domain/value-objects/TaskFormationJobStatus.ts
````typescript
export type TaskFormationJobStatus = "queued" | "running" | "partially_succeeded" | "succeeded" | "failed" | "cancelled";
````

## File: src/modules/workspace/subdomains/task-formation/README.md
````markdown
# task-formation 子域

> 狀態：骨架建立，實作進行中（2026-04-18）

## 職責

從 Notion 知識頁面（`KnowledgeArtifact`）中，透過 AI 提取任務候選（`ExtractedTaskCandidate[]`），讓使用者審閱確認後，批次建立正式 `Task` 實體。

**這個子域擁有的：**

- `TaskFormationJob` aggregate（任務形成工作的生命週期）
- AI 提取結果的暫存與狀態（`candidates` 欄位）
- 使用者確認後的批次 Task 建立觸發

**這個子域不擁有的：**

- `KnowledgeArtifact`（屬於 `notion` context）
- `Task` 實體建立（觸發 `task` 子域的 `CreateTaskUseCase`）
- AI provider / model policy（屬於 `ai` context，由 `platform` 路由）

---

## 完整設計流程

```
用戶在 Notion 頁面選取 → 觸發 Server Action
        ↓
CreateTaskFormationJobUseCase  → Firestore（status: queued）
        ↓
ExtractTaskCandidatesUseCase   → TaskCandidateExtractorPort（Genkit Flow）
        ↓ (async, 更新 Job status: queued → running → succeeded/failed)
AI 提取 ExtractedTaskCandidate[]  → setCandidates() 存入 Job.candidates
        ↓
UI（TaskFormationPanel）        → XState machine（reviewing state）
        ↓ 使用者勾選 / 編輯候選任務
ConfirmCandidatesUseCase        → 呼叫 task.CreateTaskUseCase × N
        ↓
CompleteTaskFormationJobUseCase → Firestore（status: succeeded）
```

---

## 生命週期狀態

```
queued → running → succeeded
                 → partially_succeeded
                 → failed
queued → cancelled
```

---

## 現況檔案樹

```
task-formation/
├── README.md                         ← 本文件
├── AGENTS.md                          ← 開發守則
├── domain/
│   ├── index.ts
│   ├── entities/
│   │   └── TaskFormationJob.ts       ← Aggregate Root（⚠️ 需補 candidates 欄位）
│   ├── value-objects/
│   │   ├── TaskFormationJobStatus.ts ← ✅ queued/running/succeeded/partially_succeeded/failed/cancelled
│   │   └── TaskCandidate.ts         ← ✅ ExtractedTaskCandidate 型別定義
│   ├── repositories/
│   │   └── TaskFormationJobRepository.ts  ← ✅ Port 定義
│   └── events/
│       └── TaskFormationDomainEvent.ts    ← ⚠️ 僅 job-created，需補後續事件
├── application/
│   ├── index.ts
│   ├── dto/
│   │   └── TaskFormationDTO.ts           ← ✅ CreateTaskFormationJobSchema（Zod）
│   └── use-cases/
│       └── TaskFormationUseCases.ts      ← ⚠️ 僅 Create + Complete，缺 Extract + Confirm
├── adapters/
│   ├── index.ts
│   ├── inbound/
│   │   └── index.ts                      ← ❌ 空白（export {}）
│   │   ├── server-actions/               ← 待建：startExtraction + confirmCandidates
│   │   └── react/                        ← 待建：TaskFormationPanel（XState）
│   └── outbound/
│       ├── firestore/
│       │   └── FirestoreTaskFormationJobRepository.ts  ← ✅
│       └── genkit/                       ← ❌ 待建：extract-candidates.flow.ts
```

---

## 關鍵缺口（P0）

| # | 缺口 | 位置 |
|---|---|---|
| 1 | `TaskFormationJob` aggregate 不存 candidates | `domain/entities/TaskFormationJob.ts` |
| 2 | 無 AI 提取 Port 定義 | `domain/ports/TaskCandidateExtractorPort.ts`（待建）|
| 3 | 無 `candidates-extracted` domain event | `domain/events/TaskFormationDomainEvent.ts` |
| 4 | 無 `ExtractTaskCandidatesUseCase` | `application/use-cases/TaskFormationUseCases.ts` |
| 5 | 無 Genkit extraction flow adapter | `adapters/outbound/genkit/extract-candidates.flow.ts` |
| 6 | 無 `ConfirmCandidatesUseCase` | `application/use-cases/TaskFormationUseCases.ts` |
| 7 | inbound adapter 完全空白 | `adapters/inbound/` |

---

## 關鍵設計決策

### AI 提取：Genkit `defineFlow` + Zod `outputSchema`

```typescript
// adapters/outbound/genkit/extract-candidates.flow.ts
export const extractTaskCandidatesFlow = ai.defineFlow(
  {
    name: 'task-formation.extractCandidates',
    inputSchema: z.object({
      pageContent: z.string(),
      workspaceContext: z.string(),
    }),
    outputSchema: z.object({
      candidates: z.array(TaskCandidateSchema),
    }),
  },
  async ({ pageContent }) => { /* ... */ }
);
```

- 使用 `z.coerce.number()` 處理 AI 輸出 `confidence` 為字串的情況
- `outputSchema` 與 `generate output.schema` 雙重保護
- AI 結果在進入 use case 前必須通過 Zod `.parse()` 驗證

### UI 狀態：XState v5 `setup()` + `fromPromise`

```typescript
// application/machines/task-formation.machine.ts
export const taskFormationMachine = setup({
  types: {
    context: {} as {
      jobId: string | null;
      candidates: ExtractedTaskCandidate[];
      selectedIds: Set<number>;
      errorMessage: string | null;
    },
    events: {} as
      | { type: 'START'; pageIds: string[] }
      | { type: 'CANDIDATE_TOGGLED'; idx: number }
      | { type: 'CONFIRM_SELECTION' }
      | { type: 'CANCEL' },
    input: {} as { workspaceId: string },
  },
  actors: {
    extractCandidates: fromPromise<ExtractResult, ExtractInput>(
      async ({ input }) => { /* Server Action */ }
    ),
    confirmCandidates: fromPromise<ConfirmResult, ConfirmInput>(
      async ({ input }) => { /* Server Action */ }
    ),
  },
}).createMachine({
  /* idle → extracting → reviewing → confirming → done */
});
```

狀態轉換：

```
idle ──START──→ extracting ──onDone──→ reviewing ──CONFIRM──→ confirming ──onDone──→ done
               ──onError──→ failed               ──onError──→ reviewing（保留選擇）
reviewing ──CANCEL──→ idle
```

### Inbound：Next.js Server Actions + `useActionState`

```typescript
// adapters/inbound/server-actions/task-formation-actions.ts
'use server';
export async function startExtractionAction(
  prevState: ExtractionActionState,
  formData: FormData,
): Promise<ExtractionActionState> {
  const validated = StartExtractionSchema.safeParse({ ... });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };
  // ...
}
```

---

## Domain Events（discriminant 格式）

| Event type | 觸發時機 |
|---|---|
| `workspace.task-formation.job-created` | ✅ `CreateTaskFormationJobUseCase` 成功 |
| `workspace.task-formation.candidates-extracted` | ⚠️ 待補：AI 提取完成，candidates 已存入 Job |
| `workspace.task-formation.candidates-confirmed` | ⚠️ 待補：使用者確認選擇，Task 建立觸發 |
| `workspace.task-formation.job-failed` | ⚠️ 待補：任何不可回復錯誤 |

---

## 跨模組依賴

| 依賴方向 | 目標模組 | 用途 | 邊界 |
|---|---|---|---|
| 消費 `notion` | `src/modules/notion/index.ts` | 取得 KnowledgeArtifact 頁面內容 | published language token |
| 消費 `ai`（透過 platform） | `src/modules/platform/index.ts` | Genkit generation flow routing | Service API boundary |
| 觸發 `task` | `src/modules/workspace/subdomains/task/application/` | ConfirmCandidates 後批次建立 Task | use case 邊界 |

---

## 下一步待實作

| 優先 | 工作 | 位置 |
|---|---|---|
| P0 | 補 `TaskFormationJob.candidates` 欄位 + `setCandidates()` 方法 | `domain/entities/TaskFormationJob.ts` |
| P0 | 補 `TaskCandidateExtractorPort` 介面 | `domain/ports/TaskCandidateExtractorPort.ts`（新建）|
| P0 | 補 `candidates-extracted` / `candidates-confirmed` / `job-failed` domain events | `domain/events/TaskFormationDomainEvent.ts` |
| P1 | 建 `ExtractTaskCandidatesUseCase` | `application/use-cases/TaskFormationUseCases.ts` |
| P1 | 建 Genkit `extract-candidates.flow.ts` adapter | `adapters/outbound/genkit/` |
| P2 | 建 `ConfirmCandidatesUseCase` | `application/use-cases/TaskFormationUseCases.ts` |
| P2 | 建 XState `task-formation.machine.ts` | `application/machines/` |
| P3 | 建 Server Actions（start + confirm） | `adapters/inbound/server-actions/` |
| P3 | 建 `TaskFormationPanel` UI（XState `useMachine`） | `adapters/inbound/react/` |
````

## File: src/modules/workspace/subdomains/task/adapters/index.ts
````typescript
// task — adapters aggregate
````

## File: src/modules/workspace/subdomains/task/adapters/outbound/firestore/FirestoreTaskRepository.ts
````typescript
import type { TaskRepository } from "../../../domain/repositories/TaskRepository";
import type { TaskSnapshot } from "../../../domain/entities/Task";
import type { TaskStatus } from "../../../domain/value-objects/TaskStatus";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(
    collection: string,
    filters: Array<{ field: string; op: string; value: unknown }>,
  ): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(
    collection: string,
    filters: Array<{ field: string; op: string; value: unknown }>,
  ): Promise<Record<string, unknown>[]>;
⋮----
export class FirestoreTaskRepository implements TaskRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(taskId: string): Promise<TaskSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<TaskSnapshot[]>
⋮----
async save(task: TaskSnapshot): Promise<void>
⋮----
async updateStatus(
    taskId: string,
    to: TaskStatus,
    nowISO: string,
): Promise<TaskSnapshot | null>
⋮----
async delete(taskId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/task/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task/application/use-cases/TaskUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { Task } from "../../domain/entities/Task";
import type { CreateTaskInput, UpdateTaskInput } from "../../domain/entities/Task";
import { canTransitionTaskStatus } from "../../domain/value-objects/TaskStatus";
import type { TaskStatus } from "../../domain/value-objects/TaskStatus";
⋮----
export class CreateTaskUseCase {
⋮----
constructor(private readonly taskRepo: TaskRepository)
⋮----
async execute(input: CreateTaskInput): Promise<CommandResult>
⋮----
export class UpdateTaskUseCase {
⋮----
async execute(taskId: string, input: UpdateTaskInput): Promise<CommandResult>
⋮----
export class TransitionTaskStatusUseCase {
⋮----
async execute(taskId: string, to: TaskStatus): Promise<CommandResult>
⋮----
export class DeleteTaskUseCase {
⋮----
async execute(taskId: string): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/task/domain/events/TaskDomainEvent.ts
````typescript
import type { TaskStatus } from "../value-objects/TaskStatus";
⋮----
export interface TaskDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface TaskCreatedEvent extends TaskDomainEvent {
  readonly type: "workspace.task.created";
  readonly payload: {
    readonly taskId: string;
    readonly workspaceId: string;
    readonly title: string;
  };
}
⋮----
export interface TaskStatusChangedEvent extends TaskDomainEvent {
  readonly type: "workspace.task.status-changed";
  readonly payload: {
    readonly taskId: string;
    readonly workspaceId: string;
    readonly from: TaskStatus;
    readonly to: TaskStatus;
  };
}
⋮----
export interface TaskArchivedEvent extends TaskDomainEvent {
  readonly type: "workspace.task.archived";
  readonly payload: {
    readonly taskId: string;
    readonly workspaceId: string;
    readonly archivedAtISO: string;
  };
}
⋮----
export type TaskDomainEventType =
  | TaskCreatedEvent
  | TaskStatusChangedEvent
  | TaskArchivedEvent;
````

## File: src/modules/workspace/subdomains/task/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task/domain/repositories/TaskRepository.ts
````typescript
import type { TaskSnapshot } from "../entities/Task";
import type { TaskStatus } from "../value-objects/TaskStatus";
⋮----
export interface TaskRepository {
  findById(taskId: string): Promise<TaskSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<TaskSnapshot[]>;
  save(task: TaskSnapshot): Promise<void>;
  updateStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<TaskSnapshot | null>;
  delete(taskId: string): Promise<void>;
}
⋮----
findById(taskId: string): Promise<TaskSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<TaskSnapshot[]>;
save(task: TaskSnapshot): Promise<void>;
updateStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<TaskSnapshot | null>;
delete(taskId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/task/domain/value-objects/TaskId.ts
````typescript
import { z } from "zod";
⋮----
export type TaskId = z.infer<typeof TaskIdSchema>;
⋮----
export function createTaskId(raw: string): TaskId
````

## File: src/modules/workspace/subdomains/task/domain/value-objects/TaskStatus.ts
````typescript
export type TaskStatus =
  | "draft"
  | "in_progress"
  | "qa"
  | "acceptance"
  | "accepted"
  | "archived"
  | "cancelled";
⋮----
/**
 * TASK_NEXT defines valid forward transitions for each status.
 *
 * "in_progress" has two valid next states:
 *   - "qa"          → normal path (first submission or after QA failure)
 *   - "acceptance"  → post-rejection rework (approval was rejected; developer skips re-QA)
 *
 * The first entry in each array is the "primary" next status returned by
 * nextTaskStatus() for UI hints; canTransitionTaskStatus() accepts any listed value.
 */
⋮----
export function canTransitionTaskStatus(from: TaskStatus, to: TaskStatus): boolean
⋮----
export function nextTaskStatus(current: TaskStatus): TaskStatus | null
⋮----
export function isTerminalTaskStatus(status: TaskStatus): boolean
````

## File: src/AGENTS.md
````markdown
# src — Agent Guide

## Immediate Index

- Parent: [AGENTS.md](../AGENTS.md)
- Pair: [README.md](README.md)
- Route layer: [app/AGENTS.md](app/AGENTS.md)
- Module layer: [modules/AGENTS.md](modules/AGENTS.md)

## Node Map

| Node | Role | Agent entry | Human overview |
|---|---|---|---|
| `src/app/` | Next.js App Router composition layer | [app/AGENTS.md](app/AGENTS.md) | [app/README.md](app/README.md) |
| `src/modules/` | bounded-context implementation layer | [modules/AGENTS.md](modules/AGENTS.md) | [modules/README.md](modules/README.md) |

## Drift Guard

- `src/AGENTS.md` 只負責 routing，不重複模組或路由細節。
- `src/README.md` 保留簡短概覽；深入規則交給子節點。
````

## File: src/app/AGENTS.md
````markdown
# src/app — Agent Guide

## Immediate Index

- Parent: [../AGENTS.md](../AGENTS.md)
- Pair: [README.md](README.md)
- Strategic authority: [../../docs/README.md](../../docs/README.md)

## Route Here When

- 新增或修改 page、layout、route group、parallel route。
- 調整 App Router composition、slot 組合或 route-level loading / error surface。

## Route Elsewhere When

- 業務規則、use case、domain entity → `src/modules/<context>/`
- 共享 UI primitive → `packages/`
- 背景 worker / parsing / embedding pipeline → `fn/`

## Drift Guard

- `AGENTS.md` 管路由與 routing。
- `README.md` 管 App Router 概覽。
````

## File: src/app/README.md
````markdown
# src/app

`src/app/` 是 Next.js App Router composition layer。這裡只做 route / layout / slot 組合。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md)
- Strategic authority: [../../docs/README.md](../../docs/README.md)

## Ownership

- Route files 專注在 composition 與 rendering。
- 業務邏輯仍由 `src/modules/<context>/index.ts` 提供。
````

## File: src/modules/ai/AGENTS.md
````markdown
# AI Module — Agent Guide

## Purpose

`src/modules/ai/` 是 AI 機制能力模組；提供 AI mechanism，使用者體驗仍由其他模組組合。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/chunk/`
- `subdomains/citation/`
- `subdomains/context/`
- `subdomains/embedding/`
- `subdomains/evaluation/`
- `subdomains/generation/`
- `subdomains/memory/`
- `subdomains/pipeline/`
- `subdomains/retrieval/`
- `subdomains/safety/`
- `subdomains/tool-calling/`

## Route Here When

- 需要在 `src/modules/ai/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- 使用者對話與 RAG UX → `src/modules/notebooklm/`
- 知識內容寫入 → `src/modules/notion/`
- 任務生成業務流程 → `src/modules/workspace/`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/ai/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
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
// safety (content safety policy)
⋮----
// pipeline
⋮----
// prompt registry
⋮----
// citation
⋮----
// evaluation
⋮----
// memory
⋮----
// tool-calling
````

## File: src/modules/ai/README.md
````markdown
# AI Module

`src/modules/ai/` 是 AI 機制能力模組；提供 AI mechanism，使用者體驗仍由其他模組組合。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Directory Index（actual directories）

- `subdomains/chunk/`
- `subdomains/citation/`
- `subdomains/context/`
- `subdomains/embedding/`
- `subdomains/evaluation/`
- `subdomains/generation/`
- `subdomains/memory/`
- `subdomains/pipeline/`
- `subdomains/retrieval/`
- `subdomains/safety/`
- `subdomains/tool-calling/`

## Pair Contract

- `README.md` 維護 `src/modules/ai/` 的最短概覽與實際目錄索引。
- `AGENTS.md` 維護 agent routing、nested index 與放置決策。
- 若未來新增 / 移除子域，先更新這兩份索引，再補充更細的 module-local 說明。

## Read Next

- [../AGENTS.md](../AGENTS.md)
- [../../../docs/README.md](../../../docs/README.md)
````

## File: src/modules/ai/subdomains/chunk/adapters/outbound/dto/chunk-job-payload.ts
````typescript
/**
 * chunk-job-payload.ts
 *
 * Outbound DTO: QStash message payload for dispatching chunking jobs
 * to fn workers. This is an outbound contract (dispatcher → worker),
 * NOT a provider API contract.
 *
 * Discussion 08 — cross-runtime contract:
 * - TypeScript side (this file): Zod schema defining the payload shape
 * - Python side (fn/src/application/dto/chunk_job.py): Pydantic mirror
 *
 * Both sides must stay semantically aligned. Changes here require
 * corresponding updates to the fn Pydantic model.
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
/** Max token count per chunk; fn uses default if omitted */
⋮----
/** ISO 8601 timestamp when the job was requested */
⋮----
export type ChunkJobPayload = z.infer<typeof ChunkJobPayloadSchema>;
````

## File: src/modules/ai/subdomains/embedding/adapters/outbound/dto/embedding-job-payload.ts
````typescript
/**
 * embedding-job-payload.ts
 *
 * Outbound DTO: QStash message payload for dispatching embedding generation
 * jobs to fn workers. This is an outbound contract (dispatcher → worker),
 * NOT a provider API contract.
 *
 * Discussion 08 — cross-runtime contract:
 * - TypeScript side (this file): Zod schema defining the payload shape
 * - Python side (fn/src/application/dto/embedding_job.py): Pydantic mirror
 *
 * Both sides must stay semantically aligned. Changes here require
 * corresponding updates to the fn Pydantic model.
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
/** Optional model hint; fn selects default if omitted */
⋮----
/** ISO 8601 timestamp when the job was requested */
⋮----
export type EmbeddingJobPayload = z.infer<typeof EmbeddingJobPayloadSchema>;
````

## File: src/modules/ai/subdomains/safety/adapters/inbound/index.ts
````typescript
// inbound adapters for safety subdomain
````

## File: src/modules/ai/subdomains/safety/adapters/outbound/index.ts
````typescript
// outbound adapters for safety subdomain
````

## File: src/modules/ai/subdomains/safety/application/index.ts
````typescript

````

## File: src/modules/ai/subdomains/safety/application/use-cases/SafetyUseCases.ts
````typescript
import type { ContentSafetyPort, ContentSafetyInput, SafetyCheckResult } from "../../domain/entities/SafetyCheckResult";
⋮----
export interface CheckContentSafetyResult {
  readonly ok: boolean;
  readonly result?: SafetyCheckResult;
  readonly error?: string;
}
⋮----
export class CheckContentSafetyUseCase {
⋮----
constructor(private readonly safetyPort: ContentSafetyPort)
⋮----
async execute(input: ContentSafetyInput): Promise<CheckContentSafetyResult>
⋮----
export class AssertContentSafeUseCase {
⋮----
/** Resolves normally when safe; throws when blocked or flagged. */
async execute(input: ContentSafetyInput): Promise<SafetyCheckResult>
````

## File: src/modules/ai/subdomains/safety/domain/entities/SafetyCheckResult.ts
````typescript
/**
 * SafetyCheckResult — domain value object for AI output safety evaluation.
 *
 * Owned by ai/safety subdomain.
 * ContentSafetyPort is the primary outbound port; all AI generation paths must
 * pass output through a safety check before returning to callers.
 */
⋮----
export type SafetyVerdict = "safe" | "blocked" | "flagged";
⋮----
export interface SafetyCategory {
  /** e.g. "hate_speech", "self_harm", "violence", "sexual" */
  readonly name: string;
  readonly score: number;
  readonly verdict: SafetyVerdict;
}
⋮----
/** e.g. "hate_speech", "self_harm", "violence", "sexual" */
⋮----
export interface SafetyCheckResult {
  readonly id: string;
  readonly inputHash: string;
  readonly overallVerdict: SafetyVerdict;
  readonly categories: readonly SafetyCategory[];
  readonly reason?: string;
  readonly checkedAtISO: string;
  readonly model?: string;
}
⋮----
export interface ContentSafetyInput {
  readonly content: string;
  readonly context?: string;
  readonly model?: string;
}
⋮----
/** Outbound port — implemented in infrastructure layer. */
export interface ContentSafetyPort {
  check(input: ContentSafetyInput): Promise<SafetyCheckResult>;
}
⋮----
check(input: ContentSafetyInput): Promise<SafetyCheckResult>;
````

## File: src/modules/ai/subdomains/safety/domain/index.ts
````typescript

````

## File: src/modules/analytics/AGENTS.md
````markdown
# Analytics Module — Agent Guide

## Purpose

`src/modules/analytics/` 是 分析能力模組；承接事件、指標、洞察與實驗相關實作。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/event-contracts/`
- `subdomains/event-ingestion/`
- `subdomains/event-projection/`
- `subdomains/experimentation/`
- `subdomains/insights/`
- `subdomains/metrics/`
- `subdomains/realtime-insights/`

## Route Here When

- 需要在 `src/modules/analytics/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- UI 路由與頁面組合 → `src/app/`
- 跨模組消費 → `src/modules/analytics/index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/analytics/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
````

## File: src/modules/analytics/README.md
````markdown
# Analytics Module

`src/modules/analytics/` 是 分析能力模組；承接事件、指標、洞察與實驗相關實作。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Directory Index（actual directories）

- `subdomains/event-contracts/`
- `subdomains/event-ingestion/`
- `subdomains/event-projection/`
- `subdomains/experimentation/`
- `subdomains/insights/`
- `subdomains/metrics/`
- `subdomains/realtime-insights/`

## Pair Contract

- `README.md` 維護 `src/modules/analytics/` 的最短概覽與實際目錄索引。
- `AGENTS.md` 維護 agent routing、nested index 與放置決策。
- 若未來新增 / 移除子域，先更新這兩份索引，再補充更細的 module-local 說明。

## Read Next

- [../AGENTS.md](../AGENTS.md)
- [../../../docs/README.md](../../../docs/README.md)
````

## File: src/modules/billing/AGENTS.md
````markdown
# Billing Module — Agent Guide

## Purpose

`src/modules/billing/` 是 計費能力模組；處理 entitlement、subscription、usage-metering。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/entitlement/`
- `subdomains/subscription/`
- `subdomains/usage-metering/`

## Route Here When

- 需要在 `src/modules/billing/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- 跨模組消費 entitlement / plan → `src/modules/billing/index.ts`
- 帳號 / 組織 / session → `src/modules/iam/`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/billing/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
````

## File: src/modules/billing/README.md
````markdown
# Billing Module

`src/modules/billing/` 是 計費能力模組；處理 entitlement、subscription、usage-metering。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Directory Index（actual directories）

- `subdomains/entitlement/`
- `subdomains/subscription/`
- `subdomains/usage-metering/`

## Pair Contract

- `README.md` 維護 `src/modules/billing/` 的最短概覽與實際目錄索引。
- `AGENTS.md` 維護 agent routing、nested index 與放置決策。
- 若未來新增 / 移除子域，先更新這兩份索引，再補充更細的 module-local 說明。

## Read Next

- [../AGENTS.md](../AGENTS.md)
- [../../../docs/README.md](../../../docs/README.md)
````

## File: src/modules/iam/adapters/inbound/react/PublicLandingView.tsx
````typescript
/**
 * PublicLandingView — iam inbound adapter (React).
 *
 * Self-contained public landing + auth panel component.
 * Manages login / register / guest state internally.
 * Consumed by src/app/(public)/page.tsx as a pure Server Component shim.
 *
 * Ported from: app/(public)/page.tsx
 */
⋮----
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
⋮----
import {
  useAuth,
  createClientAuthUseCases,
  createClientAccountUseCases,
} from "./AuthContext";
⋮----
type Tab = "login" | "register";
⋮----
async function handleSubmit(e: React.FormEvent)
⋮----
async function handleGuestAccess()
⋮----
async function handlePasswordReset()
⋮----
setError(null);
setResetSent(false);
setIsAuthPanelOpen((prev)
````

## File: src/modules/iam/adapters/outbound/firebase-composition.ts
````typescript
/**
 * firebase-composition — iam module outbound composition root.
 *
 * Wires Firebase-backed repository implementations into domain use cases.
 * This file is the ONLY entry point for Firebase SDK access within the iam
 * module. All other layers remain infrastructure-agnostic.
 *
 * ESLint: @integration-firebase is allowed here because this file lives in
 * src/modules/iam/adapters/outbound/ which matches the permitted glob.
 */
⋮----
import { getFirebaseAuth, onFirebaseAuthStateChanged, signOutFirebase, getFirebaseFirestore, firestoreApi, type User } from "@packages";
import { FirebaseAuthIdentityRepository } from "./FirebaseAuthIdentityRepository";
import { FirebaseAccountQueryRepository } from "./FirebaseAccountQueryRepository";
import {
  FirestoreAccountRepository,
  type FirestoreLike,
} from "../../subdomains/account/adapters/outbound/firestore/FirestoreAccountRepository";
import {
  FirestoreOrganizationRepository,
  type OrgFirestoreLike,
} from "../../subdomains/organization/adapters/outbound/firestore/FirestoreOrganizationRepository";
import {
  SignInUseCase,
  SignInAnonymouslyUseCase,
  RegisterUseCase,
  SendPasswordResetEmailUseCase,
} from "../../subdomains/identity/application/use-cases/IdentityUseCases";
import { CreateUserAccountUseCase } from "../../subdomains/account/application/use-cases/AccountUseCases";
import { CreateOrganizationUseCase } from "../../subdomains/organization/application/use-cases/OrganizationLifecycleUseCases";
import {
  InviteMemberUseCase,
  ListOrganizationMembersUseCase,
  UpdateMemberRoleUseCase,
  RecruitMemberUseCase,
} from "../../subdomains/organization/application/use-cases/OrganizationMemberUseCases";
import {
  CreateTeamUseCase,
  ListOrganizationTeamsUseCase,
} from "../../subdomains/organization/application/use-cases/OrganizationTeamUseCases";
import type { AccountSnapshot } from "../../subdomains/account/domain/entities/Account";
import type { Unsubscribe } from "../../subdomains/account/domain/repositories/AccountQueryRepository";
import type {
  CreateTeamInput,
  InviteMemberInput,
  MemberReference,
  Team,
  UpdateMemberRoleInput,
} from "../../subdomains/organization/domain/entities/Organization";
import type { CommandResult } from "../../../shared";
⋮----
// ─── Singleton repositories ───────────────────────────────────────────────────
⋮----
function getIdentityRepo(): FirebaseAuthIdentityRepository
⋮----
function getAccountQueryRepo(): FirebaseAccountQueryRepository
⋮----
function getOrgRepo(): FirestoreOrganizationRepository
⋮----
// ─── FirestoreLike adapter ────────────────────────────────────────────────────
// Bridges the Firestore SDK to the FirestoreLike interface expected by
// FirestoreAccountRepository (subdomain-level adapter, technology-agnostic).
⋮----
function createFirestoreLikeAdapter(): FirestoreLike
⋮----
async get(collectionName: string, id: string): Promise<Record<string, unknown> | null>
async set(
      collectionName: string,
      id: string,
      data: Record<string, unknown>,
): Promise<void>
async delete(collectionName: string, id: string): Promise<void>
⋮----
// ─── OrgFirestoreLike adapter ─────────────────────────────────────────────────
// Bridges the Firestore SDK to the OrgFirestoreLike interface for org operations
// (subcollections, etc.).
⋮----
function createOrgFirestoreLikeAdapter(): OrgFirestoreLike
⋮----
async get(col: string, id: string): Promise<Record<string, unknown> | null>
async set(col: string, id: string, data: Record<string, unknown>): Promise<void>
async delete(col: string, id: string): Promise<void>
async getSubcollection(
      col: string,
      parentId: string,
      sub: string,
): Promise<
async setSubdoc(
      col: string,
      parentId: string,
      sub: string,
      id: string,
      data: Record<string, unknown>,
): Promise<void>
async deleteSubdoc(
      col: string,
      parentId: string,
      sub: string,
      id: string,
): Promise<void>
⋮----
// ─── Auth use-case factory ────────────────────────────────────────────────────
⋮----
/**
 * Returns Firebase-backed auth use cases for use in "use client" components.
 * Each call creates fresh use-case instances sharing one repository instance.
 */
export function createClientAuthUseCases()
⋮----
// ─── Account use-case factory ─────────────────────────────────────────────────
⋮----
/**
 * Returns Firebase-backed account use cases for use in "use client" components.
 */
export function createClientAccountUseCases()
⋮----
// ─── Auth state subscription ──────────────────────────────────────────────────
⋮----
/**
 * Subscribes to Firebase auth state changes.
 * Returns an unsubscribe function.
 * For use in "use client" auth providers only.
 */
export function subscribeToAuthState(
  callback: (user: User | null) => void,
): Unsubscribe
⋮----
/**
 * Signs the current user out of Firebase Auth.
 */
export async function firebaseSignOut(): Promise<void>
⋮----
// ─── Account subscriptions ────────────────────────────────────────────────────
⋮----
/**
 * Subscribes to real-time updates for all organisation accounts associated
 * with the given userId (owned or membership).
 */
export function subscribeToAccountsForUser(
  userId: string,
  onUpdate: (accounts: Record<string, AccountSnapshot>) => void,
): Unsubscribe
⋮----
// ─── Organisation use-case factory ───────────────────────────────────────────
⋮----
/**
 * Returns Firebase-backed organisation use cases for use in "use client"
 * components.
 */
export function createClientOrganizationUseCases()
⋮----
export async function listOrganizationMembers(organizationId: string): Promise<MemberReference[]>
⋮----
export async function listOrganizationTeams(organizationId: string): Promise<Team[]>
⋮----
export async function inviteOrganizationMember(input: InviteMemberInput): Promise<CommandResult>
⋮----
export async function recruitOrganizationMember(
  organizationId: string,
  memberId: string,
  name: string,
  email: string,
): Promise<CommandResult>
⋮----
export async function updateOrganizationMemberRole(
  input: UpdateMemberRoleInput,
): Promise<CommandResult>
⋮----
export async function createOrganizationTeam(input: CreateTeamInput): Promise<CommandResult>
````

## File: src/modules/iam/AGENTS.md
````markdown
# IAM Module — Agent Guide

## Purpose

`src/modules/iam/` 是 Identity & Access Management 模組；account / organization 已集中於此。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/access-control/`
- `subdomains/account/`
- `subdomains/authentication/`
- `subdomains/authorization/`
- `subdomains/federation/`
- `subdomains/identity/`
- `subdomains/organization/`
- `subdomains/security-policy/`
- `subdomains/session/`
- `subdomains/tenant/`

## Route Here When

- 需要在 `src/modules/iam/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- 工作區 Membership → `src/modules/workspace/`
- 跨模組消費身份能力 → `src/modules/iam/index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/iam/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
````

## File: src/modules/iam/README.md
````markdown
# IAM Module

`src/modules/iam/` 是 Identity & Access Management 模組；account / organization 已集中於此。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Directory Index（actual directories）

- `subdomains/access-control/`
- `subdomains/account/`
- `subdomains/authentication/`
- `subdomains/authorization/`
- `subdomains/federation/`
- `subdomains/identity/`
- `subdomains/organization/`
- `subdomains/security-policy/`
- `subdomains/session/`
- `subdomains/tenant/`

## Pair Contract

- `README.md` 維護 `src/modules/iam/` 的最短概覽與實際目錄索引。
- `AGENTS.md` 維護 agent routing、nested index 與放置決策。
- 若未來新增 / 移除子域，先更新這兩份索引，再補充更細的 module-local 說明。

## Read Next

- [../AGENTS.md](../AGENTS.md)
- [../../../docs/README.md](../../../docs/README.md)
````

## File: src/modules/iam/subdomains/account/adapters/inbound/http/AccountController.ts
````typescript
import type {
  CreateUserAccountUseCase,
  UpdateUserProfileUseCase,
  UpdateAccountProfileUseCase,
  CreditWalletUseCase,
  DebitWalletUseCase,
  AssignAccountRoleUseCase,
  RevokeAccountRoleUseCase,
} from "../../../application/use-cases/AccountUseCases";
⋮----
/** HTTP inbound adapter stub — translates HTTP requests into application use-case calls. */
export class AccountController {
⋮----
constructor(
⋮----
async createAccount(body:
⋮----
async updateProfile(body:
⋮----
async updateAccountProfile(body:
⋮----
async creditWallet(body:
⋮----
async debitWallet(body:
⋮----
async assignRole(body: {
    accountId: string;
    role: string;
    grantedBy: string;
    traceId?: string;
})
⋮----
async revokeRole(body:
````

## File: src/modules/iam/subdomains/identity/adapters/inbound/http/IdentityController.ts
````typescript
import type {
  SignInUseCase,
  SignInAnonymouslyUseCase,
  RegisterUseCase,
  SendPasswordResetEmailUseCase,
  SignOutUseCase,
} from "../../../application/use-cases/IdentityUseCases";
import type { SignInCredentials, RegistrationInput } from "../../../domain/entities/Identity";
⋮----
/** HTTP inbound adapter stub — translates HTTP requests into identity use-case calls. */
export class IdentityController {
⋮----
constructor(
⋮----
async signIn(body: SignInCredentials)
⋮----
async signInAnonymously()
⋮----
async register(body: RegistrationInput)
⋮----
async sendPasswordReset(body:
⋮----
async signOut()
````

## File: src/modules/notebooklm/adapters/inbound/react/NotebooklmNotebookSection.tsx
````typescript
/**
 * NotebooklmNotebookSection — notebooklm.notebook tab — RAG query interface.
 * Input a question → AI retrieves from indexed documents → displays answer + citations.
 */
⋮----
import { Button, Input } from "@packages";
import { Brain, Search } from "lucide-react";
import { useState, useTransition } from "react";
⋮----
import type { RagQueryOutput } from "../../../adapters/outbound/callable/FirebaseCallableAdapter";
import { callRagQuery } from "../../../adapters/outbound/firebase-composition";
⋮----
interface NotebooklmNotebookSectionProps {
  workspaceId: string;
  accountId: string;
}
⋮----
const handleQuery = () =>
````

## File: src/modules/notebooklm/adapters/inbound/server-actions/notebook-actions.ts
````typescript
/**
 * notebook-actions — notebooklm notebook + RAG server actions.
 */
⋮----
import { z } from "zod";
import {
  callRagQuery,
  createClientNotebooklmNotebookUseCases,
} from "../../outbound/firebase-composition";
⋮----
// ── Input schemas ─────────────────────────────────────────────────────────────
⋮----
// ── Actions ───────────────────────────────────────────────────────────────────
⋮----
export async function createNotebookAction(rawInput: unknown)
⋮----
/**
 * ragQueryAction — RAG retrieval + generation via fn rag_query callable.
 * Returns AI-generated answer with source citations.
 */
export async function ragQueryAction(rawInput: unknown)
⋮----
/**
 * synthesizeWorkspaceAction — RAG synthesis across all workspace documents.
 * Uses a fixed synthesis prompt to summarise key themes.
 */
export async function synthesizeWorkspaceAction(rawInput: unknown)
````

## File: src/modules/notebooklm/adapters/inbound/server-actions/source-processing-actions.ts
````typescript
/**
 * source-processing-actions — notebooklm source document processing workflow.
 *
 * Composes ProcessSourceDocumentWorkflowUseCase with:
 *   - TaskMaterializationWorkflowAdapter  (ADR: synchronous Server Action bridge)
 *   - Notion CreateKnowledgePagePort       (bridges notion's createPage use case)
 *
 * ADR decisions implemented here:
 *   1. AI extraction → workspace.extract-task-candidates Genkit flow
 *      GenkitTaskCandidateExtractor is instantiated directly here because
 *      this is a "use server" file — it is never included in browser bundles.
 *      firebase-composition.ts retains FirebaseCallableTaskCandidateExtractor
 *      for the shared factory used by client-accessible code paths.
 *   2. Task bridge → synchronous Server Action callback (not QStash event).
 *
 * Architecture note: this server action is the composition root for a
 * cross-module workflow (notebooklm → workspace → notion). It reaches into
 * the workspace and notion composition factories to assemble the use case.
 * The domain layers remain fully isolated; only the adapter layer is composed here.
 */
⋮----
import { z } from "zod";
import { ProcessSourceDocumentWorkflowUseCase } from "../../../orchestration/ProcessSourceDocumentWorkflowUseCase";
import { TaskMaterializationWorkflowAdapter } from "../../outbound/TaskMaterializationWorkflowAdapter";
import { GenkitTaskCandidateExtractor } from "@/src/modules/workspace/subdomains/task-formation/adapters/outbound/genkit/GenkitTaskCandidateExtractor";
import { ExtractTaskCandidatesUseCase, ConfirmCandidatesUseCase } from "@/src/modules/workspace/subdomains/task-formation/application/use-cases/TaskFormationUseCases";
import { FirestoreTaskFormationJobRepository } from "@/src/modules/workspace/subdomains/task-formation/adapters/outbound/firestore/FirestoreTaskFormationJobRepository";
import { CreateTaskUseCase } from "@/src/modules/workspace/subdomains/task/application/use-cases/TaskUseCases";
import { FirestoreTaskRepository } from "@/src/modules/workspace/subdomains/task/adapters/outbound/firestore/FirestoreTaskRepository";
import { createFirestoreLikeAdapter } from "@/src/modules/workspace/adapters/outbound/firebase-composition";
import { createClientNotionPageUseCases } from "@/src/modules/notion/adapters/outbound/firebase-composition";
⋮----
// ── Input schema ───────────────────────────────────────────────────────────────
⋮----
// ── Action ─────────────────────────────────────────────────────────────────────
⋮----
export async function processSourceDocumentAction(rawInput: unknown)
⋮----
// ── Wire workspace task formation with Genkit extractor (server-only) ────────
⋮----
// ── Wire notion page creation ────────────────────────────────────────────────
⋮----
// ── Execute workflow ─────────────────────────────────────────────────────────
````

## File: src/modules/notebooklm/AGENTS.md
````markdown
# NotebookLM Module — Agent Guide

## Purpose

`src/modules/notebooklm/` 是 NotebookLM 使用者體驗模組；實際子域以目錄結構為準。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/conversation/`
- `subdomains/notebook/`
- `subdomains/source/`
- `subdomains/synthesis/`

## Route Here When

- 需要在 `src/modules/notebooklm/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- AI mechanism → `src/modules/ai/`
- KnowledgeArtifact 可寫內容 → `src/modules/notion/`
- 跨模組 API → `src/modules/notebooklm/index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/notebooklm/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
````

## File: src/modules/notebooklm/orchestration/ProcessSourceDocumentWorkflowUseCase.ts
````typescript
/**
 * ProcessSourceDocumentWorkflowUseCase — orchestrates the full source processing flow.
 *
 * After a document is uploaded and parsed (by fn), this use case orchestrates
 * the optional downstream steps the user selects in the processing dialog:
 *   1. Parse (already done by fn — this step validates parse status)
 *   2. RAG index (already done by fn — this step validates RAG status)
 *   3. Create Knowledge Page via notion boundary
 *   4. Extract task candidates + hand off via TaskMaterializationWorkflowPort
 *
 * Guardrails:
 *   - notebooklm does NOT write workspace repositories directly.
 *   - Knowledge Page is the required canonical carrier before task creation.
 *   - Task handoff only via TaskMaterializationWorkflowPort.
 *   - parse failure stops all downstream steps.
 */
⋮----
import type { TaskMaterializationWorkflowPort } from "./TaskMaterializationWorkflowPort";
⋮----
// ── Input / output contracts ──────────────────────────────────────────────────
⋮----
export type StepStatus = "skipped" | "success" | "failed";
⋮----
export interface ProcessSourceDocumentWorkflowInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly documentId: string;
  readonly documentTitle: string;
  readonly parsedTextSummary?: string;
  readonly shouldCreateRag: boolean;
  readonly shouldCreatePage: boolean;
  readonly shouldCreateTasks: boolean;
  readonly requestedByUserId?: string;
}
⋮----
export interface ProcessSourceDocumentWorkflowResult {
  readonly parseStatus: StepStatus;
  readonly ragStatus: StepStatus;
  readonly pageStatus: StepStatus;
  readonly taskStatus: StepStatus;
  readonly pageHref?: string;
  readonly workflowHref?: string;
  readonly taskCount: number;
  readonly pageCount: number;
  readonly errors: readonly string[];
}
⋮----
// ── Create Knowledge Page port (notion boundary) ──────────────────────────────
⋮----
export interface CreateKnowledgePagePort {
  createPage(input: {
    accountId: string;
    workspaceId: string;
    title: string;
    sourceDocumentId: string;
    requestedByUserId?: string;
  }): Promise<{ ok: boolean; pageId?: string; pageHref?: string; error?: string }>;
}
⋮----
createPage(input: {
    accountId: string;
    workspaceId: string;
    title: string;
    sourceDocumentId: string;
    requestedByUserId?: string;
}): Promise<
⋮----
// ── Use case ──────────────────────────────────────────────────────────────────
⋮----
export class ProcessSourceDocumentWorkflowUseCase {
⋮----
constructor(
⋮----
async execute(
    input: ProcessSourceDocumentWorkflowInput,
): Promise<ProcessSourceDocumentWorkflowResult>
⋮----
private async _runPageStep(input: ProcessSourceDocumentWorkflowInput)
⋮----
private async _runTaskStep(
    input: ProcessSourceDocumentWorkflowInput,
    parsedText: string,
    pageId: string,
)
⋮----
// ── Helpers ───────────────────────────────────────────────────────────────────
⋮----
interface ResultArgs {
  parseStatus: StepStatus;
  ragStatus: StepStatus;
  errors: string[];
  pageStatus?: StepStatus;
  pageHref?: string;
  pageCount?: number;
  taskStatus?: StepStatus;
  taskCount?: number;
  workflowHref?: string;
}
⋮----
function buildResult(args: ResultArgs): ProcessSourceDocumentWorkflowResult
````

## File: src/modules/notebooklm/README.md
````markdown
# NotebookLM Module

`src/modules/notebooklm/` 是 NotebookLM 使用者體驗模組；實際子域以目錄結構為準。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Directory Index（actual directories）

- `subdomains/conversation/`
- `subdomains/notebook/`
- `subdomains/source/`
- `subdomains/synthesis/`

## Pair Contract

- `README.md` 維護 `src/modules/notebooklm/` 的最短概覽與實際目錄索引。
- `AGENTS.md` 維護 agent routing、nested index 與放置決策。
- 若未來新增 / 移除子域，先更新這兩份索引，再補充更細的 module-local 說明。

## Read Next

- [../AGENTS.md](../AGENTS.md)
- [../../../docs/README.md](../../../docs/README.md)
````

## File: src/modules/notebooklm/subdomains/source/adapters/inbound/index.ts
````typescript
// inbound adapters for source subdomain (server actions live at module root adapters/inbound)
````

## File: src/modules/notebooklm/subdomains/source/adapters/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/source/adapters/outbound/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/source/adapters/outbound/memory/InMemoryIngestionSourceRepository.ts
````typescript
import type { IngestionSourceSnapshot, SourceStatus } from "../../../domain/entities/IngestionSource";
import type { IngestionSourceRepository, IngestionSourceQuery } from "../../../domain/repositories/IngestionSourceRepository";
⋮----
export class InMemoryIngestionSourceRepository implements IngestionSourceRepository {
⋮----
async save(snapshot: IngestionSourceSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<IngestionSourceSnapshot | null>
⋮----
async findByNotebookId(notebookId: string): Promise<IngestionSourceSnapshot[]>
⋮----
async query(params: IngestionSourceQuery): Promise<IngestionSourceSnapshot[]>
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/notebooklm/subdomains/source/application/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/source/application/use-cases/IngestionSourceUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { IngestionSource, type RegisterIngestionSourceInput } from "../../domain/entities/IngestionSource";
import type { IngestionSourceRepository, IngestionSourceQuery } from "../../domain/repositories/IngestionSourceRepository";
⋮----
export class RegisterIngestionSourceUseCase {
⋮----
constructor(private readonly repo: IngestionSourceRepository)
⋮----
async execute(input: RegisterIngestionSourceInput): Promise<CommandResult>
⋮----
export class ArchiveIngestionSourceUseCase {
⋮----
async execute(sourceId: string): Promise<CommandResult>
⋮----
export class QueryIngestionSourcesUseCase {
⋮----
async execute(params: IngestionSourceQuery)
````

## File: src/modules/notebooklm/subdomains/source/domain/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/source/domain/repositories/IngestionSourceRepository.ts
````typescript
import type { IngestionSourceSnapshot, SourceStatus } from "../entities/IngestionSource";
⋮----
export interface IngestionSourceQuery {
  readonly notebookId?: string;
  readonly workspaceId?: string;
  readonly accountId?: string;
  readonly status?: SourceStatus;
  readonly limit?: number;
  readonly offset?: number;
}
⋮----
export interface IngestionSourceRepository {
  save(snapshot: IngestionSourceSnapshot): Promise<void>;
  findById(id: string): Promise<IngestionSourceSnapshot | null>;
  findByNotebookId(notebookId: string): Promise<IngestionSourceSnapshot[]>;
  query(params: IngestionSourceQuery): Promise<IngestionSourceSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: IngestionSourceSnapshot): Promise<void>;
findById(id: string): Promise<IngestionSourceSnapshot | null>;
findByNotebookId(notebookId: string): Promise<IngestionSourceSnapshot[]>;
query(params: IngestionSourceQuery): Promise<IngestionSourceSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notebooklm/subdomains/synthesis/adapters/inbound/index.ts
````typescript
// inbound adapters for synthesis subdomain
````

## File: src/modules/notebooklm/subdomains/synthesis/adapters/outbound/index.ts
````typescript
// outbound adapters for synthesis subdomain (Genkit implementation lives in infrastructure/ai/)
````

## File: src/modules/notebooklm/subdomains/synthesis/application/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/synthesis/application/use-cases/RunSynthesisUseCase.ts
````typescript
import { v4 as uuid } from "uuid";
import type { SynthesisPort } from "../../domain/ports/SynthesisPort";
import type { SynthesisInput, SynthesisResultSnapshot } from "../../domain/entities/SynthesisResult";
⋮----
export interface RunSynthesisResult {
  readonly ok: boolean;
  readonly result?: SynthesisResultSnapshot;
  readonly error?: string;
}
⋮----
export class RunSynthesisUseCase {
⋮----
constructor(private readonly synthesisPort: SynthesisPort)
⋮----
async execute(input: SynthesisInput): Promise<RunSynthesisResult>
````

## File: src/modules/notebooklm/subdomains/synthesis/domain/entities/SynthesisResult.ts
````typescript
/**
 * SynthesisResult — value object produced by a RAG synthesis operation.
 *
 * Owned by notebooklm/synthesis subdomain.
 * The synthesis port (SynthesisPort) is the primary contract for calling AI.
 * The Genkit flow (infrastructure/ai/synthesis.flow.ts) implements the port.
 */
⋮----
export interface SynthesisCitation {
  readonly index: number;
  /** Raw citation identifier returned by the synthesis flow. */
  readonly ref: string;
}
⋮----
/** Raw citation identifier returned by the synthesis flow. */
⋮----
export interface SynthesisResultSnapshot {
  readonly id: string;
  readonly notebookId?: string;
  readonly question: string;
  readonly answer: string;
  readonly citations: readonly SynthesisCitation[];
  readonly model?: string;
  readonly completedAtISO: string;
}
⋮----
export interface SynthesisInput {
  readonly notebookId?: string;
  readonly question: string;
  readonly contextChunks: readonly string[];
  readonly maxCitations?: number;
  readonly model?: string;
}
````

## File: src/modules/notebooklm/subdomains/synthesis/domain/index.ts
````typescript

````

## File: src/modules/notebooklm/subdomains/synthesis/domain/ports/SynthesisPort.ts
````typescript
import type { SynthesisInput, SynthesisResultSnapshot } from "../entities/SynthesisResult";
⋮----
/** Outbound port — implemented by infrastructure/ai/synthesis.flow adapter. */
export interface SynthesisPort {
  synthesize(input: SynthesisInput): Promise<SynthesisResultSnapshot>;
}
⋮----
synthesize(input: SynthesisInput): Promise<SynthesisResultSnapshot>;
````

## File: src/modules/notion/adapters/inbound/server-actions/page-actions.ts
````typescript
/**
 * page-actions — notion page server actions.
 */
⋮----
import { z } from "zod";
import { createClientNotionPageUseCases } from "../../outbound/firebase-composition";
⋮----
// ── Input schemas ─────────────────────────────────────────────────────────────
⋮----
// ── Actions ───────────────────────────────────────────────────────────────────
⋮----
export async function queryPagesAction(rawInput: unknown)
⋮----
export async function createPageAction(rawInput: unknown)
⋮----
export async function renamePageAction(rawInput: unknown)
⋮----
export async function archivePageAction(rawInput: unknown)
````

## File: src/modules/notion/adapters/inbound/server-actions/template-actions.test.ts
````typescript
import { beforeEach, describe, expect, it, vi } from "vitest";
⋮----
import { createTemplateAction } from "./template-actions";
````

## File: src/modules/notion/adapters/inbound/server-actions/template-actions.ts
````typescript
/**
 * template-actions — notion template server actions.
 */
⋮----
import { z } from "zod";
import type { Template } from "../../../subdomains/template/domain/entities/Template";
import { createClientNotionTemplateUseCases } from "../../outbound/firebase-composition";
⋮----
// ── Input schemas ─────────────────────────────────────────────────────────────
⋮----
// ── Actions ───────────────────────────────────────────────────────────────────
⋮----
export async function queryTemplatesAction(rawInput: unknown): Promise<Template[]>
⋮----
export async function createTemplateAction(rawInput: unknown)
````

## File: src/modules/notion/AGENTS.md
````markdown
# Notion Module — Agent Guide

## Purpose

`src/modules/notion/` 是 KnowledgeArtifact 模組；Page / Block / Database 等可寫內容由此所有。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/block/`
- `subdomains/collaboration/`
- `subdomains/database/`
- `subdomains/knowledge/`
- `subdomains/page/`
- `subdomains/template/`
- `subdomains/view/`

## Route Here When

- 需要在 `src/modules/notion/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- RAG UX / conversation flow → `src/modules/notebooklm/`
- AI mechanism → `src/modules/ai/`
- 跨模組 API → `src/modules/notion/index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/notion/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
````

## File: src/modules/notion/README.md
````markdown
# Notion Module

`src/modules/notion/` 是 KnowledgeArtifact 模組；Page / Block / Database 等可寫內容由此所有。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Directory Index（actual directories）

- `subdomains/block/`
- `subdomains/collaboration/`
- `subdomains/database/`
- `subdomains/knowledge/`
- `subdomains/page/`
- `subdomains/template/`
- `subdomains/view/`

## Pair Contract

- `README.md` 維護 `src/modules/notion/` 的最短概覽與實際目錄索引。
- `AGENTS.md` 維護 agent routing、nested index 與放置決策。
- 若未來新增 / 移除子域，先更新這兩份索引，再補充更細的 module-local 說明。

## Read Next

- [../AGENTS.md](../AGENTS.md)
- [../../../docs/README.md](../../../docs/README.md)
````

## File: src/modules/notion/subdomains/database/adapters/outbound/memory/InMemoryDatabaseRepository.ts
````typescript
import type { DatabaseSnapshot } from "../../../domain/entities/Database";
import type { DatabaseRepository } from "../../../domain/repositories/DatabaseRepository";
⋮----
export class InMemoryDatabaseRepository implements DatabaseRepository {
⋮----
async save(snapshot: DatabaseSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<DatabaseSnapshot | null>
⋮----
async findByParentPageId(parentPageId: string): Promise<DatabaseSnapshot[]>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<DatabaseSnapshot[]>
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/notion/subdomains/database/domain/entities/Database.test.ts
````typescript
import { describe, expect, it } from "vitest";
⋮----
import { Database } from "./Database";
````

## File: src/modules/notion/subdomains/database/domain/repositories/DatabaseRepository.ts
````typescript
import type { DatabaseSnapshot } from "../entities/Database";
⋮----
export interface DatabaseRepository {
  save(snapshot: DatabaseSnapshot): Promise<void>;
  findById(id: string): Promise<DatabaseSnapshot | null>;
  findByParentPageId(parentPageId: string): Promise<DatabaseSnapshot[]>;
  findByWorkspaceId(workspaceId: string): Promise<DatabaseSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: DatabaseSnapshot): Promise<void>;
findById(id: string): Promise<DatabaseSnapshot | null>;
findByParentPageId(parentPageId: string): Promise<DatabaseSnapshot[]>;
findByWorkspaceId(workspaceId: string): Promise<DatabaseSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notion/subdomains/knowledge/adapters/inbound/index.ts
````typescript
// inbound adapters for knowledge subdomain
````

## File: src/modules/notion/subdomains/knowledge/adapters/index.ts
````typescript

````

## File: src/modules/notion/subdomains/knowledge/adapters/outbound/index.ts
````typescript

````

## File: src/modules/notion/subdomains/knowledge/adapters/outbound/memory/InMemoryKnowledgeArtifactRepository.ts
````typescript
import type { KnowledgeArtifactSnapshot, KnowledgeArtifactStatus, KnowledgeArtifactType } from "../../../domain/entities/KnowledgeArtifact";
import type { KnowledgeArtifactRepository, KnowledgeArtifactQuery } from "../../../domain/repositories/KnowledgeArtifactRepository";
⋮----
export class InMemoryKnowledgeArtifactRepository implements KnowledgeArtifactRepository {
⋮----
async save(snapshot: KnowledgeArtifactSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<KnowledgeArtifactSnapshot | null>
⋮----
async query(params: KnowledgeArtifactQuery): Promise<KnowledgeArtifactSnapshot[]>
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/notion/subdomains/knowledge/application/index.ts
````typescript

````

## File: src/modules/notion/subdomains/knowledge/application/use-cases/KnowledgeArtifactUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { KnowledgeArtifact, type CreateKnowledgeArtifactInput } from "../../domain/entities/KnowledgeArtifact";
import type { KnowledgeArtifactRepository, KnowledgeArtifactQuery } from "../../domain/repositories/KnowledgeArtifactRepository";
⋮----
export class CreateKnowledgeArtifactUseCase {
⋮----
constructor(private readonly repo: KnowledgeArtifactRepository)
⋮----
async execute(input: CreateKnowledgeArtifactInput): Promise<CommandResult>
⋮----
export class PublishKnowledgeArtifactUseCase {
⋮----
async execute(artifactId: string): Promise<CommandResult>
⋮----
export class ArchiveKnowledgeArtifactUseCase {
⋮----
export class QueryKnowledgeArtifactsUseCase {
⋮----
async execute(params: KnowledgeArtifactQuery)
````

## File: src/modules/notion/subdomains/knowledge/domain/entities/KnowledgeArtifact.ts
````typescript
/**
 * KnowledgeArtifact — canonical ubiquitous-language aggregate for the notion
 * bounded context.
 *
 * A KnowledgeArtifact is the top-level knowledge unit authored, versioned, and
 * published within a workspace. It acts as the canonical container; subordinate
 * building blocks (Page, Block) represent implementation details.
 *
 * "KnowledgeArtifact" is the strategic term per
 * docs/structure/domain/ubiquitous-language.md.
 */
import { v4 as uuid } from "uuid";
⋮----
export type KnowledgeArtifactStatus = "draft" | "published" | "archived";
export type KnowledgeArtifactType = "article" | "wiki" | "guide" | "reference" | "other";
⋮----
export interface KnowledgeArtifactSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly organizationId: string;
  readonly title: string;
  readonly type: KnowledgeArtifactType;
  readonly status: KnowledgeArtifactStatus;
  readonly authorId: string;
  /** Root page ID linking this artifact to the page subdomain. */
  readonly rootPageId?: string;
  readonly tags: readonly string[];
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
  readonly publishedAtISO?: string;
  readonly archivedAtISO?: string;
}
⋮----
/** Root page ID linking this artifact to the page subdomain. */
⋮----
export interface CreateKnowledgeArtifactInput {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly organizationId: string;
  readonly title: string;
  readonly type?: KnowledgeArtifactType;
  readonly authorId: string;
  readonly tags?: string[];
}
⋮----
export class KnowledgeArtifact {
⋮----
private constructor(private _props: KnowledgeArtifactSnapshot)
⋮----
static create(input: CreateKnowledgeArtifactInput): KnowledgeArtifact
⋮----
static reconstitute(snapshot: KnowledgeArtifactSnapshot): KnowledgeArtifact
⋮----
publish(): void
⋮----
archive(): void
⋮----
linkRootPage(pageId: string): void
⋮----
rename(title: string): void
⋮----
get id(): string
get title(): string
get status(): KnowledgeArtifactStatus
get workspaceId(): string
get authorId(): string
get type(): KnowledgeArtifactType
⋮----
getSnapshot(): Readonly<KnowledgeArtifactSnapshot>
⋮----
pullDomainEvents()
````

## File: src/modules/notion/subdomains/knowledge/domain/index.ts
````typescript

````

## File: src/modules/notion/subdomains/knowledge/domain/repositories/KnowledgeArtifactRepository.ts
````typescript
import type { KnowledgeArtifactSnapshot, KnowledgeArtifactStatus, KnowledgeArtifactType } from "../entities/KnowledgeArtifact";
⋮----
export interface KnowledgeArtifactQuery {
  readonly workspaceId?: string;
  readonly accountId?: string;
  readonly status?: KnowledgeArtifactStatus;
  readonly type?: KnowledgeArtifactType;
  readonly authorId?: string;
  readonly limit?: number;
  readonly offset?: number;
}
⋮----
export interface KnowledgeArtifactRepository {
  save(snapshot: KnowledgeArtifactSnapshot): Promise<void>;
  findById(id: string): Promise<KnowledgeArtifactSnapshot | null>;
  query(params: KnowledgeArtifactQuery): Promise<KnowledgeArtifactSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: KnowledgeArtifactSnapshot): Promise<void>;
findById(id: string): Promise<KnowledgeArtifactSnapshot | null>;
query(params: KnowledgeArtifactQuery): Promise<KnowledgeArtifactSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/notion/subdomains/page/domain/entities/Page.test.ts
````typescript
import { describe, expect, it } from "vitest";
⋮----
import { Page } from "./Page";
````

## File: src/modules/notion/subdomains/template/adapters/outbound/memory/InMemoryTemplateRepository.ts
````typescript
import type { Template, TemplateCategory, TemplateScope, TemplateRepository } from "../../../domain/entities/Template";
⋮----
export class InMemoryTemplateRepository implements TemplateRepository {
⋮----
async save(template: Template): Promise<void>
⋮----
async findById(id: string): Promise<Template | null>
⋮----
async findByScope(scope: TemplateScope, contextId?: string): Promise<Template[]>
⋮----
async listByCategory(category: TemplateCategory): Promise<Template[]>
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/notion/subdomains/template/application/use-cases/TemplateUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { Template, TemplateCategory, TemplateScope, TemplateRepository } from "../../domain/entities/Template";
⋮----
export interface CreateTemplateInput {
  readonly workspaceId: string;
  readonly title: string;
  readonly category: TemplateCategory;
  readonly createdByUserId: string;
  readonly description?: string;
}
⋮----
export class QueryTemplatesUseCase {
⋮----
constructor(private readonly repo: TemplateRepository)
⋮----
async execute(workspaceId: string): Promise<Template[]>
⋮----
export class CreateTemplateUseCase {
⋮----
async execute(input: CreateTemplateInput): Promise<CommandResult>
````

## File: src/modules/platform/adapters/inbound/react/shell/CreateOrganizationDialog.tsx
````typescript
/**
 * CreateOrganizationDialog — platform inbound adapter (React).
 *
 * Dialog for creating a new organisation.
 * Uses CreateOrganizationUseCase via the iam Firebase composition root.
 *
 * On success, the new organisation document is written to Firestore with the
 * creator listed in `ownerId` and `memberIds`.  The existing
 * `subscribeToAccountsForUser` query picks it up automatically, so the
 * AccountSwitcher refreshes without an explicit refetch.
 */
⋮----
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@packages";
import { useState, useMemo } from "react";
import { Building2, Loader2 } from "lucide-react";
⋮----
import { createClientOrganizationUseCases } from "../../../../../iam/adapters/outbound/firebase-composition";
import type { AuthUser } from "../../../../../iam/adapters/inbound/react/AuthContext";
import type { AccountEntity } from "../AppContext";
⋮----
// ── Types ─────────────────────────────────────────────────────────────────────
⋮----
interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthUser | null;
  onOrganizationCreated?: (account: AccountEntity) => void;
  onNavigate?: (href: string) => void;
}
⋮----
// ── Component ─────────────────────────────────────────────────────────────────
⋮----
async function handleSubmit(e: React.FormEvent)
⋮----
onOpenChange(nextOpen);
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellAppRail.tsx
````typescript
/**
 * ShellAppRail — app/(shell)/_shell composition layer.
 * Moved from modules/platform/interfaces/web/shell/sidebar/ShellAppRail.tsx
 * because it composes downstream modules (workspace).
 *
 * Platform is upstream and must not import downstream modules.
 * app/ is the designated composition layer.
 */
⋮----
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  NotebookText,
  Plus,
  Settings,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
⋮----
import type { AuthUser, ActiveAccount, AccountEntity } from "../AppContext";
import { CreateOrganizationDialog } from "../platform-ui-stubs";
import {
  listShellRailCatalogItems,
  isExactOrChildPath,
  resolveShellNavSection,
  buildShellContextualHref,
  type ShellRailCatalogItem,
} from "../../../../index";
import type { WorkspaceEntity } from "../../../../../workspace/adapters/inbound/react/WorkspaceContext";
import { CreateWorkspaceDialogRail } from "../../../../../workspace/adapters/inbound/react/workspace-ui-stubs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/packages/ui-shadcn/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/packages/ui-shadcn/ui/tooltip";
⋮----
interface AppRailProps {
  readonly pathname: string;
  readonly user: AuthUser | null;
  readonly activeAccount: ActiveAccount | null;
  readonly organizationAccounts: AccountEntity[];
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly isOrganizationAccount: boolean;
  readonly onSelectPersonal: () => void;
  readonly onSelectOrganization: (account: AccountEntity) => void;
  readonly activeWorkspaceId: string | null;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
  readonly onOrganizationCreated?: (account: AccountEntity) => void;
  readonly onSignOut: () => void;
}
⋮----
interface RailItem {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  show?: boolean;
  isActive?: (pathname: string) => boolean;
}
⋮----
function getInitial(name: string | undefined | null): string
⋮----
function isActive(href: string)
⋮----
function buildWorkspaceDetailHref(workspaceId: string): string
⋮----
onClick=
⋮----
onSelectWorkspace(workspace.id);
````

## File: src/modules/platform/adapters/inbound/server-actions/file-actions.ts
````typescript
/**
 * file-actions — platform file storage server actions.
 *
 * NOTE: All file-storage Firestore operations have been moved to client-side
 * helpers in platform/adapters/outbound/firebase-composition.ts.
 *
 * The Firebase Web Client SDK requires a signed-in user session in the browser.
 * Server Actions executing Firestore reads/writes via the web SDK have no user
 * auth context → Security Rules block every operation with
 * "Missing or insufficient permissions".
 *
 * Use listWorkspaceFiles(), registerUploadedFile(), deleteWorkspaceFile() from
 * platform/adapters/outbound/firebase-composition instead.
 */
````

## File: src/modules/platform/adapters/outbound/firebase-composition.ts
````typescript
/**
 * firebase-composition — platform module outbound composition root.
 *
 * This file is a pure composition root. It:
 *   - Assembles use-case instances against FirestoreFileStorageRepository
 *   - Provides Firebase Storage upload/download helpers
 *
 * Infrastructure logic lives in the subdomain adapter:
 *   subdomains/file-storage/adapters/outbound/firestore/FirestoreFileStorageRepository.ts
 *
 * ESLint: @integration-firebase/storage is allowed here — this file lives at
 * src/modules/platform/adapters/outbound/ which matches the permitted glob.
 *
 * Storage path: workspace-files/{accountId}/{workspaceId}/{uuid}-{safeName}
 */
⋮----
import { getFirebaseStorage, ref, uploadBytes, getDownloadURL } from "@packages";
import { FirestoreFileStorageRepository } from "../../subdomains/file-storage/adapters/outbound";
import {
  CreateStoredFileUseCase,
  GetStoredFileUseCase,
  ListStoredFilesUseCase,
  DeleteStoredFileUseCase,
} from "../../subdomains/file-storage/application/use-cases/FileStorageUseCases";
⋮----
// ── Singleton ─────────────────────────────────────────────────────────────────
⋮----
function getFileRepo(): FirestoreFileStorageRepository
⋮----
// ── Factory ───────────────────────────────────────────────────────────────────
⋮----
export function createClientFileStorageUseCases()
⋮----
// ── Client-side file storage helpers ─────────────────────────────────────────
//
// MUST be called from client components, NOT from Server Actions.
// The Firebase Web Client SDK requires a signed-in user in the browser context.
// A Server Action has no active Firebase user session → Firestore Security Rules
// block any operation (read or write) with "Missing or insufficient permissions".
⋮----
export async function listWorkspaceFiles(params:
⋮----
export async function registerUploadedFile(params: {
  workspaceId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
})
⋮----
export async function deleteWorkspaceFile(params:
⋮----
// ── Storage helpers ───────────────────────────────────────────────────────────
⋮----
/**
 * uploadWorkspaceFile — upload a file to Firebase Storage under the workspace prefix.
 *
 * Storage path: workspace-files/{accountId}/{workspaceId}/{uuid}-{safeName}
 * Returns the GCS storage path (used as StoredFile.url).
 */
export async function uploadWorkspaceFile(
  file: File,
  accountId: string,
  workspaceId: string,
): Promise<string>
⋮----
/**
 * getWorkspaceFileDownloadUrl — resolve a Firebase Storage path to an HTTPS download URL.
 *
 * Accepts both gs://bucket/path and relative paths like workspace-files/...
 */
export async function getWorkspaceFileDownloadUrl(storagePath: string): Promise<string>
````

## File: src/modules/platform/AGENTS.md
````markdown
# Platform Module — Agent Guide

## Purpose

`src/modules/platform/` 是 平台橫切能力模組；account / organization 已遷入 iam。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/audit-log/`
- `subdomains/background-job/`
- `subdomains/cache/`
- `subdomains/feature-flag/`
- `subdomains/file-storage/`
- `subdomains/notification/`
- `subdomains/platform-config/`
- `subdomains/search/`

## Route Here When

- 需要在 `src/modules/platform/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- account / organization → `src/modules/iam/`
- 跨模組 API → `src/modules/platform/index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/platform/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
````

## File: src/modules/platform/index.ts
````typescript
/**
 * Platform Module — public API surface.
 * All cross-module consumers must import from here only.
 */
⋮----
// audit-log (platform governance)
⋮----
// feature-flag (incremental rollout governance)
````

## File: src/modules/platform/README.md
````markdown
# Platform Module

`src/modules/platform/` 是 平台橫切能力模組；account / organization 已遷入 iam。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Directory Index（actual directories）

- `subdomains/audit-log/`
- `subdomains/background-job/`
- `subdomains/cache/`
- `subdomains/feature-flag/`
- `subdomains/file-storage/`
- `subdomains/notification/`
- `subdomains/platform-config/`
- `subdomains/search/`

## Pair Contract

- `README.md` 維護 `src/modules/platform/` 的最短概覽與實際目錄索引。
- `AGENTS.md` 維護 agent routing、nested index 與放置決策。
- 若未來新增 / 移除子域，先更新這兩份索引，再補充更細的 module-local 說明。

## Read Next

- [../AGENTS.md](../AGENTS.md)
- [../../../docs/README.md](../../../docs/README.md)
````

## File: src/modules/platform/subdomains/audit-log/adapters/inbound/index.ts
````typescript
// inbound adapters for audit-log subdomain
````

## File: src/modules/platform/subdomains/audit-log/adapters/index.ts
````typescript

````

## File: src/modules/platform/subdomains/audit-log/adapters/outbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/audit-log/adapters/outbound/memory/InMemoryAuditLogRepository.ts
````typescript
import type { AuditLogEntrySnapshot, AuditAction } from "../../../domain/entities/AuditLogEntry";
import type { AuditLogRepository, AuditLogQuery } from "../../../domain/repositories/AuditLogRepository";
⋮----
export class InMemoryAuditLogRepository implements AuditLogRepository {
⋮----
async append(snapshot: AuditLogEntrySnapshot): Promise<void>
⋮----
async query(params: AuditLogQuery): Promise<AuditLogEntrySnapshot[]>
````

## File: src/modules/platform/subdomains/audit-log/application/index.ts
````typescript

````

## File: src/modules/platform/subdomains/audit-log/domain/entities/AuditLogEntry.ts
````typescript
/**
 * AuditLogEntry — immutable record of a significant platform action.
 *
 * Owned by platform/audit-log subdomain.
 * Entries are append-only; no mutations are permitted after creation.
 */
import { v4 as uuid } from "uuid";
⋮----
export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "archive"
  | "publish"
  | "invite"
  | "access"
  | "export"
  | string;
⋮----
export interface AuditLogEntrySnapshot {
  readonly id: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly actorId: string;
  readonly action: AuditAction;
  /** e.g. "workspace", "knowledge_artifact", "member" */
  readonly resourceType: string;
  readonly resourceId: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly occurredAtISO: string;
}
⋮----
/** e.g. "workspace", "knowledge_artifact", "member" */
⋮----
export interface RecordAuditEntryInput {
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly actorId: string;
  readonly action: AuditAction;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly metadata?: Record<string, unknown>;
}
⋮----
export class AuditLogEntry {
⋮----
private constructor(private readonly _props: AuditLogEntrySnapshot)
⋮----
static record(input: RecordAuditEntryInput): AuditLogEntry
⋮----
static reconstitute(snapshot: AuditLogEntrySnapshot): AuditLogEntry
⋮----
get id(): string
get actorId(): string
get action(): AuditAction
get resourceType(): string
get resourceId(): string
get occurredAtISO(): string
⋮----
getSnapshot(): Readonly<AuditLogEntrySnapshot>
````

## File: src/modules/platform/subdomains/audit-log/domain/index.ts
````typescript

````

## File: src/modules/platform/subdomains/audit-log/domain/repositories/AuditLogRepository.ts
````typescript
import type { AuditLogEntrySnapshot, AuditAction } from "../entities/AuditLogEntry";
⋮----
export interface AuditLogQuery {
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly actorId?: string;
  readonly action?: AuditAction;
  readonly resourceType?: string;
  readonly resourceId?: string;
  readonly fromISO?: string;
  readonly toISO?: string;
  readonly limit?: number;
  readonly offset?: number;
}
⋮----
export interface AuditLogRepository {
  append(snapshot: AuditLogEntrySnapshot): Promise<void>;
  query(params: AuditLogQuery): Promise<AuditLogEntrySnapshot[]>;
}
⋮----
append(snapshot: AuditLogEntrySnapshot): Promise<void>;
query(params: AuditLogQuery): Promise<AuditLogEntrySnapshot[]>;
````

## File: src/modules/platform/subdomains/feature-flag/adapters/inbound/index.ts
````typescript
// inbound adapters for feature-flag subdomain
````

## File: src/modules/platform/subdomains/feature-flag/adapters/index.ts
````typescript

````

## File: src/modules/platform/subdomains/feature-flag/adapters/outbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/feature-flag/adapters/outbound/memory/InMemoryFeatureFlagRepository.ts
````typescript
import type { FeatureFlagSnapshot, FlagScope } from "../../../domain/entities/FeatureFlag";
import type { FeatureFlagRepository, FeatureFlagQuery } from "../../../domain/repositories/FeatureFlagRepository";
⋮----
export class InMemoryFeatureFlagRepository implements FeatureFlagRepository {
⋮----
async save(snapshot: FeatureFlagSnapshot): Promise<void>
⋮----
async findByKey(key: string): Promise<FeatureFlagSnapshot | null>
⋮----
async query(params: FeatureFlagQuery): Promise<FeatureFlagSnapshot[]>
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/platform/subdomains/feature-flag/application/index.ts
````typescript

````

## File: src/modules/platform/subdomains/feature-flag/application/use-cases/FeatureFlagUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { FeatureFlag, type CreateFeatureFlagInput } from "../../domain/entities/FeatureFlag";
import type { FeatureFlagRepository, FeatureFlagQuery } from "../../domain/repositories/FeatureFlagRepository";
⋮----
export class CreateFeatureFlagUseCase {
⋮----
constructor(private readonly repo: FeatureFlagRepository)
⋮----
async execute(input: CreateFeatureFlagInput): Promise<CommandResult>
⋮----
export class ToggleFeatureFlagUseCase {
⋮----
async execute(key: string, enabled: boolean): Promise<CommandResult>
⋮----
export class QueryFeatureFlagsUseCase {
⋮----
async execute(params: FeatureFlagQuery)
⋮----
export class ResolveFeatureFlagUseCase {
⋮----
/** Returns true when the flag is enabled; false when not found or disabled. */
async execute(key: string, hashValue = 0): Promise<boolean>
````

## File: src/modules/platform/subdomains/feature-flag/domain/entities/FeatureFlag.ts
````typescript
/**
 * FeatureFlag — domain entity for controlled feature release.
 *
 * Owned by platform/feature-flag subdomain.
 * Flags gate features per organization, workspace, or actor, enabling
 * incremental rollout without a code deploy.
 */
import { v4 as uuid } from "uuid";
⋮----
export type FlagScope = "global" | "organization" | "workspace" | "actor";
⋮----
export interface FeatureFlagSnapshot {
  readonly id: string;
  readonly key: string;
  readonly enabled: boolean;
  readonly scope: FlagScope;
  /** Fraction 0–100; only evaluated when enabled=true and scope needs rollout. */
  readonly rolloutPercentage: number;
  readonly description?: string;
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly actorId?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
/** Fraction 0–100; only evaluated when enabled=true and scope needs rollout. */
⋮----
export interface CreateFeatureFlagInput {
  readonly key: string;
  readonly enabled?: boolean;
  readonly scope?: FlagScope;
  readonly rolloutPercentage?: number;
  readonly description?: string;
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly actorId?: string;
}
⋮----
export class FeatureFlag {
⋮----
private constructor(private _props: FeatureFlagSnapshot)
⋮----
static create(input: CreateFeatureFlagInput): FeatureFlag
⋮----
static reconstitute(snapshot: FeatureFlagSnapshot): FeatureFlag
⋮----
enable(): void
⋮----
disable(): void
⋮----
setRollout(percentage: number): void
⋮----
/** Returns true when the flag is enabled and the given hash falls within rollout. */
isEnabledFor(hashValue: number): boolean
⋮----
get id(): string
get key(): string
get enabled(): boolean
get rolloutPercentage(): number
get scope(): FlagScope
⋮----
getSnapshot(): Readonly<FeatureFlagSnapshot>
````

## File: src/modules/platform/subdomains/feature-flag/domain/index.ts
````typescript

````

## File: src/modules/platform/subdomains/feature-flag/domain/repositories/FeatureFlagRepository.ts
````typescript
import type { FeatureFlagSnapshot, FlagScope } from "../entities/FeatureFlag";
⋮----
export interface FeatureFlagQuery {
  readonly key?: string;
  readonly scope?: FlagScope;
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly actorId?: string;
  readonly enabledOnly?: boolean;
}
⋮----
export interface FeatureFlagRepository {
  save(snapshot: FeatureFlagSnapshot): Promise<void>;
  findByKey(key: string): Promise<FeatureFlagSnapshot | null>;
  query(params: FeatureFlagQuery): Promise<FeatureFlagSnapshot[]>;
  delete(id: string): Promise<void>;
}
⋮----
save(snapshot: FeatureFlagSnapshot): Promise<void>;
findByKey(key: string): Promise<FeatureFlagSnapshot | null>;
query(params: FeatureFlagQuery): Promise<FeatureFlagSnapshot[]>;
delete(id: string): Promise<void>;
````

## File: src/modules/platform/subdomains/search/application/services/shell-command-catalog.ts
````typescript
export interface ShellCommandCatalogItem {
  readonly href: string;
  readonly label: string;
  readonly group: "導覽" | "Workspace" | "Knowledge" | "AI";
}
⋮----
/**
 * SHELL_COMMAND_CATALOG_ITEMS — global command palette navigation entries.
 *
 * Account-level hrefs (/workspace, /dashboard, /schedule, …) are resolved to
 * /{accountId}/… at runtime via buildShellContextualHref from
 * platform/subdomains/platform-config/application/services/shell-navigation-catalog.
 *
 * Workspace-tab hrefs (/workspace?tab=…) are resolved to
 * /{accountId}/{workspaceId}?tab=… by the same helper.
 *
 * Tab values must stay in sync with WorkspaceTabValue in workspace-nav-model.ts.
 * Route labels must stay in sync with ROUTE_TITLES in shell-navigation-catalog.ts.
 */
⋮----
// ── Account-level routes ──────────────────────────────────────────────────
⋮----
// ── Workspace tabs (workspace group) ─────────────────────────────────────
⋮----
// ── Knowledge tabs (notion group) ────────────────────────────────────────
⋮----
// ── AI tabs (notebooklm group) ────────────────────────────────────────────
⋮----
export function listShellCommandCatalogItems(): readonly ShellCommandCatalogItem[]
````

## File: src/modules/README.md
````markdown
# src/modules

`src/modules/` 是唯一的 bounded-context 實作層。此檔只保留實際目錄索引，避免與各模組文件漂移。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md)
- Strategic authority: [../../docs/README.md](../../docs/README.md)

## Module Index（actual directories）

| Module | Overview | Agent entry | Public boundary | Actual subdomains |
|---|---|---|---|---|
| `ai/` | [README.md](ai/README.md) | [AGENTS.md](ai/AGENTS.md) | [index.ts](ai/index.ts) | `chunk`, `citation`, `context`, `embedding`, `evaluation`, `generation`, `memory`, `pipeline`, `retrieval`, `safety`, `tool-calling` |
| `analytics/` | [README.md](analytics/README.md) | [AGENTS.md](analytics/AGENTS.md) | [index.ts](analytics/index.ts) | `event-contracts`, `event-ingestion`, `event-projection`, `experimentation`, `insights`, `metrics`, `realtime-insights` |
| `billing/` | [README.md](billing/README.md) | [AGENTS.md](billing/AGENTS.md) | [index.ts](billing/index.ts) | `entitlement`, `subscription`, `usage-metering` |
| `iam/` | [README.md](iam/README.md) | [AGENTS.md](iam/AGENTS.md) | [index.ts](iam/index.ts) | `access-control`, `account`, `authentication`, `authorization`, `federation`, `identity`, `organization`, `security-policy`, `session`, `tenant` |
| `notebooklm/` | [README.md](notebooklm/README.md) | [AGENTS.md](notebooklm/AGENTS.md) | [index.ts](notebooklm/index.ts) | `conversation`, `notebook`, `source`, `synthesis` |
| `notion/` | [README.md](notion/README.md) | [AGENTS.md](notion/AGENTS.md) | [index.ts](notion/index.ts) | `block`, `collaboration`, `database`, `knowledge`, `page`, `template`, `view` |
| `platform/` | [README.md](platform/README.md) | [AGENTS.md](platform/AGENTS.md) | [index.ts](platform/index.ts) | `audit-log`, `background-job`, `cache`, `feature-flag`, `file-storage`, `notification`, `platform-config`, `search` |
| `template/` | [README.md](template/README.md) | [AGENTS.md](template/AGENTS.md) | [index.ts](template/index.ts) | `document`, `generation`, `ingestion`, `workflow` |
| `workspace/` | [README.md](workspace/README.md) | [AGENTS.md](workspace/AGENTS.md) | [index.ts](workspace/index.ts) | `activity`, `api-key`, `approval`, `audit`, `feed`, `invitation`, `issue`, `lifecycle`, `membership`, `orchestration`, `quality`, `resource`, `schedule`, `settlement`, `share`, `task`, `task-formation` |

## Pair Contract

- `README.md` 只維護模組層實際索引。
- `AGENTS.md` 提供 AI routing 與 nested index。
- 模組內細節由各自的 `AGENTS.md` / `README.md` 維護。
````

## File: src/modules/template/README.md
````markdown
# Template Module

`src/modules/template/` 是 可複製骨架模組；提供新 bounded context 的結構參考。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Directory Index（actual directories）

- `subdomains/document/`
- `subdomains/generation/`
- `subdomains/ingestion/`
- `subdomains/workflow/`

## Pair Contract

- `README.md` 維護 `src/modules/template/` 的最短概覽與實際目錄索引。
- `AGENTS.md` 維護 agent routing、nested index 與放置決策。
- 若未來新增 / 移除子域，先更新這兩份索引，再補充更細的 module-local 說明。

## Read Next

- [../AGENTS.md](../AGENTS.md)
- [../../../docs/README.md](../../../docs/README.md)
````

## File: src/modules/workspace/adapters/inbound/react/workspace-audit-filter.ts
````typescript
import type { AuditEntrySnapshot } from "../../../subdomains/audit/domain/entities/AuditEntry";
⋮----
export type EventTypeFilter = (typeof AUDIT_EVENT_TYPES)[number];
⋮----
export function matchesAuditEventType(entry: AuditEntrySnapshot, eventType: EventTypeFilter): boolean
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceAuditSection.test.ts
````typescript
import { describe, expect, it } from "vitest";
⋮----
import { matchesAuditEventType } from "./workspace-audit-filter";
import type { AuditEntrySnapshot } from "../../../subdomains/audit/domain/entities/AuditEntry";
⋮----
function buildEntry(partial: Partial<AuditEntrySnapshot>): AuditEntrySnapshot
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceAuditSection.tsx
````typescript
/**
 * WorkspaceAuditSection — workspace.audit tab — activity / audit log.
 */
⋮----
import { Badge, Button } from "@packages";
import { Activity, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createClientAuditUseCases } from "../../outbound/firebase-composition";
import type { AuditEntrySnapshot } from "../../../subdomains/audit/domain/entities/AuditEntry";
import {
  AUDIT_EVENT_TYPES,
  matchesAuditEventType,
  type EventTypeFilter,
} from "./workspace-audit-filter";
⋮----
interface WorkspaceAuditSectionProps {
  workspaceId: string;
  accountId: string;
}
⋮----
{/* Header */}
⋮----
{/* Filter chips */}
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceFilesSection.tsx
````typescript
/**
 * WorkspaceFilesSection — workspace.files tab — file management.
 *
 * Upload flow:
 *   1. Browser picks a file via hidden <input type="file">.
 *   2. uploadWorkspaceFile() sends it to Firebase Storage (client-side).
 *   3. registerUploadedFile() saves metadata to Firestore (client-side helper).
 *   4. listWorkspaceFiles() loads the list on mount / after upload.
 *
 * Delete flow:
 *   1. deleteWorkspaceFile() soft-deletes the Firestore record (sets deletedAtISO).
 *      The Storage object is kept for safety (GCS lifecycle rules handle eventual removal).
 */
⋮----
import { Badge, Button } from "@packages";
import { FolderOpen, Upload, Grid2x2, List, Trash2, FileText, Image, File, RefreshCw, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
⋮----
import {
  uploadWorkspaceFile,
  listWorkspaceFiles,
  registerUploadedFile,
  deleteWorkspaceFile,
} from "@/src/modules/platform/adapters/outbound/firebase-composition";
import type { StoredFile } from "@/src/modules/platform";
⋮----
interface WorkspaceFilesSectionProps {
  workspaceId: string;
  accountId: string;
}
⋮----
// ── Helpers ───────────────────────────────────────────────────────────────────
⋮----
function fileCategoryIcon(mimeType: string)
⋮----
function categoryCounts(files: StoredFile[])
⋮----
function formatBytes(bytes: number): string
⋮----
// ── Component ─────────────────────────────────────────────────────────────────
⋮----
const load = () =>
⋮----
// Auto-load on mount so files are visible without a manual click.
useEffect(() => { load(); }, [workspaceId]); // eslint-disable-line react-hooks/exhaustive-deps
⋮----
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
⋮----
const handleDelete = async (fileId: string) =>
⋮----
{/* Header */}
⋮----
{/* Hidden file input */}
⋮----
{/* Error banner */}
⋮----
{/* Storage summary */}
⋮----
{/* Loading indicator before first load */}
⋮----
{/* Empty state */}
⋮----
{/* File list */}
⋮----
{/* File grid */}
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceTasksSection.tsx
````typescript
/**
 * WorkspaceTasksSection — workspace.tasks tab — task list with status filters.
 */
⋮----
import { Badge, Button } from "@packages";
import { CheckSquare, Loader2, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
⋮----
import {
  listTasksByWorkspaceAction,
  transitionTaskStatusAction,
} from "@/src/modules/workspace/adapters/inbound/server-actions/task-actions";
import { startQualityReviewAction } from "@/src/modules/workspace/adapters/inbound/server-actions/quality-actions";
import { listApprovalDecisionsAction } from "@/src/modules/workspace/adapters/inbound/server-actions/approval-actions";
import type { TaskSnapshot } from "@/src/modules/workspace/subdomains/task/domain/entities/Task";
import type { TaskStatus } from "@/src/modules/workspace/subdomains/task/domain/value-objects/TaskStatus";
⋮----
interface WorkspaceTasksSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}
⋮----
type TaskFilter = "全部" | "待執行" | "進行中" | "已完成" | "已取消";
⋮----
// A task is in "rejection-rework" mode when it has at least one rejected
// decision and no currently-pending decision (pending would mean it is
// already back in the acceptance review queue).
⋮----
const handleRefresh = () =>
⋮----
const handleAdvance = (task: TaskSnapshot) =>
⋮----
// Post-rejection rework: approval previously rejected this task.
// Skip re-QA and send directly back to acceptance for re-review.
⋮----
// Normal first-pass or post-QA-failure path: send through QA.
⋮----
const getActionConfig = (task: TaskSnapshot):
    | { label: string; onClick: () => void; disabled?: boolean }
    | { label: string; href: string }
    | null => {
if (task.status === "draft")
⋮----
// Show "重新送驗" when approval was previously rejected (bypass re-QA);
// show "送交質檢" for the normal first-pass or post-QA-failure path.
````

## File: src/modules/workspace/adapters/inbound/server-actions/settlement-actions.ts
````typescript
import { z } from "zod";
import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { CreateInvoiceSchema, TransitionInvoiceSchema } from "../../../subdomains/settlement/application/dto/SettlementDTO";
import { createClientSettlementUseCases } from "../../outbound/firebase-composition";
import type { InvoiceSnapshot } from "../../../subdomains/settlement/domain/entities/Invoice";
⋮----
// actorId injection from session is pending GAP-05 ADR decision.
// Until platform.AuthAPI.requireAuth() is available, workspaceId membership is
// not verified here — tracked as GAP-05.
⋮----
export async function createInvoiceAction(rawInput: unknown): Promise<CommandResult>
⋮----
export async function createInvoiceFromAcceptedTasksAction(rawInput: unknown): Promise<CommandResult>
⋮----
export async function transitionInvoiceStatusAction(rawInput: unknown): Promise<CommandResult>
⋮----
export async function listInvoicesByWorkspaceAction(workspaceId: string): Promise<InvoiceSnapshot[]>
````

## File: src/modules/workspace/adapters/inbound/server-actions/task-actions.ts
````typescript
import { z } from "zod";
import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { createClientTaskUseCases } from "../../outbound/firebase-composition";
import type { TaskSnapshot } from "../../../subdomains/task/domain/entities/Task";
⋮----
export async function createTaskAction(rawInput: unknown): Promise<CommandResult>
⋮----
export async function updateTaskAction(taskId: string, rawInput: unknown): Promise<CommandResult>
⋮----
export async function transitionTaskStatusAction(taskId: string, rawInput: unknown): Promise<CommandResult>
⋮----
export async function deleteTaskAction(taskId: string): Promise<CommandResult>
⋮----
export async function listTasksByWorkspaceAction(workspaceId: string): Promise<TaskSnapshot[]>
````

## File: src/modules/workspace/AGENTS.md
````markdown
# Workspace Module — Agent Guide

## Purpose

`src/modules/workspace/` 是 工作區協作模組；workspace-workflow 已拆分，現況以子目錄索引為準。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/activity/`
- `subdomains/api-key/`
- `subdomains/approval/`
- `subdomains/audit/`
- `subdomains/feed/`
- `subdomains/invitation/`
- `subdomains/issue/`
- `subdomains/lifecycle/`
- `subdomains/membership/`
- `subdomains/orchestration/`
- `subdomains/quality/`
- `subdomains/resource/`
- `subdomains/schedule/`
- `subdomains/settlement/`
- `subdomains/share/`
- `subdomains/task/`
- `subdomains/task-formation/`

## Route Here When

- 需要在 `src/modules/workspace/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- 身份與權限 → `src/modules/iam/`
- AI mechanism → `src/modules/ai/`
- 跨模組 API → `src/modules/workspace/index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/workspace/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
````

## File: src/modules/workspace/README.md
````markdown
# Workspace Module

`src/modules/workspace/` 是 工作區協作模組；workspace-workflow 已拆分，現況以子目錄索引為準。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Directory Index（actual directories）

- `subdomains/activity/`
- `subdomains/api-key/`
- `subdomains/approval/`
- `subdomains/audit/`
- `subdomains/feed/`
- `subdomains/invitation/`
- `subdomains/issue/`
- `subdomains/lifecycle/`
- `subdomains/membership/`
- `subdomains/orchestration/`
- `subdomains/quality/`
- `subdomains/resource/`
- `subdomains/schedule/`
- `subdomains/settlement/`
- `subdomains/share/`
- `subdomains/task/`
- `subdomains/task-formation/`

## Pair Contract

- `README.md` 維護 `src/modules/workspace/` 的最短概覽與實際目錄索引。
- `AGENTS.md` 維護 agent routing、nested index 與放置決策。
- 若未來新增 / 移除子域，先更新這兩份索引，再補充更細的 module-local 說明。

## Read Next

- [../AGENTS.md](../AGENTS.md)
- [../../../docs/README.md](../../../docs/README.md)
````

## File: src/modules/workspace/subdomains/feed/adapters/inbound/index.ts
````typescript
// Feed server actions have been removed — use client-side helpers from
// workspace/adapters/outbound/firebase-composition.ts instead.
// See feed-actions.ts for the migration note.
````

## File: src/modules/workspace/subdomains/feed/application/dto/FeedDTO.ts
````typescript
import { z } from "zod";
⋮----
export type CreateFeedPostDTO = z.infer<typeof CreateFeedPostSchema>;
⋮----
/** YYYY-MM-DD. Omit to list across all dates (up to limit). */
⋮----
export type ListFeedPostsDTO = z.infer<typeof ListFeedPostsSchema>;
⋮----
/** YYYY-MM-DD. Omit to list across all dates (up to limit). */
⋮----
export type ListAccountFeedPostsDTO = z.infer<typeof ListAccountFeedPostsSchema>;
````

## File: src/modules/workspace/subdomains/feed/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/feed/application/use-cases/FeedUseCases.test.ts
````typescript
import { describe, expect, it } from "vitest";
import {
  ListAccountFeedPostsUseCase,
} from "./FeedUseCases";
import type { FeedPostSnapshot } from "../../domain/entities/FeedPost";
import type { FeedPostRepository } from "../../domain/repositories/FeedPostRepository";
⋮----
class InMemoryFeedPostRepository implements FeedPostRepository {
⋮----
constructor(private readonly posts: FeedPostSnapshot[])
⋮----
async findById(_accountId: string, postId: string): Promise<FeedPostSnapshot | null>
⋮----
async listByWorkspaceId(_accountId: string, workspaceId: string, limit: number): Promise<FeedPostSnapshot[]>
⋮----
async listByWorkspaceIdAndDate(
    _accountId: string,
    workspaceId: string,
    dateKey: string,
    limit: number,
): Promise<FeedPostSnapshot[]>
⋮----
async listByAccountId(accountId: string, limit: number): Promise<FeedPostSnapshot[]>
⋮----
async save(post: FeedPostSnapshot): Promise<void>
⋮----
async incrementCounter(
    _accountId: string,
    _postId: string,
    _field: "likeCount" | "replyCount" | "repostCount" | "viewCount" | "bookmarkCount" | "shareCount",
    _delta: number,
): Promise<void>
⋮----
function buildPost(input: Partial<FeedPostSnapshot>): FeedPostSnapshot
````

## File: src/modules/workspace/subdomains/feed/application/use-cases/FeedUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { FeedPostRepository } from "../../domain/repositories/FeedPostRepository";
import { FeedPost } from "../../domain/entities/FeedPost";
import type { CreateFeedPostInput, FeedPostSnapshot } from "../../domain/entities/FeedPost";
⋮----
export class CreateFeedPostUseCase {
⋮----
constructor(private readonly feedRepo: FeedPostRepository)
⋮----
async execute(input: CreateFeedPostInput): Promise<CommandResult>
⋮----
export class ListFeedPostsUseCase {
⋮----
async execute(input: {
    accountId: string;
    workspaceId: string;
    dateKey?: string;
    limit?: number;
}): Promise<FeedPostSnapshot[]>
⋮----
export class ListAccountFeedPostsUseCase {
⋮----
async execute(input: {
    accountId: string;
    dateKey?: string;
    limit?: number;
}): Promise<FeedPostSnapshot[]>
````

## File: src/modules/workspace/subdomains/issue/application/machines/issueLifecycle.machine.test.ts
````typescript
import { describe, expect, it } from "vitest";
import {
  getIssueTransitionEvents,
  ISSUE_EVENT_LABEL,
  ISSUE_EVENT_TO_STATUS,
} from "./issueLifecycle.machine";
import { canTransitionIssueStatus } from "../../domain/value-objects/IssueStatus";
````

## File: src/modules/workspace/subdomains/issue/application/machines/issueLifecycle.machine.ts
````typescript
import { setup } from "xstate";
import type { IssueStatus } from "../../domain/value-objects/IssueStatus";
⋮----
export interface IssueLifecycleContext {
  readonly issueId: string;
  readonly currentStatus: IssueStatus;
}
⋮----
export type IssueLifecycleEvent =
  | { type: "RESOLVE" }
  | { type: "CLOSE" };
⋮----
/**
 * issueLifecycleMachine — XState FSM modelling the Issue status lifecycle.
 *
 * Matches the domain FSM in IssueStatus.ts:
 *   open / investigating / fixing / retest → resolved
 *   resolved → closed
 */
⋮----
export type IssueLifecycleMachine = typeof issueLifecycleMachine;
⋮----
/** Map from IssueStatus to the XState state name (they are the same here) */
⋮----
/** Derive available transition events for a given status — used by UI button rendering */
export function getIssueTransitionEvents(
  status: IssueStatus,
): IssueLifecycleEvent["type"][]
⋮----
/** Map event type to target IssueStatus for action dispatch */
⋮----
/** Human-readable label for each transition event */
````

## File: src/modules/workspace/subdomains/issue/domain/value-objects/IssueStatus.ts
````typescript
export type IssueStatus =
  | "open"
  | "investigating"
  | "fixing"
  | "retest"
  | "resolved"
  | "closed";
⋮----
export function canTransitionIssueStatus(from: IssueStatus, to: IssueStatus): boolean
⋮----
export function isTerminalIssueStatus(status: IssueStatus): boolean
````

## File: src/modules/workspace/subdomains/membership/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/membership/adapters/outbound/permission/FirestorePermissionCheckAdapter.test.ts
````typescript
import { describe, expect, it } from "vitest";
import { FirestorePermissionCheckAdapter } from "./FirestorePermissionCheckAdapter";
import type { WorkspaceMemberSnapshot } from "../../../domain/entities/WorkspaceMember";
import type { WorkspaceMemberRepository } from "../../../domain/repositories/WorkspaceMemberRepository";
import type { FirestoreLike } from "../firestore/FirestoreMemberRepository";
⋮----
class InMemoryWorkspaceMemberRepository implements WorkspaceMemberRepository {
⋮----
constructor(seed: WorkspaceMemberSnapshot[])
⋮----
async findById(memberId: string): Promise<WorkspaceMemberSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberSnapshot[]>
⋮----
async findByActorAndWorkspace(actorId: string, workspaceId: string): Promise<WorkspaceMemberSnapshot | null>
⋮----
async save(member: WorkspaceMemberSnapshot): Promise<void>
⋮----
async delete(memberId: string): Promise<void>
⋮----
class InMemoryFirestoreLike implements FirestoreLike {
⋮----
constructor(private readonly records: Record<string, Array<Record<string, unknown>>>)
⋮----
async get(_collection: string, _id: string): Promise<Record<string, unknown> | null>
⋮----
async set(_collection: string, _id: string, _data: Record<string, unknown>): Promise<void>
⋮----
async delete(_collection: string, _id: string): Promise<void>
⋮----
async query(collection: string, filters: Array<
⋮----
function activeMember(role: WorkspaceMemberSnapshot["role"]): WorkspaceMemberSnapshot
````

## File: src/modules/workspace/subdomains/membership/adapters/outbound/permission/FirestorePermissionCheckAdapter.ts
````typescript
import type { PermissionCheckInput, PermissionCheckPort } from "../../../application/ports/PermissionCheckPort";
import type { WorkspaceMemberRepository } from "../../../domain/repositories/WorkspaceMemberRepository";
import { WorkspaceRolePolicy, type WorkspaceMembershipAction } from "../../../domain/value-objects/WorkspaceRolePolicy";
import type { FirestoreLike } from "../firestore/FirestoreMemberRepository";
⋮----
interface AccessPolicyRecord {
  readonly action: string;
  readonly effect: "allow" | "deny";
  readonly isActive?: boolean;
}
⋮----
export class FirestorePermissionCheckAdapter implements PermissionCheckPort {
⋮----
constructor(
⋮----
async can(input: PermissionCheckInput): Promise<boolean>
⋮----
private async resolveDynamicDecision(input: PermissionCheckInput): Promise<boolean | null>
⋮----
private toAccessPolicyRecord(record: Record<string, unknown>): AccessPolicyRecord | null
⋮----
private matchesAction(policyAction: string, action: WorkspaceMembershipAction): boolean
````

## File: src/modules/workspace/subdomains/membership/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/membership/application/ports/PermissionCheckPort.ts
````typescript
import type { MemberRole } from "../../domain/entities/WorkspaceMember";
import type { WorkspaceMembershipAction } from "../../domain/value-objects/WorkspaceRolePolicy";
⋮----
export interface PermissionCheckInput {
  readonly actorId: string;
  readonly workspaceId: string;
  readonly action: WorkspaceMembershipAction;
  readonly targetMemberRole?: MemberRole;
  readonly nextRole?: MemberRole;
}
⋮----
export interface PermissionCheckPort {
  can(input: PermissionCheckInput): Promise<boolean>;
}
⋮----
can(input: PermissionCheckInput): Promise<boolean>;
````

## File: src/modules/workspace/subdomains/membership/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/membership/domain/value-objects/WorkspaceRolePolicy.test.ts
````typescript
import { describe, expect, it } from "vitest";
import { WorkspaceRolePolicy } from "./WorkspaceRolePolicy";
````

## File: src/modules/workspace/subdomains/resource/domain/repositories/ResourceQuotaRepository.ts
````typescript
import type {
  ResourceQuotaSnapshot,
  ResourceKind,
} from "../entities/ResourceQuota";
⋮----
export interface ResourceQuotaRepository {
  findById(quotaId: string): Promise<ResourceQuotaSnapshot | null>;
  findByWorkspaceAndKind(workspaceId: string, resourceKind: ResourceKind): Promise<ResourceQuotaSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<ResourceQuotaSnapshot[]>;
  save(quota: ResourceQuotaSnapshot): Promise<void>;
  updateUsage(quotaId: string, current: number, nowISO: string): Promise<void>;
}
⋮----
findById(quotaId: string): Promise<ResourceQuotaSnapshot | null>;
findByWorkspaceAndKind(workspaceId: string, resourceKind: ResourceKind): Promise<ResourceQuotaSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<ResourceQuotaSnapshot[]>;
save(quota: ResourceQuotaSnapshot): Promise<void>;
updateUsage(quotaId: string, current: number, nowISO: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/settlement/adapters/outbound/firestore/FirestoreInvoiceRepository.ts
````typescript
import type { InvoiceRepository } from "../../../domain/repositories/InvoiceRepository";
import type { InvoiceSnapshot } from "../../../domain/entities/Invoice";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(collection: string, filters: Array<
⋮----
/**
 * Backfills default values for fields added after initial schema.
 * Ensures old Firestore documents (missing lineItems/currency/subtotal/taxRate/taxAmount)
 * are read back as valid InvoiceSnapshot without runtime crashes. (Rule 4)
 */
function toInvoiceSnapshot(raw: Record<string, unknown>): InvoiceSnapshot
⋮----
export class FirestoreInvoiceRepository implements InvoiceRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(invoiceId: string): Promise<InvoiceSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<InvoiceSnapshot[]>
⋮----
async save(invoice: InvoiceSnapshot): Promise<void>
⋮----
async delete(invoiceId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/settlement/application/use-cases/CreateInvoiceFromAcceptedTasksUseCase.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { Invoice } from "../../domain/entities/Invoice";
import type { CreateInvoiceFromAcceptedTasksInput } from "../../domain/entities/Invoice";
import type { TaskRepository } from "../../../task/domain/repositories/TaskRepository";
import { InvoiceCalculationService } from "../../domain/services/InvoiceCalculationService";
⋮----
/**
 * CreateInvoiceFromAcceptedTasksUseCase
 *
 * Triggered by the TaskLifecycleSaga when a task reaches `accepted` status.
 * Looks up the accepted tasks, builds LineItems from their unitPrice /
 * contractQuantity fields, and creates a draft invoice with computed totals.
 */
export class CreateInvoiceFromAcceptedTasksUseCase {
⋮----
constructor(
⋮----
async execute(input: CreateInvoiceFromAcceptedTasksInput): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/settlement/domain/entities/Invoice.ts
````typescript
import { v4 as uuid } from "uuid";
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
import { canTransitionInvoiceStatus } from "../value-objects/InvoiceStatus";
import type { InvoiceDomainEventType } from "../events/InvoiceDomainEvent";
import type { LineItem } from "../value-objects/LineItem";
import { InvoiceCalculationService } from "../services/InvoiceCalculationService";
⋮----
export interface InvoiceSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly taskIds: ReadonlyArray<string>;
  readonly status: InvoiceStatus;
  readonly lineItems: ReadonlyArray<LineItem>;
  readonly currency: string;
  readonly subtotal: number;
  readonly taxRate: number;
  readonly taxAmount: number;
  readonly totalAmount: number;
  readonly submittedAtISO: string | null;
  readonly approvedAtISO: string | null;
  readonly paidAtISO: string | null;
  readonly closedAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateInvoiceInput {
  readonly workspaceId: string;
  readonly taskIds?: ReadonlyArray<string>;
}
⋮----
export interface CreateInvoiceFromAcceptedTasksInput {
  readonly workspaceId: string;
  readonly taskIds: ReadonlyArray<string>;
}
⋮----
export class Invoice {
⋮----
private constructor(private _props: InvoiceSnapshot)
⋮----
static create(id: string, input: CreateInvoiceInput): Invoice
⋮----
static reconstitute(snapshot: InvoiceSnapshot): Invoice
⋮----
transition(to: InvoiceStatus): void
⋮----
setLineItems(items: ReadonlyArray<LineItem>): void
⋮----
get id(): string
get status(): InvoiceStatus
⋮----
getSnapshot(): Readonly<InvoiceSnapshot>
⋮----
pullDomainEvents(): InvoiceDomainEventType[]
````

## File: src/modules/workspace/subdomains/settlement/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/settlement/domain/repositories/InvoiceRepository.ts
````typescript
import type { InvoiceSnapshot } from "../entities/Invoice";
⋮----
export interface InvoiceRepository {
  findById(invoiceId: string): Promise<InvoiceSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<InvoiceSnapshot[]>;
  save(invoice: InvoiceSnapshot): Promise<void>;
  delete(invoiceId: string): Promise<void>;
}
⋮----
findById(invoiceId: string): Promise<InvoiceSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<InvoiceSnapshot[]>;
save(invoice: InvoiceSnapshot): Promise<void>;
delete(invoiceId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/settlement/domain/services/InvoiceCalculationService.ts
````typescript
/**
 * InvoiceCalculationService — pure domain service.
 *
 * No framework or I/O dependencies. Computes invoice totals from a list of
 * LineItems and builds LineItem value objects from task data.
 *
 * taxRate defaults to Taiwan's standard VAT of 5%.
 */
import type { LineItem } from "../value-objects/LineItem";
⋮----
export interface InvoiceTotals {
  readonly subtotal: number;
  readonly taxAmount: number;
  readonly totalAmount: number;
}
⋮----
export class InvoiceCalculationService {
⋮----
static fromLineItems(
    lineItems: ReadonlyArray<LineItem>,
    taxRate = 0.05,
): InvoiceTotals
⋮----
static buildLineItem(
    taskId: string,
    description: string,
    unitPrice: number,
    quantity: number,
): LineItem
````

## File: src/modules/workspace/subdomains/settlement/domain/value-objects/LineItem.ts
````typescript
/**
 * LineItem — settlement subdomain value object.
 *
 * Represents one billable entry in an Invoice, derived from an accepted Task.
 * Immutable: netAmount = unitPrice × quantity.
 *
 * Intentionally minimal at this stage — no PO item numbers or penalty fields.
 */
export interface LineItem {
  readonly taskId: string;
  readonly description: string;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly netAmount: number;
}
````

## File: src/modules/workspace/subdomains/task-formation/domain/ports/TaskCandidateExtractorPort.ts
````typescript
import type { ExtractedTaskCandidate, TaskCandidateSource } from "../value-objects/TaskCandidate";
⋮----
export interface ExtractTaskCandidatesInput {
  readonly workspaceId: string;
  readonly sourceType: TaskCandidateSource;
  readonly sourcePageIds: string[];
  readonly sourceText?: string;
}
⋮----
/**
 * TaskCandidateExtractorPort — outbound port for AI-driven task candidate extraction.
 *
 * Implementations live in adapters/outbound/genkit/ (Genkit flow) or
 * adapters/outbound/callable/ (Firebase callable to fn).
 * Use cases depend only on this interface; they never import concrete adapters.
 */
export interface TaskCandidateExtractorPort {
  extract(input: ExtractTaskCandidatesInput): Promise<ExtractedTaskCandidate[]>;
}
⋮----
extract(input: ExtractTaskCandidatesInput): Promise<ExtractedTaskCandidate[]>;
````

## File: src/modules/workspace/subdomains/task/application/dto/TaskDTO.ts
````typescript
import { z } from "zod";
import { TASK_STATUSES } from "../../domain/value-objects/TaskStatus";
⋮----
export type CreateTaskDTO = z.infer<typeof CreateTaskInputSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskInputSchema>;
export type TransitionTaskDTO = z.infer<typeof TransitionTaskInputSchema>;
````

## File: src/modules/workspace/subdomains/task/domain/entities/Task.ts
````typescript
import { v4 as uuid } from "uuid";
import type { TaskStatus } from "../value-objects/TaskStatus";
import { canTransitionTaskStatus } from "../value-objects/TaskStatus";
import type { TaskDomainEventType } from "../events/TaskDomainEvent";
⋮----
export interface SourceReference {
  readonly knowledgePageId: string;
  readonly knowledgePageTitle: string;
  readonly sourceBlockId?: string;
  readonly sourceSnippet?: string;
}
⋮----
export interface TaskSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly assigneeId: string | null;
  readonly dueDateISO: string | null;
  readonly acceptedAtISO: string | null;
  readonly archivedAtISO: string | null;
  readonly sourceReference: SourceReference | null;
  readonly unitPrice: number | null;
  readonly contractQuantity: number | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateTaskInput {
  readonly workspaceId: string;
  readonly title: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
  readonly sourceReference?: SourceReference;
  readonly unitPrice?: number;
  readonly contractQuantity?: number;
}
⋮----
export interface UpdateTaskInput {
  readonly title?: string;
  readonly description?: string;
  readonly assigneeId?: string | null;
  readonly dueDateISO?: string | null;
  readonly unitPrice?: number | null;
  readonly contractQuantity?: number | null;
}
⋮----
export class Task {
⋮----
private constructor(private _props: TaskSnapshot)
⋮----
static create(id: string, input: CreateTaskInput): Task
⋮----
static reconstitute(snapshot: TaskSnapshot): Task
⋮----
update(input: UpdateTaskInput): void
⋮----
transition(to: TaskStatus): void
⋮----
get id(): string
get workspaceId(): string
get title(): string
get description(): string
get status(): TaskStatus
get assigneeId(): string | null
⋮----
getSnapshot(): Readonly<TaskSnapshot>
⋮----
pullDomainEvents(): TaskDomainEventType[]
````

## File: src/README.md
````markdown
# src

`src/` 是 Xuanwu App 的 Next.js 根目錄。這一層只保留最短導航，實際規則往下分流。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Route composition: [app/README.md](app/README.md) / [app/AGENTS.md](app/AGENTS.md)
- Business modules: [modules/README.md](modules/README.md) / [modules/AGENTS.md](modules/AGENTS.md)
- Strategic authority: [docs/README.md](../docs/README.md)

## Pair Contract

- `README.md` 提供最短概覽。
- `AGENTS.md` 提供 AI routing 與 nested index。
````

## File: src/modules/AGENTS.md
````markdown
# src/modules — Agent Guide

## Immediate Index

- Parent: [../AGENTS.md](../AGENTS.md)
- Pair: [README.md](README.md)
- Template baseline: [template/AGENTS.md](template/AGENTS.md)

## Bounded Context Index

| Module | Role | Agent entry | Human overview |
|---|---|---|---|
| `ai/` | AI 機制能力模組；提供 AI mechanism，使用者體驗仍由其他模組組合。 | [AGENTS.md](ai/AGENTS.md) | [README.md](ai/README.md) |
| `analytics/` | 分析能力模組；承接事件、指標、洞察與實驗相關實作。 | [AGENTS.md](analytics/AGENTS.md) | [README.md](analytics/README.md) |
| `billing/` | 計費能力模組；處理 entitlement、subscription、usage-metering。 | [AGENTS.md](billing/AGENTS.md) | [README.md](billing/README.md) |
| `iam/` | Identity & Access Management 模組；account / organization 已集中於此。 | [AGENTS.md](iam/AGENTS.md) | [README.md](iam/README.md) |
| `notebooklm/` | NotebookLM 使用者體驗模組；實際子域以目錄結構為準。 | [AGENTS.md](notebooklm/AGENTS.md) | [README.md](notebooklm/README.md) |
| `notion/` | KnowledgeArtifact 模組；Page / Block / Database 等可寫內容由此所有。 | [AGENTS.md](notion/AGENTS.md) | [README.md](notion/README.md) |
| `platform/` | 平台橫切能力模組；account / organization 已遷入 iam。 | [AGENTS.md](platform/AGENTS.md) | [README.md](platform/README.md) |
| `template/` | 可複製骨架模組；提供新 bounded context 的結構參考。 | [AGENTS.md](template/AGENTS.md) | [README.md](template/README.md) |
| `workspace/` | 工作區協作模組；workspace-workflow 已拆分，現況以子目錄索引為準。 | [AGENTS.md](workspace/AGENTS.md) | [README.md](workspace/README.md) |

## Routing Rules

- 讀 module-local 規則時，先進入對應 `src/modules/<context>/AGENTS.md`。
- 跨模組協作只經由 `src/modules/<context>/index.ts`。
- 子域清單以實際 `subdomains/` 目錄為準，不再在本檔重複維護狀態表。

## Drift Guard

- `AGENTS.md` 管 nested index 與 routing。
- `README.md` 管模組層概覽。
````

## File: src/modules/notebooklm/adapters/inbound/react/NotebooklmAiChatSection.tsx
````typescript
/**
 * NotebooklmAiChatSection — notebooklm.ai-chat tab — RAG Q&A interface.
 * Calls fn rag_query callable via ragQueryAction server action.
 */
⋮----
import { Button, Input } from "@packages";
import { MessageSquare, Send } from "lucide-react";
import { useState, useTransition } from "react";
⋮----
import type { RagQueryOutput } from "../../../adapters/outbound/callable/FirebaseCallableAdapter";
import { callRagQuery } from "../../../adapters/outbound/firebase-composition";
⋮----
interface NotebooklmAiChatSectionProps {
  workspaceId: string;
  accountId: string;
}
⋮----
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: RagQueryOutput["citations"];
}
⋮----
const handleSubmit = () =>
````

## File: src/modules/notebooklm/index.ts
````typescript
/**
 * Notebooklm Module — public API surface.
 * All cross-module consumers must import from here only.
 */
⋮----
// notebook
⋮----
// conversation
⋮----
// source (canonical ubiquitous-language term for ingested document)
⋮----
// synthesis (RAG answer generation)
⋮----
// orchestration — source processing workflow
````

## File: src/modules/notebooklm/subdomains/source/adapters/outbound/firestore/FirestoreIngestionSourceRepository.ts
````typescript
/**
 * FirestoreIngestionSourceRepository — Firestore adapter for the source subdomain.
 *
 * Reads from accounts/{accountId}/documents/{docId}, which is the same collection
 * written by the fn pipeline.  TypeScript side is read-only: fn is the sole writer.
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notebooklm/subdomains/source/adapters/outbound/firestore/
 * which matches the extended outbound glob.
 */
⋮----
import { getFirebaseFirestore, firestoreApi } from "@packages";
import type {
  IngestionSourceSnapshot,
  SourceStatus,
} from "../../../domain/entities/IngestionSource";
import type {
  IngestionSourceRepository,
  IngestionSourceQuery,
} from "../../../domain/repositories/IngestionSourceRepository";
⋮----
// ── Firestore record shape written by fn ──────────────────────────────────────
⋮----
interface PyFnSourceRecord {
  id?: string;
  title?: string;
  status?: string;
  account_id?: string;
  spaceId?: string;
  source?: {
    gcs_uri?: string;
    filename?: string;
    display_name?: string;
    original_filename?: string;
    size_bytes?: number;
    uploaded_at?: { toDate?: () => Date };
    mime_type?: string;
  };
  parsed?: {
    layout_json_gcs_uri?: string;
    form_json_gcs_uri?: string;
    ocr_json_gcs_uri?: string;
    genkit_json_gcs_uri?: string;
    page_count?: number;
    parsed_at?: { toDate?: () => Date };
    extraction_ms?: number;
    layout_chunk_count?: number;
    form_entity_count?: number;
    /** Legacy field written by storage trigger before the split. */
    json_gcs_uri?: string;
    chunk_count?: number;
    entity_count?: number;
  };
  rag?: {
    status?: string;
    chunk_count?: number;
    vector_count?: number;
    embedding_model?: string;
    embedding_dimensions?: number;
    indexed_at?: { toDate?: () => Date };
  };
  error?: {
    message?: string;
    timestamp?: { toDate?: () => Date };
  };
  metadata?: {
    filename?: string;
    display_name?: string;
    space_id?: string;
  };
}
⋮----
/** Legacy field written by storage trigger before the split. */
⋮----
// ── Mapping helpers ───────────────────────────────────────────────────────────
⋮----
function mapPyFnStatus(
  docStatus: string | undefined,
  ragStatus: string | undefined,
): SourceStatus
⋮----
// fn sets status="completed" after a successful parse but before RAG indexing.
⋮----
// TS-side initial write uses status="active" (upload done, not yet parsed).
⋮----
function fromFirestore(
  raw: PyFnSourceRecord,
  docId: string,
): IngestionSourceSnapshot
⋮----
// fn pipeline fields
⋮----
// ── Repository implementation ─────────────────────────────────────────────────
⋮----
export class FirestoreIngestionSourceRepository
implements IngestionSourceRepository
⋮----
async save(_snapshot: IngestionSourceSnapshot): Promise<void>
⋮----
// Intentionally no-op: fn is the sole writer for this collection.
// TypeScript side is read-only.
⋮----
async findById(_id: string): Promise<IngestionSourceSnapshot | null>
⋮----
// findById requires accountId context; use query() for list operations.
⋮----
async findByNotebookId(
    _notebookId: string,
): Promise<IngestionSourceSnapshot[]>
⋮----
// Notebook → source relationship is managed by the Notebook aggregate.
⋮----
async query(
    params: IngestionSourceQuery,
): Promise<IngestionSourceSnapshot[]>
⋮----
async delete(_id: string): Promise<void>
⋮----
// fn manages deletions; TypeScript side does not delete.
````

## File: src/modules/notebooklm/subdomains/source/domain/entities/IngestionSource.ts
````typescript
/**
 * IngestionSource — canonical ubiquitous-language term for a workspace-scoped
 * ingested document in the notebooklm bounded context.
 *
 * "Source" is the strategic name per docs/structure/domain/ubiquitous-language.md.
 * The legacy "document" subdomain has been removed; all consumers now reference
 * IngestionSource and IngestionSourceSnapshot directly.
 */
import { v4 as uuid } from "uuid";
⋮----
export type SourceStatus = "active" | "processing" | "archived" | "deleted";
export type SourceClassification = "image" | "manifest" | "record" | "other";
⋮----
export interface IngestionSourceSnapshot {
  readonly id: string;
  readonly notebookId?: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly accountId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly classification: SourceClassification;
  readonly tags: readonly string[];
  readonly status: SourceStatus;
  readonly storageUrl?: string;
  /** External origin URI (e.g. GCS path, URL) */
  readonly originUri?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
  readonly deletedAtISO?: string;

  // ── fn pipeline status fields ──────────────────────────────────────────────
  /** Layout Parser 解析頁數（由 fn 寫入 Firestore parsed.page_count）*/
  readonly parsedPageCount?: number;
  /** Layout Parser 語意分塊數（由 fn 寫入 Firestore parsed.layout_chunk_count）*/
  readonly parsedLayoutChunkCount?: number;
  /** Form Parser 結構化欄位數（由 fn 寫入 Firestore parsed.form_entity_count）*/
  readonly parsedFormEntityCount?: number;
  /** Layout Parser 解析結果 JSON 的 GCS URI（由 fn 寫入 Firestore parsed.layout_json_gcs_uri）*/
  readonly parsedLayoutJsonGcsUri?: string;
  /** Form Parser 解析結果 JSON 的 GCS URI（由 fn 寫入 Firestore parsed.form_json_gcs_uri）*/
  readonly parsedFormJsonGcsUri?: string;
  /** OCR Parser 解析結果 JSON 的 GCS URI（由 fn 寫入 Firestore parsed.ocr_json_gcs_uri）*/
  readonly parsedOcrJsonGcsUri?: string;
  /** Genkit-AI 解析結果 JSON 的 GCS URI（由 fn 寫入 Firestore parsed.genkit_json_gcs_uri）*/
  readonly parsedGenkitJsonGcsUri?: string;
  /** RAG 索引分塊數（由 fn 寫入 Firestore rag.chunk_count）*/
  readonly ragChunkCount?: number;
  /** RAG 向量數（由 fn 寫入 Firestore rag.vector_count）*/
  readonly ragVectorCount?: number;
  /** RAG 索引狀態（由 fn 寫入 Firestore rag.status: "ready" | "error"）*/
  readonly ragStatus?: string;
  /** fn 解析失敗時的錯誤訊息（由 fn 寫入 Firestore error.message）*/
  readonly errorMessage?: string;
}
⋮----
/** External origin URI (e.g. GCS path, URL) */
⋮----
// ── fn pipeline status fields ──────────────────────────────────────────────
/** Layout Parser 解析頁數（由 fn 寫入 Firestore parsed.page_count）*/
⋮----
/** Layout Parser 語意分塊數（由 fn 寫入 Firestore parsed.layout_chunk_count）*/
⋮----
/** Form Parser 結構化欄位數（由 fn 寫入 Firestore parsed.form_entity_count）*/
⋮----
/** Layout Parser 解析結果 JSON 的 GCS URI（由 fn 寫入 Firestore parsed.layout_json_gcs_uri）*/
⋮----
/** Form Parser 解析結果 JSON 的 GCS URI（由 fn 寫入 Firestore parsed.form_json_gcs_uri）*/
⋮----
/** OCR Parser 解析結果 JSON 的 GCS URI（由 fn 寫入 Firestore parsed.ocr_json_gcs_uri）*/
⋮----
/** Genkit-AI 解析結果 JSON 的 GCS URI（由 fn 寫入 Firestore parsed.genkit_json_gcs_uri）*/
⋮----
/** RAG 索引分塊數（由 fn 寫入 Firestore rag.chunk_count）*/
⋮----
/** RAG 向量數（由 fn 寫入 Firestore rag.vector_count）*/
⋮----
/** RAG 索引狀態（由 fn 寫入 Firestore rag.status: "ready" | "error"）*/
⋮----
/** fn 解析失敗時的錯誤訊息（由 fn 寫入 Firestore error.message）*/
⋮----
export interface RegisterIngestionSourceInput {
  readonly notebookId?: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly accountId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly classification?: SourceClassification;
  readonly tags?: string[];
  readonly storageUrl?: string;
  readonly originUri?: string;
}
⋮----
export class IngestionSource {
⋮----
private constructor(private _props: IngestionSourceSnapshot)
⋮----
static register(input: RegisterIngestionSourceInput): IngestionSource
⋮----
static reconstitute(snapshot: IngestionSourceSnapshot): IngestionSource
⋮----
markReady(): void
⋮----
archive(): void
⋮----
get id(): string
get name(): string
get status(): SourceStatus
get workspaceId(): string
get notebookId(): string | undefined
⋮----
getSnapshot(): Readonly<IngestionSourceSnapshot>
⋮----
pullDomainEvents()
````

## File: src/modules/notion/adapters/inbound/server-actions/database-actions.test.ts
````typescript
import { beforeEach, describe, expect, it, vi } from "vitest";
⋮----
import { createDatabaseAction } from "./database-actions";
````

## File: src/modules/notion/index.ts
````typescript
/**
 * Notion Module — public API surface.
 * All cross-module consumers must import from here only.
 */
⋮----
import type { DatabaseProperty, DatabaseSnapshot } from "./subdomains/database/domain";
import type { PageSnapshot } from "./subdomains/page/domain";
import type { CommandResult } from "../shared";
⋮----
// page
⋮----
// block
⋮----
// database
⋮----
// knowledge (canonical KnowledgeArtifact aggregate)
⋮----
// view
⋮----
// collaboration
⋮----
// template
⋮----
export async function listWorkspaceKnowledgePages(params: {
  accountId: string;
  workspaceId: string;
}): Promise<ReadonlyArray<PageSnapshot>>
⋮----
export async function listWorkspaceKnowledgeDatabases(
  workspaceId: string,
): Promise<ReadonlyArray<DatabaseSnapshot>>
⋮----
export async function addWorkspaceKnowledgeDatabaseProperty(
  databaseId: string,
  property: DatabaseProperty,
): Promise<CommandResult>
````

## File: src/modules/notion/subdomains/page/domain/entities/Page.ts
````typescript
/**
 * Page — distilled from modules/notion/subdomains/knowledge/domain/aggregates/KnowledgePage.ts
 */
import { v4 as uuid } from "uuid";
⋮----
export type PageStatus = "active" | "archived";
⋮----
export interface PageSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly summary?: string;
  readonly sourceLabel?: string;
  readonly slug: string;
  readonly parentPageId: string | null;
  readonly order: number;
  readonly blockIds: readonly string[];
  readonly status: PageStatus;
  readonly ownerId?: string;
  readonly iconUrl?: string;
  readonly coverUrl?: string;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreatePageInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly summary?: string;
  readonly sourceLabel?: string;
  readonly parentPageId?: string | null;
  readonly createdByUserId: string;
  readonly order?: number;
}
⋮----
function slugify(title: string): string
⋮----
export class Page {
⋮----
private constructor(private _props: PageSnapshot)
⋮----
static create(input: CreatePageInput): Page
⋮----
static reconstitute(snapshot: PageSnapshot): Page
⋮----
rename(title: string): void
⋮----
appendBlock(blockId: string): void
⋮----
archive(): void
⋮----
get id(): string
get title(): string
get summary(): string | undefined
get sourceLabel(): string | undefined
get slug(): string
get status(): PageStatus
get blockIds(): readonly string[]
get parentPageId(): string | null
⋮----
getSnapshot(): Readonly<PageSnapshot>
⋮----
pullDomainEvents()
````

## File: src/modules/platform/subdomains/audit-log/application/use-cases/AuditLogUseCases.ts
````typescript
import {
  AuditLogEntry,
  type AuditLogEntrySnapshot,
  type RecordAuditEntryInput,
} from "../../domain/entities/AuditLogEntry";
import type { AuditLogRepository, AuditLogQuery } from "../../domain/repositories/AuditLogRepository";
⋮----
export class RecordAuditEntryUseCase {
⋮----
constructor(private readonly repo: AuditLogRepository)
⋮----
async execute(input: RecordAuditEntryInput): Promise<AuditLogEntrySnapshot>
⋮----
export class QueryAuditLogUseCase {
⋮----
async execute(params: AuditLogQuery): Promise<AuditLogEntrySnapshot[]>
````

## File: src/modules/platform/subdomains/platform-config/application/services/shell-navigation-catalog.ts
````typescript
// ── Types ──────────────────────────────────────────────────────────────────────
⋮----
export type ShellNavSection =
  | "workspace"
  | "dashboard"
  | "account"
  | "schedule"
  | "daily"
  | "audit"
  | "members"
  | "teams"
  | "permissions"
  | "organization"
  | "other";
⋮----
export interface ShellNavItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}
⋮----
export interface ShellRailCatalogItem {
  readonly id: string;
  readonly href: string;
  readonly label: string;
  /** If true, this item is only visible to organization accounts. */
  readonly requiresOrganization: boolean;
  /** Route prefix for active-state matching. When absent, defaults to href. */
  readonly activeRoutePrefix?: string;
}
⋮----
/** If true, this item is only visible to organization accounts. */
⋮----
/** Route prefix for active-state matching. When absent, defaults to href. */
⋮----
export interface ShellContextSectionConfig {
  readonly title: string;
  readonly items: readonly { href: string; label: string }[];
}
⋮----
export interface ShellRouteContext {
  readonly accountId?: string | null;
  readonly workspaceId?: string | null;
}
⋮----
function parseHref(href: string):
⋮----
function joinHref(path: string, query: string): string
⋮----
function isAccountScopedWorkspacePath(pathname: string): boolean
⋮----
export function normalizeShellRoutePath(pathname: string): string
⋮----
export function buildShellContextualHref(
  href: string,
  context: ShellRouteContext,
): string
⋮----
// ── Route-matching utility ────────────────────────────────────────────────────
⋮----
export function isExactOrChildPath(targetPath: string, pathname: string): boolean
⋮----
// ── Account section matchers ──────────────────────────────────────────────────
⋮----
// ── Route titles & breadcrumb labels ──────────────────────────────────────────
⋮----
// Workspace tabs (query-param based, resolved via workspace:${tab} key in resolveShellPageTitle)
// workspace group
⋮----
// notion group
⋮----
// notebooklm group
⋮----
// ── Organization management items ─────────────────────────────────────────────
⋮----
// ── Account nav items ─────────────────────────────────────────────────────────
⋮----
// ── Section labels ────────────────────────────────────────────────────────────
⋮----
// ── Rail catalog ──────────────────────────────────────────────────────────────
⋮----
export function listShellRailCatalogItems(isOrganization: boolean): readonly ShellRailCatalogItem[]
⋮----
// ── Context section config ────────────────────────────────────────────────────
⋮----
// ── Mobile & organization nav items ───────────────────────────────────────────
⋮----
// ── Section resolvers ─────────────────────────────────────────────────────────
⋮----
export function resolveShellNavSection(pathname: string): ShellNavSection
⋮----
export function resolveShellPageTitle(pathname: string, tab?: string | null): string
⋮----
export function resolveShellBreadcrumbLabel(segment: string): string
````

## File: src/modules/template/AGENTS.md
````markdown
# Template Module — Agent Guide

## Purpose

`src/modules/template/` 是 可複製骨架模組；提供新 bounded context 的結構參考。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/document/`
- `subdomains/generation/`
- `subdomains/ingestion/`
- `subdomains/workflow/`

## Route Here When

- 需要在 `src/modules/template/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- 真實業務實作 → `src/modules/<context>/`
- 共享套件 → `packages/`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/template/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
````

## File: src/modules/workspace/adapters/inbound/react/account-scoped-workspace.ts
````typescript
import type { WorkspaceEntity } from "./WorkspaceContext";
⋮----
interface ResolveAccountScopedWorkspaceIdInput {
  readonly accountId: string | null;
  readonly activeWorkspaceId: string | null;
  readonly workspaces: Record<string, WorkspaceEntity>;
}
⋮----
export function resolveAccountScopedWorkspaceId({
  accountId,
  activeWorkspaceId,
  workspaces,
}: ResolveAccountScopedWorkspaceIdInput): string | null
````

## File: src/modules/workspace/adapters/inbound/react/AccountRouteDispatcher.test.ts
````typescript
import { describe, expect, it } from "vitest";
⋮----
import { resolveAccountScopedWorkspaceId } from "./account-scoped-workspace";
import type { WorkspaceEntity } from "./WorkspaceContext";
⋮----
function buildWorkspace(
  id: string,
  name: string,
  accountId: string,
  accountType: "user" | "organization" = "organization",
): WorkspaceEntity
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceAccountDailySection.tsx
````typescript
import { Badge } from "@packages";
import { CalendarDays, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { listAccountFeedPosts } from "../../../adapters/outbound/firebase-composition";
import type { FeedPostSnapshot } from "../../../subdomains/feed/domain/entities/FeedPost";
import { useWorkspaceContext } from "./WorkspaceContext";
⋮----
interface WorkspaceAccountDailySectionProps {
  accountId: string;
}
⋮----
function toDateKey(date: Date): string
⋮----
function formatDateLabel(date: Date): string
⋮----
function addDays(date: Date, delta: number): Date
⋮----
setLoading(true);
setActiveDate((d)
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceDailySection.tsx
````typescript
/**
 * WorkspaceDailySection — workspace.daily tab.
 *
 * IG-style daily post feed at the workspace level.
 * Members can post text and attach photos for a given date.
 * Future expansion: today's task completion summary, attendance check-in.
 *
 * Layout:
 *   ① Date navigation bar
 *   ② Post composer (text + photo upload)
 *   ③ Feed — chronological post cards
 */
⋮----
import { Badge, Button, Textarea } from "@packages";
import { useState, useEffect, useRef, useTransition } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
  Upload,
  X,
} from "lucide-react";
import {
  uploadWorkspaceFile,
  getWorkspaceFileDownloadUrl,
} from "@/src/modules/platform";
⋮----
import {
  listFeedPosts,
  createFeedPost as createFeedPostClient,
} from "../../../adapters/outbound/firebase-composition";
import type { FeedPostSnapshot } from "../../../subdomains/feed/domain/entities/FeedPost";
⋮----
interface WorkspaceDailySectionProps {
  workspaceId: string;
  accountId: string;
  /** Current actor's accountId used as authorAccountId. Defaults to accountId. */
  currentUserId?: string;
}
⋮----
/** Current actor's accountId used as authorAccountId. Defaults to accountId. */
⋮----
// ── Helpers ───────────────────────────────────────────────────────────────────
⋮----
function toDateKey(date: Date): string
⋮----
return date.toISOString().slice(0, 10); // YYYY-MM-DD
⋮----
function formatDateLabel(date: Date): string
⋮----
function addDays(date: Date, delta: number): Date
⋮----
function isToday(date: Date): boolean
⋮----
function formatTime(isoString: string): string
⋮----
// ── Post card ─────────────────────────────────────────────────────────────────
⋮----
{/* Header */}
⋮----
{/* Content */}
⋮----
// eslint-disable-next-line @next/next/no-img-element
⋮----
// ── Composer ──────────────────────────────────────────────────────────────────
⋮----
{/* Photo upload */}
⋮----
{/* Photo previews */}
⋮----
{/* eslint-disable-next-line @next/next/no-img-element */}
⋮----
onClick=
⋮----
// ── Main export ────────────────────────────────────────────────────────────────
⋮----
async function loadPosts()
⋮----
// Sort newest-first
⋮----
// eslint-disable-next-line react-hooks/exhaustive-deps
⋮----
{/* ① Date navigation */}
⋮----
{/* Date label for mobile */}
⋮----
{/* ② Composer (today only) */}
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceSettlementSection.tsx
````typescript
/**
 * WorkspaceSettlementSection — workspace.settlement tab — invoice settlement.
 */
⋮----
import { Badge, Button } from "@packages";
import { Calculator, Loader2, ArrowRightLeft, Wallet } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { createActor } from "xstate";
⋮----
import {
  createInvoiceFromAcceptedTasksAction,
  listInvoicesByWorkspaceAction,
  transitionInvoiceStatusAction,
} from "@/src/modules/workspace/adapters/inbound/server-actions/settlement-actions";
import { listTasksByWorkspaceAction } from "@/src/modules/workspace/adapters/inbound/server-actions/task-actions";
import type { InvoiceSnapshot } from "@/src/modules/workspace/subdomains/settlement/domain/entities/Invoice";
import type { InvoiceStatus } from "@/src/modules/workspace/subdomains/settlement/domain/value-objects/InvoiceStatus";
import type { TaskSnapshot } from "@/src/modules/workspace/subdomains/task/domain/entities/Task";
import { settlementLifecycleMachine } from "@/src/modules/workspace/subdomains/orchestration/application/machines/settlement-lifecycle.machine";
⋮----
interface WorkspaceSettlementSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}
⋮----
function resolveNextStatus(invoice: InvoiceSnapshot, eventType: "ADVANCE" | "ROLLBACK"): InvoiceStatus | null
⋮----
const handleCreateInvoice = () =>
⋮----
const handleTransition = (invoice: InvoiceSnapshot, eventType: "ADVANCE" | "ROLLBACK") =>
````

## File: src/modules/workspace/adapters/inbound/server-actions/membership-actions.ts
````typescript
import { z } from "zod";
import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { createClientMembershipController, createClientMembershipUseCases } from "../../outbound/firebase-composition";
import { MEMBER_ROLES } from "../../../subdomains/membership/domain/entities/WorkspaceMember";
⋮----
export async function addMemberAction(rawInput: unknown): Promise<CommandResult>
⋮----
export async function changeMemberRoleAction(rawInput: unknown): Promise<CommandResult>
⋮----
export async function removeMemberAction(rawInput: unknown): Promise<CommandResult>
⋮----
export async function listMembersAction(rawInput: unknown)
````

## File: src/modules/workspace/subdomains/feed/adapters/inbound/server-actions/feed-actions.ts
````typescript
/**
 * feed-actions — workspace/feed inbound server actions.
 *
 * NOTE: All feed Firestore operations have been moved to client-side helpers
 * in workspace/adapters/outbound/firebase-composition.ts.
 *
 * The Firebase Web Client SDK requires a signed-in user session in the browser.
 * Server Actions executing Firestore reads/writes via the web SDK have no user
 * auth context → Security Rules block every operation with
 * "Missing or insufficient permissions".
 *
 * Use listFeedPosts(), createFeedPost(), listAccountFeedPosts() from
 * workspace/adapters/outbound/firebase-composition instead.
 */
````

## File: src/modules/workspace/subdomains/membership/adapters/inbound/http/MembershipController.ts
````typescript
import type { WorkspaceMemberRepository } from "../../../domain/repositories/WorkspaceMemberRepository";
import type { AddMemberInput, MemberRole } from "../../../domain/entities/WorkspaceMember";
import { AddMemberUseCase, ChangeMemberRoleUseCase, RemoveMemberUseCase } from "../../../application/use-cases/MembershipUseCases";
import type { PermissionCheckPort } from "../../../application/ports/PermissionCheckPort";
import type { CommandResult } from "../../../../../../shared";
⋮----
export class MembershipController {
⋮----
constructor(
    memberRepo: WorkspaceMemberRepository,
    permissionCheck: PermissionCheckPort,
)
⋮----
async add(actorId: string, input: AddMemberInput): Promise<CommandResult>
⋮----
async changeRole(actorId: string, memberId: string, role: MemberRole): Promise<CommandResult>
⋮----
async remove(actorId: string, memberId: string): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/membership/application/use-cases/MembershipUseCases.test.ts
````typescript
import { describe, expect, it } from "vitest";
import { AddMemberUseCase, ChangeMemberRoleUseCase, RemoveMemberUseCase } from "./MembershipUseCases";
import type { WorkspaceMemberSnapshot } from "../../domain/entities/WorkspaceMember";
import type { WorkspaceMemberRepository } from "../../domain/repositories/WorkspaceMemberRepository";
import type { PermissionCheckInput, PermissionCheckPort } from "../ports/PermissionCheckPort";
⋮----
class InMemoryWorkspaceMemberRepository implements WorkspaceMemberRepository {
⋮----
constructor(seed: WorkspaceMemberSnapshot[] = [])
⋮----
async findById(memberId: string): Promise<WorkspaceMemberSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberSnapshot[]>
⋮----
async findByActorAndWorkspace(actorId: string, workspaceId: string): Promise<WorkspaceMemberSnapshot | null>
⋮----
async save(member: WorkspaceMemberSnapshot): Promise<void>
⋮----
async delete(memberId: string): Promise<void>
⋮----
class InMemoryPermissionCheckPort implements PermissionCheckPort {
⋮----
constructor(private readonly checker: (input: PermissionCheckInput) => boolean)
⋮----
async can(input: PermissionCheckInput): Promise<boolean>
⋮----
function createActiveMember(
  overrides: Partial<WorkspaceMemberSnapshot> & Pick<WorkspaceMemberSnapshot, "id" | "workspaceId" | "actorId">,
): WorkspaceMemberSnapshot
````

## File: src/modules/workspace/subdomains/membership/application/use-cases/MembershipUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { WorkspaceMemberRepository } from "../../domain/repositories/WorkspaceMemberRepository";
import { WorkspaceMember } from "../../domain/entities/WorkspaceMember";
import type { AddMemberInput, MemberRole } from "../../domain/entities/WorkspaceMember";
import type { PermissionCheckPort } from "../ports/PermissionCheckPort";
⋮----
export class AddMemberUseCase {
⋮----
constructor(
⋮----
async execute(actorId: string, input: AddMemberInput): Promise<CommandResult>
⋮----
export class ChangeMemberRoleUseCase {
⋮----
async execute(actorId: string, memberId: string, role: MemberRole): Promise<CommandResult>
⋮----
export class RemoveMemberUseCase {
⋮----
async execute(actorId: string, memberId: string): Promise<CommandResult>
⋮----
export class ListWorkspaceMembersUseCase {
⋮----
constructor(private readonly memberRepo: WorkspaceMemberRepository)
⋮----
async execute(workspaceId: string)
````

## File: src/modules/workspace/subdomains/membership/domain/value-objects/WorkspaceRolePolicy.ts
````typescript
import type { MemberRole } from "../entities/WorkspaceMember";
⋮----
export type WorkspaceMembershipAction = typeof WORKSPACE_MEMBERSHIP_ACTIONS[number];
⋮----
export class WorkspaceRolePolicy {
⋮----
constructor(
⋮----
can(role: MemberRole, action: WorkspaceMembershipAction): boolean
⋮----
canChangeRole(actorRole: MemberRole, targetRole: MemberRole, nextRole: MemberRole): boolean
⋮----
canRemove(actorRole: MemberRole, targetRole: MemberRole): boolean
````

## File: src/modules/workspace/subdomains/task-formation/adapters/outbound/callable/FirebaseCallableTaskCandidateExtractor.test.ts
````typescript
import { describe, expect, it } from "vitest";
import { FirebaseCallableTaskCandidateExtractor } from "./FirebaseCallableTaskCandidateExtractor";
⋮----
// Minimal AP8 PO dense text excerpt mimicking Document AI OCR output.
// Format: {item_no} 3RDTW{code} SET {price}...小計{total}（{section_numeral}）{description}
````

## File: src/modules/notion/adapters/inbound/react/NotionTemplatesSection.tsx
````typescript
/**
 * NotionTemplatesSection — notion.templates tab — template library.
 * Auto-loads on mount. Supports creating new workspace-scoped templates.
 */
⋮----
import { Button, Input } from "@packages";
import { Layout, Plus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
⋮----
import type { Template, TemplateCategory } from "../../../subdomains/template/domain/entities/Template";
import { queryTemplatesAction, createTemplateAction } from "../server-actions/template-actions";
⋮----
interface NotionTemplatesSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId: string;
}
⋮----
const load = () =>
⋮----
// Auto-load on mount
⋮----
}, [workspaceId, accountId]); // eslint-disable-line react-hooks/exhaustive-deps
⋮----
const handleCreate = () =>
````

## File: src/modules/notion/adapters/inbound/server-actions/database-actions.ts
````typescript
/**
 * database-actions — notion database server actions.
 */
⋮----
import { z } from "zod";
import { createClientNotionDatabaseUseCases } from "../../outbound/firebase-composition";
⋮----
// ── Input schemas ─────────────────────────────────────────────────────────────
⋮----
// ── Actions ───────────────────────────────────────────────────────────────────
⋮----
export async function queryDatabasesAction(rawInput: unknown)
⋮----
export async function createDatabaseAction(rawInput: unknown)
````

## File: src/modules/notion/subdomains/database/domain/entities/Database.ts
````typescript
/**
 * Database — distilled from modules/notion/subdomains/knowledge/domain/aggregates/KnowledgeCollection.ts
 * Represents a structured collection of pages with typed properties (Notion-style database).
 */
import { v4 as uuid } from "uuid";
⋮----
export type PropertyType = "text" | "number" | "select" | "multi_select" | "date" | "checkbox" | "url" | "email" | "file" | "relation";
⋮----
export interface DatabaseProperty {
  readonly id: string;
  readonly name: string;
  readonly type: PropertyType;
  readonly options?: string[];
}
⋮----
export type DatabaseStatus = "active" | "archived";
⋮----
export interface DatabaseSnapshot {
  readonly id: string;
  readonly parentPageId: string | null;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly properties: DatabaseProperty[];
  readonly status: DatabaseStatus;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateDatabaseInput {
  readonly parentPageId?: string | null;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly properties?: DatabaseProperty[];
  readonly createdByUserId: string;
}
⋮----
export class Database {
⋮----
private constructor(private _props: DatabaseSnapshot)
⋮----
private static createDefaultProperty(): DatabaseProperty
⋮----
static create(input: CreateDatabaseInput): Database
⋮----
static reconstitute(snapshot: DatabaseSnapshot): Database
⋮----
addProperty(property: DatabaseProperty): void
⋮----
get id(): string
get title(): string
get parentPageId(): string | null
get properties(): DatabaseProperty[]
⋮----
getSnapshot(): Readonly<DatabaseSnapshot>
````

## File: src/modules/notion/subdomains/page/adapters/outbound/firestore/FirestorePageRepository.ts
````typescript
/**
 * FirestorePageRepository — Firestore adapter for the page subdomain.
 *
 * Collection: contentPages (top-level, matching firestore.indexes.json collectionGroup)
 * Each document stores a PageSnapshot directly.
 *
 * MUST be called from a client component, NOT from a Server Action.
 * The Firebase Web Client SDK requires a signed-in user in the browser context
 * so that Firestore Security Rules can evaluate request.auth.
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notion/subdomains/page/adapters/outbound/firestore/
 * which matches the extended outbound glob.
 */
⋮----
import { getFirebaseFirestore, firestoreApi, z } from "@packages";
import type { PageSnapshot, PageStatus } from "../../../domain/entities/Page";
import type { PageRepository, PageQuery } from "../../../domain/repositories/PageRepository";
⋮----
// ── Level 3 Zod schema: validates Firestore output at the adapter boundary ────
⋮----
function toSnapshot(raw: unknown): PageSnapshot
⋮----
export class FirestorePageRepository implements PageRepository {
⋮----
async save(snapshot: PageSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<PageSnapshot | null>
⋮----
async findBySlug(slug: string, accountId: string): Promise<PageSnapshot | null>
⋮----
async findChildren(parentPageId: string): Promise<PageSnapshot[]>
⋮----
async query(params: PageQuery): Promise<PageSnapshot[]>
⋮----
// Build equality constraints — no composite index required for equality-only filters.
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceMembersSection.tsx
````typescript
/**
 * WorkspaceMembersSection — workspace.members tab — team member list.
 */
⋮----
import { Badge, Button } from "@packages";
import { Users, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createClientMembershipUseCases } from "../../outbound/firebase-composition";
import type { WorkspaceMemberSnapshot } from "../../../subdomains/membership/domain/entities/WorkspaceMember";
import {
  addMemberAction,
  changeMemberRoleAction,
} from "../server-actions/membership-actions";
⋮----
interface WorkspaceMembersSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}
⋮----
async function loadMembers(): Promise<void>
⋮----
async function handleInviteMember(): Promise<void>
⋮----
// TODO(workspace-membership): replace this fallback with IAM directory lookup (email -> actorId).
// Temporary mapping: use normalized email as target actor identity.
⋮----
async function handleRoleChange(memberId: string, nextRole: "owner" | "admin" | "member"): Promise<void>
⋮----
{/* Header */}
⋮----
{/* Role filter */}
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceScheduleSection.test.ts
````typescript
import { describe, expect, it } from "vitest";
⋮----
import { parseLocalDatetimeInput, toLocalDatetimeInputValue } from "./workspace-schedule-datetime";
````

## File: src/modules/workspace/subdomains/lifecycle/application/use-cases/WorkspaceLifecycleUseCases.test.ts
````typescript
import { describe, expect, it } from 'vitest';
import {
  CreateWorkspaceUseCase,
  CreateWorkspaceWithOwnerUseCase,
} from './WorkspaceLifecycleUseCases';
import type { WorkspaceSnapshot } from '../../domain/entities/Workspace';
import type { WorkspaceRepository } from '../../domain/repositories/WorkspaceRepository';
import type { WorkspaceMemberSnapshot } from '../../../membership/domain/entities/WorkspaceMember';
import type { WorkspaceMemberRepository } from '../../../membership/domain/repositories/WorkspaceMemberRepository';
import type { AuditEntrySnapshot } from '../../../audit/domain/entities/AuditEntry';
import type { AuditRepository } from '../../../audit/domain/repositories/AuditRepository';
⋮----
class InMemoryWorkspaceRepository implements WorkspaceRepository {
⋮----
async findById(workspaceId: string): Promise<WorkspaceSnapshot | null>
⋮----
async findByAccountId(accountId: string): Promise<WorkspaceSnapshot[]>
⋮----
async save(workspace: WorkspaceSnapshot): Promise<void>
⋮----
async delete(workspaceId: string): Promise<void>
⋮----
class InMemoryWorkspaceRepositoryWithDeleteFailure extends InMemoryWorkspaceRepository {
⋮----
async delete(_workspaceId: string): Promise<void>
⋮----
class InMemoryWorkspaceMemberRepository implements WorkspaceMemberRepository {
⋮----
async findById(memberId: string): Promise<WorkspaceMemberSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberSnapshot[]>
⋮----
async findByActorAndWorkspace(actorId: string, workspaceId: string): Promise<WorkspaceMemberSnapshot | null>
⋮----
async save(member: WorkspaceMemberSnapshot): Promise<void>
⋮----
async delete(memberId: string): Promise<void>
⋮----
class InMemoryAuditRepository implements AuditRepository {
⋮----
async save(entry: AuditEntrySnapshot): Promise<void>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<AuditEntrySnapshot[]>
⋮----
async findByWorkspaceIds(workspaceIds: string[]): Promise<AuditEntrySnapshot[]>
⋮----
async save(): Promise<void>
````

## File: src/modules/notebooklm/adapters/outbound/callable/FirebaseCallableAdapter.ts
````typescript
/**
 * FirebaseCallableAdapter — HTTPS Callable bridge to fn.
 *
 * Wraps Firebase Cloud Function callables for:
 *   - rag_query  (RAG retrieval + generation)
 *   - parse_document (manual trigger for document parsing)
 *   - rag_reindex_document (re-embed a document)
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notebooklm/adapters/outbound/callable/
 * which matches src/modules/<context>/adapters/outbound/**.
 */
⋮----
import { getFirebaseFunctions, httpsCallable } from "@packages";
⋮----
// ── Input / output contracts ──────────────────────────────────────────────────
⋮----
export interface RagQueryInput {
  readonly account_id: string;
  readonly workspace_id: string;
  readonly query: string;
  readonly top_k?: number;
}
⋮----
export interface RagQueryCitation {
  readonly doc_id: string;
  readonly chunk_id: string;
  readonly filename: string;
  readonly score: number;
}
⋮----
export interface RagQueryOutput {
  readonly answer: string;
  readonly citations: RagQueryCitation[];
  readonly cache: "hit" | "miss";
  readonly vector_hits: number;
  readonly search_hits: number;
}
⋮----
export interface ParseDocumentInput {
  readonly account_id: string;
  readonly workspace_id: string;
  readonly gcs_uri: string;
  readonly doc_id?: string;
  readonly filename?: string;
  readonly mime_type?: string;
  readonly size_bytes?: number;
  /** When true fn also runs RAG ingestion after parse. Defaults to true in fn. */
  readonly run_rag?: boolean;
  /** Parser variant: "layout" | "form" | "ocr" | "genkit". Defaults to "layout" in fn. */
  readonly parser?: "layout" | "form" | "ocr" | "genkit";
}
⋮----
/** When true fn also runs RAG ingestion after parse. Defaults to true in fn. */
⋮----
/** Parser variant: "layout" | "form" | "ocr" | "genkit". Defaults to "layout" in fn. */
⋮----
export interface ParseDocumentOutput {
  readonly doc_id: string;
  readonly account_scope: string;
  readonly status: string;
}
⋮----
export interface ReindexDocumentInput {
  readonly account_id: string;
  readonly doc_id: string;
  /** GCS URI of the parsed JSON file (gs://bucket/files/…json). Required by fn. */
  readonly json_gcs_uri: string;
}
⋮----
/** GCS URI of the parsed JSON file (gs://bucket/files/…json). Required by fn. */
⋮----
// ── Callable wrappers ─────────────────────────────────────────────────────────
⋮----
export async function callRagQuery(input: RagQueryInput): Promise<RagQueryOutput>
⋮----
export async function callParseDocument(input: ParseDocumentInput): Promise<ParseDocumentOutput>
⋮----
export async function callReindexDocument(input: ReindexDocumentInput): Promise<void>
````

## File: src/modules/notion/adapters/inbound/react/NotionPagesSection.tsx
````typescript
/**
 * NotionPagesSection — notion.pages tab — workspace knowledge pages.
 *
 * This surface is intentionally "Notion-like" rather than a full Notion API
 * clone. Pages carry lightweight workspace knowledge context that can be
 * forwarded into workspace.task-formation as a concrete source reference.
 */
⋮----
import { Button, Input } from "@packages";
import { FileText, Plus, ListPlus, Pencil, Archive } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
⋮----
import type { PageSnapshot } from "../../../subdomains/page/domain/entities/Page";
import {
  queryPages,
  createPage,
  renamePage,
  archivePage,
} from "../../../adapters/outbound/firebase-composition";
⋮----
interface NotionPagesSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId: string;
}
⋮----
function taskFormationHref(accountId: string, workspaceId: string, pageId: string)
⋮----
const reloadPages = async () =>
⋮----
const load = () =>
⋮----
}, [workspaceId, accountId]); // eslint-disable-line react-hooks/exhaustive-deps
⋮----
const handleCreate = () =>
⋮----
const handleStartRename = (page: PageSnapshot) =>
⋮----
const handleRename = (pageId: string) =>
⋮----
const handleArchive = (pageId: string) =>
⋮----
href=
````

## File: src/modules/notion/subdomains/database/adapters/outbound/firestore/FirestoreDatabaseRepository.ts
````typescript
/**
 * FirestoreDatabaseRepository — Firestore adapter for the database subdomain.
 *
 * Collection: knowledgeDatabases (top-level, matching firestore.indexes.json collectionGroup)
 * Each document stores a DatabaseSnapshot directly.
 *
 * MUST be called from a client component, NOT from a Server Action.
 * The Firebase Web Client SDK requires a signed-in user in the browser context
 * so that Firestore Security Rules can evaluate request.auth.
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notion/subdomains/database/adapters/outbound/firestore/
 * which matches the extended outbound glob.
 */
⋮----
import { getFirebaseFirestore, firestoreApi, z } from "@packages";
import type { DatabaseSnapshot } from "../../../domain/entities/Database";
import type { DatabaseRepository } from "../../../domain/repositories/DatabaseRepository";
⋮----
// ── Level 3 Zod schema: validates Firestore output at the adapter boundary ────
⋮----
function toSnapshot(raw: unknown): DatabaseSnapshot
⋮----
export class FirestoreDatabaseRepository implements DatabaseRepository {
⋮----
async save(snapshot: DatabaseSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<DatabaseSnapshot | null>
⋮----
async findByParentPageId(parentPageId: string): Promise<DatabaseSnapshot[]>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<DatabaseSnapshot[]>
⋮----
async delete(id: string): Promise<void>
````

## File: src/modules/workspace/adapters/inbound/react/AccountRouteDispatcher.tsx
````typescript
/**
 * AccountRouteDispatcher — workspace inbound adapter (React).
 *
 * Receives accountId + slug props from the Server Component shim and
 * dispatches to the appropriate route screen.
 *
 * Ported from: app/(shell)/(account)/[accountId]/[[...slug]]/page.tsx
 */
⋮----
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
⋮----
import { useAuth } from "../../../../iam/adapters/inbound/react/AuthContext";
import {
  useAccountRouteContext,
  OrganizationMembersRouteScreen,
  OrganizationOverviewRouteScreen,
  OrganizationPermissionsRouteScreen,
  AccountDashboardRouteScreen,
  OrganizationWorkspacesRouteScreen,
  OrganizationTeamsRouteScreen,
  OrganizationDispatcherRouteScreen,
  OrganizationDailyRouteScreen,
  OrganizationAuditRouteScreen,
  SettingsNotificationsRouteScreen,
} from "../../../../platform/adapters/inbound/react/platform-ui-stubs";
import { useApp } from "../../../../platform/adapters/inbound/react/AppContext";
import {
  WorkspaceDetailRouteScreen,
  WorkspaceHubScreen,
} from "./workspace-ui-stubs";
import { WorkspaceAuditSection } from "./WorkspaceAuditSection";
import { WorkspaceAccountDailySection } from "./WorkspaceAccountDailySection";
import { useWorkspaceContext } from "./WorkspaceContext";
import { resolveAccountScopedWorkspaceId } from "./account-scoped-workspace";
⋮----
export interface AccountRouteDispatcherProps {
  accountId: string;
  slug: string[];
}
⋮----
interface RedirectingRouteProps {
  readonly href: string;
  readonly message: string;
}
⋮----
function RedirectingRoute(
⋮----
export function AccountRouteDispatcher({
  accountId: accountIdFromParams,
  slug,
}: AccountRouteDispatcherProps)
⋮----
// Legacy redirect: /organization/... → /<accountId>/...
⋮----
// Legacy redirect: /workspace/... → /<accountId>/...
⋮----
// Root: /<accountId>
⋮----
if (accountType === "organization")
⋮----
// Single-segment routes: /<accountId>/<segment>
⋮----
// Two-segment routes
⋮----
// Fallback
````

## File: src/modules/workspace/adapters/inbound/react/workspace-route-screens.tsx
````typescript
/**
 * workspace-route-screens — workspace-scoped route screen components.
 *
 * Provides screens rendered within a workspace context:
 *   - WorkspaceDetailRouteScreen  (tabbed workspace detail page)
 *   - WorkspaceHubScreen          (workspace listing / hub for an account)
 *
 * Account/organization-level route screens (AccountDashboard, OrganizationTeams,
 * etc.) belong in platform-ui-stubs because they are platform-owned, not
 * workspace-owned.
 */
⋮----
import { Badge, Button } from "@packages";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
⋮----
import { useWorkspaceContext, type WorkspaceEntity } from "./WorkspaceContext";
import { CreateWorkspaceDialogRail } from "./workspace-shell-interop";
import { WorkspaceDailySection } from "./WorkspaceDailySection";
import { WorkspaceScheduleSection } from "./WorkspaceScheduleSection";
import { WorkspaceAuditSection } from "./WorkspaceAuditSection";
import { WorkspaceFilesSection } from "./WorkspaceFilesSection";
import { WorkspaceMembersSection } from "./WorkspaceMembersSection";
import { WorkspaceSettingsSection } from "./WorkspaceSettingsSection";
import { WorkspaceTaskFormationSection } from "./WorkspaceTaskFormationSection";
import { WorkspaceTasksSection } from "./WorkspaceTasksSection";
import { WorkspaceQualitySection } from "./WorkspaceQualitySection";
import { WorkspaceApprovalSection } from "./WorkspaceApprovalSection";
import { WorkspaceSettlementSection } from "./WorkspaceSettlementSection";
import { WorkspaceIssuesSection } from "./WorkspaceIssuesSection";
import { WorkspaceOverviewSection } from "./WorkspaceOverviewSection";
import {
  WORKSPACE_TAB_ITEMS,
  WORKSPACE_DOMAIN_GROUP_LABELS,
  resolveWorkspaceTabValue,
  type WorkspaceTabValue,
  type WorkspaceDomainGroup,
} from "./workspace-nav-model";
⋮----
// Cross-module: notion section components (via adapters/inbound/react boundary)
import {
  NotionKnowledgeSection,
  NotionPagesSection,
  NotionDatabaseSection,
  NotionTemplatesSection,
} from "@/src/modules/notion/adapters/inbound/react";
⋮----
// Cross-module: notebooklm section components (via adapters/inbound/react boundary)
import {
  NotebooklmNotebookSection,
  NotebooklmAiChatSection,
  NotebooklmSourcesSection,
  NotebooklmResearchSection,
} from "@/src/modules/notebooklm/adapters/inbound/react";
⋮----
// ── Internal helpers ──────────────────────────────────────────────────────────
⋮----
function getLifecycleBadgeVariant(lifecycleState: WorkspaceEntity["lifecycleState"])
⋮----
// ── WorkspaceDetailRouteScreen ────────────────────────────────────────────────
⋮----
interface WorkspaceDetailRouteScreenProps {
  workspaceId: string;
  accountId: string;
  accountsHydrated: boolean;
  currentUserId?: string;
  initialTab?: string;
  initialOverviewPanel?: string;
}
⋮----
const tabHref = (tab: WorkspaceTabValue)
⋮----
<Badge variant=
⋮----
{/* ── workspace group ── */}
⋮----
{/* ── notebooklm group ── */}
⋮----
// ── WorkspaceHubScreen ────────────────────────────────────────────────────────
⋮----
onClick=
⋮----
router.push(href);
````

## File: src/modules/workspace/adapters/inbound/react/workspace-schedule-datetime.ts
````typescript
export function toLocalDatetimeInputValue(date: Date): string
⋮----
const pad = (value: number): string
⋮----
export function parseLocalDatetimeInput(value: string): string | null
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceTaskFormationSection.tsx
````typescript
/**
 * WorkspaceTaskFormationSection — workspace.task-formation tab.
 *
 * Task formation keeps only source references in URL/query state, then resolves
 * concrete page/database context through the notion public boundary before
 * sending the source to the extractor.
 *
 * See docs/structure/system/source-to-task-flow.md for the "Notion-like local
 * model" boundary behind this handoff.
 */
⋮----
import { Badge, Button } from "@packages";
import {
  ListPlus,
  ArrowRight,
  FileText,
  LayoutGrid,
  BookOpen,
  Upload,
  ChevronRight,
  Info,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
⋮----
import type { DatabaseSnapshot, PageSnapshot } from "@/src/modules/notion";
import {
  listWorkspaceKnowledgeDatabases,
  listWorkspaceKnowledgePages,
} from "@/src/modules/notion";
import { startExtractionAction, confirmCandidatesAction } from "@/src/modules/workspace/subdomains/task-formation/adapters/inbound/server-actions/task-formation-actions";
import type { ExtractedTaskCandidate } from "@/src/modules/workspace/subdomains/task-formation/domain/value-objects/TaskCandidate";
⋮----
interface WorkspaceTaskFormationSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}
⋮----
type SelectedSourceKind = "page" | "database" | "research" | null;
type Phase = "idle" | "extracting" | "reviewing" | "confirming" | "done" | "error";
⋮----
type ConcreteSource = {
  readonly id: string;
  readonly kind: Exclude<SelectedSourceKind, null>;
  readonly title: string;
  readonly description: string;
  readonly sourceText?: string;
};
⋮----
function buildPageSource(page: PageSnapshot): ConcreteSource
⋮----
function buildDatabaseSource(database: DatabaseSnapshot, pages: ReadonlyArray<PageSnapshot>): ConcreteSource
⋮----
function toggleCandidate(i: number)
⋮----
function handleSelectSource(nextSource: SelectedSourceKind)
⋮----
function handleExtract()
⋮----
function handleConfirm()
⋮----
function handleReset()
````

## File: src/modules/workspace/subdomains/lifecycle/application/use-cases/WorkspaceLifecycleUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository";
import { Workspace } from "../../domain/entities/Workspace";
import type { CreateWorkspaceInput } from "../../domain/entities/Workspace";
import { WorkspaceMember } from "../../../membership/domain/entities/WorkspaceMember";
import type { WorkspaceMemberRepository } from "../../../membership/domain/repositories/WorkspaceMemberRepository";
import type { AuditRepository } from "../../../audit/domain/repositories/AuditRepository";
import { AuditEntry } from "../../../audit/domain/entities/AuditEntry";
import { createAuditAction } from "../../../audit/domain/value-objects/AuditAction";
import { createAuditSeverity } from "../../../audit/domain/value-objects/AuditSeverity";
⋮----
interface CreateWorkspaceWithOwnerInput {
  readonly workspace: CreateWorkspaceInput;
  readonly owner: {
    readonly actorId: string;
    readonly displayName: string;
    readonly email?: string;
  };
}
⋮----
interface WorkspaceCreatorInput {
  readonly actorId: string;
  readonly displayName: string;
  readonly email?: string;
}
⋮----
interface CreateWorkspaceWithCreatorInput extends CreateWorkspaceInput {
  readonly creator?: WorkspaceCreatorInput;
}
⋮----
export class CreateWorkspaceUseCase {
⋮----
constructor(
⋮----
async execute(input: CreateWorkspaceWithCreatorInput): Promise<CommandResult>
⋮----
// Best-effort audit logging: do not mask successful workspace creation.
// Keep a traceable error record for observability.
⋮----
export class CreateWorkspaceWithOwnerUseCase {
⋮----
async execute(input: CreateWorkspaceWithOwnerInput): Promise<CommandResult>
⋮----
export class ActivateWorkspaceUseCase {
⋮----
constructor(private readonly workspaceRepo: WorkspaceRepository)
⋮----
async execute(workspaceId: string): Promise<CommandResult>
⋮----
export class StopWorkspaceUseCase {
⋮----
export class DeleteWorkspaceUseCase {
````

## File: src/modules/workspace/subdomains/task-formation/adapters/outbound/genkit/GenkitTaskCandidateExtractor.ts
````typescript
import type { TaskCandidateExtractorPort, ExtractTaskCandidatesInput } from "../../../domain/ports/TaskCandidateExtractorPort";
import type { ExtractedTaskCandidate } from "../../../domain/value-objects/TaskCandidate";
⋮----
// ── Flow I/O types (replicated to avoid static z import at module scope) ──────
⋮----
interface TaskCandidateItem {
  title: string;
  description?: string;
  dueDate?: string;
  confidence: number;
  sourceSnippet?: string;
}
⋮----
interface ExtractFlowOutput {
  candidates: TaskCandidateItem[];
}
⋮----
// ── Prompt builder ─────────────────────────────────────────────────────────────
⋮----
function buildExtractionPrompt(sourceText: string, pageRefs: string): string
⋮----
// ── Adapter ────────────────────────────────────────────────────────────────────
⋮----
/**
 * GenkitTaskCandidateExtractor — synchronous Genkit flow implementation of
 * TaskCandidateExtractorPort.
 *
 * Flow name: workspace.extract-task-candidates
 * Model: DEFAULT_AI_MODEL (gemini-2.5-flash) via shared Genkit singleton.
 * I/O validated with Zod per @integration-ai/README guardrails.
 *
 * ADR: AI extraction → synchronous Genkit flow (option A).
 *
 * Dynamic import: genkit is loaded lazily inside `extract()` to keep static
 * genkit imports out of browser bundles. firebase-composition.ts is transitively
 * imported by client components; a top-level `import { ai } from genkit` would
 * pull Node.js-only genkit deps into the browser bundle.
 *
 * ESLint: Genkit dynamic import is permitted here — outbound adapter layer.
 */
export class GenkitTaskCandidateExtractor implements TaskCandidateExtractorPort {
⋮----
async extract(input: ExtractTaskCandidatesInput): Promise<ExtractedTaskCandidate[]>
⋮----
// Dynamic import — keeps Node.js-only genkit deps out of browser bundles.
````

## File: src/modules/notion/adapters/outbound/firebase-composition.ts
````typescript
/**
 * firebase-composition — notion module outbound composition root.
 *
 * Uses Firestore for Pages (contentPages collection) and Databases
 * (knowledgeDatabases collection). Templates remain in-memory.
 *
 * All exported helper functions MUST be called from client components,
 * NOT from Server Actions. The Firebase Web Client SDK requires a signed-in
 * user in the browser context so that Firestore Security Rules can evaluate
 * request.auth.
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notion/adapters/outbound/ which matches the permitted glob.
 */
⋮----
import { FirestorePageRepository } from "../../subdomains/page/adapters/outbound/firestore/FirestorePageRepository";
import { FirestoreDatabaseRepository } from "../../subdomains/database/adapters/outbound/firestore/FirestoreDatabaseRepository";
import { InMemoryTemplateRepository } from "../../subdomains/template/adapters/outbound/memory/InMemoryTemplateRepository";
import {
  CreatePageUseCase,
  RenamePageUseCase,
  ArchivePageUseCase,
  QueryPagesUseCase,
} from "../../subdomains/page/application/use-cases/PageUseCases";
import {
  CreateDatabaseUseCase,
  AddPropertyUseCase,
} from "../../subdomains/database/application/use-cases/DatabaseUseCases";
import {
  QueryTemplatesUseCase,
  CreateTemplateUseCase,
} from "../../subdomains/template/application/use-cases/TemplateUseCases";
import type { CommandResult } from "@/src/modules/shared";
import type { CreatePageInput } from "../../subdomains/page/domain/entities/Page";
import type { CreateDatabaseInput, DatabaseProperty } from "../../subdomains/database/domain/entities/Database";
⋮----
// ── Singleton repositories ────────────────────────────────────────────────────
⋮----
function getPageRepo(): FirestorePageRepository
⋮----
function getDatabaseRepo(): FirestoreDatabaseRepository
⋮----
function getTemplateRepo(): InMemoryTemplateRepository
⋮----
// ── Factory functions (kept for server-action compatibility) ──────────────────
⋮----
export function createClientNotionPageUseCases()
⋮----
export function createClientNotionDatabaseUseCases()
⋮----
export function createClientNotionTemplateUseCases()
⋮----
// ── Client-side page helpers ──────────────────────────────────────────────────
//
// MUST be called from client components, NOT from Server Actions.
⋮----
export async function queryPages(params:
⋮----
export async function createPage(input: CreatePageInput)
⋮----
export async function renamePage(pageId: string, title: string)
⋮----
export async function archivePage(pageId: string)
⋮----
// ── Client-side database helpers ──────────────────────────────────────────────
//
// MUST be called from client components, NOT from Server Actions.
⋮----
export async function queryDatabases(workspaceId: string)
⋮----
export async function createDatabase(input: CreateDatabaseInput)
⋮----
export async function addDatabaseProperty(
  databaseId: string,
  property: DatabaseProperty,
): Promise<CommandResult>
````

## File: src/modules/workspace/adapters/outbound/firebase-composition.ts
````typescript
/**
 * firebase-composition — workspace module outbound composition root.
 *
 * Single entry point for all Firebase operations owned by the workspace module.
 * Mirrors the pattern established by iam/adapters/outbound/firebase-composition.ts.
 *
 * ESLint: @integration-firebase is allowed here because this file lives at
 * src/modules/workspace/adapters/outbound/ which matches the permitted glob
 * (src/modules/<context>/adapters/outbound/**).
 *
 * Consumers (e.g. WorkspaceScopeProvider) import from this file — they must not
 * import directly from FirebaseWorkspaceQueryRepository or firebase/firestore.
 */
⋮----
import { getFirebaseFirestore, firestoreApi } from "@packages";
import {
  FirebaseWorkspaceQueryRepository,
  type Unsubscribe,
} from "./FirebaseWorkspaceQueryRepository";
import type { WorkspaceSnapshot } from "../../subdomains/lifecycle/domain/entities/Workspace";
⋮----
import {
  FirestoreWorkspaceRepository,
  type FirestoreLike,
} from "../../subdomains/lifecycle/adapters/outbound/firestore/FirestoreWorkspaceRepository";
import {
  CreateWorkspaceUseCase,
  CreateWorkspaceWithOwnerUseCase,
  ActivateWorkspaceUseCase,
  StopWorkspaceUseCase,
} from "../../subdomains/lifecycle/application/use-cases/WorkspaceLifecycleUseCases";
import { FirestoreMemberRepository } from "../../subdomains/membership/adapters/outbound/firestore/FirestoreMemberRepository";
import { FirestorePermissionCheckAdapter } from "../../subdomains/membership/adapters/outbound/permission/FirestorePermissionCheckAdapter";
import {
  AddMemberUseCase,
  ChangeMemberRoleUseCase,
  ListWorkspaceMembersUseCase,
  RemoveMemberUseCase,
} from "../../subdomains/membership/application/use-cases/MembershipUseCases";
import { MembershipController } from "../../subdomains/membership/adapters/inbound/http/MembershipController";
import { FirestoreTaskFormationJobRepository } from "../../subdomains/task-formation/adapters/outbound/firestore/FirestoreTaskFormationJobRepository";
import { FirebaseCallableTaskCandidateExtractor } from "../../subdomains/task-formation/adapters/outbound/callable/FirebaseCallableTaskCandidateExtractor";
import {
  ExtractTaskCandidatesUseCase,
  ConfirmCandidatesUseCase,
} from "../../subdomains/task-formation/application/use-cases/TaskFormationUseCases";
import { FirestoreTaskRepository } from "../../subdomains/task/adapters/outbound/firestore/FirestoreTaskRepository";
import {
  CreateTaskUseCase,
  UpdateTaskUseCase,
  TransitionTaskStatusUseCase,
  DeleteTaskUseCase,
} from "../../subdomains/task/application/use-cases/TaskUseCases";
import { FirestoreIssueRepository } from "../../subdomains/issue/adapters/outbound/firestore/FirestoreIssueRepository";
import {
  OpenIssueUseCase,
  TransitionIssueStatusUseCase,
  ResolveIssueUseCase,
  CloseIssueUseCase,
} from "../../subdomains/issue/application/use-cases/IssueUseCases";
import { FirestoreQualityReviewRepository } from "../../subdomains/quality/adapters/outbound/firestore/FirestoreQualityReviewRepository";
import {
  StartQualityReviewUseCase,
  PassQualityReviewUseCase,
  FailQualityReviewUseCase,
  ListQualityReviewsUseCase,
} from "../../subdomains/quality/application/use-cases/QualityUseCases";
import { FirestoreApprovalDecisionRepository } from "../../subdomains/approval/adapters/outbound/firestore/FirestoreApprovalDecisionRepository";
import {
  CreateApprovalDecisionUseCase,
  ApproveTaskUseCase,
  RejectApprovalUseCase,
  ListApprovalDecisionsUseCase,
} from "../../subdomains/approval/application/use-cases/ApprovalUseCases";
import { FirestoreFeedRepository } from "../../subdomains/feed/adapters/outbound/firestore/FirestoreFeedRepository";
import {
  CreateFeedPostUseCase,
  ListAccountFeedPostsUseCase,
  ListFeedPostsUseCase,
} from "../../subdomains/feed/application/use-cases/FeedUseCases";
import { FirestoreDemandRepository } from "../../subdomains/schedule/adapters/outbound/firestore/FirestoreDemandRepository";
import {
  AssignWorkDemandUseCase,
  CreateWorkDemandUseCase,
  ListWorkspaceDemandsUseCase,
} from "../../subdomains/schedule/application/use-cases/ScheduleUseCases";
import { FirestoreAuditRepository } from "../../subdomains/audit/adapters/outbound/firestore/FirestoreAuditRepository";
import {
  ListWorkspaceAuditEntriesUseCase,
  RecordAuditEntryUseCase,
} from "../../subdomains/audit/application/use-cases/AuditUseCases";
import { FirestoreInvoiceRepository } from "../../subdomains/settlement/adapters/outbound/firestore/FirestoreInvoiceRepository";
import { CreateInvoiceUseCase, TransitionInvoiceStatusUseCase } from "../../subdomains/settlement/application/use-cases/SettlementUseCases";
import { CreateInvoiceFromAcceptedTasksUseCase } from "../../subdomains/settlement/application/use-cases/CreateInvoiceFromAcceptedTasksUseCase";
⋮----
type FirestoreWhereOperator =
  | "<"
  | "<="
  | "=="
  | "!="
  | ">="
  | ">"
  | "array-contains"
  | "in"
  | "array-contains-any"
  | "not-in";
⋮----
// ── Singleton repository ───────────────────────────────────────────────────────
⋮----
function getWorkspaceQueryRepo(): FirebaseWorkspaceQueryRepository
⋮----
export function createFirestoreLikeAdapter()
⋮----
async get(collectionName: string, id: string): Promise<Record<string, unknown> | null>
async set(
      collectionName: string,
      id: string,
      data: Record<string, unknown>,
): Promise<void>
async delete(collectionName: string, id: string): Promise<void>
async query(
      collectionName: string,
      filters: Array<{ field: string; op: string; value: unknown }>,
): Promise<Record<string, unknown>[]>
async increment(collectionName: string, id: string, field: string, delta: number): Promise<void>
⋮----
function getWorkspaceLifecycleRepo(): FirestoreWorkspaceRepository
⋮----
function getWorkspaceMemberRepo(): FirestoreMemberRepository
⋮----
function createAuditRepo(): FirestoreAuditRepository
⋮----
function createMembershipPermissionCheck(repo: FirestoreMemberRepository): FirestorePermissionCheckAdapter
⋮----
// ── Public subscriptions ───────────────────────────────────────────────────────
⋮----
/**
 * Subscribes to real-time workspace updates for the given account.
 * Calls `onUpdate` immediately with the current dataset and again on every
 * subsequent Firestore change.
 *
 * Returns an unsubscribe function — call it when the subscriber unmounts to
 * avoid memory leaks and unnecessary Firestore reads.
 */
export function subscribeToWorkspacesForAccount(
  accountId: string,
  onUpdate: (workspaces: Record<string, WorkspaceSnapshot>) => void,
): Unsubscribe
⋮----
export function createClientWorkspaceLifecycleUseCases()
⋮----
export function createClientMembershipUseCases()
⋮----
export function createClientMembershipController(): MembershipController
⋮----
export function createClientTaskFormationUseCases()
⋮----
export function createClientTaskUseCases()
⋮----
export function createClientIssueUseCases()
⋮----
export function createClientQualityUseCases()
⋮----
export function createClientApprovalUseCases()
⋮----
export function createClientFeedUseCases()
⋮----
// ── Client-side feed helpers ──────────────────────────────────────────────────
//
// MUST be called from client components, NOT from Server Actions.
// The Firebase Web Client SDK requires a signed-in user in the browser context.
// A Server Action has no active Firebase user session → Firestore Security Rules
// block any operation (read or write) with "Missing or insufficient permissions".
⋮----
export async function listFeedPosts(params: {
  accountId: string;
  workspaceId: string;
  dateKey?: string;
  limit?: number;
})
⋮----
export async function createFeedPost(params: {
  accountId: string;
  workspaceId: string;
  authorAccountId: string;
  content: string;
  photoUrls?: string[];
  replyToPostId?: string;
  repostOfPostId?: string;
})
⋮----
export async function listAccountFeedPosts(params: {
  accountId: string;
  dateKey?: string;
  limit?: number;
})
⋮----
export function createClientScheduleUseCases()
⋮----
export function createClientAuditUseCases()
⋮----
export function createClientSettlementUseCases()
````

## File: src/modules/workspace/subdomains/task-formation/adapters/outbound/callable/FirebaseCallableTaskCandidateExtractor.ts
````typescript
import { z } from "zod";
import type { TaskCandidateExtractorPort, ExtractTaskCandidatesInput } from "../../../domain/ports/TaskCandidateExtractorPort";
import type { ExtractedTaskCandidate } from "../../../domain/value-objects/TaskCandidate";
⋮----
// Simple line items: "10 光纖熔接" or "10 高空作業費"
⋮----
// Dense AP8 PO format: item number + 3RDTW product code + price block ending in 小計
// followed by Chinese section header （numeral） and task description.
// Capture groups:
//   1 — item number (10–540, step 10)
//   2 — section numeral character(s) (e.g., "伍" for Section 5 / 雜項費用)
//   3 — task description text (max 120 chars)
⋮----
// Chinese section numeral chars whose entire section is 費用管銷
⋮----
// Description-level patterns that indicate 費用管銷 regardless of section
⋮----
/費$/u,           // ends with 費 (高空作業費, 工程衛生費 …)
/費用/u,          // 費用 anywhere
/管理\d*人/u,     // management headcount
⋮----
/圖控與軟體/u,    // SCADA software deliverable (cost item)
⋮----
/**
 * FirebaseCallableTaskCandidateExtractor — working implementation of
 * TaskCandidateExtractorPort with Firebase-only runtime behavior.
 *
 * Supports two text formats:
 *   1. Clean line-item format: "10 光纖熔接" (simple rule-based extraction)
 *   2. Dense AP8 PO format from Document AI OCR/Layout Parser output with
 *      price blocks and Chinese section headers (po_dense path).
 *
 * Classification follows the AP8 PO 4510250181 two-category model:
 *   施工作業 — installation, cabling, construction, fiber splicing, positioning
 *   費用管銷 — management fees, insurance, sanitation, profit, software cost
 *
 * ESLint: @integration-firebase is allowed here — outbound adapter layer.
 */
export class FirebaseCallableTaskCandidateExtractor implements TaskCandidateExtractorPort {
⋮----
/** Classify a task description as 施工作業 or 費用管銷. */
private _inferCategory(description: string, sectionChar?: string): "施工作業" | "費用管銷"
⋮----
// Section-level override: 伍 (雜項費用) and 玖 (利潤及雜費) are always costs
⋮----
// Description-level pattern matching (highest precision, checked first)
⋮----
// Keyword-score fallback for unstructured text
⋮----
/**
   * Extract candidates from dense AP8 PO text (Document AI OCR/Layout output).
   *
   * Matches pattern: {item_no} 3RDTW… …小計{amount}（{section}）{description}
   */
private _extractDensePoCandidates(
    text: string,
    source: "rule" | "ai",
    sourceBlockId: string | undefined,
): Array<z.infer<typeof CandidateSchema>>
⋮----
// Reset lastIndex before iterating (global regex)
⋮----
async extract(input: ExtractTaskCandidatesInput): Promise<ExtractedTaskCandidate[]>
⋮----
// ── Path 1: Dense AP8 PO format detection ─────────────────────────────
// If the text contains the ABB product code prefix "3RDTW", treat it as a
// dense PO document and use the structured dense-PO extractor.
⋮----
// ── Path 2: Simple line-item format ────────────────────────────────────
````

## File: src/modules/notion/adapters/inbound/react/NotionDatabaseSection.tsx
````typescript
/**
 * NotionDatabaseSection — notion.database tab — workspace knowledge databases.
 *
 * Databases are local structured knowledge containers. They keep a real parent
 * page reference (or workspace root) and a lightweight schema that can be used
 * as task-formation input.
 */
⋮----
import { Button, Input } from "@packages";
import { LayoutGrid, ListPlus, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
⋮----
import type { DatabaseSnapshot, PropertyType } from "../../../subdomains/database/domain/entities/Database";
import type { PageSnapshot } from "../../../subdomains/page/domain/entities/Page";
import { queryDatabases, createDatabase, addDatabaseProperty, queryPages } from "../../../adapters/outbound/firebase-composition";
⋮----
interface NotionDatabaseSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId: string;
}
⋮----
type PropertyDraft = {
  readonly name: string;
  readonly type: PropertyType;
};
⋮----
function taskFormationHref(accountId: string, workspaceId: string, databaseId: string)
⋮----
const reload = async () =>
⋮----
const load = () =>
⋮----
}, [workspaceId, accountId]); // eslint-disable-line react-hooks/exhaustive-deps
⋮----
const handleCreate = () =>
⋮----
const updatePropertyDraft = (databaseId: string, patch: Partial<PropertyDraft>) =>
⋮----
const handleAddProperty = (databaseId: string) =>
````

## File: src/modules/platform/adapters/inbound/react/platform-ui-stubs.tsx
````typescript
/**
 * platform-ui-stubs — platform inbound adapter (React).
 *
 * Remaining stubs for platform UI elements not yet implemented as real
 * components.  Items that have been promoted to real implementations are
 * re-exported from their canonical files below.
 *
 * Account / organization route screens are owned here because they belong to
 * the platform bounded context (account lifecycle, org management) rather than
 * to the workspace bounded context.
 */
⋮----
import { Badge, Button } from "@packages";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  BellOff,
  BriefcaseBusiness,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Filter,
  FolderOpen,
  LayoutDashboard,
  Lock,
  Play,
  Plus,
  Settings2,
  Shield,
  Users,
  UserPlus,
  Zap,
} from "lucide-react";
⋮----
// ── Shell theme toggle + language switcher ────────────────────────────────────
// Imported locally so they can be composed in ShellHeaderControls below,
// then re-exported so callers that want direct access can import from here.
⋮----
import { ShellThemeToggle } from "./shell/ShellThemeToggle";
import { ShellLanguageSwitcher } from "./shell/ShellLanguageSwitcher";
import {
  createOrganizationTeam,
  recruitOrganizationMember,
  listOrganizationMembers,
  listOrganizationTeams,
  updateOrganizationMemberRole,
} from "../../../../iam/adapters/outbound/firebase-composition";
import { useAccountRouteContext } from "./useAccountRouteContext";
⋮----
// ── Real implementations (promoted from stubs) ────────────────────────────────
⋮----
// ── Account route context ─────────────────────────────────────────────────────
⋮----
// ── Shell breadcrumbs ─────────────────────────────────────────────────────────
⋮----
export function ShellAppBreadcrumbs(): null
⋮----
// ── Shell header controls (theme toggle + language switcher) ──────────────────
⋮----
export function ShellHeaderControls(): React.ReactElement
⋮----
// ── Global search ─────────────────────────────────────────────────────────────
⋮----
export function ShellGlobalSearchDialog(
  _props: ShellGlobalSearchDialogProps,
): null
⋮----
export function useShellGlobalSearch():
⋮----
// ── Route screens ─────────────────────────────────────────────────────────────
⋮----
// ── AccountDashboardRouteScreen ───────────────────────────────────────────────
⋮----
export function AccountDashboardRouteScreen(): React.ReactElement
⋮----
{/* Header */}
⋮----
{/* Stats */}
⋮----
{/* Recent activity */}
⋮----
// ── OrganizationOverviewRouteScreen ──────────────────────────────────────────
⋮----
{/* Header */}
⋮----
{/* Stats */}
⋮----
{/* Navigation */}
⋮----
// ── OrganizationMembersRouteScreen ────────────────────────────────────────────
⋮----
async function loadMembers(organizationId: string): Promise<void>
⋮----
async function handleInviteMember(): Promise<void>
⋮----
// Temporary mapping: email is used as member identity key until IAM directory lookup is available.
⋮----
async function handleMemberRoleChange(memberId: string, role: "Owner" | "Admin" | "Member"): Promise<void>
⋮----
{/* Header */}
⋮----
{/* Role filter */}
⋮----
// ── OrganizationTeamsRouteScreen ──────────────────────────────────────────────
⋮----
async function loadTeams(organizationId: string): Promise<void>
⋮----
async function handleCreateTeam(): Promise<void>
⋮----
{/* Header */}
⋮----
// ── OrganizationPermissionsRouteScreen ────────────────────────────────────────
⋮----
{/* Header */}
⋮----
{/* Role descriptions */}
⋮----
{/* Permissions matrix */}
⋮----
// ── SettingsNotificationsRouteScreen ─────────────────────────────────────────
⋮----
{/* Header */}
⋮----
{/* Channels */}
⋮----
{/* Event types */}
⋮----
// ── Account / organization route screens ──────────────────────────────────────
// These screens belong to the platform bounded context (account lifecycle and
// organization management) and were previously misplaced in workspace-ui-stubs.
⋮----
// ── OrganizationWorkspacesRouteScreen ─────────────────────────────────────────
⋮----
{/* Header */}
⋮----
{/* Stats */}
⋮----
{/* Workspace list — empty state */}
⋮----
// ── OrganizationDailyRouteScreen ──────────────────────────────────────────────
⋮----
{/* Header */}
⋮----
{/* Stats */}
⋮----
].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1.5 rounded-xl border border-border/40 bg-card/60 px-3 py-3"
          >
            <div className="flex items-center gap-1.5">
              {stat.icon}
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Today's tasks — empty state */}
      <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
        <CalendarDays className="mx-auto mb-3 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">今日尚無排程任務</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          工作區任務指派截止日後，將自動匯聚到帳號每日視圖。
        </p>
      </div>
    </div>
  ) as React.ReactElement;
⋮----
{/* Today's tasks — empty state */}
⋮----
// ── OrganizationScheduleRouteScreen ──────────────────────────────────────────
⋮----
{/* Header */}
⋮----
{/* Period filter */}
⋮----
{/* Timeline — empty state */}
⋮----
// ── OrganizationDispatcherRouteScreen ────────────────────────────────────────
⋮----
{/* Header */}
⋮----
{/* Queue summary */}
⋮----
{/* Active queue label */}
⋮----
{/* Queue list — empty state */}
⋮----
{/* Auto-dispatch rules info */}
⋮----
// ── OrganizationAuditRouteScreen ──────────────────────────────────────────────
⋮----
{/* Header */}
⋮----
{/* Event type filter */}
⋮----
{/* Log — empty state */}
````

## File: src/modules/notebooklm/adapters/outbound/firebase-composition.ts
````typescript
/**
 * firebase-composition — notebooklm module outbound composition root.
 *
 * Single entry point for all Firebase operations owned by the notebooklm module.
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notebooklm/adapters/outbound/ which matches the permitted glob.
 */
⋮----
import { getFirebaseFirestore, firestoreApi, getFirebaseStorage, ref, uploadBytes, getDownloadURL } from "@packages";
import { FirestoreIngestionSourceRepository } from "../../subdomains/source/adapters/outbound/firestore/FirestoreIngestionSourceRepository";
import { InMemoryNotebookRepository } from "../../subdomains/notebook/adapters/outbound/memory/InMemoryNotebookRepository";
import {
  RegisterIngestionSourceUseCase,
  ArchiveIngestionSourceUseCase,
  QueryIngestionSourcesUseCase,
} from "../../subdomains/source/application/use-cases/IngestionSourceUseCases";
import {
  CreateNotebookUseCase,
  AddDocumentToNotebookUseCase,
  GenerateNotebookResponseUseCase,
} from "../../subdomains/notebook/application/use-cases/NotebookUseCases";
import type { NotebookGenerationPort } from "../../subdomains/notebook/domain/ports/NotebookGenerationPort";
import { callRagQuery, callParseDocument, callReindexDocument, type RagQueryInput, type RagQueryOutput, type ParseDocumentInput, type ParseDocumentOutput, type ReindexDocumentInput } from "./callable/FirebaseCallableAdapter";
⋮----
// ── Singleton repositories ────────────────────────────────────────────────────
⋮----
function getSourceRepo(): FirestoreIngestionSourceRepository
⋮----
function getNotebookRepo(): InMemoryNotebookRepository
⋮----
// ── RagQuery generation port bridge ──────────────────────────────────────────
⋮----
class RagQueryGenerationPort implements NotebookGenerationPort {
⋮----
constructor(
⋮----
async generateResponse(input: {
    prompt: string;
    notebookId: string;
    model?: string;
}): Promise<
⋮----
// ── Factory functions ─────────────────────────────────────────────────────────
⋮----
export function createClientNotebooklmSourceUseCases()
⋮----
export function createClientNotebooklmNotebookUseCases(accountId: string, workspaceId: string)
⋮----
// ── Storage upload helper ─────────────────────────────────────────────────────
⋮----
/**
 * Upload a document to a workspace-scoped source path.
 * Path: workspaces/{workspaceId}/sources/{accountId}/{uuid}-{filename}
 * Parsing / indexing are triggered manually from the Sources UI.
 */
export async function uploadDocumentToStorage(
  file: File,
  accountId: string,
  workspaceId: string,
): Promise<string>
⋮----
/**
 * getDocumentDownloadUrl — resolve a Firebase Storage gs:// URI or storage path
 * to an HTTPS download URL suitable for embedding in Google Doc Viewer.
 *
 * Accepts both gs://bucket/path and relative paths like workspaces/...
 */
export async function getDocumentDownloadUrl(storageUrl: string): Promise<string>
⋮----
// keep firestore & firestoreApi accessible within this composition module
⋮----
// ── Storage bucket / GCS URI helpers ─────────────────────────────────────────
⋮----
/**
 * Convert a relative Storage path to a gs:// URI.
 * Already-absolute gs:// URIs are returned unchanged.
 */
export function toGcsUri(pathOrUri: string): string
⋮----
// ── Client-side Firestore source initialisation ───────────────────────────────
⋮----
/**
 * Write an initial source-document record to Firestore so the document appears
 * in the Sources list immediately after upload — even before fn parses it.
 *
 * The schema mirrors fn's `init_document()` so `FirestoreIngestionSourceRepository`
 * maps it correctly.  fn's parse_document callable uses merge=True when it writes,
 * so calling parse later will add parsed.* fields without overwriting these.
 */
export async function initSourceDocumentInFirestore(params: {
  docId: string;
  gcsUri: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
  accountId: string;
  workspaceId: string;
}): Promise<void>
⋮----
// "active" = upload done, ready to parse.
// fn's parse_document callable will overwrite with "processing" when it starts,
// then "completed" when done.
⋮----
// ── Client-side Firestore query helper ───────────────────────────────────────
⋮----
/**
 * queryDocuments — query ingestion sources directly from the browser.
 *
 * MUST be called from a client component, NOT from a Server Action.
 * The Firebase Web Client SDK requires a signed-in user in the browser context
 * so that Firestore Security Rules can evaluate request.auth.  A Server Action
 * has no active Firebase user session, which causes "Missing or insufficient
 * permissions" even when rules only require `isSignedIn()`.
 */
export async function queryDocuments(params: {
  accountId: string;
  workspaceId?: string;
})
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceScheduleSection.tsx
````typescript
/**
 * WorkspaceScheduleSection — workspace.schedule tab — workspace work-demand schedule view.
 */
⋮----
import { Badge } from "@packages";
import { CalendarRange } from "lucide-react";
import { useEffect, useState } from "react";
import { createClientScheduleUseCases } from "../../outbound/firebase-composition";
import type { WorkDemandSnapshot } from "../../../subdomains/schedule/domain/entities/WorkDemand";
⋮----
interface WorkspaceScheduleSectionProps {
  workspaceId: string;
}
⋮----
{/* Header */}
````

## File: src/modules/notebooklm/adapters/inbound/server-actions/document-actions.ts
````typescript
/**
 * document-actions — notebooklm document server actions.
 *
 * Handles document upload (via Firebase Storage) and listing.
 * Parse / index actions are explicit user-triggered steps.
 */
⋮----
import { z } from "zod";
import {
  createClientNotebooklmSourceUseCases,
} from "../../outbound/firebase-composition";
import { processSourceDocumentAction } from "./source-processing-actions";
import { createDatabaseAction } from "@/src/modules/notion/adapters/inbound/server-actions/database-actions";
import type { ParseDocumentOutput } from "../../outbound/callable/FirebaseCallableAdapter";
⋮----
// ── Firebase HTTPS Callable server-side helper ────────────────────────────────
// Calling Cloud Functions from a Server Action avoids CORS completely.
// Functions are deployed in asia-southeast1; project ID comes from env.
⋮----
function _toGcsUri(storageUrl: string): string
⋮----
async function _callCallable<TIn, TOut>(fnName: string, data: TIn): Promise<TOut>
⋮----
// ── Input schemas ─────────────────────────────────────────────────────────────
⋮----
/** Which parser to invoke: "layout" | "form" | "ocr" | "genkit". */
⋮----
/** GCS URI of the Layout Parser JSON written by fn after Document AI parse. */
⋮----
// ── Actions ───────────────────────────────────────────────────────────────────
⋮----
// NOTE: queryDocumentsAction was removed.
// Querying accounts/{accountId}/documents via a Server Action fails with
// "Missing or insufficient permissions" because the Firebase Web Client SDK
// has no user auth context on the server.
// Use queryDocuments() from firebase-composition.ts (client-side helper) instead.
⋮----
/**
 * registerUploadedDocumentAction — register a document snapshot after upload.
 *
 * Call this after uploadDocumentToStorage() completes on the client.
 * This action only records the uploaded source for immediate UI feedback.
 * Parsing / indexing remain separate manual actions.
 */
export async function registerUploadedDocumentAction(rawInput: unknown)
⋮----
/**
 * createPageFromDocumentAction — create a Knowledge Page from a parsed document.
 *
 * Delegates to processSourceDocumentAction with shouldCreatePage=true only.
 * The Knowledge Page title is set to the document name.
 */
export async function createPageFromDocumentAction(rawInput: unknown)
⋮----
/**
 * createDatabaseFromDocumentAction — create a Notion Database named after the document.
 *
 * Useful as a container for Form Parser-extracted structured fields.
 */
export async function createDatabaseFromDocumentAction(rawInput: unknown)
⋮----
/**
 * parseDocumentAction — trigger Document AI parse for a specific document.
 *
 * Pass `parser: "layout"` (default) for Layout Parser (text + semantic chunks).
 * Pass `parser: "form"` for Form Parser (structured entities / KV fields).
 * Always a pure parse step; RAG indexing is a separate step.
 */
export async function parseDocumentAction(rawInput: unknown): Promise<ParseDocumentOutput>
⋮----
/**
 * reindexDocumentAction — trigger RAG reindex from Layout Parser JSON.
 *
 * Calls the fn `rag_reindex_document` HTTPS callable function from the server
 * side to avoid browser CORS restrictions.
 */
export async function reindexDocumentAction(rawInput: unknown): Promise<void>
````

## File: src/modules/notebooklm/adapters/inbound/react/NotebooklmSourcesSection.tsx
````typescript
/**
 * NotebooklmSourcesSection — notebooklm.sources tab — document source list + upload.
 *
 * Manual Document AI pipeline controls:
 *   ① 上傳文件  — upload to Firebase Storage only
 *   ② 解析文件  — manually trigger Layout/Form/OCR/Genkit-AI via callable
 *   ③ RAG 索引  — manually trigger RAG reindex via callable
 *   ④ 建立知識頁 — create Notion Knowledge Page from parsed document
 *   ⑤ 建立資料庫 — create Notion Database named after document (for Form Parser entities)
 *
 * Artifact display: page count, layout chunks, form entities, RAG vector count.
 */
⋮----
import { Button, createGoogleViewerEmbedUrl } from "@packages";
import {
  Upload, RefreshCw, FileUp, ArrowRight, BookOpen, ListPlus,
  Eye, X, Loader2, ScanText, Database, FileText, ChevronDown, ChevronUp,
  Layers, Braces, BarChart2, CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
⋮----
import type { IngestionSourceSnapshot } from "../../../subdomains/source/domain/entities/IngestionSource";
import {
  createPageFromDocumentAction,
  createDatabaseFromDocumentAction,
} from "../server-actions/document-actions";
import {
  queryDocuments,
  uploadDocumentToStorage,
  getDocumentDownloadUrl,
  initSourceDocumentInFirestore,
  toGcsUri,
  callParseDocument,
  callReindexDocument,
} from "../../../adapters/outbound/firebase-composition";
⋮----
interface NotebooklmSourcesSectionProps {
  workspaceId: string;
  accountId: string;
}
⋮----
function deriveDocIdFromStoragePath(storagePath: string): string
⋮----
function createPendingSourceSnapshot(input: {
  file: File;
  storagePath: string;
  workspaceId: string;
  accountId: string;
}): IngestionSourceSnapshot
⋮----
// Upload is done; show "已就緒" until a parse callable is explicitly triggered.
// fn's parse_document callable will set status back to "processing" when it starts.
⋮----
/** MIME types renderable via Google Doc Viewer */
⋮----
// ── Per-document action state ─────────────────────────────────────────────────
⋮----
type DocActionStatus = "idle" | "running" | "done" | "error";
⋮----
interface DocActionState {
  parseLayout: DocActionStatus;
  parseForm: DocActionStatus;
  parseOcr: DocActionStatus;
  parseGenkit: DocActionStatus;
  index: DocActionStatus;
  reindex: DocActionStatus;
  page: DocActionStatus;
  database: DocActionStatus;
  message?: string;
  pageHref?: string;
  databaseHref?: string;
}
⋮----
// ── Component ─────────────────────────────────────────────────────────────────
⋮----
// Preview state
⋮----
// Per-document expanded / action state
⋮----
// JSON viewer modal state
⋮----
const load = () =>
⋮----
// Auto-load on mount so sources are visible without a manual click.
useEffect(() => { load(); }, [workspaceId, accountId]); // eslint-disable-line react-hooks/exhaustive-deps
⋮----
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
⋮----
// Write initial Firestore record so the document survives page reload
// (fn no longer auto-triggers on workspaces/ path; we own the initial write).
⋮----
const handlePreview = async (doc: IngestionSourceSnapshot) =>
⋮----
// Use Firebase Storage getDownloadURL() directly on the client.
// Storage rules allow read for authenticated users, so the Firebase JS SDK
// fetches a token-based download URL without any IAM signing.  The resulting
// URL is publicly accessible (token embedded in the URL) and works with
// Google Docs Viewer — no Cloud Function round-trip required.
⋮----
const closePreview = () =>
⋮----
// ── Per-document action helpers ─────────────────────────────────────────────
⋮----
const setDocAction = (docId: string, patch: Partial<DocActionState>) =>
⋮----
const handleParseLayout = async (doc: IngestionSourceSnapshot) =>
⋮----
const handleParseForm = async (doc: IngestionSourceSnapshot) =>
⋮----
const handleParseOcr = async (doc: IngestionSourceSnapshot) =>
⋮----
const handleParseGenkit = async (doc: IngestionSourceSnapshot) =>
⋮----
const handleIndex = async (doc: IngestionSourceSnapshot) =>
⋮----
const handleReindex = async (doc: IngestionSourceSnapshot) =>
⋮----
const handleCreatePage = async (doc: IngestionSourceSnapshot) =>
⋮----
const handleCreateDatabase = async (doc: IngestionSourceSnapshot) =>
⋮----
// ── Render helpers ───────────────────────────────────────────────────────────
⋮----
{/* Header */}
⋮----
{/* Hidden file input */}
⋮----
{/* Processing chain banner */}
⋮----
{/* Document list */}
⋮----
{/* Document header row */}
⋮----
{/* Toggle actions panel */}
⋮----
{/* Meta row */}
⋮----
{/* Expandable actions panel */}
⋮----
{/* Section: Document AI parse */}
⋮----
onClick=
⋮----
{/* Section: RAG index — uses Layout Parser output */}
⋮----
{/* Section: Generate downstream artifacts */}
⋮----
{/* Action status message */}
⋮----
{/* Downstream CTAs when documents are ready */}
⋮----
{/* JSON viewer modal — parsed output summary */}
⋮----
<Button size="sm" variant="ghost" onClick=
⋮----
src=
````