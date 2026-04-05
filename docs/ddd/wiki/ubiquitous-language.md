# Ubiquitous Language — wiki

> **範圍：** 僅限 `modules/wiki/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 圖譜節點 | GraphNode | 知識圖譜中的一個節點，對應一個知識概念或頁面 |
| 圖譜邊 | GraphEdge | 兩個 GraphNode 之間的有向關係 |
| 節點類型 | NodeType | 節點的語意類型（concept, page, entity 等） |
| 邊類型 | EdgeType | 關係的語意類型（references, contains, related_to 等） |
| 反向連結 | Backlink | 指向特定節點的所有入向邊（inbound edges） |
| 圖遍歷 | GraphTraversal | 從起點節點沿邊向外擴展，取得關聯節點集 |
| 自動連結 | AutoLink | 系統自動識別內容引用並建立 GraphEdge 的機制 |
| 節點狀態 | NodeStatus | GraphNode 的生命週期狀態：`draft \| active \| archived` |
| 邊狀態 | EdgeStatus | GraphEdge 的生命週期狀態：`pending \| active \| inactive \| removed` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `GraphNode` | `Node`, `WikiNode`, `Page`（圖譜上下文中） |
| `GraphEdge` | `Edge`, `Link`, `Connection` |
| `Backlink` | `InboundLink`, `ReverseLink` |
