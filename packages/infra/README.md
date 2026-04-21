# Infra Packages

`packages/infra/` 是本 repo 的**本地基礎設施原語層**。
這些套件可被 `src/app/` 與 `src/modules/` 重用，但不得攜帶業務語意，也不得依賴外部服務。

## 套件清單

| 套件 | alias | 用途 |
|---|---|---|
| `client-state` | `@infra/client-state` | client-side 狀態工具 |
| `date` | `@infra/date` | date-fns 日期解析、格式化與比較工具 |
| `form` | `@infra/form` | TanStack Form headless 表單原語 |
| `http` | `@infra/http` | HTTP 請求工具 |
| `query` | `@infra/query` | TanStack Query server-state 原語 |
| `serialization` | `@infra/serialization` | 序列化 / 反序列化工具 |
| `state` | `@infra/state` | Zustand / XState 本地狀態原語 |
| `table` | `@infra/table` | TanStack Table headless 表格原語 |
| `trpc` | `@infra/trpc` | tRPC 客戶端與 Provider 原語 |
| `uuid` | `@infra/uuid` | UUID 生成與驗證 |
| `virtual` | `@infra/virtual` | 虛擬化列表 / 視窗化工具 |
| `zod` | `@infra/zod` | Zod schema / brand helper 原語 |

## Guardrails

- 僅放置可跨模組重用的本地原語
- 不得 import `src/modules/*`
- 不得依賴 Firebase、Genkit、QStash 等外部服務
- 每個子套件以自己的 `index.ts` 作為唯一公開入口

## Read Next

- `packages/infra/AGENTS.md`
- `packages/README.md`
