# identity — Application Services

> **Canonical bounded context:** `identity`
> **模組路徑:** `modules/identity/`
> **Domain Type:** Generic Subdomain

本文件記錄 `identity` 的 application layer 服務與 use cases。內容與 `modules/identity/application/` 實作保持一致。

## Application Layer 職責

封裝 Firebase Authentication，提供登入、登出與 token refresh 能力。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/identity-error-message.ts`
- `application/use-cases/identity.use-cases.ts`
- `application/use-cases/token-refresh.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/identity/README.md`
- 模組 AGENT：`../../../modules/identity/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/identity/application-services.md`
