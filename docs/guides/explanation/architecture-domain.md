# 領域概念模型：Xuanwu Knowledge Platform 實現指南

本文說明 Xuanwu 目前如何把知識平台概念落到實際儲存庫。`architecture.md` 提供產品與體驗層的概念來源，但目前的 canonical ownership 以 `docs/ddd/subdomains.md`、`docs/ddd/bounded-contexts.md` 與各 `modules/<context>/*.md` 為準。

---

## 一、目前的架構視角

Xuanwu 是一個以知識為核心的 modular monolith。從工程落位來看，可以用下列視角理解它：

```text
App Composition / UX Orchestration
  -> app/, providers/, server actions, route slices

Foundation & Governance
  -> identity, account, organization, workspace, notification, shared,
     workspace-audit, workspace-feed, workspace-flow, workspace-scheduling

Knowledge Experience
  -> knowledge, knowledge-base, knowledge-collaboration,
     knowledge-database, source

Retrieval & Reasoning
  -> ai, search, notebook

Worker Runtime
  -> py_fn/ (parse, chunk, embed, background ingestion)
```

| 視角 | 主要 bounded contexts | 說明 |
| --- | --- | --- |
| Foundation & Governance | `identity`, `account`, `organization`, `workspace`, `notification`, `shared`, `workspace-*` | 提供身份、帳戶、租戶、工作區容器、治理、稽核、流程與排程能力。 |
| Knowledge Experience | `knowledge`, `knowledge-base`, `knowledge-collaboration`, `knowledge-database`, `source` | 承接頁面、文章、資料庫、協作與外部來源治理。 |
| Retrieval & Reasoning | `ai`, `search`, `notebook` | 承接 ingestion orchestration、semantic retrieval、ask/cite、摘要與知識生成。 |

這個分層是理解用的工程視角，不代表額外的 framework layer。真正的 owner 仍然是 bounded context 本身。

---

## 二、核心領域概念

### 2.1 Knowledge Experience

| Bounded Context | 代表概念 | 角色 |
| --- | --- | --- |
| `knowledge` | `KnowledgePage`, `ContentBlock`, `ContentVersion`, `KnowledgeCollection` | 承接 Notion-like 頁面、區塊、版本與頁面審批生命週期。 |
| `knowledge-base` | `Article`, `Category` | 承接組織級 article、SOP、wiki-like 發布與驗證。 |
| `knowledge-collaboration` | Comment、Permission、Version Snapshot | 承接知識內容的協作、評論、權限與版本快照。 |
| `knowledge-database` | Database、Record、View | 承接結構化資料庫、欄位、資料列與多視圖工作流。 |
| `source` | File、Source Collection、`WikiLibrary`（歷史命名） | 承接外部文件、來源集合、上傳與 ingestion 邊界。 |

`knowledge` 與 `knowledge-base` 是目前最核心的 differentiating domains：前者擁有知識頁面與可編輯內容生命週期，後者擁有組織級知識資產與可驗證發布語意。

### 2.2 Retrieval & Reasoning

| Bounded Context | 代表概念 | 角色 |
| --- | --- | --- |
| `ai` | `IngestionJob`, stage progression, chunk/index preparation | 協調文件攝入、worker handoff 與 ingestion 狀態流轉。 |
| `search` | `RagRetrievedChunk`, `RagCitation`, retrieval summary, `WikiCitation`（歷史命名） | 承接 semantic retrieval、citation context、query support。 |
| `notebook` | Thread、Message、Notebook Generation | 承接 ask/cite、摘要、研究與知識生成體驗。 |

### 2.3 Foundation、Execution 與治理

| Bounded Context | 代表概念 | 角色 |
| --- | --- | --- |
| `workspace` | `Workspace`, `Capability`, `WorkspaceGrant`, `WikiContentTree`（歷史命名） | 提供知識與流程掛載的協作容器。 |
| `workspace-flow` | Task、Issue、Invoice、`SourceReference` | 將知識審批結果物化為可執行工作流程。 |
| `workspace-feed` | Feed Post、Reaction、Reply | 承接工作區活動流與互動可見性。 |
| `workspace-scheduling` | Work Demand、capacity coordination | 承接排程與需求對齊。 |
| `workspace-audit` | append-only audit records | 承接治理與 traceability。 |
| `identity`, `account`, `organization`, `notification`, `shared` | identity、policy、tenant、notification、event primitives | 提供平台共通基礎能力。 |

---

## 三、跨上下文契約

Xuanwu 的跨上下文協作不透過隱式共享實作，而透過 public `api/` surface 或 published domain events。

| 上游 | 契約 | 下游 | 說明 |
| --- | --- | --- | --- |
| `knowledge` | `knowledge.page_approved` | `workspace-flow` | 將審批後的知識頁面物化為 Task / Invoice，並保留 `sourceReference`。 |
| `knowledge` | `knowledge.page_promoted` | `knowledge-base` | 將頁面提升為組織級 article 或其他知識資產。 |
| `knowledge` | `knowledge.block_updated` | `ai` / `search` | 觸發 ingestion 或可檢索表示的重整。 |
| `source` | source registration / ingestion request | `ai` | 外部內容先經來源邊界，再進入 ingestion pipeline。 |
| `ai` | `ai.ingestion_completed` | `search` | 宣告內容已進入可檢索狀態。 |
| `search` | `search/api` | `notebook` | Notebook 透過同步查詢取得 ask/cite 與 retrieval context。 |
| `organization` / `workspace` | workspace / tenant policy | `workspace-*`, `knowledge*`, `source` | 提供治理與容器邊界。 |

這些契約的重點不在名詞本身，而在 owner 清楚、方向單向、語意穩定。

---

## 四、執行時與邊界

### 4.1 Runtime Split

| Runtime | 主要責任 |
| --- | --- |
| Next.js | UI、session/auth orchestration、route composition、Server Actions、workspace-scoped interaction flow |
| `py_fn/` | parsing、chunking、embedding、背景 ingestion 與 worker-style pipeline |

Next.js 不承接 parse/chunk/embed 的 worker 邏輯；`py_fn/` 不承接頁面組裝、session 狀態或互動式 UI 邏輯。

### 4.2 邊界規則

1. 跨模組同步互動只能走目標模組的 `api/` surface。
2. 非同步互動只能走 domain events 或其他顯式契約。
3. 外部系統模型不得直接流入 core domain，必須先經 `source` workflow 或 infrastructure adapters 轉譯。
4. bounded-context 細節文件由 `modules/<context>/*.md` 擁有；`docs/ddd/` 只作為戰略 routing 與入口。

---

## 五、歷史術語與過渡規則

下列名稱已不是 current bounded-context owners，只能在歷史、遷移或 compatibility 說明中出現：

- `wiki`
- `knowledge-graph`
- `retrieval`
- `agent`
- `content`
- `asset`

不過部分型別或局部名稱仍保留歷史詞彙，例如 `WikiLibrary`、`WikiCitation`、`WikiContentTree`。這些名稱應被理解為目前 owner 之下的歷史局部語彙，而不是新的模組邊界。

若未來要恢復 backlink、graph traversal、redirect graph、entity normalization 等能力，必須先在目前 topology 下重新決定 owner。合理候選通常會是：

- `search`：偏檢索與結構查詢能力
- `knowledge`：偏內容關聯與頁面語意能力
- 新 supporting subdomain：若該能力已形成獨立模型與生命週期

---

## 六、閱讀順序

1. 先讀 `docs/ddd/subdomains.md`，確認 strategic classification。
2. 再讀 `docs/ddd/bounded-contexts.md`，確認目前 bounded-context inventory。
3. 依需要進入 `modules/<context>/README.md`、`ubiquitous-language.md`、`aggregates.md`、`domain-events.md`、`repositories.md`、`domain-services.md`。
4. 最後讀 `docs/architecture/` 與 `docs/reference/specification/system-overview.md`，理解跨上下文與 runtime 邊界。

---

本文件的目的是把產品概念與現行 bounded-context 拓樸對齊，而不是維護一份脫離程式碼的「理想模組表」。當實作演進時，應優先更新 `docs/ddd/` root maps 與對應 module docs，再回來同步這份 explanation。