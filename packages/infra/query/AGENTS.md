# infra/query — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/query/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


此套件提供 **TanStack Query v5 server-state 原語**。
它負責 query client、query hook 與型別安全的 options factory，不負責業務資料模型。

---

## Route Here

| 類型 | 說明 |
|---|---|
| Query client 與 provider | `QueryClient`、`QueryClientProvider` |
| Query hooks | `useQuery`、`useMutation`、`useInfiniteQuery` |
| Query factory helpers | `queryOptions`、`infiniteQueryOptions` |
| Server-state 型別 | `UseQueryOptions`、`QueryKey`、`InfiniteData` |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 具業務語意的 query key / query function | `src/modules/<context>/interfaces/queries/` |
| UI toggle / panel state | `src/modules/<context>/interfaces/stores/` 或 `@infra/state` |
| 業務 invariant | `src/modules/<context>/domain/` |

---

## 嚴禁

- 不得在此套件加入業務 query key 或資料轉換規則
- 不得把 TanStack Query 資料鏡像到本地 store
- 不得 import `src/modules/*`

## Alias

```ts
import { useQuery, useMutation, queryOptions } from '@infra/query'
```
