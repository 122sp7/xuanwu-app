# Aggregates — knowledge

## 聚合根：KnowledgePage（ContentPage）

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
| `workspaceId` | `string?` | 所屬工作區（可選） |
| `status` | `KnowledgePageStatus` | `active \| archived` |
| `approvalState` | `KnowledgePageApprovalState?` | `pending \| approved`（AI 生成草稿使用） |
| `createdByUserId` | `string` | 建立者 ID |
| `createdAtISO` | `string` | ISO 8601 建立時間 |
| `updatedAtISO` | `string` | ISO 8601 更新時間 |

### 不變數

- `slug` 在同一 accountId 下必須唯一
- archived 頁面不可新增 ContentBlock

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

---

## 聚合根：KnowledgeCollection（Database / 資料庫視圖）

### 職責

Notion Database 等效結構。以欄位 Schema（`columns`）定義一組 KnowledgePage 的結構化呈現方式（表格、看板等）。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Collection 主鍵 |
| `name` | `string` | Collection 名稱 |
| `description` | `string?` | 描述 |
| `accountId` | `string` | 所屬帳戶 |
| `workspaceId` | `string?` | 所屬工作區（可選） |
| `columns` | `CollectionColumn[]` | 欄位 Schema 陣列 |
| `pageIds` | `string[]` | 納入此 Collection 的 KnowledgePage ID 列表 |
| `status` | `CollectionStatus` | `active \| archived` |
| `createdByUserId` | `string` | 建立者 ID |
| `createdAtISO` | `string` | ISO 8601 建立時間 |
| `updatedAtISO` | `string` | ISO 8601 更新時間 |

### CollectionColumn Schema

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 欄位主鍵 |
| `name` | `string` | 欄位顯示名稱 |
| `type` | `CollectionColumnType` | `text \| number \| select \| multi-select \| date \| checkbox \| url \| relation` |
| `options` | `string[]?` | select / multi-select 的選項值 |

### Firestore 路徑

`accounts/{accountId}/knowledgeCollections/{collectionId}`

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `KnowledgePageRepository` | `create()`, `rename()`, `move()`, `archive()`, `approve()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` |
| `KnowledgeBlockRepository` | `add()`, `update()`, `delete()`, `findById()`, `listByPageId()` |
| `KnowledgeVersionRepository` | `create()`, `findById()`, `listByPageId()` |
| `KnowledgeCollectionRepository` | `create()`, `rename()`, `addPage()`, `removePage()`, `addColumn()`, `archive()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` |
