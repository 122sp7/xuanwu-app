# Repository Pattern（儲存抽象）

本文件說明 Xuanwu App 的 Repository Pattern 設計，包含 domain 層介面定義、Firebase 基礎設施實作，以及 Port（跨切關注點抽象）的使用方式。

> **相關文件：** [`domain-model.md`](./domain-model.md) · [`infrastructure-strategy.md`](./infrastructure-strategy.md)

---

## 設計原則

| 原則 | 說明 |
|------|------|
| **依賴反轉** | `domain/` 層只看 interface（Port），`infrastructure/` 實作它 |
| **框架隔離** | Firebase SDK 只出現在 `infrastructure/firebase/` 層，domain 完全不 import |
| **命名規範** | 介面 `PascalCaseRepository`；Firebase 實作 `FirebasePascalCaseRepository` |
| **目錄位置** | 介面在 `domain/repositories/`；Port 在 `domain/ports/`；實作在 `infrastructure/firebase/` |

### 依賴方向

```
interfaces/ ─────────────────────────────────────────────────────►
application/use-cases/ ─── 注入 IRepository ──────────────────────►
domain/repositories/ (interface)                                    
  ▲                                                                  
  │ implements                                                        
infrastructure/firebase/ (concrete)                                 
```

---

## Repository Interface 目錄

### `identity`

| 介面 | 方法 | 說明 |
|------|------|------|
| `IdentityRepository` | `signIn()`, `signOut()`, `getCurrentUser()` | Firebase Auth 操作 |
| `TokenRefreshRepository` | `listenForTokenRefresh()` | 監聽 token 刷新訊號 |

---

### `account`

| 介面 | 方法 | 說明 |
|------|------|------|
| `AccountRepository` | `findById()`, `create()`, `update()` | 帳戶 CRUD |
| `AccountQueryRepository` | `listByOrganizationId()`, `subscribeToAccount()` | 讀取查詢 |
| `AccountPolicyRepository` | `findByAccountId()`, `create()`, `update()` | 帳戶策略 CRUD |

---

### `organization`

| 介面 | 方法 | 說明 |
|------|------|------|
| `OrganizationRepository` | `findById()`, `create()`, `update()`, `addMember()`, `createTeam()`, `inviteMember()` | 組織 CRUD + 成員/Team 管理 |

---

### `workspace`

| 介面 | 方法 | 說明 |
|------|------|------|
| `WorkspaceRepository` | `findById()`, `findAllByAccountId()`, `create()`, `update()`, `addMember()`, `removeMember()` | 工作區 CRUD |
| `WorkspaceQueryRepository` | `subscribeToWorkspacesForAccount()` | 實時訂閱 |
| `WikiBetaWorkspaceRepository` | `getContentTree()` | 頁面樹查詢 |

---

### `content`

```typescript
// modules/content/domain/repositories/content.repositories.ts

interface ContentPageRepository {
  create(input: CreateContentPageInput): Promise<ContentPage>;
  rename(input: RenameContentPageInput): Promise<ContentPage | null>;
  move(input: MoveContentPageInput): Promise<ContentPage | null>;
  reorderBlocks(input: ReorderContentPageBlocksInput): Promise<ContentPage | null>;
  archive(accountId: string, pageId: string): Promise<ContentPage | null>;
  findById(accountId: string, pageId: string): Promise<ContentPage | null>;
  listByAccountId(accountId: string): Promise<ContentPage[]>;
  listByWorkspaceId(accountId: string, workspaceId: string): Promise<ContentPage[]>;
}

interface ContentBlockRepository {
  add(input: AddContentBlockInput): Promise<ContentBlock>;
  update(input: UpdateContentBlockInput): Promise<ContentBlock | null>;
  delete(accountId: string, blockId: string): Promise<void>;
  findById(accountId: string, blockId: string): Promise<ContentBlock | null>;
  listByPageId(accountId: string, pageId: string): Promise<ContentBlock[]>;
}

interface ContentVersionRepository {
  create(input: CreateContentVersionInput): Promise<ContentVersion>;
  findById(accountId: string, versionId: string): Promise<ContentVersion | null>;
  listByPageId(accountId: string, pageId: string): Promise<ContentVersion[]>;
}
```

---

### `asset`

| 介面 | 方法 | 說明 |
|------|------|------|
| `FileRepository` | `create()`, `findById()`, `listByWorkspaceId()` | 檔案 CRUD |
| `RagDocumentRepository` | `register()`, `findById()`, `updateStatus()` | RAG 文件狀態管理 |
| `WikiBetaLibraryRepository` | `create()`, `findById()`, `listByWorkspaceId()` | Wiki Library CRUD |

---

### `knowledge-graph`

```typescript
// modules/knowledge-graph/domain/repositories/GraphRepository.ts

interface GraphRepository {
  upsertNode(node: GraphNode): Promise<void>;
  addLink(link: Link): Promise<void>;
  findLinksBySourceId(sourceId: string): Promise<Link[]>;
  findLinksByTargetId(targetId: string): Promise<Link[]>;   // Backlinks
  findLinksByType(type: LinkType): Promise<Link[]>;
  listNodes(): Promise<GraphNode[]>;
  listLinks(): Promise<Link[]>;
}
```

---

### `knowledge`

| 介面 | 方法 | 說明 |
|------|------|------|
| `IngestionJobRepository` | `create()`, `findByDocId()`, `advanceStage()`, `markReady()`, `markFailed()` | 攝入作業生命週期 |

---

### `retrieval`

```typescript
// modules/retrieval/domain/repositories/RagRetrievalRepository.ts

interface RagRetrievalRepository {
  retrieve(input: RetrieveRagChunksInput): Promise<readonly RagRetrievedChunk[]>;
}

// modules/retrieval/domain/repositories/RagGenerationRepository.ts

interface RagGenerationRepository {
  generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult>;
}

// modules/retrieval/domain/repositories/WikiBetaContentRepository.ts

interface WikiBetaContentRepository {
  getPages(workspaceId: string): Promise<WikiBetaPage[]>;
  getDocuments(workspaceId: string): Promise<RagDocument[]>;
}
```

---

### `workspace-flow`

| 介面 | 方法 |
|------|------|
| `TaskRepository` | `create()`, `findById()`, `update()`, `transitionStatus()`, `delete()` |
| `IssueRepository` | `create()`, `findById()`, `update()`, `transitionStatus()` |
| `InvoiceRepository` | `create()`, `findById()`, `update()`, `transitionStatus()` |

---

### `shared` — Event Store

```typescript
// modules/shared/domain/event-record.ts

interface IEventStoreRepository {
  save(event: EventRecord): Promise<void>;
  findById(id: string): Promise<EventRecord | null>;
  findByAggregate(aggregateType: string, aggregateId: string): Promise<EventRecord[]>;
  findUndispatched(limit: number): Promise<EventRecord[]>;
  markDispatched(id: string, dispatchedAt: Date): Promise<void>;
}

interface IEventBusRepository {
  publish(event: EventRecord): Promise<void>;
}
```

---

## Domain Ports（跨切關注點抽象）

Port 是比 Repository 更廣義的 domain 抽象埠，用於跨切關注點（non-domain 依賴）：

### `asset` 模組 Ports

```typescript
// modules/asset/domain/ports/ActorContextPort.ts
interface ActorContextPort {
  getActorFileContext(actorAccountId: string): ActorFileContext | null;
}

// modules/asset/domain/ports/WorkspaceGrantPort.ts
interface WorkspaceGrantPort {
  getWorkspaceGrantSnapshot(
    workspaceId: string,
    actorAccountId: string
  ): WorkspaceGrantSnapshot | null;
}

// modules/asset/domain/ports/OrganizationPolicyPort.ts
interface OrganizationPolicyPort {
  getPolicyForActor(organizationId: string, actorAccountId: string): OrgPolicySnapshot | null;
}
```

### `retrieval` 模組 Ports

```typescript
// modules/retrieval/domain/ports/vector-store.ts

/** Hexagonal Port：向量資料庫的純抽象 */
interface IVectorStore {
  upsert(documents: VectorDocument[]): Promise<void>;
  search(
    query: string,
    k: number,
    filter?: Record<string, string | number | boolean>
  ): Promise<VectorSearchResult[]>;
}
```

---

## Firebase 實作對照表

| Repository 介面 | Firebase 實作 | Firestore 路徑 |
|----------------|--------------|----------------|
| `IdentityRepository` | `FirebaseIdentityRepository` | Firebase Auth |
| `AccountRepository` | `FirebaseAccountRepository` | `accounts/{accountId}` |
| `AccountPolicyRepository` | `FirebaseAccountPolicyRepository` | `accountPolicies/{policyId}` |
| `AccountQueryRepository` | `FirebaseAccountQueryRepository` | `accounts/{accountId}` |
| `OrganizationRepository` | `FirebaseOrganizationRepository` | `organizations/{orgId}` |
| `WorkspaceRepository` | `FirebaseWorkspaceRepository` | `workspaces/{workspaceId}` |
| `WorkspaceQueryRepository` | `FirebaseWorkspaceQueryRepository` | `workspaces/` (onSnapshot) |
| `ContentPageRepository` | `FirebaseContentPageRepository` | `accounts/{accountId}/contentPages/{pageId}` |
| `ContentBlockRepository` | `FirebaseContentBlockRepository` | `accounts/{accountId}/contentBlocks/{blockId}` |
| `FileRepository` | `FirebaseFileRepository` | Firebase Storage + Firestore |
| `RagDocumentRepository` | `FirebaseRagDocumentRepository` | `accounts/{accountId}/documents/{docId}` |
| `RagRetrievalRepository` | `FirebaseRagRetrievalRepository` | Firestore vector queries |
| `RagGenerationRepository` | `GenkitRagGenerationRepository` | Genkit / Gemini API |
| `AgentRepository` | `GenkitAgentRepository` | Genkit / Gemini API |
| `TaskRepository` | `FirebaseTaskRepository` | `workspaceFlowTasks/{taskId}` |
| `IssueRepository` | `FirebaseIssueRepository` | `workspaceFlowIssues/{issueId}` |
| `InvoiceRepository` | `FirebaseInvoiceRepository` | `workspaceFlowInvoices/{invoiceId}` |
| `AuditRepository` | `FirebaseAuditRepository` | `auditLogs/{logId}` |
| `NotificationRepository` | `FirebaseNotificationRepository` | `notifications/{notificationId}` |
| `IEventStoreRepository` | `InMemoryEventStoreRepository` | （記憶體，測試用）|
| `IEventBusRepository` | `NoopEventBusRepository` | （無操作，測試用）|

---

## 使用範例

### Use Case 中注入 Repository

```typescript
// application 層：依賴 interface（DIP）
export class AssignTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}  // 注入 interface

  async execute(taskId: string, assigneeId: string): Promise<CommandResult> {
    const task = await this.taskRepository.findById(taskId);
    const guard = evaluateTaskTransition(task.status, "in_progress");
    if (!guard.allowed) return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    await this.taskRepository.update(taskId, { assigneeId });
    const updated = await this.taskRepository.transitionStatus(taskId, "in_progress", new Date().toISOString());
    return commandSuccess(updated.id, Date.now());
  }
}

// Server Action 層：組裝 concrete 實作
export async function assignTaskAction(taskId: string, assigneeId: string) {
  "use server";
  const useCase = new AssignTaskUseCase(new FirebaseTaskRepository());  // 在此 new 具體實作
  return useCase.execute(taskId, assigneeId);
}
```
