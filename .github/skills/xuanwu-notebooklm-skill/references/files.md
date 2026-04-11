# Files

## File: modules/notebooklm/AGENT.md
````markdown
# NotebookLM Agent

> Strategic agent documentation: [docs/contexts/notebooklm/AGENT.md](../../docs/contexts/notebooklm/AGENT.md)

## Mission

保護 notebooklm 主域作為對話、來源處理、檢索、grounding、synthesis、評估與筆記邊界。核心 pipeline 為：ingestion → retrieval → grounding → synthesis → evaluation。

## Route Here When

- 問題核心是 notebook、conversation、source ingestion、retrieval、grounding、synthesis。
- 問題需要處理引用對齊、來源可追溯、模型輸出品質或衍生筆記。
- 問題要把知識來源轉成可對話與可綜合的推理材料。
- 問題涉及 RAG 問答、向量檢索、chunks 召回、generation 品質。
- 問題涉及 evaluation、品質評估、回歸比較或 grounding 可信度。
- 問題涉及 note（輕量個人筆記）或 conversation-versioning（對話快照策略）。

## Route Elsewhere When

- 正典知識頁面、內容分類、正式發布屬於 notion。
- 身份、授權、權益、憑證治理屬於 platform。
- 共享 AI provider、模型政策、配額與安全護欄屬於 platform.ai。
- 工作區生命週期、共享與存在感屬於 workspace。

## Architecture Note — ai Subdomain Tech Debt

`ai` 子域目前是此主域的過渡 adapter，持有 RAG 查詢 (`IKnowledgeContentRepository`)、向量檢索實體 (`RagRetrievedChunk`)、引用實體 (`RagCitation`)、synthesis use case (`AnswerRagQueryUseCase`) 與早期 feedback 流程。

這些責任長期應依戰略清單逐步遷移至：`retrieval`、`grounding`、`synthesis`、`evaluation`。

新功能應**優先加進目標子域**（如新的 retrieval 策略請放 `retrieval/`），不要繼續擴大 `ai` 子域範圍。用 Strangler Pattern：只在搬遷時加入 use case contract，不做一次性大改。

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order (Strangler Pattern)

New features:
1. Define Domain (entities, value objects, aggregates, events)
2. Define Application (use cases, DTOs)
3. Define Ports (only if boundary isolation needed)
4. Implement Infrastructure (adapters, persistence)
5. Implement Interfaces (UI, actions, hooks)

Legacy migration:
1. Find a Use Case to extract
2. Build Domain model for that use case
3. Converge Application layer
4. Isolate legacy via Ports
5. Replace Infrastructure adapter
````

## File: modules/notebooklm/api/factories.ts
````typescript
export { makeThreadRepo } from "../subdomains/conversation/api/factories";
export { makeNotebookRepo } from "../subdomains/notebook/api/factories";
````

## File: modules/notebooklm/api/index.ts
````typescript
/**
 * modules/notebooklm — public API barrel.
 */

export type { Message, MessageRole, Thread, IThreadRepository } from "../subdomains/conversation/api";

export type {
  NotebookResponse,
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
  NotebookRepository,
} from "../subdomains/notebook/api";

export { generateNotebookResponse } from "../subdomains/notebook/api";
export { saveThread, loadThread } from "../subdomains/conversation/api";

// ---------------------------------------------------------------------------
// Q&A subdomain — types and UI (replaces @/modules/search/api)
// ---------------------------------------------------------------------------

export type {
  AnswerRagQueryInput,
  AnswerRagQueryResult,
  RagCitation,
  RagRetrievalSummary,
} from "../subdomains/ai/api";
export { RagQueryView } from "../subdomains/ai/api";

// ---------------------------------------------------------------------------
// Source subdomain — types, hooks, and UI (replaces @/modules/source/api)
// ---------------------------------------------------------------------------

export type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryFieldType,
  WikiLibraryRow,
  WikiLibraryStatus,
  WikiLibrarySnapshot,
  CreateWikiLibraryInput,
  AddWikiLibraryFieldInput,
  CreateWikiLibraryRowInput,
} from "../subdomains/source/api";

export type {
  SourceDocument,
  SourceLiveDocument,
  AssetDocument,
  AssetLiveDocument,
} from "../subdomains/source/api";

export {
  useSourceDocumentsSnapshot,
  mapToSourceLiveDocument,
  mapToAssetLiveDocument,
} from "../subdomains/source/api";

export {
  listWikiLibraries,
  createWikiLibrary,
  addWikiLibraryField,
  createWikiLibraryRow,
  getWikiLibrarySnapshot,
} from "../subdomains/source/api";

export {
  SourceDocumentsView,
  WorkspaceFilesTab,
  LibrariesView,
  LibraryTableView,
  FileProcessingDialog,
} from "../subdomains/source/api";

// ---------------------------------------------------------------------------
// conversation subdomain — AI chat UI and helpers
// ---------------------------------------------------------------------------

export { AiChatPage } from "../subdomains/conversation/api";
export type { AiChatPageProps, ChatMessage } from "../subdomains/conversation/api";
````

## File: modules/notebooklm/api/server.ts
````typescript
/**
 * modules/notebooklm — server-only API barrel.
 *
 * Exports concrete notebook implementations that depend on server-only
 * packages or infrastructure wiring. Must only be imported in Server Actions,
 * route handlers, or server-side infrastructure.
 */

export { GenerateNotebookResponseUseCase, GenkitNotebookRepository } from "../subdomains/notebook/api/server";

// Q&A subdomain — AnswerRagQueryUseCase factory (replaces @/modules/search/api/server)
export { createAnswerRagQueryUseCase } from "../subdomains/ai/api/server";
````

## File: modules/notebooklm/docs/README.md
````markdown
# NotebookLM Documentation

Implementation-level documentation for the notebooklm bounded context.

## Strategic Documentation (Authority)

Strategic architecture documentation lives in `docs/contexts/notebooklm/`:

- [README.md](../../../docs/contexts/notebooklm/README.md) — Context overview
- [subdomains.md](../../../docs/contexts/notebooklm/subdomains.md) — Subdomain inventory
- [bounded-contexts.md](../../../docs/contexts/notebooklm/bounded-contexts.md) — Ownership map
- [context-map.md](../../../docs/contexts/notebooklm/context-map.md) — Relationships
- [ubiquitous-language.md](../../../docs/contexts/notebooklm/ubiquitous-language.md) — Terminology

## Architecture Reference

- [Bounded Context Template](../../../docs/bounded-context-subdomain-template.md) — Standard structure
- [Architecture Overview](../../../docs/architecture-overview.md) — System-wide architecture
- [Integration Guidelines](../../../docs/integration-guidelines.md) — Cross-context rules

## Conflict Resolution

- Strategic docs in `docs/contexts/notebooklm/` are the authority for naming, ownership, and boundaries.
- This `docs/` folder is for implementation-aligned detail only.
````

## File: modules/notebooklm/domain/.gitkeep
````

````

## File: modules/notebooklm/infrastructure/.gitkeep
````

````

## File: modules/notebooklm/interfaces/.gitkeep
````

````

## File: modules/notebooklm/README.md
````markdown
# NotebookLM

對話、來源處理與推理主域

## Implementation Structure

```text
modules/notebooklm/
├── api/              # Public API boundary
├── application/      # Context-wide orchestration
├── domain/           # Context-wide domain concepts
├── infrastructure/   # Context-wide driven adapters
├── interfaces/       # Context-wide driving adapters
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── ai/                      # Active ⚠️
    ├── conversation/            # Active
    ├── notebook/                # Active
    ├── source/                  # Active
    ├── conversation-versioning/ # Stub (Baseline)
    ├── note/                    # Stub (Baseline)
    ├── synthesis/               # Stub (Baseline)
    ├── evaluation/              # Stub (Gap)
    ├── grounding/               # Stub (Gap)
    ├── ingestion/               # Stub (Gap)
    └── retrieval/               # Stub (Gap)
```

## Subdomains

### Active

| Subdomain | Status | Purpose |
|-----------|--------|---------|
| ai | Active ⚠️ | RAG 問答、檢索、grounded 生成與回饋收集。命名技術債：此子域非戰略清單中的合法子域，長期目標為拆分至 retrieval / grounding / synthesis，詳見 Architecture Note。 |
| conversation | Active | 對話 Thread 與 Message 生命週期管理 |
| notebook | Active | Notebook 容器組合與 GenKit 回應生成 |
| source | Active | 來源文件匯入生命週期、RagDocument 狀態機與 WikiLibrary 結構化庫 |

### Baseline Stubs

| Subdomain | Status | Purpose |
|-----------|--------|---------|
| conversation-versioning | Stub | 對話版本快照策略（長期拆出 conversation） |
| note | Stub | 輕量個人筆記與知識連結 |
| synthesis | Stub | RAG 合成、摘要與洞察生成（長期接收 ai 子域的合成責任） |

### Recommended Gap Stubs

| Subdomain | Status | Purpose |
|-----------|--------|---------|
| evaluation | Stub | 品質評估與回歸比較（獨立於 ai 子域的早期回饋收集） |
| grounding | Stub | 引用對齊與可追溯證據（長期接收 ai 子域的 citation 責任） |
| ingestion | Stub | 來源匯入、正規化與前處理（長期接收 source 子域的匯入責任） |
| retrieval | Stub | 查詢召回與排序策略（長期接收 ai 子域的向量檢索責任） |

## Architecture Note

`ai` 子域是此模組的主要架構技術債。它在早期開發中吸收了四個戰略子域的責任（retrieval、grounding、synthesis、early evaluation），但 `ai` 本身並不在 [strategic subdomain docs](../../docs/contexts/notebooklm/subdomains.md) 的合法清單中。

**現況**：`ai` 持有 `IKnowledgeContentRepository` port、`RagRetrievedChunk` / `RagCitation` entities、`AnswerRagQueryUseCase` orchestration、以及 `submit-rag-feedback` 回饋流程。

**長期目標**：以單個 use case 為單位，漸進將各責任遷移至 `retrieval`、`grounding`、`synthesis`、`evaluation` 子域（Strangler Pattern）。在遷移完成前，`ai` 子域保留作為過渡 adapter。

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- Domain must not import infrastructure, interfaces, or external frameworks.
- Cross-module collaboration goes through `api/` only.

## Strategic Documentation

- [Context README](../../docs/contexts/notebooklm/README.md)
- [Subdomains](../../docs/contexts/notebooklm/subdomains.md)
- [Context Map](../../docs/contexts/notebooklm/context-map.md)
- [Ubiquitous Language](../../docs/contexts/notebooklm/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
````

## File: modules/notebooklm/subdomains/ai/api/server.ts
````typescript
/**
 * ai subdomain — server-only API.
 *
 * Factory functions and infrastructure adapters that depend on server-only
 * packages (genkit, google-genai). Must only be imported in Server Actions,
 * route handlers, or server-side infrastructure.
 */

import { FirebaseRagRetrievalAdapter } from "../infrastructure/firebase/FirebaseRagRetrievalAdapter";
import { GenkitRagGenerationAdapter } from "../infrastructure/genkit/GenkitRagGenerationAdapter";
import { AnswerRagQueryUseCase } from "../application/use-cases/answer-rag-query.use-case";

export { GenkitRagGenerationAdapter } from "../infrastructure/genkit/GenkitRagGenerationAdapter";

export function createAnswerRagQueryUseCase(): AnswerRagQueryUseCase {
  return new AnswerRagQueryUseCase(
    new FirebaseRagRetrievalAdapter(),
    new GenkitRagGenerationAdapter(),
  );
}
````

## File: modules/notebooklm/subdomains/ai/application/use-cases/answer-rag-query.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: application/use-cases
 * Purpose: AnswerRagQueryUseCase — orchestrates grounding + synthesis to
 *          produce a cited answer for a user question.
 *
 * Design improvements over legacy answer-rag-query.use-case.ts:
 * - TopK limit is configurable via constructor injection (no hard-coded MAX_TOP_K=10).
 * - Error codes are prefixed with QA_ for namespace clarity.
 * - Dependencies typed against interfaces, not concrete classes.
 */

import { randomUUID } from "node:crypto";

import type { IRagRetrievalRepository } from "../../domain/repositories/IRagRetrievalRepository";
import type {
  AnswerRagQueryInput,
  AnswerRagQueryOutput,
  AnswerRagQueryResult,
  RagRetrievalSummary,
} from "../../domain/entities/rag-query.entities";
import type { IRagGenerationRepository } from "../../domain/repositories/IRagGenerationRepository";

const DEFAULT_TOP_K = 5;
const DEFAULT_MAX_TOP_K = 20; // Raise from the legacy hard-coded 10

function clampTopK(value: number | undefined, maxTopK: number): number {
  if (value === undefined || !Number.isFinite(value)) return DEFAULT_TOP_K;
  return Math.min(maxTopK, Math.max(1, Math.trunc(value)));
}

export class AnswerRagQueryUseCase {
  constructor(
    private readonly retrievalRepository: IRagRetrievalRepository,
    private readonly generationRepository: IRagGenerationRepository,
    /** Maximum topK accepted from callers. Override at composition root for environment-specific limits. */
    private readonly maxTopK: number = DEFAULT_MAX_TOP_K,
  ) {}

  async execute(input: AnswerRagQueryInput): Promise<AnswerRagQueryResult> {
    const organizationId = input.organizationId.trim();
    const workspaceId = input.workspaceId?.trim() || undefined;
    const userQuery = input.userQuery.trim();
    const taxonomy = input.taxonomy?.trim() || undefined;
    const topK = clampTopK(input.topK, this.maxTopK);
    const traceId = `rag-trace-${randomUUID()}`;
    const scope: RagRetrievalSummary["scope"] = workspaceId ? "workspace" : "organization";

    if (!organizationId) {
      return {
        ok: false,
        error: {
          code: "QA_SCOPE_MISSING",
          message: "organizationId is required for RAG queries.",
          context: { traceId, scope: "organizationId" },
        },
      };
    }

    if (!userQuery) {
      return {
        ok: false,
        error: {
          code: "QA_QUERY_EMPTY",
          message: "userQuery must not be empty.",
          context: { traceId },
        },
      };
    }

    const chunks = await this.retrievalRepository.retrieve({
      organizationId,
      ...(workspaceId ? { workspaceId } : {}),
      normalizedQuery: userQuery.toLowerCase(),
      taxonomy,
      topK,
    });

    if (chunks.length === 0) {
      return {
        ok: false,
        error: {
          code: "QA_NO_RELEVANT_CHUNKS",
          message:
            "No ready chunks matched the query scope. Verify ingestion completed and documents are marked ready.",
          context: { traceId, organizationId, workspaceId, taxonomy, topK, scope },
        },
      };
    }

    const generationResult = await this.generationRepository.generate({
      traceId,
      organizationId,
      ...(workspaceId ? { workspaceId } : {}),
      userQuery,
      chunks,
      ...(input.model ? { model: input.model } : {}),
    });

    if (!generationResult.ok) {
      return { ok: false, error: generationResult.error };
    }

    const retrievalSummary: RagRetrievalSummary = {
      mode: "skeleton-metadata-filter",
      scope,
      retrievedChunkCount: chunks.length,
      topK,
      ...(taxonomy ? { taxonomy } : {}),
    };

    const output: AnswerRagQueryOutput = {
      answer: generationResult.data.answer,
      citations: generationResult.data.citations,
      retrievalSummary,
      model: generationResult.data.model,
      traceId,
      events: [],
    };

    return { ok: true, data: output };
  }
}
````

## File: modules/notebooklm/subdomains/ai/application/use-cases/submit-rag-feedback.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: application/use-cases
 * Purpose: SubmitRagQueryFeedbackUseCase — persists user quality signal on
 *          a RAG answer and returns a CommandResult.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { IRagQueryFeedbackRepository } from "../../domain/repositories/IRagQueryFeedbackRepository";
import type { RagFeedbackRating, SubmitRagQueryFeedbackInput } from "../../domain/entities/rag-feedback.entities";

const VALID_RATINGS: RagFeedbackRating[] = ["helpful", "not_helpful", "partially_helpful"];

export class SubmitRagQueryFeedbackUseCase {
  constructor(private readonly feedbackRepository: IRagQueryFeedbackRepository) {}

  async execute(input: SubmitRagQueryFeedbackInput): Promise<CommandResult> {
    if (!input.traceId?.trim()) {
      return commandFailureFrom("QA_FEEDBACK_TRACE_ID_REQUIRED", "traceId is required.");
    }
    if (!input.organizationId?.trim()) {
      return commandFailureFrom("QA_FEEDBACK_ORG_REQUIRED", "organizationId is required.");
    }
    if (!input.submittedByUserId?.trim()) {
      return commandFailureFrom("QA_FEEDBACK_ACTOR_REQUIRED", "submittedByUserId is required.");
    }
    if (!VALID_RATINGS.includes(input.rating)) {
      return commandFailureFrom(
        "QA_FEEDBACK_INVALID_RATING",
        `rating must be one of: ${VALID_RATINGS.join(", ")}.`,
      );
    }

    try {
      const saved = await this.feedbackRepository.save({
        ...input,
        traceId: input.traceId.trim(),
        organizationId: input.organizationId.trim(),
        submittedByUserId: input.submittedByUserId.trim(),
      });
      return commandSuccess(saved.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "QA_FEEDBACK_PERSIST_ERROR",
        err instanceof Error ? err.message : "Failed to save feedback.",
      );
    }
  }
}
````

## File: modules/notebooklm/subdomains/ai/domain/entities/generation.entities.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: domain/entities
 * Purpose: Generation result types for the synthesis layer.
 *
 * Design notes:
 * - These types bridge grounding chunks → natural-language answer.
 * - RagRetrievedChunk is re-exported from retrieval entities for convenience;
 *   callers should use these types when working with generation output.
 */

import type { DomainError } from "@shared-types";

import type { RagRetrievedChunk } from "./retrieval.entities";

export type { RagRetrievedChunk };

/** Attribution claim within a generated answer */
export interface GenerationCitation {
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  readonly reason: string;
}

/** Input to the generation port */
export interface GenerateRagAnswerInput {
  readonly traceId: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly userQuery: string;
  readonly chunks: readonly RagRetrievedChunk[];
  /** Optional model override (e.g. "googleai/gemini-2.5-pro"). Fall back to env default. */
  readonly model?: string;
}

/** Successful generation output */
export interface GenerateRagAnswerOutput {
  readonly answer: string;
  readonly citations: readonly GenerationCitation[];
  readonly model: string;
}

/** Discriminated union result (compatible with CommandResult pattern) */
export type GenerateRagAnswerResult =
  | { ok: true; data: GenerateRagAnswerOutput }
  | { ok: false; error: DomainError };
````

## File: modules/notebooklm/subdomains/ai/domain/entities/rag-feedback.entities.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: domain/entities
 * Purpose: RagQueryFeedback — captures user-quality signal on generated answers.
 */

export type RagFeedbackRating = "helpful" | "not_helpful" | "partially_helpful";

export interface RagQueryFeedback {
  readonly id: string;
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: RagFeedbackRating;
  readonly comment?: string;
  readonly submittedByUserId: string;
  readonly submittedAtISO: string;
}

export interface SubmitRagQueryFeedbackInput {
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: RagFeedbackRating;
  readonly comment?: string;
  readonly submittedByUserId: string;
}
````

## File: modules/notebooklm/subdomains/ai/domain/entities/rag-query.entities.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: domain/entities
 * Purpose: RAG Q&A domain types — inputs, outputs, streaming events.
 *
 * Design notes:
 * - AnswerRagQueryInput / Output represent the public contract for the Q&A use case.
 * - RagStreamEvent models the streaming surface (for future streaming support).
 * - RagCitation re-exported from grounding for Q&A consumer convenience.
 */

import type { DomainError } from "@shared-types";

import type { RagCitation, RagRetrievalSummary } from "./retrieval.entities";

export type { RagCitation, RagRetrievalSummary };

export interface AnswerRagQueryInput {
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly userQuery: string;
  readonly taxonomy?: string;
  readonly topK?: number;
  readonly model?: string;
}

export interface AnswerRagQueryOutput {
  readonly answer: string;
  readonly citations: readonly RagCitation[];
  readonly retrievalSummary: RagRetrievalSummary;
  readonly model: string;
  readonly traceId: string;
  readonly events: readonly RagStreamEvent[];
}

export type AnswerRagQueryResult =
  | { ok: true; data: AnswerRagQueryOutput }
  | { ok: false; error: DomainError };

/** Streaming event for progressive answer delivery (extensibility hook) */
export interface RagStreamEvent {
  readonly type: "token" | "citation" | "done" | "error";
  readonly traceId: string;
  readonly payload: string | RagCitation | RagRetrievalSummary | DomainError;
}
````

## File: modules/notebooklm/subdomains/ai/domain/entities/retrieval.entities.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: domain/entities
 * Purpose: Core retrieval result types — the factual anchors used to ground
 *          AI-generated answers. These types flow from retrieval → synthesis.
 *
 * Design notes:
 * - RagRetrievedChunk is the atomic unit of grounding evidence.
 * - RagCitation links an answer claim back to its source chunk.
 * - RagRetrievalSummary reports the bibliographic scope of the retrieval pass.
 * - All fields are readonly; entities are value objects (compared by identity in the flow).
 */

/** A single text chunk fetched from the vector + sparse retrieval pass */
export interface RagRetrievedChunk {
  readonly chunkId: string;
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  /** Semantic / organisational taxonomy label (e.g. "規章制度") */
  readonly taxonomy: string;
  readonly text: string;
  /** Similarity score in [0, 1]; higher is more relevant */
  readonly score: number;
}

/** Attribution record that ties an answer claim to its source chunk */
export interface RagCitation {
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  readonly reason: string;
}

/** Summary of the retrieval execution scope for observability / UX */
export interface RagRetrievalSummary {
  readonly mode: "skeleton-metadata-filter";
  readonly scope: "organization" | "workspace";
  readonly retrievedChunkCount: number;
  readonly topK: number;
  readonly taxonomy?: string;
}
````

## File: modules/notebooklm/subdomains/ai/domain/events/AiDomainEvent.ts
````typescript
import type { RagFeedbackRating } from "../entities/rag-feedback.entities";
import type { OrganizationScope } from "../value-objects/OrganizationScope";
import type { TopK } from "../value-objects/TopK";

export interface AiDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface RagQuerySubmittedEvent extends AiDomainEvent {
  readonly type: "notebooklm.ai.query_submitted";
  readonly payload: {
    readonly traceId: string;
    readonly organizationId: string;
    readonly workspaceId?: string;
    readonly userQuery: string;
    readonly topK: TopK;
  };
}

export interface RagRetrievalCompletedEvent extends AiDomainEvent {
  readonly type: "notebooklm.ai.retrieval_completed";
  readonly payload: {
    readonly traceId: string;
    readonly chunkCount: number;
    readonly scope: OrganizationScope;
  };
}

export interface RagAnswerGeneratedEvent extends AiDomainEvent {
  readonly type: "notebooklm.ai.answer_generated";
  readonly payload: {
    readonly traceId: string;
    readonly model: string;
    readonly citationCount: number;
  };
}

export interface RagFeedbackSubmittedEvent extends AiDomainEvent {
  readonly type: "notebooklm.ai.feedback_submitted";
  readonly payload: {
    readonly traceId: string;
    readonly rating: RagFeedbackRating;
    readonly organizationId: string;
  };
}

export type AiDomainEventType =
  | RagQuerySubmittedEvent
  | RagRetrievalCompletedEvent
  | RagAnswerGeneratedEvent
  | RagFeedbackSubmittedEvent;
````

## File: modules/notebooklm/subdomains/ai/domain/events/index.ts
````typescript
export * from "./AiDomainEvent";
````

## File: modules/notebooklm/subdomains/ai/domain/ports/IVectorStore.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: domain/ports
 * Purpose: IVectorStore — hexagonal output port for vector database operations.
 *
 * Design notes:
 * - Domain owns this interface; infrastructure implements it.
 * - No SDK-specific types leak through this boundary.
 * - Embedding computation is the adapter's responsibility, not the port's.
 */

/** A document to index in the vector store */
export interface VectorDocument {
  readonly id: string;
  readonly content: string;
  readonly metadata?: Record<string, string | number | boolean>;
}

/** A result from a similarity search */
export interface VectorSearchResult {
  readonly id: string;
  /** Similarity score in [0, 1]; higher is closer */
  readonly score: number;
  readonly metadata?: Record<string, string | number | boolean>;
}

/**
 * Output port for any vector-store adapter (Upstash Vector, Pinecone, etc.).
 * Domain and application layers depend only on this interface.
 */
export interface IVectorStore {
  /** Insert or update documents; adapter handles embedding generation */
  upsert(documents: VectorDocument[]): Promise<void>;

  /**
   * Find the top-k documents most similar to the query.
   * @param query  - Natural-language query string
   * @param k      - Number of results to return
   * @param filter - Optional metadata predicate
   */
  search(
    query: string,
    k: number,
    filter?: Record<string, string | number | boolean>,
  ): Promise<VectorSearchResult[]>;

  /** Remove documents by ID */
  delete(ids: string[]): Promise<void>;
}
````

## File: modules/notebooklm/subdomains/ai/domain/repositories/IRagGenerationRepository.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: domain/repositories
 * Purpose: IRagGenerationRepository — output port for AI answer generation.
 *
 * Domain owns this contract; the Genkit adapter (infrastructure) implements it.
 */

import type { GenerateRagAnswerInput, GenerateRagAnswerResult } from "../entities/generation.entities";

export interface IRagGenerationRepository {
  generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult>;
}
````

## File: modules/notebooklm/subdomains/ai/domain/repositories/IRagQueryFeedbackRepository.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: domain/repositories
 * Purpose: IRagQueryFeedbackRepository — output port for persisting feedback.
 */

import type { RagQueryFeedback, SubmitRagQueryFeedbackInput } from "../entities/rag-feedback.entities";

export interface IRagQueryFeedbackRepository {
  save(input: SubmitRagQueryFeedbackInput): Promise<RagQueryFeedback>;
  listByOrganization(organizationId: string, limitCount: number): Promise<RagQueryFeedback[]>;
}
````

## File: modules/notebooklm/subdomains/ai/domain/repositories/IRagRetrievalRepository.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: domain/repositories
 * Purpose: IRagRetrievalRepository — output port for chunk retrieval.
 *
 * Design notes:
 * - The domain defines the contract; Firebase / Upstash / etc. implement it.
 * - Retrieval is scoped to organization or workspace to enforce tenancy isolation.
 */

import type { RagRetrievedChunk } from "../entities/retrieval.entities";

export interface RetrieveChunksInput {
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly normalizedQuery: string;
  readonly taxonomy?: string;
  readonly topK: number;
}

export interface IRagRetrievalRepository {
  retrieve(input: RetrieveChunksInput): Promise<readonly RagRetrievedChunk[]>;
}
````

## File: modules/notebooklm/subdomains/ai/domain/services/index.ts
````typescript
export * from "./RagCitationBuilder";
export * from "./RagPromptBuilder";
export * from "./RagScoringService";
````

## File: modules/notebooklm/subdomains/ai/domain/services/RagCitationBuilder.ts
````typescript
import type { GenerationCitation } from "../entities/generation.entities";
import type { RagRetrievedChunk } from "../entities/retrieval.entities";

export class RagCitationBuilder {
  /**
   * Derive citations from the chunks used for generation.
   * Citations are taken directly from input chunks to avoid model hallucination.
   */
  buildCitations(chunks: readonly RagRetrievedChunk[]): GenerationCitation[] {
    return chunks.map((chunk) => ({
      docId: chunk.docId,
      chunkIndex: chunk.chunkIndex,
      ...(chunk.page !== undefined ? { page: chunk.page } : {}),
      reason: `Retrieved from ${chunk.taxonomy} context with relevance score ${chunk.score.toFixed(2)}.`,
    }));
  }
}
````

## File: modules/notebooklm/subdomains/ai/domain/services/RagPromptBuilder.ts
````typescript
import type { RagRetrievedChunk } from "../entities/retrieval.entities";
import type { RagPrompt } from "../value-objects/RagPrompt";

export class RagPromptBuilder {
  /**
   * Format a single chunk for inclusion in the generation prompt.
   */
  formatChunkForPrompt(chunk: RagRetrievedChunk): string {
    const parts = [`[doc:${chunk.docId} chunk:${chunk.chunkIndex}`];
    if (chunk.page !== undefined) parts.push(` page:${chunk.page}`);
    if (chunk.taxonomy) parts.push(` taxonomy:${chunk.taxonomy}`);
    parts.push(`]\n${chunk.text}`);
    return parts.join("");
  }

  /**
   * Build the complete RAG generation prompt from retrieved chunks.
   */
  buildGenerationPrompt(userQuery: string, chunks: readonly RagRetrievedChunk[]): RagPrompt {
    const systemInstruction =
      "You are the Xuanwu RAG orchestration layer. Answer the user's question based ONLY on the provided context. " +
      "Cite sources using [doc:X chunk:Y] format. If the context is insufficient, say so honestly.";

    const formattedContext = chunks.map((chunk) => this.formatChunkForPrompt(chunk)).join("\n\n");

    return { systemInstruction, formattedContext, userQuery };
  }
}
````

## File: modules/notebooklm/subdomains/ai/domain/services/RagScoringService.ts
````typescript
import type { RagRetrievedChunk } from "../entities/retrieval.entities";

const CJK_REGEX = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/u;

export class RagScoringService {
  /**
   * Tokenize text into searchable tokens (CJK-aware).
   * CJK characters are treated as individual tokens; Latin words split by whitespace/punctuation.
   */
  tokenize(text: string): readonly string[] {
    const tokens: string[] = [];
    const normalized = text.toLowerCase();
    let currentWord = "";

    for (const char of normalized) {
      if (CJK_REGEX.test(char)) {
        if (currentWord) {
          tokens.push(currentWord);
          currentWord = "";
        }
        tokens.push(char);
      } else if (/\s|[^\w]/u.test(char)) {
        if (currentWord) {
          tokens.push(currentWord);
          currentWord = "";
        }
      } else {
        currentWord += char;
      }
    }

    if (currentWord) {
      tokens.push(currentWord);
    }

    return tokens.filter((token) => token.length > 0);
  }

  /**
   * Compute token-overlap score between query tokens and chunk text.
   * Returns score in [0, 1] = matchedTokens / queryTokens.length
   */
  computeTokenOverlapScore(queryTokens: readonly string[], chunkText: string): number {
    if (queryTokens.length === 0) return 0;

    const chunkTokenSet = new Set(this.tokenize(chunkText));
    if (chunkTokenSet.size === 0) return 0;

    const matchedCount = queryTokens.filter((token) => chunkTokenSet.has(token)).length;
    return matchedCount / queryTokens.length;
  }

  /**
   * Rank chunks by relevance score, returning top-K.
   */
  rankChunks(
    chunks: readonly RagRetrievedChunk[],
    queryTokens: readonly string[],
    topK: number,
  ): RagRetrievedChunk[] {
    if (topK <= 0 || !Number.isFinite(topK)) return [];
    const limit = Math.trunc(topK);
    if (limit <= 0) return [];

    return chunks
      .map((chunk) => ({
        ...chunk,
        score: this.computeTokenOverlapScore(queryTokens, chunk.text),
      }))
      .filter((chunk) => chunk.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, limit);
  }
}
````

## File: modules/notebooklm/subdomains/ai/domain/value-objects/index.ts
````typescript
export * from "./OrganizationScope";
export * from "./RagPrompt";
export * from "./RelevanceScore";
export * from "./TopK";
````

## File: modules/notebooklm/subdomains/ai/domain/value-objects/OrganizationScope.ts
````typescript
export interface OrganizationScope {
  readonly organizationId: string;
  readonly workspaceId?: string;
}

export function isWorkspaceScoped(scope: OrganizationScope): boolean {
  return typeof scope.workspaceId === "string" && scope.workspaceId.trim().length > 0;
}
````

## File: modules/notebooklm/subdomains/ai/domain/value-objects/RagPrompt.ts
````typescript
export interface RagPrompt {
  readonly systemInstruction: string;
  readonly formattedContext: string;
  readonly userQuery: string;
}
````

## File: modules/notebooklm/subdomains/ai/domain/value-objects/RelevanceScore.ts
````typescript
import { z } from "@lib-zod";

export const RelevanceScoreSchema = z.number().min(0).max(1).brand("RelevanceScore");
export type RelevanceScore = z.infer<typeof RelevanceScoreSchema>;

export function createRelevanceScore(raw: number): RelevanceScore {
  return RelevanceScoreSchema.parse(raw);
}
````

## File: modules/notebooklm/subdomains/ai/domain/value-objects/TopK.ts
````typescript
import { z } from "@lib-zod";

export const TopKSchema = z.number().int().positive().max(100).brand("TopK");
export type TopK = z.infer<typeof TopKSchema>;

export function createTopK(raw: number): TopK {
  return TopKSchema.parse(raw);
}

export const DEFAULT_TOP_K: TopK = 10 as TopK;
````

## File: modules/notebooklm/subdomains/ai/infrastructure/firebase/FirebaseRagQueryFeedbackAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: infrastructure/firebase
 * Purpose: FirebaseRagQueryFeedbackAdapter — implements IRagQueryFeedbackRepository
 *          using Firestore (client SDK) for feedback persistence.
 *
 * Firestore collection: ragQueryFeedback/{autoId}
 */

import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { v7 as generateId } from "@lib-uuid";
import { firebaseClientApp } from "@integration-firebase/client";

import type { IRagQueryFeedbackRepository } from "../../domain/repositories/IRagQueryFeedbackRepository";
import type {
  RagQueryFeedback,
  SubmitRagQueryFeedbackInput,
} from "../../domain/entities/rag-feedback.entities";

const COLLECTION = "ragQueryFeedback";

interface FirestoreFeedbackDoc {
  readonly id: string;
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: string;
  readonly comment?: string;
  readonly submittedByUserId: string;
  readonly submittedAtISO: string;
}

export class FirebaseRagQueryFeedbackAdapter implements IRagQueryFeedbackRepository {
  private db() {
    return getFirestore(firebaseClientApp);
  }

  async save(input: SubmitRagQueryFeedbackInput): Promise<RagQueryFeedback> {
    const id = generateId();
    const submittedAtISO = new Date().toISOString();

    const doc: FirestoreFeedbackDoc = {
      id,
      traceId: input.traceId,
      userQuery: input.userQuery,
      organizationId: input.organizationId,
      ...(input.workspaceId ? { workspaceId: input.workspaceId } : {}),
      rating: input.rating,
      ...(input.comment ? { comment: input.comment } : {}),
      submittedByUserId: input.submittedByUserId,
      submittedAtISO,
    };

    await addDoc(collection(this.db(), COLLECTION), doc);

    return {
      id,
      traceId: input.traceId,
      userQuery: input.userQuery,
      organizationId: input.organizationId,
      ...(input.workspaceId ? { workspaceId: input.workspaceId } : {}),
      rating: input.rating,
      ...(input.comment ? { comment: input.comment } : {}),
      submittedByUserId: input.submittedByUserId,
      submittedAtISO,
    };
  }

  async listByOrganization(organizationId: string, limitCount: number): Promise<RagQueryFeedback[]> {
    const q = query(
      collection(this.db(), COLLECTION),
      where("organizationId", "==", organizationId),
      orderBy("submittedAtISO", "desc"),
      limit(limitCount),
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data() as FirestoreFeedbackDoc;
      return {
        id: typeof data.id === "string" ? data.id : d.id,
        traceId: data.traceId,
        userQuery: data.userQuery,
        organizationId: data.organizationId,
        ...(data.workspaceId ? { workspaceId: data.workspaceId } : {}),
        rating: data.rating as RagQueryFeedback["rating"],
        ...(data.comment ? { comment: data.comment } : {}),
        submittedByUserId: data.submittedByUserId,
        submittedAtISO: data.submittedAtISO,
      };
    });
  }
}
````

## File: modules/notebooklm/subdomains/ai/infrastructure/firebase/FirebaseRagRetrievalAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: infrastructure/firebase
 * Purpose: FirebaseRagRetrievalAdapter — implements IRagRetrievalRepository
 *          using Firestore collectionGroup queries for document-scoped chunks.
 *
 * Retrieval strategy:
 *  1. Over-fetch candidate documents (filtered by org / workspace / taxonomy / status=ready).
 *  2. Over-fetch candidate chunks in the same scope.
 *  3. Compute a token-overlap relevance score (CJK-aware tokeniser).
 *  4. Filter to chunks whose parent doc is in the ready-document set.
 *  5. Sort descending by score, return top-K.
 */

import { collectionGroup, getDocs, getFirestore, limit, query, where } from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";

import type { RagRetrievedChunk } from "../../domain/entities/retrieval.entities";
import type { IRagRetrievalRepository, RetrieveChunksInput } from "../../domain/repositories/IRagRetrievalRepository";

// --- Firestore document shapes -----------------------------------------------

interface FirestoreRagDocument {
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly status?: string;
  readonly taxonomy?: string;
}

interface FirestoreRagChunk {
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly docId?: string;
  readonly text?: string;
  readonly taxonomy?: string;
  readonly page?: number;
  readonly chunkIndex?: number;
}

// --- Retrieval tuning constants -----------------------------------------------

const DOCUMENT_OVER_FETCH_MULTIPLIER = 5;
const MIN_DOCUMENT_LIMIT = 20;
const CHUNK_OVER_FETCH_MULTIPLIER = 10;
const MIN_CHUNK_LIMIT = 50;

// --- Scoring helpers (pure functions, no state) --------------------------------

/** CJK-aware whitespace / punctuation tokeniser */
function tokenize(value: string): readonly string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fff]+/u)
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Token-overlap score between query and chunk text.
 * Returns a value in [0, 1] — fraction of query tokens found in the chunk.
 */
function computeTokenOverlapScore(queryTokens: readonly string[], chunkText: string): number {
  if (queryTokens.length === 0) return 0;
  const chunkTokens = tokenize(chunkText);
  if (chunkTokens.length === 0) return 0;
  const matchCount = queryTokens.filter((t) => chunkTokens.includes(t)).length;
  return matchCount / queryTokens.length;
}

// --- Adapter ------------------------------------------------------------------

export class FirebaseRagRetrievalAdapter implements IRagRetrievalRepository {
  private readonly db = getFirestore(firebaseClientApp);

  async retrieve(input: RetrieveChunksInput): Promise<readonly RagRetrievedChunk[]> {
    // Step 1 — resolve ready document IDs in scope
    const documentsQuery = query(
      collectionGroup(this.db, "documents"),
      where("organizationId", "==", input.organizationId),
      where("status", "==", "ready"),
      ...(input.workspaceId ? [where("workspaceId", "==", input.workspaceId)] : []),
      ...(input.taxonomy ? [where("taxonomy", "==", input.taxonomy)] : []),
      limit(Math.max(input.topK * DOCUMENT_OVER_FETCH_MULTIPLIER, MIN_DOCUMENT_LIMIT)),
    );

    const documentSnapshots = await getDocs(documentsQuery);
    const readyDocumentIds = new Set(
      documentSnapshots.docs
        .filter((snap) => {
          const data = snap.data() as FirestoreRagDocument;
          return data.status === "ready";
        })
        .map((snap) => snap.id),
    );

    if (readyDocumentIds.size === 0) return [];

    // Step 2 — over-fetch candidate chunks
    const chunksQuery = query(
      collectionGroup(this.db, "chunks"),
      where("organizationId", "==", input.organizationId),
      ...(input.workspaceId ? [where("workspaceId", "==", input.workspaceId)] : []),
      ...(input.taxonomy ? [where("taxonomy", "==", input.taxonomy)] : []),
      limit(Math.max(input.topK * CHUNK_OVER_FETCH_MULTIPLIER, MIN_CHUNK_LIMIT)),
    );

    const chunkSnapshots = await getDocs(chunksQuery);
    const queryTokens = tokenize(input.normalizedQuery);

    // Step 3 — score, filter, sort, slice
    return chunkSnapshots.docs
      .map((snap) => {
        const data = snap.data() as FirestoreRagChunk;
        const text = typeof data.text === "string" ? data.text : "";
        const docId = typeof data.docId === "string" ? data.docId : "";
        return {
          chunkId: snap.id,
          docId,
          chunkIndex: typeof data.chunkIndex === "number" ? data.chunkIndex : 0,
          ...(typeof data.page === "number" ? { page: data.page } : {}),
          taxonomy: typeof data.taxonomy === "string" ? data.taxonomy : "general",
          text,
          score: computeTokenOverlapScore(queryTokens, text),
        } satisfies RagRetrievedChunk;
      })
      .filter((chunk) => chunk.docId !== "" && readyDocumentIds.has(chunk.docId) && chunk.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, input.topK);
  }
}
````

## File: modules/notebooklm/subdomains/ai/infrastructure/genkit/genkit-ai-client.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: infrastructure/genkit
 * Purpose: Genkit AI client singleton — server-side only.
 *
 * Design notes:
 * - Reads GOOGLE_GENAI_API_KEY and GENKIT_MODEL from environment.
 * - If no API key is present (e.g. test environment) the googleAI plugin is
 *   skipped so the server still starts without credentials.
 * - This file must not be imported by any client (browser) bundle.
 */

import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

const DEFAULT_SYNTHESIS_MODEL = "googleai/gemini-2.0-flash";

const envModel = process.env.GENKIT_MODEL?.trim();
const configuredModel =
  envModel && envModel.length > 0 ? envModel : DEFAULT_SYNTHESIS_MODEL;

const hasApiKey =
  typeof process.env.GOOGLE_GENAI_API_KEY === "string" &&
  process.env.GOOGLE_GENAI_API_KEY.trim().length > 0;

export const synthesisAiClient = genkit({
  plugins: hasApiKey ? [googleAI()] : [],
  model: configuredModel,
});

export function resolveGenerationModel(modelOverride?: string): string {
  const normalized = modelOverride?.trim();
  return normalized && normalized.length > 0 ? normalized : configuredModel;
}
````

## File: modules/notebooklm/subdomains/ai/infrastructure/genkit/GenkitRagGenerationAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: infrastructure/genkit
 * Purpose: GenkitRagGenerationAdapter — implements IRagGenerationRepository
 *          using Genkit to invoke Google AI (or any configured model).
 *
 * Design notes:
 * - All prompt construction is encapsulated here (not in domain / use cases).
 * - Citations are derived from the input chunks, not re-extracted from the
 *   model output (avoids hallucination in citation attribution).
 * - Unhandled model errors are wrapped in a structured DomainError value.
 */

import type { IRagGenerationRepository } from "../../domain/repositories/IRagGenerationRepository";
import type {
  GenerateRagAnswerInput,
  GenerateRagAnswerOutput,
  GenerateRagAnswerResult,
  GenerationCitation,
} from "../../domain/entities/generation.entities";
import { synthesisAiClient, resolveGenerationModel } from "./genkit-ai-client";

// --- Prompt construction helpers (pure, testable) ----------------------------

function formatChunkForPrompt(chunk: GenerateRagAnswerInput["chunks"][number]): string {
  const pageLabel = typeof chunk.page === "number" ? ` page:${chunk.page}` : "";
  return `[doc:${chunk.docId} chunk:${chunk.chunkIndex}${pageLabel} taxonomy:${chunk.taxonomy}]\n${chunk.text}`;
}

function buildGenerationPrompt(input: GenerateRagAnswerInput): string {
  const contextBlocks = input.chunks.map(formatChunkForPrompt).join("\n\n---\n\n");
  return [
    "Use the retrieved context to answer the user query.",
    "If the context is incomplete, answer conservatively and keep citations grounded in the retrieved chunks.",
    `User query: ${input.userQuery}`,
    "Retrieved context:",
    contextBlocks,
  ].join("\n\n");
}

function buildCitations(input: GenerateRagAnswerInput): readonly GenerationCitation[] {
  return input.chunks.map((chunk) => ({
    docId: chunk.docId,
    chunkIndex: chunk.chunkIndex,
    ...(typeof chunk.page === "number" ? { page: chunk.page } : {}),
    reason: `Retrieved from ${chunk.taxonomy} context with relevance score ${chunk.score.toFixed(2)}.`,
  }));
}

// --- Adapter ------------------------------------------------------------------

const SYSTEM_PROMPT =
  "You are the Xuanwu RAG orchestration layer. Answer only from the supplied context and preserve citations.";

export class GenkitRagGenerationAdapter implements IRagGenerationRepository {
  async generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult> {
    try {
      const response = await synthesisAiClient.generate({
        prompt: buildGenerationPrompt(input),
        system: SYSTEM_PROMPT,
        ...(input.model ? { model: input.model } : {}),
      });

      const output: GenerateRagAnswerOutput = {
        answer: response.text,
        model: resolveGenerationModel(input.model),
        citations: buildCitations(input),
      };

      return { ok: true, data: output };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: "SYNTHESIS_MODEL_PROVIDER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : `Unexpected synthesis error: ${String(error)}`,
          context: { traceId: input.traceId },
        },
      };
    }
  }
}
````

## File: modules/notebooklm/subdomains/ai/README.md
````markdown
# AI

AI-powered grounding, QA, and synthesis.

## Ownership

- **Bounded Context**: notebooklm
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |
| `interfaces/` | UI components, hooks, actions, and queries |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notebooklm/subdomains/conversation-versioning/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notebooklm/subdomains/conversation-versioning/application/index.ts
````typescript
// Purpose: Application layer placeholder for notebooklm subdomain 'conversation-versioning'.
````

## File: modules/notebooklm/subdomains/conversation-versioning/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notebooklm subdomain 'conversation-versioning'.
````

## File: modules/notebooklm/subdomains/conversation-versioning/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notebooklm subdomain 'conversation-versioning'.
````

## File: modules/notebooklm/subdomains/conversation-versioning/README.md
````markdown
# Conversation Versioning

對話版本與快照策略。

## Ownership

- **Bounded Context**: notebooklm
- **Subdomain Type**: Baseline
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notebooklm/subdomains/conversation/api/factories.ts
````typescript
import { FirebaseThreadRepository } from "../infrastructure/firebase/FirebaseThreadRepository";

export function makeThreadRepo() {
  return new FirebaseThreadRepository();
}
````

## File: modules/notebooklm/subdomains/conversation/api/index.ts
````typescript
/**
 * Public API boundary for the conversation subdomain.
 *
 * Cross-module consumers MUST import through this entry point.
 */

export { AiChatPage } from "../interfaces/components/AiChatPage";
export type { AiChatPageProps } from "../interfaces/components/AiChatPage";

export type { ChatMessage } from "../interfaces/helpers";
export {
  STORAGE_KEY,
  buildContextPrompt,
  generateMsgId,
  threadFromMessages,
} from "../interfaces/helpers";

// Domain types
export type { Message, MessageRole } from "../domain/entities/message";
export type { Thread } from "../domain/entities/thread";
export type { IThreadRepository } from "../domain/repositories/IThreadRepository";

// Thread persistence actions
export { saveThread, loadThread } from "../interfaces/_actions/thread.actions";
````

## File: modules/notebooklm/subdomains/conversation/application/dto/conversation.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the conversation subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { Thread } from "../../domain/entities/thread";
````

## File: modules/notebooklm/subdomains/conversation/domain/entities/message.ts
````typescript
/**
 * modules/notebook — domain entity: Message
 */

import type { ID } from "@shared-types";

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  readonly id: ID;
  readonly role: MessageRole;
  readonly content: string;
  readonly createdAt: string;
}
````

## File: modules/notebooklm/subdomains/conversation/domain/entities/thread.ts
````typescript
/**
 * modules/notebook — domain entity: Thread
 */

import type { ID } from "@shared-types";
import type { Message } from "./message";

export interface Thread {
  readonly id: ID;
  readonly messages: Message[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
````

## File: modules/notebooklm/subdomains/conversation/domain/repositories/IThreadRepository.ts
````typescript
/**
 * modules/notebook — domain repository interface: IThreadRepository
 */

import type { Thread } from "../entities/thread";

export interface IThreadRepository {
  save(accountId: string, thread: Thread): Promise<void>;
  getById(accountId: string, threadId: string): Promise<Thread | null>;
}
````

## File: modules/notebooklm/subdomains/conversation/infrastructure/firebase/FirebaseThreadRepository.ts
````typescript
/**
 * Module: notebooklm/conversation
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/threads/{threadId}
 *
 * Persists Thread (messages array) to Firestore so conversations survive page reload.
 */

import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { Thread } from "../../domain/entities/thread";
import type { Message } from "../../domain/entities/message";
import type { IThreadRepository } from "../../domain/repositories/IThreadRepository";

function threadDoc(
  db: ReturnType<typeof getFirestore>,
  accountId: string,
  threadId: string,
) {
  return doc(db, "accounts", accountId, "threads", threadId);
}

function toMessage(m: Record<string, unknown>): Message {
  return {
    id: typeof m.id === "string" ? m.id : "",
    role: (m.role as Message["role"]) ?? "user",
    content: typeof m.content === "string" ? m.content : "",
    createdAt: typeof m.createdAt === "string" ? m.createdAt : new Date().toISOString(),
  };
}

function toThread(id: string, data: Record<string, unknown>): Thread {
  const messages = Array.isArray(data.messages)
    ? (data.messages as Record<string, unknown>[]).map(toMessage)
    : [];
  return {
    id,
    messages,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
  };
}

export class FirebaseThreadRepository implements IThreadRepository {
  private db() {
    return getFirestore(firebaseClientApp);
  }

  async save(accountId: string, thread: Thread): Promise<void> {
    const db = this.db();
    const ref = threadDoc(db, accountId, thread.id);
    await setDoc(ref, {
      id: thread.id,
      messages: thread.messages,
      createdAt: thread.createdAt,
      updatedAt: new Date().toISOString(),
      _savedAt: serverTimestamp(),
    });
  }

  async getById(accountId: string, threadId: string): Promise<Thread | null> {
    const db = this.db();
    const snap = await getDoc(threadDoc(db, accountId, threadId));
    if (!snap.exists()) return null;
    return toThread(snap.id, snap.data() as Record<string, unknown>);
  }
}
````

## File: modules/notebooklm/subdomains/conversation/interfaces/_actions/chat.actions.ts
````typescript
"use server";

import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
  Thread,
} from "@/modules/notebooklm/api";
import {
  GenerateNotebookResponseUseCase,
  GenkitNotebookRepository,
} from "@/modules/notebooklm/api/server";
import { saveThread, loadThread } from "@/modules/notebooklm/api";

export async function sendChatMessage(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult> {
  const useCase = new GenerateNotebookResponseUseCase(new GenkitNotebookRepository());
  return useCase.execute(input);
}

export { saveThread, loadThread };
export type { Thread };
````

## File: modules/notebooklm/subdomains/conversation/interfaces/_actions/thread.actions.ts
````typescript
"use server";

import type { Thread } from "../../application/dto/conversation.dto";
import { makeThreadRepo } from "../../api/factories";

export async function saveThread(accountId: string, thread: Thread): Promise<void> {
  await makeThreadRepo().save(accountId, thread);
}

export async function loadThread(accountId: string, threadId: string): Promise<Thread | null> {
  return makeThreadRepo().getById(accountId, threadId);
}
````

## File: modules/notebooklm/subdomains/conversation/interfaces/components/AiChatPage.tsx
````typescript
"use client";

/**
 * Module: notebooklm/subdomains/conversation
 * Component: AiChatPage
 * Purpose: Full-page AI chat UI — wired to conversation server actions.
 *          Thread persistence via Firestore. Multi-turn context support.
 *
 * Props are injected by the app/ shim so this component has no provider dependencies.
 */

import Link from "next/link";
import { Bot, BookOpen, Brain, FileText, Lightbulb, Loader2, Plus, SendHorizonal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { v7 as uuid } from "@lib-uuid";

import type { WorkspaceEntity } from "@/modules/workspace/api";
import { resolveWorkspaceFromMap, WorkspaceContextCard } from "@/modules/workspace/api";
import { cn } from "@shared-utils";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

import { sendChatMessage, saveThread, loadThread } from "../_actions/chat.actions";
import {
  type ChatMessage,
  STORAGE_KEY,
  buildContextPrompt,
  generateMsgId,
  threadFromMessages,
} from "../helpers";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface AiChatPageProps {
  accountId: string;
  workspaces: Record<string, WorkspaceEntity>;
  requestedWorkspaceId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AiChatPage({ accountId, workspaces, requestedWorkspaceId }: AiChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [threadCreatedAt, setThreadCreatedAt] = useState<string>(new Date().toISOString());
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentWorkspace = resolveWorkspaceFromMap(workspaces, requestedWorkspaceId);
  const workspaceName = currentWorkspace?.name ?? null;
  const workspaceQuery = currentWorkspace ? `?workspaceId=${encodeURIComponent(currentWorkspace.id)}` : "";
  const latestUserPrompt = [...messages].reverse().find((m) => m.role === "user")?.content ?? null;

  // Load persisted thread on mount
  useEffect(() => {
    if (!accountId) return;
    const storageKey = STORAGE_KEY(accountId, requestedWorkspaceId);
    const storedId = localStorage.getItem(storageKey);
    if (!storedId) return;
    setThreadId(storedId);
    void loadThread(accountId, storedId).then((thread) => {
      if (!thread || thread.messages.length === 0) return;
      setThreadCreatedAt(thread.createdAt);
      setMessages(
        thread.messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content })),
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const summaryItems = useMemo(() => {
    if (messages.length === 0) {
      return [
        "先整理來源文件與工作區脈絡，再開始對話。",
        "需要帶引用的回答時，可搭配 Ask / Cite 使用。",
      ];
    }
    return [
      `目前已有 ${messages.length} 則訊息，包含 ${messages.filter((m) => m.role === "assistant").length} 次模型回覆。`,
      latestUserPrompt ? `最近一次提問：${latestUserPrompt}` : "最近一次提問尚未建立。",
    ];
  }, [latestUserPrompt, messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isPending) return;

    const userMsg: ChatMessage = { id: generateMsgId(), role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsPending(true);

    const contextPrompt = buildContextPrompt(messages);

    try {
      const result = await sendChatMessage({
        prompt: text,
        ...(contextPrompt ? { system: contextPrompt } : {}),
      });
      if (result.ok) {
        const assistantMsg: ChatMessage = {
          id: generateMsgId(),
          role: "assistant",
          content: result.data.text,
        };
        const finalMessages = [...nextMessages, assistantMsg];
        setMessages(finalMessages);

        if (accountId) {
          const storageKey = STORAGE_KEY(accountId, requestedWorkspaceId);
          let currentThreadId = threadId;
          if (!currentThreadId) {
            currentThreadId = uuid();
            setThreadId(currentThreadId);
            localStorage.setItem(storageKey, currentThreadId);
          }
          const thread = threadFromMessages(currentThreadId, finalMessages, threadCreatedAt);
          void saveThread(accountId, thread);
        }
      } else {
        setError(result.error.message);
      }
    } catch {
      setError("無法連接至 AI 服務，請稍後再試。");
    } finally {
      setIsPending(false);
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  }

  function handleNewThread() {
    if (!accountId) return;
    const storageKey = STORAGE_KEY(accountId, requestedWorkspaceId);
    localStorage.removeItem(storageKey);
    setThreadId(null);
    setMessages([]);
    setThreadCreatedAt(new Date().toISOString());
    setError(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="grid h-full min-h-0 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="border-b border-border/60 bg-muted/20 p-4 lg:border-b-0 lg:border-r">
        <div className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="size-4 text-primary" />
                Notebook / AI
              </CardTitle>
              <CardDescription>
                將工作區知識、知識頁面與查詢消費層收斂成單一 workspace-scoped notebook 介面，而不是獨立聊天產品。
              </CardDescription>
            </CardHeader>
          </Card>

          <WorkspaceContextCard workspace={currentWorkspace} />

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BookOpen className="size-4 text-primary" />
                Source context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <Link href={`/source/documents${workspaceQuery}`} className="flex items-center gap-2 rounded-md border border-border/50 px-3 py-2 transition hover:bg-muted">
                <FileText className="size-3.5" />
                文件來源 / Documents
              </Link>
              <Link href={`/knowledge/pages${workspaceQuery}`} className="flex items-center gap-2 rounded-md border border-border/50 px-3 py-2 transition hover:bg-muted">
                <BookOpen className="size-3.5" />
                知識頁面 / Pages
              </Link>
              <Link href={`/notebook/rag-query${workspaceQuery}`} className="flex items-center gap-2 rounded-md border border-border/50 px-3 py-2 transition hover:bg-muted">
                <Bot className="size-3.5" />
                Ask / Cite / RAG Query
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Summary snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              {summaryItems.map((item) => (
                <p key={item} className="rounded-md border border-border/50 px-3 py-2">
                  {item}
                </p>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lightbulb className="size-4 text-primary" />
                Insight board
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p className="rounded-md border border-border/50 px-3 py-2">
                目前仍是 Notebook shell，摘要、洞察、引用整理會在後續 phase 持續補齊。
              </p>
              <p className="rounded-md border border-border/50 px-3 py-2">
                若你需要可追溯回答，優先改從 Ask / Cite 取得引用，再回到這裡整理觀點。
              </p>
            </CardContent>
          </Card>
        </div>
      </aside>

      <section className="flex min-h-0 flex-col">
        <div className="flex shrink-0 items-center gap-3 border-b border-border/60 px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
            <Bot className="size-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-none">Notebook / AI</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">工作區問答 · 摘要草稿 · 洞察整理</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {threadId && (
              <span className="text-[10px] text-muted-foreground/60">
                Thread · {messages.length} 則
              </span>
            )}
            <Button size="sm" variant="ghost" onClick={handleNewThread} disabled={messages.length === 0}>
              <Plus className="mr-1 size-3.5" />
              新對話
            </Button>
          </div>
        </div>

        {workspaceName && (
          <div className="shrink-0 border-b border-border/40 bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
            目前從工作區 <span className="font-medium text-foreground">{workspaceName}</span> 進入；Notebook 會把這裡視為主要知識上下文。
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && !isPending && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                <Bot className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">開始你的 notebook conversation</p>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                  先問工作區背景、文件摘要、會議筆記整理或知識問答，再逐步累積 summary 與 insight。
                </p>
              </div>
            </div>
          )}

          <div className="mx-auto max-w-2xl space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {isPending && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-2.5">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs text-destructive">
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="shrink-0 border-t border-border/60 bg-background/80 px-4 py-3 backdrop-blur"
        >
          <div className="mx-auto flex max-w-2xl items-end gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="輸入你的 notebook 問題… (Enter 送出，Shift+Enter 換行)"
              disabled={isPending}
              className="flex-1 resize-none rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ maxHeight: "120px" }}
            />
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !input.trim()}
              className="shrink-0 gap-1.5"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendHorizonal className="size-4" />
              )}
              <span className="hidden sm:inline">送出</span>
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
````

## File: modules/notebooklm/subdomains/conversation/interfaces/helpers.ts
````typescript
import type { Thread } from "@/modules/notebooklm/api";

// ── Domain types ──────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ── Storage key ───────────────────────────────────────────────────────────────

export const STORAGE_KEY = (accountId: string, workspaceId: string) =>
  `nb_thread_${accountId}_${workspaceId || "default"}`;

// ── Pure helpers ──────────────────────────────────────────────────────────────

export function buildContextPrompt(history: ChatMessage[]): string {
  if (history.length === 0) return "";
  const lines = history.map((m) => `[${m.role === "user" ? "User" : "Assistant"}]: ${m.content}`);
  return `Previous conversation context (for reference):\n${lines.join("\n")}\n\nPlease continue the conversation, taking the above context into account.`;
}

export function generateMsgId() {
  return `msg_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export function threadFromMessages(id: string, msgs: ChatMessage[], createdAt: string): Thread {
  return {
    id,
    messages: msgs.map((m) => ({ id: m.id, role: m.role, content: m.content, createdAt: new Date().toISOString() })),
    createdAt,
    updatedAt: new Date().toISOString(),
  };
}
````

## File: modules/notebooklm/subdomains/conversation/README.md
````markdown
# Conversation

Conversation threads and message management.

## Ownership

- **Bounded Context**: notebooklm
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |
| `interfaces/` | UI components, hooks, actions, and queries |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notebooklm/subdomains/evaluation/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notebooklm/subdomains/evaluation/application/index.ts
````typescript
// Purpose: Application layer placeholder for notebooklm subdomain 'evaluation'.
````

## File: modules/notebooklm/subdomains/evaluation/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notebooklm subdomain 'evaluation'.
````

## File: modules/notebooklm/subdomains/evaluation/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notebooklm subdomain 'evaluation'.
````

## File: modules/notebooklm/subdomains/evaluation/README.md
````markdown
# Evaluation

建立品質評估與回歸比較的正典邊界。

## Ownership

- **Bounded Context**: notebooklm
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notebooklm/subdomains/grounding/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notebooklm/subdomains/grounding/application/index.ts
````typescript
// Purpose: Application layer placeholder for notebooklm subdomain 'grounding'.
````

## File: modules/notebooklm/subdomains/grounding/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notebooklm subdomain 'grounding'.
````

## File: modules/notebooklm/subdomains/grounding/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notebooklm subdomain 'grounding'.
````

## File: modules/notebooklm/subdomains/grounding/README.md
````markdown
# Grounding

建立引用對齊與可追溯證據的正典邊界。

## Ownership

- **Bounded Context**: notebooklm
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notebooklm/subdomains/ingestion/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notebooklm/subdomains/ingestion/application/index.ts
````typescript
// Purpose: Application layer placeholder for notebooklm subdomain 'ingestion'.
````

## File: modules/notebooklm/subdomains/ingestion/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notebooklm subdomain 'ingestion'.
````

## File: modules/notebooklm/subdomains/ingestion/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notebooklm subdomain 'ingestion'.
````

## File: modules/notebooklm/subdomains/ingestion/README.md
````markdown
# Ingestion

建立來源匯入、正規化與前處理的正典邊界。

## Ownership

- **Bounded Context**: notebooklm
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notebooklm/subdomains/note/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notebooklm/subdomains/note/application/index.ts
````typescript
// Purpose: Application layer placeholder for notebooklm subdomain 'note'.
````

## File: modules/notebooklm/subdomains/note/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notebooklm subdomain 'note'.
````

## File: modules/notebooklm/subdomains/note/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notebooklm subdomain 'note'.
````

## File: modules/notebooklm/subdomains/note/README.md
````markdown
# Note

輕量筆記與知識連結。

## Ownership

- **Bounded Context**: notebooklm
- **Subdomain Type**: Baseline
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notebooklm/subdomains/notebook/api/factories.ts
````typescript
import { GenkitNotebookRepository } from "../infrastructure/genkit/GenkitNotebookRepository";

export function makeNotebookRepo() {
  return new GenkitNotebookRepository();
}
````

## File: modules/notebooklm/subdomains/notebook/api/index.ts
````typescript
export type {
  NotebookResponse,
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../domain/entities/AgentGeneration";

export type { NotebookRepository } from "../domain/repositories/NotebookRepository";

export { GenerateNotebookResponseUseCase } from "../application/use-cases/generate-notebook-response.use-case";

export { generateNotebookResponse } from "../interfaces/_actions/generate-notebook-response.actions";
````

## File: modules/notebooklm/subdomains/notebook/api/server.ts
````typescript
/**
 * notebook subdomain — server-only API.
 *
 * Exports infrastructure implementations that depend on server-only packages
 * (genkit, google-genai). Must only be imported in Server Actions, route
 * handlers, or server-side infrastructure.
 */

export { GenkitNotebookRepository } from "../infrastructure/genkit/GenkitNotebookRepository";
export { GenerateNotebookResponseUseCase } from "../application/use-cases/generate-notebook-response.use-case";
export { makeNotebookRepo } from "./factories";
````

## File: modules/notebooklm/subdomains/notebook/application/dto/notebook.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the notebook subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../domain/entities/AgentGeneration";
````

## File: modules/notebooklm/subdomains/notebook/application/use-cases/generate-notebook-response.use-case.ts
````typescript
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { NotebookRepository } from "../../domain/repositories/NotebookRepository";

export class GenerateNotebookResponseUseCase {
  constructor(private readonly agentRepository: NotebookRepository) {}

  async execute(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult> {
    const prompt = input.prompt.trim();
    if (!prompt) {
      return {
        ok: false,
        error: {
          code: "AGENT_PROMPT_REQUIRED",
          message: "Agent prompt is required.",
        },
      };
    }

    return this.agentRepository.generateResponse({
      ...input,
      prompt,
      ...(typeof input.system === "string" ? { system: input.system.trim() } : {}),
    });
  }
}
````

## File: modules/notebooklm/subdomains/notebook/domain/entities/AgentGeneration.ts
````typescript
import type { DomainError } from "@shared-types";

export interface GenerateNotebookResponseInput {
  readonly prompt: string;
  readonly model?: string;
  readonly system?: string;
}

export interface NotebookResponse {
  readonly text: string;
  readonly model: string;
  readonly finishReason?: string;
}

export type GenerateNotebookResponseResult =
  | { ok: true; data: NotebookResponse }
  | { ok: false; error: DomainError };
````

## File: modules/notebooklm/subdomains/notebook/domain/repositories/NotebookRepository.ts
````typescript
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../entities/AgentGeneration";

export interface NotebookRepository {
  generateResponse(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult>;
}
````

## File: modules/notebooklm/subdomains/notebook/infrastructure/genkit/client.ts
````typescript
/**
 * @module modules/notebook/infrastructure/genkit/client
 */

import { googleAI } from "@genkit-ai/google-genai";
import { genkit } from "genkit";

const DEFAULT_MODEL = "googleai/gemini-2.5-flash";

export type GenkitClientOptions = {
  model?: string;
};

export function getConfiguredGenkitModel(model?: string) {
  return model ?? process.env.GENKIT_MODEL ?? DEFAULT_MODEL;
}

export function createGenkitClient(options?: GenkitClientOptions) {
  return genkit({
    plugins: [googleAI()],
    model: getConfiguredGenkitModel(options?.model),
  });
}

export const agentClient = createGenkitClient();
````

## File: modules/notebooklm/subdomains/notebook/infrastructure/genkit/GenkitNotebookRepository.ts
````typescript
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { NotebookRepository } from "../../domain/repositories/NotebookRepository";
import { agentClient, getConfiguredGenkitModel } from "./client";

export class GenkitNotebookRepository implements NotebookRepository {
  async generateResponse(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult> {
    try {
      const response = await agentClient.generate({
        prompt: input.prompt,
        ...(input.system ? { system: input.system } : {}),
        ...(input.model ? { model: input.model } : {}),
      });

      return {
        ok: true,
        data: {
          text: response.text,
          model: getConfiguredGenkitModel(input.model),
          finishReason: response.finishReason ? String(response.finishReason) : undefined,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: "AGENT_GENERATE_FAILED",
          message:
            error instanceof Error ? error.message : `Unexpected agent generation error: ${String(error)}`,
        },
      };
    }
  }
}
````

## File: modules/notebooklm/subdomains/notebook/interfaces/_actions/generate-notebook-response.actions.ts
````typescript
"use server";

import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../application/dto/notebook.dto";
import { GenerateNotebookResponseUseCase } from "../../application/use-cases/generate-notebook-response.use-case";
import { makeNotebookRepo } from "../../api/factories";

export async function generateNotebookResponse(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult> {
  const useCase = new GenerateNotebookResponseUseCase(makeNotebookRepo());
  return useCase.execute(input);
}
````

## File: modules/notebooklm/subdomains/notebook/README.md
````markdown
# Notebook

Notebook container and organization.

## Ownership

- **Bounded Context**: notebooklm
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notebooklm/subdomains/retrieval/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notebooklm/subdomains/retrieval/application/index.ts
````typescript
// Purpose: Application layer placeholder for notebooklm subdomain 'retrieval'.
````

## File: modules/notebooklm/subdomains/retrieval/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notebooklm subdomain 'retrieval'.
````

## File: modules/notebooklm/subdomains/retrieval/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notebooklm subdomain 'retrieval'.
````

## File: modules/notebooklm/subdomains/retrieval/README.md
````markdown
# Retrieval

建立查詢召回與排序策略的正典邊界。

## Ownership

- **Bounded Context**: notebooklm
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notebooklm/subdomains/source/api/factories.ts
````typescript
import { FirebaseRagDocumentAdapter } from "../infrastructure/firebase/FirebaseRagDocumentAdapter";
import { FirebaseSourceFileAdapter } from "../infrastructure/firebase/FirebaseSourceFileAdapter";
import { FirebaseSourceDocumentCommandAdapter } from "../infrastructure/firebase/FirebaseSourceDocumentCommandAdapter";
import { FirebaseParsedDocumentAdapter } from "../infrastructure/firebase/FirebaseParsedDocumentAdapter";
import { NotionKnowledgePageGatewayAdapter } from "../infrastructure/adapters/NotionKnowledgePageGatewayAdapter";
import { waitForParsedDocument as _waitForParsedDocument } from "../infrastructure/firebase/FirebaseDocumentStatusAdapter";

export function makeSourceFileAdapter() {
  return new FirebaseSourceFileAdapter();
}

export function makeRagDocumentAdapter() {
  return new FirebaseRagDocumentAdapter();
}

export function makeSourceDocumentCommandAdapter() {
  return new FirebaseSourceDocumentCommandAdapter();
}

export function makeParsedDocumentAdapter() {
  return new FirebaseParsedDocumentAdapter();
}

export function makeKnowledgePageGateway() {
  return new NotionKnowledgePageGatewayAdapter();
}

export function waitForParsedDocument(
  accountId: string,
  docId: string,
): Promise<{ pageCount: number; jsonGcsUri: string }> {
  return _waitForParsedDocument(accountId, docId);
}
````

## File: modules/notebooklm/subdomains/source/api/index.ts
````typescript
/**
 * Public API boundary for the source subdomain.
 *
 * Cross-module consumers MUST import through this entry point.
 * Internal consumers within the subdomain import from their own layer.
 */

// ---------------------------------------------------------------------------
// Domain entity types
// ---------------------------------------------------------------------------

export type {
  SourceFile,
  SourceFileStatus,
  SourceFileClassification,
} from "../domain/entities/SourceFile";

export type {
  SourceFileVersion,
  SourceFileVersionStatus,
} from "../domain/entities/SourceFileVersion";

export type {
  RagDocumentRecord,
  RagDocumentStatus,
} from "../domain/entities/RagDocument";

export type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryFieldType,
  WikiLibraryRow,
  WikiLibraryStatus,
  CreateWikiLibraryInput,
  AddWikiLibraryFieldInput,
  CreateWikiLibraryRowInput,
} from "../domain/entities/WikiLibrary";

// ---------------------------------------------------------------------------
// Wiki library use cases (lazy singleton — no module-scope side effects)
// ---------------------------------------------------------------------------

import type { IWikiLibraryRepository } from "../domain/repositories/IWikiLibraryRepository";
import { FirebaseWikiLibraryAdapter } from "../infrastructure/firebase/FirebaseWikiLibraryAdapter";
import {
  listWikiLibraries as _listWikiLibraries,
  createWikiLibrary as _createWikiLibrary,
  addWikiLibraryField as _addWikiLibraryField,
  createWikiLibraryRow as _createWikiLibraryRow,
  getWikiLibrarySnapshot as _getWikiLibrarySnapshot,
} from "../application/use-cases/wiki-library.use-cases";

import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
  CreateWikiLibraryInput,
  AddWikiLibraryFieldInput,
  CreateWikiLibraryRowInput,
} from "../domain/entities/WikiLibrary";

export type { WikiLibrarySnapshot } from "../application/use-cases/wiki-library.use-cases";

let _libraryRepo: IWikiLibraryRepository | null = null;

function getLibraryRepo(): IWikiLibraryRepository {
  if (!_libraryRepo) _libraryRepo = new FirebaseWikiLibraryAdapter();
  return _libraryRepo;
}

export function listWikiLibraries(accountId: string, workspaceId?: string): Promise<WikiLibrary[]> {
  return _listWikiLibraries(accountId, workspaceId, getLibraryRepo());
}

export function createWikiLibrary(input: CreateWikiLibraryInput): Promise<WikiLibrary> {
  return _createWikiLibrary(input, getLibraryRepo());
}

export function addWikiLibraryField(input: AddWikiLibraryFieldInput): Promise<WikiLibraryField> {
  return _addWikiLibraryField(input, getLibraryRepo());
}

export function createWikiLibraryRow(input: CreateWikiLibraryRowInput): Promise<WikiLibraryRow> {
  return _createWikiLibraryRow(input, getLibraryRepo());
}

export function getWikiLibrarySnapshot(accountId: string, libraryId: string): ReturnType<typeof _getWikiLibrarySnapshot> {
  return _getWikiLibrarySnapshot(accountId, libraryId, getLibraryRepo());
}

// ---------------------------------------------------------------------------
// Live document DTOs
// ---------------------------------------------------------------------------

export type {
  SourceDocument,
  SourceLiveDocument,
  AssetDocument,
  AssetLiveDocument,
} from "../application/dto/source-live-document.dto";
export {
  mapToSourceLiveDocument,
  mapToAssetLiveDocument,
} from "../application/dto/source-live-document.dto";

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export type {
  UseSourceDocumentsSnapshotResult,
} from "../interfaces/hooks/useSourceDocumentsSnapshot";
export {
  useSourceDocumentsSnapshot,
} from "../interfaces/hooks/useSourceDocumentsSnapshot";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export { getWorkspaceFiles, getWorkspaceRagDocuments } from "../interfaces/queries/source-file.queries";

// ---------------------------------------------------------------------------
// Server actions
// ---------------------------------------------------------------------------

export {
  uploadInitFile,
  uploadCompleteFile,
  registerUploadedRagDocument,
  deleteSourceDocument,
  renameSourceDocument,
} from "../interfaces/_actions/source-file.actions";

export { createKnowledgeDraftFromSourceDocument } from "../interfaces/_actions/source-processing.actions";

// ---------------------------------------------------------------------------
// UI components
// ---------------------------------------------------------------------------

export { SourceDocumentsView } from "../interfaces/components/SourceDocumentsView";
export { WorkspaceFilesTab } from "../interfaces/components/WorkspaceFilesTab";
export { LibrariesView } from "../interfaces/components/LibrariesView";
export { LibraryTableView } from "../interfaces/components/LibraryTableView";
export { FileProcessingDialog } from "../interfaces/components/FileProcessingDialog";

// ---------------------------------------------------------------------------
// Infrastructure (for direct injection in server-side wiring)
// ---------------------------------------------------------------------------

export { FirebaseSourceFileAdapter } from "../infrastructure/firebase/FirebaseSourceFileAdapter";
export { FirebaseRagDocumentAdapter } from "../infrastructure/firebase/FirebaseRagDocumentAdapter";
export { FirebaseWikiLibraryAdapter } from "../infrastructure/firebase/FirebaseWikiLibraryAdapter";
export { InMemoryWikiLibraryAdapter } from "../infrastructure/memory/InMemoryWikiLibraryAdapter";
export { FirebaseSourceDocumentCommandAdapter } from "../infrastructure/firebase/FirebaseSourceDocumentCommandAdapter";
export { FirebaseParsedDocumentAdapter } from "../infrastructure/firebase/FirebaseParsedDocumentAdapter";
export { NotionKnowledgePageGatewayAdapter } from "../infrastructure/adapters/NotionKnowledgePageGatewayAdapter";
````

## File: modules/notebooklm/subdomains/source/application/dto/rag-document.dto.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/dto
 * Purpose: DTOs for RagDocument registration use-case I/O.
 */

import type { RagDocumentStatus } from "../../domain/entities/RagDocument";

export interface RegisterUploadedRagDocumentInputDto {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly sourceFileName: string;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly sizeBytes?: number;
  readonly checksum?: string;
  readonly taxonomy?: string;
  readonly category?: string;
  readonly department?: string;
  readonly tags?: readonly string[];
  readonly language?: string;
  readonly accessControl?: readonly string[];
  readonly versionGroupId?: string;
  readonly versionNumber?: number;
  readonly updateLog?: string;
  readonly expiresAtISO?: string;
}

export interface RegisterUploadedRagDocumentOutputDto {
  readonly documentId: string;
  readonly status: "uploaded";
  readonly registeredAtISO: string;
}

export type RegisterUploadedRagDocumentErrorCode =
  | "RAG_ORGANIZATION_REQUIRED"
  | "RAG_WORKSPACE_REQUIRED"
  | "RAG_ACCOUNT_ID_REQUIRED"
  | "RAG_TITLE_REQUIRED"
  | "RAG_FILE_NAME_REQUIRED"
  | "RAG_MIME_TYPE_REQUIRED"
  | "RAG_STORAGE_PATH_REQUIRED";

export type RegisterUploadedRagDocumentResult =
  | { ok: true; data: RegisterUploadedRagDocumentOutputDto; commandId: string }
  | {
      ok: false;
      error: { code: RegisterUploadedRagDocumentErrorCode; message: string };
      commandId: string;
    };

export interface ListSourceDocumentsInputDto {
  readonly organizationId: string;
  readonly workspaceId: string;
}

export interface SourceDocumentListItemDto {
  readonly id: string;
  readonly displayName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly status: RagDocumentStatus;
  readonly statusMessage?: string;
  readonly taxonomy?: string;
  readonly language?: string;
  readonly versionNumber: number;
  readonly isLatest: boolean;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
````

## File: modules/notebooklm/subdomains/source/application/dto/source-file.dto.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/dto
 * Purpose: DTOs and error codes for SourceFile use-case I/O.
 */

import type { SourceFile } from "../../domain/entities/SourceFile";
import type { RagDocumentStatus } from "../../domain/entities/RagDocument";

export interface WorkspaceFileListItemDto {
  readonly id: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly name: string;
  readonly status: SourceFile["status"];
  readonly kind: SourceFile["classification"];
  readonly source: string;
  readonly detail: string;
  readonly href?: string;
}

export interface UploadInitFileInputDto {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly idempotencyKey?: string;
}

export interface UploadInitFileOutputDto {
  readonly fileId: string;
  readonly versionId: string;
  readonly uploadPath: string;
  readonly uploadToken: string;
  readonly expiresAtISO: string;
}

export interface UploadCompleteFileInputDto {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
  readonly fileId: string;
  readonly versionId: string;
}

export interface UploadCompleteFileOutputDto {
  readonly fileId: string;
  readonly versionId: string;
  readonly status: "active";
  readonly ragDocumentId: string;
  readonly ragDocumentStatus: RagDocumentStatus;
}

export type SourceFileCommandErrorCode =
  | "FILE_WORKSPACE_REQUIRED"
  | "FILE_ORGANIZATION_REQUIRED"
  | "FILE_ACTOR_REQUIRED"
  | "FILE_NAME_REQUIRED"
  | "FILE_ID_REQUIRED"
  | "FILE_VERSION_REQUIRED"
  | "FILE_VERSION_NOT_FOUND"
  | "FILE_INVALID_SIZE"
  | "FILE_NOT_FOUND"
  | "FILE_SCOPE_MISMATCH"
  | "FILE_STATUS_CONFLICT"
  | "FILE_RAG_REGISTRATION_FAILED"
  | "FILE_INVALID_INPUT"
  | "FILE_DELETE_FAILED"
  | "FILE_RENAME_FAILED";
````

## File: modules/notebooklm/subdomains/source/application/dto/source-live-document.dto.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/dto
 * Purpose: DTO types and mapping logic for live source documents.
 *
 * Extracted from interfaces/hooks to keep data transformation in the application layer.
 * Interfaces should import these types and mappers from here.
 */

export interface SourceDocument {
  readonly id: string;
  readonly filename: string;
  readonly workspaceId: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
  readonly status: string;
  readonly ragStatus: string;
  readonly uploadedAt: Date | null;
}

export interface SourceLiveDocument extends SourceDocument {
  readonly errorMessage: string;
  readonly ragError: string;
  readonly isClientPending?: boolean;
}

export type AssetDocument = SourceDocument;
export type AssetLiveDocument = SourceLiveDocument;

// ── Helpers ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function objectOrEmpty(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function toDateOrNull(value: unknown): Date | null {
  if (!isRecord(value)) return null;
  if (typeof value.toDate === "function") {
    try {
      const d = (value.toDate as () => unknown)();
      if (d instanceof Date) return d;
    } catch {
      // fall through
    }
  }
  if (typeof value.toMillis === "function") {
    try {
      const ms = (value.toMillis as () => unknown)();
      if (typeof ms === "number" && Number.isFinite(ms)) return new Date(ms);
    } catch {
      // fall through
    }
  }
  return null;
}

function resolveFilename(data: Record<string, unknown>): string {
  const source = objectOrEmpty(data.source);
  const metadata = objectOrEmpty(data.metadata);
  for (const candidate of [
    source.filename, source.display_name, data.title,
    metadata.filename, metadata.display_name,
    source.original_filename, metadata.original_filename,
  ]) {
    if (typeof candidate === "string" && candidate.trim()) return candidate;
  }
  return "";
}

export function mapToSourceLiveDocument(
  id: string,
  data: Record<string, unknown>,
): SourceLiveDocument {
  const source = objectOrEmpty(data.source);
  const parsed = objectOrEmpty(data.parsed);
  const rag = objectOrEmpty(data.rag);
  const metadata = objectOrEmpty(data.metadata);
  const error = objectOrEmpty(data.error);
  const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
  return {
    id,
    filename: resolveFilename(data) || id,
    workspaceId:
      (typeof data.spaceId === "string" ? data.spaceId : "") ||
      (typeof metadata.space_id === "string" ? metadata.space_id : ""),
    sourceGcsUri:
      (typeof source.gcs_uri === "string" ? source.gcs_uri : "") ||
      (typeof metadata.source_gcs_uri === "string" ? metadata.source_gcs_uri : ""),
    jsonGcsUri:
      (typeof parsed.json_gcs_uri === "string" ? parsed.json_gcs_uri : "") ||
      (typeof metadata.json_gcs_uri === "string" ? metadata.json_gcs_uri : ""),
    pageCount: n(parsed.page_count) || n(metadata.page_count) || n(data.pageCount),
    status: typeof data.status === "string" ? data.status : "unknown",
    ragStatus: typeof rag.status === "string" ? rag.status : "",
    uploadedAt: toDateOrNull(source.uploaded_at) ?? toDateOrNull(data.createdAt),
    errorMessage: typeof error.message === "string" ? error.message : "",
    ragError: typeof rag.error === "string" ? rag.error : "",
  };
}

export const mapToAssetLiveDocument = mapToSourceLiveDocument;
````

## File: modules/notebooklm/subdomains/source/application/dto/source.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the source subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export { resolveSourceOrganizationId } from "../../domain/services/resolve-source-organization-id.service";
export type { RagDocumentRecord } from "../../domain/entities/RagDocument";
````

## File: modules/notebooklm/subdomains/source/application/use-cases/create-knowledge-draft-from-source.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: CreateKnowledgeDraftFromSourceUseCase — creates a knowledge page draft from a parsed source document.
 *
 * Actor: logged-in user
 * Goal: read parsed text from storage, create a knowledge page with a text block.
 * Main success: page created, returns aggregateId.
 * Failure: missing input, storage retrieval failure, or page creation failure.
 */

import type { CommandResult } from "@shared-types";
import { commandFailureFrom, commandSuccess } from "@shared-types";

import type { IParsedDocumentPort } from "../../domain/ports/IParsedDocumentPort";

export interface CreateKnowledgeDraftInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
  readonly filename: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
}

export interface KnowledgePageGateway {
  createPage(input: {
    accountId: string;
    workspaceId: string;
    title: string;
    parentPageId: null;
    createdByUserId: string;
  }): Promise<CommandResult>;
  addBlock(input: {
    accountId: string;
    pageId: string;
    index: number;
    content: {
      type: "text";
      richText: readonly { type: string; plainText: string }[];
      properties: Record<string, unknown>;
    };
  }): Promise<CommandResult>;
}

function trimFileExtension(filename: string): string {
  const trimmed = filename.trim();
  const idx = trimmed.lastIndexOf(".");
  return idx <= 0 ? trimmed : trimmed.slice(0, idx);
}

export class CreateKnowledgeDraftFromSourceUseCase {
  constructor(
    private readonly parsedDocumentPort: IParsedDocumentPort,
    private readonly knowledgeGateway: KnowledgePageGateway,
  ) {}

  async execute(input: CreateKnowledgeDraftInput): Promise<CommandResult> {
    if (!input.accountId.trim() || !input.workspaceId.trim() || !input.createdByUserId.trim()) {
      return commandFailureFrom(
        "SOURCE_KNOWLEDGE_DRAFT_INVALID_SCOPE",
        "accountId、workspaceId、createdByUserId 為必填。",
      );
    }

    if (!input.filename.trim() || !input.sourceGcsUri.trim() || !input.jsonGcsUri.trim()) {
      return commandFailureFrom(
        "SOURCE_KNOWLEDGE_DRAFT_INVALID_SOURCE",
        "filename、sourceGcsUri、jsonGcsUri 為必填。",
      );
    }

    try {
      const parsedText = await this.parsedDocumentPort.loadParsedDocumentText(input.jsonGcsUri);
      const plainText = parsedText || `[${trimFileExtension(input.filename)}]`;
      const title = `${trimFileExtension(input.filename)}｜匯入草稿`;

      const TIPTAP_PROPERTY_KEY = "tiptapJson";

      const pageResult = await this.knowledgeGateway.createPage({
        accountId: input.accountId,
        workspaceId: input.workspaceId,
        title,
        parentPageId: null,
        createdByUserId: input.createdByUserId,
      });

      if (!pageResult.success) return pageResult;

      const blockResult = await this.knowledgeGateway.addBlock({
        accountId: input.accountId,
        pageId: pageResult.aggregateId,
        index: 0,
        content: {
          type: "text",
          richText: [{ type: "text", plainText }],
          properties: { [TIPTAP_PROPERTY_KEY]: null },
        },
      });

      if (!blockResult.success) return blockResult;

      return commandSuccess(pageResult.aggregateId, blockResult.version);
    } catch (error) {
      return commandFailureFrom(
        "SOURCE_KNOWLEDGE_DRAFT_CREATE_FAILED",
        error instanceof Error ? error.message : "建立 Knowledge Page Draft 失敗。",
      );
    }
  }
}
````

## File: modules/notebooklm/subdomains/source/application/use-cases/delete-source-document.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: DeleteSourceDocumentUseCase — deletes a legacy source document.
 *
 * Actor: account owner
 * Goal: remove a source document from the accounts/{accountId}/documents collection.
 * Main success: document deleted, returns ok with documentId.
 * Failure: invalid input or persistence failure.
 */

import type { ISourceDocumentCommandPort } from "../../domain/ports/ISourceDocumentPort";
import type { SourceFileCommandErrorCode } from "../dto/source-file.dto";

export interface DeleteSourceDocumentInput {
  readonly accountId: string;
  readonly documentId: string;
}

type DeleteSourceDocumentResult =
  | { ok: true; data: { documentId: string } }
  | { ok: false; error: { code: SourceFileCommandErrorCode; message: string } };

export class DeleteSourceDocumentUseCase {
  constructor(
    private readonly documentPort: ISourceDocumentCommandPort,
  ) {}

  async execute(input: DeleteSourceDocumentInput): Promise<DeleteSourceDocumentResult> {
    const accountId = input.accountId.trim();
    const documentId = input.documentId.trim();

    if (!accountId || !documentId) {
      return { ok: false, error: { code: "FILE_INVALID_INPUT", message: "accountId and documentId are required." } };
    }

    try {
      await this.documentPort.deleteDocument(accountId, documentId);
      return { ok: true, data: { documentId } };
    } catch (err) {
      return { ok: false, error: { code: "FILE_DELETE_FAILED", message: err instanceof Error ? err.message : "Delete failed." } };
    }
  }
}
````

## File: modules/notebooklm/subdomains/source/application/use-cases/register-rag-document.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: RegisterUploadedRagDocumentUseCase — registers a RAG document record after upload.
 *
 * Called internally by UploadCompleteSourceFileUseCase;
 * also callable directly when a document is registered without the upload-init flow.
 */

import { randomUUID } from "node:crypto";

import type { IRagDocumentRepository } from "../../domain/repositories/IRagDocumentRepository";
import type {
  RegisterUploadedRagDocumentInputDto,
  RegisterUploadedRagDocumentOutputDto,
  RegisterUploadedRagDocumentErrorCode,
} from "../dto/rag-document.dto";

type RegisterUploadedRagDocumentResult =
  | { ok: true; data: RegisterUploadedRagDocumentOutputDto }
  | { ok: false; error: { code: RegisterUploadedRagDocumentErrorCode; message: string } };

export class RegisterUploadedRagDocumentUseCase {
  constructor(private readonly ragDocumentRepository: IRagDocumentRepository) {}

  async execute(
    input: RegisterUploadedRagDocumentInputDto,
  ): Promise<RegisterUploadedRagDocumentResult> {
    const organizationId = input.organizationId.trim();
    const workspaceId = input.workspaceId.trim();
    const accountId = input.accountId.trim();
    const title = input.title.trim();
    const sourceFileName = input.sourceFileName.trim();
    const mimeType = input.mimeType.trim();
    const storagePath = input.storagePath.trim();

    if (!organizationId) return { ok: false, error: { code: "RAG_ORGANIZATION_REQUIRED", message: "Organization is required." } };
    if (!workspaceId) return { ok: false, error: { code: "RAG_WORKSPACE_REQUIRED", message: "Workspace is required." } };
    if (!accountId) return { ok: false, error: { code: "RAG_ACCOUNT_ID_REQUIRED", message: "Account ID is required." } };
    if (!title) return { ok: false, error: { code: "RAG_TITLE_REQUIRED", message: "Document title is required." } };
    if (!sourceFileName) return { ok: false, error: { code: "RAG_FILE_NAME_REQUIRED", message: "Source file name is required." } };
    if (!mimeType) return { ok: false, error: { code: "RAG_MIME_TYPE_REQUIRED", message: "Mime type is required." } };
    if (!storagePath) return { ok: false, error: { code: "RAG_STORAGE_PATH_REQUIRED", message: "Storage path is required." } };

    const nowISO = new Date().toISOString();
    const documentId = `rag-document-${randomUUID()}`;
    const versionGroupId = input.versionGroupId?.trim() ? input.versionGroupId.trim() : documentId;

    await this.ragDocumentRepository.saveUploaded({
      id: documentId,
      organizationId,
      workspaceId,
      accountId,
      displayName: sourceFileName,
      title,
      sourceFileName,
      mimeType,
      storagePath,
      sizeBytes: input.sizeBytes ?? 0,
      status: "uploaded",
      checksum: input.checksum?.trim() || undefined,
      taxonomy: input.taxonomy?.trim() || undefined,
      category: input.category?.trim() || undefined,
      department: input.department?.trim() || undefined,
      tags: input.tags ?? [],
      language: input.language?.trim() || undefined,
      accessControl: input.accessControl ?? [],
      versionGroupId,
      versionNumber: input.versionNumber ?? 1,
      isLatest: true,
      updateLog: input.updateLog?.trim() || undefined,
      expiresAtISO: input.expiresAtISO?.trim() || undefined,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    });

    return {
      ok: true,
      data: {
        documentId,
        status: "uploaded",
        registeredAtISO: nowISO,
      },
    };
  }
}
````

## File: modules/notebooklm/subdomains/source/application/use-cases/rename-source-document.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: RenameSourceDocumentUseCase — renames a legacy source document.
 *
 * Actor: account owner
 * Goal: update the display name of a source document in accounts/{accountId}/documents.
 * Main success: document renamed, returns ok with documentId.
 * Failure: invalid input or persistence failure.
 */

import type { ISourceDocumentCommandPort } from "../../domain/ports/ISourceDocumentPort";
import type { SourceFileCommandErrorCode } from "../dto/source-file.dto";

export interface RenameSourceDocumentInput {
  readonly accountId: string;
  readonly documentId: string;
  readonly newName: string;
}

type RenameSourceDocumentResult =
  | { ok: true; data: { documentId: string } }
  | { ok: false; error: { code: SourceFileCommandErrorCode; message: string } };

export class RenameSourceDocumentUseCase {
  constructor(
    private readonly documentPort: ISourceDocumentCommandPort,
  ) {}

  async execute(input: RenameSourceDocumentInput): Promise<RenameSourceDocumentResult> {
    const accountId = input.accountId.trim();
    const documentId = input.documentId.trim();
    const newName = input.newName.trim();

    if (!accountId || !documentId || !newName) {
      return { ok: false, error: { code: "FILE_INVALID_INPUT", message: "accountId, documentId and newName are required." } };
    }

    try {
      await this.documentPort.renameDocument(accountId, documentId, newName);
      return { ok: true, data: { documentId } };
    } catch (err) {
      return { ok: false, error: { code: "FILE_RENAME_FAILED", message: err instanceof Error ? err.message : "Rename failed." } };
    }
  }
}
````

## File: modules/notebooklm/subdomains/source/application/use-cases/upload-complete-source-file.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: UploadCompleteSourceFileUseCase — activates a file after binary upload completes.
 *
 * This is the second step of a two-step upload flow:
 *   1. init  → creates File + FileVersion records
 *   2. complete (this) → activates the version and registers a RagDocumentRecord
 *
 * Idempotent: calling complete on an already-completed file returns the existing
 * RagDocument without creating a duplicate.
 */

import { randomUUID } from "node:crypto";

import type { ISourceFileRepository } from "../../domain/repositories/ISourceFileRepository";
import type { IRagDocumentRepository } from "../../domain/repositories/IRagDocumentRepository";
import { completeUploadSourceFile } from "../../domain/services/complete-upload-source-file.service";
import type {
  SourceFileCommandErrorCode,
  UploadCompleteFileInputDto,
  UploadCompleteFileOutputDto,
} from "../dto/source-file.dto";
import type { SourceFile } from "../../domain/entities/SourceFile";

type UploadCompleteSourceFileResult =
  | { ok: true; data: UploadCompleteFileOutputDto }
  | { ok: false; error: { code: SourceFileCommandErrorCode; message: string } };

function isFileScopeMatch(params: {
  file: SourceFile;
  workspaceId: string;
  organizationId: string;
  actorAccountId: string;
  versionId: string;
}): boolean {
  return (
    params.file.workspaceId === params.workspaceId &&
    params.file.organizationId === params.organizationId &&
    params.file.accountId === params.actorAccountId &&
    params.file.currentVersionId === params.versionId
  );
}

function isFileAlreadyCompleted(file: SourceFile): boolean {
  return file.source === "file-upload-complete";
}

export class UploadCompleteSourceFileUseCase {
  constructor(
    private readonly fileRepository: ISourceFileRepository,
    private readonly ragDocumentRepository: IRagDocumentRepository,
  ) {}

  async execute(input: UploadCompleteFileInputDto): Promise<UploadCompleteSourceFileResult> {
    const workspaceId = input.workspaceId.trim();
    const organizationId = input.organizationId.trim();
    const actorAccountId = input.actorAccountId.trim();
    const fileId = input.fileId.trim();
    const versionId = input.versionId.trim();

    if (!workspaceId) return { ok: false, error: { code: "FILE_WORKSPACE_REQUIRED", message: "Workspace is required." } };
    if (!organizationId) return { ok: false, error: { code: "FILE_ORGANIZATION_REQUIRED", message: "Organization is required." } };
    if (!actorAccountId) return { ok: false, error: { code: "FILE_ACTOR_REQUIRED", message: "Actor account is required." } };
    if (!fileId) return { ok: false, error: { code: "FILE_ID_REQUIRED", message: "File id is required." } };
    if (!versionId) return { ok: false, error: { code: "FILE_VERSION_REQUIRED", message: "Version id is required." } };

    const file = await this.fileRepository.findById(fileId);
    if (!file) return { ok: false, error: { code: "FILE_NOT_FOUND", message: "File metadata not found." } };

    const version = await this.fileRepository.findVersion(fileId, versionId);
    if (!version) return { ok: false, error: { code: "FILE_VERSION_NOT_FOUND", message: "File version metadata not found." } };

    if (!isFileScopeMatch({ file, workspaceId, organizationId, actorAccountId, versionId })) {
      return { ok: false, error: { code: "FILE_SCOPE_MISMATCH", message: "Upload completion scope does not match file metadata." } };
    }

    if (file.status !== "active") {
      return { ok: false, error: { code: "FILE_STATUS_CONFLICT", message: "File upload completion requires an active file record." } };
    }

    const existingRagDocument = await this.ragDocumentRepository.findByStoragePath({
      organizationId,
      workspaceId,
      storagePath: version.storagePath,
    });

    const nextFile = isFileAlreadyCompleted(file)
      ? file
      : completeUploadSourceFile({ file, completedAtISO: new Date().toISOString() });

    if (!isFileAlreadyCompleted(file)) {
      await this.fileRepository.save(nextFile);
    }

    let ragDocumentId: string;
    let ragDocumentStatus: UploadCompleteFileOutputDto["ragDocumentStatus"];

    if (existingRagDocument !== null) {
      ragDocumentId = existingRagDocument.id;
      ragDocumentStatus = existingRagDocument.status;
    } else {
      const nowISO = new Date().toISOString();
      ragDocumentId = `rag-document-${randomUUID()}`;

      await this.ragDocumentRepository.saveUploaded({
        id: ragDocumentId,
        organizationId,
        workspaceId,
        accountId: actorAccountId,
        displayName: file.name,
        title: file.name,
        sourceFileName: file.name,
        mimeType: file.mimeType,
        storagePath: version.storagePath,
        sizeBytes: file.sizeBytes,
        status: "uploaded",
        checksum: version.checksum,
        versionGroupId: ragDocumentId,
        versionNumber: version.versionNumber,
        isLatest: true,
        createdAtISO: nowISO,
        updatedAtISO: nowISO,
      });

      ragDocumentStatus = "uploaded";
    }

    return {
      ok: true,
      data: {
        fileId: nextFile.id,
        versionId: nextFile.currentVersionId,
        status: "active",
        ragDocumentId,
        ragDocumentStatus,
      },
    };
  }
}
````

## File: modules/notebooklm/subdomains/source/application/use-cases/upload-init-source-file.use-case.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: UploadInitSourceFileUseCase — creates file metadata and returns an upload token.
 *
 * This is the first step of a two-step upload flow:
 *   1. init  → creates File + FileVersion records, returns an upload URL token
 *   2. complete → marks the version as active, registers a RagDocumentRecord
 */

import { randomBytes, randomUUID } from "node:crypto";

import type { SourceFile } from "../../domain/entities/SourceFile";
import type { SourceFileVersion } from "../../domain/entities/SourceFileVersion";
import type { ISourceFileRepository } from "../../domain/repositories/ISourceFileRepository";
import type {
  SourceFileCommandErrorCode,
  UploadInitFileInputDto,
  UploadInitFileOutputDto,
} from "../dto/source-file.dto";

type UploadInitSourceFileResult =
  | { ok: true; data: UploadInitFileOutputDto }
  | { ok: false; error: { code: SourceFileCommandErrorCode; message: string } };

function inferClassification(mimeType: string): SourceFile["classification"] {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.includes("json")) return "manifest";
  return "other";
}

function buildUploadPath(
  organizationId: string,
  workspaceId: string,
  fileId: string,
  fileName: string,
): string {
  const encodedName = encodeURIComponent(fileName.replace(/\s+/g, "-"));
  return `organizations/${organizationId}/workspaces/${workspaceId}/files/${fileId}/${encodedName}`;
}

export class UploadInitSourceFileUseCase {
  constructor(private readonly fileRepository: ISourceFileRepository) {}

  async execute(input: UploadInitFileInputDto): Promise<UploadInitSourceFileResult> {
    const workspaceId = input.workspaceId.trim();
    const organizationId = input.organizationId.trim();
    const actorAccountId = input.actorAccountId.trim();
    const fileName = input.fileName.trim();

    if (!workspaceId) {
      return { ok: false, error: { code: "FILE_WORKSPACE_REQUIRED", message: "Workspace is required." } };
    }
    if (!organizationId) {
      return { ok: false, error: { code: "FILE_ORGANIZATION_REQUIRED", message: "Organization is required." } };
    }
    if (!actorAccountId) {
      return { ok: false, error: { code: "FILE_ACTOR_REQUIRED", message: "Actor account is required." } };
    }
    if (!fileName) {
      return { ok: false, error: { code: "FILE_NAME_REQUIRED", message: "File name is required." } };
    }
    if (!Number.isFinite(input.sizeBytes) || input.sizeBytes <= 0) {
      return { ok: false, error: { code: "FILE_INVALID_SIZE", message: "File size must be a positive number." } };
    }

    const createdAtISO = new Date().toISOString();
    const fileId = `file-${randomUUID()}`;
    const versionId = `file-version-${randomUUID()}`;
    const uploadPath = buildUploadPath(organizationId, workspaceId, fileId, fileName);

    const file: SourceFile = {
      id: fileId,
      workspaceId,
      organizationId,
      accountId: actorAccountId,
      name: fileName,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      classification: inferClassification(input.mimeType),
      tags: [],
      currentVersionId: versionId,
      status: "active",
      source: "file-upload-init",
      detail: "File metadata persisted before binary upload is completed.",
      createdAtISO,
      updatedAtISO: createdAtISO,
    };

    const version: SourceFileVersion = {
      id: versionId,
      fileId,
      versionNumber: 1,
      status: "pending",
      storagePath: uploadPath,
      createdAtISO,
    };

    await this.fileRepository.save(file, [version]);

    return {
      ok: true,
      data: {
        fileId,
        versionId,
        uploadPath,
        uploadToken: randomBytes(32).toString("base64url"),
        expiresAtISO: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      },
    };
  }
}
````

## File: modules/notebooklm/subdomains/source/application/use-cases/wiki-library.helpers.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Purpose: Private helpers for wiki-library use cases.
 *
 * Extracted from use-cases file to keep business workflow readable.
 * Depends on local slug-utils for slug derivation and validation.
 */

import { deriveSlugCandidate, isValidSlug } from "../utils/slug-utils";
import type { WikiLibrary } from "../../domain/entities/WikiLibrary";

export function generateSourceId(): string {
  const randomUUID = globalThis.crypto?.randomUUID;
  if (typeof randomUUID === "function") {
    return randomUUID.call(globalThis.crypto);
  }
  return `wbl_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function normalizeLibraryName(name: string): string {
  const value = name.trim();
  if (!value) throw new Error("library name is required");
  return value.slice(0, 80);
}

export function normalizeFieldKey(key: string): string {
  const normalized = key.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  if (!normalized) throw new Error("field key is required");
  return normalized.slice(0, 48);
}

export function ensureUniqueLibrarySlug(baseSlug: string, libraries: WikiLibrary[]): string {
  const normalizedBase = isValidSlug(baseSlug) ? baseSlug : "library-node";
  const existing = new Set(libraries.map((lib) => lib.slug));
  if (!existing.has(normalizedBase)) return normalizedBase;

  let index = 2;
  while (index < 5000) {
    const candidate = `${normalizedBase}-${index}`;
    if (!existing.has(candidate) && isValidSlug(candidate)) return candidate;
    index += 1;
  }
  throw new Error("cannot allocate a unique slug for this library name");
}

export { deriveSlugCandidate };
````

## File: modules/notebooklm/subdomains/source/application/use-cases/wiki-library.use-cases.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Cases: Wiki library management — create, add fields, add rows, list.
 *
 * Design notes:
 * - All functions take explicit repository injection (no module-scope singletons).
 * - Event publisher is created lazily to avoid import-time side effects.
 * - Event publishing uses @shared-events public boundary only.
 */

import {
  InMemoryEventStoreRepository,
  NoopEventBusRepository,
  PublishDomainEventUseCase,
} from "@shared-events";

import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
  CreateWikiLibraryInput,
  AddWikiLibraryFieldInput,
  CreateWikiLibraryRowInput,
} from "../../domain/entities/WikiLibrary";
import type { IWikiLibraryRepository } from "../../domain/repositories/IWikiLibraryRepository";
import {
  generateSourceId,
  normalizeLibraryName,
  normalizeFieldKey,
  ensureUniqueLibrarySlug,
  deriveSlugCandidate,
} from "./wiki-library.helpers";

// Lazy event publisher — only instantiated on first event emit.
let _eventPublisher: PublishDomainEventUseCase | undefined;

function getEventPublisher(): PublishDomainEventUseCase {
  if (!_eventPublisher) {
    _eventPublisher = new PublishDomainEventUseCase(
      new InMemoryEventStoreRepository(),
      new NoopEventBusRepository(),
    );
  }
  return _eventPublisher;
}

// ────────────────────────────────────────────────────────────────────────────

export async function listWikiLibraries(
  accountId: string,
  workspaceId: string | undefined,
  libraryRepository: IWikiLibraryRepository,
): Promise<WikiLibrary[]> {
  if (!accountId) throw new Error("accountId is required");
  const libraries = await libraryRepository.listByAccountId(accountId);
  const activeLibraries = libraries.filter((lib) => lib.status === "active");
  if (!workspaceId) return activeLibraries;
  return activeLibraries.filter((lib) => lib.workspaceId === workspaceId);
}

export async function createWikiLibrary(
  input: CreateWikiLibraryInput,
  libraryRepository: IWikiLibraryRepository,
): Promise<WikiLibrary> {
  if (!input.accountId) throw new Error("accountId is required");

  const name = normalizeLibraryName(input.name);
  const libraries = await libraryRepository.listByAccountId(input.accountId);
  const workspaceLibraries = libraries.filter(
    (lib) => (lib.workspaceId ?? "") === (input.workspaceId ?? ""),
  );

  const slug = ensureUniqueLibrarySlug(deriveSlugCandidate(name), workspaceLibraries);
  const now = new Date();
  const library: WikiLibrary = {
    id: generateSourceId(),
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    name,
    slug,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  await libraryRepository.create(library);
  await getEventPublisher().execute({
    id: generateSourceId(),
    eventName: "source.library_created",
    aggregateType: "wiki-library",
    aggregateId: library.id,
    payload: {
      accountId: library.accountId,
      workspaceId: library.workspaceId,
      slug: library.slug,
    },
  });

  return library;
}

export async function addWikiLibraryField(
  input: AddWikiLibraryFieldInput,
  libraryRepository: IWikiLibraryRepository,
): Promise<WikiLibraryField> {
  const library = await libraryRepository.findById(input.accountId, input.libraryId);
  if (!library) throw new Error("library not found");

  const key = normalizeFieldKey(input.key);
  const label = normalizeLibraryName(input.label);
  const fields = await libraryRepository.listFields(input.accountId, input.libraryId);
  if (fields.some((f) => f.key === key)) throw new Error(`field key "${key}" already exists`);

  const field: WikiLibraryField = {
    id: generateSourceId(),
    libraryId: input.libraryId,
    key,
    label,
    type: input.type,
    required: input.required ?? false,
    options: input.options,
    createdAt: new Date(),
  };

  await libraryRepository.createField(input.accountId, field);
  await getEventPublisher().execute({
    id: generateSourceId(),
    eventName: "source.library_field_added",
    aggregateType: "wiki-library",
    aggregateId: input.libraryId,
    payload: { accountId: input.accountId, fieldKey: field.key, fieldType: field.type },
  });

  return field;
}

export async function createWikiLibraryRow(
  input: CreateWikiLibraryRowInput,
  libraryRepository: IWikiLibraryRepository,
): Promise<WikiLibraryRow> {
  const library = await libraryRepository.findById(input.accountId, input.libraryId);
  if (!library) throw new Error("library not found");

  const fields = await libraryRepository.listFields(input.accountId, input.libraryId);
  for (const field of fields.filter((f) => f.required)) {
    if (!(field.key in input.values)) throw new Error(`missing required field: ${field.key}`);
  }

  const now = new Date();
  const row: WikiLibraryRow = {
    id: generateSourceId(),
    libraryId: input.libraryId,
    values: input.values,
    createdAt: now,
    updatedAt: now,
  };

  await libraryRepository.createRow(input.accountId, row);
  await getEventPublisher().execute({
    id: generateSourceId(),
    eventName: "source.library_row_created",
    aggregateType: "wiki-library",
    aggregateId: input.libraryId,
    payload: { accountId: input.accountId, rowId: row.id, fields: Object.keys(row.values) },
  });

  return row;
}

export interface WikiLibrarySnapshot {
  readonly library: WikiLibrary;
  readonly fields: WikiLibraryField[];
  readonly rows: WikiLibraryRow[];
}

export async function getWikiLibrarySnapshot(
  accountId: string,
  libraryId: string,
  libraryRepository: IWikiLibraryRepository,
): Promise<WikiLibrarySnapshot> {
  const library = await libraryRepository.findById(accountId, libraryId);
  if (!library) throw new Error("library not found");

  const [fields, rows] = await Promise.all([
    libraryRepository.listFields(accountId, libraryId),
    libraryRepository.listRows(accountId, libraryId),
  ]);

  return { library, fields, rows };
}
````

## File: modules/notebooklm/subdomains/source/application/utils/slug-utils.ts
````typescript
/**
 * notebooklm/subdomains/source — slug utilities
 * Pure slug derivation and validation helpers for wiki library names.
 */

/**
 * Converts a human-readable display name into a slug candidate.
 * Pure function — no side effects.
 */
export function deriveSlugCandidate(displayName: string): string {
  return displayName
    .toLowerCase()
    .replace(/[\s_./\\]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63);
}

/**
 * Returns true when the slug string passes namespace slug rules.
 * Pure function — no side effects.
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(slug);
}
````

## File: modules/notebooklm/subdomains/source/domain/entities/RagDocument.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Aggregate: RagDocument — tracks the ingestion lifecycle of a document for RAG.
 *
 * Status transitions are strictly controlled to prevent invalid state changes
 * and ensure idempotent ingestion worker behaviour.
 */

export type RagDocumentStatus = "uploaded" | "processing" | "ready" | "failed" | "archived";

export const ALLOWED_RAG_DOCUMENT_STATUS_TRANSITIONS: Readonly<
  Record<RagDocumentStatus, readonly RagDocumentStatus[]>
> = {
  uploaded: ["processing"],
  processing: ["ready", "failed"],
  ready: ["processing", "archived"],
  failed: ["processing"],
  archived: [],
};

export function canTransitionRagDocumentStatus(
  fromStatus: RagDocumentStatus,
  toStatus: RagDocumentStatus,
): boolean {
  return ALLOWED_RAG_DOCUMENT_STATUS_TRANSITIONS[fromStatus].includes(toStatus);
}

/**
 * RAG document record stored in Firestore at:
 * /knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}
 */
export interface RagDocumentRecord {
  readonly id: string;
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly displayName: string;
  readonly title: string;
  readonly sourceFileName: string;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly sizeBytes: number;
  readonly status: RagDocumentStatus;
  readonly statusMessage?: string;
  readonly checksum?: string;
  readonly taxonomy?: string;
  readonly category?: string;
  readonly department?: string;
  readonly tags?: readonly string[];
  readonly language?: string;
  readonly accessControl?: readonly string[];
  readonly versionGroupId: string;
  readonly versionNumber: number;
  readonly isLatest: boolean;
  readonly updateLog?: string;
  readonly accountId: string;
  readonly chunkCount?: number;
  readonly indexedAtISO?: string;
  readonly expiresAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
````

## File: modules/notebooklm/subdomains/source/domain/entities/SourceFile.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Aggregate: SourceFile — workspace-scoped file with lifecycle status.
 */

export type SourceFileStatus = "active" | "archived" | "deleted";

export type SourceFileClassification = "image" | "manifest" | "record" | "other";

export interface SourceFile {
  readonly id: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly accountId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly classification: SourceFileClassification;
  readonly tags: readonly string[];
  readonly currentVersionId: string;
  readonly retentionPolicyId?: string;
  readonly status: SourceFileStatus;
  readonly source?: string;
  readonly detail?: string;
  readonly href?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
  readonly deletedAtISO?: string;
}

const ARCHIVEABLE_STATUS: readonly SourceFileStatus[] = ["active"];
const RESTOREABLE_STATUS: readonly SourceFileStatus[] = ["archived"];

export function canArchiveSourceFile(file: SourceFile): boolean {
  return ARCHIVEABLE_STATUS.includes(file.status);
}

export function canRestoreSourceFile(file: SourceFile): boolean {
  return RESTOREABLE_STATUS.includes(file.status);
}
````

## File: modules/notebooklm/subdomains/source/domain/entities/SourceFileVersion.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Entity: SourceFileVersion — immutable version snapshot of a source file.
 */

export type SourceFileVersionStatus = "pending" | "stored" | "active" | "superseded";

export interface SourceFileVersion {
  readonly id: string;
  readonly fileId: string;
  readonly versionNumber: number;
  readonly status: SourceFileVersionStatus;
  readonly storagePath: string;
  readonly checksum?: string;
  readonly createdAtISO: string;
}

export function isVersionImmutable(version: SourceFileVersion): boolean {
  return version.status === "active" || version.status === "superseded";
}
````

## File: modules/notebooklm/subdomains/source/domain/entities/SourceRetentionPolicy.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Value Object: SourceRetentionPolicy — governs how long files are retained.
 */

export interface SourceRetentionPolicy {
  readonly id: string;
  readonly organizationId: string;
  readonly retentionDays: number;
  readonly legalHold: boolean;
  readonly purgeMode: "soft-delete" | "hard-delete";
  readonly updatedAtISO: string;
}
````

## File: modules/notebooklm/subdomains/source/domain/entities/WikiLibrary.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Entity: WikiLibrary — structured database entity used by wiki-style views.
 */

export type WikiLibraryStatus = "active" | "archived";
export type WikiLibraryFieldType = "title" | "text" | "number" | "select" | "relation";

export interface WikiLibrary {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly slug: string;
  readonly status: WikiLibraryStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface WikiLibraryField {
  readonly id: string;
  readonly libraryId: string;
  readonly key: string;
  readonly label: string;
  readonly type: WikiLibraryFieldType;
  readonly required: boolean;
  readonly options?: readonly string[];
  readonly createdAt: Date;
}

export interface WikiLibraryRow {
  readonly id: string;
  readonly libraryId: string;
  readonly values: Record<string, unknown>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateWikiLibraryInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
}

export interface AddWikiLibraryFieldInput {
  readonly accountId: string;
  readonly libraryId: string;
  readonly key: string;
  readonly label: string;
  readonly type: WikiLibraryFieldType;
  readonly required?: boolean;
  readonly options?: readonly string[];
}

export interface CreateWikiLibraryRowInput {
  readonly accountId: string;
  readonly libraryId: string;
  readonly values: Record<string, unknown>;
}
````

## File: modules/notebooklm/subdomains/source/domain/ports/IParsedDocumentPort.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: IParsedDocumentPort — retrieves parsed document text from storage.
 *
 * This port isolates Firebase Storage access from interfaces.
 * Infrastructure provides the adapter; application consumes via use cases.
 */

export interface IParsedDocumentPort {
  loadParsedDocumentText(jsonGcsUri: string): Promise<string>;
}
````

## File: modules/notebooklm/subdomains/source/domain/ports/ISourceDocumentPort.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: ISourceDocumentPort — commands for legacy source documents stored in accounts/{accountId}/documents.
 *
 * This port isolates the legacy Firestore collection from interfaces.
 * Infrastructure provides the Firebase adapter; interfaces consume via use cases.
 */

export interface ISourceDocumentCommandPort {
  deleteDocument(accountId: string, documentId: string): Promise<void>;
  renameDocument(accountId: string, documentId: string, newName: string): Promise<void>;
}
````

## File: modules/notebooklm/subdomains/source/domain/repositories/IRagDocumentRepository.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/repositories
 * Port: IRagDocumentRepository — persistence contract for RagDocumentRecord.
 */

import type { RagDocumentRecord } from "../entities/RagDocument";

export interface IRagDocumentRepository {
  findByStoragePath(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly storagePath: string;
  }): Promise<RagDocumentRecord | null>;
  findByWorkspace(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly RagDocumentRecord[]>;
  saveUploaded(record: RagDocumentRecord): Promise<void>;
}
````

## File: modules/notebooklm/subdomains/source/domain/repositories/ISourceFileRepository.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/repositories
 * Port: ISourceFileRepository — persistence contract for SourceFile aggregates.
 */

import type { SourceFile } from "../entities/SourceFile";
import type { SourceFileVersion } from "../entities/SourceFileVersion";

export interface ListSourceFilesScope {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
}

export interface ISourceFileRepository {
  findById(fileId: string): Promise<SourceFile | null>;
  findVersion(fileId: string, versionId: string): Promise<SourceFileVersion | null>;
  listByWorkspace(scope: ListSourceFilesScope): Promise<readonly SourceFile[]>;
  save(file: SourceFile, versions?: readonly SourceFileVersion[]): Promise<void>;
}
````

## File: modules/notebooklm/subdomains/source/domain/repositories/IWikiLibraryRepository.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/repositories
 * Port: IWikiLibraryRepository — persistence contract for WikiLibrary aggregates.
 */

import type { WikiLibrary, WikiLibraryField, WikiLibraryRow } from "../entities/WikiLibrary";

export interface IWikiLibraryRepository {
  listByAccountId(accountId: string): Promise<WikiLibrary[]>;
  findById(accountId: string, libraryId: string): Promise<WikiLibrary | null>;
  create(library: WikiLibrary): Promise<void>;
  createField(accountId: string, field: WikiLibraryField): Promise<void>;
  listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]>;
  createRow(accountId: string, row: WikiLibraryRow): Promise<void>;
  listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]>;
}
````

## File: modules/notebooklm/subdomains/source/domain/services/complete-upload-source-file.service.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/services
 * Service: completeUploadSourceFile — transitions a file to active after upload.
 *
 * Pure domain function: no I/O, no side effects.
 */

import type { SourceFile } from "../entities/SourceFile";

export interface CompleteUploadSourceFileInput {
  readonly file: SourceFile;
  readonly completedAtISO: string;
}

export function completeUploadSourceFile(input: CompleteUploadSourceFileInput): SourceFile {
  return {
    ...input.file,
    status: "active",
    updatedAtISO: input.completedAtISO,
    source: "file-upload-complete",
    detail: "File upload completed; status set to active and metadata timestamp finalized.",
  };
}
````

## File: modules/notebooklm/subdomains/source/domain/services/resolve-source-organization-id.service.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/services
 * Service: resolveSourceOrganizationId — maps an account to its organization scope.
 *
 * Personal accounts get a synthetic org ID prefixed with "personal:" so they
 * can participate in the same org-scoped permission checks as org accounts
 * without sharing an org namespace.
 */

export function resolveSourceOrganizationId(
  accountType: "user" | "organization",
  accountId: string,
): string {
  return accountType === "organization" ? accountId : `personal:${accountId}`;
}
````

## File: modules/notebooklm/subdomains/source/infrastructure/adapters/NotionKnowledgePageGatewayAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/adapters
 * Adapter: NotionKnowledgePageGatewayAdapter — delegates to notion bounded context API.
 *
 * Implements the KnowledgePageGateway port defined in the application layer,
 * bridging the source subdomain to the notion bounded context through its public API.
 */

import type { CommandResult } from "@shared-types";

import { addKnowledgeBlock, createKnowledgePage } from "@/modules/notion/api";

import type { KnowledgePageGateway } from "../../application/use-cases/create-knowledge-draft-from-source.use-case";

export class NotionKnowledgePageGatewayAdapter implements KnowledgePageGateway {
  async createPage(input: {
    accountId: string;
    workspaceId: string;
    title: string;
    parentPageId: null;
    createdByUserId: string;
  }): Promise<CommandResult> {
    return createKnowledgePage(input);
  }

  async addBlock(input: {
    accountId: string;
    pageId: string;
    index: number;
    content: {
      type: "text";
      richText: readonly { type: string; plainText: string }[];
      properties: Record<string, unknown>;
    };
  }): Promise<CommandResult> {
    return addKnowledgeBlock(input);
  }
}
````

## File: modules/notebooklm/subdomains/source/infrastructure/firebase/FirebaseDocumentStatusAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseDocumentStatusAdapter — watches Firestore document status via onSnapshot.
 *
 * Extracted from interfaces/components to keep Firestore access in infrastructure layer.
 */

import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export async function waitForParsedDocument(
  accountId: string,
  docId: string,
): Promise<{ pageCount: number; jsonGcsUri: string }> {
  const db = getFirebaseFirestore();

  return new Promise((resolve, reject) => {
    const docRef = firestoreApi.doc(db, "accounts", accountId, "documents", docId);
    const unsubscribe = firestoreApi.onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = asRecord(snapshot.data());
      const status = asString(data.status, "unknown");

      if (status === "completed") {
        const parsed = asRecord(data.parsed);
        unsubscribe();
        resolve({
          pageCount: asNumber(parsed.page_count, 0),
          jsonGcsUri: asString(parsed.json_gcs_uri),
        });
        return;
      }

      if (status === "error") {
        const error = asRecord(data.error);
        unsubscribe();
        reject(new Error(asString(error.message, "文件解析失敗")));
      }
    });
  });
}
````

## File: modules/notebooklm/subdomains/source/infrastructure/firebase/FirebaseParsedDocumentAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseParsedDocumentAdapter — Firebase Storage implementation of IParsedDocumentPort.
 *
 * Reads parsed JSON from a GCS URI and extracts the text content.
 */

import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";

import type { IParsedDocumentPort } from "../../domain/ports/IParsedDocumentPort";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export class FirebaseParsedDocumentAdapter implements IParsedDocumentPort {
  async loadParsedDocumentText(jsonGcsUri: string): Promise<string> {
    if (!jsonGcsUri) return "";
    const storage = getFirebaseStorage();
    const ref = storageApi.ref(storage, jsonGcsUri);
    const url = await storageApi.getDownloadURL(ref);
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`無法讀取解析 JSON (${response.status})`);
    const payload = asRecord(await response.json());
    return asString(payload.text);
  }
}
````

## File: modules/notebooklm/subdomains/source/infrastructure/firebase/FirebaseRagDocumentAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseRagDocumentAdapter — Firestore implementation of IRagDocumentRepository.
 *
 * Collection path:
 *   knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}
 */

import {
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";

import type { RagDocumentRecord, RagDocumentStatus } from "../../domain/entities/RagDocument";
import type { IRagDocumentRepository } from "../../domain/repositories/IRagDocumentRepository";

function buildDocRef(input: {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly documentId: string;
}) {
  return doc(
    getFirestore(firebaseClientApp),
    "knowledge_base", input.organizationId,
    "workspaces", input.workspaceId,
    "documents", input.documentId,
  );
}

function buildDocCollection(input: { readonly organizationId: string; readonly workspaceId: string }) {
  return collection(
    getFirestore(firebaseClientApp),
    "knowledge_base", input.organizationId,
    "workspaces", input.workspaceId,
    "documents",
  );
}

function toStringArray(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function isRagDocumentStatus(value: unknown): value is RagDocumentStatus {
  return (
    value === "uploaded" ||
    value === "processing" ||
    value === "ready" ||
    value === "failed" ||
    value === "archived"
  );
}

function toRagDocumentRecord(
  documentId: string,
  data: Record<string, unknown>,
  fallback: { organizationId: string; workspaceId: string },
): RagDocumentRecord {
  return {
    id: documentId,
    organizationId: typeof data.organizationId === "string" ? data.organizationId : fallback.organizationId,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : fallback.workspaceId,
    displayName:
      (typeof data.displayName === "string" && data.displayName) ||
      (typeof data.sourceFileName === "string" && data.sourceFileName) ||
      "",
    title: typeof data.title === "string" ? data.title : "",
    sourceFileName: typeof data.sourceFileName === "string" ? data.sourceFileName : "",
    mimeType: typeof data.mimeType === "string" ? data.mimeType : "application/octet-stream",
    storagePath: typeof data.storagePath === "string" ? data.storagePath : "",
    sizeBytes: typeof data.sizeBytes === "number" ? data.sizeBytes : 0,
    status: isRagDocumentStatus(data.status) ? data.status : "uploaded",
    statusMessage: typeof data.statusMessage === "string" ? data.statusMessage : undefined,
    checksum: typeof data.checksum === "string" ? data.checksum : undefined,
    taxonomy: typeof data.taxonomy === "string" ? data.taxonomy : undefined,
    category: typeof data.category === "string" ? data.category : undefined,
    department: typeof data.department === "string" ? data.department : undefined,
    tags: toStringArray(data.tags),
    language: typeof data.language === "string" ? data.language : undefined,
    accessControl: toStringArray(data.accessControl),
    versionGroupId: typeof data.versionGroupId === "string" ? data.versionGroupId : documentId,
    versionNumber: typeof data.versionNumber === "number" ? data.versionNumber : 1,
    isLatest: typeof data.isLatest === "boolean" ? data.isLatest : true,
    updateLog: typeof data.updateLog === "string" ? data.updateLog : undefined,
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    chunkCount: typeof data.chunkCount === "number" ? data.chunkCount : undefined,
    indexedAtISO: typeof data.indexedAtISO === "string" ? data.indexedAtISO : undefined,
    expiresAtISO: typeof data.expiresAtISO === "string" ? data.expiresAtISO : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseRagDocumentAdapter implements IRagDocumentRepository {
  async findByStoragePath(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly storagePath: string;
  }): Promise<RagDocumentRecord | null> {
    const snapshots = await getDocs(
      query(
        buildDocCollection(scope),
        where("storagePath", "==", scope.storagePath),
        limit(1),
      ),
    );
    const [first] = snapshots.docs;
    if (!first) return null;
    return toRagDocumentRecord(first.id, first.data() as Record<string, unknown>, scope);
  }

  async findByWorkspace(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly RagDocumentRecord[]> {
    const snapshots = await getDocs(
      query(buildDocCollection(scope), orderBy("createdAtISO", "desc")),
    );
    return snapshots.docs.map((snap) =>
      toRagDocumentRecord(snap.id, snap.data() as Record<string, unknown>, scope),
    );
  }

  async saveUploaded(record: RagDocumentRecord): Promise<void> {
    await setDoc(buildDocRef({ organizationId: record.organizationId, workspaceId: record.workspaceId, documentId: record.id }), {
      id: record.id,
      organizationId: record.organizationId,
      workspaceId: record.workspaceId,
      displayName: record.displayName,
      title: record.title,
      sourceFileName: record.sourceFileName,
      mimeType: record.mimeType,
      storagePath: record.storagePath,
      sizeBytes: record.sizeBytes,
      status: record.status,
      ...(record.statusMessage ? { statusMessage: record.statusMessage } : {}),
      ...(record.checksum ? { checksum: record.checksum } : {}),
      ...(record.taxonomy ? { taxonomy: record.taxonomy } : {}),
      ...(record.category ? { category: record.category } : {}),
      ...(record.department ? { department: record.department } : {}),
      tags: record.tags ?? [],
      ...(record.language ? { language: record.language } : {}),
      accessControl: record.accessControl ?? [],
      versionGroupId: record.versionGroupId,
      versionNumber: record.versionNumber,
      isLatest: record.isLatest,
      ...(record.updateLog ? { updateLog: record.updateLog } : {}),
      accountId: record.accountId,
      ...(record.chunkCount !== undefined ? { chunkCount: record.chunkCount } : {}),
      ...(record.indexedAtISO ? { indexedAtISO: record.indexedAtISO } : {}),
      ...(record.expiresAtISO ? { expiresAtISO: record.expiresAtISO } : {}),
      createdAtISO: record.createdAtISO,
      updatedAtISO: record.updatedAtISO,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
````

## File: modules/notebooklm/subdomains/source/infrastructure/firebase/FirebaseSourceDocumentCommandAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseSourceDocumentCommandAdapter — Firestore implementation of ISourceDocumentCommandPort.
 *
 * Collection path: accounts/{accountId}/documents/{documentId}
 * This is a legacy collection; new data should use the workspaceFiles collection.
 */

import { deleteDoc, doc, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";

import type { ISourceDocumentCommandPort } from "../../domain/ports/ISourceDocumentPort";

export class FirebaseSourceDocumentCommandAdapter implements ISourceDocumentCommandPort {
  private readonly db = getFirestore(firebaseClientApp);

  async deleteDocument(accountId: string, documentId: string): Promise<void> {
    await deleteDoc(doc(this.db, "accounts", accountId, "documents", documentId));
  }

  async renameDocument(accountId: string, documentId: string, newName: string): Promise<void> {
    await updateDoc(doc(this.db, "accounts", accountId, "documents", documentId), {
      title: newName,
      "source.filename": newName,
      "metadata.filename": newName,
      updatedAt: serverTimestamp(),
    });
  }
}
````

## File: modules/notebooklm/subdomains/source/infrastructure/firebase/FirebaseSourceFileAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseSourceFileAdapter — Firestore implementation of ISourceFileRepository.
 *
 * Collections:
 *   workspaceFiles/{fileId}
 *   workspaceFiles/{fileId}/versions/{versionId}
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";

import type { SourceFile } from "../../domain/entities/SourceFile";
import type { SourceFileVersion } from "../../domain/entities/SourceFileVersion";
import type { ISourceFileRepository, ListSourceFilesScope } from "../../domain/repositories/ISourceFileRepository";

const FILE_COLLECTION = "workspaceFiles";
const VERSION_SUBCOLLECTION = "versions";

function isSourceFileStatus(value: unknown): value is SourceFile["status"] {
  return value === "active" || value === "archived" || value === "deleted";
}

function isSourceFileClassification(value: unknown): value is SourceFile["classification"] {
  return value === "image" || value === "manifest" || value === "record" || value === "other";
}

function toStringArray(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toSourceFileEntity(fileId: string, data: Record<string, unknown>): SourceFile {
  return {
    id: fileId,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    organizationId: typeof data.organizationId === "string" ? data.organizationId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    name: typeof data.name === "string" ? data.name : "",
    mimeType: typeof data.mimeType === "string" ? data.mimeType : "application/octet-stream",
    sizeBytes: typeof data.sizeBytes === "number" ? data.sizeBytes : 0,
    classification: isSourceFileClassification(data.classification) ? data.classification : "other",
    tags: toStringArray(data.tags),
    currentVersionId: typeof data.currentVersionId === "string" ? data.currentVersionId : "",
    retentionPolicyId: typeof data.retentionPolicyId === "string" ? data.retentionPolicyId : undefined,
    status: isSourceFileStatus(data.status) ? data.status : "active",
    source: typeof data.source === "string" ? data.source : undefined,
    detail: typeof data.detail === "string" ? data.detail : undefined,
    href: typeof data.href === "string" ? data.href : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
    deletedAtISO: typeof data.deletedAtISO === "string" ? data.deletedAtISO : undefined,
  };
}

function isVersionStatus(value: unknown): value is SourceFileVersion["status"] {
  return value === "pending" || value === "stored" || value === "active" || value === "superseded";
}

function toSourceFileVersionEntity(versionId: string, data: Record<string, unknown>): SourceFileVersion {
  return {
    id: versionId,
    fileId: typeof data.fileId === "string" ? data.fileId : "",
    versionNumber: typeof data.versionNumber === "number" ? data.versionNumber : 0,
    status: isVersionStatus(data.status) ? data.status : "pending",
    storagePath: typeof data.storagePath === "string" ? data.storagePath : "",
    checksum: typeof data.checksum === "string" ? data.checksum : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
  };
}

export class FirebaseSourceFileAdapter implements ISourceFileRepository {
  private readonly db = getFirestore(firebaseClientApp);

  private get collectionRef() {
    return collection(this.db, FILE_COLLECTION);
  }

  async findById(fileId: string): Promise<SourceFile | null> {
    const normalizedId = fileId.trim();
    if (!normalizedId) return null;
    const snapshot = await getDoc(doc(this.db, FILE_COLLECTION, normalizedId));
    if (!snapshot.exists()) return null;
    return toSourceFileEntity(snapshot.id, snapshot.data() as Record<string, unknown>);
  }

  async findVersion(fileId: string, versionId: string): Promise<SourceFileVersion | null> {
    const nFileId = fileId.trim();
    const nVersionId = versionId.trim();
    if (!nFileId || !nVersionId) return null;
    const snapshot = await getDoc(
      doc(this.db, FILE_COLLECTION, nFileId, VERSION_SUBCOLLECTION, nVersionId),
    );
    if (!snapshot.exists()) return null;
    return toSourceFileVersionEntity(snapshot.id, snapshot.data() as Record<string, unknown>);
  }

  async listByWorkspace(scope: ListSourceFilesScope): Promise<readonly SourceFile[]> {
    const workspaceId = scope.workspaceId.trim();
    const organizationId = scope.organizationId.trim();
    if (!workspaceId) return [];

    const snapshots = await getDocs(
      query(
        this.collectionRef,
        where("workspaceId", "==", workspaceId),
        where("organizationId", "==", organizationId),
      ),
    );

    return snapshots.docs
      .map((snap) => toSourceFileEntity(snap.id, snap.data() as Record<string, unknown>))
      .sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO));
  }

  async save(file: SourceFile, versions: readonly SourceFileVersion[] = []): Promise<void> {
    const batch = writeBatch(this.db);
    const fileRef = doc(this.db, FILE_COLLECTION, file.id);

    batch.set(fileRef, {
      workspaceId: file.workspaceId,
      organizationId: file.organizationId,
      accountId: file.accountId,
      name: file.name,
      mimeType: file.mimeType,
      sizeBytes: file.sizeBytes,
      classification: file.classification,
      tags: [...file.tags],
      currentVersionId: file.currentVersionId,
      ...(file.retentionPolicyId ? { retentionPolicyId: file.retentionPolicyId } : {}),
      status: file.status,
      ...(file.source ? { source: file.source } : {}),
      ...(file.detail ? { detail: file.detail } : {}),
      ...(file.href ? { href: file.href } : {}),
      createdAtISO: file.createdAtISO,
      updatedAtISO: file.updatedAtISO,
      ...(file.deletedAtISO ? { deletedAtISO: file.deletedAtISO } : {}),
    });

    for (const version of versions) {
      batch.set(doc(fileRef, VERSION_SUBCOLLECTION, version.id), {
        fileId: version.fileId,
        versionNumber: version.versionNumber,
        status: version.status,
        storagePath: version.storagePath,
        ...(version.checksum ? { checksum: version.checksum } : {}),
        createdAtISO: version.createdAtISO,
      });
    }

    await batch.commit();
  }
}
````

## File: modules/notebooklm/subdomains/source/infrastructure/firebase/FirebaseWikiLibraryAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseWikiLibraryAdapter — Firestore implementation of IWikiLibraryRepository.
 *
 * Paths:
 *   accounts/{accountId}/wikiLibraries/{libraryId}
 *   accounts/{accountId}/wikiLibraries/{libraryId}/fields/{fieldId}
 *   accounts/{accountId}/wikiLibraries/{libraryId}/rows/{rowId}
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";

import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryFieldType,
  WikiLibraryRow,
  WikiLibraryStatus,
} from "../../domain/entities/WikiLibrary";
import type { IWikiLibraryRepository } from "../../domain/repositories/IWikiLibraryRepository";

// ── Firestore shapes (ISO strings; no Timestamp to avoid serialisation issues)

interface FsLibrary {
  accountId: string;
  workspaceId?: string;
  name: string;
  slug: string;
  status: WikiLibraryStatus;
  createdAtISO: string;
  updatedAtISO: string;
}

interface FsField {
  libraryId: string;
  key: string;
  label: string;
  type: WikiLibraryFieldType;
  required: boolean;
  options?: string[];
  createdAtISO: string;
}

interface FsRow {
  libraryId: string;
  values: Record<string, unknown>;
  createdAtISO: string;
  updatedAtISO: string;
}

// ── Path helpers ──────────────────────────────────────────────────────────────

type Db = ReturnType<typeof getFirestore>;

const libCol = (db: Db, accountId: string) =>
  collection(db, "accounts", accountId, "wikiLibraries");
const libDoc = (db: Db, accountId: string, libraryId: string) =>
  doc(db, "accounts", accountId, "wikiLibraries", libraryId);
const fieldCol = (db: Db, accountId: string, libraryId: string) =>
  collection(db, "accounts", accountId, "wikiLibraries", libraryId, "fields");
const fieldDoc = (db: Db, accountId: string, libraryId: string, fieldId: string) =>
  doc(db, "accounts", accountId, "wikiLibraries", libraryId, "fields", fieldId);
const rowCol = (db: Db, accountId: string, libraryId: string) =>
  collection(db, "accounts", accountId, "wikiLibraries", libraryId, "rows");
const rowDoc = (db: Db, accountId: string, libraryId: string, rowId: string) =>
  doc(db, "accounts", accountId, "wikiLibraries", libraryId, "rows", rowId);

// ── Mappers ───────────────────────────────────────────────────────────────────

function toLibrary(id: string, data: FsLibrary): WikiLibrary {
  return {
    id,
    accountId: data.accountId,
    workspaceId: data.workspaceId,
    name: data.name,
    slug: data.slug,
    status: data.status ?? "active",
    createdAt: new Date(data.createdAtISO),
    updatedAt: new Date(data.updatedAtISO),
  };
}

function toField(id: string, data: FsField): WikiLibraryField {
  return {
    id,
    libraryId: data.libraryId,
    key: data.key,
    label: data.label,
    type: data.type ?? "text",
    required: data.required === true,
    options: Array.isArray(data.options) ? data.options : undefined,
    createdAt: new Date(data.createdAtISO),
  };
}

function toRow(id: string, data: FsRow): WikiLibraryRow {
  return {
    id,
    libraryId: data.libraryId,
    values:
      typeof data.values === "object" && data.values !== null
        ? (data.values as Record<string, unknown>)
        : {},
    createdAt: new Date(data.createdAtISO),
    updatedAt: new Date(data.updatedAtISO),
  };
}

// ── Implementation ────────────────────────────────────────────────────────────

export class FirebaseWikiLibraryAdapter implements IWikiLibraryRepository {
  private db() {
    return getFirestore(firebaseClientApp);
  }

  async listByAccountId(accountId: string): Promise<WikiLibrary[]> {
    const db = this.db();
    const snaps = await getDocs(
      query(libCol(db, accountId), where("status", "==", "active"), orderBy("createdAtISO", "asc")),
    );
    return snaps.docs.map((d) => toLibrary(d.id, d.data() as FsLibrary));
  }

  async findById(accountId: string, libraryId: string): Promise<WikiLibrary | null> {
    const snap = await getDoc(libDoc(this.db(), accountId, libraryId));
    if (!snap.exists()) return null;
    return toLibrary(snap.id, snap.data() as FsLibrary);
  }

  async create(library: WikiLibrary): Promise<void> {
    const data: FsLibrary = {
      accountId: library.accountId,
      ...(library.workspaceId !== undefined ? { workspaceId: library.workspaceId } : {}),
      name: library.name,
      slug: library.slug,
      status: library.status,
      createdAtISO: library.createdAt.toISOString(),
      updatedAtISO: library.updatedAt.toISOString(),
    };
    await setDoc(libDoc(this.db(), library.accountId, library.id), data);
  }

  async createField(accountId: string, field: WikiLibraryField): Promise<void> {
    const data: FsField = {
      libraryId: field.libraryId,
      key: field.key,
      label: field.label,
      type: field.type,
      required: field.required,
      createdAtISO: field.createdAt.toISOString(),
      ...(field.options !== undefined ? { options: [...field.options] } : {}),
    };
    await setDoc(fieldDoc(this.db(), accountId, field.libraryId, field.id), data);
  }

  async listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]> {
    const snaps = await getDocs(
      query(fieldCol(this.db(), accountId, libraryId), orderBy("createdAtISO", "asc")),
    );
    return snaps.docs.map((d) => toField(d.id, d.data() as FsField));
  }

  async createRow(accountId: string, row: WikiLibraryRow): Promise<void> {
    const data: FsRow = {
      libraryId: row.libraryId,
      values: row.values,
      createdAtISO: row.createdAt.toISOString(),
      updatedAtISO: row.updatedAt.toISOString(),
    };
    await setDoc(rowDoc(this.db(), accountId, row.libraryId, row.id), data);
  }

  async listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]> {
    const snaps = await getDocs(
      query(rowCol(this.db(), accountId, libraryId), orderBy("createdAtISO", "asc")),
    );
    return snaps.docs.map((d) => toRow(d.id, d.data() as FsRow));
  }
}
````

## File: modules/notebooklm/subdomains/source/infrastructure/memory/InMemoryWikiLibraryAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/memory
 * Adapter: InMemoryWikiLibraryAdapter — in-memory implementation of IWikiLibraryRepository.
 * Use case: local dev, tests, and no-firebase environments.
 */

import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
} from "../../domain/entities/WikiLibrary";
import type { IWikiLibraryRepository } from "../../domain/repositories/IWikiLibraryRepository";

export class InMemoryWikiLibraryAdapter implements IWikiLibraryRepository {
  private readonly libraries = new Map<string, WikiLibrary>();
  private readonly fields = new Map<string, WikiLibraryField>();
  private readonly rows = new Map<string, WikiLibraryRow>();

  async listByAccountId(accountId: string): Promise<WikiLibrary[]> {
    return [...this.libraries.values()]
      .filter((lib) => lib.accountId === accountId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async findById(accountId: string, libraryId: string): Promise<WikiLibrary | null> {
    const lib = this.libraries.get(libraryId);
    if (!lib || lib.accountId !== accountId) return null;
    return lib;
  }

  async create(library: WikiLibrary): Promise<void> {
    this.libraries.set(library.id, library);
  }

  async createField(accountId: string, field: WikiLibraryField): Promise<void> {
    const lib = this.libraries.get(field.libraryId);
    if (!lib || lib.accountId !== accountId) throw new Error("library not found");
    this.fields.set(field.id, field);
  }

  async listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]> {
    return [...this.fields.values()]
      .filter((f) => f.libraryId === libraryId)
      .filter(() => {
        const lib = this.libraries.get(libraryId);
        return !!(lib && lib.accountId === accountId);
      })
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createRow(accountId: string, row: WikiLibraryRow): Promise<void> {
    const lib = this.libraries.get(row.libraryId);
    if (!lib || lib.accountId !== accountId) throw new Error("library not found");
    this.rows.set(row.id, row);
  }

  async listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]> {
    return [...this.rows.values()]
      .filter((r) => r.libraryId === libraryId)
      .filter(() => {
        const lib = this.libraries.get(libraryId);
        return !!(lib && lib.accountId === accountId);
      })
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}
````

## File: modules/notebooklm/subdomains/source/interfaces/_actions/source-file.actions.ts
````typescript
"use server";

import type {
  UploadCompleteFileInputDto,
  UploadCompleteFileOutputDto,
  UploadInitFileInputDto,
  UploadInitFileOutputDto,
} from "../../application/dto/source-file.dto";
import type {
  RegisterUploadedRagDocumentInputDto,
  RegisterUploadedRagDocumentResult,
} from "../../application/dto/rag-document.dto";
import { makeRagDocumentAdapter, makeSourceDocumentCommandAdapter, makeSourceFileAdapter } from "../../api/factories";
import { UploadInitSourceFileUseCase } from "../../application/use-cases/upload-init-source-file.use-case";
import { UploadCompleteSourceFileUseCase } from "../../application/use-cases/upload-complete-source-file.use-case";
import { RegisterUploadedRagDocumentUseCase } from "../../application/use-cases/register-rag-document.use-case";
import { DeleteSourceDocumentUseCase } from "../../application/use-cases/delete-source-document.use-case";
import { RenameSourceDocumentUseCase } from "../../application/use-cases/rename-source-document.use-case";
import type { SourceFileCommandResult } from "../contracts/source-command-result";

function createCommandId(idempotencyKey?: string): string {
  const normalized = idempotencyKey?.trim();
  return normalized || `source-file-${crypto.randomUUID()}`;
}

export async function uploadInitFile(
  input: UploadInitFileInputDto,
): Promise<SourceFileCommandResult<UploadInitFileOutputDto>> {
  const commandId = createCommandId(input.idempotencyKey);
  const useCase = new UploadInitSourceFileUseCase(makeSourceFileAdapter());
  const result = await useCase.execute(input);
  return { ...result, commandId };
}

export async function uploadCompleteFile(
  input: UploadCompleteFileInputDto,
): Promise<SourceFileCommandResult<UploadCompleteFileOutputDto>> {
  const commandId = createCommandId(input.versionId);
  const fileAdapter = makeSourceFileAdapter();
  const useCase = new UploadCompleteSourceFileUseCase(fileAdapter, makeRagDocumentAdapter());
  const result = await useCase.execute(input);
  return { ...result, commandId };
}

export async function registerUploadedRagDocument(
  input: RegisterUploadedRagDocumentInputDto,
): Promise<RegisterUploadedRagDocumentResult> {
  const commandId = createCommandId(input.storagePath);
  const useCase = new RegisterUploadedRagDocumentUseCase(makeRagDocumentAdapter());
  const result = await useCase.execute(input);
  return { ...result, commandId };
}

export async function deleteSourceDocument(
  accountId: string,
  documentId: string,
): Promise<SourceFileCommandResult<{ documentId: string }>> {
  const commandId = `source-delete-${crypto.randomUUID()}`;
  const useCase = new DeleteSourceDocumentUseCase(makeSourceDocumentCommandAdapter());
  const result = await useCase.execute({ accountId, documentId });
  return { ...result, commandId };
}

export async function renameSourceDocument(
  accountId: string,
  documentId: string,
  newName: string,
): Promise<SourceFileCommandResult<{ documentId: string }>> {
  const commandId = `source-rename-${crypto.randomUUID()}`;
  const useCase = new RenameSourceDocumentUseCase(makeSourceDocumentCommandAdapter());
  const result = await useCase.execute({ accountId, documentId, newName });
  return { ...result, commandId };
}
````

## File: modules/notebooklm/subdomains/source/interfaces/_actions/source-processing.actions.ts
````typescript
"use server";

import type { CommandResult } from "@shared-types";

import { makeKnowledgePageGateway, makeParsedDocumentAdapter } from "../../api/factories";
import { CreateKnowledgeDraftFromSourceUseCase } from "../../application/use-cases/create-knowledge-draft-from-source.use-case";

interface CreateKnowledgeDraftFromSourceDocumentInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
  readonly filename: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
}

export async function createKnowledgeDraftFromSourceDocument(
  input: CreateKnowledgeDraftFromSourceDocumentInput,
): Promise<CommandResult> {
  const useCase = new CreateKnowledgeDraftFromSourceUseCase(
    makeParsedDocumentAdapter(),
    makeKnowledgePageGateway(),
  );
  return useCase.execute(input);
}
````

## File: modules/notebooklm/subdomains/source/interfaces/components/file-processing-dialog.body.tsx
````typescript
"use client";

import { ScanSearch, Sparkles } from "lucide-react";

import { Badge } from "@ui-shadcn/ui/badge";
import { Checkbox } from "@ui-shadcn/ui/checkbox";
import { Label } from "@ui-shadcn/ui/label";

import type { ExecutionSummary } from "./file-processing-dialog.utils";
import { FileProcessingPathValue, FileProcessingResultRow, FileProcessingSourceCard } from "./file-processing-dialog.parts";

interface FileProcessingDialogBodyProps {
  readonly step: "decide" | "select" | "executing" | "done";
  readonly filename: string;
  readonly mimeType: string;
  readonly gcsUri: string;
  readonly sizeBytes: number;
  readonly shouldRunRag: boolean;
  readonly shouldCreatePage: boolean;
  readonly onShouldRunRagChange: (checked: boolean) => void;
  readonly onShouldCreatePageChange: (checked: boolean) => void;
  readonly summary: ExecutionSummary;
}

export function FileProcessingDialogBody({
  step,
  filename,
  mimeType,
  gcsUri,
  sizeBytes,
  shouldRunRag,
  shouldCreatePage,
  onShouldRunRagChange,
  onShouldCreatePageChange,
  summary,
}: FileProcessingDialogBodyProps) {
  return (
    <>
      <FileProcessingSourceCard filename={filename} mimeType={mimeType} gcsUri={gcsUri} sizeBytes={sizeBytes} />

      {step === "decide" && (
        <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm sm:p-5">
          <p className="text-sm font-medium text-foreground sm:text-base">這份文件需要進一步處理嗎？</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground text-pretty">
            若先保留檔案，系統只會保存原始檔與 metadata，不會自動解析、建立 RAG 或生成頁面。
          </p>
        </div>
      )}

      {step === "select" && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <Checkbox
                checked={shouldRunRag}
                onCheckedChange={(checked) => onShouldRunRagChange(Boolean(checked))}
                id="file-processing-rag"
                className="mt-1"
              />
              <div className="min-w-0 space-y-2">
                <Label htmlFor="file-processing-rag" className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground sm:text-base">
                  <ScanSearch className="size-4" aria-hidden="true" />
                  建立 RAG 索引
                </Label>
                <p className="text-sm leading-6 text-muted-foreground text-pretty">
                  解析完成後建立 chunks 與 vectors，讓搜尋、引用與 AI 問答可以直接使用這份文件。
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <Checkbox
                checked={shouldCreatePage}
                onCheckedChange={(checked) => onShouldCreatePageChange(Boolean(checked))}
                id="file-processing-page"
                className="mt-1"
              />
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Label htmlFor="file-processing-page" className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground sm:text-base">
                    <Sparkles className="size-4" aria-hidden="true" />
                    建立 Knowledge Page
                  </Label>
                  <Badge variant="outline">Draft</Badge>
                </div>
                <p className="text-sm leading-6 text-muted-foreground text-pretty">
                  第一版會先建立一個單頁 Draft，帶入來源資訊與解析節錄，之後再逐步迭代切頁與章節策略。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "executing" && (
        <div className="space-y-3" aria-live="polite">
          <FileProcessingResultRow label="文件解析" result={summary.parse} />
          <FileProcessingResultRow label="RAG 索引" result={summary.rag} />
          <FileProcessingResultRow label="Knowledge Page" result={summary.page} />
        </div>
      )}

      {step === "done" && (
        <div className="space-y-3" aria-live="polite">
          <FileProcessingResultRow label="文件解析" result={summary.parse} />
          <FileProcessingResultRow label="RAG 索引" result={summary.rag} />
          <FileProcessingResultRow label="Knowledge Page" result={summary.page} />
          {summary.pageCount > 0 && (
            <div className="space-y-2 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm sm:p-5">
              <p className="text-sm font-medium text-foreground">解析輸出</p>
              <p className="text-sm leading-6 text-muted-foreground">
                共完成 {summary.pageCount} 頁解析結果。
              </p>
              {summary.jsonGcsUri ? (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    JSON URI
                  </p>
                  <FileProcessingPathValue value={summary.jsonGcsUri} />
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </>
  );
}
````

## File: modules/notebooklm/subdomains/source/interfaces/components/file-processing-dialog.parts.tsx
````typescript
"use client";

import { CheckCircle2, FileText, Loader2, XCircle } from "lucide-react";

import { cn } from "@ui-shadcn";
import { Badge } from "@ui-shadcn/ui/badge";

import type { TaskResult } from "./file-processing-dialog.utils";

function formatFileSize(sizeBytes: number): string | null {
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) return null;

  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  let value = sizeBytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${new Intl.NumberFormat("zh-TW", {
    maximumFractionDigits: value >= 10 || unitIndex === 0 ? 0 : 1,
  }).format(value)} ${units[unitIndex]}`;
}

export function FileProcessingPathValue({ value }: { readonly value: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-background/80">
      <div className="overflow-x-auto overscroll-x-contain px-3 py-2">
        <p className="min-w-max font-mono text-[11px] leading-5 text-muted-foreground" translate="no">
          {value}
        </p>
      </div>
    </div>
  );
}

export function FileProcessingSourceCard({
  filename,
  mimeType,
  gcsUri,
  sizeBytes,
}: {
  readonly filename: string;
  readonly mimeType: string;
  readonly gcsUri: string;
  readonly sizeBytes: number;
}) {
  const fileSizeLabel = formatFileSize(sizeBytes);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
          <FileText className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground sm:text-base" translate="no">
              {filename}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-normal" translate="no">
                {mimeType || "application/octet-stream"}
              </Badge>
              {fileSizeLabel ? <Badge variant="secondary">{fileSizeLabel}</Badge> : null}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Source URI
            </p>
            <FileProcessingPathValue value={gcsUri} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FileProcessingResultRow({
  label,
  result,
}: {
  readonly label: string;
  readonly result: TaskResult;
}) {
  const meta = {
    running: {
      badgeLabel: "處理中",
      badgeVariant: "secondary" as const,
      icon: <Loader2 className="size-4 animate-spin" aria-hidden="true" />,
      iconClassName: "bg-muted text-muted-foreground",
    },
    success: {
      badgeLabel: "完成",
      badgeVariant: "outline" as const,
      icon: <CheckCircle2 className="size-4" aria-hidden="true" />,
      iconClassName: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40",
    },
    error: {
      badgeLabel: "失敗",
      badgeVariant: "outline" as const,
      icon: <XCircle className="size-4" aria-hidden="true" />,
      iconClassName: "bg-destructive/10 text-destructive",
    },
    skipped: {
      badgeLabel: "略過",
      badgeVariant: "outline" as const,
      icon: <FileText className="size-4" aria-hidden="true" />,
      iconClassName: "bg-muted text-muted-foreground",
    },
    idle: {
      badgeLabel: "待命",
      badgeVariant: "secondary" as const,
      icon: <FileText className="size-4" aria-hidden="true" />,
      iconClassName: "bg-muted text-muted-foreground",
    },
  }[result.status];

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm sm:gap-4 sm:p-5">
      <div className={cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full", meta.iconClassName)}>
        {meta.icon}
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground sm:text-base">{label}</p>
          <Badge variant={meta.badgeVariant}>{meta.badgeLabel}</Badge>
        </div>
        <p className="break-words text-xs leading-5 text-muted-foreground sm:text-sm">
          {result.detail}
        </p>
      </div>
    </div>
  );
}
````

## File: modules/notebooklm/subdomains/source/interfaces/components/file-processing-dialog.surface.tsx
````typescript
"use client";

import type { ReactNode } from "react";

import { useIsMobile } from "@ui-shadcn";
import { Badge } from "@ui-shadcn/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@ui-shadcn/ui/sheet";

interface FileProcessingDialogSurfaceProps {
  readonly open: boolean;
  readonly canDismiss: boolean;
  readonly onOpenChange: (nextOpen: boolean) => void;
  readonly footer: ReactNode;
  readonly children: ReactNode;
}

export function FileProcessingDialogSurface({
  open,
  canDismiss,
  onOpenChange,
  footer,
  children,
}: FileProcessingDialogSurfaceProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          showCloseButton={canDismiss}
          className="h-auto max-h-[92vh] gap-0 overflow-y-auto rounded-t-[28px] p-0 overscroll-contain"
        >
          <SheetHeader className="gap-3 border-b border-border/60 px-4 pb-4 pt-5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">File Processing</Badge>
              <Badge variant="secondary">Prototype</Badge>
            </div>
            <div className="space-y-1.5 pr-10">
              <SheetTitle className="text-left text-lg">上傳完成後續處理</SheetTitle>
              <SheetDescription className="text-left leading-6 text-pretty">
                先決定是否要解析，再決定是否建立 RAG 索引或 Knowledge Page，避免檔案被自動處理造成爭議。
              </SheetDescription>
            </div>
          </SheetHeader>
          <div className="space-y-4 px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">{children}</div>
          {footer ? (
            <div className="border-t border-border/60 bg-muted/30 px-4 py-4 sm:px-6">
              {footer}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl"
        showCloseButton={canDismiss}
      >
        <DialogHeader className="gap-3 border-b border-border/60 px-4 pb-4 pt-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">File Processing</Badge>
            <Badge variant="secondary">Prototype</Badge>
          </div>
          <div className="space-y-1.5 pr-10">
            <DialogTitle className="text-lg">上傳完成後續處理</DialogTitle>
            <DialogDescription className="leading-6 text-pretty">
              先決定是否要解析，再決定是否建立 RAG 索引或 Knowledge Page，避免檔案被自動處理造成爭議。
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="space-y-4 px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">{children}</div>
        {footer ? (
          <div className="border-t border-border/60 bg-muted/30 px-4 py-4 sm:px-6">
            {footer}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/notebooklm/subdomains/source/interfaces/components/file-processing-dialog.utils.ts
````typescript
"use client";

import { waitForParsedDocument } from "../../api/factories";

export type TaskStatus = "idle" | "running" | "success" | "error" | "skipped";

export interface TaskResult {
  readonly status: TaskStatus;
  readonly detail: string;
}

export interface ExecutionSummary {
  readonly pageCount: number;
  readonly jsonGcsUri: string;
  readonly pageHref: string;
  readonly parse: TaskResult;
  readonly rag: TaskResult;
  readonly page: TaskResult;
}

export function createIdleSummary(): ExecutionSummary {
  return {
    pageCount: 0,
    jsonGcsUri: "",
    pageHref: "",
    parse: { status: "idle", detail: "尚未開始解析" },
    rag: { status: "idle", detail: "尚未決定是否建立 RAG 索引" },
    page: { status: "idle", detail: "尚未決定是否建立 Knowledge Page" },
  };
}

export function readCallableData(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export { waitForParsedDocument };
````

## File: modules/notebooklm/subdomains/source/interfaces/components/FileProcessingDialog.tsx
````typescript
"use client";

import { useState } from "react";
import Link from "next/link";

import { useAuth } from "@/modules/platform/api";
import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";
import { Button } from "@ui-shadcn/ui/button";

import { createKnowledgeDraftFromSourceDocument } from "../_actions/source-processing.actions";
import { FileProcessingDialogBody } from "./file-processing-dialog.body";
import { FileProcessingDialogSurface } from "./file-processing-dialog.surface";
import {
  createIdleSummary,
  readCallableData,
  readNumber,
  readString,
  type ExecutionSummary,
  waitForParsedDocument,
} from "./file-processing-dialog.utils";

interface FileProcessingDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly accountId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly filename: string;
  readonly gcsUri: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}

type DialogStep = "decide" | "select" | "executing" | "done";

export function FileProcessingDialog({
  open,
  onClose,
  accountId,
  workspaceId,
  sourceFileId,
  filename,
  gcsUri,
  mimeType,
  sizeBytes,
}: FileProcessingDialogProps) {
  const { state: { user } } = useAuth();
  const [step, setStep] = useState<DialogStep>("decide");
  const [shouldRunRag, setShouldRunRag] = useState(true);
  const [shouldCreatePage, setShouldCreatePage] = useState(false);
  const [summary, setSummary] = useState<ExecutionSummary>(createIdleSummary);

  const canDismiss = step !== "executing";

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && canDismiss) onClose();
  }

  async function handleExecute() {
    setStep("executing");
    setSummary({
      ...createIdleSummary(),
      parse: { status: "running", detail: "正在呼叫 Document AI 解析文件" },
      rag: shouldRunRag
        ? { status: "idle", detail: "等待文件解析完成後建立索引" }
        : { status: "skipped", detail: "使用者未勾選 RAG 索引" },
      page: shouldCreatePage
        ? { status: "idle", detail: "等待文件解析完成後建立單頁草稿" }
        : { status: "skipped", detail: "使用者未勾選 Knowledge Page" },
    });

    try {
      const functions = getFirebaseFunctions("asia-southeast1");
      const parseDocument = functionsApi.httpsCallable(functions, "parse_document");

      const parseResponse = await parseDocument({
        account_id: accountId,
        workspace_id: workspaceId,
        doc_id: sourceFileId,
        gcs_uri: gcsUri,
        filename,
        mime_type: mimeType || "application/octet-stream",
        size_bytes: sizeBytes,
        run_rag: false,
      });

      const parseData = readCallableData(parseResponse.data);
      const docId = readString(parseData.doc_id, sourceFileId);

      setSummary((current) => ({
        ...current,
        parse: { status: "running", detail: "解析工作已送出，正在等待文件狀態完成" },
      }));

      const parsedDocument = await waitForParsedDocument(accountId, docId);

      setSummary((current) => ({
        ...current,
        pageCount: parsedDocument.pageCount,
        jsonGcsUri: parsedDocument.jsonGcsUri,
        parse: { status: "success", detail: `解析完成，共 ${parsedDocument.pageCount} 頁。` },
      }));

      if (shouldRunRag) {
        setSummary((current) => ({
          ...current,
          rag: { status: "running", detail: "正在建立可檢索的 RAG 索引" },
        }));

        try {
          const runRagIndex = functionsApi.httpsCallable(functions, "rag_reindex_document");
          const ragResponse = await runRagIndex({
            account_id: accountId,
            workspace_id: workspaceId,
            doc_id: docId,
            json_gcs_uri: parsedDocument.jsonGcsUri,
            source_gcs_uri: gcsUri,
            filename,
            page_count: parsedDocument.pageCount,
          });
          const ragResult = readCallableData(ragResponse.data);

          setSummary((current) => ({
            ...current,
            rag: {
              status: "success",
              detail: `索引完成，${readNumber(ragResult.chunk_count, 0)} 個 chunks / ${readNumber(ragResult.vector_count, 0)} 個 vectors。`,
            },
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : "RAG 索引失敗";
          setSummary((current) => ({ ...current, rag: { status: "error", detail: message } }));
        }
      }

      if (shouldCreatePage) {
        setSummary((current) => ({
          ...current,
          page: { status: "running", detail: "正在建立可編輯的 Knowledge Page 草稿" },
        }));

        try {
          if (!user?.id) throw new Error("缺少登入使用者，無法建立 Knowledge Page 草稿");

          const draftPage = await createKnowledgeDraftFromSourceDocument({
            accountId,
            workspaceId,
            createdByUserId: user.id,
            filename,
            sourceGcsUri: gcsUri,
            jsonGcsUri: parsedDocument.jsonGcsUri,
            pageCount: parsedDocument.pageCount,
          });

          if (!draftPage.success) throw new Error(draftPage.error.message || "建立 Knowledge Page 失敗");

          setSummary((current) => ({
            ...current,
            pageHref: `/knowledge/pages/${draftPage.aggregateId}`,
            page: { status: "success", detail: "已建立單頁 Draft，可直接進頁面補內容、調整結構，後續再迭代切頁策略。" },
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : "建立 Knowledge Page 失敗";
          setSummary((current) => ({ ...current, page: { status: "error", detail: message } }));
        }
      }

      setStep("done");
    } catch (error) {
      const message = error instanceof Error ? error.message : "文件處理失敗";
      setSummary((current) => {
        if (current.parse.status === "running") {
          return { ...current, parse: { status: "error", detail: message } };
        }
        return { ...current, rag: { status: "error", detail: message } };
      });
      setStep("done");
    }
  }

  const canContinue = shouldRunRag || shouldCreatePage;

  const footerActions = (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
      {step === "decide" && (
        <>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">保留檔案即可</Button>
          <Button onClick={() => setStep("select")} className="w-full sm:w-auto">我要決定後續處理</Button>
        </>
      )}

      {step === "select" && (
        <>
          <Button variant="outline" onClick={() => setStep("decide")} className="w-full sm:w-auto">上一步</Button>
          <Button onClick={() => { void handleExecute(); }} disabled={!canContinue} className="w-full sm:w-auto">開始處理</Button>
        </>
      )}

      {step === "done" && (
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {summary.pageHref && summary.page.status === "success" ? (
            <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
              <Link href={summary.pageHref}>前往 Draft Page</Link>
            </Button>
          ) : (
            <div className="hidden sm:block" />
          )}
          <Button onClick={onClose} className="w-full sm:w-auto">完成</Button>
        </div>
      )}
    </div>
  );

  return (
    <FileProcessingDialogSurface
      open={open}
      canDismiss={canDismiss}
      onOpenChange={handleOpenChange}
      footer={step !== "executing" ? footerActions : null}
    >
      <FileProcessingDialogBody
        step={step}
        filename={filename}
        mimeType={mimeType}
        gcsUri={gcsUri}
        sizeBytes={sizeBytes}
        shouldRunRag={shouldRunRag}
        shouldCreatePage={shouldCreatePage}
        onShouldRunRagChange={setShouldRunRag}
        onShouldCreatePageChange={setShouldCreatePage}
        summary={summary}
      />
    </FileProcessingDialogSurface>
  );
}
````

## File: modules/notebooklm/subdomains/source/interfaces/components/LibrariesView.tsx
````typescript
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  addWikiLibraryField,
  createWikiLibrary,
  createWikiLibraryRow,
  getWikiLibrarySnapshot,
  listWikiLibraries,
  type WikiLibrary,
  type WikiLibraryFieldType,
  type WikiLibraryRow,
} from "../../api";

interface WikiLibrariesViewProps {
  readonly accountId: string;
  readonly workspaceId?: string;
}

const FIELD_TYPES: WikiLibraryFieldType[] = ["title", "text", "number", "select", "relation"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseFieldType(value: string): WikiLibraryFieldType {
  if (value === "title") return "title";
  if (value === "text") return "text";
  if (value === "number") return "number";
  if (value === "select") return "select";
  if (value === "relation") return "relation";
  return "text";
}

export function LibrariesView({ accountId, workspaceId }: WikiLibrariesViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [libraries, setLibraries] = useState<WikiLibrary[]>([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>("");
  const [fieldsPreview, setFieldsPreview] = useState<{ key: string; label: string; type: string }[]>([]);
  const [rowsPreview, setRowsPreview] = useState<WikiLibraryRow[]>([]);
  const [libraryName, setLibraryName] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldType, setFieldType] = useState<WikiLibraryFieldType>("text");
  const [rowJson, setRowJson] = useState('{"title":"New record"}');

  const selectedLibrary = useMemo(
    () => libraries.find((library) => library.id === selectedLibraryId) ?? null,
    [libraries, selectedLibraryId],
  );

  const refreshLibraries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listWikiLibraries(accountId, workspaceId);
      setLibraries(result);
      if (!selectedLibraryId && result.length > 0) setSelectedLibraryId(result[0]?.id ?? "");
      if (result.length === 0) setSelectedLibraryId("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to list libraries");
    } finally {
      setLoading(false);
    }
  }, [accountId, selectedLibraryId, workspaceId]);

  const refreshSelectedSnapshot = useCallback(async () => {
    if (!selectedLibraryId) {
      setFieldsPreview([]);
      setRowsPreview([]);
      return;
    }
    try {
      const snapshot = await getWikiLibrarySnapshot(accountId, selectedLibraryId);
      setFieldsPreview(snapshot.fields.map((field) => ({ key: field.key, label: field.label, type: field.type })));
      setRowsPreview(snapshot.rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to load library snapshot");
    }
  }, [accountId, selectedLibraryId]);

  useEffect(() => { void refreshLibraries(); }, [refreshLibraries]);
  useEffect(() => { void refreshSelectedSnapshot(); }, [refreshSelectedSnapshot]);

  const handleCreateLibrary = useCallback(async () => {
    try {
      await createWikiLibrary({ accountId, workspaceId, name: libraryName });
      setLibraryName("");
      await refreshLibraries();
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to create library");
    }
  }, [accountId, libraryName, refreshLibraries, workspaceId]);

  const handleAddField = useCallback(async () => {
    if (!selectedLibraryId) return;
    try {
      await addWikiLibraryField({ accountId, libraryId: selectedLibraryId, key: fieldKey, label: fieldLabel, type: fieldType });
      setFieldKey("");
      setFieldLabel("");
      await refreshSelectedSnapshot();
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to add field");
    }
  }, [accountId, fieldKey, fieldLabel, fieldType, refreshSelectedSnapshot, selectedLibraryId]);

  const handleCreateRow = useCallback(async () => {
    if (!selectedLibraryId) return;
    try {
      const parsed = JSON.parse(rowJson);
      if (!isRecord(parsed)) throw new Error("row JSON must be an object");
      await createWikiLibraryRow({ accountId, libraryId: selectedLibraryId, values: parsed });
      await refreshSelectedSnapshot();
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to create row");
    }
  }, [accountId, refreshSelectedSnapshot, rowJson, selectedLibraryId]);

  return (
    <section className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Libraries MVP</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Notion-like Structured Data</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          對齊命名：Database/Data Source 在產品層統一為 Libraries。MVP 支援建立 library、定義 fields、建立 rows。
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />載入 libraries 中...
        </div>
      ) : null}

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
      ) : null}

      <div className="grid gap-2 rounded-lg border border-border/60 bg-muted/20 p-3 md:grid-cols-[1fr_auto]">
        <input
          type="text"
          value={libraryName}
          onChange={(event) => setLibraryName(event.target.value)}
          placeholder="Library name"
          className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm outline-none focus:border-primary/40"
        />
        <button
          type="button"
          onClick={() => void handleCreateLibrary()}
          className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          建立 Library
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3">
          <h3 className="text-sm font-semibold text-foreground">Libraries</h3>
          <select
            value={selectedLibraryId}
            onChange={(event) => setSelectedLibraryId(event.target.value)}
            className="h-9 w-full rounded-md border border-border/60 bg-background px-2 text-sm"
            aria-label="Select library"
          >
            <option value="">Select library</option>
            {libraries.map((library) => (
              <option key={library.id} value={library.id}>
                {library.name} ({library.slug})
              </option>
            ))}
          </select>
          {selectedLibrary ? (
            <p className="text-xs text-muted-foreground">{selectedLibrary.name} / {selectedLibrary.slug}</p>
          ) : (
            <p className="text-xs text-muted-foreground">請先建立或選擇一個 library。</p>
          )}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Fields</p>
            {fieldsPreview.length === 0 ? (
              <p className="text-xs text-muted-foreground">尚無欄位</p>
            ) : (
              <ul className="space-y-1 text-xs text-muted-foreground">
                {fieldsPreview.map((field) => (
                  <li key={field.key} className="rounded border border-border/60 bg-background px-2 py-1">
                    {field.label} ({field.key}) - {field.type}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3">
          <h3 className="text-sm font-semibold text-foreground">Add Field / Add Row</h3>
          <div className="grid gap-2 md:grid-cols-2">
            <input type="text" value={fieldKey} onChange={(event) => setFieldKey(event.target.value)} placeholder="field key"
              className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm" />
            <input type="text" value={fieldLabel} onChange={(event) => setFieldLabel(event.target.value)} placeholder="field label"
              className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={fieldType} onChange={(event) => setFieldType(parseFieldType(event.target.value))}
              className="h-9 rounded-md border border-border/60 bg-background px-2 text-sm">
              {FIELD_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <button type="button" onClick={() => void handleAddField()}
              className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm text-muted-foreground hover:text-foreground">
              新增欄位
            </button>
          </div>
          <textarea value={rowJson} onChange={(event) => setRowJson(event.target.value)}
            className="min-h-24 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-xs"
            placeholder='{"title":"My record"}' />
          <button type="button" onClick={() => void handleCreateRow()}
            className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm text-muted-foreground hover:text-foreground">
            建立 Row
          </button>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Rows Preview</p>
            {rowsPreview.length === 0 ? (
              <p className="text-xs text-muted-foreground">尚無資料列</p>
            ) : (
              <ul className="space-y-1 text-xs text-muted-foreground">
                {rowsPreview.slice(0, 5).map((row) => (
                  <li key={row.id} className="rounded border border-border/60 bg-background px-2 py-1">
                    {JSON.stringify(row.values)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
````

## File: modules/notebooklm/subdomains/source/interfaces/components/LibraryTableView.tsx
````typescript
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GripVertical } from "lucide-react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@lib-tanstack";
import { draggable, dropTargetForElements, monitorForElements } from "@lib-dragdrop";

import { getWikiLibrarySnapshot, listWikiLibraries, type WikiLibraryRow } from "../../api";

interface LibraryTableViewProps {
  readonly accountId: string;
  readonly workspaceId?: string;
}

type RowData = WikiLibraryRow & { _values: Record<string, unknown> };

const columnHelper = createColumnHelper<RowData>();

/**
 * LibraryTableView
 *
 * TanStack Table rendering library rows with:
 * - Column-level text filter (global filter input)
 * - Drag-to-reorder rows via pragmatic-drag-and-drop
 */
export function LibraryTableView({ accountId, workspaceId }: LibraryTableViewProps) {
  const [libraries, setLibraries] = useState<{ id: string; name: string }[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [fieldKeys, setFieldKeys] = useState<string[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Load library list
  useEffect(() => {
    void (async () => {
      try {
        const result = await listWikiLibraries(accountId, workspaceId);
        setLibraries(result.map((l) => ({ id: l.id, name: l.name })));
        if (result.length > 0 && result[0]) setSelectedId(result[0].id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "載入 Libraries 失敗");
      } finally {
        setLoading(false);
      }
    })();
  }, [accountId, workspaceId]);

  // Load rows when selection changes
  useEffect(() => {
    if (!selectedId) return;
    void (async () => {
      setLoading(true);
      try {
        const snap = await getWikiLibrarySnapshot(accountId, selectedId);
        const keys = snap.fields.map((f) => f.key);
        setFieldKeys(keys);
        setRows(snap.rows.map((r) => ({ ...r, _values: r.values as Record<string, unknown> })));
      } catch (e) {
        setError(e instanceof Error ? e.message : "載入資料列失敗");
      } finally {
        setLoading(false);
      }
    })();
  }, [accountId, selectedId]);

  // DnD row reorder
  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) return;
        const fromId = source.data["rowId"] as string | undefined;
        const toId = target.data["rowId"] as string | undefined;
        if (!fromId || !toId || fromId === toId) return;
        setRows((prev) => {
          const fromIdx = prev.findIndex((r) => r.id === fromId);
          const toIdx = prev.findIndex((r) => r.id === toId);
          if (fromIdx === -1 || toIdx === -1) return prev;
          const next = [...prev];
          const [moved] = next.splice(fromIdx, 1);
          if (!moved) return prev;
          next.splice(toIdx, 0, moved);
          return next;
        });
      },
    });
  }, []);

  const columns = useMemo(
    () =>
      fieldKeys.map((key) =>
        columnHelper.accessor((row) => String(row._values[key] ?? ""), {
          id: key,
          header: key,
          cell: (info) => info.getValue(),
        }),
      ),
    [fieldKeys],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { globalFilter: filter },
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <section className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Library Table</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">資料庫表格</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          TanStack Table · 全域篩選 · 拖曳重排列
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="h-9 rounded-md border border-border/60 bg-background px-2 text-sm"
          aria-label="選擇 Library"
        >
          {libraries.map((lib) => (
            <option key={lib.id} value={lib.id}>{lib.name}</option>
          ))}
        </select>
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="篩選…"
          className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40"
        />
      </div>

      {loading && <p className="text-sm text-muted-foreground">載入中…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && fieldKeys.length === 0 && (
        <p className="text-sm text-muted-foreground">此 Library 尚未定義欄位，請先在 Libraries 頁面新增欄位與資料列。</p>
      )}

      {fieldKeys.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  <th className="w-8 px-2 py-2" />
                  {hg.headers.map((header) => (
                    <th key={header.id} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/40">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={fieldKeys.length + 1} className="px-3 py-4 text-center text-sm text-muted-foreground">無資料</td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} rowId={row.original.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </DraggableRow>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

interface DraggableRowProps {
  readonly rowId: string;
  readonly children: React.ReactNode;
}

function DraggableRow({ rowId, children }: DraggableRowProps) {
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const handleEl = dragHandleRef.current;
    const rowEl = rowRef.current;
    if (!handleEl || !rowEl) return;
    const cleanupDraggable = draggable({ element: handleEl, getInitialData: () => ({ rowId }) });
    const cleanupDrop = dropTargetForElements({ element: rowEl, getData: () => ({ rowId }) });
    return () => {
      cleanupDraggable();
      cleanupDrop();
    };
  }, [rowId]);

  return (
    <tr ref={rowRef} className="transition hover:bg-muted/20">
      <td className="px-2 py-2">
        <button
          ref={dragHandleRef}
          type="button"
          aria-label="拖曳重排"
          className="cursor-grab touch-none opacity-30 hover:opacity-80 active:cursor-grabbing"
        >
          <GripVertical className="size-4 text-muted-foreground" />
        </button>
      </td>
      {children}
    </tr>
  );
}
````

## File: modules/notebooklm/subdomains/source/interfaces/components/SourceDocumentsView.tsx
````typescript
"use client";

import { useRef, useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useApp } from "@/modules/platform/api";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

import type { SourceLiveDocument } from "../hooks/useSourceDocumentsSnapshot";
import { useSourceDocumentsSnapshot } from "../hooks/useSourceDocumentsSnapshot";
import { deleteSourceDocument, renameSourceDocument } from "../_actions/source-file.actions";

const UPLOAD_BUCKET = "xuanwu-i-00708880-4e2d8.firebasestorage.app";
const WATCH_PATH = "uploads/";
const ACCEPTED_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/tiff": ".tif/.tiff",
  "image/png": ".png",
  "image/jpeg": ".jpg/.jpeg",
};
const ACCEPTED_EXTS = Object.values(ACCEPTED_MIME).join(", ");

interface SourceDocumentsViewProps {
  readonly workspaceId?: string;
}

/** Upload dropzone + real-time document list backed by Firebase onSnapshot. */
export function SourceDocumentsView({ workspaceId }: SourceDocumentsViewProps) {
  const { state: appState } = useApp();
  const activeAccountId = appState.activeAccount?.id ?? "";
  const effectiveWorkspaceId = workspaceId?.trim() ?? "";

  const { docs, loading, pendingDocs, addPending } = useSourceDocumentsSnapshot(
    activeAccountId,
    effectiveWorkspaceId || undefined,
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allDocs = [
    ...pendingDocs,
    ...docs.filter((d) => !pendingDocs.some((p) => p.id === d.id)),
  ].sort((a, b) => (b.uploadedAt?.getTime() ?? 0) - (a.uploadedAt?.getTime() ?? 0));

  function handleFileChange(file: File | null) {
    if (!file) { setSelectedFile(null); return; }
    if (!(file.type in ACCEPTED_MIME)) {
      toast.error(`僅支援 ${ACCEPTED_EXTS}`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) { toast.error("請先選擇檔案"); return; }
    if (!activeAccountId) { toast.error("目前沒有 active account，無法上傳"); return; }

    const ext = selectedFile.name.includes(".")
      ? `.${selectedFile.name.split(".").pop() ?? ""}`
      : "";
    const docId = crypto.randomUUID();
    const uploadPath = `${WATCH_PATH}${activeAccountId}/${docId}${ext}`;

    setUploading(true);
    addPending({
      id: docId,
      filename: selectedFile.name,
      workspaceId: effectiveWorkspaceId,
      sourceGcsUri: `gs://${UPLOAD_BUCKET}/${uploadPath}`,
      jsonGcsUri: "",
      pageCount: 0,
      status: "processing",
      ragStatus: "",
      uploadedAt: new Date(),
      errorMessage: "",
      ragError: "",
      isClientPending: true,
    });

    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const fileRef = storageApi.ref(storage, uploadPath);
      const customMetadata: Record<string, string> = {
        account_id: activeAccountId,
        filename: selectedFile.name,
        original_filename: selectedFile.name,
        display_name: selectedFile.name,
      };
      if (effectiveWorkspaceId) customMetadata.workspace_id = effectiveWorkspaceId;
      await storageApi.uploadBytes(fileRef, selectedFile, { customMetadata });
      toast.success(`上傳成功：${selectedFile.name}`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "上傳失敗");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(doc: SourceLiveDocument) {
    setDeletingId(doc.id);
    try {
      const result = await deleteSourceDocument(activeAccountId, doc.id);
      if (!result.ok) toast.error(result.error.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleRename(doc: SourceLiveDocument, newName: string) {
    setRenamingId(doc.id);
    try {
      const result = await renameSourceDocument(activeAccountId, doc.id, newName);
      if (!result.ok) toast.error(result.error.message);
    } finally {
      setRenamingId(null);
    }
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Upload and manage source documents for RAG.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary"
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFileChange(e.dataTransfer.files[0] ?? null); }}
            style={{ background: dragging ? "var(--accent)" : undefined }}>
            <FileUp className="h-4 w-4" />
            <span>{selectedFile ? selectedFile.name : "選擇或拖曳檔案"}</span>
            <input ref={fileInputRef} type="file" className="sr-only"
              accept={Object.keys(ACCEPTED_MIME).join(",")}
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)} />
          </label>
          <Button size="sm" disabled={!selectedFile || uploading} onClick={() => void handleUpload()}>
            {uploading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
            Upload
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : allDocs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents yet.</p>
        ) : (
          <ul className="divide-y divide-border/40 rounded-lg border border-border/40">
            {allDocs.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between gap-2 px-4 py-2 text-sm">
                <span className="flex-1 truncate font-medium">{doc.filename}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{doc.status}</span>
                <button className="shrink-0 text-xs text-destructive hover:underline"
                  disabled={deletingId === doc.id || renamingId === doc.id}
                  onClick={() => void handleDelete(doc)}>
                  Delete
                </button>
                <button className="shrink-0 text-xs text-primary hover:underline"
                  disabled={deletingId === doc.id || renamingId === doc.id}
                  onClick={() => {
                    const newName = window.prompt("New name:", doc.filename);
                    if (newName?.trim()) void handleRename(doc, newName.trim());
                  }}>
                  Rename
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
````

## File: modules/notebooklm/subdomains/source/interfaces/components/WorkspaceFilesTab.tsx
````typescript
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import type { WorkspaceEntity } from "@/modules/workspace/api";

import { getFirebaseStorage } from "@integration-firebase";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";

import type { WorkspaceFileListItemDto } from "../../application/dto/source-file.dto";
import { resolveSourceOrganizationId } from "../../application/dto/source.dto";
import { getWorkspaceFiles } from "../queries/source-file.queries";
import { uploadCompleteFile, uploadInitFile } from "../_actions/source-file.actions";
import { FileProcessingDialog } from "./FileProcessingDialog";

interface WorkspaceFilesTabProps {
  readonly workspace: WorkspaceEntity;
}

interface PendingUploadProcessing {
  readonly sourceFileId: string;
  readonly filename: string;
  readonly gcsUri: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}

export function WorkspaceFilesTab({ workspace }: WorkspaceFilesTabProps) {
  const [assets, setAssets] = useState<WorkspaceFileListItemDto[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [pendingUploadProcessing, setPendingUploadProcessing] = useState<PendingUploadProcessing | null>(null);

  const reloadFiles = useCallback(async () => {
    setLoadState("loading");
    try {
      const nextAssets = await getWorkspaceFiles(workspace);
      setAssets(nextAssets);
      setLoadState("loaded");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[WorkspaceFilesTab] Failed to load file metadata:", error);
      }
      setAssets([]);
      setLoadState("error");
    }
  }, [workspace]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await reloadFiles();
      if (!cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [reloadFiles]);

  async function handleUploadFile(file: File) {
    const organizationId = resolveSourceOrganizationId(workspace.accountType, workspace.accountId);
    setUploadState("uploading");
    setUploadMessage(null);

    try {
      const initResult = await uploadInitFile({
        workspaceId: workspace.id,
        organizationId,
        actorAccountId: workspace.accountId,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
      });

      if (!initResult.ok) {
        setUploadState("error");
        setUploadMessage(`Upload initialization failed: ${initResult.error.message}`);
        return;
      }

      const storage = getFirebaseStorage();
      const storageRef = ref(storage, initResult.data.uploadPath);
      await uploadBytes(storageRef, file, { contentType: file.type || "application/octet-stream" });
      await getDownloadURL(storageRef);

      const completeResult = await uploadCompleteFile({
        workspaceId: workspace.id,
        organizationId,
        actorAccountId: workspace.accountId,
        fileId: initResult.data.fileId,
        versionId: initResult.data.versionId,
      });

      if (!completeResult.ok) {
        setUploadState("error");
        setUploadMessage(`Upload completion failed: ${completeResult.error.message}`);
        return;
      }

      setUploadState("success");
      setUploadMessage(`Uploaded ${file.name}`);
      setPendingUploadProcessing({
        sourceFileId: initResult.data.fileId,
        filename: file.name,
        gcsUri: `gs://${storageRef.bucket}/${storageRef.fullPath}`,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
      });
      await reloadFiles();
    } catch (error) {
      setUploadState("error");
      setUploadMessage(error instanceof Error ? `Storage upload failed: ${error.message}` : "Storage upload failed unexpectedly.");
    }
  }

  const availableCount = useMemo(
    () => assets.filter((asset) => asset.status === "active").length,
    [assets],
  );

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Files</CardTitle>
        <CardDescription>
          Manage workspace source files. Upload triggers storage → Firestore → RAG pipeline.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-border/40 px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <Label htmlFor="workspace-file-upload" className="text-sm font-semibold">
                Upload file
              </Label>
              <p className="text-xs text-muted-foreground">
                Triggers upload-init → Storage → completion + RAG registration.
              </p>
            </div>
            <Input
              id="workspace-file-upload"
              type="file"
              className="max-w-xs"
              disabled={uploadState === "uploading"}
              onChange={(event) => {
                const nextFile = event.target.files?.[0];
                if (nextFile) void handleUploadFile(nextFile);
                event.currentTarget.value = "";
              }}
            />
          </div>
          {uploadMessage && (
            <p className={`mt-3 text-xs ${uploadState === "error" ? "text-destructive" : "text-emerald-600"}`}>
              {uploadMessage}
            </p>
          )}
          {uploadState === "uploading" && (
            <p className="mt-3 text-xs text-muted-foreground">Uploading and persisting metadata…</p>
          )}
        </div>

        {loadState === "loading" && <p className="text-sm text-muted-foreground">Loading file metadata…</p>}
        {loadState === "error" && <p className="text-sm text-destructive">無法載入已持久化的檔案資料，請稍後再試。</p>}

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Registered assets</p>
            <p className="mt-1 text-xl font-semibold">{assets.length}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Directly available</p>
            <p className="mt-1 text-xl font-semibold">{availableCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Derived manifests</p>
            <p className="mt-1 text-xl font-semibold">{assets.length - availableCount}</p>
          </div>
        </div>

        <div className="space-y-3">
          {loadState === "loaded" && assets.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/40 px-4 py-6 text-sm text-muted-foreground">
              No file records yet. Upload-init will create metadata here.
            </div>
          )}
          {assets.map((asset) => (
            <div key={asset.id} className="rounded-xl border border-border/40 px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{asset.name}</p>
                    <Badge variant={asset.status === "active" ? "secondary" : "outline"}>{asset.status}</Badge>
                    <Badge variant="outline">{asset.kind}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{asset.detail}</p>
                </div>
                <div className="text-xs text-muted-foreground sm:text-right">
                  <p>Source: {asset.source}</p>
                  {asset.href && (
                    <Button asChild variant="link" className="mt-1 inline-flex h-auto p-0 text-xs">
                      <a href={asset.href} target="_blank" rel="noreferrer">Open asset</a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {pendingUploadProcessing && (
        <FileProcessingDialog
          open
          onClose={() => setPendingUploadProcessing(null)}
          accountId={workspace.accountId}
          workspaceId={workspace.id}
          sourceFileId={pendingUploadProcessing.sourceFileId}
          filename={pendingUploadProcessing.filename}
          gcsUri={pendingUploadProcessing.gcsUri}
          mimeType={pendingUploadProcessing.mimeType}
          sizeBytes={pendingUploadProcessing.sizeBytes}
        />
      )}
    </Card>
  );
}
````

## File: modules/notebooklm/subdomains/source/interfaces/contracts/source-command-result.ts
````typescript
import type { SourceFileCommandErrorCode } from "../../application/dto/source-file.dto";

export type SourceFileCommandResult<TData> =
  | {
      readonly ok: true;
      readonly data: TData;
      readonly commandId: string;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: SourceFileCommandErrorCode;
        readonly message: string;
      };
      readonly commandId: string;
    };
````

## File: modules/notebooklm/subdomains/source/interfaces/hooks/useSourceDocumentsSnapshot.ts
````typescript
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { firestoreApi, getFirebaseFirestore } from "@integration-firebase/firestore";

import type {
  SourceLiveDocument,
} from "../../application/dto/source-live-document.dto";
import {
  mapToSourceLiveDocument,
} from "../../application/dto/source-live-document.dto";

// Re-export types for backward compatibility
export type {
  SourceDocument,
  SourceLiveDocument,
  AssetDocument,
  AssetLiveDocument,
} from "../../application/dto/source-live-document.dto";
export {
  mapToSourceLiveDocument,
  mapToAssetLiveDocument,
} from "../../application/dto/source-live-document.dto";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function objectOrEmpty(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseSourceDocumentsSnapshotResult {
  readonly docs: SourceLiveDocument[];
  readonly loading: boolean;
  readonly pendingDocs: SourceLiveDocument[];
  readonly addPending: (doc: SourceLiveDocument) => void;
  readonly removePending: (id: string) => void;
}

/** Subscribes to Firestore `accounts/{accountId}/documents` in real time via onSnapshot. */
export function useSourceDocumentsSnapshot(
  accountId: string,
  workspaceId?: string,
): UseSourceDocumentsSnapshotResult {
  const [rawDocs, setRawDocs] = useState<SourceLiveDocument[]>([]);
  const [rawPending, setRawPending] = useState<SourceLiveDocument[]>([]);
  const [receivedKey, setReceivedKey] = useState("");
  const statusMapRef = useRef<Record<string, string>>({});

  const addPending = useCallback((doc: SourceLiveDocument) => {
    setRawPending((prev) => [doc, ...prev.filter((p) => p.id !== doc.id)]);
  }, []);

  const removePending = useCallback((id: string) => {
    setRawPending((prev) => prev.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    if (!accountId) return;

    const subKey = `${accountId}/${workspaceId ?? ""}`;
    statusMapRef.current = {};

    const db = getFirebaseFirestore();
    const colRef = firestoreApi.collection(db, "accounts", accountId, "documents");

    const unsubscribe = firestoreApi.onSnapshot(
      colRef,
      (snapshot) => {
        const mapped = snapshot.docs
          .map((item) => mapToSourceLiveDocument(item.id, objectOrEmpty(item.data())))
          .filter((item) => !workspaceId || item.workspaceId === workspaceId)
          .sort((a, b) => (b.uploadedAt?.getTime() ?? 0) - (a.uploadedAt?.getTime() ?? 0));

        const nextMap: Record<string, string> = {};
        for (const doc of mapped) {
          nextMap[doc.id] = `${doc.status}/${doc.ragStatus}`;
        }
        statusMapRef.current = nextMap;

        setRawDocs(mapped);
        setRawPending((prev) => prev.filter((p) => !mapped.some((d) => d.id === p.id)));
        setReceivedKey(subKey);
      },
      () => {
        setReceivedKey(subKey);
      },
    );

    return () => {
      unsubscribe();
      statusMapRef.current = {};
    };
  }, [accountId, workspaceId]);

  const currentKey = `${accountId}/${workspaceId ?? ""}`;
  const docs = accountId ? rawDocs : [];
  const loading = Boolean(accountId) && receivedKey !== currentKey;
  const pendingDocs = accountId ? rawPending : [];

  return { docs, loading, pendingDocs, addPending, removePending };
}
````

## File: modules/notebooklm/subdomains/source/README.md
````markdown
# Source

Source document ingestion and reference management.

## Ownership

- **Bounded Context**: notebooklm
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |
| `interfaces/` | UI components, hooks, actions, and queries |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notebooklm/subdomains/synthesis/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/notebooklm/subdomains/synthesis/application/index.ts
````typescript
// Purpose: Application layer placeholder for notebooklm subdomain 'synthesis'.
````

## File: modules/notebooklm/subdomains/synthesis/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for notebooklm subdomain 'synthesis'.
````

## File: modules/notebooklm/subdomains/synthesis/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for notebooklm subdomain 'synthesis'.
````

## File: modules/notebooklm/subdomains/synthesis/README.md
````markdown
# Synthesis

RAG 合成、摘要與洞察生成。

## Ownership

- **Bounded Context**: notebooklm
- **Subdomain Type**: Baseline
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/notebooklm/api/api.instructions.md
````markdown
---
description: 'NotebookLM API boundary rules: cross-module entry surface, tRPC server factory, and published language for notebook/source/conversation references.'
applyTo: 'modules/notebooklm/api/**/*.{ts,tsx}'
---

# NotebookLM API Layer (Local)

Use this file as execution guardrails for `modules/notebooklm/api/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notebooklm/context-map.md`.

## Core Rules

- `api/` is the **only** cross-module entry surface; never expose `domain/`, `application/`, or `infrastructure/` internals.
- Expose stable **factory functions** and **contract types** only — no aggregate classes, no repository interfaces.
- Published language tokens for cross-module use: `notebookId`, `sourceId`, `conversationId`, `ragDocumentRef`.
- `factories.ts` wires subdomain services for tRPC consumption; keep wiring thin and delegate to use cases.
- `server.ts` is the tRPC router entry point — do not place business logic here.
- Never pass `notion` knowledge aggregates directly into notebooklm domain; translate via ACL at the boundary.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/notebooklm/application/application.instructions.md
````markdown
---
description: 'NotebookLM application layer rules: use-case orchestration, RAG pipeline coordination, event publishing order, and DTO contracts.'
applyTo: 'modules/notebooklm/application/**/*.{ts,tsx}'
---

# NotebookLM Application Layer (Local)

Use this file as execution guardrails for `modules/notebooklm/application/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notebooklm/*`.

## Core Rules

- Context-wide `application/` is reserved for cross-subdomain orchestration; subdomain-specific use cases belong inside `subdomains/<name>/application/`.
- Use cases orchestrate flow only; RAG scoring, citation building, and prompt construction stay in `domain/services/`.
- After persisting, call `pullDomainEvents()` and publish — never publish before persistence.
- DTOs are application-layer contracts; never expose domain entities across the layer boundary.
- Pure reads (retrieval results, conversation history) belong in **query handlers**, not use cases.
- RAG pipeline steps (retrieve → ground → generate → evaluate) must be individually use-case-addressable to allow partial retry.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill rag-architecture
````

## File: modules/notebooklm/application/dtos/.gitkeep
````

````

## File: modules/notebooklm/application/services/.gitkeep
````

````

## File: modules/notebooklm/application/use-cases/.gitkeep
````

````

## File: modules/notebooklm/docs/docs.instructions.md
````markdown
---
description: 'NotebookLM documentation rules: strategic doc authority, subdomain list sync, and ubiquitous language enforcement.'
applyTo: 'modules/notebooklm/docs/**/*.md'
---

# NotebookLM Docs Layer (Local)

Use this file as execution guardrails for `modules/notebooklm/docs/*`.
For full reference, align with `.github/instructions/docs-authority-and-language.instructions.md` and `docs/contexts/notebooklm/*`.

## Core Rules

- `modules/notebooklm/docs/` holds **links and local summaries only** — authoritative content lives in `docs/contexts/notebooklm/`.
- Do not duplicate strategic knowledge here; point to the canonical source instead.
- Any new architectural decision affecting notebooklm must have a corresponding ADR in `docs/decisions/`.
- Use ubiquitous language from `docs/contexts/notebooklm/ubiquitous-language.md`; do not introduce synonyms.
- Keep this directory in sync with `docs/contexts/notebooklm/README.md` whenever the subdomain list changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/notebooklm/domain/domain-modeling.instructions.md
````markdown
---
description: 'NotebookLM domain tactical modeling rules (local mirror of root domain-modeling guidance).'
applyTo: '*.{ts,tsx}'
---

# Domain Modeling (NotebookLM Local)

Use this local file as execution guardrails for `modules/notebooklm/domain/*`.
For full reference, align with `.github/instructions/domain-modeling.instructions.md` and `docs/contexts/notebooklm/*`.

## Core Rules

- Keep aggregate invariants inside aggregate methods.
- Use immutable value objects with Zod schemas and inferred types.
- Keep domain framework-free (no Firebase/React/transport imports).
- Emit domain events on state transitions and publish via application orchestration.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/notebooklm/domain/services/.gitkeep
````

````

## File: modules/notebooklm/infrastructure/infrastructure.instructions.md
````markdown
---
description: 'NotebookLM infrastructure layer rules: Firebase adapters, Genkit AI client, vector store, and RAG persistence contracts.'
applyTo: 'modules/notebooklm/infrastructure/**/*.{ts,tsx}'
---

# NotebookLM Infrastructure Layer (Local)

Use this file as execution guardrails for `modules/notebooklm/infrastructure/*`.
For full reference, align with `.github/instructions/firestore-schema.instructions.md`, `.github/instructions/genkit-flow.instructions.md`, and `docs/contexts/notebooklm/*`.

## Core Rules

- Implement only **port interfaces** declared in subdomain `domain/ports/` or context-wide `domain/ports/output/`; never invent new contracts here.
- Genkit adapters (`infrastructure/genkit/`) implement `IRagGenerationRepository` or `NotebookRepository` — keep Genkit flow wiring inside the adapter, not in use cases.
- Firebase adapters own their Firestore collection(s); do not read or write sibling subdomain or cross-module collections directly.
- Vector store interactions must go through `IVectorStore` port — never call embedding or retrieval APIs directly from use cases.
- Keep AI client initialisation (`genkit-ai-client.ts`, `client.ts`) in infrastructure; domain must not reference any AI SDK types.
- Version breaking schema transitions with migration steps; update `firestore.indexes.json` with query-shape changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill rag-architecture
````

## File: modules/notebooklm/interfaces/interfaces.instructions.md
````markdown
---
description: 'NotebookLM interfaces layer rules: input/output translation, Server Actions, RAG UI components, and chat action wiring.'
applyTo: 'modules/notebooklm/interfaces/**/*.{ts,tsx}'
---

# NotebookLM Interfaces Layer (Local)

Use this file as execution guardrails for `modules/notebooklm/interfaces/*`.
For full reference, align with `.github/instructions/nextjs-server-actions.instructions.md`, `.github/instructions/shadcn-ui.instructions.md`, and `docs/contexts/notebooklm/*`.

## Core Rules

- This layer owns **input/output translation only** — no RAG logic, no retrieval scoring, no prompt construction.
- Server Actions (`_actions/`) must be thin: validate input, call the use case, return a stable result shape.
- Never call repositories or AI clients directly from components or actions.
- `RagQueryView` and chat components consume data via query hooks or Server Components; keep them display-only.
- Streaming RAG responses must be handled at the action boundary; do not pass raw stream objects into domain or application layers.
- Use shadcn/ui primitives before creating new components; maintain semantic markup and keyboard accessibility.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
````

## File: modules/notebooklm/notebooklm.instructions.md
````markdown
---
description: 'NotebookLM bounded context rules: conversation/source/retrieval/synthesis ownership, downstream dependency position, and subdomain routing.'
applyTo: 'modules/notebooklm/**/*.{ts,tsx,md}'
---

# NotebookLM Bounded Context (Local)

Use this file as execution guardrails for `modules/notebooklm/`.
For full reference, align with `.github/instructions/architecture-core.instructions.md`, `docs/contexts/notebooklm/README.md`, and `docs/bounded-contexts.md`.

## Core Rules

- `notebooklm` is **downstream** of `platform`, `workspace`, and `notion`; never import from their internals — use `modules/<context>/api` only.
- Cross-module consumers import from `modules/notebooklm/api` only.
- AI provider, model policy, quota, and safety guardrails belong to `platform.ai` — do not reimplement governance here.
- RAG generation and retrieval logic lives in `subdomains/ai`; notebook session orchestration lives in `subdomains/notebook`; source lifecycle lives in `subdomains/source`.
- Use ubiquitous language: `Conversation` not `Chat`, `Source` not `Document` (when referring to RAG input), `Notebook` not `Project`.

## Route to Subdomain When

| Concern | Subdomain |
|---|---|
| RAG query, generation, retrieval scoring | `ai` |
| Conversation threads, messages | `conversation` |
| Notebook session orchestration, agent generation | `notebook` |
| Source file lifecycle, RAG document registration | `source` |
| Conversation history versioning | `conversation-versioning` |
| Output grounding and citation alignment | `grounding` |
| Source ingestion pipeline | `ingestion` |
| Inline notes from synthesis output | `note` |
| Retrieval ranking and recall | `retrieval` |
| Synthesis and summarisation | `synthesis` |
| Response quality evaluation | `evaluation` |

## Route Elsewhere When

- Canonical knowledge pages, article publishing → `notion`
- Identity, entitlements, credentials → `platform`
- Workspace lifecycle, membership, presence → `workspace`

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/notebooklm/subdomains/ai/domain/repositories/IKnowledgeContentRepository.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: domain/repositories
 * Purpose: IKnowledgeContentRepository — output port for knowledge corpus RAG
 *          operations (run query, reindex, list parsed documents).
 *
 * Design notes:
 * - Knowledge content refers to the knowledge artifact corpus used for RAG retrieval.
 * - Firebase Functions back-end implements this port; the domain remains clean.
 */

export interface KnowledgeCitation {
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

export interface KnowledgeRagQueryResult {
  readonly answer: string;
  readonly citations: readonly KnowledgeCitation[];
  readonly cache: "hit" | "miss";
  readonly vectorHits: number;
  readonly searchHits: number;
  readonly accountScope: string;
  readonly workspaceScope?: string;
  readonly taxonomyFilters?: string[];
  readonly maxAgeDays?: number;
  readonly requireReady?: boolean;
}

export interface KnowledgeParsedDocument {
  readonly id: string;
  readonly filename: string;
  readonly workspaceId: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
  readonly status: string;
  readonly ragStatus: string;
  readonly uploadedAt: Date | null;
}

export interface KnowledgeReindexInput {
  readonly accountId: string;
  readonly docId: string;
  readonly jsonGcsUri: string;
  readonly sourceGcsUri: string;
  readonly filename: string;
  readonly pageCount: number;
}

export interface IKnowledgeContentRepository {
  runRagQuery(
    query: string,
    accountId: string,
    workspaceId: string,
    topK: number,
    options?: {
      taxonomyFilters?: string[];
      maxAgeDays?: number;
      requireReady?: boolean;
    },
  ): Promise<KnowledgeRagQueryResult>;
  reindexDocument(input: KnowledgeReindexInput): Promise<void>;
  listParsedDocuments(accountId: string, limitCount: number): Promise<KnowledgeParsedDocument[]>;
}
````

## File: modules/notebooklm/subdomains/ai/infrastructure/firebase/FirebaseKnowledgeContentAdapter.ts
````typescript
/**
 * Module: notebooklm/subdomains/ai
 * Layer: infrastructure/firebase
 * Purpose: FirebaseKnowledgeContentAdapter — implements IKnowledgeContentRepository via
 *          Firebase Functions calls (RAG query, reindex) and Firestore reads
 *          (list parsed documents).
 *
 * Design notes:
 * - All external shape normalisation happens here; domain types stay clean.
 * - Functions region is configured as a constant; change here only if region changes.
 */

import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";
import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";

import type {
  IKnowledgeContentRepository,
  KnowledgeCitation,
  KnowledgeParsedDocument,
  KnowledgeRagQueryResult,
  KnowledgeReindexInput,
} from "../../domain/repositories/IKnowledgeContentRepository";

const FUNCTIONS_REGION = "asia-southeast1";

// --- Firestore / Functions response normalisation helpers ---------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function objectOrEmpty(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function toNumberOrDefault(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toDateOrNull(value: unknown): Date | null {
  if (!isRecord(value)) return null;
  if (typeof (value as { toDate?: unknown }).toDate === "function") {
    const converted = (value as { toDate: () => unknown }).toDate();
    if (converted instanceof Date) return converted;
  }
  return null;
}

function normaliseCitations(raw: unknown): KnowledgeCitation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    if (!isRecord(item)) return {};
    return {
      provider: item.provider === "vector" || item.provider === "search" ? item.provider : undefined,
      chunk_id: typeof item.chunk_id === "string" ? item.chunk_id : undefined,
      doc_id: typeof item.doc_id === "string" ? item.doc_id : undefined,
      filename: typeof item.filename === "string" ? item.filename : undefined,
      json_gcs_uri: typeof item.json_gcs_uri === "string" ? item.json_gcs_uri : undefined,
      search_id: typeof item.search_id === "string" ? item.search_id : undefined,
      score: typeof item.score === "number" ? item.score : undefined,
      text: typeof item.text === "string" ? item.text : undefined,
    };
  });
}

function resolveFilename(data: Record<string, unknown>): string {
  const source = objectOrEmpty(data.source);
  const metadata = objectOrEmpty(data.metadata);
  const candidates = [
    source.filename,
    source.display_name,
    data.title,
    metadata.filename,
    metadata.display_name,
    source.original_filename,
    metadata.original_filename,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c;
  }
  return "";
}

function mapToParsedDocument(id: string, data: Record<string, unknown>): KnowledgeParsedDocument {
  const source = objectOrEmpty(data.source);
  const parsed = objectOrEmpty(data.parsed);
  const rag = objectOrEmpty(data.rag);
  const metadata = objectOrEmpty(data.metadata);

  return {
    id,
    filename: resolveFilename(data) || id,
    workspaceId:
      (typeof data.spaceId === "string" ? data.spaceId : "") ||
      (typeof metadata.space_id === "string" ? metadata.space_id : ""),
    sourceGcsUri:
      (typeof source.gcs_uri === "string" ? source.gcs_uri : "") ||
      (typeof metadata.source_gcs_uri === "string" ? metadata.source_gcs_uri : ""),
    jsonGcsUri:
      (typeof parsed.json_gcs_uri === "string" ? parsed.json_gcs_uri : "") ||
      (typeof metadata.json_gcs_uri === "string" ? metadata.json_gcs_uri : ""),
    pageCount:
      toNumberOrDefault(parsed.page_count) ||
      toNumberOrDefault(metadata.page_count) ||
      toNumberOrDefault(data.pageCount),
    status: typeof data.status === "string" ? data.status : "unknown",
    ragStatus: typeof rag.status === "string" ? rag.status : "",
    uploadedAt: toDateOrNull(source.uploaded_at) ?? toDateOrNull(data.createdAt),
  };
}

// --- Adapter ------------------------------------------------------------------

export class FirebaseKnowledgeContentAdapter implements IKnowledgeContentRepository {
  async runRagQuery(
    query: string,
    accountId: string,
    workspaceId: string,
    topK: number,
    options: {
      taxonomyFilters?: string[];
      maxAgeDays?: number;
      requireReady?: boolean;
    } = {},
  ): Promise<KnowledgeRagQueryResult> {
    const functions = getFirebaseFunctions(FUNCTIONS_REGION);
    const callable = functionsApi.httpsCallable(functions, "rag_query");
    const result = await callable({
      query,
      top_k: topK,
      account_id: accountId,
      workspace_id: workspaceId,
      taxonomy_filters: options.taxonomyFilters ?? [],
      max_age_days: options.maxAgeDays,
      require_ready: options.requireReady,
    });
    const data = objectOrEmpty(result.data);

    return {
      answer: typeof data.answer === "string" ? data.answer : "",
      citations: normaliseCitations(data.citations),
      cache: data.cache === "hit" ? "hit" : "miss",
      vectorHits: toNumberOrDefault(data.vector_hits),
      searchHits: toNumberOrDefault(data.search_hits),
      accountScope: typeof data.account_scope === "string" ? data.account_scope : accountId,
      workspaceScope:
        typeof data.workspace_scope === "string" ? data.workspace_scope : workspaceId,
      taxonomyFilters: Array.isArray(data.taxonomy_filters)
        ? data.taxonomy_filters.filter((v): v is string => typeof v === "string")
        : undefined,
      maxAgeDays: typeof data.max_age_days === "number" ? data.max_age_days : undefined,
      requireReady: typeof data.require_ready === "boolean" ? data.require_ready : undefined,
    };
  }

  async reindexDocument(input: KnowledgeReindexInput): Promise<void> {
    const functions = getFirebaseFunctions(FUNCTIONS_REGION);
    const callable = functionsApi.httpsCallable(functions, "rag_reindex_document");
    await callable({
      account_id: input.accountId,
      doc_id: input.docId,
      json_gcs_uri: input.jsonGcsUri,
      source_gcs_uri: input.sourceGcsUri,
      filename: input.filename,
      page_count: input.pageCount,
    });
  }

  async listParsedDocuments(accountId: string, limitCount: number): Promise<KnowledgeParsedDocument[]> {
    if (!accountId) throw new Error("accountId is required");
    const db = getFirebaseFirestore();
    const ref = firestoreApi.collection(db, "accounts", accountId, "documents");
    const q = firestoreApi.query(ref, firestoreApi.limit(limitCount));
    const snap = await firestoreApi.getDocs(q);

    const docs = snap.docs.map((d) => mapToParsedDocument(d.id, objectOrEmpty(d.data())));
    return docs.sort((a, b) => {
      const at = a.uploadedAt ? a.uploadedAt.getTime() : 0;
      const bt = b.uploadedAt ? b.uploadedAt.getTime() : 0;
      return bt - at;
    });
  }
}
````

## File: modules/notebooklm/subdomains/ai/interfaces/components/RagQueryView.tsx
````typescript
"use client";

import { useState } from "react";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { useApp } from "@/modules/platform/api";
import { useAuth } from "@/modules/platform/api";
import { DEV_DEMO_ACCOUNT_EMAIL } from "@/modules/platform/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui-shadcn/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@ui-shadcn/ui/alert";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Textarea } from "@ui-shadcn/ui/textarea";

import { runKnowledgeRagQuery, type KnowledgeCitation } from "../../api";

interface RagQueryViewProps {
  readonly workspaceId?: string;
}

/** Minimal RAG query chat interface. Uses local useState only — no streaming, no global state. */
export function RagQueryView({ workspaceId }: RagQueryViewProps) {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const activeAccountId = appState.activeAccount?.id ?? "";
  const effectiveWorkspaceId = workspaceId?.trim() ?? "";

  const isDemoOrUnauthenticated =
    authState.status !== "authenticated" ||
    authState.user?.email === DEV_DEMO_ACCOUNT_EMAIL;

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<readonly KnowledgeCitation[]>([]);
  const [queried, setQueried] = useState(false);

  async function handleSubmit() {
    const q = query.trim();
    if (!q) {
      toast.error("請先輸入問題");
      return;
    }
    if (!activeAccountId) {
      toast.error("目前沒有 active account，無法執行 RAG 查詢");
      return;
    }
    if (!effectiveWorkspaceId) {
      toast.error("請先選擇工作區，再執行 RAG 查詢");
      return;
    }

    setLoading(true);
    try {
      let result = await runKnowledgeRagQuery(q, activeAccountId, effectiveWorkspaceId, 4, { requireReady: true });
      // Compatibility fallback for older vectors without ready status.
      if (result.citations.length === 0 && (result.vectorHits > 0 || result.searchHits > 0)) {
        result = await runKnowledgeRagQuery(q, activeAccountId, effectiveWorkspaceId, 4, { requireReady: false, maxAgeDays: 3650 });
      }
      setAnswer(result.answer);
      setCitations(result.citations);
      setQueried(true);
    } catch (error) {
      console.error(error);
      toast.error("呼叫 rag_query 失敗");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Auth warning — shown upfront when user cannot execute RAG queries */}
      {isDemoOrUnauthenticated && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>需要真實帳號</AlertTitle>
          <AlertDescription>
            目前以 Demo 帳號或未登入狀態存取。RAG 查詢需要真實 Firebase 帳號才能執行。
            請登出後以正式帳號重新登入。
          </AlertDescription>
        </Alert>
      )}

      {/* Query input */}
      <Card>
        <CardHeader>
          <CardTitle>RAG Query</CardTitle>
          <CardDescription>
            輸入問題，取得 AI 回答與引用來源。
            {effectiveWorkspaceId ? ` workspace: ${effectiveWorkspaceId}` : " （請先選擇工作區）"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) void handleSubmit();
            }}
            placeholder="請輸入你的問題...（Ctrl+Enter 送出）"
            rows={4}
            disabled={isDemoOrUnauthenticated}
          />
          <Button
            onClick={() => void handleSubmit()}
            disabled={loading || isDemoOrUnauthenticated}
            title={isDemoOrUnauthenticated ? "請先以真實帳號登入才能執行 RAG 查詢" : undefined}
          >
            {loading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Search className="mr-2 size-4" />
            )}
            {loading ? "查詢中..." : "送出查詢"}
          </Button>
        </CardContent>
      </Card>

      {/* Answer */}
      {queried && (
        <Card>
          <CardHeader>
            <CardTitle>Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-foreground">{answer || "（無回答）"}</p>
          </CardContent>
        </Card>
      )}

      {/* Citations */}
      {queried && (
        <Card>
          <CardHeader>
            <CardTitle>Citations</CardTitle>
            <CardDescription>
              {citations.length === 0
                ? "目前查詢無相關引用，請確認文件已完成 RAG 索引。"
                : `${citations.length} 筆引用來源`}
            </CardDescription>
          </CardHeader>
          {citations.length > 0 && (
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {citations.map((citation, index) => (
                  <AccordionItem
                    key={`${citation.doc_id ?? "doc"}-${index}`}
                    value={`citation-${index}`}
                  >
                    <AccordionTrigger className="text-sm font-medium">
                      <span className="flex items-center gap-2">
                        {citation.filename ?? citation.doc_id ?? "未命名文件"}
                        {citation.provider && (
                          <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                            {citation.provider}
                          </span>
                        )}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-xs text-muted-foreground">{citation.text ?? "（無節錄）"}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
````

## File: modules/notebooklm/subdomains/conversation/domain/index.ts
````typescript
/**
 * notebooklm/conversation domain — public exports.
 */
export type { Thread } from "./entities/thread";
export type { Message } from "./entities/message";
export type { IThreadRepository } from "./repositories/IThreadRepository";
export * from "./ports";
````

## File: modules/notebooklm/subdomains/conversation/domain/ports/index.ts
````typescript
/**
 * notebooklm/conversation domain/ports — driven port interfaces for the conversation subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { IThreadRepository as IThreadPort } from "../repositories/IThreadRepository";
````

## File: modules/notebooklm/subdomains/notebook/domain/index.ts
````typescript
/**
 * notebooklm/notebook domain — public exports.
 */
export type { NotebookRepository } from "./repositories/NotebookRepository";
export * from "./ports";
````

## File: modules/notebooklm/subdomains/notebook/domain/ports/index.ts
````typescript
/**
 * notebooklm/notebook domain/ports — driven port interfaces for the notebook subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { NotebookRepository as INotebookPort } from "../repositories/NotebookRepository";
````

## File: modules/notebooklm/subdomains/source/application/queries/source-file.queries.ts
````typescript
/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: ListSourceFilesUseCase — lists workspace files as view-model DTOs.
 */

import type { ListSourceFilesScope } from "../../domain/repositories/ISourceFileRepository";
import type { ISourceFileRepository } from "../../domain/repositories/ISourceFileRepository";
import type { WorkspaceFileListItemDto } from "../dto/source-file.dto";

const DEFAULT_FILE_SOURCE = "source-module";
const DEFAULT_FILE_DETAIL = "File metadata mapped from current workspace context.";

export class ListSourceFilesUseCase {
  constructor(private readonly fileRepository: ISourceFileRepository) {}

  async execute(scope: ListSourceFilesScope): Promise<WorkspaceFileListItemDto[]> {
    const workspaceId = scope.workspaceId.trim();
    const organizationId = scope.organizationId.trim();
    const actorAccountId = scope.actorAccountId.trim();

    if (!workspaceId || !organizationId || !actorAccountId) {
      return [];
    }

    const files = await this.fileRepository.listByWorkspace({ workspaceId, organizationId, actorAccountId });

    return files.map((file) => ({
      id: file.id,
      workspaceId: file.workspaceId,
      organizationId: file.organizationId,
      name: file.name,
      status: file.status,
      kind: file.classification,
      source: file.source ?? DEFAULT_FILE_SOURCE,
      detail: file.detail ?? DEFAULT_FILE_DETAIL,
      href: file.href,
    }));
  }
}
````

## File: modules/notebooklm/subdomains/source/domain/index.ts
````typescript
/**
 * notebooklm/source domain — public exports.
 */
export type { IRagDocumentRepository } from "./repositories/IRagDocumentRepository";
export type { ISourceFileRepository } from "./repositories/ISourceFileRepository";
export type { IWikiLibraryRepository } from "./repositories/IWikiLibraryRepository";
export * from "./ports";
````

## File: modules/notebooklm/subdomains/source/domain/ports/index.ts
````typescript
/**
 * notebooklm/source domain/ports — driven port interfaces for the source subdomain.
 *
 * ISourceDocumentCommandPort and IParsedDocumentPort are the primary driven ports.
 * IRagDocumentPort, ISourceFilePort, IWikiLibraryPort re-export the legacy
 * repository contracts, making the Ports layer explicitly visible.
 */
export type { ISourceDocumentCommandPort } from "./ISourceDocumentPort";
export type { IParsedDocumentPort } from "./IParsedDocumentPort";
export type { IRagDocumentRepository as IRagDocumentPort } from "../repositories/IRagDocumentRepository";
export type { ISourceFileRepository as ISourceFilePort } from "../repositories/ISourceFileRepository";
export type { IWikiLibraryRepository as IWikiLibraryPort } from "../repositories/IWikiLibraryRepository";
````

## File: modules/notebooklm/subdomains/source/interfaces/queries/source-file.queries.ts
````typescript
import type { WorkspaceEntity } from "@/modules/workspace/api";

import type { WorkspaceFileListItemDto } from "../../application/dto/source-file.dto";
import { resolveSourceOrganizationId } from "../../application/dto/source.dto";
import type { RagDocumentRecord } from "../../application/dto/source.dto";
import { makeRagDocumentAdapter, makeSourceFileAdapter } from "../../api/factories";
import { ListSourceFilesUseCase } from "../../application/queries/source-file.queries";

export async function getWorkspaceFiles(
  workspace: WorkspaceEntity,
): Promise<WorkspaceFileListItemDto[]> {
  const useCase = new ListSourceFilesUseCase(makeSourceFileAdapter());
  const organizationId = resolveSourceOrganizationId(workspace.accountType, workspace.accountId);
  return useCase.execute({ workspaceId: workspace.id, organizationId, actorAccountId: workspace.accountId });
}

export async function getWorkspaceRagDocuments(
  workspace: WorkspaceEntity,
): Promise<readonly RagDocumentRecord[]> {
  const organizationId = resolveSourceOrganizationId(workspace.accountType, workspace.accountId);
  return makeRagDocumentAdapter().findByWorkspace({
    organizationId,
    workspaceId: workspace.id,
  });
}
````

## File: modules/notebooklm/subdomains/subdomains.instructions.md
````markdown
---
description: 'NotebookLM subdomains structural rules: hexagonal shape per subdomain, RAG pipeline ownership, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/notebooklm/subdomains/**/*.{ts,tsx}'
---

# NotebookLM Subdomains Layer (Local)

Use this file as execution guardrails for `modules/notebooklm/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notebooklm/subdomains.md`.

## Core Rules

- Every subdomain must maintain the full hexagonal shape: `api/`, `domain/`, `application/`, `infrastructure/`, `interfaces/`, `README.md`.
- Stub subdomains must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within notebooklm goes through the **subdomain's own `api/`** — never import a sibling's internals directly.
- RAG pipeline ownership is fixed: `source` → ingestion boundary; `ai` → generation and scoring; `grounding` → citation alignment; `retrieval` → recall and ranking; `synthesis` → summarisation output.
- Domain events use the discriminant format `notebooklm.<subdomain>.<action>` (e.g. `notebooklm.source.document-registered`).
- `source` subdomain may read `notion` knowledge artifacts via ACL adapter — never import notion domain types directly.
- Dependency direction inside each subdomain: `interfaces → application → domain ← infrastructure`.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill rag-architecture
````

## File: modules/notebooklm/subdomains/ai/api/index.ts
````typescript
/**
 * Public API boundary for the ai subdomain.
 * Cross-module consumers must import through this entry point.
 */

// --- Domain types (grounding) ------------------------------------------------

export type { RagRetrievedChunk, RagCitation, RagRetrievalSummary } from "../domain/entities/retrieval.entities";
export type { IVectorStore, VectorDocument, VectorSearchResult } from "../domain/ports/IVectorStore";
export type { IRagRetrievalRepository, RetrieveChunksInput } from "../domain/repositories/IRagRetrievalRepository";
export type {
  IKnowledgeContentRepository,
  KnowledgeCitation,
  KnowledgeParsedDocument,
  KnowledgeRagQueryResult,
  KnowledgeReindexInput,
} from "../domain/repositories/IKnowledgeContentRepository";

// --- Domain types (qa) -------------------------------------------------------

export type { AnswerRagQueryInput, AnswerRagQueryOutput, AnswerRagQueryResult, RagStreamEvent } from "../domain/entities/rag-query.entities";
export type { RagQueryFeedback, RagFeedbackRating, SubmitRagQueryFeedbackInput } from "../domain/entities/rag-feedback.entities";
export type { IRagQueryFeedbackRepository } from "../domain/repositories/IRagQueryFeedbackRepository";

// --- Domain types (synthesis) ------------------------------------------------

export type {
  GenerateRagAnswerInput,
  GenerateRagAnswerOutput,
  GenerateRagAnswerResult,
  GenerationCitation,
} from "../domain/entities/generation.entities";
export type { IRagGenerationRepository } from "../domain/repositories/IRagGenerationRepository";

// --- Use-case classes (for DI composition) -----------------------------------

export { AnswerRagQueryUseCase } from "../application/use-cases/answer-rag-query.use-case";
export { SubmitRagQueryFeedbackUseCase } from "../application/use-cases/submit-rag-feedback.use-case";

// --- Wiki convenience wrappers with default repository -----------------------

import { FirebaseKnowledgeContentAdapter } from "../infrastructure/firebase/FirebaseKnowledgeContentAdapter";
import type { KnowledgeParsedDocument, KnowledgeRagQueryResult, KnowledgeReindexInput } from "../domain/repositories/IKnowledgeContentRepository";

let _knowledgeContentRepository: FirebaseKnowledgeContentAdapter | undefined;

function getKnowledgeContentRepository(): FirebaseKnowledgeContentAdapter {
  if (!_knowledgeContentRepository) {
    _knowledgeContentRepository = new FirebaseKnowledgeContentAdapter();
  }
  return _knowledgeContentRepository;
}

export function runKnowledgeRagQuery(
  query: string,
  accountId: string,
  workspaceId: string,
  topK = 4,
  options: { taxonomyFilters?: string[]; maxAgeDays?: number; requireReady?: boolean } = {},
): Promise<KnowledgeRagQueryResult> {
  return getKnowledgeContentRepository().runRagQuery(query, accountId, workspaceId, topK, options);
}

export function reindexKnowledgeDocument(input: KnowledgeReindexInput): Promise<void> {
  return getKnowledgeContentRepository().reindexDocument(input);
}

export function listKnowledgeParsedDocuments(accountId: string, limitCount = 20): Promise<KnowledgeParsedDocument[]> {
  return getKnowledgeContentRepository().listParsedDocuments(accountId, limitCount);
}

// --- Infrastructure adapters (client-safe, for composition roots) ------------

export { FirebaseRagRetrievalAdapter } from "../infrastructure/firebase/FirebaseRagRetrievalAdapter";
export { FirebaseKnowledgeContentAdapter } from "../infrastructure/firebase/FirebaseKnowledgeContentAdapter";
export { FirebaseRagQueryFeedbackAdapter } from "../infrastructure/firebase/FirebaseRagQueryFeedbackAdapter";

// --- UI components -----------------------------------------------------------

export { RagQueryView } from "../interfaces/components/RagQueryView";
````

## File: modules/notebooklm/subdomains/ai/domain/index.ts
````typescript
export * from "./entities/generation.entities";
export * from "./entities/rag-feedback.entities";
export * from "./entities/rag-query.entities";
export * from "./entities/retrieval.entities";
export * from "./events";
export * from "./ports/IVectorStore";
export * from "./repositories/IRagGenerationRepository";
export * from "./repositories/IRagQueryFeedbackRepository";
export * from "./repositories/IRagRetrievalRepository";
export * from "./repositories/IKnowledgeContentRepository";
export * from "./services";
export * from "./value-objects";
// Ports layer — driven port aliases
export type { IRagGenerationPort, IRagQueryFeedbackPort, IRagRetrievalPort, IKnowledgeContentPort } from "./ports";
````

## File: modules/notebooklm/subdomains/ai/domain/ports/index.ts
````typescript
/**
 * notebooklm/ai domain/ports — driven port interfaces for the ai subdomain.
 *
 * These re-export the repository contracts from domain/repositories/ and
 * the existing IVectorStore port from domain/ports/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { IRagGenerationRepository as IRagGenerationPort } from "../repositories/IRagGenerationRepository";
export type { IRagQueryFeedbackRepository as IRagQueryFeedbackPort } from "../repositories/IRagQueryFeedbackRepository";
export type { IRagRetrievalRepository as IRagRetrievalPort } from "../repositories/IRagRetrievalRepository";
export type { IWikiContentRepository as IKnowledgeContentPort } from "../repositories/IKnowledgeContentRepository";
export type { IVectorStore } from "./IVectorStore";
````