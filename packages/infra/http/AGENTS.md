# infra/http — Agent Rules

此套件提供 **HTTP 工具原語**：fetch wrapper、retry、timeout、header helper。

---

## Route Here

| 類型 | 說明 |
|---|---|
| fetch wrapper | 統一 fetch 介面，支援 retry / timeout |
| HTTP header helper | 共用 header 工具（Content-Type、Authorization prefix 等） |
| HTTP error 型別 | `HttpError`、`NetworkError` 等共用錯誤型別 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務 API 呼叫 | `src/modules/<context>/adapters/outbound/` |
| tRPC 客戶端 | `packages/infra/trpc/` |
| Firebase SDK 呼叫 | `packages/integration-firebase/` |

---

## 嚴禁

- 不得在此套件加入業務路由邏輯或 base URL 硬編碼
- 不得 import `src/modules/*`

## Alias

```ts
import { ... } from '@infra/http'
```
