# Domain Events — wiki

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `wiki.node_created` | 新 GraphNode 建立時 | `nodeId`, `workspaceId`, `nodeType`, `occurredAt` |
| `wiki.node_activated` | GraphNode 從 draft → active | `nodeId`, `workspaceId`, `occurredAt` |
| `wiki.node_archived` | GraphNode 歸檔 | `nodeId`, `workspaceId`, `occurredAt` |
| `wiki.edge_created` | 新 GraphEdge 建立時 | `edgeId`, `sourceNodeId`, `targetNodeId`, `edgeType`, `occurredAt` |
| `wiki.edge_activated` | GraphEdge 從 pending → active | `edgeId`, `occurredAt` |
| `wiki.edge_removed` | GraphEdge 移除 | `edgeId`, `occurredAt` |
| `wiki.autolink_created` | 系統自動建立 Backlink 關係 | `edgeId`, `sourceNodeId`, `targetNodeId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `knowledge` | `knowledge.page_created` | 建立對應的 GraphNode |
| `knowledge` | `knowledge.block_updated` | 掃描區塊內容，建立/更新 AutoLink GraphEdge |
| `knowledge` | `knowledge.page_archived` | 將對應 GraphNode 設為 archived |

## 消費 wiki 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `search` | `wiki.node_activated` | 更新向量索引中的節點內容 |
| `notebook` | wiki 圖譜查詢（非事件） | AI 推理時參考圖譜結構 |
