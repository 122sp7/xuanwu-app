# Packages Layer

This directory contains all **shared platform capabilities**.

## 🎯 Purpose

Packages are NOT feature code.

They exist to:
- Wrap third-party libraries
- Provide stable APIs
- Enforce architecture boundaries
- Prevent duplication across modules

---

## 🧱 Layer Position

```

app / modules  →  packages  →  third-party libraries

````

Rules:
- `modules` MUST NOT import third-party libraries directly
- `modules` MUST ONLY import from `packages`
- `packages` are the ONLY layer allowed to depend on external libraries

---

## 📦 Package Types

### 🔌 integration-*
External services / infrastructure

Examples:
- `integration-firebase`
- `integration-ai-genkit`
- `integration-trpc`
- `integration-http`

Responsibility:
- Wrap SDKs
- Handle configuration
- Normalize API usage

---

### 🧠 core-*
Cross-domain runtime logic

Examples:
- `core-state`
- `core-data`
- `core-schema`

Responsibility:
- State management
- Data fetching & caching
- Validation & contracts

---

### 🎨 ui-*
Design system & UI primitives

Examples:
- `ui-system`
- `ui-shadcn`
- `ui-feedback`
- `ui-command`

Responsibility:
- Shared UI components
- Interaction patterns
- Design tokens

---

### ✍️ editor-*
Complex UI subsystems

Examples:
- `editor-tiptap`

Responsibility:
- Encapsulate heavy editors
- Provide controlled extension APIs

---

## ⚠️ Hard Rules

### 1. No Direct Third-Party Usage in Modules

❌ WRONG:
```ts
import { useQuery } from '@tanstack/react-query'
````

✅ CORRECT:

```ts
import { useAppQuery } from 'core-data'
```

---

### 2. Packages Must Expose Stable APIs

Each package must:

* Export a clear public interface
* Hide implementation details
* Prevent leaking third-party APIs

---

### 3. No Cross-Package Chaos

❌ Avoid:

* Circular dependencies
* Deep imports (`package/internal/...`)

✅ Only:

```ts
import { something } from 'core-data'
```

---

### 4. No Business Logic

Packages must NOT:

* Contain domain logic
* Reference specific modules
* Know about features

---

## 🧩 Design Principle

A package is:

> A **controlled boundary** that converts unstable third-party APIs
> into stable, composable platform capabilities

---

## 📌 If Unsure

Ask:

* Is this reusable across modules? → YES → package
* Is this business logic? → YES → module
* Is this a third-party wrapper? → YES → package

````

---
