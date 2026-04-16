# 問題七：packages & py_fn — 完整遷移到 src/ 後的設計

**Date**: 2026-04-16  
**Context**: `src/modules/` 蒸餾完成。討論 packages 和 py_fn 在 src/ 架構完全落地後的重新定位。

---

## 背景：現況快照

```
packages/          ← TypeScript 共用庫（18個）
py_fn/             ← Python Firebase Functions（RAG ingestion, embedding）
src/modules/       ← 8 個蒸餾後的六邊形模組（已完成）
```

核心問題：
- `packages/shared-hooks`、`packages/shared-validators` 包含了本應在 `src/modules/` 的邏輯
- `packages/integration-firebase` 被多個層直接引用（不只是 adapters/outbound/）
- `py_fn/` 本身已是六邊形結構，但與 `src/modules/` 的邊界契約尚未明確定義

---

## packages：重新定位

### 現況問題分析

| Package | 現況問題 |
|---|---|
| `shared-hooks` | `useAppStore` 是 Zustand store，屬 platform module 的事，不應在 packages |
| `shared-validators` | `taskSchema`, `paginationSchema` 是業務語意，屬 `src/modules/*/domain/` |
| `shared-types` | `DomainEvent`, `BaseEntitySchema` 是核心基礎型別，**正確位置** |
| `shared-events` | EventRecord + EventBus + QStash transport，**正確位置** |
| `shared-constants` | 應檢查是否混入業務常數 |
| `integration-firebase` | client/admin SDK 封裝，**正確位置**，但要確保只被 adapters/outbound 引用 |
| `integration-http` | HTTP client 封裝，**正確位置** |
| `ui-shadcn` | UI primitive，**正確位置** |
| `ui-vis` | 視覺化元件，**正確位置** |
| `lib-*`（11 個） | 第三方薄包裝，**正確位置** |
| `api-contracts` | REST/GraphQL 型別，需按語意分類遷移 |

### packages 清理原則

```
保留（不動）:
  @shared-types      ← DomainEvent, BaseEntitySchema 等跨域基礎型別
  @shared-events     ← EventRecord, EventBus, QStash transport
  @integration-*     ← Firebase, HTTP client（但限制引用層）
  @ui-shadcn         ← UI primitives（加 compositions/ 子層，見問題六）
  @ui-vis            ← 視覺化元件
  @lib-*             ← 所有第三方薄包裝

遷移（移出 packages）:
  shared-hooks → 業務相關 store 移入 src/modules/platform/adapters/inbound/react/
  shared-validators → taskSchema 等業務 schema 移入 src/modules/workspace/domain/
  api-contracts → published language tokens 移入 src/modules/<context>/api/
                  純 wire 型別留在 api-contracts 或 integration-http

廢棄（最終刪除）:
  shared-hooks（清空後）
```

### 引用層守則

```
@shared-types, @shared-events → 任何層均可引用（零業務邏輯）
@lib-*                        → 任何層均可引用（薄包裝，無語意）
@integration-firebase         → 只允許 src/modules/*/adapters/outbound/ 引用
@integration-http             → 只允許 src/modules/*/adapters/outbound/ 引用
@ui-shadcn, @ui-vis           → 只允許 src/modules/*/adapters/inbound/react/ 引用
```

**執行方式**：透過 `eslint.config.mjs` 的 `restricted-imports` 規則自動強制。

---

## py_fn：整入六邊形架構 vs 重新設計

### py_fn 現況

```
py_fn/src/
  domain/           ← value_objects/rag.py, repositories/rag.py, services/
  application/      ← use_cases/rag_ingestion.py, rag_query.py, ports/output/gateways.py
  infrastructure/   ← external/openai/, external/upstash/, persistence/firestore/
  interface/        ← handlers/parse_document.py, rag_query_handler.py
  app/              ← bootstrap/, container/runtime_dependencies.py
  core/             ← config.py
```

**結論：py_fn 已有良好的六邊形結構，不需要重新設計基礎架構**。

問題不是架構，而是**邊界契約不明確**：
- py_fn 的 domain（RAG entities）與 `src/modules/ai/` 的 domain（Chunk, Embedding）有概念重疊
- py_fn 被觸發的 input contract（QStash payload shape）沒有明確的 published language 定義
- py_fn 寫入 Firestore 的 schema 沒有對應到 `src/modules/*/adapters/outbound/` 的期望

### py_fn 設計方向：Worker Runtime 定位

```
py_fn/ = Python Worker Runtime
  職責：parsing, cleaning, chunking, embedding, vector-write
  觸發：QStash message（from src/modules/ adapters/outbound）或 Firestore trigger
  輸出：Firestore documents + Upstash Vector entries
  不擁有：session, auth, workspace lifecycle（這些在 Next.js 端）
```

### 邊界契約定義（需補充）

**現在缺失的**：`src/modules/ai/` 需要在 **outbound adapter** 定義 QStash payload DTO。

> ⚠️ 注意：QStash payload 是 **outbound dispatcher 的輸出 DTO**，不是 `api/` 層的合約。  
> `api/` 只存在 `modules/<context>/`（完整六邊形），`src/modules/` lean skeleton 的 subdomain 沒有 `api/`。  
> 詳見 → `docs/discussions/2026-04-16/08-ai-subdomain-api-correction.md`

```typescript
// src/modules/ai/subdomains/embedding/adapters/outbound/dto/embedding-job-payload.ts
import { z } from 'zod';

export const EmbeddingJobPayloadSchema = z.object({
  jobId: z.string().uuid(),
  documentId: z.string(),
  workspaceId: z.string(),
  chunkIds: z.array(z.string()).min(1),
  modelHint: z.string().optional(),
  requestedAt: z.string().datetime(),
});

export type EmbeddingJobPayload = z.infer<typeof EmbeddingJobPayloadSchema>;
```

`py_fn` 的 `interface/handlers/rag_ingestion.py` 在接收 QStash message 時，用 Python Pydantic 實作相同 schema 的鏡像驗證。

### py_fn domain 與 src/modules/ai domain 的關係

| 概念 | src/modules/ai （TypeScript） | py_fn/src/domain （Python） |
|---|---|---|
| Chunk | `Chunk` entity | `RagChunk` value object（相同語意，不同語言） |
| Embedding | `Embedding` entity | infrastructure 層（OpenAI client 直接產出） |
| Document | 參照自 notion 的 published token | `DocumentArtifact` value object |
| Vector | `VectorRetrievalPort` 定義 contract | `upstash/vector_client.py` 實作 |

**規則**：兩邊不共享程式碼（不同語言），但共享**概念語言**（透過 published language 文件定義）。

### py_fn 不應被整入 src/

**不整合的理由**：
1. Python ≠ TypeScript，無法共用 module 結構
2. py_fn 是獨立部署單元（Firebase Functions）
3. py_fn 的依賴（OpenAI, Upstash SDK）是 Python 生態
4. 整合只會增加複雜度，違背 Occam's Razor

**正確的整合點**：透過**明確的 cross-runtime 契約**（QStash schema、Firestore schema），而非程式碼共享。

---

## 跨 runtime 契約地圖

```
src/modules/ai/subdomains/embedding/adapters/outbound/dto/
  embedding-job-payload.ts    ← QStash message payload（TypeScript定義，outbound DTO）

py_fn/src/application/dto/
  rag.py: RagIngestionInput   ← QStash message payload（Python鏡像，Pydantic）

src/modules/platform/subdomains/file-storage/
  FileIngestionEvent          ← Firestore trigger event（TypeScript定義）

py_fn/src/interface/handlers/
  parse_document.py           ← Firestore trigger handler（Python實作）
```

---

## 結論

| 問題 | 答案 |
|---|---|
| packages 要重新設計嗎？ | 不需要完全重設計；清理 2–3 個誤放邏輯的 package，加強 eslint 引用層守則即可 |
| py_fn 要整入六邊形架構嗎？ | py_fn 本身已是六邊形結構；不整入 src/，改用 published language 契約定義跨 runtime 邊界 |
| 最重要的一步 | 在 `src/modules/ai/api/` 定義 QStash payload schema，py_fn 鏡像實作 — 這是目前最大的缺口 |

---

## 行動清單

| 優先級 | 動作 |
|---|---|
| P0 | 在 `src/modules/ai/subdomains/embedding/adapters/outbound/dto/` 定義 `EmbeddingJobPayload` schema |
| P0 | 在 `src/modules/ai/subdomains/chunk/adapters/outbound/dto/` 定義 `ChunkJobPayload` schema |
| P1 | `shared-hooks` 中的業務 store 遷移到 `src/modules/platform/adapters/inbound/react/` |
| P1 | `shared-validators` 中的業務 schema 遷移到對應 domain/ |
| P2 | `api-contracts` published language tokens 遷移到 `src/modules/*/api/`（完整六邊形層） |
| P2 | `eslint.config.mjs` 加入 integration-* 只允許 adapters/outbound 引用的規則 |
| P3 | py_fn `application/dto/rag.py` 更新以鏡像 TypeScript published language |

> ⚠️ P0 修正：原文件建議的 `subdomains/*/api/` 路徑已在問題八中修正為 `adapters/outbound/dto/`。
