# Aggregates — workspace-audit

## 聚合根：AuditLog（Append-Only）

### 職責
記錄工作區或組織範圍內重要操作的不可變稽核軌跡。一旦寫入，永不修改或刪除。

### Append-Only 約束

> **核心不變數：** AuditLog 只能被建立，不能被更新或刪除。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 記錄主鍵（UUID） |
| `workspaceId` | `string \| null` | 所屬工作區（可選，組織級記錄可能無 workspaceId） |
| `organizationId` | `string` | 所屬組織 |
| `actorId` | `string` | 操作者帳戶 ID |
| `auditEventType` | `string` | 操作類型（如 `workspace.member_joined`） |
| `targetId` | `string \| null` | 操作對象 ID（可選） |
| `targetType` | `string \| null` | 操作對象類型（可選） |
| `metadata` | `Record<string, unknown>` | 附加資訊 |
| `auditedAt` | `string` | ISO 8601 操作時間 |

### 不變數

- `id` 建立後不可變
- `auditedAt` 使用記錄建立時的系統時間，不可後期修改
- 所有欄位建立後均不可修改（immutable record）

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `AuditLogRepository` | `append()`, `listByWorkspace()`, `listByOrganization()` |

**注意：** `AuditLogRepository` 不提供 `update()` 或 `delete()` 方法，強制執行 Append-Only。
