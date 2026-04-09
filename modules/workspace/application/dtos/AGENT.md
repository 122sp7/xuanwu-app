# application/dtos — Application DTOs（應用層資料傳輸物件）

此目錄放 **use case 邊界的 input / output 型別**，與 domain model 解耦。

> DTO 是使用案例的「語言」，不是 domain model 的語言。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Use case input DTO | `CreateWorkspaceDto`、`UpdateWorkspaceSettingsDto` |
| Use case output DTO | `WorkspaceSummaryDto`、`WorkspaceDetailDto` |
| Query filter DTO | `WorkspaceQueryDto`、`PaginationDto` |
| 邊界驗證 schema | `CreateWorkspaceDtoSchema` |
| 跨 use case 共用資料形狀 | 查詢條件、排序、分頁等純資料結構 |

**判斷準則**：資料從 interface layer 進入，或從 use case 回到 interface layer，若只是資料形狀而非業務規則，就放這裡。

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| Aggregate Root / Entity / Value Object 主體 | 應放在 `domain/` |
| Repository / Event Publisher 介面 | 應放在 `ports/output/` |
| Firebase、HTTP、React 等框架 import | DTO 是純資料結構 |
| 純業務規則邏輯 | 規則放 `domain/services/` |
| 直接對應 Firestore document 的 persistence shape | 那是 `infrastructure/firebase/` 的責任 |

---

## 命名慣例

```
create-<entity>.dto.ts    → 建立用 input DTO
update-<entity>.dto.ts    → 更新用 input DTO
<entity>-query.dto.ts     → 查詢條件 DTO
<entity>-summary.dto.ts   → 唯讀輸出 DTO
pagination.dto.ts         → 共用分頁 DTO
```

## 依賴箭頭

```txt
interfaces/api|cli|web
	-> application/dtos
application/use-cases
	-> application/dtos
application/dtos
	-> domain/value-objects (type only, optional)
```

`application/dtos` **不可**依賴 `infrastructure/`、`interfaces/`、`ports/output/`。

---

## Phase 3 預計移入

workspace-flow 合併後，以下 DTO 可收斂進此目錄：
`create-task.dto.ts`、`update-task.dto.ts`、`open-issue.dto.ts`、
`resolve-issue.dto.ts`、`add-invoice-item.dto.ts`、`update-invoice-item.dto.ts`、
`remove-invoice-item.dto.ts`、`task-query.dto.ts`、`issue-query.dto.ts`、
`invoice-query.dto.ts`、`pagination.dto.ts`
