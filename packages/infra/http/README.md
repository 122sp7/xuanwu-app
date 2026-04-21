# infra/http

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


HTTP 工具（fetch wrapper、retry、timeout）。

## 公開 API

```ts
import {
  request,        // fetch with timeout + retry
  requestJson,    // request + JSON deserialization
  HttpError,      // status / statusText 附加資訊
  type HttpRequestOptions,
} from '@infra/http'
```

## 範例

```ts
import { requestJson, HttpError } from '@infra/http'

try {
  const data = await requestJson<{ id: string }>(
    'https://api.example.com/items',
    { method: 'GET' },
    { timeoutMs: 5000, retryCount: 2, retryDelayMs: 500 },
  )
} catch (err) {
  if (err instanceof HttpError) {
    console.error(`HTTP ${err.status}: ${err.message}`)
  }
}
```

## 使用規則

- 此套件封裝 fetch；integration 與 outbound adapter 層可使用。
- `domain/` 與 `application/` 層禁止直接 import。
- 需要 QStash / Firebase 等具體整合，改用對應 `@integration-*` 套件。
