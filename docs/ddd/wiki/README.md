# wiki — 知識圖譜上下文

> **Domain Type:** **Core Domain**（核心域）
> **模組路徑:** `modules/wiki/`
> **開發狀態:** 🏗️ Midway

## 定位

`wiki` 實作知識平台的**知識圖譜層**——GraphNode 與 GraphEdge 的生命週期管理。這是 Xuanwu 差異於一般文件工具的核心視覺特性：知識節點間的結構性連結可視化，支援 Backlink 與 Graph Traversal。

## 職責

| 能力 | 說明 |
|------|------|
| GraphNode 管理 | 知識節點 CRUD（draft → active → archived 狀態機） |
| GraphEdge 管理 | 節點間關係 CRUD（pending → active → inactive → removed 狀態機） |
| Backlink 查詢 | 列出所有指向特定節點的邊（反向連結） |
| Graph Traversal | 從起點節點向外遍歷關聯節點 |
| AutoLink | 自動識別內容中的節點引用並建立 GraphEdge |

## 核心聚合根

- **`GraphNode`** — 知識節點（title, nodeType, status: draft → active → archived）
- **`GraphEdge`** — 節點間有向關係（sourceNodeId, targetNodeId, edgeType, status）

## 圖譜狀態機

```
GraphNode: draft ──► active ──► archived
GraphEdge: pending ──► active ──► inactive ──► removed
```

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | GraphNode / GraphEdge 聚合根設計 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
