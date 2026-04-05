# Ubiquitous Language — knowledge

> **範圍：** 僅限 `modules/knowledge/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 知識頁面 | KnowledgePage | 核心知識單元，含 title、parentPageId、blockIds | `domain/entities/content-page.entity.ts` |
| 內容區塊 | ContentBlock | 頁面內的原子內容單元（id、pageId、blockType、content、order） | `domain/entities/content-block.entity.ts` |
| 區塊類型 | BlockType | `text \| heading-1 \| heading-2 \| image \| code \| bullet-list \| ...` | `domain/entities/block.ts` |
| 版本快照 | ContentVersion | 頁面的歷史快照（snapshotBlocks、editSummary、authorId） | `domain/entities/content-version.entity.ts` |
| 頁面審批 | PageApproval | 使用者核准 AI 生成草稿的動作，觸發 `knowledge.page_approved` | — |
| 抽取任務 | ExtractedTask | 從頁面內容提取的任務定義（title、dueDate、description） | `domain/events/knowledge.events.ts` |
| 抽取發票 | ExtractedInvoice | 從頁面內容提取的發票定義（amount、description、currency） | `domain/events/knowledge.events.ts` |
| 知識資料庫 | KnowledgeCollection (database) | spaceType="database" 的集合，帶欄位 Schema，對應 Notion Database | `domain/entities/knowledge-collection.entity.ts` |
| 知識庫（Wiki Space） | WikiSpace / KnowledgeCollection (wiki) | spaceType="wiki" 的集合，啟用頁面驗證與所有權，對應 Notion Wiki | `domain/entities/knowledge-collection.entity.ts` |
| 集合空間類型 | CollectionSpaceType | `"database" \| "wiki"` — 區分資料庫與知識庫空間 | `domain/entities/knowledge-collection.entity.ts` |
| 頁面驗證狀態 | PageVerificationState | `"verified" \| "needs_review"` — 頁面在 Wiki Space 中的內容準確性狀態 | `domain/entities/content-page.entity.ts` |
| 頁面負責人 | PageOwner (`ownerId`) | 負責確保頁面內容準確與更新的指定使用者 | `domain/entities/content-page.entity.ts` |
| 已驗證 | verified | `verificationState="verified"` — 頁面內容已確認準確 | — |
| 待審閱 | needs_review | `verificationState="needs_review"` — 頁面內容需要檢視與確認 | — |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `KnowledgePage` | `Page`, `Document`, `Note` |
| `ContentBlock` | `Block`, `Node`, `Element` |
| `ContentVersion` | `History`, `Snapshot`, `Revision` |
| `KnowledgeCollection` | `Database`, `Collection`, `Table`（不應直接暴露在 API 外） |
| `WikiSpace` | `KB`, `KnowledgeBase`（直接稱呼） |

> `WikiPage` 為 `wiki` BC 術語，不屬於 `knowledge` BC 通用語言。
> `WikiSpace` 在 `knowledge` BC 代表 `spaceType="wiki"` 的 `KnowledgeCollection`，與 `wiki` 模組（圖譜引擎）完全不同。
