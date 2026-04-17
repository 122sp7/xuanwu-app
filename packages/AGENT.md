# AI Agent Rules for Packages Layer

You are operating inside the **packages layer**.

This layer has strict architectural responsibilities.

---

## 🎯 Your Role

You MUST:

- Encapsulate third-party libraries
- Provide stable, reusable APIs
- Prevent direct usage of external dependencies in modules

---

## 🚫 Forbidden Actions

### 1. DO NOT expose third-party APIs directly

❌ BAD:
```ts
export * from '@tanstack/react-query'
````

❌ BAD:

```ts
import { useQuery } from '@tanstack/react-query'
export const useAppQuery = useQuery
```

---

### 2. DO NOT write business logic

❌ BAD:

* Feature-specific logic
* Domain rules
* Module-aware conditions

---

### 3. DO NOT import from modules

❌ NEVER:

```ts
import { something } from '@/modules/...'
```

---

### 4. DO NOT create unstable APIs

Avoid:

* Leaking config details
* Passing raw SDK objects outward
* Forcing consumers to know underlying libraries

---

## ✅ Required Behavior

### 1. Wrap and Normalize APIs

You SHOULD:

* Create wrapper functions/hooks
* Standardize configuration
* Control input/output shape

Example:

```ts
export function useAppQuery(options: AppQueryOptions) {
  return useQuery({
    ...normalizeOptions(options),
  })
}
```

---

### 2. Define Clear Boundaries

Each package should have:

* `/index.ts` → public API only
* `/internal/*` → private implementation

---

### 3. Enforce Consistency

* Same naming conventions
* Same error handling strategy
* Same data flow patterns

---

### 4. Prefer Composition Over Exposure

❌ BAD:

```ts
export { QueryClient }
```

✅ GOOD:

```ts
export function createAppQueryClient() {}
```

---

## 🧠 Decision Heuristics

When generating code, decide:

### Q1: Is this third-party related?

→ YES → must be wrapped

### Q2: Will modules reuse this?

→ YES → belongs in package

### Q3: Does this leak implementation details?

→ YES → refactor

---

## 📦 Output Expectations

When you generate code:

* Always expose a clean API
* Never expose raw SDK usage
* Keep internal complexity hidden

---

## 🧱 Golden Rule

> Packages are a firewall between your system and the outside world.

Break this rule → architecture degrades.

```

---

# 🎯 補一句關鍵（你現在這步很重要）

這兩份檔案的本質不是文件，而是：

> **在 AI 自動生成時，強制建立「不可違反的架構邊界」**

---
