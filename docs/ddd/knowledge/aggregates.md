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
| `workspaceId` | `string \| null` | 所屬工作區（可選） |
| `status` | `PageStatus` | `draft \| published \| archived` |

### 不變數

- `slug` 在同一 accountId 下必須唯一
- archived 頁面不可新增 ContentBlock

---

## 實體：ContentBlock

### 職責
頁面內的原子內容單元，有序排列形成頁面內容。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 區塊主鍵 |
| `pageId` | `string` | 所屬頁面 ID |
| `blockType` | `BlockType` | 區塊類型 |
| `content` | `BlockContent` | 型別化內容 |
| `order` | `number` | 排列順序 |

---

## 實體：ContentVersion

### 職責
頁面的歷史版本快照，append-only。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 版本主鍵 |
| `pageId` | `string` | 所屬頁面 |
| `snapshotBlocks` | `ContentBlock[]` | 版本時間點的完整區塊快照 |
| `editSummary` | `string \| null` | 編輯摘要 |
| `authorId` | `string` | 發布者帳戶 ID |
| `createdAt` | `string` | ISO 8601 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `KnowledgePageRepository` | `save()`, `findById()`, `findByWorkspaceId()` |
| `WikiPageRepository` | `findByWorkspaceId()`, `save()` |
