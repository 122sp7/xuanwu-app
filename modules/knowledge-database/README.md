# knowledge-database — 結構化資料庫與視圖管理

> **Domain Type:** **Supporting Subdomain**（支撐域）
> **模組路徑:** `modules/knowledge-database/`
> **開發狀態:** 📅 Planned — 設計階段

## 在 Knowledge Platform 中的角色

`knowledge-database` 對應 Notion Database 概念，提供結構化資料儲存與多視圖展示能力。使用者可定義欄位 Schema，以 Table / Board / Calendar / Timeline / Gallery / List 等視圖檢視資料。

## 主要職責

| 能力 | 說明 |
|---|---|
| Database Schema 管理 | 定義欄位類型（text/number/select/date/relation 等） |
| Record 資料管理 | 建立、更新、刪除結構化資料行 |
| View 視圖配置 | 每個 Database 可有多個視圖，各有自己的 filter/sort/groupBy |
| Relation 欄位 | Record 間的跨 Database 關聯（Relation 欄位類型） |

## 核心聚合

- **`Database`**（資料庫容器 + 欄位 Schema）
- **`Record`**（資料行）
- **`View`**（視圖配置）

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [repositories.md](./repositories.md) | Repository 介面 |
| [application-services.md](./application-services.md) | Use Cases 清單 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係 |
