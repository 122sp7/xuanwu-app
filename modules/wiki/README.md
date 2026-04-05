# wiki — 知識圖譜上下文

> **Domain Type:** **Core Domain**（核心域）  
> **模組路徑:** `modules/wiki/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`wiki` 是 Xuanwu 的 Wiki-like 結構層，負責把知識內容變成可連結、可遍歷、可回溯的節點與關聯網路。它與 `knowledge` 一起形成產品最核心的差異化價值。

## 主要職責

| 能力 | 說明 |
|---|---|
| Graph Node 管理 | 維護知識節點的生命週期與可見性 |
| Graph Edge 管理 | 維護節點之間的關聯、Backlink 與關係狀態 |
| 結構化知識導航 | 支撐圖譜遍歷、自動連結與知識關聯理解 |

## 與其他 Bounded Context 協作

- `knowledge` 提供被結構化的核心內容。
- `search` 與 `notebook` 消費圖譜脈絡做檢索與推理；`workspace` 提供圖譜的協作歸屬。

## 核心聚合 / 核心概念

- **`GraphNode`**
- **`GraphEdge`**
- **`WikiPage`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
