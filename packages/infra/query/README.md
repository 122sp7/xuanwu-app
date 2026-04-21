# @infra/query

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


Server-state management via **TanStack Query v5**.

## Purpose

提供查詢快取、mutation lifecycle 與 options factory，作為 `interfaces/` 層處理 server-state 的標準入口。
資料的業務語意與 query key 命名仍由 owning module 決定。

## Import

```ts
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  queryOptions,
  type QueryKey,
} from '@infra/query'
```

## Key Exports

| Export | 類型 | 說明 |
|---|---|---|
| `QueryClient` | Class | 建立全域 query client |
| `QueryClientProvider` | Component | React provider |
| `useQuery` | Hook | 讀取 server-state |
| `useMutation` | Hook | 提交寫入 / side effect |
| `useInfiniteQuery` | Hook | 分頁查詢 |
| `useSuspenseQuery` | Hook | Suspense 查詢 |
| `queryOptions` | Helper | 型別安全 query options factory |
| `infiniteQueryOptions` | Helper | infinite query options factory |

## Guardrails

- TanStack Query 是 server-state authority
- 不把 query result 複製到 Zustand / local store
- 業務 query function 與 query key 留在 owning module
