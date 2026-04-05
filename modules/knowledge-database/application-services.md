# Application Services — knowledge-database

---

## Database Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `CreateDatabaseUseCase` | name, workspaceId, accountId, fields? | `CommandResult<DatabaseId>` | 建立新 Database（含預設 Title 欄位） |
| `RenameDatabaseUseCase` | databaseId, name | `CommandResult` | 重新命名 |
| `AddFieldUseCase` | databaseId, fieldConfig | `CommandResult<FieldId>` | 新增欄位到 Schema |
| `UpdateFieldUseCase` | databaseId, fieldId, fieldConfig | `CommandResult` | 更新欄位設定 |
| `DeleteFieldUseCase` | databaseId, fieldId | `CommandResult` | 刪除欄位（同步清除 Record 值） |
| `ReorderFieldsUseCase` | databaseId, fieldIds | `CommandResult` | 重新排列欄位順序 |

## View Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `CreateViewUseCase` | databaseId, name, type | `CommandResult<ViewId>` | 新增視圖 |
| `UpdateViewFiltersUseCase` | viewId, filters | `CommandResult` | 更新過濾條件 |
| `UpdateViewSortsUseCase` | viewId, sorts | `CommandResult` | 更新排序規則 |
| `UpdateViewGroupByUseCase` | viewId, groupBy | `CommandResult` | 更新分組設定 |
| `HideFieldsInViewUseCase` | viewId, fieldIds | `CommandResult` | 隱藏特定欄位 |
| `DeleteViewUseCase` | viewId | `CommandResult` | 刪除視圖（至少保留 1 個視圖） |

## Record Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `AddRecordUseCase` | databaseId, properties | `CommandResult<RecordId>` | 新增資料行 |
| `UpdateRecordUseCase` | recordId, properties | `CommandResult` | 更新欄位值（partial update） |
| `DeleteRecordUseCase` | recordId | `CommandResult` | 軟刪除資料行 |
| `LinkRecordsUseCase` | recordId, fieldId, targetRecordId | `CommandResult` | 建立 Relation 連結 |
| `UnlinkRecordsUseCase` | recordId, fieldId, targetRecordId | `CommandResult` | 移除 Relation 連結 |
| `QueryRecordsUseCase` | databaseId, viewId | `CommandResult<Record[]>` | 依視圖 filter/sort/groupBy 查詢 |
