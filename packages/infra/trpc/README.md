# infra/trpc

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
