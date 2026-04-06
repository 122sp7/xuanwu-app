# Use Cases / Application Layer（應用層）

<!-- change: Add ApproveContentPageUseCase and MaterializeTasksFromContentUseCase; PR-NUM -->

本文件列出 Xuanwu App 所有有界上下文的 Use Cases，說明其職責、輸入/輸出契約，以及在 Application Layer 中的角色。

> **相關文件：** [`domain-model.md`](./domain-model.md) · [`repository-pattern.md`](./repository-pattern.md) · [`adr/ADR-001-content-to-workflow-boundary.md`](./adr/ADR-001-content-to-workflow-boundary.md)

---

## 設計原則

| 原則 | 說明 |
|------|------|
| **薄 Use Case** | Use Case 只協調 domain 物件與 repository，不含業務規則 |
| **業務規則在 domain** | 狀態轉換合法性由 `domain/services/` 的 guard/policy 函式判斷 |
| **標準回傳型別** | 所有 Use Case 返回 `CommandResult` = `{ ok: true, data } \| { ok: false, error }` |
| **輸入驗證在邊界** | 輸入正規化（trim/validate）在 Use Case 入口進行，而非在 Server Action 層 |
| **依賴注入** | 透過建構子注入 Repository interface，不直接 `new` Firebase 實作 |

### Use Case 標準結構

```typescript
// modules/<context>/application/use-cases/<verb>-<noun>.use-case.ts
export class VerbNounUseCase {
  constructor(private readonly repo: SomeRepository) {}

  async execute(input: VerbNounInput): Promise<CommandResult> {
    // 1. 輸入正規化 / 前置驗證
    // 2. 載入聚合（load aggregate）
    // 3. 呼叫 domain service 進行業務規則檢查
    // 4. 呼叫 repository 持久化變更
    // 5. 回傳 CommandResult
  }
}
```

---

## `identity` 模組

| Use Case | 動作 | Repository |
|---------|------|------------|
| `SignInUseCase` | 觸發 Firebase Auth 登入 | `IdentityRepository` |
| `SignOutUseCase` | 登出並清除 session | `IdentityRepository` |
| `GetCurrentIdentityUseCase` | 讀取當前驗證使用者 | `IdentityRepository` |
| `StartTokenRefreshUseCase` | 監聽 token 刷新訊號 | `TokenRefreshRepository` |

**代碼位置：** `modules/identity/application/use-cases/`

---

## `account` 模組

| Use Case | 動作 | Repository |
|---------|------|------------|
| `GetAccountUseCase` | 讀取帳戶 Profile | `AccountRepository` |
| `UpdateAccountProfileUseCase` | 更新帳戶資料 | `AccountRepository` |
| `CreateAccountPolicyUseCase` | 建立帳戶存取策略 | `AccountPolicyRepository` |
| `GetAccountPoliciesUseCase` | 查詢帳戶策略清單 | `AccountPolicyRepository` |

**代碼位置：** `modules/account/application/use-cases/`

---

## `organization` 模組

| Use Case | 動作 | Repository |
|---------|------|------------|
| `CreateOrganizationUseCase` | 建立組織 | `OrganizationRepository` |
| `UpdateOrganizationUseCase` | 更新組織設定 | `OrganizationRepository` |
| `InviteMemberUseCase` | 邀請成員加入 | `OrganizationRepository` |
| `CreateTeamUseCase` | 建立 Team | `OrganizationRepository` |
| `CreateOrgPolicyUseCase` | 建立組織策略 | `OrganizationRepository` |
| `GetOrgPoliciesUseCase` | 查詢組織策略 | `OrganizationRepository` |

**代碼位置：** `modules/organization/application/use-cases/`

---

## `workspace` 模組

| Use Case | 動作 | Repository |
|---------|------|------------|
| `CreateWorkspaceUseCase` | 建立工作區 | `WorkspaceRepository` |
| `UpdateWorkspaceSettingsUseCase` | 更新工作區設定 | `WorkspaceRepository` |
| `AddWorkspaceMemberUseCase` | 新增工作區成員 | `WorkspaceRepository` |
| `RemoveWorkspaceMemberUseCase` | 移除工作區成員 | `WorkspaceRepository` |
| `ListWorkspaceReferencesUseCase` | 取得工作區下可掛載的知識/來源參照 | `WikiWorkspaceRepository` |

**代碼位置：** `modules/workspace/application/use-cases/`

---

## `knowledge` 模組

| 能力群組 | 代表動作 | Repository / Port |
|---------|----------|-------------------|
| Page Lifecycle | 建立、重新命名、移動、歸檔 Knowledge Page | `ContentPageRepository` |
| Block Editing | 新增、更新、刪除、重排內容區塊 | `ContentBlockRepository` |
| Versioning | 發佈與查詢版本快照 | `ContentVersionRepository` |
| Collection Management | 建立 collection、加入/移除 page、維護欄位 | collection repositories |
| Review & Verification | 指派 owner、請求 review、驗證 page | review / policy ports |
| Approval Event | 核准草稿頁面並發出 `knowledge.page_approved` | repository + event ports |

### `ApproveKnowledgePageUseCase` / approval flow 摘要

```
輸入: ApproveKnowledgePageInput
  pageId: string            // 必填：要核准的 KnowledgePage ID
  workspaceId: string       // 必填：所屬工作區
  actorId: string           // 必填：執行核准的使用者 ID
  extractedTasks: Array<{ title, dueDate?, description? }>
  extractedInvoices: Array<{ amount, description, currency? }>
  correlationId?: string    // 選填：整個業務流程的追蹤 ID（若無則自動生成）

流程:
  1. 驗證 pageId 存在且 status = "active"（非 archived）
  2. 驗證 actorId 有權限核准（對應工作區的成員）
  3. ContentPageRepository.update(pageId, { approvalState: "approved", approvedAtISO })
  4. PublishDomainEventUseCase.execute({ eventName: "knowledge.page_approved", ... })
     └── causationId = 此次執行的 requestId（UUID）
     └── correlationId = input.correlationId ?? generateId()
  5. 返回 CommandResult { success: true, aggregateId: pageId }

代碼位置（依模組慣例）: modules/knowledge/application/use-cases/
```

**代碼位置：** `modules/knowledge/application/use-cases/`

---

## `knowledge-base` 模組

| 能力群組 | 代表動作 | Repository / Port |
|---------|----------|-------------------|
| Article Lifecycle | 建立、更新、發布、封存 article | article repositories |
| Category Management | 維護 category tree 與 article 分類 | category repositories |
| Verification | 文章驗證、狀態轉移、共享知識資產治理 | verification / review ports |

**代碼位置：** `modules/knowledge-base/application/use-cases/`

---

## `knowledge-collaboration` 模組

| Use Case | 動作 | Repository |
|---------|------|------------|
| `CommentUseCases` | 建立、編輯、查詢留言串 | comment repositories |
| `PermissionUseCases` | 管理知識協作權限與共享範圍 | permission repositories |
| `VersionUseCases` | 維護不可變版本快照與比較 | version repositories |

**代碼位置：** `modules/knowledge-collaboration/application/use-cases/`

---

## `knowledge-database` 模組

| 能力群組 | 代表動作 | Repository / Port |
|---------|----------|-------------------|
| Database Lifecycle | 建立與更新 database schema | database repositories |
| Record Operations | 新增、更新、刪除 records | record repositories |
| View Composition | table / kanban / calendar 等 view 設定 | view repositories |

**代碼位置：** `modules/knowledge-database/application/use-cases/`

---

## `source` 模組

| 能力群組 | 代表動作 | Repository / Port |
|---------|----------|-------------------|
| File Intake | 初始化/完成上傳、維護 metadata | `FileRepository` |
| Source Governance | 維護來源集合、範圍與關聯 | source repositories |
| Ingestion Registration | 將可處理來源登錄給 ingestion pipeline | worker / integration ports |

**代碼位置：** `modules/source/application/use-cases/`

---

## `ai` 模組

| Use Case | 動作 | Repository |
|---------|------|------------|
| `RegisterIngestionDocumentUseCase` | 登錄待攝入文件 | `IngestionJobRepository` |
| `AdvanceIngestionStageUseCase` | 推進攝入作業至下一階段 | `IngestionJobRepository` |

**代碼位置：** `modules/ai/application/use-cases/`

---

## `search` 模組

| 能力群組 | 代表動作 | Repository / Port |
|---------|----------|-------------------|
| Answer RAG Query | 執行 retrieval 並返回答案 + citations | `RagRetrievalRepository`, `RagGenerationRepository` |
| Retrieval Support | 查詢 chunks、citation context、retrieval summary | `RagRetrievalRepository` |
| Feedback Loop | 提交與持久化查詢品質回饋 | `RagQueryFeedbackRepository` |
| Legacy Wiki-RAG Surface | 歷史命名的 knowledge-content 查詢與重建索引入口 | `WikiContentRepository` |

**代碼位置：** `modules/search/application/use-cases/`

### `AnswerRagQueryUseCase` 詳解

```
輸入: AnswerRagQueryInput
  organizationId: string     // 必填：決定 RAG 範圍
  workspaceId?: string       // 選填：縮小至工作區範圍
  userQuery: string          // 使用者自然語言問題
  taxonomy?: string          // 領域過濾（可選）
  topK?: number              // 最大返回 chunk 數（預設 5，上限 10）
  model?: string             // Genkit 模型（可選）

流程:
  1. 正規化輸入 → 前置驗證（organizationId, userQuery 必填）
  2. RagRetrievalRepository.retrieve() → 向量搜索 topK 個相關 chunks
  3. 若 chunks 為空 → 返回 NO_RELEVANT_CHUNKS 錯誤
  4. RagGenerationRepository.generate() → Genkit Gemini 生成答案 + citations
  5. 組裝 RagStreamEvents（token + citation + done）
  6. 返回 { answer, citations, retrievalSummary, model, traceId, events }
```

---

## `notebook` 模組

| 能力群組 | 代表動作 | Repository / Upstream |
|---------|----------|----------------------|
| Thread & Message Flow | 建立 thread、追加訊息、維護研究上下文 | notebook repositories |
| Ask/Cite Orchestration | 呼叫 `search` 取得 retrieval 結果後組裝 notebook 回答 | `search/api` |
| Summary & Generation | 產出摘要、洞察與知識草稿 | AI / generation ports |

**代碼位置：** `modules/notebook/application/use-cases/`

---

## `workspace-flow` 模組

### Task Use Cases

| Use Case | 動作 | Domain Service |
|---------|------|----------------|
| `CreateTaskUseCase` | 建立任務 | — |
| `UpdateTaskUseCase` | 更新任務欄位 | — |
| `AssignTaskUseCase` | 指派任務 → `in_progress` | `evaluateTaskTransition` |
| `SubmitTaskToQaUseCase` | 提交 QA → `qa` | `evaluateTaskTransition` |
| `PassTaskQaUseCase` | QA 通過 → `acceptance` | `evaluateTaskTransition` + `hasNoOpenIssues` |
| `ApproveTaskAcceptanceUseCase` | 驗收核准 → `accepted` | `evaluateTaskTransition` |
| `ArchiveTaskUseCase` | 歸檔 → `archived` | `evaluateTaskTransition` + `invoiceAllowsArchive` |
| `MaterializeTasksFromKnowledgeEvent` | 由 `knowledge.page_approved` 事件批量建立 Task，攜帶 `sourceReference` | — |

### `MaterializeTasksFromKnowledgeEvent` / materializer 摘要

```
輸入: MaterializeTasksFromContentInput
  pageId: string                    // knowledge.page_approved 事件的 pageId
  workspaceId: string               // 對應工作區
  extractedTasks: Array<{ title, dueDate?, description? }>
  sourceReference: SourceReference  // { type, id, causationId, correlationId }

流程:
  1. 依 extractedTasks 批量呼叫 TaskRepository.save()
  2. 每個 Task 的 status 初始化為 "draft"
  3. 每個 Task 均攜帶 sourceReference（指回 ContentPage）
  4. 冪等性保護：若已存在相同 sourceReference.causationId 的 Task，跳過建立
  5. 返回 CommandResult { success: true, aggregateId: pageId }

代碼位置（目前實作語意）: modules/workspace-flow/application/process-managers/
```

### Issue Use Cases

| Use Case | 動作 |
|---------|------|
| `OpenIssueUseCase` | 建立問題（open） |
| `StartIssueUseCase` | 開始處理（in_progress） |
| `FixIssueUseCase` | 修復完成（fixed） |
| `SubmitIssueRetestUseCase` | 提交重測（retest） |
| `PassIssueRetestUseCase` | 重測通過（resolved） |
| `FailIssueRetestUseCase` | 重測失敗（回 in_progress） |
| `CloseIssueUseCase` | 關閉問題（closed） |
| `ResolveIssueUseCase` | 解決問題（resolved） |

### Invoice Use Cases

| Use Case | 動作 |
|---------|------|
| `CreateInvoiceUseCase` | 建立發票（draft） |
| `AddInvoiceItemUseCase` | 新增項目 |
| `UpdateInvoiceItemUseCase` | 更新項目 |
| `RemoveInvoiceItemUseCase` | 移除項目 |
| `SubmitInvoiceUseCase` | 提交審核（submitted） |
| `ReviewInvoiceUseCase` | 已審閱（reviewed） |
| `ApproveInvoiceUseCase` | 核准（approved） |
| `RejectInvoiceUseCase` | 拒絕 |
| `PayInvoiceUseCase` | 付款完成（paid） |
| `CloseInvoiceUseCase` | 關閉（closed） |
| `MaterializeInvoicesFromKnowledgeEvent` | 由 `knowledge.page_approved` 事件批量建立 Invoice，攜帶 `sourceReference` | — |

**代碼位置：** `modules/workspace-flow/application/use-cases/`

---

## `workspace-audit` 模組

| Use Case | 動作 |
|---------|------|
| `LogAuditEntryUseCase` | 記錄操作稽核日誌 |
| `ListAuditLogsUseCase` | 列出工作區稽核記錄 |

**代碼位置：** `modules/workspace-audit/application/use-cases/`

---

## `workspace-feed` 模組

| Use Case | 動作 |
|---------|------|
| `CreateFeedPostUseCase` | 發佈貼文 |
| `ReactToFeedPostUseCase` | 對貼文互動（按讚/回覆/轉貼） |
| `ListFeedPostsUseCase` | 列出動態牆貼文 |

**代碼位置：** `modules/workspace-feed/application/`

---

## `workspace-scheduling` 模組

| Use Case | 動作 |
|---------|------|
| `SubmitWorkDemandUseCase` | 提交工作需求 |
| `AssignWorkWindowUseCase` | 指派時段 / 容量 |
| `ReviewCapacityUseCase` | 檢查工作量與排程衝突 |

**代碼位置：** `modules/workspace-scheduling/application/`

---

## `notification` 模組

| Use Case | 動作 |
|---------|------|
| `SendNotificationUseCase` | 發送通知 |
| `MarkNotificationReadUseCase` | 標記已讀 |
| `ListNotificationsUseCase` | 列出收件匣 |

**代碼位置：** `modules/notification/application/use-cases/`

---

## Server Action 作為 Use Case 入口

Use Case 的頂層入口是 Next.js Server Action（`"use server"`），位於 `interfaces/_actions/`：

```typescript
// modules/workspace-flow/interfaces/_actions/task.actions.ts
"use server";

export async function createTaskAction(dto: CreateTaskDto): Promise<CommandResult> {
  const useCase = new CreateTaskUseCase(new FirebaseTaskRepository());
  return useCase.execute(dto);
}
```

**入口規則：**
1. Server Action 只做「組裝 Use Case + 執行」，不含業務邏輯
2. 每個 Server Action 對應一個 Use Case
3. 直接回傳 `CommandResult` 給呼叫端
