# shared — Application Services

> **Canonical bounded context:** `shared`
> **模組路徑:** `modules/shared/`
> **Domain Type:** Shared Kernel

本文件記錄 `shared` 的 application layer 服務與 use cases。內容與 `modules/shared/application/` 實作保持一致。

## Application Layer 職責

提供所有 bounded contexts 共用的最小型別與事件合約，是 Shared Kernel。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/publish-domain-event.ts`

## 設計對齊

- 模組 README：`../../../modules/shared/README.md`
- 模組 AGENT：`../../../modules/shared/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/shared/application-services.md`
