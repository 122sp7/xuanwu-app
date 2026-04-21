# infra/state

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


本地狀態管理原語。封裝 **Zustand 5** 與 **XState 5**，供 `src/modules/*/interfaces/stores/` 與 `src/modules/*/application/machines/` 使用。

## 套件結構

```
packages/infra/state/
  index.ts    ← Zustand create/createStore/StateCreator + XState createMachine/createActor/assign/setup
  AGENTS.md
```

## 公開 API

```ts
import {
  // Zustand — React hook factory (canonical for interfaces/stores/)
  create,
  type StateCreator,

  // Zustand — vanilla factory (non-React contexts)
  createStore,
  type StoreApi,

  // XState — machine & actor
  createMachine,
  createActor,
  assign,
  setup,
  type ActorRefFrom,
  type SnapshotFrom,

  // Utility
  replaceStoreState,
} from '@infra/state'
```

## 使用規則

| 場景 | 使用 |
|---|---|
| module `interfaces/stores/*.store.ts` | `create` + `StateCreator` |
| 非 React 環境 / SSR vanilla store | `createStore` + `StoreApi` |
| `application/machines/*.machine.ts` | `createMachine` + `createActor` + `setup` + `assign` |
| 有型別的 machine context | `setup({ types })` |

## Slice Pattern（必讀）

```ts
import { create, type StateCreator } from '@infra/state'

interface PanelState { isOpen: boolean }
interface PanelActions { open(): void; close(): void }
type PanelStore = PanelState & PanelActions

const createPanelSlice: StateCreator<PanelStore, [], [], PanelStore> = (set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
})

export const usePanelStore = create<PanelStore>()((...a) => ({
  ...createPanelSlice(...a),
}))
```

## Context7 官方基線

| Library | Context7 ID |
|---|---|
| Zustand | `/pmndrs/zustand` |
| XState  | `/statelyai/xstate` |

- Zustand：`create` 是 React hook factory；`createStore` 是 vanilla。
- XState：`createMachine` 定義邏輯，`createActor` 實例化並執行；`setup` 提供更好的 TypeScript 型別推導。
