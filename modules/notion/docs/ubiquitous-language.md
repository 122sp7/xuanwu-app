# Ubiquitous Language — notion

> **範圍：** `modules/notion/` bounded context 及其所有子域
> **術語規範原則：** 若術語來自計畫吸收的獨立模組，以此文件為合并後的規範形式

## 核心術語

### knowledge 子域（← modules/knowledge/）

| 術語 | 英文 | 定義 | 現有位置 |
|------|------|------|---------|
| 知識頁面 | KnowledgePage | 核心知識單元，含 title、parentPageId、blockIds | `modules/knowledge/domain/entities/knowledge-page.entity.ts` |
| 內容區塊 | ContentBlock | 頁面內的原子內容單元（id、pageId、blockType、content、order） | `modules/knowledge/domain/entities/content-block.entity.ts` |
| 區塊類型 | BlockType | `text \| heading-1 \| heading-2 \| image \| code \| bullet-list \| ...` | `modules/knowledge/domain/value-objects/block-content.ts` |
| 版本快照 | ContentVersion | 頁面歷史快照（snapshotBlocks、editSummary、authorId） | `modules/knowledge/domain/entities/content-version.entity.ts` |
| 知識集合 | KnowledgeCollection | Notion-like 集合空間，spaceType="database" 或 "wiki" | `modules/knowledge/domain/entities/knowledge-collection.entity.ts` |
| 集合空間類型 | CollectionSpaceType | `"database" \| "wiki"` | `modules/knowledge/domain/entities/knowledge-collection.entity.ts` |
| 頁面驗證狀態 | PageVerificationState | `"verified" \| "needs_review"`（Wiki Space 使用） | `modules/knowledge/domain/entities/knowledge-page.entity.ts` |
| 頁面負責人 | PageOwner / ownerId | 負責確保頁面內容準確的指定使用者 | `modules/knowledge/domain/entities/knowledge-page.entity.ts` |
| 頁面提升 | Promote（Page → Article） | 將 KnowledgePage 提升為 Article 的跨子域協議（D3 決策） | — |
| 工作區預設視角 | Workspace-first Scope | 日常頁面樹、建立與整理流程預設綁定 active workspace 的規則 | — |

### authoring 子域（← modules/knowledge-base/）

| 術語 | 英文 | 定義 | 現有位置 |
|------|------|------|---------|
| 文章 | Article | 組織知識文章（SOP / Wiki），具備驗證狀態與負責人 | `modules/knowledge-base/domain/entities/article.entity.ts` |
| 分類 | Category | 層級分類目錄，最多 5 層深度 | `modules/knowledge-base/domain/entities/category.entity.ts` |
| 文章驗證狀態 | VerificationState | `"verified" \| "needs_review" \| "unverified"` | `modules/knowledge-base/domain/entities/article.entity.ts` |
| 文章負責人 | ArticleOwner | 負責維護文章準確性的使用者 | `modules/knowledge-base/domain/entities/article.entity.ts` |
| 反向連結 | Backlink | `[[Article Title]]` wikilink 解析的反向引用 | `modules/knowledge-base/domain/services/BacklinkExtractorService.ts` |

### collaboration 子域（← modules/knowledge-collaboration/）

| 術語 | 英文 | 定義 | 現有位置 |
|------|------|------|---------|
| 留言 | Comment | 針對 contentId 的留言（root 或 reply thread） | `modules/knowledge-collaboration/domain/entities/comment.entity.ts` |
| 存取授權 | Permission | `(subjectId, principalId)` 的存取授權記錄，upsert 語意 | `modules/knowledge-collaboration/domain/entities/permission.entity.ts` |
| 授權層級 | PermissionLevel | `view < comment < edit < full`（嚴格偏序） | `modules/knowledge-collaboration/domain/entities/permission.entity.ts` |
| 版本 | Version | Block 快照，immutable，最多保留 100 個 | `modules/knowledge-collaboration/domain/entities/version.entity.ts` |
| 具名版本 | NamedVersion | 附有人工標籤的具名版本（不自動刪除） | `modules/knowledge-collaboration/domain/entities/version.entity.ts` |
| 內容引用 | contentId | opaque reference，跨子域引用任意知識內容 | — |
| 頁面鎖定 | PageLock | 防並發的暫時鎖定 | — |

### database 子域（← modules/knowledge-database/）

| 術語 | 英文 | 定義 | 現有位置 |
|------|------|------|---------|
| 資料庫 | Database | 結構化資料容器（≠ KnowledgeCollection），含欄位 Schema 與視圖清單 | `modules/knowledge-database/domain/entities/database.entity.ts` |
| 欄位 | Field | Schema 欄位定義（≠ Column） | `modules/knowledge-database/domain/entities/database.entity.ts` |
| 記錄 | Record | 資料行（≠ Row, Item, Entry） | `modules/knowledge-database/domain/entities/record.entity.ts` |
| 屬性 | Property | Record 中某 Field 的具體值 | `modules/knowledge-database/domain/entities/record.entity.ts` |
| 視圖 | View | 視圖配置（不持有資料） | `modules/knowledge-database/domain/entities/view.entity.ts` |
| 視圖類型 | ViewType | `table \| board \| list \| calendar \| timeline \| gallery` | `modules/knowledge-database/domain/entities/view.entity.ts` |
| 欄位連結 | Relation | 跨 Database 的 Record 連結欄位類型 | — |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `KnowledgePage` | `Page`, `Document`, `Note` |
| `ContentBlock` | `Block`, `Node`, `Element`（在 notion 語言中必須用 ContentBlock） |
| `ContentVersion` | `History`, `Snapshot`, `Revision` |
| `KnowledgeCollection` | `Database`, `Collection`, `Table`（不應直接暴露在 API 外） |
| `Article`（authoring） | `KnowledgePage`, `Document`, `Wiki`（不同概念） |
| `Field`（database） | `Column`, `Attribute` |
| `Record`（database） | `Row`, `Item`, `Entry` |
| `Permission` | `Role`, `Grant` |
| `PermissionLevel` | `AccessLevel`, `Role` |
| `Version`（collaboration） | `History`, `Revision`, `Snapshot` |

## 事件命名原則

合并前（獨立模組仍存在時），事件命名使用原有前綴：
- `knowledge.*`, `knowledge-base.*`, `knowledge-collaboration.*`, `knowledge-database.*`

合并後（統一進 notion），事件前綴更新為：
- `notion.*`（所有子域共用 `notion` 前綴 + 子域限定符）

## 術語來源驗證

| 術語 | 權威文件 |
|------|---------|
| knowledge 子域術語 | `modules/knowledge/ubiquitous-language.md` |
| authoring 子域術語 | `modules/knowledge-base/ubiquitous-language.md` |
| collaboration 子域術語 | `modules/knowledge-collaboration/ubiquitous-language.md` |
| database 子域術語 | `modules/knowledge-database/ubiquitous-language.md` |
