# notification — Application Services

> **Canonical bounded context:** `notification`
> **模組路徑:** `modules/notification/`
> **Domain Type:** Generic Subdomain

本文件記錄 `notification` 的 application layer 服務與 use cases。內容與 `modules/notification/application/` 實作保持一致。

## Application Layer 職責

負責系統通知分發與通知讀取狀態管理。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/notification.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/notification/README.md`
- 模組 AGENT：`../../../modules/notification/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/notification/application-services.md`
