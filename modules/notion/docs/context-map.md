# Context Map — notion

本文件記錄 `notion` bounded context 與其他 bounded context 的協作關係，以及合并前四個獨立模組之間的內部整合模式。

## notion 對外協作關係

### 上游（notion 依賴的外部 BC）

| 外部 BC | 整合模式 | 說明 |
|---------|---------|------|
| `platform/identity` | Conformist | 頁面操作驗證 `createdByUserId`；用戶認證 |
| `workspace` | Customer/Supplier | 頁面與集合歸屬於 `workspaceId`；workspace-first scope 規則 |
| `platform/organization` | Conformist | 組織知識庫（Article）的組織歸屬驗證 |

### 下游（消費 notion 事件的外部 BC）

| 外部 BC | 整合模式 | 消費事件 | 說明 |
|---------|---------|---------|------|
| `workspace-flow` | Published Language | `knowledge.page_approved` | KnowledgeToWorkflowMaterializer 建立 Task / Invoice |
| `ai` | Customer/Supplier | `knowledge.page_approved` | 觸發 RAG IngestionJob |
| `search` | Customer/Supplier | `knowledge.page_created`, `knowledge.block_updated` | 知識頁面全文索引更新 |
| `platform/notification` | Published Language | `knowledge-collaboration.comment_created`, `knowledge-base.article_review_requested` 等 | 觸發通知推送 |
| `notebook` | Customer/Supplier | 頁面內容 | 知識摘要與問答消費端 |

---

## 子域間整合關係（notion 內部）

### D3：knowledge → authoring（Promote 協議）

**最重要的跨子域整合點。**

```
knowledge 子域
  ─── knowledge.page_promoted ───►  authoring 子域
                                    (PromotePageToArticle use case)
                                    建立 Article（status=draft）
```

- `authoring` 是 Promote 協議的**業務規則擁有者**
- 使用者觸發「提升為文章」操作，`knowledge` 執行頁面驗證並發出 `knowledge.page_promoted`
- `authoring` 訂閱後依 `pageId` 建立對應 Article
- 提升後原 KnowledgePage 保留（不歸檔）；Article 成為知識庫主版本

### D1：knowledge → database（KnowledgeCollection opaque ref）

```
knowledge 子域
  ─── KnowledgeCollection.id (opaque ref) ───►  database 子域
                                                 (Database/Record/View 完整擁有)
```

- `knowledge` 的 `KnowledgeCollection` 在 `spaceType="database"` 時只保留 opaque ID
- `database` 子域完整擁有結構化欄位 Schema、Record 與 View 能力
- 整合點：`knowledge` 透過 `database` 子域的 OHS API 取得 DatabaseId

### collaboration → knowledge/authoring/database（contentId opaque reference）

```
collaboration 子域
  ─── contentId (opaque ref) ───►  knowledge / authoring / database 子域
                                   (Comment、Permission、Version 對任意知識內容的授權與協作)
```

- `collaboration` 透過 opaque `contentId` 引用任意知識內容，不直接依賴其他子域的 domain
- `knowledge`、`authoring`、`database` 子域只需發出內容事件，`collaboration` 訂閱後自行建立協作記錄

### authoring → database（Article-Record 連結）

```
authoring 子域
  ─── OHS API call ───►  database 子域
                          (Article 可與 Database Record 連結，呈現結構化關聯)
```

- `authoring` 呼叫 `database` 子域的 Open Host Service API，建立 Article-Record 關聯
- `database` 不直接依賴 `authoring` 的 domain 語言

---

## 合并前的跨模組協作現況

在四個獨立模組尚未合并進 notion 前，模組間協作透過事件與 api/ 公開邊界：

| 上游模組 | 下游模組 | 整合方式 | 現狀 |
|---------|---------|---------|------|
| `modules/knowledge` | `modules/knowledge-base` | 事件（D3 Promote 協議）| 已實作 |
| `modules/knowledge` | `modules/knowledge-database` | OHS API（D1 opaque ref）| 已實作 |
| `modules/knowledge-collaboration` | `modules/knowledge`, `modules/knowledge-base`, `modules/knowledge-database` | contentId opaque reference | 已設計 |
| `modules/knowledge-base` | `modules/knowledge-database` | OHS API（Article-Record link）| 已設計 |

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| platform/identity → notion | identity | notion | Conformist |
| workspace → notion | workspace | notion | Customer/Supplier |
| notion → workspace-flow | notion | workspace-flow | Published Language |
| notion → ai | notion | ai | Customer/Supplier（Events） |
| notion → search | notion | search | Customer/Supplier（Events） |
| knowledge → authoring（D3）| knowledge | authoring | Customer/Supplier（Promote Events） |
| knowledge → database（D1）| knowledge | database | Open Host Service |
| collaboration → all | collaboration | knowledge/authoring/database | opaque contentId reference |
| authoring → database | authoring | database | Open Host Service |
