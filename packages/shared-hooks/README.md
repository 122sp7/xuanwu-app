# shared-hooks

## Purpose

Cross-cutting React hooks and Zustand application state that is not owned by any specific domain module. This package provides the global app store and other shared client-side state primitives.

## Belongs to Module

Cross-cutting — used by app shell and UI components that need global state.

## Public API

| Export | Description |
|--------|-------------|
| `useAppStore` | Zustand store for global loading state |

### Store Shape

```typescript
interface AppState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}
```

## Dependencies

- `zustand` — state management library

## Example

```typescript
"use client";
import { useAppStore } from "@shared-hooks";

function LoadingSpinner() {
  const isLoading = useAppStore((s) => s.isLoading);
  if (!isLoading) return null;
  return <div>Loading...</div>;
}
```

## Rules

- All exports must be `"use client"` compatible — do not use in Server Components
- Domain-specific hooks belong in the module's `interfaces/hooks/` layer
- Keep global state minimal — prefer local or module-level state where possible
