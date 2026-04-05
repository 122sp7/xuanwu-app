# workspace-scheduling — Application Services

> **Canonical bounded context:** `workspace-scheduling`
> **模組路徑:** `modules/workspace-scheduling/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-scheduling` 的 application layer 服務與 use cases。內容與 `modules/workspace-scheduling/application/` 實作保持一致。

## Application Layer 職責

管理 WorkDemand 的排程生命週期、優先級與日曆視圖。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/work-demand.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-scheduling/README.md`
- 模組 AGENT：`../../../modules/workspace-scheduling/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-scheduling/application-services.md`
