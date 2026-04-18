# Files

## File: packages/infra/client-state/AGENTS.md
````markdown
# infra/client-state — Agent Rules

此套件提供 **client-side 狀態原語**，供 UI 層使用的非業務狀態工具（atom、slice factory）。

---

## Route Here

| 類型 | 說明 |
|---|---|
| Zustand slice factory | 通用 slice 建立工具，不含業務語意 |
| 非業務 atom 定義 | UI-local 的暫存狀態、控制狀態 |
| client state 型別工具 | 狀態容器共用型別、工具 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務狀態（workspace、task 等） | `src/modules/<context>/interfaces/` 的 Zustand store |
| XState machine | `packages/infra/state/` |

---

## 嚴禁

- 不得 import Firebase、HTTP client 或任何外部服務
- 不得包含業務判斷邏輯（use case 層級的決策）

## Alias

```ts
import { ... } from '@infra/client-state'
```
````

## File: packages/infra/client-state/index.ts
````typescript
/**
 * @module infra/client-state
 * Client-side state primitives without business semantics.
 */
⋮----
export type ClientStateUpdater<T extends object> =
  | Partial<T>
  | ((previousState: T) => Partial<T>);
⋮----
export const updateClientState = <T extends object>(
  previousState: T,
  updater: ClientStateUpdater<T>,
): T =>
⋮----
export const cloneClientState = <T>(state: T): T =>
````

## File: packages/infra/http/AGENTS.md
````markdown
# infra/http — Agent Rules

此套件提供 **HTTP 工具原語**：fetch wrapper、retry、timeout、header helper。

---

## Route Here

| 類型 | 說明 |
|---|---|
| fetch wrapper | 統一 fetch 介面，支援 retry / timeout |
| HTTP header helper | 共用 header 工具（Content-Type、Authorization prefix 等） |
| HTTP error 型別 | `HttpError`、`NetworkError` 等共用錯誤型別 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務 API 呼叫 | `src/modules/<context>/adapters/outbound/` |
| tRPC 客戶端 | `packages/infra/trpc/` |
| Firebase SDK 呼叫 | `packages/integration-firebase/` |

---

## 嚴禁

- 不得在此套件加入業務路由邏輯或 base URL 硬編碼
- 不得 import `src/modules/*`

## Alias

```ts
import { ... } from '@infra/http'
```
````

## File: packages/infra/http/index.ts
````typescript
/**
 * @module infra/http
 * Small HTTP primitives shared by integration and adapter layers.
 */
⋮----
export interface HttpRequestOptions {
  timeoutMs?: number;
  retryCount?: number;
  retryDelayMs?: number;
}
⋮----
export class HttpError extends Error
⋮----
constructor(
    message: string,
    public readonly status: number,
    public readonly statusText: string,
)
⋮----
const wait = async (ms: number): Promise<void> =>
⋮----
const withTimeout = (timeoutMs: number): AbortController =>
⋮----
export const request = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: HttpRequestOptions = {},
): Promise<Response> =>
⋮----
export const requestJson = async <T>(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: HttpRequestOptions = {},
): Promise<T> =>
````

## File: packages/infra/serialization/AGENTS.md
````markdown
# infra/serialization — Agent Rules

此套件提供 **序列化 / 反序列化工具**：JSON 解析、binary 編碼、資料格式轉換。

---

## Route Here

| 類型 | 說明 |
|---|---|
| JSON 解析 / 序列化 | 安全 JSON parse（捕捉 SyntaxError）、stringify |
| Binary 編碼工具 | Base64、ArrayBuffer 轉換 |
| 資料格式轉換 | Blob ↔ string、File ↔ binary 等 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務 DTO 轉換 | `src/modules/<context>/application/` mappers |
| Zod schema 驗證 | `packages/infra/zod/` |

---

## 嚴禁

- 不得依賴任何外部服務或 SDK
- 不得包含業務資料結構定義

## Alias

```ts
import { ... } from '@infra/serialization'
```
````

## File: packages/infra/serialization/index.ts
````typescript
/**
 * @module infra/serialization
 * Serialization and conversion primitives.
 */
⋮----
export interface JsonParseResult {
  ok: boolean;
  value: unknown;
  error: Error | null;
}
⋮----
export const safeJsonParse = (input: string): JsonParseResult =>
⋮----
export const toJsonString = (value: unknown): string
⋮----
export const encodeBase64 = (value: string): string =>
⋮----
export const decodeBase64 = (value: string): string =>
````

## File: packages/infra/state/AGENTS.md
````markdown
# infra/state — Agent Rules

此套件提供 **本地狀態管理原語**：Zustand store factory 與 XState machine helpers。
所有工具均為本地原語，**不連接外部服務**。

---

## Route Here

| 類型 | 說明 |
|---|---|
| Zustand store factory | 建立 store 的通用 factory，不含業務 slice |
| XState machine helpers | machine config builder、service helper、type utilities |
| 狀態機共用型別 | `MachineContext`、`MachineEvent` 等共用型別 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務 Zustand store | `src/modules/<context>/interfaces/` |
| 業務 XState machine | `src/modules/<context>/application/` |
| client-side UI 狀態原語 | `packages/infra/client-state/` |

---

## 嚴禁

- 不得在此套件定義任何業務語意（workspace、task 等名詞）
- 不得 import Firebase 或任何外部 SDK

## Alias

```ts
import { ... } from '@infra/state'
```
````

## File: packages/infra/state/index.ts
````typescript
/**
 * @module infra/state
 * State management primitives for local stores and machines.
 */
⋮----
import type { StoreApi } from "zustand/vanilla";
⋮----
export const replaceStoreState = <T>(store: StoreApi<T>, nextState: T): void =>
````

## File: packages/infra/trpc/AGENTS.md
````markdown
# infra/trpc — Agent Rules

此套件提供 **tRPC 客戶端設定與 React Provider**。
注意：tRPC 連接的是**本系統自有伺服器**，不是第三方服務，故歸類為 `infra`。

---

## Route Here

| 類型 | 說明 |
|---|---|
| tRPC client 設定 | `trpc.ts` — createTRPCClient、links 設定 |
| tRPC React Provider | `TrpcProvider` component |
| tRPC 型別匯出 | `AppRouter` type re-export，供客戶端推斷 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| tRPC router 定義（server side） | `src/app/api/trpc/` |
| 業務 procedure | `src/modules/<context>/interfaces/` |
| Firebase 呼叫 | `packages/integration-firebase/` |

---

## 嚴禁

- 不得在 client 端設定中加入業務邏輯
- 不得 import `src/modules/*` 的 domain 或 application 層

## Alias

```ts
import { trpc, TrpcProvider } from '@infra/trpc'
```
````

## File: packages/infra/uuid/AGENTS.md
````markdown
# infra/uuid — Agent Rules

此套件是 **UUID 生成的唯一授權來源**。
`domain/` 層需要 id 生成時，**必須使用此套件**，不得直接呼叫 `crypto.randomUUID()`。

---

## Route Here

| 類型 | 說明 |
|---|---|
| UUID v4 生成 | `generateId()` — 唯一 id 生成入口 |
| UUID 驗證 | `isValidUUID(value)` — 格式驗證 |
| UUID 型別 | `UUID` brand type |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| domain brand type 定義 | `src/modules/<context>/domain/value-objects/` |
| Zod UUID schema | `packages/infra/zod/` |

---

## 嚴禁

```ts
// ❌ 在 domain/ 直接呼叫 crypto
const id = crypto.randomUUID()

// ✅ 必須透過此套件
import { generateId } from '@infra/uuid'
const id = generateId()
```

- 不得在此套件包含任何業務語意
- `domain/` 層違反此規則屬 ADR 1101 層違規，必須立即修正

## Alias

```ts
import { generateId, isValidUUID, type UUID } from '@infra/uuid'
```
````

## File: packages/infra/uuid/index.ts
````typescript
/**
 * @module infra/uuid
 * Canonical UUID primitive for package and module consumers.
 */
⋮----
import { validate as validateUuid, v4 as uuidv4 } from "uuid";
⋮----
export type UUID = string & { readonly __brand: "UUID" };
⋮----
export const generateId = (): UUID
⋮----
export const isValidUUID = (value: string): value is UUID
⋮----
export const asUUID = (value: string): UUID =>
````

## File: packages/infra/zod/AGENTS.md
````markdown
# infra/zod — Agent Rules

此套件提供 **Zod 基礎設施原語**：共用 schema 片段、brand type helper、通用驗證工具。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 共用 Zod schema 片段 | email、url、isoDate 等共用格式 schema |
| Brand type helper | `createBrandedId<T>()` 等建立 brand type 的工具 |
| 通用 Zod 工具 | `zodToFormError()` — Zod error 轉 UI 錯誤格式 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務 domain brand type | `src/modules/<context>/domain/value-objects/` |
| 外部 boundary 驗證 schema | `src/modules/<context>/interfaces/` server action 邊界 |
| infrastructure output 驗證 | `src/modules/<context>/adapters/outbound/` |

---

## 嚴禁

- 不得在此套件加入業務規則（invariant）
- 不得 import `src/modules/*`

## Alias

```ts
import { ... } from '@infra/zod'
```
````

## File: packages/infra/zod/index.ts
````typescript
/**
 * @module infra/zod
 * Shared Zod primitives and utility helpers.
 */
⋮----
import { z, type ZodError } from "zod";
⋮----
export const createBrandedUuidSchema = <Brand extends string>(brand: Brand)
⋮----
export const zodErrorToFieldMap = (error: ZodError): Record<string, string[]> =>
````

## File: packages/infra/AGENTS.md
````markdown
# infra — Agent Rules

此目錄是 **本地基礎設施原語（infra primitives）** 的唯一存放層。
所有套件均**無外部服務依賴**，離線可用，不需要憑證。

---

## 子套件一覽

| 子套件 | alias | 職責 |
|---|---|---|
| `infra/client-state` | `@infra/client-state` | client-side 狀態原語（非業務 atom / slice） |
| `infra/http` | `@infra/http` | HTTP 工具（fetch wrapper、retry、timeout） |
| `infra/serialization` | `@infra/serialization` | 序列化 / 反序列化工具 |
| `infra/state` | `@infra/state` | 本地狀態管理原語（Zustand store factory、XState machine helpers） |
| `infra/trpc` | `@infra/trpc` | tRPC 客戶端設定與 Provider |
| `infra/uuid` | `@infra/uuid` | UUID 生成（domain 層唯一 id 來源） |
| `infra/zod` | `@infra/zod` | Zod 基礎設施原語（共用 schema 片段、brand helper） |

---

## 核心規則

- 所有 `infra/*` 套件**不得依賴任何外部服務**（Firebase、Google AI、QStash…）
- 不得 import `src/modules/*` 的任何路徑
- 每個子套件的 `index.ts` 是唯一公開入口
- 新增套件前，先確認它是「本地原語」而非「外部服務整合」

## 公開入口檢查

- `infra/client-state/index.ts`
- `infra/http/index.ts`
- `infra/serialization/index.ts`
- `infra/state/index.ts`
- `infra/trpc/index.ts`
- `infra/uuid/index.ts`
- `infra/zod/index.ts`

若新增或刪除 `infra/*` 子套件，需同步更新 `packages/index.ts` 的具名匯出。

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 需要 credentials / 網路 / 第三方帳號 | `packages/integration-*` |
| 業務邏輯 | `src/modules/<context>/domain/` 或 `application/` |
| UI 元件 | `packages/ui-*` |
````

## File: packages/integration-ai/AGENTS.md
````markdown
# integration-ai — Agent Rules

此套件是 **AI 服務整合的唯一封裝層**：Genkit、Google AI、OpenAI。
AI 能力的 provider 設定與 flow 呼叫必須集中在此，業務層不得直接 import AI SDK。

---

## Route Here

| 類型 | 說明 |
|---|---|
| Genkit flow 呼叫 | `runGenkitFlow(flowName, input)` — flow 呼叫入口 |
| AI provider 初始化 | Google AI / OpenAI client 設定 |
| AI 服務 API 型別 | `GenerateRequest`、`GenerateResponse` 等共用型別 |
| Safety / policy 設定原語 | 供 `src/modules/ai/` 消費的 policy config |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| AI 業務邏輯（prompt 組裝、RAG 流程） | `src/modules/ai/` |
| Notebook 推理流程 | `src/modules/notebooklm/` |
| Genkit flow **定義**（非呼叫） | `src/modules/ai/` 或 py_fn/ |

---

## 嚴禁

```ts
// ❌ 在 modules/notebooklm 直接 import AI SDK
import { generate } from '@genkit-ai/core'

// ✅ 透過此套件或 modules/ai 邊界
import { runGenkitFlow } from '@integration-ai'
```

- 不得在此套件加入業務 prompt 範本或 RAG 邏輯
- 不得 import `src/modules/*`
- 環境設定只能來自 env vars（`GOOGLE_AI_API_KEY` 等）

## Alias

```ts
import { ... } from '@integration-ai'
```
````

## File: packages/integration-ai/index.ts
````typescript
/**
 * @module integration-ai
 * External AI integration contracts.
 */
⋮----
export interface AiGenerateTextInput {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  metadata?: Record<string, string>;
}
⋮----
export interface AiGenerateTextResult {
  text: string;
  model: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}
⋮----
export interface AiTextClient {
  generateText(input: AiGenerateTextInput): Promise<AiGenerateTextResult>;
}
⋮----
generateText(input: AiGenerateTextInput): Promise<AiGenerateTextResult>;
⋮----
export class IntegrationAiConfigurationError extends Error
⋮----
constructor(message: string)
⋮----
export const createUnconfiguredAiClient = (): AiTextClient => (
````

## File: packages/integration-firebase/auth.ts
````typescript
/**
 * @module integration-firebase/auth
 * Firebase Authentication client helpers.
 */
⋮----
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseAuth()
````

## File: packages/integration-firebase/client.ts
````typescript
/**
 * @module integration-firebase/client
 * Singleton Firebase app initialization for the web client.
 */
⋮----
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
````

## File: packages/integration-firebase/firestore.ts
````typescript
/**
 * @module integration-firebase/firestore
 * Firebase Firestore client helpers.
 */
⋮----
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  writeBatch,
  increment,
  type Firestore,
} from "firebase/firestore";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseFirestore(): Firestore
````

## File: packages/integration-firebase/functions.ts
````typescript
/**
 * @module integration-firebase/functions
 * Firebase Cloud Functions (HTTPS Callable) client helpers.
 */
⋮----
import { getFunctions, httpsCallable, type Functions } from "firebase/functions";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseFunctions(): Functions
````

## File: packages/integration-firebase/index.ts
````typescript
/**
 * @module integration-firebase
 * Public surface for the Firebase client integration package.
 */
````

## File: packages/integration-firebase/storage.ts
````typescript
/**
 * @module integration-firebase/storage
 * Firebase Cloud Storage client helpers.
 */
⋮----
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  type FirebaseStorage,
  type StorageReference,
  type UploadResult,
  type UploadTask,
} from "firebase/storage";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseStorage(): FirebaseStorage
````

## File: packages/integration-queue/AGENTS.md
````markdown
# integration-queue — Agent Rules

此套件是 **訊息佇列整合的唯一封裝層**：QStash、Google Cloud Tasks。

---

## Route Here

| 類型 | 說明 |
|---|---|
| QStash 訊息發布 | `publishToQueue(topic, payload)` |
| Cloud Tasks 任務建立 | `enqueueCloudTask(queue, url, payload)` |
| Queue 設定原語 | topic 名稱常數、delivery 設定 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務任務內容與邏輯 | `src/modules/<context>/application/` |
| 背景工作處理 handler | `src/app/api/` 或 `py_fn/` |

---

## 嚴禁

```ts
// ❌ 在 domain 直接 import queue SDK
import { Client } from '@upstash/qstash'

// ✅ 透過此套件
import { publishToQueue } from '@integration-queue'
```

- 不得在此套件包含業務 payload 建構邏輯
- 不得 import `src/modules/*`
- 憑證只能來自 env vars（`QSTASH_TOKEN` 等）

## Alias

```ts
import { ... } from '@integration-queue'
```
````

## File: packages/integration-queue/index.ts
````typescript
/**
 * @module integration-queue
 * Queue integration contracts and in-memory fallback primitive.
 */
⋮----
export interface QueueMessage {
  topic: string;
  payload: Record<string, unknown>;
  delaySeconds?: number;
}
⋮----
export interface QueuePublisher {
  publish(message: QueueMessage): Promise<{ messageId: string }>;
}
⋮----
publish(message: QueueMessage): Promise<
⋮----
export class QueuePublishError extends Error
⋮----
constructor(message: string)
⋮----
export const createInMemoryQueuePublisher = (): QueuePublisher => (
````

## File: packages/ui-components/AGENTS.md
````markdown
# ui-components — Agent Rules

此套件是 **業務無關的自訂 UI 組件庫**，提供設計系統擴充組件與 shadcn/ui 的 thin wrapper。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 設計系統擴充組件 | 有設計語意但無業務語意的組件（`DataTable`、`EmptyState`、`LoadingSkeleton`） |
| shadcn thin wrapper | 加設計 token 或共用 variant 的 wrapper |
| Layout 原語 | `PageShell`、`SectionHeader` 等版面組件 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 有業務語意的 UI（WorkspaceCard、TaskRow） | `src/modules/<context>/interfaces/` |
| shadcn 官方原始組件 | `packages/ui-shadcn/ui/`（CLI 生成，不直接放這裡）|
| 主題 token | `src/app/globals.css` CSS 變數層 |

---

## 嚴禁

- 不得包含業務判斷邏輯（module 層級 use case、domain rule）
- 不得 import `src/modules/*`
- 不得 import Firebase 或任何外部服務 SDK

## Alias

```ts
import { ... } from '@ui-components'
```
````

## File: packages/ui-components/index.ts
````typescript
/**
 * @module ui-components
 * Shared UI primitives without business semantics.
 */
⋮----
import { createElement, type HTMLAttributes, type ReactNode } from "react";
⋮----
export interface PageSectionProps extends HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  actions?: ReactNode;
}
⋮----
export const PageSection = ({
  title,
  description,
  actions,
  children,
  ...rest
}: PageSectionProps)
⋮----
export interface EmptyStateProps {
  title: string;
  description?: string;
}
⋮----
export const EmptyState = (
````

## File: packages/ui-editor/AGENTS.md
````markdown
# ui-editor — Agent Rules

此套件是 **富文字編輯器的封裝層**：TipTap wrapper、editor 設定、extensions。

---

## Route Here

| 類型 | 說明 |
|---|---|
| TipTap Editor 組件 | `RichTextEditor`、`ReadOnlyEditor` 等 React 組件 |
| TipTap extension 設定 | 共用 extension 清單、toolbar 設定 |
| Editor 型別 | `EditorContent`、`EditorState` 等共用型別 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 文件內容業務邏輯 | `src/modules/notion/` |
| AI 寫作輔助邏輯 | `src/modules/ai/` |
| Markdown 純渲染（非編輯） | `packages/ui-markdown/` |

---

## 嚴禁

```ts
// ❌ 在 editor 套件加業務儲存邏輯
onUpdate({ editor }) { saveDocument(editor.getJSON()) }

// ✅ 透過 props 回調交給模組處理
<RichTextEditor onChange={(content) => props.onContentChange(content)} />
```

- 不得在此套件 import `src/modules/*`
- 不得包含 Firestore 讀寫操作

## Alias

```ts
import { RichTextEditor } from '@ui-editor'
```
````

## File: packages/ui-editor/index.ts
````typescript
/**
 * @module ui-editor
 * Lightweight editor wrappers for package-level composition.
 */
⋮----
import { createElement, type ChangeEventHandler, type TextareaHTMLAttributes } from "react";
⋮----
export interface RichTextEditorProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}
⋮----
export const RichTextEditor = (
⋮----
const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) =>
⋮----
export interface ReadOnlyEditorProps {
  value: string;
}
⋮----
export const ReadOnlyEditor = (
````

## File: packages/ui-markdown/AGENTS.md
````markdown
# ui-markdown — Agent Rules

此套件提供 **Markdown 渲染組件**，將 Markdown 字串轉換為格式化 HTML 輸出。

---

## Route Here

| 類型 | 說明 |
|---|---|
| Markdown → HTML 渲染 | `MarkdownRenderer` React 組件 |
| Markdown 樣式設定 | 渲染組件的 Tailwind typography 主題 |
| Syntax highlight 設定 | 程式碼區塊 highlight 設定（shiki / prism） |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| Markdown 內容業務處理 | `src/modules/<context>/application/` |
| 富文字**編輯**功能 | `packages/ui-editor/` |
| AI 生成內容的後處理 | `src/modules/notebooklm/` 或 `src/modules/ai/` |

---

## 嚴禁

- 不得在組件內改變 Markdown 內容（sanitize 除外）
- 不得 import `src/modules/*`
- 若需要 sanitize，使用安全 library（如 `dompurify`），不得 bypass

## Alias

```ts
import { MarkdownRenderer } from '@ui-markdown'
```
````

## File: packages/ui-markdown/index.tsx
````typescript
/**
 * @module ui-markdown
 * Markdown rendering primitives.
 */
⋮----
import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
⋮----
export interface MarkdownRendererProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  markdown: string;
}
````

## File: packages/ui-shadcn/hooks/use-mobile.ts
````typescript
export function useIsMobile()
⋮----
const onChange = () =>
````

## File: packages/ui-shadcn/lib/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
⋮----
export function cn(...inputs: ClassValue[])
````

## File: packages/ui-shadcn/provider/theme-provider.tsx
````typescript
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
⋮----
function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>)
⋮----
function isTypingTarget(target: EventTarget | null)
⋮----
function ThemeHotkey()
⋮----
function onKeyDown(event: KeyboardEvent)
````

## File: packages/ui-shadcn/ui/accordion.tsx
````typescript
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
⋮----
function Accordion(
⋮----
function AccordionItem(
⋮----
function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props)
⋮----
function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props)
````

## File: packages/ui-shadcn/ui/alert-dialog.tsx
````typescript
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
⋮----
function AlertDialog(
⋮----
className=
````

## File: packages/ui-shadcn/ui/alert.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/aspect-ratio.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/avatar.tsx
````typescript
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/badge.tsx
````typescript
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>)
````

## File: packages/ui-shadcn/ui/breadcrumb.tsx
````typescript
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
⋮----
function Breadcrumb(
⋮----
className=
````

## File: packages/ui-shadcn/ui/button-group.tsx
````typescript
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Separator } from "@/packages/ui-shadcn/ui/separator"
⋮----
className=
````

## File: packages/ui-shadcn/ui/button.tsx
````typescript
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/calendar.tsx
````typescript
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button, buttonVariants } from "@/packages/ui-shadcn/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/card.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/carousel.tsx
````typescript
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
⋮----
type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]
⋮----
type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}
⋮----
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps
⋮----
function useCarousel()
⋮----
function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps)
⋮----
className=
⋮----
function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>)
````

## File: packages/ui-shadcn/ui/chart.tsx
````typescript
type TooltipValueType = number | string | Array<number | string>
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
// Format: { THEME_NAME: CSS_SELECTOR }
⋮----
type TooltipNameType = number | string
⋮----
export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>
⋮----
type ChartContextProps = {
  config: ChartConfig
}
⋮----
function useChart()
⋮----
className=
⋮----
<div className=
⋮----
return <div className=
````

## File: packages/ui-shadcn/ui/checkbox.tsx
````typescript
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { CheckIcon } from "lucide-react"
⋮----
function Checkbox(
````

## File: packages/ui-shadcn/ui/collapsible.tsx
````typescript
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
⋮----
function Collapsible(
````

## File: packages/ui-shadcn/ui/combobox.tsx
````typescript
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/packages/ui-shadcn/ui/input-group"
import { ChevronDownIcon, XIcon, CheckIcon } from "lucide-react"
⋮----
function ComboboxValue(
⋮----
function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props)
⋮----
function ComboboxClear(
⋮----
className=
````

## File: packages/ui-shadcn/ui/command.tsx
````typescript
import { Command as CommandPrimitive } from "cmdk"
⋮----
import { cn } from "@/packages/ui-shadcn"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/packages/ui-shadcn/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
} from "@/packages/ui-shadcn/ui/input-group"
import { SearchIcon, CheckIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/context-menu.tsx
````typescript
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { ChevronRightIcon, CheckIcon } from "lucide-react"
⋮----
function ContextMenu(
⋮----
className=
⋮----
function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuPrimitive.Separator.Props)
````

## File: packages/ui-shadcn/ui/dialog.tsx
````typescript
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import { XIcon } from "lucide-react"
⋮----
function Dialog(
⋮----
function DialogTrigger(
⋮----
function DialogPortal(
⋮----
function DialogClose(
⋮----
className=
````

## File: packages/ui-shadcn/ui/direction.tsx
````typescript

````

## File: packages/ui-shadcn/ui/drawer.tsx
````typescript
import { Drawer as DrawerPrimitive } from "vaul"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>)
⋮----
function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>)
⋮----
function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>)
⋮----
function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>)
⋮----
function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>)
⋮----
className=
````

## File: packages/ui-shadcn/ui/dropdown-menu.tsx
````typescript
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { ChevronRightIcon, CheckIcon } from "lucide-react"
⋮----
function DropdownMenu(
⋮----
function DropdownMenuPortal(
⋮----
function DropdownMenuTrigger(
⋮----
className=
⋮----
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
})
⋮----
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
})
⋮----
function DropdownMenuRadioGroup(
⋮----
function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props)
````

## File: packages/ui-shadcn/ui/empty.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/field.tsx
````typescript
import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Label } from "@/packages/ui-shadcn/ui/label"
import { Separator } from "@/packages/ui-shadcn/ui/separator"
⋮----
className=
````

## File: packages/ui-shadcn/ui/hover-card.tsx
````typescript
import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function HoverCard(
````

## File: packages/ui-shadcn/ui/input-group.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import { Input } from "@/packages/ui-shadcn/ui/input"
import { Textarea } from "@/packages/ui-shadcn/ui/textarea"
⋮----
className=
⋮----
if ((e.target as HTMLElement).closest("button"))
````

## File: packages/ui-shadcn/ui/input-otp.tsx
````typescript
import { OTPInput, OTPInputContext } from "input-otp"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { MinusIcon } from "lucide-react"
⋮----
containerClassName=
className=
````

## File: packages/ui-shadcn/ui/input.tsx
````typescript
import { Input as InputPrimitive } from "@base-ui/react/input"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function Input(
⋮----
className=
````

## File: packages/ui-shadcn/ui/item.tsx
````typescript
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Separator } from "@/packages/ui-shadcn/ui/separator"
⋮----
function ItemGroup(
⋮----
function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof itemVariants>)
⋮----
className=
````

## File: packages/ui-shadcn/ui/kbd.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/label.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/menubar.tsx
````typescript
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"
⋮----
import { cn } from "@/packages/ui-shadcn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/packages/ui-shadcn/ui/dropdown-menu"
import { CheckIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/native-select.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
import { ChevronDownIcon } from "lucide-react"
⋮----
type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}
⋮----
function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps)
⋮----
className=
````

## File: packages/ui-shadcn/ui/navigation-menu.tsx
````typescript
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { ChevronDownIcon } from "lucide-react"
⋮----
className=
⋮----
function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props)
⋮----
function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props)
⋮----
function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props)
````

## File: packages/ui-shadcn/ui/pagination.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
⋮----
className=
⋮----
function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps)
⋮----
function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> &
⋮----
function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> &
⋮----
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">)
````

## File: packages/ui-shadcn/ui/popover.tsx
````typescript
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function Popover(
⋮----
function PopoverTrigger(
⋮----
className=
````

## File: packages/ui-shadcn/ui/progress.tsx
````typescript
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function Progress({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props)
⋮----
function ProgressTrack(
⋮----
className=
````

## File: packages/ui-shadcn/ui/radio-group.tsx
````typescript
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function RadioGroup(
⋮----
className=
````

## File: packages/ui-shadcn/ui/resizable.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
````

## File: packages/ui-shadcn/ui/scroll-area.tsx
````typescript
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props)
⋮----
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props)
````

## File: packages/ui-shadcn/ui/select.tsx
````typescript
import { Select as SelectPrimitive } from "@base-ui/react/select"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"
⋮----
function SelectGroup(
⋮----
function SelectValue(
⋮----
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
})
⋮----
className=
⋮----
function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props)
⋮----
function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props)
⋮----
function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props)
⋮----
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>)
````

## File: packages/ui-shadcn/ui/separator.tsx
````typescript
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/sheet.tsx
````typescript
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import { XIcon } from "lucide-react"
⋮----
function Sheet(
⋮----
function SheetTrigger(
⋮----
function SheetClose(
⋮----
function SheetPortal(
⋮----
className=
````

## File: packages/ui-shadcn/ui/sidebar.tsx
````typescript
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { useIsMobile } from "@/packages/ui-shadcn/hooks/use-mobile"
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import { Input } from "@/packages/ui-shadcn/ui/input"
import { Separator } from "@/packages/ui-shadcn/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/packages/ui-shadcn/ui/sheet"
import { Skeleton } from "@/packages/ui-shadcn/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/packages/ui-shadcn/ui/tooltip"
import { PanelLeftIcon } from "lucide-react"
⋮----
type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}
⋮----
function useSidebar()
⋮----
// This is the internal state of the sidebar.
// We use openProp and setOpenProp for control from outside the component.
⋮----
// This sets the cookie to keep the sidebar state.
⋮----
// Helper to toggle the sidebar.
⋮----
// Adds a keyboard shortcut to toggle the sidebar.
⋮----
const handleKeyDown = (event: KeyboardEvent) =>
⋮----
// We add a state so that we can do data-state="expanded" or "collapsed".
// This makes it easier to style the sidebar with Tailwind classes.
⋮----
className=
⋮----
{/* This is what handles the sidebar gap on desktop */}
⋮----
// Adjust the padding for floating and inset variants.
⋮----
function SidebarGroupAction({
  className,
  render,
  ...props
}: useRender.ComponentProps<"button"> & React.ComponentProps<"button">)
⋮----
function SidebarMenuAction({
  className,
  render,
  showOnHover = false,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    showOnHover?: boolean
})
⋮----
// Random width between 50 to 90%.
````

## File: packages/ui-shadcn/ui/skeleton.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/slider.tsx
````typescript
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/sonner.tsx
````typescript
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"
````

## File: packages/ui-shadcn/ui/spinner.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
import { Loader2Icon } from "lucide-react"
⋮----
function Spinner(
⋮----
<Loader2Icon role="status" aria-label="Loading" className=
````

## File: packages/ui-shadcn/ui/switch.tsx
````typescript
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
})
⋮----
className=
````

## File: packages/ui-shadcn/ui/table.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/tabs.tsx
````typescript
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
⋮----
return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger(
````

## File: packages/ui-shadcn/ui/textarea.tsx
````typescript
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/toggle-group.tsx
````typescript
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { toggleVariants } from "@/packages/ui-shadcn/ui/toggle"
⋮----
function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
})
⋮----
className=
⋮----
function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>)
````

## File: packages/ui-shadcn/ui/toggle.tsx
````typescript
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
className=
````

## File: packages/ui-shadcn/ui/tooltip.tsx
````typescript
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
⋮----
import { cn } from "@/packages/ui-shadcn"
⋮----
function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
>)
⋮----
className=
````

## File: packages/ui-shadcn/ui-custom/form/.gitkeep
````

````

## File: packages/ui-shadcn/ui-custom/modal/.gitkeep
````

````

## File: packages/ui-shadcn/ui-custom/table/.gitkeep
````

````

## File: packages/ui-shadcn/AGENTS.md
````markdown
# AGENTS.md — packages/ui-shadcn

## ⛔ 禁止直接修改此套件

`packages/ui-shadcn/` 是 **shadcn/ui 官方組件庫的原始輸出目錄**。
所有 `ui/` 下的組件皆由 `shadcn` CLI 生成，不得手動編輯。

---

## 為什麼禁止修改

| 理由 | 說明 |
|---|---|
| 官方組件來源 | `ui/` 下每個檔案都是由 `npx shadcn add <component>` 生成 |
| CLI 覆寫會 overwrite | 下次執行 `shadcn add` 或 `shadcn diff` 會直接覆寫手動修改 |
| 版本追蹤困難 | 手動修改混入 CLI 更新，導致 diff 不可讀、回退困難 |
| 架構邊界 | 此套件是 **pure UI primitive**，不承載業務邏輯 |

---

## 允許的操作

| 操作 | 方式 |
|---|---|
| 新增組件 | `npx shadcn add <component>` — 由 CLI 生成，不要手動建檔 |
| 升級組件 | `npx shadcn diff` 預覽差異，`npx shadcn update` 更新 |
| 查看可用組件 | `npx shadcn list` |
| 客製化樣式 | 在消費端（`src/app/`、`src/modules/*/interfaces/`）wrapping，不改本套件 |
| Provider / hooks | `provider/` 與 `hooks/` 為此套件的 thin wrapper，修改前需確認不是官方管理範圍 |

---

## 正確的客製化路徑

```
❌ 不對
packages/ui-shadcn/ui/button.tsx        ← 直接改官方組件
src/app/components/AppButton.tsx        ← 不應散落在 src/app

✅ 正確
packages/ui-shadcn/ui-custom/           ← 所有自訂 UI 組件的唯一存放位置
  AppButton.tsx                         ← wrap 官方組件，加入業務語意或設計系統層
  ...
src/modules/<context>/interfaces/       ← 組合 ui-custom 為模組業務 UI pattern
```

---

## Route Here / Route Elsewhere

| 任務 | 路由 |
|---|---|
| 新增 shadcn 原生組件 | 這裡（CLI 執行） |
| 修改組件 **外觀** | `packages/ui-shadcn/ui-custom/` — wrap 官方組件加設計語意 |
| 修改組件 **行為** | `packages/ui-shadcn/ui-custom/` — 同上，不直接改 `ui/` |
| 消費官方原件 | `import { Button } from "@ui-shadcn/ui/button"` |
| 消費自訂組件 | `import { AppButton } from "@ui-shadcn/ui-custom/AppButton"` |
| 主題 / design token | `src/app/globals.css` 的 CSS 變數層 |

---

## 別名

```ts
// tsconfig.json 中已配置
"@ui-shadcn/*": ["packages/ui-shadcn/*"]
```

消費端使用 `@ui-shadcn/ui/<component>` import，不用相對路徑。
````

## File: packages/ui-shadcn/README.md
````markdown
# packages/ui-shadcn

官方 shadcn/ui 組件輸出目錄。**此套件由 shadcn CLI 管理，禁止手動修改 `ui/` 目錄下的任何檔案。**

---

## 用途

提供系統所有 UI primitive 的統一來源，供 `src/app/` 與 `src/modules/*/interfaces/` 組合消費。

---

## 套件結構

```
packages/ui-shadcn/
  ui/          ← 官方組件（CLI 生成，禁止手動修改）
  ui-custom/   ← ✅ 自訂組件唯一存放目錄（wrap 官方組件或設計系統擴充）
  hooks/       ← shadcn 配套 hooks（use-mobile 等）
  lib/         ← cn() 工具（tailwind-merge + clsx）
  provider/    ← ThemeProvider 等 thin wrapper
  index.ts     ← 統一 re-export
```

---

## ⛔ 禁止手動修改 `ui/`

`ui/` 下的所有組件皆由以下指令生成：

```bash
npx shadcn add <component-name>
```

手動修改 `ui/` 內的檔案會在次次 `shadcn add` / `shadcn update` 時被覆寫，且無法被 diff 追蹤。

---

## 組件管理

| 操作 | 指令 |
|---|---|
| 新增組件 | `npx shadcn add <component>` |
| 查看可用組件 | `npx shadcn list` |
| 檢視版本差異 | `npx shadcn diff` |
| 更新組件 | `npx shadcn update <component>` |

---

## 消費方式

所有消費端透過別名 import，不使用相對路徑：

```ts
// 官方組件
import { Button } from "@ui-shadcn/ui/button";
import { cn } from "@ui-shadcn/lib/utils";
import { useIsMobile } from "@ui-shadcn/hooks/use-mobile";

// 自訂組件（ui-custom 唯一存放點）
import { AppButton } from "@ui-shadcn/ui-custom/AppButton";
```

---

## 客製化原則

不修改 `ui/` 目錄下的官方組件。**所有自訂 UI 組件一律放在 `ui-custom/`**：

```
packages/ui-shadcn/
  ui/           ← 官方組件（CLI 管理，禁止修改）
  ui-custom/    ← ✅ 唯一允許放置自訂組件的目錄
```

- **樣式覆寫**：透過 `src/app/globals.css` CSS 變數（`--primary`、`--radius` 等）
- **行為擴充 / 業務語意**：在 `ui-custom/` 建立 wrapper，如 `AppButton`、`FormField`
- **模組級組合**：`src/modules/<context>/interfaces/` 消費 `ui-custom/` 組合為業務 pattern

---

## 相關配置

- `components.json` — shadcn CLI 配置（別名、style、baseColor）
- `tailwind.config.ts` — Tailwind CSS 4 設定
- `tsconfig.json` — `@ui-shadcn/*` path alias
````

## File: packages/ui-visualization/AGENTS.md
````markdown
# ui-visualization — Agent Rules

此套件提供 **資料視覺化組件**：圖表（charts）、圖形（graphs）、儀表板 widget。

---

## Route Here

| 類型 | 說明 |
|---|---|
| Chart 組件 | `LineChart`、`BarChart`、`PieChart` 等 React wrapper |
| Graph 組件 | `NetworkGraph`、`TreeDiagram` 等 |
| 儀表板 widget 原語 | `StatCard`、`MetricDisplay` 等數字展示組件 |
| Chart 共用型別 | `ChartDataPoint`、`ChartSeries` 等 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 資料聚合 / 業務計算 | `src/modules/analytics/` |
| 儀表板頁面組合 | `src/app/` 或 `src/modules/analytics/interfaces/` |

---

## 嚴禁

- 不得在組件內直接呼叫 Firestore 或 API
- 不得包含業務資料聚合邏輯（圖表只接受已計算的資料 props）
- 不得 import `src/modules/*`

## Alias

```ts
import { LineChart, StatCard } from '@ui-visualization'
```
````

## File: packages/ui-visualization/index.ts
````typescript
/**
 * @module ui-visualization
 * Presentation-only visualization primitives.
 */
⋮----
import { createElement, type ReactNode } from "react";
⋮----
export interface StatCardProps {
  label: string;
  value: string | number;
  caption?: string;
  icon?: ReactNode;
}
⋮----
export const StatCard = (
````

## File: packages/infra/trpc/index.ts
````typescript
/**
 * @module infra/trpc
 * Shared tRPC client primitives.
 */
````

## File: packages/integration-firebase/AGENTS.md
````markdown
# integration-firebase — Agent Rules

此套件是 **Firebase Client SDK 的唯一封裝層**。所有與 Firebase 服務的互動必須透過這個套件提供的介面，不得在 `src/modules/` 或 `src/app/` 中直接 import Firebase SDK。

---

## Route Here（放這裡）

| 類型 | 說明 |
|---|---|
| Firebase App 初始化 | `client.ts` — singleton `firebaseClientApp` |
| Firebase Auth 操作 | `auth.ts` — `getFirebaseAuth`, `onFirebaseAuthStateChanged`, `signOutFirebase` |
| Firestore 操作原語 | `firestore.ts` — `firestoreApi`, `getFirebaseFirestore` |
| Firebase Functions 操作 | `functions.ts` — `getFirebaseFunctions`, `httpsCallable` |
| Firebase Storage 操作 | `storage.ts` — `getFirebaseStorage`, `ref`, `uploadBytes`, `getDownloadURL` |
| 新增 Firebase 服務封裝 | 在此套件新增對應 `.ts` 並從 `index.ts` re-export |

## Route Elsewhere（不放這裡）

| 類型 | 正確位置 |
|---|---|
| 業務邏輯（use case、domain rule） | `src/modules/<context>/domain/` 或 `application/` |
| Repository 實作（Firestore CRUD 業務查詢） | `src/modules/<context>/adapters/outbound/` |
| 跨模組資料協調 | `src/modules/<context>/index.ts` |
| UI 組件 | `packages/ui-shadcn/ui-custom/` |

---

## 嚴禁

```ts
// ❌ 直接在 modules 或 app 中 import Firebase SDK
import { getFirestore } from 'firebase/firestore'

// ✅ 必須透過此套件
import { firestoreApi, getFirebaseFirestore } from '@integration-firebase'
```

- 不得在此套件加入業務判斷邏輯
- 不得 import `src/modules/*` 任何路徑
- 不得在此套件處理認證 session 狀態（由 iam module 負責）
- 環境設定只能來自 `NEXT_PUBLIC_FIREBASE_*` env vars

---

## Context7 官方基線

- 文件來源：`/firebase/firebase-js-sdk`
- 必守準則：
  - 維持 modular API 用法，避免 namespaced 舊寫法。
  - App 初始化保持 singleton（`getApps/getApp/initializeApp`）。
  - `index.ts` 僅 re-export SDK 封裝，不洩漏業務語意。

---

## Alias

```ts
import { ... } from '@integration-firebase'
import { ... } from '@integration-firebase/auth'
import { ... } from '@integration-firebase/firestore'
```

`@integration-firebase` alias 定義在 `tsconfig.json`，只允許在 `src/modules/*/adapters/outbound/` 使用（ESLint boundary 規則）。
````

## File: packages/integration-firebase/README.md
````markdown
# integration-firebase

Firebase Client SDK 封裝套件。提供 Firebase App、Auth、Firestore 的穩定介面，隔離 SDK 細節與 `src/modules/` 業務層。

## 套件結構

```
packages/integration-firebase/
  client.ts     ← Firebase App singleton 初始化
  auth.ts       ← Auth 操作（getAuth、onAuthStateChanged、signOut）
  firestore.ts  ← Firestore 操作原語（firestoreApi）
  functions.ts  ← Functions 操作（getFunctions、httpsCallable）
  storage.ts    ← Storage 操作（ref、uploadBytes、getDownloadURL）
  index.ts      ← 統一 re-export
  AGENTS.md     ← Agent 使用規則
```

## 公開 API

```ts
// Firebase App
import { firebaseClientApp } from '@integration-firebase'

// Auth
import {
  getFirebaseAuth,
  onFirebaseAuthStateChanged,
  signOutFirebase,
  type User,
} from '@integration-firebase'

// Firestore
import {
  getFirebaseFirestore,
  firestoreApi,
  type Firestore,
} from '@integration-firebase'

// Functions
import {
  getFirebaseFunctions,
  httpsCallable,
  type Functions,
} from '@integration-firebase'

// Storage
import {
  getFirebaseStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  type FirebaseStorage,
} from '@integration-firebase'
```

## 使用限制

| 規則 | 說明 |
|---|---|
| **只允許在 outbound adapters 使用** | ESLint boundary 限制 `src/modules/*/adapters/outbound/` |
| **禁止直接 import Firebase SDK** | 所有 Firebase 操作必須透過此套件 |
| **禁止加入業務邏輯** | 此套件只封裝 SDK，不含 domain rule |

## 設定來源

所有 Firebase 設定從 `NEXT_PUBLIC_FIREBASE_*` 環境變數讀取，詳見 `client.ts`。

## Context7 官方基線

- 文件來源：`/firebase/firebase-js-sdk`
- 實作原則：
  - 維持 modular import（`firebase/app`, `firebase/auth`, `firebase/firestore`, `firebase/storage`, `firebase/functions`）。
  - App 初始化維持 singleton（`getApps().length === 0 ? initializeApp(...) : getApp()`）。
  - 僅封裝 SDK 能力，不在此層加入業務規則。
````

## File: packages/ui-shadcn/index.ts
````typescript
/**
 * @module ui-shadcn
 * Public surface for all shadcn/ui components and providers.
 * Re-exports every named export from each component file.
 */
⋮----
// ─── utilities ────────────────────────────────────────────────────────────────
⋮----
// ─── provider ─────────────────────────────────────────────────────────────────
⋮----
// ─── ui components ────────────────────────────────────────────────────────────
````

## File: packages/AGENTS.md
````markdown
# packages — Agent Rules

此目錄是所有 **外部 SDK 與共享能力的唯一封裝層**。修改或新增任何套件前，先確認責任歸屬。

---

## Route Here（放這裡）

### 🧱 infra/* — 基礎設施原語層

| 類型 | 正確套件 |
|---|---|
| client-side 狀態原語（非業務） | `infra/client-state/` → `@infra/client-state` |
| HTTP 工具（fetch wrapper、retry） | `infra/http/` → `@infra/http` |
| 序列化 / 反序列化工具 | `infra/serialization/` → `@infra/serialization` |
| 本地狀態管理原語（Zustand store factory、XState machine helpers） | `infra/state/` → `@infra/state` |
| tRPC 客戶端設定與 Provider（連接自己的 server，非第三方服務） | `infra/trpc/` → `@infra/trpc` |
| UUID 生成（domain 層 id 的唯一來源） | `infra/uuid/` → `@infra/uuid` |
| Zod 共用 schema 片段、brand helper | `infra/zod/` → `@infra/zod` |

### 🔌 integration-* — 外部服務整合層

| 類型 | 正確套件 |
|---|---|
| AI 服務整合（Genkit 封裝、Google AI、OpenAI） | `integration-ai/` → `@integration-ai` |
| Firebase 整合（App 初始化、Firestore、Auth、Storage、Functions、Realtime） | `integration-firebase/` → `@integration-firebase` |
| 訊息佇列整合（QStash、Cloud Tasks） | `integration-queue/` → `@integration-queue` |

### 🎨 ui-* — UI 元件層

| 類型 | 正確套件 |
|---|---|
| 業務無關自訂 UI 元件（wrap、design-system 擴充） | `ui-components/` → `@ui-components` |
| 富文本編輯器（TipTap 封裝） | `ui-editor/` → `@ui-editor` |
| Markdown 渲染元件 | `ui-markdown/` → `@ui-markdown` |
| 官方 shadcn/ui 組件（`npx shadcn add`） | `ui-shadcn/` → `@ui-shadcn`（CLI 管理，禁止手動修改） |
| 數據視覺化元件（圖表、圖形） | `ui-visualization/` → `@ui-visualization` |

## Route Elsewhere（不放這裡）

| 類型 | 正確位置 |
|---|---|
| 業務邏輯（use case、domain rule） | `src/modules/<context>/domain/` 或 `application/` |
| Repository 實作 | `src/modules/<context>/adapters/outbound/` |
| 頁面組合與路由 | `src/app/` |
| 模組業務 UI pattern | `src/modules/<context>/interfaces/` |

---

## 嚴禁

```ts
// ❌ 在任何 packages/ 套件中 import modules
import { something } from '@/modules/...'

// ❌ 在 src/modules/ 直接 import 第三方 library
import { getFirestore } from 'firebase/firestore'

// ❌ 直接修改 ui-shadcn/ui/ 的官方組件
// ui/button.tsx ← 禁止手動編輯

// ✅ 自訂組件放 ui-custom/
// ui-custom/AppButton.tsx ← 正確位置
```

- 不得在套件層加入業務判斷邏輯
- 每個套件的 `index.ts` 是唯一公開入口
- 不得洩漏第三方 SDK 型別至消費端（能 wrap 就 wrap）

## 公開匯出規則

- 所有子套件需維持各自 `index.ts` 作為公開入口
- `packages/index.ts` 必須具名匯出所有套件（`infra-*`、`integration-*`、`ui-*`）
- 新增套件時，需同步更新本檔、`packages/README.md`、`packages/index.ts`

## Context7 文件對齊規則

- 涉及下列套件時，先以 Context7 查核官方文件再實作：`infra/state`、`infra/trpc`、`infra/uuid`、`infra/zod`、`integration-ai`、`integration-firebase`、`integration-queue`、`ui-markdown`、`ui-shadcn`。
- 基線文件清單與實作準則以 `packages/README.md` 的「Context7 官方文件基線（repomix:packages）」為準。
- 若升級相依版本造成 API 差異，需先更新基線文件再改程式碼。

---

## 每個套件都有自己的 AGENTS.md

進入任何套件子目錄前，先讀該目錄的 `AGENTS.md`：

**infra/***
- [infra/client-state/AGENTS.md](./infra/client-state/AGENTS.md)
- [infra/http/AGENTS.md](./infra/http/AGENTS.md)
- [infra/serialization/AGENTS.md](./infra/serialization/AGENTS.md)
- [infra/state/AGENTS.md](./infra/state/AGENTS.md)
- [infra/trpc/AGENTS.md](./infra/trpc/AGENTS.md)
- [infra/uuid/AGENTS.md](./infra/uuid/AGENTS.md)
- [infra/zod/AGENTS.md](./infra/zod/AGENTS.md)

**integration-***
- [integration-ai/AGENTS.md](./integration-ai/AGENTS.md)
- [integration-firebase/AGENTS.md](./integration-firebase/AGENTS.md)
- [integration-queue/AGENTS.md](./integration-queue/AGENTS.md)

**ui-***
- [ui-components/AGENTS.md](./ui-components/AGENTS.md)
- [ui-editor/AGENTS.md](./ui-editor/AGENTS.md)
- [ui-markdown/AGENTS.md](./ui-markdown/AGENTS.md)
- [ui-shadcn/AGENTS.md](./ui-shadcn/AGENTS.md)
- [ui-visualization/AGENTS.md](./ui-visualization/AGENTS.md)
````

## File: packages/index.ts
````typescript
/**
 * @module packages
 * Unique entry point for all package-layer public surfaces.
 *
 * Import everything from this barrel:
 *   import { generateId, Button, firestoreApi } from '@packages'
 *
 * All named exports are flat — no namespace wrapping.
 */
⋮----
// ─── infra ────────────────────────────────────────────────────────────────────
⋮----
// ─── integration ──────────────────────────────────────────────────────────────
⋮----
// ─── ui ───────────────────────────────────────────────────────────────────────
````

## File: packages/README.md
````markdown
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
| `infra/state` | `/pmndrs/zustand`、`/statelyai/xstate` | Zustand `createStore` 僅做不可變狀態更新；XState 使用 `createMachine`/actor 模型，不在 machine 放 I/O 業務規則。 |
| `infra/trpc` | `/trpc/trpc` | 優先使用 v11 `createTRPCClient`；link 組合以 `httpBatchLink` + `splitLink` 為主。 |
| `infra/uuid` | `/uuidjs/uuid` | 以 `v4` 產生 ID，驗證時使用 `validate()`（必要時加 `version()===4`）。 |
| `infra/zod` | `/colinhacks/zod` | boundary 驗證採 `parse`/`safeParse`；錯誤統一回傳 `ZodError.issues` 結構。 |
| `integration-ai` | `/genkit-ai/genkit` | flow/tool 必須有 schema（輸入/輸出）；避免回傳未驗證的模型結果。 |
| `integration-firebase` | `/firebase/firebase-js-sdk` | 採 modular API；App 初始化維持 singleton（`getApps/getApp/initializeApp`）。 |
| `integration-queue` | `/websites/upstash_qstash` | 佇列發布需支援 retry、delay、callback/failureCallback。 |
| `ui-markdown` | `/remarkjs/react-markdown`、`/remarkjs/remark-gfm` | 預設維持安全渲染（不開 raw HTML）；GFM 功能透過 `remark-gfm` 啟用。 |
| `ui-shadcn` | `/shadcn-ui/ui` | 元件來源透過 `npx shadcn@latest add`；官方檔案不手改，以 wrapper 擴充。 |

> `infra/client-state`、`infra/http`、`infra/serialization`、`ui-components`、`ui-editor`、`ui-visualization` 目前未綁定單一第三方 SDK 官方文件，維持本專案既有封裝規則即可。
````