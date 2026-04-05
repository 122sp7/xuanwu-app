# Aggregates — knowledge

## 聚合根：Page（KnowledgePage）

### 職責
個人筆記頁面的聚合根。管理頁面標題、父子層級（parentPageId）、Block 引用列表（blockIds）。

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
| `status` | `PageStatus` | `active \| archived` |
| `createdByUserId` | `string` | 建立者 ID |
| `createdAtISO` | `string` | ISO 8601 建立時間 |
| `updatedAtISO` | `string` | ISO 8601 更新時間 |

### 不變數

- `slug` 在同一 accountId 下必須唯一
- archived 頁面不可新增 Block

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

`text | heading-1 | heading-2 | heading-3 | image | code | bullet-list | numbered-list | divider | quote | todo`

代碼位置：`domain/value-objects/block-content.ts`

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `PageRepository` | `create()`, `rename()`, `move()`, `archive()`, `reorderBlocks()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` |
| `BlockRepository` | `add()`, `update()`, `delete()`, `reorder()`, `findById()`, `listByPageId()` |
