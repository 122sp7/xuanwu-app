# infra/client-state

Client-side 狀態原語（非業務的 atom / slice 工具）。

## 公開 API

```ts
import {
  updateClientState,  // 合併更新（支援 updater 函式）
  cloneClientState,   // structuredClone 包裝
  type ClientStateUpdater,
} from '@infra/client-state'
```

## 使用規則

- 此套件只提供純函式工具，不持有狀態。
- 業務狀態管理使用 `@infra/state`（Zustand / XState）。
- 禁止加入業務邏輯或 domain rule。
