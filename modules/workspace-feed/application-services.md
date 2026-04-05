# workspace-feed — Application Services

> **Canonical bounded context:** `workspace-feed`
> **模組路徑:** `modules/workspace-feed/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-feed` 的 application layer 服務與 use cases。內容與 `modules/workspace-feed/application/` 實作保持一致。

## Application Layer 職責

管理工作區的社交動態貼文與互動事件。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/workspace-feed.dto.ts`
- `application/use-cases/workspace-feed.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-feed/README.md`
- 模組 AGENT：`../../../modules/workspace-feed/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-feed/application-services.md`
