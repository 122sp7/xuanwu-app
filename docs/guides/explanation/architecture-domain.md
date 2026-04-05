# 領域概念模型：AI 知識平台架構實現指南

基於 [architecture.md](./architecture.md) 所描述的「Notion × Wiki × NotebookLM」融合架構研究，本文說明儲存庫實現此系統所需的核心領域概念、有界上下文（Bounded Context）、聚合根（Aggregate Root）、值物件（Value Object）及領域事件（Domain Event）。

---

## 一、四層架構與有界上下文對應

architecture.md 確立了三層融合架構（Content / UI、Knowledge Graph、AI）。儲存庫在此三層之下，加入第四層「**Platform Foundation Layer**」，提供驗證、帳戶、組織與工作區等跨切關注點，讓上層三層得以共用同一租戶模型：

```text
┌─────────────────────────────────────────────────┐
│              AI Layer（AI 層）                    │  ← modules/search, modules/notebook, modules/knowledge
├─────────────────────────────────────────────────┤
│         Knowledge Graph Layer（知識圖譜層）        │  ← modules/wiki
├─────────────────────────────────────────────────┤
│         Content / UI Layer（內容層）               │  ← modules/knowledge, modules/source
├─────────────────────────────────────────────────┤
│    Platform Foundation Layer（平台基礎層）         │  ← modules/workspace, modules/organization
│                                                  │     modules/account, modules/identity, modules/shared
└─────────────────────────────────────────────────┘
```

| 架構層 | 對應模組 | 核心職責 |
| --- | --- | --- |
| Platform Foundation Layer | `identity`, `account`, `organization`, `workspace`, `shared` | 身份驗證、帳戶設定檔、組織租戶、工作區容器與能力掛載、共享領域原語（slug 工具、事件存儲原語） |
| Content / UI Layer | `content`, `asset` | Block 編輯器、頁面樹、資料庫、版本歷程、Wiki Library 結構化資料 |
| Knowledge Graph Layer | `knowledge-graph` | 頁面連結、圖譜邊、分類樹、重定向 |
| AI Layer | `knowledge`, `retrieval`, `agent` | 文件攝入、Embedding、RAG 查詢、AI Agent |

**依賴方向：** 圖中越下方的層，越是上方層的基礎——上方層依賴下方層，但下方層絕不直接依賴上方層。圖示從上往下讀是「功能堆疊」，從下往上讀才是「依賴方向」。跨層通訊一律透過各模組的 `api/` 邊界：

```text
依賴方向（箭頭表示「依賴」）：

AI Layer
  ↓ 依賴
Knowledge Graph Layer
  ↓ 依賴
Content / UI Layer
  ↓ 依賴
Platform Foundation Layer（被所有層依賴，但它本身無上層依賴）
```

---

## 二、Content / UI Layer 的領域概念

### 2.1 Page（頁面聚合根）

Page 是系統中最基本的知識單元，融合了 Notion 的「可排版頁面」與 Wiki 的「知識圖節點」兩種角色。

**實現位置：** `modules/knowledge/domain/entities/content-page.entity.ts`

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

**實現位置：** `modules/knowledge/domain/entities/content-block.entity.ts`

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

**實現位置：** `modules/knowledge/domain/entities/content-version.entity.ts`

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

**實現位置：** `modules/wiki/domain/entities/graph-node.ts`

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

**實現位置：** `modules/wiki/domain/entities/link.ts`

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
- 一條邊的 `fromNodeId` 與 `toNodeId` 不能相同（禁止自環）。
- `REDIRECT` 類型的邊在同一來源節點只能有一條 `active` 狀態的邊。

**Backlink 的領域含義：**  
Backlink（入度統計）不是獨立的領域物件，而是對某個 `toNodeId` 上所有 `active` 的 GraphEdge 進行反向查詢的結果。Repository 介面應提供 `findByToNodeId(nodeId)` 方法支援此查詢。

### 3.3 WikiPage（Wiki 頁面整合）

輕量化的 Wiki 風格頁面實體，用於 wiki 介面期間的過渡期分解。因為頁面是內容領域關切，此實體已遷移至 `content` 模組。

> **模組遷移說明：** `modules/wiki` 獨立模組已移除。WikiPage 概念已遷移至 `modules/knowledge`（頁面層）；WikiLibrary 概念遷移至 `modules/source`（結構化資料層）；WikiContentTree 保留於 `modules/workspace`；Wiki RAG 查詢類型遷移至 `modules/search`。

**實現位置：** `modules/knowledge/domain/entities/wiki-page.types.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 頁面唯一識別碼 |
| `accountId` | `string` | 所屬帳戶（租戶隔離） |
| `workspaceId` | `string \| undefined` | 所屬工作區（選填） |
| `title` | `string` | 頁面標題 |
| `slug` | `string` | URL 友好路徑 |
| `parentPageId` | `string \| null` | 父頁面 ID（樹狀層級） |
| `order` | `number` | 在內容樹中的排列順序 |
| `status` | `WikiPageStatus` | 頁面狀態：`"active" \| "archived"` |
| `createdAt` | `Date` | 建立時間 |
| `updatedAt` | `Date` | 最後更新時間 |

### 3.4 WikiLibrary（Wiki 知識庫聚合根）

WikiLibrary 是輕量化的結構化資料模型，相當於 Wiki 的「書架」或 Notion 的「Database」，用於將多個結構化資料列群組為一個具有欄位定義的知識集合。因為 Library 是資產與結構化資料的關切，此實體已遷移至 `asset` 模組。

**實現位置：** `modules/source/domain/entities/wiki-library.types.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | Library 唯一 ID（聚合根） |
| `accountId` | `string` | 所屬帳戶（租戶隔離） |
| `workspaceId` | `string \| undefined` | 所屬工作區（選填） |
| `name` | `string` | Library 名稱（顯示於側邊欄） |
| `slug` | `string` | URL 友好路徑 |
| `status` | `WikiLibraryStatus` | 狀態：`"active" \| "archived"` |
| `createdAt` | `Date` | 建立時間 |
| `updatedAt` | `Date` | 最後更新時間 |

**相關實體：**
- `WikiLibraryField`：Library 的欄位定義（`key`, `label`, `type`, `required`, `options`），支援類型：`"title" | "text" | "number" | "select" | "relation"`
- `WikiLibraryRow`：Library 的資料列（`values: Record<string, unknown>`）

**與其他概念的關係：**
- 一個 Workspace 可包含多個 WikiLibrary。
- WikiContentTree 的側邊欄導覽以 Library 為分組呈現頁面列表。

### 3.5 Slug 工具（原 Namespace 模組）

> **模組遷移說明：** `modules/namespace` 獨立模組已移除。其核心職責——Slug 生成與驗證——已遷移至 `modules/shared/domain/slug-utils.ts`，透過 `modules/shared/api` 公開。

Slug 工具提供工作區層面的 URL 友好路徑生成與驗證能力：

**實現位置：** `modules/shared/domain/slug-utils.ts`（透過 `modules/shared/api` 匯出）

| 函式 | 說明 |
| --- | --- |
| `deriveSlugCandidate(displayName)` | 將顯示名稱轉換為 slug 候選字串（小寫、連字符分隔、最長 63 字元） |
| `isValidSlug(slug)` | 驗證 slug 是否符合規範（`/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/`） |

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
| `re-indexing` | 重新索引中；完成後轉回 `uploaded` 重新執行完整 Pipeline |
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
- `vector` 維度在同一 Workspace 中必須一致（由 Embedding Model 決定）。Embedding Model 的選擇儲存於 Workspace `capabilities` 陣列中 `id: "embedding"` 的 Capability 項目的 `config` 物件內，由 `modules/workspace` 負責維護。
- `content` 長度不得超過所選 Embedding Model 的 token 上限。

### 4.4 RagQuery（RAG 查詢聚合根）

代表一次完整的 RAG 查詢生命週期，從用戶輸入到最終帶引用的回答。

**實現位置：** `modules/search/domain/entities/RagQuery.ts`

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
- `modules/notebook/domain/entities/thread.ts`
- `modules/notebook/domain/entities/message.ts`

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

---

## 五、Platform Foundation Layer 的領域概念

Platform Foundation Layer 提供整個平台的身份驗證、帳戶設定檔、組織結構與工作區容器，是上層三層（Content / UI、Knowledge Graph、AI）的共同基礎。所有 Content Page、Knowledge Graph 節點及 AI 文件攝入，都必須在一個已驗證身份的用戶（Identity）、歸屬帳戶（Account）、組織租戶（Organization）及工作區（Workspace）的脈絡下運行。

### 5.1 Identity（身份識別）

Identity 是平台安全入口，代表一個已驗證的 Firebase 用戶會話。

**實現位置：** `modules/identity/domain/entities/Identity.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `uid` | `string` | Firebase UID（全平台唯一識別碼） |
| `email` | `string \| null` | 電子信箱（匿名登入時為 null） |
| `displayName` | `string \| null` | 顯示名稱 |
| `photoURL` | `string \| null` | 大頭照 URL |
| `isAnonymous` | `boolean` | 是否為匿名會話 |
| `emailVerified` | `boolean` | 信箱是否已驗證 |

**值物件：**
- `SignInCredentials`：`{ email: string; password: string }`
- `RegistrationInput`：`{ email: string; password: string; name: string }`

**用例：** `SignInUseCase`、`RegisterUseCase`、`SignOutUseCase`、`SendPasswordResetEmailUseCase`

#### TokenRefreshSignal（Custom Claims 刷新訊號）

當帳戶角色或存取政策發生變更時，系統需觸發 Firebase Custom Claims 重新整理，以確保 JWT 中的權限資訊是最新的。此三方握手稱為 **[S6] Claims Refresh Protocol**：

```text
Party 1（account / organization 模組）
    → 角色或政策變更
    → 呼叫 identityApi.emitTokenRefreshSignal()

Party 2（identity 模組 TokenRefreshRepository）
    → 寫入 Firestore tokenRefreshSignals/<accountId> 文件

Party 3（前端 useTokenRefreshListener hook）
    → 監聽 Firestore 該文件
    → 偵測到訊號後呼叫 user.getIdToken(true) 強制刷新 JWT
```

**TokenRefreshSignal 屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `accountId` | `string` | 觸發刷新的帳戶 ID |
| `reason` | `TokenRefreshReason` | 觸發原因 |
| `issuedAt` | `string` | ISO-8601 時間戳 |
| `traceId` | `string \| undefined` | 可選的追蹤 ID（審計用） |

**TokenRefreshReason 值物件：** `"role:changed" | "policy:changed"`

---

### 5.2 Account（帳戶聚合根）

Account 是平台中「人」或「組織」在系統內的完整設定檔，支援 `user`（個人）與 `organization`（組織帳戶）兩種類型。

**實現位置：** `modules/account/domain/entities/Account.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 帳戶唯一 ID（對應 Firebase UID 或 Org ID） |
| `name` | `string` | 帳戶顯示名稱 |
| `accountType` | `AccountType` | 類型：`"user" \| "organization"` |
| `email` | `string \| undefined` | 聯絡信箱 |
| `photoURL` | `string \| undefined` | 大頭照 / 組織 Logo |
| `bio` | `string \| undefined` | 個人簡介或組織描述 |
| `ownerId` | `string \| undefined` | 組織帳戶的擁有者 UID |
| `role` | `OrganizationRole \| undefined` | 在組織中的角色 |
| `members` | `MemberReference[] \| undefined` | 組織帳戶的成員列表 |
| `teams` | `Team[] \| undefined` | 組織帳戶的小組列表 |
| `wallet` | `Wallet \| undefined` | 錢包（積分 / 配額） |
| `theme` | `ThemeConfig \| undefined` | 自訂主題色彩 |
| `createdAt` | `Timestamp \| undefined` | 建立時間 |

**值物件：**
- `AccountType`：`"user" | "organization"`
- `OrganizationRole`：`"Owner" | "Admin" | "Member" | "Guest"`
- `Presence`：`"active" | "away" | "offline"`
- `ThemeConfig`：`{ primary; background; accent }`（對應 Notion 的工作區自訂主題）
- `Wallet`：`{ balance: number }`（積分系統）

**Team 嵌套物件（組織帳戶專屬）：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 小組 ID |
| `name` | `string` | 小組名稱 |
| `type` | `"internal" \| "external"` | 內部小組或外部合作小組 |
| `memberIds` | `string[]` | 成員 ID 列表 |

**用例：** `CreateUserAccountUseCase`、`UpdateUserProfileUseCase`、`CreditWalletUseCase`、`AssignAccountRoleUseCase`

#### AccountPolicy（帳戶層 ABAC 政策）

Account 支援屬性型存取控制（ABAC）。每個帳戶可定義多條 `AccountPolicy`，由規則集（PolicyRule[]）組成，精確控制哪些資源可以執行哪些操作。

**AccountPolicy 屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 政策唯一 ID |
| `accountId` | `string` | 所屬帳戶 |
| `name` | `string` | 政策名稱 |
| `rules` | `PolicyRule[]` | 規則列表 |
| `isActive` | `boolean` | 是否啟用 |
| `createdAt` | `string` | ISO-8601 建立時間 |
| `traceId` | `string \| undefined` | 審計追蹤 ID |

**PolicyRule 值物件：**

```typescript
interface PolicyRule {
  resource: string;                      // 受保護資源路徑
  actions: string[];                     // 允許或拒絕的操作列表
  effect: "allow" | "deny";             // 政策效果
  conditions?: Record<string, string>;   // 條件約束（可選）
}
```

政策變更後，系統自動觸發 `TOKEN_REFRESH_SIGNAL`（see §5.1），確保 JWT 中的 Custom Claims 即時反映最新政策。

---

### 5.3 Organization（組織聚合根）

Organization 是多租戶架構的核心，管理組織的完整生命週期：成員招募、小組管理、合作夥伴邀請及組織層存取政策。

**實現位置：** `modules/organization/domain/entities/Organization.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 組織唯一 ID（聚合根） |
| `name` | `string` | 組織名稱 |
| `ownerId` | `string` | 擁有者 UID |
| `email` | `string \| undefined` | 組織聯絡信箱 |
| `description` | `string \| undefined` | 組織描述 |
| `theme` | `ThemeConfig \| undefined` | 自訂主題 |
| `members` | `MemberReference[]` | 成員列表（含角色與在線狀態） |
| `memberIds` | `string[]` | 成員 ID 快取（查詢最佳化） |
| `teams` | `Team[]` | 小組列表 |
| `partnerInvites` | `PartnerInvite[] \| undefined` | 合作夥伴邀請列表 |
| `createdAt` | `Timestamp` | 建立時間 |

**PartnerInvite 值物件（合作夥伴邀請）：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 邀請唯一 ID |
| `email` | `string` | 被邀請方信箱 |
| `teamId` | `string` | 加入的小組 |
| `role` | `OrganizationRole` | 授予角色 |
| `inviteState` | `InviteState` | 邀請狀態 |
| `invitedAt` | `Timestamp` | 邀請時間 |
| `protocol` | `string` | 協議說明（外部協作規範） |

**InviteState 值物件：** `"pending" | "accepted" | "expired"`

#### OrgPolicy（組織層 ABAC 政策）

與帳戶層 AccountPolicy 類似，但作用域（`OrgPolicyScope`）更廣，可覆蓋整個組織的工作區、成員或全局資源。

**OrgPolicyScope 值物件：** `"workspace" | "member" | "global"`

**用例：** `CreateOrganizationUseCase`、`InviteMemberUseCase`、`RecruitMemberUseCase`、`CreateTeamUseCase`、`SendPartnerInviteUseCase`、`CreateOrgPolicyUseCase`

---

### 5.4 Workspace（工作區聚合根）

Workspace 是平台的「房間」（Room）概念，是 Content、Knowledge Graph 與 AI 三層功能的運行容器。每個 ContentPage、GraphNode 及 IngestionDocument 都掛載在一個特定的 Workspace 之下。

**實現位置：** `modules/workspace/domain/entities/Workspace.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 工作區唯一 ID（聚合根） |
| `name` | `string` | 工作區名稱 |
| `lifecycleState` | `WorkspaceLifecycleState` | 生命週期狀態（見下方） |
| `visibility` | `WorkspaceVisibility` | 能見度：`"visible" \| "hidden"` |
| `accountId` | `string` | 擁有者帳戶 ID（user 或 org） |
| `accountType` | `"user" \| "organization"` | 擁有者帳戶類型 |
| `capabilities` | `Capability[]` | 已掛載的能力模組（見下方） |
| `grants` | `WorkspaceGrant[]` | 存取授權列表 |
| `teamIds` | `string[]` | 關聯的組織小組 |
| `address` | `Address \| undefined` | 實體地址（選填） |
| `locations` | `WorkspaceLocation[] \| undefined` | 工作區內的地點列表 |
| `personnel` | `WorkspacePersonnel \| undefined` | 工作區人事指派（經理 / 主管 / 安全官） |
| `createdAt` | `Timestamp` | 建立時間 |

**WorkspaceLifecycleState 狀態機：**

```text
preparatory ──────────→ active ──────────→ stopped
```

| 狀態 | 說明 |
| --- | --- |
| `preparatory` | 工作區準備中，正在初始化能力與設定 |
| `active` | 工作區正常運作，可使用全部能力 |
| `stopped` | 工作區已停用，保留資料但不可新增內容 |

**Capability 值物件（能力模組）：**

工作區透過 `capabilities` 列表宣告它開啟了哪些功能模組，對應 architecture.md 中各層的具體能力：

```typescript
interface Capability {
  id: string;
  name: string;
  type: "ui" | "api" | "data" | "governance" | "monitoring";
  status: "stable" | "beta";
  description: string;
  config?: object;  // 各能力的自訂設定
}
```

**WorkspaceGrant 值物件（存取授權）：**

```typescript
interface WorkspaceGrant {
  userId?: string;   // 個人授權
  teamId?: string;   // 小組授權
  role: string;      // 授予的角色
  protocol?: string; // 授權協議（外部合作適用）
}
```

**不變式：**
- 一個 Workspace 必須屬於一個 Account（user 或 organization）。
- `stopped` 狀態的 Workspace 不能再掛載新的 Capability。
- 每個 Workspace 中 `grants` 陣列內，相同 `userId` 最多只能有一條個人直接授權記錄（對應 `WorkspaceMemberAccessSource` 中的 `"direct"` 管道；透過 `userId` 判斷，而非透過 `teamId`）。

**用例：** `CreateWorkspaceUseCase`、`CreateWorkspaceWithCapabilitiesUseCase`、`UpdateWorkspaceSettingsUseCase`、`MountCapabilitiesUseCase`、`GrantTeamAccessUseCase`、`GrantIndividualAccessUseCase`

#### WorkspaceMemberView（工作區成員讀取模型）

WorkspaceMemberView 是 CQRS 的讀側（Read Model），聚合來自 Organization 成員列表與 Workspace grants 的資訊，為 UI 提供「此工作區中哪些人可存取、透過哪個渠道」的扁平化視圖。

**實現位置：** `modules/workspace/domain/entities/WorkspaceMember.ts`

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 成員 ID |
| `displayName` | `string` | 顯示名稱 |
| `presence` | `WorkspaceMemberPresence` | 在線狀態 |
| `isExternal` | `boolean` | 是否為外部合作成員 |
| `accessChannels` | `WorkspaceMemberAccessChannel[]` | 存取管道列表 |

**WorkspaceMemberAccessSource 值物件：** `"owner" | "direct" | "team" | "personnel"`

#### WikiContentTree（側邊欄導覽樹聚合根）

WikiContentTree 是 Wiki 側邊欄的導覽資料結構，以帳戶為根節點（personal 帳戶優先），展示所屬工作區及各工作區的內容入口（spaces、pages、libraries、documents、rag、ai-tools 等）。

**實現位置：** `modules/workspace/domain/entities/WikiContentTree.ts`

**樹狀結構：**

```text
WikiAccountContentNode（帳戶節點）
  ├── accountId, accountName, accountType（personal | organization）
  ├── membersHref（組織帳戶限定）
  ├── teamsHref（組織帳戶限定）
  └── workspaces[]
        └── WikiWorkspaceContentNode（工作區節點）
              ├── workspaceId, workspaceName
              └── contentBaseItems[]
                    └── WikiContentItemNode（內容入口）
                          ├── key（spaces | pages | libraries | rag | ai-tools …）
                          ├── label, href
                          └── enabled（是否啟用）
```

**不變式：**
- Personal 帳戶節點排列在 Organization 帳戶節點之前。
- `membersHref` 與 `teamsHref` 僅在 `accountType === "organization"` 時存在。

---

### 5.5 Platform Foundation 跨模組關係

```text
Identity ──→ Account ──→ Organization ──→ Workspace
  │ (uid)       │ (accountId)   │ (orgId)       │ (workspaceId)
  │             │               │               │
  │         AccountPolicy   OrgPolicy       Capability
  │             │               │
  └─────────────┴───────────────┘
         [S6] Claims Refresh Protocol
         (角色或政策變更 → TokenRefreshSignal → JWT 刷新)
```

| 關係 | 說明 |
| --- | --- |
| `Identity → Account` | Firebase UID 對應唯一 AccountEntity（user 帳戶），多租戶下同一 UID 可加入多個 Organization |
| `Account → Organization` | Organization 是 Account 的聚合，ownerId 指向建立者的 UID；成員以 MemberReference 陣列嵌入 |
| `Organization → Workspace` | Workspace 透過 `accountId + accountType` 歸屬於 user 或 organization 帳戶 |
| `Workspace → Content / KG / AI` | ContentPage、GraphNode、IngestionDocument 的 `workspaceId` 外鍵指向此聚合根 |
| `Account / Org → Identity ([S6])` | 角色或政策變更後，透過 `identityApi.emitTokenRefreshSignal()` 通知 Identity 模組刷新 JWT Custom Claims |

## 六、三層記憶架構的領域映射

架構研究（第七節）定義了三種記憶類型。以下是各記憶類型在儲存庫中的領域對應：

| 記憶類型 | 架構角色 | 儲存庫對應 | 持久化機制 |
| --- | --- | --- | --- |
| Semantic Memory（語意記憶） | 知識庫長期記憶 | `IngestionChunk.vector` | Firestore Vector Search |
| Episodic Memory（互動記憶） | 用戶互動歷程 | `AgentThread` + `AgentMessage` | Firestore `sessions` collection |
| Working Memory（工作記憶） | 當前對話上下文 | 傳遞給 Genkit Flow 的 context buffer | In-memory（不持久化） |

---

## 七、Ingestion Pipeline 的領域事件

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

## 八、Query Understanding Layer 的領域服務

Query Understanding Layer（第六節）的核心邏輯應建模為領域服務（Domain Service），而非 Use Case，因為它代表無狀態的業務規則計算。

**建議的領域服務介面（位於 `modules/search/domain/services/`）：**

```typescript
interface QueryPlannerService {
  classifyIntent(query: string): Promise<QueryIntent>;
  decomposeQuery(query: string): Promise<string[]>;
  rewriteForRetrieval(query: string): Promise<string>;
  generateHyDE(query: string): Promise<string>;  // Hypothetical Document Embedding
}
```

**對應的 Genkit Flow（`modules/notebook/infrastructure/genkit/` 或 `modules/search/infrastructure/genkit/`）：**
- `QueryPlannerFlow` → 包裝上方 QueryPlannerService 的 AI 實作
- `RetrievalFlow` → Hybrid RAG（Dense + Sparse + Graph + Reranker）
- `CitationFlow` → Answer + Source Mapping + Faithfulness Check

---

## 九、Schema + Ontology Layer 的領域概念

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
1. `WikiPage.isRedirect` + `redirectTargetId` 屬性（已在 3.3 節定義）
2. `GraphEdge` 的 `REDIRECT` 類型（已在 3.2 節的 EdgeType 中定義）
3. Repository 的 `resolveRedirect(pageId)` 方法，沿 REDIRECT 邊鏈追蹤到正規頁面

---

## 十、Hybrid Retrieval 的技術邊界說明

architecture.md 第八節描述了 Hybrid Retrieval（Dense + Sparse + Graph + Reranker）。這是基礎設施關切（Infrastructure Concern），**不屬於**領域模型，而是由以下層級實現：

| 元件 | 層級 | 位置 |
| --- | --- | --- |
| Dense Retrieval（Vector Search） | Infrastructure | `modules/search/infrastructure/firebase/` |
| Sparse Retrieval（BM25） | Infrastructure | `modules/search/infrastructure/` |
| Graph Retrieval（Knowledge Graph 遍歷） | Infrastructure | `modules/wiki/infrastructure/` |
| Reranker | Infrastructure / AI | `modules/search/infrastructure/genkit/` |
| Fusion & Ranking | Application | `modules/search/application/use-cases/answer-rag-query.use-case.ts` |

領域層只定義 `RagRetrievedChunk.retrievalMethod` 值物件，記錄某個 Chunk 是透過哪種方式被檢索到的，供上層決策使用。

---

## 十一、完整領域概念清單

| 領域概念 | 類型 | 模組 | 狀態 |
| --- | --- | --- | --- |
| `Identity` | 聚合根 | `identity` | ✅ 已實現 |
| `SignInCredentials` | 值物件 | `identity` | ✅ 已實現 |
| `RegistrationInput` | 值物件 | `identity` | ✅ 已實現 |
| `TokenRefreshSignal` | 聚合根（訊號） | `identity` | ✅ 已實現 |
| `TokenRefreshReason` | 值物件 | `identity` | ✅ 已實現 |
| `Account` | 聚合根 | `account` | ✅ 已實現 |
| `AccountType` | 值物件 | `account` | ✅ 已實現 |
| `OrganizationRole` | 值物件 | `account` | ✅ 已實現 |
| `Presence` | 值物件 | `account` | ✅ 已實現 |
| `ThemeConfig` | 值物件 | `account` | ✅ 已實現 |
| `Wallet` | 值物件 | `account` | ✅ 已實現 |
| `Team` | 值物件（嵌套） | `account` | ✅ 已實現 |
| `AccountPolicy` | 聚合根 | `account` | ✅ 已實現 |
| `PolicyRule` | 值物件 | `account` | ✅ 已實現 |
| `PolicyEffect` | 值物件 | `account` | ✅ 已實現 |
| `Organization` | 聚合根 | `organization` | ✅ 已實現 |
| `MemberReference` | 值物件（嵌套） | `organization` | ✅ 已實現 |
| `PartnerInvite` | 值物件（嵌套） | `organization` | ✅ 已實現 |
| `InviteState` | 值物件 | `organization` | ✅ 已實現 |
| `OrgPolicy` | 聚合根 | `organization` | ✅ 已實現 |
| `OrgPolicyScope` | 值物件 | `organization` | ✅ 已實現 |
| `Workspace` | 聚合根 | `workspace` | ✅ 已實現 |
| `WorkspaceLifecycleState` | 值物件（狀態機） | `workspace` | ✅ 已實現 |
| `WorkspaceVisibility` | 值物件 | `workspace` | ✅ 已實現 |
| `Capability` | 值物件 | `workspace` | ✅ 已實現 |
| `WorkspaceGrant` | 值物件 | `workspace` | ✅ 已實現 |
| `WorkspacePersonnel` | 值物件 | `workspace` | ✅ 已實現 |
| `WorkspaceLocation` | 值物件 | `workspace` | ✅ 已實現 |
| `WorkspaceMemberView` | 讀取模型（CQRS） | `workspace` | ✅ 已實現 |
| `WorkspaceMemberAccessSource` | 值物件 | `workspace` | ✅ 已實現 |
| `WikiContentTree` | 聚合根 | `workspace` | ✅ 已實現 |
| `ContentPage` | 聚合根 | `content` | ✅ 已實現 |
| `ContentBlock` | 聚合根 | `content` | ✅ 已實現 |
| `ContentVersion` | 聚合根 | `content` | ✅ 已實現 |
| `BlockType` | 值物件 | `content` | ✅ 已實現 |
| `PageStatus` | 值物件 | `content` | ✅ 已實現 |
| `GraphNode` | 聚合根 | `knowledge-graph` | ✅ 已實現 |
| `GraphEdge / Link` | 聚合根 | `knowledge-graph` | ✅ 已實現 |
| `EdgeType` | 值物件 | `knowledge-graph` | ✅ 已實現 |
| `GraphNodeStatus` | 值物件（狀態機） | `knowledge-graph` | ✅ 已實現 |
| `WikiPage` | 投影實體 | `content` | ✅ 已實現 |
| `WikiLibrary` | 聚合根 | `asset` | ✅ 已實現 |
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
| `deriveSlugCandidate` / `isValidSlug` | 領域服務（純函式） | `shared` | ✅ 已實現（原 namespace 模組） |
| `EventRecord` / `IEventStoreRepository` / `IEventBusRepository` | 事件存儲原語 | `shared` | ✅ 已實現（原 event 模組） |
| `PublishDomainEventUseCase` | 用例 | `shared` | ✅ 已實現（原 event 模組） |

---

> 本文件從領域建模角度解釋儲存庫如何實現 architecture.md 描述的三層融合知識平台研究。詳細的技術實現決策請參閱各模組的 `README.md` 及相關 ADR（`docs/decision-architecture/adr/`）。
