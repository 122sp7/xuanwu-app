# State Management Model

前端狀態依責任切分為兩層：**Zustand** 承接輕量 client state，**XState** 承接有明確狀態轉換圖的有限狀態工作流。兩者職責互斥，不可混用。

## 責任切分原則

| 問題 | 答案 |
|---|---|
| 這是需要跨元件共享的 UI / 瀏覽器端狀態？ | → **Zustand** |
| 這是有明確 state / event / transition 的多步驟工作流？ | → **XState** |
| 這是來自 server 的非同步資料？ | → **TanStack Query**，不要放進 Zustand 或 XState |
| 這是 domain 的持久狀態？ | → **Firestore via use case**，不要在前端 cache 中持有正典 |

**黃金規則**：Zustand 不做流程控制，XState 不做純粹的 UI 狀態儲存。

---

## Zustand — Client State

### 適用場景

- Sidebar 展開 / 收折
- Modal 開關、主題設定、current panel 選取
- Multi-step form 的暫存草稿（送出前）
- 跨元件共享但不需要持久化至 server 的 UI preference

### 存放位置

```
src/modules/<context>/interfaces/stores/<name>.store.ts
```

若 store 完全屬於 app shell composition（不屬於任何主域），放在：

```
src/app/(shell)/stores/<name>.store.ts
```

### 命名規範

- 檔名：`<name>.store.ts`
- Hook export：`use<Name>Store`
- Slice 型別：`<Name>State`

### Slice 模式

每個 store 拆成 **state** 與 **actions** 兩個 slice，防止整個 store 重新渲染：

```typescript
// src/modules/workspace/interfaces/stores/panel.store.ts
import { create } from 'zustand';

interface PanelState {
  activePanelId: string | null;
}

interface PanelActions {
  setActivePanel: (id: string | null) => void;
}

export const usePanelStore = create<PanelState & PanelActions>((set) => ({
  activePanelId: null,
  setActivePanel: (id) => set({ activePanelId: id }),
}));
```

### 禁止模式

- ❌ 在 Zustand store 中存放從 server 取得的資料（用 TanStack Query）
- ❌ 在 Zustand store 中放 domain aggregate 或 entity 直接實例
- ❌ 在 Zustand store 中寫 business rule 或 permission 判斷
- ❌ 跨主域共享同一個 Zustand store（各主域各自維護自己的 store）
- ❌ 在 `domain/` 或 `application/` 層匯入 Zustand

---

## XState — Finite-State Workflows

### 適用場景

- 多步驟表單（wizard）：每一步都有明確進入條件與退出條件
- 多階段審批流程
- 非同步操作的生命週期（idle → loading → success / failed → retry）
- 需要精確 cancel / pause / resume 控制的工作流

### 存放位置

```
src/modules/<context>/subdomains/<subdomain>/application/machines/<name>.machine.ts
```

Machine 定義屬於 application 層（不是 interfaces 層），因為它代表業務流程的有限狀態圖，而非純粹的 UI 呈現。元件透過 `useMachine` 掛接，但 machine 本身不依賴 React。

### 狀態命名規範

使用業務語意命名，而非技術語意：

| ✅ 正確 | ❌ 錯誤 |
|---|---|
| `idle` | `initial` |
| `creating` | `loading` |
| `ready` | `success` |
| `failed` | `error` |
| `reviewing` | `step2` |

### XState + Server Action 整合模式

Machine 的 `actions` 或 `invoke.src` 呼叫 Server Action，結果以 `onDone` / `onError` 映射回 machine 事件：

```typescript
// src/modules/workspace/subdomains/lifecycle/application/machines/workspace-creation.machine.ts
import { createMachine, assign } from 'xstate';

export const workspaceCreationMachine = createMachine({
  id: 'workspaceCreation',
  initial: 'idle',
  context: {
    workspaceId: null as string | null,
    error: null as string | null,
  },
  states: {
    idle: {
      on: { SUBMIT: 'creating' },
    },
    creating: {
      invoke: {
        src: 'createWorkspaceAction',   // Server Action（注入為 actor）
        onDone: {
          target: 'ready',
          actions: assign({
            workspaceId: ({ event }) => event.output.aggregateId,
          }),
        },
        onError: {
          target: 'failed',
          actions: assign({
            error: ({ event }) => String(event.error),
          }),
        },
      },
    },
    ready: {},
    failed: {
      on: { RETRY: 'idle' },
    },
  },
});
```

### 禁止模式

- ❌ 在 XState machine 中直接呼叫 Firestore SDK（必須透過 use case 或 Server Action）
- ❌ 在 XState machine 中寫 business rule（business rule 在 `domain/`）
- ❌ 把 XState machine 放在 `interfaces/` 元件裡 inline 定義（放在 `application/machines/`）
- ❌ 用 XState 管理純粹的 UI toggle / panel 狀態（用 Zustand）
- ❌ Machine event type 與 domain event discriminant 混用同一型別（兩者有各自的 schema 與語意）

---

## Zustand 與 TanStack Query 的協作邊界

TanStack Query 是 **server state** 的正典來源，不要把 query 結果複製進 Zustand：

```typescript
// ✅ 正確：TanStack Query 承接 server state
const { data: workspace } = useQuery({
  queryKey: ['workspace', workspaceId],
  queryFn: () => fetchWorkspace(workspaceId),
});

// ✅ 正確：Zustand 只做 UI state
const { activePanelId, setActivePanel } = usePanelStore();

// ❌ 錯誤：把 query 結果塞進 Zustand
const { data } = useQuery(...);
useEffect(() => { setWorkspaceInStore(data); }, [data]);
```

---

## Document Network

- [firebase-architecture.md](../firebase/firebase-architecture.md)
- [event-driven-design.md](../../01-architecture/domain/event-driven-design.md)
- [genkit-flow-standards.md](../genkit/genkit-flow-standards.md)
- [`../.github/instructions/event-driven-state.instructions.md`](../../../.github/instructions/event-driven-state.instructions.md)
