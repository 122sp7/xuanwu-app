---
title: Wiki architecture
description: Target architecture for the Wiki module — modern enterprise knowledge hub with sidebar navigation, organization knowledge, workspace knowledge, and full RAG pipeline integration.
---

# Wiki 現代知識中樞架構規範

> **文件編號**：XUANWU-WIKI-SPEC-001
> **適用系統**：xuanwu-app — 現代型企業知識中樞
> **版本**：v1.0.0
> **最後更新**：2026-03-20
> **維護責任方**：Wiki Module Owner / 平台架構委員會

---

## 0. 目前已上線範圍

目前已上線的是 Wiki UI stub，作為後續完整知識中樞實作的入口：

- **Wiki 頁面 stub**：`app/(shell)/wiki/page.tsx`
  - 功能：靜態框架（首頁 / 工作區 / 共用 / 私人 / 封存）
  - 尚無真實持久化，無側邊欄知識節點
- **Knowledge 模組**：`modules/knowledge/`
  - 目前以 read-side summary 呈現 organization 與 workspace 層級知識狀況
  - Organization 知識：`modules/knowledge/interfaces/components/OrganizationKnowledgeTab.tsx`
  - Workspace 知識：`modules/knowledge/interfaces/components/WorkspaceKnowledgeTab.tsx`
- **知識庫架構**：`docs/architecture/knowledge.md`
- **知識庫契約**：`docs/reference/development-contracts/knowledge-contract.md`

### 0.1 本輪交付目標

本輪先在 `docs/` 建立完整 Wiki 設計文件：

| 文件 | 路徑 |
|------|------|
| 架構設計（本文件） | `docs/architecture/wiki.md` |
| 開發契約 | `docs/reference/development-contracts/wiki-contract.md` |
| 開發指南 | `docs/wiki/development-guide.md` |
| 使用手冊 | `docs/wiki/user-manual.md` |

### 0.2 本輪不在交付範圍

- Wiki 頁面的真實持久化（Firestore `wiki_pages` 集合）
- Organization / Workspace Knowledge 往 Wiki 側邊欄的完整遷移 UI
- 真正的 RAG 全流程（向量搜尋 + LLM 回答生成）
- Wiki 協作編輯（多人同步）
- Wiki 版本歷史 UI

---

## 1. 核心設計原則

| 原則 | 說明 |
|------|------|
| **知識中樞化** | Wiki 是整個組織的企業知識庫入口，不僅是筆記工具 |
| **知識遷移** | Organization Knowledge 與 Workspace Knowledge 皆透過 Wiki 側邊欄呈現 |
| **RAG 驅動** | 所有知識文件均可進入 RAG 全流程，支援語意搜尋與 AI 回答生成 |
| **多層知識範圍** | Organization 層（企業級）/ Workspace 層（專案級）/ Private 層（個人） |
| **Firestore 雙角色** | Firestore 同時承擔結構化 DB 與向量 DB 職責（中小型系統最適） |
| **Genkit 編排** | AI 流程透過 Genkit Flow 統一編排，不散落在 UI 或 repository 層 |

---

## 2. Wiki 整體架構

### 2.1 模組邊界

```
app/(shell)/wiki/
    ↓ (page rendering + layout)
modules/wiki/
├── domain/           ← Wiki 頁面實體 / 知識節點 / ports
├── application/      ← 新增頁面 / 查詢頁面 / 知識遷移 use-cases
├── infrastructure/   ← Firestore adapters (wiki_pages, knowledge_nodes)
└── interfaces/       ← Server Actions / queries / React components（含側邊欄）

modules/knowledge/    ← 知識文件 / RAG pipeline 資料模型（現有）
modules/ai/           ← Genkit Flow 編排（RAG query pipeline）
libs/firebase/functions-python/  ← Cloud Functions（ingestion worker）
```

### 2.2 側邊欄知識節點架構

Wiki 側邊欄分為三個知識層次：

```
Wiki 側邊欄
├── 📌 首頁
├── 🏢 組織知識庫 (Organization Knowledge)
│   ├── 跨工作區文件總覽
│   ├── 分類瀏覽 (taxonomy)
│   └── 快速 RAG 搜尋入口
├── 🗂️ 工作區知識 (Workspace Knowledge)
│   ├── [工作區 A] 文件清單
│   ├── [工作區 B] 文件清單
│   └── ...
├── 📝 Wiki 頁面
│   ├── 共用頁面
│   └── 私人頁面
└── 🗑️ 封存
```

---

## 3. 全流程企業 RAG 架構

### 3.1 Ingestion Pipeline（資料進來）

```
[Next.js 上傳檔案]
        ↓
[Firebase Storage（raw file）]
        ↓
[Firestore 建立文件 metadata（status: uploaded）]
        ↓
[Cloud Functions (Python) 觸發]
        ↓
[下載檔案 / 讀取]
        ↓
[Parsing（PDF / DOCX / HTML → text）]
        ↓
[Cleaning（normalize / 去雜訊）]
        ↓
[Document-level Taxonomy（整份文件分類）]
        ↓
[Structuring（chunk 切分）]
        ↓
[Chunk-level Metadata（docId / chunkId / taxonomy / page / tags）]
        ↓
[Embedding（每個 chunk 向量化）]
        ↓
[Firestore（chunks collection + embedding）]
        ↓
[建立 Vector Index（Firestore vector index）]
        ↓
[更新文件狀態：ready]
```

### 3.2 Query Pipeline（查詢 / RAG）

```
[Next.js（User Query）]
        ↓
[Route Handler / Server Action]
        ↓
[Genkit Flow（Query Preprocess）]
        ↓
[Query Embedding]
        ↓
[Firestore Vector Search（Top-K + filter taxonomy）]
        ↓
[取得 Top-K chunks]
        ↓
[Context 組裝（prompt building）]
        ↓
[Genkit LLM（回答生成）]
        ↓
[Streaming 回傳（Next.js UI）]
```

### 3.3 Optional 強化（企業必備）

| 強化項目 | 說明 | 優先級 |
|----------|------|--------|
| Hybrid Search | Vector Search + Keyword Search (BM25) → re-rank | P1 |
| Re-ranking | Cross-Encoder / LLM rerank → Top-N 精排 | P1 |
| Cache | Query Hash → Firestore / Redis Cache，命中直接回應 | P2 |
| Feedback Loop | 👍👎 寫入 Firestore，調整 ranking / prompt | P2 |

---

## 4. Firestore 資料結構

### 4.1 Wiki 頁面集合 (`wiki_pages`)

**Collection Path**：`/wiki_pages/{organizationId}/pages/{pageId}`

| 欄位名 | 類型 | 必填 | 說明 |
|--------|------|------|------|
| `pageId` | `string` | ✅ | UUID v4 |
| `organizationId` | `string` | ✅ | 所屬組織 |
| `workspaceId` | `string` | ❌ | 所屬工作區（null = 組織層） |
| `title` | `string` | ✅ | 頁面標題 |
| `content` | `string` | ❌ | 頁面內容（Markdown） |
| `scope` | `"organization" \| "workspace" \| "private"` | ✅ | 知識範疇 |
| `parentPageId` | `string` | ❌ | 父頁面 ID（階層結構） |
| `order` | `number` | ✅ | 側邊欄排序 |
| `isArchived` | `boolean` | ✅ | 是否封存 |
| `createdBy` | `string` | ✅ | 建立者 accountId |
| `createdAtISO` | `string` | ✅ | ISO-8601 |
| `updatedAtISO` | `string` | ✅ | ISO-8601 |

### 4.2 知識文件集合（沿用 knowledge 模組）

沿用 `docs/architecture/knowledge.md` 定義的資料結構：

| Collection Path | 說明 |
|-----------------|------|
| `/knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}` | 文件 metadata + 狀態 |
| `/knowledge_base/{organizationId}/workspaces/{workspaceId}/chunks/{chunkId}` | 切塊 + embedding vector |

### 4.3 RAG 關鍵欄位（chunks）

| 欄位名 | 用途 |
|--------|------|
| `embedding` | 🔥 向量搜尋 |
| `taxonomy` | 🔥 過濾用分類 |
| `organizationId` | 組織隔離 |
| `workspaceId` | 工作區隔離 |
| `isLatest` | 排除廢棄版本 |

---

## 5. 關鍵技術觀念

### 5.1 Taxonomy（分類）

Taxonomy 是文件在進入 Chunking 前由 ingestion worker 在 document-level 標注的語意分類。
它繼承至每個 chunk，作為 Vector Search 必填過濾欄位。

#### 5.1.1 預設分類值（taxonomy enum）

| 值 | 中文說明 | 適用文件類型範例 |
|----|----------|----------------|
| `规章制度` | 企業規章、制度、合規文件 | 員工手冊、考勤規定、薪資辦法 |
| `技術文件` | 系統架構、API 規格、技術規範 | ADR、架構圖、API spec |
| `產品手冊` | 產品說明書、功能文件 | 功能規格、版本說明 |
| `操作指南` | SOP、流程指南、How-to | 入職流程、部署指南 |
| `政策文件` | 政策宣告、安全政策、隱私政策 | 資安政策、個資聲明 |
| `訓練教材` | 教育訓練簡報、學習資料 | 新人訓練、技術教材 |
| `研究報告` | 市場研究、技術研究、分析報告 | 競品分析、使用者調查 |
| `其他` | 無法歸類的文件 | — |

#### 5.1.2 Taxonomy 標注時機

```
Parsing（文字萃取）
    ↓
Cleaning（正規化）
    ↓
✅ Taxonomy 標注（document-level，整份文件）← 必須在此完成
    ↓
Chunking（chunk 切分）← chunk 繼承 doc-level taxonomy
    ↓
Embedding（每個 chunk 向量化）
```

> ❗ taxonomy 必須在 chunking **之前**完成，才能確保每個 chunk 都有正確的 taxonomy 欄位。

#### 5.1.3 Taxonomy 欄位規範

- **Firestore `documents/{id}.taxonomy`**：字串，值取自上述 enum（必填）
- **Firestore `chunks/{id}.taxonomy`**：繼承自 parent document（必填，供 retrieval filter 用）
- **允許自訂值**：若組織管理員在 `taxonomyConfig` 中新增分類，則 enum 可擴充
- 空字串或 null 視為 `其他`

---

### 5.2 Embedding（OpenAI API）

#### 5.2.1 模型選擇

| 模型 | 維度 | 成本 | 適用情境 |
|------|------|------|---------|
| `text-embedding-3-small` | **1536** | $0.020 / 1M tokens | **預設，中小型知識庫** |
| `text-embedding-3-large` | 3072 | $0.130 / 1M tokens | 高精度需求 |
| `text-embedding-ada-002` | 1536 | $0.100 / 1M tokens | 舊版相容 |

預設使用 `text-embedding-3-small`，維度為 **1536**。

#### 5.2.2 API 呼叫規範

```python
# libs/firebase/functions-python/ingestion/embedding.py
import openai

OPENAI_EMBEDDING_MODEL = "text-embedding-3-small"
OPENAI_EMBEDDING_DIMENSIONS = 1536
OPENAI_BATCH_SIZE = 20          # 每批最多 20 個 chunk
OPENAI_MAX_TOKENS_PER_CHUNK = 512  # chunk 切分上限（tokens）

def embed_chunks(texts: list[str]) -> list[list[float]]:
    """
    呼叫 OpenAI Embeddings API，回傳 float[] list。
    """
    client = openai.OpenAI()  # 讀取 OPENAI_API_KEY 環境變數
    response = client.embeddings.create(
        model=OPENAI_EMBEDDING_MODEL,
        input=texts,
        dimensions=OPENAI_EMBEDDING_DIMENSIONS,
    )
    return [item.embedding for item in response.data]
```

#### 5.2.3 環境變數

| 變數名 | 設置位置 | 說明 |
|--------|----------|------|
| `OPENAI_API_KEY` | Cloud Functions secrets | OpenAI API 金鑰（必填） |
| `OPENAI_EMBEDDING_MODEL` | Cloud Functions config | 可覆寫模型（選填，預設 `text-embedding-3-small`） |

```bash
# 設置 Cloud Functions secret（Firebase CLI）
firebase functions:secrets:set OPENAI_API_KEY
```

#### 5.2.4 Embedding 寫入 Firestore

Embedding vector 以 `number[]`（float64 array）寫入 chunks 集合：

```python
chunk_doc = {
    "id": chunk_id,
    "organizationId": organization_id,
    "workspaceId": workspace_id,
    "docId": document_id,
    "chunkIndex": chunk_index,
    "text": chunk_text,
    "embedding": embedding_vector,   # number[] (1536-dim)
    "taxonomy": document_taxonomy,
    "page": page_number,
    "tokenCount": token_count,
    "createdAt": firestore.SERVER_TIMESTAMP,
    "updatedAt": firestore.SERVER_TIMESTAMP,
    "embeddingModel": OPENAI_EMBEDDING_MODEL,  # 記錄使用的模型版本
    "embeddingDimensions": OPENAI_EMBEDDING_DIMENSIONS,
}
```

#### 5.2.5 Retry 策略

```python
# 429 (rate limit) → exponential backoff，最多 5 次重試
# 500/502/503 → 固定 2 秒 delay，最多 3 次重試
# 其他錯誤 → 立即標記 chunk embedding_failed，不重試
```

---

### 5.3 Vector Search（Firestore）

#### 5.3.1 Firestore Vector Index 設定

`firestore.indexes.json` 中必須定義：

```json
{
  "indexes": [],
  "fieldOverrides": [
    {
      "collectionGroup": "chunks",
      "fieldPath": "embedding",
      "indexes": [],
      "vectorConfig": {
        "dimension": 1536,
        "flat": {}
      }
    }
  ]
}
```

> ❗ Vector index 必須在第一次 embedding 寫入前建立，否則查詢會失敗。

#### 5.3.2 查詢範例

```typescript
// modules/ai/infrastructure/firestore/FirestoreVectorSearchRepository.ts
import { collection, query, where, getFirestore, orderBy, limit } from "firebase/firestore";
// Firestore vector search uses the Admin SDK on the server side:
// import { getFirestore, FieldPath, VectorQuery } from "firebase-admin/firestore";

async function searchChunks(params: {
  organizationId: string;
  workspaceId?: string;
  queryVector: number[];   // 1536-dim, matches OPENAI_EMBEDDING_DIMENSIONS
  taxonomy?: string;
  topK: number;
}): Promise<ChunkResult[]> {
  const db = getFirestore();
  const chunksRef = db.collection("chunks");

  // 必填 pre-filter（MUST be applied before vector search）
  let q = chunksRef
    .where("organizationId", "==", params.organizationId)
    .where("isLatest", "==", true);

  if (params.workspaceId) q = q.where("workspaceId", "==", params.workspaceId);
  if (params.taxonomy)    q = q.where("taxonomy", "==", params.taxonomy);

  // Firestore vector search
  const vectorQuery = q.findNearest({
    vectorField: "embedding",
    queryVector: params.queryVector,
    limit: params.topK,
    distanceMeasure: "COSINE",
  });

  const snapshot = await vectorQuery.get();
  return snapshot.docs.map((d) => d.data() as ChunkResult);
}
```

#### 5.3.3 Composite Index（必建）

除 Vector Index 外，還需在 `firestore.indexes.json` 中建立以下複合索引：

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

---

### 5.4 上傳檔案（File Upload）

#### 5.4.1 documentId 生成規則

documentId 由 Next.js 在上傳時生成，規則：

```typescript
import { v4 as uuidv4 } from "uuid";

function generateDocumentId(): string {
  return `doc_${uuidv4().replace(/-/g, "").slice(0, 16)}`;
  // 例如：doc_4b2a1c3d8e9f0a12
}
```

| 欄位 | 規則 |
|------|------|
| 長度 | 固定前綴 `doc_` + 16 hex chars = 20 chars |
| 唯一性 | UUID v4 保證 |
| 不可變 | 一旦建立，documentId 不得因 rename/reprocess 而變更 |

#### 5.4.2 Firebase Storage Path（canonical）

```
organizations/{organizationId}/workspaces/{workspaceId}/documents/{documentId}/raw/source{ext}
```

**範例**：
```
organizations/org_abc/workspaces/ws_xyz/documents/doc_4b2a1c3d8e9f0a12/raw/source.pdf
```

衍生檔案路徑（由 worker 寫入）：
```
.../documents/{documentId}/derived/normalized.md
.../documents/{documentId}/derived/layout.json
```

#### 5.4.3 上傳驗證規則

| 欄位 | 規則 |
|------|------|
| 允許的 MIME 類型 | `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `application/msword`, `text/html`, `text/plain`, `text/markdown` |
| 允許的副檔名 | `.pdf`, `.docx`, `.doc`, `.html`, `.htm`, `.txt`, `.md` |
| 最大檔案大小 | **50 MB** |
| 最小檔案大小 | **1 KB** |
| displayName 最大長度 | 255 字元 |
| taxonomy | 必填，需為 enum 中的合法值 |
| language | ISO 639-1，預設 `zh-TW` |

#### 5.4.4 Firestore documents 寫入欄位清單

```typescript
// 上傳時由 Next.js 建立的完整 documents 記錄
const documentRecord: RagDocumentRecord = {
  id:              documentId,              // doc_xxx
  organizationId,
  workspaceId,
  displayName:     file.name,              // 原始檔名，UI 顯示用
  title:           file.name,              // 可後續編輯
  sourceFileName:  file.name,              // 永久保存，不變
  mimeType:        file.type,
  storagePath:     canonicalStoragePath,   // organizations/.../raw/source.pdf
  sizeBytes:       file.size,
  status:          "uploaded",             // ← 觸發 Cloud Functions 的入口
  checksum:        await sha256(file),     // dedupe 依據
  taxonomy:        formValues.taxonomy,    // 必填
  category:        formValues.category,
  department:      formValues.department,
  language:        formValues.language ?? "zh-TW",
  accessControl:   formValues.accessControl ?? ["Admin", "Member"],
  versionGroupId:  documentId,             // 第一版等於自身
  versionNumber:   1,
  isLatest:        true,
  accountId:       currentUser.uid,
  createdAtISO:    new Date().toISOString(),
  updatedAtISO:    new Date().toISOString(),
};
```

---

### 5.5 Firestore 雙角色
- 作為結構化 DB：儲存 wiki_pages / documents metadata
- 作為 Vector DB：儲存 chunks + embedding（中小型系統最適）

### 5.6 Genkit 角色
- Flow orchestration：Ingestion + Query 流程統一編排
- LLM 呼叫：回答生成（Gemini / GPT 可切換）
- Tool calling：搜尋工具 / 日誌工具 / rerank 工具

---

## 6. 模組結構（目標）

```
modules/wiki/
├── domain/
│   ├── entities/
│   │   ├── WikiPage.ts          # 頁面實體
│   │   └── KnowledgeNode.ts     # 知識節點（側邊欄節點）
│   ├── repositories/
│   │   ├── WikiPageRepository.ts
│   │   └── KnowledgeNodeRepository.ts
│   └── index.ts
├── application/
│   └── use-cases/
│       ├── create-wiki-page.use-case.ts
│       ├── list-wiki-sidebar.use-case.ts
│       ├── get-organization-knowledge-nodes.use-case.ts
│       └── get-workspace-knowledge-nodes.use-case.ts
├── infrastructure/
│   └── firebase/
│       ├── FirebaseWikiPageRepository.ts
│       └── FirebaseKnowledgeNodeRepository.ts
├── interfaces/
│   ├── _actions/
│   │   └── wiki-page.actions.ts
│   ├── queries/
│   │   └── wiki.queries.ts
│   └── components/
│       ├── WikiSidebar.tsx           # 🔑 側邊欄（組織 + 工作區知識節點）
│       ├── WikiPageView.tsx          # 頁面內容
│       └── WikiKnowledgeSearch.tsx   # RAG 搜尋 UI
└── index.ts
```

---

## 7. 一句話總結

```
資料進來：Parsing → Taxonomy → Chunk → Embedding → 存 Firestore

使用者發問：Query → Embedding → Vector Search → LLM 回答

Wiki 側邊欄：Organization Knowledge + Workspace Knowledge → 統一知識入口
```

---

## 8. `core/wiki-core` 當前實作狀態與交付缺口

> 本節為本輪交付的交底分析。所有標記「✅ 已實作」的項目均在 `core/wiki-core/` 中，可供直接引用；
> 標記「🔲 缺口」的項目為下一步補充目標，依優先順序排列。

### 8.1 Domain 層

| 項目 | 狀態 | 說明 |
|------|------|------|
| `WikiDocument` entity (DRAFT / PUBLISHED / ARCHIVED lifecycle) | ✅ 已實作 | 基本生命週期，缺 organizationId / workspaceId / taxonomy / embedding 欄位 |
| `WorkspaceKnowledgeSummary` entity | ✅ 已實作 | Read-model，已在 WorkspaceWikiTab 使用 |
| `AccessControl` VO | ✅ 已實作 | PUBLIC / PRIVATE / INTERNAL 可見性 |
| `ContentStatus` VO | ✅ 已實作 | DRAFT / PUBLISHED / ARCHIVED 狀態語意 |
| `Taxonomy` VO | ✅ 已實作 | category + tags + namespace |
| `Vector` VO | ✅ 已實作 | 不可為空的 float 陣列 |
| `Embedding` VO | ✅ 已實作 | values + model + dimensions + `isCompatibleWith` |
| `SearchFilter` VO | ✅ 已實作 | category / tags / dateRange |
| `WikiDocumentSummary` VO | ✅ 已實作 | 輕量 read-model（id + title + status） |
| `UsageStats` VO | ✅ 已實作 | viewCount + lastAccessedAt |
| `IWikiDocumentRepository` port | ✅ 已實作 | save / findById / search(vector) |
| `IKnowledgeSummaryRepository` port | ✅ 已實作 | summarize(scope) |
| `IRetrievalRepository` port | ✅ 已實作 | searchByVector / searchByMetadata |
| `IEmbeddingRepository` port | ✅ 已實作 | embed / embedBatch（max batch 20） |
| `deriveKnowledgeSummary` domain service | ✅ 已實作 | 純函式，無 infra 依賴 |
| `WikiDocument` 完整欄位（organizationId / workspaceId / taxonomy / scope / parentPageId） | 🔲 缺口（高） | 目前僅有 id / title / content / status / createdAt |
| `WikiPage` entity（頁面層級、scope: org/workspace/private） | 🔲 缺口（高） | `WikiDocument` 目前承擔 RAG doc 職責，wiki page 需另立 entity |
| `RAGQueryResult` value object（answer + sources + confidence） | 🔲 缺口（高） | RAG query pipeline 的輸出型別 |
| `IVersionHistoryRepository` port | 🔲 缺口（中） | 版本回溯 / 審計用 |
| `IAuditLogRepository` port | 🔲 缺口（中） | 操作稽核 |

### 8.2 Application 層

| 項目 | 狀態 | 說明 |
|------|------|------|
| `CreateWikiDocumentUseCase` | ✅ 骨架 | 缺 ID 生成（doc_ + 16 hex）、taxonomy 標注、embedding 呼叫 |
| `GetWorkspaceKnowledgeSummaryUseCase` | ✅ 已實作 | 委派 IKnowledgeSummaryRepository，已在 modules/knowledge 使用 |
| `GetRAGAnswerUseCase` | 🔲 缺口（高） | 接收 query text → embed → searchByVector → assemble context → 生成回答 |
| `SearchWikiDocumentsUseCase` | 🔲 缺口（高） | 接收 SearchFilter → IRetrievalRepository.searchByMetadata |
| `CreateWikiPageUseCase` | 🔲 缺口（高） | wiki page CRUD（需 WikiPage entity 先完成） |
| `ArchiveWikiPageUseCase` | 🔲 缺口（中） | 頁面封存（need WikiPage entity） |
| `IndexWikiDocumentUseCase` | 🔲 缺口（高） | 觸發 embedding + 存入 vector index（目前由 Python worker 承擔） |

### 8.3 Infrastructure 層

| 項目 | 狀態 | 說明 |
|------|------|------|
| Upstash 設定（URL / TOKEN / TTL） | ✅ 已實作 | `infrastructure/persistence/config.ts` |
| Upstash Redis client | ✅ 已實作 | `infrastructure/persistence/upstash-redis.ts` |
| Upstash Vector client | ✅ 已實作 | `infrastructure/persistence/upstash-vector.ts` |
| `UpstashWikiDocumentRepository` | ✅ 骨架 | save / findById / search 均為空實作（skeleton only） |
| `OpenAIEmbeddingRepository`（TypeScript 端） | 🔲 缺口（高） | Python 端已有 `OpenAiEmbedder`；TS 端需實作以供 Next.js server 端使用 |
| `FirestoreWikiDocumentRepository` | 🔲 缺口（高） | 主要持久化 adapter（Upstash 為快取層） |
| `FirestoreKnowledgeSummaryRepository` | 🔲 缺口（高） | 真實資料來源（modules/knowledge 使用 cross-module adapter） |
| `UpstashRetrievalRepository`（實作） | 🔲 缺口（高） | `searchByVector` / `searchByMetadata` 尚未實作 |
| `InMemoryWikiDocumentRepository` | 🔲 缺口（中） | 用於測試（參考 namespace-core 的 InMemory 模式） |

### 8.4 Interfaces 層

| 項目 | 狀態 | 說明 |
|------|------|------|
| `WikiController` | ✅ 骨架 | create() 委派 CreateWikiDocumentUseCase，其餘 action 待補 |
| Next.js Server Actions（create / archive / search） | 🔲 缺口（高） | 需在 `interfaces/` 建立，`app/(shell)/wiki/page.tsx` 串接 |
| Next.js queries（list / summary / search results） | 🔲 缺口（高） | 目前 wiki page 無真實查詢 |
| RAG 搜尋 API route（`/api/wiki/search`） | 🔲 缺口（高） | Genkit flow 呼叫入口 |

### 8.5 整合缺口（跨層）

| 缺口 | 影響 | 說明 |
|------|------|------|
| `WikiDocument.id` 生成 | 高 | 目前為 `'TODO_ID'`；應採 `doc_` + 16 hex（見 wiki-contract.md） |
| Python worker ↔ TypeScript 向量索引維度一致性 | 高 | 目前 Python scaffold 用 dim=4；切換至 OpenAI 1536 維時需同步更新 Firestore index |
| `modules/wiki` 模組不存在 | 高 | 開發文件描述的 `modules/wiki/` 結構目前尚未建立，`app/(shell)/wiki/page.tsx` 直接使用 core + modules/knowledge shim |
| Embedding 生成流程的 runtime 歸屬 | 中 | Ingestion-time embedding 由 Python worker；query-time embedding 由 Next.js server（需 TS OpenAIEmbeddingRepository） |

### 8.6 建議下一步實作順序

```
Phase 1（完成 domain + application 骨幹）
├── 補全 WikiDocument 欄位（organizationId / workspaceId / taxonomy / scope）
├── 建立 WikiPage entity（頁面層級 / 繼承 / scope）
├── CreateWikiDocumentUseCase：加入 ID 生成 + embedding 呼叫 + taxonomy 標注
├── GetRAGAnswerUseCase（embed query → searchByVector → context assembly）
└── SearchWikiDocumentsUseCase

Phase 2（基礎 infrastructure 實作）
├── OpenAIEmbeddingRepository（TS 端，呼叫 OpenAI API）
├── FirestoreWikiDocumentRepository（主要持久化）
├── UpstashRetrievalRepository（真實 vector search）
└── InMemoryWikiDocumentRepository（測試用）

Phase 3（Interfaces + UI 串接）
├── Next.js Server Actions（wiki-page.actions.ts）
├── Next.js queries（wiki.queries.ts）
├── WikiController 補全
├── app/(shell)/wiki/page.tsx 串接真實資料
└── modules/wiki 模組建立（接管 modules/knowledge shim）
```

---

## 9. 變更記錄

| 版本 | 日期 | 變更說明 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2026-03-20 | 初版建立，涵蓋 Wiki 目標架構、RAG 全流程、Firestore 資料結構、模組結構規劃 | xuanwu-app 架構委員會 |
| v1.1.0 | 2026-03-20 | 新增第 8 節：core/wiki-core 當前實作狀態與交付缺口分析（gap analysis） | xuanwu-app 架構委員會 |
