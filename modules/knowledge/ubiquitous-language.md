# Ubiquitous Language — knowledge

> **範圍：** 僅限 `modules/knowledge/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 知識頁面 | KnowledgePage | 核心知識單元，含 title、parentPageId、blockIds | `domain/entities/knowledge-page.entity.ts` |
| 內容區塊 | ContentBlock | 頁面內的原子內容單元（id、pageId、blockType、content、order） | `domain/entities/content-block.entity.ts` |
| 區塊類型 | BlockType | `text \| heading-1 \| heading-2 \| image \| code \| bullet-list \| ...` | `domain/entities/block.ts` |
| 版本快照 | ContentVersion | 頁面的歷史快照（snapshotBlocks、editSummary、authorId） | `domain/entities/content-version.entity.ts` |
| 頁面審批 | PageApproval | 使用者核准 AI 生成草稿的動作，觸發 `knowledge.page_approved` | — |
| 抽取任務 | ExtractedTask | 從頁面內容提取的任務定義（title、dueDate、description） | `domain/events/knowledge.events.ts` |
| 抽取發票 | ExtractedInvoice | 從頁面內容提取的發票定義（amount、description、currency） | `domain/events/knowledge.events.ts` |
| 知識資料庫 | KnowledgeCollection (database) | spaceType="database" 的集合，帶欄位 Schema，對應 Notion Database | `domain/entities/knowledge-collection.entity.ts` |
| 知識庫（Wiki Space） | WikiSpace / KnowledgeCollection (wiki) | spaceType="wiki" 的集合，啟用頁面驗證與所有權，對應 Notion Wiki | `domain/entities/knowledge-collection.entity.ts` |
| 集合空間類型 | CollectionSpaceType | `"database" \| "wiki"` — 區分資料庫與知識庫空間 | `domain/entities/knowledge-collection.entity.ts` |
| 頁面驗證狀態 | PageVerificationState | `"verified" \| "needs_review"` — 頁面在 Wiki Space 中的內容準確性狀態 | `domain/entities/knowledge-page.entity.ts` |
| 頁面負責人 | PageOwner (`ownerId`) | 負責確保頁面內容準確與更新的指定使用者 | `domain/entities/knowledge-page.entity.ts` |
| 已驗證 | verified | `verificationState="verified"` — 頁面內容已確認準確 | — |
| 待審閱 | needs_review | `verificationState="needs_review"` — 頁面內容需要檢視與確認 | — |
| 頁面提升 | Promote（Page → Article） | 將 `KnowledgePage` 提升為 `Article` 的跨 BC 協議；`knowledge` 執行驗證並發出 `knowledge.page_promoted`，`knowledge-base` 負責業務規則與 Article 建立 | — |

## 頁面生命周期操作（Page Lifecycle Actions）

以下為 `KnowledgePage` 允許的使用者操作。**預期使用的 Server Action** 與 **UI 顯示標籤**必須對齊。

| 操作 | Server Action | UI 標籤（中文） | 觸發事件 |
|------|--------------|----------------|----------|
| 在內部新增頁面 | `createKnowledgePage` | 在內部新增頁面 | `knowledge.page_created` |
| 重新命名 | `renameKnowledgePage` | 重新命名 | `knowledge.page_renamed` |
| 移動到 | `moveKnowledgePage` | 移動到 | `knowledge.page_moved` |
| 歸檔（移至垃圾桶） | `archiveKnowledgePage` | 移至垃圾桶 | `knowledge.page_archived` |
| 提升為文章 | `promoteKnowledgePage` | 提升為文章（→ knowledge-base Article） | `knowledge.page_promoted` |

> **術語對齊規則：** Domain 用 `archive`（歸檔）；UI 標籤為「移至垃圾桶」。兩者指同一操作（`status = "archived"`），不得在 domain 層使用 `trash`。

## 頁面操作選單（PageContextMenu）

`PageTreeView` 內每個頁面行 hover 時出現的 `…` 操作選單。此為 「頁面樹狀視圖」的 UI 互動模式。

| 選單項目 | 對應 Use Case | UI 互動 |
|------------|--------------|----------|
| 在內部新增頁面 | `createKnowledgePage` (parentPageId = 目前頁) | 應即修改名稱輸入框 |
| 重新命名 | `renameKnowledgePage` | 行內 inline 輸入框，Enter 確認 |
| 移動到 | `moveKnowledgePage` | 待實作 |
| 移至垃圾桶 | `archiveKnowledgePage` | 二次確認，成功後移除樹狀視圖該頁 |

## 頁面樹狀視圖（PageTreeView）

`modules/knowledge/interfaces/components/PageTreeView.tsx` 的 UI 層概念諍。

| 概念 | 說明 |
|------|------|
| 頁面樹狀視圖 | 對應 `KnowledgePage` 父子層級的可視化展示，層級通過 `parentPageId` 樹 |
| 層級展開 / 折疊 | 頁面節點 idle 狀態，預設展開層數 < 2 |
| hover 操作列 | 每行 hover 展現 `…`（操作選單）與 `+`（在內部新增頁面）按鈕 |
| inline rename | hover 選單內點後直接展現行內輸入框，不開 dialog |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `KnowledgePage` | `Page`, `Document`, `Note` |
| `ContentBlock` | `Block`, `Node`, `Element` |
| `ContentVersion` | `History`, `Snapshot`, `Revision` |
| `KnowledgeCollection` | `Database`, `Collection`, `Table`（不應直接暴露在 API 外） |
| `WikiSpace` | `KB`, `KnowledgeBase`（直接稱呼） |
| archive (在 UI 中) | `trash`, `delete`（在 domain 層不得使用 trash/delete 命名） |

> `WikiPage` 為 `wiki` BC 術語，不屬於 `knowledge` BC 通用語言。
> `WikiSpace` 在 `knowledge` BC 代表 `spaceType="wiki"` 的 `KnowledgeCollection`，與 `wiki` 模組（圖譜引擎）完全不同。
