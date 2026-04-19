# fn ↔ TypeScript 能力橋接指南

## 背景：三層模型的真實狀態

[workspace-nav-notion-notebooklm-implementation-guide.md](./workspace-nav-notion-notebooklm-implementation-guide.md)
中的「三層模型對照表」列出了 `notebooklm` 與 `notion` 的資料層與行為層。
但那份文件對「行為層」的描述是**設計目標**，不是**當前狀態**。

實際情況是：

| 層次 | TypeScript (`src/modules/`) | fn |
|---|---|---|
| Domain entities | ✅ 存在（`Document.ts`, `Notebook.ts` 等） | ✅ 存在（domain value objects） |
| Use case stubs | ✅ 存在（InMemory 版，可測試） | ✅ 完整實作 |
| Infrastructure adapters | ❌ 只有 `InMemoryRepository`，無 Firestore 實作 | ✅ 真實 Firestore + Vector + Storage |
| HTTP / Callable entry points | ❌ 無 | ✅ Firebase Functions 已部署 |

**本文件的目的**：說明 fn 已具備的能力、TypeScript 側缺少什麼、以及如何用最小變動接通兩端。

---

## 1. fn 現有能力清單（已部署 Firebase Functions）

### 1.1 Cloud Storage Trigger（自動觸發）

| Function | 觸發條件 | 能力 |
|---|---|---|
| `on_document_uploaded` | GCS `uploads/` 前綴有新物件 | 自動啟動完整 parse + RAG 流程 |

**流程步驟**：
```
GCS upload (uploads/{accountId}/{file})
  → init_document()         → Firestore: accounts/{accountId}/documents/{docId} status=processing
  → process_document_gcs()  → Document AI: 解析 PDF/TIFF/PNG/JPEG → 取得 text + page_count
  → upload_json()           → GCS: files/ 前綴寫入 parsed JSON
  → update_parsed()         → Firestore: status=completed, parsed.json_gcs_uri, parsed.page_count
  → ingest_document_for_rag() → clean → chunk → embed (OpenAI) → upsert (Upstash Vector + Search)
  → mark_rag_ready()        → Firestore: rag.status=ready, rag.chunk_count, rag.vector_count
```

### 1.2 HTTPS Callable（前端主動呼叫）

| Callable 名稱 | 用途 | 必填參數 |
|---|---|---|
| `parse_document` | 手動觸發單一文件的 Document AI 解析 + RAG | `account_id`, `workspace_id`, `gcs_uri` |
| `rag_query` | RAG 檢索 + 生成查詢 | `account_id`, `workspace_id`, `query` |
| `rag_reindex_document` | 重新執行 normalization + chunk + embed | `account_id`, `doc_id` |

### 1.3 Firestore Document Schema（fn 寫入）

Collection path: `accounts/{accountId}/documents/{docId}`

```typescript
// TypeScript 型別對應（用於 Firestore adapter 讀取）
interface FirestoreDocumentRecord {
  id: string;
  title: string;
  status: "processing" | "completed" | "error";
  account_id: string;
  spaceId?: string;          // = workspaceId
  source: {
    gcs_uri: string;
    filename: string;
    display_name: string;
    original_filename: string;
    size_bytes: number;
    uploaded_at: Timestamp;
    mime_type: string;
  };
  parsed?: {
    json_gcs_uri: string;
    page_count: number;
    parsed_at: Timestamp;
    extraction_ms: number;
  };
  rag?: {
    status: "ready" | "error";
    chunk_count: number;
    vector_count: number;
    embedding_model: string;
    embedding_dimensions: number;
    indexed_at: Timestamp;
  };
  error?: {
    message: string;
    timestamp: Timestamp;
  };
  metadata?: {
    filename: string;
    display_name: string;
    space_id?: string;
  };
}
```

---

## 2. TypeScript 側目前狀態（src/modules/）

### 2.1 已存在（可用）

```
src/modules/notebooklm/subdomains/document/
├── domain/entities/Document.ts          ✅ DDD 聚合根（含 create/archive/delete + domain events）
├── domain/repositories/DocumentRepository.ts  ✅ Repository 介面
├── application/use-cases/DocumentUseCases.ts  ✅ AddDocument / ArchiveDocument / QueryDocuments
└── adapters/outbound/memory/InMemoryDocumentRepository.ts  ✅ InMemory 實作（供測試用）
```

### 2.2 缺少的（需要實作）

```
src/modules/notebooklm/subdomains/document/
├── adapters/outbound/firestore/
│   └── FirestoreDocumentRepository.ts   ❌ 讀取 accounts/{accountId}/documents
├── adapters/inbound/server-actions/
│   └── document-actions.ts              ❌ uploadDocument / queryDocuments / triggerParse
└── adapters/inbound/react/
    └── NotebooklmSourcesSection.tsx     ❌ UI 組件（Sources tab）
```

### 2.3 Notebook 子域（notebooklm.notebook tab）

`notebooklm.notebook` 用的是 RAG 查詢能力，需要橋接 `rag_query` callable。
目前缺：

```
src/modules/notebooklm/subdomains/notebook/
├── adapters/outbound/callable/
│   └── FirebaseRagQueryAdapter.ts       ❌ 呼叫 fn rag_query callable
└── adapters/inbound/server-actions/
    └── notebook-actions.ts              ❌ ragQuery server action
```

---

## 3. 橋接模式

### 3.1 模式 A：Firestore 訂閱（即時列表）

用於讀取已存在的資料（Documents 列表、狀態更新）。

```typescript
// src/modules/notebooklm/subdomains/document/adapters/outbound/firestore/FirestoreDocumentRepository.ts
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { getFirestore } from "@integration-firebase/firestore";
import type { DocumentRepository, DocumentQuery } from "../../../domain/repositories/DocumentRepository";
import type { DocumentSnapshot as DocumentSnap } from "../../../domain/entities/Document";

// 注意：Firestore 寫入的欄位名稱與 TypeScript 型別對應
function fromFirestore(raw: Record<string, unknown>, id: string): DocumentSnap {
  return {
    id,
    workspaceId: (raw.spaceId ?? raw.metadata?.space_id ?? "") as string,
    accountId: raw.account_id as string,
    organizationId: "", // fn 不寫 organizationId，從 account 查詢時補填
    name: raw.title as string,
    mimeType: (raw.source as any)?.mime_type ?? "",
    sizeBytes: (raw.source as any)?.size_bytes ?? 0,
    classification: "other",
    tags: [],
    status: mapPyFnStatus(raw.status as string, (raw.rag as any)?.status),
    storageUrl: (raw.source as any)?.gcs_uri,
    createdAtISO: ((raw.source as any)?.uploaded_at?.toDate?.() ?? new Date()).toISOString(),
    updatedAtISO: new Date().toISOString(),
  };
}

function mapPyFnStatus(
  docStatus: string,
  ragStatus?: string
): "active" | "processing" | "archived" | "deleted" {
  if (docStatus === "processing") return "processing";
  if (ragStatus === "ready") return "active";
  return "processing"; // completed but rag not yet ready
}

export class FirestoreDocumentRepository implements DocumentRepository {
  async query(params: DocumentQuery): Promise<DocumentSnap[]> {
    const db = getFirestore();
    const ref = collection(db, "accounts", params.accountId!, "documents");
    const q = params.workspaceId
      ? query(ref, where("spaceId", "==", params.workspaceId), orderBy("source.uploaded_at", "desc"))
      : query(ref, orderBy("source.uploaded_at", "desc"));
    // ... snapshot read
  }
  // save / findById / delete → fn 負責寫入，TypeScript 側不需要 write
}
```

**邊界規則**：`FirestoreDocumentRepository` 是 **read-only**（只讀）。
寫入由 fn 完成，TypeScript 只監聽 Firestore 狀態變化。

### 3.2 模式 B：HTTPS Callable（觸發工作流）

用於主動觸發 fn 操作（上傳後觸發解析、執行 RAG 查詢）。

```typescript
// src/modules/notebooklm/adapters/outbound/callable/FirebaseCallableAdapter.ts
import { getFunctions, httpsCallable } from "firebase/functions";

export interface RagQueryInput {
  account_id: string;
  workspace_id: string;
  query: string;
  top_k?: number;
}

export interface RagQueryOutput {
  answer: string;
  citations: Array<{
    doc_id: string;
    chunk_id: string;
    filename: string;
    score: number;
  }>;
  cache: "hit" | "miss";
  vector_hits: number;
  search_hits: number;
}

export async function callRagQuery(input: RagQueryInput): Promise<RagQueryOutput> {
  const functions = getFunctions();
  const fn = httpsCallable<RagQueryInput, RagQueryOutput>(functions, "rag_query");
  const result = await fn(input);
  return result.data;
}

export async function callParseDocument(input: {
  account_id: string;
  workspace_id: string;
  gcs_uri: string;
  doc_id?: string;
  filename?: string;
}) {
  const functions = getFunctions();
  const fn = httpsCallable(functions, "parse_document");
  return fn(input);
}
```

### 3.3 模式 C：GCS 上傳 + Storage Trigger（自動流程）

```
Next.js UI（拖放上傳）
  → Firebase Storage uploadBytes() → uploads/{accountId}/{workspaceId}/{filename}
  → Cloud Storage Trigger (on_document_uploaded)
  → fn 自動執行完整 parse + RAG pipeline
  → Firestore accounts/{accountId}/documents/{docId} 狀態更新
  → TypeScript Firestore 訂閱收到更新 → UI 即時反映狀態
```

這是**最推薦的模式**，前端不需要主動呼叫 `parse_document` callable。
只需要：
1. 上傳到正確的 GCS 路徑（帶 `account_id` 和 `workspace_id` 作為 custom metadata）
2. 訂閱 Firestore 文件狀態

---

## 4. 各 Tab 的具體實作路徑

### 4.1 `notebooklm.sources` — 來源文件

**目標**：顯示文件列表（含狀態），支援上傳新文件。

**缺少的實作**：

```
1. FirestoreDocumentRepository.ts
   → 讀取 accounts/{accountId}/documents
   → filter by spaceId (workspaceId)

2. document-actions.ts (Server Action)
   "use server"
   → queryDocumentsAction({ accountId, workspaceId })  → 呼叫 QueryDocumentsUseCase
   → uploadDocumentAction({ accountId, workspaceId, gcsUri, filename }) → Storage.upload 後自動觸發

3. NotebooklmSourcesSection.tsx
   → 列出文件（名稱、狀態 badge、rag 就緒狀態）
   → 上傳按鈕 → Firebase Storage uploadBytes 到 uploads/{accountId}/{workspaceId}/
   → 訂閱 Firestore 狀態更新（useEffect + onSnapshot）
```

**上傳路徑約定**：
```
GCS bucket: [UPLOAD_BUCKET from fn config]
Object path: uploads/{accountId}/{workspaceId}/{uuid}-{filename}
Custom metadata:
  account_id: {accountId}
  workspace_id: {workspaceId}
  filename: {originalFilename}
```

### 4.2 `notebooklm.notebook` — RAG 查詢

**目標**：輸入查詢 → 顯示 AI 生成答案 + 來源引用。

**缺少的實作**：

```
1. callRagQuery() (callable adapter)
   → 呼叫 fn rag_query callable

2. notebook-actions.ts (Server Action)
   "use server"
   → ragQueryAction({ accountId, workspaceId, query })
   → 呼叫 callRagQuery() → 回傳 { answer, citations }

3. NotebooklmNotebookSection.tsx
   → 查詢輸入框 + 提交按鈕
   → 顯示 answer（Markdown 渲染）
   → 顯示 citations 列表（filename + score）
```

### 4.3 `notebooklm.ai-chat` — AI 對話

**目標**：多輪對話，每輪查詢都接上下文傳遞給 RAG。

**缺少的實作**：
- `Conversation` 聚合根（domain 層已有骨架）
- Firestore conversation 持久化 adapter
- Server action 包裝 `rag_query` callable（帶 conversation history 作為 context）

### 4.4 `notebooklm.research` — 研究摘要

**目標**：針對整個 workspace 的文件庫做 synthesis summary。

**實作方式**：  
呼叫 `rag_query`，但傳入 synthesis prompt（「總結所有文件的主要主題」），
不需要獨立的 callable，重用現有 `rag_query` 能力。

### 4.5 `notion.*` tabs

Notion 的四個 tabs（knowledge / pages / database / templates）目前 fn **沒有對應能力**。
它們是純 TypeScript DDD 實作，需要建立：
1. Firestore 寫入路徑（由 TypeScript 側直接負責）
2. 對應的 Firestore adapter
3. Server actions

這部分不涉及 fn 橋接，按標準 Hexagonal adapter 模式實作即可。

---

## 5. 開發優先順序建議

根據「已有能力最大化」原則（Occam's Razor）：

```
Phase 1 — 橋接 fn 已有能力（highest ROI）
  ✅ fn parse + RAG 已可用
  → 1. FirestoreDocumentRepository (read-only)
  → 2. document-actions.ts (upload + query)
  → 3. NotebooklmSourcesSection.tsx (Sources tab 可見)
  → 4. ragQueryAction + NotebooklmNotebookSection.tsx (Notebook tab 可用)

Phase 2 — Conversation 持久化
  → StartConversation / AddMessage use cases 接上 Firestore
  → AiChat tab 接通

Phase 3 — Notion 純 TypeScript 實作
  → PageRepository (Firestore)
  → Knowledge / Pages / Database / Templates tabs
```

---

## 6. 邊界規則（橋接版本補充）

原有規則（見 implementation-guide 第 5 節）加上以下補充：

| 規則 | 正確做法 | 禁止做法 |
|---|---|---|
| fn callable 呼叫 | 透過 infrastructure adapter（`adapters/outbound/callable/`） | 在 server action 直接 import firebase/functions SDK |
| Firestore 讀取（fn 寫入的 collection） | TypeScript `FirestoreDocumentRepository` 只讀，映射 fn schema | 在 TypeScript 端重複寫入 fn 管理的 fields |
| GCS 上傳路徑 | `uploads/{accountId}/{workspaceId}/{uuid}-{filename}` + custom metadata | 任意路徑（Storage Trigger 依賴 `uploads/` 前綴過濾） |
| 狀態同步 | Firestore 訂閱（onSnapshot）取得 fn 寫入的狀態更新 | 輪詢 callable 或自行維護一份狀態副本 |

---

## 7. 相關文件

- [`workspace-nav-notion-notebooklm-implementation-guide.md`](./workspace-nav-notion-notebooklm-implementation-guide.md) — Tab 導覽模型與三層設計
- [`notebooklm-source-processing-task-flow.md`](./notebooklm-source-processing-task-flow.md) — Source 文件處理流程細節
- [`fn/README.md`](../../../../fn/README.md) — fn 架構規範
- [`fn/main.py`](../../../../fn/main.py) — Firebase Functions 入口（callable 名稱列表）
- [`fn/src/interface/handlers/`](../../../../fn/src/interface/handlers/) — 各 callable 的 handler 實作
- [`fn/src/infrastructure/persistence/firestore/document_repository.py`](../../../../fn/src/infrastructure/persistence/firestore/document_repository.py) — Firestore document schema
