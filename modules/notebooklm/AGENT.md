# NotebookLM Agent

> Strategic agent documentation: [docs/contexts/notebooklm/AGENT.md](../../docs/contexts/notebooklm/AGENT.md)

## Mission

保護 notebooklm 主域作為對話、來源處理、檢索、grounding、synthesis 與評估邊界。核心 pipeline 為：source (ingestion) → retrieval → grounding → synthesis → evaluation。notebooklm 擁有衍生推理流程，不擁有正典知識內容。

## Route Here When

- 問題核心是 notebook、conversation、source ingestion、retrieval、grounding、synthesis。
- 問題需要處理引用對齊、來源可追溯、模型輸出品質或衍生筆記。
- 問題要把知識來源轉成可對話與可綜合的推理材料。
- 問題涉及 RAG 問答、向量檢索、chunks 召回、generation 品質。
- 問題涉及 evaluation、品質評估、回歸比較或 grounding 可信度。
- 問題涉及 note（輕量個人筆記）。

## Route Elsewhere When

- 正典知識頁面、內容分類、正式發布屬於 notion。
- 身份、授權、權益、憑證治理屬於 platform。
- 共享 AI provider、模型政策、配額與安全護欄屬於 platform.ai。
- 工作區生命週期、共享與存在感屬於 workspace。

## Bounded Contexts

| Cluster | Subdomains | Responsibility |
|---------|------------|----------------|
| Interaction Core | notebook, conversation | 對話容器與互動生命週期 |
| Source & RAG Pipeline | source, ai | 來源管理與 RAG 檢索 / grounding / synthesis / evaluation |
| Personal Knowledge | note | 輕量筆記與知識連結 |

## Subdomains

### Active

| Subdomain | Purpose |
|-----------|---------|
| conversation | 對話 Thread 與 Message 生命週期管理，含對話版本化關注 |
| notebook | Notebook 容器組合與 GenKit 回應生成 |
| source | 來源文件匯入生命週期、RagDocument 狀態機、WikiLibrary 結構化庫、ingestion 編排 |
| ai | RAG pipeline：retrieval、grounding、synthesis、evaluation、feedback。過渡子域名稱，長期按需拆分（見 Architecture Note）。 |

### Planned

| Subdomain | Purpose | Split Trigger |
|-----------|---------|---------------|
| note | 輕量個人筆記與知識連結 | 使用者需要獨立於 notebook 的筆記模型 |

### Premature Stubs（已存在目錄但不建議擴充）

| Subdomain | Reason |
|-----------|--------|
| conversation-versioning | 版本化是 conversation 的內部關注，語言與演化速率一致，非獨立子域 |
| ingestion | source 已涵蓋匯入編排；py_fn 擁有實際解析管線，無獨立領域模型需求 |
| retrieval | 目前由 ai 子域涵蓋，待 ai 拆分時再獨立建立 |
| grounding | 目前由 ai 子域涵蓋，待 ai 拆分時再獨立建立 |
| synthesis | 目前由 ai 子域涵蓋，待 ai 拆分時再獨立建立 |
| evaluation | 目前由 ai 子域涵蓋，待 ai 拆分時再獨立建立 |

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
| RagDocument | 來源文件在 RAG pipeline 中的表示 | source |
| WikiLibrary | 結構化知識來源庫 | source |
| Ingestion | 來源匯入、正規化與前處理流程 | source |
| Retrieval | 從來源中召回候選片段的查詢能力 | ai |
| Grounding | 把輸出對齊到來源證據的能力 | ai |
| Citation | 輸出指回來源證據的引用關係 | ai |
| Synthesis | 綜合多來源後生成的衍生輸出 | ai |
| Evaluation | 對輸出品質、回歸結果與效果的評估 | ai |
| RelevanceScore | 檢索結果的相關性分數 | ai |
| RagPrompt | RAG 查詢的提示構建 | ai |
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

## Architecture Note — ai Subdomain Transition

`ai` 子域是過渡名稱，持有 `IKnowledgeContentRepository`、`RagRetrievedChunk`、`RagCitation`、`AnswerRagQueryUseCase`、`submit-rag-feedback` 等 RAG pipeline 責任。

**拆分觸發條件（按需拆分，Strangler Pattern）：**
- retrieval 策略複雜到需要獨立領域模型（多重排序、hybrid search）
- grounding 引用追溯需要獨立聚合根（citation chains、evidence alignment）
- synthesis 生成策略需要獨立 use case 群（多模態、多來源融合）
- evaluation 品質語言需要獨立指標模型（回歸測試、benchmark suite）

**現階段規則：** 新的 RAG 功能仍可加入 `ai` 子域。只有當拆分觸發條件成立時，才遷移 use case 到目標子域。

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

New features:
1. Define Domain (entities, value objects, aggregates, events)
2. Define Application (use cases, DTOs)
3. Define Ports (only if boundary isolation needed)
4. Implement Infrastructure (adapters, persistence)
5. Implement Interfaces (UI, actions, hooks)

Legacy migration (Strangler Pattern):
1. Find a Use Case to extract
2. Build Domain model for that use case
3. Converge Application layer
4. Isolate legacy via Ports
5. Replace Infrastructure adapter
