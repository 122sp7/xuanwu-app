# infra/state — Agent Rules

此套件提供 **本地狀態管理原語**：Zustand store factory 與 XState machine helpers。
所有工具均為本地原語，**不連接外部服務**。

---

## Route Here

| 類型 | 說明 |
|---|---|
| Zustand store factory | 建立 store 的通用 factory，不含業務 slice |
| XState machine helpers | machine config builder、service helper、type utilities |
| 狀態機共用型別 | `MachineContext`、`MachineEvent` 等共用型別 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務 Zustand store | `src/modules/<context>/interfaces/` |
| 業務 XState machine | `src/modules/<context>/application/` |
| client-side UI 狀態原語 | `packages/infra/client-state/` |

---

## 嚴禁

- 不得在此套件定義任何業務語意（workspace、task 等名詞）
- 不得 import Firebase 或任何外部 SDK

## Alias

```ts
import { ... } from '@infra/state'
```
