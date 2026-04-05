# Ubiquitous Language — knowledge-database

---

## 核心術語

| 術語 | 定義 | 禁止混用 |
|---|---|---|
| **Database**（資料庫） | 結構化資料容器，持有 Field Schema 與 View 清單 | Collection, Table, Spreadsheet |
| **Field**（欄位） | Database Schema 中的單一欄位定義（含類型與設定） | Column, Attribute, Property |
| **FieldType**（欄位類型） | `text`/`number`/`select`/`date`/`checkbox`/`url`/`email`/`relation`/`formula`/`rollup` | DataType |
| **Record**（資料行） | Database 中的單一資料條目，持有各欄位的值（properties） | Row, Entry, Item |
| **Property**（屬性值） | Record 中某 Field 的具體值（Map fieldId → value） | Cell, Value, Data |
| **View**（視圖） | Database 的展示配置：type + filters + sorts + groupBy | Tab, Screen, Layout |
| **ViewType**（視圖類型） | `table`/`board`/`list`/`calendar`/`timeline`/`gallery` | Format, Mode |
| **Filter**（過濾條件） | 視圖中的資料篩選規則（fieldId + operator + value） | Query, Where |
| **Sort**（排序規則） | 視圖中的排序設定（fieldId + direction） | Order, OrderBy |
| **GroupBy**（分組依據） | 視圖中的分組設定（通常用於 board 視圖的 select 欄位） | Cluster, Group |
| **Relation**（關聯） | Field 類型之一，連結另一個 Database 的 Record | ForeignKey, Link |
| **BoardGroupField**（看板分組欄位） | Board 視圖中作為列（Column）依據的 select 欄位 | KanbanField |

---

## 邊界詞彙對照

| 術語 | 此 BC 的含義 | 其他 BC 中的對應 |
|---|---|---|
| `Database` | 結構化資料容器 | 舊版 `KnowledgeCollection`（spaceType="database"）|
| `Record` | 資料行 | --- |
| `View` | 視圖配置 | --- |
| `properties` | Record 的欄位值 Map | `knowledge` Block 的 `content` 欄位 |

---

## 事件語言

| 事件 | 語意 |
|---|---|
| `knowledge-database.database_created` | 使用者建立新的 Database |
| `knowledge-database.field_added` | Database Schema 新增欄位 |
| `knowledge-database.record_added` | 新增一行資料 |
| `knowledge-database.record_updated` | 資料行的欄位值更新 |
| `knowledge-database.record_linked` | 資料行透過 Relation 欄位連結到另一 Record |
| `knowledge-database.view_created` | 新增一個 Database 視圖 |
| `knowledge-database.view_updated` | 視圖的 filter/sort/groupBy 設定變更 |
