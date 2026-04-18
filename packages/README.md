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

套件分三層：**基礎設施原語**（`infra/*`）、**外部服務整合**（`integration-*`）、**UI 元件**（`ui-*`）。

---

### 🧱 infra/* — 基礎設施原語層 (`@infra/*`)

純功能原語，**無外部服務依賴**，離線可用，不需要憑證。

| 套件 | alias | 職責 |
|---|---|---|
| `infra/client-state` | `@infra/client-state` | client-side 狀態原語（非業務的 atom / slice） |
| `infra/http` | `@infra/http` | HTTP 工具（fetch wrapper、retry、timeout） |
| `infra/serialization` | `@infra/serialization` | 序列化 / 反序列化工具 |
| `infra/state` | `@infra/state` | 本地狀態管理原語（Zustand store factory、XState machine helpers） |
| `infra/trpc` | `@infra/trpc` | tRPC 客戶端設定與 Provider（連接自己的 server，非第三方服務） |
| `infra/uuid` | `@infra/uuid` | UUID 生成（domain 層唯一允許的 id 生成入口） |
| `infra/zod` | `@infra/zod` | Zod 基礎設施原語（共用 schema 片段、brand helper） |

---

### 🔌 integration-* — 外部服務整合層 (`@integration-*`)

連接**外部服務**，需要憑證、網路呼叫、第三方帳號。封裝 SDK，標準化 API 介面，normalize 錯誤與型別。

| 套件 | alias | 封裝目標 |
|---|---|---|
| `integration-ai` | `@integration-ai` | AI 服務整合（Genkit 封裝、Google AI、OpenAI） |
| `integration-firebase` | `@integration-firebase` | Firebase 整合（App 初始化、Firestore、Auth、Storage、Functions、Realtime） |
| `integration-queue` | `@integration-queue` | 訊息佇列整合（QStash、Cloud Tasks） |

---

### 🎨 ui-* — UI 元件層 (`@ui-*`)

共享 UI 元件與設計系統；無業務邏輯。

| 套件 | alias | 說明 |
|---|---|---|
| `ui-components` | `@ui-components` | 業務無關的自訂 UI 元件（wrap、design-system 擴充） |
| `ui-editor` | `@ui-editor` | 富文本編輯器（TipTap 封裝） |
| `ui-markdown` | `@ui-markdown` | Markdown 渲染元件 |
| `ui-shadcn` | `@ui-shadcn` | 官方 shadcn/ui 組件（CLI 管理，禁止手動修改） |
| `ui-visualization` | `@ui-visualization` | 數據視覺化元件（圖表、圖形） |

> **自訂 UI 組件唯一存放位置**：`packages/ui-components/`  
> 任何對官方組件的 wrap、設計系統擴充、業務語意層一律放入 `ui-components/`，不放在 `src/modules/` 或 `src/app/`。

---

## 硬性規則

### 1. modules 不得直接使用第三方 library

```ts
// ❌ 錯誤：在 modules 直接 import uuid
import { v4 as uuidv4 } from 'uuid'

// ✅ 正確：透過 packages 套件
import { generateId } from '@infra/uuid'
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
| 可跨多個 modules 重用，且無業務語意？無外部服務依賴，離線可用？ | → 放 `packages/infra/*/` |
| 是第三方 SDK 封裝或外部系統整合？需要憑證 / 網路 / 第三方帳號？ | → 放 `packages/integration-*/` |
| 是 UI 元件（業務無關自訂）？ | → 放 `packages/ui-components/` |
| 是 shadcn 官方組件？ | → 放 `packages/ui-shadcn/`（CLI 管理） |
| 是業務邏輯或 domain rule？ | → 放 `src/modules/` |

