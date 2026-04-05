# account — Application Services

> **Canonical bounded context:** `account`
> **模組路徑:** `modules/account/`
> **Domain Type:** Generic Subdomain

本文件記錄 `account` 的 application layer 服務與 use cases。內容與 `modules/account/application/` 實作保持一致。

## Application Layer 職責

管理帳戶資料、偏好設定與帳戶政策，並在 server 端透過 identity/api 取得已驗證身份。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/account-policy.use-cases.ts`
- `application/use-cases/account.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/account/README.md`
- 模組 AGENT：`../../../modules/account/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/account/application-services.md`
