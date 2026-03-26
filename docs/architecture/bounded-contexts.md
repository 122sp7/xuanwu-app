# 界限上下文（Bounded Contexts）

本文件定義 Xuanwu App 系統中所有 16 個有界上下文（Bounded Contexts）的邊界、核心職責、主要實體與跨模組事件，作為 MDDD (模組驅動領域設計) 的最高指導原則。

## 四層架構概覽

系統分為四大邏輯層級，確保依賴方向單向流動（由上層至下層，或透過事件非同步反向驅動）：
1. **AI Layer (AI 層)**：處理自然語言、向量搜索、知識攝入與對話。
2. **Knowledge Graph Layer (知識圖譜層)**：處理節點關聯、拓樸走訪與雙向連結。
3. **Content / UI Layer (內容層)**：處理區塊編輯器、頁面結構與實體檔案。
4. **Platform Foundation Layer (平台基礎層)**：包含身份、多租戶、工作區與特定工作流程 (Workspace Flow) 子模組。

---

## Platform Foundation Layer

### 1. `identity` — 身份驗證上下文
- **核心職責**：對接外部身分提供者（Firebase Auth），負責登入、登出與 Token 生命週期。
- **聚合根/實體**：`Identity` (uid, email)
- **領域事件**：無對外廣播，僅內部狀態變更。
- **邊界規則**：其他模組不可依賴 Firebase Auth SDK，必須透過 `identity/api` 取得目前登入者的 `uid`。

### 2. `account` — 帳戶設定檔上下文
- **核心職責**：管理系統中的「參與者」基本資料、偏好設定與個人層級的存取策略。
- **聚合根/實體**：`AccountEntity` (User 或 Organization), `AccountPolicy`
- **領域事件**：`account.profile_updated`, `account.presence_changed`
- **邊界規則**：作為所有模組的 Actor 來源，`accountId` 是貫穿全系統的核心外鍵。

### 3. `organization` — 組織（租戶）上下文
- **核心職責**：B2B SaaS 的多租戶邊界，管理團隊(Team)、成員邀請(Invites)與組織級策略(OrgPolicy)。
- **聚合根/實體**：`OrganizationEntity`, `Team` (值物件集合), `MemberReference`
- **領域事件**：`organization.created`, `organization.member_added`

### 4. `workspace` — 工作區上下文
- **核心職責**：資源與協作的實體隔離邊界。管理工作區生命週期、能力模組掛載(Capabilities)與頁面樹視圖。
- **聚合根/實體**：`WorkspaceEntity`, `WorkspaceMember`, `WikiBetaContentTree`
- **領域事件**：`workspace.created`, `workspace.state_changed`, `workspace.member_added`
- **邊界規則**：作為大部分業務資料（Task, Page, File, Invoice）的邏輯容器。

### 5. `notification` — 通知上下文
- **核心職責**：負責系統內應用程式通知的投遞與狀態（已讀/未讀）管理。
- **聚合根/實體**：`NotificationEntity`
- **領域事件**：`notification.sent`, `notification.read`

### 6. `shared` — 共享核心上下文
- **核心職責**：存放跨領域共用的基礎設施（Event Store、Event Bus）與純邏輯原語（Slug 工具）。
- **聚合根/實體**：`EventRecord`, `EventMetadata`
- **邊界規則**：不包含任何具體業務邏輯，僅提供技術層面的抽象介面。

---

## Content / UI Layer

### 7. `content` — 內容上下文（Notion Layer）
- **核心職責**：提供 Notion-style 的區塊編輯器資料模型，支援頁面層級與區塊層級的增刪改查。
- **聚合根/實體**：`ContentPage`, `ContentBlock`, `ContentVersion`
- **領域事件**：`content.page_created`, `content.block_updated`, `content.page_archived`
- **邊界規則**：`ContentBlock` 為獨立文件，以此支援未來的局部鎖定與細粒度 AI 向量化。

### 8. `asset` — 資產上下文
- **核心職責**：管理靜態檔案上傳、權限控制與 RAG 文件的初始登錄。
- **聚合根/實體**：`File`, `WikiBetaLibrary`, `RagDocument`
- **領域事件**：`asset.file_uploaded`, `asset.rag_document_registered`

---

## Knowledge Graph Layer

### 9. `knowledge-graph` — 知識圖譜上下文（Wiki Layer）
- **核心職責**：維護實體間的有向圖關係，支援雙向連結(Backlink)查詢與關聯度分析。
- **聚合根/實體**：`GraphNode`, `Link`
- **領域事件**：`knowledge-graph.link_created`
- **邊界規則**：不存放龐大的文字內容，僅存放 `id`、`label` 與 `type`，透過 ID 關聯回 `content` 模組。

---

## AI Layer

### 10. `knowledge` — 知識攝入上下文
- **核心職責**：處理異質文件與文字的解析、分塊(Chunking)與向量化(Embedding)非同步管線。
- **聚合根/實體**：`IngestionJob`, `IngestionChunk`
- **領域事件**：`knowledge.job_started`, `knowledge.job_ready`, `knowledge.job_failed`
- **執行邊界**：主要邏輯由 Python Worker (Cloud Functions) 處理。

### 11. `retrieval` — 檢索上下文（RAG Layer）
- **核心職責**：接收自然語言查詢，執行向量檢索(Vector Search)，並組合 LLM 生成具備來源引用的答案。
- **聚合根/實體**：`RagRetrievedChunk`, `RagCitation`, `RagStreamEvent`
- **邊界規則**：RAG 生成必須被約束在提供的 Context 內，嚴格執行權限過濾(organizationId/workspaceId)。

### 12. `agent` — AI 代理上下文
- **核心職責**：管理多輪對話歷程、思路鏈(Chain of Thought)與自由格式的 AI 生成。
- **聚合根/實體**：`Thread`, `Message`, `AgentGeneration`

---

## WorkSpace Layer（內嵌於 Platform Foundation）

### 13. `workspace-feed` — 動態牆上下文
- **核心職責**：提供工作區內的社交與活動串流。
- **聚合根/實體**：`WorkspaceFeedPost`
- **領域事件**：`workspace-feed.post_created`, `workspace-feed.post_liked`

### 14. `workspace-flow` — 工作流程上下文
- **核心職責**：管理具備嚴格狀態機(State Machine)的業務實體（任務、問題追蹤、發票），並實施業務守衛(Guards)。
- **聚合根/實體**：`Task`, `Issue`, `Invoice`
- **領域事件**：`workspace-flow.task.created`, `workspace-flow.issue.status_changed`, `workspace-flow.invoice.paid`

### 15. `workspace-scheduling` — 排程上下文
- **核心職責**：處理工作需求的優先級與時間排程。
- **聚合根/實體**：`WorkDemand`

### 16. `workspace-audit` — 稽核上下文
- **核心職責**：不可變的系統操作日誌記錄，供合規性審查。
- **聚合根/實體**：`AuditLog`

---

## 上下文間的互動關係與邊界規則摘要

- **跨模組查詢**：一律走目標模組的 `api/index.ts`（例如 Server Actions 或 Query 函式）。
- **非同步聯動**：內容更新（如 `content.block-updated`）應發佈領域事件，由 `knowledge`（攝入模組）與 `knowledge-graph`（連結擷取）訂閱，**禁止 Content 模組直接呼叫 AI 模組**。
- **依賴反轉**：所有對 Firebase Firestore / Storage 的操作必須封裝在 `infrastructure/` 層的 Repository 實作中。
