# 領域模型（Domain Model）

<!-- change: Add sourceReference / readonly view reference between KnowledgePage and workspace-flow entities; PR-NUM -->

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

## Core Knowledge Domains

### `knowledge` 模組

```
聚合根: KnowledgePage（由 knowledge-page entity 表示）
├── id: string
├── workspaceId?: string
├── title: string
├── slug: string
├── parentPageId: string | null
├── blockIds: string[]
├── status: KnowledgePageStatus       // "active" | "archived"
└── approvalState?: string

實體: ContentBlock
├── id: string
├── pageId: string
├── type: BlockType
├── content: BlockContent
└── order: number

實體: ContentVersion
├── id: string
├── pageId: string
├── snapshotBlocks: ContentBlock[]
├── label?: string
└── createdByUserId: string

聚合根: KnowledgeCollection
├── id: string
├── workspaceId: string
├── title: string
├── pageIds: string[]
└── columns: CollectionColumn[]
```

> **設計決策：** `ContentBlock` 為獨立文件，讓知識頁面可以局部更新並支援後續 ingestion / retrieval。

**代碼位置：** `modules/knowledge/domain/entities/`

---

### `knowledge-base` 模組

```
聚合根: Article
├── id: string
├── title: string
├── slug: string
├── categoryId?: string
├── verificationState: string
└── publishedAtISO?: string

聚合根: Category
├── id: string
├── name: string
├── parentCategoryId?: string
└── order: number
```

**代碼位置：** `modules/knowledge-base/domain/`

---

### `knowledge-collaboration` 模組

```
聚合根: Comment
├── id: string
├── contentId: string
├── authorId: string
└── body: string

值物件: PermissionSnapshot
├── contentId: string
├── actorId: string
└── capability: string[]

實體: VersionSnapshot
├── id: string
├── contentId: string
└── createdAtISO: string
```

**代碼位置：** `modules/knowledge-collaboration/domain/`

---

### `knowledge-database` 模組

```
聚合根: Database
├── id: string
├── workspaceId: string
├── title: string
└── fields: DatabaseField[]

實體: DatabaseRecord
├── id: string
├── databaseId: string
└── values: Record<string, unknown>

實體: DatabaseView
├── id: string
├── databaseId: string
└── type: "table" | "kanban" | "calendar" | string
```

**代碼位置：** `modules/knowledge-database/domain/`

---

## Source, Retrieval, Notebook Domains

### `source` 模組

```
聚合根: File
├── id: string
├── workspaceId: string
├── name: string
├── url: string
├── mimeType: string
└── size: number

實體: FileVersion
├── fileId: string
├── version: number
└── uploadedAt: string

聚合根: SourceCollection / WikiLibrary（歷史命名）
├── id: string
├── name: string
├── workspaceId: string
└── documents: DocumentRef[]
```

**代碼位置：** `modules/source/domain/entities/`

---

### `ai` 模組

```
聚合根: IngestionJob
├── id: string
├── documentId: string
├── status: string
└── stages: IngestionStage[]

實體: IngestionDocument
├── id: string
├── sourceUrl: string
└── format: string

實體: IngestionChunk
├── chunkIndex: number
├── text: string
└── embedding?: number[]
```

**代碼位置：** `modules/ai/domain/`

---

### `search` 模組

```
實體: RagRetrievedChunk
├── chunkId: string
├── docId: string
├── text: string
├── score: number
└── taxonomy?: string

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

值物件: WikiCitation（歷史命名）
└── 知識頁面或文章的引用表達
```

**代碼位置：** `modules/search/domain/entities/`

---

### `notebook` 模組

```
實體: Thread
├── id: string
└── messages: Message[]

實體: Message
├── role: "user" | "assistant"
└── content: string

實體: AgentGeneration / NotebookGeneration
├── input: string
├── output: string
├── model: string
└── traceId: string
```

**代碼位置：** `modules/notebook/domain/entities/`

---

## Execution & Collaboration Domains

### `workspace-flow` 模組

```
聚合根: Task
├── id: string
├── workspaceId: string
├── title: string
├── status: TaskStatus
│   → draft → in_progress → qa → acceptance → accepted → archived
├── assigneeId?: string
└── sourceReference?: SourceReference

聚合根: Issue
├── id: string
├── workspaceId: string
├── taskId: string
└── status: IssueStatus
    → open → in_progress → fixed → retest → resolved → closed

聚合根: Invoice
├── id: string
├── workspaceId: string
├── status: InvoiceStatus
│   → draft → submitted → reviewed → approved → paid → closed
├── items: InvoiceItem[]
└── sourceReference?: SourceReference

值物件: SourceReference
├── type: "KnowledgePage"
├── id: string
├── causationId: string
└── correlationId: string
```

**代碼位置：** `modules/workspace-flow/domain/entities/`

### `knowledge` ↔ `workspace-flow` 跨模組引用型態說明

`workspace-flow` 的 Task / Invoice 在由 `knowledge.page_approved` 派生時，攜帶一個**唯讀溯源參照**（`sourceReference`），不允許透過此欄位直接操作 `knowledge` 層：

```typescript
interface SourceReference {
  readonly type: "KnowledgePage";
  readonly id: string;
  readonly causationId: string;
  readonly correlationId: string;
}
```

**禁止的引用模式：**
- ❌ `workspace-flow` 直接 import `knowledge/domain/`
- ❌ `knowledge` 直接寫入 `workspace-flow` 的持久化集合
- ❌ Task / Invoice 狀態轉換由 `knowledge` 直接觸發，必須透過 `workspace-flow/api` 或事件流程

---

### `workspace-scheduling` 模組

```
聚合根: WorkDemand
├── id: string
├── workspaceId: string
├── title: string
├── status: DemandStatus              // "draft" | "open" | "in_progress" | "completed"
├── priority: DemandPriority          // "low" | "medium" | "high"
└── assigneeId?: string
```

---

### `workspace-feed` 模組

```
聚合根: WorkspaceFeedPost
├── id: string
├── workspaceId: string
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
| `KnowledgePage` | `active → archived` |
| `Article` | `draft → review → verified / published / archived` |
| `IngestionJob` | `uploaded → processing → ready / failed → archived` |
| `Task` | `draft → in_progress → qa → acceptance → accepted → archived` |
| `Issue` | `open → in_progress → fixed → retest → resolved / closed` |
| `Invoice` | `draft → submitted → reviewed → approved / rejected → paid → closed` |
| `WorkDemand` | `draft → open → in_progress → completed` |
| `WorkspaceEntity` | `preparatory → active → stopped` |
