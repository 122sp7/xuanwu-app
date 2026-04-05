# knowledge — 個人筆記與頁面管理

> **Domain Type:** **Core Domain**（核心域）
> **模組路徑:** `modules/knowledge/`
> **開發狀態:** 🚧 Developing — 積極開發中

## 在 Knowledge Platform 中的角色

`knowledge` 是 Xuanwu 的 Notion-like 個人筆記核心，負責頁面（Page）與頁面內容區塊（Block）的建立、編輯和結構管理。是整個平台使用者最直接接觸的內容編輯體驗。

## 主要職責

| 能力 | 說明 |
|---|---|
| Page 生命週期 | 建立、編輯、移動、歸檔個人或團隊筆記頁面 |
| Block 管理 | 新增、更新、刪除、重排內容區塊 |
| 層級結構 | 父子頁面樹狀管理 |
| 草稿與暫存 | 支援頁面狀態流轉（active / archived） |

## 核心聚合

- **`Page`**（KnowledgePage）
- **`Block`**（ContentBlock）

## 不在此 BC 範圍

| 功能 | 歸屬 BC |
|------|---------|
| 組織級知識文章（Article）、分類（Category） | `knowledge-base` |
| 留言（Comment）、版本歷史（Version）、權限（Permission） | `knowledge-collaboration` |
| 資料庫（Database）、記錄（Record）、視圖（View） | `knowledge-database` |

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [repositories.md](./repositories.md) | Repository 介面與實作 |
| [application-services.md](./application-services.md) | Use Cases 清單 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係 |
