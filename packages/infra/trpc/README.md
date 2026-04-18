# infra/trpc

tRPC v11 客戶端原語。

## 公開 API

```ts
import {
  createTRPCClient,
  createTRPCProxyClient, // alias（相容舊版）
  httpBatchLink,
  httpLink,
  splitLink,
  TRPCClientError,
  createTRPCReact,
  type AnyRouter,
} from '@infra/trpc'
```

## 範例

```ts
import { createTRPCClient, httpBatchLink } from '@infra/trpc'

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({ url: '/api/trpc' }),
  ],
})
```

## Context7 官方基線

- 文件：`/trpc/trpc`
- 優先使用 v11 `createTRPCClient`；link 組合以 `httpBatchLink` + `splitLink` 為主。
- `createTRPCProxyClient` 已視為相容 alias，不建議新代碼使用。
