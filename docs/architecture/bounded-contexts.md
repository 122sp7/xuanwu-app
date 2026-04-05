# 界限上下文（Bounded Contexts）

<!-- change: Strengthen content Buffer Zone and workspace-flow Source of Truth descriptions; PR-NUM -->

本文件定義 Xuanwu App 的 **界限上下文（Bounded Contexts）** 全貌。每個上下文對應 `modules/` 下的一個目錄，是一個自治的業務能力單元。

> **閱讀建議：** 若需要術語定義，請先閱讀 [`ubiquitous-language.md`](./ubiquitous-language.md)。架構決策請參考 [`adr/`](./adr/)，content ↔ workspace-flow 邊界決策請見 [`adr/ADR-001-content-to-workflow-boundary.md`](./adr/ADR-001-content-to-workflow-boundary.md)。

---

## 四層架構概覽

```
┌─────────────────────────────────────────────────────────────────────┐
│  AI Layer（AI 層）                                                    │
│  modules/notebook · modules/knowledge · modules/search               │
├─────────────────────────────────────────────────────────────────────┤
│  Knowledge Graph Layer（知識圖譜層）                                  │
│  modules/wiki                                             │
├─────────────────────────────────────────────────────────────────────┤
│  Content / UI Layer（內容層）                                         │
│  modules/knowledge · modules/source                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Platform Foundation Layer（平台基礎層）                              │
│  modules/identity · modules/account · modules/organization           │
│  modules/workspace · modules/workspace-{audit,feed,flow,scheduling}  │
│  modules/notification · modules/shared                               │
└─────────────────────────────────────────────────────────────────────┘
```

**依賴方向（箭頭 = 依賴）：**

```
AI Layer
  ↓
Knowledge Graph Layer
  ↓
Content / UI Layer
  ↓
Platform Foundation Layer
```

跨層通訊一律透過目標模組的 `api/` 邊界，禁止直接 import 他模組的內部層。

---

## Platform Foundation Layer

### 1. `identity` — 身份驗證上下文

**職責：** Firebase Authentication 的 domain 封裝，管理登入、登出、token 更新。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `Identity` | 代表已驗證的使用者（uid、email、displayName） |
| Entity | `TokenRefreshSignal` | token 即將過期的訊號 |
| Repository | `IdentityRepository` | Firebase Auth 操作（signIn、signOut） |
| Repository | `TokenRefreshRepository` | 監聽 token 刷新事件 |

**邊界規則：** `identity/api` 必須不含 `"use client"` 匯出，因為 `account` application 層在伺服器端 import 它。

---

### 2. `account` — 帳戶設定檔上下文

**職責：** 使用者或組織的帳戶 Profile 管理（個人資料、佈景主題、成員清單）。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `AccountEntity` | 帳戶聚合根（id、name、accountType、email、photoURL） |
| Entity | `AccountPolicy` | 帳戶層級存取策略 |
| Value Object | `AccountType` | `"user" \| "organization"` |
| Value Object | `OrganizationRole` | `"Owner" \| "Admin" \| "Member" \| "Guest"` |
| Value Object | `Presence` | `"active" \| "away" \| "offline"` |
| Port | `AccountPolicyRepository` | 策略 CRUD |
| Port | `AccountQueryRepository` | 查詢帳戶列表 |

**跨上下文依賴：** 使用 `identity/api` 取得已驗證的 uid。

---

### 3. `organization` — 組織（租戶）上下文

**職責：** 多租戶 SaaS 的頂層容器，管理組織設定、Teams 與成員邀請。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `OrganizationEntity` | 組織聚合根（id、name、ownerId、members、teams） |
| Value Object | `Team` | 內嵌於組織的群組（id、name、type、memberIds） |
| Value Object | `MemberReference` | 組織成員快照（id、name、email、role、presence） |
| Value Object | `OrgPolicy` | 組織層級存取策略（rules、scope） |
| Value Object | `PartnerInvite` | 外部合作夥伴邀請（email、teamId、role、inviteState） |
| Value Object | `ThemeConfig` | 組織品牌主題（primary、background、accent） |
| Value Object | `OrgPolicyScope` | `"workspace" \| "member" \| "global"` |

**重要決策：** `Team` 是 Organization 的值物件集合，**不是**獨立的有界上下文。若未來 Team 需要獨立的 Project 分配或 Team 層級權限，再提取為 `modules/team`。

---

### 4. `workspace` — 工作區上下文

**職責：** 工作區（Space）的生命週期管理、成員存取、能力掛載與 Wiki 頁面樹結構。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `WorkspaceEntity` | 工作區聚合根（id、name、lifecycleState、visibility、grants） |
| Entity | `WorkspaceMember` | 工作區成員（userId、role） |
| Entity | `WikiContentTree` | 頁面樹視圖（pageId 層級結構） |
| Value Object | `WorkspaceLifecycleState` | `"preparatory" \| "active" \| "stopped"` |
| Value Object | `WorkspaceVisibility` | `"visible" \| "hidden"` |
| Value Object | `WorkspaceGrant` | 工作區存取授權（userId/teamId、role） |
| Value Object | `Capability` | 掛載於工作區的功能模組（type: ui/api/data/governance/monitoring） |
| Port | `WorkspaceGrantPort` | 檢查工作區存取授權 |

---

### 5. `notification` — 通知上下文

**職責：** 系統內部通知的派送與已讀狀態管理。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `NotificationEntity` | 通知實體（id、recipientId、title、message、type、read） |
| Value Object | `NotificationType` | `"info" \| "alert" \| "success" \| "warning"` |

---

### 6. `shared` — 共享核心上下文

**職責：** 跨模組共用的 Domain 原語，包含 Slug 工具、Event Store 基礎設施，以及跨模組整合用的 **Published Language 合約**。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `EventRecord` | 事件存儲實體（id、eventName、aggregateType、aggregateId、occurredAt、payload、metadata） |
| Value Object | `EventMetadata` | 事件關聯資訊（correlationId、causationId、actorId） |
| Interface | `IEventStoreRepository` | 事件存儲 Repository 介面 |
| Interface | `IEventBusRepository` | 事件匯流排 Repository 介面 |
| Use Case | `PublishDomainEventUseCase` | 將領域事件持久化至 Event Store |
| Service | `deriveSlugCandidate` | 從字串生成 URL-safe slug 候選值 |
| Service | `isValidSlug` | 驗證 slug 格式 |
| Published Language | `ContentPageCreatedEvent` | 由 `content` 發佈、供 `knowledge-graph` 消費的整合契約（auto-link 觸發） |
| Published Language | `ContentUpdatedEvent` | 由 `content` 發佈、供 `knowledge`/`knowledge-graph` 消費的整合契約（向量重新索引、連結提取） |

**Published Language 設計說明：** `ContentPageCreatedEvent` 與 `ContentUpdatedEvent` 的邏輯所有者是 `content` 模組，但因為它們是**多個下游模組（knowledge-graph、knowledge）共同訂閱的整合契約**，依 DDD Published Language 模式定義在 `shared` 中，確保穩定性與版本可控性。**發佈者：** `content`，**消費者：** `knowledge-graph`（auto-link）、`knowledge`（向量重新索引）。

---

## Content / UI Layer

### 7. `content` — 內容上下文（Notion Layer）

**職責：** Block 編輯器的核心業務，管理 Page、Block、ContentVersion 的 CRUD 與版本歷程。作為 AI 解析結果與人機協作（Human-in-the-loop）的**草稿緩衝區（Buffer Zone）**：AI 攝入管線將合約解析結果寫入 ContentPage 與 Database Blocks，提供審閱視圖，使用者確認後透過 `content.page_approved` 事件觸發 `workspace-flow` 的實體化流程。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `ContentPage` | 頁面聚合根（id、title、slug、parentPageId、blockIds、status） |
| Entity | `ContentBlock` | 區塊實體（id、pageId、content、order） |
| Entity | `ContentVersion` | 版本快照（pageId、snapshotBlocks、editSummary、authorId） |
| Value Object | `ContentPageStatus` | `"active" \| "archived"` |
| Value Object | `BlockContent` | 區塊內容值物件（依 BlockType 多型） |
| Value Object | `ContentPageTreeNode` | 包含 children 的頁面樹節點（遞迴結構） |
| Domain Event | `content.page_created` | 頁面建立 |
| Domain Event | `content.page_renamed` | 頁面重新命名 |
| Domain Event | `content.page_moved` | 頁面移動（parentPageId 變更） |
| Domain Event | `content.page_archived` | 頁面歸檔 |
| Domain Event | `content.page_approved` | 使用者核准 AI 生成的草稿頁面/資料庫，觸發 workspace-flow 實體化 |
| Domain Event | `content.block_added` | 區塊新增 |
| Domain Event | `content.block_updated` | 區塊更新 |
| Domain Event | `content.block_deleted` | 區塊刪除 |
| Domain Event | `content.version_published` | 版本快照發佈 |

**設計說明：** `ContentBlock` 為獨立 Firestore 文件（非嵌套），以支援大型頁面的局部更新與 Embedding 顆粒度控制。

---

### 8. `asset` — 資產上下文

**職責：** 檔案上傳、Storage 管理、RAG 文件登錄，以及 Wiki Library 的結構化資料。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `File` | 檔案聚合根（id、name、url、mimeType、size） |
| Entity | `FileVersion` | 檔案版本（fileId、version、uploadedAt） |
| Entity | `WikiLibrary` | Wiki Library 聚合根（id、name、workspaceId、documents） |
| Value Object | `AuditRecord` | 存取稽核記錄 |
| Value Object | `PermissionSnapshot` | 存取快照 |
| Value Object | `RetentionPolicy` | 保留政策 |
| Port | `ActorContextPort` | 解析當前操作者身份 |
| Port | `OrganizationPolicyPort` | 檢查組織層級策略 |
| Port | `WorkspaceGrantPort` | 檢查工作區存取授權 |

**Firestore 文件狀態：** `uploaded → processing → ready → failed → archived`

---

## Knowledge Graph Layer

### 9. `knowledge-graph` — 知識圖譜上下文（Wiki Layer）

**職責：** 知識圖的節點、邊與視圖配置管理，支援 Backlink 查詢與 Graph Traversal。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `GraphNode` | 知識圖節點（id = PageId、label、type） |
| Entity | `Link` | 有向邊（id、sourceId、targetId、type） |
| Value Object | `GraphNodeType` | `"page" \| "tag" \| "attachment"` |
| Value Object | `LinkType` | `"explicit" \| "implicit" \| "hierarchy"` |
| Value Object | `ViewConfig` | 圖譜視覺化配置（layout、filter） |
| Repository | `GraphRepository` | 節點/邊的 CRUD + 連通性查詢 |

**Backlink：** 查詢所有 `targetId = pageId` 的 Link，即為該頁面的 Backlinks。

**Auto-link（計畫中）：** `LinkExtractor` service 已存在於 `knowledge-graph/application`，尚缺觸發管道（監聽 `content.page_created` 事件後自動建立隱式 Link）。

---

## AI Layer

### 10. `knowledge` — 知識攝入上下文

**職責：** RAG 文件的攝入管線管理（IngestionJob 生命週期、Chunk 生成）。

> ⚠️ **過渡期注意：** 本模組正在從舊版知識圖譜模組重構為「Layer 2 Ingestion Pipeline」。`domain/entities/graph-node.ts` 與 `domain/entities/link.ts` 已標記 `@deprecated`，實際定義已移至 `knowledge-graph` 模組。`domain/repositories/GraphRepository.ts` 亦為過渡期殘留，應僅使用 `knowledge-graph/api` 中的 GraphRepository。不要在本模組中新增知識圖相關代碼。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `IngestionJob` | 攝入作業聚合根（docId、status、stages） |
| Entity | `IngestionDocument` | 待攝入文件（id、sourceUrl、format） |
| Entity | `IngestionChunk` | 分塊結果（chunkIndex、text、embedding） |
| Repository | `IngestionJobRepository` | 攝入作業 CRUD |
| ~~Entity~~ | ~~`graph-node.ts`~~ | ~~**@deprecated** — 已移至 `knowledge-graph/domain/entities/graph-node.ts`~~ |
| ~~Entity~~ | ~~`link.ts`~~ | ~~**@deprecated** — 已移至 `knowledge-graph/domain/entities/link.ts`~~ |

**Runtime 說明：** 實際的解析、清洗、分塊、Embedding 在 `py_fn/` Python 側執行；本模組管理 Firestore 端的 Job 狀態追蹤。

---

### 11. `retrieval` — 檢索上下文（RAG Layer）

**職責：** Vector Search、RAG 查詢、答案生成與引用（Citation）管理。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `RagRetrievedChunk` | 檢索到的文件片段（chunkId、docId、text、score） |
| Entity | `RagCitation` | 引用記錄（docId、chunkIndex、page、reason） |
| Entity | `RagRetrievalSummary` | 檢索摘要（mode、scope、retrievedChunkCount、topK） |
| Entity | `RagStreamEvent` | 串流事件（type: token/citation/done/error） |
| Port | `VectorStorePort` | 向量存儲的抽象埠（similarity search） |
| Repository | `RagGenerationRepository` | AI 生成端（Genkit） |
| Repository | `RagRetrievalRepository` | 向量檢索端（Firestore） |
| Repository | `WikiContentRepository` | Wiki 內容倉儲（RAG 用） |

**邊界規則：** `retrieval/api` 由 `"use server"` 代碼 import，**禁止**在 `api/index.ts` 匯出 `"use client"` UI 元件（RagView、RagQueryView）。Client 端請從 `modules/search`（root barrel）import。

---

### 12. `agent` — AI 代理上下文

**職責：** 對話式 AI 代理的 Thread、Message 管理與 Genkit 流程編排。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `AgentGeneration` | 一次代理生成結果（input、output、model、traceId） |
| Entity | `Thread` | 對話執行緒（id、messages） |
| Entity | `Message` | 對話訊息（role: user/assistant、content） |
| Entity | `RagQuery` | 代理端 RAG 查詢入口 |
| Repository | `AgentRepository` | Genkit 代理實作 |
| Repository | `RagRetrievalRepository` | 委派至 `retrieval` 模組 |

---

## WorkSpace Layer（內嵌於 Platform Foundation）

### 13. `workspace-feed` — 動態牆上下文

**職責：** 工作區的社交動態牆，包含貼文、按讚、留言等互動。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `WorkspaceFeedPost` | 貼文聚合根（id、workspaceId、authorId、content、reactions） |
| Domain Event | `workspace-feed.post_created` | 貼文建立 |
| Domain Event | `workspace-feed.post_reacted` | 貼文互動 |
| Facade | `WorkspaceFeedFacade` | 動態牆公開 API |

---

### 14. `workspace-flow` — 工作流程上下文

**職責：** Task（任務）、Issue（問題回報）、Invoice（發票）三種工作流程的 XState 狀態機管理。作為業務實體的**單一真相來源（Single Source of Truth）**：不直接接收 AI 原始輸出，所有業務實體**必須**由 `content.page_approved` 事件派生而來（透過 `contentToWorkflowMaterializer` Process Manager）。派生的 Task / Invoice 必須包含 `sourceReference`，指回原始 ContentPage 以支援稽核與溯源。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `Task` | 任務聚合根（id、workspaceId、title、status、assigneeId） |
| Entity | `Issue` | 問題回報聚合根（id、workspaceId、title、status、stage） |
| Entity | `Invoice` | 發票聚合根（id、workspaceId、status、items） |
| Entity | `InvoiceItem` | 發票項目（id、invoiceId、amount、description） |
| Value Object | `TaskStatus` | 任務狀態機值（backlog→todo→in_progress→qa→done→archived） |
| Value Object | `IssueStatus` | 問題狀態機值 |
| Value Object | `InvoiceStatus` | 發票狀態機值 |
| Domain Event | `task.created` / `task.assigned` / `task.archived` | 任務生命週期事件 |
| Domain Event | `issue.opened` / `issue.resolved` / `issue.closed` | 問題生命週期事件 |
| Domain Event | `invoice.submitted` / `invoice.approved` / `invoice.paid` | 發票生命週期事件 |

---

### 15. `workspace-scheduling` — 排程上下文

**職責：** 工作需求（Demand）的排程管理與月曆視圖。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `WorkDemand` | 排程需求聚合根（id、workspaceId、title、status、dueDate） |
| Value Object | `DemandStatus` | `"draft" \| "open" \| "in_progress" \| "completed"` |
| Value Object | `DemandPriority` | `"low" \| "medium" \| "high"` |

---

### 16. `workspace-audit` — 稽核上下文

**職責：** 工作區操作的稽核日誌記錄與查詢。

| 元素 | 名稱 | 說明 |
|------|------|------|
| Entity | `AuditLog` | 稽核記錄（id、actorId、workspaceId、action、timestamp） |
| Repository | `AuditRepository` | 稽核記錄 CRUD |

---

## 上下文間的互動關係

```
organization ──contains──► workspace
workspace    ──hosts──────► workspace-feed
workspace    ──hosts──────► workspace-flow
workspace    ──hosts──────► workspace-scheduling
workspace    ──hosts──────► workspace-audit
workspace    ──hosts──────► content (via WikiContentTree)
workspace    ──hosts──────► asset (Files & Libraries)

content   ──page link events──► knowledge-graph (auto-link, planned)
content   ──embed chunks──────► knowledge (RAG ingestion)
content   ──page_approved ────► workspace-flow (Materialization via Event)
knowledge ──vector search──────► retrieval
retrieval ──answer generation──► agent

identity  ──authenticates──► account
account   ──profile for──── organization (members)
account   ──owns──────────► workspace
```

---

## 邊界規則摘要

| 規則 | 說明 |
|------|------|
| **API-only 原則** | 跨模組 import 只能走 `modules/<target>/api/index.ts` |
| **禁止內部 import** | 不可直接 import 他模組的 `domain/`、`application/`、`infrastructure/`、`interfaces/` |
| **client/server 邊界** | 含 `"use client"` 的 UI 元件不可出現在 `/api` 匯出；需從 root barrel 或 interfaces 匯出 |
| **domain 零依賴** | `domain/` 不可 import Firebase SDK、React、HTTP client 等框架代碼 |
| **依賴方向** | `interfaces/ → application/ → domain/ ← infrastructure/` |

---

## 已知缺口（Planned）

| 缺口 | 建議位置 | 優先級 |
|------|---------|--------|
| ~~Auto-link 觸發管道~~ ✅ | ~~`knowledge-graph/application/use-cases/auto-link.use-case.ts`~~ | ~~🔴 高~~ **已完成** |
| ~~RAG Feedback Loop~~ ✅ | ~~`retrieval/domain/entities/RagQueryFeedback.ts`~~ | ~~🔴 高~~ **已完成** |
| Global Search 後端 | `modules/search/` 或 Firestore 複合索引 adapter | 🟡 中 |
| Notion-style Database | `content/domain/entities/ContentDatabase.ts` | 🟡 中 |
| Collaboration（即時協作） | `modules/collaboration/` (Firebase Realtime DB / CRDT) | 🟢 低 |

---

## Wiki 概念分佈釐清

「Wiki」前綴跨越多個模組，每個模組所有的是**語意不同的概念**，非同一領域物件的延伸：

| 模組 | 類型名稱 | 實際語意 | 是否合理在此模組 |
|------|----------|---------|:---:|
| `content` | `WikiPage` | 可編輯的知識頁面（聚合根，含 Block 編輯器） | ✅ 屬於內容層 |
| `asset` | `WikiLibrary` | 結構化文件庫（有欄位定義的資料集，類資料庫） | ⚠️ 語意偏內容層，目前暫置於 asset；長期待評估 |
| `workspace` | `WikiContentTree` | 帳號→工作區→頁面的**導覽樹** UI 模型 | ✅ 屬於 Workspace 工作區導覽職責 |
| `retrieval` | `WikiCitation`, `WikiRagTypes` | RAG 查詢結果與引用（檢索輸出模型） | ✅ 屬於 retrieval 模組的輸出格式 |

**結論：** 這四個概念屬於**不同界限上下文**，「Wiki」前綴是功能面的標籤，不代表它們屬於同一個有界上下文。未來若建立獨立的 `wiki` 模組，需要重新分配所有權；目前保持現狀並以本表作為官方所有權定義。

---

## 已知議題與修正路徑

> 下列是當前界限上下文設計中的已知問題，已排定修正順序。詳見 [`adr/ADR-002-ubiquitous-language-bounded-context-remediation.md`](./adr/ADR-002-ubiquitous-language-bounded-context-remediation.md)。

| 優先級 | 議題 | 影響範圍 | 修正動作 |
|-------|------|---------|---------|
| **P1** | `knowledge/domain/entities/graph-node.ts`、`link.ts` 為 `@deprecated` 空殼 | `knowledge` 模組 | 刪除 deprecated 檔案，確認無殘留 import |
| **P1** | `knowledge/domain/repositories/GraphRepository.ts` 與 `knowledge-graph` 重複 | `knowledge` 模組 | 移除 `knowledge` 側的 GraphRepository，僅保留 `knowledge-graph/api` 版本 |
| **P2** | `identity`、`account`、`workspace` 缺乏 Domain Events | 跨模組事件訂閱 | 逐步補充 `WorkspaceCreatedEvent`、`AccountCreatedEvent` 等關鍵事件（見 ADR-002） |
| **P3** | `asset.WikiLibrary` 語意上偏向內容層 | `asset` 模組 | 評估是否移至 `content` 模組，或撰寫 ADR 明確說明留在 `asset` 的架構理由 |
