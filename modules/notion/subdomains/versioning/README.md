# notion/subdomains/versioning

## 子域職責

`versioning` 子域負責 notion 全域版本快照策略的管理：

- `VersionPolicy`（版本保留規則：保留數量、時間週期）的定義
- 跨子域（`knowledge`、`collaboration`）版本快照的策略協調
- `RetentionRule` 的執行（定期清理舊版本）

## 核心語言

| 術語 | 說明 |
|---|---|
| `VersionPolicy` | 版本保留策略規則（數量上限、時間週期） |
| `RetentionRule` | 版本清理的具體規則 |
| `VersionPolicyTarget` | 版本策略適用的目標（Page、Article、Database） |
| `VersionPolicyApplication` | 一次版本策略套用執行記錄 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`DefineVersionPolicy`、`ApplyRetentionRule`、`QueryVersionHistory`）
- `domain/`: `VersionPolicy`、`RetentionRule`
- `infrastructure/`: Firestore repository 實作 + 排程任務整合
- `interfaces/`: server action 接線

## 整合規則

- `versioning` 不擁有具體的 ContentVersion（由 `knowledge`、`collaboration` 擁有）
- `versioning` 提供全域策略，由各子域的版本實作遵循
- `RetentionRule` 執行由 `platform/background-job` 排程觸發
- 父模組 public API（`@/modules/notion/api`）是跨模組進入點
