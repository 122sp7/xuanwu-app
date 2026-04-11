# NotebookLM Agent

> Strategic agent documentation: [docs/contexts/notebooklm/AGENT.md](../../docs/contexts/notebooklm/AGENT.md)

## Mission

保護 notebooklm 主域作為對話、來源處理、檢索、grounding 與 synthesis 邊界。

## Route Here When

- 問題核心是 notebook、conversation、source ingestion、retrieval、grounding、synthesis。
- 問題需要處理引用對齊、來源可追溯、模型輸出品質或衍生筆記。
- 問題要把知識來源轉成可對話與可綜合的推理材料。

## Route Elsewhere When

- 正典知識頁面、內容分類、正式發布屬於 notion。
- 身份、授權、權益、憑證治理屬於 platform。
- 共享 AI provider、模型政策、配額與安全護欄屬於 platform.ai。
- 工作區生命週期、共享與存在感屬於 workspace。

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order (Strangler Pattern)

New features:
1. Define Domain (entities, value objects, aggregates, events)
2. Define Application (use cases, DTOs)
3. Define Ports (only if boundary isolation needed)
4. Implement Infrastructure (adapters, persistence)
5. Implement Interfaces (UI, actions, hooks)

Legacy migration:
1. Find a Use Case to extract
2. Build Domain model for that use case
3. Converge Application layer
4. Isolate legacy via Ports
5. Replace Infrastructure adapter
