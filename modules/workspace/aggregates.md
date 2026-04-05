# Aggregates — workspace

## 聚合根：Workspace

### 職責
代表一個協作容器。管理工作區的生命週期（active → archived）與成員關係。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 工作區主鍵 |
| `name` | `string` | 工作區名稱 |
| `accountId` | `string` | 擁有者帳戶或組織 ID |
| `status` | `WorkspaceStatus` | `active \| archived` |
| `members` | `WorkspaceMember[]` | 成員列表 |

### 不變數

- archived 狀態的工作區不可新增成員
- workspaceId 建立後不可變更

---

## 聚合根：WikiContentTree

### 職責
維護工作區內 Wiki 頁面的樹狀層級結構，提供父子頁面關係的查詢能力。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `workspaceId` | `string` | 所屬工作區 |
| `nodes` | `WikiTreeNode[]` | 樹狀節點列表 |

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `WorkspaceMember` | 成員在工作區中的角色與狀態 |
| `WorkspaceStatus` | `"active" \| "archived"` |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `WorkspaceRepository` | `save()`, `findById()`, `findByAccountId()` |
| `WorkspaceQueryRepository` | `listByAccountId()`, `findById()` |
| `WikiWorkspaceRepository` | `getContentTree()`, `updateTree()` |
