# NotebookLM

對話、來源處理與推理主域

## Implementation Structure

```text
modules/notebooklm/
├── api/              # Public API boundary
├── application/      # Context-wide orchestration
├── domain/           # Context-wide domain concepts
├── infrastructure/   # Context-wide driven adapters
├── interfaces/       # Context-wide driving adapters
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── ai/              # Active ⚠️ (RAG pipeline: retrieval + grounding + synthesis + evaluation)
    ├── conversation/    # Active
    ├── notebook/        # Active
    ├── source/          # Active
    └── note/            # Planned (Stub)
```

> **Premature stubs** — The following directories exist but are not recommended for expansion. They represent aspirational splits that lack implementation justification:
> `conversation-versioning/`, `evaluation/`, `grounding/`, `ingestion/`, `retrieval/`, `synthesis/`.
> See [Architecture Note](#architecture-note) for the rationale and split triggers.

## Subdomains

### Active

| Subdomain | Purpose | Key Aggregates / Entities |
|-----------|---------|---------------------------|
| conversation | 對話 Thread 與 Message 生命週期管理，含對話版本化關注 | Thread, Message |
| notebook | Notebook 容器組合與 GenKit 回應生成 | AgentGeneration, NotebookRepository |
| source | 來源文件匯入生命週期、RagDocument 狀態機、WikiLibrary 結構化庫、ingestion 編排 | SourceFile, SourceFileVersion, RagDocument, WikiLibrary, SourceRetentionPolicy |
| ai | RAG pipeline：retrieval、grounding、synthesis、evaluation、feedback。過渡子域名稱，長期按需拆分。 | RagRetrievedChunk, RagCitation, RagQuery, RagFeedback, RagGeneration, IKnowledgeContentRepository, IVectorStore |

### Planned

| Subdomain | Purpose | Split Trigger |
|-----------|---------|---------------|
| note | 輕量個人筆記與知識連結 | 使用者需要獨立於 notebook 的筆記模型 |

### Premature Stubs

| Subdomain | Why Premature |
|-----------|---------------|
| conversation-versioning | 版本化是 conversation 的內部關注，語言與演化速率一致，非獨立子域 |
| ingestion | source 已涵蓋匯入編排；py_fn 擁有實際解析管線，無獨立領域模型需求 |
| retrieval | 目前由 ai 子域涵蓋，待拆分觸發條件成立時再獨立建立 |
| grounding | 目前由 ai 子域涵蓋，待拆分觸發條件成立時再獨立建立 |
| synthesis | 目前由 ai 子域涵蓋，待拆分觸發條件成立時再獨立建立 |
| evaluation | 目前由 ai 子域涵蓋，待拆分觸發條件成立時再獨立建立 |

## Bounded Contexts

| Cluster | Subdomains | Responsibility |
|---------|------------|----------------|
| Interaction Core | notebook, conversation | 對話容器與互動生命週期 |
| Source & RAG Pipeline | source, ai | 來源管理與 RAG 檢索 / grounding / synthesis / evaluation |
| Personal Knowledge | note | 輕量筆記與知識連結 |

### Domain Invariants

- notebooklm 只擁有衍生推理流程，不擁有正典知識內容。
- shared AI capability 由 platform.ai 提供；notebooklm 擁有 retrieval、grounding、synthesis 的本地語義。
- grounding 應能把輸出對齊到來源證據。
- retrieval 是 synthesis 的上游能力。
- evaluation 應描述品質，而不是單純使用量。
- 任何要成為正式知識內容的輸出，都必須交由 notion 吸收。

## Ubiquitous Language

| Term | Meaning | Owning Subdomain |
|------|---------|------------------|
| Notebook | 聚合對話、來源與衍生筆記的工作單位 | notebook |
| AgentGeneration | GenKit 代理回應生成 | notebook |
| Conversation | Notebook 內的對話執行邊界 | conversation |
| Thread | 一段對話的容器 | conversation |
| Message | 一則輸入或輸出對話項 | conversation |
| Source | 被引用與推理的來源材料 | source |
| SourceFile | 使用者上傳的原始檔案 | source |
| SourceFileVersion | 來源檔案的版本記錄 | source |
| RagDocument | 來源文件在 RAG pipeline 中的表示 | source |
| WikiLibrary | 結構化知識來源庫 | source |
| SourceRetentionPolicy | 來源保留策略 | source |
| Ingestion | 來源匯入、正規化與前處理流程 | source |
| Retrieval | 從來源中召回候選片段的查詢能力 | ai |
| Grounding | 把輸出對齊到來源證據的能力 | ai |
| Citation | 輸出指回來源證據的引用關係 | ai |
| Synthesis | 綜合多來源後生成的衍生輸出 | ai |
| Evaluation | 對輸出品質、回歸結果與效果的評估 | ai |
| RelevanceScore | 檢索結果的相關性分數 | ai |
| RagPrompt | RAG 查詢的提示構建 | ai |
| OrganizationScope | 組織範圍約束 | ai |
| Note | 與 Notebook 關聯的輕量摘記 | note |

### Language Rules

- 使用 Conversation，不使用 Chat。
- 使用 Source 與 Ingestion 區分來源語義與處理流程。
- 使用 Retrieval 與 Grounding 區分召回能力與證據對齊。
- 使用 Synthesis 表示衍生綜合輸出，不稱為正典知識內容。
- 使用 Evaluation 表示品質語言，不用 Analytics 混稱。

### Avoid

| Avoid | Use Instead |
|-------|-------------|
| Chat | Conversation |
| File Import | Ingestion |
| Search Step | Retrieval |
| Verified Answer | Grounded Synthesis |
| Knowledge / Wiki | Synthesis output（正典知識屬 notion） |

## Architecture Note

`ai` 子域是過渡名稱，目前持有 RAG pipeline 的所有職責（retrieval、grounding、synthesis、evaluation、feedback）。這些責任長期可依需求拆分至獨立子域。

**拆分觸發條件（Strangler Pattern，按需遷移）：**

| Target Subdomain | Trigger Condition |
|------------------|-------------------|
| retrieval | 策略複雜到需要獨立領域模型（多重排序、hybrid search） |
| grounding | 引用追溯需要獨立聚合根（citation chains、evidence alignment） |
| synthesis | 生成策略需要獨立 use case 群（多模態、多來源融合） |
| evaluation | 品質語言需要獨立指標模型（回歸測試、benchmark suite） |

**現階段規則：** 新的 RAG 功能仍可加入 `ai` 子域。只有當拆分觸發條件成立時，才遷移 use case 到目標子域。不做一次性大改。

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- Domain must not import infrastructure, interfaces, or external frameworks.
- Cross-module collaboration goes through `api/` only.

## Strategic Documentation

- [Context README](../../docs/contexts/notebooklm/README.md)
- [Subdomains](../../docs/contexts/notebooklm/subdomains.md)
- [Context Map](../../docs/contexts/notebooklm/context-map.md)
- [Ubiquitous Language](../../docs/contexts/notebooklm/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
