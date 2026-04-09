# Application Services — notion

本文件記錄 `notion` bounded context 的 application layer use cases。來源模組的現有 use cases 在合并後應對應到此文件的規範清單。

## knowledge 子域（← modules/knowledge/）

### KnowledgePage Use Cases

| Use Case | 說明 | UI 入口 |
|----------|------|---------|
| `CreateKnowledgePage` | 建立知識頁面（workspace-first，workspaceId 必填） | PageTreeView `+` / 新增頁面 |
| `RenameKnowledgePage` | 重新命名頁面 | PageTreeView `…` → inline rename |
| `MoveKnowledgePage` | 移動頁面層級（parentPageId 變更） | PageTreeView `…` → 移動到 |
| `ArchiveKnowledgePage` | 歸檔頁面（UI：移至垃圾桶）；子頁級聯歸檔 | PageTreeView `…` → 移至垃圾桶 |
| `PromoteKnowledgePage` | 頁面提升為 Article（D3 Promote 協議） | 由 `authoring` Server Action 觸發 |
| `ApproveKnowledgePage` | 核准 AI 生成草稿，發出 `knowledge.page_approved` | 頁面審批 UI |
| `VerifyKnowledgePage` | 驗證頁面（Wiki Space 模式） | Wiki 驗證按鈕 |
| `RequestPageReview` | 標記頁面為待審閱 | Wiki 請求審閱 |
| `AssignPageOwner` | 指定頁面負責人 | Wiki 設定負責人 |
| `ReorderKnowledgePageBlocks` | 重排頁面區塊 | Drag & drop |

### ContentBlock Use Cases

| Use Case | 說明 |
|----------|------|
| `AddBlockToPage` | 新增區塊至頁面 |
| `UpdateBlock` | 更新區塊內容 |
| `DeleteBlock` | 刪除區塊 |

### KnowledgeCollection Use Cases

| Use Case | 說明 |
|----------|------|
| `CreateKnowledgeCollection` | 建立集合（Database / Wiki Space） |
| `RenameKnowledgeCollection` | 重新命名集合 |
| `AddPageToCollection` | 將頁面加入集合 |
| `RemovePageFromCollection` | 從集合移除頁面 |
| `AddCollectionColumn` | 新增欄位（Database 模式） |
| `ArchiveKnowledgeCollection` | 歸檔集合 |

**現有位置：** `modules/knowledge/application/use-cases/`

---

## authoring 子域（← modules/knowledge-base/）

### Article Use Cases

| Use Case | 說明 |
|----------|------|
| `CreateArticle` | 建立文章（狀態 draft） |
| `UpdateArticle` | 更新文章內容 |
| `PublishArticle` | `draft → published` |
| `ArchiveArticle` | 封存文章 |
| `VerifyArticle` | 驗證文章（知識管理員） |
| `RequestArticleReview` | 標記為 `needs_review` |
| `AssignArticleOwner` | 指派文章負責人 |
| `TransferArticleCategory` | 移動文章至另一分類 |
| `ExtractArticleBacklinks` | 解析 `[[wikilink]]`，更新 Backlink |
| `PromotePageToArticle` | 處理 D3 Promote 協議（訂閱 `knowledge.page_promoted`，建立 Article） |

### Category Use Cases

| Use Case | 說明 |
|----------|------|
| `CreateCategory` | 建立分類目錄 |
| `RenameCategory` | 重新命名分類 |
| `MoveCategory` | 移動分類至新父節點 |
| `DeleteCategory` | 刪除分類（需先移出文章） |

**現有位置：** `modules/knowledge-base/application/use-cases/`

---

## collaboration 子域（← modules/knowledge-collaboration/）

### Comment Use Cases

| Use Case | 說明 |
|----------|------|
| `CreateComment` | 建立留言（root 或 reply） |
| `UpdateComment` | 更新留言內容 |
| `DeleteComment` | 刪除留言 |
| `ResolveComment` | 標記留言為已解決 |
| `ListComments` | 取得 contentId 的留言清單 |

### Permission Use Cases

| Use Case | 說明 |
|----------|------|
| `GrantPermission` | 授予 (subject, principal) 存取權限 |
| `RevokePermission` | 撤銷存取權限 |
| `CheckPermission` | 查詢特定主體的權限層級 |
| `ListPermissions` | 取得 contentId 的所有授權清單 |

### Version Use Cases

| Use Case | 說明 |
|----------|------|
| `CreateVersion` | 建立 Block 快照版本 |
| `RestoreVersion` | 還原至指定版本 |
| `LabelVersion` | 標記版本為具名版本 |
| `ListVersions` | 取得 contentId 的版本清單 |

**現有位置：** `modules/knowledge-collaboration/application/use-cases/`

---

## database 子域（← modules/knowledge-database/）

### Database Use Cases

| Use Case | 說明 |
|----------|------|
| `CreateDatabase` | 建立資料庫 |
| `RenameDatabase` | 重新命名資料庫 |
| `AddField` | 新增欄位到 Schema |
| `UpdateField` | 更新欄位定義 |
| `DeleteField` | 刪除欄位（需遷移受影響 Record 的 properties） |
| `ReorderFields` | 調整欄位排列順序 |

### View Use Cases

| Use Case | 說明 |
|----------|------|
| `CreateView` | 建立視圖（table/board/list 等） |
| `UpdateViewFilters` | 更新視圖篩選條件 |
| `UpdateViewSorts` | 更新視圖排序 |
| `UpdateViewGroupBy` | 更新視圖分組欄位 |
| `HideFieldsInView` | 隱藏特定欄位於視圖中 |
| `DeleteView` | 刪除視圖 |

### Record Use Cases

| Use Case | 說明 |
|----------|------|
| `AddRecord` | 新增資料記錄 |
| `UpdateRecord` | 更新 Record properties |
| `DeleteRecord` | 刪除記錄 |
| `LinkRecords` | 建立跨 Database 的 Relation 連結 |
| `UnlinkRecords` | 移除 Relation 連結 |
| `QueryRecords` | 查詢記錄（帶 View filter/sort） |

**現有位置：** `modules/knowledge-database/application/use-cases/`

---

## 合并後 Application Layer 設計規則

- command use cases 只協調 domain port 呼叫，不包含業務規則
- query use cases 回傳 DTO，不暴露 domain entity
- 每個 use case 對應一個 Server Action 入口（`interfaces/_actions/`）
- 跨子域（例如 D3 Promote 協議）必須透過事件訂閱，不可直接呼叫另一子域的 application
