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
├── domain/           # Context-wide domain concepts (events, published-language)
├── infrastructure/   # Context-wide driven adapters (empty, use subdomain layers)
├── interfaces/       # Context-wide driving adapters (empty, use subdomain layers)
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── ai/                      # ⚠️ TRANSITIONAL — migrating to Tier 2
    ├── conversation/            # Tier 1 — Active
    ├── notebook/                # Tier 1 — Active
    ├── source/                  # Tier 1 — Active
    ├── retrieval/               # Tier 2 — Domain contracts (migration target)
    ├── grounding/               # Tier 2 — Domain contracts (migration target)
    ├── synthesis/               # Tier 2 — Domain contracts (migration target)
    ├── evaluation/              # Tier 2 — Domain contracts (migration target)
    ├── note/                    # Planned — Stub
    ├── ingestion/               # Premature — absorbed by source
    └── conversation-versioning/ # Premature — absorbed by conversation
```

> **Premature stubs** — `ingestion/` and `conversation-versioning/` directories exist but are not recommended for expansion. See [Premature Stubs](#premature-stubs) for rationale.

## Subdomains

### Tier 1 — Core (Active)

| Subdomain | Purpose | Key Aggregates / Entities |
|-----------|---------|--------------------------|
| conversation | 對話 Thread 與 Message 生命週期管理 | Thread, Message |
| notebook | Notebook 容器組合與 GenKit 回應生成 | AgentGeneration |
| source | 來源文件匯入生命週期、RagDocument 狀態機、WikiLibrary、ingestion 編排 | SourceFile, SourceFileVersion, RagDocument, WikiLibrary |

### Tier 2 — RAG Pipeline (Domain Contracts — Migration Target from `ai`)

這四個子域持有 domain contracts（entities、ports、events），是 `ai` 子域的戰略遷移接收邊界。新的 RAG 功能仍可加入 `ai`，但只有當拆分觸發條件成立時才遷移。

| Subdomain | Purpose | 遷移自 `ai` 的責任 | Split Trigger |
|-----------|---------|------------------|---------------|
| retrieval | 查詢召回與排序策略、向量搜尋 | `IRagRetrievalRepository`、`RagScoringService`、`RagRetrievedChunk` | 策略複雜到需要獨立領域模型（多重排序、hybrid search） |
| grounding | 引用對齊與可追溯證據 | `RagCitationBuilder`、`RagCitation`、`RelevanceScore` | 引用追溯需要獨立聚合根（citation chains、evidence alignment） |
| synthesis | RAG 合成、摘要與洞察生成 | `AnswerRagQueryUseCase`、`RagPromptBuilder`、`GenkitRagGenerationAdapter` | 生成策略需要獨立 use case 群（多模態、多來源融合） |
| evaluation | 品質評估、feedback 收集與回歸比較 | `IRagQueryFeedbackRepository`、`submit-rag-feedback`、`RagFeedback` | 品質語言需要獨立指標模型（回歸測試、benchmark suite） |

### Planned

| Subdomain | Purpose | Split Trigger |
|-----------|---------|---------------|
| note | 輕量個人筆記與 Notebook 知識連結 | 使用者需要獨立於 notebook 的筆記模型 |

### Premature Stubs

以下目錄存在但不建議擴充：

| Subdomain | Reason |
|-----------|--------|
| conversation-versioning | 版本化是 conversation 的內部關注，語言與演化速率一致，非獨立子域 |
| ingestion | source 子域已涵蓋匯入編排（SourceFile → RagDocument 狀態機）；py_fn 擁有實際解析管線，無獨立領域模型需求 |

### Transitional (Non-Strategic)

| Subdomain | Status | Migration Path |
|-----------|--------|---------------|
| ai | ⚠️ Transition — 持有 RAG 全部職責 | Tier 2：retrieval → grounding → synthesis → evaluation（Strangler Pattern，按需遷移） |

## Subdomain Analysis

**子域數量分析（3 Active + 4 Domain Contracts + 1 Planned + 2 Premature + 1 Transitional = 11 目錄）**

- ✅ Tier 2（retrieval/grounding/synthesis/evaluation）是 `ai` 的遷移目標形狀，持有零成本 domain contracts（interfaces + types），不是額外日常維護負擔。
- ✅ `source` 吸收了 `ingestion` 的編排責任，`conversation` 吸收了版本化關注。
- ✅ `note` 保留為 Planned，待使用者需求出現時再充實。
- ⚠️ `ai` 是唯一需要主動縮小的子域——當拆分觸發條件成立時遷移。

## Architecture Note — ai Subdomain Transition

`ai` 子域是過渡名稱，目前持有 RAG pipeline 的所有職責。Tier 2 子域持有 domain contracts（entities、ports、events）作為遷移目標形狀。

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
- `domain/` must not import infrastructure, interfaces, React, Firebase SDK, or any runtime framework.
- Cross-module collaboration goes through `api/` only.

## Strategic Documentation

- [Context README](../../docs/contexts/notebooklm/README.md)
- [Subdomains](../../docs/contexts/notebooklm/subdomains.md)
- [Bounded Context](../../docs/contexts/notebooklm/bounded-contexts.md)
- [Context Map](../../docs/contexts/notebooklm/context-map.md)
- [Ubiquitous Language](../../docs/contexts/notebooklm/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
