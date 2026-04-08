# knowledge — 知識內容上下文

> **Domain Type:** **Core Domain**（核心域）  
> **模組路徑:** `modules/knowledge/`  
> **開發狀態:** 🚧 Developing — 積極開發中

## 在 Knowledge Platform / Second Brain 中的角色

`knowledge` 是 Xuanwu 的 Notion-like 核心內容層，負責知識頁面、內容區塊、版本與審批生命週期。它是整個 Knowledge Platform / Second Brain 的中心，決定知識如何被建立、保存、演進與交付給下游協作。

## 主要職責

| 能力 | 說明 |
|---|---|
| Knowledge Page 生命週期 | 建立、編輯、版本化、歸檔與審批知識頁面 |
| 內容區塊管理 | 維護文字、標題、媒體、列表等內容區塊結構 |
| Database（知識資料庫） | KnowledgeCollection with spaceType="database"（僅持有 opaque ID）；完整 Schema / Record / View 生命週期由 `knowledge-database` BC 擁有（**D1 決策**） |
| Wiki / Knowledge Base（知識庫） | KnowledgeCollection with spaceType="wiki"，支援頁面驗證狀態、頁面所有權與定期審閱（對時 Notion Wiki） |
| 審批後協作啟動 | 發出 `knowledge.page_approved` 等事件，驅動後續工作流程與知識流轉 |

## Scope 原則

- `knowledge` 的日常頁面建立、整理與樹狀導覽以 workspace-first 為預設。
- account / organization 層級只能作為顯式 summary mode，用於跨工作區總覽，不應默默取代工作區視角。
- 若畫面或查詢沒有明確指定 summary mode，則必須帶入 activeWorkspaceId 來限制知識頁面範圍。
- `createKnowledgePage` 的 write-side contract 必須帶 `workspaceId`；account summary mode 不提供一般頁面建立入口。

## 與其他 Bounded Context 協作

- `workspace` 提供知識內容的歸屬容器；`source` 提供外部文件入口。
- `knowledge-base` 承接被提升為文章的組織級知識資產；`workspace-flow` 以審批事件物化任務與發票。
- `search` 與 `notebook` 消費知識內容做檢索、摘要與問答。

## 核心聚合 / 核心概念

- **`KnowledgePage`**
- **`ContentBlock`**
- **`ContentVersion`**
- **`KnowledgeCollection`**（spaceType: "database" | "wiki"）

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
