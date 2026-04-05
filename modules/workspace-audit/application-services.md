# workspace-audit — Application Services

> **Canonical bounded context:** `workspace-audit`
> **模組路徑:** `modules/workspace-audit/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-audit` 的 application layer 服務與 use cases。內容與 `modules/workspace-audit/application/` 實作保持一致。

## Application Layer 職責

以 append-only 模式記錄工作區與組織範圍內的重要稽核軌跡。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/.gitkeep`
- `application/use-cases/audit.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-audit/README.md`
- 模組 AGENT：`../../../modules/workspace-audit/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-audit/application-services.md`
