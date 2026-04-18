# infra/client-state — Agent Rules

此套件提供 **client-side 狀態原語**，供 UI 層使用的非業務狀態工具（atom、slice factory）。

---

## Route Here

| 類型 | 說明 |
|---|---|
| Zustand slice factory | 通用 slice 建立工具，不含業務語意 |
| 非業務 atom 定義 | UI-local 的暫存狀態、控制狀態 |
| client state 型別工具 | 狀態容器共用型別、工具 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務狀態（workspace、task 等） | `src/modules/<context>/interfaces/` 的 Zustand store |
| XState machine | `packages/infra/state/` |

---

## 嚴禁

- 不得 import Firebase、HTTP client 或任何外部服務
- 不得包含業務判斷邏輯（use case 層級的決策）

## Alias

```ts
import { ... } from '@infra/client-state'
```
