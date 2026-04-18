# infra/trpc — Agent Rules

此套件提供 **tRPC 客戶端設定與 React Provider**。
注意：tRPC 連接的是**本系統自有伺服器**，不是第三方服務，故歸類為 `infra`。

---

## Route Here

| 類型 | 說明 |
|---|---|
| tRPC client 設定 | `trpc.ts` — createTRPCClient、links 設定 |
| tRPC React Provider | `TrpcProvider` component |
| tRPC 型別匯出 | `AppRouter` type re-export，供客戶端推斷 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| tRPC router 定義（server side） | `src/app/api/trpc/` |
| 業務 procedure | `src/modules/<context>/interfaces/` |
| Firebase 呼叫 | `packages/integration-firebase/` |

---

## 嚴禁

- 不得在 client 端設定中加入業務邏輯
- 不得 import `src/modules/*` 的 domain 或 application 層

## Alias

```ts
import { trpc, TrpcProvider } from '@infra/trpc'
```
