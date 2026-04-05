# workspace-flow — 工作流程上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-flow/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-flow` 把知識內容轉成可執行的業務流程，負責 Task、Issue、Invoice 三條工作線的狀態機與政策。它是知識平台從「記錄知識」走向「驅動執行」的主要協作引擎。

## 主要職責

| 能力 | 說明 |
|---|---|
| Task / Issue / Invoice 狀態機 | 管理主要工作流程聚合與轉換規則 |
| 物化流程 | 消費 `knowledge.page_approved` 等事件建立可執行項目 |
| 業務守衛 | 封裝狀態轉換、角色限制與流程政策 |

## 與其他 Bounded Context 協作

- `knowledge` 是最重要上游，提供審批後的內容事件。
- `workspace` 提供流程歸屬；`workspace-audit` 與 `workspace-feed` 消費流程結果或事件。

## 核心聚合 / 核心概念

- **`Task`**
- **`Issue`**
- **`Invoice`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
