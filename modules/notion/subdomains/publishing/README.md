# notion/subdomains/publishing

## 子域職責

`publishing` 子域負責正式發布與對外交付的正典邊界：

- 管理內容從草稿到已發布狀態的完整發布生命週期
- 控制對外可見性（`PublishingPolicy`）、存取層級與發布排程
- 提供發布歷程的可稽核記錄（`PublishRecord`）

## 核心語言

| 術語 | 說明 |
|---|---|
| `PublishRequest` | 一次發布請求的聚合根 |
| `PublishRecord` | 已完成的發布操作的不可變記錄 |
| `PublishingPolicy` | 定義可見性規則、存取層級與發布條件 |
| `PublishedContent` | 對外交付的內容快照（含版本戳記） |
| `PublishStatus` | 發布狀態（`draft`、`scheduled`、`published`、`unpublished`） |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`PublishContent`、`UnpublishContent`、`SchedulePublish`、`QueryPublishHistory`）
- `domain/`: `PublishRequest`、`PublishRecord`、`PublishingPolicy`、`PublishedContent`
- `infrastructure/`: Firestore 發布記錄存取
- `interfaces/`: server action 接線、發布管理 UI

## 整合規則

- `publishing` 消費 `taxonomy` 分類與 `relations` 關聯圖，決定發布範圍
- 發布完成後觸發 `notion.content-published` 事件，供 `analytics` 與 `integration` 訂閱
- 父模組 public API（`@/modules/notion/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/notion/subdomains.md 建議建立
