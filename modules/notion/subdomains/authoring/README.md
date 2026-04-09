# notion/subdomains/authoring

> **來源模組：** `modules/knowledge-base/`
> **狀態：** 🗂️ Migration-Pending — 計畫從獨立模組遷移至此子域

## 子域職責

`authoring` 子域負責組織級知識庫能力：

- `Article`（組織知識文章：SOP / Wiki）的建立、驗證、發布與分類
- `Category`（層級分類目錄，最多 5 層）的管理
- `Backlink`（`[[Article Title]]` wikilink 解析）的提取與維護
- **D3 Promote 協議**的業務規則擁有者：訂閱 `knowledge.page_promoted`，建立 Article

## Promote 協議（D3）

1. 使用者在 `knowledge` 子域觸發「提升為文章」操作
2. `knowledge` 子域執行頁面驗證，發出 `knowledge.page_promoted`
3. `authoring` 子域訂閱後，依 `pageId` 建立 Article（`status=draft`）
4. 提升後原 KnowledgePage 保留；Article 成為知識庫主版本

## 發出事件

- `knowledge-base.article_created`（含 Promote 協議建立的 Article）
- `knowledge-base.article_updated` / `article_published` / `article_archived`
- `knowledge-base.article_verified` / `article_review_requested` / `article_owner_assigned`
- `knowledge-base.category_created` / `category_moved`

## 訂閱事件

- `knowledge.page_promoted` → 執行 `PromotePageToArticle` use case

## 現有實作位置

`modules/knowledge-base/` — 目前作為獨立 bounded context 運作。合并前，此子域的語言與 port 契約以 `modules/notion/docs/` 為規範形式。

## 詳細文件

| 文件 | 說明 |
|------|------|
| [../../../docs/aggregates.md](../../docs/aggregates.md) | 聚合根設計（authoring 子域節） |
| [../../../docs/domain-events.md](../../docs/domain-events.md) | 事件清單（authoring 子域節） |
| [../../../docs/ubiquitous-language.md](../../docs/ubiquitous-language.md) | 術語定義（authoring 子域節） |
| [../../../docs/repositories.md](../../docs/repositories.md) | Repository interfaces（authoring 子域節） |
| [原始模組](../../../../knowledge-base/README.md) | `modules/knowledge-base/README.md`（前身實作） |
