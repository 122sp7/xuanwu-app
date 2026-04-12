# NotebookLM Agent

> Strategic agent documentation: [docs/contexts/notebooklm/AGENT.md](../../docs/contexts/notebooklm/AGENT.md)

## Mission

保護 notebooklm 主域作為對話、來源處理與推理輸出的邊界。notebooklm 擁有衍生推理流程，不擁有正典知識內容。任何變更都應維持 notebooklm 擁有對話生命週期、來源管理與 RAG pipeline 語言，而不是吸收平台治理或正典知識語言。

## Bounded Context Summary

| Aspect | Description |
|--------|-------------|
| Primary role | 對話、來源處理與推理輸出 |
| Upstream | platform（治理、AI capability）、workspace（scope）、notion（knowledge artifact reference） |
| Downstream | 無固定主域級下游；輸出可被其他主域吸收 |
| Core invariant | notebooklm 只能持有衍生推理輸出，不得直接修改 notion 的正典內容 |
| Published language | Notebook reference、Conversation reference、SourceReference、GroundedAnswer |

## Bounded Contexts

| Cluster | Subdomains | Responsibility |
|---------|------------|----------------|
| Interaction Core | notebook, conversation | 對話容器與互動生命週期 |
| Source & RAG Pipeline | source, synthesis | 來源管理與完整 RAG pipeline（retrieval → grounding → synthesis → evaluation） |

## Route Here When

- 問題核心是 notebook、conversation、source、synthesis（RAG pipeline）。
- 問題需要處理引用對齊、來源可追溯、模型輸出品質或衍生筆記。
- 問題要把知識來源（notion artifact、uploaded file）轉成可對話與可綜合的推理材料。
- 問題涉及 RAG 問答、向量檢索、chunks 召回、generation 品質。
- 問題涉及 evaluation、品質評估、回歸比較或 grounding 可信度。

## Route Elsewhere When

- 正典知識頁面、文章、分類、正式發布屬於 notion。
- 身份、授權、權益、憑證治理屬於 platform。
- 共享 AI provider、模型政策、配額與安全護欄屬於 platform.ai。
- 工作區生命週期、成員管理、共享範圍屬於 workspace。

## Subdomains

| Subdomain | Purpose | Key Aggregates / Entities |
|-----------|---------|---------------------------|
| conversation | 對話 Thread 與 Message 生命週期管理 | Thread, Message |
| notebook | Notebook 容器組合與 GenKit 回應生成 | AgentGeneration, NotebookRepository |
| source | 來源文件匯入生命週期、RagDocument 狀態機、WikiLibrary、ingestion 編排 | SourceFile, SourceFileVersion, RagDocument, WikiLibrary, SourceRetentionPolicy |
| synthesis | 完整 RAG pipeline：retrieval、grounding、synthesis、evaluation | AnswerRagQueryUseCase, RagScoringService, RagCitationBuilder, RagPromptBuilder |

### Future Split Triggers

`synthesis` 子域將四個 RAG 關注點作為內部 facets 持有。只有當以下觸發條件成立時，才拆分為獨立子域：

| Facet | Split Trigger |
|-------|---------------|
| retrieval | 策略複雜到需要獨立領域模型（多重排序、hybrid search） |
| grounding | 引用追溯需要獨立聚合根（citation chains、evidence alignment） |
| generation | 生成策略需要獨立 use case 群（多模態、多來源融合） |
| evaluation | 品質語言需要獨立指標模型（回歸測試、benchmark suite） |

### Domain Invariants

- notebooklm 只擁有衍生推理流程，不擁有正典知識內容。
- shared AI capability 由 platform.ai 提供；notebooklm 在 synthesis 擁有 retrieval、grounding、generation、evaluation 的本地語義。
- grounding 應能把輸出對齊到來源證據。
- retrieval 是 generation 的上游能力。
- evaluation 應描述品質，而不是單純使用量。
- 任何要成為正式知識內容的輸出，都必須交由 notion 吸收。

## Ubiquitous Language

| Term | Meaning | Owning Subdomain | Do Not Use |
|------|---------|------------------|------------|
| Notebook | 聚合對話、來源與衍生筆記的工作單位 | notebook | Project, Workspace |
| AgentGeneration | GenKit 代理回應生成 | notebook | - |
| Conversation | Notebook 內的對話執行邊界 | conversation | Chat, Session |
| Thread | 一段對話的容器 | conversation | - |
| Message | 一則輸入或輸出對話項 | conversation | Turn, Exchange |
| Source | 被引用與推理的來源材料 | source | File, Document (generic) |
| SourceFile | 使用者上傳的原始檔案 | source | - |
| RagDocument | 來源文件在 RAG pipeline 中的表示 | source | - |
| WikiLibrary | 結構化知識來源庫 | source | - |
| Ingestion | 來源匯入、正規化與前處理流程 | source | File Import, Upload |
| Retrieval | 從來源中召回候選片段的查詢能力 | synthesis | Search, Lookup |
| Grounding | 把輸出對齊到來源證據的能力 | synthesis | Verification, Factcheck |
| Citation | 輸出指回來源證據的引用關係 | synthesis | Reference, Link |
| Synthesis | 綜合多來源後生成的衍生輸出 | synthesis | Answer, Response (generic) |
| Evaluation | 對輸出品質、回歸結果與效果的評估 | synthesis | Analytics, Metrics (generic) |
| RelevanceScore | 檢索結果的相關性分數 | synthesis | - |

### Avoid

| Avoid | Use Instead |
|-------|-------------|
| Chat | Conversation |
| File Import | Ingestion |
| Search Step | Retrieval |
| Verified Answer | Grounded Synthesis |
| Knowledge / Wiki | Synthesis output（正典知識屬 notion） |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
api/ ← 唯一跨模組入口
```

## Development Order (Domain-First)

1. Define Domain (entities, value objects, aggregates, events)
2. Define Application (use cases, DTOs)
3. Define Ports (only if boundary isolation needed)
4. Implement Infrastructure (adapters, persistence)
5. Implement Interfaces (UI, actions, hooks)
