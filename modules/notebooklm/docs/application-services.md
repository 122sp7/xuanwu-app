# notebook — Application Services

> **Canonical bounded context:** `notebook`
> **模組路徑:** `modules/notebooklm/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `notebook` 的 application layer 服務與 use cases。內容與 `modules/notebooklm/application/` 實作保持一致。

## Application Layer 職責

管理 AI 對話 Thread/Message，並封裝模型生成回應。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/index.ts`
- `application/use-cases/answer-rag-query.use-case.ts`
- `application/use-cases/generate-agent-response.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/notebooklm/README.md`
- 模組 AGENT：`../../../modules/notebooklm/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/notebooklm/application-services.md`
