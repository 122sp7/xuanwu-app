# knowledge-database BC Agent

## 模組職責

此 BC 提供結構化資料庫能力：Database（欄位 Schema + 視圖容器）、Record（資料行）、View（視圖配置）。

對應概念：Notion Database、Airtable、Coda 的 Table 能力。

## 核心聚合

| 聚合 | 職責 |
|---|---|
| `Database` | 持有欄位 Schema 與視圖清單；整個 Database 的 invariant 邊界 |
| `Record` | 單行資料，持有各欄位的值（properties Map） |
| `View` | 視圖配置：type / filters / sorts / groupBy / visibleFields |

## 欄位類型（Field Types）

`text`, `number`, `select`, `multi_select`, `date`, `checkbox`, `url`, `email`, `relation`, `formula`, `rollup`

## 視圖類型（View Types）

`table`, `board`, `list`, `calendar`, `timeline`, `gallery`

## 邊界規則

- 此 BC **不得**直接 import `knowledge` / `knowledge-base` 的 domain 層。
- `Record` 的 `relation` 欄位儲存對方 Record 的 opaque ID（跨 Database）。
- View 的 filter/sort 操作在 application 層組裝查詢，不在 domain 層。

## 開發狀態

📅 Planned — 設計階段。代碼實作待後續 PR。
