# notion/subdomains/relations

## 子域職責

`relations` 子域負責內容之間關聯與 backlink 的正典邊界：

- 管理頁面與內容物件之間的語義關聯（`Relation`）
- 追蹤 backlink：哪些頁面引用了特定頁面（`BacklinkRecord`）
- 提供關聯圖譜查詢與雙向連結索引

## 核心語言

| 術語 | 說明 |
|---|---|
| `Relation` | 兩個內容物件之間的具名語義關聯 |
| `BacklinkRecord` | 記錄某頁面被其他頁面引用的反向連結 |
| `RelationType` | 關聯的語義類型（`references`、`extends`、`contradicts` 等） |
| `RelationGraph` | 以圖結構表示的內容關聯網絡 |
| `RelationIndex` | 針對查詢最佳化的關聯索引快照 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`CreateRelation`、`RemoveRelation`、`QueryBacklinks`、`GetRelationGraph`）
- `domain/`: `Relation`、`BacklinkRecord`、`RelationGraph`
- `infrastructure/`: Firestore 關聯資料存取、圖查詢適配器
- `interfaces/`: server action 接線、關聯面板 UI

## 整合規則

- `relations` 訂閱 `knowledge.page-linked` 等事件，自動維護 backlink 索引
- `publishing` 在計算發布範圍時消費 `RelationGraph`
- 父模組 public API（`@/modules/notion/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/notion/subdomains.md 建議建立
