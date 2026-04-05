# Notion + Wiki + NotebookLM × MDDD 架構設計完整總結

## 1. 系統整體定位
本系統是一個 Knowledge Platform（知識平台），目標是建立：
- 知識儲存系統
- 知識關聯圖譜
- AI 知識推理系統
- 文件來源管理
- 搜尋與檢索
- 外部系統同步（Notion 等）

系統本質不是筆記工具，而是 Knowledge Operating System。

整體分層：
- Storage / Management → Notion / Knowledge Domain
- Knowledge Structure → Wiki Domain
- AI Reasoning → Notebook / AI Domain
- Retrieval → Search Domain
- External Sources → Source Domain
- Integration → Sync Domain


## 2. DDD 分層概念
DDD 層級關係：

Domain
 → Subdomain
 → Bounded Context
 → Module
 → Code

Bounded Context = 模型邊界 + 語言邊界  
Module = 程式碼邊界  

一個 Bounded Context 對應一個 module。


## 3. Bounded Context / Modules 切分

modules/
  identity/
  organization/
  workspace/
  knowledge/
  wiki/
  notebook/
  source/
  ai/
  search/
  sync/
  notification/
  shared/


## 4. Domain 類型分類

Core Domain:
- knowledge
- wiki

Supporting Domain:
- notebook
- ai
- search
- source
- sync

Generic Domain:
- identity
- organization
- notification
- workspace


## 5. Module 標準結構

modules/{context}/
  api/
  application/
  domain/
  infrastructure/


domain/
  aggregates/
  entities/
  value-objects/
  repositories/
  domain-services/
  factories/
  events/


## 6. Context 依賴關係圖

Identity → Organization → Workspace
                         ↓
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
     Knowledge        Wiki           Notebook
        ↓               ↓               ↓
      Search            │               AI
        ↓               │               ↑
        └──── Source ───┘
                ↑
               Sync


## 7. Knowledge Domain 設計

Aggregate Roots:
- KnowledgeItem
- KnowledgeCollection
- Tag

Entities:
- Page
- Document
- Note
- Attachment
- Version

Value Objects:
- KnowledgeId
- Title
- Content
- TagId
- AuthorId
- CreatedAt
- VersionNumber

Factories:
- KnowledgeFactory
  - createPage()
  - createNote()
  - createDocument()


## 8. Wiki Domain 設計

Aggregate Roots:
- WikiPage
- WikiGraph

Entities:
- WikiPage
- WikiLink
- Backlink

Value Objects:
- PageId
- LinkType
- RelationType

Factories:
- WikiFactory
  - createWikiPage()
  - createLink()


## 9. Notebook Domain 設計

Aggregate Roots:
- Notebook
- ChatSession
- Summary
- Insight

Value Objects:
- Prompt
- Answer
- Citation
- TokenUsage

Factories:
- NotebookFactory
  - createNotebook()
  - createChatSession()
  - createSummary()


## 10. Source Domain 設計

Aggregate Roots:
- SourceDocument
- SourceCollection

Value Objects:
- FileType
- FileSize
- URL
- Hash
- MimeType


## 11. AI Domain 設計

Aggregate Roots:
- AIQuery
- Embedding
- VectorIndex

Value Objects:
- Prompt
- Model
- Temperature
- TokenCount
- EmbeddingVector


## 12. Search Domain 設計

Aggregate Roots:
- SearchIndex
- SearchQuery
- SearchResult


## 13. Sync Domain 設計（Anti-Corruption Layer）

負責：
- Notion Sync
- Google Docs Sync
- Drive Sync
- Import / Export
- Webhook
- ETL Pipeline

Aggregate Roots:
- SyncJob
- ExternalIntegration
- SyncMapping


## 14. 系統最重要架構規則

1. Module 之間不能直接引用對方 domain
2. 只能透過 module/api 呼叫
3. 每個 Bounded Context 有自己的 Ubiquitous Language
4. Core Domain 不依賴 Supporting Domain
5. 外部系統一定透過 Anti-Corruption Layer
6. Knowledge 是系統核心域
7. Wiki 是 Knowledge Graph
8. Notebook / AI 是推理層
9. Search 是檢索層
10. Source 是文件來源層
11. Sync 是整合層


## 15. 最終整體架構（一句話）

整個系統是一個以 Knowledge 為核心域、Wiki 為知識圖譜、Notebook 與 AI 為推理層、Search 為檢索層、Source 為文件來源、Sync 為外部系統整合層的 Modular Monolith / Microservice 可演進的 MDDD 架構知識平台。
