# 領域服務（Domain Services）

<!-- change: Refresh process-manager terminology and current service owners; PR-NUM -->

本文件說明 Xuanwu App 各有界上下文中實作的 Domain Services，包含狀態機轉換策略（Transition Policy）、業務守衛（Guards）、以及跨聚合的純函式服務。

> **相關文件：** [`domain-model.md`](./domain-model.md) · [`use-cases.md`](./use-cases.md) · [`domain-events.md`](./domain-events.md)

---

## 設計原則

| 原則 | 說明 |
|------|------|
| **純函式** | Domain Service 是無狀態的純函式或純類別方法，無副作用 |
| **框架無關** | 不 import Firebase、React、HTTP client |
| **不依賴 Repository** | 若需要查詢資料，由 Use Case 傳入；Domain Service 只接收領域物件 |
| **商業規則的居所** | 多個聚合之間的業務規則（如跨聚合的守衛）放在 Domain Service |
| **目錄位置** | `modules/<context>/domain/services/` |

---

## `workspace-flow` 模組（最完整的範例）

### Task 狀態機轉換策略

**代碼位置：** `modules/workspace-flow/domain/services/task-transition-policy.ts`

```typescript
// 純函式：評估 Task 狀態轉換是否合法
export function evaluateTaskTransition(
  from: TaskStatus,
  to: TaskStatus,
): TaskTransitionResult {
  if (!canTransitionTaskStatus(from, to)) {
    return {
      allowed: false,
      reason: `Task transition from "${from}" to "${to}" is not permitted.`,
    };
  }
  return { allowed: true };
}
```

**狀態機（`TaskStatus.ts` 中的轉換表）：**

```
draft → in_progress    (ASSIGN)
in_progress → qa       (SUBMIT_TO_QA)
qa → acceptance        (PASS_QA)
acceptance → accepted  (APPROVE_ACCEPTANCE)
accepted → archived    (ARCHIVE)
```

### Task 業務守衛

**代碼位置：** `modules/workspace-flow/domain/services/task-guards.ts`

```typescript
// 守衛：任務在 QA 通過前不得有開放中的 Issue
export function hasNoOpenIssues(openIssueCount: number): boolean {
  return openIssueCount === 0;
}

// 守衛：任務在歸檔前，關聯的發票必須已關閉（或不存在）
export function invoiceAllowsArchive(invoiceStatus: string | undefined): boolean {
  if (invoiceStatus === undefined) return true;
  return invoiceStatus === "closed";
}
```

**Use Case 中的使用方式：**

```typescript
// PassTaskQaUseCase 中同時使用轉換策略 + 守衛
const transition = evaluateTaskTransition(task.status, "acceptance");
if (!transition.allowed) return commandFailureFrom("WF_TASK_INVALID_TRANSITION", transition.reason);

const noOpenIssues = hasNoOpenIssues(openIssueCount);
if (!noOpenIssues) return commandFailureFrom("WF_TASK_HAS_OPEN_ISSUES", "Task has open issues.");
```

---

### Issue 狀態機轉換策略

**代碼位置：** `modules/workspace-flow/domain/services/issue-transition-policy.ts`

**Issue 狀態機：**

```
open → in_progress     (START)
in_progress → fixed    (FIX)
fixed → retest         (SUBMIT_RETEST)
retest → resolved      (PASS_RETEST)
retest → in_progress   (FAIL_RETEST)
resolved → closed      (CLOSE)
open → closed          (CLOSE, 跳轉)
```

---

### Invoice 業務守衛與轉換策略

**代碼位置：**
- `modules/workspace-flow/domain/services/invoice-transition-policy.ts`
- `modules/workspace-flow/domain/services/invoice-guards.ts`

**Invoice 狀態機：**

```
draft → submitted      (SUBMIT)
submitted → reviewed   (REVIEW)
reviewed → approved    (APPROVE)
reviewed → rejected    (REJECT)
approved → paid        (PAY)
paid → closed          (CLOSE)
rejected → closed      (CLOSE)
```

---

## `source` 模組

### 上傳完成領域服務

**代碼位置：** `modules/source/domain/services/complete-upload-file.ts`

職責：驗證上傳完成後的 metadata 合法性，決定 File 實體的初始狀態。

### 組織 ID 解析服務

**代碼位置：** `modules/source/domain/services/resolve-file-organization-id.ts`

職責：從 ActorFileContext 中解析出檔案所屬的 organizationId（跨 Port 協調）。

---

## `shared` 模組

### Slug 工具服務

**代碼位置：** `modules/shared/domain/slug-utils.ts`

```typescript
// 從任意字串派生 URL-safe slug 候選值
export function deriveSlugCandidate(input: string): string;

// 驗證 slug 格式是否合法（僅含小寫字母、數字、連字符）
export function isValidSlug(slug: string): boolean;
```

**使用場景：** 頁面建立時從 title 自動產生 slug；URL 路由驗證。

---

## `search` / `knowledge` 的結構關聯服務（備註）

目前沒有獨立的 `knowledge-graph` bounded context。若未來需要恢復自動連結、backlink 或圖遍歷等能力，應先決定它是 `search` 的檢索結構能力、`knowledge` 的內容關聯能力，或新的 supporting subdomain，而不是直接沿用已移除的 `modules/wiki` 拓樸。

---

## Process Manager / Saga（跨模組協調）

Process Manager 負責協調**跨越多個有界上下文的長時間業務流程**，不含業務規則，僅負責訂閱事件 → 觸發命令的有序協調。

### `KnowledgeToWorkflowMaterializer`

**職責：** 監聽 `knowledge.page_approved` 事件，並協調 `workspace-flow` 模組將經審閱核准的知識頁面物化為正式的 Task / Invoice。

**建議位置選項：**

| 選項 | 路徑 | 適用場景 |
|------|------|---------|
| **A（推薦）** | `modules/workspace-flow/application/process-managers/knowledge-to-workflow-materializer.ts` | 若 Process Manager 主要驅動 workspace-flow 業務邏輯（推薦：職責集中） |
| **B** | `modules/shared/application/sagas/knowledge-to-workflow-materializer.ts` | 若未來有更多跨模組 Saga 需要統一管理 |

**設計草案（選項 A）：**

```typescript
// modules/workspace-flow/application/process-managers/knowledge-to-workflow-materializer.ts
export class KnowledgeToWorkflowMaterializer {
  constructor(
    private readonly taskRepo: ITaskRepository,
    private readonly invoiceRepo: IInvoiceRepository,
  ) {}

  /**
   * 處理 knowledge.page_approved 事件
   * 根據 extractedTasks 建立 Task，根據 extractedInvoices 建立 Invoice
   * 每個實體均帶有 sourceReference 指回 KnowledgePage
   */
    async handle(event: KnowledgePageApprovedEvent, workspaceId: string): Promise<boolean> {
    const sourceReference = {
      type: "KnowledgePage" as const,
      id: event.pageId,
      causationId: event.causationId,
      correlationId: event.correlationId,
    };

    for (const extracted of event.extractedTasks) {
      await this.taskRepo.save({
        id: generateId(),
        workspaceId,
        title: extracted.title,
        description: extracted.description ?? "",
        status: "draft",
        sourceReference,
      });
    }

    for (const extracted of event.extractedInvoices) {
      await this.invoiceRepo.save({
        id: generateId(),
        workspaceId: /* 從 KnowledgePage 關聯的 workspaceId 取得 */,
        status: "draft",
        items: [{ amount: extracted.amount, description: extracted.description }],
        sourceReference,
      });
    }
  }
}
```

**注意事項：**
- Process Manager 不是 Domain Service（有副作用，依賴 Repository），歸類為 `application/process-managers/`。
- 觸發方式視 Event Bus 實作而定（Firebase Cloud Functions trigger / Upstash Queue worker）。
- 必須實作冪等性（idempotency）：若相同 `causationId` 已處理，則跳過重複建立。

---

## Domain Service vs Use Case 的區別

| 面向 | Domain Service | Use Case |
|------|---------------|----------|
| **狀態** | 無狀態，純函式 | 有協調邏輯，可有依賴 |
| **副作用** | 不允許（無 I/O） | 允許（透過 Repository） |
| **依賴** | 只依賴同模組 domain 物件 | 依賴 Repository interface |
| **測試** | 輸入/輸出純函式測試，無 mock | 需 mock Repository |
| **居所** | `domain/services/` | `application/use-cases/` |
| **範例** | `evaluateTaskTransition(from, to)` | `AssignTaskUseCase.execute(taskId, assigneeId)` |

---

## 測試範例

```typescript
// Domain Service 是純函式，可直接測試，無需 mock
describe("evaluateTaskTransition", () => {
  it("allows draft → in_progress", () => {
    const result = evaluateTaskTransition("draft", "in_progress");
    expect(result.allowed).toBe(true);
  });

  it("rejects draft → accepted (non-adjacent)", () => {
    const result = evaluateTaskTransition("draft", "accepted");
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("not permitted");
  });
});

describe("hasNoOpenIssues", () => {
  it("returns true when no open issues", () => {
    expect(hasNoOpenIssues(0)).toBe(true);
  });
  it("returns false when issues exist", () => {
    expect(hasNoOpenIssues(2)).toBe(false);
  });
});
```
