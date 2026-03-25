# 領域概念模型：AI 知識平台架構實現指南

基於 [architecture.md](./architecture.md) 所描述的「Notion × Wiki × NotebookLM」融合架構研究，本文說明儲存庫實現此系統所需的核心領域概念、有界上下文（Bounded Context）、聚合根（Aggregate Root）、值物件（Value Object）及領域事件（Domain Event）。

---

## 一、三層架構與有界上下文對應

architecture.md 確立了三層融合架構。每一層對應儲存庫中一組獨立的有界上下文（模組）：

```text
┌─────────────────────────────────────────────────┐
│              AI Layer（AI 層）                    │  ← modules/retrieval, modules/agent, modules/knowledge
├─────────────────────────────────────────────────┤
│         Knowledge Graph Layer（知識圖譜層）        │  ← modules/knowledge-graph, modules/wiki-beta
├─────────────────────────────────────────────────┤
│         Content / UI Layer（內容層）               │  ← modules/content, modules/workspace
└─────────────────────────────────────────────────┘
```

| 架構層 | 對應模組 | 核心職責 |
| --- | --- | --- |
| Content / UI Layer | `content`, `workspace` | Block 編輯器、頁面樹、資料庫、版本歷程 |
| Knowledge Graph Layer | `knowledge-graph`, `wiki-beta`, `namespace` | 頁面連結、圖譜邊、分類樹、重定向 |
| AI Layer | `knowledge`, `retrieval`, `agent` | 文件攝入、Embedding、RAG 查詢、AI Agent |

---

## 二、Content / UI Layer 的領域概念

### 2.1 Page（頁面聚合根）

Page 是系統中最基本的知識單元，融合了 Notion 的「可排版頁面」與 Wiki 的「知識圖節點」兩種角色。

**實現位置：** `modules/content/domain/entities/content-page.entity.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 唯一識別碼（聚合根 ID） |
| `title` | `string` | 頁面標題（Graph Node 標籤） |
| `slug` | `string` | URL 友好路徑（重定向的基礎） |
| `parentPageId` | `string \| null` | 父頁面 ID（樹狀層級） |
| `blockIds` | `string[]` | 組成此頁面的 Block 列表（有序） |
| `status` | `PageStatus` | 頁面狀態（draft / published / archived） |
| `workspaceId` | `string` | 所屬工作區（租戶隔離） |
| `organizationId` | `string` | 所屬組織（多租戶） |

**值物件：**
- `PageStatus`：`"draft" | "published" | "archived"`
- `PageSlug`：確保唯一且 URL-safe 的值物件

**不變式（Invariants）：**
- 一個 Page 必須屬於一個 Workspace。
- `slug` 在同一 Workspace 中必須唯一。
- 已 `archived` 的頁面不能再接受 Block 更新。

### 2.2 Block（區塊聚合根）

Block 是 Notion Block System 的對應物，是頁面的最小內容單元。

**實現位置：** `modules/content/domain/entities/content-block.entity.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | Block 唯一識別碼 |
| `pageId` | `string` | 所屬頁面（外鍵） |
| `type` | `BlockType` | Block 類型（見下方） |
| `content` | `BlockContent` | 具體內容（依 type 變化） |
| `parentBlockId` | `string \| null` | 父 Block（支援巢狀結構） |
| `order` | `number` | 在頁面中的排列順序 |

**BlockType 值物件（對應 Notion Block 類型）：**

```typescript
type BlockType =
  | "text"
  | "heading_1" | "heading_2" | "heading_3"
  | "toggle"
  | "callout"
  | "code"
  | "quote"
  | "divider"
  | "table"
  | "image" | "video" | "file"
  | "embed"
  | "synced_block"
  | "column_layout"
  | "bulleted_list" | "numbered_list"
  | "to_do"
  | "page_link";
```

**設計說明：** Block 被建模為聚合根（獨立 Firestore 文件），而非 Page 內的嵌套陣列，以支援大型頁面的局部更新與 Embedding 顆粒度控制。

### 2.3 ContentVersion（版本快照）

對應 Wiki 的 Edit History / Diff / Rollback 能力。

**實現位置：** `modules/content/domain/entities/content-version.entity.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 版本 ID |
| `pageId` | `string` | 所屬頁面 |
| `snapshotBlocks` | `Block[]` | 此版本的 Block 快照 |
| `editSummary` | `string` | 編輯說明（對應 Wiki Edit Summary） |
| `authorId` | `string` | 作者 ID |
| `createdAt` | `Timestamp` | 版本時間戳 |
| `isMinorEdit` | `boolean` | 是否為小修改標記 |

---

## 三、Knowledge Graph Layer 的領域概念

### 3.1 GraphNode（知識圖節點）

對應 Wiki 的 Page = Graph Node 模型。每個 ContentPage 在知識圖譜中都有一個對應的 GraphNode。

**實現位置：** `modules/knowledge-graph/domain/entities/graph-node.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 節點唯一 ID（通常等於 PageId） |
| `label` | `string` | 顯示標籤 |
| `type` | `GraphNodeType` | 節點類型：`"page" \| "tag" \| "attachment"` |
| `status` | `GraphNodeStatus` | 生命週期：`draft → active → archived` |

**GraphNodeStatus 狀態機：**

```text
draft ──────────→ active ──────────→ archived
  ↑                  │
  └──────────────────┘ (reactivation)
```

**領域事件：**
- `graph-node.activated`：節點從 draft 轉為 active 時觸發
- `graph-node.archived`：節點歸檔時觸發（對應 Wiki Page 的歸檔/刪除流程）

### 3.2 GraphEdge / Link（知識圖邊）

對應 Wiki 的 Internal Link，是知識圖譜的核心關聯機制。

**實現位置：** `modules/knowledge-graph/domain/entities/link.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 邊唯一 ID |
| `fromNodeId` | `string` | 來源節點（連結發起方） |
| `toNodeId` | `string` | 目標節點（連結目標） |
| `type` | `EdgeType` | 語意關係類型（見下方） |
| `status` | `EdgeStatus` | 生命週期：`pending → active → inactive → removed` |

**EdgeType 值物件（對應 Schema + Ontology Layer）：**

```typescript
type EdgeType =
  | "IS_A"        // 繼承關係（A 是 B 的一種）
  | "PART_OF"     // 組成關係（A 是 B 的一部分）
  | "RELATED_TO"  // 相關關係（通用）
  | "DEPENDS_ON"  // 依賴關係
  | "CAUSES"      // 因果關係
  | "CONTRADICTS" // 矛盾關係
  | "REDIRECT"    // 重定向（別名統一）
  | "CATEGORY";   // 分類從屬
```

**不變式：**
- 一條邊的 `fromNodeId` 與 `toNodeId` 不能相同（禁止自環），除非 `type` 為 `CATEGORY`（可描述某分類節點屬於自身分類樹的根）。
- `REDIRECT` 類型的邊在同一來源節點只能有一條 `active` 狀態的邊。

**Backlink 的領域含義：**  
Backlink（入度統計）不是獨立的領域物件，而是對某個 `toNodeId` 上所有 `active` 的 GraphEdge 進行反向查詢的結果。Repository 介面應提供 `findByToNodeId(nodeId)` 方法支援此查詢。

### 3.3 WikiBetaPage（Wiki 頁面整合）

作為 content 模組 ContentPage 在 wiki-beta 有界上下文中的投影，加入 Wiki 特有語意（Library 組織、內容樹層級）。

**實現位置：** `modules/wiki-beta/domain/entities/`

**補充屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `libraryId` | `string` | 所屬 Library（對應 Wiki 的 Namespace） |
| `treeOrder` | `number` | 在內容樹中的排列順序 |
| `isRedirect` | `boolean` | 是否為重定向頁面（別名條目） |
| `redirectTargetId` | `string \| null` | 重定向目標頁面 ID |

### 3.4 Namespace（命名空間）

對應 Wiki 的 Namespace 機制（User: / Category: / File: 等前綴分類），在 xuanwu-app 中用於 Workspace 層面的知識空間隔離。

**實現位置：** `modules/namespace/`

## 四、AI Layer 的領域概念

### 4.1 IngestionDocument（攝入文件聚合根）

文件進入 RAG Pipeline 的起點，對應 architecture.md 第十二節 Ingestion Pipeline 的最頂層實體。

**實現位置：** `modules/knowledge/domain/entities/IngestionDocument.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 文件唯一 ID |
| `organizationId` | `string` | 所屬組織（多租戶隔離） |
| `workspaceId` | `string` | 所屬工作區 |
| `sourceFileId` | `string` | 原始檔案 ID（關聯 asset 模組） |
| `title` | `string` | 文件標題 |
| `mimeType` | `string` | 原始檔案類型（PDF / DOCX / Markdown 等） |
| `status` | `IngestionStatus` | 攝入狀態（見下方） |

**IngestionStatus 狀態機（對應 Ingestion Pipeline 各階段）：**

```text
                        ┌─────────────────────────────────────┐
                        ↓                                     │
uploaded → parsing → chunking → embedding → indexed → stale → re-indexing
    │          │          │           │                         │
    └──────────┴──────────┴───────────┴─────────────────────────┘
                                  failed（任一階段可轉入）
```

| 狀態 | 說明 |
| --- | --- |
| `uploaded` | 檔案已上傳，等待處理 |
| `parsing` | 正在解析（Parse 階段：PDF/DOCX → Markdown） |
| `chunking` | 正在分塊（Chunk 階段：語意分段） |
| `embedding` | 正在向量化（Embedding 階段） |
| `indexed` | 已完成索引，可供查詢 |
| `stale` | 原始文件已更新，需重新索引 |
| `re-indexing` | 重新索引中；完成後轉回 `parsing` 重新執行完整 Pipeline |
| `failed` | Pipeline 任一階段發生錯誤，可由管理員重設為 `uploaded` 重試 |

---

### 4.2 IngestionJob（攝入作業）

追蹤單一文件在整個 Pipeline 中的執行進度，對應 architecture.md 中各 Pipeline 階段的工作記錄。

**實現位置：** `modules/knowledge/domain/entities/IngestionJob.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 作業唯一 ID |
| `documentId` | `string` | 所屬文件 |
| `stage` | `PipelineStage` | 當前執行階段 |
| `startedAt` | `Timestamp` | 開始時間 |
| `completedAt` | `Timestamp \| null` | 完成時間 |
| `error` | `string \| null` | 錯誤訊息（若 failed） |

**PipelineStage 值物件：**

```typescript
type PipelineStage = "parse" | "clean" | "taxonomy" | "chunk" | "embed" | "persist" | "mark_ready";
```

### 4.3 IngestionChunk（語意分塊）

代表文件被分割後的最小語意單元，是 Embedding 的直接輸入與 RAG 檢索的基本單位。

**實現位置：** `modules/knowledge/domain/entities/IngestionChunk.ts`

**核心屬性（對應 architecture.md 17.1 embeddings collection）：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | Chunk 唯一 ID |
| `documentId` | `string` | 所屬文件 |
| `content` | `string` | Chunk 文字內容 |
| `chunkIndex` | `number` | 在文件中的順序編號 |
| `sectionPath` | `string` | 標題路徑（如 `"第三章 > 3.1 小節"`） |
| `pageNumber` | `number \| null` | 原始頁碼（PDF 適用） |
| `vector` | `number[]` | 向量表示（Embedding 結果） |
| `tokenCount` | `number` | Token 數量（分塊品質指標） |

**不變式：**
- `vector` 維度在同一 Workspace 中必須一致（由 Embedding Model 決定）。Embedding Model 的選擇記錄在 `Workspace` 聚合根的 `capabilities.embeddingModel` 屬性，由 `modules/workspace` 負責維護。
- `content` 長度不得超過所選 Embedding Model 的 token 上限。

### 4.4 RagQuery（RAG 查詢聚合根）

代表一次完整的 RAG 查詢生命週期，從用戶輸入到最終帶引用的回答。

**實現位置：** `modules/retrieval/domain/entities/RagQuery.ts`

**核心介面：**

```typescript
interface RagQuery {
  id: string;
  workspaceId: string;
  input: string;               // 用戶原始輸入
  intent?: QueryIntent;        // 分類後的查詢意圖
  rewrittenQuery?: string;     // 改寫後的查詢語句（HyDE 或 Query Rewriting）
  subQueries?: string[];       // 拆解的子查詢（Query Decomposition）
}
```

**QueryIntent 值物件（對應 Query Understanding Layer）：**

```typescript
type QueryIntent = "question_answering" | "summarization" | "comparison" | "reasoning" | "exploration";
```

**RagRetrievedChunk 值物件（檢索結果項目）：**

```typescript
interface RagRetrievedChunk {
  chunkId: string;
  documentId: string;
  content: string;
  score: number;           // 相關性分數（Reranker 輸出）
  retrievalMethod: "dense" | "sparse" | "graph" | "hybrid";
}
```

**RagCitation 值物件（引用系統，對應 Source Grounding）：**

```typescript
interface RagCitation {
  documentId: string;
  documentTitle: string;
  chunkId: string;
  sectionPath: string;
  pageNumber?: number;
  confidenceScore: number;     // 引用可信度
}
```

**RagRetrievalSummary 值物件（完整回答結果）：**

```typescript
interface RagRetrievalSummary {
  answer: string;              // LLM 生成的回答
  citations: RagCitation[];    // 引用來源列表
  faithfulnessScore?: number;  // Faithfulness 驗證分數
  isGrounded: boolean;         // 是否通過 Grounding 驗證
}
```

### 4.5 AgentThread / AgentMessage（AI Agent 對話層）

對應 architecture.md 第七節 AI Memory Layer 中的 Episodic Memory（互動記憶）。

**實現位置：**
- `modules/agent/domain/entities/thread.ts`
- `modules/agent/domain/entities/message.ts`

**AgentThread 核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 對話 Thread ID |
| `workspaceId` | `string` | 所屬工作區 |
| `userId` | `string` | 發起用戶 |
| `createdAt` | `Timestamp` | 建立時間 |
| `updatedAt` | `Timestamp` | 最後更新時間 |

**AgentMessage 核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 訊息唯一 ID |
| `threadId` | `string` | 所屬 Thread |
| `role` | `"user" \| "assistant"` | 訊息角色 |
| `content` | `string` | 訊息內容 |
| `citations` | `RagCitation[]` | 關聯引用（AI 回覆時） |
| `createdAt` | `Timestamp` | 建立時間 |

## 五、三層記憶架構的領域映射

架構研究（第七節）定義了三種記憶類型。以下是各記憶類型在儲存庫中的領域對應：

| 記憶類型 | 架構角色 | 儲存庫對應 | 持久化機制 |
| --- | --- | --- | --- |
| Semantic Memory（語意記憶） | 知識庫長期記憶 | `IngestionChunk.vector` | Firestore Vector Search |
| Episodic Memory（互動記憶） | 用戶互動歷程 | `AgentThread` + `AgentMessage` | Firestore `sessions` collection |
| Working Memory（工作記憶） | 當前對話上下文 | 傳遞給 Genkit Flow 的 context buffer | In-memory（不持久化） |

---

## 六、Ingestion Pipeline 的領域事件

完整的 Ingestion Pipeline（第十二節）應透過領域事件在各階段間協調，避免直接同步呼叫。

| 領域事件 | 觸發時機 | 訂閱方 |
| --- | --- | --- |
| `knowledge.document_registered` | IngestionDocument 建立時 | py_fn 攝入 Worker |
| `knowledge.parsing_completed` | Parse 階段完成時 | py_fn 清洗 Worker |
| `knowledge.chunking_completed` | Chunk 階段完成時 | py_fn Embedding Worker |
| `knowledge.embedding_completed` | Embedding 完成，vector 寫入時 | Next.js（更新 status → indexed） |
| `knowledge.document_stale` | 原始文件更新時 | py_fn 觸發 re-indexing |
| `knowledge.ingestion_failed` | 任一階段發生錯誤時 | 通知系統（notification 模組） |

**事件 DTO 結構慣例：**

```typescript
interface DomainEventDTO {
  type: "knowledge.document_registered";  // 格式：module.event_name
  payload: { documentId: string; workspaceId: string; };
  occurredAtISO: string;                  // ISO 8601 時間戳
}
```

---

## 七、Query Understanding Layer 的領域服務

Query Understanding Layer（第六節）的核心邏輯應建模為領域服務（Domain Service），而非 Use Case，因為它代表無狀態的業務規則計算。

**建議的領域服務介面（位於 `modules/retrieval/domain/services/`）：**

```typescript
interface QueryPlannerService {
  classifyIntent(query: string): Promise<QueryIntent>;
  decomposeQuery(query: string): Promise<string[]>;
  rewriteForRetrieval(query: string): Promise<string>;
  generateHyDE(query: string): Promise<string>;  // Hypothetical Document Embedding
}
```

**對應的 Genkit Flow（`modules/ai` 或 `modules/retrieval/infrastructure/genkit/`）：**
- `QueryPlannerFlow` → 包裝上方 QueryPlannerService 的 AI 實作
- `RetrievalFlow` → Hybrid RAG（Dense + Sparse + Graph + Reranker）
- `CitationFlow` → Answer + Source Mapping + Faithfulness Check

---

## 八、Schema + Ontology Layer 的領域概念

架構研究（第十四節）定義了 Domain Ontology。以下是對應的領域建模方向：

### Ontology 在 EdgeType 中的實現

GraphEdge 的 `type` 屬性直接承載本體論的關係語意：

```text
IS_A        → 類別繼承（OWL SubClassOf）
PART_OF     → 組成關係（Mereology）
RELATED_TO  → 通用相關（RDF関係）
DEPENDS_ON  → 工程依賴
CAUSES      → 因果推理
CONTRADICTS → 知識矛盾偵測
```

### 未來擴充：Entity Normalization（實體正規化）

為支援 Wiki 的 Redirect（別名統一）功能，Domain 層需要：
1. `WikiBetaPage.isRedirect` + `redirectTargetId` 屬性（已在 3.3 節定義）
2. `GraphEdge` 的 `REDIRECT` 類型（已在 3.2 節的 EdgeType 中定義）
3. Repository 的 `resolveRedirect(pageId)` 方法，沿 REDIRECT 邊鏈追蹤到正規頁面

---

## 九、Hybrid Retrieval 的技術邊界說明

architecture.md 第八節描述了 Hybrid Retrieval（Dense + Sparse + Graph + Reranker）。這是基礎設施關切（Infrastructure Concern），**不屬於**領域模型，而是由以下層級實現：

| 元件 | 層級 | 位置 |
| --- | --- | --- |
| Dense Retrieval（Vector Search） | Infrastructure | `modules/retrieval/infrastructure/firebase/` |
| Sparse Retrieval（BM25） | Infrastructure | `modules/retrieval/infrastructure/` |
| Graph Retrieval（Knowledge Graph 遍歷） | Infrastructure | `modules/knowledge-graph/infrastructure/` |
| Reranker | Infrastructure / AI | `modules/retrieval/infrastructure/genkit/` |
| Fusion & Ranking | Application | `modules/retrieval/application/use-cases/answer-rag-query.use-case.ts` |

領域層只定義 `RagRetrievedChunk.retrievalMethod` 值物件，記錄某個 Chunk 是透過哪種方式被檢索到的，供上層決策使用。

---

## 十、完整領域概念清單

| 領域概念 | 類型 | 模組 | 狀態 |
| --- | --- | --- | --- |
| `ContentPage` | 聚合根 | `content` | ✅ 已實現 |
| `ContentBlock` | 聚合根 | `content` | ✅ 已實現 |
| `ContentVersion` | 聚合根 | `content` | ✅ 已實現 |
| `BlockType` | 值物件 | `content` | ✅ 已實現 |
| `PageStatus` | 值物件 | `content` | ✅ 已實現 |
| `GraphNode` | 聚合根 | `knowledge-graph` | ✅ 已實現 |
| `GraphEdge / Link` | 聚合根 | `knowledge-graph` | ✅ 已實現 |
| `EdgeType` | 值物件 | `knowledge-graph` | ✅ 已實現 |
| `GraphNodeStatus` | 值物件（狀態機） | `knowledge-graph` | ✅ 已實現 |
| `WikiBetaPage` | 投影實體 | `wiki-beta` | ✅ 已實現 |
| `WikiBetaLibrary` | 聚合根 | `wiki-beta` | ✅ 已實現 |
| `IngestionDocument` | 聚合根 | `knowledge` | ✅ 已實現 |
| `IngestionJob` | 聚合根 | `knowledge` | ✅ 已實現 |
| `IngestionChunk` | 聚合根 | `knowledge` | ✅ 已實現 |
| `IngestionStatus` | 值物件（狀態機） | `knowledge` | ✅ 已實現 |
| `PipelineStage` | 值物件 | `knowledge` | ✅ 已實現 |
| `RagQuery` | 聚合根 | `retrieval` | ✅ 已實現 |
| `RagRetrievedChunk` | 值物件 | `retrieval` | ✅ 已實現 |
| `RagCitation` | 值物件 | `retrieval` | ✅ 已實現 |
| `RagRetrievalSummary` | 值物件 | `retrieval` | ✅ 已實現 |
| `QueryIntent` | 值物件 | `retrieval` | 🔲 待補充 |
| `AgentThread` | 聚合根 | `agent` | ✅ 已實現 |
| `AgentMessage` | 聚合根 | `agent` | ✅ 已實現 |
| `QueryPlannerService` | 領域服務介面 | `retrieval` | 🔲 待補充 |
| `Namespace` | 聚合根 | `namespace` | ✅ 已實現 |

---

> 本文件從領域建模角度解釋儲存庫如何實現 architecture.md 描述的三層融合知識平台研究。詳細的技術實現決策請參閱各模組的 `README.md` 及相關 ADR（`docs/decision-architecture/adr/`）。
