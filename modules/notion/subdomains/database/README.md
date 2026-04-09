# notion/subdomains/database

> **來源模組：** `modules/knowledge-database/`
> **狀態：** 🗂️ Migration-Pending — 計畫從獨立模組遷移至此子域

## 子域職責

`database` 子域提供 Notion Database 的完整能力（D1 決策）：

- `Database`（欄位 Schema 容器 + 視圖清單）：不變數邊界
- `Record`（單行資料）：`properties` 為 `Map<fieldId, value>`
- `View`（視圖配置）：`type + filters + sorts + groupBy`，不持有資料

## D1 決策（完整擁有 spaceType="database"）

`database` 子域是 `spaceType="database"` 的**唯一擁有者**：

- `knowledge` 子域的 `KnowledgeCollection` 在 `spaceType="database"` 時，只保留 opaque ID
- 結構化欄位 Schema、Record 資料與 View 配置的完整生命週期，由此子域管理
- 外部子域（如 `authoring`）呼叫此子域的 Open Host Service API 建立 Article-Record 連結

## ViewType

`table` | `board` | `list` | `calendar` | `timeline` | `gallery`

## FieldType

`text` | `number` | `select` | `multi_select` | `date` | `checkbox` | `url` | `email` | `relation` | `formula` | `rollup`

## 發出事件

- `knowledge-database.database_created` / `database_renamed`
- `knowledge-database.field_added` / `field_deleted`
- `knowledge-database.record_added` / `record_updated` / `record_deleted`
- `knowledge-database.record_linked`（跨 Database Relation）
- `knowledge-database.view_created` / `view_updated`

## Open Host Service 提供

- `GetDatabaseById` — 供 `knowledge` 子域取得 Database 結構化資訊
- `LinkArticleToRecord` — 供 `authoring` 子域建立 Article-Record 連結

## 現有實作位置

`modules/knowledge-database/` — 目前作為獨立 bounded context 運作。合并前，此子域的語言與 port 契約以 `modules/notion/docs/` 為規範形式。

## 詳細文件

| 文件 | 說明 |
|------|------|
| [../../../docs/aggregates.md](../../docs/aggregates.md) | 聚合根設計（database 子域節） |
| [../../../docs/domain-events.md](../../docs/domain-events.md) | 事件清單（database 子域節） |
| [../../../docs/ubiquitous-language.md](../../docs/ubiquitous-language.md) | 術語定義（database 子域節） |
| [../../../docs/repositories.md](../../docs/repositories.md) | Repository interfaces（database 子域節） |
| [原始模組](../../../../knowledge-database/README.md) | `modules/knowledge-database/README.md`（前身實作） |
