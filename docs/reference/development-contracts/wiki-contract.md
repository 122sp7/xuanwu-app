---
title: Wiki development contract
description: Implementation contract for the Wiki module — modern knowledge hub with sidebar organization/workspace knowledge, wiki pages, and RAG pipeline integration.
---

# Wiki development contract

## Purpose

This contract defines the Wiki module as the **現代型知識中樞** for xuanwu-app:

- a sidebar-driven knowledge hub surfacing organization-level and workspace-level knowledge
- the migration target for existing `OrganizationKnowledgeTab` and `WorkspaceKnowledgeTab`
- the UI entry point for the full-stack RAG pipeline (ingestion + query)

## Current owner and dependencies

| Concern | Owner |
| --- | --- |
| Wiki page stub UI | `app/(shell)/wiki/page.tsx` |
| Organization knowledge tab | `modules/knowledge/interfaces/components/OrganizationKnowledgeTab.tsx` |
| Workspace knowledge tab | `modules/knowledge/interfaces/components/WorkspaceKnowledgeTab.tsx` |
| Knowledge read-side summary | `modules/knowledge` |
| Document metadata + lifecycle | `modules/knowledge` (target: `modules/wiki`) |
| File upload registration | `modules/file` |
| Ingestion worker | `libs/firebase/functions-python` |
| Chunk persistence + vector index | `modules/knowledge` infrastructure |
| RAG query flow | `modules/ai` (Genkit) |

## Bounded contexts

| Context | Responsibility |
| --- | --- |
| Wiki Page Context | create, read, update, archive wiki pages with scope (organization / workspace / private) |
| Knowledge Sidebar Context | surface organization knowledge nodes and workspace knowledge nodes in wiki sidebar |
| Ingestion Context | register documents, trigger worker, track status lifecycle |
| Retrieval Context | embed query, vector search, context assembly, LLM answer generation |
| Governance Context | access control, archive, version rollback, audit log |

## Wiki page entity

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `pageId` | `string` | yes | UUID v4 |
| `organizationId` | `string` | yes | Organization boundary |
| `workspaceId` | `string` | no | null = organization-scoped |
| `title` | `string` | yes | Display title |
| `content` | `string` | no | Markdown body |
| `scope` | `"organization" \| "workspace" \| "private"` | yes | Knowledge visibility tier |
| `parentPageId` | `string` | no | Hierarchical nesting |
| `order` | `number` | yes | Sidebar sort order |
| `isArchived` | `boolean` | yes | Archive flag |
| `createdBy` | `string` | yes | accountId of creator |
| `createdAtISO` | `string` | yes | ISO-8601 |
| `updatedAtISO` | `string` | yes | ISO-8601 |

## Knowledge node entity (sidebar)

A knowledge node is a lightweight sidebar entry pointing at an existing knowledge document or wiki page.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `nodeId` | `string` | yes | UUID v4 |
| `organizationId` | `string` | yes | Org boundary |
| `workspaceId` | `string` | no | null = organization-level node |
| `type` | `"wiki-page" \| "knowledge-doc" \| "folder"` | yes | Node kind |
| `refId` | `string` | no | pageId or documentId being referenced |
| `label` | `string` | yes | Sidebar display label |
| `icon` | `string` | no | Lucide icon name |
| `order` | `number` | yes | Sidebar sort order |
| `parentNodeId` | `string` | no | Parent folder node |

## Sidebar contract

The wiki sidebar must always surface:

1. **組織知識庫** (organization knowledge) — cross-workspace knowledge documents with taxonomy browse and RAG search entry point
2. **工作區知識** (workspace knowledge) — per-workspace document list grouped by workspace
3. **Wiki 頁面** — organization-scoped and workspace-scoped wiki pages
4. **私人** — private pages owned by the authenticated user
5. **封存** — archived pages (collapsed by default)

The sidebar node list is the canonical navigation for all knowledge surfaces. The existing `OrganizationKnowledgeTab` and `WorkspaceKnowledgeTab` components are migration sources; their content will progressively move to the wiki sidebar.

## RAG pipeline contract

### Taxonomy contract

The `taxonomy` field is the canonical classification label applied at document level during ingestion.

#### Allowed taxonomy values

| Value | Description |
| --- | --- |
| `规章制度` | Company rules, compliance, HR policies |
| `技術文件` | Architecture docs, API specs, ADRs |
| `產品手冊` | Product documentation, release notes |
| `操作指南` | SOPs, how-to guides, runbooks |
| `政策文件` | Security policy, privacy statements |
| `訓練教材` | Training materials, onboarding content |
| `研究報告` | Market research, user research, analysis |
| `其他` | Uncategorized documents |

Rules:
- `taxonomy` must be set on the `documents` record **before** the ingestion worker starts chunking.
- Each `chunks` record must inherit `taxonomy` from its parent document.
- `taxonomy` is a required pre-filter in all RAG vector queries (along with `organizationId` and `isLatest`).
- Custom taxonomy values may be added via org-level `taxonomyConfig` collection; the enum above is the default baseline.

### Embedding model contract

| Field | Value |
| --- | --- |
| Model | `text-embedding-3-small` (default) |
| Dimensions | **1536** |
| Firestore field | `chunks.embedding` → `number[]` (float64[1536]) |
| Model version tracking | `chunks.embeddingModel` (string) + `chunks.embeddingDimensions` (number) |
| Batch size | ≤ 20 chunks per OpenAI API call |
| Max tokens per chunk | 512 tokens (for embedding input) |
| API key env var | `OPENAI_API_KEY` in Cloud Functions secrets |
| Retry on 429 | Exponential backoff, max 5 retries |
| Retry on 5xx | Fixed 2s delay, max 3 retries |

### File upload contract

#### documentId generation

```
documentId = "doc_" + UUID_v4().replace(/-/g, "").slice(0, 16)
// Example: doc_4b2a1c3d8e9f0a12
```

Rules:
- `documentId` is immutable once created — rename, reprocess, or version bumps do NOT change it.
- `sourceFileName` stores the original filename and is never used as a storage key.
- `title` is the editable display name, initially equal to `sourceFileName`.

#### Storage path (canonical)

```
organizations/{organizationId}/workspaces/{workspaceId}/documents/{documentId}/raw/source{ext}
```

Examples:
```
organizations/org_abc/workspaces/ws_xyz/documents/doc_4b2a1c3d8e9f0a12/raw/source.pdf
organizations/org_abc/workspaces/ws_xyz/documents/doc_7c9e3f1a2b4d6e8f/raw/source.docx
```

Derived output paths (written by ingestion worker):
```
.../documents/{documentId}/derived/normalized.md
.../documents/{documentId}/derived/layout.json
```

#### Upload validation rules

| Rule | Constraint |
| --- | --- |
| Allowed MIME types | `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `application/msword`, `text/html`, `text/plain`, `text/markdown` |
| Allowed extensions | `.pdf`, `.docx`, `.doc`, `.html`, `.htm`, `.txt`, `.md` |
| Max file size | 50 MB |
| Min file size | 1 KB |
| displayName max length | 255 characters |
| taxonomy | Required; must be a valid taxonomy enum value |
| language | ISO 639-1; defaults to `zh-TW` |
| accessControl | Defaults to `["Admin", "Member"]` |

#### Firestore vector index (required before first write)

`firestore.indexes.json` must include:

```json
{
  "fieldOverrides": [
    {
      "collectionGroup": "chunks",
      "fieldPath": "embedding",
      "indexes": [],
      "vectorConfig": { "dimension": 1536, "flat": {} }
    }
  ]
}
```

Composite index for pre-filtering before vector search:
```json
{
  "collectionGroup": "chunks",
  "queryScope": "COLLECTION_GROUP",
  "fields": [
    { "fieldPath": "organizationId", "order": "ASCENDING" },
    { "fieldPath": "isLatest",       "order": "ASCENDING" },
    { "fieldPath": "taxonomy",       "order": "ASCENDING" }
  ]
}
```

### Ingestion entry points

| Step | Owner | Input | Output |
| --- | --- | --- | --- |
| File upload | `modules/file` | binary + metadata | `storage_path`, `fileId`, Firestore `documents` record (`status: uploaded`) |
| Ingestion trigger | Cloud Functions (Python) | Firestore document created event | starts processing pipeline |
| Parsing | Cloud Functions | raw file | normalized text |
| Chunking | Cloud Functions | normalized text | `chunks[]` with `chunkIndex`, `page`, `taxonomy` |
| Embedding | Cloud Functions | chunk text | `vector` (float[]) |
| Chunk persistence | Cloud Functions | chunk + vector | Firestore `chunks/{chunkId}` |
| Status update | Cloud Functions | completion | `documents/{documentId}.status = "ready"` |

### Query entry points

| Step | Owner | Input | Output |
| --- | --- | --- | --- |
| User query | `app/(shell)/wiki` → Server Action | `query: string`, `organizationId`, `workspaceId?` | streaming answer |
| Query preprocess | Genkit Flow | raw query | normalized query + intent |
| Query embedding | Genkit / embedding model | normalized query | `queryVector: float[]` |
| Vector search | Firestore Vector Search | `queryVector`, filters | `TopKChunk[]` |
| Context assembly | Genkit Flow | `TopKChunk[]` | `promptContext: string` |
| LLM generation | Genkit LLM | `promptContext` + `query` | streamed answer text |

### Required query filters

All RAG queries **must** include:

| Filter | Reason |
| --- | --- |
| `organizationId` | tenant isolation |
| `isLatest: true` | exclude stale document versions |
| `accessControl in userRoles` | RBAC enforcement |

Optional filters: `workspaceId`, `taxonomy`, `department`, `language`.

## State machine

### Wiki page lifecycle

```
draft → published → archived
  ↑                    ↓
  └────── restored ────┘
```

| State | Trigger | Allowed next states |
| --- | --- | --- |
| `draft` | page created | `published`, `archived` |
| `published` | user publishes | `archived` |
| `archived` | user archives | `published` (restore) |

### Knowledge document lifecycle (inherited from knowledge module)

```
uploaded → processing → ready
                ↓          ↓
             failed      archived
                ↓
           processing  (retry)
```

See `docs/reference/development-contracts/knowledge-contract.md` for full detail.

## Module structure contract

When `modules/wiki/` is created, it must follow the MDDD layering:

```
modules/wiki/
├── domain/          ← entities, ports, value objects only
├── application/     ← use-cases, orchestration only
├── infrastructure/  ← Firestore adapters only
└── interfaces/      ← Server Actions, queries, React components
```

Dependency direction: `interfaces → application → domain ← infrastructure`

## UI/UX delivery contract (wiki sidebar)

### Required sidebar states

| State | Trigger | Required behavior |
| --- | --- | --- |
| `loading` | sidebar nodes query in-flight | skeleton placeholder, no stale content |
| `loaded` | nodes query succeeds | render organization knowledge + workspace knowledge + wiki pages |
| `error` | nodes query fails | show fallback message, keep section headings visible |
| `empty` | no nodes in a section | show empty state CTA (e.g. "新增頁面" button) |

### Required sidebar behaviors

1. Sidebar must always show the three knowledge tiers (organization / workspace / private) even when empty.
2. Organization knowledge section shows cross-workspace document count and a RAG search entry.
3. Workspace knowledge section groups nodes by workspace; each workspace shows its document count and status badge.
4. Clicking a knowledge-doc node navigates to the wiki page view for that document or opens a document detail drawer.
5. RAG search input in the sidebar (or wiki page header) must forward to the query pipeline entry point.

## Invariants

1. `modules/wiki` owns wiki page aggregates; it does not own knowledge document write-side or ingestion lifecycle.
2. Knowledge document ownership remains in `modules/knowledge` and `modules/file` until an explicit ownership transfer is defined.
3. The wiki sidebar is a read surface; it does not hold mutable business state.
4. All RAG queries must pass `organizationId`, `isLatest`, and `accessControl` filters.
5. Wiki pages and knowledge documents share the same sidebar tree but maintain separate Firestore collections.

## Acceptance gates

Before expanding beyond the current stub page:

1. `modules/wiki/domain` defines `WikiPage` entity and `KnowledgeNode` entity with TypeScript types.
2. `WikiSidebar` component renders organization knowledge nodes and workspace knowledge nodes from query results.
3. At least one Server Action (`createWikiPage`) and one query (`listWikiSidebar`) are implemented and tested.
4. Organization knowledge and workspace knowledge are visible in the wiki sidebar (migrated from tabs).
5. RAG search entry point in the sidebar forwards user queries to a Genkit flow stub.

## Shipped UI surface (current stub)

| Surface | Location |
| --- | --- |
| Wiki page stub | `app/(shell)/wiki/page.tsx` |
| Organization knowledge tab | `modules/knowledge/interfaces/components/OrganizationKnowledgeTab.tsx` |
| Workspace knowledge tab | `modules/knowledge/interfaces/components/WorkspaceKnowledgeTab.tsx` |

These are the migration source components. Their functionality will progressively move to `modules/wiki/interfaces/components/WikiSidebar.tsx` as the wiki knowledge hub is built out.

---

## `core/wiki-core` 域層合約（Domain Contracts）

> 本節記載目前已在 `core/wiki-core` 中實作的全部公開合約。
> 模組實作者引用 `@/core/wiki-core` 時，以此為正式 API 界面。

### 定義：`WikiDocument`

```typescript
// 目前實作欄位（下一階段待補充）
class WikiDocument {
  id: string          // 'TODO_ID' → 應改為 doc_ + 16hex
  title: string
  content: string
  status: WikiDocumentStatus  // 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: Date

  publish(): void
  archive(): void
}
```

**需補充欄位（Phase 1）**
```typescript
// 待新増
 organizationId: string
 workspaceId: string
 scope: 'organization' | 'workspace' | 'private'
 taxonomy: Taxonomy
 accessControl: AccessControl
 embedding?: Embedding
```

### 定義：Value Objects

| 類別 | 合約 |
|------|---------|
| `AccessControl` | `ownerId: string`, `visibility: 'PUBLIC' \| 'PRIVATE' \| 'INTERNAL'`; `canAccess(userId)` |
| `ContentStatus` | `value: 'DRAFT' \| 'PUBLISHED' \| 'ARCHIVED'`; `isSearchable: boolean` |
| `Taxonomy` | `category: string`, `tags: string[]` (小寫 + 去重), `namespace: string` (default `'default'`); `equals(other)` |
| `Vector` | `values: number[]` (不可為空) |
| `Embedding` | `values: number[]`, `model: string` (非空), `dimensions: number` (必須 = values.length); `isCompatibleWith(other)` |
| `SearchFilter` | `category?: string`, `tags: string[]`, `dateRange?: { start, end }` |
| `WikiDocumentSummary` | `{ id, title, status }`; `toJSON()` |
| `UsageStats` | `viewCount: number`, `lastAccessedAt: Date \| null` |

### 定義：Repository Ports

```typescript
// wiki document 持久化
 interface IWikiDocumentRepository {
   save(entity: WikiDocument): Promise<void>
   findById(id: string): Promise<WikiDocument | null>
   search(vector: number[]): Promise<WikiDocument[]>
 }

// knowledge summary 讀取
 interface IKnowledgeSummaryRepository {
   summarize(scope: IKnowledgeSummaryScope): WorkspaceKnowledgeSummary
 }

// vector 定向搜尋
 interface IRetrievalRepository {
   searchByVector(vector: number[], topK: number): Promise<RetrievalHit[]>
   searchByMetadata(filter: string, vector: number[]): Promise<WikiDocument[]>
 }

// embedding 生成
 interface IEmbeddingRepository {
   embed(dto: EmbedTextDTO): Promise<Embedding>
   embedBatch(dtos: EmbedTextDTO[]): Promise<Embedding[]>  // max 20 per call
 }
```

### 定義：Domain Service

```typescript
// 純函式，無 infra 依賴
function deriveKnowledgeSummary(
  workspace: KnowledgeWorkspaceSnapshot,
  copy: KnowledgeSummaryCopy,
): WorkspaceKnowledgeSummary
```

**對象**：`WorkspaceKnowledgeSummary`—工作區知識健康狀況的唯讀數據摘要模型，包含：
`registeredAssetCount`, `readyAssetCount`, `supportedSourceCount`,
`status: 'needs-input' | 'staged' | 'ready'`, `blockedReasons`, `nextActions`

### 定義：Application Use Cases

```typescript
// 建立 wiki 文件
class CreateWikiDocumentUseCase {
  execute(dto: CreateWikiDocumentDTO): Promise<WikiDocument>
}
interface CreateWikiDocumentDTO { title: string; content: string }

// 取得工作區知識摘要
class GetWorkspaceKnowledgeSummaryUseCase {
  execute(scope: IKnowledgeSummaryScope): WorkspaceKnowledgeSummary
}
interface IKnowledgeSummaryScope { workspaceId: string }
```

### 定義：Infrastructure 限制條件

| 宣告 | 實作狀態 |
|------|------|
| `UPSTASH_VECTOR_REST_URL` + `UPSTASH_VECTOR_REST_TOKEN` 欄位不得為空 | ✅ 已實作 |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` 欄位不得為空 | ✅ 已實作 |
| Upstash Vector cache TTL 預設 3600 秒 | ✅ 已實作 |
| Upstash Vector 連綫 timeout 5000 ms | ✅ 已實作 |
| `UpstashWikiDocumentRepository` 主要方法尚未實作 | 🔲 缺口 |
| `IEmbeddingRepository` 的 TypeScript 端適配器尚未實作 | 🔲 缺口 |

### 定義：`Embedding` 不變性

1. `values` 不可為空
2. `values.length === dimensions`，違反拋出 `Error`
3. `model` 不可為空字串
4. 不同 model 的 Embedding 不得相互比較（透過 `isCompatibleWith` 檢查）
5. `IEmbeddingRepository.embedBatch` 輸入數量上限 20

### 定義：Public API（`@/core/wiki-core` 導出清單）

```typescript
// Entities
export { WikiDocument }
export type { WikiDocumentStatus, WorkspaceKnowledgeSummary, WorkspaceKnowledgeStatus }

// Ports
export type { IWikiDocumentRepository, IKnowledgeSummaryRepository,
              IKnowledgeSummaryScope, IRetrievalRepository, RetrievalHit,
              IEmbeddingRepository, EmbedTextDTO }

// Domain Service
export { deriveKnowledgeSummary }
export type { KnowledgeSummaryCopy, KnowledgeWorkspaceSnapshot }

// Value Objects
export { AccessControl, ContentStatus, WikiDocumentSummary,
         SearchFilter, Taxonomy, UsageStats, Vector, Embedding }
export type { Visibility, ContentStatusValue, WikiDocumentSummaryProps,
              DateRange, EmbeddingProps }

// Application
export { CreateWikiDocumentUseCase, GetWorkspaceKnowledgeSummaryUseCase }
export type { CreateWikiDocumentDTO }

// Infrastructure
export { UpstashWikiDocumentRepository }

// Interfaces
export { WikiController }
```
