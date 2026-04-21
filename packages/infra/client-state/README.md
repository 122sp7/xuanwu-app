# infra/client-state

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
