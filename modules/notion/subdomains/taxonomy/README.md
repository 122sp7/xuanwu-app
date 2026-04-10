# notion/subdomains/taxonomy

## 子域職責

`taxonomy` 子域負責分類法與語義組織的正典邊界：

- 定義與管理知識內容的分類體系（`Category`、`Tag`、`Taxonomy`）
- 維護分類節點之間的層級關係與語義連結
- 提供分類搜尋與過濾的查詢能力

## 核心語言

| 術語 | 說明 |
|---|---|
| `Taxonomy` | 一個完整的分類體系聚合根 |
| `Category` | 分類體系中的節點（可含子節點） |
| `Tag` | 輕量鬆散標籤，用於跨分類的橫向標記 |
| `TaxonomyAssignment` | 將分類或標籤套用到內容的關聯記錄 |
| `TaxonomyPath` | 從根節點到某分類的完整路徑 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`CreateCategory`、`AssignTaxonomy`、`QueryByTaxonomy`）
- `domain/`: `Taxonomy`、`Category`、`Tag`、`TaxonomyAssignment`
- `infrastructure/`: Firestore 分類資料存取
- `interfaces/`: server action 接線、分類管理 UI

## 整合規則

- `taxonomy` 為 `knowledge`、`authoring`、`publishing` 提供分類服務
- 分類變更觸發 `notion.taxonomy-updated` 事件，供下游訂閱刷新索引
- 父模組 public API（`@/modules/notion/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/notion/subdomains.md 建議建立
