# Context Map — wiki

## 上游（依賴）

### knowledge → wiki（Customer/Supplier）

- `wiki` 訂閱 `knowledge` 的頁面事件以同步 GraphNode 生命週期
- `wiki.GraphNode.id` 對應 `knowledge.KnowledgePage.id`（共享主鍵）

```
knowledge.page_created ──► wiki: 建立 GraphNode
knowledge.block_updated ──► wiki: 更新 AutoLink GraphEdge
knowledge.page_archived ──► wiki: 歸檔 GraphNode
```

### workspace → wiki（Customer/Supplier）

- GraphNode 歸屬於 workspaceId

---

## 下游（被依賴）

### wiki → search（Customer/Supplier）

- `search` 消費 `wiki.node_activated` 以更新向量索引
- RAG 查詢結果中的圖譜上下文由 wiki 提供

### wiki → notebook（Customer/Supplier）

- AI 對話生成時，`notebook` 可查詢 wiki 圖譜以取得知識上下文

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| knowledge → wiki | knowledge | wiki | Published Language (Events) |
| workspace → wiki | workspace | wiki | Customer/Supplier |
| wiki → search | wiki | search | Customer/Supplier（Events） |
| wiki → notebook | wiki | notebook | Customer/Supplier（Query） |
