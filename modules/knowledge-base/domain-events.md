# knowledge-base — 領域事件

> 詳細事件定義見 [`modules/knowledge-base/domain-events.md`](../../modules/knowledge-base/domain-events.md)

## 事件清單

| 事件 | 觸發條件 |
|---|---|
| `knowledge-base.article_created` | 文章建立（狀態 draft）— 含透過 Promote 協議從 KnowledgePage 建立的 Article |
| `knowledge-base.article_updated` | 文章內容更新 |
| `knowledge-base.article_published` | draft → published |
| `knowledge-base.article_archived` | 文章封存 |
| `knowledge-base.article_verified` | 知識管理員驗證文章 |
| `knowledge-base.article_review_requested` | 標記為 needs_review |
| `knowledge-base.article_owner_assigned` | 指派文章負責人 |
| `knowledge-base.category_created` | 建立分類目錄 |
| `knowledge-base.category_moved` | 分類移動到新父節點 |

## 訂閱事件（D3 Promote 協議）

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `knowledge` | `knowledge.page_promoted` | 依 `pageId` 建立 Article（`status=draft`），完成 Promote 協議 |
