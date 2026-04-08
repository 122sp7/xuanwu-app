# Aggregates — knowledge

## 聚合根：KnowledgePage

### 職責
核心知識單元的聚合根。管理頁面標題、父子層級關係（parentPageId）、區塊引用列表（blockIds）及審批狀態。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 頁面主鍵 |
| `title` | `string` | 頁面標題 |
| `slug` | `string` | URL-safe 識別符 |
| `parentPageId` | `string \| null` | 父頁面 ID（樹狀層級） |
| `blockIds` | `string[]` | 關聯的 ContentBlock ID 列表 |
| `accountId` | `string` | 所屬帳戶 |
| `workspaceId` | `string?` | 所屬工作區；workspace-first 頁面必須帶值，僅顯式 summary / legacy migration 情境可為空 |
| `status` | `KnowledgePageStatus` | `active \| archived` |
| `approvalState` | `KnowledgePageApprovalState?` | `pending \| approved`（AI 生成草稿使用） |
| `approvedByUserId` | `string?` | 審批者 ID |
| `approvedAtISO` | `string?` | 審批時間 |
| `createdByUserId` | `string` | 建立者 ID |
| `createdAtISO` | `string` | ISO 8601 建立時間 |
| `updatedAtISO` | `string` | ISO 8601 更新時間 |

### Wiki/Knowledge Base 驗證屬性（spaceType="wiki" 可用）

| 屬性 | 型別 | 說明 |
|------|------|------|
| `verificationState` | `PageVerificationState?` | `verified \| needs_review`（undefined = 非 wiki 模式） |
| `ownerId` | `string?` | 頁面負責人（保持內容準確的使用者） |
| `verifiedByUserId` | `string?` | 最後驗證者 ID |
| `verifiedAtISO` | `string?` | 最後驗證時間 |
| `verificationExpiresAtISO` | `string?` | 驗證到期時間（到期後自動轉為 `needs_review`） |

### KnowledgePageStatus 與 UI 標籤對照

| `status` 屬性專 | 字狀詞 | UI 顯示標籤 | 說明 |
|--------------|------|----------------|------|
| `"active"` | 活蹍 | （正常顯示） | 預設狀態 |
| `"archived"` | 已歸檔 | 移至垃圾桶（已歸檔） | 由 `archiveKnowledgePage` 觸發，UI 標籤為「移至垃圾桶」 |
| `"active"` → 提升 | 提升為文章 | — | 由 `promoteKnowledgePage` 觸發（D3 Promote 協議）；頁面保持 `active`，`knowledge-base` 建立對應 Article |

> **警告：** 不得新增 `"trash"` 狀態。`archived` 即為對應 Notion "Move to Trash" 的 domain 實作。若需確認軟刪除，由 ADR 決裁再修改此文件。

### 不變數

- `slug` 在同一 accountId 下必須唯一
- 頁面樹與日常建立流程預設以 workspaceId 為邊界；account 層級只能做顯式 summary，不可作為隱含預設
- `createKnowledgePage` 的 write-side contract 必須帶 `workspaceId`；若需 account-level summary，應以獨立 summary flow 實作，而不是沿用一般建立流程
- archived 頁面不可新增 ContentBlock
- archived 頁面於 `PageTreeView` 不顯示（展示層過濾 `status === "active"`）
- **歸檔級聯（D2）**：歸檔父頁面時，所有子頁面同步歸檔（`childPageIds` 一併記入 `knowledge.page_archived`）；歸檔操作可恢復（`status` 回設為 `"active"`），子頁面同步恢復。

---

## 實體：ContentBlock（KnowledgeBlock）

### 職責
頁面內的原子內容單元，有序排列形成頁面內容。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 區塊主鍵 |
| `pageId` | `string` | 所屬頁面 ID |
| `accountId` | `string` | 所屬帳戶 |
| `content` | `BlockContent` | 型別化內容（含 `type: BlockType` 欄位） |
| `order` | `number` | 排列順序 |
| `createdAtISO` | `string` | ISO 8601 |
| `updatedAtISO` | `string` | ISO 8601 |

> `BlockContent.type` 為 `BlockType`（`text \| heading-1 \| heading-2 \| heading-3 \| image \| code \| bullet-list \| numbered-list \| divider \| quote`）。
> 代碼位置：`domain/value-objects/block-content.ts`

---

## 實體：ContentVersion（KnowledgeVersion）

### 職責
頁面的歷史版本快照，append-only。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 版本主鍵 |
| `pageId` | `string` | 所屬頁面 |
| `accountId` | `string` | 所屬帳戶 |
| `label` | `string` | 版本標籤（人類可讀描述） |
| `titleSnapshot` | `string` | 版本建立時的頁面標題快照 |
| `blocks` | `KnowledgeVersionBlock[]` | 版本時間點的區塊快照列表 |
| `createdByUserId` | `string` | 建立者帳戶 ID |
| `createdAtISO` | `string` | ISO 8601 |

---

## 聚合根：KnowledgeCollection（Database / Wiki Space）

### 職責
Notion-like 的集合空間，依 `spaceType` 分為兩種模式：
- **`spaceType="database"`**：Notion Database — 結構化資料容器（欄位 Schema + Records + Views）。**此模式由 `knowledge-database` BC 獨立擁有**（D1 決策）；`knowledge` 僅保留集合識別與 Wiki Space 能力。
- **`spaceType="wiki"`**：Notion Wiki / Knowledge Base — 帶頁面驗證與所有權的知識庫空間，由 `knowledge` BC 管理。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 集合主鍵 |
| `accountId` | `string` | 所屬帳戶 |
| `workspaceId` | `string?` | 所屬工作區；wiki 與日常集合操作預設為 workspace-first |
| `name` | `string` | 集合名稱 |
| `description` | `string?` | 說明文字 |
| `spaceType` | `CollectionSpaceType` | `"database" \| "wiki"` |
| `columns` | `CollectionColumn[]` | 欄位定義（database 模式使用） |
| `pageIds` | `string[]` | 關聯的 KnowledgePage ID 列表 |
| `status` | `CollectionStatus` | `active \| archived` |
| `createdByUserId` | `string` | 建立者 |
| `createdAtISO` | `string` | ISO 8601 |
| `updatedAtISO` | `string` | ISO 8601 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `KnowledgePageRepository` | `create()`, `rename()`, `move()`, `archive()`, `approve()`, `verify()`, `requestReview()`, `assignOwner()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` |
| `KnowledgeBlockRepository` | `add()`, `update()`, `delete()`, `findById()`, `listByPageId()` |
| `KnowledgeVersionRepository` | `create()`, `findById()`, `listByPageId()` |
| `KnowledgeCollectionRepository` | `create()`, `rename()`, `addPage()`, `removePage()`, `addColumn()`, `archive()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` |
