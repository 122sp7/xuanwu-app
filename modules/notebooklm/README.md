# NotebookLM

對話、來源處理與推理主域

## Bounded Context

| Aspect | Description |
|--------|-------------|
| Primary role | 對話、來源處理、檢索與推理輸出 |
| Upstream | platform（治理、AI capability）、workspace（scope）、notion（knowledge artifact, attachment reference） |
| Downstream | 無固定主域級下游；GroundedAnswer 可被其他主域消費 |
| Core principle | notebooklm 擁有衍生推理流程，不擁有正典知識內容 |
| Cross-module boundary | `api/` only — no direct import of notion/platform/workspace internals |

## Ubiquitous Language

| Term | Meaning |
|------|---------|
| Notebook | 聚合對話、來源與衍生筆記的工作單位 |
| Conversation | Notebook 內的對話執行邊界（Thread + Messages） |
| Message | 一則輸入或輸出對話項 |
| Source | 被引用與推理的來源材料 |
| Ingestion | 來源匯入、正規化與前處理流程（TypeScript 側協調 py_fn） |
| Retrieval | 從來源中召回候選 Chunk 的查詢能力（向量搜尋） |
| Grounding | 把輸出對齊到來源證據、建立 Citation 的能力 |
| Citation | 輸出指回來源證據的引用關係 |
| Synthesis | 綜合多來源後生成的衍生輸出（RAG generation） |
| Note | 與 Notebook 關聯的輕量摘記 |
| Evaluation | 對輸出品質、feedback 與回歸結果的評估 |
| VersionSnapshot | 對話或 Notebook 某一時點的不可變快照 |

## Implementation Structure

```text
modules/notebooklm/
├── api/              # Public API boundary — cross-module entry point only
├── application/      # Context-wide orchestration (empty, use subdomain layers)
├── domain/           # Context-wide domain concepts (empty, use subdomain layers)
├── infrastructure/   # Context-wide driven adapters (empty, use subdomain layers)
├── interfaces/       # Context-wide driving adapters (empty, use subdomain layers)
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── ai/                      # ⚠️ TRANSITIONAL ONLY — migrating to Tier 2
    ├── conversation/            # Tier 1 — Active
    ├── notebook/                # Tier 1 — Active
    ├── source/                  # Tier 1 — Active
    ├── retrieval/               # Tier 2 — Stub (migration target from ai)
    ├── grounding/               # Tier 2 — Stub (migration target from ai)
    ├── synthesis/               # Tier 2 — Stub (migration target from ai)
    ├── evaluation/              # Tier 2 — Stub (migration target from ai)
    ├── ingestion/               # Tier 3 — Stub (py_fn orchestration boundary)
    ├── note/                    # Tier 3 — Stub (lightweight notebook notes)
    └── conversation-versioning/ # Tier 3 — Stub (snapshot strategy)
```

## Subdomains

### Tier 1 — Core (Active)

| Subdomain | Purpose | Key Aggregates / Entities |
|-----------|---------|--------------------------|
| conversation | 對話 Thread 與 Message 生命週期管理 | Thread, Message |
| notebook | Notebook 容器組合與 GenKit 回應生成 | AgentGeneration |
| source | 來源文件匯入生命週期、RagDocument 狀態機、WikiLibrary | RagDocument, WikiLibrary |

### Tier 2 — RAG Pipeline Stubs (Migration Target from `ai`)

這四個子域是 `ai` 過渡子域的戰略接收邊界。每次新的 RAG pipeline 功能，優先在此實作，不得擴大 `ai`。

| Subdomain | Purpose | 遷移自 `ai` 的責任 |
|-----------|---------|------------------|
| retrieval | 查詢召回與排序策略、向量搜尋 | `IRagRetrievalRepository`、`RagScoringService`、`RagRetrievedChunk` |
| grounding | 引用對齊與可追溯證據 | `RagCitationBuilder`、`RagCitation`、`RelevanceScore` |
| synthesis | RAG 合成、摘要與洞察生成 | `AnswerRagQueryUseCase`、`RagPromptBuilder`、`GenkitRagGenerationAdapter` |
| evaluation | 品質評估、feedback 收集與回歸比較 | `IRagQueryFeedbackRepository`、`submit-rag-feedback`、`RagFeedback` |

### Tier 3 — Baseline Stubs (Low Priority)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| ingestion | 來源匯入、正規化與前處理（TypeScript 側協調 py_fn 任務） | source 負責狀態機；ingestion 負責工人觸發協調 |
| note | 輕量個人筆記與 Notebook 知識連結 | 獨立於 conversation thread 的筆記物件 |
| conversation-versioning | 對話版本與快照策略 | 長期從 conversation 切出；保留邊界比合併安全 |

### Transitional (Non-Strategic)

| Subdomain | Status | Migration Path |
|-----------|--------|---------------|
| ai | ⚠️ Tech debt — 零新功能 | Tier 2：retrieval → grounding → synthesis → evaluation（Strangler Pattern） |

## Subdomain Analysis

**子域數量分析（10 戰略 + 1 過渡 = 11 目錄）**

- ✅ 無子域需要刪除：每個子域有獨立語言邊界。
- ✅ `ingestion` 與 `source` 分工正確：`source` 是 TypeScript 側的文件狀態機；`ingestion` 是 py_fn 工人觸發的協調邊界。
- ✅ `retrieval`/`grounding`/`synthesis`/`evaluation` 是 RAG pipeline 的正確戰略切割，不是額外增加——它們是 `ai` 的替代品。
- ✅ `conversation-versioning` 與 `note` 保留為獨立邊界比合併進 `conversation` 更符合 DDD。
- ⚠️ `ai` 是唯一需要主動縮小的子域——新功能一律導向 Tier 2。

## Architecture Note — ai Subdomain Migration

`ai` 子域在早期開發中吸收了四個戰略子域的責任，形成技術債：

| `ai` 中的責任 | 遷移目標 |
|-------------|---------|
| `IKnowledgeContentRepository` | `retrieval` |
| `IRagRetrievalRepository`、`RagScoringService` | `retrieval` |
| `RagCitationBuilder`、`RagCitation` | `grounding` |
| `AnswerRagQueryUseCase`、`RagPromptBuilder` | `synthesis` |
| `GenkitRagGenerationAdapter` | `synthesis` |
| `IRagQueryFeedbackRepository`、feedback | `evaluation` |

遷移規則：以單個 use case 為單位（Strangler Pattern）；每個 use case 先在目標子域建立 domain model → application use case → infrastructure adapter → 切換入口 → 移除舊路徑。

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- `domain/` must not import infrastructure, interfaces, React, Firebase SDK, or any runtime framework.
- Cross-module collaboration goes through `api/` only.

## Strategic Documentation

- [Context README](../../docs/contexts/notebooklm/README.md)
- [Subdomains](../../docs/contexts/notebooklm/subdomains.md)
- [Bounded Context](../../docs/contexts/notebooklm/bounded-contexts.md)
- [Context Map](../../docs/contexts/notebooklm/context-map.md)
- [Ubiquitous Language](../../docs/contexts/notebooklm/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
