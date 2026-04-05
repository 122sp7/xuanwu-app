# knowledge-collaboration — DDD Reference

> **Domain Type:** Supporting Subdomain
> **Module:** `modules/knowledge-database/`
> **詳細模組文件:** [`modules/knowledge-database/`](../../modules/knowledge-database/)

## 戰略定位

`knowledge-database` 對應 Notion Database 能力，提供結構化資料儲存與多視圖展示。使用者可定義欄位 Schema，以不同視圖（Table/Board/Calendar/Timeline/Gallery）探索相同資料。

## 核心聚合

- **Database** — 欄位 Schema 容器 + 視圖清單；invariant 邊界
- **Record** — 單行資料，properties Map（fieldId → value）
- **View** — 視圖配置：type + filters + sorts + groupBy

## 視圖類型

`table` | `board` | `list` | `calendar` | `timeline` | `gallery`

## 欄位類型

`text` | `number` | `select` | `multi_select` | `date` | `checkbox` | `url` | `email` | `relation` | `formula` | `rollup`

## 主要領域事件

- `knowledge-database.database_created`
- `knowledge-database.field_added` / `field_deleted`
- `knowledge-database.record_added` / `record_updated` / `record_deleted`
- `knowledge-database.record_linked`
- `knowledge-database.view_created` / `view_updated`

## 通用語言

| 術語 | 定義 |
|---|---|
| **Database** | 結構化資料容器（≠ KnowledgeCollection） |
| **Field** | Schema 欄位定義（≠ Column） |
| **Record** | 資料行（≠ Row, Item） |
| **Property** | Record 中某 Field 的具體值 |
| **View** | 視圖配置（不持有資料） |
| **Relation** | 跨 Database 的 Record 連結欄位類型 |

## 上下文關係

| 關係 | BC | 類型 |
|---|---|---|
| 上游 | `workspace`, `identity`, `organization` | Conformist |
| 上游 | `knowledge-collaboration` | Customer/Supplier（Permission） |
| 下游 | `workspace-feed`, `notification` | Published Language |
| 協作 | `knowledge`, `knowledge-base` | Open Host Service |
