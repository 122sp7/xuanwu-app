# Domain Events — knowledge

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `knowledge.page_created` | 新頁面建立時 | `pageId`, `accountId`, `workspaceId?`, `title`, `createdByUserId`, `occurredAtISO` |
| `knowledge.page_renamed` | 頁面標題變更 | `pageId`, `accountId`, `previousTitle`, `newTitle`, `occurredAtISO` |
| `knowledge.page_moved` | 頁面移動（parentPageId 變更） | `pageId`, `accountId`, `previousParentPageId`, `newParentPageId`, `occurredAtISO` |
| `knowledge.page_archived` | 頁面歸檔 | `pageId`, `accountId`, `occurredAtISO` |
| `knowledge.block_added` | Block 新增 | `blockId`, `pageId`, `accountId`, `blockType`, `occurredAtISO` |
| `knowledge.block_updated` | Block 內容更新 | `blockId`, `pageId`, `accountId`, `occurredAtISO` |
| `knowledge.block_deleted` | Block 刪除 | `blockId`, `pageId`, `accountId`, `occurredAtISO` |

## 消費 knowledge 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `knowledge-base` | `knowledge.page_created` | 可選：同步為 Article |
| `knowledge-collaboration` | `knowledge.page_created` | 初始化版本歷史 |
</content>
