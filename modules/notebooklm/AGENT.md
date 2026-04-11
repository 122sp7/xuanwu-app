# NotebookLM Agent

> Strategic agent documentation: [docs/contexts/notebooklm/AGENT.md](../../docs/contexts/notebooklm/AGENT.md)

## Mission

保護 notebooklm 主域作為對話、來源處理、推理輸出、引用對齊、衍生評估與輕量筆記的邊界。核心 RAG pipeline 為：**ingestion → retrieval → grounding → synthesis → evaluation**。notebooklm 擁有衍生推理流程，不擁有正典知識內容。

## Bounded Context Summary

| Aspect | Description |
|--------|-------------|
| Primary role | 對話、來源處理與推理輸出 |
| Upstream | platform（治理、AI capability）、workspace（scope）、notion（knowledge artifact reference） |
| Downstream | 無固定主域級下游；輸出可被其他主域吸收 |
| Core invariant | notebooklm 只能持有衍生推理輸出，不得直接修改 notion 的正典內容 |
| Published language | Notebook reference、Conversation reference、SourceReference、GroundedAnswer |

## Route Here When

- 問題核心是 notebook、conversation、source ingestion、retrieval、grounding、synthesis。
- 問題需要處理引用對齊、來源可追溯、模型輸出品質或衍生筆記。
- 問題要把知識來源（notion artifact、uploaded file）轉成可對話與可綜合的推理材料。
- 問題涉及 RAG 問答、向量檢索、chunks 召回、generation 品質。
- 問題涉及 evaluation、品質評估、回歸比較或 grounding 可信度。
- 問題涉及 note（輕量個人筆記）或 conversation-versioning（對話快照策略）。

## Route Elsewhere When

- 正典知識頁面、文章、分類、正式發布屬於 notion。
- 身份、授權、權益、憑證治理屬於 platform。
- 共享 AI provider、模型政策、配額與安全護欄屬於 platform.ai。
- 工作區生命週期、成員管理、共享範圍屬於 workspace。

## Subdomain Delivery Tiers

### Tier 1 — Core (Active)

| Subdomain | Purpose | Status |
|-----------|---------|--------|
| conversation | 對話 Thread 與 Message 生命週期管理 | Active |
| notebook | Notebook 容器組合與 GenKit 回應生成 | Active |
| source | 來源文件匯入生命週期、RagDocument 狀態機、WikiLibrary | Active |

### Tier 2 — RAG Pipeline (Gap Stubs → Migration Target)

這四個子域是 RAG pipeline 的戰略清單邊界，`ai` 子域的所有責任最終應遷移至此。

| Subdomain | Purpose | Migration From `ai` |
|-----------|---------|---------------------|
| retrieval | 查詢召回與排序策略、向量搜尋 | `IKnowledgeContentRepository`、`IRagRetrievalRepository`、`RagScoringService` |
| grounding | 引用對齊與可追溯證據、`RagCitation` | `RagCitationBuilder`、`RagRetrievedChunk` |
| synthesis | RAG 合成、摘要與洞察生成 | `AnswerRagQueryUseCase`、`RagPromptBuilder`、`GenkitRagGenerationAdapter` |
| evaluation | 品質評估、feedback 收集與回歸比較 | `submit-rag-feedback`、`IRagQueryFeedbackRepository` |

### Tier 3 — Baseline Stubs (Low Priority)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| ingestion | 來源匯入、正規化與前處理的正典邊界 | TypeScript 側協調 py_fn 匯入任務 |
| note | 輕量個人筆記與 Notebook 知識連結 | 獨立於 conversation 的筆記物件 |
| conversation-versioning | 對話版本與快照策略 | 長期從 conversation 切出 |

## Subdomain Analysis — 子域數量合理性

**10 個戰略子域 + 1 個過渡子域（ai），分析如下：**

1. 所有 10 個戰略子域均有獨立語言與責任邊界，不過度重疊。
2. Tier 2（retrieval/grounding/synthesis/evaluation）是 `ai` 過渡子域的遷移目標，不是額外增加的子域。
3. `conversation-versioning` 與 `note` 雖低優先，但保留作為清楚邊界比合併進 `conversation` 更安全。
4. `ingestion` 與 `source` 有分工：`source` 負責來源文件的 TypeScript 側狀態機；`ingestion` 負責 py_fn 工人觸發的協調邊界。分開是正確的。
5. **沒有子域需要刪除**；缺少的是執行優先順序的清楚標示（本次已補上 Tier 標籤）。

## Ubiquitous Language

| Term | Meaning | Do Not Use |
|------|---------|------------|
| Notebook | 聚合對話、來源與衍生筆記的工作單位 | Project, Workspace |
| Conversation | Notebook 內的對話執行邊界（Thread + Messages） | Chat, Session |
| Message | 一則輸入或輸出對話項 | Turn, Exchange |
| Source | 被引用與推理的來源材料 | File, Document (generic) |
| Ingestion | 來源匯入、正規化與前處理流程 | File Import, Upload |
| Retrieval | 從來源中召回候選 Chunk 的查詢能力 | Search, Lookup |
| Grounding | 把輸出對齊到來源證據的能力 | Verification, Factcheck |
| Citation | 輸出指回來源證據的引用關係 | Reference, Link |
| Synthesis | 綜合多來源後生成的衍生輸出 | Answer, Response (generic) |
| Note | 與 Notebook 關聯的輕量摘記 | Comment, Annotation |
| Evaluation | 對輸出品質、回歸結果與效果的評估 | Analytics, Metrics (generic) |
| VersionSnapshot | 對話或 Notebook 某一時點的不可變快照 | History, Backup |

## Architecture Note — ai Subdomain Tech Debt

`ai` 子域是此模組的主要架構技術債。它在早期開發中吸收了四個戰略子域的責任，但 `ai` 本身不在戰略子域清單中。

**現況持有責任**：
- `retrieval`：`IKnowledgeContentRepository`、`IRagRetrievalRepository`、`RagRetrievedChunk`、`RagScoringService`
- `grounding`：`RagCitationBuilder`、`RagCitation`、`RelevanceScore`
- `synthesis`：`AnswerRagQueryUseCase`、`RagPromptBuilder`、`GenkitRagGenerationAdapter`
- `evaluation`：`submit-rag-feedback`、`IRagQueryFeedbackRepository`、`RagFeedback`

**遷移規則**：
- 新功能必須加進對應 Tier 2 目標子域，不得繼續擴大 `ai`。
- 遷移以單個 use case 為單位（Strangler Pattern），不做一次性大改。
- 遷移優先順序：retrieval → grounding → synthesis → evaluation。

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
api/ ← 唯一跨模組入口
```

## Development Order (Domain-First)

New features:
1. Define Domain (entities, value objects, aggregates, events)
2. Define Application (use cases, DTOs)
3. Define Ports (only if boundary isolation needed)
4. Implement Infrastructure (adapters, persistence)
5. Implement Interfaces (UI, actions, hooks)

Legacy migration (Strangler Pattern):
1. Find a Use Case to extract from `ai`
2. Build Domain model in the target Tier 2 subdomain
3. Converge Application layer; route old entry to new use case
4. Isolate legacy via Ports
5. Replace Infrastructure adapter; remove old path when stable
