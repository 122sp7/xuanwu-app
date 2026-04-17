# integration-trpc

tRPC 客戶端封裝套件。提供統一的 tRPC client 設定與 React hooks 入口，隔離 tRPC SDK 細節與 `src/modules/` 業務層。

## 套件結構

```
packages/integration-trpc/
  index.ts      ← 統一 re-export
  AGENTS.md     ← Agent 使用規則
  README.md     ← 本文件
```

> 目前為待實作狀態（empty）。實作時遵循 `AGENTS.md` 的封裝規則。

## 預期公開 API

```ts
// tRPC React client
import { trpc, TRPCProvider } from '@integration-trpc'

// 消費端使用
function MyComponent() {
  const { data } = trpc.workspace.list.useQuery()
  // ...
}

// App root
function App() {
  return (
    <TRPCProvider>
      <MyComponent />
    </TRPCProvider>
  )
}
```

## 使用限制

| 規則 | 說明 |
|---|---|
| **禁止在 modules 直接建立 tRPC client** | 所有 tRPC 使用必須透過此套件 |
| **禁止加入業務邏輯或 procedure 定義** | procedure 定義在 `src/app/api/trpc/` |
| **Router type 唯讀引用** | 從 server 端 `AppRouter` import type，不改變定義 |

## 消費層級

不同於 `integration-firebase`（只限 outbound adapters），tRPC client 允許在：
- `src/modules/<context>/interfaces/`（React hooks 消費）
- `src/app/`（route 層組合）

業務邏輯仍必須在 `src/modules/<context>/application/` use cases 中。
