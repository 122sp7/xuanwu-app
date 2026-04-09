# notion/subdomains/integration

## 子域職責

`integration` 子域負責知識與外部系統的雙向整合：

- 外部系統（Confluence、Notion、Google Drive 等）的知識匯入
- 知識內容向外部系統的同步匯出
- `IntegrationSource`（整合來源）的連接管理與同步策略

## 核心語言

| 術語 | 說明 |
|---|---|
| `IntegrationSource` | 一個外部系統整合連線設定 |
| `SyncPolicy` | 同步方向（單向/雙向）與衝突解決策略 |
| `ImportedPage` | 從外部系統匯入的頁面 |
| `SyncLog` | 一次同步執行的狀態記錄 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`ConnectIntegrationSource`、`TriggerSync`、`ImportFromExternal`）
- `domain/`: `IntegrationSource`、`SyncPolicy`
- `infrastructure/`: 外部系統 API 適配器（Confluence、Drive 等）
- `interfaces/`: server action 接線

## 整合規則

- `integration` 的匯入動作最終創建 `knowledge` 子域的 `KnowledgePage`
- `SyncPolicy` 的衝突解決策略不可在 `domain/` 層依賴外部 SDK
- 父模組 public API（`@/modules/notion/api`）是跨模組進入點
