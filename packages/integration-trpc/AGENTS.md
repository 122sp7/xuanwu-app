# integration-trpc — Agent Rules

此套件是 **tRPC 客戶端的唯一封裝層**。所有 tRPC 呼叫必須透過此套件提供的設定與客戶端，不得在 `src/modules/` 或 `src/app/` 中直接建立 tRPC client。

---

## Route Here（放這裡）

| 類型 | 說明 |
|---|---|
| tRPC client 初始化 | `createTRPCClient`、`createTRPCReact` 設定 |
| tRPC link 設定 | `httpBatchLink`、`splitLink`、`wsLink` 等 |
| tRPC provider 封裝 | `TRPCProvider` wrapper（thin wrapper 只） |
| SuperJSON transformer 設定 | 序列化/反序列化設定 |
| tRPC 共享 type export | `AppRouter` type re-export（從 server 端引入） |

## Route Elsewhere（不放這裡）

| 類型 | 正確位置 |
|---|---|
| tRPC router 定義（server 端） | `src/app/api/trpc/` |
| procedure 業務邏輯 | `src/modules/<context>/application/` use cases |
| tRPC hooks 業務使用 | `src/modules/<context>/interfaces/` 或 `src/app/` |
| Auth token 管理 | `src/modules/iam/` |

---

## 嚴禁

```ts
// ❌ 在 modules 中直接建立 tRPC client
import { createTRPCReact } from '@trpc/react-query'
export const trpc = createTRPCReact<AppRouter>()

// ✅ 必須透過此套件
import { trpc } from '@integration-trpc'
```

- 不得在此套件加入業務判斷邏輯
- 不得 import `src/modules/*` 任何路徑
- 不得在此套件定義 tRPC router procedures（attributes to server）

---

## Alias

```ts
import { ... } from '@integration-trpc'
```

允許在 `src/modules/*/interfaces/`、`src/app/` 等消費端使用（遵循 ESLint boundary 規則）。
