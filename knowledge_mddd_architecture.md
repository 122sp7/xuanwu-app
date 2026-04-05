# Knowledge Platform × MDDD 架構設計完整總結

## 1. 系統整體定位

本系統是一個 **Knowledge Operating System**，以 Firebase Firestore + Cloud Storage 為基礎，自行建構所有知識管理能力，不依賴 Notion 等外部平台。

核心能力：
- 自建 Block Editor 知識界面（Firebase 驅動，取代 Notion）
- 知識關聯圖譜（Wiki Graph）
- AI 知識推理與問答（NotebookLM-like）
- 文件來源管理與 RAG Ingestion
- 語意搜尋與檢索
- 外部文件匯入（Google Docs、Drive，透過原生 HTTP API）
- 工作區協作、任務流程、排程、稽核、動態

整體分層：
- Knowledge Layer（自建 Block Editor） → `knowledge` module
- Knowledge Structure Layer → `wiki` module
- AI Reasoning Layer → `notebook` + `ai` modules
- Retrieval Layer → `search` module
- External Source Ingestion → `source` + `sync` modules
- Workspace Operations → `workspace-flow` / `workspace-scheduling` / `workspace-audit` / `workspace-feed`
- Platform Foundation → `identity` / `account` / `organization` / `workspace` / `notification` / `shared`


## 2. DDD 分層概念

```
Domain
 → Subdomain
 → Bounded Context
 → Module
 → Code
```

Bounded Context = 模型邊界 + 語言邊界  
Module = 程式碼邊界  
一個 Bounded Context 對應一個 module。


## 3. Bounded Context / Modules 切分（實際存在）

```
modules/
  identity/
  account/
  organization/
  workspace/
  knowledge/
  wiki/
  notebook/
  source/
  ai/
  search/
  sync/
  notification/
  shared/
  workspace-flow/
  workspace-scheduling/
  workspace-audit/
  workspace-feed/
```


## 4. Domain 類型分類

**Core Domain（核心域）：**
- `knowledge` — 自建 Block Editor、頁面、版本、審批
- `wiki` — 知識節點、關聯、Backlink、圖譜

**Supporting Domain（支撐域）：**
- `notebook` — AI 問答、摘要、洞察
- `ai` — Ingestion Job、Embedding、Worker Handoff
- `search` — 語意搜尋、RAG 查詢
- `source` — 文件上傳、來源登記、Ingestion 交接
- `sync` — 外部文件匯入 ACL（Google Docs、Drive）
- `workspace-flow` — Task / Issue / Invoice 流程
- `workspace-scheduling` — 排程、日曆、容量
- `workspace-audit` — Append-only 稽核追蹤
- `workspace-feed` — 工作區動態與互動

**Generic Domain（通用域）：**
- `identity` — Firebase Auth 封裝
- `account` — 個人帳戶與偏好
- `organization` — 多租戶治理
- `workspace` — 協作容器
- `notification` — 通知分發
- `shared` — Shared Kernel（事件、值物件、基礎型別）


## 5. Module 標準結構

```
modules/{context}/
  api/              ← 對外唯一公開邊界
  application/
    use-cases/
    dto/
  domain/
    aggregates/
    entities/
    value-objects/
    repositories/   ← 只放 interface
    domain-services/
    factories/
    events/
  infrastructure/
    firebase/       ← repository 實作
  interfaces/
    components/
    queries/
    _actions/
    hooks/
```


## 6. Context 依賴關係圖

```
Identity → Account → Organization → Workspace
                                       ↓
                    ┌──────────────────┼──────────────────┐
                    ↓                  ↓                  ↓
                Knowledge            Wiki             Notebook
                    ↓                  ↓                  ↓
                  Search ◄────────────┘                  AI
                    ↑                                     ↑
                  Source ──────────────────────────────── ┘
                    ↑
                  Sync（外部文件匯入 ACL）

Workspace Operations:
Workspace → workspace-flow → workspace-audit
         → workspace-scheduling
         → workspace-feed → notification
```


## 7. Knowledge Domain 設計

> **這是系統自建的 Block Editor，以 Firestore 儲存，取代 Notion。**

Aggregate Roots:
- `KnowledgePage` — 一個可編輯的知識頁面（含 Block 樹）
- `KnowledgeCollection` — 頁面集合 / 資料庫視圖
- `Tag`

Entities:
- `Block` — paragraph / heading / list / code / image / table 等
- `Version` — 頁面版本快照
- `Attachment` — 附件（指向 Cloud Storage）

Value Objects:
- `KnowledgeId`, `Title`, `BlockContent`, `BlockType`
- `AuthorId`, `CreatedAt`, `VersionNumber`

Factories:
- `KnowledgeFactory`
  - `createPage()`
  - `createBlock()`
  - `createCollection()`


## 8. Wiki Domain 設計

Aggregate Roots:
- `WikiNode` — 知識圖譜中的一個節點
- `WikiGraph` — 完整圖譜聚合根

Entities:
- `WikiLink` — 兩個節點之間的有向邊
- `Backlink` — 反向連結索引

Value Objects:
- `NodeId`, `LinkType`, `RelationType`

Factories:
- `WikiFactory`
  - `createNode()`
  - `createLink()`


## 9. Notebook Domain 設計

Aggregate Roots:
- `Notebook` — 一個 AI 工作薄
- `ChatSession` — 對話紀錄
- `Insight` — AI 生成摘要 / 洞察

Value Objects:
- `Prompt`, `Answer`, `Citation`, `TokenUsage`

Factories:
- `NotebookFactory`
  - `createNotebook()`
  - `createChatSession()`
  - `createInsight()`


## 10. Source Domain 設計

Aggregate Roots:
- `SourceDocument` — 已上傳並登記的原始文件
- `SourceCollection` — 來源集合

Value Objects:
- `FileType`, `FileSize`, `StorageUrl`, `Hash`, `MimeType`


## 11. AI Domain 設計

Aggregate Roots:
- `IngestionJob` — 攝入工作（parse → chunk → embed）
- `Embedding` — 向量化結果
- `VectorIndex` — 索引記錄

Value Objects:
- `Model`, `Temperature`, `TokenCount`, `EmbeddingVector`


## 12. Search Domain 設計

Aggregate Roots:
- `SearchQuery`
- `SearchResult`

Value Objects:
- `QueryText`, `RelevanceScore`, `Citation`


## 13. Sync Domain 設計（Anti-Corruption Layer）

> **職責：把外部平台（Google Docs、Drive 等）的文件匯入轉成 `SourceDocument`。**
> 本系統自建 Knowledge OS，**不需要 Notion Sync**（本系統就是那個 Notion）。
> 所有外部平台整合均透過**原生 HTTP 呼叫**（`fetch` / `axios`）直接操作官方 REST API，不引入第三方 SDK。

Aggregate Roots:
- `ImportJob` — 單次匯入任務
- `ExternalConnection` — 外部平台連線配置（OAuth token、端點）
- `ImportMapping` — 外部格式 → 內部 `SourceDocument` 的欄位對應

支援的外部來源：
- Google Docs（REST API）
- Google Drive（REST API）
- 純文字 / Markdown 檔案上傳


## 14. 系統最重要架構規則

1. Module 之間不能直接引用對方 domain / application / infrastructure
2. 只能透過 `modules/{target}/api/` 呼叫
3. 每個 Bounded Context 有自己的 Ubiquitous Language
4. 依賴方向：`interfaces → application → domain ← infrastructure`
5. `domain/` 必須保持 framework-free（無 Firebase SDK、無 React）
6. 外部系統一定透過 Anti-Corruption Layer（Sync Domain）
7. **Knowledge 是系統核心域，自建 Block Editor，不依賴 Notion**
8. Wiki 是 Knowledge Graph
9. Notebook / AI 是推理層
10. Search 是檢索層
11. Source 是文件來源登記層
12. Sync 是外部文件匯入 ACL 層


## 15. 技術棧對應

| 能力 | 技術 |
|------|------|
| 知識儲存 | Firebase Firestore |
| 附件 / 圖片 | Firebase Cloud Storage |
| 即時同步 | Firestore `onSnapshot` |
| 權限控制 | Firestore Security Rules |
| Block Editor UI | Knowledge Domain 自建（React + XState） |
| AI 問答 | Genkit + Google GenAI |
| 向量搜尋 | pgvector（via py_fn） |
| Ingestion Worker | Python（py_fn） |
| 外部文件匯入 | 原生 fetch（無第三方 SDK） |


## 16. 最終整體架構（一句話）

整個系統是一個以 **Firebase 為基礎設施、Knowledge 為自建核心編輯器、Wiki 為知識圖譜、Notebook 與 AI 為推理層、Search 為向量檢索層、Source 為來源登記、Sync 為外部匯入 ACL** 的 Modular Monolith 可演進 MDDD 架構知識平台。
