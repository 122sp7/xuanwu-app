# notebooklm/subdomains/versioning

## 子域職責

`versioning` 子域負責 AI 對話與 Notebook 的版本快照策略：

- `ConversationSnapshot` 的建立與保留策略管理
- `VersionPolicy` 的定義（保留多少版本、保留週期）
- 版本回溯與快照比較

## 核心語言

| 術語 | 說明 |
|---|---|
| `ConversationSnapshot` | 對話在某一時間點的完整快照 |
| `VersionPolicy` | 版本保留規則（數量上限、時間週期） |
| `SnapshotRef` | 指向特定快照的穩定引用 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`CreateSnapshot`、`ApplyVersionPolicy`、`RestoreFromSnapshot`）
- `domain/`: `ConversationSnapshot`、`VersionPolicy`
- `infrastructure/`: Firestore repository 實作
- `interfaces/`: server action 接線

## 整合規則

- `versioning` 由 `conversation` 子域觸發（每次 Thread 歸檔時）
- `VersionPolicy` 預設值由 `platform/subscription` 子域決定
- 父模組 public API（`@/modules/notebooklm/api`）是跨模組進入點
