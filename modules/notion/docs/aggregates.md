# Aggregates — notion

本文件記錄 `notion` bounded context 的核心聚合根與關鍵實體。聚合根設計以計畫吸收的四個獨立模組的現有設計為基礎，並確定合并後的規範邊界。

## knowledge 子域（← modules/knowledge/）

### 聚合根：KnowledgePage

核心知識單元。管理頁面標題、父子層級（parentPageId）、區塊引用列表（blockIds）及審批與驗證狀態。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 頁面主鍵 |
| `title` | `string` | 頁面標題 |
| `slug` | `string` | URL-safe 識別符（accountId 下唯一） |
| `parentPageId` | `string \| null` | 父頁面 ID（樹狀層級） |
| `blockIds` | `string[]` | 關聯的 ContentBlock ID 列表 |
| `accountId` | `string` | 所屬帳戶 |
| `workspaceId` | `string?` | 所屬工作區（workspace-first 必須帶值） |
| `status` | `KnowledgePageStatus` | `active \| archived` |
| `approvalState` | `KnowledgePageApprovalState?` | `pending \| approved`（AI 草稿審批） |
| `verificationState` | `PageVerificationState?` | `verified \| needs_review`（Wiki Space 模式） |
| `ownerId` | `string?` | 頁面負責人 |

**不變數：**
- `slug` 在同一 `accountId` 下唯一
- 日常建立流程預設 workspace-first，`workspaceId` 必填
- `archived` 頁面不可新增 ContentBlock
- 歸檔父頁面時子頁面級聯歸檔（D2 決策），可恢復

**現有位置：** `modules/knowledge/domain/entities/knowledge-page.entity.ts`

---

### 實體：ContentBlock

頁面內原子內容單元，有序排列形成頁面內容。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 區塊主鍵 |
| `pageId` | `string` | 所屬頁面 ID |
| `content` | `BlockContent` | 型別化內容（含 `type: BlockType`） |
| `order` | `number` | 排列順序 |

**現有位置：** `modules/knowledge/domain/entities/content-block.entity.ts`

---

### 實體：ContentVersion

頁面的歷史版本快照（append-only）。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 版本主鍵 |
| `pageId` | `string` | 所屬頁面 |
| `label` | `string` | 版本標籤 |
| `titleSnapshot` | `string` | 版本時刻的頁面標題快照 |
| `blocks` | `KnowledgeVersionBlock[]` | 區塊快照列表 |

**現有位置：** `modules/knowledge/domain/entities/content-version.entity.ts`

---

### 聚合根：KnowledgeCollection

Notion-like 集合空間。`spaceType="database"` 時，完整 Schema+Record+View 由 `database` 子域獨立擁有（D1 決策）；`spaceType="wiki"` 時，由 `knowledge` 子域管理。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 集合主鍵 |
| `spaceType` | `CollectionSpaceType` | `"database" \| "wiki"` |
| `name` | `string` | 集合名稱 |
| `workspaceId` | `string?` | 所屬工作區 |
| `status` | `CollectionStatus` | `active \| archived` |

**現有位置：** `modules/knowledge/domain/entities/knowledge-collection.entity.ts`

---

## authoring 子域（← modules/knowledge-base/）

### 聚合根：Article

組織知識文章（SOP / Wiki），具備驗證狀態與負責人。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 文章主鍵 |
| `title` | `string` | 文章標題 |
| `content` | `string` | 文章主體 |
| `status` | `ArticleStatus` | `draft \| published \| archived` |
| `verificationState` | `VerificationState` | `verified \| needs_review \| unverified` |
| `ownerId` | `string` | 文章負責人（ArticleOwner） |
| `categoryId` | `string?` | 所屬分類 |
| `linkedArticleIds` | `string[]` | Backlink 引用列表 |

**現有位置：** `modules/knowledge-base/domain/entities/article.entity.ts`

---

### 聚合根：Category

層級分類目錄（最多 5 層深度）。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 分類主鍵 |
| `name` | `string` | 分類名稱 |
| `slug` | `string` | URL 識別碼 |
| `parentCategoryId` | `string \| null` | 父分類（null = 根節點） |
| `depth` | `number` | 層級深度（最大 5） |
| `articleIds` | `string[]` | 直屬文章 ID 列表 |

**現有位置：** `modules/knowledge-base/domain/entities/category.entity.ts`

---

## collaboration 子域（← modules/knowledge-collaboration/）

### 聚合根：Comment

針對 contentId 的留言，支援一層 thread（root/reply）。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 留言主鍵 |
| `contentId` | `string` | opaque reference 到任意知識內容 |
| `authorId` | `string` | 留言作者 |
| `body` | `string` | 留言內容 |
| `parentCommentId` | `string \| null` | 回覆的父留言（null = root） |

**現有位置：** `modules/knowledge-collaboration/domain/entities/comment.entity.ts`

---

### 聚合根：Permission

單一 (subject, principal) 的存取授權，upsert 語意。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `subjectId` | `string` | 被授權的資源 ID |
| `principalId` | `string` | 被授權的主體 ID |
| `level` | `PermissionLevel` | `view \| comment \| edit \| full` |

**現有位置：** `modules/knowledge-collaboration/domain/entities/permission.entity.ts`

---

### 實體：Version

Block 快照，immutable。最多 100 個（具名版本除外）。

**現有位置：** `modules/knowledge-collaboration/domain/entities/version.entity.ts`

---

## database 子域（← modules/knowledge-database/）

### 聚合根：Database

欄位 Schema 容器 + 視圖清單；Schema 是 invariant 邊界。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 資料庫主鍵 |
| `name` | `string` | 資料庫名稱 |
| `fields` | `Field[]` | 欄位 Schema 清單 |
| `viewIds` | `string[]` | 視圖 ID 清單 |

**現有位置：** `modules/knowledge-database/domain/entities/database.entity.ts`

---

### 實體：Record

單行資料，properties 為 fieldId → value 的 Map。

**現有位置：** `modules/knowledge-database/domain/entities/record.entity.ts`

---

### 實體：View

視圖配置（type + filters + sorts + groupBy），不持有資料。

**ViewType：** `table \| board \| list \| calendar \| timeline \| gallery`

**現有位置：** `modules/knowledge-database/domain/entities/view.entity.ts`

---

## 重要架構決策

| 決策 | 說明 |
|------|------|
| **D1** | `database` 子域完整擁有 `spaceType="database"` 的 Database/Record/View；`knowledge` 子域的 KnowledgeCollection 在此模式只保留 opaque ID |
| **D2** | 歸檔 KnowledgePage 時，所有子頁面同步歸檔（`childPageIds` 記入事件），可恢復 |
| **D3** | Page → Article 提升（Promote 協議）：`authoring` 子域擁有業務規則，`knowledge` 子域發出 `knowledge.page_promoted`，`authoring` 訂閱後建立 Article |
