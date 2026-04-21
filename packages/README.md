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
| `infra/date` | `@infra/date` | 日期解析、格式化、比較與區間工具 |
| `infra/form` | `@infra/form` | headless 表單狀態管理原語 |
| `infra/http` | `@infra/http` | HTTP 工具（fetch wrapper、retry、timeout） |
| `infra/query` | `@infra/query` | TanStack Query server-state 原語 |
| `infra/serialization` | `@infra/serialization` | 序列化 / 反序列化工具 |
| `infra/state` | `@infra/state` | 本地狀態管理原語（Zustand store factory、XState machine helpers） |
| `infra/table` | `@infra/table` | TanStack Table headless 表格原語 |
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

### 4. packages/index.ts 必須維持具名匯出

`packages/index.ts` 是 packages 層總入口，必須具名匯出以下三類套件：
- `infra*`（基礎設施原語）
- `integration*`（外部服務整合）
- `ui*`（共享 UI 套件）

新增/刪除套件時需同步更新 `packages/index.ts`。

---

## 判斷原則

| 問題 | 結果 |
|---|---|
| 可跨多個 modules 重用，且無業務語意？無外部服務依賴，離線可用？ | → 放 `packages/infra/*/` |
| 是第三方 SDK 封裝或外部系統整合？需要憑證 / 網路 / 第三方帳號？ | → 放 `packages/integration-*/` |
| 是 UI 元件（業務無關自訂）？ | → 放 `packages/ui-components/` |
| 是 shadcn 官方組件？ | → 放 `packages/ui-shadcn/`（CLI 管理） |
| 是業務邏輯或 domain rule？ | → 放 `src/modules/` |

---

## Context7 官方文件基線（repomix:packages）

以下為 packages 層「各包」在實作與維護時需對齊的官方文件基線（已透過 Context7 查核）。

| 套件 | Context7 文件 | 實作基線 |
|---|---|---|
| `infra/state` | `/pmndrs/zustand`、`/statelyai/xstate` | Zustand：`create`（React hook factory，canonical）+ `createStore`（vanilla）+ `StateCreator`（slice 組合）；XState：`createMachine` + `createActor` + `setup`（型別推導），不在 machine 放 I/O 業務規則。 |
| `infra/trpc` | `/trpc/trpc` | 優先使用 v11 `createTRPCClient`；link 組合以 `httpBatchLink` + `splitLink` 為主。`createTRPCProxyClient` 為相容 alias。 |
| `infra/uuid` | `/uuidjs/uuid` | 以 `v4` 產生 ID，驗證時使用 `validate()`（必要時加 `version()===4`）。 |
| `infra/zod` | `/colinhacks/zod` | boundary 驗證採 `zodParseOrThrow`（拋出型）或 `zodSafeParse`（不拋出型）；錯誤統一回傳 `ZodError.issues` 結構；`createBrandedUuidSchema` 用於 domain value object。 |
| `integration-ai` | `/websites/genkit_dev_js` | flow/tool 必須有 Zod schema（inputSchema + outputSchema）；Genkit singleton 在 `genkit.ts` 初始化；避免回傳未驗證的模型結果；只在 `infrastructure/ai/` 使用。 |
| `integration-firebase` | `/firebase/firebase-js-sdk` | 採 modular API；App 初始化維持 singleton（`getApps/getApp/initializeApp`）。 |
| `integration-queue` | `/websites/upstash_qstash` | `createQStashClient` 以 HTTP API 發布（無 npm 依賴）；佇列發布需支援 retry、delay、callback/failureCallback；token 來自 env var。 |
| `ui-markdown` | `/remarkjs/react-markdown`、`/remarkjs/remark-gfm` | 預設維持安全渲染（不開 raw HTML）；GFM 功能透過 `remark-gfm` 啟用。 |
| `ui-editor` | `/ueberdosis/tiptap-docs` | TipTap 3 `useEditor` + `EditorContent`；`immediatelyRender: false` 避免 Next.js SSR hydration mismatch；HTML string 為 I/O 格式。 |
| `ui-shadcn` | `/shadcn-ui/ui` | 元件來源透過 `npx shadcn@latest add`；官方檔案不手改，以 wrapper 擴充。 |
| `ui-visualization` | `/recharts/recharts` | `ResponsiveContainer` + percentage 寬高為標準響應式模式；`XuanwuLineChart`、`XuanwuBarChart`、`XuanwuPieChart` 為封裝入口。 |

> `infra/client-state`、`infra/http`、`infra/serialization`、`ui-components` 目前未綁定單一第三方 SDK 官方文件，維持本專案既有封裝規則即可。
