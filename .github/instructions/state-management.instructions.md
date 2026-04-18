---
description: 'Zustand client state and XState finite-state workflow rules: placement, slice pattern, naming, decision boundary, and TanStack Query separation.'
applyTo: '{src/modules/**/interfaces/stores/**,src/modules/**/application/machines/**,src/app/**/*.{ts,tsx}}'
---

# State Management

## Responsibility Decision Table

Before writing any state code, apply this rule:

| State type | Tool | Location |
|---|---|---|
| Cross-component UI preference (panel, modal, theme) | **Zustand** | `src/modules/<context>/interfaces/stores/<name>.store.ts` |
| Multi-step workflow (wizard, approval, async lifecycle) | **XState** | `src/modules/<context>/application/machines/<noun>-<flow>.machine.ts` |
| Server-fetched async data | **TanStack Query** | `src/modules/<context>/interfaces/queries/<name>.query.ts` |
| Domain aggregate / entity state | **Firestore via use case** | Never persist in frontend store |

Never use Zustand for server data and never use XState for simple UI toggles.

---

## Zustand Rules

### Store Placement

```
src/modules/<context>/interfaces/stores/<name>.store.ts   ← module-owned store
src/app/(shell)/stores/<name>.store.ts                    ← shell-only store
```

One module must not import another module's store directly. If two modules share UI state, lift it to `src/app/(shell)/stores/`.

### Slice Pattern (Mandatory)

Every store must split **state** and **actions** into two slices to minimise re-renders:
- Define `<Noun>State` interface (data fields only).
- Define `<Noun>Actions` interface (setter/clear functions only).
- Export `use<Noun>Store = create<State & Actions>(...)` as the combined hook.

### Naming Rules

- File: `<noun>.store.ts` (e.g. `panel.store.ts`, `draft.store.ts`)
- Hook export: `use<Noun>Store` (e.g. `usePanelStore`)
- State type: `<Noun>State`
- Actions type: `<Noun>Actions`

### Anti-Patterns

- ❌ `useEffect(() => setStore(data), [data])` — copying server data into Zustand
- ❌ Domain aggregate instances in store context (`WorkspaceAggregate` as store value)
- ❌ Business rule conditions inside store actions (`if (user.role === 'admin')`)
- ❌ Cross-module store imports (each module owns its own stores)
- ❌ Importing Zustand in `domain/` or `application/` layers

---

## XState Rules

### Machine Placement

```
src/modules/<context>/application/machines/<noun>-<flow>.machine.ts
```

Machine definitions are **application layer** concerns — they model business workflow transitions, not UI rendering. Components consume machines via `useMachine()` but do not define them.

### State Naming

Name states with business semantics, not technical or UI language:

| ✅ Use | ❌ Avoid |
|---|---|
| `idle` | `initial` |
| `creating` | `loading` |
| `ready` | `success` |
| `failed` | `error` |
| `reviewing` | `step2` |

### Machine + Server Action Integration

Machine `invoke.src` actors call Server Actions; results map back via `onDone` / `onError`:
- Declare a `creating` state with `invoke.src` pointing to the Server Action name.
- Use `onDone` to transition to `ready` and `assign` the result (e.g. `aggregateId`).
- Use `onError` to transition to `failed` and `assign` the error string.
- Provide `RETRY: 'idle'` transition from `failed` for user-initiated retries.

### Anti-Patterns

- ❌ Machine defined inline inside a React component
- ❌ Machine importing Firebase SDK or calling repositories directly
- ❌ Machine `actions` containing business invariant logic
- ❌ Machine event type `workspace.created` reused as domain event discriminant (keep them separate)
- ❌ XState for simple boolean toggles or panel open/close (use Zustand)

---

## TanStack Query — Boundary Rule

TanStack Query is the **server state** authority. Never mirror its data into Zustand:

```typescript
// ✅ Correct: TanStack Query owns server data
const { data: workspace } = useQuery({
  queryKey: ['workspace', workspaceId],
  queryFn: () => fetchWorkspace(workspaceId),
});

// ✅ Correct: Zustand owns UI state
const { activePanelId } = usePanelStore();

// ❌ Wrong: copying query result into Zustand
const { data } = useQuery(...);
useEffect(() => { setWorkspaceData(data); }, [data]);
```

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
#use skill zustand-xstate
