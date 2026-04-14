---
name: zustand-xstate
description: >-
  Frontend State Management skillbook for Xuanwu. Use when deciding between Zustand and XState,
  designing store slice patterns, placing machines in application layer, integrating XState with
  Server Actions, or separating client state from server state (TanStack Query).
user-invocable: true
disable-model-invocation: false
---

# Frontend State Management (Zustand + XState)

Use this skill when the task involves client-side state management, store design, workflow machines,
or the boundary between client UI state and server data.

## Research Basis

Context7-verified + Xuanwu-specific:

- Zustand is a minimal client state library — stores are created outside React and accessed via hooks.
- XState models finite automata: states, events, transitions, and guards provide deterministic behavior.
- TanStack Query is the server state authority — duplicating its data into Zustand creates stale-state bugs.
- XState machines placed in `application/machines/` keep workflow logic independent of React components.

## Working Synthesis

State management in Xuanwu means:

1. Decide state type first; pick the tool second.
2. Zustand for cross-component UI preferences and transient UI data.
3. XState for workflows with named states, defined transitions, and async lifecycles.
4. TanStack Query for everything fetched from the server.
5. Domain aggregate state lives in Firestore — never in any frontend store.

---

## State Type Decision Table

Apply this table before writing any state code:

| State type | Characteristics | Tool | Location |
|---|---|---|---|
| UI preference (panel open/closed, theme, selected tab) | Boolean or string, shared across components | **Zustand** | `interfaces/stores/` |
| Draft / transient form data (before submit) | Object, ephemeral, not persisted | **Zustand** | `interfaces/stores/` |
| Multi-step workflow | Named states, explicit transitions, async invoke | **XState** | `application/machines/` |
| Async operation lifecycle (loading/success/failed) with retry | 4+ distinct states with guards | **XState** | `application/machines/` |
| Server-fetched data | Remote, async, cacheable | **TanStack Query** | `interfaces/queries/` |
| Domain entity state | Persisted in Firestore | **Use Case + Firestore** | Never in frontend |

**Golden Rule**: Zustand does not do flow control. XState does not store pure UI preferences.

---

## Zustand Rules

### Placement

```
modules/<context>/interfaces/stores/<name>.store.ts    (module-owned)
app/(shell)/stores/<name>.store.ts                     (shell-scoped only)
```

Cross-module store sharing is prohibited. Lift to `app/(shell)/stores/` only when truly shell-level.

### Mandatory Slice Pattern

Split every store into a **state slice** and an **actions slice** to enable selector-level subscriptions:

```typescript
// modules/workspace/interfaces/stores/panel.store.ts
import { create } from 'zustand';

interface PanelState {
  activePanelId: string | null;
  sidebarOpen: boolean;
}

interface PanelActions {
  setActivePanel: (id: string | null) => void;
  toggleSidebar: () => void;
  clearPanel: () => void;
}

export const usePanelStore = create<PanelState & PanelActions>((set) => ({
  // State slice
  activePanelId: null,
  sidebarOpen: true,

  // Actions slice
  setActivePanel: (id) => set({ activePanelId: id }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  clearPanel: () => set({ activePanelId: null }),
}));
```

### Usage: Use Selectors, Not Full Store

```typescript
// ✅ Correct: select only needed state
const activePanelId = usePanelStore((s) => s.activePanelId);
const setActivePanel = usePanelStore((s) => s.setActivePanel);

// ❌ Wrong: full store causes unnecessary re-renders
const store = usePanelStore();
```

### Naming Rules

| Element | Convention |
|---|---|
| File | `<noun>.store.ts` |
| Hook export | `use<Noun>Store` |
| State type | `<Noun>State` |
| Actions type | `<Noun>Actions` |

### Zustand Anti-Patterns

| Anti-Pattern | Why It's Wrong | Fix |
|---|---|---|
| `useEffect(() => setStore(query.data), [data])` | Duplicates server state | Use TanStack Query directly |
| Domain aggregate in store | Stale state vs Firestore divergence | Fetch via query + use case |
| Business rule in action (`if user.role`) | Domain leak into UI layer | Move to domain or use case |
| Cross-module store import | Breaks bounded context isolation | Lift to shell store |
| Zustand in `domain/` or `application/` | Layer violation | Zustand is `interfaces/` only |

---

## XState Rules

### Placement

```
modules/<context>/application/machines/<noun>-<flow>.machine.ts
```

Machines are **application layer** artifacts — they model workflow transitions that correspond to use case interactions. Components consume machines via `useMachine()` hook but never define them.

### State Naming Conventions

Use business-semantic names:

| ✅ Correct | ❌ Wrong | Reason |
|---|---|---|
| `idle` | `initial` | `initial` is XState internals, not business language |
| `creating` | `loading` | `loading` is a UI concept |
| `ready` | `success` | `success` is a generic result, not a domain state |
| `failed` | `error` | `error` is too technical |
| `reviewing` | `step2` | `step2` leaks wizard order into domain |

### Machine + Server Action Integration

Machines invoke Server Actions as actors, map results back via `onDone` / `onError`:

```typescript
// modules/workspace/application/machines/workspace-creation.machine.ts
import { createMachine, assign } from 'xstate';

interface WorkspaceCreationContext {
  workspaceId: string | null;
  error: string | null;
}

export const workspaceCreationMachine = createMachine({
  id: 'workspaceCreation',
  initial: 'idle',
  context: { workspaceId: null, error: null } as WorkspaceCreationContext,
  states: {
    idle: {
      on: { SUBMIT: 'creating' },
    },
    creating: {
      invoke: {
        src: 'createWorkspaceAction',        // Server Action actor (injected)
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
    failed: { on: { RETRY: 'idle' } },
  },
});
```

### React Integration (interfaces layer)

```typescript
// modules/workspace/interfaces/hooks/use-workspace-creation.ts
import { useMachine } from '@xstate/react';
import { workspaceCreationMachine } from '../../application/machines/workspace-creation.machine';
import { createWorkspaceAction } from '../actions/create-workspace.action';

export function useWorkspaceCreation() {
  const [state, send] = useMachine(workspaceCreationMachine, {
    actors: { createWorkspaceAction },
  });
  return { state, submit: () => send({ type: 'SUBMIT' }) };
}
```

### XState Anti-Patterns

| Anti-Pattern | Why It's Wrong | Fix |
|---|---|---|
| Machine defined inline in component | Binds workflow to render lifecycle | Move to `application/machines/` |
| Machine imports Firebase SDK | Infrastructure leak into application | Use Server Action actor |
| Business invariants in machine guards | Domain logic in wrong layer | Move to domain aggregate |
| Machine event `workspace.created` reused as domain event | Type conflict, semantic drift | Keep machine events and domain events separate |
| XState for simple boolean toggle | Over-engineering | Use Zustand or `useState` |

---

## TanStack Query Separation

TanStack Query is the authoritative source for server state. Never mirror it into Zustand or XState context:

```typescript
// ✅ Correct: each tool owns its responsibility
const { data: workspace, isLoading } = useQuery({
  queryKey: ['workspace', workspaceId],
  queryFn: () => fetchWorkspace(workspaceId),
});
const { activePanelId } = usePanelStore();          // UI state
const [machineState, send] = useMachine(creationMachine); // workflow state

// ❌ Wrong: TanStack Query result copied into Zustand
const { data } = useQuery(...);
useEffect(() => { setWorkspaceInStore(data); }, [data]);
```

---

## Zustand vs XState Decision Checklist

Before creating state management code, answer:

1. Does this have named transition states (idle → creating → ready)?  → **XState**
2. Is there a retry / cancel / pause lifecycle?  → **XState**
3. Does this involve an async Server Action with loading + failure states?  → **XState** (if complex) or TanStack Query mutation (if simple)
4. Is this a UI preference that persists across re-renders?  → **Zustand**
5. Is this cross-component shared data from the server?  → **TanStack Query**
6. Is this ephemeral form data before submission?  → **Zustand** or local `useState`

---

## Red Flags

- `useEffect(() => setStore(data))` copying TanStack Query results into Zustand.
- Machine file inside `interfaces/` or `components/` directory.
- Zustand store imported in `domain/` or `application/`.
- XState machine importing Firebase SDK directly.
- Machine event type identical to domain event discriminant (causes type confusion).
- Store action containing business rule (`if (user.role === 'owner')`).
- XState used for a simple boolean open/closed toggle.
- Missing selector in `useSomeStore()` — subscribes to entire store and triggers unnecessary renders.

## Review Loop

1. Confirm state type (UI preference / workflow / server data / domain).
2. Verify correct tool is used: Zustand / XState / TanStack Query / Firestore.
3. Verify store placement: `interfaces/stores/` for Zustand, `application/machines/` for XState.
4. Verify Zustand store uses the State/Actions slice pattern.
5. Verify XState state names use business semantics.
6. Verify machines invoke Server Actions as actors (not Firebase SDK).
7. Verify no server state is copied into Zustand.

## Output Contract

When this skill is used, provide:

1. State type classification (UI / workflow / server / domain),
2. Tool recommendation with rationale,
3. Placement path,
4. Slice structure or machine skeleton,
5. Anti-pattern findings and corrections.
