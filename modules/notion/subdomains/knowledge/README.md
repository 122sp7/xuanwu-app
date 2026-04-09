# notion/subdomains/knowledge

> **來源模組：** `modules/knowledge/`
> **狀態：** 🗂️ Migration-Pending — 計畫從獨立模組遷移至此子域

## 子域職責

`knowledge` 子域是 notion 的核心頁面引擎，負責：

- `KnowledgePage` 的建立、編輯、版本化、審批與歸檔
- `ContentBlock` 的管理與排序（原子內容單元）
- `ContentVersion` 的歷史快照（append-only）
- `KnowledgeCollection` 的集合空間管理（`"database"` 和 `"wiki"` 模式）

## 重要架構決策

| 決策 | 說明 |
|------|------|
| **D1** | `spaceType="database"` 的完整 Schema+Record+View 由 `database` 子域獨立擁有；此子域的 KnowledgeCollection 在此模式只保留 opaque ID |
| **D2** | 歸檔父頁面時，所有子頁面同步歸檔（可恢復）；`childPageIds` 記入事件 |
| **D3** | Promote 協議：此子域執行頁面驗證並發出 `knowledge.page_promoted`；`authoring` 子域訂閱後建立 Article |

## 發出事件

- `knowledge.page_created` / `page_renamed` / `page_moved` / `page_archived`
- `knowledge.page_approved`（帶 `extractedTasks`, `extractedInvoices`）
- `knowledge.page_promoted`（D3 Promote 協議）
- `knowledge.page_verified` / `page_review_requested` / `page_owner_assigned`
- `knowledge.block_added` / `block_updated` / `block_deleted`
- `knowledge.version_published`

## 現有實作位置

`modules/knowledge/` — 目前作為獨立 bounded context 運作。合并前，此子域的語言與 port 契約以 `modules/notion/docs/` 為規範形式。

## 詳細文件

| 文件 | 說明 |
|------|------|
| [../../../docs/aggregates.md](../../docs/aggregates.md) | 聚合根設計（knowledge 子域節） |
| [../../../docs/domain-events.md](../../docs/domain-events.md) | 事件清單（knowledge 子域節） |
| [../../../docs/ubiquitous-language.md](../../docs/ubiquitous-language.md) | 術語定義（knowledge 子域節） |
| [../../../docs/repositories.md](../../docs/repositories.md) | Repository interfaces（knowledge 子域節） |
| [原始模組](../../../../knowledge/README.md) | `modules/knowledge/README.md`（前身實作） |
