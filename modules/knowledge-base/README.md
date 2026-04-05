# knowledge-base — 組織知識庫 / Wiki / SOP 管理

> **Domain Type:** **Core Domain**（核心域）
> **模組路徑:** `modules/knowledge-base/`
> **開發狀態:** 📅 Planned — 設計階段

## 在 Knowledge Platform 中的角色

`knowledge-base` 是 Xuanwu 的 Notion Wiki / Knowledge Base 對應模組，負責組織或團隊級別的知識文章管理，支援層級分類、標籤、Backlink、SOP 流程文件與頁面驗證機制。

## 主要職責

| 能力 | 說明 |
|---|---|
| Article 文章管理 | 建立、編輯、版本化、歸檔組織知識文章 |
| Category 分類管理 | 層級化分類目錄，管理文章組織結構 |
| 頁面驗證 | verified / needs_review 狀態，支援知識準確性管理 |
| 頁面負責人 | 指定 ArticleOwner，負責維護文章內容 |
| Backlink / Tag | 文章間相互引用與標籤分類 |

## 核心聚合

- **`Article`**（知識文章）
- **`Category`**（分類目錄）

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [repositories.md](./repositories.md) | Repository 介面與實作 |
| [application-services.md](./application-services.md) | Use Cases 清單 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係 |
