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
    ├── ai/                      # Active ⚠️
    ├── conversation/            # Active
    ├── notebook/                # Active
    ├── source/                  # Active
    ├── conversation-versioning/ # Stub (Baseline)
    ├── note/                    # Stub (Baseline)
    ├── synthesis/               # Stub (Baseline)
    ├── evaluation/              # Stub (Gap)
    ├── grounding/               # Stub (Gap)
    ├── ingestion/               # Stub (Gap)
    └── retrieval/               # Stub (Gap)
```

## Subdomains

### Active

| Subdomain | Status | Purpose |
|-----------|--------|---------|
| ai | Active ⚠️ | RAG 問答、檢索、grounded 生成與回饋收集。命名技術債：此子域非戰略清單中的合法子域，長期目標為拆分至 retrieval / grounding / synthesis，詳見 Architecture Note。 |
| conversation | Active | 對話 Thread 與 Message 生命週期管理 |
| notebook | Active | Notebook 容器組合與 GenKit 回應生成 |
| source | Active | 來源文件匯入生命週期、RagDocument 狀態機與 WikiLibrary 結構化庫 |

### Baseline Stubs

| Subdomain | Status | Purpose |
|-----------|--------|---------|
| conversation-versioning | Stub | 對話版本快照策略（長期拆出 conversation） |
| note | Stub | 輕量個人筆記與知識連結 |
| synthesis | Stub | RAG 合成、摘要與洞察生成（長期接收 ai 子域的合成責任） |

### Recommended Gap Stubs

| Subdomain | Status | Purpose |
|-----------|--------|---------|
| evaluation | Stub | 品質評估與回歸比較（獨立於 ai 子域的早期回饋收集） |
| grounding | Stub | 引用對齊與可追溯證據（長期接收 ai 子域的 citation 責任） |
| ingestion | Stub | 來源匯入、正規化與前處理（長期接收 source 子域的匯入責任） |
| retrieval | Stub | 查詢召回與排序策略（長期接收 ai 子域的向量檢索責任） |

## Architecture Note

`ai` 子域是此模組的主要架構技術債。它在早期開發中吸收了四個戰略子域的責任（retrieval、grounding、synthesis、early evaluation），但 `ai` 本身並不在 [strategic subdomain docs](../../docs/contexts/notebooklm/subdomains.md) 的合法清單中。

**現況**：`ai` 持有 `IKnowledgeContentRepository` port、`RagRetrievedChunk` / `RagCitation` entities、`AnswerRagQueryUseCase` orchestration、以及 `submit-rag-feedback` 回饋流程。

**長期目標**：以單個 use case 為單位，漸進將各責任遷移至 `retrieval`、`grounding`、`synthesis`、`evaluation` 子域（Strangler Pattern）。在遷移完成前，`ai` 子域保留作為過渡 adapter。

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
