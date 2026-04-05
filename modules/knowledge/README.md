# knowledge — 個人筆記與頁面管理

> **Domain Type:** **Core Domain**（核心域）
> **模組路徑:** `modules/knowledge/`
> **開發狀態:** 🚧 Developing — 積極開發中

## 在 Knowledge Platform 中的角色

`knowledge` 是 Xuanwu 的 Notion-like 個人筆記核心，負責頁面（Page）與頁面內容區塊（Block）的建立、編輯和結構管理。是整個平台使用者最直接接觸的內容編輯體驗。

目前它同時承載一部分過渡中的 wiki / database surface：
- `Page` 上已有 `approvalState`、`verificationState`、`ownerId`
- `KnowledgeCollection` 仍在本模組內，尚未完全抽離到 `knowledge-database`

## 主要職責

| 能力 | 說明 |
|---|---|
| Page 生命週期 | 建立、編輯、移動、歸檔個人或團隊筆記頁面 |
| Block 管理 | 新增、更新、刪除、重排內容區塊 |
| 層級結構 | 父子頁面樹狀管理 |
| 草稿與暫存 | 支援頁面狀態流轉（active / archived） |
| Approval / Verification | 頁面核准、驗證、要求複核、指派 owner |
| Collection 過渡能力 | 以 `KnowledgeCollection` 聚合 Page，支援 `database` / `wiki` spaceType |

## 核心聚合

- **`Page`**（KnowledgePage）
- **`Block`**（ContentBlock）
- **`KnowledgeCollection`**（過渡中的結構化 / wiki 空間聚合）

## 已實作現況

| 區塊 | 現況 |
|---|---|
| Page mutations | 已有 create / rename / move / archive server actions |
| Page metadata | 已有 approve / verify / request review / assign owner use cases |
| Block editor | 目前是基於 Zustand 的極簡本地編輯器 |
| Event publish | 目前只有 `knowledge.page_approved` 在 use case 內實際 publish |
| Version read/write | contract 存在，但 `publishKnowledgeVersion` 與 `getKnowledgeVersions` 尚未完整落地 |
| Collection | 已有 create / rename / add/remove page / add column / archive |

## 不在此 BC 範圍

| 功能 | 歸屬 BC |
|------|---------|
| 組織級知識文章（Article）、分類（Category） | `knowledge-base` |
| 留言（Comment）、版本歷史（Version）、權限（Permission） | `knowledge-collaboration` |
| 資料庫（Database）、記錄（Record）、視圖（View） | `knowledge-database` |

## 差距與邊界說明

- `Page` 的 page-level UX 仍未達 Notion 級完整度，像 duplicate / favorite / copy link / side peek 等能力尚未成形
- `KnowledgeCollection` 與 `knowledge-database` 的最終邊界仍需進一步收斂
- `knowledge-base` 應視為 `Article` / `Category` 的組織知識庫，不等於 `knowledge` 的 `Page`

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [repositories.md](./repositories.md) | Repository 介面與實作 |
| [application-services.md](./application-services.md) | Use Cases 清單 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係 |
