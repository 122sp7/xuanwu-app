# Domain Events ??knowledge

## ?澆鈭辣

| 鈭辣 | 閫貊璇辣 | ?甈? |
|------|---------|---------|
| `knowledge.page_created` | ?圈??Ｗ遣蝡? | `pageId`, `accountId`, `workspaceId?`, `title`, `createdByUserId`, `occurredAt` |
| `knowledge.page_renamed` | ?璅?霈 | `pageId`, `accountId`, `previousTitle`, `newTitle`, `occurredAt` |
| `knowledge.page_moved` | ?蝘餃?嚗arentPageId 霈嚗?| `pageId`, `accountId`, `previousParentPageId`, `newParentPageId`, `occurredAt` |
| `knowledge.page_archived` | ?甇豢? | `pageId`, `accountId`, `occurredAt` |
| `knowledge.page_approved` | 雿輻???AI ???阮 | 閬??寡底蝝啣?蝢?|
| `knowledge.page_verified` | ???Wiki Space 銝剛◤撽? | `pageId`, `accountId`, `verifiedByUserId`, `verifiedAtISO`, `verificationExpiresAtISO?`, `occurredAtISO` |
| `knowledge.page_review_requested` | ?鋡急?閮敺祟??| `pageId`, `accountId`, `requestedByUserId`, `occurredAtISO` |
| `knowledge.page_owner_assigned` | ?鞎痊鈭箄◤?? | `pageId`, `accountId`, `ownerId`, `occurredAtISO` |
| `knowledge.block_added` | ?憛憓?| `blockId`, `pageId`, `accountId`, `contentText`, `occurredAt` |
| `knowledge.block_updated` | ?憛摰寞??| `blockId`, `pageId`, `accountId`, `contentText`, `occurredAt` |
| `knowledge.block_deleted` | ?憛??| `blockId`, `pageId`, `accountId`, `occurredAt` |
| `knowledge.version_published` | ?敹怎???潔? | `versionId`, `pageId`, `accountId`, `label`, `createdByUserId`, `occurredAt` |

## ???鈭辣嚗nowledge.page_approved

```typescript
// 隞?Ⅳ雿蔭嚗odules/knowledge/domain/events/knowledge.events.ts
interface KnowledgePageApprovedEvent {
  readonly type: "knowledge.page_approved";
  readonly aggregateId: string;      // KnowledgePage ID
  readonly pageId: string;
  readonly occurredAt: string;       // ISO 8601嚗釣??甇?BC ??occurredAt嚗? occurredAtISO嚗?
  readonly extractedTasks: ReadonlyArray<{
    readonly title: string;
    readonly dueDate?: string;
    readonly description?: string;
  }>;
  readonly extractedInvoices: ReadonlyArray<{
    readonly amount: number;
    readonly description: string;
    readonly currency?: string;    // ?身 "TWD"
  }>;
  readonly actorId: string;          // ?瑁?撖拇?蝙?刻?ID
  readonly causationId: string;      // 閫貊?賭誘 ID
  readonly correlationId: string;    // 璆剖?瘚?餈質馱 ID
}
```

## Wiki/Knowledge Base 撽?鈭辣

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

## 閮鈭辣嚗?鞎餌垢嚗?

| 靘? BC | 閮鈭辣 | 銵? |
|---------|---------|------|
| `identity` | `TokenRefreshSignal` | ?湔雿輻??session |

## 瘨祥 knowledge 鈭辣?隞?BC

| 瘨祥 BC | 鈭辣 | 銵? |
|---------|------|------|
| `workspace-flow` | `knowledge.page_approved` | ContentToWorkflowMaterializer 撱箇? Task?nvoice |
| `wiki` | `knowledge.page_created`, `knowledge.block_updated` | ?郊 GraphNode |
| `ai` | `knowledge.page_approved` | 閫貊 IngestionJob |

## ???鈭辣嚗nowledge.page_approved

```typescript
// 隞?Ⅳ雿蔭嚗odules/knowledge/domain/events/knowledge.events.ts
interface KnowledgePageApprovedEvent {
  readonly type: "knowledge.page_approved";
  readonly aggregateId: string;      // KnowledgePage ID
  readonly pageId: string;
  readonly occurredAt: string;       // ISO 8601嚗釣??甇?BC ??occurredAt嚗? occurredAtISO嚗?
  readonly extractedTasks: ReadonlyArray<{
    readonly title: string;
    readonly dueDate?: string;
    readonly description?: string;
  }>;
  readonly extractedInvoices: ReadonlyArray<{
    readonly amount: number;
    readonly description: string;
    readonly currency?: string;    // ?身 "TWD"
  }>;
  readonly actorId: string;          // ?瑁?撖拇?蝙?刻?ID
  readonly causationId: string;      // 閫貊?賭誘 ID
  readonly correlationId: string;    // 璆剖?瘚?餈質馱 ID
}
```

## 閮鈭辣嚗?鞎餌垢嚗?

| 靘? BC | 閮鈭辣 | 銵? |
|---------|---------|------|
| `identity` | `TokenRefreshSignal` | ?湔雿輻??session |

## 瘨祥 knowledge 鈭辣?隞?BC

| 瘨祥 BC | 鈭辣 | 銵? |
|---------|------|------|
| `workspace-flow` | `knowledge.page_approved` | ContentToWorkflowMaterializer 撱箇? Task?nvoice |
| `wiki` | `knowledge.page_created`, `knowledge.block_updated` | ?郊 GraphNode |
| `ai` | `knowledge.page_approved` | 閫貊 IngestionJob |
