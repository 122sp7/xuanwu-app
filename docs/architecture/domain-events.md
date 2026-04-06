# 領域事件（Domain Events）

<!-- change: Refresh cross-context domain events to current topology; PR-NUM -->

本文件記錄 Xuanwu App 在架構層最重要的跨上下文領域事件。各 bounded context 的完整事件集仍以 `modules/<context>/domain-events.md` 為準。

> **相關文件：** [`domain-model.md`](./domain-model.md) · [`../ddd/bounded-contexts.md`](../ddd/bounded-contexts.md) · [`module-boundary.md`](./module-boundary.md)

---

## 設計規範

所有領域事件遵循以下約定：

```typescript
// ✅ 正確：discriminated-union interface，欄位平鋪於頂層，無 payload 包裹
interface SomethingHappenedEvent {
  readonly type: "module-name.entity.action";  // 命名格式：module.entity.action
  readonly aggregateId: string;
  readonly occurredAt: string;                 // ISO 8601 時間戳
  // ...事件特定欄位直接展開
}
```

| 規則 | 說明 |
|------|------|
| **無 payload 包裹** | 事件欄位直接在介面頂層展開，不套 `payload` 物件 |
| **includeOccurredAt** | 每個事件必須含 `occurredAt` 時間戳 |
| **discriminated union** | 同模組的事件聚合為 `XxxEvent = A \| B \| C` 的 union 型別 |
| **命名格式** | `<module>.<entity>.<action>` 全小寫底線分隔 |

---

## `knowledge` 模組事件

**代碼位置：** `modules/knowledge/domain-events.md`

| 事件類型 | 觸發時機 | 關鍵欄位 | 主要消費者 |
|---------|---------|---------|-----------|
| `knowledge.page_created` | 頁面建立 | `pageId`, `workspaceId`, `title`, `actorId` | `knowledge-base`（promote 協議）、本地 read models |
| `knowledge.block_updated` | 區塊內容更新 | `pageId`, `blockId`, `contentText` | `ai` / `search` 攝入重整流程 |
| `knowledge.version_published` | 版本快照發佈 | `versionId`, `pageId`, `label`, `actorId` | 協作與審閱流程 |
| `knowledge.page_approved` | 使用者核准草稿頁面 | `pageId`, `workspaceId`, `actorId`, `extractedTasks[]`, `extractedInvoices[]`, `causationId`, `correlationId` | `workspace-flow`, `ai` |
| `knowledge.page_promoted` | 頁面提升為知識庫資產 | `pageId`, `targetArticleId`, `actorId` | `knowledge-base` |

**`knowledge.page_approved` 完整介面定義：**

```typescript
interface KnowledgePageApprovedEvent {
  readonly type: "knowledge.page_approved";
  readonly aggregateId: string;
  readonly occurredAt: string;
  readonly pageId: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly extractedTasks: ReadonlyArray<{
    readonly title: string;
    readonly dueDate?: string;
    readonly description?: string;
  }>;
  readonly extractedInvoices: ReadonlyArray<{
    readonly amount: number;
    readonly description: string;
    readonly currency?: string;
  }>;
  readonly causationId: string;
  readonly correlationId: string;
}
```

---

## `ai` 模組事件

**代碼位置：** `modules/ai/domain-events.md`

| 事件類型 | 觸發時機 | 關鍵欄位 | 主要消費者 |
|---------|---------|---------|-----------|
| `ai.ingestion_started` | ingestion job 開始 | `jobId`, `documentId`, `workspaceId` | UI / monitoring |
| `ai.ingestion_completed` | parse/chunk/embed/index 完成 | `jobId`, `documentId`, `workspaceId`, `chunkCount` | `search` |
| `ai.ingestion_failed` | ingestion pipeline 失敗 | `jobId`, `documentId`, `reason` | UI / audit / retry logic |

---

## `workspace-flow` 模組事件

### Task 事件

**代碼位置：** `modules/workspace-flow/domain/events/TaskEvent.ts`

| 事件類型 | 觸發時機 | 關鍵欄位 |
|---------|---------|---------|
| `workspace-flow.task.created` | 任務建立 | `taskId`, `workspaceId`, `title` |
| `workspace-flow.task.assigned` | 任務指派給成員 | `taskId`, `workspaceId`, `assigneeId` |
| `workspace-flow.task.submitted_to_qa` | 提交 QA 審查 | `taskId`, `workspaceId` |
| `workspace-flow.task.qa_passed` | QA 通過 | `taskId`, `workspaceId` |
| `workspace-flow.task.acceptance_approved` | 驗收核准 | `taskId`, `workspaceId`, `acceptedAtISO` |
| `workspace-flow.task.archived` | 任務歸檔 | `taskId`, `workspaceId`, `archivedAtISO` |
| `workspace-flow.task.status_changed` | 任意狀態轉換 | `taskId`, `workspaceId`, `from: TaskStatus`, `to: TaskStatus` |

### Issue 事件

**代碼位置：** `modules/workspace-flow/domain/events/IssueEvent.ts`

| 事件類型 | 觸發時機 | 關鍵欄位 |
|---------|---------|---------|
| `workspace-flow.issue.opened` | 問題建立 | `issueId`, `taskId`, `stage`, `createdBy` |
| `workspace-flow.issue.started` | 開始處理問題 | `issueId`, `taskId` |
| `workspace-flow.issue.fixed` | 問題修復完成 | `issueId`, `taskId` |
| `workspace-flow.issue.retest_submitted` | 提交重測 | `issueId`, `taskId` |
| `workspace-flow.issue.retest_passed` | 重測通過 | `issueId`, `taskId`, `stage` |
| `workspace-flow.issue.retest_failed` | 重測失敗 | `issueId`, `taskId` |
| `workspace-flow.issue.closed` | 問題關閉 | `issueId`, `taskId` |
| `workspace-flow.issue.status_changed` | 任意狀態轉換 | `issueId`, `taskId`, `from`, `to` |

### Invoice 事件

**代碼位置：** `modules/workspace-flow/domain/events/InvoiceEvent.ts`

| 事件類型 | 觸發時機 | 關鍵欄位 |
|---------|---------|---------|
| `workspace-flow.invoice.created` | 發票建立 | `invoiceId`, `workspaceId` |
| `workspace-flow.invoice.item_added` | 項目新增 | `invoiceId`, `invoiceItemId`, `taskId`, `amount` |
| `workspace-flow.invoice.item_removed` | 項目移除 | `invoiceId`, `invoiceItemId` |
| `workspace-flow.invoice.submitted` | 提交審核 | `invoiceId`, `workspaceId`, `submittedAtISO` |
| `workspace-flow.invoice.reviewed` | 已審閱 | `invoiceId`, `workspaceId` |
| `workspace-flow.invoice.approved` | 核准 | `invoiceId`, `workspaceId`, `approvedAtISO` |
| `workspace-flow.invoice.rejected` | 拒絕 | `invoiceId`, `workspaceId` |
| `workspace-flow.invoice.paid` | 付款完成 | `invoiceId`, `workspaceId`, `paidAtISO` |
| `workspace-flow.invoice.closed` | 關閉 | `invoiceId`, `workspaceId`, `closedAtISO` |
| `workspace-flow.invoice.status_changed` | 任意狀態轉換 | `invoiceId`, `workspaceId`, `from`, `to` |

---

## `workspace-feed` 模組事件

**代碼位置：** `modules/workspace-feed/domain/events/workspace-feed.events.ts`

| 事件類型 | 觸發時機 | 關鍵欄位 |
|---------|---------|---------|
| `WorkspaceFeedPostCreated` | 貼文建立 | `accountId`, `workspaceId`, `postId`, `actorAccountId` |
| `WorkspaceFeedReplyCreated` | 回覆建立 | `postId`, `parentPostId` |
| `WorkspaceFeedRepostCreated` | 轉貼 | `postId`, `sourcePostId` |
| `WorkspaceFeedPostLiked` | 按讚 | `postId`, `actorAccountId` |
| `WorkspaceFeedPostViewed` | 瀏覽 | `postId`, `actorAccountId` |
| `WorkspaceFeedPostBookmarked` | 收藏 | `postId`, `actorAccountId` |
| `WorkspaceFeedPostShared` | 分享 | `postId`, `actorAccountId` |

---

## `shared` 模組跨上下文事件基礎設施

`shared` 不擁有產品事件語意本身，而是提供 Event Store 與跨上下文發布基礎設施，例如 `EventRecord`、`PublishDomainEventUseCase`、event metadata 等通用原語。

---

## 事件流程圖

```
knowledge.page_approved
  │  （欄位：pageId, workspaceId, extractedTasks[], extractedInvoices[], actorId, causationId, correlationId）
  │
  └─► workspace-flow: materializer / process manager
        ├── 依 extractedTasks[] 建立 Task（含 sourceReference → KnowledgePage）
        └── 依 extractedInvoices[] 建立 Invoice（含 sourceReference → KnowledgePage）

knowledge.block_updated
  │
  └─► ai: 重新整理 ingestion job / index preparation

ai.ingestion_completed
  │
  └─► search: 更新可檢索表示、citation context 與 retrieval data

workspace-flow.task.created / workspace-flow.invoice.paid
  │
  └─► workspace-audit: 記錄操作稽核日誌
```

---

## Event Store 整合

所有領域事件可透過 `shared` 模組的 Event Store 基礎設施持久化：

```typescript
// 使用方式
import { PublishDomainEventUseCase } from "@/modules/shared/api";

const publishEvent = new PublishDomainEventUseCase(
  eventStoreRepository,
  eventBusRepository,
);

await publishEvent.execute({
  eventName: "knowledge.page_created",
  aggregateType: "KnowledgePage",
  aggregateId: pageId,
  payload: { title, workspaceId, actorId: userId },
  metadata: { actorId: userId, traceId },
});
```

**代碼位置：** `modules/shared/application/publish-domain-event.ts`
