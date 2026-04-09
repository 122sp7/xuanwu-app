# Files

## File: .github/agents/ai-genkit-lead.agent.md
````markdown
---
name: AI Genkit Lead
description: Lead Genkit-oriented AI orchestration with boundary-safe runtime split across Next.js and py_fn pipelines.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Refine Genkit Flow
    agent: Genkit Flow Agent
    prompt: Refine the Genkit flow contract, tool orchestration boundaries, and fallback behavior for this scope.
  - label: Review RAG Boundary
    agent: RAG Lead
    prompt: Review the retrieval and worker-runtime contract impact for this AI scope.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this AI and Genkit change for regression risk, boundary safety, and validation gaps.

---

# AI Genkit Lead

## Target Scope

- `modules/agent/**`
- `app/**`
- `py_fn/**` when coordinating runtime boundaries and worker handoff contracts

## Focus

- Genkit flow ownership and app-side orchestration
- Contract-safe integration with ingestion and retrieval layers

## Guardrails

- Keep auth and chat orchestration in Next.js.
- Keep parsing, chunking, embedding in py_fn workers.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/app-router.agent.md
````markdown
---
name: App Router Agent
description: Diagnose and implement Next.js App Router behavior using runtime evidence and boundary-safe edits.
argument-hint: Provide route segment, expected behavior, and failing symptoms.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo', 'io.github.vercel/next-devtools-mcp/*']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Refine Parallel Routes
    agent: Parallel Routes Agent
    prompt: Refine the parallel-route composition, slot isolation, and one-way data flow for this route scope.
  - label: Write Server Action
    agent: Server Action Writer
    prompt: Implement or review the server action orchestration and validation boundary used by this route.
  - label: Verify End-to-End
    agent: E2E QA Agent
    prompt: Verify the affected route in a browser and collect runtime evidence for this change.

---

# App Router Agent

## Target Scope

- `app/**`
- `modules/**/interfaces/**`
- `providers/**`

## Workflow

1. Identify the target segment and rendering/data path.
2. Use Next runtime evidence when symptoms are ambiguous.
3. Apply least-change fixes in route composition or local route UI.
4. Validate only the affected route behavior and related module API usage.

## Guardrails

- Keep business logic in modules.
- Use runtime evidence when route behavior is unclear.
- Keep route slices composition-focused.

## Output

- Route scope and failure mode
- Changes applied
- Evidence checked
- Residual route risk

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/chunk-strategist.agent.md
````markdown
---
name: Chunk Strategist
description: Design chunking strategies for retrieval quality, context efficiency, and stable document traceability.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Align Ingestion Inputs
    agent: Doc Ingest Agent
    prompt: Align document normalization and source attribution with the chunking strategy described above.
  - label: Configure Embeddings
    agent: Embedding Writer
    prompt: Implement or review embedding payloads and metadata that match this chunking strategy.
  - label: Review RAG Contract
    agent: RAG Lead
    prompt: Review this chunking strategy against retrieval quality, runtime boundaries, and indexing contracts.

---

# Chunk Strategist

## Target Scope

- `py_fn/**`
- `modules/retrieval/**`
- `modules/knowledge/**`

## Focus

- Chunk size and overlap policy
- Metadata fields for retrieval and attribution
- Domain-specific segmentation rules

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/doc-ingest.agent.md
````markdown
---
name: Doc Ingest Agent
description: Implement document ingestion flows from source conversion to normalized artifacts for downstream chunking and indexing.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo', 'microsoft/markitdown/*']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Design Chunk Strategy
    agent: Chunk Strategist
    prompt: Design the chunking policy and metadata boundaries for the normalized artifacts described above.
  - label: Write Embeddings
    agent: Embedding Writer
    prompt: Implement or review embedding generation and metadata writes for this ingestion output.
  - label: Review RAG Flow
    agent: RAG Lead
    prompt: Review this ingestion change for retrieval quality, runtime boundaries, and contract alignment.

---

# Doc Ingest Agent

## Target Scope

- `py_fn/**`
- `modules/retrieval/**`
- `modules/knowledge/**`

## Rules

- Keep conversion and normalization deterministic.
- Preserve source attribution fields.
- Align outputs with chunk and embedding contracts.
- Flag notable format-loss risk when source conversion may affect downstream retrieval.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/domain-architect.agent.md
````markdown
---
name: Domain Architect
description: IDDD 領域架構審查 Agent，專注確保聚合根、限界上下文、通用語言與事件驅動設計符合 Vaughn Vernon《Implementing Domain-Driven Design》規範。
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: 審查模組邊界
    agent: MDDD Architect
    prompt: 審查或重構此領域決策涉及的模組邊界、層依賴方向與公開 API 形狀。
  - label: 更新通用語言術語
    agent: KB Architect
    prompt: 將本次領域建模新增或變更的術語同步更新至 terminology-glossary.md 與知識庫文件。
  - label: 品質審查
    agent: Quality Lead
    prompt: 審查此領域變更的行為風險、邊界回歸與遺漏驗證，確認符合 IDDD 規範。

---

# Domain Architect

## 目標範圍 (Target Scope)

- `modules/**/domain/**`
- `modules/**/application/use-cases/**`
- `modules/**/application/machines/**`
- `terminology-glossary.md`
- `.github/instructions/ubiquitous-language.instructions.md`
- `.github/instructions/bounded-context-rules.instructions.md`
- `.github/instructions/domain-modeling.instructions.md`
- `.github/instructions/event-driven-state.instructions.md`

## 使命 (Mission)

確保所有領域模型設計符合《Implementing Domain-Driven Design》(Vaughn Vernon) 的戰略（Strategic）與戰術（Tactical）設計原則，維護聚合完整性、通用語言一致性與事件驅動架構品質。

## IDDD 審查清單

### 通用語言 (Ubiquitous Language)

- [ ] 新命名是否已查閱 `terminology-glossary.md`？
- [ ] 是否有違反通用語言的同義詞替換？
- [ ] 領域事件命名是否使用過去式？
- [ ] 類別、方法名稱是否反映領域概念而非技術概念？

### 限界上下文 (Bounded Context)

- [ ] 程式碼是否屬於正確的限界上下文（模組）？
- [ ] 是否有直接存取其他模組的 `domain/`、`application/` 或 `infrastructure/` 內部？
- [ ] 跨模組整合是否透過 `api/` 合約或領域事件進行？
- [ ] 外部系統整合是否透過防腐層（Anti-Corruption Layer）隔離？

### 聚合設計 (Aggregate Design)

- [ ] 聚合根是否保護所有業務不變數？
- [ ] 狀態修改是否透過封裝的命令方法進行？
- [ ] 是否存在貧血領域模型（只有 Getter/Setter，無業務邏輯）？
- [ ] 聚合邊界是否合理（不過大、不過小）？
- [ ] `pullDomainEvents()` 是否正確清空事件陣列？

### 值對象 (Value Object)

- [ ] 是否使用 Zod 品牌型別確保型別安全？
- [ ] 值對象是否不可變（Immutable）？
- [ ] 識別碼是否使用品牌型別保護？

### 領域事件 (Domain Event)

- [ ] 每次狀態變更是否產生對應的領域事件？
- [ ] `occurredAt` 是否使用 ISO string（與 `shared/domain/events.ts` 一致）？
- [ ] 事件 Payload 是否以 Zod Schema 嚴格定義？
- [ ] 事件 `type` discriminant 是否為 `<module>.<action>` 格式？
- [ ] 事件是否在聚合持久化成功後才發布？

## 輸出格式

1. **IDDD 合規性評估**：通過 / 需修正
2. **問題項目清單**：每項附檔案路徑與具體說明
3. **修正建議**：附程式碼範例
4. **驗證指令執行結果**：`npm run lint` 與 `npm run build` 結果

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/agents/domain-lead.agent.md
````markdown
---
name: Domain Lead
description: Lead domain ownership decisions and enforce module boundaries, dependency direction, and API-only collaboration.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Refactor Module Boundary
    agent: MDDD Architect
    prompt: Refactor or review module boundaries, layer direction, and public API shape for this domain decision.
  - label: Update Contracts
    agent: TS Interface Writer
    prompt: Update the DTO, interface, or API contract surface that follows from this domain decision.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this domain change for behavioral risk, boundary regressions, and missing validation.

---

# Domain Lead

## Target Scope

- `modules/**`
- `packages/shared-types/**`
- `packages/api-contracts/**`

## Responsibilities

- Confirm owning bounded context before edits.
- Place logic in the correct layer.
- Prevent internal cross-module imports.

## Layer Placement Guide

- `domain`: business rules, entities, value objects, repository interfaces
- `application`: use cases and DTO orchestration
- `infrastructure`: external adapters and implementations
- `interfaces`: UI, hooks, queries, contracts, server actions
- `api`: only public cross-module boundary

## Validation

- Run lint for boundary and import changes.
- Run build when public types or exports are touched.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/e2e-qa.agent.md
````markdown
---
name: E2E QA Agent
description: Execute browser-level verification with Playwright MCP and report reproducible release-readiness evidence.
tools: ['serena/*', 'context7/*', 'read', 'search', 'todo', 'microsoft/playwright-mcp/*']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Summarize Quality Risk
    agent: Quality Lead
    prompt: Summarize the confirmed failures, residual risks, and release recommendation from this browser verification.
  - label: Expand Test Coverage
    agent: Test Scenario Writer
    prompt: Turn the executed browser paths and gaps into explicit scenario coverage recommendations.
  - label: Capture Support Follow-up
    agent: Support Architect
    prompt: Convert the confirmed failures and evidence into bounded support and follow-up actions.

---

# E2E QA Agent

## Target Scope

- `app/**`
- `modules/**/interfaces/**`
- `debug/**`

## Workflow

1. Build scenarios from acceptance criteria and user paths.
2. Execute browser interactions and capture runtime evidence.
3. Separate confirmed failures from improvement suggestions.

## Rules

- Capture clear reproduction steps.
- Separate confirmed failures from improvement ideas.
- Report console and network evidence when relevant.

## Output

- Scenarios executed
- Evidence collected
- Confirmed failures
- Release recommendation: ready | ready-with-risk | blocked

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/embedding-writer.agent.md
````markdown
---
name: Embedding Writer
description: Implement embedding generation and vector-write workflows with deterministic metadata and quality checks.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Review Chunk Inputs
    agent: Chunk Strategist
    prompt: Review the upstream chunking policy and metadata assumptions for this embedding workflow.
  - label: Refine Flow Integration
    agent: Genkit Flow Agent
    prompt: Refine the orchestration contract that consumes or coordinates this embedding workflow.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this embedding change for deterministic metadata, compatibility, and regression risk.

---

# Embedding Writer

## Target Scope

- `py_fn/**`
- `modules/retrieval/**`
- `modules/knowledge/**`

## Responsibilities

- Define embedding payload shape.
- Ensure consistent vector metadata.
- Validate write path and retrieval compatibility.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/firestore-schema.agent.md
````markdown
---
name: Firestore Schema Agent
description: Design Firestore document models, indexes, and access patterns aligned with module ownership and query workloads.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Plan Migration
    agent: Schema Migration Agent
    prompt: Plan the compatibility window, rollout path, and rollback strategy for this schema change.
  - label: Review Security Rules
    agent: Security Rules Agent
    prompt: Review the security-rule implications of this Firestore schema and access-pattern change.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this schema change for compatibility risk, query correctness, and missing validation.

---

# Firestore Schema Agent

## Target Scope

- `modules/**/infrastructure/**`
- `firestore.indexes.json`
- `firestore.rules`

## Responsibilities

- Model collections and documents for bounded contexts.
- Keep schema and index plans aligned with read and write paths.
- Track migration impact and backward compatibility.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/frontend-lead.agent.md
````markdown
---
name: Frontend Lead
description: Lead app route composition and component architecture while keeping business logic in modules and APIs.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute', 'shadcn/*']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Diagnose Route Behavior
    agent: App Router Agent
    prompt: Diagnose the App Router composition, rendering behavior, and runtime boundary impact for this frontend scope.
  - label: Compose UI Primitives
    agent: Shadcn Composer
    prompt: Compose or refactor the UI primitives and interaction states needed for this route-level frontend change.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this frontend change for UX regressions, ownership boundaries, and missing validation.

---

# Frontend Lead

## Target Scope

- `app/**`
- `modules/**/interfaces/**`
- `packages/ui-*/**`

## Mission

Deliver route-level UI slices with clear ownership and predictable data flow.

## Guardrails

- Keep app routes thin and composition-focused.
- Consume module behavior via module api only.
- Prefer server components unless client interactivity is required.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/genkit-flow.agent.md
````markdown
---
name: Genkit Flow Agent
description: Design and refine Genkit flow definitions, boundaries, and contract-safe integration with retrieval and worker pipelines.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Review AI Ownership
    agent: AI Genkit Lead
    prompt: Review the Genkit orchestration ownership, runtime split, and app-side integration for this flow.
  - label: Review RAG Contract
    agent: RAG Lead
    prompt: Review this Genkit flow against retrieval contracts, worker boundaries, and indexing expectations.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this Genkit flow change for fallback behavior, contract safety, and validation gaps.

---

# Genkit Flow Agent

## Target Scope

- `modules/agent/**`
- `app/**`
- `modules/retrieval/**`

## Focus

- Flow inputs and outputs
- Prompt and tool orchestration boundaries
- Error handling and fallback behavior

## Guardrails

- Keep flow contracts explicit.
- Avoid leaking worker-only logic into app orchestration.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/kb-architect.agent.md
````markdown
---
name: KB Architect
description: Plan and optimize knowledge-base documentation structure, deduplication, and retrieval-friendly formatting.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Refine Prompt Contracts
    agent: Prompt Engineer
    prompt: Refine the prompt contract, reusable workflow wording, and instruction clarity for this knowledge-base change.
  - label: Align Support Playbooks
    agent: Support Architect
    prompt: Align the support workflow, escalation notes, and operational follow-up with this knowledge-base update.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this knowledge-base change for clarity, consistency, and residual ambiguity.

---

# KB Architect

## Target Scope

- `docs/**`
- `.github/prompts/**`
- `.github/instructions/**`

## Focus

- Information hierarchy for docs and references
- Cross-document deduplication
- Stable glossary and index links

## Execution Pattern

- Process docs in leaf-to-root order when restructuring large doc trees.
- Prefer lint/compress/dedup/structure updates before index regeneration.
- Keep token usage efficient without changing technical meaning.

## Guardrails

- Do not change technical meaning while restructuring docs.
- Keep docs aligned with current module boundaries and contracts.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/knowledge-base.md
````markdown
# Knowledge Base — MDDD Domain & Architecture

This file contains domain knowledge about the xuanwu-app architecture and codebase. For coding rules, see [`../instructions/README.md`](../instructions/README.md).

## Module-Driven Domain Design (MDDD)

The project follows **Module-Driven Domain Design**: each business capability is a self-contained module under `modules/`. The architecture is **module-driven, not layer-driven** — code is grouped by domain context first, then by technical layer within each module.

### Core Principle

> Every module owns a bounded context. Modules communicate through `modules/<target-module>/api/` only, never by reaching into each other's internals.

### Global Dependency Direction

```
UI (interfaces/) → Application (application/) → Domain (domain/) ← Infrastructure (infrastructure/)
```

The domain layer has **zero outward dependencies**. Infrastructure implements domain-defined interfaces.

## Module Structure

Each module under `modules/` follows a four-layer Clean Architecture:

```
modules/<module-name>/
├── api/
│   └── index.ts                # Public cross-module API boundary (the ONLY import point for other modules)
├── index.ts                    # Optional local barrel for same-module composition
├── README.md                   # Module documentation (optional)
├── domain/
│   ├── entities/               # Aggregate roots, value objects, entity types
│   ├── repositories/           # Repository interfaces (contracts, NOT implementations)
│   ├── services/               # Pure domain services (stateless business rules)
│   ├── value-objects/          # DDD value objects (immutable, equality by value)
│   └── ports/                  # Hexagonal ports for cross-cutting dependencies (optional)
├── application/
│   ├── use-cases/              # One file per use case (single operation)
│   └── dto/                    # Data Transfer Objects for use-case I/O
├── infrastructure/
│   ├── firebase/               # Firebase Firestore repository implementations
│   ├── genkit/                 # AI/Genkit integrations (AI module)
│   ├── default/                # In-memory or simplified implementations
│   ├── memory/                 # In-memory stores (e.g., billing placeholder)
│   ├── persistence/            # Persistence adapters
│   └── repositories/           # Repository implementations (alternative layout)
└── interfaces/
    ├── components/             # React UI components
    ├── queries/                # TanStack Query hooks (read-side)
    ├── _actions/               # Next.js Server Actions (write-side)
    ├── hooks/                  # Custom React hooks
    ├── api/                    # REST API route controllers
    ├── contracts/              # API contracts
    └── view-models/            # View model transformations
```

Not every module has every subdirectory — only what it needs.

### Boundary Policy

- Every `modules/<module-name>/` is isolated.
- Cross-module imports are allowed only via `modules/<target-module>/api/`.
- Keep guidance generic by default: do not prescribe a fixed domain-to-module mapping unless a governing contract explicitly requires it.
- Keep boundaries explicit: business logic stays in `domain/` + `application/`; UI and UX concerns stay in `interfaces/` and `app/` composition.

## Module Inventory

Current module directories under `modules/` represent bounded contexts. Treat names as implementation-specific and avoid using this list as a hard-coded ownership policy for future design:

`account`, `ai`, `identity`, `knowledge`, `knowledge-base`, `knowledge-collaboration`, `knowledge-database`, `notebook`, `notification`, `organization`, `search`, `shared`, `source`, `workspace`, `workspace-audit`, `workspace-feed`, `workspace-flow`, `workspace-scheduling`.

> **Removed modules:** `wiki` (decomposed into `knowledge-base`, `knowledge-collaboration`, `knowledge-database`), `namespace` (slug utilities migrated to `shared`), `event` (event-store primitives migrated to `shared`). The following names in older docs are stale and no longer exist: `agent`, `asset`, `content`, `knowledge-graph`, `retrieval`, `audit`, `file`, `graph`, `storage`.

## Package System (21 Packages)

Packages under `packages/` are **stable public boundaries** — the single source of truth for shared concerns. They contain actual implementations (no re-export chains).

### Import Rule

```typescript
// ✅ CORRECT — via @alias from tsconfig.json
import type { CommandResult, DomainError } from "@shared-types";
import { cn, formatDate } from "@shared-utils";
import { auth } from "@integration-firebase";

// ❌ NEVER — relative paths to package internals
import type { CommandResult } from "../../../../packages/shared-types/index";

// ❌ NEVER — legacy paths (ESLint will block)
import type { CommandResult } from "@/shared/types";
```

### Package Catalog

| Alias | Package | Purpose |
|-------|---------|---------|
| `@shared-types` | shared-types | `CommandResult`, `DomainError`, `Timestamp`, primitive types |
| `@shared-utils` | shared-utils | `cn()`, `formatDate()`, `generateId()` |
| `@shared-validators` | shared-validators | Zod schemas for cross-cutting validation |
| `@shared-constants` | shared-constants | `APP_NAME`, `PAGINATION_DEFAULTS` |
| `@shared-hooks` | shared-hooks | `useAppStore` (Zustand global state) |
| `@integration-firebase` | integration-firebase | Firebase client (auth, firestore, storage, messaging, functions, database, analytics, appcheck, performance, remote-config) |
| `@integration-http` | integration-http | Axios HTTP client with interceptors |
| `@api-contracts` | api-contracts | REST route registry + GraphQL schema |
| `@ui-shadcn` | ui-shadcn | shadcn/ui components, `cn()` utility, hooks |
| `@ui-vis` | ui-vis | Vis.js React components (VisNetwork, VisTimeline) |
| `@lib-date-fns` | lib-date-fns | date-fns v4 wrapper |
| `@lib-zod` | lib-zod | Zod v4 wrapper |
| `@lib-uuid` | lib-uuid | UUID v13 wrapper |
| `@lib-zustand` | lib-zustand | Zustand v5 wrapper |
| `@lib-xstate` | lib-xstate | XState v5 + React hooks |
| `@lib-tanstack` | lib-tanstack | TanStack Query/Form/Table/Virtual |
| `@lib-superjson` | lib-superjson | SuperJSON for serialization |
| `@lib-dragdrop` | lib-dragdrop | Atlaskit Pragmatic Drag and Drop |
| `@lib-react-markdown` | lib-react-markdown | react-markdown wrapper |
| `@lib-remark-gfm` | lib-remark-gfm | remark-gfm for GitHub-flavored markdown |

### ESLint Boundary Enforcement

Legacy import paths are blocked by `eslint.config.mjs`:

| Blocked Pattern | Replacement |
|----------------|-------------|
| `@/shared/*` | `@shared-types`, `@shared-utils`, `@shared-validators`, `@shared-constants`, `@shared-hooks` |
| `@/infrastructure/*` | `@integration-firebase`, `@integration-http` |
| `@/libs/*` | `@lib-*` or `@integration-*` |
| `@/ui/shadcn/*` | `@ui-shadcn/*` |
| `@/ui/vis*` | `@ui-vis` |
| `@/interfaces/*` | `@api-contracts` |

`modules/` 內也有額外邊界保護：

- `eslint-plugin-boundaries` 會檢查 `domain -> application / infrastructure / interfaces`、`application -> infrastructure / interfaces`、`infrastructure -> interfaces` 等違規依賴方向。
- `modules/*` 之間不可直接 import 對方的 `application/`、`domain/`、`infrastructure/`、`interfaces/`，必須走模組公開邊界（`@/modules/<module>` 或 `api/`）。
- 顯式 `index` 匯入（`../index`、`../index.ts`）在 `modules/` 內被封鎖，避免隱形跨層。

### 已知邊界警告（待修復）

以下為 `npm run lint` 中存在的既有 warning，尚未修復（0 errors，92 warnings 基準）：

目前沒有 `no-restricted-imports` 或 `boundaries/dependencies` 邊界違規。所有模組間的互動皆透過 `/api` 公開邊界。

> **已修復（2026-03）：** `modules/knowledge/api/index.ts` 原本直接 reach into 已移除的圖譜內部實作，現已改為遵守當前公開邊界與現行 module topology。

> **已修復（2026-03）：** `modules/knowledge/application/use-cases/wiki-pages.use-case.ts` 與 `modules/source/application/use-cases/wiki-libraries.use-case.ts` 的歷史 `wiki_beta.*` 命名已改為符合目前知識／來源 ownership 的事件與 aggregate 命名。

## Tech Stack

| Concern | Technology | Version |
|---------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.7 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | 5 |
| Backend | Firebase (client SDK) | 12 |
| Styling | Tailwind CSS | 4 |
| Validation | Zod | 4.3.6 |
| State (global) | Zustand | 5.0.12 |
| State (machines) | XState + @xstate/react | 5.28.0 / 6.1.0 |
| AI | Genkit + Google GenAI | 1.30.1 |
| Data Fetching | TanStack (Query, Table, Form, Virtual) | 5/8/1/3 |
| Visualization | Vis (network, timeline, graph3d, vis-data) | Various |
| Date Handling | date-fns | 4 |
| HTTP Client | Axios | 1.13.6 |
| Drag & Drop | @atlaskit/pragmatic-drag-and-drop | Latest |
| Node Engine | Node.js | 24 |

## Key Architectural Patterns

### Repository Pattern

- **Interface** lives in `domain/repositories/` — defines what the module needs
- **Implementation** lives in `infrastructure/` — how to fetch/persist (Firebase, memory, etc.)
- Domain layer never imports infrastructure

### Use Case Pattern

- Each use case is a single file under `application/use-cases/`
- Naming: `verb-noun.use-case.ts` (e.g., `list-workspace-files.use-case.ts`)
- One use case = one user-facing operation

### Hexagonal Ports (Advanced)

Example port shapes:
- `domain/ports/ActorContextPort.ts` — resolves who is acting
- `domain/ports/WorkspaceGrantPort.ts` — checks workspace permissions
- `domain/ports/OrganizationPolicyPort.ts` — checks tenant policies
- All access decisions flow through ports, not scattered in UI/router

### Domain Events

Event-store primitives live in `modules/shared` (migrated from the deleted `modules/event`):
- `EventRecord` — rich event-store entity (id, eventName, aggregateType, aggregateId, occurredAt, payload, metadata)
- `PublishDomainEventUseCase` — publishes events to the event store (`modules/shared/api`)
- `IEventStoreRepository` / `IEventBusRepository` — event-store repository interfaces
- `InMemoryEventStoreRepository` / `NoopEventBusRepository` — default implementations

Domain events within a module follow the discriminated-union pattern: `type: "module.event_name"` with top-level fields (no `payload` wrapper) and `occurredAtISO: string`.

### Internal Imports Within a Module

Inside a module, files use **relative imports** (not the module's own barrel export):

```typescript
// ✅ Inside modules/knowledge/application/use-cases/knowledge-page.use-cases.ts
import { KnowledgePage } from "../../domain/entities/KnowledgePage";
import type { IKnowledgePageRepository } from "../../domain/repositories/KnowledgePageRepository";

// ❌ Do NOT self-import via the barrel
import { KnowledgePage } from "@/modules/knowledge";
```

### Cross-Module Imports

Between modules, always use the target module's `api/` boundary:

```typescript
// ✅ Cross-module import — event-store primitives are now in modules/shared
import { PublishDomainEventUseCase } from "@/modules/shared/api";

// ❌ Reaching into another module's internals
import { PublishDomainEventUseCase } from "@/modules/shared/application/publish-domain-event";
```

## Responsibility Boundaries

- Define ownership per feature or contract, not by hard-coded domain naming assumptions.
- If a capability spans modules, formalize the boundary in `api/` and keep each module's internals private.
- When ownership shifts, update contracts and architecture docs in the same change.
````

## File: .github/agents/lint-rule-enforcer.agent.md
````markdown
---
name: Lint Rule Enforcer
description: Enforce lint and boundary rules, identify violation causes, and propose minimal fixes without broad refactors.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Check Domain Boundary
    agent: Domain Lead
    prompt: Confirm whether this lint or boundary issue indicates a domain ownership or layer-placement problem.
  - label: Review Frontend Impact
    agent: Frontend Lead
    prompt: Review the frontend or route-composition impact of the lint and boundary issues identified above.
  - label: Summarize Quality Risk
    agent: Quality Lead
    prompt: Summarize the confirmed issues, fix status, and residual release risk after lint enforcement.

---

# Lint Rule Enforcer

## Target Scope

- `app/**`
- `modules/**`
- `packages/**`
- `providers/**`
- `py_fn/**`

## Mission

Keep rule compliance high while minimizing churn.

## Guardrails

- Fix root causes, not symptoms.
- Preserve existing architecture boundaries.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/mddd-architect.agent.md
````markdown
---
name: MDDD Architect
description: Design and refactor modules with strict MDDD ownership, layer direction, and API-only cross-module boundaries.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Confirm Domain Ownership
    agent: Domain Lead
    prompt: Confirm the owning bounded context and the required public API boundary for this module refactor.
  - label: Update Contracts
    agent: TS Interface Writer
    prompt: Update or review the public DTO and contract surface affected by this module refactor.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this module refactor for boundary regressions, compatibility risk, and missing validation.

---

# MDDD Architect

## Target Scope

- `modules/**`
- `packages/shared-types/**`
- `packages/api-contracts/**`

## Mission

Shape module structures without breaking bounded contexts.

## Rules

- Keep dependency direction: interfaces -> application -> domain <- infrastructure.
- Cross-module access must go through modules target api only.
- Keep domain framework-free.
- Run lint and build when boundaries or exports move.

## Module Lifecycle Operations

- Support create/refactor/split/merge/delete with explicit ownership mapping.
- Preserve public API compatibility or document migration steps in the same change.
- Replace internal cross-module imports with API contracts or event-driven collaboration.

## Output

- Ownership decision
- Boundary impact
- Files changed
- Validation evidence

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/prompt-engineer.agent.md
````markdown
---
name: Prompt Engineer
description: Create and refine high-signal prompts, templates, and prompt contracts for repeatable delivery workflows.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Organize Knowledge Base
    agent: KB Architect
    prompt: Organize the surrounding knowledge-base structure, deduplication, and glossary alignment for this prompt work.
  - label: Refine Tool Strategy
    agent: Tool Caller
    prompt: Refine the tool sequencing, least-privilege access, and evidence flow expected by this prompt.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this prompt or workflow contract for ambiguity, missing constraints, and validation gaps.

---

# Prompt Engineer

## Target Scope

- `.github/prompts/**`
- `.github/instructions/**`
- `.github/agents/**`

## Focus

- Reusable prompt skeletons
- Clear input and output contracts
- Low-noise, high-precision instruction design

## Guardrails

- Keep prompts task-focused and testable.
- Avoid broad ambiguous directives.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/quality-lead.agent.md
````markdown
---
name: Quality Lead
description: Drive risk-first review and QA evidence, including regression detection, coverage gaps, and release recommendation.
tools: ['serena/*', 'context7/*', 'read', 'search', 'execute', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Enforce Lint Rules
    agent: Lint Rule Enforcer
    prompt: Enforce the relevant lint and boundary rules and report the root causes for any remaining violations.
  - label: Verify Browser Flows
    agent: E2E QA Agent
    prompt: Execute the highest-risk browser scenarios and collect runtime evidence for this change.
  - label: Expand Test Scenarios
    agent: Test Scenario Writer
    prompt: Turn the residual risks and gaps into explicit unit, integration, or E2E scenario coverage.

---

# Quality Lead

## Target Scope

- `app/**`
- `modules/**`
- `packages/**`
- `providers/**`
- `py_fn/**`

## Mission

Verify correctness, boundary safety, and release readiness.

## Review Lenses

1. Correctness and behavioral regression risk
2. Ownership and boundary integrity
3. Validation completeness
4. Documentation completeness for changed behavior

## Workflow

1. Build scenario list from requirements and change scope.
2. Execute happy path, boundary, negative, and error scenarios.
3. Report findings by severity before summaries.

## Output

- Findings ordered by severity
- Evidence and reproduction details
- Residual risks and recommendation: ready, ready-with-risk, blocked

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/rag-lead.agent.md
````markdown
---
name: RAG Lead
description: Lead RAG ingest and retrieval contracts, runtime boundaries, and quality gates for chunk and vector pipelines.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo', 'microsoft/markitdown/*']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Normalize Ingestion
    agent: Doc Ingest Agent
    prompt: Normalize the ingestion inputs, attribution fields, and source-conversion flow for this RAG scope.
  - label: Design Chunk Strategy
    agent: Chunk Strategist
    prompt: Design the chunking policy, overlap, and metadata boundaries for this RAG scope.
  - label: Write Embeddings
    agent: Embedding Writer
    prompt: Implement or review the embedding payload, metadata writes, and compatibility guarantees for this RAG scope.

---

# RAG Lead

## Target Scope

- `py_fn/**`
- `modules/retrieval/**`
- `modules/knowledge/**`

## Focus

- Ingestion contract alignment
- Retrieval quality and index consistency
- Runtime split between app orchestration and worker processing

## Guardrails

- Validate contract alignment before changing ingestion shape.
- Keep Next.js orchestration and `py_fn` ingestion responsibilities separated.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/README.md
````markdown
# Xuanwu Agents

This folder contains the active workspace custom agents for VS Code Copilot.

## Active Agent Set

Use these files for role-specific routing only; repository-wide policy belongs in [`../copilot-instructions.md`](../copilot-instructions.md).

- Architecture and boundaries: `domain-architect.agent.md`, `mddd-architect.agent.md`, `domain-lead.agent.md`
- Next.js and UI: `app-router.agent.md`, `server-action-writer.agent.md`, `frontend-lead.agent.md`, `shadcn-composer.agent.md`
- Data / Firebase / security: `firestore-schema.agent.md`, `security-rules.agent.md`, `schema-migration.agent.md`
- AI / RAG: `ai-genkit-lead.agent.md`, `genkit-flow.agent.md`, `rag-lead.agent.md`, `doc-ingest.agent.md`, `chunk-strategist.agent.md`, `embedding-writer.agent.md`
- Quality and docs: `quality-lead.agent.md`, `lint-rule-enforcer.agent.md`, `e2e-qa.agent.md`, `test-scenario-writer.agent.md`, `prompt-engineer.agent.md`, `kb-architect.agent.md`

## Supporting Indexes

- [`commands.md`](./commands.md) — build, lint, test, and deployment commands
- [`knowledge-base.md`](./knowledge-base.md) — module inventory, aliases, and boundary facts

## Maintenance Rules

- Keep agent names unique and role-scoped.
- Keep tools least-privilege and remove stale skill tags when the referenced skills are not installed.
- Keep module-specific guides in `modules/<context>/AGENT.md`, not in `.github/agents/`.
- Update repomix-generated skills after meaningful `.github/*` changes.
````

## File: .github/agents/schema-migration.agent.md
````markdown
---
name: Schema Migration Agent
description: Plan and implement schema evolution with compatibility windows, data backfill steps, and rollback considerations.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Review Firestore Model
    agent: Firestore Schema Agent
    prompt: Review the source and target schema shape, query impact, and index needs for this migration plan.
  - label: Review Security Rules
    agent: Security Rules Agent
    prompt: Review the security-rule impact and access-policy compatibility for this migration plan.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this migration plan for rollout risk, rollback gaps, and validation completeness.

---

# Schema Migration Agent

## Target Scope

- `modules/**/infrastructure/**`
- `firestore.indexes.json`
- `firestore.rules`

## Workflow

1. Define source and target schema.
2. Plan compatibility and cutover phases.
3. Validate reads and writes before and after migration.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/security-rules.agent.md
````markdown
---
name: Security Rules Agent
description: Author and review Firestore and Storage security rules with least-privilege, tenancy isolation, and testable access policies.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Review Firestore Schema
    agent: Firestore Schema Agent
    prompt: Review the data model and access paths that this security-rules change must protect.
  - label: Verify Browser Impact
    agent: E2E QA Agent
    prompt: Verify the product flows affected by this rules change and capture evidence for any access regressions.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this security-rules change for least-privilege coverage, regression risk, and validation gaps.

---

# Security Rules Agent

## Target Scope

- `firestore.rules`
- `storage.rules`
- `modules/**/infrastructure/**`

## Mission

Prevent unauthorized access while preserving required product flows.

## Guardrails

- Enforce organization and workspace isolation.
- Prefer explicit allow conditions with clear actor checks.
- Pair rule changes with validation scenarios.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/server-action-writer.agent.md
````markdown
---
name: Server Action Writer
description: Write Next.js server actions that validate input, delegate to use cases, and return stable command results.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Update Contracts
    agent: TS Interface Writer
    prompt: Update or review the DTO and command-result contracts used by this server action.
  - label: Review Domain Boundary
    agent: Domain Lead
    prompt: Confirm the use-case boundary, layer placement, and API ownership for this server action.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this server action change for validation gaps, orchestration drift, and regression risk.

---

# Server Action Writer

## Target Scope

- `app/**`
- `modules/**/interfaces/**`
- `modules/**/application/**`

## Guardrails

- Keep actions thin and orchestration-only.
- Place business rules in module use cases.
- Preserve consistent command-result response shape.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/shadcn-composer.agent.md
````markdown
---
name: Shadcn Composer
description: Compose and refactor UI components using shadcn patterns while preserving route and module ownership boundaries.
argument-hint: Describe component goal, target route, and required interaction states.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'shadcn/*']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Review Frontend Ownership
    agent: Frontend Lead
    prompt: Review the route ownership, composition boundary, and data-flow assumptions behind this UI work.
  - label: Refine Parallel Routes
    agent: Parallel Routes Agent
    prompt: Refine the slot composition, state isolation, and route-level integration for this UI work.
  - label: Verify End-to-End
    agent: E2E QA Agent
    prompt: Verify the interaction states and browser behavior for this UI change.

---

# Shadcn Composer

## Target Scope

- `app/**`
- `modules/**/interfaces/components/**`
- `packages/ui-shadcn/**`

## Workflow

1. Confirm route ownership and API data shape before composing UI.
2. Reuse existing primitives and tokens first.
3. Validate interaction states and accessibility basics.

## Rules

- Reuse existing component primitives before adding new ones.
- Keep styling and behavior consistent with app composition boundaries.
- Validate interactive states and accessibility basics.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/test-scenario-writer.agent.md
````markdown
---
name: Test Scenario Writer
description: Write risk-based scenario suites for unit, integration, and E2E coverage with clear acceptance criteria.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Review Quality Risk
    agent: Quality Lead
    prompt: Review these scenarios against the highest-risk behaviors, missing coverage, and release concerns.
  - label: Verify Browser Flows
    agent: E2E QA Agent
    prompt: Execute the E2E scenarios from this suite in the browser and collect runtime evidence.
  - label: Check Lint And Rules
    agent: Lint Rule Enforcer
    prompt: Check whether any structural or lint rule changes are needed to support the scenarios described above.

---

# Test Scenario Writer

## Target Scope

- `app/**`
- `modules/**`
- `py_fn/tests/**`

## Scope

- Happy path
- Boundary and negative paths
- Error handling and regression-sensitive paths

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/ts-interface-writer.agent.md
````markdown
---
name: TS Interface Writer
description: Write and refactor TypeScript interfaces, DTOs, and contracts with stable naming and compatibility-aware changes.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Review Domain Ownership
    agent: Domain Lead
    prompt: Confirm the owning bounded context and public API boundary for these contract changes.
  - label: Write Server Action
    agent: Server Action Writer
    prompt: Update the server action orchestration that consumes or returns these contract changes.
  - label: Review Firestore Shape
    agent: Firestore Schema Agent
    prompt: Review the persistence and index implications of these contract changes.

---

# TS Interface Writer

## Target Scope

- `modules/**/api/**`
- `modules/**/application/dto/**`
- `packages/shared-types/**`

## Focus

- Domain and application DTO contracts
- Backward-safe type evolution
- Explicit optional and required field transitions

## Guardrails

- Keep module interface and API contracts explicit and minimal.
- Do not leak private infrastructure/entity internals into public API contracts.
- Coordinate contract changes with consumer updates in the same change.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/workspace-audit.agent.md
````markdown

````

## File: .github/instructions/app/app-router-parallel-routes.instructions.md
````markdown
---
name: 'App Router Parallel Routes'
description: 'Rules for app/ route slices and parallel-route UI blocks that compose module APIs without importing module internals.'
applyTo: 'app/**/*.{ts,tsx}'
---

# App Router Parallel Routes

Use this instruction for work in `app/`.

## Composition Rules

- Treat each route slice or parallel-route block as one feature area: dashboard surface, sidebar tool, modal, or chat console.
- Keep data flow one-way from module API -> route composition -> local UI state.
- Import module behavior through `@/modules/<target>/api` only.
- Keep route files focused on composition, loading states, and rendering.

## Guardrails

- Do not import `domain/`, `application/`, or `infrastructure/` from any module.
- Do not move business rules into `app/`.
- Keep slot-local state isolated; do not hide coupling through shared mutable module state.
- Prefer Server Components by default; add `use client` only where interactivity requires it.

## Validation

- Run the app-level commands from `agents/commands.md` that match the touched files.
- If routing or public API usage changes, update affected docs or prompt/instruction references in the same change.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill app-router-parallel-routes
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
````

## File: .github/instructions/architecture-api-boundary.instructions.md
````markdown
---
description: 'Cross-boundary rules for API-only collaboration between modules and runtimes.'
applyTo: '{app,modules,packages,providers,py_fn}/**/*.{ts,tsx,js,jsx,py}'
---

# Architecture API Boundary

## Core Rule

- Cross-module access must go through `modules/<target>/api` only.
- Do not import another module's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.

## Allowed Patterns

- Import public facades or contracts from `modules/<target>/api`.
- Coordinate across contexts through explicit event contracts.

## Forbidden Patterns

- Reach-through imports into another module's private entities, repositories, or adapters.
- Hiding boundary bypasses behind barrels or re-export chains.

## Refactor Rule

- When boundary violations are found, replace them with API contracts or events in the same change.
- Do not leave temporary reach-through imports after refactors.

## Validation

- Use `eslint.config.mjs` restricted-import and boundary rules as the enforcement source.
- Re-check changed imports for `@/modules/` to confirm API-only access.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/architecture-mddd.instructions.md
````markdown
---
description: 'MDDD architecture rules for layer ownership and dependency direction.'
applyTo: 'modules/**/*.{ts,tsx,js,jsx,md}'
---

# Architecture MDDD

## Layer Direction

- `interfaces -> application -> domain <- infrastructure`
- Keep `domain/` framework-free.

## Layer Constraints

- `domain/` must not import Firebase SDK, React, HTTP clients, or runtime-specific adapters.
- `application/` orchestrates use cases and coordinates domain abstractions.
- `infrastructure/` implements domain ports and repository interfaces.
- `interfaces/` handles UI, route handlers, API transport, and server action wiring.

## Layer Ownership

- `domain/`: entities, value objects, domain services, repository interfaces.
- `application/`: use cases and DTO orchestration.
- `infrastructure/`: adapters and external implementations.
- `interfaces/`: UI, transport, and action wiring.
- `api/`: only public cross-module boundary.

## Dependency Guardrails

- Keep module dependency flow acyclic unless an explicit event contract documents the exception.
- Do not reverse dependency direction for convenience during refactors.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/architecture-modules.instructions.md
````markdown
---
description: 'Module structure, naming, and refactor workflow rules for bounded contexts.'
applyTo: 'modules/**/*.{ts,tsx,js,jsx,md}'
---

# Architecture Modules

## Required Shape

- `api/`, `domain/`, `application/`, `infrastructure/`, `interfaces/`, `README.md`, `index.ts`.

## Naming

- Module folder: kebab-case bounded context.
- Use case file: `verb-noun.use-case.ts`.
- Repository interface: `PascalCaseRepository`.
- Repository implementation: `TechnologyPascalCaseRepository`.
- Public facade type: `PascalCaseFacade`; instance: `camelCaseFacade`.
- Domain event discriminant: `module-name.action`.

## Refactor Checklist

1. Confirm ownership.
2. Map API consumers.
3. Preserve boundaries during split/merge/delete.
4. Update docs and imports in the same change.
5. Migrate public API and event contracts before removing old paths.

## Module Lifecycle Notes

- New module: establish `api/` contract immediately and document inventory updates.
- Split/merge: map source-to-target ownership and classify internal vs public surfaces.
- Delete: remove consumers first, then delete module, then update docs and dependency references.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/architecture-monorepo.instructions.md
````markdown
---
description: 'Monorepo boundary rules across app, modules, packages, and worker runtime.'
applyTo: '{app,modules,packages,providers,debug,py_fn}/**/*.{ts,tsx,js,jsx,py,md}'
---

# Architecture Monorepo

## Boundary Rules

- `app/` composes module APIs and package aliases.
- `modules/` own business capabilities by bounded context.
- `packages/` provide stable shared implementations via aliases.
- `py_fn/` owns ingestion and heavy worker jobs.

## Runtime Ownership Rule

- Browser-facing interactions, auth/session, and route orchestration stay in Next.js.
- Background, retryable, and heavy ingestion jobs stay in `py_fn/`.

## External Docs Rule

- Use external documentation lookup only when repository sources are insufficient or version-sensitive behavior is uncertain.
- Prefer local authoritative sources first: `AGENTS.md`, `.github/copilot-instructions.md`, module docs, and local code.

## Import Rules

- Use configured aliases; avoid legacy import families.
- Avoid cross-layer relative imports across contexts.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
#use skill next-devtools-mcp
````

## File: .github/instructions/bounded-context-rules.instructions.md
````markdown
---
description: '限界上下文邊界與模組依賴方向規範，遵循 Vaughn Vernon IDDD 戰略設計原則。'
applyTo: 'modules/**/*.{ts,tsx,js,jsx,md}'
---

# 限界上下文規則 (Bounded Context Rules)

## 核心原則

每個 `modules/<context>/` 是一個**獨立的限界上下文**，擁有自己的通用語言與領域模型。同一術語在不同限界上下文中可能有不同含義，須以各自的模型為準。

## 邊界規則

1. **跨模組存取**只能透過目標模組的 `api/` 公開合約進行。嚴禁直接匯入其他模組的 `domain/`、`application/`、`infrastructure/` 或 `interfaces/` 內部程式碼。
2. **限界上下文間的通訊**只能透過以下方式：
   - 發布與訂閱**領域事件** (Domain Events)
   - 呼叫目標模組的 `api/` 公開 Facade 或合約
3. **基礎設施直接呼叫**（如 Firebase Admin、Upstash）必須封裝在各自模組的 `infrastructure/` 層，不得跨模組共用。

## 依賴方向

```
interfaces/ → application/ → domain/ ← infrastructure/
```

- `domain/` 必須保持框架無關（不能匯入 Firebase SDK、React、HTTP 客戶端等）。
- `infrastructure/` 實作 `domain/` 定義的 Repository 介面，只向下依賴。
- `application/` 協調 Use Cases，只依賴 `domain/` 的抽象。
- `interfaces/` 處理 UI、路由處理器、API 傳輸與 Server Action 接線。

## 上下文地圖 (Context Map)

完整模組地圖請查閱：**[`docs/ddd/bounded-contexts.md`](../../docs/ddd/bounded-contexts.md)**

> 模組清單不在此複製。模組職責變更時，必須更新上述文件，而非此處。

## 防腐層 (Anti-Corruption Layer)

- 整合外部系統（Firebase、Genkit、Upstash）時，必須在 `infrastructure/` 層建立適配器。
- 防止外部概念與命名污染領域模型的類別與介面。
- 在適配器中負責翻譯外部模型與領域模型之間的概念差異。

## 禁止模式

- ❌ `import { X } from '@/modules/other-context/domain/...'`
- ❌ `import { X } from '@/modules/other-context/application/...'`
- ❌ `import { X } from '@/modules/other-context/infrastructure/...'`
- ✅ `import { X } from '@/modules/other-context/api'`

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/branching-strategy.instructions.md
````markdown
---
description: 'Branching and change-scope strategy for focused, reviewable delivery.'
applyTo: '**/*'
---

# Branching Strategy

## Rules

- Keep one concern per branch and PR.
- Name branches by intent and scope.
- Avoid mixing architecture refactor with unrelated feature work.

## Validation Before Merge

- Run relevant lint/build/test commands for touched runtime.
- Document what changed and why.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/instructions/ci-cd.instructions.md
````markdown
---
description: 'CI/CD execution rules for lint, build, tests, and release evidence.'
applyTo: '{.github/workflows/**/*.{yml,yaml},package.json,py_fn/requirements.txt,firebase.json,apphosting.yaml}'
---

# CI CD

## Required Checks

- `npm run lint`
- `npm run build`
- `cd py_fn && python -m compileall -q .`
- `cd py_fn && python -m pytest tests/ -v`

## Rules

- Do not skip failing mandatory checks.
- Report unrelated baseline failures separately.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/instructions/cloud-functions.instructions.md
````markdown
---
description: 'Rules for Python Cloud Functions worker responsibilities and boundaries.'
applyTo: 'py_fn/**/*.py'
---

# Cloud Functions

## Ownership

- `py_fn/` handles parsing, cleaning, taxonomy, chunking, embedding, and background jobs.
- Do not add browser-facing chat/auth/session logic in `py_fn/`.

## Runtime Decision Rule

- If called directly from page or browser flow, keep it in Next.js.
- If heavy, retryable, admin/internal, or long-running, keep it in `py_fn/`.

## Guardrails

- Preserve worker layer boundaries.
- Keep ingest job flow deterministic and retry-safe.

## Boundary Change Validation

- Before changing worker ownership, review `py_fn/docs/decision-architecture/adr/README.md` and accepted ADRs.
- Update `py_fn/README.md` when responsibilities or runtime contracts change.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
````

## File: .github/instructions/commit-convention.instructions.md
````markdown
---
description: 'Commit message and change-summary conventions for maintainable history.'
applyTo: '**/*'
---

# Commit Convention

## Rules

- Keep subject concise and action-oriented.
- Reference scope (module/runtime) in commit body when relevant.
- Include validation evidence for non-trivial changes.

## Avoid

- Mixed unrelated changes in one commit.
- Vague subjects with no functional signal.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/instructions/doc-governance.instructions.md
````markdown
---
description: 'IDDD-based documentation governance rules: single source of truth per DDD concept, Diataxis classification, and anti-bloat constraints.'
applyTo: 'docs/**/*.md'
---

# 文件治理規範 (Documentation Governance)

遵循 Vaughn Vernon《Implementing Domain-Driven Design》的 **Published Language** 原則：每個 DDD 概念只有一個公開、版本化的真相來源。

> 權威知識入口：[`docs/ddd/`](../../docs/ddd/)
> bounded-context 詳細文件：`modules/<context>/*.md`
> 文件框架來源：[`docs/SOURCE-OF-TRUTH.md`](../../docs/SOURCE-OF-TRUTH.md) (Diataxis)

## 核心規則（強制）

1. **唯一真相來源（Single Source of Truth）**：DDD 根地圖與戰略分類由 `docs/ddd/` 擁有；各 bounded context 的詳細參考集由對應 `modules/<context>/*.md` 擁有。新增文件前必須先確認對應 owner 已存在同主題內容。
2. **禁止複製（No Duplication）**：嚴禁將 strategic maps 或 bounded-context detail 在多處複製。引用請使用 Markdown 相對連結。
3. **引用而非複製（Link, Don't Copy）**：
   ```markdown
   ✅ 正確：詳見 [bounded-contexts.md](../../docs/ddd/bounded-contexts.md)
   ❌ 錯誤：直接貼上 bounded-contexts.md 的內容
   ```
4. **Instructions 只含行為約束**：`.github/instructions/` 文件只描述 Copilot 的**行為規則**，不包含領域知識。知識連結到 `docs/ddd/` root maps 或 `modules/<context>/*.md` 詳細文件。
5. **術語查閱優先**：引入新術語前，先查 [`../../.github/terminology-glossary.md`](../../.github/terminology-glossary.md) 與對應 bounded context 的 `modules/<context>/ubiquitous-language.md`。

## 文件分類（Diataxis 四象限）

| 目錄 | 目的 | 寫作風格 |
|------|------|---------|
| `docs/tutorials/` | 學習導向，引導式操作 | 第二人稱，步驟化 |
| `docs/guides/how-to/` | 任務導向，解決特定問題 | 以目標開頭 |
| `docs/reference/` | 精確事實，API / 術語查詢 | 簡潔、可掃描 |
| `docs/guides/explanation/` | 概念導向，解釋「為什麼」 | 分析性散文 |
| `docs/ddd/` | Xuanwu 的 DDD 戰略地圖與入口 | 戰略分類 + 模組地圖 |

## DDD 概念的文件定位

| 概念 | 唯一文件 | 其他地方的處理 |
|------|---------|--------------|
| 子域分類 | [`subdomains.md`](../../docs/ddd/subdomains.md) | 只能連結，不能複製 |
| 限界上下文 / 模組地圖 | [`bounded-contexts.md`](../../docs/ddd/bounded-contexts.md) | 只能連結，不能複製 |
| 通用語言 / 術語 | `modules/<context>/ubiquitous-language.md` | 只能連結，不能複製 |
| 聚合根 / 實體 / VO | `modules/<context>/aggregates.md` | 只能連結，不能複製 |
| 領域事件 | `modules/<context>/domain-events.md` | 只能連結，不能複製 |
| 上下文地圖 | `modules/<context>/context-map.md` | 只能連結，不能複製 |
| 儲存庫模式 | `modules/<context>/repositories.md` | 只能連結，不能複製 |
| 使用案例 / Application Services | `modules/<context>/application-services.md` | 只能連結，不能複製 |
| Domain Services | `modules/<context>/domain-services.md` | 只能連結，不能複製 |

## 防止文件膨脹的規則

- **新增前審查**：每個新 `docs/` 文件必須明確歸屬 Diataxis 的一個象限。
- **最大兩層深度**：`docs/<section>/<file>.md`，禁止更深的嵌套。
- **禁止跨象限混合**：一個文件只服務一個目的（tutorial / how-to / reference / explanation）。
- **技術文件屬於模組**：模組特定的實作細節放在 `modules/<context>/README.md`，不放在全局 `docs/`。
- **Repomix 技能同步**：`.github/skills/` 的 repomix 輸出必須透過 `package.json` 既有 scripts 重新生成，保持與 `.github/*`、`docs/ddd/*` 和 `modules/<context>/*.md` 同步。

Tags: #use skill context7 #use skill xuanwu-app-skill
````

## File: .github/instructions/domain-modeling.instructions.md
````markdown
---
description: '聚合根、實體與值對象的 Immutable 設計與 Zod 驗證規範，遵循 IDDD 戰術設計原則。'
applyTo: 'modules/**/domain/**/*.{ts,tsx}'
---

# 領域模型設計規範 (Domain Modeling)

> 完整知識參考：**對應 bounded context 的 `modules/<context>/aggregates.md`**
> 此文件只包含**行為約束與程式碼範例**，不複製領域知識。

## 聚合根 (Aggregate Root)

- 每個聚合必須有**唯一識別碼**（使用 Zod 品牌型別 `z.string().uuid().brand('...')`）。
- 使用**私有建構函式**加靜態工廠方法 `create()` 與 `reconstitute()`。
- 所有狀態修改必須透過**封裝的命令方法**，不允許直接修改屬性。
- **業務規則（不變數）**只在聚合內部執行，違規時拋出帶有描述的 `Error`。
- 每次狀態修改必須產生對應的**領域事件**並存入 `_domainEvents` 私有陣列。
- 使用 `pullDomainEvents()` 方法提取並清空待發布事件。
- `getSnapshot()` 回傳 `Readonly<State>`，防止外部直接修改狀態。

```typescript
// 聚合根標準結構
export class MyAggregate {
  private readonly _id: MyId;
  private _state: MyState;
  private _domainEvents: DomainEvent[] = [];

  private constructor(id: MyId, state: MyState) {
    this._id = id;
    this._state = state;
  }

  // 工廠方法：新建
  public static create(id: MyId, /* ...inputs */): MyAggregate {
    const aggregate = new MyAggregate(id, { /* 初始狀態 */ });
    aggregate._domainEvents.push({ /* MyAggregateCreated 事件 */ });
    return aggregate;
  }

  // 工廠方法：從持久化資料重建
  public static reconstitute(snapshot: MySnapshot): MyAggregate {
    return new MyAggregate(snapshot.id as MyId, snapshot);
  }

  // 業務方法
  public doSomething(input: string): void {
    // 1. 驗證不變數
    if (this._state.status === 'archived') {
      throw new Error('Cannot modify an archived aggregate.');
    }
    // 2. 更新狀態
    this._state = { ...this._state, field: input };
    // 3. 記錄領域事件
    this._domainEvents.push({ type: 'my-context.something-done', /* ... */ });
  }

  public get id(): MyId { return this._id; }

  public getSnapshot(): Readonly<MyState> {
    return Object.freeze({ ...this._state });
  }

  public pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
```

## 值對象 (Value Object)

- 使用 **Zod Schema** 定義並驗證，並使用 `z.brand()` 確保型別安全。
- 值對象必須是**不可變的**（Immutable）。
- 相等性以**值內容**判斷，不以物件參考判斷。
- 不應包含識別碼欄位。

```typescript
// 值對象：品牌型別模式
import { z } from 'zod';

export const WorkspaceIdSchema = z.string().uuid().brand('WorkspaceId');
export type WorkspaceId = z.infer<typeof WorkspaceIdSchema>;

export const WorkspaceNameSchema = z.string().min(1).max(100).trim().brand('WorkspaceName');
export type WorkspaceName = z.infer<typeof WorkspaceNameSchema>;
```

## 實體 (Entity)

- 具有唯一識別碼，以識別碼判斷相等性。
- 狀態可變，但修改應透過方法封裝。
- 不要設計成只有 Getter/Setter 的**貧血模型**（Anemic Domain Model）。
- 識別碼使用品牌型別值對象保護型別安全。

## Zod 驗證規範

- 所有 Domain 物件的 Schema 定義必須放在 `domain/` 層（不依賴外部框架）。
- 使用 `z.infer<typeof Schema>` 產生 TypeScript 型別，避免型別重複定義。
- 在聚合的工廠方法或命令方法中執行輸入驗證。
- `CommandResult` 使用 `@shared-types` 的共用型別。

## 禁止模式 (Anti-Patterns)

- ❌ **貧血領域模型**：只有資料屬性（`id`, `name`, `status`），無業務邏輯。
- ❌ **直接暴露可變狀態**：`public state: MyState`。
- ❌ **在 `domain/` 層匯入外部框架**：Firebase、HTTP 客戶端、React。
- ❌ **跨聚合直接操作**：在聚合 A 中直接修改聚合 B 的狀態。
- ❌ **過大聚合**：聚合包含過多子實體，應重新評估邊界。

## 目錄結構

```
modules/<context>/domain/
├── aggregates/        # 聚合根類別
├── entities/          # 子實體類別與型別定義
├── value-objects/     # 值對象（品牌型別）
├── events/            # 領域事件定義（Zod Schema）
├── repositories/      # 儲存庫介面（只有介面，無實作）
└── services/          # 領域服務（無狀態業務邏輯）
```

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/embedding-pipeline.instructions.md
````markdown
---
description: 'Ingestion and embedding pipeline contract for worker-side RAG preparation.'
applyTo: '{py_fn/**/*.py,docs/**/*.md}'
---

# Embedding Pipeline

## Contract Order

Parse -> Clean -> Taxonomy -> Chunk -> Chunk metadata -> Embedding -> Firestore writes -> Mark ready

## Rules

- Do not reorder stages without contract/doc update.
- Normalize source documents to markdown (for example via MarkItDown) before chunking when required by source format.
- Keep metadata traceable for retrieval citations.
- Validate converted markdown quality before chunking.
- Record notable format-loss risk when conversion fidelity may affect downstream retrieval.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill llamaparse
#use skill liteparse
````

## File: .github/instructions/event-driven-state.instructions.md
````markdown
---
description: 'XState 狀態機與領域事件互動規範，包含 SuperJSON 序列化處理，遵循 IDDD 事件驅動架構原則。'
applyTo: 'modules/**/*.{ts,tsx}'
---

# 事件驅動狀態規範 (Event-Driven State)

> 完整知識參考：**對應 bounded context 的 `modules/<context>/domain-events.md`**
> 此文件只包含**行為約束與程式碼範例**，不複製領域知識。

## 領域事件 (Domain Events)

- 所有**狀態變更**都必須產生一個對應的領域事件，捕捉業務因果關係。
- 領域事件命名必須是**過去式**，格式為 `<Entity><Action>`，例如 `WorkspaceCreated`、`KnowledgeIngested`。
- 事件 `type` 的 discriminant 格式為 `<module-name>.<action>`，例如 `workspace.created`。
- 使用 **Zod Schema** 嚴格定義事件 Payload。
- 事件必須包含 `eventId`（UUID）與 `occurredAt`（**ISO string**）欄位，遵循 `modules/shared/domain/events.ts` 的 `DomainEvent` 基礎介面。

```typescript
// 領域事件定義範例
import { z } from 'zod';

export const WorkspaceCreatedEventSchema = z.object({
  type: z.literal('workspace.created'),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),   // ISO 8601 字串，非 Date 物件
  payload: z.object({
    workspaceId: z.string().uuid(),
    organizationId: z.string().uuid(),
    name: z.string(),
    ownerId: z.string(),
  }),
});
export type WorkspaceCreatedEvent = z.infer<typeof WorkspaceCreatedEventSchema>;
```

## SuperJSON 序列化

- 跨越 Server/Client 邊界傳遞事件或包含 `Date`、`Map`、`Set` 等型別時，使用 **SuperJSON** 進行序列化。
- 確保 Server Action 或 API 回應中的複雜型別能正確序列化與還原。
- 在 Next.js Server Action 的輸出端序列化，在 Client 端使用 SuperJSON 還原。

## XState 狀態機整合

- 前端複雜的多步驟狀態流轉（如表單精靈、多階段審批）使用 **XState** 管理。
- Machine 定義放在 `modules/<context>/application/machines/` 目錄。
- XState Machine 的 `actions` 應觸發對應的 Server Action，並將結果映射回 Machine 的事件。
- Machine 的事件型別應與對應的領域事件保持語意一致。

```typescript
// XState Machine 與 Server Action 整合範例
import { createMachine, assign } from 'xstate';

export const workspaceMachine = createMachine({
  id: 'workspace',
  initial: 'idle',
  context: { workspaceId: null as string | null, error: null as string | null },
  states: {
    idle: {
      on: { CREATE: 'creating' },
    },
    creating: {
      invoke: {
        src: 'createWorkspaceAction',  // 對應 Server Action
        onDone: {
          target: 'ready',
          actions: assign({ workspaceId: ({ event }) => event.output.aggregateId }),
        },
        onError: {
          target: 'failed',
          actions: assign({ error: ({ event }) => String(event.error) }),
        },
      },
    },
    ready: {},
    failed: { on: { RETRY: 'idle' } },
  },
});
```

## 事件發布流程

1. 聚合根透過業務方法產生領域事件，存入 `_domainEvents` 陣列。
2. Use Case（Application Service）在聚合**持久化成功後**，呼叫 `pullDomainEvents()` 提取事件。
3. Use Case 負責將事件發布到 QStash 或事件匯流排（At-Least-Once 語意）。
4. 不可在聚合持久化**之前**發布事件（確保一致性）。

```typescript
// Use Case 中的事件發布流程
export class CreateWorkspaceUseCase {
  async execute(input: CreateWorkspaceInput): Promise<CommandResult> {
    const workspace = Workspace.create(generateId(), input);
    await this.workspaceRepository.save(workspace);  // 1. 先持久化
    const events = workspace.pullDomainEvents();      // 2. 提取事件
    await this.eventPublisher.publishAll(events);     // 3. 再發布
    return { success: true, aggregateId: workspace.id };
  }
}
```

## 驗證

- `occurredAt` 必須使用 ISO string，不得使用 `Date` 物件（與 `shared/domain/events.ts` 一致）。
- 事件 Schema 使用 Zod 驗證，確保 Payload 型別安全。

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/firebase-architecture.instructions.md
````markdown
---
description: 'Firebase architecture boundaries for Next.js orchestration, Firestore, and Python worker runtime.'
applyTo: '{app,modules,packages,py_fn}/**/*.{ts,tsx,js,jsx,py}'
---

# Firebase Architecture

## Runtime Split

- Next.js: user-facing orchestration, auth/session, server actions.
- `py_fn/`: heavy ingestion, embedding, and background operations.

## Responsibility Split

- Next.js owns upload UX, browser-facing APIs, and AI response orchestration.
- `py_fn/` owns parse/clean/taxonomy/chunk/embed/persist pipelines.

## Data Boundary

- Keep Firestore document contracts explicit.
- Avoid implicit schema drift across modules.
- Preserve source and chunk metadata traceability for audit and citation needs.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill xuanwu-development-contracts
````

## File: .github/instructions/firestore-schema.instructions.md
````markdown
---
description: 'Firestore schema and index design rules aligned to bounded context ownership.'
applyTo: '{modules/**/infrastructure/**/*.{ts,tsx,js,jsx},firestore.indexes.json,firestore.rules}'
---

# Firestore Schema

## Rules

- Keep collection ownership explicit per module.
- Version breaking schema transitions with migration steps.
- Update indexes with query-shape changes.

## Validation

- Verify read/write paths remain compatible.
- Confirm index coverage for new query patterns.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-development-contracts
````

## File: .github/instructions/genkit-flow.instructions.md
````markdown
---
description: 'Genkit flow design and runtime-boundary rules for AI orchestration.'
applyTo: '{modules/agent/**/*.{ts,tsx,js,jsx},app/**/*.{ts,tsx}}'
---

# Genkit Flow

## Rules

- Keep flow inputs/outputs explicit and typed.
- Keep user-facing orchestration in Next.js.
- Delegate heavy ingestion/embedding to worker-side pipelines.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill next-devtools-mcp
````

## File: .github/instructions/hosting-deploy.instructions.md
````markdown
---
description: 'Hosting deploy guardrails for Firebase App Hosting and release safety.'
applyTo: '{apphosting.yaml,firebase.json,.github/workflows/**/*.{yml,yaml}}'
---

# Hosting Deploy

## Rules

- Validate build and config before deployment.
- Keep deploy scope explicit (hosting, rules, indexes, functions).
- Record rollback path for production-impacting changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/instructions/lint-format.instructions.md
````markdown
---
description: 'Lint and formatting expectations for TypeScript and Python changes.'
applyTo: '{app,modules,packages,providers,debug,py_fn}/**/*.{ts,tsx,js,jsx,py}'
---

# Lint Format

## Required Commands

- `npm run lint`
- `npm run build` when types or exports changed
- `cd py_fn && python -m compileall -q .`

## Rules

- Fix new lint errors introduced by your change.
- Do not hide violations by broad rule disables.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill vscode-typescript-workbench
````

## File: .github/instructions/modules/modules-api-surface.instructions.md
````markdown
---
name: 'Modules API Surface'
description: 'Rules for modules/*/api files so cross-domain access stays API-only through contracts and facades.'
applyTo: 'modules/**/api/**/*.ts'
---

# Modules API Surface

Use this instruction for `modules/*/api` files.

## Required Shape

- Keep `contracts.ts` for DTOs, request types, response types, and stable public contracts.
- Keep `facade.ts` for outward use-case entry points that the app layer or other modules can call.
- Export the minimum stable surface needed by consumers.

## Guardrails

- Do not instantiate infrastructure adapters directly in `api/`.
- Do not expose private domain entities or repository implementations unless a public contract explicitly requires a translated type.
- Do not reach into other modules except through their own `api/` boundaries.

## Validation

- Re-check every new export and downstream import path.
- Run validation from `agents/commands.md` when API signatures or import surfaces change.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
#use skill xuanwu-development-contracts
````

## File: .github/instructions/modules/modules-index-entry.instructions.md
````markdown
---
name: 'Modules Index Entry'
description: 'Rules for modules/*/index.ts files so they remain aggregate exports without embedded business logic.'
applyTo: 'modules/**/index.ts'
---

# Modules Index Entry

Use this instruction for module root `index.ts` files.

## Rules

- `index.ts` is an aggregate export only.
- Re-export stable public members from `api/` or other intentionally public entry points.
- Keep the file free of orchestration, conditionals, adapter wiring, and business logic.

## Guardrails

- Do not implement use cases, facades, or stateful helpers here.
- Do not expose private infrastructure or domain internals through convenience exports.

## Validation

- Verify that app-layer or cross-module imports still resolve through the intended public surface.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
````

## File: .github/instructions/modules/modules-infrastructure-adapters.instructions.md
````markdown
---
name: 'Modules Infrastructure Adapters'
description: 'Rules for modules/*/infrastructure files so external resources stay in adapters with downward-only dependencies.'
applyTo: 'modules/**/infrastructure/**/*.{ts,tsx,js,jsx}'
---

# Modules Infrastructure Adapters

Use this instruction for `modules/*/infrastructure` files.

## Rules

- Keep Firebase, storage, HTTP, queue, and third-party adapters here.
- Infrastructure may depend on `domain/` contracts and entities needed to implement ports.
- Keep adapter wiring explicit and local to infrastructure.

## Guardrails

- Do not depend on `application/`, `api/`, or `interfaces/`.
- Do not place domain decision logic here.
- Do not let app-layer concerns leak into adapter code.

## Validation

- Re-check dependency direction after import changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/modules/modules-interfaces-api-consumption.instructions.md
````markdown
---
name: 'Modules Interfaces API Consumption'
description: 'Rules for modules/*/interfaces files so UI, hooks, and external interfaces consume module behavior only through api/.'
applyTo: 'modules/**/interfaces/**/*.{ts,tsx,js,jsx}'
---

# Modules Interfaces API Consumption

Use this instruction for `modules/*/interfaces` files.

## Rules

- Put UI components, hooks, route-facing adapters, and interface DTOs here.
- Consume module behavior through the module's own `api/` surface.
- Keep local view state or interaction state inside the interface layer.

## Guardrails

- Do not import the same module's `domain/` or `application/` directly.
- Do not import another module's internals.
- Do not place external resource adapters here.

## Validation

- Re-check imports for accidental reach-through before finishing.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/nextjs-app-router.instructions.md
````markdown
---
description: 'Next.js App Router composition rules for route slices and ownership boundaries.'
applyTo: 'app/**/*.{ts,tsx}'
---

# Nextjs App Router

## Rules

- Keep route files focused on composition and rendering.
- Prefer Server Components unless client interactivity is required.
- Keep business logic in modules and consume via module APIs.
- Use package aliases and avoid legacy import families.
- Keep `app/` as composition ownership, not domain-rule ownership.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
#use skill vercel-composition-patterns
````

## File: .github/instructions/nextjs-parallel-routes.instructions.md
````markdown
---
description: 'Parallel-route UI block composition rules with isolated local state and API-only module access.'
applyTo: 'app/**/*.{ts,tsx}'
---

# Nextjs Parallel Routes

## Rules

- Keep slot-level state isolated.
- Avoid hidden coupling between unrelated slots.
- Consume cross-domain behavior through module APIs only.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill app-router-parallel-routes
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
````

## File: .github/instructions/nextjs-server-actions.instructions.md
````markdown
---
description: 'Server Action rules for thin orchestration, validation at boundaries, and stable result contracts.'
applyTo: '{app,modules}/**/*.{ts,tsx}'
---

# Nextjs Server Actions

## Rules

- Use `use server` explicitly.
- Keep actions thin and delegate business logic to use cases.
- Return consistent command result shapes.
- Validate inputs at action boundaries using shared validators where applicable.
- Keep infrastructure access out of route files and action wrappers.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
````

## File: .github/instructions/playwright-mcp-testing.instructions.md
````markdown
---
description: >
  Playwright MCP 瀏覽器測試執行規則。凡涉及用戶流程驗證、UI 功能測試、
  截圖存證、表單操作自動化、Console 錯誤偵測時適用。
applyTo: '{app,modules,debug}/**/*.{ts,tsx}'
---

# Playwright MCP Testing Rules

## 工具優先順序

1. **主要**：`mcp_playwright-mc_*` 工具鏈（snapshot → ref → action）
2. **備援**：`mcp_io_github_ver_browser_eval`（playwright-mcp 失效時）
3. **永遠不用**：在備援模式下呼叫 playwright-mcp（會得到 closed 錯誤）

## Snapshot-First 原則

**禁止** 在未取得 snapshot ref 的情況下直接 click 或 fill。

```
✅ 正確：snapshot → 找 ref → click(ref: "...")
❌ 錯誤：直接 click(selector: "button.create")
```

## evaluate 限制（備援模式）

以下表達式在 `mcp_io_github_ver_browser_eval evaluate` 中會失敗：

- 包含 `new Event()`、`new PointerEvent()` 的鏈式表達式
- 包含 `Array.from()` + 方法鏈的複合表達式
- 包含 for loop 的表達式

解法：拆分為多個單一表達式呼叫。

## SPA 導航規則

**全頁重載導致 React 狀態重置**（activeAccount 被清空）。

```
✅ 允許：點擊 Link 的 ref（SPA 路由）
✅ 允許：點擊麵包屑 a[href="/target"] 的 ref
❌ 禁止：瀏覽器導航到新 URL（重置 activeAccount）
❌ 禁止：evaluate window.location.href = '...'
```

## Radix UI Dropdown 開啟規則

Radix DropdownMenu 需要 `PointerEvent` 才能觸發。使用 snapshot 找到 trigger 的 ref，然後 click 它（playwright-mcp 的 click 自動發送正確事件）。

## 帳號情境一致性

- 每次全頁重載後，必須重新確認 `localStorage['xuanwu_last_active_account']`
- 組織功能測試：在 SPA 已載入狀態下切換，勿重載

## workspaceId 前提

以下頁面的 CTA 需要 `activeWorkspaceId` 非空：
- `/knowledge-base/articles`（新增文章）
- `/knowledge-base/articles/[id]`（編輯文章）

測試前先在 `/workspace` 選擇工作區。

## Console 錯誤義務

每次測試結束前，必須呼叫：
```
mcp_playwright-mc_browser_console_messages
```
並在報告中記錄錯誤（即使為零也要寫「無錯誤」）。

## 截圖義務

每個主要測試步驟（初始狀態、操作後、最終狀態）必須截圖：
```
mcp_playwright-mc_browser_take_screenshot → 儲存至 scratchpad/
```

## 測試報告格式

輸出遵循 SKILL.md「測試報告格式」區塊的模板，包含：
- URL + 帳號情境 + 日期 + 狀態
- 截圖證據清單
- 操作步驟記錄
- 發現問題（含優先級）
- Console 錯誤
- 建議修復

## 工具搭配規則

| 情境 | 必用工具 |
|------|---------|
| 確認元件 API | `mcp_shadcn_view_items_in_registries` |
| 不確定 Playwright API | `mcp_context7_resolve-library-id "playwright"` |
| 找 Server Action | `mcp_io_github_ver_nextjs_call get_server_action_by_id` |
| 找元件 props | `mcp_oraios_serena_find_symbol` |
| 輸出測試報告 | `mcp_markitdown_convert_to_markdown` |

Tags: #use skill playwright-mcp-testing
````

## File: .github/instructions/prompt-engineering.instructions.md
````markdown
---
description: 'Prompt authoring rules for deterministic, low-noise, reusable workflow prompts.'
applyTo: '.github/prompts/**/*.prompt.md'
---

# Prompt Engineering

## Frontmatter

- Use clear `description` and `agent` fields.
- Declare `tools` with least privilege when tool usage is required.
- Keep `argument-hint` explicit when the prompt expects user inputs.

## Structure

1. Mission
2. Inputs
3. Workflow
4. Output contract
5. Validation

## Rules

- Keep prompts specific and executable.
- Declare required inputs and fallbacks.
- Keep tools least-privilege when defined.
- Avoid copying repository-global policy into each prompt.
- Prefer short executable steps over long background text.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/instructions/rag-architecture.instructions.md
````markdown
---
description: 'RAG architecture boundaries for conversion, chunking, embedding, and retrieval workflows.'
applyTo: '{modules/retrieval/**/*.{ts,tsx,js,jsx},modules/knowledge/**/*.{ts,tsx,js,jsx},py_fn/**/*.py,docs/**/*.md}'
---

# RAG Architecture

## Rules

- Normalize source docs before chunking when needed, including MarkItDown-based conversion for non-markdown sources.
- Keep retrieval metadata auditable and source-traceable.
- Keep runtime split: Next.js orchestration, `py_fn` ingestion pipeline.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill llamaparse
#use skill liteparse
````

## File: .github/instructions/README.md
````markdown
# Instructions Index

Repository instruction index for `applyTo`-scoped Copilot rules.

## DDD 戰略與戰術設計 (IDDD)

- [ubiquitous-language.instructions.md](ubiquitous-language.instructions.md)
- [bounded-context-rules.instructions.md](bounded-context-rules.instructions.md)
- [domain-modeling.instructions.md](domain-modeling.instructions.md)
- [event-driven-state.instructions.md](event-driven-state.instructions.md)

## Architecture

- [architecture-api-boundary.instructions.md](architecture-api-boundary.instructions.md)
- [architecture-mddd.instructions.md](architecture-mddd.instructions.md)
- [architecture-modules.instructions.md](architecture-modules.instructions.md)
- [architecture-monorepo.instructions.md](architecture-monorepo.instructions.md)

## Delivery Process

- [branching-strategy.instructions.md](branching-strategy.instructions.md)
- [ci-cd.instructions.md](ci-cd.instructions.md)
- [commit-convention.instructions.md](commit-convention.instructions.md)
- [lint-format.instructions.md](lint-format.instructions.md)

## Platform and Runtime

- [firebase-architecture.instructions.md](firebase-architecture.instructions.md)
- [cloud-functions.instructions.md](cloud-functions.instructions.md)
- [hosting-deploy.instructions.md](hosting-deploy.instructions.md)
- [firestore-schema.instructions.md](firestore-schema.instructions.md)
- [security-rules.instructions.md](security-rules.instructions.md)

## AI and RAG

- [genkit-flow.instructions.md](genkit-flow.instructions.md)
- [embedding-pipeline.instructions.md](embedding-pipeline.instructions.md)
- [rag-architecture.instructions.md](rag-architecture.instructions.md)
- [prompt-engineering.instructions.md](prompt-engineering.instructions.md)

## Next.js and UI

- [nextjs-app-router.instructions.md](nextjs-app-router.instructions.md)
- [nextjs-parallel-routes.instructions.md](nextjs-parallel-routes.instructions.md)
- [nextjs-server-actions.instructions.md](nextjs-server-actions.instructions.md)
- [shadcn-ui.instructions.md](shadcn-ui.instructions.md)
- [tailwind-design-system.instructions.md](tailwind-design-system.instructions.md)

## Testing

- [testing-unit.instructions.md](testing-unit.instructions.md)
- [testing-e2e.instructions.md](testing-e2e.instructions.md)
- [playwright-mcp-testing.instructions.md](playwright-mcp-testing.instructions.md)

## DDD Navigation

Use `docs/ddd/` for domain knowledge and keep these instruction files behavioral only:

- [`../../docs/ddd/subdomains.md`](../../docs/ddd/subdomains.md)
- [`../../docs/ddd/bounded-contexts.md`](../../docs/ddd/bounded-contexts.md)
- `../../modules/<context>/*.md` for bounded-context details
````

## File: .github/instructions/security-rules.instructions.md
````markdown
---
description: 'Security rules guardrails for Firestore and Storage with least-privilege access.'
applyTo: '{firestore.rules,storage.rules,modules/**/infrastructure/**/*.{ts,tsx,js,jsx},py_fn/**/*.py}'
---

# Security Rules

## Rules

- Enforce organization and workspace isolation.
- Keep allow conditions explicit and auditable.
- Pair rule changes with scenario-based validation.

## Avoid

- Broad wildcard allows without actor checks.
- Hidden coupling to UI-side assumptions.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-development-contracts
````

## File: .github/instructions/shadcn-ui.instructions.md
````markdown
---
description: 'shadcn/ui usage rules for consistent component composition and accessibility.'
applyTo: '{app,modules,packages}/**/*.{ts,tsx}'
---

# Shadcn UI

## Rules

- Prefer existing primitives before creating new components.
- Keep semantic markup and keyboard accessibility intact.
- Keep component concerns separate from business rules.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill shadcn
#use skill web-design-guidelines
````

## File: .github/instructions/tailwind-design-system.instructions.md
````markdown
---
description: 'Tailwind design-system consistency rules for tokens, spacing, and responsive behavior.'
applyTo: '{app,modules,packages}/**/*.{ts,tsx,css}'
---

# Tailwind Design System

## Rules

- Reuse established tokens and utility conventions.
- Keep spacing and typography scales consistent.
- Avoid ad-hoc one-off style patterns without rationale.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill web-design-guidelines
#use skill shadcn
````

## File: .github/instructions/testing-e2e.instructions.md
````markdown
---
description: 'End-to-end testing rules for browser flows, evidence capture, and release confidence.'
applyTo: '{app,modules,debug}/**/*.{ts,tsx}'
---

# Testing E2E

## Rules

- Validate user-critical flows and failure paths.
- Capture reproducible evidence for failures.
- Separate confirmed defects from enhancement suggestions.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill vscode-testing-debugging-browser
#use skill next-devtools-mcp
````

## File: .github/instructions/testing-unit.instructions.md
````markdown
---
description: 'Unit testing rules for deterministic, isolated, and behavior-focused coverage.'
applyTo: '{modules,packages,py_fn}/**/*.{ts,tsx,js,jsx,py}'
---

# Testing Unit

## Rules

- Keep tests deterministic and isolated.
- Test behavior and invariants, not implementation trivia.
- Cover happy, boundary, and negative paths for core domain logic.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill vscode-testing-debugging-browser
#use skill vscode-typescript-workbench
````

## File: .github/instructions/ubiquitous-language.instructions.md
````markdown
---
description: '強制查閱 terminology-glossary.md 並使用通用語言進行命名，遵循 IDDD 通用語言規範。'
applyTo: 'modules/**/*.{ts,tsx,js,jsx}'
---

# 通用語言規範 (Ubiquitous Language)

## 核心規則

1. 在命名任何 Class、Interface、Type、Variable 或 Domain Event 之前，**必須**先查閱 `terminology-glossary.md`。
2. 嚴禁使用同義詞替換：若術語表定義使用者為 `Tenant`，不得命名為 `User`、`Client` 或 `Customer`。
3. 領域事件命名必須使用**過去式**，例如：`KnowledgeIngested`、`WorkspaceCreated`、`MemberInvited`。
4. 限界上下文的名稱必須與 `modules/<context>/` 資料夾名稱保持一致。
5. 若發現術語表缺少必要術語，應先更新 `terminology-glossary.md` 再繼續實作。

## 術語定義（權威來源）

完整術語入口請查閱：**[`.github/terminology-glossary.md`](../terminology-glossary.md)**，並依實際 bounded context 查閱對應的 `modules/<context>/ubiquitous-language.md`。

> 此處不複製術語表。遇到不確定的術語，必須查閱上述文件。

## 命名規範

- **聚合根**：`PascalCase` 名詞，例如 `Workspace`、`KnowledgeBase`。
- **值對象**：`PascalCase` 名詞，通常以用途或含義命名，例如 `WorkspaceName`、`TenantId`。
- **領域事件**：`PascalCase` 過去式，例如 `WorkspaceCreated`、`MemberRemoved`。
- **事件 discriminant**：`kebab-case` 格式 `<module>.<action>`，例如 `workspace.created`。
- **使用案例檔案**：`verb-noun.use-case.ts`，例如 `create-workspace.use-case.ts`。
- **儲存庫介面**：`PascalCaseRepository`，例如 `WorkspaceRepository`。
- **儲存庫實作**：`TechnologyPascalCaseRepository`，例如 `FirebaseWorkspaceRepository`。

## 驗證

- 提交前確認新增命名符合術語表定義。
- 若使用新術語，同步更新 `terminology-glossary.md` 的「DDD 戰術設計術語」章節。

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/analyze-repo.prompt.md
````markdown
---
name: analyze-repo
description: Analyze repository structure, ownership boundaries, and change impact before implementation.
agent: Serena Strategist
argument-hint: Provide target area, goal, and constraints.
---

# Analyze Repo

## Mission

Map ownership, boundaries, and risks before coding.

## Inputs

- target: ${input:target:modules/workspace}
- goal: ${input:goal:what needs to change}
- constraints: ${input:constraints:boundary, runtime, timeline}

## Workflow

1. Identify owning module and runtime.
2. Locate existing APIs, use cases, and adapters.
3. Flag boundary violations and regression risks.
4. Recommend minimal-change implementation path.

## Output Contract

- Ownership map
- Affected files
- Risk list
- Suggested next prompt

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/app/create-parallel-route-slice.prompt.md
````markdown
---
name: 'create-parallel-route-slice'
description: 'Create or refactor an app/ route slice or parallel-route block that composes module APIs without importing module internals.'
agent: 'App Router Composer'
argument-hint: 'Provide the route path, UI block role, allowed module APIs, and whether the slice should be server or client.'
---

# Create Parallel Route Slice

## Mission

Create or refactor a route slice in `app/` that composes one feature block and keeps the module boundary API-only.

## Inputs

- Route path: `${input:routePath:app/(shell)/dashboard}`
- Block role: `${input:blockRole:dashboard panel | sidebar tool | modal | chat console}`
- Allowed module APIs: `${input:moduleApis:@/modules/workspace/api}`
- Rendering mode: `${input:renderMode:server | client}`

## Workflow

1. Keep the slice focused on one UI responsibility.
2. Consume module data through public APIs only.
3. Keep local UI state isolated to this slice or its local components.
4. Avoid embedding business logic in the route layer.
5. Run the minimum validation needed for the touched files.

## Output

- Files created or changed
- Module APIs consumed
- Validation run
- Any remaining route-state or boundary risks

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill app-router-parallel-routes
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
````

## File: .github/prompts/chunk-docs.prompt.md
````markdown
---
name: chunk-docs
description: Define and execute document chunking strategy for retrieval quality and context efficiency.
agent: rag-lead
argument-hint: Provide source docs, target chunk policy, and constraints.
---

# Chunk Docs

## Inputs

- docs: ${input:docs:docs/**/*.md}
- policy: ${input:policy:size,overlap,metadata}
- constraints: ${input:constraints:token budget and citation needs}

## Workflow

1. Validate document normalization status.
2. Apply chunking policy with explicit metadata fields.
3. Check chunk quality for retrieval relevance.
4. Report chunk statistics and edge cases.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill liteparse
#use skill llamaparse
````

## File: .github/prompts/debug-error.prompt.md
````markdown
---
name: debug-error
description: Reproduce, diagnose, and propose fixes for runtime or logic errors with evidence.
agent: App Router Agent
argument-hint: Provide error message, route/module, and reproduction steps.
---

# Debug Error

## Inputs

- error: ${input:error:paste error message}
- scope: ${input:scope:route/module/runtime}
- repro: ${input:repro:steps to reproduce}

## Workflow

1. Reproduce issue and capture evidence.
2. Isolate likely root cause and affected boundaries.
3. Propose minimal fix plus regression checks.
4. State validation commands to confirm resolution.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill next-devtools-mcp
#use skill vscode-testing-debugging-browser
````

## File: .github/prompts/embedding-docs.prompt.md
````markdown
---
name: embedding-docs
description: Generate embeddings from normalized docs with traceable metadata and retrieval compatibility checks.
agent: embedding-writer
argument-hint: Provide doc sources, embedding model/runtime, and storage target.
---

# Embedding Docs

## Workflow

1. Confirm docs are normalized and chunked.
2. Generate embeddings with stable metadata.
3. Write vectors and verify retrieval compatibility.
4. Report failures, retries, and quality risks.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill llamaparse
````

## File: .github/prompts/generate-aggregate.prompt.md
````markdown
---
name: generate-aggregate
description: 根據業務需求生成符合 IDDD 規範的 TypeScript 聚合根骨架，包含值對象、領域事件與 Zod Schema。
agent: Domain Architect
argument-hint: 提供聚合名稱、所屬限界上下文（模組）、核心業務規則與狀態欄位。
---

# 生成聚合根 (Generate Aggregate Root)

## 輸入

- **聚合名稱**：例如 `Workspace`、`KnowledgeBase`
- **所屬模組**：例如 `workspace`、`knowledge`
- **核心業務規則（不變數）**：列出需要保護的業務規則
- **狀態欄位**：列出聚合的主要屬性與型別
- **主要業務操作**：列出需要封裝的命令方法

## 工作流程

1. 查閱 `terminology-glossary.md` 確認命名符合通用語言規範。
2. 查閱 `.github/instructions/domain-modeling.instructions.md` 確認設計模式。
3. 在 `modules/<context>/domain/` 建立以下檔案：
   - `value-objects/<AggregateName>Id.ts` — 識別碼品牌型別
   - `aggregates/<AggregateName>.ts` — 聚合根類別
   - `events/<AggregateName>Created.ts` — 建立領域事件
4. 聚合根必須包含：
   - 私有建構函式 + 靜態工廠方法 `create()` 與 `reconstitute()`
   - Zod Schema 嚴格定義狀態型別
   - `_domainEvents: DomainEvent[]` 私有陣列
   - `pullDomainEvents()` 提取並清空事件的方法
   - `getSnapshot(): Readonly<State>` 唯讀快照方法
5. 每個業務方法必須：
   - 驗證不變數，違規時拋出帶有描述性訊息的 `Error`
   - 更新內部狀態
   - 將對應的領域事件推入 `_domainEvents`

## 輸出合約

- 識別碼值對象檔案（品牌 Zod Schema）
- 聚合根 TypeScript 類別（完整實作，含所有業務方法）
- 至少一個領域事件定義（Zod Schema + 推導型別）
- 更新 `modules/<context>/domain/aggregates/index.ts`（若存在）

## 驗證

- `npm run lint` — 確認無邊界違規與型別錯誤
- `npm run build` — 確認型別一致性

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/generate-domain-event.prompt.md
````markdown
---
name: generate-domain-event
description: 根據業務操作生成符合 IDDD 規範的 TypeScript 領域事件定義，包含 Zod Schema、型別推導與聚合整合。
agent: Domain Architect
argument-hint: 提供觸發事件的業務操作名稱、所屬聚合、Payload 欄位與所屬模組。
---

# 生成領域事件 (Generate Domain Event)

## 輸入

- **觸發業務操作**：例如「使用者建立工作空間」
- **事件名稱（過去式）**：例如 `WorkspaceCreated`
- **所屬聚合**：例如 `Workspace`
- **所屬模組**：例如 `workspace`
- **Payload 欄位**：列出事件需攜帶的資料與其型別

## 工作流程

1. 確認事件名稱符合**過去式**命名規範（查閱 `ubiquitous-language.instructions.md`）。
2. 確認 `discriminant` 格式為 `<module-name>.<action>`，例如 `workspace.created`。
3. 確認 `occurredAt` 使用 ISO string，遵循 `modules/shared/domain/events.ts` 的 `DomainEvent` 介面。
4. 在 `modules/<context>/domain/events/<EventName>.ts` 建立事件定義。
5. 在對應聚合根的業務方法中加入事件推入邏輯：`this._domainEvents.push({ ... })`。
6. 若需要，更新 `modules/<context>/domain/events/index.ts` 匯出。

## 事件定義模板

```typescript
import { z } from 'zod';

export const {EventName}Schema = z.object({
  type: z.literal('{module}.{action}'),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),   // ISO 8601，非 Date 物件
  payload: z.object({
    // 在此定義業務相關的 Payload 欄位
  }),
});

export type {EventName} = z.infer<typeof {EventName}Schema>;
```

## 輸出合約

- 領域事件 Zod Schema（完整定義）
- 推導出的 TypeScript 型別
- 更新對應聚合根，在業務方法中推入事件
- 更新 `modules/<context>/domain/events/index.ts` 匯出（若適用）

## 驗證

- 確認事件的 `occurredAt` 使用 ISO string 而非 `Date` 物件（與 `shared/domain/events.ts` 一致）。
- 確認事件 `type` discriminant 格式為 `<module>.<action>`，與模組命名一致。
- `npm run lint` — 確認無邊界違規。

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/implement-feature.prompt.md
````markdown
---
name: implement-feature
description: Execute an approved feature plan with bounded scope, required validation, and doc updates.
agent: Domain Lead
argument-hint: Provide approved plan reference and tasks to execute.
---

# Implement Feature

## Requirements

- Treat the approved plan as execution contract.
- Keep within scope and non-goals.
- Run required validation commands.
- Update listed docs in the same change.

## Output

- Tasks completed
- Validation run
- Documentation updated
- Deviations or blockers

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
````

## File: .github/prompts/implement-firestore-schema.prompt.md
````markdown
---
name: implement-firestore-schema
description: Implement Firestore schema/index updates with backward-safe migration and validation evidence.
agent: firestore-schema
argument-hint: Provide collections, fields, query patterns, and migration constraints.
---

# Implement Firestore Schema

## Workflow

1. Define schema and ownership by bounded context.
2. Update indexes for new query shapes.
3. Plan migration or compatibility path.
4. Validate read/write behavior and regressions.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-development-contracts
````

## File: .github/prompts/implement-genkit-flow.prompt.md
````markdown
---
name: implement-genkit-flow
description: Implement or refactor Genkit flow with explicit contracts, runtime boundaries, and validation.
agent: genkit-flow
argument-hint: Provide flow intent, inputs/outputs, and target runtime.
---

# Implement Genkit Flow

## Workflow

1. Define flow contract (input, output, failure modes).
2. Keep orchestration in Next.js and heavy processing in worker runtime.
3. Integrate with retrieval or action boundaries safely.
4. Validate flow behavior and fallback paths.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill next-devtools-mcp
````

## File: .github/prompts/implement-security-rules.prompt.md
````markdown
---
name: implement-security-rules
description: Implement Firestore/Storage security rules with least privilege and tenancy isolation.
agent: security-rules
argument-hint: Provide access scenarios, actor roles, and constrained resources.
---

# Implement Security Rules

## Workflow

1. Enumerate allowed actor-resource actions.
2. Encode explicit allow conditions and deny-by-default behavior.
3. Validate with scenario-based checks.
4. Report residual access risks.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-development-contracts
````

## File: .github/prompts/implement-server-action.prompt.md
````markdown
---
name: implement-server-action
description: Implement Next.js server actions as thin orchestrators that delegate to use cases.
agent: server-action-writer
argument-hint: Provide action intent, input schema, and target use case.
---

# Implement Server Action

## Rules

- Use `use server`.
- Validate input at boundary.
- Delegate business logic to module use cases.
- Return stable command-result shape.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
#use skill modules-mddd-api-surface
````

## File: .github/prompts/implement-ui-component.prompt.md
````markdown
---
name: implement-ui-component
description: Build or refactor UI components with shadcn patterns and boundary-safe composition.
agent: Component Agent
argument-hint: Provide component goal, route scope, and interaction states.
---

# Implement UI Component

## Workflow

1. Confirm component ownership and target route slice.
2. Reuse existing shadcn primitives where possible.
3. Implement states: loading, empty, error, success.
4. Validate accessibility and interaction behavior.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill shadcn
#use skill web-design-guidelines
#use skill vercel-react-best-practices
#use skill next-devtools-mcp
````

## File: .github/prompts/ingest-docs.prompt.md
````markdown
---
name: ingest-docs
description: Ingest and normalize documents for downstream chunking and embedding workflows.
agent: doc-ingest
argument-hint: Provide source format, target pipeline, and quality constraints.
---

# Ingest Docs

## Workflow

1. Convert/normalize sources to markdown when needed.
2. Preserve source metadata and traceability.
3. Validate structure quality for chunking.
4. Output ingestion summary and loss-risk notes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill liteparse
#use skill llamaparse
````

## File: .github/prompts/plan-api.prompt.md
````markdown
---
name: plan-api
description: Create an API-focused implementation plan covering contracts, facades, consumers, and validation.
agent: Planner
argument-hint: Provide API intent, owner module, consumers, and compatibility constraints.
---

# Plan API

## Requirements

- Define contract shape and owner boundary.
- Identify consuming routes/modules.
- Include compatibility and migration strategy.
- Specify validation and documentation updates.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-development-contracts
````

## File: .github/prompts/plan-feature.prompt.md
````markdown
---
name: plan-feature
description: Create a formal implementation plan for a feature or scoped enhancement.
agent: Planner
argument-hint: Describe desired outcome, constraints, and affected modules.
---

# Plan Feature

Use the implementation plan template and include scope, ownership, risks, validation, and non-goals.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
#use skill xuanwu-development-contracts
````

## File: .github/prompts/plan-module.prompt.md
````markdown
---
name: plan-module
description: Plan module lifecycle changes (create, refactor, split, merge, delete) under MDDD boundaries.
agent: Modules Architect
argument-hint: Provide module scope, operation type, and migration constraints.
---

# Plan Module

## Workflow

1. Confirm bounded-context ownership.
2. Choose operation: create, refactor, split, merge, delete.
3. Map API/event consumers and migration path.
4. Define validation and docs updates.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/playwright-mcp-inspect.prompt.md
````markdown
---
name: playwright-mcp-inspect
description: 以用戶視角巡覽目標路由，自動偵測 UI 功能缺口、反直覺設計、空狀態引導缺失與 Console 錯誤。
agent: E2E QA Agent
argument-hint: "<route-or-section> [--account org|personal] [--deep]"
---

# Playwright MCP UI 缺口偵測

## 輸入參數

- target: ${input:target:要巡覽的路由或功能模組，例如 /organization 或 knowledge-base}
- account: ${input:account:帳號情境 personal 或 org（組織功能用 org）}
- depth: ${input:depth:巡覽深度 shallow（主頁面）或 deep（進入子頁面）}

## 目標

扮演一位「第一次使用」的真實用戶，系統性地走過目標區域，找出：

1. **功能缺口**：預期存在但找不到的操作入口（CRUD 缺少 Create？）
2. **反直覺設計**：動作不符合用戶預期、按鈕位置奇怪、命名混淆
3. **空狀態問題**：列表為空時無任何引導性說明或 CTA
4. **Disabled 陷阱**：按鈕存在但 disabled 且無說明原因
5. **導航死胡同**：進入後找不到返回路徑
6. **Console 錯誤**：任何 JavaScript 錯誤或 API 失敗

## 帳號情境設置

**Personal 帳號**（預設）：
- 直接導航到目標頁面
- 確認 localStorage `xuanwu_last_active_account` = `dev-demo-user`

**Organization 帳號**（需要 org 功能時）：
1. 導航到 `/workspace`（確保 SPA 已載入）
2. 點開帳號切換 dropdown（需 PointerDown 事件）
3. 選擇 org 選項
4. 確認 localStorage 更新為 org ID
5. 點擊麵包屑或 Link（勿用全頁重載）導航到目標

## 巡覽執行流程

### Phase 1: 頁面初始化分析

```
1. mcp_playwright-mc_browser_navigate → 目標 URL
2. mcp_playwright-mc_browser_snapshot → 取得完整 a11y 樹
3. mcp_playwright-mc_browser_take_screenshot → 初始截圖
4. mcp_playwright-mc_browser_console_messages → 確認無初始錯誤
```

記錄頁面結構：
- 頁面標題、小標、說明文字
- 可見的操作按鈕（CTA）
- 是否有資料列表或空狀態
- 是否有 Nav/Breadcrumb 讓用戶知道自己在哪

### Phase 2: CTA 完整性檢查

針對每個功能模組，預期應有的 CRUD 操作入口：

| 功能類型 | 預期 CTA | 缺口判斷 |
|---------|---------|---------|
| 列表頁 | 新增/建立按鈕 | 無「＋」或「新增」按鈕 |
| 詳情頁 | 編輯/刪除按鈕 | 只能查看無法修改 |
| 表單 | 送出/取消 | 送出後無任何反饋 |
| 搜尋/篩選 | 清除/重設 | 無法清除已輸入的篩選 |

### Phase 3: 互動測試（Shallow 模式）

```
1. 找到主要 CTA → snapshot ref → click
2. 記錄 Dialog/Form 是否正確開啟
3. 填入測試資料（snapshot find inputs → fill）
4. 送出表單
5. 驗證成功反饋（toast、列表更新）
6. 截圖紀錄

負面測試：
1. 不填任何資料直接送出
2. 確認 validation 錯誤提示出現
3. 截圖記錄
```

### Phase 4: 子頁面巡覽（Deep 模式）

```
針對頁面上每個導航連結：
1. 記錄 href
2. click 進入
3. 重複 Phase 1-3
4. click 返回（找 Back Link 或 Breadcrumb）
```

### Phase 5: 錯誤狀態收集

```
mcp_playwright-mc_browser_console_messages → 收集所有 console 訊息
mcp_io_github_ver_nextjs_call port:3000 toolName:"get_errors" → Next.js 錯誤
```

## 缺口評分標準

| 嚴重度 | 說明 | 示例 |
|-------|------|------|
| 🔴 高 | 核心功能完全缺失 | 列表頁沒有建立入口 |
| 🟡 中 | 功能存在但使用困難 | 按鈕 disabled 無說明 |
| 🟢 低 | 體驗可改善 | 空狀態缺少引導文字 |

## 輸出 UI 缺口報告

```markdown
## UI 缺口偵測報告：{target}

**巡覽路徑**: {routes visited}
**帳號情境**: personal / organization  
**巡覽日期**: YYYY-MM-DD  
**巡覽深度**: shallow / deep

### 截圖索引
1. [ss_initial.png] 初始狀態
2. [ss_create_dialog.png] 建立流程
...

### 發現的缺口

#### 🔴 高優先級
- [ ] **路徑**: /route  
  **問題**: 功能說明  
  **影響**: 用戶無法完成 X  
  **建議**: 在 Y 位置加入 Z 元件

#### 🟡 中優先級
...

#### 🟢 低優先級
...

### Console 錯誤
- 無 / 錯誤清單

### 修復建議優先順序
1. 最高影響 + 最低代價
2. ...
```

## 與其他 MCP 的協作

**找修復方案時**：
- `mcp_shadcn_list_items_in_registries` → 查詢適合的 UI 元件
- `mcp_shadcn_get_item_examples_from_registries` → 取得元件示例

**確認 API 可用性**：
- `mcp_oraios_serena_find_symbol` → 找對應的 use case / server action
- `mcp_io_github_ver_nextjs_call get_routes` → 確認路由存在

**查詢 UX 最佳實踐**：
- `mcp_context7_resolve-library-id "shadcn/ui"` → 查元件文件

Tags: #use skill playwright-mcp-testing
#use skill shadcn
#use skill context7
#use skill serena-mcp
#use skill next-devtools-mcp
````

## File: .github/prompts/playwright-mcp-test.prompt.md
````markdown
---
name: playwright-mcp-test
description: 執行 Playwright MCP 瀏覽器測試，驗證指定路由的用戶流程並輸出帶截圖的測試報告。
agent: E2E QA Agent
argument-hint: "<route-or-url> <user-flow-description> [--account org|personal]"
---

# Playwright MCP 瀏覽器測試

## 輸入參數

- route: ${input:route:目標路由或完整 URL，例如 /organization/members}
- flow: ${input:flow:要測試的用戶流程，例如「邀請成員」}
- account: ${input:account:帳號情境 personal 或 org（預設 personal）}

## 前置條件確認

在開始前，執行以下確認步驟：

1. **Dev server 狀態**  
   確認 `http://localhost:3000` 可存取。若未啟動，提示用戶執行 `npm run dev`。

2. **playwright-mcp 可用性**  
   執行 `mcp_playwright-mc_browser_snapshot`（無參數）。
   - 成功 → 使用 playwright-mcp 工具鏈
   - 失敗（"closed"）→ 切換到 `mcp_io_github_ver_browser_eval` 備援模式

3. **帳號情境切換（若需要 org 情境）**  
   參照 SKILL.md 的「帳號切換」章節執行組織帳號切換。

4. **工作區確認（若頁面需要 workspaceId）**  
   先導航到 /workspace 選擇工作區，再前往目標頁面。

## 測試執行流程

### Step 1: 導航到目標路由

```
playwright-mcp 模式：
  mcp_playwright-mc_browser_navigate → url: "http://localhost:3000{route}"
  
備援模式：
  mcp_io_github_ver_browser_eval action:"navigate" → url: "http://localhost:3000{route}"
```

### Step 2: 取得初始快照

```
mcp_playwright-mc_browser_snapshot → 取得完整 a11y 樹
識別所有可交互元素（buttons、inputs、links、selects）
確認主要 CTA 是否 enabled
```

### Step 3: 截圖（初始狀態）

```
mcp_playwright-mc_browser_take_screenshot → 初始狀態截圖
儲存至 scratchpad/ 目錄並 view_image 檢視
```

### Step 4: 執行用戶流程

依照 `{flow}` 執行具體操作，記錄每步驟的：
- 找到的元素 ref
- 執行的動作（click/fill/select）
- 操作後的快照變化

### Step 5: 驗證結果

```
成功路徑驗證：
  - snapshot → 確認 UI 反映成功狀態（新項目出現、Dialog 關閉）
  - console_messages → 確認無錯誤

失敗路徑驗證（負面測試）：
  - 故意送空表單 → 確認 validation 訊息出現
  - 故意填錯格式 → 確認錯誤提示
```

### Step 6: 最終截圖

```
mcp_playwright-mc_browser_take_screenshot → 最終狀態截圖
```

### Step 7: Next.js 診斷（可選）

```
mcp_io_github_ver_nextjs_call port:3000 toolName:"get_errors"
→ 確認無 Next.js build/runtime 錯誤
```

## 輸出測試報告

使用以下模板輸出報告：

```markdown
## 測試結果：{flow} @ {route}

**URL**: {route}  
**帳號情境**: personal / organization  
**測試日期**: YYYY-MM-DD  
**狀態**: ✅ 通過 / ❌ 失敗 / ⚠️ 部分通過

### 截圖證據
- [初始狀態截圖]
- [操作後截圖]
- [最終狀態截圖]

### 操作步驟記錄
1. 步驟描述 + ref + 結果
2. ...

### 發現問題
- ❌ 問題描述（優先級：高/中/低）

### Console 錯誤
- 無 / 錯誤列表

### 建議
- [ ] 修復建議或增強建議
```

Tags: #use skill playwright-mcp-testing
#use skill context7
#use skill next-devtools-mcp
#use skill serena-mcp
````

## File: .github/prompts/README.md
````markdown
# Prompts Index

Repository prompt set for repeatable planning, implementation, review, and documentation tasks.

## DDD 領域建模 (IDDD)

- [generate-aggregate.prompt.md](generate-aggregate.prompt.md)
- [generate-domain-event.prompt.md](generate-domain-event.prompt.md)

## Planning

- [plan-feature.prompt.md](plan-feature.prompt.md)
- [plan-module.prompt.md](plan-module.prompt.md)
- [plan-api.prompt.md](plan-api.prompt.md)

## Implementation

- [implement-feature.prompt.md](implement-feature.prompt.md)
- [implement-firestore-schema.prompt.md](implement-firestore-schema.prompt.md)
- [implement-genkit-flow.prompt.md](implement-genkit-flow.prompt.md)
- [implement-security-rules.prompt.md](implement-security-rules.prompt.md)
- [implement-server-action.prompt.md](implement-server-action.prompt.md)
- [implement-ui-component.prompt.md](implement-ui-component.prompt.md)

## Docs and RAG

- [ingest-docs.prompt.md](ingest-docs.prompt.md)
- [chunk-docs.prompt.md](chunk-docs.prompt.md)
- [embedding-docs.prompt.md](embedding-docs.prompt.md)
- [write-docs.prompt.md](write-docs.prompt.md)

## Analysis and Debug

- [analyze-repo.prompt.md](analyze-repo.prompt.md)
- [debug-error.prompt.md](debug-error.prompt.md)

## Refactor and Review

- [refactor-module.prompt.md](refactor-module.prompt.md)
- [refactor-api.prompt.md](refactor-api.prompt.md)
- [review-code.prompt.md](review-code.prompt.md)
- [review-architecture.prompt.md](review-architecture.prompt.md)
- [review-performance.prompt.md](review-performance.prompt.md)
- [review-security.prompt.md](review-security.prompt.md)

## Testing

- [write-tests.prompt.md](write-tests.prompt.md)
- [write-e2e-tests.prompt.md](write-e2e-tests.prompt.md)
- [playwright-mcp-test.prompt.md](playwright-mcp-test.prompt.md)
- [playwright-mcp-inspect.prompt.md](playwright-mcp-inspect.prompt.md)
````

## File: .github/prompts/refactor-api.prompt.md
````markdown
---
name: refactor-api
description: Refactor module API surface with contract safety, consumer migration, and minimal boundary impact.
agent: Modules API Surface Steward
argument-hint: Provide current API, target API, and migration constraints.
---

# Refactor API

## Rules

- Preserve API-only cross-module access.
- Avoid leaking internals through barrels.
- Make compatibility path explicit when breaking changes are required.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/refactor-module.prompt.md
````markdown
---
name: refactor-module
description: Refactor existing module internals while preserving MDDD layers and public boundaries.
agent: Modules Architect
argument-hint: Provide module name, refactor goal, and boundary risks.
---

# Refactor Module

## Workflow

1. Analyze entity/use-case/repository ownership.
2. Move logic into correct layer boundaries.
3. Remove forbidden internal cross-module imports.
4. Update tests/docs alongside code changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/review-architecture.prompt.md
````markdown
---
name: review-architecture
description: Review ownership boundaries, dependency direction, and contract alignment of implemented changes.
agent: Quality Lead
argument-hint: Provide plan reference, changed files, and architecture concerns.
---

# Review Architecture

Return findings first by severity: boundary breaks, dependency inversions, contract drift, and missing docs.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/review-code.prompt.md
````markdown
---
name: review-code
description: Perform risk-first code review for correctness, regressions, and missing validation.
agent: Quality Lead
argument-hint: Provide change summary, touched files, and known risk areas.
---

# Review Code

## Requirements

- Findings first, ordered by severity.
- Include why it matters and blocking status.
- State residual risks and testing gaps explicitly.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill vscode-typescript-workbench
````

## File: .github/prompts/review-performance.prompt.md
````markdown
---
name: review-performance
description: Review runtime and render performance risks with evidence-backed recommendations.
agent: App Router Agent
argument-hint: Provide route/feature scope, observed slowness, and baseline expectations.
---

# Review Performance

## Workflow

1. Collect route/runtime evidence.
2. Identify bottlenecks and likely causes.
3. Propose ranked fixes by impact and complexity.
4. Define validation for improvement claims.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill vercel-react-best-practices
#use skill next-devtools-mcp
````

## File: .github/prompts/review-security.prompt.md
````markdown
---
name: review-security
description: Review security posture for access control, data exposure, and rule/authorization regressions.
agent: quality-lead
argument-hint: Provide changed auth/rules/critical data paths and threat concerns.
---

# Review Security

Report vulnerabilities first with severity, reproduction notes, and concrete remediation steps.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-development-contracts
````

## File: .github/prompts/write-docs.prompt.md
````markdown
---
name: write-docs
description: Write or optimize documentation using structured, deduplicated, and index-driven markdown patterns.
agent: KB Architect
argument-hint: Provide target docs scope and expected documentation outcome.
---

# Write Docs

## Workflow

1. Lint markdown syntax first.
2. Compress and deduplicate repeated concepts.
3. Convert prose to rules/tables where possible.
4. Update folder index/README after leaf updates.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill documentation-writer
````

## File: .github/prompts/write-e2e-tests.prompt.md
````markdown
---
name: write-e2e-tests
description: Design and execute end-to-end tests for user-critical flows with reproducible evidence.
agent: E2E QA Agent
argument-hint: Provide URL/route, target user flow, and acceptance criteria.
---

# Write E2E Tests

## Scope

- Happy path
- Boundary/negative path
- Error-state handling

Collect evidence for failures and include clear reproduction steps.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill vscode-testing-debugging-browser
#use skill next-devtools-mcp
````

## File: .github/prompts/write-tests.prompt.md
````markdown
---
name: write-tests
description: Write deterministic unit/integration tests based on risk and behavior contracts.
agent: quality-lead
argument-hint: Provide module scope, behaviors to verify, and known regression risks.
---

# Write Tests

## Requirements

- Cover happy, boundary, and negative cases.
- Keep tests deterministic and isolated.
- Prioritize behavior contracts over implementation details.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill vscode-testing-debugging-browser
#use skill vscode-typescript-workbench
````

## File: .github/README.md
````markdown
# Xuanwu `.github/` Customization Index

This directory contains the repository-local Copilot customization set for Xuanwu App.

## Structure

- [`copilot-instructions.md`](./copilot-instructions.md) — repository-wide Copilot baseline
- [`terminology-glossary.md`](./terminology-glossary.md) — entry point for DDD terminology lookup
- [`agents/`](./agents/) — custom agent definitions plus local knowledge/commands indexes
- [`instructions/`](./instructions/) — `applyTo`-scoped behavioral rules
- [`prompts/`](./prompts/) — reusable task templates
- [`skills/`](./skills/) — installed and repomix-generated skills

## DDD Reference Set

Use `docs/ddd/` for strategic DDD routing and `modules/<context>/` for the current bounded-context detail set:

- [`../docs/ddd/subdomains.md`](../docs/ddd/subdomains.md)
- [`../docs/ddd/bounded-contexts.md`](../docs/ddd/bounded-contexts.md)
- `../modules/<context>/{README,ubiquitous-language,aggregates,domain-events,context-map,application-services,repositories,domain-services}.md`

## Skill Refresh

Regenerate the checked-in repomix skills with the repository scripts when `.github/*` or docs change materially:

```bash
npm run repomix:skill
npm run repomix:markdown
```

Keep this directory focused on active customizations. Remove stale references, broken links, and unused compatibility notes when the structure changes.
````

## File: .github/terminology-glossary.md
````markdown
# Terminology Glossary Entry Point

Use this file as the stable glossary entry point referenced by `.github/*` customizations.

## DDD Reference Set

- Strategic classification: [`../docs/ddd/subdomains.md`](../docs/ddd/subdomains.md)
- Bounded context map: [`../docs/ddd/bounded-contexts.md`](../docs/ddd/bounded-contexts.md)
- Context terms: use the matching `../modules/<context>/ubiquitous-language.md`

## Bounded Context Glossaries

- [`account`](../modules/account/ubiquitous-language.md)
- [`ai`](../modules/ai/ubiquitous-language.md)
- [`identity`](../modules/identity/ubiquitous-language.md)
- [`knowledge`](../modules/knowledge/ubiquitous-language.md)
- [`knowledge-base`](../modules/knowledge-base/ubiquitous-language.md)
- [`knowledge-collaboration`](../modules/knowledge-collaboration/ubiquitous-language.md)
- [`knowledge-database`](../modules/knowledge-database/ubiquitous-language.md)
- [`notebook`](../modules/notebook/ubiquitous-language.md)
- [`notification`](../modules/notification/ubiquitous-language.md)
- [`organization`](../modules/organization/ubiquitous-language.md)
- [`search`](../modules/search/ubiquitous-language.md)
- [`shared`](../modules/shared/ubiquitous-language.md)
- [`source`](../modules/source/ubiquitous-language.md)
- [`workspace`](../modules/workspace/ubiquitous-language.md)
- [`workspace-audit`](../modules/workspace-audit/ubiquitous-language.md)
- [`workspace-feed`](../modules/workspace-feed/ubiquitous-language.md)
- [`workspace-flow`](../modules/workspace-flow/ubiquitous-language.md)
- [`workspace-scheduling`](../modules/workspace-scheduling/ubiquitous-language.md)

When a term is shared across contexts, prefer the local bounded-context glossary first and then reconcile with [`subdomains.md`](../docs/ddd/subdomains.md) and [`bounded-contexts.md`](../docs/ddd/bounded-contexts.md).
````

## File: CLAUDE.md
````markdown
# CLAUDE.md — Xuanwu App Context

Quick reference for Claude working in this Next.js 16 + MDDD repository.

## Context

**Xuanwu App**: Next.js 16, React 19, Firebase, Python workers (`py_fn/`)

**Architecture**: Module-Driven Domain Design (MDDD) — 19 bounded-context modules

**Essential**: Read AGENTS.md for rules, commands, and patterns.

## Non-Negotiable Session Contract

- Start every conversation with Serena MCP. If Serena is unavailable, bootstrap it first.
- Serena remains the orchestration lead and decides whether subagents are needed.
- If confidence in any library, framework, or config detail is below 99.99%, use Context7 before generating code.
- Repository orchestration memory and index updates must use Serena tools; do not replace them with direct `.serena/` edits.

## Coordination

- Serena MCP is mandatory for every conversation and remains the orchestration lead.
- Start with Serena to understand the request, gather the needed context, and decide whether subagents are required.
- This file is a Claude compatibility quick reference, not a separate repository governance source. Repo-wide rules live in `AGENTS.md` and `.github/*`.
- When a task touches Claude Code workflow, consult `.claude/settings.json` for hooks and permissions, `.claude/rules/tech-strategy.md` for technology policy, and `.claude/hooks/*` for automation and guards.
- If confidence in any library, framework, or config detail is below 99.99%, use Context7 before generating code.

## Quick Commands

```bash
npm run lint      # ESLint (0 errors)
npm run build     # Type-check + Next.js build
cd py_fn && python -m pytest tests/ -v
```

See [.github/agents/commands.md](.github/agents/commands.md) for full list.

## Key Principles

1. **Module isolation**: `modules/` are bounded contexts — use `api/` boundaries only
2. **Dependency direction**: `UI → App → Domain ← Infrastructure`
3. **Aliases**: Always use `@shared-*`, `@ui-*`, `@lib-*`, `@integration-*` — never `@/`
4. **Runtime split**: Next.js = frontend + orchestration; `py_fn/` = ingestion + workers

## Common Patterns (See AGENTS.md for full examples)

```ts
// Server Action: orchestrate use case, return CommandResult
"use server";
export async function action(input) { return useCase.execute(input); }

// Use Case: `application/use-cases/*.ts` orchestrates domain
// Repository: interface in `domain/`, impl in `infrastructure/`
```

## Full Reference

- **[AGENTS.md](AGENTS.md)** — Complete rules, commands, architecture, patterns
- **[.github/agents/knowledge-base.md](.github/agents/knowledge-base.md)** — Module inventory, tech stack
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** — Copilot delivery workflow
````

## File: docs/beads.md
````markdown
# Beads

AI-native issue tracking. Optional but useful for swarm coordination.

## Install

```bash
curl -sSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
bd init
```

## Commands

```bash
bd create "Task description"          # create
bd ready                              # find work
bd update <id> --status in_progress   # claim
bd close <id> --reason "Done"         # complete
bd sync                               # sync with team
bd doctor                             # health check
```

## Workflow

```
bd ready → claim → work → complete → bd sync
```

## Team Setup

```bash
bd init --branch beads-metadata
bd config set sync.branch "beads-metadata"
```

## Why CLI?

The CLI uses 98% fewer tokens than MCP tool calls.

---

[← Back to README](../README.md)
````

## File: docs/customization.md
````markdown
# Customization

Add your own commands, skills, rules, and hooks.

## Adding a Command

Create `.claude/commands/my-command.md`:

```yaml
---
description: What this command does
---
```

Add command instructions below the frontmatter.

See `.claude/templates/command.template.md` for the full format.

## Adding a Skill

1. Create `.claude/skills/[category]/my-skill/SKILL.md`:

```yaml
---
name: my-skill
description: What it does
---
```

2. Register in `.claude/skills/skill-rules.json`:

```json
{
  "name": "my-skill",
  "path": ".claude/skills/category/my-skill/SKILL.md",
  "triggers": {
    "keywords": ["keyword1", "keyword2"]
  },
  "priority": "medium"
}
```

See `.claude/templates/skill.template.md` for the full format.

## Adding a Rule

Create `.claude/rules/my-rule.md`:

```markdown
# My Rule

Rules here. Keep it short — rules load on every request.
```

Rules auto-load. No registration needed.

## Adding a Hook

See [hooks.md](hooks.md) for the full guide.

Quick version:

1. Create `.claude/hooks/my-hook.sh`
2. `chmod +x .claude/hooks/my-hook.sh`
3. Register in `.claude/settings.json`

## Adding a Swarm Worker

Create `.claude/agents/worker-mytype.md`:

```yaml
---
name: worker-mytype
description: What it does
permissionMode: acceptEdits
model: haiku
---
```

Models: `haiku` (fast), `sonnet` (capable), `opus` (complex reasoning)

Use `permissionMode: default` for workers that should prompt before editing (e.g., explorers).

## Required: Configure Your Tech Stack

**IMPORTANT**: The framework will not align with your project without this step.

Edit `.claude/rules/tech-strategy.md` to match your actual technology choices:

```markdown
### TypeScript
| Component | Choice |
|-----------|--------|
| Runtime | Deno |        # your choice
| Build | esbuild |       # your choice
```

The framework enforces these across all commands. Claude will use the technologies you specify here, not generic defaults.

---

[← Back to README](../README.md)
````

## File: docs/ddd/bounded-contexts.md
````markdown
# Bounded Contexts

This page is the canonical bounded-context map for Xuanwu.

Xuanwu is implemented as a modular monolith. Each context owns its own ubiquitous language, domain model, application logic, and infrastructure adapters. Cross-context collaboration happens through public API surfaces or published domain events.

## Current Inventory

| Domain Type | Context | Ownership | Reference |
|---|---|---|---|
| Core Domain | `knowledge` | Knowledge pages, content blocks, versions, approvals, and collection-level content lifecycle. | [modules/knowledge/README.md](../../modules/knowledge/README.md) |
| Core Domain | `knowledge-base` | Organizational articles, categories, wiki-grade publishing, verification, and shared knowledge assets. | [modules/knowledge-base/README.md](../../modules/knowledge-base/README.md) |
| Supporting Subdomain | `ai` | Ingestion jobs, parsing/chunking handoff, and indexing preparation. | [modules/ai/README.md](../../modules/ai/README.md) |
| Supporting Subdomain | `knowledge-collaboration` | Comments, permissions, and immutable version snapshots for knowledge content. | [modules/knowledge-collaboration/README.md](../../modules/knowledge-collaboration/README.md) |
| Supporting Subdomain | `knowledge-database` | Structured database schemas, records, views, and relation-oriented data work. | [modules/knowledge-database/README.md](../../modules/knowledge-database/README.md) |
| Supporting Subdomain | `notebook` | Workspace-scoped research, ask/cite, summary, and knowledge-generation flows. | [modules/notebook/README.md](../../modules/notebook/README.md) |
| Supporting Subdomain | `search` | Retrieval, ranking, citation context, and semantic query support. | [modules/search/README.md](../../modules/search/README.md) |
| Supporting Subdomain | `source` | External files, source collections, ingestion handoff, and source governance. | [modules/source/README.md](../../modules/source/README.md) |
| Supporting Subdomain | `workspace-audit` | Audit logging and governance traceability. | [modules/workspace-audit/README.md](../../modules/workspace-audit/README.md) |
| Supporting Subdomain | `workspace-feed` | Activity stream, replies, reactions, and collaboration visibility. | [modules/workspace-feed/README.md](../../modules/workspace-feed/README.md) |
| Supporting Subdomain | `workspace-flow` | Task, issue, and invoice workflow state machines derived from knowledge and operational policy. | [modules/workspace-flow/README.md](../../modules/workspace-flow/README.md) |
| Supporting Subdomain | `workspace-scheduling` | Scheduling windows, work demands, and capacity allocation. | [modules/workspace-scheduling/README.md](../../modules/workspace-scheduling/README.md) |
| Generic Subdomain | `identity` | Authentication and verified user identity. | [modules/identity/README.md](../../modules/identity/README.md) |
| Generic Subdomain | `account` | User account semantics, policy, profile, and personalization. | [modules/account/README.md](../../modules/account/README.md) |
| Generic Subdomain | `organization` | Multi-tenant organization governance, teams, and member relationships. | [modules/organization/README.md](../../modules/organization/README.md) |
| Generic Subdomain | `workspace` | Workspace container, workspace membership, and workspace-scoped composition. | [modules/workspace/README.md](../../modules/workspace/README.md) |
| Generic Subdomain | `notification` | Notification preferences and outbound signals. | [modules/notification/README.md](../../modules/notification/README.md) |
| Shared Kernel | `shared` | Shared events, slug utilities, and cross-context domain primitives. | [modules/shared/README.md](../../modules/shared/README.md) |

## Communication Model

- Synchronous collaboration must go through the target context's public `api/` surface.
- Asynchronous collaboration must go through published domain events or other explicit contracts.
- External models must be translated at the edge through anti-corruption adapters instead of entering the domain layer unchanged.

## Product-Level Reading Path

1. Read [subdomains.md](./subdomains.md) for strategic classification.
2. Use this page to find context ownership.
3. Read the corresponding `modules/<context>/README.md` and companion markdown files for ubiquitous language, aggregates, events, repositories, and context maps.

## Historical Notes

- `wiki` is no longer a standalone bounded context.
- `knowledge-graph`, `retrieval`, `agent`, `content`, and `asset` should only appear as historical migration context unless a document explicitly states otherwise.
- `modules/system.ts` remains a composition root and is excluded from the bounded-context inventory.
````

## File: docs/ddd/subdomains.md
````markdown
# Subdomains

This page is the strategic classification entry point for Xuanwu's Module-Driven Domain Design model.

Xuanwu is a personal- and organization-oriented Knowledge Platform. Its product goal is to bring documents, notes, knowledge pages, knowledge-base articles, structured data, and external sources into one governable workspace system so knowledge can be preserved, verified, retrieved, reasoned over, and turned into executable work.

## Strategic Classification

### Core Domains

| Context | Why it differentiates Xuanwu | Detail |
|---|---|---|
| `knowledge` | Owns the Notion-like knowledge content lifecycle: pages, blocks, versions, approval, and collection-level content structure. | [modules/knowledge/README.md](../../modules/knowledge/README.md) |
| `knowledge-base` | Owns organizational wiki, SOP, and article-grade knowledge assets that are shareable, verifiable, and category-driven. | [modules/knowledge-base/README.md](../../modules/knowledge-base/README.md) |

### Supporting Subdomains

| Context | Role | Detail |
|---|---|---|
| `ai` | Ingestion orchestration, chunk preparation, and indexing handoff for downstream retrieval and reasoning. | [modules/ai/README.md](../../modules/ai/README.md) |
| `knowledge-collaboration` | Comments, permissions, and version snapshots for knowledge-centric collaboration. | [modules/knowledge-collaboration/README.md](../../modules/knowledge-collaboration/README.md) |
| `knowledge-database` | Structured database capability for schema, records, and multi-view exploration. | [modules/knowledge-database/README.md](../../modules/knowledge-database/README.md) |
| `notebook` | Research, ask/cite, summary, and knowledge-generation workflow over retrieved context. | [modules/notebook/README.md](../../modules/notebook/README.md) |
| `search` | Semantic retrieval and answer-context assembly with traceable citations. | [modules/search/README.md](../../modules/search/README.md) |
| `source` | External document and source ingestion entrypoint. | [modules/source/README.md](../../modules/source/README.md) |
| `workspace-audit` | Append-only audit trail for governability and traceability. | [modules/workspace-audit/README.md](../../modules/workspace-audit/README.md) |
| `workspace-feed` | Activity stream and social visibility layer for workspace collaboration. | [modules/workspace-feed/README.md](../../modules/workspace-feed/README.md) |
| `workspace-flow` | Task, issue, and invoice materialization from approved knowledge and workflow policy. | [modules/workspace-flow/README.md](../../modules/workspace-flow/README.md) |
| `workspace-scheduling` | Scheduling, time windows, and capacity coordination for work demands. | [modules/workspace-scheduling/README.md](../../modules/workspace-scheduling/README.md) |

### Generic Subdomains

| Context | Role | Detail |
|---|---|---|
| `identity` | Authentication and token lifecycle. | [modules/identity/README.md](../../modules/identity/README.md) |
| `account` | User profile, account policy, and personalization semantics. | [modules/account/README.md](../../modules/account/README.md) |
| `organization` | Tenant, team, member, and organization-level governance boundary. | [modules/organization/README.md](../../modules/organization/README.md) |
| `workspace` | Primary collaboration container for all knowledge, sources, activity, and workflow state. | [modules/workspace/README.md](../../modules/workspace/README.md) |
| `notification` | Notification delivery and preference-controlled signaling. | [modules/notification/README.md](../../modules/notification/README.md) |

### Shared Kernel

| Context | Role | Detail |
|---|---|---|
| `shared` | Shared domain primitives such as events, slugs, and common contracts used across bounded contexts. | [modules/shared/README.md](../../modules/shared/README.md) |

## External Integration Boundary

Xuanwu does not allow external system models to flow directly into the core domains. External files, document systems, storage events, and AI service contracts enter through source-facing workflows and per-context infrastructure adapters that act as anti-corruption boundaries.

## Historical Notes

- The historical `wiki` module was decomposed. Current responsibilities are distributed across `knowledge`, `knowledge-base`, `knowledge-collaboration`, `knowledge-database`, `search`, and `notebook` depending on ownership.
- The historical `event` and `namespace` modules were folded into `shared`.
- `modules/system.ts` is a composition root, not a bounded context.
````

## File: docs/development/modules-implementation-guide.md
````markdown
# Modules Implementation Guide

本文件是 `modules/` 的實作導向說明，並對齊上位概念架構文件的設計方向。

- 上位概念架構文件：回答「為什麼」與「系統如何分層」。
- 本文件：回答「在 repository 內如何落地」。

---

## 1. 與概念架構文件的對位關係

上位概念架構文件描述的是產品能力如何融合，而不是舊模組拓樸的直接投影。

在目前 repository 中，較穩定的對位方式如下：

| 概念層（Architecture） | 主要承載位置（Implementation） | 說明 |
| --- | --- | --- |
| Knowledge Experience Layer | `app/` + `modules/knowledge` + `modules/knowledge-base` + `modules/knowledge-database` + `modules/source` | 頁面、文章、資料庫、來源與工作區中的知識入口 |
| Governance / Collaboration Layer | `modules/workspace`, `modules/organization`, `modules/account`, `modules/workspace-*`, `modules/notification` | 租戶、工作區、流程、排程、稽核與協作治理 |
| Retrieval / Notebook Layer | `modules/ai` + `modules/search` + `modules/notebook` + `py_fn/` | ingestion、retrieval、ask/cite、摘要與知識生成工作流 |

> 原則：概念融合不代表模組耦合。融合在「體驗層」，隔離在「模組邊界」。

---

## 2. module 標準結構（MDDD）

```text
<domain-id>/
│
├── api/
│   └── index.ts
│
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/
│   ├── services/
│   └── events/
│
├── application/
│   ├── use-cases/
│   └── dto/
│
├── infrastructure/
│   ├── firebase/
│   ├── persistence/
│   ├── external/
│   └── repositories/
│
├── interfaces/
│   ├── _actions/
│   ├── api/
│   ├── queries/
│   ├── hooks/
│   └── components/
│
```

說明：

1. 不是每個 module 都需要全部子目錄，依 bounded context 取用。
2. 跨 module 存取僅能走目標 module 的 `api/` 公開邊界。
3. module 內部檔案使用相對路徑，不自我 import `api/` 邊界。

---

## 3. 依賴方向與邊界

全域依賴方向：

```text
interfaces -> application -> domain <- infrastructure
```

邊界規則：

1. `domain/` 不得依賴 framework 與外部 SDK。
2. `application/` 負責流程編排，不直接綁定具體外部實作。
3. `infrastructure/` 實作 domain 介面，不主導業務流程。
4. `interfaces/` 僅做輸入輸出適配（UI、API、Server Action、Query）。

---

## 4. 與 packages 的關係

模組共用能力必須透過 `packages/` 的 alias（例如 `@shared-types`, `@integration-firebase`, `@ui-shadcn`）使用，不直接耦合其他模組內部。

```text
modules/*
  -> packages/* (stable public boundary)
```

這個原則與上位概念架構文件的三層融合不衝突：

- 融合的是產品能力（編輯 + 關聯 + AI）
- 隔離的是程式邊界（module `api/` boundary + package boundary）

---

## 5. Next.js 路由與融合介面

上位概念架構文件的基礎平行路由示意：

```text
/workspace
    /@editor
    /@graph
    /@chat
    /@database
```

實作可依需求擴充，例如：

```text
/workspace
    /@editor
    /@graph
    /@chat
    /@database
    /@collab
    /@workflow
```

擴充原則：

1. 新 slot 必須能回對到既有 module ownership。
2. 不因 UI slot 增加而破壞 MDDD 依賴方向。

---

## 6. 目標對齊聲明

本文件以上位概念架構文件為基礎，並將其轉換為可執行的 module implementation 規範：

1. 保留內容體驗、知識關聯與 AI 能力的融合方向。
2. 明確化「融合體驗」與「邊界隔離」可同時成立。
3. 用 MDDD 與 package boundary 落地，避免跨模組內部耦合。

---

## 7. 以上位概念架構文件為準的落地限制

上位概念架構文件提供的是概念模型，不是額外的 canonical module map、固定領域數量或一次性規劃清單。

因此本文件只保留與概念模型一致的落地限制：

1. Notion 對應的是內容編輯與資料庫體驗，不等於整個知識域或單一模組。
2. Wiki-like 體驗在目前系統中分散於 `knowledge`、`knowledge-base`、`workspace` 與 `search` 等 bounded context，不應再回推成單一 `modules/wiki` owner。
3. NotebookLM 對應的是文件理解、檢索、問答與推理能力，不等於所有 AI 邏輯都可以脫離既有 runtime boundary。
4. 三層融合描述的是產品體驗，不直接推導出固定的模組數量、模組命名或跨模組 ownership。

## 8. 實作規劃時的最小檢查點

若要把三層模型落到實際模組，至少先確認：

1. 需求是在補強 Knowledge Experience、Governance / Collaboration、還是 Retrieval / Notebook 哪一層。
2. 新能力的 owner 是否已存在於目前 module inventory；若不存在，再依 MDDD 原則判斷是否需要新 bounded context。
3. 跨模組互動是否只經過目標模組的 `api/` 邊界。
4. UI 組裝、知識關聯、AI orchestration 是否仍維持 `interfaces -> application -> domain <- infrastructure`。
5. 若文件只是概念說明，不額外發明上位概念架構文件未定義的 canonical schema、固定規劃數量或模組對照表。
````

## File: docs/development/README.md
````markdown
# Development

This section contains repository-local implementation guidance for Xuanwu contributors.

## Entry Points

- [modules-implementation-guide.md](./modules-implementation-guide.md): how the repository maps architecture into `modules/`, `app/`, `packages/`, and `py_fn/`
- [../ddd/subdomains.md](../ddd/subdomains.md): strategic domain classification
- [../ddd/bounded-contexts.md](../ddd/bounded-contexts.md): current bounded-context inventory
- [../architecture/README.md](../architecture/README.md): cross-context architecture reading path
- [../../AGENTS.md](../../AGENTS.md): repository-wide commands, rules, and delivery expectations

## Working Rules

1. Resolve ownership from `docs/ddd/` first, then read the corresponding `modules/<context>/*.md` files.
2. Keep cross-context access on public `api/` boundaries or explicit domain events.
3. Treat `Next.js` and `py_fn/` as separate runtime boundaries with different responsibilities.
4. Update documentation in the same change when module ownership, public contracts, or product language changes.

## Validation

- Web runtime: `npm run lint`, `npm run build`
- Python worker: `cd py_fn && python -m compileall -q .`, `cd py_fn && python -m pytest tests/ -v`
````

## File: docs/getting-started.md
````markdown
# Getting Started

This guide gets a contributor from clone to a working local Xuanwu environment.

## Prerequisites

- Node.js 24
- npm
- Python environment compatible with `py_fn/requirements.txt` if you need to run worker validation

## Install Dependencies

```bash
npm install
```

## Start the App

```bash
npm run dev
```

The default development surface is the Next.js app. The authenticated shell is workspace-first and routes users into knowledge, source, knowledge-base, knowledge-database, and notebook workflows.

## Validate the Repository

Run the web validation commands:

```bash
npm run lint
npm run build
```

Run the Python worker checks when your change touches `py_fn/` or ingestion-related contracts:

```bash
cd py_fn
python -m compileall -q .
python -m pytest tests/ -v
```

## Read the Right Docs First

1. [../README.md](../README.md) for product and architecture summary
2. [ddd/subdomains.md](./ddd/subdomains.md) for strategic domain classification
3. [ddd/bounded-contexts.md](./ddd/bounded-contexts.md) for the current bounded-context inventory
4. [architecture/README.md](./architecture/README.md) for cross-context architecture reading paths
5. [development/README.md](./development/README.md) for repository-local implementation guidance

## Internal AI Delivery Docs

Files such as [swarm.md](./swarm.md), [beads.md](./beads.md), and [customization.md](./customization.md) document the repository's internal AI delivery workflow. They are useful for maintainers, but they are not the product entrypoint for understanding Xuanwu itself.

---

[← Back to README](../README.md)
````

## File: docs/guides/explanation/architecture-domain.md
````markdown
# 領域概念模型：Xuanwu Knowledge Platform 實現指南

本文說明 Xuanwu 目前如何把知識平台概念落到實際儲存庫。`architecture.md` 提供產品與體驗層的概念來源，但目前的 canonical ownership 以 `docs/ddd/subdomains.md`、`docs/ddd/bounded-contexts.md` 與各 `modules/<context>/*.md` 為準。

---

## 一、目前的架構視角

Xuanwu 是一個以知識為核心的 modular monolith。從工程落位來看，可以用下列視角理解它：

```text
App Composition / UX Orchestration
  -> app/, providers/, server actions, route slices

Foundation & Governance
  -> identity, account, organization, workspace, notification, shared,
     workspace-audit, workspace-feed, workspace-flow, workspace-scheduling

Knowledge Experience
  -> knowledge, knowledge-base, knowledge-collaboration,
     knowledge-database, source

Retrieval & Reasoning
  -> ai, search, notebook

Worker Runtime
  -> py_fn/ (parse, chunk, embed, background ingestion)
```

| 視角 | 主要 bounded contexts | 說明 |
| --- | --- | --- |
| Foundation & Governance | `identity`, `account`, `organization`, `workspace`, `notification`, `shared`, `workspace-*` | 提供身份、帳戶、租戶、工作區容器、治理、稽核、流程與排程能力。 |
| Knowledge Experience | `knowledge`, `knowledge-base`, `knowledge-collaboration`, `knowledge-database`, `source` | 承接頁面、文章、資料庫、協作與外部來源治理。 |
| Retrieval & Reasoning | `ai`, `search`, `notebook` | 承接 ingestion orchestration、semantic retrieval、ask/cite、摘要與知識生成。 |

這個分層是理解用的工程視角，不代表額外的 framework layer。真正的 owner 仍然是 bounded context 本身。

---

## 二、核心領域概念

### 2.1 Knowledge Experience

| Bounded Context | 代表概念 | 角色 |
| --- | --- | --- |
| `knowledge` | `KnowledgePage`, `ContentBlock`, `ContentVersion`, `KnowledgeCollection` | 承接 Notion-like 頁面、區塊、版本與頁面審批生命週期。 |
| `knowledge-base` | `Article`, `Category` | 承接組織級 article、SOP、wiki-like 發布與驗證。 |
| `knowledge-collaboration` | Comment、Permission、Version Snapshot | 承接知識內容的協作、評論、權限與版本快照。 |
| `knowledge-database` | Database、Record、View | 承接結構化資料庫、欄位、資料列與多視圖工作流。 |
| `source` | File、Source Collection、`WikiLibrary`（歷史命名） | 承接外部文件、來源集合、上傳與 ingestion 邊界。 |

`knowledge` 與 `knowledge-base` 是目前最核心的 differentiating domains：前者擁有知識頁面與可編輯內容生命週期，後者擁有組織級知識資產與可驗證發布語意。

### 2.2 Retrieval & Reasoning

| Bounded Context | 代表概念 | 角色 |
| --- | --- | --- |
| `ai` | `IngestionJob`, stage progression, chunk/index preparation | 協調文件攝入、worker handoff 與 ingestion 狀態流轉。 |
| `search` | `RagRetrievedChunk`, `RagCitation`, retrieval summary, `WikiCitation`（歷史命名） | 承接 semantic retrieval、citation context、query support。 |
| `notebook` | Thread、Message、Notebook Generation | 承接 ask/cite、摘要、研究與知識生成體驗。 |

### 2.3 Foundation、Execution 與治理

| Bounded Context | 代表概念 | 角色 |
| --- | --- | --- |
| `workspace` | `Workspace`, `Capability`, `WorkspaceGrant`, `WikiContentTree`（歷史命名） | 提供知識與流程掛載的協作容器。 |
| `workspace-flow` | Task、Issue、Invoice、`SourceReference` | 將知識審批結果物化為可執行工作流程。 |
| `workspace-feed` | Feed Post、Reaction、Reply | 承接工作區活動流與互動可見性。 |
| `workspace-scheduling` | Work Demand、capacity coordination | 承接排程與需求對齊。 |
| `workspace-audit` | append-only audit records | 承接治理與 traceability。 |
| `identity`, `account`, `organization`, `notification`, `shared` | identity、policy、tenant、notification、event primitives | 提供平台共通基礎能力。 |

---

## 三、跨上下文契約

Xuanwu 的跨上下文協作不透過隱式共享實作，而透過 public `api/` surface 或 published domain events。

| 上游 | 契約 | 下游 | 說明 |
| --- | --- | --- | --- |
| `knowledge` | `knowledge.page_approved` | `workspace-flow` | 將審批後的知識頁面物化為 Task / Invoice，並保留 `sourceReference`。 |
| `knowledge` | `knowledge.page_promoted` | `knowledge-base` | 將頁面提升為組織級 article 或其他知識資產。 |
| `knowledge` | `knowledge.block_updated` | `ai` / `search` | 觸發 ingestion 或可檢索表示的重整。 |
| `source` | source registration / ingestion request | `ai` | 外部內容先經來源邊界，再進入 ingestion pipeline。 |
| `ai` | `ai.ingestion_completed` | `search` | 宣告內容已進入可檢索狀態。 |
| `search` | `search/api` | `notebook` | Notebook 透過同步查詢取得 ask/cite 與 retrieval context。 |
| `organization` / `workspace` | workspace / tenant policy | `workspace-*`, `knowledge*`, `source` | 提供治理與容器邊界。 |

這些契約的重點不在名詞本身，而在 owner 清楚、方向單向、語意穩定。

---

## 四、執行時與邊界

### 4.1 Runtime Split

| Runtime | 主要責任 |
| --- | --- |
| Next.js | UI、session/auth orchestration、route composition、Server Actions、workspace-scoped interaction flow |
| `py_fn/` | parsing、chunking、embedding、背景 ingestion 與 worker-style pipeline |

Next.js 不承接 parse/chunk/embed 的 worker 邏輯；`py_fn/` 不承接頁面組裝、session 狀態或互動式 UI 邏輯。

### 4.2 邊界規則

1. 跨模組同步互動只能走目標模組的 `api/` surface。
2. 非同步互動只能走 domain events 或其他顯式契約。
3. 外部系統模型不得直接流入 core domain，必須先經 `source` workflow 或 infrastructure adapters 轉譯。
4. bounded-context 細節文件由 `modules/<context>/*.md` 擁有；`docs/ddd/` 只作為戰略 routing 與入口。

---

## 五、歷史術語與過渡規則

下列名稱已不是 current bounded-context owners，只能在歷史、遷移或 compatibility 說明中出現：

- `wiki`
- `knowledge-graph`
- `retrieval`
- `agent`
- `content`
- `asset`

不過部分型別或局部名稱仍保留歷史詞彙，例如 `WikiLibrary`、`WikiCitation`、`WikiContentTree`。這些名稱應被理解為目前 owner 之下的歷史局部語彙，而不是新的模組邊界。

若未來要恢復 backlink、graph traversal、redirect graph、entity normalization 等能力，必須先在目前 topology 下重新決定 owner。合理候選通常會是：

- `search`：偏檢索與結構查詢能力
- `knowledge`：偏內容關聯與頁面語意能力
- 新 supporting subdomain：若該能力已形成獨立模型與生命週期

---

## 六、閱讀順序

1. 先讀 `docs/ddd/subdomains.md`，確認 strategic classification。
2. 再讀 `docs/ddd/bounded-contexts.md`，確認目前 bounded-context inventory。
3. 依需要進入 `modules/<context>/README.md`、`ubiquitous-language.md`、`aggregates.md`、`domain-events.md`、`repositories.md`、`domain-services.md`。
4. 最後讀 `docs/architecture/` 與 `docs/reference/specification/system-overview.md`，理解跨上下文與 runtime 邊界。

---

本文件的目的是把產品概念與現行 bounded-context 拓樸對齊，而不是維護一份脫離程式碼的「理想模組表」。當實作演進時，應優先更新 `docs/ddd/` root maps 與對應 module docs，再回來同步這份 explanation。
````

## File: docs/guides/explanation/architecture.md
````markdown
# 「Notion × Wiki × NotebookLM」融合架構學術指南

AI 知識系統與產品架構設計方法論（完整強化版）

---

## 一、研究背景：現代知識系統的三種典範

當代知識管理與文件系統，大致可分為三種代表性工具與架構思想：Notion、Wikipedia（Wiki 系統代表）、NotebookLM。這三者分別代表三種不同的知識系統設計哲學：

| 系統 | 核心模型 | 強項 |
| --- | --- | --- |
| Notion | Block + Database | UI / UX / 工作管理 |
| Wiki | Page + Link Graph | 知識結構 / 關聯 |
| NotebookLM | Document + Embedding | AI / RAG / 推理 |

產品級知識平台的發展方向不是選其中一個，而是三者融合。

---

## 二、Notion 核心功能完整解析

Notion 是以 Block Editor + Database System 為核心的工作空間平台，其設計哲學是「讓內容好整理、好使用」。

### 2.1 Block 系統（核心內容單元）

Notion 的最小單位是 Block，每個 Block 可獨立拖曳、轉換類型，並支援巢狀結構。

| Block 類型 | 說明 | 對應用途 |
| --- | --- | --- |
| Text / Heading | 純文字、H1 / H2 / H3 標題 | 文件撰寫 |
| Toggle | 可折疊的內容區塊 | FAQ / 摘要 |
| Callout | 強調提示框（含 emoji icon） | 警告 / 提示 |
| Code Block | 多語言語法高亮程式碼區塊 | 技術文件 |
| Quote | 引用樣式區塊 | 引言 / 備注 |
| Divider | 水平分隔線 | 版面分隔 |
| Table | 簡易表格（非 Database） | 靜態對比 |
| Image / Video / File | 媒體嵌入與檔案附件 | 富媒體內容 |
| Embed | 外部服務嵌入（Figma / YouTube / Map） | 整合外部工具 |
| Synced Block | 跨頁面同步區塊（修改一處全更新） | 共用內容模組 |
| Column Layout | 多欄排版（左右並排內容） | 版面設計 |
| Breadcrumb | 自動顯示頁面路徑麵包屑 | 導覽 |
| Table of Contents | 自動從 Heading 生成目錄 | 長文件導航 |

### 2.2 Database 系統（結構化資料核心）

Notion Database 是其最強大的功能，支援多種視圖與豐富的 Property 類型，本質是 NoSQL + 試算表的融合。

#### Database 視圖類型

| 視圖類型 | 說明 | 適用場景 |
| --- | --- | --- |
| Table View | 試算表式橫列縱欄顯示 | 資料總覽 / CRM |
| Board View | Kanban 看板（以 Select property 分欄） | 專案管理 / 工作流 |
| Gallery View | 卡片式圖片陳列 | 作品集 / 產品型錄 |
| List View | 簡潔清單（顯示標題 + 少量欄位） | 任務清單 / 閱讀清單 |
| Calendar View | 以日期 property 排列的月曆 | 排程 / 內容日曆 |
| Timeline View | 甘特圖式時間軸 | 專案時程規劃 |

#### Database Property 類型

| Property 類型 | 說明 |
| --- | --- |
| Text | 短文字或長文字輸入 |
| Number | 數字（支援格式化：貨幣、百分比、進度條） |
| Select | 單選下拉選單（含顏色標記） |
| Multi-select | 多選標籤 |
| Date | 日期 / 日期範圍 / 含提醒 |
| Checkbox | 完成狀態切換 |
| URL / Email / Phone | 格式化超連結輸入 |
| Person | 指定工作區成員 |
| Files & Media | 附件上傳 |
| Relation | 跨 Database 關聯（外鍵概念） |
| Rollup | 彙整 Relation 資料（sum / count / avg） |
| Formula | 自定義計算公式（引用其他 property） |
| Created time / Last edited time | 自動時間戳 |
| Created by / Last edited by | 自動記錄操作者 |
| ID | 自動遞增唯一識別碼 |
| Status | 工作流狀態（Not started / In progress / Done） |
| Button | 一鍵觸發動作（自動化 Action） |
| AI Property | 自動 AI 摘要 / 填寫（Notion AI 功能） |

### 2.3 Page 系統與導覽架構

| 功能 | 說明 |
| --- | --- |
| Page Tree（側邊欄） | 層階樹狀頁面結構，支援無限巢狀 |
| Breadcrumb | 頁面路徑顯示，支援快速跳轉 |
| Page Icon & Cover | 頁面圖示（emoji / 自訂圖片）與封面圖 |
| Sub-page | 頁面內建立子頁面（Block 形式嵌入） |
| Page Link / Mention | @mention 連結其他頁面（非雙向連結） |
| Favorites | 常用頁面加入收藏 |
| Backlinks | 顯示哪些頁面連結到此頁（弱版 Graph） |
| Page Lock | 鎖定頁面防止意外編輯 |

### 2.4 協作功能

| 功能 | 說明 |
| --- | --- |
| Real-time Collaboration | 多人同時編輯（即時同步） |
| Comment & Discussion | Block 層級留言與討論串 |
| Mention (@) | 提及成員觸發通知 |
| Page History | 頁面版本歷程（30 天 / 無限，依方案） |
| Permission System | 頁面層級權限（Full access / Can edit / Can comment / Can view） |
| Guest Access | 邀請外部用戶單頁存取 |
| Share to Web | 公開發布頁面為網頁 |
| Export | 匯出為 PDF / Markdown / HTML / CSV |

### 2.5 自動化與整合

| 功能 | 說明 |
| --- | --- |
| Notion AI | 內建 AI 寫作助手（摘要 / 翻譯 / 改寫 / Q&A） |
| Automation | Database 觸發自動化（當狀態改變時發通知 / 修改欄位） |
| API | 開放 REST API 供外部系統整合 |
| Webhook | 事件觸發 Webhook（搭配 Zapier / Make） |
| Template | 頁面與 Database 模板系統 |
| Import | 從 Confluence / Evernote / Markdown / CSV 匯入 |

---

## 三、Wiki 核心功能完整解析

Wiki 系統（以 Wikipedia / Confluence / MediaWiki 為代表）的本質是 Knowledge Graph，設計哲學是「讓知識彼此連結」。

### 3.1 頁面系統（Page = Graph Node）

| 功能 | 說明 |
| --- | --- |
| Page CRUD | 頁面建立 / 讀取 / 更新 / 刪除 |
| Namespace | 命名空間分類（Talk: / User: / Category: / File:） |
| Redirect | 重定向頁面（別名統一導向主條目） |
| Disambiguation | 消歧義頁面（同名詞條分流） |
| Stub | 不完整頁面標記（待補全提示） |
| Featured Article | 優質條目標記系統 |
| Page Protection | 頁面保護（防止匿名 / 新手 / 所有人編輯） |
| Transclusion | 跨頁面內容嵌入（Template 系統核心機制） |

### 3.2 連結與圖譜系統（Graph Model 核心）

| 功能 | 說明 | 技術意義 |
| --- | --- | --- |
| Internal Link | `[[頁面名稱]]` 雙方括號語法建立連結 | Knowledge Graph Edge |
| Backlinks | 自動追蹤「哪些頁面連結到此頁」 | 入度（In-degree）計算 |
| Redirect Link | 別名連結（同義詞指向正式頁面） | Entity Normalization |
| External Link | 引用外部網站 URL | 外部知識引用 |
| Interwiki Link | 跨 Wiki 站點連結（跨語言 / 跨站） | Federation |
| Category Link | 頁面隸屬分類（可多重分類） | Taxonomic Edge |
| Link Graph | 全站頁面連結視覺化圖譜 | Knowledge Map |
| Dead Link Detection | 偵測失效連結（紅色顯示） | Graph 完整性維護 |

### 3.3 版本控制系統（Version Control）

Wiki 的版本控制是其核心能力，每次編輯均自動快照，支援完整的比對與回溯。

| 功能 | 說明 |
| --- | --- |
| Edit History | 每次編輯自動記錄版本（含時間 / 作者 / 摘要） |
| Diff View | 逐行比對任意兩版本差異（增刪標色顯示） |
| Rollback | 一鍵回溯到任意歷史版本 |
| Blame（Annotate） | 每一行內容對應到最後一次修改的作者與版本 |
| Edit Summary | 每次提交附帶編輯說明（類似 Git commit message） |
| Minor Edit Flag | 標記為小修改（拼字更正 / 格式調整） |
| Pending Changes | 新手編輯需審核後才公開顯示 |
| Page Move History | 頁面重命名歷程追蹤（自動建立重定向） |

### 3.4 分類與標籤系統（Taxonomy Layer）

| 功能 | 說明 |
| --- | --- |
| Category System | 樹狀分類系統（Category 可繼承 / 巢狀） |
| Category Intersection | 多分類交集查詢（找同屬 A 且屬 B 的頁面） |
| Category Tree | 分類層級視覺化（根分類 → 子分類 → 頁面） |
| Template Tags | Template 作為語意標記（如 `{{Unreferenced}}` `{{Stub}}`） |
| Wikidata Integration | 連接結構化知識庫（Q-number 實體對齊） |

### 3.5 編輯與協作系統

| 功能 | 說明 |
| --- | --- |
| Wikitext / Markup | Wiki 專屬標記語法（`== 標題 ==` / `[[ ]]` 連結 / `{{ }}` Template） |
| Visual Editor | WYSIWYG 視覺化編輯器（無需學習 Wikitext） |
| Talk Page | 每個條目附帶討論頁（編輯協商空間） |
| User Page | 編輯者個人頁面（貢獻記錄 / 自我介紹） |
| Watchlist | 追蹤關注頁面的最新修改通知 |
| Edit Conflict Detection | 多人同時編輯時的衝突偵測與合併提示 |
| Rollback Permission | 快速回退惡意編輯（巡查員權限） |
| Patrol System | 新編輯標記「待審」，巡查員審核後標記通過 |

### 3.6 搜尋與導覽系統

| 功能 | 說明 |
| --- | --- |
| Full-text Search | 全文搜尋（含拼字糾正 / 近似詞匹配） |
| Prefix Search | 即時搜尋建議（輸入前綴自動補全） |
| Search by Category | 依分類篩選搜尋結果 |
| Special Pages | 系統自動生成的特殊頁面（孤立頁 / 死連結 / 最多連結頁） |
| Random Article | 隨機跳轉條目（知識探索功能） |
| What Links Here | 查詢哪些頁面連結到指定頁面（Backlink 探索） |
| Related Changes | 追蹤某頁面所有連結頁面的最新修改 |

### 3.7 Template 系統（知識模組化）

Template 是 Wiki 的代碼模組化機制，相當於 Wiki 的「元件系統」。

| 功能 | 說明 |
| --- | --- |
| Infobox Template | 右側資訊框（人物 / 地點 / 電影等結構化屬性） |
| Navigation Template | 底部導覽區塊（同系列條目快速跳轉） |
| Citation Template | 標準化引用格式（書籍 / 網站 / 期刊 cite 模板） |
| Warning Template | 條目品質警告標記（`{{POV}}` `{{Cleanup}}` 等） |
| Parameterized Template | 支援傳入參數的動態 Template（`{{{1}}}` 佔位符） |
| Transclusion | Template 內容直接嵌入目標頁面（非複製） |

---

## 四、Wiki 與 Notion 的本質差異（資料模型層）

### 4.1 Wiki：Graph Model（知識圖）

Wiki 系統本質資料模型：

```text
Page = Node
Link = Edge
→ Knowledge Graph
```

資料結構：pages / links / versions / categories / templates

特徵：
- 強調「知識與知識之間的關係」
- 非階層式，可形成網狀結構
- 雙向連結（Backlinks 自動維護）
- 適合知識庫、技術文件、研究資料

### 4.2 Notion：Block + Tree Model（內容結構）

Notion 資料模型：

```text
Page
 └── Blocks
     ├── Text
     ├── Heading
     ├── Table
     ├── Toggle
     └── Image
```

資料結構：pages / blocks / databases / properties / automations

特徵：
- 強調排版、資料表、UI 操作
- Relation property（單向 / 雙向）+ @mention（弱連結）
- 適合專案管理、文件、筆記、CRM

### 4.3 核心哲學差異對比

| 面向 | Wiki | Notion |
| --- | --- | --- |
| 核心 | 知識關聯 | 工作與內容 |
| 資料模型 | Graph | Tree + Database |
| 單位 | Page | Page + Block |
| 關聯 | Page Link（圖邊） | Relation Database（外鍵） |
| 連結方向 | 雙向（Backlink 追蹤） | 單向 / 雙向（需設定） |
| 版本控制 | 原生 Diff / Rollback | History（依方案） |
| 分類 | Category Tree（圖節點） | Tag / Filter（屬性） |
| Template | Transclusion 嵌入 | Template 頁面（複製） |
| 協作模式 | 開放編輯 + 審核制度 | 權限管理 + 即時協作 |
| 搜尋 | 全文 + Backlink + 分類 | 全文 + Database Filter |
| 強項 | 知識網絡 | UX / UI / 工作流 |
| 用途 | 知識庫 | 工作空間 |
| 思維 | Knowledge Graph | Structured Workspace |

關鍵一句話差異：
- **Wiki**：讓知識彼此連結
- **Notion**：讓內容好整理、好使用

---

## 五、NotebookLM 的角色（AI 層）

NotebookLM 代表第三種系統：AI 知識系統模型（RAG）。

資料流程：

```text
Documents
   ↓
Chunking
   ↓
Embedding
   ↓
Vector Database
   ↓
Retrieval
   ↓
LLM
   ↓
Answer / Summary / Reasoning
```

這種架構稱為：Retrieval-Augmented Generation（RAG）。

NotebookLM 本質不是筆記工具，而是 `AI Knowledge Reasoning System`，解決：文件理解、問答、摘要、推理、跨文件分析。

---

## 六、Query Understanding Layer（查詢理解層）

在使用者輸入問題到 RAG 系統之間，存在一層「查詢理解層」，負責解析、拆解與轉化查詢意圖。

### Query Planner 架構

```text
User Input
    ↓
Query Understanding Layer
    ├── Intent Classification（意圖分類）
    ├── Query Decomposition（查詢拆解）
    ├── Query Rewriting（查詢改寫）
    ├── Hypothetical Document Embedding (HyDE)
    └── Sub-query Generation（子查詢生成）
    ↓
Retrieval Layer
```

### 核心功能

| 功能 | 說明 |
| --- | --- |
| Intent Classification | 分類：問答 / 摘要 / 比較 / 推理 |
| Query Decomposition | 複雜問題拆成多個子問題 |
| Query Rewriting | 改寫為更適合向量搜尋的語句 |
| HyDE | 先生成假設文件再做 embedding 搜尋 |
| Multi-step Planning | 規劃多步推理路徑 |

Query Understanding 是提升 RAG 精準度的關鍵前處理層。

---

## 七、AI Memory Layer（三層記憶架構）

NotebookLM 的「記憶」由三種記憶類型組成：

```text
AI Memory Layer
├── 1. Semantic Memory（語意記憶）
│       → Embedding / Vector Database
├── 2. Episodic Memory（互動記憶）
│       → User Interaction History / Sessions
└── 3. Working Memory（上下文記憶）
        → Current Chat Context Window
```

### 三層記憶對比

| 記憶類型 | 範圍 | 持久性 | 技術實作 |
| --- | --- | --- | --- |
| Semantic Memory | 知識庫 | 長期 | Vector DB（Pinecone / Firestore Vector） |
| Episodic Memory | 使用者歷史 | 中期 | Session Store（Firestore sessions） |
| Working Memory | 當前對話 | 短期 | Context Buffer（in-memory） |

完整 AI Memory 層 = 三層協同運作，而非僅有 Embedding。

---

## 八、Indexing Strategy Layer（索引策略層）

索引策略決定了 RAG 的搜尋能力上限。單一 Vector Search 不足以支撐複雜查詢。

### Hybrid Retrieval（多索引融合）

```text
User Query
    ↓
┌─────────────────────────────────┐
│       Hybrid Retrieval Layer     │
│  ┌──────────┐  ┌─────────────┐  │
│  │  Dense   │  │   Sparse    │  │
│  │ Retrieval│  │  Retrieval  │  │
│  │(Vector)  │  │(BM25/TF-IDF)│  │
│  └────┬─────┘  └──────┬──────┘  │
│       └────────┬───────┘         │
│           ┌────┴──────┐          │
│           │  Reranker  │          │
│           └────────────┘          │
└─────────────────────────────────┘
    ↓
Top-K Results → LLM
```

### 索引策略類型

| 索引類型 | 說明 | 適用場景 |
| --- | --- | --- |
| Dense（Vector） | 語意相似性搜尋 | 概念性問題 |
| Sparse（BM25） | 關鍵字精確匹配 | 術語 / 代碼搜尋 |
| Hybrid | Dense + Sparse 融合 | 通用場景 |
| Graph Index | 知識圖譜關係搜尋 | 推理 / 關聯查詢 |
| Hierarchical | 階層式索引（文件→段落→句子） | 長文件 |

### Reranker（重排序）

```text
Initial Retrieval Results (Top-50)
    ↓
Cross-Encoder Reranker
    ↓
Final Top-K (Top-5 / Top-10)
    ↓
LLM Context
```

Hybrid Retrieval + Reranker 是企業級 RAG 系統標準配置。

---

## 九、Graph-Augmented RAG（圖增強檢索）

Graph-Augmented RAG 將知識圖譜與向量搜尋融合，解決純 Vector Search 無法處理的多跳推理問題。

### 架構圖

```text
User Query
    ↓
┌──────────────────────────────────────┐
│         Graph-Augmented RAG           │
│                                        │
│  ┌──────────────┐  ┌───────────────┐  │
│  │ Vector Search │  │  Graph Search │  │
│  │  (Semantic)   │  │ (Relational)  │  │
│  └──────┬────────┘  └───────┬───────┘  │
│         └──────────┬────────┘          │
│              ┌─────┴──────┐            │
│              │  Fusion     │            │
│              │  & Ranking  │            │
│              └─────────────┘            │
└──────────────────────────────────────┘
    ↓
LLM（with graph context）
```

### 知識圖譜結構

```text
Entity Node：概念 / 實體 / 頁面
    ↓
Relation Edge：IS_A / PART_OF / RELATED_TO / CAUSES
    ↓
Knowledge Graph（可導航推理路徑）
```

### Graph vs. Vector 比較

| 面向 | Vector Search | Graph Search |
| --- | --- | --- |
| 搜尋基礎 | 語意相似度 | 實體關係路徑 |
| 強項 | 模糊語意匹配 | 精確關係推理 |
| 弱點 | 無關係推理 | 稀疏圖效果差 |
| 融合效果 | 互補，共同支撐複雜查詢 | ← |

Graph-Augmented RAG 是下一代知識系統的核心競爭力。

---

## 十、Multi-Document Reasoning（跨文件推理）

### Multi-hop Reasoning（多步推理）

```text
Complex Question
    ↓
Query Decomposition（拆解子問題）
    ↓
Sub-query 1 → Document A
Sub-query 2 → Document B
Sub-query 3 → Document C
    ↓
Evidence Aggregation（證據彙整）
    ↓
Multi-hop Reasoning（多步推理）
    ↓
Final Answer（綜合回答）
```

### 推理類型

| 推理類型 | 說明 |
| --- | --- |
| Bridge Reasoning | A → B → C 鏈式推理 |
| Comparison Reasoning | A vs. B 比較推理 |
| Compositional Reasoning | 組合多條件推理 |
| Temporal Reasoning | 時間序列推理 |

### 跨文件分析能力

```text
Document 1（技術文件）
Document 2（規格書）
Document 3（會議記錄）
    ↓
Cross-Document Analysis
    ├── 矛盾偵測（Contradiction Detection）
    ├── 知識補全（Knowledge Completion）
    └── 時間線整合（Timeline Synthesis）
    ↓
Unified Answer with Source Attribution
```

---

## 十一、Source Grounding / Citation System（引用系統）

AI 回答必須可追溯（Traceable）與可驗證（Verifiable），這是企業級 AI 系統的核心需求。

### Citation 架構

```text
LLM Answer
    ↓
Citation Extraction（引用萃取）
    ↓
Source Mapping（來源對應）
    ├── Document ID
    ├── Chunk ID
    ├── Page / Section
    └── Confidence Score
    ↓
Grounded Answer（可追溯回答）
```

### 引用輸出格式

```text
回答：「根據文件 A 第 3 節¹ 與文件 B 第 7 頁²，系統設計應採用...」

¹ 文件A - 系統規格書 v2.1, 第3節, 第12頁
² 文件B - 架構設計文件, 第7頁
```

### Grounding 驗證層

| 驗證項目 | 說明 |
| --- | --- |
| Faithfulness | 回答是否忠實於來源文件 |
| Relevance | 引用來源是否與問題相關 |
| Completeness | 是否涵蓋所有必要資訊 |
| Hallucination Detection | 偵測 LLM 幻覺輸出 |

Source Grounding 讓 AI 回答從「黑盒」變成「可審計系統」。

---

## 十二、Ingestion Pipeline（資料生命週期）

完整的資料生命週期管理，從原始文件到可查詢知識庫的完整流程。

### 完整 Ingestion Pipeline

```text
Raw Documents（原始資料）
    ↓
1. Parse（解析）
   ├── PDF / DOCX / HTML / Markdown
   ├── Table Extraction
   └── Image OCR
    ↓
2. Clean（清洗）
   ├── Remove noise / boilerplate
   ├── Normalize encoding
   └── Language detection
    ↓
3. Taxonomy（分類標記）
   ├── Auto-tagging
   ├── Category classification
   └── Metadata extraction
    ↓
4. Chunk（分塊）
   ├── Semantic chunking
   ├── Hierarchical chunking
   └── Overlap strategy
    ↓
5. Chunk Metadata（塊 metadata）
   ├── source_doc_id
   ├── section / heading path
   ├── page_number
   └── chunk_index
    ↓
6. Embedding（向量化）
   ├── Embedding model selection
   └── Batch embedding generation
    ↓
7. Firestore Writes（持久化）
   ├── Vector store
   ├── Metadata store
   └── Document registry
    ↓
8. Mark Ready（標記就緒）
   └── status: "indexed" → available for query
```

### 資料狀態機

```text
uploaded → parsing → chunking → embedding → indexed → stale → re-indexing
```

### Ingestion 品質指標

| 指標 | 說明 |
| --- | --- |
| Parse Success Rate | 文件成功解析率 |
| Chunk Quality Score | 分塊語意完整性 |
| Embedding Coverage | Embedding 覆蓋率 |
| Index Latency | 完整 Pipeline 耗時 |

---

## 十三、Tool / Agent Layer（工具調用層）

AI 系統從「回答問題」進化到「執行動作」，需要 Tool / Agent 層支撐。

### Agent 架構

```text
User Request
    ↓
Agent Orchestrator
    ↓
┌─────────────────────────────────────┐
│              Tool Registry           │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  Search  │  │  Knowledge Graph │ │
│  │  Tool    │  │  Query Tool      │ │
│  └──────────┘  └──────────────────┘ │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  Create  │  │   Summarize      │ │
│  │  Doc     │  │   Tool           │ │
│  └──────────┘  └──────────────────┘ │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  Link    │  │   External API   │ │
│  │  Pages   │  │   Connector      │ │
│  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────┘
    ↓
Action Execution → Result → User
```

### 工具類型

| 工具類型 | 說明 | 對應功能 |
| --- | --- | --- |
| Retrieval Tool | 知識庫搜尋 | Vector + Graph Search |
| Creation Tool | 文件 / 頁面自動生成 | Auto-draft |
| Summarization Tool | 文件摘要 | Auto Summary |
| Linking Tool | 知識圖譜連結 | Auto Link |
| Classification Tool | 自動標記 / 分類 | Auto Tag |
| External Tool | 呼叫外部 API | 第三方整合 |

### ReAct / Chain-of-Thought 模式

```text
Thought: 使用者想了解 X，需要先查 Y 再推論 Z
Action: search_tool("Y")
Observation: [retrieved context]
Thought: 已取得 Y，現在推論 Z
Action: reasoning_tool("Z given Y")
Final Answer: [grounded answer with citations]
```

---

## 十四、Schema + Ontology Layer（知識語意層）

知識語意層定義「知識的意義」與「概念間的關係」，讓 AI 能理解領域語意而非僅做字串匹配。

### Ontology 結構

```text
Domain Ontology
    ├── Classes（類別）
    │       ├── Document
    │       ├── Person
    │       ├── Project
    │       └── Concept
    ├── Properties（屬性）
    │       ├── hasAuthor
    │       ├── createdAt
    │       └── relatedTo
    └── Relations（關係）
            ├── IS_A（繼承）
            ├── PART_OF（組成）
            ├── DEPENDS_ON（依賴）
            └── CONTRADICTS（矛盾）
```

### Schema 層用途

| 用途 | 說明 |
| --- | --- |
| Entity Normalization | 統一同義詞 / 別名 |
| Relation Typing | 為圖譜邊定義語意類型 |
| Query Semantics | 理解查詢的業務語意 |
| Knowledge Validation | 驗證知識一致性 |

### Ontology 與 RAG 整合

```text
User Query（自然語言）
    ↓
Ontology Mapping（概念對齊）
    ↓
Enriched Query（附帶語意上下文）
    ↓
Graph + Vector Retrieval
    ↓
Semantically Grounded Answer
```

Schema + Ontology 層讓知識系統從「資料庫」進化為「知識庫」。

---

## 十五、三種系統的架構分層（非常重要）

```text
┌──────────────────────┐
│        AI Layer       │  ← NotebookLM / RAG
├──────────────────────┤
│   Knowledge Graph     │  ← Wiki
├──────────────────────┤
│   Content / UI Layer  │  ← Notion
└──────────────────────┘
```

| 層 | 功能 | 對應系統 |
| --- | --- | --- |
| AI Layer | 搜尋、問答、推理 | NotebookLM / RAG |
| Graph Layer | 知識關聯 | Wiki |
| Content / UI Layer | 編輯、排版、資料庫 | Notion |

真正的 AI 知識平台 = 三層架構。

---

## 十六、產品級架構模型（AI SaaS 最強形態）

Notion × Wiki × NotebookLM 融合架構：

```text
               ┌──────────────┐
                │      AI       │
                │  RAG / Chat   │
                └──────┬───────┘
                       │
            ┌──────────┴──────────┐
            │    Knowledge Graph   │
            │   Page Links / Tags  │
            └──────────┬──────────┘
                       │
                ┌──────┴──────┐
                │  Block Editor│
                │   Database   │
                └──────────────┘
```

### 知識系統演化三階段

| 時代 | 系統 | 架構 |
| --- | --- | --- |
| Web 1.0 | Wiki | Knowledge Graph |
| Web 2.0 | Notion | Block + Database |
| AI Era | NotebookLM | RAG + LLM |
| 未來 | Hybrid | Graph + Block + AI |

工程公式：

```text
AI Knowledge System
= Editor
+ Database
+ Knowledge Graph
+ Vector Search
+ LLM
```

---

## 十七、對應到技術架構（Firestore + Genkit + Next.js）

### 17.1 Firestore Schema（資料層）

| Collection | 說明 | 對應概念 |
| --- | --- | --- |
| pages | 頁面文件（含 Block 樹 + Graph Node） | Wiki Page / Notion Page |
| blocks | Block 內容單元 | Notion Block |
| databases | 結構化 Database 定義 | Notion Database |
| relations | 跨 Database Relation | Notion Relation Property |
| page_links | 頁面連結（fromPageId / toPageId / type） | Wiki Internal Link |
| embeddings | pageId / blockId / vector / content | NotebookLM Semantic Memory |
| tags | 多維標籤 | Wiki Category / Notion Tag |
| comments | Block 層級留言 | Notion Comment |
| versions | 頁面版本快照 | Wiki Revision History |
| sessions | 使用者互動歷程 | Episodic Memory |

Graph 關聯：

```text
page_links
  fromPageId
  toPageId
  type（IS_A / RELATED_TO / PART_OF）
```

RAG：

```text
embeddings
  pageId
  blockId
  vector
  content
  chunkIndex
  sectionPath
```

### 17.2 Genkit Flow（AI 層）

| Flow | 說明 |
| --- | --- |
| QueryPlannerFlow | Intent 分類 + Query 拆解 + HyDE |
| RetrievalFlow | Hybrid RAG（Dense + Sparse + Graph + Reranker） |
| IngestionFlow | Parse → Chunk → Embed → Index Pipeline |
| AgentOrchestratorFlow | ReAct 模式多工具調用 |
| CitationFlow | Answer + Source Mapping + Faithfulness Check |

AI 功能：

- Chat with Docs
- Auto Summary
- Auto Tag
- Auto Link
- Knowledge Graph Expansion

### 17.3 Next.js Parallel Routes（UI 層）

```text
/workspace
    /@editor      → Block Editor（Notion Layer）
    /@graph       → Knowledge Graph View（Wiki Layer）
    /@chat        → AI Chat + RAG（NotebookLM Layer）
    /@database    → Database View（Notion Layer）
```

畫面佈局：

```text
┌───────────────┬───────────────┐
│   Page Tree   │    Editor     │
├───────────────┼───────────────┤
│ KnowledgeGraph│     AI Chat   │
└───────────────┴───────────────┘
```

這就是：`AI Knowledge Operating System`

---

## 十八、最終學術級結論（完整架構層次）

### 完整 AI 知識平台架構層次

```text
┌─────────────────────────────────────────────────┐
│                  User Interface                   │
│          （Block Editor / Chat / Graph View）      │
├─────────────────────────────────────────────────┤
│           Tool / Agent Layer（工具調用層）          │
│    Search / Create / Link / Summarize / External  │
├─────────────────────────────────────────────────┤
│        Query Understanding Layer（查詢理解層）      │
│    Intent / Decompose / Rewrite / Plan / HyDE     │
├──────────────────────┬──────────────────────────┤
│  Multi-Document      │   Source Grounding /      │
│  Reasoning（多步推理）│   Citation System（引用）  │
├──────────────────────┴──────────────────────────┤
│         Graph-Augmented RAG（圖增強檢索）          │
│          Vector Search + Graph Search + Reranker  │
├─────────────────────────────────────────────────┤
│         Indexing Strategy Layer（索引策略層）       │
│         Dense / Sparse / Graph / Hierarchical     │
├─────────────────────────────────────────────────┤
│              AI Memory Layer（記憶層）              │
│  Semantic Memory | Episodic Memory | Working Mem  │
├─────────────────────────────────────────────────┤
│           Ingestion Pipeline（資料生命週期）         │
│    Parse → Clean → Taxonomy → Chunk → Embed       │
│                → Persist → Mark Ready             │
├─────────────────────────────────────────────────┤
│       Schema + Ontology Layer（知識語意層）         │
│        Classes / Properties / Relations           │
├─────────────────────────────────────────────────┤
│         Knowledge Graph（知識圖譜層）               │
│     Page Links / Backlinks / Category / Template  │
│     Redirect / Namespace / Version Control        │
├─────────────────────────────────────────────────┤
│           Content / Data Layer（內容層）            │
│   Block Editor / Database / Views / Automation   │
│   Property Types / Collaboration / Template      │
└─────────────────────────────────────────────────┘
```

### 完整架構能力對照

| 能力 | 實現機制 | 層次 |
| --- | --- | --- |
| Query Planner | Intent classification + query decomposition | Query Understanding Layer |
| Multi-hop reasoning | Sub-query generation + evidence aggregation | Multi-Document Reasoning |
| Hybrid retrieval | Dense + Sparse + Reranker | Indexing Strategy Layer |
| Graph-augmented RAG | Vector + Graph fusion | Graph-Augmented RAG |
| Citation / grounding | Source mapping + faithfulness check | Citation System |
| Semantic Memory | Vector embeddings + persistent vector database | AI Memory Layer |
| Episodic Memory | User interaction history + cross-session store | AI Memory Layer |
| Working Memory | In-memory conversation buffer | AI Memory Layer |
| Ingestion pipeline | Parse → Embed → Index lifecycle | Ingestion Pipeline |
| Agent / tool layer | ReAct + tool registry | Tool / Agent Layer |
| Ontology / schema | Domain classes + relation types | Schema + Ontology Layer |
| Block Editor | Drag-drop / nested blocks / 13+ block types | Content / UI Layer |
| Database System | 6 views / 18+ property types / automation | Content / UI Layer |
| Knowledge Graph | Backlinks / redirects / category tree | Knowledge Graph Layer |
| Version Control | Diff / Rollback / Edit history / Blame | Knowledge Graph Layer |
| Template System | Transclusion / parameterized templates | Knowledge Graph Layer |

---

> 這就是現代 AI SaaS 文件 / 知識 / 協作 / AI 系統的完整理論架構。
>
> **下一代知識平台架構：**
> Notion（UI / Block / Database）+ Wiki（Knowledge Graph）+ NotebookLM（RAG / AI）= **AI Knowledge Platform**
````

## File: docs/guides/explanation/README.md
````markdown
# Explanation

Explanation pages are understanding-oriented and describe why the system works this way.

## Include

- Mental models
- Design trade-offs
- Architectural rationale
- Alternatives considered

## Exclude

- Procedural runbooks
- API field catalogs
- Beginner hand-holding steps
````

## File: docs/guides/how-to/README.md
````markdown
# How-to Guides

How-to guides are task-oriented procedures for users who already know the basics.

## Include

- Specific problem statement
- Preconditions
- Ordered procedure
- Verification and rollback notes
- Links to reference for exact parameters

## Exclude

- Introductory teaching flow
- Broad conceptual background
- Changelog history
````

## File: docs/guides/how-to/ui-ux/component-patterns.md
````markdown
# UI 元件模式（Component Patterns）

> **參考文件類型**：本文件定義 Xuanwu App 中 UI 元件的使用規範、組合模式與常見陷阱。
> 元件實作以 **shadcn/ui** 為基礎，Lucide React 提供圖示。

---

## 1. 元件架構原則

### 1.1 元件分類

| 類型 | 分層 | 說明 |
|---|---|---|
| **基礎元件（Primitive）** | UI 元件庫層 | shadcn/ui 提供；不修改來源 |
| **功能元件（Feature）** | 模組介面層 | 業務功能元件；含狀態與資料 |
| **Shell 元件（Layout）** | 應用外殼層 | 版型元件；App Rail、Sidebar 等 |
| **頁面元件（Page）** | 頁面協調層 | 薄協調層；只組裝元件 |

### 1.2 Server vs Client 元件選擇

| 情況 | 選擇 |
|---|---|
| 靜態渲染、無互動 | `Server Component`（預設） |
| 需要 `useState`、`useEffect`、事件處理 | `'use client'` |
| 需要 Firestore `onSnapshot` 即時訂閱 | `'use client'` |
| 需要 `useRouter`、`useSearchParams` | `'use client'` |

---

## 2. 常用元件模式

### 2.1 卡片容器模式（Card Pattern）

用於包裝獨立功能區塊（上傳區、查詢區、結果區）。

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Upload File</CardTitle>
  </CardHeader>
  <CardContent>
    {/* 內容 */}
  </CardContent>
</Card>
```

**使用時機**：
- 功能明確邊界的操作區塊
- 統計摘要卡片
- 設定區塊

### 2.2 操作按鈕模式（Action Button Pattern）

主要操作（Primary Action）按鈕的標準 loading 狀態處理：

```tsx
import { Button } from "@ui-shadcn/ui/button";
import { Loader2 } from "lucide-react";

<Button
  onClick={handleAction}
  disabled={isLoading || !canSubmit}
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 size-4 animate-spin" />
      上傳中...
    </>
  ) : (
    "上傳並啟動解析 ↑"
  )}
</Button>
```

**規則**：
- loading 時必須同時 `disabled` 防止重複提交。
- loading 文字以進行式動詞結尾（「上傳中...」而非「上傳」）。
- disabled（非 loading）時加 Tooltip 說明原因。

### 2.3 骨架屏模式（Skeleton Pattern）

資料載入時的占位元件：

```tsx
import { Skeleton } from "@ui-shadcn/ui/skeleton";

// 列表骨架屏
{isLoading ? (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
) : (
  <DataTable data={data} />
)}
```

### 2.4 空狀態模式（Empty State Pattern）

```tsx
{data.length === 0 && (
  <div className="flex flex-col items-center gap-4 py-16 text-center">
    <FileX className="size-12 text-muted-foreground" />
    <div>
      <p className="font-semibold">目前還沒有文件</p>
      <p className="text-sm text-muted-foreground">
        試著上傳第一份檔案。
      </p>
    </div>
    <Button variant="outline" onClick={scrollToUpload}>
      前往上傳
    </Button>
  </div>
)}
```

### 2.5 Toast 通知模式

```tsx
import { toast } from "sonner";

// 成功
toast.success("已觸發重整，稍後觀察 rag status 更新");

// 失敗（含原因）
toast.error(`上傳失敗：${error.message}`);

// 背景任務提示
toast.info("正在處理中，請稍候…");
```

**注意**：`<Toaster />` 已由全域 Provider 掛載，無需重複掛載。

### 2.6 Dropdown 選單模式

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm" aria-label="更多操作">
      <MoreHorizontal className="size-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={handleEdit}>編輯</DropdownMenuItem>
    <DropdownMenuItem
      className="text-destructive"
      onClick={handleDelete}
    >
      刪除
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 2.7 狀態徽章模式（Status Badge Pattern）

```tsx
import { Badge } from "@ui-shadcn/ui/badge";

function StatusBadge({ status }: { status: "ready" | "processing" | "error" | "pending" }) {
  const map = {
    ready:      { label: "✓ ready",       variant: "success" },
    processing: { label: "⏳ processing",  variant: "secondary" },
    error:      { label: "✗ error",        variant: "destructive" },
    pending:    { label: "— pending",      variant: "outline" },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant as never}>{label}</Badge>;
}
```

**規則**：狀態徽章必須同時包含圖示與文字（不可只用顏色）。

### 2.8 Tooltip 模式

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui-shadcn/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button disabled aria-disabled>
        手動重整
      </Button>
    </TooltipTrigger>
    <TooltipContent>文件尚未完成解析</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## 3. 表單元件模式

### 3.1 基本輸入框

```tsx
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";

<div className="space-y-2">
  <Label htmlFor="title">標題</Label>
  <Input
    id="title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="請輸入標題..."
    aria-invalid={!!error}
  />
  {error && (
    <p className="text-sm text-destructive" role="alert">
      {error}
    </p>
  )}
</div>
```

### 3.2 拖曳上傳區（Drop Zone）

Drop Zone 的可近用性規格：

```tsx
<div
  role="button"
  tabIndex={0}
  aria-label="點擊選擇檔案，或拖曳檔案至此上傳"
  className={cn(
    "rounded-lg border-2 border-dashed p-8 text-center transition-colors",
    isDragOver && "border-primary bg-primary/5",
    "focus:outline-none focus:ring-2 focus:ring-ring"
  )}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") handleClick();
  }}
>
  {isDragOver ? "放開以上傳" : "點擊或拖曳上傳"}
</div>
```

---

## 4. 資料表格模式（Data Table Pattern）

使用 TanStack Table（`@lib-tanstack`）實作資料表格：

```tsx
// 簡易表格（列表較短時）
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>檔名</TableHead>
      <TableHead>狀態</TableHead>
      <TableHead>操作</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {documents.map((doc) => (
      <TableRow key={doc.id}>
        <TableCell>{doc.filename}</TableCell>
        <TableCell><StatusBadge status={doc.status} /></TableCell>
        <TableCell>
          <ActionButton doc={doc} />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**選用 TanStack Table 時機**：
- 需要排序功能
- 需要列選取（多選刪除）
- 需要虛擬化（列數 > 100）

---

## 5. 頁面組裝模式（Page Composition Pattern）

`page.tsx` 應保持薄協調，只組裝元件：

```tsx
// ✅ 正確：薄協調層
export default async function WikiDocumentsPage() {
  return <WikiDocumentsView />;
}

// ✅ 正確：有少量 Server-side data fetch
export default async function WorkspacePage({ params }: { params: { workspaceId: string } }) {
  const workspace = await getWorkspaceById(params.workspaceId);
  if (!workspace) notFound();
  return <WorkspaceOverview workspace={workspace} />;
}

// ❌ 錯誤：page 內有業務邏輯
export default async function DocumentsPage() {
  const db = getFirestore();
  const docs = await db.collection("documents").get(); // 直接在 page 呼叫 Firebase
  return <div>{/* ... */}</div>;
}
```

---

## 6. 常見反模式（Anti-patterns）

| 反模式 | 問題 | 正確做法 |
|---|---|---|
| 直接在 page 使用 Firebase SDK | 違反 MDDD 分層 | 透過 use-case 或 Server Action |
| 在元件內直接 `new FirebaseXxxRepository()` | 難以測試 | 由 use-case 透過 constructor injection |
| 只用顏色區分狀態 | 色盲使用者無法識別 | 同時包含圖示與文字 |
| Toast 成功但無失敗處理 | 靜默失敗 | try/catch 包覆，失敗也顯示 toast |
| Disabled 按鈕無 Tooltip | 使用者不知為何不可用 | 加 `Tooltip` 說明原因 |
| 空狀態顯示空白頁面 | 使用者困惑 | 實作 Empty State 元件 |
| `'use client'` 加在 layout 或不必要的元件 | 阻止 Server Component 優化 | 只在必要的最小範圍加 `'use client'` |

---

## 7. 元件命名規範

| 元件類型 | 命名格式 | 範例 |
|---|---|---|
| Feature 元件 | `{Module}{Feature}View` | `WikiDocumentsView` |
| 子元件（列表項） | `{Feature}Row` / `{Feature}Card` | `DocumentRow` |
| 表單元件 | `{Action}{Resource}Form` | `UploadDocumentForm` |
| Dialog 元件 | `{Action}{Resource}Dialog` | `CreateWorkspaceDialog` |
| 頁面 Shell 元件 | `{Module}Shell` | `WikiShell` |

---

## 8. 匯入規則

```tsx
// ✅ 正確
import { Button } from "@ui-shadcn/ui/button";
import { Card } from "@ui-shadcn/ui/card";
import { cn } from "@shared-utils";
import { Plus, Loader2 } from "lucide-react";

// ❌ 錯誤：使用 legacy 路徑
import { Button } from "@/ui/shadcn/ui/button";
import { cn } from "@/shared/utils";
```
````

## File: docs/guides/how-to/ui-ux/information-architecture.md
````markdown
# 資訊架構（Information Architecture）

> **參考文件類型**：本文件定義 Xuanwu App 的全站資訊架構、導覽層級、路由地圖與頁面組織原則。
> 實際路由以目前應用程式路由實作為準；本文件作為閱讀地圖與設計指引。

---

## 1. 全站資訊架構圖

```
Xuanwu App
├── (public)                          ← 未登入公開區域
│   ├── /login                        ← 登入頁
│   └── /register（planned）          ← 註冊頁
│
└── (shell)                           ← 已登入 Shell（三欄版型）
    ├── /workspace                    ← 工作區中心
    │   └── /workspace/[workspaceId]  ← 單一工作區
    │
    ├── /wiki                    ← 知識庫（Wiki）
    │   ├── /wiki（知識總覽）
    │   ├── /wiki/documents      ← 主操作頁
    │   ├── /wiki/rag-query      ← AI 問答
    │   ├── /wiki/rag-reindex    ← RAG 重整
    │   ├── /wiki/pages          ← 頁面管理
    │   └── /wiki/libraries      ← 資料庫管理
    │
    ├── /ai-chat                      ← AI 對話介面
    │
    ├── /organization                 ← 組織管理
    │   ├── /organization/members     ← 成員管理
    │   ├── /organization/teams       ← 團隊管理
    │   ├── /organization/permissions ← 權限管理
    │   ├── /organization/workspaces  ← 工作區管理
    │   ├── /organization/schedule    ← 排程管理
    │   ├── /organization/daily       ← 每日摘要
    │   └── /organization/audit       ← 稽核記錄
    │
    ├── /dashboard                    ← 個人儀表板
    │
    └── /settings                     ← 設定
```

---

## 2. Shell 版型層級

### 2.1 三欄結構

```
+--App Rail--+--Secondary Nav (Dashboard Sidebar)--+--Main Content--+
|   48px     |           240px（可收合）              |   flex-1       |
|            |                                       |                |
| 圖示導覽   |  依所在區域顯示次要導覽                |  page.tsx      |
|            |                                       |  協調層        |
+------------+---------------------------------------+----------------+
```

### 2.2 App Rail（最左欄）

App Rail 提供**跨功能區域**的頂層導覽，圖示帶 Tooltip。

| 圖示 | 路由 | 標籤 |
|---|---|---|
| `Building2` | `/workspace` | 工作區中心 |
| `BookOpen` | `/wiki` | Account Wiki |
| `Bot` | `/ai-chat` | AI 對話 |
| `Users` | `/organization` | 組織管理 |
| `FlaskConical` | `/dev-tools`（開發環境） | 開發工具 |
| `Settings` | `/settings` | 設定 |
| `Plus` | — | 快速建立工作區 / 組織 |

### 2.3 Dashboard Sidebar（次要側邊欄）

次要側邊欄根據**目前所在的功能區域**動態顯示對應的子導覽。

**工作區（/workspace/[id]）子導覽**：

| 群組 | 項目 |
|---|---|
| Primary | Overview、Members |
| Spaces | Spaces 列表 |
| Databases | Databases 列表 |
| Library | Files、Documents |
| Modules | Issues、Tasks、Schedule、Daily |

**Wiki（/wiki）子導覽**：

| 項目 | 路由 | 狀態 |
|---|---|---|
| 知識總覽 | `/wiki` | ✅ 現有 |
| RAG Query | `/wiki/rag-query` | ✅ 現有 |
| RAG Reindex | `/wiki/rag-reindex` | ✅ 現有 |
| Documents [+] | `/wiki/documents` | ✅ 現有 |
| Pages | `/wiki/pages` | ✅ 現有 |
| Libraries | `/wiki/libraries` | ✅ 現有 |
| Workspaces | — | ✅ 現有（可摺疊） |

**組織管理（/organization）子導覽**：

| 項目 | 路由 | 說明 |
|---|---|---|
| 成員 | `/organization/members` | 組織成員管理 |
| 團隊 | `/organization/teams` | 群組管理 |
| 權限 | `/organization/permissions` | RBAC 角色與權限 |
| 工作區 | `/organization/workspaces` | 組織下工作區管理 |
| 排程 | `/organization/schedule` | 排程管理 |
| 每日 | `/organization/daily` | 每日摘要 |
| 稽核 | `/organization/audit` | 操作稽核記錄 |

---

## 3. 路由設計原則

### 3.1 路由命名規則

| 類型 | 格式 | 範例 |
|---|---|---|
| 資源列表 | `/resource` | `/wiki/documents` |
| 資源詳情 | `/resource/[id]` | `/workspace/[workspaceId]` |
| 功能子頁 | `/context/function` | `/wiki/rag-query` |
| 設定頁 | `/resource/settings` | `/workspace/[id]/settings` |

### 3.2 路由群組（Route Groups）

Next.js App Router 使用路由群組 `(name)` 來共用 layout 而不影響 URL：

| 群組 | 路徑 | 共用 layout |
|---|---|---|
| `(public)` | — | 未登入頁面 layout（無 Shell） |
| `(shell)` | — | 已登入 Shell layout（三欄版型 + Auth guard） |

### 3.3 URL 參數規範

| 參數 | 說明 | 範例 |
|---|---|---|
| `workspaceId` | workspace 篩選視角 | `?workspaceId=ws_123` |
| `tab` | 功能頁籤切換 | `?tab=overview` |
| `q` | 搜尋關鍵字 | `?q=keyword` |

---

## 4. 資料範圍與 Scope 設計

Xuanwu App 的資料圍繞三層結構：

```
System
└── Account（個人帳號 / 組織帳號）
    └── Workspace（工作區）
        └── Resources（Pages、Files、Documents...）
```

| 層次 | 說明 | 存取範圍 |
|---|---|---|
| **Account** | 資料主範圍。所有資料歸屬於帳號，不跨帳號共用。 | 帳號擁有者 + 邀請成員 |
| **Workspace** | 帳號下的分組視角。workspace 是篩選，不是資料邊界。 | Workspace 成員 |
| **Namespace** | 路由 slug 機制，背景能力，不在 UI 中獨立暴露。 | 系統內部 |

**重要設計原則**：
- 使用者的 **預設視角** 為帳號全覽（account scope）。
- 切換 workspace 是「縮小視角」的操作，不是「換資料庫」的操作。
- 跨 workspace 的資料彙總需在 account 層完成。

---

## 5. 頁面類型分類

### 5.1 列表頁（List Page）

顯示某類資源的清單，支援篩選、排序與操作。

**必要元素**：
- 頁首標題 + 篩選狀態提示
- 載入中骨架屏（Skeleton）
- 空狀態（Empty State）+ 引導行動
- 每列的操作按鈕

**範例**：`/wiki/documents`、`/wiki/pages`

### 5.2 詳情頁（Detail Page）

顯示單一資源的完整資訊，支援編輯操作。

**必要元素**：
- 返回連結（Back button）
- 資源標題 + 元資料
- 內容主體
- 操作按鈕（Edit / Delete / Share）

**範例**：`/workspace/[workspaceId]`

### 5.3 功能操作頁（Functional Page）

以特定功能為主（非 CRUD 列表），例如 RAG 查詢、上傳操作。

**必要元素**：
- 操作輸入區
- 執行按鈕（含 loading 狀態）
- 結果顯示區
- 錯誤 / 空狀態處理

**範例**：`/wiki/rag-query`、`/wiki/rag-reindex`

### 5.4 總覽頁（Overview / Dashboard Page）

提供某功能區域的整體摘要與入口。

**必要元素**：
- 快速操作入口（Quick Actions）
- 統計摘要（Counters / Metrics）
- 最近活動或重要提示

**範例**：`/wiki`（知識總覽）

---

## 6. 導覽自訂化

使用者可透過「自訂導覽」對話框（`CustomizeNavigationDialog`）調整側邊欄顯示的項目：

- **偏好存儲**：`localStorage` key `xuanwu:nav-preferences`
- **偏好格式**：pinnedItems（置頂項目）+ workspaceOrder（工作區排序）
- **有效項目集合**：系統定義 `VALID_PINNED_ITEMS` 與 `VALID_WORKSPACE_ORDER_IDS`，確保偏好合法性

---

## 7. 搜尋與導覽輔助

### 7.1 全站搜尋（planned）

- **入口**：Header 右側搜尋圖示（`/search`）
- **範圍**：account 範圍內所有 Pages、Documents、Records
- **鍵盤捷徑**：`Cmd/Ctrl + K`

### 7.2 麵包屑（Breadcrumb）

- 目前各頁面使用「← 返回」按鈕
- 計畫在頁首加入麵包屑導覽（planned）

### 7.3 語言切換

- Header Controls 提供語言切換器（`translation-switcher.tsx`）
- 支援語言：中文（繁體）、英文（計畫中）
````

## File: docs/guides/how-to/ui-ux/ux-principles.md
````markdown
# UX 原則與互動規範

> **說明文件類型**：本文件說明 Xuanwu App 的使用者體驗設計哲學，定義互動模式、反饋機制與可近用性標準。
> 設計決策均與 Diátaxis 的「說明」象限對應 — 著重「為什麼」而非「如何做」。

---

## 1. 核心 UX 原則

### 1.1 UX1 — 操作可見（System Visibility）

> _使用者在任何時刻都知道系統正在做什麼。_

**來源**：Don Norman《The Design of Everyday Things》— 回饋原則。

**實作規範**：
- 所有非同步操作（上傳、查詢、刪除）必須有 loading 狀態指示。
- loading 狀態使用 **spinner + 文字** 雙重提示（例如「上傳中...」），不只有 spinner。
- 後台處理完成後（例如文件解析），以 **toast 通知** 明確告知結果。
- 即時變動的資料（例如文件 `status`）盡量使用 **Firestore `onSnapshot`** 讓狀態自動更新，而非需要使用者手動刷新。

### 1.2 UX2 — 降低認知負擔（Minimize Cognitive Load）

> _核心操作集中在一個頁面完成，不強迫使用者在多頁面間跳轉。_

**來源**：Steve Krug《Don't Make Me Think》— 最少點擊數。

**實作規範**：
- 每個主功能頁面（例如 `/wiki/documents`）自我完備 — 上傳、列表、操作三位一體。
- 側邊欄導覽項目最多顯示 **7 個頂層項目**（米勒定律：工作記憶限制）。
- 次要操作（例如快捷建立）使用 **hover 顯示** 的次要元素，不佔主要視覺空間。

### 1.3 UX3 — 錯誤可修復（Error Recovery）

> _出錯時顯示原因與建議的下一步行動。_

**來源**：Don Norman《The Design of Everyday Things》— 錯誤設計原則。

**實作規範**：
- 所有錯誤 toast 包含 **原因 + 建議行動**（例如「上傳失敗，請確認網路連線後重試」）。
- 格式驗證錯誤在使用者動作當下即時顯示，不等待 submit。
- 禁用按鈕（disabled）必須搭配 **tooltip 說明不可用原因**，不可靜默。

### 1.4 UX4 — 資料全覽預設（Default to Overview）

> _預設顯示 account 全覽，不因工作區切換讓資料「消失」。_

**來源**：Lean UX — 從使用者痛點出發的設計。

**實作規範**：
- 所有資料列表預設顯示 **account 範圍**，不以 workspace 為預設篩選。
- workspace 篩選為選擇性操作，透過 URL 參數（`?workspaceId=<id>`）觸發。
- 篩選啟動時，頁面需顯示明確的篩選提示（例如「workspace: {id} ×」）。

### 1.5 UX5 — 鍵盤可近用性（Keyboard Accessibility）

> _所有互動操作均可由鍵盤完整操作，不依賴滑鼠。_

**來源**：WCAG 2.1 AA 標準。

**實作規範**：
- 所有可互動元素（按鈕、連結、輸入框）可 Tab 鍵聚焦。
- Dropdown / Popover 支援 ↑↓ 導覽與 Enter 觸發、Esc 關閉。
- 焦點管理：開啟 Modal/Dialog 後焦點移入；關閉後焦點回到觸發元素。
- 焦點環（focus ring）在所有互動元素上清晰可見。

### 1.6 UX6 — 一致性（Consistency）

> _相同功能在全平台使用相同元件與文案模式。_

**來源**：Jakob Nielsen《10 Usability Heuristics》— Consistency and Standards。

**實作規範**：
- 統一使用 shadcn/ui 元件庫，不自行實作已有的基礎元件。
- 操作文案統一：「建立」（不混用「新增」和「新建」）、「刪除」（不混用「移除」）。
- 狀態圖示統一：`✓ ready`、`⏳ processing`、`✗ error`。

---

## 2. 互動模式規範

### 2.1 Toast 通知規則

Toast 是 Xuanwu App 的主要反饋機制，使用 **Sonner** 函式庫。

| 情境 | Toast 類型 | 顯示時間 |
|---|---|---|
| 操作成功（建立、儲存、觸發） | `success` | 3 秒自動消失 |
| 操作失敗（網路、驗證、權限） | `error` | 5 秒（或手動關閉） |
| 背景處理中（可能需要等待） | `info` | 4 秒自動消失 |
| 危險操作前的確認 | 不用 toast，用 Dialog | — |

**格式規範**：
```
成功：「已{動作} {對象}」        例：「已建立 工作區 Marketing」
失敗：「{動作}失敗：{原因}」     例：「上傳失敗：格式不支援」
處理中：「{動作}中，請稍候…」   例：「重整中，請稍候…」
```

**實作位置**：`<Toaster />` 已掛載於全域 Provider。

### 2.2 Loading 狀態規範

| 情境 | Loading 模式 |
|---|---|
| 頁面初始載入 | Skeleton（骨架屏） — 整頁占位符 |
| 列表資料載入 | Skeleton rows — 每列占位符 |
| 按鈕觸發的操作 | Inline spinner + 文字 + disabled |
| 單列操作（不影響其他列） | 僅該列顯示 spinner，其他列保持互動 |
| 全頁阻斷操作 | 避免使用；若必要，使用半透明 overlay |

### 2.3 空狀態設計

每個列表頁面須定義 **空狀態（Empty State）**，避免空白頁面讓使用者困惑。

| 場景 | 空狀態內容 |
|---|---|
| 無文件（Documents） | 說明文字 + 指向 Upload 卡的引導箭頭 |
| 無頁面（Pages） | 說明文字 + 「建立第一個頁面」按鈕 |
| 無查詢結果（RAG Query） | 說明文字 + 建議的下一步（確認文件已 indexed） |
| 無工作區 | 說明文字 + 「建立工作區」按鈕 |

**空狀態文案格式**：
```
「目前還沒有 {資源名稱}，{引導動作}。」
例：「目前還沒有文件，試著上傳第一份檔案。」
```

### 2.4 確認對話框規則

需要使用 Dialog 確認的操作：

| 操作類型 | 是否需要確認 |
|---|---|
| 刪除永久性資源 | ✅ 必須 |
| 批次刪除 | ✅ 必須 |
| 清除資料 | ✅ 必須 |
| 建立 | ❌ 不需要 |
| 儲存 | ❌ 不需要 |
| 觸發背景任務（例如 reindex） | ❌ 不需要（有 toast 反饋即可） |

---

## 3. 表單設計規範

### 3.1 輸入驗證時機

| 驗證類型 | 觸發時機 |
|---|---|
| 格式驗證（日期、Email） | blur（失去焦點時） |
| 必填欄位 | submit（提交時）；如果已 blur 過也可 blur 時顯示 |
| 即時搜尋 | change（每次輸入後，加 debounce） |
| 伺服器端驗證 | submit 後，以 toast 或 inline error 顯示 |

### 3.2 按鈕狀態

所有可提交的按鈕（Primary Button）遵循以下狀態：

```
idle → loading → success（toast） or error（toast）
```

- **idle**：正常可點擊狀態，顯示操作文字。
- **loading**：顯示 spinner + 操作進行中文字，按鈕 disabled。
- **success**：toast 顯示成功訊息，按鈕回到 idle（或 navigate）。
- **error**：toast 顯示錯誤訊息，按鈕回到 idle（允許重試）。

---

## 4. 導覽行為規範

### 4.1 側邊欄展開 / 收合

- **預設狀態**：展開。
- **收合觸發**：使用者點擊 `PanelLeftClose` 圖示，偏好存於 `localStorage`（key: `xuanwu:nav-preferences`）。
- **收合狀態**：僅顯示圖示，懸停（hover）顯示 Tooltip 提示完整名稱。

### 4.2 Active 狀態顯示

- 側邊欄以路由 prefix 判斷 active（`pathname.startsWith(href + "/")`）。
- Active 項目：背景色 `bg-accent`，文字加粗。

### 4.3 麵包屑（Breadcrumb）

目前未實作全站麵包屑；各功能區頁首有「返回」按鈕（例如「← 返回 Wiki Beta」）。

---

## 5. 可近用性完整清單

### 5.1 必要實作（WCAG 2.1 AA）

| 需求 | 實作細節 |
|---|---|
| 色彩對比 | 文字與背景對比 ≥ 4.5:1（一般文字）；≥ 3:1（大文字） |
| 鍵盤可操作 | 所有功能可不依賴滑鼠完成 |
| 螢幕閱讀器 | 圖示按鈕有 `aria-label`；狀態用 `aria-live` 或 `role="status"` |
| 焦點管理 | 開啟 Dialog/Popover 後焦點移入，關閉後焦點回到觸發元素 |
| 錯誤識別 | 錯誤訊息不僅依賴紅色，需有文字說明 |
| 選單鍵盤操作 | Arrow 鍵導覽、Enter 觸發、Esc 關閉 |

### 5.2 元件可近用性規格

| 元件 | 鍵盤行為 | ARIA 需求 |
|---|---|---|
| Drop Zone | Tab 聚焦；Enter/Space 觸發選檔 | `role="button"`, `aria-label` |
| Dropdown Menu | ↑↓ 導覽；Enter 選擇；Esc 關閉 | `role="menu"`, `role="menuitem"` |
| Dialog | Esc 關閉；焦點陷阱 | `role="dialog"`, `aria-labelledby` |
| Toast | 自動朗讀 | `role="alert"` 或 `aria-live="assertive"` |
| Table | Tab 導覽至互動元素 | `<table>` 語意標籤 |
| Badge / Status | — | 不可只用顏色；需有文字 |

---

## 6. 回應式設計規範

Xuanwu App 主要針對桌面（Desktop first），但核心頁面需支援平板與手機。

| 斷點 | Tailwind Prefix | 說明 |
|---|---|---|
| 手機 | （預設） | 單欄版型；隱藏 Secondary Nav |
| 平板 | `md:` | 可選性顯示 Secondary Nav |
| 桌面 | `lg:` | 完整三欄版型 |

**手機版規則**：
- App Rail 收合為底部導覽列（planned）。
- 資料列表改為卡片式呈現，取代桌面的表格。
- 複雜操作（例如上傳）維持可用，但版型調整為全寬。
````

## File: docs/guides/how-to/ui-ux/wireframes.md
````markdown
# 線框圖（Wireframes）

> **參考文件類型**：本文件包含 Xuanwu App 各主要功能區域的線框圖（Wireframe），以 ASCII 文字圖呈現布局結構與元件配置。
> 詳細的個別功能 UI 規格，請參閱系統規格索引。

---

## 1. Shell 版型（三欄結構）

所有已登入頁面共用三欄 Shell 版型：

```
+--[App Rail]--+--[Secondary Nav]--+--[Main Content]--+
|   48px       |    240px          |    flex-1         |
|              |  （可收合）        |                   |
| [Logo]       |  根據功能區域      |  page.tsx         |
|              |  動態顯示子導覽    |  協調層           |
| [Workspace]  |                   |                   |
| [Wiki Beta]  |                   |                   |
| [AI Chat]    |                   |                   |
| [Org]        |                   |                   |
|              |                   |                   |
| ─────────── |                   |                   |
| [Settings]   |                   |                   |
| [User Avatar]|                   |                   |
+--[App Rail]--+--[Secondary Nav]--+--[Main Content]--+
```

### Header（頁首）

```
+----------------------------------------------------------------+
| Breadcrumb / Page Title        [Search] [Lang] [Theme] [User] |
+----------------------------------------------------------------+
```

---

## 2. Wiki 功能區

### 2.1 `/wiki`（知識總覽）

```
+--App Rail--+--Wiki Nav--+------Main Content------+
|            | 知識總覽 ●      | [← 返回]               |
|            | RAG Query       |                        |
|            | RAG Reindex     | Wiki Beta              |
|            | Documents   [+] | ─────────────────────  |
|            | Pages           |                        |
|            | Libraries       | ┌─────────┐ ┌─────────┐|
|            | ─────────────  | │ 文件上傳 │ │RAG Query│|
|            | Workspaces ▼   | │  圖示+   │ │ 圖示+   │|
|            |  > ws-1         | │  說明文字│ │ 說明文字│|
|            |  > ws-2         | └─────────┘ └─────────┘|
|            |                 |                        |
|            |                 | 帳號統計               |
|            |                 | 文件：N  Ready：M      |
|            |                 | 工作區：K              |
+--App Rail--+--Wiki Nav--+------Main Content------+
```

### 2.2 `/wiki/documents`（主操作頁）

```
+--App Rail--+--Wiki Nav--+--------Main Content---------+
|            | 知識總覽        | Wiki Beta · Documents       |
|            | RAG Query       | account 全覽 / ws: {id} ×  |
|            | RAG Reindex     | ─────────────────────────── |
|            | Documents ● [+] |                             |
|            | Pages           | ┌── 上傳檔案 ─────────────┐|
|            | Libraries       | │                           │|
|            |                 | │  ╔═══════════════════╗   │|
|            |                 | │  ║ 點擊或拖曳上傳     ║   │|
|            |                 | │  ║ .pdf .tiff .png    ║   │|
|            |                 | │  ╚═══════════════════╝   │|
|            |                 | │                           │|
|            |                 | │  [上傳並啟動解析 ↑] [✕]  │|
|            |                 | └───────────────────────────┘|
|            |                 |                             |
|            |                 | ┌── Documents (帳號全覽) ───┐|
|            |                 | │ filename │ status │ rag   │|
|            |                 | │──────────│────────│───────│|
|            |                 | │report.pdf│✓ ready │✓ idx  │|
|            |                 | │scan.tiff │⏳ proc │⏳ pend│|
|            |                 | │error.pdf │✗ error │ —    │|
|            |                 | └───────────────────────────┘|
+--App Rail--+--Wiki Nav--+--------Main Content---------+
```

**Documents [+] 快捷選單（Popover）**：

```
Documents [+]
          │
          ▼
     ┌─────────────────┐
     │ ＋ 新增頁面      │
     │ ＋ 新增資料庫    │
     └─────────────────┘
```

### 2.3 `/wiki/rag-query`

```
+--App Rail--+--Wiki Nav--+--------Main Content---------+
|            | 知識總覽        | Wiki Beta · RAG Query       |
|            | RAG Query ●     | ─────────────────────────── |
|            | RAG Reindex     |                             |
|            | Documents   [+] | ┌── RAG Query ─────────────┐|
|            | Pages           | │                           │|
|            | Libraries       | │ ┌─────────────────────┐   │|
|            |                 | │ │ 請輸入你的問題...     │   │|
|            |                 | │ └─────────────────────┘   │|
|            |                 | │ top_k: [5 ▼] [送出查詢]  │|
|            |                 | └───────────────────────────┘|
|            |                 |                             |
|            |                 | ┌── Answer ────────────────┐|
|            |                 | │ AI 回答文字...            │|
|            |                 | │                           │|
|            |                 | │ [cache:hit][scope:acct]  │|
|            |                 | │ [vector:5][search:3]     │|
|            |                 | └───────────────────────────┘|
|            |                 |                             |
|            |                 | ┌── Citations (3 筆) ──────┐|
|            |                 | │ 1. report.pdf — 第5頁     │|
|            |                 | │    "...引用片段..."        │|
|            |                 | │ 2. scan.tiff — 第1頁      │|
|            |                 | └───────────────────────────┘|
+--App Rail--+--Wiki Nav--+--------Main Content---------+
```

### 2.4 `/wiki/pages`（Pages 頁面管理）

```
+--App Rail--+--Wiki Nav--+--------Main Content---------+
|            | 知識總覽        | Wiki Beta · Pages           |
|            | RAG Query       | ─────────────────────────── |
|            | RAG Reindex     |                  [新增頁面]  |
|            | Documents   [+] |                             |
|            | Pages ●         | ┌── 頁面列表 ───────────────┐|
|            | Libraries       | │ title     │ updatedAt │ → │|
|            |                 | │───────────│───────────│───│|
|            |                 | │ 專案概覽  │ 2026-03-20│ > │|
|            |                 | │   > 里程碑│ 2026-03-21│ > │|
|            |                 | │ 技術規格  │ 2026-03-22│ > │|
|            |                 | └───────────────────────────┘|
+--App Rail--+--Wiki Nav--+--------Main Content---------+
```

### 2.5 `/wiki/libraries`（Libraries 資料庫管理）

```
+--App Rail--+--Wiki Nav--+--------Main Content---------+
|            | 知識總覽        | Wiki Beta · Libraries       |
|            | RAG Query       | ─────────────────────────── |
|            | RAG Reindex     |              [新增資料庫]    |
|            | Documents   [+] |                             |
|            | Pages           | ┌── 資料庫列表 ─────────────┐|
|            | Libraries ●     | │ name      │ fields │ rows │|
|            |                 | │───────────│────────│──────│|
|            |                 | │ 任務追蹤  │ 5欄位  │ 20列 │|
|            |                 | │ 聯絡人    │ 3欄位  │ 8列  │|
|            |                 | └───────────────────────────┘|
+--App Rail--+--Wiki Nav--+--------Main Content---------+
```

---

## 3. 工作區（Workspace）

### 3.1 `/workspace`（工作區中心）

```
+--App Rail--+--Nav--+--------Main Content---------+
|            |       | 工作區中心                  |
|            |       | ─────────────────────────── |
|            |       | [建立工作區]                 |
|            |       |                             |
|            |       | ┌── 我的工作區 ─────────────┐|
|            |       | │ ┌─────────┐ ┌─────────┐  │|
|            |       | │ │  工作區  │ │  工作區  │  │|
|            |       | │ │  Marketing│ │ Product │  │|
|            |       | │ │  →進入    │ │  →進入  │  │|
|            |       | │ └─────────┘ └─────────┘  │|
|            |       | └───────────────────────────┘|
+--App Rail--+--Nav--+--------Main Content---------+
```

---

## 4. 組織管理（Organization）

### 4.1 `/organization/members`

```
+--App Rail--+--Org Nav--+--------Main Content---------+
|            | 成員 ●    | 組織 · 成員管理             |
|            | 團隊      | ─────────────────────────── |
|            | 權限      |                 [邀請成員]   |
|            | 工作區    |                             |
|            | 排程      | ┌── 成員列表 ───────────────┐|
|            | 每日      | │ 姓名  │ 角色   │ 狀態 │操作│|
|            | 稽核      | │───────│────────│──────│────│|
|            |           | │ Alice │ Admin  │ 活躍 │ … │|
|            |           | │ Bob   │ Member │ 活躍 │ … │|
|            |           | └───────────────────────────┘|
+--App Rail--+--Org Nav--+--------Main Content---------+
```

---

## 5. AI Chat

### 5.1 `/ai-chat`

```
+--App Rail--+--Nav--+--------Main Content---------+
|            |       | AI 對話                     |
|            |       | ─────────────────────────── |
|            |       | ┌── 對話歷史 ───────────────┐|
|            |       | │ 使用者: 這份文件說什麼?    │|
|            |       | │                           │|
|            |       | │ AI: 根據文件內容，...      │|
|            |       | │                           │|
|            |       | └───────────────────────────┘|
|            |       |                             |
|            |       | ┌── 輸入區 ─────────────────┐|
|            |       | │ 請輸入問題...    [送出 →]  │|
|            |       | └───────────────────────────┘|
+--App Rail--+--Nav--+--------Main Content---------+
```

---

## 6. 手機版線框圖

手機版（< 768px）調整三欄為單欄：

### 6.1 手機版 Documents

```
+--[Header: Wiki Beta · Documents]--+
| [← 返回]                [↺ 刷新] |
+-------------------------------------+
| ┌── 上傳檔案 ─────────────────────┐|
| │  .pdf .tiff .png .jpg            │|
| │  ╔═══════════════════╗           │|
| │  ║   點擊或拖曳上傳   ║           │|
| │  ╚═══════════════════╝           │|
| │  [上傳並啟動解析] [清除]         │|
| └─────────────────────────────────┘|
|                                     |
| ┌── Documents (N 筆) ──────────────┐|
| │ report.pdf                        │|
| │  ✓ ready · ✓ indexed · 12 頁    │|
| │  [手動重整]                       │|
| │─────────────────────────────────│|
| │ scan.tiff                         │|
| │  ⏳ processing · ⏳ pending      │|
| │  [— 解析中 —]                   │|
| └─────────────────────────────────┘|
```

### 6.2 手機版底部導覽（planned）

```
+─────────────────────────────────────+
| [工作區] [Wiki] [AI] [組織] [設定]  |
+─────────────────────────────────────+
```

---

## 7. 對話框（Dialog）設計

### 7.1 建立工作區 Dialog

```
+─────────────────────────────────────────+
│  建立工作區                          ✕  │
│                                         │
│  工作區名稱                             │
│  ┌─────────────────────────────────┐   │
│  │ 請輸入工作區名稱...              │   │
│  └─────────────────────────────────┘   │
│  {錯誤訊息（若有）}                    │
│                                         │
│                    [取消]  [建立工作區] │
+─────────────────────────────────────────+
```

### 7.2 刪除確認 Dialog

```
+─────────────────────────────────────────+
│  確認刪除                            ✕  │
│                                         │
│  您確定要刪除「{資源名稱}」嗎？         │
│  此操作無法復原。                       │
│                                         │
│                       [取消]  [確認刪除]│
+─────────────────────────────────────────+
```

---

## 8. 狀態元件規格

### 8.1 Status Badge

```
✓ ready         ← 綠色背景，白色文字
⏳ processing   ← 藍/琥珀色背景，白色文字
✗ error         ← 紅色背景，白色文字
— pending       ← 灰色背景，灰色文字
```

### 8.2 Loading Skeleton 

```
Documents 列表載入中：
+─────────────────────────────────────+
│ ▓▓▓▓▓▓▓▓▓▓▓ │ ▓▓▓▓▓▓▓ │ ▓▓▓▓▓  │
│ ▓▓▓▓▓▓▓▓    │ ▓▓▓▓▓▓▓ │ ▓▓▓    │
│ ▓▓▓▓▓▓▓▓▓▓  │ ▓▓▓▓▓▓  │ ▓▓▓▓   │
+─────────────────────────────────────+
（▓ 代表 Skeleton 骨架屏 pulse 動畫區塊）
```

---

## 相關主題

- 設計系統：色彩、字型規範
- UX 原則：互動規則、可近用性
- 資訊架構：全站路由地圖
- 規格索引：Wiki 與其他功能規格入口
````

## File: docs/handoffs.md
````markdown
# Handoffs

How work flows between commands and agents.

## Command Handoff Chain

```
/architect        →  artifacts/adr_*.md, system_design_*.md
       ↓
/builder          →  Code + tests
       ↓
/swarm-review     →  Feedback → back to /builder if needed
```

Each command reads the previous artifacts and builds on them.

## Swarm Orchestration Handoffs

```
/swarm-plan       →  artifacts/plan_*.md + Beads tasks
       ↓
/swarm-execute    →  Parallel workers implement tasks
       ↓
/swarm-review     →  Multi-perspective review (2-3x loop)
       ↓
PR creation       →  gh pr create
```

## Worker Completion

Every worker or session MUST follow the "Landing the Plane" protocol in `AGENTS.md`. The critical requirement: work is NOT complete until `git push` succeeds.

## Session Handoffs

Leave context for the next session:

```bash
# Write handoff message
echo '{"message": "Completed API endpoints. Remaining: tests for /users route."}' > .claude/hooks/.state/handoff.json
```

The next session's `session-start-loader.sh` will display this message on startup.

## Beads-Based Handoffs

Use Beads for structured handoffs between agents:

```bash
bd create "Continue: implement pagination for /users" --type=task
bd dep add <new-id> <completed-id>  # link dependency
```

Workers discover available work via `bd ready`.

---

[← Back to README](../README.md)
````

## File: docs/hooks.md
````markdown
# Hooks

Hooks run automatically at key points in Claude Code's lifecycle.

## Built-in Hooks

| Hook | Event | Purpose |
|------|-------|---------|
| `session-start-loader.sh` | SessionStart | Load Beads status, detect active swarm agents, process handoffs, cleanup stale sessions |
| `skill-activation-prompt.sh` | UserPromptSubmit | Suggest relevant skills based on context |
| `pre-tool-use-validator.sh` | PreToolUse | File locking, secret detection, protected file enforcement |
| `dangerous-command-guard.sh` | PreToolUse (Bash) | Guard against dangerous shell commands (force push, rm -rf, etc.) |
| `pre-push-main-blocker.sh` | PreToolUse (Bash) | Block direct pushes to main/master branch |
| `pre-commit-verification.sh` | PreToolUse (Bash) | Pre-commit quality checks |
| `post-tool-use-tracker.sh` | PostToolUse | Track file changes and sync with Beads |
| `stop-validator.sh` | Stop | Release file locks, cleanup session state, warn about uncommitted changes |
| `subagent-stop-validator.sh` | SubagentStop | Log swarm worker completion |

## Key Capabilities

### File Locking (pre-tool-use-validator.sh)

Prevents concurrent file edits in multi-agent swarm environments:
- Atomic lock acquisition via `mkdir` (race-condition safe)
- Lock auto-expires after 120 seconds
- Session-based: locks are tied to the session that created them
- Automatic release on session stop

### Secret Detection (pre-tool-use-validator.sh)

Scans Write/Edit content for 6 secret patterns:
1. Generic API keys, passwords, tokens
2. AWS access keys (`AKIA...`)
3. JWT tokens
4. Environment variable exports with secrets
5. GitHub personal access tokens (`ghp_...`)
6. Private keys (PEM format)

Test files (`*.test.ts`, `*.spec.ts`, etc.) are excluded to reduce false positives.

### Protected Files (pre-tool-use-validator.sh)

Blocks modifications to critical system files:
- `.beads/beads.db`, `.beads/daemon`
- `.git/`
- `.env`
- `.vscode/mcp.json`

### Push Blocking (pre-push-main-blocker.sh)

Enforces trunk-based development by blocking pushes to main/master:
- Detects explicit pushes (`git push origin main`)
- Detects implicit pushes (`git push` while on main branch)
- Provides remediation instructions (create feature branch, push there, create PR)

### Session Management (session-start-loader.sh + stop-validator.sh)

- Tracks active sessions in `.claude/hooks/.state/`
- Detects active swarm agents for coordination awareness
- Supports handoff messages between sessions
- Auto-cleans stale sessions older than 24 hours
- Warns about uncommitted changes on session stop
- Syncs Beads before exit

## Creating a Hook

1. Create `.claude/hooks/my-hook.sh`:

```bash
#!/bin/bash
input=$(cat)
# your logic
echo '{"continue": true}'
```

2. Make executable:
```bash
chmod +x .claude/hooks/my-hook.sh
```

3. Register in `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/my-hook.sh",
        "timeout": 5
      }]
    }]
  }
}
```

See `.claude/templates/hook.template.sh` for the full template.

## Hook Input

Hooks receive JSON via stdin:

```json
{
  "session_id": "abc123",
  "cwd": "/workspace",
  "prompt": "user message",
  "tool_name": "Write",
  "tool_input": {}
}
```

## Hook Output

For PreToolUse hooks, return a permission decision:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow|deny|ask",
    "permissionDecisionReason": "Explanation"
  }
}
```

## Runtime Directories

| Directory | Purpose | Gitignored |
|-----------|---------|------------|
| `.claude/hooks/.state/` | Session tracking files | Yes |
| `.claude/hooks/.locks/` | File lock files | Yes |

## Tips

- Keep hooks fast (< 5 seconds timeout)
- Test with: `echo '{}' | ./my-hook.sh`
- Override hooks via `settings.local.json`

---

[← Back to README](../README.md)
````

## File: docs/mcp-servers.md
````markdown
# MCP Servers

Model Context Protocol servers extend Claude's capabilities. The framework includes a curated set.

## Included Servers

### Sequential Thinking
Structured workspace for multi-step reasoning. Makes Claude's thought process visible and auditable.

**Best for:** Architecture decisions, debugging complex issues, planning

### Chrome DevTools
Browser automation with deep debugging — performance traces, network inspection, console access.

**Best for:** QA testing, frontend debugging, performance analysis

### Context7
Up-to-date documentation and code examples for any library via Context7.

**Best for:** Researching library APIs, finding code examples, validating implementation patterns

### Filesystem
File system operations beyond the workspace boundary.

**Best for:** Cross-project file access, operations outside the working directory

## Setup

The servers are configured in `.vscode/mcp.json`. Most work out of the box.

## Adding More Servers

Edit `.vscode/mcp.json`:

```json
{
  "servers": {
    "new-server": {
      "command": "npx",
      "args": ["@example/mcp-server"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

## Recommended Additions

| Server | Purpose | When to Add |
|--------|---------|-------------|
| GitHub | PRs, issues, code search | GitHub-heavy workflows (requires `GITHUB_TOKEN`) |
| PostgreSQL | Database queries | Working with Postgres |
| Brave Search | Web search | Research-heavy work |
| Slack | Team messaging | Team coordination |
| Linear | Issue tracking | If you use Linear |

### GitHub Example

```json
"github": {
  "command": "npx",
  "args": ["@anthropic-ai/mcp-server-github"],
  "env": {
    "GITHUB_TOKEN": "${GITHUB_TOKEN}"
  }
}
```

## Troubleshooting

### Server not starting

Check logs:
```bash
claude mcp list
```

### Permission denied

MCP servers run as your user. Check file permissions and API tokens.

## Resources

- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [MCP.so Directory](https://mcp.so/)

---

[← Back to README](../README.md)
````

## File: docs/personas.md
````markdown
# Commands

Commands are expert modes invoked via slash commands (e.g., `/architect`).

## Quick Reference

| Command | Role | Creates |
|---------|------|---------|
| `/architect` | System design | ADRs, system design docs |
| `/builder` | Implementation | Code, tests |
| `/qa-engineer` | Testing | Test plans, test suites |
| `/security-auditor` | Security | Audits, threat models |
| `/ui-ux-designer` | Interface design | Design specs, wireframes |
| `/code-check` | Codebase audit | SOLID/DRY violations, health report |
| `/swarm-plan` | Planning orchestrator | Parallel exploration, task decomposition |
| `/swarm-execute` | Execution orchestrator | Parallel workers, quality gates |
| `/swarm-review` | Adversarial reviewer | Multi-perspective code review |
| `/swarm-research` | Research orchestrator | Deep investigation, technology evaluation |

## Usage

Just use the command with your task:

```
/builder fix the caching bug
/architect design the payment system
/security-auditor payment system
```

Or chain them for a workflow:

```
/architect user auth           # writes design
/builder                       # reads design, implements
/swarm-review                  # reviews code
```

## How Handoffs Work

Each command reads the previous artifacts and builds on them. See [handoffs.md](handoffs.md).

## Creating Your Own

See [customization.md](customization.md#adding-a-command).

---

[← Back to README](../README.md)
````

## File: docs/README.md
````markdown
# Xuanwu Documentation

This directory is the documentation root for Xuanwu's product, architecture, development workflow, and AI delivery assets.

## Primary Entry Points

- [ddd/subdomains.md](./ddd/subdomains.md): strategic subdomain classification
- [ddd/bounded-contexts.md](./ddd/bounded-contexts.md): canonical bounded-context map
- [architecture/README.md](./architecture/README.md): cross-context architecture and ADR reading path
- [reference/specification/system-overview.md](./reference/specification/system-overview.md): system and product overview
- [development/README.md](./development/README.md): implementation and contributor guides

## Structure

- `ddd/`: strategic DDD maps and routing entrypoints
- `architecture/`: cross-context architecture explanations, decisions, and system diagrams
- `development/`: implementation guidance and repository-local execution rules
- `guides/how-to/`: task-oriented procedures
- `guides/explanation/`: concept-oriented architecture and reasoning
- `reference/`: precise facts, specifications, and reference material
- `tutorials/`: guided learning paths
- `templates/`: documentation templates

## Routing Rules

1. Start with `ddd/` when the question is about ownership, boundaries, or terminology routing.
2. Use `modules/<context>/*.md` for bounded-context details such as ubiquitous language, aggregates, events, repositories, and application services.
3. Use `architecture/` for cross-context reasoning, runtime boundaries, and ADRs.
4. Use `reference/` for exact facts and specifications.

## Authoring Constraints

1. Each document should serve one Diataxis purpose.
2. Link to canonical material instead of copying bounded-context knowledge into multiple places.
3. Keep document routing explicit so humans and agents can find the current owner quickly.
````

## File: docs/reference/README.md
````markdown
# Reference

Reference pages are information-oriented and must be exact, complete, and scannable.

## Include

- Signatures, fields, parameters, limits, defaults
- Request/response shapes or command syntax
- Error codes and edge conditions
- Versioned compatibility notes

## Exclude

- Step-by-step tutorials
- Opinionated implementation stories
- Extended rationale discussions
````

## File: docs/reference/specification/system-overview.md
````markdown
# 系統全局規格（System Overview Specification）

> **規格文件類型**：本文件描述 Xuanwu 的產品定位、目標用戶、核心能力、 bounded-context 拓樸、整合方式與運行時邊界。

---

## 1. 系統定位

Xuanwu 是一個面向個人與組織協作的 Knowledge Platform。它的產品目標是把分散的文件、筆記、知識頁面、知識庫文章、結構化資料與外部來源整合進同一個可治理的工作區系統，讓知識不只被保存，還能被驗證、檢索、推理，並進一步轉化為可執行的工作成果。

系統採用 Modular Monolith 的 Module-Driven Domain Design 架構，以 `knowledge` 與 `knowledge-base` 為核心域，透過 `workspace` 與 `organization` 建立治理與協作邊界，並以 `source`、`ai`、`search`、`notebook` 等支援域建立從外部內容攝入到檢索與研究生成的完整閉環。

### 1.1 核心價值主張

| 面向 | 價值 |
|---|---|
| **知識沉澱** | 以頁面、區塊、文章、資料庫與來源集合沉澱知識資產 |
| **知識治理** | 透過工作區、組織、審批、驗證、權限與稽核建立可治理性 |
| **語意檢索** | 透過 ingestion、chunking、indexing 與 retrieval 建立可追溯查詢能力 |
| **研究與生成** | 在 notebook 工作流中支援 ask/cite、摘要、洞察與知識生成 |
| **知識落地執行** | 將知識進一步轉化為工作流程、排程、動態與協作執行成果 |

---

## 2. 目標用戶

| 用戶類型 | 說明 | 核心需求 |
|---|---|---|
| **個人知識工作者** | 以個人帳號管理內容、來源與 AI 研究流程 | 頁面管理、來源整理、問答、摘要、知識生成 |
| **組織協作者** | 在組織帳號與工作區中共同維護知識與執行流程 | 共享知識、工作區協作、文章驗證、檢索與引用 |
| **組織管理員** | 負責成員、權限、治理與稽核可見性 | 組織管理、權限設定、稽核追查、政策治理 |

---

## 3. 核心能力

### 3.1 核心知識域

| 能力 | 說明 | Owner |
|---|---|---|
| Knowledge Pages | Notion-like 頁面、區塊、版本、審批與內容生命週期 | `knowledge` |
| Knowledge Base | 組織級 wiki / SOP / article 與分類樹、驗證狀態 | `knowledge-base` |
| Knowledge Collaboration | 留言、權限、版本快照 | `knowledge-collaboration` |
| Knowledge Database | 結構化資料庫、record、view、relation | `knowledge-database` |

### 3.2 來源、檢索與推理

| 能力 | 說明 | Owner |
|---|---|---|
| Source Ingestion | 外部文件、附件、來源集合與 ingestion handoff | `source` |
| AI Ingestion Pipeline | job 管理、chunk/index 準備與 worker handoff | `ai` |
| Semantic Search | retrieval、citation context、查詢品質回饋 | `search` |
| Notebook Workflow | ask/cite、摘要、研究、知識生成流程 | `notebook` |

### 3.3 協作與治理

| 能力 | 說明 | Owner |
|---|---|---|
| Identity & Account | 身份、token lifecycle、帳戶語意與個人化 | `identity`, `account` |
| Organization Governance | 組織、團隊、成員與租戶治理 | `organization` |
| Workspace Container | 工作區、工作區成員與模組組裝邊界 | `workspace` |
| Workspace Feed | 工作區動態與互動可見性 | `workspace-feed` |
| Workspace Flow | Task / Issue / Invoice 狀態機與知識物化流程 | `workspace-flow` |
| Workspace Scheduling | 排程、需求、容量協調 | `workspace-scheduling` |
| Workspace Audit | append-only 稽核軌跡 | `workspace-audit` |
| Notification | 通知偏好與輸出訊號 | `notification` |

---

## 4. 架構規格

### 4.1 Bounded Context 模型

Xuanwu 由多個具明確邊界的 bounded context 組成。每個 context 都擁有自己的 ubiquitous language、domain model、application use cases 與 infrastructure adapters。跨 context 溝通只允許透過以下兩種方式：

1. 目標 context 的 public `api/` surface
2. Published Domain Events 與其他明確事件契約

### 4.2 當前上下文分類

| 類別 | Contexts |
|---|---|
| **Core Domain** | `knowledge`, `knowledge-base` |
| **Supporting Subdomain** | `ai`, `knowledge-collaboration`, `knowledge-database`, `notebook`, `search`, `source`, `workspace-audit`, `workspace-feed`, `workspace-flow`, `workspace-scheduling` |
| **Generic Subdomain** | `identity`, `account`, `organization`, `workspace`, `notification` |
| **Shared Kernel** | `shared` |

完整地圖請見 [../../ddd/bounded-contexts.md](../../ddd/bounded-contexts.md)。

### 4.3 運行時邊界

| 運行時 | 職責 | 技術 |
|---|---|---|
| **Next.js** | UI、auth/session orchestration、route composition、Server Actions、workspace-scoped interaction flow | Next.js 16, React 19, TypeScript |
| **py_fn** | parsing、chunking、embedding、背景 ingestion 工作 | Python worker runtime |

### 4.4 Anti-Corruption Boundary

外部內容來源不直接寫入核心域模型。外部文件、第三方資料來源、AI/infra 服務契約，必須透過 `source` workflow 與各 bounded context 的 infrastructure adapters 轉譯後再進入系統，避免外部概念污染核心知識模型。

---

## 5. 整合方式

| 整合類型 | 說明 |
|---|---|
| Firebase | auth、firestore、storage 與 app hosting/integration capability |
| Python worker | 文件解析、chunking、embedding、worker-side pipeline |
| AI orchestration | Genkit 與相關模型/flow capability |
| Search / vector infrastructure | 語意檢索、citation context 與 retrieval support |

---

## 6. 系統級驗收目標

| 代號 | 標準 |
|---|---|
| S1 | 使用者可登入並進入 workspace-first shell |
| S2 | 使用者可建立或切換個人/組織帳號與工作區 |
| S3 | 使用者可建立知識頁面、文章、資料庫與來源集合 |
| S4 | 來源內容可經 ingestion pipeline 進入可檢索狀態 |
| S5 | ask/cite 或 notebook workflow 可回傳 answer 與 traceable citations |
| S6 | 管理員可治理組織成員、權限、稽核與工作區範圍 |
| S7 | 知識可進一步物化為 workflow、schedule、feed 等執行層結果 |
````

## File: docs/skills.md
````markdown
# Skills

Skills are structured workflows that Claude suggests based on what you're doing.

## How It Works

You don't invoke skills directly. Just describe what you need:

```
"I need to design an API for user management"
```

Claude sees relevant skills suggested (like `designing-apis`) and uses them to give you a better response.

## Available Skills

### Architecture
- `designing-systems` — Planning systems
- `designing-apis` — REST/GraphQL/gRPC
- `domain-driven-design` — Business domain modeling
- `cloud-native-patterns` — Microservices, containers
- `capacity-planning` — Scale and performance
- `writing-adrs` — Architecture Decision Records
- `defense-in-depth` — Layered security architecture

### Engineering
- `implementing-code` — Writing features
- `debugging` — Finding and fixing bugs
- `refactoring-code` — Improving structure
- `optimizing-code` — Performance
- `testing` — Writing tests
- `test-driven-development` — TDD workflow
- `dependency-management` — Package management
- `data-management` — Database design
- `data-to-ui` — JSON to React pipelines

### Product
- `writing-prds` — Product requirements
- `writing-pr-faqs` — Vision documents
- `decomposing-tasks` — Breaking down work
- `execution-roadmaps` — Project planning
- `requirements-analysis` — Clarifying scope
- `documentation` — Technical docs
- `estimating-work` — Effort sizing
- `brainstorming` — Ideation
- `agile-methodology` — Scrum/Kanban
- `context-management` — Onboarding/handoffs
- `reaching-consensus` — Decision facilitation

### Security
- `application-security` — Secure coding
- `threat-modeling` — Identifying threats
- `security-review` — Audits
- `compliance` — Regulatory requirements
- `identity-access` — Auth patterns

### Operations
- `infrastructure` — IaC, cloud setup
- `observability` — Logs, metrics, traces
- `incident-management` — Incident response
- `beads-workflow` — Issue tracking
- `swarm-coordination` — Multi-agent workflows
- `deploy-railway` — Railway deployments
- `deploy-aws-ecs` — ECS/Fargate deployments
- `deploy-cloudflare` — Cloudflare Pages/Workers
- `chaos-engineering` — Resilience testing

### Design
- `interface-design` — UI/UX
- `accessibility` — a11y
- `design-systems` — Component libraries
- `visual-assets` — Icons, images, graphics
- `component-recipes` — Tailwind component patterns
- `demo-design-tokens` — Default design tokens

### Languages & Frameworks
`typescript` · `python` · `go` · `rust` · `swift` · `kotlin` · `bash` · `terraform` · `react-patterns` · `biome` · `hono` · `tailwind-css` · `framer-motion` · `radix-ui` · `vite` · `expo-router` · `expo-sdk` · `react-native-patterns` · `nativewind` · `reanimated`

## What Triggers Skills

Skills activate based on **keywords** in your prompt (`"deploy"`, `"test"`, `"security"`). The skill-activation hook matches keywords defined in `.claude/skills/skill-rules.json`.

## Creating Your Own

See [customization.md](customization.md#adding-a-skill).

---

[← Back to README](../README.md)
````

## File: docs/SOURCE-OF-TRUTH.md
````markdown
# Source of Truth for Documentation Structure

This document defines the documentation routing model for Xuanwu.

## Documentation Ownership Model

1. `docs/ddd/` owns strategic DDD maps and documentation entrypoints.
2. `modules/<context>/*.md` owns bounded-context detail such as ubiquitous language, aggregates, domain events, context maps, repositories, and application services.
3. `docs/architecture/` owns cross-context reasoning, runtime boundaries, and ADR-driven explanation.
4. `docs/development/` owns implementation workflow and repository execution guidance.
5. `docs/reference/` owns exact facts and specification-style material.

## Diataxis Constraints

1. One purpose per document.
2. Prefer shallow hierarchy where practical.
3. Cross-link to the current owner instead of copying DDD content into multiple trees.
4. Keep strategic maps, context detail, and implementation guidance distinct.

## Project-Specific Notes

- `docs/ddd/subdomains.md` and `docs/ddd/bounded-contexts.md` are the top-level DDD routing entrypoints.
- Context detail is intentionally resolved through `modules/<context>/` until a future consolidation change explicitly moves ownership.
- Internal AI delivery and agent workflow docs may live under `docs/`, but they should not replace product or architecture entrypoints.
````

## File: docs/swarm.md
````markdown
# Swarm Workers

Lightweight agents that work in parallel. Use them for big tasks.

## Orchestration Commands

| Command | Role | Use |
|---------|------|-----|
| `/swarm-plan` | Planning Orchestrator | Parallel exploration, task decomposition, artifact creation |
| `/swarm-execute` | Execution Orchestrator | Parallel workers, quality gates, git push protocol |
| `/swarm-review` | Adversarial Reviewer | Multi-perspective code review, root cause analysis |
| `/swarm-research` | Research Orchestrator | Deep multi-source investigation, technology evaluation |
| `/code-check` | Codebase Auditor | Holistic codebase audit for SOLID, DRY, consistency, and code health |

### Full Cycle

```
/swarm-plan <feature>  →  /swarm-execute <plan>  →  /swarm-review <branch> (2-3x)  →  PR
```

## Available Workers

| Worker | Model | Best For |
|--------|-------|----------|
| `worker-explorer` | Haiku | Fast codebase search, dependency mapping |
| `worker-builder` | Sonnet | Implementation, testing, refactoring |
| `worker-reviewer` | Opus | Code review, security analysis |
| `worker-researcher` | Sonnet | Quick web research, API docs |
| `worker-research` | Opus | Deep multi-source investigation |
| `worker-architect` | Opus | Complex design decisions, ADRs |

## When to Use

**Good:**
- Searching a large codebase
- Implementing independent features in parallel
- Security scanning all components
- Reviewing multiple files
- Planning complex features with parallel exploration

**Avoid:**
- Sequential tasks with dependencies
- Simple single-file changes

## Swarm Patterns

### Parallel Exploration (via /swarm-plan)
```
Orchestrator spawns 3-6 worker-explorer agents
Each researches different aspects (patterns, deps, constraints, prior art)
Results aggregated into plan artifact
```

### Divide and Conquer (via /swarm-execute)
```
1. worker-architect designs solution
2. Break into independent tasks via Beads
3. Multiple worker-builder agents implement in parallel
4. worker-reviewer validates each
5. Orchestrator integrates
```

### Adversarial Review (via /swarm-review)
```
Parallel reviewers from different perspectives:
- Security (OWASP Top 10)
- Performance (N+1, blocking I/O, algorithms)
- Architecture (SOLID, coupling, cohesion)
- Test coverage
- Code quality
Findings consolidated with severity classification
```

## Coordination

Workers use Beads to avoid conflicts:

```bash
bd create "Implement user service"
bd update <id> --status in_progress  # worker claims
bd close <id> --reason "Done"        # worker completes
bd sync                              # sync with git
```

## Worker Completion

Workers MUST follow the "Landing the Plane" protocol from AGENTS.md. Work is NOT complete until `git push` succeeds.

## Tips

- Use Haiku for read-only tasks (faster, cheaper)
- Max 8 concurrent workers
- Don't have workers spawn workers (single-level only)
- Keep worker prompts under 500 tokens for fast startup

---

[← Back to README](../README.md)
````

## File: docs/templates/explanation.template.md
````markdown
# <Explanation Title>

## Problem

What problem this design addresses.

## Decision

What was chosen.

## Why

Reasoning and trade-offs.

## Alternatives

- <Alternative A>: <why not>
- <Alternative B>: <why not>

## Consequences

- <Positive impact>
- <Known limitation>
````

## File: docs/templates/how-to.template.md
````markdown
# <How-to Title>

## Task

State the task in one line.

## Before you start

- <Precondition>

## Procedure

1. <Action 1>
2. <Action 2>
3. <Action 3>

## Verify

- <Success criteria>

## Related

- Reference: <target>
- Explanation: <target>
````

## File: docs/templates/reference.template.md
````markdown
# <Reference Title>

## Summary

One-line scope statement.

## Specification

| Item | Type | Required | Default | Notes |
|---|---|---|---|---|
| <name> | <type> | <yes/no> | <value> | <note> |

## Errors

| Code | Condition | Resolution |
|---|---|---|
| <code> | <when> | <fix> |

## Compatibility

- <Version and behavior notes>
````

## File: docs/templates/tutorial.template.md
````markdown
# <Tutorial Title>

## Goal

Describe the concrete outcome.

## Prerequisites

- <Requirement 1>
- <Requirement 2>

## Steps

1. <Step 1>
2. <Step 2>
3. <Step 3>

## Validate

- <Expected checkpoint>

## Next

- Related how-to: <target>
- Related reference: <target>
````

## File: docs/tutorials/README.md
````markdown
# Tutorials

Tutorials are learning-oriented and guide a user from zero to a working outcome.

## Include

- Goal and expected outcome
- Prerequisites
- Step-by-step sequence
- Validation checkpoints
- Next steps links

## Exclude

- Full API tables
- Exhaustive option matrices
- Deep conceptual essays
````

## File: modules/account/AGENT.md
````markdown
# AGENT.md — account BC

## 模組定位

`account` 是 Xuanwu 平台的**帳戶管理**有界上下文，負責用戶 profile 與存取控制政策。在伺服器端消費 `identity/api`。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Account` | User、Profile、Member（在此 BC 內） |
| `AccountPolicy` | Permission、AccessRule、Role（作為存取控制） |
| `customClaims` | Claims、FirebaseClaims |
| `accountId` | userId、uid（在此 BC 之外的引用應使用 accountId） |

## 邊界規則

### ✅ 允許
```typescript
import { accountApi } from "@/modules/account/api";
import type { AccountDTO, AccountPolicyDTO } from "@/modules/account/api";
```

### ❌ 禁止
```typescript
import { Account } from "@/modules/account/domain/entities/Account";
// account use-cases 在 server 端 — 不要在 use-cases 中 import React/client hooks
```

## 關鍵依賴規則

- `modules/account/application/use-cases/account.use-cases.ts` 與 `modules/account/application/use-cases/account-policy.use-cases.ts` 在 server 端執行，可 import `identity/api`
- 不要在 application 層 import 任何含 `"use client"` 的模組

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/account/aggregates.md
````markdown
# Aggregates — account

## 聚合根：Account

### 職責
代表使用者在 Xuanwu 平台的業務身份記錄。管理 profile 資訊與帳戶狀態。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 帳戶主鍵（對應 Firebase uid） |
| `displayName` | `string` | 顯示名稱 |
| `email` | `string` | Email |
| `avatarUrl` | `string \| null` | 頭像 URL |
| `createdAt` | `Timestamp` | 建立時間 |

### 不變數

- 每個 Account 對應唯一一個 Firebase uid
- Account 建立後 id 不可變更

---

## 聚合根：AccountPolicy

### 職責
代表附加到帳戶的存取控制政策，定義哪些資源可存取、哪些動作被允許，並映射到 Firebase custom claims。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Policy 主鍵 |
| `accountId` | `string` | 關聯的 Account ID |
| `rules` | `PolicyRule[]` | 存取控制規則列表 |
| `effect` | `"allow" \| "deny"` | 規則效果 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `AccountRepository` | `save()`, `findById()`, `delete()` |
| `AccountQueryRepository` | `findById()`, `findByEmail()` |
| `AccountPolicyRepository` | `save()`, `findByAccountId()` |
````

## File: modules/account/application-services.md
````markdown
# account — Application Services

> **Canonical bounded context:** `account`
> **模組路徑:** `modules/account/`
> **Domain Type:** Generic Subdomain

本文件記錄 `account` 的 application layer 服務與 use cases。內容與 `modules/account/application/` 實作保持一致。

## Application Layer 職責

管理帳戶資料、偏好設定與帳戶政策，並在 server 端透過 identity/api 取得已驗證身份。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/account-policy.use-cases.ts`
- `application/use-cases/account.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/account/README.md`
- 模組 AGENT：`../../../modules/account/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/account/application-services.md`
````

## File: modules/account/context-map.md
````markdown
# Context Map — account

## 上游（依賴）

### identity → account（Customer/Supplier）

- `account` 依賴 `identity/api` 取得 uid 與 TokenRefreshSignal
- `modules/account/application/use-cases/account.use-cases.ts` 在 server 端 import `identity/api`

```
identity/api ──► account/application (server-side use-cases)
```

---

## 下游（被依賴）

### account → organization（Customer/Supplier）

- `organization` 的 `MemberReference` 使用 `accountId` 參照 Account
- Organization 成員列表以 `accountId` 為主鍵

### account → workspace（Customer/Supplier）

- `Workspace.accountId` 關聯帳戶或組織

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → account | identity | account | Customer/Supplier |
| account → organization | account | organization | Customer/Supplier |
| account → workspace | account | workspace | Customer/Supplier |
````

## File: modules/account/domain-events.md
````markdown
# Domain Events — account

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `account.created` | 新帳戶建立時 | `accountId`, `email`, `occurredAt` |
| `account.policy_updated` | AccountPolicy 更新時，觸發 custom claims 刷新 | `accountId`, `policyId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 事件 | 行動 |
|---------|------|------|
| `identity` | `TokenRefreshSignal` | 觸發 custom claims 重新計算與 Firebase token 更新 |

## 事件格式

```typescript
interface AccountCreatedEvent {
  readonly type: "account.created";
  readonly accountId: string;
  readonly email: string;
  readonly occurredAt: string;  // ISO 8601
}

interface AccountPolicyUpdatedEvent {
  readonly type: "account.policy_updated";
  readonly accountId: string;
  readonly policyId: string;
  readonly occurredAt: string;
}
```
````

## File: modules/account/domain-services.md
````markdown
# account — Domain Services

> **Canonical bounded context:** `account`
> **模組路徑:** `modules/account/`
> **Domain Type:** Generic Subdomain

本文件整理 `account` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/account/domain-services.md`
- `../../../modules/account/aggregates.md`
````

## File: modules/account/README.md
````markdown
# account — 帳戶上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/account/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`account` 承接 `identity` 的已驗證身份，管理個人檔案、偏好設定與帳戶政策，讓平台具備使用者層級的個人化與權限落點。它位於平台基礎層，負責把「登入身份」轉成「可持久化的帳戶語意」。

## 主要職責

| 能力 | 說明 |
|---|---|
| 帳戶設定檔 | 維護顯示名稱、頭像、偏好與其他個人資料 |
| 帳戶政策 | 管理 AccountPolicy、custom claims 與存取控制輔助資訊 |
| 個人化入口 | 為組織、工作區與通知提供使用者側設定基礎 |

## 與其他 Bounded Context 協作

- `identity` 提供身份與 token 上下文。
- `organization`、`workspace` 與 `notification` 以帳戶資料作為使用者語意來源。

## 核心聚合 / 核心概念

- **`Account`**
- **`AccountPolicy`**
- **`AccountProfile`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/account/repositories.md
````markdown
# account — Repositories

> **Canonical bounded context:** `account`
> **模組路徑:** `modules/account/`
> **Domain Type:** Generic Subdomain

本文件整理 `account` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/AccountPolicyRepository.ts`
- `domain/repositories/AccountQueryRepository.ts`
- `domain/repositories/AccountRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseAccountPolicyRepository.ts`
- `infrastructure/firebase/FirebaseAccountQueryRepository.ts`
- `infrastructure/firebase/FirebaseAccountRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/account/repositories.md`
- `../../../modules/account/aggregates.md`
````

## File: modules/account/ubiquitous-language.md
````markdown
# Ubiquitous Language — account

> **範圍：** 僅限 `modules/account/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 帳戶 | Account | 使用者在平台的業務記錄，含 profile 資訊與狀態 | `modules/account/domain/entities/Account.ts` |
| 帳戶政策 | AccountPolicy | 附加到帳戶的存取控制政策，決定 Firebase custom claims 內容 | `modules/account/domain/entities/AccountPolicy.ts` |
| 帳戶 ID | accountId | Account 的業務主鍵（對應 Firebase uid，但在業務層使用 accountId 術語） | `Account.id` |
| 自訂宣告 | customClaims | Firebase ID token 中的自訂 claims，由 AccountPolicy 決定 | `Account.customClaims` |
| 帳戶查詢庫 | AccountQueryRepository | CQRS 讀取側 Repository port | `domain/repositories/AccountQueryRepository.ts` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Account` | `User`, `Profile` |
| `AccountPolicy` | `Permission`, `Role`, `AccessRule` |
| `accountId` | `userId`（帳戶層應使用 accountId） |
````

## File: modules/ai/AGENT.md
````markdown
# AGENT.md — ai BC

## 模組定位

`ai` 是 RAG 攝入管線的 Job 協調支援域。管理 IngestionJob 生命週期，協調 py_fn/ Python worker。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `IngestionJob` | Job、Task（在此 BC 內）、ParseJob |
| `IngestionDocument` | Document、File（在此 BC 內）|
| `IngestionChunk` | Chunk、VectorChunk |
| `IngestionStatus` | Status, JobStatus |

## 棄用檔案守衛

以下檔案都是 `@deprecated` stubs，已在重構期間移除，**絕對不要** import：
- `modules/ai/domain/entities/graph-node.ts` → 已刪除（圖譜功能已移除）
- `modules/ai/domain/entities/link.ts` → 已刪除（圖譜功能已移除）
- `modules/ai/domain/repositories/GraphRepository.ts` → 已刪除（圖譜功能已移除）

## 邊界規則

### ✅ 允許
```typescript
import { aiApi } from "@/modules/ai/api";
import type { IngestionJobDTO } from "@/modules/ai/api";
```

### ❌ 禁止
```typescript
import { IngestionJob } from "@/modules/ai/domain/entities/IngestionJob";
import { graph-node } from "@/modules/ai/domain/entities/graph-node"; // deprecated stub
```

## Runtime 邊界規則

- `ai` 模組只在 Next.js 端做 Job 協調
- Embedding 生成在 `py_fn/` 執行，不要在 `ai` module 加入 heavy ML 邏輯

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/ai/aggregates.md
````markdown
# Aggregates — ai

## 聚合根：IngestionJob

### 職責
管理 RAG 攝入管線的單一工作記錄。追蹤從上傳到 indexed 的完整狀態機。

### 生命週期狀態機
```
uploaded ──► parsing ──► embedding ──► indexed
                │                         │
                └──────► failed ◄─────────┘
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Job 主鍵 |
| `documentId` | `string` | 關聯 SourceDocument ID |
| `organizationId` | `string` | 所屬組織 |
| `workspaceId` | `string` | 所屬工作區 |
| `status` | `IngestionStatus` | 當前狀態 |
| `startedAt` | `string \| null` | ISO 8601 開始時間 |
| `completedAt` | `string \| null` | ISO 8601 完成時間 |
| `errorMessage` | `string \| null` | 失敗原因 |

### 不變數

- `indexed` 狀態後不可再轉換回其他狀態
- `failed` 狀態的 errorMessage 不可為空

---

## 實體：IngestionDocument

### 職責
交付給攝入管線的文件元資料，提供 `py_fn/` worker 所需的來源資訊。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 文件主鍵 |
| `sourceFileId` | `string` | 關聯 SourceDocument ID |
| `mimeType` | `string` | 檔案 MIME type |
| `storageUrl` | `string` | Firebase Storage URL |

---

## 值物件：IngestionChunk

### 職責
文件切分後的向量化 chunk，由 `py_fn/` 生成後寫入 Firestore。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Chunk 主鍵 |
| `documentId` | `string` | 所屬文件 ID |
| `chunkIndex` | `number` | Chunk 在文件中的序號 |
| `content` | `string` | Chunk 文字內容 |
| `embedding` | `number[]` | 向量嵌入（由 py_fn/ 寫入） |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `IngestionJobRepository` | `save()`, `findByDocumentId()`, `listByWorkspace()`, `updateStatus()` |
````

## File: modules/ai/application-services.md
````markdown
# ai — Application Services

> **Canonical bounded context:** `ai`
> **模組路徑:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `ai` 的 application layer 服務與 use cases。內容與 `modules/ai/application/` 實作保持一致。

## Application Layer 職責

協調 RAG ingestion job 的生命週期，將重型 parse/chunk/embed 工作交給 py_fn/ 執行。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/link-extractor.service.ts`
- `application/use-cases/advance-ingestion-stage.use-case.ts`
- `application/use-cases/register-ingestion-document.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/ai/README.md`
- 模組 AGENT：`../../../modules/ai/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/ai/application-services.md`
````

## File: modules/ai/context-map.md
````markdown
# Context Map — ai

## 上游（依賴）

### source → ai（Customer/Supplier）

- `source.upload_completed` 觸發 `ai` 建立 IngestionJob
- `ai` 依賴 `source/api` 取得 SourceDocument 元資料（storageUrl、mimeType）

---

## 下游（被依賴）

### ai → search（Customer/Supplier）

- `ai.ingestion_completed` 通知 `search` 更新向量索引
- `search` 的 RAG 查詢依賴 `ai` 生成的 IngestionChunk

### ai → py_fn（Runtime Boundary）

**這不是 BC 間的 DDD 整合，而是 runtime 邊界分割：**

```
Next.js ai module ──[Firestore Job Record]──► py_fn/ worker
                   ──[Firebase Storage URL]──► py_fn/ worker
py_fn/ worker ──[Chunk + Embedding 寫回 Firestore]──► Next.js reads
```

- Next.js 端：Job 建立、狀態查詢、API
- `py_fn/`：parse / chunk / embed 實際執行

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| source → ai | source | ai | Published Language (Events) |
| ai → search | ai | search | Published Language (Events) |
| ai → py_fn | Next.js | py_fn | Runtime Boundary（非 DDD 邊界） |
````

## File: modules/ai/domain-events.md
````markdown
# Domain Events — ai

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `ai.ingestion_job_created` | 新 IngestionJob 建立 | `jobId`, `documentId`, `workspaceId`, `occurredAt` |
| `ai.ingestion_completed` | Job 狀態達到 `indexed` | `jobId`, `documentId`, `chunkCount`, `occurredAt` |
| `ai.ingestion_failed` | Job 狀態轉為 `failed` | `jobId`, `documentId`, `errorMessage`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `source` | `source.upload_completed` | 建立 IngestionJob，啟動攝入管線 |

## 消費 ai 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `search` | `ai.ingestion_completed` | 更新向量索引，RagDocument 標記為可查詢 |
| `source` | `ai.ingestion_completed` | 更新 SourceDocument 狀態為 ready |
| `workspace-audit` | `ai.ingestion_completed / failed` | 記錄攝入稽核軌跡 |
````

## File: modules/ai/domain-services.md
````markdown
# ai — Domain Services

> **Canonical bounded context:** `ai`
> **模組路徑:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

本文件整理 `ai` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/ai/domain-services.md`
- `../../../modules/ai/aggregates.md`
````

## File: modules/ai/README.md
````markdown
# ai — AI 攝入上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/ai/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`ai` 是 NotebookLM-like 推理能力的攝入協調層，負責把 `source` 交付的來源文件轉成可供 `search` 與 `notebook` 消費的結構化索引材料。它不直接承載使用者問答體驗，而是保證後續推理層有可靠、可追溯的資料基礎。

## 主要職責

| 能力 | 說明 |
|---|---|
| Ingestion Job 管理 | 追蹤 uploaded → parsing → embedding → indexed / failed 狀態生命週期 |
| Worker Handoff | 協調 Next.js 與 `py_fn/` 之間的重型 ingestion 工作交接 |
| Chunk / Index 前處理 | 接收文件切塊與索引前資料，為檢索層準備輸入 |

## 與其他 Bounded Context 協作

- `source` 是上游，提供來源文件與交接事件。
- `search` 消費 `ai` 產生的索引就緒資料；`notebook` 間接建立在這個攝入基礎上。

## 核心聚合 / 核心概念

- **`IngestionJob`**
- **`IngestionDocument`**
- **`IngestionChunk`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/ai/repositories.md
````markdown
# ai — Repositories

> **Canonical bounded context:** `ai`
> **模組路徑:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

本文件整理 `ai` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/GraphRepository.ts`
- `domain/repositories/IngestionJobRepository.ts`

## Infrastructure Implementations

- `infrastructure/InMemoryGraphRepository.ts`
- `infrastructure/InMemoryIngestionJobRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/ai/repositories.md`
- `../../../modules/ai/aggregates.md`
````

## File: modules/ai/ubiquitous-language.md
````markdown
# Ubiquitous Language — ai

> **範圍：** 僅限 `modules/ai/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 攝入工作 | IngestionJob | RAG 攝入管線的單一工作記錄，追蹤 parse/chunk/embed 的執行狀態 |
| 攝入文件 | IngestionDocument | 交付給攝入管線的文件元資料記錄 |
| 攝入 Chunk | IngestionChunk | 文件切分後的向量化單元（由 py_fn/ 生成） |
| 攝入狀態 | IngestionStatus | Job 的生命週期狀態：`uploaded \| parsing \| embedding \| indexed \| failed` |
| 文件 ID | documentId | 關聯的 source 模組 SourceDocument ID |
| 工作區 ID | workspaceId | Job 所屬的工作區 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `IngestionJob` | `Job`, `ParseJob`, `EmbedTask` |
| `IngestionDocument` | `Document`, `File`（在 ai BC 內） |
| `IngestionChunk` | `Chunk`, `VectorEntry` |
| `IngestionStatus` | `JobStatus`, `State` |
````

## File: modules/bounded-contexts.md
````markdown
# Modules Bounded Contexts（Canonical Link）

本文件僅作為 modules 層入口，避免與 DDD 主文件重複。

- ✅ Canonical Source: [`../docs/ddd/bounded-contexts.md`](../docs/ddd/bounded-contexts.md)
- 若需調整界限上下文內容，請只編輯 canonical 檔案。
- 各 bounded context 的術語、聚合、事件、儲存庫與應用服務文件仍以 `modules/<context>/*.md` 為詳細來源。
````

## File: modules/identity/AGENT.md
````markdown
# AGENT.md — identity BC

## 模組定位

`identity` 是 Firebase Authentication 的 domain 薄層封裝。無業務邏輯，只有驗證基礎設施抽象。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Identity` | User、CurrentUser、AuthUser |
| `TokenRefreshSignal` | TokenEvent、RefreshToken |
| `signIn` | login、authenticate |
| `signOut` | logout |
| `uid` | userId、id（在此 BC 內） |

## 邊界規則

### ✅ 允許
```typescript
import { identityApi } from "@/modules/identity/api";
import type { IdentityDTO } from "@/modules/identity/api";
```

### ❌ 禁止
```typescript
import { useTokenRefreshListener } from "@/modules/identity/interfaces/hooks/useTokenRefreshListener";
// ❌ api/ 不能含 "use client" 匯出 — account use-cases 在 server 端 import api/
```

## 關鍵守衛

- `modules/identity/api/index.ts` 不得 re-export 任何含 `"use client"` 的檔案
- hooks（`useTokenRefreshListener`）只能從 interfaces 層使用，不可進入 api barrel

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/identity/aggregates.md
````markdown
# Aggregates — identity

## 聚合根：Identity

### 職責
代表一個已通過 Firebase Authentication 驗證的使用者。提供讀取身份資訊的能力。

### 屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `uid` | `string` | Firebase UID（主鍵） |
| `email` | `string \| null` | 使用者 Email |
| `displayName` | `string \| null` | 顯示名稱 |
| `photoURL` | `string \| null` | 頭像 URL |

### 不變數

- `uid` 永遠不為空（由 Firebase 保證）
- `Identity` 物件是唯讀的（由 Firebase Auth SDK 產生）

---

## 值物件：TokenRefreshSignal

### 職責
代表「token 需要刷新」的事件訊號，觸發 `account` 域更新 custom claims。

### 屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `uid` | `string` | 需要刷新 token 的使用者 UID |
| `occurredAt` | `string` | ISO 8601 時間戳 |

---

## Repository Interfaces

| 介面 | 主要方法 | 說明 |
|------|---------|------|
| `IdentityRepository` | `signIn()`, `signOut()`, `getCurrentIdentity()` | Firebase Auth 操作 |
| `TokenRefreshRepository` | `listenToTokenRefresh()` | 監聽 token 刷新事件 |
````

## File: modules/identity/application-services.md
````markdown
# identity — Application Services

> **Canonical bounded context:** `identity`
> **模組路徑:** `modules/identity/`
> **Domain Type:** Generic Subdomain

本文件記錄 `identity` 的 application layer 服務與 use cases。內容與 `modules/identity/application/` 實作保持一致。

## Application Layer 職責

封裝 Firebase Authentication，提供登入、登出與 token refresh 能力。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/identity-error-message.ts`
- `application/use-cases/identity.use-cases.ts`
- `application/use-cases/token-refresh.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/identity/README.md`
- 模組 AGENT：`../../../modules/identity/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/identity/application-services.md`
````

## File: modules/identity/context-map.md
````markdown
# Context Map — identity

## 此 BC 的整合模式

### 上游（依賴）

`identity` 是最基礎的 Generic Subdomain，不依賴任何其他業務 BC。

**外部依賴：** Firebase Authentication SDK（第三方服務，Anti-Corruption Layer 在 infrastructure 層）

---

### 下游（被依賴）

#### `account` ← identity（Customer/Supplier）

- **模式：** Customer/Supplier
- **方向：** `identity` 是 Supplier（上游），`account` 是 Customer（下游）
- **整合方式：** `account` application use-cases 在 server 端 import `identity/api` 取得身份上下文
- **關鍵規則：** `identity/api` 不得含任何 `"use client"` 匯出

```
identity/api ──import──► account/application/use-cases/*.ts（server-side）
```

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → account | identity | account | Customer/Supplier |
| Firebase Auth → identity | Firebase | identity | Anti-Corruption Layer |
````

## File: modules/identity/domain-events.md
````markdown
# Domain Events — identity

## 發出事件

`identity` 域目前不發出 DomainEvent（Firebase Auth 事件由 SDK 直接處理，不經過領域事件匯流排）。

未來如需追蹤登入稽核，可考慮加入：

| 潛在事件 | 觸發條件 | 說明 |
|---------|---------|------|
| `identity.signed_in` | 使用者成功登入 | 供 `workspace-audit` 消費 |
| `identity.signed_out` | 使用者登出 | 供稽核紀錄消費 |

## 訂閱事件

`identity` 不訂閱其他 BC 的事件。

## TokenRefreshSignal（非正式事件）

`TokenRefreshSignal` 是透過 `TokenRefreshRepository.listenToTokenRefresh()` 的 Observable 訊號，不是正式的 DomainEvent，但語意上扮演事件角色：

```typescript
// account use-case 消費此訊號
identityApi.listenToTokenRefresh()
  .subscribe(() => accountApi.refreshCustomClaims(uid));
```
````

## File: modules/identity/domain-services.md
````markdown
# identity — Domain Services

> **Canonical bounded context:** `identity`
> **模組路徑:** `modules/identity/`
> **Domain Type:** Generic Subdomain

本文件整理 `identity` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/identity/domain-services.md`
- `../../../modules/identity/aggregates.md`
````

## File: modules/identity/README.md
````markdown
# identity — 身份驗證上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/identity/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`identity` 是整個平台的身份入口，封裝 Firebase Authentication 與 session 起點。它對產品價值並不差異化，但所有工作區、知識與 AI 互動都建立在正確的身份語意之上。

## 主要職責

| 能力 | 說明 |
|---|---|
| 登入 / 登出 | 處理 signIn、signOut 與身份狀態切換 |
| Token 生命週期 | 管理 token refresh 與相關身份訊號 |
| 身份上下文供應 | 向 `account`、`organization`、`workspace` 提供穩定的身份讀取入口 |

## 與其他 Bounded Context 協作

- `account` 直接消費 `identity/api` 提供的身份上下文。
- `organization` 與 `workspace` 依賴身份語意建立成員與存取規則。

## 核心聚合 / 核心概念

- **`Identity`**
- **`AuthenticatedUser`**
- **`TokenRefreshSignal`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/identity/repositories.md
````markdown
# identity — Repositories

> **Canonical bounded context:** `identity`
> **模組路徑:** `modules/identity/`
> **Domain Type:** Generic Subdomain

本文件整理 `identity` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/IdentityRepository.ts`
- `domain/repositories/TokenRefreshRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseIdentityRepository.ts`
- `infrastructure/firebase/FirebaseTokenRefreshRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/identity/repositories.md`
- `../../../modules/identity/aggregates.md`
````

## File: modules/identity/ubiquitous-language.md
````markdown
# Ubiquitous Language — identity

> **範圍：** 僅限 `modules/identity/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 身份 | Identity | Firebase Auth 驗證後的使用者記錄，以 `uid` 為唯一識別碼 | `modules/identity/domain/entities/` |
| 唯一身份碼 | uid | Firebase Authentication 產生的使用者全域唯一 ID | `Identity.uid` |
| Token 刷新訊號 | TokenRefreshSignal | 代表 Firebase ID token 需要更新的訊號物件 | `domain/entities/` |
| 登入 | signIn | 透過 Email 或 OAuth 建立 Firebase Auth session | `IdentityRepository.signIn()` |
| 登出 | signOut | 終止 Firebase Auth session | `IdentityRepository.signOut()` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Identity` | `User`, `AuthUser`, `CurrentUser` |
| `uid` | `userId`, `id`, `accountId`（在此 BC 內） |
| `TokenRefreshSignal` | `RefreshToken`, `TokenEvent` |
````

## File: modules/knowledge-base/AGENT.md
````markdown
# knowledge-base — DDD Agent

## 戰略分類

| 屬性 | 值 |
|---|---|
| **Domain Type** | **Core Domain** — 產品差異化核心 |
| **Module** | `modules/knowledge-base/` |
| **Aggregates** | Article, Category |
| **Key Events** | article_created / published / verified, category_created |

## 為何是 Core Domain

組織知識庫（SOP / Wiki）直接承載知識平台的可信度與協作深度，與 `knowledge`（個人筆記）共同構成 Xuanwu 的差異化競爭壁壘。

## 關鍵設計決策

1. **Article ≠ Page** — 明確分離個人（knowledge）與組織（knowledge-base）知識邊界
2. **VerificationState** — 組織知識的準確性治理，設計為 BC 內建能力而非協作插件
3. **Backlink** — 由 `BacklinkExtractorService` 從 markdown 自動解析，保持 Article 圖譜一致性
4. **Category 深度限制 5 層** — 防止過深的知識組織結構降低導航效率
5. **D3 Promote 協議** — `knowledge-base` 擁有 Page → Article 提升的業務規則；透過訂閱 `knowledge.page_promoted` 事件建立 Article（`status=draft`）

## 詳細實作文件

→ [`modules/knowledge-base/`](../../modules/knowledge-base/)
````

## File: modules/knowledge-base/aggregates.md
````markdown
# knowledge-base — 聚合根摘要

> 詳細設計見 [`modules/knowledge-base/aggregates.md`](../../modules/knowledge-base/aggregates.md)

## Article（聚合根）

| 欄位 | 說明 |
|---|---|
| `id` | 唯一識別碼 |
| `title`, `content` | 文章標題與主體 |
| `status` | `draft` / `published` / `archived` |
| `verificationState` | `verified` / `needs_review` / `unverified` |
| `ownerId` | 文章負責人（ArticleOwner） |
| `linkedArticleIds` | Backlink 引用列表 |
| `categoryId` | 所屬分類 |
| `tags` | 標籤列表 |

## Category（聚合根）

| 欄位 | 說明 |
|---|---|
| `id` | 唯一識別碼 |
| `name`, `slug` | 分類名稱與 URL 識別碼 |  
| `parentCategoryId` | 父分類（null = 根節點） |
| `depth` | 層級深度（最大 5）|
| `articleIds` | 直屬文章 ID 列表 |
````

## File: modules/knowledge-base/application-services.md
````markdown
# knowledge-base — Application Services

> 詳細 Use Case 清單見 [`modules/knowledge-base/application-services.md`](../../modules/knowledge-base/application-services.md)

**Article:** CreateArticle, UpdateArticle, PublishArticle, ArchiveArticle, VerifyArticle, RequestArticleReview, AssignArticleOwner, TransferArticleCategory, ExtractArticleBacklinks, **PromotePageToArticle**（D3：處理 `knowledge.page_promoted` 事件，建立 Article）

**Category:** CreateCategory, RenameCategory, MoveCategory, DeleteCategory
````

## File: modules/knowledge-base/context-map.md
````markdown
# knowledge-base — Context Map

> 詳細關係見 [`modules/knowledge-base/context-map.md`](../../modules/knowledge-base/context-map.md)

## 上游

- `workspace` / `identity` / `organization` — Conformist
- `knowledge-collaboration` — Customer/Supplier（Permission 資訊）
- `knowledge` — Customer/Supplier（**D3 Promote 協議**：訂閱 `knowledge.page_promoted`，由 `knowledge-base` 建立 Article）
- `knowledge-database` — Open Host Service（Article 可與 Record 連結；knowledge-base 呼叫 knowledge-database OHS API）

## 下游

- `notification` / `workspace-feed` — Published Language（事件消費）
- `workspace-audit` — Published Language（審計紀錄）

## Promote 協議（D3）

`knowledge-base` 是 Promote 協議的業務規則擁有者：

1. 使用者觸發「提升為文章」操作（via `knowledge-base` Server Action）
2. `knowledge` BC 執行頁面驗證並發出 `knowledge.page_promoted` 事件
3. `knowledge-base` 訂閱後依 `pageId` 建立對應 Article（`status=draft`）
4. 提升後原 KnowledgePage 保留（不歸檔）；Article 成為知識庫主版本
````

## File: modules/knowledge-base/domain-events.md
````markdown
# knowledge-base — 領域事件

> 詳細事件定義見 [`modules/knowledge-base/domain-events.md`](../../modules/knowledge-base/domain-events.md)

## 事件清單

| 事件 | 觸發條件 |
|---|---|
| `knowledge-base.article_created` | 文章建立（狀態 draft）— 含透過 Promote 協議從 KnowledgePage 建立的 Article |
| `knowledge-base.article_updated` | 文章內容更新 |
| `knowledge-base.article_published` | draft → published |
| `knowledge-base.article_archived` | 文章封存 |
| `knowledge-base.article_verified` | 知識管理員驗證文章 |
| `knowledge-base.article_review_requested` | 標記為 needs_review |
| `knowledge-base.article_owner_assigned` | 指派文章負責人 |
| `knowledge-base.category_created` | 建立分類目錄 |
| `knowledge-base.category_moved` | 分類移動到新父節點 |

## 訂閱事件（D3 Promote 協議）

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `knowledge` | `knowledge.page_promoted` | 依 `pageId` 建立 Article（`status=draft`），完成 Promote 協議 |
````

## File: modules/knowledge-base/domain-services.md
````markdown
# knowledge-base — Domain Services

> 詳細實作見 [`modules/knowledge-base/domain-services.md`](../../modules/knowledge-base/domain-services.md)

- `BacklinkExtractorService` — 從 article content 解析 `[[wikilink]]` 標題
- `ArticleSlugService` — title → URL-safe slug 轉換
- `CategoryDepthValidator` — 驗證分類層級不超過 5 層
````

## File: modules/knowledge-base/README.md
````markdown
# knowledge-base — DDD Reference

> **Domain Type:** Core Domain
> **Module:** `modules/knowledge-base/`
> **詳細模組文件:** [`modules/knowledge-base/`](../../modules/knowledge-base/)

## 戰略定位

`knowledge-base` 是 Xuanwu 的第二核心域（與 `knowledge` 並列），提供組織級公開知識庫能力。它使知識平台從個人筆記進化為組織可共享、可驗證、可結構化的知識網路。

## Bounded Context 邊界

- **擁有：** Article（文章）、Category（分類）
- **不擁有：** 個人 Page（→ `knowledge`）、版本歷史（→ `knowledge-collaboration`）、結構化資料（→ `knowledge-database`）

## 核心聚合

詳見 [aggregates.md](../../modules/knowledge-base/aggregates.md)

- **Article** — 組織知識文章（SOP / Wiki），具備 VerificationState 與 ArticleOwner
- **Category** — 層級分類目錄（最多 5 層）

## 主要領域事件

詳見 [domain-events.md](../../modules/knowledge-base/domain-events.md)

- `knowledge-base.article_created`
- `knowledge-base.article_published`
- `knowledge-base.article_verified`
- `knowledge-base.article_review_requested`
- `knowledge-base.category_created`

## 通用語言

詳見 [ubiquitous-language.md](../../modules/knowledge-base/ubiquitous-language.md)

- **Article** ≠ Page（個人筆記）≠ Document（泛型）
- **VerificationState** ≠ ApprovalState（knowledge 的審核）
- **Backlink** = `[[Article Title]]` wikilink 解析結果

## 上下文關係

詳見 [context-map.md](../../modules/knowledge-base/context-map.md)

| 關係 | BC | 類型 |
|---|---|---|
| 上游 | `workspace`, `identity`, `organization` | Conformist |
| 上游 | `knowledge-collaboration` | Customer/Supplier |
| 上游 | `knowledge` | Customer/Supplier（D3 Promote：訂閱 `knowledge.page_promoted` 建立 Article） |
| 上游 | `knowledge-database` | Open Host Service（Article-Record 連結） |
| 下游 | `notification`, `workspace-feed` | Published Language |
````

## File: modules/knowledge-base/repositories.md
````markdown
# knowledge-base — Repositories

> 詳細介面見 [`modules/knowledge-base/repositories.md`](../../modules/knowledge-base/repositories.md)

- `IArticleRepository` — CRUD + search + backlink 反查
- `ICategoryRepository` — 層級樹操作 + articleIds 管理

**Firestore:** `knowledge_base_articles` / `knowledge_base_categories`
````

## File: modules/knowledge-base/ubiquitous-language.md
````markdown
# knowledge-base — 通用語言

> 詳細定義見 [`modules/knowledge-base/ubiquitous-language.md`](../../modules/knowledge-base/ubiquitous-language.md)

## 核心術語速查

| 術語 | 定義 |
|---|---|
| **Article** | 組織級知識文章（SOP / Wiki） |
| **Category** | 層級分類目錄（max 5 層） |
| **VerificationState** | `verified` / `needs_review` / `unverified` |
| **ArticleOwner** | 負責維護文章準確性的使用者 |
| **Backlink** | `[[Article Title]]` 解析的反向引用 |
| **Promote** | Page（知識）升級為 Article（知識庫）的跨 BC 協議 |
````

## File: modules/knowledge-collaboration/AGENT.md
````markdown
# knowledge-collaboration — DDD Agent

**Domain Type:** Supporting + Generic Subdomain | **Module:** `modules/knowledge-collaboration/`

為 `knowledge` 和 `knowledge-base` 提供協作能力（Comment / Permission / Version）。不擁有知識內容，透過 `contentId` opaque reference 與內容 BC 協作。

→ 詳細文件: [`modules/knowledge-collaboration/`](../../modules/knowledge-collaboration/)
````

## File: modules/knowledge-collaboration/aggregates.md
````markdown
**Comment** — contentId + authorId + body，支援 parentCommentId（一層 thread）
**Permission** — subjectId + principalId + level（view/comment/edit/full），upsert 語意
**Version** — contentId + snapshotBlocks，immutable，最多 100 筆（具名版本除外）

→ 詳細設計: [`modules/knowledge-collaboration/aggregates.md`](../../modules/knowledge-collaboration/aggregates.md)
````

## File: modules/knowledge-collaboration/application-services.md
````markdown
Comment: CreateComment, UpdateComment, DeleteComment, ResolveComment, ListComments
Permission: GrantPermission, RevokePermission, CheckPermission, ListPermissions
Version: CreateVersion, RestoreVersion, ListVersions, LabelVersion

→ 詳細設計: [`modules/knowledge-collaboration/application-services.md`](../../modules/knowledge-collaboration/application-services.md)
````

## File: modules/knowledge-collaboration/context-map.md
````markdown
上游: `workspace`, `identity`, `knowledge`, `knowledge-base`, `knowledge-database`
下游消費者: `notification`, `workspace-feed`, `workspace-audit`

→ 詳細設計: [`modules/knowledge-collaboration/context-map.md`](../../modules/knowledge-collaboration/context-map.md)
````

## File: modules/knowledge-collaboration/domain-events.md
````markdown
- `knowledge-collaboration.comment_created` / `comment_resolved`
- `knowledge-collaboration.permission_granted` / `permission_revoked`
- `knowledge-collaboration.version_created` / `version_restored`
- `knowledge-collaboration.page_locked`

→ 詳細設計: [`modules/knowledge-collaboration/domain-events.md`](../../modules/knowledge-collaboration/domain-events.md)
````

## File: modules/knowledge-collaboration/domain-services.md
````markdown
- `PermissionLevelComparator` — view < comment < edit < full 比較, 防止超授
- `VersionRetentionPolicy` — 保留最多 100 個版本，具名版本不刪

→ [`modules/knowledge-collaboration/domain-services.md`](../../modules/knowledge-collaboration/domain-services.md)
````

## File: modules/knowledge-collaboration/README.md
````markdown
# knowledge-collaboration — DDD Reference

> **Domain Type:** Supporting Subdomain + Generic Subdomain
> **Module:** `modules/knowledge-collaboration/`
> **詳細模組文件:** [`modules/knowledge-collaboration/`](../../modules/knowledge-collaboration/)

## 戰略定位

`knowledge-collaboration` 為 `knowledge` 和 `knowledge-base` 提供協作基礎設施：留言討論、細粒度存取權限、版本快照。它不擁有知識內容，只提供協作能力。

## 核心聚合

- **Comment** — 線程式留言，透過 `contentId` 引用內容
- **Permission** — `(subjectId, principalId)` 的存取授權，級別：view < comment < edit < full
- **Version** — Block 快照，immutable，最多保留 100 個（具名版本除外）

## 主要領域事件

- `knowledge-collaboration.comment_created` / `comment_resolved`
- `knowledge-collaboration.permission_granted` / `permission_revoked`
- `knowledge-collaboration.version_created` / `version_restored`
- `knowledge-collaboration.page_locked`

## 通用語言

| 術語 | 定義 |
|---|---|
| **Comment** | 針對 contentId 的留言（root 或 reply） |
| **Permission** | 單一 (subject, principal) 的存取授權記錄 |
| **PermissionLevel** | `view` < `comment` < `edit` < `full` |
| **Version** | immutable Block 快照 |
| **NamedVersion** | 具有人工標籤的具名版本（不自動刪除） |
| **contentId** | opaque reference 到任意知識內容 |

## 上下文關係

| 關係 | BC | 類型 |
|---|---|---|
| 上游 | `workspace`, `identity` | Conformist |
| 上游 | `knowledge`, `knowledge-base`, `knowledge-database` | Customer/Supplier |
| 下游 | `notification`, `workspace-feed`, `workspace-audit` | Published Language |
````

## File: modules/knowledge-collaboration/repositories.md
````markdown
ICommentRepository, IPermissionRepository, IVersionRepository

Firestore: `knowledge_comments` / `knowledge_permissions` / `knowledge_versions`

→ [`modules/knowledge-collaboration/repositories.md`](../../modules/knowledge-collaboration/repositories.md)
````

## File: modules/knowledge-collaboration/ubiquitous-language.md
````markdown
| Comment | 留言（≠ Note, Message） |
| Permission | 存取授權（≠ Role） |
| PermissionLevel | view < comment < edit < full |
| Version | Block 快照（≠ Revision, History） |
| NamedVersion | 附標籤的具名版本（不自動刪除） |
| contentId | opaque ID 跨 BC 引用 |
| PageLock | 防並發的暫時鎖定 |

→ [`modules/knowledge-collaboration/ubiquitous-language.md`](../../modules/knowledge-collaboration/ubiquitous-language.md)
````

## File: modules/knowledge-database/AGENT.md
````markdown
# knowledge-database — DDD Agent

**Domain Type:** Supporting Subdomain | **Module:** `modules/knowledge-database/`

提供結構化資料庫能力（Database / Record / View）。對應 Notion Database。不擁有知識文字內容，專注於結構化資料的 Schema 管理與多視圖展示。

→ 詳細文件: [`modules/knowledge-database/`](../../modules/knowledge-database/)
````

## File: modules/knowledge-database/aggregates.md
````markdown
**Database** — name + fields(Schema) + viewIds; Schema 是 invariant 邊界
**Record** — databaseId + properties(Map<fieldId, value>) + order
**View** — databaseId + type(table/board/list/calendar/timeline/gallery) + filters + sorts + groupBy

→ [`modules/knowledge-database/aggregates.md`](../../modules/knowledge-database/aggregates.md)
````

## File: modules/knowledge-database/application-services.md
````markdown
Database: CreateDatabase, RenameDatabase, AddField, UpdateField, DeleteField, ReorderFields
View: CreateView, UpdateViewFilters, UpdateViewSorts, UpdateViewGroupBy, HideFieldsInView, DeleteView
Record: AddRecord, UpdateRecord, DeleteRecord, LinkRecords, UnlinkRecords, QueryRecords

→ [`modules/knowledge-database/application-services.md`](../../modules/knowledge-database/application-services.md)
````

## File: modules/knowledge-database/context-map.md
````markdown
上游: `workspace`, `identity`, `knowledge-collaboration`(Permission), `knowledge`(KnowledgeCollection opaque ref / D1)
下游: `knowledge-base`(article-record link), `workspace-feed`, `notification`

> **D1 決策**：`knowledge-database` 完整擁有 `spaceType="database"` 的 Database/Record/View 聚合。`knowledge` 提供 `KnowledgeCollection.id` 作為 opaque reference，不參與結構化資料管理。

→ [`modules/knowledge-database/context-map.md`](../../modules/knowledge-database/context-map.md)
````

## File: modules/knowledge-database/domain-events.md
````markdown
- `knowledge-database.database_created` / `database_renamed`
- `knowledge-database.field_added` / `field_deleted`
- `knowledge-database.record_added` / `record_updated` / `record_deleted`
- `knowledge-database.record_linked`
- `knowledge-database.view_created` / `view_updated`

→ [`modules/knowledge-database/domain-events.md`](../../modules/knowledge-database/domain-events.md)
````

## File: modules/knowledge-database/domain-services.md
````markdown
- `FieldValueValidator` — 驗證 Record property 值符合 Field 類型規範
- `ViewQueryBuilder` — 將 View filter/sort/groupBy 轉為查詢參數

→ [`modules/knowledge-database/domain-services.md`](../../modules/knowledge-database/domain-services.md)
````

## File: modules/knowledge-database/README.md
````markdown
# knowledge-database — DDD Reference

> **Domain Type:** Supporting Subdomain
> **Module:** `modules/knowledge-database/`
> **詳細模組文件:** [`modules/knowledge-database/`](../../modules/knowledge-database/)

## 戰略定位

`knowledge-database` 對應 Notion Database 能力，提供結構化資料儲存與多視圖展示。使用者可定義欄位 Schema，以不同視圖（Table/Board/Calendar/Timeline/Gallery）探索相同資料。

## 核心聚合

- **Database** — 欄位 Schema 容器 + 視圖清單；invariant 邊界
- **Record** — 單行資料，properties Map（fieldId → value）
- **View** — 視圖配置：type + filters + sorts + groupBy

## 視圖類型

`table` | `board` | `list` | `calendar` | `timeline` | `gallery`

## 欄位類型

`text` | `number` | `select` | `multi_select` | `date` | `checkbox` | `url` | `email` | `relation` | `formula` | `rollup`

## 主要領域事件

- `knowledge-database.database_created`
- `knowledge-database.field_added` / `field_deleted`
- `knowledge-database.record_added` / `record_updated` / `record_deleted`
- `knowledge-database.record_linked`
- `knowledge-database.view_created` / `view_updated`

## 通用語言

| 術語 | 定義 |
|---|---|
| **Database** | 結構化資料容器（≠ KnowledgeCollection） |
| **Field** | Schema 欄位定義（≠ Column） |
| **Record** | 資料行（≠ Row, Item） |
| **Property** | Record 中某 Field 的具體值 |
| **View** | 視圖配置（不持有資料） |
| **Relation** | 跨 Database 的 Record 連結欄位類型 |

## 上下文關係

| 關係 | BC | 類型 |
|---|---|---|
| 上游 | `workspace`, `identity`, `organization` | Conformist |
| 上游 | `knowledge-collaboration` | Customer/Supplier（Permission） |
| 上游 | `knowledge` | Customer/Supplier（KnowledgeCollection opaque ref / D1） |
| 下游 | `knowledge-base` | Open Host Service（Article-Record link） |
| 下游 | `workspace-feed`, `notification` | Published Language |
````

## File: modules/knowledge-database/repositories.md
````markdown
IDatabaseRepository, IRecordRepository, IViewRepository

Firestore: `knowledge_databases` / `knowledge_db_records` / `knowledge_db_views`

→ [`modules/knowledge-database/repositories.md`](../../modules/knowledge-database/repositories.md)
````

## File: modules/knowledge-database/ubiquitous-language.md
````markdown
| Database | 結構化資料容器（≠ KnowledgeCollection） |
| Field | 欄位定義（≠ Column）|
| Record | 資料行（≠ Row, Item, Entry）|
| Property | 某 Field 的具體值（Map） |
| View | 視圖配置 — 不持有資料 |
| ViewType | table/board/list/calendar/timeline/gallery |
| Relation | 跨 Database 的 Record 連結欄位 |

→ [`modules/knowledge-database/ubiquitous-language.md`](../../modules/knowledge-database/ubiquitous-language.md)
````

## File: modules/knowledge/AGENT.md
````markdown
# AGENT.md — knowledge BC

## 模組定位

`knowledge` 是 Core Domain，管理 KnowledgePage 的完整生命週期。`knowledge.page_approved` 是平台的核心整合事件，觸發 workspace-flow 物化流程。

`knowledge` 對應 Notion 的核心功能集：Pages（KnowledgePage）、Blocks（ContentBlock）、Wiki/Knowledge Base（KnowledgeCollection with spaceType="wiki"，帶頁面驗證與所有權）。**Databases（spaceType="database"）的完整 Schema/Record/View 生命週期由 `knowledge-database` BC 擁有（D1 決策）；`knowledge` 僅持有 KnowledgeCollection.id 作為 opaque reference。**

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `KnowledgePage` | Page、Document |
| `ContentBlock` | Block、Node、Element |
| `ContentVersion` | Version、Snapshot、History |
| `BlockType` | Type、ContentType |
| `KnowledgeCollection` | Database、Collection、Table |
| `WikiSpace` | KB、KnowledgeBase（直接稱呼） |
| `PageVerificationState` | verified、needs_review（需透過型別） |
| `PageOwner` (`ownerId`) | Owner、Responsible |

> `WikiPage` 是歷史 wiki-module 術語；`knowledge` BC 不使用 `WikiPage` 作為通用語言。
> `WikiSpace` 在 `knowledge` BC 代表 `spaceType="wiki"` 的 `KnowledgeCollection`，與已移除的歷史 wiki 模組無關。

## 邊界規則

### ✅ 允許
```typescript
import { knowledgeApi } from "@/modules/knowledge/api";
import type { KnowledgePageDTO, ContentBlockDTO } from "@/modules/knowledge/api";
```

### ❌ 禁止
```typescript
import { KnowledgePage } from "@/modules/knowledge/domain/entities/knowledge-page.entity";
import { KnowledgePageCreatedEvent } from "@/modules/knowledge/domain/events/knowledge.events";
import type { Article } from "@/modules/knowledge-base/domain/entities/Article";
```

## page_approved 事件規則

`knowledge.page_approved` 必須包含：
- `extractedTasks[]` — 供 workspace-flow 建立 Task
- `extractedInvoices[]` — 供 workspace-flow 建立 Invoice
- `actorId`, `causationId`, `correlationId` — 追蹤鏈

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/knowledge/application-services.md
````markdown
# knowledge — Application Services

> **Canonical bounded context:** `knowledge`
> **模組路徑:** `modules/knowledge/`
> **Domain Type:** Core Domain

本文件記錄 `knowledge` 的 application layer 服務與 use cases。內容與 `modules/knowledge/application/` 實作保持一致。

## Application Layer 職責

管理知識頁面、內容區塊與版本歷史，是平台的核心知識內容領域。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/block-service.ts`
- `application/dto/knowledge.dto.ts`
- `application/use-cases/knowledge-block.use-cases.ts`
- `application/use-cases/knowledge-collection.use-cases.ts`
- `application/use-cases/knowledge-page.use-cases.ts`
- `application/use-cases/knowledge-version.use-cases.ts`

## Use Cases 清單

| Use Case 類別 | 操作 | UI 入口 |
|---|---|---|
| `CreateKnowledgePageUseCase` | 建立知識頁面 | PageTreeView `+` 按鈕 / "新增頁面" |
| `RenameKnowledgePageUseCase` | 重新命名頁面 | PageTreeView `…` 選單 → 行內 inline 輸入框 |
| `MoveKnowledgePageUseCase` | 移動頁面層級 | PageTreeView `…` 選單 → 「移動到」（待實作） |
| `ArchiveKnowledgePageUseCase` | 歸檔頁面（UI：移至垃圾桶） | PageTreeView `…` 選單 → 「移至垃圾桶」 |
| `PromoteKnowledgePageUseCase` | 提升頁面為 Article（D3 Promote 協議）：執行頁面驗證並發出 `knowledge.page_promoted` 事件 | 由 `knowledge-base` Server Action 觸發 |
| `ReorderKnowledgePageBlocksUseCase` | 重排頁面區塊 |
| `ApproveKnowledgePageUseCase` | 審批頁面（觸發整合事件） |
| `VerifyKnowledgePageUseCase` | 驗證頁面（Wiki Space 模式） |
| `RequestPageReviewUseCase` | 要求頁面審閱（Wiki Space 模式） |
| `AssignPageOwnerUseCase` | 指定頁面負責人（Wiki Space 模式） |
| `GetKnowledgePageUseCase` | 取得單頁 |
| `ListKnowledgePagesUseCase` | 取得帳戶所有頁面 |
| `GetKnowledgePageTreeUseCase` | 取得頁面樹狀結構 |
| `CreateKnowledgeCollectionUseCase` | 建立集合（Database / Wiki Space） |
| `RenameKnowledgeCollectionUseCase` | 重新命名集合 |
| `AddPageToCollectionUseCase` | 將頁面加入集合 |
| `RemovePageFromCollectionUseCase` | 從集合移除頁面 |
| `AddCollectionColumnUseCase` | 新增欄位（Database 模式） |
| `ArchiveKnowledgeCollectionUseCase` | 歸檔集合 |
| `GetKnowledgeCollectionUseCase` | 取得單一集合 |
| `ListKnowledgeCollectionsByAccountUseCase` | 取得帳戶所有集合 |
| `ListKnowledgeCollectionsByWorkspaceUseCase` | 取得工作區所有集合 |

## 設計對齊

- 模組 README：`../../../modules/knowledge/README.md`
- 模組 AGENT：`../../../modules/knowledge/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/knowledge/application-services.md`
````

## File: modules/knowledge/domain-events.md
````markdown
# Domain Events — knowledge

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `knowledge.page_created` | 新頁面建立時 | `pageId`, `accountId`, `workspaceId?`, `title`, `createdByUserId`, `occurredAt` |
| `knowledge.page_renamed` | 頁面標題變更 | `pageId`, `accountId`, `previousTitle`, `newTitle`, `occurredAt` |
| `knowledge.page_moved` | 頁面移動（parentPageId 變更） | `pageId`, `accountId`, `previousParentPageId`, `newParentPageId`, `occurredAt` |
| `knowledge.page_archived` | 頁面歸檔（含子頁級聯歸檔，可恢復） | `pageId`, `accountId`, `childPageIds`, `occurredAt` |
| `knowledge.page_approved` | 使用者核准 AI 生成草稿 | 見下方詳細定義 |
| `knowledge.page_promoted` | 頁面提升為 Article（由 knowledge-base 協議觸發） | `pageId`, `accountId`, `targetArticleId`, `promotedByUserId`, `occurredAt` |
| `knowledge.page_verified` | 頁面在 Wiki Space 中被驗證 | `pageId`, `accountId`, `verifiedByUserId`, `verifiedAtISO`, `verificationExpiresAtISO?`, `occurredAt` |
| `knowledge.page_review_requested` | 頁面被標記為待審閱 | `pageId`, `accountId`, `requestedByUserId`, `occurredAt` |
| `knowledge.page_owner_assigned` | 頁面負責人被指定 | `pageId`, `accountId`, `ownerId`, `occurredAt` |
| `knowledge.block_added` | 區塊新增 | `blockId`, `pageId`, `accountId`, `contentText`, `occurredAt` |
| `knowledge.block_updated` | 區塊內容更新 | `blockId`, `pageId`, `accountId`, `contentText`, `occurredAt` |
| `knowledge.block_deleted` | 區塊刪除 | `blockId`, `pageId`, `accountId`, `occurredAt` |
| `knowledge.version_published` | 版本快照手動發佈 | `versionId`, `pageId`, `accountId`, `label`, `createdByUserId`, `occurredAt` |

## 最重要事件：knowledge.page_approved

```typescript
// 代碼位置：modules/knowledge/domain/events/knowledge.events.ts
interface KnowledgePageApprovedEvent {
  readonly type: "knowledge.page_approved";
  readonly aggregateId: string;      // KnowledgePage ID
  readonly pageId: string;
  readonly occurredAt: string;       // ISO 8601（注意：此 BC 用 occurredAt，非 occurredAtISO）
  readonly extractedTasks: ReadonlyArray<{
    readonly title: string;
    readonly dueDate?: string;
    readonly description?: string;
  }>;
  readonly extractedInvoices: ReadonlyArray<{
    readonly amount: number;
    readonly description: string;
    readonly currency?: string;    // 預設 "TWD"
  }>;
  readonly actorId: string;          // 執行審批的使用者 ID
  readonly causationId: string;      // 觸發命令 ID
  readonly correlationId: string;    // 業務流程追蹤 ID
}
```

## Knowledge Collection 驗證事件

```typescript
interface KnowledgePageVerifiedEvent {
  readonly type: "knowledge.page_verified";
  readonly pageId: string;
  readonly accountId: string;
  readonly verifiedByUserId: string;
  readonly verifiedAtISO: string;
  readonly verificationExpiresAtISO?: string;
  readonly occurredAt: string;    // ISO 8601
}

interface KnowledgePageReviewRequestedEvent {
  readonly type: "knowledge.page_review_requested";
  readonly pageId: string;
  readonly accountId: string;
  readonly requestedByUserId: string;
  readonly occurredAt: string;    // ISO 8601
}

interface KnowledgePageOwnerAssignedEvent {
  readonly type: "knowledge.page_owner_assigned";
  readonly pageId: string;
  readonly accountId: string;
  readonly ownerId: string;
  readonly occurredAt: string;    // ISO 8601
}
```

## Promote 事件（D3：Page → Article 提升協議）

`knowledge` 發出 `knowledge.page_promoted`，`knowledge-base` 訂閱後建立 Article。

```typescript
interface KnowledgePagePromotedEvent {
  readonly type: "knowledge.page_promoted";
  readonly pageId: string;
  readonly accountId: string;
  readonly targetArticleId: string;  // knowledge-base 建立的 Article ID
  readonly promotedByUserId: string;
  readonly occurredAt: string;       // ISO 8601
}
```

## 訂閱事件（消費端）

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `identity` | `TokenRefreshSignal` | 更新使用者 session |

## 消費 knowledge 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `workspace-flow` | `knowledge.page_approved` | KnowledgeToWorkflowMaterializer 建立 Task、Invoice |
| `ai` | `knowledge.page_approved` | 觸發 IngestionJob |
| `knowledge-base` | `knowledge.page_promoted` | 依 pageId 建立 Article，完成 Promote 協議 |
````

## File: modules/knowledge/domain-services.md
````markdown
# knowledge — Domain Services

> **Canonical bounded context:** `knowledge`
> **模組路徑:** `modules/knowledge/`
> **Domain Type:** Core Domain

本文件整理 `knowledge` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/knowledge/domain-services.md`
- `../../../modules/knowledge/aggregates.md`
````

## File: modules/knowledge/repositories.md
````markdown
# knowledge — Repositories

> **Canonical bounded context:** `knowledge`
> **模組路徑:** `modules/knowledge/`
> **Domain Type:** Core Domain

本文件整理 `knowledge` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/knowledge.repositories.ts`
  - `KnowledgePageRepository` — 含 `verify()`, `requestReview()`, `assignOwner()` 等 Wiki Space 方法
  - `KnowledgeBlockRepository`
  - `KnowledgeVersionRepository`
  - `KnowledgeCollectionRepository`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseKnowledgePageRepository.ts`
  - 實作 `KnowledgePageRepository`，含 `verify()`, `requestReview()`, `assignOwner()` 三個新方法
- `infrastructure/firebase/FirebaseContentBlockRepository.ts`
- `infrastructure/firebase/FirebaseContentCollectionRepository.ts`
  - 實作 `KnowledgeCollectionRepository`，`toKnowledgeCollection()` mapper 已對應 `spaceType` 欄位

## KnowledgePageRepository 方法對照

| 方法 | 說明 |
|------|------|
| `create()` | 建立頁面 |
| `rename()` | 重命名 |
| `move()` | 移動層級 |
| `archive()` | 歸檔 |
| `reorderBlocks()` | 重排區塊 |
| `approve()` | 審批（AI 草稿模式） |
| `verify()` | 驗證頁面（Wiki Space 模式） |
| `requestReview()` | 標記為待審閱（Wiki Space 模式） |
| `assignOwner()` | 指定頁面負責人 |
| `findById()` | 取得單頁 |
| `listByAccountId()` | 列出帳戶所有頁面 |
| `listByWorkspaceId()` | 列出工作區所有頁面 |

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/knowledge/repositories.md`
- `../../../modules/knowledge/aggregates.md`
````

## File: modules/notebook/AGENT.md
````markdown
# AGENT.md — notebook BC

## 模組定位

`notebook` 是 AI 對話的支援域，管理 Thread/Message 生命週期並封裝 Genkit 呼叫。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Thread` | Conversation、Chat、Session |
| `Message` | ChatMessage、Msg |
| `MessageRole` | Role（單獨使用）、Speaker |
| `NotebookResponse` | AIResponse、GeneratedText |
| `NotebookRepository` | AIRepository、ChatRepository |

## 最重要規則：Server Action 隔離

```typescript
// ✅ 正確：在 app/(shell)/ai-chat/_actions.ts 中建立本地 action
"use server";
import { notebookApi } from "@/modules/notebook/api";
export async function generateResponse(input) {
  return notebookApi.generateResponse(input);
}

// ❌ 禁止：在 Client Component 直接 import notebook/api
// Genkit/gRPC 是 server-only，會導致打包失敗
import { notebookApi } from "@/modules/notebook/api"; // 在 "use client" 檔案中
```

## 邊界規則

### ✅ 允許
```typescript
// Server-side context only
import { notebookApi } from "@/modules/notebook/api";
import type { ThreadDTO, MessageDTO } from "@/modules/notebook/api";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/notebook/aggregates.md
````markdown
# Aggregates — notebook

## 聚合根：Thread

### 職責
代表一個 AI 對話串。持有有序的 Message 列表，管理對話歷史。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `ID` | Thread 主鍵 |
| `messages` | `Message[]` | 有序訊息列表 |
| `createdAt` | `string` | ISO 8601 |
| `updatedAt` | `string` | ISO 8601 |

### 不變數

- messages 列表維持追加順序，不可重新排序
- Thread 不可刪除 Message（只能追加）

---

## 值物件：Message

### 職責
Thread 中的單則訊息，不可變（immutable）。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `ID` | 訊息主鍵 |
| `role` | `MessageRole` | `"user" \| "assistant" \| "system"` |
| `content` | `string` | 訊息內容文字 |
| `createdAt` | `string` | ISO 8601 |

---

## Repository Interfaces

| 介面 | 說明 |
|------|------|
| `NotebookRepository` | 封裝 Genkit AI 呼叫：`generateResponse(input)` |

### GenerateNotebookResponseInput

```typescript
interface GenerateNotebookResponseInput {
  readonly prompt: string;
  readonly model?: string;    // 預設 Gemini 2.0 flash
  readonly system?: string;   // System prompt
}
```

### GenerateNotebookResponseResult

```typescript
type GenerateNotebookResponseResult =
  | { ok: true; data: NotebookResponse }
  | { ok: false; error: DomainError };

interface NotebookResponse {
  readonly text: string;
  readonly model: string;
  readonly finishReason?: string;
}
```
````

## File: modules/notebook/application-services.md
````markdown
# notebook — Application Services

> **Canonical bounded context:** `notebook`
> **模組路徑:** `modules/notebook/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `notebook` 的 application layer 服務與 use cases。內容與 `modules/notebook/application/` 實作保持一致。

## Application Layer 職責

管理 AI 對話 Thread/Message，並封裝模型生成回應。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/index.ts`
- `application/use-cases/answer-rag-query.use-case.ts`
- `application/use-cases/generate-agent-response.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/notebook/README.md`
- 模組 AGENT：`../../../modules/notebook/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/notebook/application-services.md`
````

## File: modules/notebook/context-map.md
````markdown
# Context Map — notebook

## 上游（依賴）

### search → notebook（Customer/Supplier）

- `notebook` 呼叫 `search/api` 取得語意相關 chunks（RAG retrieval）
- 用於 RAG-augmented 對話生成
- `knowledge`、`knowledge-base` 與 `source` 的內容會先經 `ai` 攝入，再由 `search` 提供給 `notebook`

---

## 下游（被依賴）

### notebook → app/(shell)/ai-chat（Interfaces）

- AI Chat 頁面透過本地 `app/(shell)/ai-chat/_actions.ts` 呼叫 `notebook/api`
- **注意**：`notebook/api` barrel 不得在 Client Component 中直接 import（Genkit server-only）

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| search → notebook | search | notebook | Customer/Supplier（同步查詢） |
| notebook → AI Chat UI | notebook | app/ | Anti-Corruption Layer（`app/(shell)/ai-chat/_actions.ts`） |
````

## File: modules/notebook/domain-events.md
````markdown
# Domain Events — notebook

## 發出事件

`notebook` 域目前不發出 DomainEvent。AI 對話是使用者互動的即時回應，不需要下游事件消費。

未來可考慮：

| 潛在事件 | 觸發條件 | 說明 |
|---------|---------|------|
| `notebook.thread_created` | 新 Thread 建立 | 供 workspace-audit 記錄 |
| `notebook.response_generated` | AI 回應完成 | 供 token 使用量追蹤 |

## 訂閱事件

`notebook` 不訂閱其他 BC 的事件。

## 整合說明

`notebook` 透過**同步查詢**（非事件）消費其他 BC 的能力：

- **`search`**：呼叫 `search/api.answerRagQuery()` 取得語意相關 chunks（用於 RAG-augmented 對話）
- **`knowledge` / `knowledge-base` / `source`**：作為被檢索內容的上游來源，透過 `ai` 攝入與 `search` 查詢間接供 `notebook` 使用
````

## File: modules/notebook/domain-services.md
````markdown
# notebook — Domain Services

> **Canonical bounded context:** `notebook`
> **模組路徑:** `modules/notebook/`
> **Domain Type:** Supporting Subdomain

本文件整理 `notebook` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/notebook/domain-services.md`
- `../../../modules/notebook/aggregates.md`
````

## File: modules/notebook/README.md
````markdown
# notebook — Notebook 對話上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/notebook/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`notebook` 是 Xuanwu 的 NotebookLM-like 互動層，將檢索結果、知識內容與知識結構脈絡轉成對話、摘要、洞察與可引用回答。它是最接近使用者 AI 推理體驗的上下文。

## 主要職責

| 能力 | 說明 |
|---|---|
| 對話 Thread 管理 | 維護對話串與訊息歷史 |
| 摘要 / 問答互動 | 把檢索結果轉成可閱讀、可追問的回答 |
| 引用式輸出 | 保留 citation / source trace，支撐可信回答 |

## 與其他 Bounded Context 協作

- `search` 是主要上游，提供語意檢索與引用資料。
- `knowledge`、`knowledge-base` 與 `source` 提供被推理的內容來源；`ai` 提供底層攝入能力。

## 核心聚合 / 核心概念

- **`Thread`**
- **`Message`**
- **`Summary`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/notebook/repositories.md
````markdown
# notebook — Repositories

> **Canonical bounded context:** `notebook`
> **模組路徑:** `modules/notebook/`
> **Domain Type:** Supporting Subdomain

本文件整理 `notebook` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/NotebookRepository.ts`

> `RagGenerationRepository` 與 `RagRetrievalRepository` 已移至 `modules/search`，
> `domain/repositories/RagGenerationRepository.ts` 與 `domain/repositories/RagRetrievalRepository.ts`
> 為 `@deprecated` re-export stub，不屬於 notebook domain ports。

## Infrastructure Implementations

- `infrastructure/genkit/GenkitNotebookRepository.ts`
- `infrastructure/genkit/client.ts`
- `infrastructure/genkit/index.ts`
- `infrastructure/index.ts`

> `infrastructure/firebase/FirebaseRagRetrievalRepository.ts` 屬於 `search` BC，
> 雖然目前物理上仍在 notebook infrastructure 目錄下，應視為過渡性存放。

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/notebook/repositories.md`
- `../../../modules/notebook/aggregates.md`
````

## File: modules/notebook/ubiquitous-language.md
````markdown
# Ubiquitous Language — notebook

> **範圍：** 僅限 `modules/notebook/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 對話串 | Thread | 一組有序的對話訊息集合，是 AI 對話的持久化單元 |
| 訊息 | Message | Thread 中的單則訊息（含 role 和 content） |
| 訊息角色 | MessageRole | 訊息發出者的角色：`"user" \| "assistant" \| "system"` |
| 筆記本回應 | NotebookResponse | AI 模型對一次 prompt 的回應結果（含 text、model） |
| 生成輸入 | GenerateNotebookResponseInput | 呼叫 AI 生成的輸入（prompt、model?、system?） |
| 筆記本庫 | NotebookRepository | 封裝 Genkit AI 呼叫的 Repository port |

## 棄用術語（已移至 search）

| 棄用術語 | 新位置 |
|----------|--------|
| `RagQuery` / `RagCitation` | `modules/search/domain/entities/RagQuery.ts` |
| `RagGenerationRepository` | `modules/search/domain/repositories/RagGenerationRepository.ts` |
| `RagRetrievalRepository` | `modules/search/domain/repositories/RagRetrievalRepository.ts` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Thread` | `Conversation`, `Chat`, `Session` |
| `Message` | `ChatMessage`, `Turn` |
| `NotebookResponse` | `AIResponse`, `LLMOutput` |
````

## File: modules/notification/AGENT.md
````markdown
# AGENT.md — notification BC

## 模組定位

`notification` 是通知分發的通用子域，負責系統通知的建立、發送與讀取。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `NotificationEntity` | Notification（作為 class 名），Alert, Message（作為通知） |
| `recipientId` | userId, receiverId |
| `NotificationType` | Type, AlertLevel |
| `DispatchNotificationInput` | CreateNotification, SendNotification |

## 邊界規則

### ✅ 允許
```typescript
import { notificationApi } from "@/modules/notification/api";
import type { NotificationDTO } from "@/modules/notification/api";
```

### ❌ 禁止
```typescript
import { NotificationEntity } from "@/modules/notification/domain/entities/Notification";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/notification/aggregates.md
````markdown
# Aggregates — notification

## 聚合根：NotificationEntity

### 職責
代表一則系統通知記錄。管理通知的發送與讀取狀態。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 通知主鍵 |
| `recipientId` | `string` | 接收者帳戶 ID |
| `title` | `string` | 通知標題 |
| `message` | `string` | 通知內容 |
| `type` | `NotificationType` | `info \| alert \| success \| warning` |
| `read` | `boolean` | 是否已讀 |
| `timestamp` | `number` | Unix timestamp（毫秒） |
| `sourceEventType` | `string?` | 觸發此通知的事件類型 |
| `metadata` | `Record<string, unknown>?` | 附加元資料 |

### 不變數

- `recipientId` 不可為空
- `title` 不可為空

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `NotificationRepository` | `save()`, `findByRecipient()`, `markAsRead()` |
````

## File: modules/notification/application-services.md
````markdown
# notification — Application Services

> **Canonical bounded context:** `notification`
> **模組路徑:** `modules/notification/`
> **Domain Type:** Generic Subdomain

本文件記錄 `notification` 的 application layer 服務與 use cases。內容與 `modules/notification/application/` 實作保持一致。

## Application Layer 職責

負責系統通知分發與通知讀取狀態管理。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/notification.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/notification/README.md`
- 模組 AGENT：`../../../modules/notification/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/notification/application-services.md`
````

## File: modules/notification/context-map.md
````markdown
# Context Map — notification

## 上游（依賴）

### 所有業務 BC → notification（Published Language）

`notification` 訂閱各 BC 的業務事件，轉換為使用者通知。不直接依賴任何 BC 的 api。

---

## 下游（被依賴）

`notification` 不被其他 BC 依賴（通知是終端輸出，無下游）。

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → notification | workspace | notification | Published Language (Events) |
| workspace-flow → notification | workspace-flow | notification | Published Language (Events) |
| 其他 BC → notification | 各 BC | notification | Published Language (Events) |
````

## File: modules/notification/domain-events.md
````markdown
# Domain Events — notification

## 發出事件

`notification` 域不發出 DomainEvent（通知本身是事件的結果，而非事件的來源）。

## 訂閱事件

`notification` 是各 BC 事件的**消費端**，訂閱業務事件並轉換為使用者通知：

| 來源 BC | 訂閱事件 | 通知內容 |
|---------|---------|---------|
| `workspace` | `workspace.member_joined` | 新成員加入通知 |
| `workspace-flow` | `workspace-flow.task_status_changed` | 任務狀態變更通知 |
| `workspace-audit` | 稽核紀錄變化 | 重要稽核事件通知（未來） |

## 說明

通知系統的角色是「事件翻譯器」：
1. 其他 BC 發出領域事件
2. notification 訂閱並翻譯為使用者可讀的通知
3. 通知推送給對應的 recipientId

這是典型的 **Published Language** 模式，notification 作為 Conformist 消費者。
````

## File: modules/notification/domain-services.md
````markdown
# notification — Domain Services

> **Canonical bounded context:** `notification`
> **模組路徑:** `modules/notification/`
> **Domain Type:** Generic Subdomain

本文件整理 `notification` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/notification/domain-services.md`
- `../../../modules/notification/aggregates.md`
````

## File: modules/notification/README.md
````markdown
# notification — 通知上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/notification/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`notification` 提供跨平台的通知分發能力，將知識、工作流程與工作區互動轉成使用者可感知的訊息。它是典型平台配套能力，但對協作效率與回應速度很重要。

## 主要職責

| 能力 | 說明 |
|---|---|
| 通知分發 | 發送 info / alert / success / warning 等系統訊息 |
| 事件轉訊息 | 把其他上下文的事件轉成使用者可消費的通知 |
| 通知偏好支撐 | 配合 `account` 與 `workspace` 的偏好設定輸出通知行為 |

## 與其他 Bounded Context 協作

- `workspace-feed`、`workspace-flow`、`workspace` 等上下文會觸發通知需求。
- `account` 提供使用者偏好與收件對象語意。

## 核心聚合 / 核心概念

- **`NotificationEntity`**
- **`NotificationPayload`**
- **`NotificationPreference`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/notification/repositories.md
````markdown
# notification — Repositories

> **Canonical bounded context:** `notification`
> **模組路徑:** `modules/notification/`
> **Domain Type:** Generic Subdomain

本文件整理 `notification` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/NotificationRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseNotificationRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/notification/repositories.md`
- `../../../modules/notification/aggregates.md`
````

## File: modules/notification/ubiquitous-language.md
````markdown
# Ubiquitous Language — notification

> **範圍：** 僅限 `modules/notification/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 通知 | NotificationEntity | 一則系統通知記錄（含標題、內容、類型、讀取狀態） |
| 接收者 ID | recipientId | 接收此通知的帳戶 ID |
| 通知類型 | NotificationType | `"info" \| "alert" \| "success" \| "warning"` |
| 分發通知輸入 | DispatchNotificationInput | 建立並發送通知的輸入物件 |
| 來源事件類型 | sourceEventType | 觸發此通知的業務事件類型（可選，用於追蹤） |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `NotificationEntity` | `Notification`（避免與 JS Notification API 衝突） |
| `recipientId` | `userId`, `receiverId` |
````

## File: modules/organization/AGENT.md
````markdown
# AGENT.md — organization BC

## 模組定位

`organization` 是 Xuanwu 的多租戶管理有界上下文，管理 Organization 聚合根、成員、隊伍與邀請流程。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Organization` | Company、Tenant、Team（作為頂層組織）、Client |
| `MemberReference` | Member、User（在組織上下文中）|
| `Team` | Group、Squad（作為組織子群組） |
| `PartnerInvite` | Invitation、InviteLink |
| `OrganizationRole` | Role、Permission（作為組織角色） |
| `Presence` | Status、OnlineStatus |

## 邊界規則

### ✅ 允許
```typescript
import { organizationApi } from "@/modules/organization/api";
import type { OrganizationDTO, MemberReferenceDTO } from "@/modules/organization/api";
```

### ❌ 禁止
```typescript
import { Organization } from "@/modules/organization/domain/entities/Organization";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/organization/aggregates.md
````markdown
# Aggregates — organization

## 聚合根：Organization

### 職責
代表一個企業或團隊租戶。管理所有成員、隊伍與合作夥伴邀請的生命週期。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 組織主鍵 |
| `name` | `string` | 組織名稱 |
| `members` | `MemberReference[]` | 成員列表（含 role） |
| `teams` | `Team[]` | 子隊伍列表 |
| `partnerInvites` | `PartnerInvite[]` | 未完成的邀請列表 |

### 不變數

- 同一 accountId 在同一 Organization 中只能有一個 MemberReference
- `Owner` 角色至少需要一位（不可移除最後一個 Owner）
- 過期的 PartnerInvite（`expired`）不能再被接受

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `MemberReference` | 成員快照（id, name, email, role, presence） |
| `Team` | 子群組（id, name, type, memberIds） |
| `PartnerInvite` | 邀請記錄（email, role, inviteState, invitedAt） |
| `OrganizationRole` | `"Owner" \| "Admin" \| "Member" \| "Guest"` |
| `Presence` | `"active" \| "away" \| "offline"` |
| `InviteState` | `"pending" \| "accepted" \| "expired"` |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `OrganizationRepository` | `save()`, `findById()`, `findByMemberId()` |
````

## File: modules/organization/application-services.md
````markdown
# organization — Application Services

> **Canonical bounded context:** `organization`
> **模組路徑:** `modules/organization/`
> **Domain Type:** Generic Subdomain

本文件記錄 `organization` 的 application layer 服務與 use cases。內容與 `modules/organization/application/` 實作保持一致。

## Application Layer 職責

管理多租戶組織、成員、隊伍與邀請流程。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/organization-policy.use-cases.ts`
- `application/use-cases/organization.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/organization/README.md`
- 模組 AGENT：`../../../modules/organization/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/organization/application-services.md`
````

## File: modules/organization/context-map.md
````markdown
# Context Map — organization

## 上游（依賴）

### account → organization（Customer/Supplier）

- `organization.members[]` 中的 `MemberReference.id` 參照 `account` 的 accountId
- 查詢成員 profile 時呼叫 `account/api`

---

## 下游（被依賴）

### organization → workspace（Customer/Supplier）

- `Workspace.accountId + accountType="organization"` 關聯至 Organization
- 工作區列表依 organizationId 篩選

### organization → workspace-audit（Published Language）

- 成員加入/移除事件供 `workspace-audit` 消費（未來事件 sink 完成後）

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| account → organization | account | organization | Customer/Supplier |
| organization → workspace | organization | workspace | Customer/Supplier |
| organization → workspace-audit | organization | workspace-audit | Published Language (Events) |
````

## File: modules/organization/domain-events.md
````markdown
# Domain Events — organization

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `organization.created` | 新組織建立時 | `organizationId`, `name`, `ownerId`, `occurredAt` |
| `organization.member_invited` | 成員被邀請加入 | `organizationId`, `inviteId`, `email`, `role`, `occurredAt` |
| `organization.member_joined` | 邀請被接受，成員加入 | `organizationId`, `accountId`, `role`, `occurredAt` |
| `organization.member_removed` | 成員被移除 | `organizationId`, `accountId`, `occurredAt` |
| `organization.team_created` | 新 Team 建立 | `organizationId`, `teamId`, `occurredAt` |

## 訂閱事件

`organization` 不訂閱其他 BC 的事件（被動，等待 account 操作觸發）。

## 事件格式範例

```typescript
interface OrganizationMemberJoinedEvent {
  readonly type: "organization.member_joined";
  readonly organizationId: string;
  readonly accountId: string;
  readonly role: OrganizationRole;
  readonly occurredAt: string;  // ISO 8601
}
```
````

## File: modules/organization/domain-services.md
````markdown
# organization — Domain Services

> **Canonical bounded context:** `organization`
> **模組路徑:** `modules/organization/`
> **Domain Type:** Generic Subdomain

本文件整理 `organization` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/organization/domain-services.md`
- `../../../modules/organization/aggregates.md`
````

## File: modules/organization/README.md
````markdown
# organization — 組織上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/organization/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`organization` 是平台多租戶治理層，負責定義團隊、成員與組織級關係。它把個人帳戶提升到群體協作層，為工作區與知識協作提供治理邊界。

## 主要職責

| 能力 | 說明 |
|---|---|
| 組織管理 | 建立與維護 Organization 聚合 |
| 成員與團隊治理 | 管理 MemberReference、Team 與組織內角色 |
| 邀請與夥伴協作 | 處理 PartnerInvite 與跨組織協作入口 |

## 與其他 Bounded Context 協作

- `account` 提供個人帳戶語意；`workspace` 以組織為主要歸屬邊界。
- `workspace-audit` 與 `notification` 會消費組織事件或範圍資訊。

## 核心聚合 / 核心概念

- **`Organization`**
- **`MemberReference`**
- **`Team`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/organization/repositories.md
````markdown
# organization — Repositories

> **Canonical bounded context:** `organization`
> **模組路徑:** `modules/organization/`
> **Domain Type:** Generic Subdomain

本文件整理 `organization` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/OrganizationRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseOrganizationRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/organization/repositories.md`
- `../../../modules/organization/aggregates.md`
````

## File: modules/organization/ubiquitous-language.md
````markdown
# Ubiquitous Language — organization

> **範圍：** 僅限 `modules/organization/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 組織 | Organization | 頂層多租戶單元，代表一個企業或團隊 |
| 成員參照 | MemberReference | 組織成員的輕量參照（含 accountId、role、presence） |
| 隊伍 | Team | 組織內的子群組（internal / external 類型） |
| 合作夥伴邀請 | PartnerInvite | 邀請外部合作夥伴加入隊伍的邀請記錄 |
| 組織角色 | OrganizationRole | 成員在組織中的角色：`Owner \| Admin \| Member \| Guest` |
| 在線狀態 | Presence | 成員的當前狀態：`active \| away \| offline` |
| 邀請狀態 | InviteState | 邀請的當前狀態：`pending \| accepted \| expired` |
| 政策效果 | PolicyEffect | 組織政策的效果：`allow \| deny` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Organization` | `Company`, `Tenant`, `Client` |
| `MemberReference` | `Member`, `OrgUser` |
| `OrganizationRole` | `Role`, `Permission` |
````

## File: modules/search/AGENT.md
````markdown
# AGENT.md — search BC

## 模組定位

`search` 是 RAG 語意檢索的支援域，提供向量搜尋、RAG answer 生成與查詢反饋收集。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `RagQuery` | Query、SearchQuery、VectorQuery |
| `RagQueryFeedback` | Feedback、Rating |
| `RagRetrievedChunk` | Chunk、SearchResult |
| `RagCitation` | Citation、Source、Reference |
| `VectorStore` | VectorDB、EmbeddingStore |
| `RagRetrievalRepository` | RetrievalRepo、SearchRepo |
| `RagGenerationRepository` | GenerationRepo、AIRepo |

## 最重要邊界規則：Server vs Client Import

```typescript
// ✅ server code（Server Action、API route）
import { searchApi } from "@/modules/search/api";

// ✅ client code（React Component）
import { RagView } from "@/modules/search"; // root barrel

// ❌ 禁止：在 /api barrel 匯出 "use client" UI 元件
// RagView, RagQueryView 只能從 root barrel 匯出
```

## 邊界規則

### ❌ 禁止
```typescript
// api/index.ts 不得 re-export "use client" 元件
export { RagView } from "./interfaces/components/RagView"; // 禁止在 api/
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/search/aggregates.md
````markdown
# Aggregates — search

## 聚合根：RagQueryFeedback

### 職責
收集並持久化使用者對 RAG 查詢答案品質的反饋。支援持續改善 RAG 品質。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `feedbackId` | `string` | 反饋主鍵 |
| `queryId` | `string` | 關聯的查詢 ID |
| `helpful` | `boolean` | 是否有用 |
| `comment` | `string \| null` | 文字評論（可選） |
| `submittedAt` | `string` | ISO 8601 |

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `RagRetrievedChunk` | 檢索到的 chunk（chunkId, docId, chunkIndex, text, score, taxonomy） |
| `RagCitation` | 引用資訊（chunkId, docId, text, score） |
| `VectorDocument` | 向量索引文件（id, content, metadata, embedding） |
| `WikiCitation` | 歷史命名的知識引用值物件；目前承載知識頁面或文章的引用資訊（pageId, pageTitle, text, score） |

---

## Ports（Hexagonal Architecture）

| Port | 說明 |
|------|------|
| `IVectorStore` | 向量資料庫抽象（`index()`, `search()`, `deleteByDocId()`） |
| `RagRetrievalRepository` | Chunk 向量搜尋操作 |
| `RagGenerationRepository` | AI 答案生成（組合 chunks + Genkit 呼叫） |
| `RagQueryFeedbackRepository` | 反饋持久化 |
| `WikiContentRepository` | 歷史命名的知識內容查詢 port；目前供 RAG 讀取知識頁面或文章內容 |
````

## File: modules/search/application-services.md
````markdown
# search — Application Services

> **Canonical bounded context:** `search`
> **模組路徑:** `modules/search/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `search` 的 application layer 服務與 use cases。內容與 `modules/search/application/` 實作保持一致。

## Application Layer 職責

提供向量檢索、RAG answer 生成與查詢反饋收集。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/answer-rag-query.use-case.ts`
- `application/use-cases/submit-rag-feedback.use-case.ts`
- `application/use-cases/wiki-rag.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/search/README.md`
- 模組 AGENT：`../../../modules/search/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/search/application-services.md`
````

## File: modules/search/context-map.md
````markdown
# Context Map — search

## 上游（依賴）

### ai → search（Customer/Supplier）

- `ai.ingestion_completed` 通知 `search` 更新向量索引
- `search` 依賴 `ai` 生成的 IngestionChunk（embedding 向量）

### knowledge / knowledge-base / source → search（Indirect Upstream）

- `knowledge`、`knowledge-base` 與 `source` 提供被索引的內容來源
- `search` 透過 `ai` 所產出的 ingestion 結果建立可檢索表示

---

## 下游（被依賴）

### search → notebook（Customer/Supplier）

- `notebook` 呼叫 `search/api.answerRagQuery()` 取得 RAG chunks 與答案
- 這是同步查詢，不是事件

### search → ask/cite interfaces（Interfaces）

- Notebook 與 workspace-scoped ask/cite 介面透過 `search/api` 呼叫同步查詢
- UI 層應透過模組公開表面取得查詢能力，而不是依賴已刪除的 wiki 專屬路由

---

## Import 路由

```
server code (Server Action, API route) → import from @/modules/search/api
client code (React Component)          → import from @/modules/search (root barrel)
```

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| ai → search | ai | search | Published Language (Events) |
| knowledge / knowledge-base / source → search | content sources | search | Indirect upstream via ai ingestion |
| search → notebook | search | notebook | Customer/Supplier（同步） |
| search → ask/cite interfaces | search | app/ | Conformist |
````

## File: modules/search/domain-events.md
````markdown
# Domain Events — search

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `search.feedback_submitted` | 使用者提交 RagQueryFeedback | `feedbackId`, `queryId`, `helpful`, `occurredAt` |
| `search.index_updated` | 向量索引更新完成（文件重新索引） | `documentId`, `chunkCount`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `ai` | `ai.ingestion_completed` | 新 chunks 的 embedding 已就緒，觸發向量索引更新 |

## 消費 search 事件的其他 BC

`search` 主要提供**同步查詢服務**（非事件），被 `notebook` 與 workspace-scoped ask/cite 介面直接呼叫：

```typescript
// notebook 呼叫 search 的同步查詢
const result = await searchApi.answerRagQuery({
  organizationId,
  userQuery,
  topK: 5,
});
```
````

## File: modules/search/domain-services.md
````markdown
# search — Domain Services

> **Canonical bounded context:** `search`
> **模組路徑:** `modules/search/`
> **Domain Type:** Supporting Subdomain

本文件整理 `search` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/search/domain-services.md`
- `../../../modules/search/aggregates.md`
````

## File: modules/search/README.md
````markdown
# search — 語意檢索上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/search/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`search` 是 NotebookLM-like 推理層的檢索核心，負責從向量索引與知識內容中擷取最相關的引用材料，為摘要、問答與洞察建立可追溯的語意上下文。

## 主要職責

| 能力 | 說明 |
|---|---|
| 向量檢索 | 執行語意相似度搜尋與結果排序 |
| RAG Answer 組合 | 組合 retrieved chunks、引用與答案內容 |
| 反饋收集 | 記錄 RagQueryFeedback 以改進檢索品質 |

## 與其他 Bounded Context 協作

- `ai` 提供索引就緒資料；`notebook` 是主要消費者。
- `knowledge` 與 `knowledge-base` 提供被檢索的知識主體與結構資訊。

## 核心聚合 / 核心概念

- **`RagQuery`**
- **`RagQueryFeedback`**
- **`VectorStore`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/search/repositories.md
````markdown
# search — Repositories

> **Canonical bounded context:** `search`
> **模組路徑:** `modules/search/`
> **Domain Type:** Supporting Subdomain

本文件整理 `search` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/RagGenerationRepository.ts`
- `domain/repositories/RagQueryFeedbackRepository.ts`
- `domain/repositories/RagRetrievalRepository.ts`
- `domain/repositories/WikiContentRepository.ts`（歷史命名；目前承載知識內容查詢 port）

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseRagQueryFeedbackRepository.ts`
- `infrastructure/firebase/FirebaseRagRetrievalRepository.ts`
- `infrastructure/firebase/FirebaseWikiContentRepository.ts`（歷史命名；目前對應知識內容讀取實作）
- `infrastructure/genkit/GenkitRagGenerationRepository.ts`
- `infrastructure/genkit/client.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/search/repositories.md`
- `../../../modules/search/aggregates.md`
````

## File: modules/search/ubiquitous-language.md
````markdown
# Ubiquitous Language — search

> **範圍：** 僅限 `modules/search/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| RAG 查詢 | RagQuery | 一次 Retrieval-Augmented Generation 查詢請求 |
| RAG 已檢索 Chunk | RagRetrievedChunk | 向量搜尋返回的單一相關文件片段（含相似度分數） |
| RAG 引用 | RagCitation | AI 答案引用的 chunk 來源資訊 |
| RAG 答案輸出 | AnswerRagQueryOutput | 包含生成答案文字與引用列表的輸出 |
| 查詢反饋 | RagQueryFeedback | 使用者對 RAG 答案品質的評分記錄 |
| 向量存儲 | VectorStore | 向量資料庫的 Hexagonal Port（IVectorStore 介面） |
| Wiki 引用 | WikiCitation | 歷史命名的知識引用格式；目前承載知識頁面或文章的引用資訊（含 pageId、pageTitle） |
| 向量文件 | VectorDocument | 要索引至向量資料庫的文件記錄 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `RagQuery` | `SearchQuery`, `Query` |
| `RagRetrievedChunk` | `SearchResult`, `Chunk` |
| `RagCitation` | `Citation`, `Source` |
| `VectorStore` | `VectorDB`, `EmbeddingDB` |
````

## File: modules/shared/AGENT.md
````markdown
# AGENT.md — shared BC

## 模組定位

`shared` 是 Shared Kernel，提供所有 BC 共同依賴的最小基礎型別集。修改任何 shared/ 型別前，需確認所有消費方的影響。

## 最重要規則：DomainEvent 欄位名稱

```typescript
// ✅ 正確：occurredAt（ISO string）
interface MyEvent {
  readonly type: "module.action";
  readonly occurredAt: string;  // ISO 8601
}

// ❌ 錯誤：不存在 occurredAtISO 欄位
interface WrongEvent {
  readonly occurredAtISO: string;  // 不正確
}
```

## 通用語言

| 正確術語 | 禁止使用 |
|----------|----------|
| `DomainEvent` | BaseEvent, Event |
| `occurredAt` | occurredAtISO, timestamp（作為 DomainEvent 欄位） |
| `EventRecord` | AuditRecord（在此 BC 內） |

## 邊界規則

- `shared/` 內不放業務邏輯
- 只放多個 BC 都需要的最小型別
- 任何新增需要全域共識

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/shared/aggregates.md
````markdown
# Aggregates — shared

## 注意

`shared` 是 Shared Kernel，不包含業務聚合根。它只提供基礎型別定義。

---

## 基礎介面：DomainEvent

```typescript
// modules/shared/domain/events.ts
interface DomainEvent {
  readonly type: string;       // discriminant: "module.action"
  readonly occurredAt: string; // ISO 8601 — 不是 Date，不是 occurredAtISO
}
```

**所有模組的領域事件介面都繼承此基礎介面。**

---

## 基礎介面：EventRecord

```typescript
// modules/shared/domain/event-record.ts
interface EventRecord {
  readonly eventId: string;    // UUID v4
  readonly occurredAt: string; // ISO 8601
  readonly actorId?: string;   // 操作者 ID（可選）
  readonly correlationId?: string;
  readonly causationId?: string;
}
```

---

## 工具型別

| 型別 / 工具 | 說明 |
|------------|------|
| `ID` | string alias，用於所有業務 ID |
| `Timestamp` | Firebase Timestamp 型別別名 |
| `domain/slug-utils.ts` | URL-safe slug 生成（`toSlug()`, `isValidSlug()`） |
````

## File: modules/shared/application-services.md
````markdown
# shared — Application Services

> **Canonical bounded context:** `shared`
> **模組路徑:** `modules/shared/`
> **Domain Type:** Shared Kernel

本文件記錄 `shared` 的 application layer 服務與 use cases。內容與 `modules/shared/application/` 實作保持一致。

## Application Layer 職責

提供所有 bounded contexts 共用的最小型別與事件合約，是 Shared Kernel。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/publish-domain-event.ts`

## 設計對齊

- 模組 README：`../../../modules/shared/README.md`
- 模組 AGENT：`../../../modules/shared/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/shared/application-services.md`
````

## File: modules/shared/context-map.md
````markdown
# Context Map — shared

## Shared Kernel 的特殊地位

`shared` 不是普通的 Customer/Supplier 關係。它是 **Shared Kernel** 模式：

> 「兩個 Team 共同擁有一個小型共享模型，任何一方的修改都需要另一方的協調。」
> — Vaughn Vernon, IDDD

## 關係

所有 16 個 BC 都依賴 `shared/`，但這不是普通的依賴關係——它是**共同擁有的合約**：

```
modules/shared/
  ↑ import by all 16 BCs
```

## 規則

1. `shared/` 的任何變更（特別是 `DomainEvent` 介面）都必須同步更新所有消費方
2. 不允許任何 BC 反向依賴（shared/ 不 import 任何 BC）
3. `shared/` 只包含所有 BC 都認可的最小公共型別

## IDDD 整合模式

| 關係 | 模式 |
|------|------|
| shared ← 所有 BC | Shared Kernel |
````

## File: modules/shared/domain-events.md
````markdown
# Domain Events — shared

## 說明

`shared` 是 Shared Kernel，本身不發出或訂閱業務領域事件。

它提供的是**所有 BC 發出事件所需的基礎介面**：

```typescript
// 所有模組的領域事件都遵循此結構
interface DomainEvent {
  readonly type: string;        // "module.entity.action" 格式
  readonly occurredAt: string;  // ISO 8601
}
```

## 事件命名規範（全域）

| 規則 | 範例 |
|------|------|
| 格式 | `<module>.<entity>.<action>` 或 `<module>.<action>` |
| 大小寫 | 全小寫，底線分隔 |
| 時態 | **過去式**（代表已發生的事實） |

```typescript
// ✅ 正確命名
"knowledge.page_created"
"workspace.member_joined"
"workspace-flow.task_status_changed"

// ❌ 錯誤命名
"CreatePage"         // 現在式、大寫
"PageCreatedEvent"   // 有 Event 後綴
```
````

## File: modules/shared/domain-services.md
````markdown
# shared — Domain Services

> **Canonical bounded context:** `shared`
> **模組路徑:** `modules/shared/`
> **Domain Type:** Shared Kernel

本文件整理 `shared` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/shared/domain-services.md`
- `../../../modules/shared/aggregates.md`
````

## File: modules/shared/README.md
````markdown
# shared — 共享核心上下文

> **Domain Type:** Shared Kernel  
> **模組路徑:** `modules/shared/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`shared` 不是獨立業務能力，而是多個 bounded context 共同依賴的 Shared Kernel。它提供穩定共享的事件、值物件與工具型別，目標是減少重複而不形成隱性大泥球。

## 主要職責

| 能力 | 說明 |
|---|---|
| 共享型別 | 提供跨模組穩定共用的事件與值物件基礎型別 |
| 事件基礎語意 | 維持 `DomainEvent`、`EventRecord` 等跨域契約一致 |
| 工具與通用值物件 | 提供 slug、識別碼與其他低變動共享能力 |

## 與其他 Bounded Context 協作

- 所有上下文都可能依賴 `shared`，但只能消費穩定共享核心，不能把業務邏輯堆入此模組。
- `shared` 的變更需視為跨域契約變更處理。

## 核心聚合 / 核心概念

- **`DomainEvent`**
- **`EventRecord`**
- **`SlugUtils`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/shared/repositories.md
````markdown
# shared — Repositories

> **Canonical bounded context:** `shared`
> **模組路徑:** `modules/shared/`
> **Domain Type:** Shared Kernel

本文件整理 `shared` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- 目前沒有對應檔案。

## Infrastructure Implementations

- `infrastructure/InMemoryEventStoreRepository.ts`
- `infrastructure/NoopEventBusRepository.ts`
- `infrastructure/SimpleEventBus.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/shared/repositories.md`
- `../../../modules/shared/aggregates.md`
````

## File: modules/shared/ubiquitous-language.md
````markdown
# Ubiquitous Language — shared

> **範圍：** 跨所有 BC 的共享基礎術語（Shared Kernel）

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 領域事件 | DomainEvent | 所有領域事件的基礎介面，含 `type` 和 `occurredAt` | `modules/shared/domain/events.ts` |
| 事件記錄 | EventRecord | 稽核/追蹤用的事件記錄（`eventId`, `occurredAt`, `actorId`） | `modules/shared/domain/event-record.ts` |
| 發生時間 | occurredAt | 事件發生時間，**ISO 8601 字串**格式（非 Date 物件） | `DomainEvent.occurredAt` |
| Slug | Slug | URL-safe 的識別符字串 | `modules/shared/domain/slug-utils.ts` |

## 關鍵規則

`occurredAt` 必須是 **ISO 8601 字串**（`string`），不是 `Date`、`Timestamp` 或數字。所有繼承 `DomainEvent` 的事件介面都必須遵守此規範。

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `occurredAt` | `occurredAtISO`, `timestamp`, `createdAt`（作為事件時間戳） |
| `DomainEvent` | `BaseEvent`, `Event` |
````

## File: modules/source/AGENT.md
````markdown
# AGENT.md — source BC

## 模組定位

`source` 是文件來源的支援域，負責上傳生命週期、版本快照與 RAG 文件登記。是 RAG ingestion pipeline 的業務入口。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `SourceDocument` | File、Document、Asset、Attachment |
| `WikiLibrary` | Library、Folder、Collection |
| `FileVersion` | Version、Snapshot、Revision |
| `RagDocument` | RagFile、IngestionDoc |
| `RetentionPolicy` | Policy、ExpiryRule |
| `AuditRecord` | Log、Event、History |
| `ActorContext` | User、CurrentUser |
| `IngestionHandoff` | Trigger、Signal |

## 邊界規則

### ✅ 允許
```typescript
import { sourceApi } from "@/modules/source/api";
import type { SourceDocumentDTO, WikiLibraryDTO } from "@/modules/source/api";
```

### ❌ 禁止
```typescript
import { File } from "@/modules/source/domain/entities/File";
```

## Firestore Timestamp 規則

```typescript
// ✅ 安全的調用方式
const date = (value.toDate as () => unknown)() as Date;

// ❌ 禁止解構賦值
const { toDate } = value; toDate(); // 'this' binding 失效
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/source/aggregates.md
````markdown
# Aggregates — source

## 聚合根：SourceDocument（File.ts）

### 職責
管理文件的上傳生命週期，從上傳初始化到完成確認，以及版本快照與保留政策。

### 生命週期狀態機
```
pending_upload ──[upload_complete]──► uploaded ──[archive]──► archived
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 文件主鍵 |
| `name` | `string` | 檔案名稱 |
| `organizationId` | `string` | 所屬組織 |
| `workspaceId` | `string \| null` | 所屬工作區 |
| `status` | `FileStatus` | `pending_upload \| uploaded \| archived` |
| `versions` | `FileVersion[]` | 版本列表 |
| `retentionPolicy` | `RetentionPolicy \| null` | 保留政策 |
| `permissionSnapshot` | `PermissionSnapshot` | 上傳時授權快照 |

---

## 聚合根：WikiLibrary

### 職責
RAG 文件的邏輯集合容器，對應使用者在 UI 看到的「知識庫」概念。

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `FileVersion` | 版本快照（versionId, fileUrl, createdAt） |
| `RetentionPolicy` | 保留規則（retainDays, deleteAfterExpiry） |
| `PermissionSnapshot` | 上傳時的授權快照（不可變） |
| `AuditRecord` | 操作稽核記錄（append-only） |

---

## Ports（Hexagonal Architecture）

| Port | 說明 |
|------|------|
| `ActorContextPort` | 解析操作者身分與授權 |
| `OrganizationPolicyPort` | 查詢組織層級政策 |
| `WorkspaceGrantPort` | 驗證工作區授權 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `FileRepository` | `save()`, `findById()`, `listByWorkspace()` |
| `RagDocumentRepository` | `save()`, `findByDocumentId()` |
| `WikiLibraryRepository` | `save()`, `findByWorkspaceId()` |
````

## File: modules/source/application-services.md
````markdown
# source — Application Services

> **Canonical bounded context:** `source`
> **模組路徑:** `modules/source/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `source` 的 application layer 服務與 use cases。內容與 `modules/source/application/` 實作保持一致。

## Application Layer 職責

管理文件上傳生命週期、版本快照與 RAG 文件登記。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/file.dto.ts`
- `application/dto/rag-document.dto.ts`
- `application/index.ts`
- `application/use-cases/list-workspace-files.use-case.ts`
- `application/use-cases/register-uploaded-rag-document.use-case.ts`
- `application/use-cases/upload-complete-file.use-case.ts`
- `application/use-cases/upload-init-file.use-case.ts`
- `application/use-cases/wiki-libraries.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/source/README.md`
- 模組 AGENT：`../../../modules/source/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/source/application-services.md`
````

## File: modules/source/context-map.md
````markdown
# Context Map — source

## 上游（依賴）

### identity → source（Customer/Supplier）
- `ActorContextPort` 透過 `identity/api` 驗證上傳者身分

### workspace → source（Customer/Supplier）
- 文件隸屬 `workspaceId`，需透過 `WorkspaceGrantPort` 驗證授權

### organization → source（Customer/Supplier）
- `OrganizationPolicyPort` 解算組織層級保留政策

---

## 下游（被依賴）

### source → ai（Customer/Supplier）

- `source.upload_completed` 觸發 `ai` 域建立 IngestionJob
- **Runtime 邊界**：Next.js 端執行 upload-init/complete；`py_fn/` 執行 Embedding

### source → knowledge（Published Language）

- 文件關聯知識頁面時通知 `knowledge` 域

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → source | identity | source | Customer/Supplier（Port） |
| workspace → source | workspace | source | Customer/Supplier（Port） |
| organization → source | organization | source | Customer/Supplier（Port） |
| source → ai | source | ai | Published Language (Events) |
| source → knowledge | source | knowledge | Published Language (Events) |
````

## File: modules/source/domain-events.md
````markdown
# Domain Events — source

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `source.upload_initiated` | upload-init 完成、簽名 URL 已產生 | `documentId`, `workspaceId`, `actorId`, `occurredAt` |
| `source.upload_completed` | upload-complete 確認完成 | `documentId`, `workspaceId`, `occurredAt` |
| `source.rag_document_registered` | RagDocument 成功登記進入攝入管線 | `documentId`, `ragDocumentId`, `occurredAt` |
| `source.file_archived` | 文件被封存 | `documentId`, `actorId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `workspace` | `workspace.created` | 初始化工作區的 WikiLibrary |
| `identity` | `TokenRefreshSignal` | 更新 ActorContext 授權快照 |

## 消費 source 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `ai` | `source.upload_completed` | 建立 IngestionJob，啟動 RAG 攝入管線 |
| `knowledge` | `source.upload_completed` | 文件關聯知識頁面通知（可選） |
````

## File: modules/source/domain-services.md
````markdown
# source — Domain Services

> **Canonical bounded context:** `source`
> **模組路徑:** `modules/source/`
> **Domain Type:** Supporting Subdomain

本文件整理 `source` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- `domain/services/complete-upload-file.ts`
- `domain/services/resolve-file-organization-id.ts`

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/source/domain-services.md`
- `../../../modules/source/aggregates.md`
````

## File: modules/source/README.md
````markdown
# source — 文件來源上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/source/`  
> **開發狀態:** 🚧 Developing

## 在 Knowledge Platform / Second Brain 中的角色

`source` 是 Knowledge Platform 的文件入口，承接 Notion-like 內容系統之外的外部文件、附件與來源治理。它負責讓知識進入平台，並安全地交給 `ai` 攝入管線處理。

## 主要職責

| 能力 | 說明 |
|---|---|
| 來源文件生命週期 | 管理上傳初始化、上傳完成、版本快照與保留政策 |
| 來源集合管理 | 維護文件集合、library 與 workspace 範圍的來源視圖 |
| 攝入交接 | 把已完成上傳的來源資料交付 `ai` 進入攝入流程 |

## 與其他 Bounded Context 協作

- `workspace` 提供來源文件的歸屬邊界；`knowledge` 可能引用或轉寫來源內容。
- `ai` 接收來源文件並建立 ingestion job；`knowledge-base` 與 `search` 最終消費來源衍生的結構與索引。

## 核心聚合 / 核心概念

- **`SourceDocument`**
- **`SourceCollection`**
- **`WikiLibrary`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/source/repositories.md
````markdown
# source — Repositories

> **Canonical bounded context:** `source`
> **模組路徑:** `modules/source/`
> **Domain Type:** Supporting Subdomain

本文件整理 `source` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/FileRepository.ts`
- `domain/repositories/RagDocumentRepository.ts`
- `domain/repositories/WikiLibraryRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseFileRepository.ts`
- `infrastructure/firebase/FirebaseRagDocumentRepository.ts`
- `infrastructure/index.ts`
- `infrastructure/repositories/in-memory-wiki-library.repository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/source/repositories.md`
- `../../../modules/source/aggregates.md`
````

## File: modules/source/ubiquitous-language.md
````markdown
# Ubiquitous Language — source

> **範圍：** 僅限 `modules/source/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 來源文件 | SourceDocument | 上傳的原始文件聚合根（對應 File.ts） |
| 知識庫 | WikiLibrary | RAG 文件的邏輯集合容器 |
| 檔案版本 | FileVersion | SourceDocument 的版本快照 |
| RAG 文件 | RagDocument | 已登記進入 RAG 管線的文件記錄 |
| 授權快照 | PermissionSnapshot | 上傳時的授權狀態快照（不可變） |
| 保留政策 | RetentionPolicy | 文件的保留期限與刪除規則 |
| 稽核記錄 | AuditRecord | 文件操作的不可變稽核軌跡 |
| 攝入交付 | IngestionHandoff | 上傳完成後交付 py_fn worker 的觸發信號 |
| 演員上下文 | ActorContext | 操作者身分與授權上下文（透過 ActorContextPort） |
| 工作區授權 | WorkspaceGrant | 工作區層級的授權快照（透過 WorkspaceGrantPort） |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `SourceDocument` | `File`, `Document`, `Asset` |
| `WikiLibrary` | `Library`, `Folder`, `Collection` |
| `RetentionPolicy` | `Policy`, `LifecycleRule` |
````

## File: modules/subdomains.md
````markdown
# Modules Subdomains（Canonical Link）

本文件僅作為 modules 層入口，避免與 DDD 主文件重複。

- ✅ Canonical Source: [`../docs/ddd/subdomains.md`](../docs/ddd/subdomains.md)
- 若需調整子域分類內容，請只編輯 canonical 檔案。
- 各 bounded context 的細節仍以 `modules/<context>/*.md` 為準。
````

## File: modules/workspace-audit/AGENT.md
````markdown
# AGENT.md — workspace-audit BC

## 模組定位

`workspace-audit` 是稽核紀錄支援域，維護 Append-Only 的 AuditLog，查詢工作區與組織稽核軌跡。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `AuditLog` | Log、Record、History、ActivityLog |
| `auditEventType` | EventType、ActionType |
| `actorId` | UserId、PerformerId |
| `workspaceId` / `organizationId` | Scope（作為稽核範圍） |

## 最重要規則：Append-Only

```typescript
// ✅ 只允許追加新記錄
await auditRepository.append(newAuditLog);

// ❌ 禁止修改或刪除
await auditRepository.update(id, changes);  // 違反 Append-Only
await auditRepository.delete(id);           // 違反 Append-Only
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceAuditApi } from "@/modules/workspace-audit/api";
import type { AuditLogDTO } from "@/modules/workspace-audit/api";
```

### ❌ 禁止
```typescript
import { AuditLog } from "@/modules/workspace-audit/domain/entities/AuditLog";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/workspace-audit/aggregates.md
````markdown
# Aggregates — workspace-audit

## 聚合根：AuditLog（Append-Only）

### 職責
記錄工作區或組織範圍內重要操作的不可變稽核軌跡。一旦寫入，永不修改或刪除。

### Append-Only 約束

> **核心不變數：** AuditLog 只能被建立，不能被更新或刪除。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 記錄主鍵（UUID） |
| `workspaceId` | `string \| null` | 所屬工作區（可選，組織級記錄可能無 workspaceId） |
| `organizationId` | `string` | 所屬組織 |
| `actorId` | `string` | 操作者帳戶 ID |
| `auditEventType` | `string` | 操作類型（如 `workspace.member_joined`） |
| `targetId` | `string \| null` | 操作對象 ID（可選） |
| `targetType` | `string \| null` | 操作對象類型（可選） |
| `metadata` | `Record<string, unknown>` | 附加資訊 |
| `auditedAt` | `string` | ISO 8601 操作時間 |

### 不變數

- `id` 建立後不可變
- `auditedAt` 使用記錄建立時的系統時間，不可後期修改
- 所有欄位建立後均不可修改（immutable record）

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `AuditLogRepository` | `append()`, `listByWorkspace()`, `listByOrganization()` |

**注意：** `AuditLogRepository` 不提供 `update()` 或 `delete()` 方法，強制執行 Append-Only。
````

## File: modules/workspace-audit/application-services.md
````markdown
# workspace-audit — Application Services

> **Canonical bounded context:** `workspace-audit`
> **模組路徑:** `modules/workspace-audit/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-audit` 的 application layer 服務與 use cases。內容與 `modules/workspace-audit/application/` 實作保持一致。

## Application Layer 職責

以 append-only 模式記錄工作區與組織範圍內的重要稽核軌跡。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/.gitkeep`
- `application/use-cases/audit.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-audit/README.md`
- 模組 AGENT：`../../../modules/workspace-audit/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-audit/application-services.md`
````

## File: modules/workspace-audit/context-map.md
````markdown
# Context Map — workspace-audit

## 上游（依賴）

`workspace-audit` 訂閱所有業務 BC 的事件，但**不依賴**任何 BC 的 api。它是純事件消費者。

```
所有業務 BC ──[Domain Events]──► workspace-audit（Terminal Sink）
```

### 主要事件來源

| 來源 BC | 整合模式 |
|---------|---------|
| `workspace` | Published Language（被動消費） |
| `organization` | Published Language（被動消費） |
| `workspace-flow` | Published Language（被動消費） |
| `workspace-scheduling` | Published Language（被動消費） |
| `source` | Published Language（被動消費） |
| `ai` | Published Language（被動消費） |

---

## 下游（被依賴）

### workspace-audit → WorkspaceDetailScreen（Interfaces）

- `workspace-audit/api` 提供稽核查詢 API 給 `workspace` 的 WorkspaceDetailScreen tab

---

## Terminal Sink 原則

`workspace-audit` 是事件消費的**終點**，不向其他 BC 發出事件。業務流程不應等待或依賴稽核記錄的完成。

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| 所有 BC → workspace-audit | 各 BC | workspace-audit | Published Language (Terminal Sink) |
| workspace-audit → workspace UI | workspace-audit | app/ | Customer/Supplier（查詢） |
````

## File: modules/workspace-audit/domain-events.md
````markdown
# Domain Events — workspace-audit

## 發出事件

`workspace-audit` 不發出 DomainEvent。它是事件的**最終消費者（Terminal Sink）**，不產生進一步的業務事件。

## 訂閱事件（消費端）

`workspace-audit` 訂閱所有需要留下稽核軌跡的業務事件：

| 來源 BC | 訂閱事件 | AuditLog.auditEventType |
|---------|---------|------------------------|
| `workspace` | `workspace.created` | `workspace.created` |
| `workspace` | `workspace.member_joined` | `workspace.member_joined` |
| `workspace` | `workspace.archived` | `workspace.archived` |
| `organization` | `organization.member_joined` | `organization.member_joined` |
| `organization` | `organization.member_removed` | `organization.member_removed` |
| `workspace-flow` | `workspace-flow.task_status_changed` | `task.status_changed` |
| `workspace-flow` | `workspace-flow.invoice_paid` | `invoice.paid` |
| `workspace-scheduling` | `workspace-scheduling.demand_status_changed` | `demand.status_changed` |
| `source` | `source.upload_completed` | `document.uploaded` |
| `ai` | `ai.ingestion_completed / failed` | `ingestion.completed / failed` |

## 說明

稽核模組是事件消費的「終點站」。業務 BC 不應依賴稽核模組的狀態，稽核只做記錄，不影響業務流程。
````

## File: modules/workspace-audit/domain-services.md
````markdown
# workspace-audit — Domain Services

> **Canonical bounded context:** `workspace-audit`
> **模組路徑:** `modules/workspace-audit/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-audit` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-audit/domain-services.md`
- `../../../modules/workspace-audit/aggregates.md`
````

## File: modules/workspace-audit/README.md
````markdown
# workspace-audit — 工作區稽核上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-audit/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-audit` 是工作區治理的追溯層，透過 append-only 稽核紀錄保存重要操作的事後可查性。它不是直接創造知識價值的核心域，但對信任、治理與合規至關重要。

## 主要職責

| 能力 | 說明 |
|---|---|
| 稽核寫入 | 接收重要行為或事件並追加紀錄 |
| 稽核查詢 | 依工作區或組織範圍提供可查詢的 audit trail |
| 治理可見性 | 支援事後追查、責任歸屬與決策證據 |

## 與其他 Bounded Context 協作

- `workspace` 與 `organization` 提供查詢與可見性範圍。
- `workspace-flow`、`workspace-feed` 與其他上下文可作為稽核事件來源。

## 核心聚合 / 核心概念

- **`AuditLog`**
- **`AuditActor`**
- **`AuditScope`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/workspace-audit/repositories.md
````markdown
# workspace-audit — Repositories

> **Canonical bounded context:** `workspace-audit`
> **模組路徑:** `modules/workspace-audit/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-audit` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/AuditRepository.ts`

## Infrastructure Implementations

- `infrastructure/.gitkeep`
- `infrastructure/firebase/FirebaseAuditRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-audit/repositories.md`
- `../../../modules/workspace-audit/aggregates.md`
````

## File: modules/workspace-audit/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-audit

> **範圍：** 僅限 `modules/workspace-audit/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 稽核記錄 | AuditLog | 一條不可變的操作紀錄（Append-Only，永不修改） |
| 稽核事件類型 | auditEventType | 記錄的操作類型字串（如 `workspace.member_joined`） |
| 操作者 ID | actorId | 執行此操作的帳戶 ID |
| 稽核範圍 | auditScope | 此記錄的範圍（workspace 或 organization） |
| 稽核時間 | auditedAt | 操作發生時間，ISO 8601 |
| 元資料 | metadata | 操作的附加資訊（JSON，可選） |

## Append-Only 原則

`AuditLog` 一旦寫入即不可更改。任何試圖修改或刪除 AuditLog 的操作都違反此域的核心不變數。

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `AuditLog` | `Log`, `Record`, `History` |
| `actorId` | `userId`, `performerId` |
| `auditedAt` | `timestamp`, `createdAt`（在稽核上下文中） |
````

## File: modules/workspace-feed/AGENT.md
````markdown
# AGENT.md — workspace-feed BC

## 通用語言

| 正確術語 | 禁止使用 |
|----------|----------|
| `WorkspaceFeedPost` | Post、Tweet、Message |
| `WorkspaceFeedPostType` | Type、PostType |
| `authorAccountId` | authorId、userId |

## 邊界規則

```typescript
// ✅
import { workspaceFeedApi } from "@/modules/workspace-feed/api";
// ❌
import { WorkspaceFeedPost } from "@/modules/workspace-feed/domain/entities/WorkspaceFeedPost";
```
````

## File: modules/workspace-feed/aggregates.md
````markdown
# Aggregates — workspace-feed

## 聚合根：WorkspaceFeedPost

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 貼文主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `authorAccountId` | `string` | 作者帳戶 ID |
| `type` | `WorkspaceFeedPostType` | `post \| reply \| repost` |
| `content` | `string` | 貼文內容 |
| `replyToPostId` | `string \| null` | 回覆目標 |
| `repostOfPostId` | `string \| null` | 轉貼目標 |
| `likeCount` | `number` | 按讚數 |
| `viewCount` | `number` | 瀏覽數 |

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `WorkspaceFeedRepository` | `save()`, `findById()`, `listByWorkspace()` |
````

## File: modules/workspace-feed/application-services.md
````markdown
# workspace-feed — Application Services

> **Canonical bounded context:** `workspace-feed`
> **模組路徑:** `modules/workspace-feed/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-feed` 的 application layer 服務與 use cases。內容與 `modules/workspace-feed/application/` 實作保持一致。

## Application Layer 職責

管理工作區的社交動態貼文與互動事件。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/workspace-feed.dto.ts`
- `application/use-cases/workspace-feed.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-feed/README.md`
- 模組 AGENT：`../../../modules/workspace-feed/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-feed/application-services.md`
````

## File: modules/workspace-feed/context-map.md
````markdown
# Context Map — workspace-feed

## 上游（依賴）

### workspace → workspace-feed（Conformist）

- `WorkspaceFeedPost.workspaceId` 隸屬工作區

## 下游（被依賴）

### workspace-feed → notification（Published Language）

- `WorkspaceFeedPostCreated` 可觸發通知

### workspace-feed → workspace-audit（Published Language）

- 貼文操作記錄稽核軌跡

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → workspace-feed | workspace | workspace-feed | Conformist |
| workspace-feed → notification | workspace-feed | notification | Published Language |
| workspace-feed → workspace-audit | workspace-feed | workspace-audit | Published Language |
````

## File: modules/workspace-feed/domain-events.md
````markdown
# Domain Events — workspace-feed

## 發出事件

| 事件 | 觸發條件 |
|------|---------|
| `WorkspaceFeedPostCreated` | 新貼文發布 |
| `WorkspaceFeedReplyCreated` | 回覆發布 |
| `WorkspaceFeedRepostCreated` | 轉貼發布 |
| `WorkspaceFeedPostLiked` | 按讚 |
| `WorkspaceFeedPostViewed` | 瀏覽 |
| `WorkspaceFeedPostBookmarked` | 收藏 |
| `WorkspaceFeedPostShared` | 分享 |

所有事件繼承 `WorkspaceFeedBaseEvent`（`accountId`, `workspaceId`, `postId`, `actorAccountId`, `occurredAtISO`）。

## 訂閱事件

`workspace-feed` 不訂閱其他 BC 的事件。
````

## File: modules/workspace-feed/domain-services.md
````markdown
# workspace-feed — Domain Services

> **Canonical bounded context:** `workspace-feed`
> **模組路徑:** `modules/workspace-feed/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-feed` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-feed/domain-services.md`
- `../../../modules/workspace-feed/aggregates.md`
````

## File: modules/workspace-feed/README.md
````markdown
# workspace-feed — 工作區動態上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-feed/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-feed` 是工作區的動態流與互動層，把知識、任務與協作事件轉成團隊可感知的貼文、回覆與互動紀錄。它提升知識平台的協作流動性與可見性。

## 主要職責

| 能力 | 說明 |
|---|---|
| 動態貼文 | 管理 post / reply / repost 等工作區動態內容 |
| 互動紀錄 | 記錄 like / view / bookmark / share 等互動 |
| 事件可見化 | 把協作行為轉成工作區成員可追蹤的活動流 |

## 與其他 Bounded Context 協作

- `workspace` 提供動態的歸屬邊界。
- `workspace-flow`、`knowledge`、`notification` 可與動態流形成聯動。

## 核心聚合 / 核心概念

- **`WorkspaceFeedPost`**
- **`FeedReaction`**
- **`FeedThread`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/workspace-feed/repositories.md
````markdown
# workspace-feed — Repositories

> **Canonical bounded context:** `workspace-feed`
> **模組路徑:** `modules/workspace-feed/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-feed` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/workspace-feed.repositories.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseWorkspaceFeedInteractionRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceFeedPostRepository.ts`
- `infrastructure/index.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-feed/repositories.md`
- `../../../modules/workspace-feed/aggregates.md`
````

## File: modules/workspace-feed/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-feed

| 術語 | 英文 | 定義 |
|------|------|------|
| 動態貼文 | WorkspaceFeedPost | 工作區社交動態貼文（post / reply / repost） |
| 貼文類型 | WorkspaceFeedPostType | `"post" \| "reply" \| "repost"` |
| 作者帳戶 ID | authorAccountId | 發文者帳戶 ID |
| 回覆目標 | replyToPostId | 此貼文回覆的原貼文 ID |
| 轉貼目標 | repostOfPostId | 此貼文轉貼的原貼文 ID |
````

## File: modules/workspace-flow/AGENT.md
````markdown
# AGENT.md — workspace-flow BC

## 模組定位

`workspace-flow` 是工作流程狀態機支援域，管理 Task/Issue/Invoice 三條業務線，並透過 KnowledgeToWorkflowMaterializer 訂閱 knowledge 事件。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Task` | TodoItem、WorkItem |
| `TaskStatus` | Status（單獨使用）、State |
| `Issue` | Bug、Ticket、Problem |
| `IssueStatus` | Status（單獨使用） |
| `Invoice` | Bill、Receipt、Payment |
| `InvoiceStatus` | Status（單獨使用） |
| `MaterializedTask` | ConvertedTask、AutoTask |
| `sourceReference` | Origin、Source（作為物化來源） |
| `KnowledgeToWorkflowMaterializer` | ContentProcessor、PageConverter |

## 狀態機（必須嚴格遵守）

```
TaskStatus:    draft → in_progress → qa → acceptance → accepted → archived
IssueStatus:   open → investigating → fixing → retest → resolved → closed
InvoiceStatus: draft → submitted → finance_review → approved → paid → closed
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceFlowApi } from "@/modules/workspace-flow/api";
import { WorkspaceFlowTab } from "@/modules/workspace-flow/api";
```

### ❌ 禁止
```typescript
import { Task } from "@/modules/workspace-flow/domain/entities/Task";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/workspace-flow/aggregates.md
````markdown
# Aggregates — workspace-flow

## 聚合根：Task

### 職責
可追蹤的工作單元，管理完整的任務生命週期狀態機。

### 生命週期狀態機
```
draft ──► in_progress ──► qa ──► acceptance ──► accepted ──► archived
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Task 主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `title` | `string` | 任務標題 |
| `status` | `TaskStatus` | 當前狀態 |
| `assigneeId` | `string \| null` | 負責人帳戶 ID |
| `dueDate` | `string \| null` | 截止日期 ISO 8601 |
| `sourceReference` | `SourceReference \| null` | 物化來源（pageId, causationId） |
| `currentUserId` | `string` | 當前操作者 ID |

---

## 聚合根：Issue

### 生命週期狀態機
```
open ──► investigating ──► fixing ──► retest ──► resolved ──► closed
```

### 關鍵屬性

| 屬性 | 說明 |
|------|------|
| `id`, `workspaceId`, `title` | 基本屬性 |
| `status` | `IssueStatus` |
| `severity` | `IssueStatus` 嚴重程度 |
| `reporterId` | 報告者帳戶 ID |
| `assigneeId` | 負責人帳戶 ID（可選） |

---

## 聚合根：Invoice

### 生命週期狀態機
```
draft ──► submitted ──► finance_review ──► approved ──► paid ──► closed
```

### 關鍵屬性

| 屬性 | 說明 |
|------|------|
| `id`, `workspaceId` | 基本屬性 |
| `status` | `InvoiceStatus` |
| `amount` | `number` |
| `currency` | `string`（預設 "TWD"） |
| `sourceReference` | 物化來源（可選） |

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `TaskStatus` | `"draft" \| "in_progress" \| "qa" \| "acceptance" \| "accepted" \| "archived"` |
| `IssueStatus` | `"open" \| "investigating" \| "fixing" \| "retest" \| "resolved" \| "closed"` |
| `InvoiceStatus` | `"draft" \| "submitted" \| "finance_review" \| "approved" \| "paid" \| "closed"` |
| `SourceReference` | `{ pageId: string, causationId: string }` |

---

## Repository Interfaces

| 介面 | 說明 |
|------|------|
| `TaskRepository` | Task CRUD + 狀態查詢 |
| `IssueRepository` | Issue CRUD + 狀態查詢 |
| `InvoiceRepository` | Invoice CRUD + 狀態查詢 |

---

## Domain Services

| 服務 | 說明 |
|------|------|
| `KnowledgeToWorkflowMaterializer` | Process Manager：訂閱 `knowledge.page_approved`，建立 MaterializedTask 和 Invoice |
````

## File: modules/workspace-flow/application-services.md
````markdown
# workspace-flow — Application Services

> **Canonical bounded context:** `workspace-flow`
> **模組路徑:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-flow` 的 application layer 服務與 use cases。內容與 `modules/workspace-flow/application/` 實作保持一致。

## Application Layer 職責

管理 Task / Issue / Invoice 三條工作流程狀態機與流程物化。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/add-invoice-item.dto.ts`
- `application/dto/create-task.dto.ts`
- `application/dto/invoice-query.dto.ts`
- `application/dto/issue-query.dto.ts`
- `application/dto/materialize-from-knowledge.dto.ts`
- `application/dto/open-issue.dto.ts`
- `application/dto/pagination.dto.ts`
- `application/dto/remove-invoice-item.dto.ts`
- `application/dto/resolve-issue.dto.ts`
- `application/dto/task-query.dto.ts`
- `application/dto/update-invoice-item.dto.ts`
- `application/dto/update-task.dto.ts`
- `application/ports/InvoiceService.ts`
- `application/ports/IssueService.ts`
- `application/ports/TaskService.ts`
- `application/process-managers/knowledge-to-workflow-materializer.ts`
- `application/use-cases/add-invoice-item.use-case.ts`
- `application/use-cases/approve-invoice.use-case.ts`
- `application/use-cases/approve-task-acceptance.use-case.ts`
- `application/use-cases/archive-task.use-case.ts`
- `application/use-cases/assign-task.use-case.ts`
- `application/use-cases/close-invoice.use-case.ts`
- `application/use-cases/close-issue.use-case.ts`
- `application/use-cases/create-invoice.use-case.ts`
- `application/use-cases/create-task.use-case.ts`
- `application/use-cases/fail-issue-retest.use-case.ts`
- `application/use-cases/fix-issue.use-case.ts`
- `application/use-cases/materialize-tasks-from-knowledge.use-case.ts`
- `application/use-cases/open-issue.use-case.ts`
- `application/use-cases/pass-issue-retest.use-case.ts`
- `application/use-cases/pass-task-qa.use-case.ts`
- `application/use-cases/pay-invoice.use-case.ts`
- `application/use-cases/reject-invoice.use-case.ts`
- `application/use-cases/remove-invoice-item.use-case.ts`
- `application/use-cases/resolve-issue.use-case.ts`
- `application/use-cases/review-invoice.use-case.ts`
- `application/use-cases/start-issue.use-case.ts`
- `application/use-cases/submit-invoice.use-case.ts`
- `application/use-cases/submit-issue-retest.use-case.ts`
- `application/use-cases/submit-task-to-qa.use-case.ts`
- `application/use-cases/update-invoice-item.use-case.ts`
- `application/use-cases/update-task.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-flow/README.md`
- 模組 AGENT：`../../../modules/workspace-flow/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-flow/application-services.md`
````

## File: modules/workspace-flow/context-map.md
````markdown
# Context Map — workspace-flow

## 上游（依賴）

### knowledge → workspace-flow（Published Language）

**這是 workspace-flow 最重要的上游整合。**

- `workspace-flow` 的 `KnowledgeToWorkflowMaterializer` 訂閱 `knowledge.page_approved`
- 從 `extractedTasks[]` 建立 MaterializedTask
- 從 `extractedInvoices[]` 建立 Invoice
- 每個物化實體中記錄 `sourceReference`（pageId + causationId）

```
knowledge.page_approved ──► KnowledgeToWorkflowMaterializer
                            ├─► Task.create（extractedTask）
                            └─► Invoice.create（extractedInvoice）
```

### workspace → workspace-flow（Conformist）

- Task/Issue/Invoice 都隸屬 `workspaceId`
- `WorkspaceFlowTab` 接收 `workspaceId` + `currentUserId` 作為 props

---

## 下游（被依賴）

### workspace-flow → notification（Published Language）

- 狀態變更事件觸發通知（如 task_assigned）

### workspace-flow → workspace-audit（Published Language）

- 狀態轉換事件供稽核紀錄消費

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| knowledge → workspace-flow | knowledge | workspace-flow | Published Language (Events) |
| workspace → workspace-flow | workspace | workspace-flow | Conformist |
| workspace-flow → notification | workspace-flow | notification | Published Language |
| workspace-flow → workspace-audit | workspace-flow | workspace-audit | Published Language |
````

## File: modules/workspace-flow/domain-events.md
````markdown
# Domain Events — workspace-flow

## 發出事件

### Task 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.task_created` | Task 建立 | `taskId`, `workspaceId`, `title`, `createdByUserId`, `occurredAt` |
| `workspace-flow.task_status_changed` | Task 狀態變更 | `taskId`, `workspaceId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.task_assigned` | Task 指派負責人 | `taskId`, `workspaceId`, `assigneeId`, `occurredAt` |
| `workspace-flow.task_materialized` | Task 由 KnowledgeToWorkflowMaterializer 物化 | `taskId`, `workspaceId`, `sourceReference`, `occurredAt` |

### Issue 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.issue_opened` | Issue 開啟 | `issueId`, `workspaceId`, `title`, `reporterId`, `occurredAt` |
| `workspace-flow.issue_status_changed` | Issue 狀態變更 | `issueId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.issue_resolved` | Issue 解決 | `issueId`, `workspaceId`, `occurredAt` |

### Invoice 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.invoice_created` | Invoice 建立 | `invoiceId`, `workspaceId`, `amount`, `currency`, `occurredAt` |
| `workspace-flow.invoice_status_changed` | Invoice 狀態變更 | `invoiceId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.invoice_paid` | Invoice 標記已付款 | `invoiceId`, `workspaceId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `knowledge` | `knowledge.page_approved` | KnowledgeToWorkflowMaterializer 建立 MaterializedTask 與 Invoice |

## 消費 workspace-flow 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `notification` | `workspace-flow.task_assigned` | 通知被指派者 |
| `workspace-audit` | 所有狀態變更事件 | 記錄稽核軌跡 |
````

## File: modules/workspace-flow/domain-services.md
````markdown
# workspace-flow — Domain Services

> **Canonical bounded context:** `workspace-flow`
> **模組路徑:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-flow` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- `domain/services/invoice-guards.ts`
- `domain/services/invoice-transition-policy.ts`
- `domain/services/issue-transition-policy.ts`
- `domain/services/task-guards.ts`
- `domain/services/task-transition-policy.ts`

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-flow/domain-services.md`
- `../../../modules/workspace-flow/aggregates.md`
````

## File: modules/workspace-flow/README.md
````markdown
# workspace-flow — 工作流程上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-flow/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-flow` 把知識內容轉成可執行的業務流程，負責 Task、Issue、Invoice 三條工作線的狀態機與政策。它是知識平台從「記錄知識」走向「驅動執行」的主要協作引擎。

## 主要職責

| 能力 | 說明 |
|---|---|
| Task / Issue / Invoice 狀態機 | 管理主要工作流程聚合與轉換規則 |
| 物化流程 | 消費 `knowledge.page_approved` 等事件建立可執行項目 |
| 業務守衛 | 封裝狀態轉換、角色限制與流程政策 |

## 與其他 Bounded Context 協作

- `knowledge` 是最重要上游，提供審批後的內容事件。
- `workspace` 提供流程歸屬；`workspace-audit` 與 `workspace-feed` 消費流程結果或事件。

## 核心聚合 / 核心概念

- **`Task`**
- **`Issue`**
- **`Invoice`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/workspace-flow/repositories.md
````markdown
# workspace-flow — Repositories

> **Canonical bounded context:** `workspace-flow`
> **模組路徑:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-flow` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/InvoiceRepository.ts`
- `domain/repositories/IssueRepository.ts`
- `domain/repositories/TaskRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/invoice-item.converter.ts`
- `infrastructure/firebase/invoice.converter.ts`
- `infrastructure/firebase/issue.converter.ts`
- `infrastructure/firebase/sourceReference.converter.ts`
- `infrastructure/firebase/task.converter.ts`
- `infrastructure/firebase/workspace-flow.collections.ts`
- `infrastructure/repositories/FirebaseInvoiceItemRepository.ts`
- `infrastructure/repositories/FirebaseInvoiceRepository.ts`
- `infrastructure/repositories/FirebaseIssueRepository.ts`
- `infrastructure/repositories/FirebaseTaskRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-flow/repositories.md`
- `../../../modules/workspace-flow/aggregates.md`
````

## File: modules/workspace-flow/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-flow

> **範圍：** 僅限 `modules/workspace-flow/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 任務 | Task | 可追蹤的工作單元，有狀態機與負責人 |
| 任務狀態 | TaskStatus | `draft \| in_progress \| qa \| acceptance \| accepted \| archived` |
| 問題 | Issue | 問題追蹤記錄（Bug / 需求問題） |
| 問題狀態 | IssueStatus | `open \| investigating \| fixing \| retest \| resolved \| closed` |
| 發票 | Invoice | 財務發票記錄 |
| 發票狀態 | InvoiceStatus | `draft \| submitted \| finance_review \| approved \| paid \| closed` |
| 物化任務 | MaterializedTask | 從 `knowledge.page_approved` 事件自動建立的任務 |
| 來源參照 | sourceReference | 物化任務/發票的來源頁面引用（pageId, causationId） |
| 工作流程物化器 | KnowledgeToWorkflowMaterializer | 監聽 knowledge 事件並建立 Task/Invoice 的 Process Manager |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Task` | `TodoItem`, `WorkItem`, `Job` |
| `Issue` | `Bug`, `Ticket`, `Problem` |
| `Invoice` | `Bill`, `Receipt` |
| `MaterializedTask` | `ConvertedTask`, `AutoTask` |
````

## File: modules/workspace-flow/Workspace-Flow-File-Template.md
````markdown
## 1️⃣ 通用檔案頭模板

```ts
/**
 * @module <模組路徑>
 * @file <檔案名稱>
 * @description <檔案用途簡述>
 * @author <作者>
 * @created <YYYY-MM-DD>
 * @todo <未完成事項或提醒>
 */
```

* `<模組路徑>`: 如 `workspace-flow/domain/entities`
 * `<檔案名稱>`: 如 `modules/workspace-flow/domain/entities/Task.ts`
* `<檔案用途簡述>`: 簡單一句話說明這個檔案做什麼
* `@todo` 可以先留空

---

## 2️⃣ Class / Interface 範例模板

```ts
/**
 * Task Entity
 * @class Task
 * @description 代表一個任務及其狀態與行為
 */
export class Task {
    /**
     * 建立 Task 實例
     * @param {string} title - 任務標題
     * @param {TaskStatus} status - 任務狀態
     */
    constructor(public title: string, public status: TaskStatus) {}
    
    /**
     * 標記任務為完成
     */
    complete() {
        // TODO: 實作
    }
}
```

---

## 3️⃣ Function / Use Case 範例模板

```ts
/**
 * 建立新的 Task
 * @param {CreateTaskDto} dto - 新任務資料
 * @returns {Promise<Task>} 新建立的任務
 */
export async function createTask(dto: CreateTaskDto): Promise<Task> {
    // TODO: 實作
}
```

> 建議先把 **函數頭也加上 JSDoc**，即便目前沒有實作。好處：
>
> 1. 方便生成 API 文件。
> 2. 讓團隊知道參數與回傳型別。
> 3. 開發中 IDE 可以即時提示。

---

## 4️⃣ Mermaid 檔案模板

```mermaid
%% ======================================================
%% File: Workspace-Flow-Tree.mermaid
%% Module: workspace-flow
%% Description: 工作區任務流程結構樹
%% Created: 2026-03-25
%% ======================================================
flowchart TD
    %% TODO: 建立節點
```

---
````

## File: modules/workspace-scheduling/AGENT.md
````markdown
# AGENT.md — workspace-scheduling BC

## 模組定位

`workspace-scheduling` 是工作需求排程支援域，管理 WorkDemand 生命週期與日曆視圖。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `WorkDemand` | Demand、Request、Ticket、Requirement |
| `DemandStatus` | Status（單獨使用）、State |
| `DemandPriority` | Priority（單獨使用）、Urgency |
| `CalendarWidget` | Calendar、Scheduler |

## 狀態機（必須遵守）

```
DemandStatus: draft → open → in_progress → completed
DemandPriority: low | medium | high
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceSchedulingApi } from "@/modules/workspace-scheduling/api";
import type { WorkDemandDTO } from "@/modules/workspace-scheduling/api";
```

### ❌ 禁止
```typescript
import { WorkDemand } from "@/modules/workspace-scheduling/domain/types";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/workspace-scheduling/aggregates.md
````markdown
# Aggregates — workspace-scheduling

## 聚合根：WorkDemand

### 職責
代表一個工作需求記錄。管理需求的排程生命週期（draft → completed）。

### 生命週期狀態機
```
draft ──► open ──► in_progress ──► completed
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 需求主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `accountId` | `string` | 所屬帳戶 |
| `title` | `string` | 需求標題 |
| `description` | `string \| null` | 描述（可選） |
| `status` | `DemandStatus` | `draft \| open \| in_progress \| completed` |
| `priority` | `DemandPriority` | `low \| medium \| high` |
| `dueDate` | `string \| null` | 截止日期 ISO 8601 |
| `createdAt` | `string` | ISO 8601 |
| `updatedAt` | `string` | ISO 8601 |

### 不變數

- `title` 不可為空
- `completed` 狀態不可逆回 `draft`

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `DemandStatus` | `"draft" \| "open" \| "in_progress" \| "completed"` |
| `DemandPriority` | `"low" \| "medium" \| "high"` |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `DemandRepository` | `save()`, `findById()`, `listByWorkspace()`, `updateStatus()` |
````

## File: modules/workspace-scheduling/application-services.md
````markdown
# workspace-scheduling — Application Services

> **Canonical bounded context:** `workspace-scheduling`
> **模組路徑:** `modules/workspace-scheduling/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-scheduling` 的 application layer 服務與 use cases。內容與 `modules/workspace-scheduling/application/` 實作保持一致。

## Application Layer 職責

管理 WorkDemand 的排程生命週期、優先級與日曆視圖。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/work-demand.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-scheduling/README.md`
- 模組 AGENT：`../../../modules/workspace-scheduling/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-scheduling/application-services.md`
````

## File: modules/workspace-scheduling/context-map.md
````markdown
# Context Map — workspace-scheduling

## 上游（依賴）

### workspace → workspace-scheduling（Conformist）

- WorkDemand 隸屬 `workspaceId`
- `WorkspaceSchedulingTab` 接收 `workspaceId` 作為 props

### account → workspace-scheduling（Customer/Supplier）

- `AccountSchedulingView` 按 `accountId` 聚合跨工作區排程視圖

---

## 下游（被依賴）

### workspace-scheduling → notification（Published Language）

- 需求建立/狀態變更事件觸發通知

### workspace-scheduling → workspace-audit（Published Language）

- 排程操作供稽核紀錄消費

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → workspace-scheduling | workspace | workspace-scheduling | Conformist |
| account → workspace-scheduling | account | workspace-scheduling | Customer/Supplier |
| workspace-scheduling → notification | workspace-scheduling | notification | Published Language |
| workspace-scheduling → workspace-audit | workspace-scheduling | workspace-audit | Published Language |
````

## File: modules/workspace-scheduling/domain-events.md
````markdown
# Domain Events — workspace-scheduling

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-scheduling.demand_created` | WorkDemand 建立 | `demandId`, `workspaceId`, `title`, `priority`, `occurredAt` |
| `workspace-scheduling.demand_status_changed` | 狀態轉換 | `demandId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-scheduling.demand_completed` | WorkDemand 完成 | `demandId`, `workspaceId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `workspace-flow` | `workspace-flow.task_created` | 同步相關 WorkDemand 的排程狀態（可選） |

## 消費 workspace-scheduling 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `notification` | `workspace-scheduling.demand_created` | 通知相關成員 |
| `workspace-audit` | 所有狀態變更事件 | 記錄排程稽核軌跡 |
````

## File: modules/workspace-scheduling/domain-services.md
````markdown
# workspace-scheduling — Domain Services

> **Canonical bounded context:** `workspace-scheduling`
> **模組路徑:** `modules/workspace-scheduling/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-scheduling` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-scheduling/domain-services.md`
- `../../../modules/workspace-scheduling/aggregates.md`
````

## File: modules/workspace-scheduling/README.md
````markdown
# workspace-scheduling — 工作區排程上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-scheduling/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-scheduling` 讓知識與流程成果進一步進入時間與容量管理，將工作需求落入日曆、截止與排程視角。它支援團隊把抽象工作轉成可安排的協作負載。

## 主要職責

| 能力 | 說明 |
|---|---|
| 需求排程 | 建立與管理 WorkDemand 的狀態生命週期 |
| 時間視圖 | 提供日曆、截止與安排視角 |
| 容量協調 | 讓工作需求能與流程與工作區情境一起被安排 |

## 與其他 Bounded Context 協作

- `workspace-flow` 可作為排程需求來源。
- `workspace` 提供排程歸屬與成員範圍。

## 核心聚合 / 核心概念

- **`WorkDemand`**
- **`ScheduleWindow`**
- **`CapacityAllocation`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/workspace-scheduling/repositories.md
````markdown
# workspace-scheduling — Repositories

> **Canonical bounded context:** `workspace-scheduling`
> **模組路徑:** `modules/workspace-scheduling/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-scheduling` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- 目前沒有對應檔案。

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseDemandRepository.ts`
- `infrastructure/mock-demand-repository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-scheduling/repositories.md`
- `../../../modules/workspace-scheduling/aggregates.md`
````

## File: modules/workspace-scheduling/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-scheduling

> **範圍：** 僅限 `modules/workspace-scheduling/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作需求 | WorkDemand | 一個已排程或待排程的工作請求，含標題、截止日期與優先級 |
| 需求狀態 | DemandStatus | WorkDemand 的生命週期狀態：`draft \| open \| in_progress \| completed` |
| 需求優先級 | DemandPriority | 工作緊急程度：`low \| medium \| high` |
| 日曆控件 | CalendarWidget | 顯示工作需求排程的日曆 UI 元件 |
| 帳戶排程視圖 | AccountSchedulingView | 跨工作區的帳戶級別排程總覽頁面 |

## 狀態標籤（顯示文字）

| 狀態 | 中文標籤 |
|------|---------|
| `draft` | 草稿 |
| `open` | 待處理 |
| `in_progress` | 進行中 |
| `completed` | 已完成 |
| `low` | 低 |
| `medium` | 中 |
| `high` | 高 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `WorkDemand` | `Demand`, `Request`, `Ticket` |
| `DemandStatus` | `Status`, `WorkStatus` |
````

## File: PERMISSIONS.md
````markdown
# Permissions

This repository currently documents RBAC and permission-related behavior in the shared system reference instead of a standalone permissions handbook.

## Canonical references

- [`docs/reference/specification/system-overview.md`](docs/reference/specification/system-overview.md) — system-level RBAC overview
- [`docs/guides/how-to/ui-ux/information-architecture.md`](docs/guides/how-to/ui-ux/information-architecture.md) — current permissions-related route surfaces

Update this file if the project later restores a dedicated permissions reference.
````

## File: py_fn/README.md
````markdown
# py_fn 架構規範（路徑級依賴版）

這份規範重點是「看完整路徑判斷依賴」，不是看資料夾名稱。
例如 services 這個名字在 application 和 domain 都存在，但它們是不同層，規則不同。

## 1. 全域依賴方向

```text
interface -> application -> domain
infrastructure -> application -> domain
app -> interface / application / infrastructure / core
core -> all layers
domain -> only core
```

## 2. 目錄基準（含子資料夾）

```text
py_fn/src
├─ app
│  ├─ config
│  ├─ bootstrap
│  ├─ container
│  └─ settings
├─ application
│  ├─ use_cases
│  ├─ dto
│  ├─ services
│  ├─ ports
│  │  ├─ input
│  │  └─ output
│  └─ mappers
├─ domain
│  ├─ entities
│  ├─ value_objects
│  ├─ repositories
│  ├─ services
│  ├─ events
│  └─ exceptions
├─ infrastructure
│  ├─ cache
│  ├─ audit
│  ├─ persistence
│  │  ├─ firestore
│  │  ├─ storage
│  │  └─ vector
│  ├─ external
│  │  ├─ openai
│  │  ├─ genkit
│  │  └─ http
│  ├─ repositories
│  ├─ config
│  └─ logging
├─ interface
│  ├─ controllers
│  ├─ middleware
│  ├─ handlers
│  ├─ schemas
│  └─ routes
└─ core
   ├─ utils
   ├─ types
   ├─ constants
   ├─ exceptions
   └─ security
```

## 3. 各層職責摘要

### app
- 啟動、組裝、注入。
- 這一層可以依賴所有層，但不承載核心業務規則。

### application
- 放 use case、application service、ports、DTO、mappers。
- 負責流程編排，不直接依賴 infrastructure 實作。

### domain
- 放 entities、value objects、repositories 介面、domain services、events、exceptions。
- 是最核心的層，必須保持純淨。

### infrastructure
- 放 Firestore、Storage、Vector、外部 API、repository implementation。
- 只負責技術實作，不主導業務流程。

### interface
- 放 controllers、handlers、routes、schemas、middleware。
- 接外部請求、驗證輸入、呼叫 use case。

### core
- 放所有層可共用的 utils、types、constants、exceptions、security。
- core 本身不依賴任何外層。

## 4.1 值物件與 DTO 規劃

### 應放在 domain/value_objects
- 純資料語意、無基礎設施細節、可被多個 use case 重用。
- 例如：`RagQueryInput`、`RagCitation`、`RagQueryResult`。

### 應放在 application/dto
- 某個 use case 的輸入/輸出模型。
- 例如：`RagIngestionResult` 這種 use case 輸出摘要。

### 不應放進 domain/value_objects
- 外部服務供應商回傳模型。
- 例如：`ParsedDocument` 屬於 Document AI adapter 的回傳型別，保留在 infrastructure/external。

### 目前 py_fn 的落點範例
- `domain/value_objects/rag.py`: `RagQueryInput`, `RagCitation`, `RagQueryResult`
- `domain/repositories/rag.py`: `RagQueryGateway`, `RagIngestionGateway`, `DocumentPipelineGateway`
- `application/dto/rag.py`: `RagIngestionResult`
- `infrastructure/external/documentai/client.py`: `ParsedDocument`

## 4.2 同名資料夾的判讀規則

- services 只看名稱會誤判，必須看完整路徑
       - domain/services 是核心業務規則
       - application/services 是應用層編排
       - infrastructure/services 若存在，只能是技術 adapter；若可拆回更明確目錄，優先拆回 cache / audit / external / persistence
- repositories 也一樣
       - domain/repositories 是介面（contracts）
       - infrastructure/repositories 是實作（implementations）
- config 也一樣
       - app/config 是啟動與組裝配置
       - infrastructure/config 是技術配置
       - core/constants 才是跨層可共用常量

## 5. 路徑級依賴矩陣（最重要）

| From 路徑 | Allowed To Import |
| --- | --- |
| interface/routes | interface/controllers, interface/handlers, core |
| interface/controllers | application/use_cases, application/dto, domain, core |
| interface/handlers | application/use_cases, application/ports/input, core |
| interface/middleware | core |
| interface/schemas | core, 同層 schema 模組 |
| application/use_cases | domain, application/ports/output, application/dto, core |
| application/services | domain, application/ports/output, core |
| application/mappers | application/dto, domain, core |
| application/ports/input | domain, core |
| application/ports/output | domain, core |
| domain/entities | domain/value_objects, core |
| domain/value_objects | core |
| domain/services | domain/entities, domain/value_objects, domain/repositories, core |
| domain/repositories | domain/entities, domain/value_objects, core |
| domain/events | domain/entities, core |
| domain/exceptions | core |
| infrastructure/repositories | domain/repositories, domain/entities, infrastructure/persistence, core |
| infrastructure/cache | infrastructure/external, core |
| infrastructure/audit | infrastructure/external, core |
| infrastructure/persistence | domain/entities, domain/value_objects, core |
| infrastructure/external | application/ports/output, domain, core |
| infrastructure/config | core |
| infrastructure/logging | core |
| app/bootstrap | app/config, app/container, infrastructure, application, interface, core |
| app/container | infrastructure, application, domain, core |
| app/settings | core |
| core/* | 不可依賴任何外層 |

## 6. 明確禁止規則

- domain 不可 import application/interface/infrastructure/app
- application 不可 import infrastructure 實作
- interface 不可直接 import infrastructure（除非經 app 組裝注入後由 application port 提供）
- infrastructure 不可主導業務流程（流程應在 application/use_cases）

## 7. 標準依賴流

```text
route -> controller/handler -> use case -> domain -> repository interface
                                                     ^
                                                     |
                           repository implementation (infrastructure)
```

## 8. import 範例

### interface controller

```python
from application.use_cases.create_user import CreateUserUseCase
from interface.schemas.user_schema import CreateUserRequest
```

### application use case

```python
from domain.repositories.user_repository import UserRepository
from domain.entities.user import User
```

### infrastructure repository implementation

```python
from domain.repositories.user_repository import UserRepository
from infrastructure.persistence.firestore.client import FirestoreClient
```

### app container

```python
from infrastructure.repositories.firestore_user_repository import FirestoreUserRepository
from application.use_cases.create_user import CreateUserUseCase
```

## 9. PR 檢查清單

- 是否用完整路徑判讀層級，而不是只看資料夾名稱
- domain 是否只依賴 core
- use case 是否只依賴抽象（ports/repository interface）
- infrastructure 是否只做技術實作
- app 是否是唯一組裝與注入入口

## 10. 附錄 A：快速記憶版

如果只想快速判斷，先記這張：

```text
Controller/Handler -> UseCase -> Domain -> Repository Interface
                                                                         ^
                                                                         |
                                                   Repository Implementation
                                                                         |
                                                                Database / API
```

對應路徑：

```text
interface/controllers or interface/handlers
application/use_cases
domain/entities or domain/services
domain/repositories
infrastructure/repositories
infrastructure/persistence or infrastructure/external
```

## 11. 附錄 B：高階流程圖

```text
HTTP Request
       -> interface (controller / handler)
       -> application (use case)
       -> domain (entity / service / repository interface)
       -> infrastructure (Firestore / Vector / API implementation)
```

## 12. 附錄 C：典型誤判案例

### services 同名但不同層
- `application/services/*` 可以編排流程，但不應放純領域規則。
- `domain/services/*` 才是純領域規則。

### repositories 同名但不同性質
- `domain/repositories/*` 是介面。
- `infrastructure/repositories/*` 是實作。

### config 同名但職責不同
- `app/config/*` 面向啟動與組裝。
- `infrastructure/config/*` 面向技術設定。
- 可跨層重用的常量優先放 `core/constants/*`。

## 13. 一句話總結

看完整路徑判斷層級，不看資料夾名稱猜責任。
````

## File: README.md
````markdown
# Xuanwu App

Xuanwu is a personal- and organization-oriented Knowledge Platform. Its product goal is to bring documents, notes, knowledge pages, knowledge-base articles, structured data, and external sources into one governable workspace system so knowledge can be preserved, verified, retrieved, reasoned over, and turned into executable work.

The system is built as a modular monolith with Module-Driven Domain Design. `knowledge` and `knowledge-base` are the core domains: `knowledge` owns the Notion-like content lifecycle, while `knowledge-base` owns organization-grade wiki, SOP, and article assets. `workspace` and `organization` provide collaboration and governance boundaries. `source` plus integration adapters form the anti-corruption boundary for external content. `ai`, `search`, and `notebook` provide ingestion, retrieval, reasoning, and research workflows on top of that knowledge base.

## Product Capabilities

- Knowledge pages, block-based editing, versioning, and approval
- Organizational knowledge-base articles, categories, and verification workflows
- Structured databases with records, schema, and multi-view exploration
- External document/source ingestion with workspace-scoped governance
- Ask/Cite, retrieval, summarization, and notebook-style knowledge generation
- Workspace, organization, audit, feed, workflow, and scheduling support for execution

## Architecture At A Glance

- Architecture style: Modular Monolith + Module-Driven Domain Design
- Boundary model: bounded contexts with local ubiquitous language and domain model ownership
- Cross-context collaboration: public `api/` surfaces and published domain events
- Runtime split:
	- `Next.js` owns UI, auth/session orchestration, route composition, and server-side application flow
	- `py_fn/` owns parsing, chunking, embedding, and worker-style ingestion tasks
- Anti-corruption boundary: external systems are translated through source workflows and infrastructure adapters before entering core domains

## Current Domain Shape

- Core domains: `knowledge`, `knowledge-base`
- Supporting domains: `ai`, `knowledge-collaboration`, `knowledge-database`, `notebook`, `search`, `source`, `workspace-audit`, `workspace-feed`, `workspace-flow`, `workspace-scheduling`
- Generic domains: `identity`, `account`, `organization`, `workspace`, `notification`
- Shared kernel: `shared`

See [docs/ddd/subdomains.md](docs/ddd/subdomains.md) and [docs/ddd/bounded-contexts.md](docs/ddd/bounded-contexts.md) for the canonical strategic map.

## Documentation Entry Points

- [docs/getting-started.md](docs/getting-started.md): local setup and validation flow
- [docs/ddd/subdomains.md](docs/ddd/subdomains.md): strategic subdomain classification
- [docs/ddd/bounded-contexts.md](docs/ddd/bounded-contexts.md): bounded-context inventory
- [docs/reference/specification/system-overview.md](docs/reference/specification/system-overview.md): system overview specification
- [AGENTS.md](AGENTS.md): repository-wide operating rules and validation commands
- [.github/copilot-instructions.md](.github/copilot-instructions.md): Copilot workspace baseline

## Development Quick Start

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run lint
npm run build
cd py_fn && python -m compileall -q .
cd py_fn && python -m pytest tests/ -v
```

## Repository Notes

- `modules/` contains bounded contexts and their local markdown reference sets
- `docs/ddd/` contains strategic DDD entrypoints
- `.github/` contains Copilot customizations, instructions, and repomix-generated skills
- `docs/swarm.md`, `docs/beads.md`, and related files document internal AI delivery workflow, not the product surface itself
````

## File: SPEC-WORKFLOW.md
````markdown
# Spec-Driven Development Workflow

This repository does not currently keep a standalone long-form spec workflow guide.

## Use these references instead

- [`docs/swarm.md`](docs/swarm.md) — planning, execution, and review flow
- [`docs/handoffs.md`](docs/handoffs.md) — handoff chain between planning, implementation, and review
- [`docs/reference/specification/system-overview.md`](docs/reference/specification/system-overview.md) — baseline product and system specification context

If the team revives a dedicated spec workflow document, update this file to point to that canonical source.
````

## File: .github/copilot-instructions.md
````markdown
---
applyTo: **
description: Xuanwu Copilot Workspace Instructions
name: Xuanwu Copilot Workspace Instructions
---

# Xuanwu Copilot Workspace Instructions

Always-on workspace guidance for Copilot. Keep this file short, stable, and repository-wide. Put file-type, framework, or task-specific rules in [.github/instructions](./instructions), reusable workflows in prompts, and tool- or role-specific behavior in skills.

## Purpose

- Xuanwu is a personal- and organization-oriented Knowledge Platform built as a modular monolith with MDDD boundaries.
- Align Copilot with Xuanwu architecture, validation flow, and delivery boundaries.
- Keep always-on instructions low-noise so scoped `.instructions.md` files can do the detailed work.
- Prefer references to canonical docs over repeated policy text.

## Non-Negotiable Session Contract

- Start every conversation with Serena MCP. If Serena tools are unavailable, bootstrap Serena first, then continue.
- Serena owns orchestration. Serena understands the request, gathers targeted context, decides whether subagents are needed, and remains responsible for final synthesis.
- If confidence in any library API, framework behavior, or config schema detail is below 99.99%, query Context7 before writing, generating, or suggesting code.
- Repository orchestration memory and index updates belong to Serena. Use Serena tools for project memory/index work; do not treat direct edits under `.serena/` or non-Serena project-memory paths as authoritative replacements.

## Authoritative Sources

Read these in order before making non-trivial decisions:

1. [terminology-glossary.md](./terminology-glossary.md) for canonical terminology routing.
2. [AGENTS.md](../AGENTS.md) for repository-wide rules and validation commands.
3. [CLAUDE.md](../CLAUDE.md) for cross-agent compatibility.
4. [agents/knowledge-base.md](./agents/knowledge-base.md) for module ownership, aliases, and MDDD boundaries.
5. [agents/commands.md](./agents/commands.md) for build, lint, test, and deployment commands.
6. [CONTRIBUTING.md](../CONTRIBUTING.md) for review scope and evidence expectations.

## DDD Reference Authority

DDD root maps are owned by `docs/ddd/`. Bounded-context reference sets currently live in `modules/<context>/` and should be read from there unless a future consolidation change explicitly moves ownership.

| Query | Canonical Document |
|-------|-------------------|
| Strategic subdomain classification | [`docs/ddd/subdomains.md`](../docs/ddd/subdomains.md) |
| Bounded Context boundaries / module map | [`docs/ddd/bounded-contexts.md`](../docs/ddd/bounded-contexts.md) |
| Context terminology | `modules/<context>/ubiquitous-language.md` |
| Context aggregates / entities / value objects | `modules/<context>/aggregates.md` |
| Context domain events | `modules/<context>/domain-events.md` |
| Context map | `modules/<context>/context-map.md` |
| Context repositories | `modules/<context>/repositories.md` |
| Context application services | `modules/<context>/application-services.md` |
| Context domain services | `modules/<context>/domain-services.md` |

**Rule**: `.github/instructions/` files contain **behavioral constraints** (what Copilot must do). `docs/ddd/` contains strategic DDD routing, and `modules/<context>/` contains the current bounded-context detail set. Link instead of copying.

## Workspace-Wide Operating Rules

- Plan first for cross-module, cross-runtime, schema, or contract-governed changes.
- Treat the approved plan as the execution contract; stay within scope and update docs when boundaries or public APIs change.
- Search and read before editing. Prefer existing instructions, prompts, and skills over ad hoc restatement.
- Keep changes minimal, local, and boundary-safe.

## Architecture Guardrails

- Follow Module-Driven Domain Design: each `modules/<context>/` directory is an isolated bounded context.
- Cross-module access must go through the target module's `api/` boundary only.
- Keep dependency direction explicit: `interfaces/` -> `application/` -> `domain/` <- `infrastructure/`.
- Keep business logic in `domain/` and `application/`; keep UI, transport, and composition in `interfaces/` and `app/`.
- Use package aliases such as `@shared-*`, `@ui-*`, `@lib-*`, and `@integration-*`; do not introduce legacy `@/shared/*`, `@/libs/*`, or similar paths.
- Preserve the runtime split: Next.js owns browser-facing UX, auth/session, orchestration, and streaming; `py_fn/` owns ingestion, parsing, chunking, embedding, and worker jobs.

## Copilot Customization Design Rules

- Keep this file concise and self-contained; prefer short directive statements over long tutorial prose.
- Put scoped guidance in focused `.instructions.md` files with narrow `applyTo` patterns.
- Reuse canonical references instead of duplicating the same rules across instructions, prompts, agents, and skills.
- Do not turn temporary implementation details, current module counts, or migration mappings into permanent global rules.
- When customizations appear ignored, verify them with Chat customization diagnostics before changing the file structure.

## Serena MCP

Serena MCP is **mandatory for every session**. There are no exceptions.

Serena is the orchestration lead for every conversation. Start with Serena to understand the request, gather only the needed context, and decide whether focused subagents are required. Subagents assist with exploration or execution, but Serena remains responsible for task framing, delegation, and final synthesis.

### Session-Start Protocol (Required)

1. Bootstrap Serena MCP server if tools are not available:
   ```bash
   uvx --from git+https://github.com/oraios/serena serena start-mcp-server
   ```
2. Activate the `xuanwu-app` project before any read or write operation.
3. List and read relevant memories before starting any non-trivial task.

### Session-End Protocol (Required)

After every meaningful phase (plan → impl → review → qa) and before any handoff:

1. Write a phase-end memory update using Serena memory tools.
2. Trigger an index update if files were added, renamed, or removed.

See the phase-end template in [skills/serena-mcp/SKILL.md](skills/serena-mcp/SKILL.md).

### Hard Prohibitions

- **NEVER** edit any file inside `.serena/` directly with file tools (`create`, `edit`, `write`, etc.).
- **NEVER** delete or rename `.serena/` entries outside of Serena tooling.
- **NEVER** use non-Serena file edits as a substitute for Serena project memory or index updates.
- If the Serena write tool is unavailable, report blocked and halt — do **not** bypass with direct file writes.
- Index and memory changes are only valid when made through Serena tools.

## Context7 Documentation Query

When confidence in any library API, framework behavior, or config schema detail is **below 99.99%**, you **must** query official documentation through upstash/context7 before writing, generating, or suggesting code.

### Trigger Conditions

Any of the following require a context7 lookup before proceeding:

- API signature, parameter name, or return type is uncertain.
- Version-specific behavior or breaking-change risk exists.
- Config schema details (Next.js, Firebase, Zod, XState, etc.) are not fully recalled.
- A library was recently updated and you are unsure of the current behavior.

### Required Steps

1. Call `resolve-library-id` with the library name to get a Context7-compatible ID.
2. Call `get-library-docs` with that ID and a focused `topic` to retrieve official docs.
3. Use the retrieved docs as the authoritative source; do **not** rely on training-time recall alone.

### Guardrails

- Do not skip the lookup by assuming training data is current — default to querying.
- Do not pass arbitrary strings as the library ID; always resolve it first via `resolve-library-id`.
- Keep queries focused: one `topic` per call rather than fetching the entire doc set.
- See [skills/context7/SKILL.md](skills/context7/SKILL.md) for the full workflow.

## Claude Compatibility Layer

`.claude/` is a supported Claude Code compatibility surface.

- Use `.claude/settings.json` when you need Claude hook lifecycle, permissions, or project MCP behavior.
- Use `.claude/rules/tech-strategy.md` when you need Claude-side technology-policy context.
- Use `.claude/hooks/*` when a task touches Claude-specific guards, validation, or session automation.
- Keep `.github/*` as the primary Copilot governance surface; use `.claude/` to preserve or understand Claude compatibility, not as a parallel source of repository-wide truth.

## Skill And Agent Routing

- Use [skills/xuanwu-app-skill/SKILL.md](skills/xuanwu-app-skill/SKILL.md) when repository structure or implementation location matters.
- Use [skills/xuanwu-app-markdown-skill/SKILL.md](skills/xuanwu-app-markdown-skill/SKILL.md) when markdown documentation structure or wording matters.
- Use [skills/alistair-cockburn/SKILL.md](skills/alistair-cockburn/SKILL.md) when designing module boundaries, writing use cases, evaluating methodology fit, or applying hexagonal architecture and Heart of Agile principles.
- Use boundary or contract skills only when the task actually crosses those concerns.
- Keep prompts, instructions, agents, and skills complementary. Do not duplicate the same policy in multiple layers unless the scope is different.

## Validation

- Run the matching validation for changed files by using [agents/commands.md](./agents/commands.md).
- Do not close work until required lint, build, test, and documentation updates are complete.

## Terminology

- Terminology routing is governed by [terminology-glossary.md](./terminology-glossary.md).
- Treat glossary terminology as canonical naming and vocabulary authority.
- Do not introduce new terms if an equivalent glossary term already exists.
- When multiple names exist, normalize to the glossary term before implementation.
- Use glossary-aligned wording for prompts, instructions, agents, skills, and DDD docs.
````

## File: .github/prompts/serena-ddd-refactor.prompt.md
````markdown
---

name: serena-ddd-refactor
description: Scan large files, refactor to follow Vaughn Vernon Implementing Domain-Driven Design without breaking functionality, then update Serena MCP memory and index.
agent: copilot
argument-hint: <project-root>
-----------------------------

# Serena DDD Refactor Prompt

## Objective

Identify oversized files in the project, verify whether they violate Domain-Driven Design layering principles from Vaughn Vernon, refactor them without breaking functionality, then update Serena MCP memory and symbol index.

---

# Step 1 — Start Serena MCP

If Serena MCP is not running:

```
serena start-mcp-server
```

Activate project and load memory:

```
serena
#use skill serena-mcp > activate_project
list_memories
read_memory
#use skill xuanwu-app-markdown-skill
#use skill xuanwu-app-skill
#use skill context7
```

---

# Step 2 — Find Largest Files

Run PowerShell to locate largest files:

```
$folders = @("app","modules","packages","py_fn\src")

Get-ChildItem $folders -Recurse -File |
Where-Object { $_.FullName -notmatch "node_modules|\.next|\.git|dist|build|__pycache__" } |
Sort-Object Length -Descending |
Select-Object -First 33 FullName, Length
```

Focus refactoring on these large files first.

---

# Step 3 — DDD Refactor Rules (Vaughn Vernon)

Refactor files that violate these rules:

## Application Service must NOT contain

* Business logic
* Repository query logic
* DTO mapping logic
* Entity creation logic
* Infrastructure calls

Application Service should only:

```
Receive request → Load Aggregate → Call Domain → Save Aggregate → Publish Event
```

## Aggregate must NOT contain

* Repository
* Firebase / Database
* HTTP / API calls
* UI / DTO
* Infrastructure logic

Aggregate should contain only:

```
Entities
Value Objects
Domain Logic
Domain Events
```

## Repository must NOT contain

* Business logic
* Domain rules
* Complex query logic
* Application logic

Repository should only:

```
Save
Get
Delete
```

## Domain Service usage

Create Domain Service only when:

* Logic does not belong to a single Entity
* Requires multiple Aggregates
* Pure business logic
* No infrastructure dependency

---

# Step 4 — File Splitting Structure

When splitting large files, use this structure:

```
domain/
  aggregates/
  entities/
  value-objects/
  domain-events/
  domain-services/

application/
  services/
  commands/
  queries/

infrastructure/
  repositories/
  firebase/
  external-services/

interface/
  controllers/
  dto/
  routes/
```

---

# Step 5 — File Size Guidelines

Recommended file sizes:

```
Entity < 150 lines
Aggregate < 300 lines
Application Service < 150 lines
Repository < 120 lines
Controller < 120 lines
Domain Service < 150 lines
```

Files exceeding ~300 lines likely indicate boundary or responsibility problems.

---

# Step 6 — After Refactor Update Serena

After modifications:

```
#sym:update_memory
#sym:prune_index
```

Purpose:

```
update_memory → sync new architecture and symbols
prune_index → remove outdated symbols
```

---

# Full Workflow Checklist

```
1. serena start-mcp-server
2. activate_project
3. list_memories
4. read_memory
5. Find largest files
6. Check DDD violations
7. Refactor and split files
8. Ensure functionality still works
9. #sym:update_memory
10. #sym:prune_index
```

---

# Core Principle

DDD refactoring goal is not smaller files, but correct boundaries:

```
Controller → Application Service → Domain → Repository
```

Domain layer must not depend on:

```
Database
Firebase
HTTP
UI
Framework
```
````

## File: features/README.md
````markdown
---
name: features-layer
description: Feature（Use Case）層設計規範，負責跨 Bounded Context 的協調與流程編排
---

# 📦 Features Layer（Use Case Orchestration）

## 🎯 目的

`features/` 是系統的 **Use Case 層（應用層）**，負責：

- 將多個 `modules/（Bounded Context）` 串接成「一個完整功能」
- 作為 **唯一的功能入口（Single Entry Point）**
- 控制流程（Flow orchestration）
- 隔離 UI 與 Domain 的耦合

---

## 🧠 核心概念

| 概念 | 說明 |
|------|------|
| Feature | 使用者可感知的功能（Use Case） |
| Orchestration | 跨多個 modules 的流程編排 |
| Application Layer | 不包含業務規則，只負責調度 |
| Stateless | 不持有狀態，僅控制流程 |

---

## 📁 結構設計

```bash
/features
  /<feature-name>
    usecase.ts        # 核心流程（唯一入口）
    route.ts          # API / Server Action（Next.js）
    schema.ts         # input/output validation（zod）
    dto.ts            # 資料轉換（可選）
    ui/               # UI（shadcn）
      *.tsx
    hooks/            # React hooks（可選）
    state/            # client state（可選）
````

## File: modules/knowledge/context-map.md
````markdown
# Context Map — knowledge

## 上游（依賴）

### identity → knowledge（Customer/Supplier）
- 頁面操作驗證 `createdByUserId`

### workspace → knowledge（Customer/Supplier）
- 頁面隸屬於 `workspaceId`，需驗證工作區歸屬
- `workspace` 供應 active workspace context；若要看 account / organization 跨工作區總覽，必須進入顯式 summary mode，而不是省略 workspaceId

---

## 下游（被依賴）

### knowledge → workspace-flow（Published Language / Customer-Supplier）

**這是平台最重要的跨 BC 整合點。**

- 整合方式：`knowledge.page_approved` 領域事件（Published Language）
- `workspace-flow` 的 `KnowledgeToWorkflowMaterializer` Process Manager 訂閱此事件
- 從 `extractedTasks[]` 建立 Task，從 `extractedInvoices[]` 建立 Invoice

```
knowledge ─── knowledge.page_approved ───► workspace-flow
                                          (KnowledgeToWorkflowMaterializer)
```

### knowledge → ai（Customer/Supplier）

- `knowledge.page_approved` 觸發 `ai` 域的 IngestionJob
- RAG 攝入管線的起點

### knowledge → knowledge-database（Open Host Service / D1）

- `knowledge-database` 擁有 `spaceType="database"` 的完整 Schema + Record + View 能力
- `knowledge` 透過 `KnowledgeCollection.id` 作為 opaque reference，不擁有 database 結構化欄位
- 整合方式：`knowledge-database` 以 OHS 開放 DatabaseId API

```
knowledge ──(KnowledgeCollection.id)──► knowledge-database
                                        (Database / Record / View 管理)
```

### knowledge → knowledge-base（Customer/Supplier / D3 Promote）

- Promote 協議：使用者可將 `KnowledgePage` 提升為 `Article`（跨 BC 操作）
- `knowledge-base` 擁有 Promote 協議的業務規則（決定是否可提升、建立 Article）
- `knowledge` 發出 `knowledge.page_promoted` 事件，`knowledge-base` 訂閱後建立 Article

```
knowledge ─── knowledge.page_promoted ───► knowledge-base
                                           (Article 建立，Promote 協議完成)
```

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → knowledge | identity | knowledge | Customer/Supplier |
| workspace → knowledge | workspace | knowledge | Customer/Supplier |
| knowledge → workspace-flow | knowledge | workspace-flow | Published Language (Events) |
| knowledge → ai | knowledge | ai | Customer/Supplier（Events） |
| knowledge → knowledge-database | knowledge | knowledge-database | Open Host Service |
| knowledge → knowledge-base | knowledge | knowledge-base | Customer/Supplier（Promote Events） |
````

## File: modules/knowledge/ubiquitous-language.md
````markdown
# Ubiquitous Language — knowledge

> **範圍：** 僅限 `modules/knowledge/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 知識頁面 | KnowledgePage | 核心知識單元，含 title、parentPageId、blockIds | `domain/entities/knowledge-page.entity.ts` |
| 內容區塊 | ContentBlock | 頁面內的原子內容單元（id、pageId、blockType、content、order） | `domain/entities/content-block.entity.ts` |
| 區塊類型 | BlockType | `text \| heading-1 \| heading-2 \| image \| code \| bullet-list \| ...` | `domain/entities/block.ts` |
| 版本快照 | ContentVersion | 頁面的歷史快照（snapshotBlocks、editSummary、authorId） | `domain/entities/content-version.entity.ts` |
| 頁面審批 | PageApproval | 使用者核准 AI 生成草稿的動作，觸發 `knowledge.page_approved` | — |
| 抽取任務 | ExtractedTask | 從頁面內容提取的任務定義（title、dueDate、description） | `domain/events/knowledge.events.ts` |
| 抽取發票 | ExtractedInvoice | 從頁面內容提取的發票定義（amount、description、currency） | `domain/events/knowledge.events.ts` |
| 知識資料庫 | KnowledgeCollection (database) | spaceType="database" 的集合，帶欄位 Schema，對應 Notion Database | `domain/entities/knowledge-collection.entity.ts` |
| 知識庫（Wiki Space） | WikiSpace / KnowledgeCollection (wiki) | spaceType="wiki" 的集合，啟用頁面驗證與所有權，對應 Notion Wiki | `domain/entities/knowledge-collection.entity.ts` |
| 集合空間類型 | CollectionSpaceType | `"database" \| "wiki"` — 區分資料庫與知識庫空間 | `domain/entities/knowledge-collection.entity.ts` |
| 頁面驗證狀態 | PageVerificationState | `"verified" \| "needs_review"` — 頁面在 Wiki Space 中的內容準確性狀態 | `domain/entities/knowledge-page.entity.ts` |
| 頁面負責人 | PageOwner (`ownerId`) | 負責確保頁面內容準確與更新的指定使用者 | `domain/entities/knowledge-page.entity.ts` |
| 工作區預設視角 | Workspace-first Scope | 日常頁面樹、建立與整理流程預設綁定 active workspace 的規則 | `app/(shell)/knowledge/pages/page.tsx` |
| 帳戶總覽模式 | Account Summary Mode | 顯式跨工作區總覽模式，只用於 summary，不作為隱含預設建立入口 | `app/(shell)/knowledge/pages/page.tsx` |
| 已驗證 | verified | `verificationState="verified"` — 頁面內容已確認準確 | — |
| 待審閱 | needs_review | `verificationState="needs_review"` — 頁面內容需要檢視與確認 | — |
| 頁面提升 | Promote（Page → Article） | 將 `KnowledgePage` 提升為 `Article` 的跨 BC 協議；`knowledge` 執行驗證並發出 `knowledge.page_promoted`，`knowledge-base` 負責業務規則與 Article 建立 | — |

## 頁面生命周期操作（Page Lifecycle Actions）

以下為 `KnowledgePage` 允許的使用者操作。**預期使用的 Server Action** 與 **UI 顯示標籤**必須對齊。

| 操作 | Server Action | UI 標籤（中文） | 觸發事件 |
|------|--------------|----------------|----------|
| 在內部新增頁面 | `createKnowledgePage` | 在內部新增頁面 | `knowledge.page_created` |
| 重新命名 | `renameKnowledgePage` | 重新命名 | `knowledge.page_renamed` |
| 移動到 | `moveKnowledgePage` | 移動到 | `knowledge.page_moved` |
| 歸檔（移至垃圾桶） | `archiveKnowledgePage` | 移至垃圾桶 | `knowledge.page_archived` |
| 提升為文章 | `promoteKnowledgePage` | 提升為文章（→ knowledge-base Article） | `knowledge.page_promoted` |

> **術語對齊規則：** Domain 用 `archive`（歸檔）；UI 標籤為「移至垃圾桶」。兩者指同一操作（`status = "archived"`），不得在 domain 層使用 `trash`。

## 頁面操作選單（PageContextMenu）

`PageTreeView` 內每個頁面行 hover 時出現的 `…` 操作選單。此為 「頁面樹狀視圖」的 UI 互動模式。

| 選單項目 | 對應 Use Case | UI 互動 |
|------------|--------------|----------|
| 在內部新增頁面 | `createKnowledgePage` (parentPageId = 目前頁) | 應即修改名稱輸入框 |
| 重新命名 | `renameKnowledgePage` | 行內 inline 輸入框，Enter 確認 |
| 移動到 | `moveKnowledgePage` | 待實作 |
| 移至垃圾桶 | `archiveKnowledgePage` | 二次確認，成功後移除樹狀視圖該頁 |

## 頁面樹狀視圖（PageTreeView）

`modules/knowledge/interfaces/components/PageTreeView.tsx` 的 UI 層概念諍。

| 概念 | 說明 |
|------|------|
| 頁面樹狀視圖 | 對應 `KnowledgePage` 父子層級的可視化展示，層級通過 `parentPageId` 樹 |
| 層級展開 / 折疊 | 頁面節點 idle 狀態，預設展開層數 < 2 |
| hover 操作列 | 每行 hover 展現 `…`（操作選單）與 `+`（在內部新增頁面）按鈕 |
| inline rename | hover 選單內點後直接展現行內輸入框，不開 dialog |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `KnowledgePage` | `Page`, `Document`, `Note` |
| `ContentBlock` | `Block`, `Node`, `Element` |
| `ContentVersion` | `History`, `Snapshot`, `Revision` |
| `KnowledgeCollection` | `Database`, `Collection`, `Table`（不應直接暴露在 API 外） |
| `WikiSpace` | `KB`, `KnowledgeBase`（直接稱呼） |
| archive (在 UI 中) | `trash`, `delete`（在 domain 層不得使用 trash/delete 命名） |

> `WikiPage` 為 `wiki` BC 術語，不屬於 `knowledge` BC 通用語言。
> `WikiSpace` 在 `knowledge` BC 代表 `spaceType="wiki"` 的 `KnowledgeCollection`，與 `wiki` 模組（圖譜引擎）完全不同。
````

## File: modules/workspace/ports/README.md
````markdown
# workspace ports

此資料夾是 `workspace` bounded context 的顯式 ports 入口。

## 目的

- 集中列出 hexagonal architecture 的 port 介面（只有 interface/type，沒有實作）
- 讓 `ports/` 不再是空殼目錄
- 清楚區分 `ports`（抽象）與 `infrastructure`（adapter 實作）

## 交互順序（Runtime Flow）

1. Driver：UI / Server Action / 其他 bounded context 呼叫 `api/`
2. Driving Adapter：`interfaces/*` 把請求轉成 command/query
3. Application Use Case：協調流程與授權邊界
4. Domain Model：`Workspace` aggregate 與 value objects 套用 invariant
5. Driven Port：`ports/index.ts` 匯出的 repository/event publisher 介面
6. Driven Adapter：`infrastructure/*` 實作 port（Firebase / shared event bus）

## 依賴方向（Compile-time）

- `interfaces -> application -> domain`
- `infrastructure -> domain`（實作 ports）
- `domain` 不可反向依賴 `interfaces`、`application`、`infrastructure`
- `ports` 只匯出抽象，不可匯出 adapter 類別

## 目前 Port 清單

- `WorkspaceRepository`
- `WorkspaceCapabilityRepository`
- `WorkspaceAccessRepository`
- `WorkspaceLocationRepository`
- `WorkspaceQueryRepository`
- `WikiWorkspaceRepository`
- `WorkspaceDomainEventPublisher`
````

## File: .github/agents/commands.md
````markdown
# Build, Lint & Development Commands

## Development

- `npm run dev` — Start Next.js development server (App Router, port 3000)
- `npm run build` — Production build (Next.js + TypeScript type-check)
- `npm run start` — Start production server from build output

## Lint & Type Check

- `npm run lint` — Run ESLint (flat config, `eslint.config.mjs`)
- `npm run test` — Run Vitest unit tests
- TypeScript type-checking is included in `npm run build`

## Firebase Deployment

- `npm run deploy:firebase` — Deploy all Firebase resources
- `npm run deploy:firestore:indexes` — Deploy Firestore indexes only
- `npm run deploy:firestore:rules` — Deploy Firestore security rules only
- `npm run deploy:storage:rules` — Deploy Storage security rules only
- `npm run deploy:rules` — Deploy Firestore rules + Storage rules
- `npm run deploy:apphosting` — Deploy App Hosting configuration
- `npm run deploy:functions` — Deploy Cloud Functions (Python)
- `npm run deploy:functions:py-fn` — Deploy Python Cloud Functions only
- `npm run deploy:functions:all` — Deploy all Cloud Functions

## Repomix (AI Skill Generation)

- `npm run repomix:skill` — Generate a repomix skill from the full codebase
- `npm run repomix:remote` — Generate a skill from a remote GitHub repository
- `npm run repomix:local` — Generate a skill from a local directory

## Key Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js 16 App Router configuration |
| `tsconfig.json` | TypeScript config with `@alias` path mappings |
| `eslint.config.mjs` | ESLint flat config with package boundary enforcement |
| `tailwind.config.ts` | Tailwind CSS 4 configuration |
| `firebase.json` | Firebase project configuration |
| `firestore.rules` | Firestore security rules |
| `firestore.indexes.json` | Firestore composite indexes |
| `storage.rules` | Cloud Storage security rules |
| `components.json` | shadcn CLI configuration (aliases → `@ui-shadcn/*`) |
| `apphosting.yaml` | Firebase App Hosting configuration |

## Environment Setup

- **Node.js**: Version 24 required (see `engines` in `package.json`)
- **Package manager**: npm
- Install dependencies: `npm install`
- Python test dependencies: `python -m pip install -r py_fn/requirements-dev.txt`
- Firebase CLI: `npx firebase` (no global install required)
````

## File: AGENTS.md
````markdown
# Agent Guide — Xuanwu App

This file is the entry point for AI agents (GitHub Copilot, Claude, OpenCode, etc.) working in this repository.

## Development Status Workflow

Use the following status flow for issues, tasks, and features:

| Order | Status | Emoji | Description |
|------|--------|-------|-------------|
| 0 | Idea | 💡 | Initial idea or feature request |
| 1 | Backlog | 📥 | Stored in backlog, not scheduled |
| 2 | Planned | 📅 | Planned and scheduled |
| 3 | Designing | 🎨 | Architecture / UI / schema design |
| 4 | Ready | 🟢 | Ready for development |
| 5 | Developing | 🚧 | Active development |
| 6 | Midway | 🏗️ | Development partially completed |
| 7 | Testing | 🧪 | Testing / QA |
| 8 | Fixing | 🔧 | Bug fixing |
| 9 | Review | 🔍 | Code review / acceptance review |
|10 | Staging | 🚀 | Staging / pre-production |
|11 | Done | ✅ | Development completed |
|12 | Delivered | 📦 | Delivered / deployed to production |
|13 | Archived | 🗄️ | Archived / closed / inactive |

## Quick Start

1. Read [`.github/agents/README.md`](.github/agents/README.md) — rules index and overview
2. Read [`.github/agents/knowledge-base.md`](.github/agents/knowledge-base.md) — domain knowledge and module inventory
3. Read [`.github/agents/commands.md`](.github/agents/commands.md) — build, lint, deploy commands
4. Read [`.github/README.md`](.github/README.md) — customization index for agents, prompts, skills, and instructions

## Non-Negotiable Session Contract

- Start every conversation with Serena MCP. If Serena is unavailable, bootstrap it before continuing.
- Serena is the orchestration lead. Serena understands the request first and decides whether subagents are needed.
- If confidence in any library, framework, or config detail is below 99.99%, query Context7 before generating or recommending code.
- Repository orchestration memory and index updates must go through Serena tools; direct `.serena/` edits or non-Serena replacements are not authoritative.

## Orchestration Protocol

- Serena MCP is mandatory at the start of every conversation and acts as the orchestration lead.
- Serena understands the request first, reads relevant memory, gathers targeted context, and decides whether focused subagents are needed.
- Subagents assist with exploration or execution, but Serena remains responsible for delegation and final synthesis.
- If confidence in any library, framework, or config detail is below 99.99%, query Context7 before generating or recommending code.
- `.claude/` is a supported Claude Code compatibility surface. Consult `.claude/settings.json`, `.claude/rules/tech-strategy.md`, and `.claude/hooks/*` when maintaining Claude-specific workflow or compatibility, while treating `.github/*` as the primary Copilot rule tree.

## Key Rules

### Architecture

- Follow **Module-Driven Domain Design (MDDD)**: code belongs in `modules/<context>/`.
- Treat every `modules/<module-name>/` as an isolated bounded context.
- Cross-module interaction must go through `modules/<module-name>/api/` only.
- Dependency direction: `interfaces/ → application/ → domain/ ← infrastructure/`.
- `domain/` must stay framework-free (no Firebase SDK, React, HTTP clients).
- Keep boundaries explicit: business logic stays in `application/` + `domain/`, while UI/UX concerns stay in `interfaces/` and `app/` composition.
- Import shared code through `@alias` package aliases, never with relative paths across modules.

### Import Aliases

```ts
import type { CommandResult } from "@shared-types";
import { cn } from "@shared-utils";
import { Button } from "@ui-shadcn/ui/button";
import { getFirebaseFirestore } from "@integration-firebase";
```

Never use legacy paths: `@/shared/*`, `@/libs/*`, `@/infrastructure/*`, `@/ui/*`.

### Runtime Boundary

- **Next.js** owns browser-facing APIs, upload UX, auth/session, Server Actions, streaming AI responses.
- **`py_fn/`** owns ingestion, parsing, chunking, embedding, and background jobs.
- Do not add chat streaming or auth logic to `py_fn/`.

## Validation Commands

```bash
npm install          # Install dependencies
npm run lint         # ESLint (0 errors expected; pre-existing warnings are OK)
npm run test         # Vitest unit test baseline
npm run build        # Next.js production build + TypeScript type-check

# Python worker
cd py_fn && python -m pip install -r requirements-dev.txt
cd py_fn && python -m compileall -q .
cd py_fn && python -m pytest tests/ -v
```

## Common Patterns

### Server Action (write-side)

```ts
"use server";
export async function myAction(input: MyInput): Promise<CommandResult> {
  // validate → use case → return CommandResult
}
```

### Use Case

```ts
// modules/<context>/application/use-cases/MyUseCase.ts
export class MyUseCase {
  constructor(private readonly repo: MyRepository) {}
  async execute(input: MyInput): Promise<CommandResult> { ... }
}
```

### Repository

- Interface in `domain/repositories/`.
- Firebase implementation in `infrastructure/firebase/`.

## IDDD 領域驅動設計規範 (Implementing Domain-Driven Design)

本專案已導入 Vaughn Vernon《Implementing Domain-Driven Design》(IDDD) 規範，以確保 Copilot 生成的程式碼符合通用語言、限界上下文與事件驅動架構原則。

### DDD 審查 Agent

- **[Domain Architect](.github/agents/domain-architect.agent.md)** — IDDD 領域架構審查，負責確認聚合根設計、限界上下文邊界、通用語言一致性與領域事件規範。

### DDD 指令文件 (Instructions)

| 文件 | 用途 |
|------|------|
| [ubiquitous-language](.github/instructions/ubiquitous-language.instructions.md) | 強制查閱 `terminology-glossary.md`，規範通用語言命名 |
| [bounded-context-rules](.github/instructions/bounded-context-rules.instructions.md) | 限界上下文邊界與模組依賴方向規範 |
| [domain-modeling](.github/instructions/domain-modeling.instructions.md) | 聚合根、實體與值對象的 Immutable 設計與 Zod 驗證規範 |
| [event-driven-state](.github/instructions/event-driven-state.instructions.md) | XState 與領域事件互動、SuperJSON 序列化規範 |

### DDD Prompt 模板

- [`generate-aggregate`](.github/prompts/generate-aggregate.prompt.md) — 生成符合 IDDD 規範的 TypeScript 聚合根骨架。
- [`generate-domain-event`](.github/prompts/generate-domain-event.prompt.md) — 生成領域事件定義（Zod Schema + 型別推導）。

### DDD 術語表

DDD 相關術語定義（聚合根、限界上下文、通用語言等）請查閱 [`.github/terminology-glossary.md`](.github/terminology-glossary.md) 的「DDD 戰略設計術語」與「DDD 戰術設計術語」章節。

## Spec-Driven Development

When asked to use spec-driven development, follow [`SPEC-WORKFLOW.md`](SPEC-WORKFLOW.md).

## Copilot Delivery Workflow

This repository also maintains a formal Copilot delivery chain for non-trivial work:

1. Planner
2. Implementer
3. Reviewer
4. QA

Use `.github/copilot-instructions.md` as the Copilot-specific baseline and see [`docs/handoffs.md`](docs/handoffs.md) for the formal stage transitions.

## Permissions

For the RBAC/role model used in this project, see [`PERMISSIONS.md`](PERMISSIONS.md).

## Full Rules

See [`.github/agents/README.md`](.github/agents/README.md), [`.github/instructions/`](.github/instructions/), and [`.github/prompts/`](.github/prompts/) for the active rule and workflow set.
````

## File: CONTRIBUTING.md
````markdown
# Contributing to Xuanwu App

Contributions are welcome. Please follow these guidelines to keep the codebase consistent and easy to review.

## House Rules

### 👥 Prevent Work Duplication

Before opening a new issue or PR, check whether it already exists in [Issues](https://github.com/122sp7/xuanwu-app/issues) or [Pull Requests](https://github.com/122sp7/xuanwu-app/pulls).

### ✅ Work on Approved Issues

For new feature requests, wait for a maintainer to approve the issue before starting implementation. Bug fixes, security, performance, and documentation improvements can begin immediately.

### 🚫 One Concern per PR

Keep PRs small and focused. A PR should address one feature, bug, or refactor. Split large changes into a sequence of smaller PRs that can be reviewed and merged independently.

### 📚 Write for Future Readers

Every PR contributes to the long-term understanding of the codebase. Write clearly enough that someone — possibly you — can revisit it months later and still understand what happened and why.

### ✅ Summarize Your PR

Provide a short summary at the top of every PR describing the intent. Use `Closes #123` or `Fixes #456` in the description to auto-link related issues.

### 🧪 Describe What Was Tested

Explain how you validated your changes. For example: _"Tested locally with npm run dev, verified the new route renders without errors."_

---

## Development

### Prerequisites

- Node.js 24
- npm

### Setup

```bash
npm install
npm run dev      # Start Next.js dev server (port 3000)
```

### Validation

Before pushing, ensure these all pass:

```bash
npm run lint     # ESLint — must have 0 errors
npm run test     # Vitest unit tests
npm run build    # Next.js production build + TypeScript type-check
```

For the Python worker:

```bash
cd py_fn && python -m pip install -r requirements-dev.txt
cd py_fn && python -m compileall -q .
cd py_fn && python -m pytest tests/ -v
```

---

## Architecture Conventions

This project follows **Module-Driven Domain Design (MDDD)**. Before making changes, read:

- [`.github/agents/README.md`](.github/agents/README.md) — rules index
- [`.github/agents/knowledge-base.md`](.github/agents/knowledge-base.md) — domain knowledge and module inventory
- [`CLAUDE.md`](CLAUDE.md) — key architecture rules and patterns

### Key Rules

- Business logic lives in `modules/<context>/` with four layers: `domain/`, `application/`, `infrastructure/`, `interfaces/`.
- Dependency direction: `interfaces/ → application/ → domain/ ← infrastructure/`.
- `domain/` must be framework-free.
- Use `@alias` package imports (e.g., `@shared-types`, `@ui-shadcn`). Never use legacy `@/shared/*`, `@/libs/*`, `@/ui/*` paths.
- Keep Next.js Server Actions thin — delegate to use cases, return `CommandResult`.

### File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Domain entity | `PascalCase.ts` | `Organization.ts` |
| Repository interface | `MyRepository.ts` | `WorkspaceRepository.ts` |
| Firebase repository | `FirebaseMyRepository.ts` | `FirebaseWorkspaceRepository.ts` |
| Use case | `my-use-case.ts` | `create-workspace.ts` |
| Server Action | `*.actions.ts` | `workspace.actions.ts` |
| React component | `PascalCase.tsx` | `WorkspaceCard.tsx` |

---

## Making a Pull Request

1. Fork the repository and create a branch from `main`.
2. Make focused, incremental changes.
3. Ensure `npm run lint` and `npm run build` pass with no new errors.
4. Fill out the PR description with intent, changes, and testing notes.
5. Link related issues with `Closes #N` or `Refs #N`.
6. Request a review.

---

## Spec-Driven Development

For larger features, consider using spec-driven development. See [`SPEC-WORKFLOW.md`](SPEC-WORKFLOW.md).

## AI Delivery Workflow

For larger or cross-module changes, prefer the formal Copilot delivery workflow:

- Plan first with [`docs/swarm.md`](docs/swarm.md)
- Use the implementation plan as the execution contract for implementation, review, and QA
- Keep documentation updates in the same change whenever scope, boundaries, or public workflows move
````

## File: modules/knowledge/aggregates.md
````markdown
# Aggregates — knowledge

## 聚合根：KnowledgePage

### 職責
核心知識單元的聚合根。管理頁面標題、父子層級關係（parentPageId）、區塊引用列表（blockIds）及審批狀態。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 頁面主鍵 |
| `title` | `string` | 頁面標題 |
| `slug` | `string` | URL-safe 識別符 |
| `parentPageId` | `string \| null` | 父頁面 ID（樹狀層級） |
| `blockIds` | `string[]` | 關聯的 ContentBlock ID 列表 |
| `accountId` | `string` | 所屬帳戶 |
| `workspaceId` | `string?` | 所屬工作區；workspace-first 頁面必須帶值，僅顯式 summary / legacy migration 情境可為空 |
| `status` | `KnowledgePageStatus` | `active \| archived` |
| `approvalState` | `KnowledgePageApprovalState?` | `pending \| approved`（AI 生成草稿使用） |
| `approvedByUserId` | `string?` | 審批者 ID |
| `approvedAtISO` | `string?` | 審批時間 |
| `createdByUserId` | `string` | 建立者 ID |
| `createdAtISO` | `string` | ISO 8601 建立時間 |
| `updatedAtISO` | `string` | ISO 8601 更新時間 |

### Wiki/Knowledge Base 驗證屬性（spaceType="wiki" 可用）

| 屬性 | 型別 | 說明 |
|------|------|------|
| `verificationState` | `PageVerificationState?` | `verified \| needs_review`（undefined = 非 wiki 模式） |
| `ownerId` | `string?` | 頁面負責人（保持內容準確的使用者） |
| `verifiedByUserId` | `string?` | 最後驗證者 ID |
| `verifiedAtISO` | `string?` | 最後驗證時間 |
| `verificationExpiresAtISO` | `string?` | 驗證到期時間（到期後自動轉為 `needs_review`） |

### KnowledgePageStatus 與 UI 標籤對照

| `status` 屬性專 | 字狀詞 | UI 顯示標籤 | 說明 |
|--------------|------|----------------|------|
| `"active"` | 活蹍 | （正常顯示） | 預設狀態 |
| `"archived"` | 已歸檔 | 移至垃圾桶（已歸檔） | 由 `archiveKnowledgePage` 觸發，UI 標籤為「移至垃圾桶」 |
| `"active"` → 提升 | 提升為文章 | — | 由 `promoteKnowledgePage` 觸發（D3 Promote 協議）；頁面保持 `active`，`knowledge-base` 建立對應 Article |

> **警告：** 不得新增 `"trash"` 狀態。`archived` 即為對應 Notion "Move to Trash" 的 domain 實作。若需確認軟刪除，由 ADR 決裁再修改此文件。

### 不變數

- `slug` 在同一 accountId 下必須唯一
- 頁面樹與日常建立流程預設以 workspaceId 為邊界；account 層級只能做顯式 summary，不可作為隱含預設
- `createKnowledgePage` 的 write-side contract 必須帶 `workspaceId`；若需 account-level summary，應以獨立 summary flow 實作，而不是沿用一般建立流程
- archived 頁面不可新增 ContentBlock
- archived 頁面於 `PageTreeView` 不顯示（展示層過濾 `status === "active"`）
- **歸檔級聯（D2）**：歸檔父頁面時，所有子頁面同步歸檔（`childPageIds` 一併記入 `knowledge.page_archived`）；歸檔操作可恢復（`status` 回設為 `"active"`），子頁面同步恢復。

---

## 實體：ContentBlock（KnowledgeBlock）

### 職責
頁面內的原子內容單元，有序排列形成頁面內容。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 區塊主鍵 |
| `pageId` | `string` | 所屬頁面 ID |
| `accountId` | `string` | 所屬帳戶 |
| `content` | `BlockContent` | 型別化內容（含 `type: BlockType` 欄位） |
| `order` | `number` | 排列順序 |
| `createdAtISO` | `string` | ISO 8601 |
| `updatedAtISO` | `string` | ISO 8601 |

> `BlockContent.type` 為 `BlockType`（`text \| heading-1 \| heading-2 \| heading-3 \| image \| code \| bullet-list \| numbered-list \| divider \| quote`）。
> 代碼位置：`domain/value-objects/block-content.ts`

---

## 實體：ContentVersion（KnowledgeVersion）

### 職責
頁面的歷史版本快照，append-only。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 版本主鍵 |
| `pageId` | `string` | 所屬頁面 |
| `accountId` | `string` | 所屬帳戶 |
| `label` | `string` | 版本標籤（人類可讀描述） |
| `titleSnapshot` | `string` | 版本建立時的頁面標題快照 |
| `blocks` | `KnowledgeVersionBlock[]` | 版本時間點的區塊快照列表 |
| `createdByUserId` | `string` | 建立者帳戶 ID |
| `createdAtISO` | `string` | ISO 8601 |

---

## 聚合根：KnowledgeCollection（Database / Wiki Space）

### 職責
Notion-like 的集合空間，依 `spaceType` 分為兩種模式：
- **`spaceType="database"`**：Notion Database — 結構化資料容器（欄位 Schema + Records + Views）。**此模式由 `knowledge-database` BC 獨立擁有**（D1 決策）；`knowledge` 僅保留集合識別與 Wiki Space 能力。
- **`spaceType="wiki"`**：Notion Wiki / Knowledge Base — 帶頁面驗證與所有權的知識庫空間，由 `knowledge` BC 管理。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 集合主鍵 |
| `accountId` | `string` | 所屬帳戶 |
| `workspaceId` | `string?` | 所屬工作區；wiki 與日常集合操作預設為 workspace-first |
| `name` | `string` | 集合名稱 |
| `description` | `string?` | 說明文字 |
| `spaceType` | `CollectionSpaceType` | `"database" \| "wiki"` |
| `columns` | `CollectionColumn[]` | 欄位定義（database 模式使用） |
| `pageIds` | `string[]` | 關聯的 KnowledgePage ID 列表 |
| `status` | `CollectionStatus` | `active \| archived` |
| `createdByUserId` | `string` | 建立者 |
| `createdAtISO` | `string` | ISO 8601 |
| `updatedAtISO` | `string` | ISO 8601 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `KnowledgePageRepository` | `create()`, `rename()`, `move()`, `archive()`, `approve()`, `verify()`, `requestReview()`, `assignOwner()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` |
| `KnowledgeBlockRepository` | `add()`, `update()`, `delete()`, `findById()`, `listByPageId()` |
| `KnowledgeVersionRepository` | `create()`, `findById()`, `listByPageId()` |
| `KnowledgeCollectionRepository` | `create()`, `rename()`, `addPage()`, `removePage()`, `addColumn()`, `archive()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` |
````

## File: modules/knowledge/README.md
````markdown
# knowledge — 知識內容上下文

> **Domain Type:** **Core Domain**（核心域）  
> **模組路徑:** `modules/knowledge/`  
> **開發狀態:** 🚧 Developing — 積極開發中

## 在 Knowledge Platform / Second Brain 中的角色

`knowledge` 是 Xuanwu 的 Notion-like 核心內容層，負責知識頁面、內容區塊、版本與審批生命週期。它是整個 Knowledge Platform / Second Brain 的中心，決定知識如何被建立、保存、演進與交付給下游協作。

## 主要職責

| 能力 | 說明 |
|---|---|
| Knowledge Page 生命週期 | 建立、編輯、版本化、歸檔與審批知識頁面 |
| 內容區塊管理 | 維護文字、標題、媒體、列表等內容區塊結構 |
| Database（知識資料庫） | KnowledgeCollection with spaceType="database"（僅持有 opaque ID）；完整 Schema / Record / View 生命週期由 `knowledge-database` BC 擁有（**D1 決策**） |
| Wiki / Knowledge Base（知識庫） | KnowledgeCollection with spaceType="wiki"，支援頁面驗證狀態、頁面所有權與定期審閱（對時 Notion Wiki） |
| 審批後協作啟動 | 發出 `knowledge.page_approved` 等事件，驅動後續工作流程與知識流轉 |

## Scope 原則

- `knowledge` 的日常頁面建立、整理與樹狀導覽以 workspace-first 為預設。
- account / organization 層級只能作為顯式 summary mode，用於跨工作區總覽，不應默默取代工作區視角。
- 若畫面或查詢沒有明確指定 summary mode，則必須帶入 activeWorkspaceId 來限制知識頁面範圍。
- `createKnowledgePage` 的 write-side contract 必須帶 `workspaceId`；account summary mode 不提供一般頁面建立入口。

## 與其他 Bounded Context 協作

- `workspace` 提供知識內容的歸屬容器；`source` 提供外部文件入口。
- `knowledge-base` 承接被提升為文章的組織級知識資產；`workspace-flow` 以審批事件物化任務與發票。
- `search` 與 `notebook` 消費知識內容做檢索、摘要與問答。

## 核心聚合 / 核心概念

- **`KnowledgePage`**
- **`ContentBlock`**
- **`ContentVersion`**
- **`KnowledgeCollection`**（spaceType: "database" | "wiki"）

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/workspace/bounded-context.md
````markdown
# Bounded Context — workspace

`modules/workspace/` 是 Xuanwu 中承載 workspace 語言、模型、應用流程與 adapter 的 bounded context。

全域 bounded-context 地圖由 [docs/ddd/bounded-contexts.md](../../docs/ddd/bounded-contexts.md) 擁有；本文件只描述 `workspace` 這個本地 bounded context 的細節，不重複整份全域地圖。

## Boundaries

### 這個 bounded context 擁有的語言

- `Workspace`
- `workspaceId`
- `WorkspaceLifecycleState`
- `WorkspaceVisibility`
- 與工作區範圍直接相關的 aggregate、value object、domain event language

### 這個 bounded context 不擁有的語言

- 組織成員、團隊與治理真相來源：由 `organization` 擁有
- 知識內容與知識工作流：由 `knowledge`、`knowledge-base`、`notebook` 等擁有
- 事件儲存與 event bus 基礎設施：由 `shared` 與對應 integration layers 擁有
- 頁面 tab 組裝與 route composition：屬於 UI / interface composition，不是 bounded-context boundary 本體

## Collaboration Surface

workspace 以兩種主要方式與其他 bounded contexts 協作：

1. 同步公開邊界：`api/`
2. Published Language：`workspaceId`、生命週期／可見性語言與 domain events

在本地執行路徑上，read models / projections 也是 bounded context 對 drivers 提供的重要讀取 surface，但它們不是對外 published language 的全部。

更完整的外部關係請看 [context-map.md](./context-map.md)。

## Internal Structure

從六邊形架構看，這個 bounded context 的內部切面如下：

| 區域 | 角色 |
|---|---|
| `domain/` | aggregate、entity、value object、domain event language |
| `application/` | use cases 與 orchestration |
| `interfaces/` | driving adapters：Server Actions、queries、UI composition |
| `infrastructure/` | driven adapters：Firebase 與其他外部技術整合 |

這個分層是 bounded context 的內部結構，不應和 strategic context map 混為一談。

## Drivers, Ports, Adapters, and Read Models

### Drivers / 外部驅動器

- Browser UI
- Next.js Server Actions 與 query entrypoints
- 其他 bounded context 經由 `api/` 的呼叫者
- 未來可能的 incoming event handlers / scheduled jobs

### Ports / 端口

- 內核朝外的 driven ports 主要是 `domain/repositories/` 介面
- `api/` 是對外穩定 collaboration surface，但不等於把所有內部 ports 直接公開

### Adapters / 適配器

- Driving Adapters：`interfaces/` 下的 actions、queries、UI-oriented composition
- Driven Adapters：`infrastructure/` 下的 Firebase 與事件整合實作

### Projections / Read Models

- `WorkspaceMemberView`
- `WikiAccountContentNode`
- `WikiWorkspaceContentNode`
- `WikiContentItemNode`

它們服務查詢與呈現，不是 write-side aggregate，也不是 infrastructure adapter。

## Ownership Guardrails

- 跨模組 consumer 應透過 `@/modules/workspace/api` 協作
- `domain/` 不感知 React、Firebase SDK、HTTP client
- `infrastructure/` 不透過 `api/` 反向回繞
- `WorkspaceMemberView` 與 `Wiki*Node` 是 query-side projection，不是此 bounded context 的 write-side aggregate

## Related Local Docs

- [README.md](./README.md) — 總覽與 tactical summary
- [context-map.md](./context-map.md) — 對外關係與 integration patterns
- [aggregates.md](./aggregates.md) — bounded context 內部核心模型
- [repositories.md](./repositories.md) — ports 與 adapters
````

## File: modules/workspace/subdomain.md
````markdown
# Subdomain — workspace

`workspace` 所對應的問題空間在 Xuanwu 的戰略分類中屬於 generic subdomain。

全域 subdomain 分類由 [docs/ddd/subdomains.md](../../docs/ddd/subdomains.md) 擁有；本文件只說明 workspace 為什麼落在這個分類，以及它在 selected problem-space view 中的意義。

## Why Generic

workspace 解決的是「協作範圍、生命週期與公開邊界」問題，而不是 Xuanwu 的主要差異化來源。

它的重要性很高，但它不是產品獨特價值本身。真正形成產品差異化的，仍是知識內容、檢索、協作語意與工作流等上下文。

## What Problem Space It Covers

workspace 子域聚焦這些問題：

- 工作區作為協作容器的存在性
- 工作區範圍鍵 `workspaceId`
- 工作區生命週期與可見性
- 讓其他 bounded contexts 能以共同範圍語言協作

## What It Deliberately Does Not Differentiate

- 它不定義知識內容本身
- 它不定義組織成員真相來源
- 它不定義檢索、RAG、文章治理等差異化業務能力

Ports、Adapters、Drivers、Read Models 也不是 subdomain 本身；它們是 bounded context 內部或邊界上的實作 / 協作概念。

換句話說，workspace 子域提供的是必要的結構性能力，而不是核心競爭優勢。

## Selected Strategic View

這份文件只用 workspace 為中心看它周邊牽涉到的問題空間：

- `organization` 提供 ownership 與 member/team truth
- `knowledge`、`knowledge-base`、`source`、`notebook` 等透過 `workspaceId` 對齊範圍
- `workspace-flow`、`workspace-feed`、`workspace-scheduling` 等在工作區範圍內延伸自己的語言

這是一個 selected view，不是整個 Xuanwu domain 的完整 subdomain 分析。

## What Is Not a Subdomain

以下概念雖然與 workspace 有關，但不應拿來當 subdomain：

- Firestore、event bus 等 external systems
- Browser UI、Server Actions、job triggers 等 drivers
- repository ports、adapters 等 hexagonal 結構元件
- `WorkspaceMemberView`、`Wiki*Node` 這類 read models / projections

## Investment Posture

作為 generic subdomain，workspace 的策略不是追求花俏建模，而是：

- 穩定邊界
- 穩定 published language
- 清楚 ownership
- 對其他 bounded contexts 提供低摩擦協作面

## Related Local Docs

- [README.md](./README.md) — 模組總覽
- [bounded-context.md](./bounded-context.md) — 本地 bounded context 邊界
- [context-map.md](./context-map.md) — 與其他 bounded contexts 的關係
````

## File: modules/workspace/context-map.md
````markdown
# Context Map — workspace

`workspace` 的 context map 只描述 bounded context 之間的關係與 integration patterns，不描述頁面 tab 組裝。

在這份文件裡，Aggregate Root 指的是對外提供 published language 的 domain 類別 / 物件；Domain Event 指的是跨 context 可發布的事件類別、訊息物件。Repository、Factory、Domain Service 不屬於 context map 的主體，但會支撐這些整合 surface 的實作。

## Domain / Subdomain / Bounded Context 層級

- `Xuanwu` 是整體 domain
- `workspace` 對應的是 generic subdomain 中的協作容器問題空間
- `modules/workspace/` 是承載這組語言的 bounded context
- context map 描述的是這個 bounded context 在整體 domain 裡與其他 bounded context 的關係，而不是描述 bounded context 內部的六邊形分層
- 這是一個 problem-space selected view：只聚焦與 workspace 有關的 subdomains / bounded contexts，不試圖覆蓋整個 Xuanwu domain inventory
- 某些相關 bounded contexts 可能位於同一 subdomain，也可能來自 supporting / external / generic 區域；關係圖關注的是邊界互動，不是所有權想像

## Drivers and External Systems（不是 Bounded Context）

下列對象會影響 workspace，但不應畫成 context map 中的 bounded context：

- Browser UI / Next.js 頁面與 Server Actions：它們是 drivers
- Firestore、event bus 等技術系統：它們是 external systems，由 adapters 整合
- Query projections / read models：它們是讀取結果，不是獨立 bounded context

## Upstream Contexts

### `account` → `workspace`（Customer/Supplier）

- `account` 提供 personal ownership 與 actor identity 的基礎語言
- `workspace.accountId` 在 personal scope 下對齊 `account`
- `workspace` 依賴 `account` 的存在，但不複製 account 的完整模型

### `organization` → `workspace`（Customer/Supplier + Read-side ACL）

- `organization` 提供 team、member 與 organization ownership 的真相來源
- `workspace.accountId + accountType="organization"` 讓工作區對齊組織範圍
- 在 query side，workspace 會把 organization 的成員/團隊語言翻譯成 `WorkspaceMemberView`
- 這種翻譯屬於 read-side anti-corruption / translation 行為，不代表 `workspace` 擁有組織模型

## Downstream / Dependent Contexts

### `workspace` → `knowledge`（Conformist）

- `knowledge` 使用 `workspaceId` 對齊知識頁面的工作區範圍
- `knowledge` 對工作區存在性、範圍與可見性語言採 conformist

### `workspace` → `knowledge-base`（Conformist）

- `knowledge-base` 以 `workspaceId` 作為文章與知識資產的工作區範圍鍵

### `workspace` → `source`（Conformist）

- `source` 以 `workspaceId` 管理文件與 library 的工作區範圍

### `workspace` → `notebook`（Conformist）

- `notebook` 以 `workspaceId` 作為查詢與 RAG 工作流範圍

### `workspace` → `workspace-flow`（Conformist）

- `workspace-flow` 以 `workspaceId` 對齊任務、issue、invoice 的工作區範圍

### `workspace` → `workspace-scheduling`（Conformist）

- `workspace-scheduling` 以 `workspaceId` 對齊排程與容量規劃範圍

### `workspace` → `workspace-feed`（Conformist）

- `workspace-feed` 以 `workspaceId` 對齊活動流範圍

### `workspace` → `workspace-audit`（Published Language / Conformist）

- `workspace-audit` 會消費工作區範圍資訊與後續 workspace domain events
- 在事件真正落地前，雙方仍主要透過同步 API 與共同範圍語言協作

## Public Integration Surfaces

| 類型 | Surface |
|---|---|
| 同步 API | `modules/workspace/api` |
| Published Language | `workspaceId`、`WorkspaceLifecycleState`、`WorkspaceVisibility` 等 aggregate / value object 語言 |
| 非同步事件（目標） | `workspace.created`、`workspace.lifecycle_transitioned`、`workspace.visibility_changed` 等 domain event 訊息物件 |

每一個對外 surface 都可視為一個 hexagon-to-hexagon integration point：不是 page 組裝，不是 repository 內部細節，而是 bounded context 對其他 bounded context 的協作面。

## Read Models in Collaboration

- `WorkspaceMemberView` 這類 read model 主要服務本地查詢與 ACL translation
- 除非明確定義為 published language，projection 不應被當成跨 bounded context 的 canonical contract

## Non-Examples

- `WorkspaceDetailScreen` 組合 `WorkspaceFlowTab`、`WorkspaceSchedulingTab`、`WorkspaceAuditTab` 是 UI composition，不是 strategic context map
- `WikiContentTree` 導覽節點是 query model，不是 context-to-context contract 的替代物
- `domain/`、`application/`、`interfaces/`、`infrastructure/` 的分工屬於六邊形架構內部切面，不是 context map 本身

## IDDD 整合模式總結

| 關係 | 模式 | 備註 |
|------|------|------|
| `account` → `workspace` | Customer/Supplier | 個人 ownership 與 actor identity |
| `organization` → `workspace` | Customer/Supplier + Read-side ACL | workspace 讀模型翻譯 organization 資料 |
| `workspace` → `knowledge` | Conformist | 以 `workspaceId` 對齊內容範圍 |
| `workspace` → `knowledge-base` | Conformist | 以 `workspaceId` 對齊知識資產範圍 |
| `workspace` → `source` | Conformist | 以 `workspaceId` 對齊來源範圍 |
| `workspace` → `notebook` | Conformist | 以 `workspaceId` 對齊研究與 RAG 範圍 |
| `workspace` → `workspace-flow` | Conformist | 以 `workspaceId` 對齊工作流範圍 |
| `workspace` → `workspace-scheduling` | Conformist | 以 `workspaceId` 對齊排程範圍 |
| `workspace` → `workspace-feed` | Conformist | 以 `workspaceId` 對齊活動流範圍 |
| `workspace` → `workspace-audit` | Published Language / Conformist | 範圍資訊與後續事件消費 |
````

## File: modules/workspace/domain-events.md
````markdown
# Domain Events — workspace

本文件定義 workspace 的目標 domain event 契約。它描述的是 bounded context 應該公開的事件語言，不宣稱所有事件都已經完全接線完成。

在 workspace 中，Domain Event（領域事件）是事件類別或訊息物件。它不是 UI callback，也不是 repository method；它是 bounded context 對外發布的語言單位。

從 strategic design 角度看，這些事件是 `workspace` bounded context 對整體 Xuanwu domain 其他 bounded context 公開的 published language。

從六邊形架構角度看，事件型別與工廠屬於內核語言；event bus / event store 與實際發布機制屬於外層 adapter 協作。

## Event-Driven Architecture Position

- `workspace` 可以作為一個 hexagonal system 發出 outgoing events，也可能在未來接收 incoming events
- 事件驅動是 bounded context 之間的解耦機制，不代表 aggregate 必須採 event sourcing
- 事件 subscriber / pipeline filter / bus adapter 屬於邊界協作，不應污染 domain event 語言本身

## Ports, Adapters, Drivers, and Projections

- Drivers 先透過 command-side paths 觸發狀態改變，再由 application / adapter 協調發布事件
- 若未來抽出 event publisher abstraction，該 abstraction 是 port；實際 bus / store connector 是 adapter
- 下游 bounded context 或本地 query-side flow 可以用事件更新 projection / read model
- 但 domain event 本身不是 projection；它是發布語言，不是讀取結果

## Event Base Contract

workspace domain events 應對齊 `modules/shared/domain/events.ts` 的共享基底：

- `eventId`
- `type`
- `aggregateId`
- `occurredAt`

`aggregateId` 在 workspace 事件中一律對應 `workspaceId`。

## Canonical Events

| 事件物件 | Discriminant | 觸發條件 | 關鍵欄位 |
|---|---|---|---|
| `WorkspaceCreatedEvent` | `workspace.created` | 工作區建立完成後 | `workspaceId`, `accountId`, `accountType`, `name` |
| `WorkspaceLifecycleTransitionedEvent` | `workspace.lifecycle_transitioned` | `lifecycleState` 發生改變後 | `workspaceId`, `accountId`, `fromState`, `toState` |
| `WorkspaceVisibilityChangedEvent` | `workspace.visibility_changed` | `visibility` 發生改變後 | `workspaceId`, `accountId`, `fromVisibility`, `toVisibility` |

## Event Factories

workspace module 應提供明確工廠函式來建立事件訊息物件，例如：

- `createWorkspaceCreatedEvent(...)`
- `createWorkspaceLifecycleTransitionedEvent(...)`
- `createWorkspaceVisibilityChangedEvent(...)`

這些工廠屬於 domain event language，不是 React helper，也不應放在 page / component 內。

## Publishing Rules

- 先成功持久化 aggregate，再發布事件
- 事件 payload 只包含下游所需的最小資訊
- 不把 React state、router path、UI label 放進事件語言
- application layer / interface adapter 可以組裝 event publisher，但事件物件本身屬於 domain language

## 明確排除的事件

| 不再作為 workspace 事件的名稱 | 原因 |
|---|---|
| `workspace.archived` | 此 bounded context 的生命週期語言是 `stopped`，不是 `archived` |
| `workspace.member_joined` | 工作區成員清單目前是 read projection；成員真相來源屬於 organization / access language |
| `workspace.member_removed` | 同上 |

## 目前落地策略

- 第一批事件以 `WorkspaceCreatedEvent`、`WorkspaceLifecycleTransitionedEvent`、`WorkspaceVisibilityChangedEvent` 為主
- event publishing 依賴 `modules/shared/api` 的 `PublishDomainEventUseCase` 與 event store / event bus adapters
- 在事件完全接線前，文件仍以此處為 canonical published language

## 明確不是目前策略的內容

- 目前 workspace repository 不是 event-sourced repository；aggregate 不是從 event store replay reconstitute
- 目前沒有專屬的 event pipeline / filter chain 作為主要處理模型
- 目前沒有 `workspace` 專屬的 long-running process executive 或 tracker aggregate
````

## File: modules/workspace/domain-services.md
````markdown
# workspace — Domain Services

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

目前 workspace 沒有獨立的 `domain/services/*` 檔案。這是刻意的 tactical 選擇，不是遺漏。

在 workspace 中，Domain Service（領域服務）是類別 / 函式，用來承載不自然屬於 aggregate、entity、value object 的純領域規則。

從六邊形架構看，Domain Service 位於 domain model 內核，而不是 `interfaces/` 或 `infrastructure/` adapter。它可以被 application layer 協作呼叫，但不應反向依賴外部技術。

從 strategic design 看，Domain Service 服務的是 `workspace` 這個 bounded context 的語言，不是跨整個 Xuanwu domain 的共用雜項工具。

它也不等同於 event subscriber、pipeline filter、long-running process executive；那些概念若存在，通常屬於應用層協調或邊界整合，而不是先天就是 Domain Service。

## 與 Ports / Adapters / Drivers / Read Models 的區別

- Port 宣告協作接縫；它不是業務規則本身
- Adapter 轉譯外部系統或 driver；它不是 domain service
- Driver 觸發工作開始；它不是 domain model 元件
- Projection / Read Model 服務讀取；它不是領域規則容器

## 目前狀態

- 單一 aggregate 內的規則，優先留在 `Workspace` aggregate 與 supporting domain objects
- 讀模型組裝與外部資料翻譯，優先留在 query-side repository / application orchestration
- 還沒有出現足以穩定抽成 domain service 的跨 aggregate、純領域規則

## 何時應新增 Domain Service

只有在出現以下情況時，才應把規則抽成 domain service：

- 規則跨越多個 aggregate 或多個 supporting domain objects
- 規則不是單純的 repository 查詢，也不是 UI composition
- 規則不依賴 React、Firebase SDK、HTTP client 或 router
- 規則本身是穩定的領域語言，而不是暫時性的流程拼裝

## 可能的候選服務（尚未落地）

| 候選服務 | 何時需要 |
|---|---|
| `WorkspaceLifecyclePolicy` | 若生命週期轉移規則持續增加，超出 aggregate 本身可讀性時 |
| `WorkspaceAccessResolutionService` | 若 direct grant、team grant、personnel 解析邏輯需要在多個 use case 重複使用時 |
| `WorkspaceCapabilityMountPolicy` | 若 capability mounting 有穩定、可重用的領域規則時 |

## 若未來引入長流程

- 若只是協調多個事件處理步驟，優先建模為 application-level process orchestration
- 若流程狀態本身成為業務真相，才考慮引入 tracker aggregate，而不是先把它塞成 Domain Service

## 明確不是 Domain Service 的內容

- React hooks
- Server Actions
- query wrappers
- UI draft factories
- 只服務單一 page 的 tab composition helper
````

## File: modules/workspace/README.md
````markdown
# workspace — 協作容器上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/workspace/`  
> **定位:** 協作範圍、生命週期與工作區公開邊界

## Strategic Role

`workspace` 是 Xuanwu 的協作容器 bounded context。它提供工作區作為協作範圍的 identity、生命週期與可見性語言，讓知識、來源、工作流、稽核、動態與排程等上下文可以用同一個 `workspaceId` 對齊範圍。

從戰略分類看，workspace 所對應的問題空間屬於 generic subdomain，不是產品差異化核心；真正差異化的知識內容、檢索與協作語意由其他 bounded context 擁有。

從邊界落地看，`modules/workspace/` 是承載這組 generic-subdomain 語言的 bounded context，而不是整個 Xuanwu domain 的總模型。

## Domain / Subdomain / Bounded Context

| 層級 | workspace 在此層級的角色 |
|---|---|
| Domain | Xuanwu 這個整體知識平台業務域 |
| Subdomain | 協作容器與範圍治理問題空間，戰略上屬於 generic subdomain |
| Bounded Context | `modules/workspace/`，承載 `workspaceId`、生命週期、可見性與工作區公開邊界 |

這裡描述的是以 workspace 為中心的 selected view。它用來分析此問題空間牽涉到哪些 subdomains 與 bounded contexts，不等於整個 Xuanwu domain 的完整戰略地圖。

## 主要職責

| 能力 | 說明 |
|---|---|
| Workspace 容器生命週期 | 建立工作區、更新設定、管理 `preparatory | active | stopped` 狀態 |
| 協作範圍語言 | 提供 `workspaceId`、`WorkspaceVisibility` 與工作區範圍識別語言 |
| 工作區公開邊界 | 透過 `api/` 暴露穩定查詢、命令入口與 UI composition surface |
| Read-side Projections | 組合工作區成員檢視與工作區導覽節點等查詢模型 |

## 不屬於此 Context 的責任

- `organization` 擁有組織成員、團隊與組織治理真相來源
- `knowledge` / `knowledge-base` / `source` / `notebook` 擁有內容與知識工作流語意
- `shared` 擁有跨 bounded context 的事件基底與 event publishing 基礎設施
- UI tab 組裝屬於 interface composition，不等於 context map

## Tactical Model Summary

| 類型 | 目前契約 |
|---|---|
| Aggregate Root | `Workspace` |
| Supporting Domain Objects | `WorkspaceLocation`、`Capability`、`WorkspaceGrant`、`WorkspacePersonnel` |
| Read Projections | `WorkspaceMemberView`、`WikiAccountContentNode`、`WikiWorkspaceContentNode` |
| Drivers | Browser UI、Server Actions、其他 bounded context 經由 `api/` 的呼叫者 |
| Driven Ports | `WorkspaceRepository`、`WorkspaceCapabilityRepository`、`WorkspaceAccessRepository`、`WorkspaceLocationRepository`、`WorkspaceQueryRepository`、`WikiWorkspaceRepository` |
| Driving Adapters | `interfaces/_actions/`、`interfaces/queries/`、UI composition |
| Driven Adapters | Firebase repositories 與事件整合 adapters |
| Write-side Port | `WorkspaceRepository` |
| Read-side Ports | `WorkspaceQueryRepository`、`WikiWorkspaceRepository` |
| Domain Services | 目前沒有獨立 service；規則仍以 aggregate / application orchestration 為主 |
| Domain Events | `WorkspaceCreated`、`WorkspaceLifecycleTransitioned`、`WorkspaceVisibilityChanged` 為目標契約 |

## Hexagonal View

| 六邊形位置 | workspace 對位 |
|---|---|
| Domain Model Core | `domain/` 下的 aggregate、entity、value object、domain event language |
| Application Ring | `application/` use cases 與 orchestration |
| Driving Adapters | `interfaces/`、Server Actions、queries、UI composition |
| Driven Ports | `domain/repositories/` 等內核對外介面 |
| Driven Adapters | `infrastructure/` 的 Firebase 等外部整合 |

`context-map.md` 描述的是 bounded context 在整體 domain 裡的外部關係；六邊形描述的是這個 bounded context 內部的結構。兩者不可混用。

若 workspace 透過事件與其他 bounded contexts 協作，它仍然是一個位於整體 event-driven topology 中的 hexagon：commands / queries 由 driving side 進入，domain events 由內核語言產生，再由外層 adapter 發布。

## DDD 概念導讀

| 概念 | 在 workspace 中的程式型態 | 主要查看文件 |
|---|---|---|
| Entity（實體） | 類別 / 物件 | `aggregates.md` |
| Value Object（值對象） | 類別 / 物件 | `aggregates.md`、`ubiquitous-language.md` |
| Aggregate / Aggregate Root（聚合 / 聚合根） | 類別 / 物件 | `aggregates.md` |
| Repository（倉儲） | 介面或類別（負責資料存取） | `repositories.md` |
| Ports（端口） | 介面，宣告 collaboration seam | `repositories.md`、`application-services.md` |
| Adapters（適配器） | 類別 / 函式 / 模組，連接 drivers 或外部系統 | `bounded-context.md`、`repositories.md`、`application-services.md` |
| 外部系統 / Driver（驅動器） | 從外部啟動此 bounded context 的角色或系統 | `bounded-context.md`、`context-map.md` |
| Projection / Read Model | 查詢導向的讀取模型 | `aggregates.md`、`application-services.md`、`ubiquitous-language.md` |
| Domain Service（領域服務） | 類別 / 函式 | `domain-services.md` |
| Factory（工廠） | 類別 / 函式 | `application-services.md`、`domain-events.md` |
| Domain Event（領域事件） | 事件類別、訊息物件 | `domain-events.md`、`context-map.md` |

## 實作備註

- 目前程式中仍有一些 supporting records 與 read projections 混置於 `domain/entities/`；本文件定義的是收斂方向
- `WorkspaceMemberView` 與 `WikiContentTree` 型別不得再被描述成 aggregate 或 value object
- `index.ts` 的目標是薄入口；跨模組 consumer 應優先依賴 `@/modules/workspace/api`

## 詳細文件

| 文件 | 說明 |
|---|---|
| [subdomain.md](./subdomain.md) | workspace 為何屬於 generic subdomain，以及哪些內容不是 subdomain 本體 |
| [bounded-context.md](./bounded-context.md) | workspace 作為 bounded context 的邊界、drivers、ports、adapters 與 read model |
| [ubiquitous-language.md](./ubiquitous-language.md) | workspace BC 的通用語言、read model 與 hexagonal 元術語 |
| [aggregates.md](./aggregates.md) | aggregate、entity、value object 與 read model / projection 對位 |
| [application-services.md](./application-services.md) | application layer use cases、drivers、ports、adapters 與 read model orchestration |
| [repositories.md](./repositories.md) | driven ports、repository adapters 與 query/read model 持久化邊界 |
| [domain-services.md](./domain-services.md) | domain service 與 ports/adapters/drivers/read models 的區別 |
| [domain-events.md](./domain-events.md) | workspace 領域事件契約、事件驅動整合與 projection 關係 |
| [context-map.md](./context-map.md) | workspace 與其他 bounded context 的 integration patterns |
````

## File: modules/workspace/aggregates.md
````markdown
# Aggregates — workspace

本文件中的 Aggregate / Aggregate Root、Entity、Value Object 都以類別 / 物件來討論；它們是 workspace bounded context 的 write-side domain model，而不是 UI projection。

從六邊形架構的角度看，這份文件描述的是 bounded context 核心的 domain model，不是外層 adapter，也不是整個 Xuanwu domain 的 context map。

這裡列出的 aggregate、entity、value object 也是此 bounded context 通用語言的一部分；它們與 domain events 一起構成 `workspace` collaboration language，而不只是型別分類。

Ports、Adapters、Drivers 不是這份文件的主角；它們位於 domain model 外圍。這份文件只在需要區分 read model / projection 時提及外層結構。

## Write-side Aggregate Root

### `Workspace`

`Workspace` 是此 bounded context 的 aggregate root。它代表一個協作範圍，並保護工作區生命週期、可見性與工作區範圍識別語言的一致性。

### 核心屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 工作區主鍵；建立後不可變更 |
| `name` | `WorkspaceName` | 工作區名稱值對象 |
| `accountId` | `string` | 擁有工作區的 account / organization |
| `accountType` | `"user" \| "organization"` | 擁有者類型 |
| `lifecycleState` | `WorkspaceLifecycleState` | `preparatory | active | stopped` |
| `visibility` | `WorkspaceVisibility` | `visible | hidden` |
| `createdAt` | `Timestamp` | 建立時間 |

### 不變條件

- `id`、`accountId`、`accountType` 在建立後不可變更
- `lifecycleState` 的 canonical 語言是 `preparatory | active | stopped`
- `visibility` 的 canonical 語言是 `visible | hidden`
- 下游 context 只能在有效的 `workspaceId` 範圍內掛載資料與行為

## Supporting Domain Objects Inside `Workspace`

### Entities

| 類型 | 說明 |
|------|------|
| `WorkspaceLocation` | 以 `locationId` 識別的工作區位置節點 |
| `Capability` | 目前以 `id` 識別的工作區能力記錄；若治理規則成長，可再評估外拆 |
| `WorkspacePersonnelCustomRole` | 以 `roleId` 識別的人員自訂角色記錄 |

### Value Objects

| 類型 | 說明 |
|------|------|
| `WorkspaceLifecycleState` | 工作區生命週期值 |
| `WorkspaceVisibility` | 工作區可見性值 |
| `WorkspaceName` | 工作區名稱值，負責 trim 與基本字串約束 |
| `Address` | 地址值型資料 |
| `WorkspaceGrant` | 工作區授權記錄；以內容而非獨立 aggregate identity 判斷語意 |
| `WorkspacePersonnel` | 管理/監督/安全等角色參照集合 |
| `CapabilitySpec` | 能力定義的值型描述 |

## Read-side Projections / Read Models（不是 Aggregate）

| 類型 | 說明 |
|------|------|
| `WorkspaceMemberView` | 工作區成員查詢投影，組合 workspace 與 organization 的資料 |
| `WorkspaceMemberAccessChannel` | 讀模型中的接入通道描述 |
| `WikiAccountContentNode` | 帳戶導覽節點 |
| `WikiWorkspaceContentNode` | 工作區導覽節點 |
| `WikiContentItemNode` | 導覽項 read projection |

`WorkspaceMemberView` 與 `Wiki*Node` 型別目前放在 `domain/entities/` 下，但語意上是 query-side projection，不是 write-side aggregate、entity 或 value object。

這些 projection / read model 是為特定讀取需求與驅動器提供的查詢形狀：

- 它們可由 query-side use case、repository adapter 或 ACL translation 組裝
- 它們優先服務查詢與呈現，不優先服務 invariant 保護
- 它們不是 ports，也不是 adapters；而是 adapters / query flows 產出的讀取模型

## Strategic Reminder

- `Workspace` aggregate root 屬於 `workspace` 這個 bounded context 的內部 tactical model
- 它不等於整個 Xuanwu domain，也不等於 generic subdomain 的全部關係圖
- Subdomain / Bounded Context 的外部關係應在 `README.md` 與 `context-map.md` 理解，不應把整體戰略關係塞回 aggregate 定義
- 一個 subdomain 內可以有多個 bounded contexts；本文件只處理 `modules/workspace/` 這個 bounded context 的核心模型

## Factory Boundary

- Factory（工廠）在本 context 中是類別 / 函式，用來建立 aggregate、value object 或對 reconstitution 做集中驗證
- `Workspace` 與 P1 value objects 應優先透過 factory / parser 建立，而不是由 interface adapter 任意拼接 raw object
- Factory 不是 Repository，也不是 Domain Service；它的責任是安全建立模型，不是持久化或協調流程

## What This File Does Not Own

- Driver / 外部驅動器：例如 Browser UI、Server Actions、其他 bounded context 呼叫者
- Adapter：例如 Firebase repository classes、Server Action wrappers、query wrappers
- Port 定義本身：見 [repositories.md](./repositories.md)

## Tactical Debt Notes

- `Workspace` aggregate 目前仍承載 capabilities、grants、locations、personnel 等 supporting records；若之後規則持續成長，應再評估切分 ownership
- P1 已正式落地於 `domain/value-objects/`：`WorkspaceLifecycleState`、`WorkspaceVisibility`、`WorkspaceName`、`Address`
- `WikiContentTree` 不是 write-side aggregate；它是為導覽組裝的 query model
- `WorkspaceMember` 不是目前的 canonical write-side 名稱；查詢模型請使用 `WorkspaceMemberView`
````

## File: modules/workspace/application-services.md
````markdown
# workspace — Application Services

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件定義 workspace application layer 的目標契約。Application layer 負責協調 aggregate、repository ports、query projections 與 domain event publishing，不承載 React UI state，也不作為跨模組偷渡 internal implementation 的入口。

從六邊形架構看，application layer 位在 domain model 外層、adapter 內層：它負責接住 inbound requests、呼叫 domain model 與 ports，並協調 outbound integration，但不應吞掉 aggregate 本身的規則。

從依賴反轉看，application layer 應向下依賴 `domain/` 抽象與 ports，由 `infrastructure/` 提供實作；UI 與 server entrypoints 則依賴 application layer，而不是直接跨進 repository implementation。

## Application Layer 職責

- 協調 command-side use cases
- 協調 query-side use cases / projection builders
- 呼叫 repository ports 與必要的 domain service
- 在持久化成功後觸發 domain event publishing
- 保持 input/output 契約穩定，讓 `interfaces/` 可以薄適配

## Ports / Adapters / Drivers / Read Models

- Driver / 外部驅動器：Browser UI、Server Actions、其他 bounded context 對 `api/` 的呼叫者，以及未來可能的事件 subscriber / job trigger
- Driving Adapters：`interfaces/_actions/`、`interfaces/queries/`、UI composition；把 driver 的要求轉成 application 可處理的命令 / 查詢
- Driven Ports：repository 介面與其他內核對外抽象
- Driven Adapters：Firebase repositories、event bus / event store integration 等外部技術實作
- Read Models：application layer 在 query-side 協調產出的 `WorkspaceMemberView`、`Wiki*Node` 等讀取模型

## 本文件涉及的 DDD 概念

- Repository（倉儲）→ 介面或類別；application layer 依賴的是 repository port，而不是 infrastructure adapter 類別
- Domain Service（領域服務）→ 類別 / 函式；只有當規則不屬於 aggregate / value object 時才由 application layer 協作呼叫
- Factory（工廠）→ 類別 / 函式；用來建立 aggregate、value object、domain event 等有效模型
- Domain Event（領域事件）→ 事件類別、訊息物件；application layer 可在持久化成功後發布，但事件語言本身屬於 domain

## 在整體 Domain 裡的位置

- 這些 application services 只服務 `workspace` 這個 bounded context
- 它們不代表整個 generic subdomain 的所有流程，更不應直接編排其他 bounded context 的內部實作
- 若流程跨越多個 bounded context，應明確透過 `api/`、published language 或更高層的 composition orchestration 協作

## Event-Driven 與長流程定位

- 若 workspace 未來出現多步驟、跨事件的長流程協調，預設先視為 application-level process orchestration，而不是直接塞進 aggregate
- 只有當流程追蹤本身成為領域概念時，才考慮引入 tracker aggregate 或對應 domain model
- 目前 workspace application layer 會協調事件發布，但尚未引入專屬的 long-running process executive / saga state object

## Command-side Use Cases

| Use Case | 目的 | 備註 |
|---|---|---|
| `CreateWorkspaceUseCase` | 建立工作區 | 最小建立流程 |
| `CreateWorkspaceWithCapabilitiesUseCase` | 建立工作區並掛載能力 | 透過 `WorkspaceRepository` + `WorkspaceCapabilityRepository` 協作 |
| `UpdateWorkspaceSettingsUseCase` | 更新名稱、可見性、生命週期與 supporting records | 目前是主要設定更新入口 |
| `DeleteWorkspaceUseCase` | 刪除工作區 | 應搭配生命週期與下游資料政策檢視 |
| `MountCapabilitiesUseCase` | 掛載工作區能力 | 僅依賴 `WorkspaceCapabilityRepository` |
| `GrantTeamAccessUseCase` | 為 workspace 授權 team access | 僅依賴 `WorkspaceAccessRepository` |
| `GrantIndividualAccessUseCase` | 為 workspace 新增 direct grant | 僅依賴 `WorkspaceAccessRepository` |
| `CreateWorkspaceLocationUseCase` | 建立工作區位置節點 | 僅依賴 `WorkspaceLocationRepository` |

## Query-side Use Cases / Projection Builders / Read Model Builders

| Use Case / Function | 目的 |
|---|---|
| `FetchWorkspaceMembersUseCase` | 組合 `WorkspaceMemberView[]` |
| `buildWikiContentTree` | 組合工作區導覽樹 projection |

這些輸出是 read model / projection，不是 aggregate。

## Factories 與 Composition Points

- Domain event factories 應放在 domain events 檔案，不放在 UI 或 page component
- Aggregate / Value Object factories 是類別 / 函式，用來建立有效 domain object，不應散落在 React component 中
- UI draft factories 應留在 `interfaces/` 或其他 UI-oriented layer，不應假裝成 application service
- Server Actions 與 query wrappers 是 interface adapter，不是 application service 本體

## 非目標

- 不保存 React component state
- 不直接 new 外部 module 的 UI component
- 不把 `WorkspaceDetailScreen` 的 tab composition 寫進 application layer

## 實作對位

### 目前 use-case 檔案

- `application/use-cases/workspace-lifecycle.use-cases.ts`
- `application/use-cases/workspace-capabilities.use-cases.ts`
- `application/use-cases/workspace-access.use-cases.ts`
- `application/use-cases/workspace-member.use-cases.ts`
- `application/use-cases/wiki-content-tree.use-case.ts`
- `application/use-cases/workspace.use-cases.ts`（barrel only）

### 收斂方向

- `interfaces/_actions/` 保持 thin orchestration
- `interfaces/queries/` 保持 thin query wrappers
- 應用層用語與 `aggregates.md`、`repositories.md`、`domain-events.md` 同步
````

## File: modules/workspace/repositories.md
````markdown
# workspace — Repositories

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件定義 workspace 的 repository ports 與對應 infrastructure adapters。workspace 目前同時存在 write-side 與 read-side repository，目的是把 aggregate 持久化與 projection 查詢分開。

在 workspace 中，Repository（倉儲）可以是介面或類別：`domain/repositories/` 裡的 port 是介面；`infrastructure/` 裡負責資料存取的 adapter 是類別。

從六邊形架構看，repository ports 是 domain/application 內核朝外宣告的 driven ports；Firebase 類別是被動端 adapter，不應反向把外部技術語言帶回 domain model。

從 event sourcing 視角補充：若未來採 event sourcing，Repository 會改為從 event store 讀取並重建 aggregate；但目前 workspace repository 是 current-state persistence，不是 event-sourced reconstitution。

## Ports and Adapters Distinction

- Port：`domain/repositories/` 中的介面，定義內核需要什麼能力
- Adapter：`infrastructure/` 中的類別，實作這些能力並接上 Firestore / 其他外部系統
- Driver 不直接呼叫 adapter；通常由 `interfaces/` / `application/` 協作後再使用對應 port

## Write-side Repository Ports

### `WorkspaceRepository`

`WorkspaceRepository` 現在只服務 `Workspace` aggregate 的核心持久化與設定更新。

#### 核心方法

- `findById(id)`
- `findByIdForAccount(accountId, workspaceId)`
- `findAllByAccountId(accountId)`
- `save(workspace)`
- `updateSettings(command)`
- `delete(id)`

### Supporting Record Ports

#### `WorkspaceCapabilityRepository`

- `mountCapabilities()` / `unmountCapability()`

#### `WorkspaceAccessRepository`

- `grantTeamAccess()` / `revokeTeamAccess()`
- `grantIndividualAccess()` / `revokeIndividualAccess()`

#### `WorkspaceLocationRepository`

- `createLocation()` / `updateLocation()` / `deleteLocation()`

這些 supporting operations 目前仍由 workspace 擁有，但不再混在核心 aggregate repository port 中；若之後 ownership 外拆，可直接替換對應 supporting port。

## Read-side Repository Ports

### `WorkspaceQueryRepository`

負責工作區查詢投影，而非 aggregate 持久化。

#### 方法

- `subscribeToWorkspacesForAccount(accountId, onUpdate)`
- `getWorkspaceMembers(workspaceId)`

這個 port 主要輸出 projection / read model，而不是 aggregate。

### `WikiWorkspaceRepository`

負責組合工作區導覽 tree 所需的最小工作區參照。

#### 方法

- `listByAccountId(accountId)`

這個 port 服務的是 read-side composition，因此它的輸出也應視為 read model input，而不是 aggregate source of truth。

## Infrastructure Adapters

| Adapter | 作用 |
|---|---|
| `FirebaseWorkspaceRepository` | `WorkspaceRepository`、`WorkspaceCapabilityRepository`、`WorkspaceAccessRepository`、`WorkspaceLocationRepository` 的 Firestore 實作 |
| `FirebaseWorkspaceQueryRepository` | `WorkspaceQueryRepository` 的 Firebase / organization read-side 組裝實作 |
| `FirebaseWikiWorkspaceRepository` | `WikiWorkspaceRepository` 的 Firestore 參照查詢實作 |

## 設計規則

- repository 介面定義在 `domain/repositories/`
- infrastructure adapters 實作在 `infrastructure/`
- `application/` 只依賴 repository ports，不依賴 adapter 類別
- 跨模組 consumer 不直接 import repository implementation；一律透過 `api/` 或對應 interface adapter 使用

## Tactical Debt Notes

- supporting records 仍然物理上儲存在同一份 workspace document，但 application layer 已改為依賴專用 supporting ports
- `WorkspaceQueryRepository` 同時承擔 read-side translation，尤其是把 `organization` 資料翻譯成 `WorkspaceMemberView`
- 事件目前用於發布與整合，不用來作為 repository 的唯一狀態來源
````

## File: modules/workspace/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace

> **範圍：** 僅限 `modules/workspace/` bounded context 內

本文件除了領域名詞，也會用少量 DDD 元術語幫助閱讀 companion docs；這些術語是文件讀法，不是要取代 workspace 自己的通用語言。

## 戰略層級術語

| 術語 | 在 workspace 文件中的意思 |
|------|------------------------|
| Domain | 指 Xuanwu 這個整體知識平台業務域 |
| Subdomain | 指 workspace 所對應的協作容器問題空間；戰略分類屬於 generic subdomain |
| Bounded Context | 指 `modules/workspace/` 這個語言、模型與 adapter 的邊界 |

子域與限界上下文不是同一件事：subdomain 是業務問題空間；bounded context 是該語言與模型的實作/協作邊界。

同一個 subdomain 可以由一個或多個 bounded contexts 落地；workspace 文件只描述 `modules/workspace/` 這個 bounded context 的語言，不替整個 subdomain 代言所有詞彙。

## 核心術語

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作區 | `Workspace` | 協作容器的 aggregate root，代表一個工作區範圍 |
| 工作區 ID | `workspaceId` | `Workspace` 的業務識別子，也是跨 context 的範圍鍵 |
| 帳戶 ID | `accountId` | 擁有工作區的 account 或 organization 識別子 |
| 工作區生命週期 | `WorkspaceLifecycleState` | `preparatory | active | stopped` |
| 工作區可見性 | `WorkspaceVisibility` | `visible | hidden`，控制工作區是否可被發現 |

## Supporting Domain Objects

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作區授權 | `WorkspaceGrant` | 工作區上的直接授權記錄，描述 user/team 與 role 關係 |
| 工作區能力 | `Capability` | 目前掛載在工作區上的功能能力記錄 |
| 工作區位置 | `WorkspaceLocation` | 工作區底下帶 identity 的位置節點 |
| 工作區人員資訊 | `WorkspacePersonnel` | 工作區上的管理/監督/安全等角色參照集合 |
| 工作區地址 | `Address` | 工作區地址值型資料 |

## Read-side Projection Terms

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作區成員檢視 | `WorkspaceMemberView` | 由 workspace + organization 資料組裝出的成員查詢投影 |
| 工作區成員接入通道 | `WorkspaceMemberAccessChannel` | 成員透過 owner/direct/team/personnel 進入工作區的路徑描述 |
| 工作區帳戶節點 | `WikiAccountContentNode` | 用於導覽查詢的帳戶層節點 |
| 工作區導覽節點 | `WikiWorkspaceContentNode` | 用於導覽查詢的工作區節點 |
| 工作區導覽項 | `WikiContentItemNode` | 導覽/捷徑用的 read projection，不是 domain aggregate |

Projection / Read Model 是查詢導向的讀取模型。它可以為特定 driver 或查詢場景最佳化，但不應回頭成為 write-side truth。

## Domain Event Terms

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作區已建立事件 | `WorkspaceCreatedEvent` | 工作區建立後對外發布的 domain event 訊息 |
| 工作區生命週期已轉移事件 | `WorkspaceLifecycleTransitionedEvent` | 工作區生命週期改變後發布的 domain event |
| 工作區可見性已變更事件 | `WorkspaceVisibilityChangedEvent` | 工作區可見性變更後發布的 domain event |

## 行為語言（Behavioral Language）

| 行為 | 英文 | 在 workspace 中的語意 |
|------|------|------------------------|
| 建立工作區 | `create workspace` | 建立一個新的工作區協作容器，初始化 `workspaceId`、生命週期與可見性 |
| 啟用工作區 | `activate workspace` | 將工作區從 `preparatory` 推進到 `active`，表示它已進入可運作狀態 |
| 停止工作區 | `stop workspace` | 將工作區從 `active` 推進到 `stopped`，表示該範圍不再繼續運作 |
| 變更工作區可見性 | `change workspace visibility` | 在 `visible` 與 `hidden` 之間替換可見性，不改變工作區 identity |
| 掛載工作區能力 | `mount capabilities` | 將能力記錄掛到工作區範圍之下 |
| 授權工作區存取 | `grant workspace access` | 將 user / team / personnel 路徑的存取權授予工作區 |
| 建立工作區位置 | `create workspace location` | 在工作區範圍下建立帶 identity 的位置節點 |
| 發布工作區事件 | `publish workspace event` | 在 aggregate 狀態改變成功後，對外發布對應的 domain event |

這些行為語言描述的是「workspace 做什麼」，不是 UI 按鈕文案，也不是 framework callback 名稱。

## 不變條件（Invariants）

- `workspaceId` 一旦建立，就持續代表同一個工作區範圍
- `accountId` 與 `accountType` 在 workspace 建立後不應被重新指定
- `WorkspaceLifecycleState` 的 canonical 值只有 `preparatory | active | stopped`
- `WorkspaceVisibility` 的 canonical 值只有 `visible | hidden`
- `WorkspaceVisibility` 是曝光語意，不是生命週期語意；它不能取代 `WorkspaceLifecycleState`
- `WorkspaceName` 應維持為有效名稱值，而不是未經正規化的任意字串
- `WorkspaceMemberView` 與 `Wiki*Node` 是 projection / read model，不是 write-side truth
- 下游 bounded context 只能在有效的 `workspaceId` 範圍內對齊自己的資料與行為

更完整的 aggregate-level invariants 請看 [aggregates.md](./aggregates.md)。本節只記錄通用語言層級必須一致理解的規則。

## 狀態轉移語意（Transition Semantics）

### 生命週期語意

- `preparatory -> active`：工作區從準備中進入可運作狀態
- `active -> stopped`：工作區從運作中進入停止狀態
- `stopped`：目前語意上視為終止狀態，不等同 `archived`

### 可見性語意

- `visible -> hidden`：工作區仍存在，但不再以可發現狀態暴露
- `hidden -> visible`：工作區重新回到可發現狀態
- 可見性變化不等於生命週期變化；它不建立、刪除或重命名工作區

### 事件語意

- 建立工作區後可發布 `WorkspaceCreatedEvent`
- 生命週期發生有效轉移後可發布 `WorkspaceLifecycleTransitionedEvent`
- 可見性發生變更後可發布 `WorkspaceVisibilityChangedEvent`

## 命名守則

- aggregate 與 supporting objects 使用 `Workspace*` 前綴，保持 bounded context 可讀性
- `WorkspaceLifecycleState` 是 canonical 名稱，不使用 `WorkspaceStatus`
- `WorkspaceMemberView` 是 projection 名稱，不縮寫成 `WorkspaceMember`
- 若描述 query tree，使用 `WikiAccountContentNode` / `WikiWorkspaceContentNode` / `WikiContentItemNode`

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Workspace` | `Project`, `Space`, `Room` |
| `WorkspaceLifecycleState` | `WorkspaceStatus`, `ArchivedState` |
| `WorkspaceVisibility` | `VisibilityMode`, `DiscoveryState` |
| `WorkspaceMemberView` | `WorkspaceMember`, `Member`, `Participant` |
| `WikiAccountContentNode` / `WikiWorkspaceContentNode` | `WikiContentTree`, `PageTree`, `Hierarchy`（當你描述 aggregate 或 entity 時） |

## 語意說明

- `archived` 不是此 bounded context 的生命週期語言；停止中的工作區使用 `stopped`
- `WorkspaceMemberView` 與 `Wiki*Node` 是查詢模型，不等同 write-side domain objects
- `workspaceId` 是下游 context 對齊 workspace scope 的主要 published language
- 同一組 workspace 語言應在此 bounded context 的 domain、application、interfaces、infrastructure 中保持一致；只有在邊界上才翻譯外部語言

## 文件元術語對照

| 概念 | 在這組文件中的意思 |
|------|------------------|
| Entity（實體） | 類別 / 物件，具備 identity，語意上可跨時間被辨識 |
| Value Object（值對象） | 類別 / 物件，以值相等判斷語意，例如 `WorkspaceVisibility`、`Address` |
| Aggregate / Aggregate Root（聚合 / 聚合根） | 類別 / 物件，負責保護 write-side 一致性；workspace 的 aggregate root 是 `Workspace` |
| Repository（倉儲） | 介面或類別，負責 aggregate / projection 的資料存取 |
| Ports（端口） | 介面，定義內核與外部協作的接縫 |
| Adapters（適配器） | 類別 / 函式 / 模組，將 driver 或 external system 轉譯成內核可處理的契約 |
| 外部系統 / Driver（驅動器） | 從 bounded context 外部發起互動的角色 / 系統，例如 UI、Server Actions、其他 context 呼叫者 |
| Projection / Read Model | 查詢導向的讀取模型，例如 `WorkspaceMemberView`、`Wiki*Node` |
| Domain Service（領域服務） | 類別 / 函式，承載不自然屬於 aggregate / value object 的純領域規則 |
| Factory（工廠） | 類別 / 函式，負責建立 aggregate、value object、domain event 等有效模型 |
| Domain Event（領域事件） | 事件類別、訊息物件，作為對外發布的 domain language |
````

## File: modules/workspace/AGENT.md
````markdown
# AGENT.md — workspace BC

> **強制開發規範**  
> 本 BC 領域開發必須使用 Serena 指令：
> ```
> serena
> #use skill serena-mcp
> #use skill alistair-cockburn
> #use skill iddd-implementing-ddd
> #use skill xuanwu-app-skill
> #use skill context7

> ```

## 模組定位

`workspace` 是協作容器 bounded context，也是 Xuanwu 中的 generic subdomain。

它負責定義「工作區作為協作範圍」的核心語言與公開邊界，讓其他 bounded context 以 `workspaceId` 對齊範圍、生命週期與可見性。

`workspace` 不負責知識內容本身、組織成員真相來源、事件儲存基礎設施，也不把 UI tab 組裝視為 context map。

## 戰略層級（Domain / Subdomain / Bounded Context）

- `Xuanwu` 是整體 business domain
- `workspace` 所對應的問題空間在戰略分類上屬於 generic subdomain
- `modules/workspace/` 是承載這組語言、模型、應用流程與 adapter 的 bounded context
- `context-map.md` 描述 bounded context 與其他 bounded context 的關係；`aggregates.md`、`repositories.md`、`domain-events.md` 描述的是此 bounded context 內部的 tactical model
- Subdomain 是問題空間；Bounded Context 是語言、模型與整合邊界。兩者不可混同，也不保證一對一
- 這組文件是以 `workspace` 為中心的 selected view，不試圖重畫整個 Xuanwu domain

## Tactical 對位

- Aggregate Root：`Workspace`
- Driven Ports：`WorkspaceRepository`、`WorkspaceCapabilityRepository`、`WorkspaceAccessRepository`、`WorkspaceLocationRepository`、`WorkspaceQueryRepository`、`WikiWorkspaceRepository`、`WorkspaceDomainEventPublisher`
- Driving Adapters：`interfaces/_actions/`、`interfaces/queries/`、UI composition 與其他進入點
- Driven Adapters：`FirebaseWorkspaceRepository`、`FirebaseWorkspaceQueryRepository`、`FirebaseWikiWorkspaceRepository`、`SharedWorkspaceDomainEventPublisher`
- Projection / Read Model：`WorkspaceMemberView`、`WikiAccountContentNode`、`WikiWorkspaceContentNode`、`WikiContentItemNode`
- Read Projections：`WorkspaceMemberView`、`WikiAccountContentNode`、`WikiWorkspaceContentNode`
- Repository Ports：`WorkspaceRepository`、`WorkspaceCapabilityRepository`、`WorkspaceAccessRepository`、`WorkspaceLocationRepository`、`WorkspaceQueryRepository`、`WikiWorkspaceRepository`
- Domain Event Port：`WorkspaceDomainEventPublisher`
- Domain Events：`WorkspaceCreated`、`WorkspaceLifecycleTransitioned`、`WorkspaceVisibilityChanged`

## 六邊形交互順序（Runtime）

1. Driver 進入：UI / Server Actions / 其他 bounded context 呼叫 `api/`
2. Driving Adapter 轉換：`interfaces/*` 轉 command/query
3. Application Use Case 協調流程
4. Domain Model 套用 invariant（`Workspace` aggregate + value objects）
5. 透過 Driven Ports 呼叫外部能力（repositories / event publisher）
6. Infrastructure Adapters 實作 ports（Firebase / shared event publishing）

目前實際入口對位：

- `api/contracts.ts`：公開契約（types / events / value object helpers）
- `api/facade.ts`：公開行為入口（commands / queries）
- `api/ui.ts`：公開 UI composition surface（components / hooks / tab metadata）
- `ports/index.ts`：公開 port 抽象（repositories + event publisher port）

## 六邊形依賴方向（Compile-time）

- `interfaces -> application -> domain`
- `infrastructure -> domain`（實作 ports）
- `domain` 不可依賴 `interfaces`、`application`、`infrastructure`
- `modules/workspace/ports` 只放 port 抽象匯出，不放 adapter 實作

## DDD 概念對位（文件讀法）

- Entity（實體）→ 類別 / 物件；在 workspace 中例如 `WorkspaceLocation`、`Capability`
- Value Object（值對象）→ 類別 / 物件；在 workspace 中例如 `WorkspaceLifecycleState`、`WorkspaceVisibility`、`WorkspaceName`、`Address`
- Aggregate / Aggregate Root（聚合 / 聚合根）→ 類別 / 物件；此 BC 的 write-side aggregate root 是 `Workspace`
- Repository（倉儲）→ 介面或類別；`domain/repositories/` 定義 port，`infrastructure/` 類別負責資料存取
- Ports（端口）→ 介面；宣告 bounded context 核心與外部協作的接縫
- Adapters（適配器）→ 類別 / 函式 / 模組；把 driver 或外部系統轉成 port 可接受的契約
- 外部系統 / 驅動器（Driver）→ 從 bounded context 外部發起工作的角色 / 系統，例如 UI、Server Action、其他 context 呼叫者
- 投影 / Read Model → 查詢用途的物件；服務讀取與呈現，不承擔 write-side invariant
- Domain Service（領域服務）→ 類別 / 函式；僅在規則不自然屬於 aggregate 或 value object 時才新增
- Factory（工廠）→ 類別 / 函式；負責建立 aggregate、value object 或 domain event 訊息
- Domain Event（領域事件）→ 事件類別、訊息物件；例如 `WorkspaceCreatedEvent`

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Workspace` | Project、Space、Room |
| `WorkspaceLifecycleState` | WorkspaceStatus、ArchivedState |
| `WorkspaceVisibility` | VisibilityMode、DiscoveryState |
| `workspaceId` | projectId、spaceId |
| `accountId` | ownerId（在 workspace BC 內） |
| `WorkspaceMemberView` | `WorkspaceMember`（當你描述 read model 時） |
| `WikiAccountContentNode` / `WikiWorkspaceContentNode` | `WikiContentTree`（當你描述 aggregate 時） |

## 邊界規則

### ✅ 允許

```typescript
import { getWorkspaceById, WorkspaceDetailScreen } from "@/modules/workspace/interfaces/api";
import type { WorkspaceEntity } from "@/modules/workspace/interfaces/api";
```

### ❌ 禁止

```typescript
import { FirebaseWorkspaceRepository } from "@/modules/workspace/infrastructure/firebase/FirebaseWorkspaceRepository";
import { CreateWorkspaceUseCase } from "@/modules/workspace/application/use-cases/workspace.use-cases";
```

## 分層守衛

- `index.ts` 只能是薄入口；跨模組 consumer 應優先使用 `@/modules/workspace/api`
- `api/` 只能公開穩定 surface，不得直接變成 infrastructure 捷徑
- `interfaces/` 可使用本模組的 application/query adapters，但跨模組一律只能走對方 `api/`
- `infrastructure/` 禁止 import `api/`
- `FirebaseWikiWorkspaceRepository` 與 `FirebaseWorkspaceRepository` 之間維持本地相對路徑依賴，不透過模組公開入口繞回
- `modules/workspace` 內禁止 `import { X as Y } from ...` 的 alias import；若出現命名衝突，應調整符號命名或改為 namespace import 以維持通用語言一致性

## 六邊形對位

- Domain Model 在 bounded context 的核心：`domain/`
- Application layer 包在 domain model 外層：`application/`
- Driving Adapters 是進入此 bounded context 的入口：`interfaces/`、Server Actions、query wrappers、UI composition
- Driven Adapters 是對外技術整合：`infrastructure/`
- Repository ports 是內核朝外的 driven ports；adapter 可以替換，但 domain model 不應感知 Firebase / HTTP / React
- `api/` 是此 bounded context 對外暴露的穩定入口；它是公開邊界，不是把內部 layers 攤平
- 依賴方向維持 inward：`interfaces/` 與 `infrastructure/` 可以依賴 `application/`、`domain/`，但 `domain/` 不反向依賴外部技術
- 若採事件驅動整合，incoming / outgoing events 也是 bounded context 邊界的一部分，不改變 domain model 必須位於中心的原則
- Browser UI、Server Actions、其他 bounded context 對 `api/` 的呼叫者，都是此 hexagon 的 drivers；它們透過 adapters 進入，不直接碰 domain model
- `WorkspaceMemberView` 與 `Wiki*Node` 屬於 read model / projection，位於 query-side，不應回頭冒充 aggregate

## Tactical 建模守則

- `WorkspaceMemberView` 是 read projection，不是 aggregate、entity 或 value object
- `WikiContentTree.ts` 目前承載的是導覽/查詢模型，不是 write-side aggregate
- `WorkspaceLifecycleState` 的 canonical 值是 `preparatory | active | stopped`，不是 `active | archived`
- 若要新增跨 aggregate 規則，先判斷是否真的需要 domain service；不要用 application service 假裝 aggregate

## 驗證命令

```bash
npm run lint
npm run build
```

## 詳細文件

| 文件 | 說明 |
|---|---|
| [README.md](./README.md) | 模組定位與 tactical model 總覽 |
| [subdomain.md](./subdomain.md) | workspace 為何屬於 generic subdomain，以及哪些內容不是 subdomain 本體 |
| [bounded-context.md](./bounded-context.md) | workspace 作為 bounded context 的邊界、drivers、ports、adapters 與 read model |
| [ubiquitous-language.md](./ubiquitous-language.md) | workspace BC 的通用語言、read model 與 hexagonal 元術語 |
| [aggregates.md](./aggregates.md) | aggregate、entity、value object 與 read model / projection 對位 |
| [repositories.md](./repositories.md) | driven ports、repository adapters 與 query/read model 持久化邊界 |
| [domain-events.md](./domain-events.md) | workspace 領域事件契約、事件驅動整合與 projection 關係 |
| [application-services.md](./application-services.md) | application layer use cases、drivers、ports、adapters 與 read model orchestration |
| [domain-services.md](./domain-services.md) | domain service 與 ports/adapters/drivers/read models 的區別 |
| [context-map.md](./context-map.md) | workspace 與其他 bounded context 的 integration patterns |
| [ports/README.md](./ports/README.md) | workspace ports 清單、交互順序與依賴方向 |
````