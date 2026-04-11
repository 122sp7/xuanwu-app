# NotebookLM Agent

> Strategic agent documentation: [docs/contexts/notebooklm/AGENT.md](../../docs/contexts/notebooklm/AGENT.md)

## Mission

保護 notebooklm 主域作為對話、來源處理、檢索、grounding、synthesis、評估與筆記邊界。核心 pipeline 為：ingestion → retrieval → grounding → synthesis → evaluation。

## Route Here When

- 問題核心是 notebook、conversation、source ingestion、retrieval、grounding、synthesis。
- 問題需要處理引用對齊、來源可追溯、模型輸出品質或衍生筆記。
- 問題要把知識來源轉成可對話與可綜合的推理材料。
- 問題涉及 RAG 問答、向量檢索、chunks 召回、generation 品質。
- 問題涉及 evaluation、品質評估、回歸比較或 grounding 可信度。
- 問題涉及 note（輕量個人筆記）或 conversation-versioning（對話快照策略）。

## Route Elsewhere When

- 正典知識頁面、內容分類、正式發布屬於 notion。
- 身份、授權、權益、憑證治理屬於 platform。
- 共享 AI provider、模型政策、配額與安全護欄屬於 platform.ai。
- 工作區生命週期、共享與存在感屬於 workspace。

## Architecture Note — ai Subdomain Tech Debt

`ai` 子域目前是此主域的過渡 adapter，持有 RAG 查詢 (`IKnowledgeContentRepository`)、向量檢索實體 (`RagRetrievedChunk`)、引用實體 (`RagCitation`)、synthesis use case (`AnswerRagQueryUseCase`) 與早期 feedback 流程。

這些責任長期應依戰略清單逐步遷移至：`retrieval`、`grounding`、`synthesis`、`evaluation`。

新功能應**優先加進目標子域**（如新的 retrieval 策略請放 `retrieval/`），不要繼續擴大 `ai` 子域範圍。用 Strangler Pattern：只在搬遷時加入 use case contract，不做一次性大改。

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
