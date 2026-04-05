# Aggregates — knowledge

## 聚合根：Page（KnowledgePage）

### 職責
個人筆記頁面的聚合根。管理頁面標題、父子層級（parentPageId）、Block 引用列表（blockIds），以及目前暫留在本模組的 approval / verification / owner metadata。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 頁面主鍵 |
| `title` | `string` | 頁面標題 |
| `slug` | `string` | URL-safe 識別符 |
| `parentPageId` | `string \| null` | 父頁面 ID（樹狀層級） |
| `blockIds` | `string[]` | 關聯的 Block ID 列表（有序） |
| `accountId` | `string` | 所屬帳戶 |
| `workspaceId` | `string?` | 所屬工作區（可選） |
| `order` | `number` | 同層級排序 |
| `status` | `PageStatus` | `active \| archived` |
| `approvalState` | `pending \| approved` | AI / ingestion page 的核准狀態（可選） |
| `approvedAtISO` | `string?` | 核准時間 |
| `approvedByUserId` | `string?` | 核准者 |
| `verificationState` | `verified \| needs_review` | wiki 型頁面驗證狀態（可選） |
| `ownerId` | `string?` | wiki 型頁面維護者 |
| `verifiedByUserId` | `string?` | 最後驗證者 |
| `verifiedAtISO` | `string?` | 最後驗證時間 |
| `verificationExpiresAtISO` | `string?` | 驗證到期時間 |
| `createdByUserId` | `string` | 建立者 ID |
| `createdAtISO` | `string` | ISO 8601 建立時間 |
| `updatedAtISO` | `string` | ISO 8601 更新時間 |

### 不變數

- `slug` 在同一 accountId 下必須唯一
- `archived` 頁面不應再進入正常編輯流程
- `pageId === targetParentPageId` 的 move 屬非法

---

## 實體：Block（ContentBlock）

### 職責
頁面內的原子內容單位，依序排列形成頁面內容。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Block 主鍵 |
| `pageId` | `string` | 所屬頁面 ID |
| `accountId` | `string` | 所屬帳戶 |
| `content` | `BlockContent` | 型別化內容（含 `type: BlockType`） |
| `order` | `number` | 排列順序 |
| `createdAtISO` | `string` | ISO 8601 |
| `updatedAtISO` | `string` | ISO 8601 |

### BlockType

`text | heading-1 | heading-2 | heading-3 | image | code | bullet-list | numbered-list | divider | quote`

代碼位置：`domain/value-objects/block-content.ts`

> `todo` 目前不在實作中的 `BlockType` union 內，若要加入需同步更新 value object、DTO schema 與 editor UI。

---

## 過渡聚合：KnowledgeCollection

目前 `knowledge` 仍保有 `KnowledgeCollection` 聚合，用於把 `Page` 聚成結構化空間。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Collection 主鍵 |
| `name` | `string` | 空間名稱 |
| `columns` | `CollectionColumn[]` | schema 欄位定義 |
| `pageIds` | `string[]` | 關聯的 Page IDs |
| `spaceType` | `database \| wiki` | 空間型態 |
| `status` | `active \| archived` | 狀態 |

這塊是目前最需要和 `knowledge-database` 重新釐清的邊界。

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `KnowledgePageRepository` | `create()`, `rename()`, `move()`, `archive()`, `reorderBlocks()`, `approve()`, `verify()`, `requestReview()`, `assignOwner()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` |
| `KnowledgeBlockRepository` | `add()`, `update()`, `delete()`, `findById()`, `listByPageId()` |
| `KnowledgeCollectionRepository` | `create()`, `rename()`, `addPage()`, `removePage()`, `addColumn()`, `archive()` |
