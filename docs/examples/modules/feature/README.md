# Feature Docs

這裡整理單一 bounded context 內的 use case 文件。

重點是說明這個功能做什麼。
並遵循 Hexagonal + DDD 與 semantic-first 的業務語言設計。

## Current Feature Write-ups

- [notebooklm-source-processing-task-flow.md](./notebooklm-source-processing-task-flow.md) — `notebooklm/source` 的 parse / RAG / Knowledge Page / Task Flow 單一功能說明。
- [workspace-nav-notion-notebooklm-implementation-guide.md](./workspace-nav-notion-notebooklm-implementation-guide.md) — Notion & NotebookLM workspace nav tab 三層模型設計與後續實作指南（Data / Behavior / UI）。
- [py-fn-ts-capability-bridge.md](./py-fn-ts-capability-bridge.md) — **gap 分析**：py_fn 已有的真實能力（parse_document, rag_query callables, Firestore document schema）與 TypeScript `src/modules/notebooklm` 側現有 stubs 的對照，以及三種橋接模式（Firestore 訂閱 / HTTPS Callable / GCS 上傳觸發）與各 tab 的優先實作路徑。
