# 領域事件（Domain Events）

<!-- change: Complete content.page_approved definition with actorId/causationId/correlationId fields and process flow; PR-NUM -->

本文件記錄 Xuanwu App 各有界上下文中已定義的所有領域事件（Domain Events）。

> **相關文件：** [`domain-model.md`](./domain-model.md) · [`bounded-contexts.md`](./bounded-contexts.md) · [`adr/ADR-001-content-to-workflow-boundary.md`](./adr/ADR-001-content-to-workflow-boundary.md)

---

## 設計規範

所有領域事件遵循以下約定：

```typescript
// ✅ 正確：discriminated-union interface，欄位平鋪於頂層，無 payload 包裹
interface SomethingHappenedEvent {
  readonly type: "module-name.entity.action";  // 命名格式：module.entity.action
  readonly aggregateId: string;
  readonly occurredAtISO: string;              // ISO 8601 時間戳
  // ...事件特定欄位直接展開
}
```

| 規則 | 說明 |
|------|------|
| **無 payload 包裹** | 事件欄位直接在介面頂層展開，不套 `payload` 物件 |
| **includeOccurredAt** | 每個事件必須含 `occurredAtISO` 或 `occurredAt` 時間戳 |
| **discriminated union** | 同模組的事件聚合為 `XxxEvent = A \| B \| C` 的 union 型別 |
| **命名格式** | `<module>.<entity>.<action>` 全小寫底線分隔 |

---

## `content` 模組事件

**代碼位置：** `modules/content/domain/events/content.events.ts`

| 事件類型 | 觸發時機 | 關鍵欄位 |
|---------|---------|---------|
| `content.page_created` | 頁面建立 | `pageId`, `accountId`, `workspaceId?`, `title`, `createdByUserId` |
| `content.page_renamed` | 頁面標題變更 | `pageId`, `accountId`, `previousTitle`, `newTitle` |
| `content.page_moved` | 頁面移動（parentPageId 變更） | `pageId`, `accountId`, `previousParentPageId`, `newParentPageId` |
| `content.page_archived` | 頁面歸檔 | `pageId`, `accountId` |
| `content.page_approved` | 使用者核准 AI 生成的草稿頁面/資料庫 | `pageId`, `extractedTasks[]`, `extractedInvoices[]`, `actorId`, `causationId`, `correlationId` |
| `content.block_added` | 區塊新增 | `blockId`, `pageId`, `accountId`, `contentText` |
| `content.block_updated` | 區塊內容更新 | `blockId`, `pageId`, `accountId`, `contentText` |
| `content.block_deleted` | 區塊刪除 | `blockId`, `pageId`, `accountId` |
| `content.version_published` | 版本快照手動發佈 | `versionId`, `pageId`, `accountId`, `label`, `createdByUserId` |

**`content.page_approved` 完整介面定義：**

```typescript
// 代碼位置：modules/content/domain/events/content.events.ts
interface ContentPageApprovedEvent {
  readonly type: "content.page_approved";
  readonly aggregateId: string;       // ContentPage ID（聚合根 ID）
  readonly occurredAtISO: string;     // ISO 8601 核准時間戳
  readonly pageId: string;            // ContentPage ID
  readonly extractedTasks: ReadonlyArray<{
    readonly title: string;
    readonly dueDate?: string;
    readonly description?: string;
  }>;
  readonly extractedInvoices: ReadonlyArray<{
    readonly amount: number;
    readonly description: string;
    readonly currency?: string;       // 預設 "TWD"
  }>;
  readonly actorId: string;           // 執行核准操作的使用者 ID
  readonly causationId: string;       // 觸發此事件的命令 ID（ApproveContentPageUseCase 執行 ID）
  readonly correlationId: string;     // 整個業務流程（合約 → 任務）的追蹤 ID
}
```

**`content.page_approved` 消費者：**

| 消費者 | 行動 |
|--------|------|
| `workspace-flow` | 由 `contentToWorkflowMaterializer` Process Manager 監聽，根據 `extractedTasks[]` 建立 Task，根據 `extractedInvoices[]` 建立 Invoice，並在每個實體中記錄 `sourceReference`（指向 `pageId` 與 `causationId`） |

```typescript
// 聯合型別
type ContentDomainEvent =
  | ContentPageCreatedEvent
  | ContentPageRenamedEvent
  | ContentPageMovedEvent
  | ContentPageArchivedEvent
  | ContentPageApprovedEvent
  | ContentBlockAddedEvent
  | ContentBlockUpdatedEvent
  | ContentBlockDeletedEvent
  | ContentVersionPublishedEvent;
```

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

## `shared` 模組跨上下文事件

**代碼位置：** `modules/shared/domain/events/content-updated.event.ts`

| 事件類型 | 觸發時機 | 消費者 |
|---------|---------|--------|
| `content.block-updated` | ContentBlock 內容變更後 | `knowledge`（向量重索引）、`knowledge-graph`（Auto-link 擷取） |

```typescript
interface ContentUpdatedEvent extends DomainEvent {
  readonly type: "content.block-updated";
  readonly pageId: string;
  readonly blockId: string;
  readonly content: string;   // 新的純文字內容
}
```

---

## 事件流程圖

```
content.page_created
  │
  └─► knowledge-graph: LinkExtractor（Auto-link 觸發管道，計畫中）

content.page_approved
  │  （欄位：pageId, extractedTasks[], extractedInvoices[], actorId, causationId, correlationId）
  │
  └─► workspace-flow: contentToWorkflowMaterializer（Process Manager）
        ├── 依 extractedTasks[]  建立 Task（含 sourceReference → ContentPage）
        └── 依 extractedInvoices[] 建立 Invoice（含 sourceReference → ContentPage）

content.block_updated / content.block-updated
  │
  └─► knowledge: 向量重索引（RAG 攝入管線重跑）
  └─► knowledge-graph: 連結重新擷取

workspace-flow.task.created
  │
  └─► workspace-audit: 記錄操作稽核日誌

workspace-flow.invoice.paid
  │
  └─► workspace-audit: 記錄付款稽核日誌
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
  eventName: "content.page_created",
  aggregateType: "ContentPage",
  aggregateId: pageId,
  payload: { title, accountId, workspaceId },
  metadata: { actorId: userId, traceId },
});
```

**代碼位置：** `modules/shared/application/publish-domain-event.ts`
