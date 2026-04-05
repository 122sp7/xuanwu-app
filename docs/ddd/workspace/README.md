# workspace — 工作區上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/workspace/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`workspace` 是整個平台的協作容器，所有知識、來源、任務、稽核與動態都歸屬於某個工作區。它不是產品差異化來源，但決定知識平台如何被團隊實際操作與組合。

## 主要職責

| 能力 | 說明 |
|---|---|
| Workspace 容器管理 | 建立、更新、歸檔工作區 |
| 成員與角色 | 管理工作區成員、角色與協作可見性 |
| 內容結構入口 | 維護內容樹與子模組在工作區中的組合方式 |

## 與其他 Bounded Context 協作

- `organization` 是主要上游，提供多租戶歸屬。
- `knowledge`、`wiki`、`source` 與所有 `workspace-*` 模組都依賴工作區作為協作邊界。

## 核心聚合 / 核心概念

- **`Workspace`**
- **`WorkspaceMember`**
- **`WikiContentTree`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
