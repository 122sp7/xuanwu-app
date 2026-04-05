# Domain Events — knowledge

## 公開事件契約

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `knowledge.page_created` | 新頁面建立時 | `pageId`, `accountId`, `workspaceId?`, `title`, `createdByUserId`, `occurredAtISO` |
| `knowledge.page_renamed` | 頁面標題變更 | `pageId`, `accountId`, `previousTitle`, `newTitle`, `occurredAtISO` |
| `knowledge.page_moved` | 頁面移動（parentPageId 變更） | `pageId`, `accountId`, `previousParentPageId`, `newParentPageId`, `occurredAtISO` |
| `knowledge.page_archived` | 頁面歸檔 | `pageId`, `accountId`, `occurredAtISO` |
| `knowledge.block_added` | Block 新增 | `blockId`, `pageId`, `accountId`, `blockType`, `occurredAtISO` |
| `knowledge.block_updated` | Block 內容更新 | `blockId`, `pageId`, `accountId`, `occurredAtISO` |
| `knowledge.block_deleted` | Block 刪除 | `blockId`, `pageId`, `accountId`, `occurredAtISO` |
| `knowledge.version_published` | 版本發佈 | `versionId`, `pageId`, `accountId`, `label`, `createdByUserId`, `occurredAtISO` |
| `knowledge.page_verified` | wiki page 標記 verified | `pageId`, `accountId`, `verifiedByUserId`, `verificationExpiresAtISO?`, `occurredAtISO` |
| `knowledge.page_review_requested` | wiki page 被要求複核 | `pageId`, `accountId`, `requestedByUserId`, `occurredAtISO` |
| `knowledge.page_owner_assigned` | wiki page 指派 owner | `pageId`, `accountId`, `ownerId`, `assignedByUserId`, `occurredAtISO` |

## 目前 runtime 已實際 publish

- `knowledge.page_approved`

目前只在 `ApproveKnowledgePageUseCase` 中看到實際透過 `PublishDomainEventUseCase` 發佈。其餘事件目前屬公開契約型別，尚未看到一致的 emit wiring。

## 消費 knowledge 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `knowledge-base` | `knowledge.page_created` / `knowledge.page_approved` | 可選：Promote 或建立組織知識流程 |
| `knowledge-collaboration` | `knowledge.page_created` | 規劃中的初始版本快照 |
| `workspace-audit` | `knowledge.page_approved` | append-only 稽核記錄 |

## 事件檔案位置

- Event contracts: `domain/events/knowledge.events.ts`
- Public API export: `api/events.ts`
</content>
