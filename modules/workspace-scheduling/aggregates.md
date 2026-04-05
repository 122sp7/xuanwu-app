# Aggregates — workspace-scheduling

## 聚合根：WorkDemand

### 職責
代表一個工作需求記錄。管理需求的排程生命週期（draft → completed）。

### 生命週期狀態機
```
draft ──► open ──► in_progress ──► completed
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 需求主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `accountId` | `string` | 所屬帳戶 |
| `title` | `string` | 需求標題 |
| `description` | `string \| null` | 描述（可選） |
| `status` | `DemandStatus` | `draft \| open \| in_progress \| completed` |
| `priority` | `DemandPriority` | `low \| medium \| high` |
| `dueDate` | `string \| null` | 截止日期 ISO 8601 |
| `createdAt` | `string` | ISO 8601 |
| `updatedAt` | `string` | ISO 8601 |

### 不變數

- `title` 不可為空
- `completed` 狀態不可逆回 `draft`

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `DemandStatus` | `"draft" \| "open" \| "in_progress" \| "completed"` |
| `DemandPriority` | `"low" \| "medium" \| "high"` |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `DemandRepository` | `save()`, `findById()`, `listByWorkspace()`, `updateStatus()` |
