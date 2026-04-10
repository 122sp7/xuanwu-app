# workspace/subdomains/lifecycle

## 子域職責

`lifecycle` 子域負責工作區容器生命週期的正典邊界（獨立於 `workflow`）：

- 管理工作區從建立、啟用、封存到刪除的完整狀態機
- 強制執行生命週期轉換規則（`LifecyclePolicy`）與不可逆操作保護
- 提供生命週期事件日誌，供 `audit` 與 `feed` 子域訂閱

## 核心語言

| 術語 | 說明 |
|---|---|
| `WorkspaceLifecycle` | 工作區生命週期聚合根 |
| `LifecycleStatus` | 工作區狀態（`initializing`、`active`、`archived`、`deleted`） |
| `LifecycleTransition` | 一次生命週期狀態轉換的記錄 |
| `LifecyclePolicy` | 定義允許的狀態轉換路徑與保護條件 |
| `WorkspaceId` | 工作區唯一識別碼（品牌型別） |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`InitializeWorkspace`、`ActivateWorkspace`、`ArchiveWorkspace`、`DeleteWorkspace`）
- `domain/`: `WorkspaceLifecycle`、`LifecycleTransition`、`LifecyclePolicy`
- `infrastructure/`: Firestore 生命週期狀態存取
- `interfaces/`: server action 接線

## 整合規則

- `lifecycle` 不混進 `workflow`：workflow 管理流程步驟，lifecycle 管理容器存在狀態
- 生命週期事件觸發 `workspace.lifecycle-changed`，供 `membership`、`audit`、`feed` 訂閱
- 父模組 public API（`@/modules/workspace/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/workspace/subdomains.md 建議建立
