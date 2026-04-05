# search — Application Services

> **Canonical bounded context:** `search`
> **模組路徑:** `modules/search/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `search` 的 application layer 服務與 use cases。內容與 `modules/search/application/` 實作保持一致。

## Application Layer 職責

提供向量檢索、RAG answer 生成與查詢反饋收集。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/answer-rag-query.use-case.ts`
- `application/use-cases/submit-rag-feedback.use-case.ts`
- `application/use-cases/wiki-rag.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/search/README.md`
- 模組 AGENT：`../../../modules/search/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/search/application-services.md`
