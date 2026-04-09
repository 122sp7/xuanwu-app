# notion/subdomains/collaboration

> **來源模組：** `modules/knowledge-collaboration/`
> **狀態：** 🗂️ Migration-Pending — 計畫從獨立模組遷移至此子域

## 子域職責

`collaboration` 子域為 notion 的所有知識內容提供協作基礎設施：

- `Comment`（線程式留言）：支援 root/reply thread，透過 `contentId` opaque reference 關聯任意知識內容
- `Permission`（細粒度存取授權）：`(subjectId, principalId)` 的授權記錄，upsert 語意，層級 `view < comment < edit < full`
- `Version`（Block 快照）：immutable，最多保留 100 個；`NamedVersion` 不自動刪除

## contentId Opaque Reference 模式

- `collaboration` 子域透過 opaque `contentId` 引用任意知識內容（KnowledgePage / Article / Database）
- 不直接依賴 `knowledge`、`authoring`、`database` 子域的 domain 層
- 此模式保證 `collaboration` 子域可獨立演進，不因其他子域的 domain 變更而被影響

## 發出事件

- `knowledge-collaboration.comment_created` / `comment_resolved`
- `knowledge-collaboration.permission_granted` / `permission_revoked`
- `knowledge-collaboration.version_created` / `version_restored`
- `knowledge-collaboration.page_locked`

## 下游消費

- `platform/notification` 訂閱留言事件，推送通知給相關使用者
- `workspace-feed` 訂閱協作事件，更新動態消息

## 現有實作位置

`modules/knowledge-collaboration/` — 目前作為獨立 bounded context 運作。合并前，此子域的語言與 port 契約以 `modules/notion/docs/` 為規範形式。

## 詳細文件

| 文件 | 說明 |
|------|------|
| [../../../docs/aggregates.md](../../docs/aggregates.md) | 聚合根設計（collaboration 子域節） |
| [../../../docs/domain-events.md](../../docs/domain-events.md) | 事件清單（collaboration 子域節） |
| [../../../docs/ubiquitous-language.md](../../docs/ubiquitous-language.md) | 術語定義（collaboration 子域節） |
| [../../../docs/repositories.md](../../docs/repositories.md) | Repository interfaces（collaboration 子域節） |
| [原始模組](../../../../knowledge-collaboration/README.md) | `modules/knowledge-collaboration/README.md`（前身實作） |
