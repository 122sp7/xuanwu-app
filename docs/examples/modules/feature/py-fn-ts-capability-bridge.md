# fn ↔ TypeScript 能力橋接指南

> **歷史文件注意**：本文件撰寫於 ADR 0001（`document` 子域重命名為 `source`）完成之前。
> 文中的 `subdomains/document/`、`Document` entity、`FirestoreDocumentRepository` 等名稱現已遷移為
> `subdomains/source/`、`IngestionSource` entity、`FirestoreIngestionSourceRepository`。
> Firestore collection 路徑 `accounts/{accountId}/documents` 依 ADR 決策保持不變（alias 策略）。
> 橋接模式、規則與 fn callable 名稱仍有效，僅 TypeScript 側的型別與路徑名稱需以 `source` 為準。

## 背景：三層模型的真實狀態

[workspace-nav-notion-notebooklm-implementation-guide.md](./workspace-nav-notion-notebooklm-implementation-guide.md)
中的「三層模型對照表」列出了 `notebooklm` 與 `notion` 的資料層與行為層。
但那份文件對「行為層」的描述是**設計目標**，不是**當前狀態**。

實際情況是：

| 層次 | TypeScript (`src/modules/`) | fn |
|---|---|---|
| Domain entities | ✅ 存在（`IngestionSource.ts`, `Notebook.ts` 等） | ✅ 存在（domain value objects） |
| Use case stubs | ✅ 存在（完整 Firestore 實作） | ✅ 完整實作 |
| Infrastructure adapters | ✅ `FirestoreIngestionSourceRepository` 完成 | ✅ 真實 Firestore + Vector + Storage |
| HTTP / Callable entry points | ❌ 無 | ✅ Firebase Functions 已部署 |

**本文件的目的**：說明 fn 已具備的能力、TypeScript 側缺少什麼、以及如何用最小變動接通兩端。

---

## 1. fn 現有能力清單（已部署 Firebase Functions）

### 1.1 Cloud Storage Trigger（自動觸發）

| Function | 觸發條件 | 能力 |
|---|---|---|
| `on_document_uploaded` | GCS `uploads/` 前綴有新物件 | 自動啟動 Layout parse + RAG 流程 |

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

> 現況補充：`NotebooklmSourcesSection` 已改為上傳到
> `workspaces/{workspaceId}/sources/{accountId}/...`。
> 這條路徑**不會**命中 `fn` 的 `WATCH_PREFIX=uploads/` Storage trigger，
> 因此 Sources tab 需透過 `parse_document` / `rag_reindex_document` callables 手動處理。

### 1.2 HTTPS Callable（前端主動呼叫）

| Callable 名稱 | 用途 | 必填參數 |
|---|---|---|
| `parse_document` | 手動觸發單一文件的 Document AI 解析 | `account_id`, `workspace_id`, `gcs_uri` |
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
src/modules/notebooklm/subdomains/source/
├── domain/entities/IngestionSource.ts          ✅ DDD 聚合根（含 create/archive/delete + domain events）
├── domain/repositories/IngestionSourceRepository.ts  ✅ Repository 介面
└── application/use-cases/                      ✅ AddSource / ArchiveSource / QuerySources
```

### 2.2 已完成的基礎設施

```
src/modules/notebooklm/subdomains/source/
├── adapters/outbound/firestore/
│   └── FirestoreIngestionSourceRepository.ts   ✅ 讀取 accounts/{accountId}/documents
src/modules/notebooklm/adapters/inbound/server-actions/
│   ├── document-actions.ts                     ✅ uploadDocument / queryDocuments
│   └── source-processing-actions.ts            ✅ triggerParse / source processing
src/modules/notebooklm/adapters/inbound/react/
    └── NotebooklmSourcesSection.tsx            ✅ UI 組件（Sources tab）
```

### 2.3 Notebook 子域（notebooklm.notebook tab）

`notebooklm.notebook` 用的是 RAG 查詢能力，已橋接 `rag_query` callable。

```
src/modules/notebooklm/subdomains/notebook/    ✅ 存在
src/modules/notebooklm/adapters/inbound/server-actions/
    └── notebook-actions.ts                    ✅ ragQuery server action 已完成
```

---

## 3. 橋接模式

### 3.1 模式 A：Firestore 訂閱（即時列表）

用於讀取已存在的資料（IngestionSource 列表、狀態更新）。

```typescript
// src/modules/notebooklm/subdomains/source/adapters/outbound/firestore/FirestoreIngestionSourceRepository.ts
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { getFirestore } from "@integration-firebase/firestore";
import type { IngestionSourceRepository, IngestionSourceQuery } from "../../../domain/repositories/IngestionSourceRepository";
import type { IngestionSourceSnapshot } from "../../../domain/entities/IngestionSource";

// 注意：Firestore 寫入的欄位名稱與 TypeScript 型別對應
function fromFirestore(raw: Record<string, unknown>, id: string): IngestionSourceSnapshot {
  return {
    id,
    workspaceId: (raw.spaceId ?? raw.metadata?.space_id ?? "") as string,
    accountId: raw.account_id as string,
    organizationId: "", // TODO: organizationId 必須由呼叫方從 iam account adapter 取得，此處暫為佔位符
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

export class FirestoreIngestionSourceRepository implements IngestionSourceRepository {
  async query(params: IngestionSourceQuery): Promise<IngestionSourceSnapshot[]> {
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

**邊界規則**：`FirestoreIngestionSourceRepository` 是 **read-only**（只讀）。
寫入由 fn 完成，TypeScript 只監聽 Firestore 狀態變化。

### 3.2 模式 B：HTTPS Callable（觸發工作流）

用於主動觸發 fn 操作（上傳後觸發解析、執行 RAG 查詢）。

```typescript
// src/modules/notebooklm/adapters/outbound/callable/FirebaseCallableAdapter.ts
import { getFunctions, httpsCallable } from "firebase/functions";
import { z } from "zod";

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

// Rule 4: 所有 fn callable 回傳值必須通過 Zod 驗證再傳入 application layer
const RagQueryOutputSchema = z.object({
  answer: z.string(),
  citations: z.array(z.object({
    doc_id: z.string(),
    chunk_id: z.string(),
    filename: z.string(),
    score: z.number(),
  })),
  cache: z.enum(["hit", "miss"]),
  vector_hits: z.number(),
  search_hits: z.number(),
});

export async function callRagQuery(input: RagQueryInput): Promise<RagQueryOutput> {
  const functions = getFunctions();
  const fn = httpsCallable<RagQueryInput, RagQueryOutput>(functions, "rag_query");
  let result;
  try {
    result = await fn(input);
  } catch (err) {
    throw new Error(`callRagQuery failed: ${err instanceof Error ? err.message : String(err)}`);
  }
  return RagQueryOutputSchema.parse(result.data);
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
  try {
    return await fn(input);
  } catch (err) {
    throw new Error(`callParseDocument failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}
```

### 3.3 模式 C：GCS 上傳 + Storage Trigger（自動流程，限 `uploads/**`）

```
Next.js UI（拖放上傳）
  → platform.FileAPI.uploadWorkspaceFile({ file, ownerId }) → 上傳到 uploads/{accountId}/{workspaceId}/{filename}
  → Cloud Storage Trigger (on_document_uploaded)
  → fn 自動執行完整 parse + RAG pipeline
  → Firestore accounts/{accountId}/documents/{docId} 狀態更新
  → TypeScript Firestore 訂閱收到更新 → UI 即時反映狀態
```

> **Rule 8**：前端禁止直接呼叫 `Firebase Storage uploadBytes()`；所有涉及檔案所有權、entitlement 或多租戶隔離的上傳，
> 必須透過 `platform.FileAPI.uploadWorkspaceFile()` 路由，讓 platform 統一處理 ownership、entitlement 與 audit 語意。

這是針對 `uploads/**` 自動 worker 路徑的推薦模式，前端不需要主動呼叫 `parse_document` callable。
只需要：
1. 透過 `FileAPI.uploadWorkspaceFile()` 上傳到正確的 GCS 路徑（帶 `account_id` 和 `workspace_id` 作為 custom metadata）
2. 訂閱 Firestore 文件狀態

---

## 4. 各 Tab 的具體實作路徑

### 4.1 `notebooklm.sources` — 來源文件

**目標**：顯示文件列表（含狀態），支援上傳新文件。

**已完成的實作**：

```
1. FirestoreIngestionSourceRepository.ts  ✅
   → 讀取 accounts/{accountId}/documents
   → filter by spaceId (workspaceId)

2. firebase-composition.ts + callable adapter  ✅
   → queryDocuments({ accountId, workspaceId })  → client-side Firestore query
   → uploadDocumentToStorage(file, accountId, workspaceId) → 上傳到 workspaces/{workspaceId}/sources/{accountId}/
   → registerUploadedDocument(...) → 建立 source snapshot
   → callParseDocument(...) / callReindexDocument(...) → 呼叫 fn HTTPS callables

3. NotebooklmSourcesSection.tsx  ✅
   → 列出文件（名稱、狀態 badge、rag 就緒狀態）
   → 上傳按鈕 → 透過 uploadDocumentToStorage() 上傳到 workspaces/{workspaceId}/sources/{accountId}/
   → registerUploadedDocument() 建立來源快照
   → 手動觸發 parse_document / rag_reindex_document
   → 重新查詢 Firestore 文件狀態
```

**上傳路徑約定**：
```
GCS bucket: [UPLOAD_BUCKET from fn config]
Object path: workspaces/{workspaceId}/sources/{accountId}/{uuid}-{filename}
Custom metadata:
  account_id: {accountId}
  workspace_id: {workspaceId}
  filename: {originalFilename}
```

### 4.2 `notebooklm.notebook` — RAG 查詢

**目標**：輸入查詢 → 顯示 AI 生成答案 + 來源引用。

**已完成的實作**：

```
1. callRagQuery() (callable adapter)  ✅
   → 呼叫 fn rag_query callable

2. notebook-actions.ts (Server Action)  ✅
   "use server"
   → ragQueryAction({ accountId, workspaceId, query })
   → 呼叫 callRagQuery() → 回傳 { answer, citations }

3. NotebooklmNotebookSection.tsx  ✅
   → 查詢輸入框 + 提交按鈕
   → 顯示 answer（Markdown 渲染）
   → 顯示 citations 列表（filename + score）
```

### 4.3 `notion.*` tabs

Notion 的四個 tabs（knowledge / pages / database / templates）目前 fn **沒有對應能力**。
它們是純 TypeScript DDD 實作，需要建立：
1. Firestore 寫入路徑（由 TypeScript 側直接負責）
2. 對應的 Firestore adapter
3. Server actions

這部分不涉及 fn 橋接，按標準 Hexagonal adapter 模式實作即可。

---

## 5. 邊界規則（橋接版本補充）

原有規則（見 implementation-guide 第 5 節）加上以下補充：

| 規則 | 正確做法 | 禁止做法 |
|---|---|---|
| fn callable 呼叫 | 透過 infrastructure adapter（`adapters/outbound/callable/`） | 在 server action 直接 import firebase/functions SDK |
| Firestore 讀取（fn 寫入的 collection） | TypeScript `FirestoreIngestionSourceRepository` 只讀，映射 fn schema | 在 TypeScript 端重複寫入 fn 管理的 fields |
| GCS 上傳路徑 | `workspaces/{workspaceId}/sources/{accountId}/{uuid}-{filename}` + custom metadata | `uploads/**` 為自動 trigger 路徑；Sources 現況走手動 callable |
| 狀態同步 | Firestore 訂閱（onSnapshot）取得 fn 寫入的狀態更新 | 輪詢 callable 或自行維護一份狀態副本 |

---

## 6. 相關文件

- [`workspace-nav-notion-notebooklm-implementation-guide.md`](./workspace-nav-notion-notebooklm-implementation-guide.md) — Tab 導覽模型與三層設計
- [`notebooklm-source-processing-task-flow.md`](./notebooklm-source-processing-task-flow.md) — Source 文件處理流程細節
- [`fn/README.md`](../../../../fn/README.md) — fn 架構規範
- [`fn/main.py`](../../../../fn/main.py) — Firebase Functions 入口（callable 名稱列表）
- [`fn/src/interface/handlers/`](../../../../fn/src/interface/handlers/) — 各 callable 的 handler 實作
- [`fn/src/infrastructure/persistence/firestore/document_repository.py`](../../../../fn/src/infrastructure/persistence/firestore/document_repository.py) — Firestore document schema
