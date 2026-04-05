# Domain Events — knowledge

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `knowledge.page_created` | 新頁面建立時 | `pageId`, `accountId`, `workspaceId?`, `title`, `createdByUserId`, `occurredAt` |
| `knowledge.page_renamed` | 頁面標題變更 | `pageId`, `accountId`, `previousTitle`, `newTitle`, `occurredAt` |
| `knowledge.page_moved` | 頁面移動（parentPageId 變更） | `pageId`, `accountId`, `previousParentPageId`, `newParentPageId`, `occurredAt` |
| `knowledge.page_archived` | 頁面歸檔 | `pageId`, `accountId`, `occurredAt` |
| `knowledge.page_approved` | 使用者核准 AI 生成草稿 | 見下方詳細定義 |
| `knowledge.page_verified` | 頁面在 Wiki Space 中被驗證 | `pageId`, `accountId`, `verifiedByUserId`, `verifiedAtISO`, `verificationExpiresAtISO?`, `occurredAtISO` |
| `knowledge.page_review_requested` | 頁面被標記為待審閱 | `pageId`, `accountId`, `requestedByUserId`, `occurredAtISO` |
| `knowledge.page_owner_assigned` | 頁面負責人被指定 | `pageId`, `accountId`, `ownerId`, `occurredAtISO` |
| `knowledge.block_added` | 區塊新增 | `blockId`, `pageId`, `accountId`, `contentText`, `occurredAt` |
| `knowledge.block_updated` | 區塊內容更新 | `blockId`, `pageId`, `accountId`, `contentText`, `occurredAt` |
| `knowledge.block_deleted` | 區塊刪除 | `blockId`, `pageId`, `accountId`, `occurredAt` |
| `knowledge.version_published` | 版本快照手動發佈 | `versionId`, `pageId`, `accountId`, `label`, `createdByUserId`, `occurredAt` |

## 最重要事件：knowledge.page_approved

```typescript
// 代碼位置：modules/knowledge/domain/events/knowledge.events.ts
interface KnowledgePageApprovedEvent {
  readonly type: "knowledge.page_approved";
  readonly aggregateId: string;      // KnowledgePage ID
  readonly pageId: string;
  readonly occurredAt: string;       // ISO 8601（注意：此 BC 用 occurredAt，非 occurredAtISO）
  readonly extractedTasks: ReadonlyArray<{
    readonly title: string;
    readonly dueDate?: string;
    readonly description?: string;
  }>;
  readonly extractedInvoices: ReadonlyArray<{
    readonly amount: number;
    readonly description: string;
    readonly currency?: string;    // 預設 "TWD"
  }>;
  readonly actorId: string;          // 執行審批的使用者 ID
  readonly causationId: string;      // 觸發命令 ID
  readonly correlationId: string;    // 業務流程追蹤 ID
}
```

## Wiki/Knowledge Base 驗證事件

```typescript
interface KnowledgePageVerifiedEvent {
  readonly type: "knowledge.page_verified";
  readonly pageId: string;
  readonly accountId: string;
  readonly verifiedByUserId: string;
  readonly verifiedAtISO: string;
  readonly verificationExpiresAtISO?: string;
  readonly occurredAtISO: string;
}

interface KnowledgePageReviewRequestedEvent {
  readonly type: "knowledge.page_review_requested";
  readonly pageId: string;
  readonly accountId: string;
  readonly requestedByUserId: string;
  readonly occurredAtISO: string;
}

interface KnowledgePageOwnerAssignedEvent {
  readonly type: "knowledge.page_owner_assigned";
  readonly pageId: string;
  readonly accountId: string;
  readonly ownerId: string;
  readonly occurredAtISO: string;
}
```

## 訂閱事件（消費端）

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `identity` | `TokenRefreshSignal` | 更新使用者 session |

## 消費 knowledge 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `workspace-flow` | `knowledge.page_approved` | ContentToWorkflowMaterializer 建立 Task、Invoice |
| `wiki` | `knowledge.page_created`, `knowledge.block_updated` | 同步 GraphNode |
| `ai` | `knowledge.page_approved` | 觸發 IngestionJob |

## 最重要事件：knowledge.page_approved

```typescript
// 代碼位置：modules/knowledge/domain/events/knowledge.events.ts
interface KnowledgePageApprovedEvent {
  readonly type: "knowledge.page_approved";
  readonly aggregateId: string;      // KnowledgePage ID
  readonly pageId: string;
  readonly occurredAt: string;       // ISO 8601（注意：此 BC 用 occurredAt，非 occurredAtISO）
  readonly extractedTasks: ReadonlyArray<{
    readonly title: string;
    readonly dueDate?: string;
    readonly description?: string;
  }>;
  readonly extractedInvoices: ReadonlyArray<{
    readonly amount: number;
    readonly description: string;
    readonly currency?: string;    // 預設 "TWD"
  }>;
  readonly actorId: string;          // 執行審批的使用者 ID
  readonly causationId: string;      // 觸發命令 ID
  readonly correlationId: string;    // 業務流程追蹤 ID
}
```

## 訂閱事件（消費端）

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `identity` | `TokenRefreshSignal` | 更新使用者 session |

## 消費 knowledge 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `workspace-flow` | `knowledge.page_approved` | ContentToWorkflowMaterializer 建立 Task、Invoice |
| `wiki` | `knowledge.page_created`, `knowledge.block_updated` | 同步 GraphNode |
| `ai` | `knowledge.page_approved` | 觸發 IngestionJob |
