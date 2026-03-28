# 領域模型（Domain Model）

<!-- change: Add sourceReference / readonly view reference between ContentPage and workspace-flow entities; PR-NUM -->

本文件描述 Xuanwu App 各有界上下文的聚合根（Aggregate Root）、實體（Entity）與值物件（Value Object）設計。

> **相關文件：** [`bounded-contexts.md`](./bounded-contexts.md) · [`domain-events.md`](./domain-events.md) · [`repository-pattern.md`](./repository-pattern.md) · [`adr/ADR-001-content-to-workflow-boundary.md`](./adr/ADR-001-content-to-workflow-boundary.md)

---

## 設計原則

| 原則 | 說明 |
|------|------|
| **純 TypeScript** | `domain/` 層完全不依賴 Firebase SDK、React、HTTP client |
| **聚合根為邊界** | 所有對聚合的寫入必須透過聚合根進行，禁止直接操作子實體 |
| **值物件不可變** | 值物件以 `readonly` 標記，以值相等而非參考相等判斷 |
| **狀態機內嵌** | 生命週期狀態轉換邏輯封裝在 `value-objects/` 的 transition helper 中 |

---

## Platform Foundation Layer

### `identity` 模組

```
聚合根: Identity
└── uid: string          // Firebase Auth UID（主鍵）
└── email: string
└── displayName?: string

值物件: TokenRefreshSignal
└── uid: string
└── refreshedAtISO: string
```

**代碼位置：** `modules/identity/domain/entities/`

---

### `account` 模組

```
聚合根: AccountEntity
├── id: string
├── name: string
├── accountType: AccountType          // "user" | "organization"
├── email: string
├── photoURL?: string
├── presence: Presence                // "active" | "away" | "offline"
└── themeConfig?: ThemeConfig

值物件: AccountPolicy
├── id: string
├── accountId: string
└── rules: PolicyRule[]

值物件: AccountType   → "user" | "organization"
值物件: Presence      → "active" | "away" | "offline"
```

**代碼位置：** `modules/account/domain/entities/`

---

### `organization` 模組

```
聚合根: OrganizationEntity
├── id: string
├── name: string
├── ownerId: string
├── members: MemberReference[]        // 成員快照（值物件集合）
├── teams: Team[]                     // 內嵌群組（值物件集合）
└── settings: OrgSettings

值物件: Team
├── id: string
├── name: string
├── type: string
└── memberIds: string[]

值物件: MemberReference
├── id: string
├── name: string
├── email: string
├── role: OrganizationRole
└── presence: Presence

值物件: OrgPolicy
├── scope: OrgPolicyScope             // "workspace" | "member" | "global"
└── rules: PolicyRule[]

值物件: PartnerInvite
├── email: string
├── teamId: string
├── role: string
└── inviteState: InviteState          // "pending" | "accepted" | "expired"

值物件: ThemeConfig
├── primary: string
├── background: string
└── accent: string
```

> **設計決策：** `Team` 是 Organization 的值物件集合，不是獨立的有界上下文。

**代碼位置：** `modules/organization/domain/entities/Organization.ts`

---

### `workspace` 模組

```
聚合根: WorkspaceEntity
├── id: string
├── name: string
├── accountId: string
├── accountType: "user" | "organization"
├── lifecycleState: WorkspaceLifecycleState   // "preparatory" | "active" | "stopped"
├── visibility: WorkspaceVisibility            // "visible" | "hidden"
├── capabilities: Capability[]                 // 掛載的功能模組
├── grants: WorkspaceGrant[]                   // 存取授權
├── teamIds: string[]
├── address?: Address
├── locations?: WorkspaceLocation[]
└── personnel?: WorkspacePersonnel

實體: WorkspaceMember
├── userId: string
└── role: string

實體: WikiContentTree             // 頁面樹視圖
└── workspaceId: string
└── nodes: ContentTreeNode[]

值物件: Capability
├── id: string
├── name: string
├── type: "ui" | "api" | "data" | "governance" | "monitoring"
├── status: "stable" | "beta"
└── config?: object

值物件: WorkspaceGrant
├── userId?: string
├── teamId?: string
└── role: string
```

**代碼位置：** `modules/workspace/domain/entities/Workspace.ts`

---

### `notification` 模組

```
聚合根: NotificationEntity
├── id: string
├── recipientId: string
├── title: string
├── message: string
├── type: NotificationType            // "info" | "alert" | "success" | "warning"
└── read: boolean
```

**代碼位置：** `modules/notification/domain/entities/Notification.ts`

---

### `shared` 模組（共享核心）

```
實體: EventRecord                    // Event Store 持久化記錄
├── id: string
├── eventName: string
├── aggregateType: string
├── aggregateId: string
├── occurredAt: Date
├── payload: EventRecordPayload
├── metadata: EventMetadata
└── dispatchedAt: Date | null

值物件: EventMetadata
├── correlationId?: string
├── causationId?: string
├── actorId?: string
├── organizationId?: string
├── workspaceId?: string
└── traceId?: string
```

**代碼位置：** `modules/shared/domain/event-record.ts`

---

## Content / UI Layer

### `content` 模組

```
聚合根: ContentPage
├── id: string
├── accountId: string
├── workspaceId?: string
├── title: string
├── slug: string
├── parentPageId: string | null
├── blockIds: string[]
├── status: ContentPageStatus         // "active" | "archived"
└── createdAtISO: string

實體: ContentBlock
├── id: string
├── pageId: string
├── accountId: string
├── type: BlockType
├── content: BlockContent
└── order: number

實體: ContentVersion
├── id: string
├── pageId: string
├── accountId: string
├── snapshotBlocks: ContentBlock[]
├── editSummary?: string
├── label?: string
└── createdByUserId: string

值物件: BlockType
  → "text" | "heading-1" | "heading-2" | "heading-3"
  | "image" | "code" | "bullet-list" | "numbered-list"
  | "divider" | "quote"

值物件: BlockContent
  → 依 BlockType 多型，包含 type + text + properties?

值物件: ContentPageStatus  → "active" | "archived"
```

> **設計決策：** `ContentBlock` 為獨立 Firestore 文件（非嵌套），支援局部更新與細粒度 Embedding。

**代碼位置：** `modules/content/domain/entities/`

---

### `asset` 模組

```
聚合根: File
├── id: string
├── name: string
├── url: string
├── mimeType: string
└── size: number

實體: FileVersion
├── fileId: string
├── version: number
└── uploadedAt: string

聚合根: WikiLibrary
├── id: string
├── name: string
├── workspaceId: string
└── documents: DocumentRef[]

值物件: AuditRecord
├── actorId: string
├── action: string
└── timestamp: string

值物件: RetentionPolicy
└── retentionDays: number

值物件: PermissionSnapshot
└── canRead / canWrite / canDelete: boolean
```

**代碼位置：** `modules/asset/domain/entities/`

---

## Knowledge Graph Layer

### `knowledge-graph` 模組

```
實體: GraphNode
├── id: string                        // 通常等於 PageId
├── label: string
└── type: GraphNodeType               // "page" | "tag" | "attachment"

實體: Link（有向邊）
├── id: string
├── sourceId: string
├── targetId: string
└── type: LinkType                    // "explicit" | "implicit" | "hierarchy"

值物件: ViewConfig
├── layout: string
└── filter: FilterConfig
```

**代碼位置：** `modules/knowledge-graph/domain/entities/`

---

## AI Layer

### `knowledge` 模組

```
聚合根: IngestionJob
├── id: string
├── docId: string
├── status: string
└── stages: IngestionStage[]

實體: IngestionDocument
├── id: string
├── sourceUrl: string
└── format: string

實體: IngestionChunk
├── chunkIndex: number
├── text: string
└── embedding: number[]
```

**代碼位置：** `modules/knowledge/domain/entities/`

---

### `retrieval` 模組

```
實體: RagRetrievedChunk
├── chunkId: string
├── docId: string
├── text: string
├── score: number
├── taxonomy?: string
└── page?: number

實體: RagCitation
├── docId: string
├── chunkIndex: number
├── page?: number
└── reason: string

實體: RagRetrievalSummary
├── mode: string
├── scope: "workspace" | "organization"
├── retrievedChunkCount: number
└── topK: number

實體: RagStreamEvent
├── type: "token" | "citation" | "done" | "error"
├── traceId: string
└── payload: unknown
```

**代碼位置：** `modules/retrieval/domain/entities/`

---

### `agent` 模組

```
實體: AgentGeneration
├── input: string
├── output: string
├── model: string
└── traceId: string

實體: Thread
├── id: string
└── messages: Message[]

實體: Message
├── role: "user" | "assistant"
└── content: string
```

**代碼位置：** `modules/agent/domain/entities/`

---

## WorkSpace Flow Layer

### `workspace-flow` 模組

```
聚合根: Task
├── id: string
├── workspaceId: string
├── title: string
├── description: string
├── status: TaskStatus
│   → draft → in_progress → qa → acceptance → accepted → archived
├── assigneeId?: string
├── dueDateISO?: string
├── acceptedAtISO?: string
└── sourceReference?: SourceReference  // 由 content.page_approved 派生時必填

聚合根: Issue
├── id: string
├── workspaceId: string
├── taskId: string
├── title: string
├── status: IssueStatus
│   → open → in_progress → fixed → retest → resolved → closed
└── stage: IssueStage

聚合根: Invoice
├── id: string
├── workspaceId: string
├── status: InvoiceStatus
│   → draft → submitted → reviewed → approved → paid → closed
├── items: InvoiceItem[]
└── sourceReference?: SourceReference  // 由 content.page_approved 派生時必填

實體: InvoiceItem
├── id: string
├── invoiceId: string
├── taskId: string
├── amount: number
└── description: string

值物件: SourceReference
├── type: "ContentPage"
├── id: string                // ContentPage.id（溯源）
├── causationId: string       // 事件的 causationId
└── correlationId: string     // 整個業務流程的追蹤 ID
```

**代碼位置：** `modules/workspace-flow/domain/entities/`

---

### `content` ↔ `workspace-flow` 跨模組引用型態說明

`workspace-flow` 的 Task / Invoice 聚合根在由事件派生時，攜帶一個**唯讀溯源參照**（`sourceReference`），不允許透過此欄位直接操作 `content` 層：

```typescript
// 值物件：SourceReference（位於 modules/workspace-flow/domain/value-objects/）
interface SourceReference {
  readonly type: "ContentPage";          // 目前僅支援 ContentPage 作為來源
  readonly id: string;                   // ContentPage.id
  readonly causationId: string;          // content.page_approved 事件的 causationId
  readonly correlationId: string;        // 整個業務流程的追蹤 ID
}

// 擴充後的 Task 聚合根（由 content.page_approved 派生時必填）
interface Task {
  // ... 現有欄位 ...
  readonly sourceReference?: SourceReference;  // 由事件派生時必填；手動建立時為 undefined
}

// 擴充後的 Invoice 聚合根（由 content.page_approved 派生時必填）
interface Invoice {
  // ... 現有欄位 ...
  readonly sourceReference?: SourceReference;  // 由事件派生時必填；手動建立時為 undefined
}
```

**ContentPage（content 層）與 WorkspaceFlow 實體（workspace-flow 層）的引用關係：**

```
ContentPage (content)
  │
  │  觸發 content.page_approved（核准事件）
  ▼
contentToWorkflowMaterializer（Process Manager）
  │
  ├──► Task（workspace-flow）
  │      └── sourceReference.id = ContentPage.id  [唯讀參照]
  │
  └──► Invoice（workspace-flow）
         └── sourceReference.id = ContentPage.id  [唯讀參照]

content Database Block（計畫中）
  │
  └──► 透過 Read Model 嵌入 Task 狀態         [唯讀視圖，禁止反向寫入]
```

**禁止的引用模式：**
- ❌ `workspace-flow` 直接 import `content/domain/`（違反 API 邊界規則）
- ❌ `content` 直接寫入 `workspace-flow` Firestore 集合（違反狀態機保護）
- ❌ Task/Invoice 的狀態轉換由 `content` 直接觸發（須透過 `workspace-flow/api` Server Action）

---

### `workspace-scheduling` 模組

```
聚合根: WorkDemand
├── id: string
├── workspaceId: string
├── title: string
├── status: DemandStatus              // "draft" | "open" | "in_progress" | "completed"
├── priority: DemandPriority          // "low" | "medium" | "high"
├── dueDate?: string
└── assigneeId?: string
```

---

### `workspace-feed` 模組

```
聚合根: WorkspaceFeedPost
├── id: string
├── workspaceId: string
├── accountId: string
├── authorId: string
├── content: string
└── reactions: Reaction[]
```

---

### `workspace-audit` 模組

```
實體: AuditLog（不可變記錄）
├── id: string
├── actorId: string
├── workspaceId: string
├── action: string
└── timestamp: string
```

---

## 狀態機摘要

| 聚合 | 狀態機流程 |
|------|------------|
| `Task` | `draft → in_progress → qa → acceptance → accepted → archived` |
| `Issue` | `open → in_progress → fixed → retest → resolved / closed` |
| `Invoice` | `draft → submitted → reviewed → approved / rejected → paid → closed` |
| `WorkDemand` | `draft → open → in_progress → completed` |
| `WorkspaceEntity` | `preparatory → active → stopped` |
| `IngestionJob` | `uploaded → processing → ready / failed → archived` |
| `ContentPage` | `active → archived` |
