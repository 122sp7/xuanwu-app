# source — Application Services

> **Canonical bounded context:** `source`
> **模組路徑:** `modules/source/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `source` 的 application layer 服務與 use cases。內容與 `modules/source/application/` 實作保持一致。

## Application Layer 職責

管理文件上傳生命週期、版本快照與 RAG 文件登記。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/file.dto.ts`
- `application/dto/rag-document.dto.ts`
- `application/index.ts`
- `application/use-cases/list-workspace-files.use-case.ts`
- `application/use-cases/register-uploaded-rag-document.use-case.ts`
- `application/use-cases/upload-complete-file.use-case.ts`
- `application/use-cases/upload-init-file.use-case.ts`
- `application/use-cases/wiki-libraries.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/source/README.md`
- 模組 AGENT：`../../../modules/source/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/source/application-services.md`
