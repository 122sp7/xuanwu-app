# Domain Events — notion

本文件記錄 `notion` bounded context 的領域事件清單。合并前，各獨立模組使用原有事件前綴（`knowledge.*`, `knowledge-base.*` 等）；合并後，所有事件統一以 `notion.*` 為前綴。

## knowledge 子域（← modules/knowledge/）

### 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `knowledge.page_created` | 新頁面建立 | `pageId`, `accountId`, `workspaceId?`, `title`, `createdByUserId` |
| `knowledge.page_renamed` | 頁面標題變更 | `pageId`, `accountId`, `previousTitle`, `newTitle` |
| `knowledge.page_moved` | 頁面移動（parentPageId 變更） | `pageId`, `accountId`, `previousParentPageId`, `newParentPageId` |
| `knowledge.page_archived` | 頁面歸檔（含子頁級聯，可恢復） | `pageId`, `accountId`, `childPageIds` |
| `knowledge.page_approved` | 使用者核准 AI 生成草稿 | `pageId`, `extractedTasks[]`, `extractedInvoices[]`, `actorId` |
| `knowledge.page_promoted` | 頁面提升為 Article（D3 Promote 協議） | `pageId`, `accountId`, `targetArticleId`, `promotedByUserId` |
| `knowledge.page_verified` | 頁面在 Wiki Space 中被驗證 | `pageId`, `accountId`, `verifiedByUserId`, `verificationExpiresAtISO?` |
| `knowledge.page_review_requested` | 頁面被標記為待審閱 | `pageId`, `accountId`, `requestedByUserId` |
| `knowledge.page_owner_assigned` | 頁面負責人被指定 | `pageId`, `accountId`, `ownerId` |
| `knowledge.block_added` | 區塊新增 | `blockId`, `pageId`, `accountId` |
| `knowledge.block_updated` | 區塊內容更新 | `blockId`, `pageId`, `accountId` |
| `knowledge.block_deleted` | 區塊刪除 | `blockId`, `pageId`, `accountId` |
| `knowledge.version_published` | 版本快照手動發佈 | `versionId`, `pageId`, `accountId`, `label`, `createdByUserId` |

**現有位置：** `modules/knowledge/domain/events/knowledge.events.ts`

---

## authoring 子域（← modules/knowledge-base/）

### 發出事件

| 事件 | 觸發條件 |
|------|---------|
| `knowledge-base.article_created` | 文章建立（含 Promote 協議建立） |
| `knowledge-base.article_updated` | 文章內容更新 |
| `knowledge-base.article_published` | `draft → published` |
| `knowledge-base.article_archived` | 文章封存 |
| `knowledge-base.article_verified` | 文章被驗證 |
| `knowledge-base.article_review_requested` | 標記為 `needs_review` |
| `knowledge-base.article_owner_assigned` | 指派文章負責人 |
| `knowledge-base.category_created` | 建立分類目錄 |
| `knowledge-base.category_moved` | 分類移動到新父節點 |

### 訂閱事件

| 來源 | 事件 | 行動 |
|------|------|------|
| `knowledge` | `knowledge.page_promoted` | 依 `pageId` 建立 Article（D3 Promote 協議） |

**現有位置：** `modules/knowledge-base/domain/` 領域事件定義

---

## collaboration 子域（← modules/knowledge-collaboration/）

### 發出事件

| 事件 | 觸發條件 |
|------|---------|
| `knowledge-collaboration.comment_created` | 留言建立 |
| `knowledge-collaboration.comment_resolved` | 留言標記為已解決 |
| `knowledge-collaboration.permission_granted` | 存取授權新增 |
| `knowledge-collaboration.permission_revoked` | 存取授權撤銷 |
| `knowledge-collaboration.version_created` | 版本快照建立 |
| `knowledge-collaboration.version_restored` | 版本還原 |
| `knowledge-collaboration.page_locked` | 頁面鎖定防並發 |

**現有位置：** `modules/knowledge-collaboration/domain/` 領域事件定義

---

## database 子域（← modules/knowledge-database/）

### 發出事件

| 事件 | 觸發條件 |
|------|---------|
| `knowledge-database.database_created` | 資料庫建立 |
| `knowledge-database.database_renamed` | 資料庫重新命名 |
| `knowledge-database.field_added` | 欄位新增 |
| `knowledge-database.field_deleted` | 欄位刪除 |
| `knowledge-database.record_added` | 記錄新增 |
| `knowledge-database.record_updated` | 記錄更新 |
| `knowledge-database.record_deleted` | 記錄刪除 |
| `knowledge-database.record_linked` | 跨 Database 記錄連結 |
| `knowledge-database.view_created` | 視圖建立 |
| `knowledge-database.view_updated` | 視圖配置更新 |

**現有位置：** `modules/knowledge-database/domain/` 領域事件定義

---

## 跨子域整合事件

| 整合點 | 來源子域 | 目標子域 | 事件 | 說明 |
|--------|----------|----------|------|------|
| D3 Promote 協議 | `knowledge` | `authoring` | `knowledge.page_promoted` | authoring 訂閱後建立 Article |
| AI 攝入觸發 | `knowledge` | `ai` | `knowledge.page_approved` | 觸發 RAG IngestionJob |
| 工作流物化 | `knowledge` | `workspace-flow` | `knowledge.page_approved` | 建立 Task / Invoice |

## 合并後事件命名計畫

合并進 notion 後，事件前綴調整計畫：

| 合并前前綴 | 合并後前綴 |
|---|---|
| `knowledge.*` | `notion.knowledge.*` |
| `knowledge-base.*` | `notion.authoring.*` |
| `knowledge-collaboration.*` | `notion.collaboration.*` |
| `knowledge-database.*` | `notion.database.*` |

> **注意：** 前綴切換必須有 migration 計畫，不可直接 rename 而不更新下游訂閱者。
