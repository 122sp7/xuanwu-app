# Aggregates — wiki

## 聚合根：GraphNode

### 職責
代表知識圖譜中的一個知識節點。管理節點的生命週期（draft → active → archived）與關聯邊列表。

### 生命週期狀態機
```
draft ──[activate]──► active ──[archive]──► archived
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 節點主鍵（對應 knowledge.KnowledgePage.id） |
| `title` | `string` | 節點標題 |
| `nodeType` | `NodeType` | 節點語意類型 |
| `status` | `NodeStatus` | `draft \| active \| archived` |
| `workspaceId` | `string?` | 所屬工作區（workspace BC 整合完成前為 optional） |
| `organizationId` | `string?` | 所屬組織（workspace BC 整合完成前為 optional） |
| `outboundEdgeIds` | `string[]?` | 出向邊 ID 列表（workspace BC 整合完成前為 optional） |

### 不變數

- archived 節點不可建立新 GraphEdge
- `id` 與 `knowledge.KnowledgePage.id` 一一對應

---

## 聚合根：GraphEdge

### 職責
代表兩個 GraphNode 之間的有向關係。管理邊的生命週期（pending → active → inactive → removed）。

### 生命週期狀態機
```
pending ──[activate]──► active ──[deactivate]──► inactive ──[remove]──► removed
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 邊主鍵 |
| `sourceNodeId` | `string` | 起點節點 ID |
| `targetNodeId` | `string` | 終點節點 ID |
| `edgeType` | `EdgeType` | 關係語意類型 |
| `status` | `EdgeStatus` | `pending \| active \| inactive \| removed` |
| `createdByUserId` | `string?` | 建立者 ID（系統自動建立時為 undefined） |

### 不變數

- sourceNodeId 與 targetNodeId 必須是有效的 GraphNode
- removed 的邊不可恢復

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `GraphRepository` | `saveNode()`, `saveEdge()`, `findNodeById()`, `findEdgesByTarget()`, `findEdgesBySource()`, `findEdgesByType()`, `listNodes()`, `listEdges()` |
