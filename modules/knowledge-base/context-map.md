# knowledge-base — Context Map

> 詳細關係見 [`modules/knowledge-base/context-map.md`](../../modules/knowledge-base/context-map.md)

## 上游

- `workspace` / `identity` / `organization` — Conformist
- `knowledge-collaboration` — Customer/Supplier（Permission 資訊）
- `knowledge` — Customer/Supplier（**D3 Promote 協議**：訂閱 `knowledge.page_promoted`，由 `knowledge-base` 建立 Article）

## 下游

- `knowledge-database` — Article 可與 Record 連結（ACL）
- `notification` / `workspace-feed` — Published Language（事件消費）
- `workspace-audit` — Published Language（審計紀錄）

## Promote 協議（D3）

`knowledge-base` 是 Promote 協議的業務規則擁有者：

1. 使用者觸發「提升為文章」操作（via `knowledge-base` Server Action）
2. `knowledge` BC 執行頁面驗證並發出 `knowledge.page_promoted` 事件
3. `knowledge-base` 訂閱後依 `pageId` 建立對應 Article（`status=draft`）
4. 提升後原 KnowledgePage 保留（不歸檔）；Article 成為知識庫主版本
