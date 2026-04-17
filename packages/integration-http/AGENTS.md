# integration-http — Agent Rules

此套件是 **HTTP 用戶端（fetch / axios / ky 等）的唯一封裝層**。所有對外部 REST API 的 HTTP 呼叫必須透過此套件，不得在 `src/modules/` 中直接使用 `fetch` 或第三方 HTTP 客戶端。

---

## Route Here（放這裡）

| 類型 | 說明 |
|---|---|
| HTTP 客戶端初始化與設定 | base URL、timeout、header 設定 |
| Request / Response 攔截器 | auth token injection、error normalization |
| HTTP 操作封裝 | `get`、`post`、`put`、`patch`、`delete` |
| 錯誤類型定義 | `HttpError`、`NetworkError` 等標準化錯誤 |
| Retry / timeout 策略 | 通用重試與逾時設定 |

## Route Elsewhere（不放這裡）

| 類型 | 正確位置 |
|---|---|
| 業務 API 呼叫（帶業務語意） | `src/modules/<context>/adapters/outbound/` |
| API response 映射至 domain model | `src/modules/<context>/adapters/outbound/` |
| GraphQL / tRPC 呼叫 | `packages/integration-trpc/` |
| Auth token 管理業務邏輯 | `src/modules/iam/` |

---

## 嚴禁

```ts
// ❌ 在 modules 中直接使用 fetch
const res = await fetch('/api/something')

// ✅ 必須透過此套件
import { httpClient } from '@integration-http'
const res = await httpClient.get('/api/something')
```

- 不得在此套件加入業務判斷邏輯
- 不得 import `src/modules/*` 任何路徑
- 不得硬編碼業務端點 URL（URL 由消費端帶入）

---

## Alias

```ts
import { ... } from '@integration-http'
```

只允許在 `src/modules/*/adapters/outbound/` 使用（ESLint boundary 規則）。
