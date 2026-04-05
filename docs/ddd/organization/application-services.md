# organization — Application Services

> **Canonical bounded context:** `organization`
> **模組路徑:** `modules/organization/`
> **Domain Type:** Generic Subdomain

本文件記錄 `organization` 的 application layer 服務與 use cases。內容與 `modules/organization/application/` 實作保持一致。

## Application Layer 職責

管理多租戶組織、成員、隊伍與邀請流程。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/organization-policy.use-cases.ts`
- `application/use-cases/organization.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/organization/README.md`
- 模組 AGENT：`../../../modules/organization/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/organization/application-services.md`
