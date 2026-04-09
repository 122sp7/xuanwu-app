# notion/subdomains/analytics

## 子域職責

`analytics` 子域負責知識使用行為的量測與分析：

- 頁面瀏覽事件（`PageViewEvent`）的記錄
- 知識指標（`KnowledgeMetric`）的聚合與查詢
- 熱門頁面、使用趨勢的統計報告

## 核心語言

| 術語 | 說明 |
|---|---|
| `PageViewEvent` | 記錄頁面被查看的行為事件 |
| `KnowledgeMetric` | 聚合後的知識使用量測指標 |
| `ViewCount` | 特定時間窗口內的瀏覽次數 |
| `PagePopularityRank` | 基於瀏覽量的頁面熱度排名 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`RecordPageView`、`QueryKnowledgeMetrics`、`GetPopularPages`）
- `domain/`: `PageViewEvent`、`KnowledgeMetric`
- `infrastructure/`: Firestore 事件儲存 + 聚合查詢
- `interfaces/`: server action 接線

## 整合規則

- `analytics` 訂閱 `knowledge.page_viewed` 等行為事件
- 查詢結果供 `notion` UI 的使用情況面板使用
- 父模組 public API（`@/modules/notion/api`）是跨模組進入點
