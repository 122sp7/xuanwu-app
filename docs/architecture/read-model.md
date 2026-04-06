# 讀模型 / CQRS（Read Model）

<!-- change: Add content Database ↔ workspace-flow read-only sync explanation; PR-NUM -->

本文件說明 Xuanwu App 中的 CQRS（Command Query Responsibility Segregation）讀寫分離設計，包含 Query 函式的位置、訂閱模式，以及與 Write-side（Use Cases）的分工。

> **相關文件：** [`use-cases.md`](./use-cases.md) · [`repository-pattern.md`](./repository-pattern.md) · [`infrastructure-strategy.md`](./infrastructure-strategy.md) · [`adr/ADR-001-knowledge-to-workflow-boundary.md`](./adr/ADR-001-knowledge-to-workflow-boundary.md)

---

## CQRS 設計原則

| 原則 | 說明 |
|------|------|
| **Write-side** | Server Actions → Use Cases → Repository（命令路徑） |
| **Read-side** | Query 函式 / Hooks → Firebase 直接查詢（查詢路徑） |
| **Read 不走 Use Case** | 讀模型直接使用 Firebase Repository，不必封裝成 Use Case |
| **Read 位置** | `modules/<context>/interfaces/queries/` |
| **API 匯出** | Query 函式透過 `modules/<context>/api/index.ts` 匯出供外部使用 |

---

## 讀寫分離架構圖

```
                    ┌─────────────────────┐
  Command Path      │   Server Action      │  "use server"
  (寫路徑)  ─────►  │   interfaces/_actions│
                    └─────────┬───────────┘
                              │ execute()
                    ┌─────────▼───────────┐
                    │   Use Case           │  application/use-cases/
                    └─────────┬───────────┘
                              │ repo.save() / repo.update()
                    ┌─────────▼───────────┐
                    │   Write Repository   │  infrastructure/firebase/
                    └─────────────────────┘
                              │ writes to
                    ┌─────────▼───────────┐
                    │   Firestore          │
                    └─────────┬───────────┘
                              │ reads from
                    ┌─────────▼───────────┐
  Query Path        │   Query Functions    │  interfaces/queries/
  (讀路徑)  ◄─────  │   (Read Repository)  │
                    └─────────┬───────────┘
                              │ called by
                    ┌─────────▼───────────┐
                    │   React Components   │  app/ (Server/Client)
                    │   / Server Pages     │
                    └─────────────────────┘
```

---

## Query 函式目錄

### `account` 模組

**代碼位置：** `modules/account/interfaces/queries/account.queries.ts`

| 函式 | 返回值 | 說明 |
|------|--------|------|
| `getAccountById(accountId)` | `AccountEntity \| null` | 取得帳戶 Profile |
| `listAccountsByOrganizationId(orgId)` | `AccountEntity[]` | 組織成員列表 |
| `subscribeToAccount(accountId, onUpdate)` | `unsubscribe()` | 即時訂閱帳戶變更 |

---

### `workspace` 模組

**代碼位置：** `modules/workspace/interfaces/queries/workspace.queries.ts`

```typescript
// 一次性查詢
export async function getWorkspacesForAccount(accountId: string): Promise<WorkspaceEntity[]>
export async function getWorkspaceById(workspaceId: string): Promise<WorkspaceEntity | null>
export async function getWorkspaceByIdForAccount(
  accountId: string,
  workspaceId: string,
): Promise<WorkspaceEntity | null>

// 即時訂閱（Firestore onSnapshot）
export function subscribeToWorkspacesForAccount(
  accountId: string,
  onUpdate: (workspaces: WorkspaceEntity[]) => void,
): () => void                                          // 返回 unsubscribe 函式
```

---

### `workspace` 成員查詢

**代碼位置：** `modules/workspace/interfaces/queries/workspace-member.queries.ts`

| 函式 | 說明 |
|------|------|
| `listWorkspaceMembers(workspaceId)` | 列出工作區成員 |
| `getWorkspaceMember(workspaceId, userId)` | 取得特定成員 |

---

### `organization` 模組

**代碼位置：** `modules/organization/interfaces/queries/organization.queries.ts`

| 函式 | 說明 |
|------|------|
| `getOrganizationById(orgId)` | 取得組織資料 |
| `listOrganizationsForAccount(accountId)` | 取得帳戶所屬組織 |
| `listOrganizationMembers(orgId)` | 列出組織成員 |

---

### `source` 模組

**代碼位置：** `modules/source/interfaces/queries/file.queries.ts`

| 函式 | 說明 |
|------|------|
| `listWorkspaceFiles(workspaceId)` | 列出工作區檔案 |
| `getFileById(fileId)` | 取得檔案詳情 |
| `listRagDocuments(workspaceId)` | 列出 RAG 文件清單（含狀態） |

---

### `knowledge` 模組

**代碼位置：** `modules/knowledge/interfaces/queries/content.queries.ts`

| 函式 | 說明 |
|------|------|
| `listContentPagesByWorkspace(accountId, workspaceId)` | 列出工作區頁面 |
| `getContentPageById(accountId, pageId)` | 取得頁面詳情 |
| `listContentBlocksByPage(accountId, pageId)` | 取得頁面所有區塊 |
| `listContentVersionsByPage(accountId, pageId)` | 取得版本歷程 |

---

### `workspace-flow` 模組

**代碼位置：** `modules/workspace-flow/interfaces/queries/workspace-flow.queries.ts`

| 函式 | 說明 |
|------|------|
| `listTasksByWorkspace(workspaceId)` | 列出工作區任務 |
| `getTaskById(taskId)` | 取得任務詳情 |
| `listIssuesByTask(taskId)` | 列出任務問題清單 |
| `listInvoicesByWorkspace(workspaceId)` | 列出工作區發票 |

---

### `workspace-feed` 模組

**代碼位置：** `modules/workspace-feed/interfaces/queries/workspace-feed.queries.ts`

| 函式 | 說明 |
|------|------|
| `listFeedPosts(workspaceId)` | 列出動態牆貼文 |
| `subscribeToFeedPosts(workspaceId, onUpdate)` | 即時訂閱新貼文 |

---

### `workspace-audit` 模組

**代碼位置：** `modules/workspace-audit/interfaces/queries/audit.queries.ts`

| 函式 | 說明 |
|------|------|
| `listAuditLogs(workspaceId)` | 列出稽核記錄 |
| `listAuditLogsByActor(workspaceId, actorId)` | 按操作者過濾 |

---

### `workspace-scheduling` 模組

**代碼位置：** `modules/workspace-scheduling/interfaces/queries/work-demand.queries.ts`

| 函式 | 說明 |
|------|------|
| `listWorkDemandsByWorkspace(workspaceId)` | 列出工作需求 |
| `getWorkDemandById(demandId)` | 取得需求詳情 |

---

### `notification` 模組

**代碼位置：** `modules/notification/interfaces/queries/notification.queries.ts`

| 函式 | 說明 |
|------|------|
| `listNotificationsForRecipient(recipientId)` | 列出通知收件匣 |
| `subscribeToNotifications(recipientId, onUpdate)` | 即時訂閱通知 |

---

## 即時訂閱模式（Firestore onSnapshot）

部分模組的 Read Model 使用 Firestore `onSnapshot` 提供即時更新：

```typescript
// 即時訂閱工作區列表
const unsubscribe = subscribeToWorkspacesForAccount(accountId, (workspaces) => {
  setWorkspaces(workspaces);   // React state 更新
});

// 組件 unmount 時取消訂閱
useEffect(() => {
  return unsubscribe;
}, [accountId]);
```

**採用即時訂閱的模組：**

| 模組 | 訂閱對象 |
|------|---------|
| `workspace` | 工作區列表（`subscribeToWorkspacesForAccount`） |
| `notification` | 通知收件匣 |
| `workspace-feed` | 動態牆貼文 |
| `account` | 帳戶 Profile |

---

## Read Model 與 Write Model 的資料形態差異

| 面向 | Write Model（Use Case） | Read Model（Query） |
|------|------------------------|---------------------|
| **回傳型別** | `CommandResult` | 直接返回 Entity 或 `null` |
| **錯誤處理** | `{ ok: false, error }` | 返回 `null` 或拋出 Error |
| **驗證** | 輸入完整驗證 | 僅正規化 ID（trim/非空） |
| **副作用** | 有（Firestore 寫入、事件發佈） | 無（純讀取） |
| **快取** | 不快取 | 可快取（Next.js `cache()` / TanStack Query） |

---

## `knowledge` / `knowledge-database` ↔ `workspace-flow` 跨模組唯讀同步

`knowledge` 與 `knowledge-database` 的資料視圖可透過 Read Model 嵌入 `workspace-flow` 的任務與發票狀態，提供統一的檢視介面。此同步**必須**是單向唯讀的，任何對 Task/Invoice 狀態的變更都必須透過 `workspace-flow/api` 的 Server Action。

### 查詢路徑

```typescript
// knowledge / knowledge-database 視圖渲染時，透過 workspace-flow/api 的 Query 函式取得任務列表
// modules/knowledge/interfaces/components/DatabaseBlock.tsx（計畫中）

import { getWorkspaceFlowTasks } from "@/modules/workspace-flow/api";

// Server Component 中一次性查詢
const tasks = await getWorkspaceFlowTasks(workspaceId);

// 或 Client Component 中即時訂閱
const tasks = useWorkspaceFlowTasksSubscription(workspaceId);
```

### 即時同步策略（onSnapshot）

若 Database Block 需要即時更新 Task 狀態，可透過 `workspace-flow` 的訂閱 Hook：

```typescript
// 計畫中 Query 函式（workspace-flow 模組）
export function subscribeToWorkspaceFlowTasks(
  workspaceId: string,
  onUpdate: (tasks: TaskEntity[]) => void,
): Unsubscribe {
  // Firestore onSnapshot 監聽 workspaces/{workspaceId}/tasks
  return onSnapshot(tasksCollection(workspaceId), (snapshot) => {
    onUpdate(snapshot.docs.map(docToTaskEntity));
  });
}
```

### Firestore Indexing（查詢效能）

`knowledge` / `knowledge-database` 視圖展示 Task 時常用的查詢模式需要 Compound Index：

| 查詢模式 | 需要的 Index |
|---------|------------|
| 依 `workspaceId` + `status` 過濾任務 | `workspaceId ASC, status ASC` |
| 依 `workspaceId` + `sourceReference.id` 過濾（溯源查詢） | `workspaceId ASC, sourceReference.id ASC` |
| 依 `workspaceId` + `createdAt` 排序 | `workspaceId ASC, createdAtISO DESC` |

**注意：** `sourceReference.id` 的查詢索引特別重要，因為知識頁面或資料視圖需要根據 KnowledgePage ID 過濾出由同一份內容派生的所有任務。

---

## 與 Next.js App Router 整合

```typescript
// Server Component 使用 Query 函式（Server-side read）
// app/(shell)/workspace/[workspaceId]/page.tsx

import { getWorkspaceByIdForAccount } from "@/modules/workspace/api";

export default async function WorkspacePage({ params }: { params: { workspaceId: string } }) {
  const workspace = await getWorkspaceByIdForAccount(accountId, params.workspaceId);
  if (!workspace) notFound();
  return <WorkspaceView workspace={workspace} />;
}
```

```typescript
// Client Component 使用訂閱 Hook（Client-side real-time）
// modules/workspace/interfaces/hooks/useWorkspaces.ts

export function useWorkspaces(accountId: string) {
  const [workspaces, setWorkspaces] = useState<WorkspaceEntity[]>([]);
  useEffect(() => {
    return subscribeToWorkspacesForAccount(accountId, setWorkspaces);
  }, [accountId]);
  return workspaces;
}
```
