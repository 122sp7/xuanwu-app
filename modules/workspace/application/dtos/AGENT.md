# application/dtos — Application DTOs（應用層資料傳輸物件）

此目錄放 **use case 邊界的 input/output 型別**，與 domain model 解耦。

> DTO 是使用案例的「語言」，不是 domain model 的語言。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Use case input DTO | `CreateWorkspaceDto`、`UpdateWorkspaceSettingsDto` |
| Use case output projection | `WorkspaceSummaryDto`（唯讀快照） |
| Query filter DTO | `WorkspaceQueryDto`（分頁、篩選條件） |
| Zod schema（邊界驗證） | `CreateWorkspaceDtoSchema`（Server Action 或 API 邊界使用） |
| 跨 use case 共用的資料形狀 | `PaginationDto`、`TaskQueryDto`（Phase 3 移入） |

**判斷準則**：資料從 interface layer 進入 → use case 需要的 input shape，
或 use case 回傳給 interface layer 的 output shape → 放入此處。

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| Domain entity class 或 Aggregate Root | 放 `domain/aggregates/`、`domain/entities/` |
| Firebase、HTTP、React 等框架 import | DTO 是純資料結構 |
| 業務規則邏輯（Zod 以外的驗證） | 業務規則放 `domain/services/` |
| Repository interface | 放 `domain/repositories/` 或 `ports/output/` |
| 直接可序列化為 Firestore document 的 shape | 那是 infrastructure converter 的責任 |

---

## 命名慣例

```
create-<entity>.dto.ts    → 新建用 input DTO
update-<entity>.dto.ts    → 更新用 input DTO
<entity>-query.dto.ts     → 查詢篩選 DTO
<entity>-summary.dto.ts   → 唯讀輸出 projection DTO
pagination.dto.ts         → 共用分頁 DTO
```

## 依賴方向

```
application/dtos → domain/（只取 enum 或 value object 型別作為欄位型別）
application/use-cases → application/dtos（use case 使用 DTO 作為參數或回傳）
interfaces/ → application/dtos（表單、Server Action 使用 DTO 作為輸入）
```

`application/dtos` **不可**依賴 `infrastructure/`、`interfaces/`。

---

## Phase 3 預計移入

workspace-flow 合併後，以下 DTO 將搬入此目錄：
`create-task.dto.ts`、`update-task.dto.ts`、`open-issue.dto.ts`、
`resolve-issue.dto.ts`、`add-invoice-item.dto.ts`、`update-invoice-item.dto.ts`、
`remove-invoice-item.dto.ts`、`task-query.dto.ts`、`issue-query.dto.ts`、
`invoice-query.dto.ts`、`pagination.dto.ts`
