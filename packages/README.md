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

## 硬性規則

### 1. modules 不得直接使用第三方 library

```ts
// ❌ 錯誤：在 modules 直接 import Firebase
import { getFirestore } from 'firebase/firestore'

// ✅ 正確：透過 packages 套件
import { firestoreApi } from '@integration-firebase'
```

### 2. 每個套件必須有穩定公開介面

- `index.ts` 是唯一公開入口
- 隱藏實作細節，不洩漏 SDK 型別
- 不洩漏第三方 API 至消費端

### 3. 不得加入業務邏輯

套件不得：
- 包含 domain rule 或 use case 邏輯
- 直接 import `src/modules/*`
- 對特定功能或模組有感知

---

## 判斷原則

| 問題 | 結果 |
|---|---|
| 可跨多個 modules 重用？ | → 放 `packages/` |
| 是業務邏輯或 domain rule？ | → 放 `src/modules/` |
| 是第三方 SDK 封裝？ | → 放 `packages/integration-*/` |
| 是 UI 組件（自訂）？ | → 放 `packages/ui-shadcn/ui-custom/` |

