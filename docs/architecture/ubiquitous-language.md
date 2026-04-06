# 通用語言（Ubiquitous Language）

<!-- change: Add ContentPageApproved, MaterializedTask, sourceReference, causationId term definitions; PR-NUM -->

本文件為 Xuanwu App 的**通用語言字典**，定義所有有界上下文中使用的術語，確保開發者、產品、設計之間使用一致的命名。

> **使用方式：** 在討論需求、設計 API、命名實體或撰寫文件時，優先對照本表查找規範術語。新術語在使用前應先更新本文件。

---

## 一、平台基礎層（Platform Foundation）

### 身份與帳戶

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **身份** | Identity | Firebase Auth 驗證後的使用者記錄，以 `uid` 為主鍵 | `identity` | `modules/identity/domain/entities/Identity.ts` |
| **帳戶** | Account | 使用者或組織的 Profile 聚合根，含個人資料、佈景主題 | `account` | `modules/account/domain/entities/Account.ts` |
| **帳戶類型** | AccountType | `"user"` 個人帳戶 或 `"organization"` 組織帳戶 | `account` | `Account.ts` |
| **存在狀態** | Presence | `"active" \| "away" \| "offline"` 使用者上線狀態 | `account`, `organization` | `Account.ts`, `Organization.ts` |
| **token 刷新訊號** | TokenRefreshSignal | ID Token 即將過期的訊號，觸發背景靜默刷新 | `identity` | `modules/identity/domain/entities/TokenRefreshSignal.ts` |

### 組織（租戶）

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **組織** | Organization | SaaS 租戶根容器，擁有成員、Teams 與工作區 | `organization` | `modules/organization/domain/entities/Organization.ts` |
| **租戶** | Tenant | Organization 的別稱，在多租戶隔離的語境中使用 | `organization` | — |
| **成員** | Member | 加入組織的帳戶，具有 OrganizationRole | `organization` | `Organization.ts → MemberReference` |
| **組織角色** | OrganizationRole | `"Owner" \| "Admin" \| "Member" \| "Guest"` | `organization`, `account` | `Organization.ts` |
| **Team** | Team | 組織內的群組，含 memberIds；內嵌於 Organization 聚合根 | `organization` | `Organization.ts → Team` |
| **合作夥伴邀請** | PartnerInvite | 外部合作夥伴的邀請記錄（email、role、inviteState） | `organization` | `Organization.ts → PartnerInvite` |
| **邀請狀態** | InviteState | `"pending" \| "accepted" \| "expired"` | `organization` | `Organization.ts` |
| **組織策略** | OrgPolicy | 定義組織層級存取規則的策略集合（rules、scope） | `organization` | `Organization.ts → OrgPolicy` |
| **策略範圍** | OrgPolicyScope | `"workspace" \| "member" \| "global"` | `organization` | `Organization.ts` |
| **佈景主題** | ThemeConfig | 組織品牌色彩配置（primary、background、accent） | `organization`, `account` | `Organization.ts → ThemeConfig` |

### 工作區（Space）

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **工作區** | Workspace | 組織下的業務容器，掛載多種能力（feed/flow/scheduling/wiki） | `workspace` | `modules/workspace/domain/entities/Workspace.ts` |
| **Space** | Space | Workspace 的同義詞，在 UI / 產品語境中常見 | `workspace` | — |
| **工作區生命週期** | WorkspaceLifecycleState | `"preparatory" \| "active" \| "stopped"` | `workspace` | `Workspace.ts` |
| **工作區能見度** | WorkspaceVisibility | `"visible" \| "hidden"` | `workspace` | `Workspace.ts` |
| **工作區授權** | WorkspaceGrant | 授予特定 userId 或 teamId 的工作區存取角色 | `workspace` | `Workspace.ts → WorkspaceGrant` |
| **能力** | Capability | 掛載於工作區的功能模組規格（type: ui/api/data/governance/monitoring） | `workspace` | `Workspace.ts → Capability` |
| **工作區成員** | WorkspaceMember | 加入工作區的帳戶，具有工作區層級角色 | `workspace` | `modules/workspace/domain/entities/WorkspaceMember.ts` |

### 通知

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **通知** | Notification | 系統發送給特定 recipientId 的訊息（info/alert/success/warning） | `notification` | `modules/notification/domain/entities/Notification.ts` |
| **通知類型** | NotificationType | `"info" \| "alert" \| "success" \| "warning"` | `notification` | `Notification.ts` |

### 共享原語

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **事件記錄** | EventRecord | Event Store 中的持久化事件實體（eventName、aggregateType、aggregateId、payload、metadata） | `shared` | `modules/shared/domain/event-record.ts` |
| **事件元資料** | EventMetadata | 事件關聯資訊（correlationId、causationId、actorId、traceId） | `shared` | `event-record.ts → EventMetadata` |
| **領域事件** | DomainEvent | 在模組內傳遞的輕量事件匯流排訊息（type 識別符 + occurredAt） | `shared` | `modules/shared/domain/events.ts` |
| **slug 候選值** | SlugCandidate | 從字串派生的 URL-safe 路徑片段候選 | `shared` | `modules/shared/domain/slug-utils.ts` |
| **命令結果** | CommandResult | 所有 Server Action 的標準回傳形態 `{ success: true, aggregateId, version } \| { success: false, error }` | `@shared-types` | `packages/shared-types/index.ts` |
| **領域錯誤** | DomainError | 結構化的業務錯誤（code、message） | `@shared-types` | `packages/shared-types/index.ts` |

### 發佈語言合約（Published Language Contracts）

> **設計說明：** 下列事件代表跨 bounded context 的穩定整合契約。當前應以 `knowledge`、`ai`、`search`、`workspace-flow` 等 current owners 理解，不再把已移除的 `content` / `knowledge-graph` 拓樸視為現況。

| 術語 | 英文 | 定義 | 發佈者 | 消費者 | 代碼位置 |
|------|------|------|--------|--------|---------|
| **頁面建立事件（整合契約）** | KnowledgePageCreatedEvent | 新頁面建立時由 `knowledge` 發佈，供後續知識流轉與 article promote 協議使用 | `knowledge` | `knowledge-base` / local read models | `modules/knowledge/domain-events.md` |
| **內容更新事件（整合契約）** | KnowledgeBlockUpdatedEvent | 區塊內容變更時由 `knowledge` 發佈，供 ingestion / retrieval 重整使用 | `knowledge` | `ai`, `search` | `modules/knowledge/domain-events.md` |

---

## 二、內容層（Content / UI Layer）

### 頁面與區塊（Notion Layer）

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **頁面** | ContentPage | 內容聚合根，含 title、slug、parentPageId、blockIds | `content` | `modules/knowledge/domain/entities/content-page.entity.ts` |
| **頁面狀態** | ContentPageStatus | `"active" \| "archived"` | `content` | `content-page.entity.ts` |
| **頁面樹節點** | ContentPageTreeNode | 包含 children 陣列的頁面節點，遞迴表示層級結構 | `content` | `content-page.entity.ts` |
| **頁面樹** | PageTree | ContentPage 依 parentPageId 構成的層級樹，根節點的 parentPageId 為 null | `content` | 由 use-case 組裝 |
| **區塊** | ContentBlock | 頁面內的原子內容單元（id、pageId、content、order） | `content` | `modules/knowledge/domain/entities/content-block.entity.ts` |
| **區塊類型** | BlockType | `"text" \| "heading-1" \| "heading-2" \| "heading-3" \| "image" \| "code" \| "bullet-list" \| "numbered-list" \| "divider" \| "quote"` | `content` | `modules/knowledge/domain/value-objects/block-content.ts` |
| **區塊內容** | BlockContent | 依 BlockType 多型的值物件（type、text、properties?） | `content` | `modules/knowledge/domain/value-objects/block-content.ts` |
| **版本** | ContentVersion | 頁面的歷史快照（snapshotBlocks、editSummary、authorId） | `content` | `modules/knowledge/domain/entities/content-version.entity.ts` |
| **版本發佈事件** | ContentVersionPublishedEvent | 使用者手動觸發版本快照時發出的領域事件（type: `content.version_published`） | `content` | `modules/knowledge/domain/events/content.events.ts` |
| **內容 Facade** | ContentFacade | `content` 模組的公開 API 門面，供其他模組或 app 層調用 | `content` | `modules/knowledge/api/content-facade.ts` |

### 資產

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **檔案** | File | 上傳至 Firebase Storage 的資產聚合根 | `asset` | `modules/source/domain/entities/File.ts` |
| **檔案版本** | FileVersion | 檔案的歷史版本記錄 | `asset` | `modules/source/domain/entities/FileVersion.ts` |
| **Wiki Library** | WikiLibrary | 工作區下的結構化文件庫聚合根 | `asset` | `modules/source/domain/entities/wiki-library.types.ts` |
| **RAG 文件** | RagDocument | 已上傳並準備攝入 RAG 管線的文件 | `asset` | `modules/source/domain/repositories/RagDocumentRepository.ts` |
| **文件狀態** | DocumentStatus | `uploaded → processing → ready → failed → archived` | `asset` | `FirebaseRagDocumentRepository.ts` |
| **稽核記錄** | AuditRecord | 資產存取的稽核日誌條目（操作者、動作、時間） | `asset` | `modules/source/domain/entities/AuditRecord.ts` |
| **保留政策** | RetentionPolicy | 資產的生命週期保留規則 | `asset` | `modules/source/domain/entities/RetentionPolicy.ts` |

---

## 三、知識結構與歷史圖譜術語

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **知識結構節點** | GraphNode | 歷史圖譜命名；如需恢復圖遍歷/節點語意，必須先重新定義 owner | historical | historical migration context |
| **知識結構邊** | Link | 歷史圖譜命名；目前不應再指向 `modules/wiki` 作為現行實作 | historical | historical migration context |
| **反向連結** | Backlink | 指向某節點的引用集合；目前應由 `search` / `knowledge` 能力重新定義 | historical | concept only |
| **自動連結** | Auto-link | 從內容推得結構關聯的能力；目前屬未重新落位的未來能力 | future | concept only |
| **圖譜遍歷** | Graph Traversal | BFS / DFS 類知識結構遍歷；目前非獨立 bounded context | future | concept only |
| **視圖配置** | ViewConfig | 結構視覺化配置；目前非 canonical owner 術語 | future | concept only |

---

## 四、AI 層（AI Layer）

### 知識攝入

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **攝入作業** | IngestionJob | 一份文件從 uploaded 到 ready 的端對端作業追蹤實體 | `knowledge` | `modules/knowledge/domain/entities/IngestionJob.ts` |
| **攝入文件** | IngestionDocument | 待攝入的原始文件（sourceUrl、format） | `knowledge` | `modules/knowledge/domain/entities/IngestionDocument.ts` |
| **分塊** | IngestionChunk | 文件分割後的語意片段（chunkIndex、text、embedding vector） | `knowledge` | `modules/knowledge/domain/entities/IngestionChunk.ts` |
| **攝入管線** | Ingestion Pipeline | Parse → Clean → Taxonomy → Chunk → Embed → Persist 的完整流程，在 `py_fn/` 執行 | `py_fn` | `py_fn/` |

### RAG 與向量檢索

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **RAG 查詢** | RagQuery | 使用者的自然語言問題，附帶組織/工作區範圍與過濾條件 | `retrieval` | `modules/search/domain/entities/RagQuery.ts` |
| **檢索片段** | RagRetrievedChunk | Vector Search 返回的候選分塊（chunkId、score、text） | `retrieval` | `RagQuery.ts → RagRetrievedChunk` |
| **引用** | RagCitation | AI 答案所依據的來源片段（docId、chunkIndex、page、reason） | `retrieval` | `RagQuery.ts → RagCitation` |
| **來源佐證** | Source Grounding | 答案每個陳述均可追溯到具體文件片段的能力；以 `RagCitation[]` 實現 | `retrieval` | `AnswerRagQueryOutput.citations` |
| **串流事件** | RagStreamEvent | AI 生成過程中的即時事件（type: token / citation / done / error） | `retrieval` | `RagQuery.ts → RagStreamEvent` |
| **向量存儲埠** | VectorStorePort | 向量資料庫的抽象埠（Similarity Search 介面） | `retrieval` | `modules/search/domain/ports/vector-store.ts` |
| **檢索摘要** | RagRetrievalSummary | 一次 RAG 查詢的檢索統計（mode、scope、retrievedChunkCount、topK） | `retrieval` | `RagQuery.ts → RagRetrievalSummary` |

### AI 代理

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **代理生成** | AgentGeneration | 一次 AI 代理的完整輸入/輸出記錄（model、traceId） | `agent` | `modules/notebook/domain/entities/AgentGeneration.ts` |
| **對話執行緒** | Thread | 一段多輪對話的 Message 集合 | `agent` | `modules/notebook/domain/entities/thread.ts` |
| **訊息** | Message | 對話中的單一訊息（role: user/assistant、content） | `agent` | `modules/notebook/domain/entities/message.ts` |

---

## 五、工作流程層（WorkSpace Flow）

### 任務管理

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **任務** | Task | 可指派、可追蹤的工作單元，有完整狀態機生命週期 | `workspace-flow` | `modules/workspace-flow/domain/entities/Task.ts` |
| **任務狀態** | TaskStatus | `backlog → todo → in_progress → qa → done → archived` | `workspace-flow` | `modules/workspace-flow/domain/value-objects/TaskStatus.ts` |
| **問題** | Issue | 缺陷或需改進事項，有自己的狀態機（open → in_progress → resolved → closed） | `workspace-flow` | `modules/workspace-flow/domain/entities/Issue.ts` |
| **問題狀態** | IssueStatus | Issue 的生命週期狀態 | `workspace-flow` | `IssueStatus.ts` |
| **問題階段** | IssueStage | Issue 在 QA retest 中的流程階段 | `workspace-flow` | `IssueStage.ts` |
| **發票** | Invoice | 工作計費文件，含 InvoiceItems；有審批狀態機 | `workspace-flow` | `modules/workspace-flow/domain/entities/Invoice.ts` |
| **發票項目** | InvoiceItem | 發票中的單項費用（description、amount） | `workspace-flow` | `modules/workspace-flow/domain/entities/InvoiceItem.ts` |
| **發票狀態** | InvoiceStatus | Invoice 的審批流程狀態機 | `workspace-flow` | `InvoiceStatus.ts` |
| **實體化任務** | MaterializedTask | 由 `knowledge.page_approved` 事件派生建立的 Task，帶有 `sourceReference` 指回原始 KnowledgePage | `workspace-flow` | `modules/workspace-flow/domain/entities/Task.ts` |
| **來源參照** | sourceReference | 記錄業務實體（Task/Invoice）由哪個 ContentPage 派生而來的值物件（type, id, causationId, correlationId） | `workspace-flow` | `modules/workspace-flow/domain/value-objects/SourceReference.ts`（計畫中） |

### content ↔ workspace-flow 整合術語

| 術語 | 英文 | 定義 | 所在模組 |
|------|------|------|---------|
| **頁面核准事件** | KnowledgePageApproved | `knowledge.page_approved` 領域事件；使用者在審閱 AI 草稿後核准頁面時觸發；攜帶 `extractedTasks[]`、`extractedInvoices[]`、`actorId`、`causationId`、`correlationId` | `knowledge` |
| **因果 ID** | causationId | 記錄「哪個命令觸發了此事件」的 UUID；用於 Event Store 追蹤與稽核回溯；`ApproveContentPageUseCase` 執行時生成 | `shared`（EventMetadata） |
| **關聯 ID** | correlationId | 記錄「整個業務流程（合約攝入 → 審閱 → 核准 → 任務建立）」的追蹤 UUID；在合約上傳時生成並一路傳遞 | `shared`（EventMetadata） |
| **緩衝區** | Buffer Zone | `knowledge` 模組在 AI 攝入與業務實體化之間扮演的「草稿暫存與人工審閱」角色；AI 解析結果先寫入此區，人工確認後再派生 `workspace-flow` 實體 | `knowledge` |
| **物化流程管理器** | ContentToWorkflowMaterializer | 歷史命名的 process manager；目前語意為訂閱 `knowledge.page_approved` 並協調 `workspace-flow` 的 task / invoice materialization | `workspace-flow` |

### 排程

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **工作需求** | WorkDemand | 工作區發出的排程需求聚合根（dueDate、priority、assigneeId） | `workspace-scheduling` | `modules/workspace-scheduling/domain/types.ts` |
| **需求狀態** | DemandStatus | `"draft" \| "open" \| "in_progress" \| "completed"` | `workspace-scheduling` | `types.ts` |
| **需求優先級** | DemandPriority | `"low" \| "medium" \| "high"` | `workspace-scheduling` | `types.ts` |

### 動態牆

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **動態貼文** | WorkspaceFeedPost | 工作區社交動態牆上的貼文聚合根（authorId、content、reactions） | `workspace-feed` | `modules/workspace-feed/domain/entities/workspace-feed-post.entity.ts` |

### 稽核

| 術語 | 英文 | 定義 | 所在模組 | 代碼位置 |
|------|------|------|---------|---------|
| **稽核日誌** | AuditLog | 記錄工作區操作的不可變稽核條目（actorId、action、timestamp） | `workspace-audit` | `modules/workspace-audit/domain/entities/AuditLog.ts` |

---

## 六、架構術語

| 術語 | 英文 | 定義 |
|------|------|------|
| **有界上下文** | Bounded Context | 一個業務能力邊界，對應 `modules/` 下的一個目錄，內部術語獨立定義 |
| **聚合根** | Aggregate Root | 一個上下文的頂層實體，所有對聚合的操作必須透過它進行 |
| **值物件** | Value Object | 無身份、以值相等判斷的不可變物件 |
| **Repository 介面** | Repository Interface | 定義資料存取行為的 domain 層抽象（位於 `domain/repositories/`） |
| **埠** | Port | 跨切關注點的 domain 層抽象（位於 `domain/ports/`），如 ActorContextPort |
| **Use Case** | Use Case | 代表一個使用者可見操作的 application 層服務（位於 `application/use-cases/`） |
| **Facade** | Facade | 模組 `api/` 層的公開入口點，封裝內部複雜度供外部調用 |
| **Server Action** | Server Action | Next.js `"use server"` 函式，是 Write-side 的應用層入口（位於 `interfaces/_actions/`） |
| **MDDD** | Module-Driven Domain Design | 本專案的架構方法論：以模組為驅動力的領域設計 |
| **API 邊界** | API Boundary | `modules/<name>/api/index.ts` 是唯一合法的跨模組 import 點 |
| **事件溯源** | Event Sourcing | 以 EventRecord 記錄所有狀態變更，可重播歷史；目前由 `shared` 模組提供基礎設施 |

---

## 七、命名規範

### 檔案命名

| 類型 | 模式 | 範例 |
|------|------|------|
| Use Case | `verb-noun.use-case.ts` | `list-workspace-files.use-case.ts` |
| Repository 介面 | `PascalCaseRepository.ts` | `WorkspaceRepository.ts` |
| Repository 實作（Firebase） | `Firebase{Name}Repository.ts` | `FirebaseWorkspaceRepository.ts` |
| Domain Entity | `PascalCase.ts` 或 `kebab-case.entity.ts` | `Workspace.ts`, `content-page.entity.ts` |
| Domain Event | `kebab-case.events.ts` | `content.events.ts` |
| Server Action | `kebab-case.actions.ts` | `workspace.actions.ts` |
| Query Hook | `kebab-case.queries.ts` | `workspace.queries.ts` |

### Domain Event 命名

```
<module-name>.<action_verb>
```

範例：`content.page_created`、`workspace-flow.task_assigned`、`asset.library_created`

### Import 規範

```typescript
// ✅ 跨模組：走 api/ 邊界
import { createContentPage } from "@/modules/knowledge/api";

// ✅ Package alias
import type { CommandResult } from "@shared-types";

// ❌ 禁止：跨模組直接 import 內部層
import { ContentPage } from "@/modules/knowledge/domain/entities/content-page.entity";

// ❌ 禁止：舊路徑
import { cn } from "@/shared/utils";
```

---

## 八、Wiki 概念所有權對照表

「Wiki」前綴在多個模組中使用，但每個模組描述的是**不同的領域概念**。本表釐清各模組的所有權，避免誤解。

| 模組 | 類型名稱 | 實際語意 | 使用情境 |
|------|----------|---------|---------|
| `content` | `WikiPage` | 可編輯的知識頁面（聚合根） | 頁面 CRUD、Block 編輯 |
| `asset` | `WikiLibrary` | 結構化文件庫（有欄位定義的資料集） | 文件資產管理、欄位結構 |
| `workspace` | `WikiContentTree` | 帳號→工作區→頁面的導覽樹（UI 導向模型） | 側欄頁面樹、工作區概覽 |
| `retrieval` | `WikiRagTypes` / `WikiCitation` | RAG 查詢結果與引用（檢索輸出） | AI 問答、向量搜索回應 |

> **規則：** 跨模組討論時，請使用上表右欄的「實際語意」描述，而非直接說「Wiki」，以避免歧義。例如：「修改頁面內容」→ 改 `content.WikiPage`；「建立新的欄位庫」→ 改 `asset.WikiLibrary`。

---

## 九、過渡期已知問題（Transitional Issues）

> 本節記錄當前代碼庫與理想 DDD 結構之間的**已知差距**，供開發者在修改相關模組前參考。修正計畫詳見 [`adr/ADR-002-ubiquitous-language-bounded-context-remediation.md`](./adr/ADR-002-ubiquitous-language-bounded-context-remediation.md)。

| 問題 | 影響模組 | 當前狀態 | 目標狀態 | 優先級 |
|------|---------|---------|---------|--------|
| `knowledge/domain/entities/graph-node.ts`、`link.ts` 標記 `@deprecated` | `knowledge` | 檔案存在但為空殼，指向 `knowledge-graph` | 完全移除 deprecated 實體，確認無殘留 import | P1 |
| `knowledge/domain/repositories/GraphRepository.ts` 與 `knowledge-graph` 重複 | `knowledge` | 兩模組各有 GraphRepository 定義 | 僅保留 `knowledge-graph` 版本 | P1 |
| `identity`、`account`、`workspace` 聚合根缺乏 Domain Events | `identity`, `account`, `workspace` | 無 event stream，狀態變更無法被下游模組訂閱 | 逐步補充關鍵 Domain Events（見 ADR-002）| P2 |
| `asset.WikiLibrary` 語意上偏向內容層 | `asset` | WikiLibrary 定義在 asset 模組 | 長期考慮移至 `content` 或明確文件化留在 `asset` 的理由 | P3 |
