# Packages Layer

此目錄是所有**共享平台能力**的唯一存放層。`src/modules/` 與 `src/app/` 不得直接依賴第三方 library，必須透過此層的套件存取外部能力。

---

## 層次位置

```
src/app / src/modules  →  packages  →  third-party libraries
```

規則：
- `src/modules/` 不得直接 import 第三方 library
- `src/modules/` 只能 import `packages/` 提供的套件
- `packages/` 是唯一允許直接依賴外部 library 的層

---

## 現有套件清單

### 🔌 integration-* — 外部服務封裝層

| 套件 | 封裝目標 | 文件 |
|---|---|---|
| `integration-firebase` | Firebase App / Auth / Firestore | [README](./integration-firebase/README.md) |
| `integration-ai` | Genkit / Google AI SDK | [README](./integration-ai/README.md) |
| `integration-http` | HTTP 用戶端（fetch / ky） | [README](./integration-http/README.md) |
| `integration-trpc` | tRPC 客戶端與 Provider | [README](./integration-trpc/README.md) |

職責：封裝 SDK、標準化設定、normalize API 介面。

---

### 🎨 ui-* — 設計系統與 UI 原語層

| 套件 | 說明 | 文件 |
|---|---|---|
| `ui-shadcn` | 官方 shadcn/ui 組件（CLI 管理，禁止修改）| [README](./ui-shadcn/README.md) |

> **自訂 UI 組件唯一存放位置**：`packages/ui-shadcn/ui-custom/`  
> 任何對官方組件的 wrap、設計系統擴充、業務語意層一律放入 `ui-custom/`，不放在 `src/modules/` 或 `src/app/`。

職責：共享 UI 組件、互動模式、設計 token。

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
