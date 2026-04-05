# ai — Application Services

> **Canonical bounded context:** `ai`
> **模組路徑:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `ai` 的 application layer 服務與 use cases。內容與 `modules/ai/application/` 實作保持一致。

## Application Layer 職責

協調 RAG ingestion job 的生命週期，將重型 parse/chunk/embed 工作交給 py_fn/ 執行。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/link-extractor.service.ts`
- `application/use-cases/advance-ingestion-stage.use-case.ts`
- `application/use-cases/register-ingestion-document.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/ai/README.md`
- 模組 AGENT：`../../../modules/ai/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/ai/application-services.md`
