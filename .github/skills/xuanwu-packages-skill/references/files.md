# Files

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

## File: packages/infra/date/index.ts
````typescript
/**
 * @module infra/date
 * Date manipulation utilities via date-fns v4.
 *
 * All exports are pure functions — no side effects, fully tree-shakeable.
 * Import only what you need; bundler will eliminate unused functions.
 *
 * Alias: @infra/date
 */
⋮----
// ─── Parsing & Formatting ─────────────────────────────────────────────────────
⋮----
// ─── Validation ───────────────────────────────────────────────────────────────
⋮----
// ─── Arithmetic ───────────────────────────────────────────────────────────────
⋮----
// ─── Boundary Helpers ─────────────────────────────────────────────────────────
⋮----
// ─── Comparison ───────────────────────────────────────────────────────────────
⋮----
// ─── Difference ───────────────────────────────────────────────────────────────
⋮----
// ─── Extractors ───────────────────────────────────────────────────────────────
⋮----
// ─── Setters ──────────────────────────────────────────────────────────────────
⋮----
// ─── Types ────────────────────────────────────────────────────────────────────
````

## File: packages/infra/form/index.ts
````typescript
/**
 * @module infra/form
 * Headless form state management via TanStack Form v1.
 *
 * useForm — main hook for form state; use in interfaces layer with "use client".
 * createFormHook / createFormHookContexts — composition pattern for reusable
 *   custom field components injected with field context.
 * formOptions — defines shared defaultValues and validators (safe for shared config).
 * mergeForm — merges server-state into client form (for server-side initial data).
 *
 * Alias: @infra/form
 */
⋮----
// ─── Core Hooks ───────────────────────────────────────────────────────────────
⋮----
// ─── Composition Factory ──────────────────────────────────────────────────────
⋮----
// ─── Options Helpers ──────────────────────────────────────────────────────────
⋮----
// ─── Types ────────────────────────────────────────────────────────────────────
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
export class HttpError extends Error {
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

## File: packages/infra/query/index.ts
````typescript
/**
 * @module infra/query
 * Server-state management via TanStack Query v5.
 *
 * QueryClient / QueryClientProvider — set up once at app root.
 * useQuery / useMutation / useInfiniteQuery — use in interface layer only
 *   (consuming components need "use client").
 * queryOptions / infiniteQueryOptions — v5 type-safe factory pattern
 *   (recommended over inline options objects).
 *
 * Alias: @infra/query
 */
⋮----
// ─── Client & Provider ────────────────────────────────────────────────────────
⋮----
// ─── Hooks ────────────────────────────────────────────────────────────────────
⋮----
// ─── Query Factory Helpers (v5 recommended pattern) ───────────────────────────
⋮----
// ─── Types ────────────────────────────────────────────────────────────────────
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
⋮----
// ─── SuperJSON ────────────────────────────────────────────────────────────────
// Type-safe serializer: preserves Date, BigInt, Set, Map, undefined, RegExp.
// Use superJsonStringify / superJsonParse for simple round-trip.
// Use superJsonSerialize / superJsonDeserialize when you need the { json, meta }
// pair (e.g. as a tRPC transformer).
// SuperJSON class is exported for isolated instances with custom registrations.
⋮----
import SuperJSONLib from "superjson";
⋮----
/** Serialize any value to a JSON string, preserving non-JSON types. */
export const superJsonStringify = (value: unknown): string
⋮----
/** Deserialize a superjson string back to the original typed value. */
export const superJsonParse = <T>(value: string): T
⋮----
/** Serialize to `{ json, meta }` pair — useful as a tRPC transformer. */
export const superJsonSerialize = (
  value: unknown,
): ReturnType<typeof SuperJSONLib.serialize>
⋮----
/** Deserialize from a `{ json, meta }` pair. */
export const superJsonDeserialize = <T>(
  payload: Parameters<typeof SuperJSONLib.deserialize>[0],
): T
⋮----
/** The SuperJSON class for isolated instances with custom registerClass / registerCustom. */
````

## File: packages/infra/state/index.ts
````typescript
/**
 * @module infra/state
 * State management primitives for local stores and machines.
 *
 * Zustand 5: `create` (React hook factory), `createStore` (vanilla),
 *            `StateCreator` type for slice composition.
 * XState 5:  `createMachine`, `createActor`, `assign`, `setup`.
 */
⋮----
// ─── Zustand ─────────────────────────────────────────────────────────────────
⋮----
// React-aware hook factory (canonical for module interfaces/stores/)
⋮----
// Vanilla factory for non-React contexts
⋮----
// Slice composition type
⋮----
// ─── XState ──────────────────────────────────────────────────────────────────
⋮----
// ─── XState React ─────────────────────────────────────────────────────────────
// Use only in "use client" components / hooks (interface layer).
//
// useMachine     — spawn a machine + subscribe to state (alias for useActor in v5)
// useActorRef    — get a stable actorRef without re-render on every snapshot
// useSelector    — subscribe to a derived slice; only re-renders on slice change
// shallowEqual   — pass as comparator to useSelector to avoid object-ref churn
// createActorContext — React Context factory for sharing actor across components
⋮----
// ─── Utilities ───────────────────────────────────────────────────────────────
⋮----
import type { StoreApi } from "zustand/vanilla";
⋮----
/**
 * Fully replace a vanilla store's state (replace=true).
 * Useful for resetting store to a known clean snapshot.
 */
export const replaceStoreState = <T>(store: StoreApi<T>, nextState: T): void =>
````

## File: packages/infra/table/index.ts
````typescript
/**
 * @module infra/table
 * Headless table state management via TanStack Table v8.
 *
 * useReactTable — main hook; accepts data, columns, getCoreRowModel and optional
 *   feature row models (sorting, filtering, pagination, selection, etc.).
 * createColumnHelper — type-safe column definition factory (recommended over raw ColumnDef).
 * flexRender — renders cell / header content (handles JSX elements and plain values).
 *
 * Alias: @infra/table
 */
⋮----
// ─── Core Hook & Helpers ──────────────────────────────────────────────────────
⋮----
// ─── Row Model Factories ──────────────────────────────────────────────────────
⋮----
// ─── Types ────────────────────────────────────────────────────────────────────
````

## File: packages/infra/trpc/index.ts
````typescript
/**
 * @module infra/trpc
 * Shared tRPC client primitives.
 */
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

## File: packages/infra/virtual/index.ts
````typescript
/**
 * @module infra/virtual
 * Headless list and grid virtualization via TanStack Virtual v3.
 *
 * useVirtualizer — element-scoped virtualizer; provide getScrollElement pointing
 *   to a scrollable DOM container.
 * useWindowVirtualizer — window-scoped virtualizer for full-page lists; use
 *   scrollMargin to account for fixed headers or offsets.
 *
 * Pattern: getVirtualItems() → render only visible items; getTotalSize() → set
 *   container height to maintain scrollbar accuracy.
 *
 * Alias: @infra/virtual
 */
⋮----
// ─── React Virtualizers ───────────────────────────────────────────────────────
⋮----
// ─── Types ────────────────────────────────────────────────────────────────────
````

## File: packages/infra/zod/index.ts
````typescript
/**
 * @module infra/zod
 * Shared Zod primitives and utility helpers.
 */
⋮----
import { z, type ZodError, type ZodTypeAny, type ZodSchema } from "zod";
⋮----
export const createBrandedUuidSchema = <Brand extends string>(brand: Brand)
⋮----
export const zodErrorToFieldMap = (error: ZodError): Record<string, string[]> =>
⋮----
/**
 * Parse and throw with a meaningful error message, or return typed value.
 * Use at Server Action / tRPC procedure input boundaries.
 */
export const zodParseOrThrow = <T extends ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> =>
⋮----
/**
 * Safely parse without throwing; returns `{ success, data, error }`.
 * Mirrors `z.safeParse` but re-exported for consistent import.
 */
export const zodSafeParse = <S extends ZodSchema>(
  schema: S,
  data: unknown,
): ReturnType<S["safeParse"]>
````

## File: packages/integration-ai/genkit.ts
````typescript
/**
 * Genkit singleton.
 *
 * Initialises one shared `genkit` instance with the Google AI plugin.
 * Import this only in infrastructure AI adapter files — never in
 * domain or application layers.
 *
 * Required env var: GOOGLE_GENAI_API_KEY (or GOOGLE_API_KEY)
 */
⋮----
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { DEFAULT_AI_MODEL } from "./index";
⋮----
/** Re-export z for infrastructure adapters — avoids separate zod import. */
⋮----
/**
 * Shared Genkit AI instance.
 *
 * @example
 * ```ts
 * import { ai } from '@integration-ai/genkit';
 *
 * export const myFlow = ai.defineFlow(
 *   {
 *     name: 'notebooklm.synthesis',
 *     inputSchema: z.object({ query: z.string() }),
 *     outputSchema: z.object({ answer: z.string() }),
 *   },
 *   async ({ query }) => {
 *     const { text } = await ai.generate({
 *       model: googleAI.model('gemini-2.5-flash'),
 *       prompt: query,
 *     });
 *     return { answer: text };
 *   },
 * );
 * ```
 */
⋮----
/** Default model — use googleAI.model() helper (Context7-preferred over string ID). */
````

## File: packages/integration-ai/index.ts
````typescript
/**
 * @module integration-ai
 * AI 服務整合層：Genkit singleton factory、flow 執行合約、共用 AI 型別。
 *
 * Context7 基線：/genkit-ai/genkit
 * - flow/tool 必須有 inputSchema 與 outputSchema（Zod）。
 * - 結果在返回 application layer 前必須驗證（outputSchema.parse）。
 * - 環境憑證只來自 env vars（GOOGLE_GENAI_API_KEY / GOOGLE_API_KEY）。
 * - 使用 googleAI.model() helper 優先於字串 ID（Context7 推薦）。
 */
⋮----
// ─── Model constants ──────────────────────────────────────────────────────────
⋮----
/** 系統預設 AI 模型。單一來源，genkit.ts 與 infrastructure adapters 共用此常數。 */
⋮----
// ─── Shared contract types ────────────────────────────────────────────────────
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
// ─── Error types ─────────────────────────────────────────────────────────────
⋮----
export class IntegrationAiConfigurationError extends Error {
⋮----
constructor(message: string)
⋮----
export class IntegrationAiFlowError extends Error {
⋮----
constructor(
    message: string,
    public readonly flowName: string,
    public readonly cause?: unknown,
)
⋮----
// ─── Unconfigured fallback ────────────────────────────────────────────────────
⋮----
/** Development / test stub that throws on use when no provider is configured. */
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

## File: packages/integration-queue/index.ts
````typescript
/**
 * @module integration-queue
 * 訊息佇列整合層：QStash HTTP publisher 合約與工具函式。
 *
 * Context7 基線：/websites/upstash_qstash
 * - 支援 retry、delay、callback/failureCallback。
 * - 發布訊息必須通過 Authorization: Bearer <token>。
 * - 不依賴 @upstash/qstash npm package（使用 HTTP API）。
 */
⋮----
// ─── Config ───────────────────────────────────────────────────────────────────
⋮----
export interface QStashConfig {
  /** QStash REST URL — 預設 https://qstash.upstash.io/v2 */
  baseUrl?: string;
  /** Bearer token from QSTASH_TOKEN env var */
  token: string;
}
⋮----
/** QStash REST URL — 預設 https://qstash.upstash.io/v2 */
⋮----
/** Bearer token from QSTASH_TOKEN env var */
⋮----
// ─── Request types ────────────────────────────────────────────────────────────
⋮----
export interface QueuePublishOptions {
  /**
   * The destination URL to deliver the message to.
   * E.g. `https://yourapp.com/api/worker/embedding`
   */
  destination: string;

  /** JSON-serialisable message body */
  body?: unknown;

  /** Additional HTTP headers forwarded to the destination */
  headers?: Record<string, string>;

  /** Delay before delivery (seconds or Upstash duration string, e.g. "30s") */
  delay?: number | string;

  /** Max delivery retries (default: 3) */
  retries?: number;

  /** URL called on successful delivery */
  callback?: string;

  /** URL called when all retries are exhausted */
  failureCallback?: string;
}
⋮----
/**
   * The destination URL to deliver the message to.
   * E.g. `https://yourapp.com/api/worker/embedding`
   */
⋮----
/** JSON-serialisable message body */
⋮----
/** Additional HTTP headers forwarded to the destination */
⋮----
/** Delay before delivery (seconds or Upstash duration string, e.g. "30s") */
⋮----
/** Max delivery retries (default: 3) */
⋮----
/** URL called on successful delivery */
⋮----
/** URL called when all retries are exhausted */
⋮----
export interface QueuePublishResult {
  messageId: string;
}
⋮----
// ─── Client interface ─────────────────────────────────────────────────────────
⋮----
export interface QueueClient {
  publish(options: QueuePublishOptions): Promise<QueuePublishResult>;
}
⋮----
publish(options: QueuePublishOptions): Promise<QueuePublishResult>;
⋮----
// ─── HTTP implementation ──────────────────────────────────────────────────────
⋮----
/**
 * Creates a QStash HTTP publisher that sends messages via the QStash REST API.
 *
 * @example
 * ```ts
 * const queue = createQStashClient({ token: process.env.QSTASH_TOKEN! });
 * await queue.publish({
 *   destination: 'https://app.example.com/api/worker/embed',
 *   body: { documentId: 'doc-123' },
 *   retries: 3,
 *   delay: '5s',
 * });
 * ```
 */
export const createQStashClient = (config: QStashConfig): QueueClient =>
⋮----
async publish(options)
⋮----
// ─── Legacy QueuePublisher interface ─────────────────────────────────────────
// Kept for backward compatibility with callers using QueueMessage shape.
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
// ─── Error ────────────────────────────────────────────────────────────────────
⋮----
export class IntegrationQueueError extends Error {
⋮----
constructor(
    message: string,
    public readonly statusCode?: number,
)
⋮----
/** @deprecated Use IntegrationQueueError */
export class QueuePublishError extends Error {
⋮----
constructor(message: string)
⋮----
// ─── No-op stub ───────────────────────────────────────────────────────────────
⋮----
/** Development / test stub — logs instead of sending real requests. */
export const createNoOpQueueClient = (): QueueClient => (
⋮----
/** @deprecated Use createNoOpQueueClient */
export const createInMemoryQueuePublisher = (): QueuePublisher => (
````

## File: packages/ui-dnd/index.ts
````typescript
/**
 * @module ui-dnd
 * Drag-and-drop primitives via Atlassian Pragmatic DnD.
 *
 * Element adapter — draggable, dropTargetForElements, monitorForElements for
 *   attaching drag/drop behaviour to DOM elements imperatively via effect cleanup.
 * combine — merges multiple cleanup functions into one; essential when attaching
 *   multiple adapters in a single useEffect.
 * reorder — pure array reorder helper after a drop.
 * Hitbox — attachClosestEdge / extractClosestEdge for edge-aware drop targets
 *   (e.g. insert before/after, tree indentation).
 * reorderWithEdge — pure array reorder accounting for closest drop edge (top/bottom/left/right).
 * DropIndicator — React visual component rendering drop position indicator line.
 *
 * "use client" required for all consumers — uses browser drag API internally.
 *
 * Alias: @ui-dnd
 */
⋮----
// ─── Element Adapter ──────────────────────────────────────────────────────────
⋮----
// ─── Utilities ────────────────────────────────────────────────────────────────
⋮----
// ─── Hitbox ───────────────────────────────────────────────────────────────────
⋮----
// ─── Auto Scroll ─────────────────────────────────────────────────────────────
⋮----
// ─── Visual Indicators ────────────────────────────────────────────────────────
````

## File: packages/ui-editor/index.ts
````typescript
/**
 * @module ui-editor
 * TipTap 3 富文本編輯器封裝。
 *
 * Context7 基線：/ueberdosis/tiptap-docs
 * - 使用 useEditor + EditorContent（React 整合方式）。
 * - `immediatelyRender: false` 避免 Next.js SSR hydration mismatch。
 * - 啟用 StarterKit + Link + Underline + TextStyle + Color + Typography + Placeholder。
 */
⋮----
import { createElement, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
⋮----
// ─── RichTextEditor ───────────────────────────────────────────────────────────
⋮----
export interface RichTextEditorProps {
  /** HTML string content */
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  /** Disable editor (read-only mode via prop) */
  disabled?: boolean;
}
⋮----
/** HTML string content */
⋮----
/** Disable editor (read-only mode via prop) */
⋮----
/**
 * Editable TipTap rich-text editor with common formatting extensions.
 *
 * @example
 * ```tsx
 * <RichTextEditor
 *   value={html}
 *   onChange={setHtml}
 *   placeholder="Start writing…"
 * />
 * ```
 */
export const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
}: RichTextEditorProps) =>
⋮----
// Sync external content changes (e.g., form reset)
⋮----
// Sync editable state
⋮----
// ─── ReadOnlyEditor ───────────────────────────────────────────────────────────
⋮----
export interface ReadOnlyEditorProps {
  /** HTML string content */
  value: string;
  className?: string;
}
⋮----
/** HTML string content */
⋮----
/**
 * Read-only TipTap viewer. Uses an editable:false editor instance so that
 * the same HTML output is rendered with ProseMirror schema rather than
 * raw dangerouslySetInnerHTML.
 */
export const ReadOnlyEditor = (
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
⋮----
export const MarkdownRenderer = ({ markdown, className, ...rest }: MarkdownRendererProps) => (
  <div className={["prose max-w-none", className].filter(Boolean).join(" ")} {...rest}>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
  </div>
);
````

## File: packages/ui-shadcn/hooks/use-mobile.ts
````typescript
export function useIsMobile()
⋮----
const onChange = () =>
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
function AlertDialogTrigger(
⋮----
function AlertDialogPortal(
⋮----
className=
⋮----
return (
    <Button
      data-slot="alert-dialog-action"
      className={cn(className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: AlertDialogPrimitive.Close.Props &
Pick<React.ComponentProps<typeof Button>, "variant" | "size">)
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
return useRender(
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
function CollapsibleTrigger(
⋮----
function CollapsibleContent(
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
function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props)
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
function ContextMenuPortal(
⋮----
function ContextMenuTrigger({
  className,
  ...props
}: ContextMenuPrimitive.Trigger.Props)
⋮----
className=
⋮----
return (
````

## File: packages/ui-shadcn/ui/dialog.tsx
````typescript
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { Button } from "@/packages/ui-shadcn/ui/button"
import { XIcon } from "lucide-react"
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
className=
````

## File: packages/ui-shadcn/ui/dropdown-menu.tsx
````typescript
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
⋮----
import { cn } from "@/packages/ui-shadcn"
import { ChevronRightIcon, CheckIcon } from "lucide-react"
⋮----
className=
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
function HoverCardTrigger(
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

## File: packages/ui-vis/index.ts
````typescript
/**
 * @module ui-vis
 * Graph, network, and timeline visualization via vis.js family.
 *
 * Network — interactive force-directed graph; mount to a DOM container via
 *   new Network(container, { nodes, edges }, options).
 * DataSet / DataView — reactive in-memory data collections; trigger automatic
 *   Network re-renders on add / update / remove.
 * Timeline — horizontal event and range visualization mounted similarly to Network.
 *
 * IMPORTANT: CSS must be imported separately in the consuming module:
 *   import 'vis-network/styles/vis-network.css'
 *   import 'vis-timeline/styles/vis-timeline-graph2d.css'
 *
 * "use client" required — all classes depend on browser DOM APIs.
 *
 * Alias: @ui-vis
 */
⋮----
// ─── Network (Graph Visualization) ───────────────────────────────────────────
⋮----
// ─── Data Collections ────────────────────────────────────────────────────────
⋮----
// ─── Timeline ────────────────────────────────────────────────────────────────
⋮----
// ─── Types ───────────────────────────────────────────────────────────────────
````

## File: packages/ui-visualization/index.tsx
````typescript
/**
 * @module ui-visualization
 * 數據視覺化元件（Recharts 2 封裝）。
 *
 * Context7 基線：/recharts/recharts
 * - 使用 ResponsiveContainer 確保響應式佈局。
 * - 避免固定 width/height，改用 percentage + parent div 高度。
 */
⋮----
import { type ReactNode } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
⋮----
// ─── StatCard (preserved from original) ──────────────────────────────────────
⋮----
export interface StatCardProps {
  label: string;
  value: string | number;
  caption?: string;
  icon?: ReactNode;
}
⋮----
export const StatCard = ({ label, value, caption, icon }: StatCardProps) => (
  <article className="rounded-md border p-4">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      {icon}
    </div>
    <p className="mt-2 text-2xl font-semibold">{String(value)}</p>
    {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}
  </article>
);
⋮----
// ─── Shared types ─────────────────────────────────────────────────────────────
⋮----
export interface DataPoint {
  name: string;
  [key: string]: string | number;
}
⋮----
export interface SeriesConfig {
  dataKey: string;
  color?: string;
  label?: string;
}
⋮----
// ─── XuanwuLineChart ──────────────────────────────────────────────────────────
⋮----
export interface XuanwuLineChartProps {
  data: DataPoint[];
  series: SeriesConfig[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
}
⋮----
/**
 * Responsive line chart.
 *
 * @example
 * ```tsx
 * <XuanwuLineChart
 *   data={[{ name: 'Jan', value: 400 }, { name: 'Feb', value: 300 }]}
 *   series={[{ dataKey: 'value', label: 'Revenue', color: '#8884d8' }]}
 * />
 * ```
 */
⋮----
// ─── XuanwuBarChart ───────────────────────────────────────────────────────────
⋮----
/**
 * Responsive bar chart with optional stacking.
 */
⋮----
// ─── XuanwuPieChart ───────────────────────────────────────────────────────────
⋮----
/**
 * Responsive pie / donut chart.
 *
 * @example
 * ```tsx
 * <XuanwuPieChart
 *   data={[{ name: 'Done', value: 80 }, { name: 'Todo', value: 20 }]}
 *   innerRadius={60}
 * />
 * ```
 */
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
 * All named exports are explicit — no wildcard re-exports.
 */
⋮----
// ─── infra/client-state ───────────────────────────────────────────────────────
⋮----
// ─── infra/http ───────────────────────────────────────────────────────────────
⋮----
// ─── infra/serialization ──────────────────────────────────────────────────────
⋮----
// ─── infra/state ──────────────────────────────────────────────────────────────
⋮----
// ─── infra/query ──────────────────────────────────────────────────────────────
⋮----
// ─── infra/date ───────────────────────────────────────────────────────────────
⋮----
// ─── infra/trpc ───────────────────────────────────────────────────────────────
⋮----
// ─── infra/uuid ───────────────────────────────────────────────────────────────
⋮----
// ─── infra/zod ────────────────────────────────────────────────────────────────
⋮----
// ─── integration-ai ───────────────────────────────────────────────────────────
⋮----
// ─── integration-firebase ─────────────────────────────────────────────────────
⋮----
// ─── integration-queue ────────────────────────────────────────────────────────
⋮----
// ─── ui-components ────────────────────────────────────────────────────────────
⋮----
// ─── ui-editor ────────────────────────────────────────────────────────────────
⋮----
// ─── ui-markdown ─────────────────────────────────────────────────────────────
⋮----
// ─── ui-shadcn ────────────────────────────────────────────────────────────────
⋮----
// ─── ui-visualization ─────────────────────────────────────────────────────────
⋮----
// ─── infra/form ───────────────────────────────────────────────────────────────
⋮----
// ─── infra/table ──────────────────────────────────────────────────────────────
⋮----
// ─── infra/virtual ────────────────────────────────────────────────────────────
⋮----
// ─── ui-dnd ───────────────────────────────────────────────────────────────────
⋮----
// ─── ui-vis ───────────────────────────────────────────────────────────────────
````

## File: packages/infra/client-state/AGENTS.md
````markdown
# infra/client-state — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/client-state/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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

## File: packages/infra/client-state/README.md
````markdown
# infra/client-state

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


Client-side 狀態原語（非業務的 atom / slice 工具）。

## 公開 API

```ts
import {
  updateClientState,  // 合併更新（支援 updater 函式）
  cloneClientState,   // structuredClone 包裝
  type ClientStateUpdater,
} from '@infra/client-state'
```

## 使用規則

- 此套件只提供純函式工具，不持有狀態。
- 業務狀態管理使用 `@infra/state`（Zustand / XState）。
- 禁止加入業務邏輯或 domain rule。
````

## File: packages/infra/form/AGENTS.md
````markdown
# infra/form — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/form/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


此套件是 **headless 表單狀態管理的唯一授權來源**，透過 TanStack Form v1 提供零框架侵入的表單邏輯。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 表單狀態管理 | `useForm({ defaultValues, onSubmit })` — 主要 hook |
| 自訂 Field 組件工廠 | `createFormHook` / `createFormHookContexts` — 組合模式 |
| 共用表單選項 | `formOptions(...)` — 可在 shared config 定義 defaultValues / validators |
| 伺服器狀態合併 | `mergeForm(...)` — Server Action 回傳初始值時使用 |
| Field metadata 型別 | `FieldMeta`, `FormState`, `FormApi`, `FieldApi` |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務邏輯驗證（invariant） | `src/modules/<context>/domain/` |
| Zod 驗證 schema | `packages/infra/zod/` |
| UI 輸入組件（Input、Select） | `packages/ui-shadcn/` |
| 帶業務語意的表單組件 | `src/modules/<context>/interfaces/` |
| Server Action 邊界驗證 | `packages/infra/zod/` + Server Action 層 |

---

## 嚴禁

```ts
// ❌ 不得在 domain/ 層 import
import { useForm } from '@infra/form'  // domain 層禁止 React hooks

// ❌ 不得把業務 invariant 寫在 onSubmit
const form = useForm({
  onSubmit: ({ value }) => {
    if (value.balance < 0) throw new Error('...')  // ❌ 應在 domain aggregate
  }
})

// ✅ 正確：validation 在 field 層，invariant 在 domain
const form = useForm({
  defaultValues: { title: '' },
  onSubmit: async ({ value }) => {
    await createWorkspaceUseCase.execute(value)
  }
})
```

- 此套件所有 hook 均需 `"use client"`，不得在 Server Component 中呼叫
- `formOptions` 可在 shared config 使用，但 `useForm` 必須在 Client Component
- 不得在此套件包含任何業務語意或 domain rule

## Alias

```ts
import { useForm, formOptions, type FormApi } from '@infra/form'
```
````

## File: packages/infra/form/README.md
````markdown
# @infra/form

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


Headless form state management via **TanStack Form v1**.

## Purpose

提供無 UI 耦合的表單狀態管理能力，作為 `interfaces/` 層的表單邏輯基礎。業務驗證由 `domain/` 處理，UI 組件由 `ui-shadcn/` 提供，此套件只負責表單的狀態機、欄位訂閱與提交流程。

## Import

```ts
import { useForm, formOptions, createFormHook, type FormApi } from '@infra/form'
```

## Core Usage

### 基本表單

```tsx
"use client"
import { useForm } from '@infra/form'

function CreateWorkspaceForm() {
  const form = useForm({
    defaultValues: { name: '', description: '' },
    onSubmit: async ({ value }) => {
      await createWorkspaceAction(value)
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.Field name="name">
        {(field) => (
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>
      <button type="submit">建立</button>
    </form>
  )
}
```

### 共用 formOptions

```ts
import { formOptions } from '@infra/form'

// 可在 shared config 定義，避免重複 defaultValues
export const workspaceFormOptions = formOptions({
  defaultValues: { name: '', description: '' },
})
```

### createFormHook — 自訂 Field 組件

```ts
import { createFormHookContexts, createFormHook } from '@infra/form'

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

function TextField() {
  const field = useFieldContext<string>()
  return <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
}

export const { useAppForm } = createFormHook({
  fieldComponents: { TextField },
  formComponents: {},
  fieldContext,
  formContext,
})
```

## Key Exports

| Export | 類型 | 說明 |
|---|---|---|
| `useForm` | Hook | 主要表單 hook，管理所有欄位狀態與提交 |
| `useField` | Hook | 獨立欄位管理（非 form.Field 語境） |
| `useStore` | Hook | 訂閱 form/field 狀態的 reactive selector |
| `createFormHook` | Factory | 建立自訂 `useAppForm` hook（含注入組件） |
| `createFormHookContexts` | Factory | 建立 fieldContext / formContext / useFieldContext |
| `formOptions` | Helper | 定義共用表單選項（defaultValues、validators） |
| `mergeForm` | Helper | 合併 Server Action 回傳的伺服器狀態 |
| `FormApi` | Type | form 物件型別（`useForm` 的回傳值） |
| `FieldApi` | Type | field 物件型別 |
| `FieldMeta` | Type | 欄位 meta（touched、dirty、errors） |
| `ValidationError` | Type | 驗證錯誤格式 |

## Architecture Notes

- 僅用於 `interfaces/` 層（`"use client"` 必要）
- `formOptions` 可定義在 shared config，但 `useForm` 只能在 Client Component 呼叫
- 業務 invariant 屬於 `domain/`，此套件不承載業務規則
- 表單 UI 組件（Input、Button）使用 `packages/ui-shadcn/`
````

## File: packages/infra/http/AGENTS.md
````markdown
# infra/http — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/http/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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

## File: packages/infra/http/README.md
````markdown
# infra/http

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


HTTP 工具（fetch wrapper、retry、timeout）。

## 公開 API

```ts
import {
  request,        // fetch with timeout + retry
  requestJson,    // request + JSON deserialization
  HttpError,      // status / statusText 附加資訊
  type HttpRequestOptions,
} from '@infra/http'
```

## 範例

```ts
import { requestJson, HttpError } from '@infra/http'

try {
  const data = await requestJson<{ id: string }>(
    'https://api.example.com/items',
    { method: 'GET' },
    { timeoutMs: 5000, retryCount: 2, retryDelayMs: 500 },
  )
} catch (err) {
  if (err instanceof HttpError) {
    console.error(`HTTP ${err.status}: ${err.message}`)
  }
}
```

## 使用規則

- 此套件封裝 fetch；integration 與 outbound adapter 層可使用。
- `domain/` 與 `application/` 層禁止直接 import。
- 需要 QStash / Firebase 等具體整合，改用對應 `@integration-*` 套件。
````

## File: packages/infra/serialization/AGENTS.md
````markdown
# infra/serialization — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/serialization/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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

## File: packages/infra/serialization/README.md
````markdown
# infra/serialization

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


序列化 / 反序列化工具。

## 公開 API

```ts
import {
  safeJsonParse,   // string -> { ok, value, error } (不拋出)
  toJsonString,    // unknown -> string
  encodeBase64,    // string -> base64 string
  decodeBase64,    // base64 string -> string
  type JsonParseResult,
} from '@infra/serialization'
```

## 使用規則

- 純工具函式，跨層可用（domain 層除外）。
- 複雜序列化（SuperJSON 含 Date/Map/Set）在 Server Action 邊界使用 `superjson` 直接操作。
````

## File: packages/infra/state/AGENTS.md
````markdown
# infra/state — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/state/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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

## File: packages/infra/state/README.md
````markdown
# infra/state

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


本地狀態管理原語。封裝 **Zustand 5** 與 **XState 5**，供 `src/modules/*/interfaces/stores/` 與 `src/modules/*/application/machines/` 使用。

## 套件結構

```
packages/infra/state/
  index.ts    ← Zustand create/createStore/StateCreator + XState createMachine/createActor/assign/setup
  AGENTS.md
```

## 公開 API

```ts
import {
  // Zustand — React hook factory (canonical for interfaces/stores/)
  create,
  type StateCreator,

  // Zustand — vanilla factory (non-React contexts)
  createStore,
  type StoreApi,

  // XState — machine & actor
  createMachine,
  createActor,
  assign,
  setup,
  type ActorRefFrom,
  type SnapshotFrom,

  // Utility
  replaceStoreState,
} from '@infra/state'
```

## 使用規則

| 場景 | 使用 |
|---|---|
| module `interfaces/stores/*.store.ts` | `create` + `StateCreator` |
| 非 React 環境 / SSR vanilla store | `createStore` + `StoreApi` |
| `application/machines/*.machine.ts` | `createMachine` + `createActor` + `setup` + `assign` |
| 有型別的 machine context | `setup({ types })` |

## Slice Pattern（必讀）

```ts
import { create, type StateCreator } from '@infra/state'

interface PanelState { isOpen: boolean }
interface PanelActions { open(): void; close(): void }
type PanelStore = PanelState & PanelActions

const createPanelSlice: StateCreator<PanelStore, [], [], PanelStore> = (set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
})

export const usePanelStore = create<PanelStore>()((...a) => ({
  ...createPanelSlice(...a),
}))
```

## Context7 官方基線

| Library | Context7 ID |
|---|---|
| Zustand | `/pmndrs/zustand` |
| XState  | `/statelyai/xstate` |

- Zustand：`create` 是 React hook factory；`createStore` 是 vanilla。
- XState：`createMachine` 定義邏輯，`createActor` 實例化並執行；`setup` 提供更好的 TypeScript 型別推導。
````

## File: packages/infra/table/AGENTS.md
````markdown
# infra/table — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/table/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


此套件是 **headless 表格狀態管理的唯一授權來源**，透過 TanStack Table v8 提供排序、過濾、分頁、選取等能力。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 表格狀態管理 | `useReactTable({ data, columns, getCoreRowModel() })` |
| 欄位定義 | `createColumnHelper<T>()` — 型別安全欄位定義 |
| 渲染輔助 | `flexRender(cell.column.columnDef.cell, cell.getContext())` |
| Row model 工廠 | `getCoreRowModel`, `getSortedRowModel`, `getPaginationRowModel` 等 |
| 表格狀態型別 | `SortingState`, `PaginationState`, `RowSelectionState` 等 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 表格 UI 組件（thead、td、tr 樣式） | `packages/ui-shadcn/` 的 `Table*` 組件 |
| 帶業務語意的資料表（TaskTable、IssueTable） | `src/modules/<context>/interfaces/` |
| 資料查詢與快取 | `packages/infra/query/` |
| 虛擬化長清單 | `packages/infra/virtual/` |

---

## 嚴禁

```ts
// ❌ 不得在 domain/ 層 import
// ❌ 不得把業務邏輯寫在 filterFn / sortingFn

// ✅ 正確使用模式
const columnHelper = createColumnHelper<Task>()
const columns = [
  columnHelper.accessor('title', { header: '任務標題' }),
  columnHelper.accessor('status', { header: '狀態' }),
]
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

- 此套件 hook 均需 `"use client"`，不得在 Server Component 使用
- 業務過濾邏輯（invariant）屬於 `domain/`，此套件只做 UI state
- 不得在此套件包含任何業務語意

## Alias

```ts
import { useReactTable, createColumnHelper, flexRender, getCoreRowModel } from '@infra/table'
```
````

## File: packages/infra/table/README.md
````markdown
# @infra/table

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


Headless table state management via **TanStack Table v8**.

## Purpose

提供無 UI 耦合的表格狀態管理（排序、過濾、分頁、選取、分組），作為 `interfaces/` 層的表格邏輯基礎。此套件只負責 headless 狀態，UI 渲染由消費方提供（通常搭配 `packages/ui-shadcn/` 的 `Table*` 組件）。

## Import

```ts
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
} from '@infra/table'
```

## Core Usage

### 基本表格

```tsx
"use client"
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
} from '@infra/table'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@ui-shadcn'

type Task = { id: string; title: string; status: string }

const columnHelper = createColumnHelper<Task>()
const columns = [
  columnHelper.accessor('title', { header: '標題' }),
  columnHelper.accessor('status', { header: '狀態' }),
]

function TaskTable({ data }: { data: Task[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

### 加入排序與分頁

```tsx
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, type SortingState, type PaginationState } from '@infra/table'
import { useState } from 'react'

const [sorting, setSorting] = useState<SortingState>([])
const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })

const table = useReactTable({
  data,
  columns,
  state: { sorting, pagination },
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})
```

## Key Exports

| Export | 類型 | 說明 |
|---|---|---|
| `useReactTable` | Hook | 主要表格 hook |
| `createColumnHelper` | Factory | 型別安全欄位定義工廠 |
| `flexRender` | Helper | 渲染欄位 cell / header 內容 |
| `getCoreRowModel` | Factory | 基礎 row model（必填） |
| `getSortedRowModel` | Factory | 排序 row model |
| `getFilteredRowModel` | Factory | 過濾 row model |
| `getPaginationRowModel` | Factory | 分頁 row model |
| `getGroupedRowModel` | Factory | 分組 row model |
| `getExpandedRowModel` | Factory | 展開 row model |
| `getSelectedRowModel` | Factory | 選取 row model |
| `SortingState` | Type | 排序狀態陣列型別 |
| `PaginationState` | Type | 分頁狀態型別 |
| `RowSelectionState` | Type | 列選取狀態型別 |
| `ColumnDef` | Type | 欄位定義型別 |

## Architecture Notes

- 僅用於 `interfaces/` 層（`"use client"` 必要）
- 業務過濾條件屬於 `domain/`，UI 表格 state 屬於此套件
- 虛擬化長清單搭配 `packages/infra/virtual/`
- 表格 HTML 結構使用 `packages/ui-shadcn/` 的 `Table*` 組件
````

## File: packages/infra/trpc/AGENTS.md
````markdown
# infra/trpc — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/trpc/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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

## File: packages/infra/trpc/README.md
````markdown
# infra/trpc

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


tRPC v11 客戶端原語。

## 公開 API

```ts
import {
  createTRPCClient,
  createTRPCProxyClient, // alias（相容舊版）
  httpBatchLink,
  httpLink,
  splitLink,
  TRPCClientError,
  createTRPCReact,
  type AnyRouter,
} from '@infra/trpc'
```

## 範例

```ts
import { createTRPCClient, httpBatchLink } from '@infra/trpc'

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({ url: '/api/trpc' }),
  ],
})
```

## Context7 官方基線

- 文件：`/trpc/trpc`
- 優先使用 v11 `createTRPCClient`；link 組合以 `httpBatchLink` + `splitLink` 為主。
- `createTRPCProxyClient` 已視為相容 alias，不建議新代碼使用。
````

## File: packages/infra/uuid/AGENTS.md
````markdown
# infra/uuid — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/uuid/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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

## File: packages/infra/uuid/README.md
````markdown
# infra/uuid

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


UUID 生成原語。封裝 **uuid v13**，是 domain 層唯一允許的 ID 生成入口。

## 公開 API

```ts
import {
  generateId,   // v4 UUID string
  isValidUUID,  // boolean
  asUUID,       // branded type cast
} from '@infra/uuid'
```

## 使用規則

| ✅ 正確 | ❌ 錯誤 |
|---|---|
| `import { generateId } from '@infra/uuid'` | `import { v4 as uuidv4 } from 'uuid'` |
| 只在 `domain/` factory 或 `application/` use case 呼叫 | 在 `infrastructure/` 或 `interfaces/` 中生成 ID |

## Context7 官方基線

- 文件：`/uuidjs/uuid`
- 實作：以 `v4()` 生成 ID；驗證時用 `validate()`（必要時再加 `version() === 4`）。
````

## File: packages/infra/virtual/AGENTS.md
````markdown
# infra/virtual — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/virtual/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


此套件是 **headless 虛擬化長清單與長表格的唯一授權來源**，透過 TanStack Virtual v3 提供 DOM 元素數量最小化的能力。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 容器內虛擬化 | `useVirtualizer({ count, getScrollElement, estimateSize })` |
| 全頁面虛擬化 | `useWindowVirtualizer({ count, estimateSize, scrollMargin })` |
| VirtualItem 型別 | `key`, `index`, `start`, `end`, `size`, `lane` 存取 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 表格 headless 狀態 | `packages/infra/table/` |
| 清單 UI 樣式 | `packages/ui-shadcn/` / `packages/ui-components/` |
| 帶業務語意的虛擬列表（TaskFeed） | `src/modules/<context>/interfaces/` |
| 資料查詢與無限捲動 | `packages/infra/query/` (`useInfiniteQuery`) |

---

## 嚴禁

```ts
// ❌ 不得在 domain/ 層 import
// ❌ 虛擬化容器高度不得使用絕對值，應由 getTotalSize() 決定

// ✅ 正確模式
const parentRef = useRef<HTMLDivElement>(null)
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 48,
})

// 容器必須設定固定高度並 overflow-y: auto
return (
  <div ref={parentRef} style={{ height: '400px', overflowY: 'auto' }}>
    <div style={{ height: virtualizer.getTotalSize() }}>
      {virtualizer.getVirtualItems().map((vItem) => (
        <div
          key={vItem.key}
          style={{ position: 'absolute', top: vItem.start, height: vItem.size }}
        >
          {items[vItem.index]}
        </div>
      ))}
    </div>
  </div>
)
```

- 此套件 hook 均需 `"use client"`，不得在 Server Component 使用
- `getVirtualItems()` 只渲染可見項目，外層容器必須使用 `position: relative`
- 不得在此套件包含任何業務語意

## Alias

```ts
import { useVirtualizer, useWindowVirtualizer, type VirtualItem } from '@infra/virtual'
```
````

## File: packages/infra/virtual/README.md
````markdown
# @infra/virtual

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


Headless list and grid virtualization via **TanStack Virtual v3**.

## Purpose

在 `interfaces/` 層渲染超大清單時，限制實際 DOM 節點數量以維持效能。只渲染目前可見的項目，並以總高度撐開容器保持滾動條準確度。

## Import

```ts
import { useVirtualizer, useWindowVirtualizer, type VirtualItem } from '@infra/virtual'
```

## Core Usage

### 容器虛擬化（useVirtualizer）

```tsx
"use client"
import { useRef } from 'react'
import { useVirtualizer } from '@infra/virtual'

function TaskList({ tasks }: { tasks: Task[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,       // 預估每列高度 px
    overscan: 5,                  // 緩衝渲染列數
  })

  return (
    <div
      ref={parentRef}
      style={{ height: '600px', overflowY: 'auto', position: 'relative' }}
    >
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((vItem) => (
          <div
            key={vItem.key}
            data-index={vItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: vItem.start,
              left: 0,
              width: '100%',
            }}
          >
            <TaskRow task={tasks[vItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 全頁面虛擬化（useWindowVirtualizer）

```tsx
"use client"
import { useWindowVirtualizer } from '@infra/virtual'

function InfiniteSourceList({ sources }: { sources: Source[] }) {
  const virtualizer = useWindowVirtualizer({
    count: sources.length,
    estimateSize: () => 80,
    scrollMargin: 64,   // 固定 header 高度補償
  })

  return (
    <div style={{ height: virtualizer.getTotalSize() }}>
      {virtualizer.getVirtualItems().map((vItem) => (
        <div
          key={vItem.key}
          style={{
            position: 'absolute',
            top: vItem.start - virtualizer.options.scrollMargin,
            width: '100%',
          }}
        >
          <SourceCard source={sources[vItem.index]} />
        </div>
      ))}
    </div>
  )
}
```

## Key Exports

| Export | 類型 | 說明 |
|---|---|---|
| `useVirtualizer` | Hook | 容器內虛擬化，需提供 `getScrollElement` |
| `useWindowVirtualizer` | Hook | 全頁面虛擬化，使用 `scrollMargin` 補償 offset |
| `VirtualItem` | Type | 虛擬項目（`key`, `index`, `start`, `end`, `size`, `lane`） |
| `VirtualizerOptions` | Type | virtualizer 設定選項型別 |
| `Virtualizer` | Type | virtualizer 實例型別 |
| `Range` | Type | 可見範圍型別 |

## Virtualizer 方法

| 方法 | 說明 |
|---|---|
| `getVirtualItems()` | 返回目前可見的 `VirtualItem[]` |
| `getTotalSize()` | 返回容器應有的總高度（撐開容器用） |
| `scrollToIndex(index)` | 程式化捲動到指定項目 |
| `measureElement` | ref callback，用於動態高度測量 |

## Architecture Notes

- 僅用於 `interfaces/` 層（`"use client"` 必要）
- 與 `packages/infra/query/` 的 `useInfiniteQuery` 搭配實現無限捲動
- 與 `packages/infra/table/` 搭配實現虛擬化表格
- 外層容器必須設定 `position: relative`，項目設定 `position: absolute`
````

## File: packages/infra/zod/AGENTS.md
````markdown
# infra/zod — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/zod/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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

## File: packages/infra/zod/README.md
````markdown
# infra/zod

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


Zod 基礎設施原語。封裝 **Zod v4**，提供共用 schema 片段、brand helper、邊界驗證工具。

## 公開 API

```ts
import {
  z,

  // 共用 schema 片段
  UuidSchema,
  IsoDateTimeSchema,

  // Domain value object helper
  createBrandedUuidSchema,

  // 邊界驗證工具
  zodErrorToFieldMap,   // ZodError -> Record<fieldPath, messages[]>
  zodParseOrThrow,      // 驗證失敗時拋出 Error（附摘要）
  zodSafeParse,         // 不拋出，回傳 { success, data, error }
} from '@infra/zod'
```

## 三層驗證位置（架構規則）

| 層級 | 用途 | API |
|---|---|---|
| `interfaces/` Server Action 邊界 | 外部輸入驗證 | `zodParseOrThrow` |
| `domain/value-objects/` | Brand type 定義 | `createBrandedUuidSchema` / `z.brand()` |
| `infrastructure/` adapter | 外部系統輸出驗證 | `z.parse()` / `zodSafeParse` |

## 範例

```ts
// ─── Server Action boundary ───────────────────────────────────────
import { z, zodParseOrThrow } from '@infra/zod'

const InputSchema = z.object({ name: z.string().min(1) })

export async function createWorkspaceAction(raw: unknown) {
  const input = zodParseOrThrow(InputSchema, raw)
  // input is typed InputSchema
}

// ─── Domain value object ──────────────────────────────────────────
import { createBrandedUuidSchema } from '@infra/zod'

export const WorkspaceIdSchema = createBrandedUuidSchema('WorkspaceId')
export type WorkspaceId = typeof WorkspaceIdSchema._type
```

## Context7 官方基線

- 文件：`/colinhacks/zod`（Zod v4）
- 邊界驗證採 `parse` / `safeParse`；錯誤統一回傳 `ZodError.issues` 結構。
- `z.object().passthrough()` 禁止用於生產資料路徑。
````

## File: packages/integration-ai/AGENTS.md
````markdown
# integration-ai — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `genkit.ts`
- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/integration-ai/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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
| Genkit flow **定義**（非呼叫） | `src/modules/ai/` 或 fn/ |

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

## File: packages/integration-ai/README.md
````markdown
# integration-ai

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `genkit.ts`
- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


AI 服務整合層：Genkit singleton、flow 執行合約、共用 AI 型別。

## 套件結構

```
packages/integration-ai/
  index.ts    ← 合約型別 + createUnconfiguredAiClient
  genkit.ts   ← Genkit singleton（`ai` 實例）
  AGENTS.md
```

## 公開 API

```ts
// 從 index.ts（瀏覽器安全的型別 + 合約）
import {
  type AiGenerateTextInput,
  type AiGenerateTextResult,
  type AiTextClient,
  IntegrationAiConfigurationError,
  IntegrationAiFlowError,
  createUnconfiguredAiClient,
} from '@integration-ai'

// Genkit singleton（Server 端，在 infrastructure/ai/ 中使用）
// genkit/googleAI 是 Server-only，不包含在 index.ts barrel 內
import { ai } from '@integration-ai/genkit'
```

## 使用規則

| 規則 | 說明 |
|---|---|
| **只允許在 `infrastructure/ai/` 使用** | Flow 定義放 `infrastructure/ai/*.flow.ts` |
| **禁止在 `domain/` 或 `application/` import** | 這兩層依賴 port 介面，不依賴 genkit 直接呼叫 |
| **flow 必須有 inputSchema + outputSchema** | 使用 Zod（`genkitZ`）定義 |
| **AI 輸出在返回 application 前必須驗證** | `outputSchema.parse(output)` |
| **環境憑證只來自 env vars** | `GOOGLE_GENAI_API_KEY` / `GOOGLE_API_KEY` |

## Flow 定義範例

```ts
import { ai } from '@integration-ai/genkit'
import { genkitZ } from '@integration-ai'
import { googleAI } from '@genkit-ai/google-genai'

export const synthesisFlow = ai.defineFlow(
  {
    name: 'notebooklm.synthesis',
    inputSchema: genkitZ.object({ query: genkitZ.string() }),
    outputSchema: genkitZ.object({ answer: genkitZ.string() }),
  },
  async ({ query }) => {
    const { text } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: query,
    })
    return { answer: text }
  },
)
```

## Context7 官方基線

- 文件：`/websites/genkit_dev_js`
- flow/tool 必須有 schema（輸入/輸出）；避免回傳未驗證的模型結果。
- Genkit singleton 以 `genkit({ plugins: [googleAI()] })` 初始化一次。
````

## File: packages/integration-firebase/AGENTS.md
````markdown
# integration-firebase — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `auth.ts`
- `client.ts`
- `firestore.ts`
- `functions.ts`
- `index.ts`
- `storage.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/integration-firebase/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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
export function getFirebaseFunctions(region = "asia-southeast1"): Functions
````

## File: packages/integration-firebase/README.md
````markdown
# integration-firebase

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `auth.ts`
- `client.ts`
- `firestore.ts`
- `functions.ts`
- `index.ts`
- `storage.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


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

## File: packages/integration-queue/AGENTS.md
````markdown
# integration-queue — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/integration-queue/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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
| 背景工作處理 handler | `src/app/api/` 或 `fn/` |

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

## File: packages/integration-queue/README.md
````markdown
# integration-queue

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


訊息佇列整合層：QStash HTTP publisher 合約與工具函式。

## 套件結構

```
packages/integration-queue/
  index.ts    ← QueueClient 介面 + createQStashClient + 型別定義
  AGENTS.md
```

## 公開 API

```ts
import {
  // 主要 API
  createQStashClient,
  type QueueClient,
  type QueuePublishOptions,
  type QueuePublishResult,
  type QStashConfig,

  // 錯誤
  IntegrationQueueError,

  // 開發 / 測試 stub
  createNoOpQueueClient,

  // Legacy 相容
  createInMemoryQueuePublisher,
  type QueuePublisher,
  type QueueMessage,
} from '@integration-queue'
```

## 使用範例

```ts
import { createQStashClient } from '@integration-queue'

const queue = createQStashClient({
  token: process.env.QSTASH_TOKEN!,
})

await queue.publish({
  destination: 'https://app.example.com/api/worker/embed',
  body: { documentId: 'doc-123' },
  retries: 3,
  delay: '5s',
  failureCallback: 'https://app.example.com/api/worker/embed-failed',
})
```

## 使用規則

| 規則 | 說明 |
|---|---|
| **只允許在 outbound adapter 使用** | `src/modules/*/adapters/outbound/` |
| **token 來自 env var** | `QSTASH_TOKEN`，不得 hardcode |
| **domain / application 禁止直接 import** | 透過 port interface 注入 |

## Context7 官方基線

- 文件：`/websites/upstash_qstash`
- 佇列發布需支援 retry、delay、callback/failureCallback。
- 發布訊息通過 `Authorization: Bearer <token>` HTTP header。
````

## File: packages/ui-components/AGENTS.md
````markdown
# ui-components — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/ui-components/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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

## File: packages/ui-components/README.md
````markdown
# ui-components

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


業務無關的自訂 UI 元件（wrap、design-system 擴充）。

## 公開 API

```ts
import {
  PageSection,
  type PageSectionProps,

  EmptyState,
  type EmptyStateProps,
} from '@ui-components'
```

## 使用規則

| 規則 | 說明 |
|---|---|
| **唯一放置自訂 UI 元件的位置** | 任何 wrap / 設計系統擴充都放此層 |
| **禁止含業務邏輯** | 業務語意放 `src/modules/*/interfaces/` |
| **不 import `src/modules/`** | UI 元件不得感知 domain |

## 判斷：放這裡 vs ui-shadcn

| 情況 | 放哪裡 |
|---|---|
| shadcn 官方組件（Button, Card, Input…） | `@ui-shadcn`（CLI 管理，不手改） |
| 對官方組件的 wrap / 業務語意層 | `@ui-components` |
| 跨 module 共用但無業務語意的 layout 元件 | `@ui-components` |
````

## File: packages/ui-dnd/AGENTS.md
````markdown
# ui-dnd — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/ui-dnd/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


此套件是 **拖放（Drag-and-Drop）能力的唯一授權來源**，透過 Atlassian Pragmatic DnD 提供效能優化的拖放原語。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 元素拖放綁定 | `draggable`, `dropTargetForElements`, `monitorForElements` |
| 多 cleanup 合併 | `combine(cleanup1, cleanup2, ...)` — useEffect 清理 |
| 陣列重排 | `reorder({ list, startIndex, finishIndex })` |
| 邊緣插入 | `attachClosestEdge` / `extractClosestEdge` + `Edge` 型別 |
| 拖放視覺指示器 | `DropIndicator`（box）、`TreeDropIndicator`（tree-item） |
| 容器自動捲動 | `autoScrollForElements` |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 帶業務語意的可拖放組件（TaskCard） | `src/modules/<context>/interfaces/` |
| 拖放後的業務狀態更新 | `src/modules/<context>/application/` use case |
| 拖放資料 schema 定義 | `src/modules/<context>/domain/` |
| UI 組件樣式 | `packages/ui-shadcn/` / `packages/ui-components/` |

---

## 嚴禁

```ts
// ❌ 不得在 domain/ / application/ 層 import 任何此套件

// ✅ 正確模式：在 interfaces/ 的 Client Component 使用
"use client"
import { useEffect, useRef } from 'react'
import { draggable, combine } from '@ui-dnd'

function DraggableCard({ item }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return combine(
      draggable({ element: ref.current!, getInitialData: () => ({ id: item.id }) })
    )
  }, [item.id])

  return <div ref={ref}>{item.title}</div>
}
```

- 所有消費者必須加 `"use client"`（瀏覽器 drag API）
- 拖放邏輯在 `useEffect` 中以命令式綁定，清理函數必須透過 `combine` 合併後 return
- `DropIndicator` 父元素必須設定 `position: relative`
- 不得在此套件包含任何業務語意

## Alias

```ts
import { draggable, dropTargetForElements, combine, reorder, DropIndicator } from '@ui-dnd'
```
````

## File: packages/ui-dnd/README.md
````markdown
# @ui-dnd

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


Drag-and-drop primitives via **Atlassian Pragmatic DnD**.

## Purpose

提供高效能、無 React state 洩漏的拖放綁定，透過 imperative useEffect 模式將 drag/drop 行為附加到 DOM 元素，讓 React 渲染週期不受拖放內部狀態影響。

## Install Requirements

```bash
npm install @atlaskit/pragmatic-drag-and-drop
npm install @atlaskit/pragmatic-drag-and-drop-hitbox
npm install @atlaskit/pragmatic-drag-and-drop-react-drop-indicator
npm install @atlaskit/pragmatic-drag-and-drop-auto-scroll
```

## Import

```ts
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
  combine,
  reorder,
  attachClosestEdge,
  extractClosestEdge,
  DropIndicator,
  type Edge,
} from '@ui-dnd'
```

## Core Usage

### 基本拖放清單

```tsx
"use client"
import { useEffect, useRef, useState } from 'react'
import { draggable, dropTargetForElements, monitorForElements, combine, reorder } from '@ui-dnd'

function SortableList({ items }: { items: { id: string; title: string }[] }) {
  const [list, setList] = useState(items)

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0]
        if (!target) return

        const sourceId = source.data.id as string
        const targetId = target.data.id as string
        const startIndex = list.findIndex((i) => i.id === sourceId)
        const finishIndex = list.findIndex((i) => i.id === targetId)

        if (startIndex !== -1 && finishIndex !== -1) {
          setList(reorder({ list, startIndex, finishIndex }))
        }
      },
    })
  }, [list])

  return (
    <div>
      {list.map((item) => (
        <DraggableItem key={item.id} item={item} />
      ))}
    </div>
  )
}

function DraggableItem({ item }: { item: { id: string; title: string } }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return combine(
      draggable({
        element: ref.current!,
        getInitialData: () => ({ id: item.id }),
      }),
      dropTargetForElements({
        element: ref.current!,
        getData: () => ({ id: item.id }),
      }),
    )
  }, [item.id])

  return <div ref={ref} style={{ cursor: 'grab' }}>{item.title}</div>
}
```

### 邊緣插入（上方/下方）

```tsx
"use client"
import { useEffect, useRef, useState } from 'react'
import { draggable, dropTargetForElements, combine, attachClosestEdge, extractClosestEdge, DropIndicator, type Edge } from '@ui-dnd'

function EdgeDropItem({ item }) {
  const ref = useRef<HTMLDivElement>(null)
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null)

  useEffect(() => {
    return combine(
      draggable({ element: ref.current!, getInitialData: () => ({ id: item.id }) }),
      dropTargetForElements({
        element: ref.current!,
        getData: ({ input, element }) =>
          attachClosestEdge({ id: item.id }, { input, element, allowedEdges: ['top', 'bottom'] }),
        onDrag: ({ self }) => setClosestEdge(extractClosestEdge(self.data)),
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      }),
    )
  }, [item.id])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {item.title}
      {closestEdge && <DropIndicator edge={closestEdge} gap="1px" />}
    </div>
  )
}
```

## Key Exports

| Export | 類型 | 說明 |
|---|---|---|
| `draggable` | Adapter | 讓元素可拖動 |
| `dropTargetForElements` | Adapter | 讓元素成為放置目標 |
| `monitorForElements` | Monitor | 全局監聽拖放事件 |
| `combine` | Utility | 合併多個 cleanup 函數 |
| `reorder` | Utility | 純函數陣列重排 |
| `attachClosestEdge` | Hitbox | 附加最近邊緣資料到 getData |
| `extractClosestEdge` | Hitbox | 從 data 提取最近邊緣 |
| `reorderWithEdge` | Hitbox | 依邊緣方向重排陣列 |
| `DropIndicator` | Component | Box 型拖放插入線指示器 |
| `TreeDropIndicator` | Component | Tree-item 型拖放插入線指示器 |
| `autoScrollForElements` | Adapter | 拖動時自動捲動容器 |
| `Edge` | Type | `'top' \| 'bottom' \| 'left' \| 'right'` |

## Architecture Notes

- 僅用於 `interfaces/` 層（`"use client"` 必要）
- 所有綁定在 `useEffect` 中以 imperative 方式附加，不使用 JSX wrapper
- `combine()` 是合併多個 adapter cleanup 的正確方式
- 拖放後的業務狀態更新應透過 use case / application 層執行
- `DropIndicator` 父元素需要 `position: relative`
````

## File: packages/ui-editor/AGENTS.md
````markdown
# ui-editor — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/ui-editor/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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

## File: packages/ui-editor/README.md
````markdown
# ui-editor

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


TipTap 3 富文本編輯器封裝。提供 `RichTextEditor`（可編輯）與 `ReadOnlyEditor`（唯讀）兩個 React 元件。

## 套件結構

```
packages/ui-editor/
  index.ts    ← RichTextEditor + ReadOnlyEditor
  AGENTS.md
```

## 公開 API

```ts
import {
  RichTextEditor,
  type RichTextEditorProps,

  ReadOnlyEditor,
  type ReadOnlyEditorProps,
} from '@ui-editor'
```

## 使用範例

```tsx
'use client'

import { RichTextEditor, ReadOnlyEditor } from '@ui-editor'

// 可編輯
<RichTextEditor
  value={html}
  onChange={setHtml}
  placeholder="Start writing…"
/>

// 唯讀
<ReadOnlyEditor value={html} />
```

## 啟用的 TipTap 擴充

| 擴充 | 功能 |
|---|---|
| `@tiptap/starter-kit` | 段落、標題、列表、粗體、斜體、刪除線、程式碼等 |
| `@tiptap/extension-link` | 超連結（`openOnClick: false`） |
| `@tiptap/extension-underline` | 底線 |
| `@tiptap/extension-text-style` | 文字樣式容器 |
| `@tiptap/extension-color` | 文字色彩 |
| `@tiptap/extension-typography` | 智慧引號、Em dash 等排版轉換 |
| `@tiptap/extension-placeholder` | 佔位提示（僅 RichTextEditor） |

## 注意事項

- `immediatelyRender: false` — 避免 Next.js SSR hydration mismatch。
- 父元件需要 `'use client'` directive（RichTextEditor 使用 React hooks）。
- HTML 資料格式：TipTap 以 HTML string 輸入/輸出。

## Context7 官方基線

- 文件：`/ueberdosis/tiptap-docs`
- `useEditor` + `EditorContent` 是 React 整合方式。
- Next.js 下必須設定 `immediatelyRender: false`。
````

## File: packages/ui-markdown/AGENTS.md
````markdown
# ui-markdown — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)

## Package / Directory Index

- `index.tsx`

## Drift Guard

- `AGENTS.md` 擁有 `packages/ui-markdown/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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

## File: packages/ui-markdown/README.md
````markdown
# ui-markdown

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)

## Package / Directory Index

- `index.tsx`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


Markdown 渲染元件（react-markdown + remark-gfm）。

## 公開 API

```tsx
import { MarkdownRenderer, type MarkdownRendererProps } from '@ui-markdown'

<MarkdownRenderer markdown={text} className="my-prose-class" />
```

## 使用規則

- 預設維持安全渲染（不開 raw HTML）。
- GFM（表格、任務列表、刪除線）透過 `remark-gfm` 啟用。

## Context7 官方基線

- 文件：`/remarkjs/react-markdown`、`/remarkjs/remark-gfm`
````

## File: packages/ui-shadcn/AGENTS.md
````markdown
# AGENTS.md — packages/ui-shadcn

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `hooks/`
- `index.ts`
- `lib/`
- `provider/`
- `ui/`

## Drift Guard

- `AGENTS.md` 擁有 `packages/ui-shadcn/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `hooks/`
- `index.ts`
- `lib/`
- `provider/`
- `ui/`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


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

## File: packages/ui-vis/AGENTS.md
````markdown
# ui-vis — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/ui-vis/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


此套件是 **圖形（Graph）、網絡（Network）與時間軸（Timeline）視覺化能力的唯一授權來源**，透過 vis.js 系列提供互動式節點邊緣圖與事件時間軸。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 力導向圖 | `Network` — 節點邊緣互動式視覺化 |
| 反應式資料集 | `DataSet`, `DataView` — 觸發自動重繪 |
| 時間軸 | `Timeline` — 水平事件與時間範圍呈現 |
| 匯入工具 | 不支援 — `parseGephiNetwork`、`parseDOTNetwork` 僅在 UMD global build (`vis.parseGephiNetwork`)，不是 ESM named export |
| 型別 | `VisNode`, `VisEdge`, `VisNetworkOptions`, `TimelineItem` 等 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| Recharts 折線圖、長條圖、圓餅圖 | `packages/ui-visualization/`（XuanwuLineChart 等） |
| 圖形資料的業務邏輯 | `src/modules/<context>/domain/` 或 `application/` |
| 圖形狀態管理 | `packages/infra/state/` |

---

## 嚴禁

```ts
// ❌ 不得在 domain/ / application/ 層 import
// ❌ 不得在 Server Component 使用（需 DOM）
// ❌ 不得省略 CSS import（會導致 Network 渲染異常）

// ✅ 正確模式：在 Client Component 的 useEffect 中建立
"use client"
import { useEffect, useRef } from 'react'
import { Network, DataSet } from '@ui-vis'
import 'vis-network/styles/vis-network.css'   // 必須在消費模組 import

function KnowledgeGraph({ nodes, edges }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const network = new Network(
      containerRef.current,
      { nodes: new DataSet(nodes), edges: new DataSet(edges) },
      {}
    )
    return () => network.destroy()   // 必須清理
  }, [nodes, edges])

  return <div ref={containerRef} style={{ height: '500px' }} />
}
```

- 所有消費者必須加 `"use client"`（需瀏覽器 DOM API）
- `Network` 與 `Timeline` 在 `useEffect` 中以 `new` 建立，`destroy()` 在 cleanup 中呼叫
- `Node` / `Edge` 從 vis-network 已別名為 `VisNode` / `VisEdge`（避免與 TS 內建名稱衝突）
- 不得在此套件包含任何業務語意

## Alias

```ts
import { Network, DataSet, Timeline, type VisNode, type VisEdge } from '@ui-vis'
```
````

## File: packages/ui-vis/README.md
````markdown
# @ui-vis

Graph, network, and timeline visualization via **vis.js family** (`vis-network`, `vis-data`, `vis-timeline`).

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md) / [../AGENTS.md](../AGENTS.md)
- Public boundary: [index.ts](index.ts)

## Actual Exports

```ts
import {
  Network,
  DataSet,
  DataView,
  Timeline,
  type VisNode,
  type VisEdge,
  type VisNetworkOptions,
  type DataSetOptions,
  type TimelineOptions,
  type TimelineItem,
  type TimelineGroup,
} from '@ui-vis'
```

> `parseGephiNetwork` 與 `parseDOTNetwork` **不是** 目前 `@ui-vis` 的公開匯出；以 `index.ts` 為準。

## Runtime Notes

- 只在 client component 使用（需瀏覽器 DOM）。
- CSS 由消費端個別引入：
  - `vis-network/styles/vis-network.css`
  - `vis-timeline/styles/vis-timeline-graph2d.css`
- `Network` / `Timeline` 需在 effect 中建立並於 cleanup 呼叫 `destroy()`。

## Pair Contract

- `README.md` 只描述目前公開匯出與使用前提。
- `AGENTS.md` 負責 routing 與放置決策。
````

## File: packages/ui-visualization/AGENTS.md
````markdown
# ui-visualization — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)

## Package / Directory Index

- `index.tsx`

## Drift Guard

- `AGENTS.md` 擁有 `packages/ui-visualization/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


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

## File: packages/ui-visualization/README.md
````markdown
# ui-visualization

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)

## Package / Directory Index

- `index.tsx`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


數據視覺化元件（Recharts 2 封裝）。

## 套件結構

```
packages/ui-visualization/
  index.ts    ← StatCard + XuanwuLineChart + XuanwuBarChart + XuanwuPieChart
  AGENTS.md
```

## 公開 API

```ts
import {
  // 統計卡片
  StatCard,
  type StatCardProps,

  // 折線圖
  XuanwuLineChart,
  type XuanwuLineChartProps,

  // 長條圖
  XuanwuBarChart,
  type XuanwuBarChartProps,

  // 圓餅圖 / 環形圖
  XuanwuPieChart,
  type XuanwuPieChartProps,

  // 共用資料型別
  type DataPoint,
  type SeriesConfig,
  type PieDataPoint,
} from '@ui-visualization'
```

## 使用範例

```tsx
'use client'

import { XuanwuLineChart, XuanwuBarChart, XuanwuPieChart } from '@ui-visualization'

// 折線圖
<XuanwuLineChart
  data={[
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
  ]}
  series={[{ dataKey: 'value', label: '收入', color: '#8884d8' }]}
  height={300}
/>

// 長條圖（堆疊）
<XuanwuBarChart
  data={data}
  series={[
    { dataKey: 'done', label: '完成' },
    { dataKey: 'todo', label: '待辦' },
  ]}
  stacked
/>

// 環形圖
<XuanwuPieChart
  data={[{ name: '完成', value: 80 }, { name: '待辦', value: 20 }]}
  innerRadius={60}
/>
```

## 使用規則

- 使用 `ResponsiveContainer` — 不固定 width/height，透過父 div 高度控制。
- 禁止含業務邏輯，只做資料呈現。
- 需要 `'use client'` directive（Recharts 使用 ResizeObserver）。

## 顏色系統

預設使用 CSS variable `--chart-1` ... `--chart-5`（Shadcn 主題變數）。可透過 `series[i].color` 覆寫。

## Context7 官方基線

- 文件：`/recharts/recharts`
- `ResponsiveContainer` + percentage 寬高為標準響應式模式。
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
⋮----
/**
 * Build Google Viewer embed URL from an HTTPS-accessible source URL.
 * Typically used with short-lived signed URLs for private files.
 */
export const createGoogleViewerEmbedUrl = (sourceUrl: string): string
````

## File: packages/AGENTS.md
````markdown
# packages Agent Rules

## ROLE

- The agent MUST treat packages as the shared package surface for infra primitives, external integrations, and reusable UI packages.
- The agent MUST keep business ownership in src/modules rather than moving domain logic into packages.

## DOMAIN BOUNDARIES

- The agent MUST keep local primitives in packages/infra.
- The agent MUST keep SDK and service wrappers in integration packages.
- The agent MUST keep reusable presentation concerns in UI packages.

## TOOL USAGE

- The agent MUST validate package paths and boundaries before edits.
- The agent MUST keep package references synchronized with actual directories.

## EXECUTION FLOW

- The agent MUST read [../AGENTS.md](../AGENTS.md) first.
- The agent MUST select the correct child package before editing leaf docs.
- The agent MUST update [README.md](README.md) with this file when routing changes.

## DATA CONTRACT

- The agent MUST keep package purpose descriptions explicit and stable.
- The agent MUST keep index links valid and current.

## CONSTRAINTS

- The agent MUST NOT place business rules in packages.
- The agent MUST NOT duplicate docs-owned strategic architecture here.

## Route Here When

- You update shared infra, integration, or UI package routing and governance.

## Route Elsewhere When

- Business capability ownership: [../src/modules/AGENTS.md](../src/modules/AGENTS.md)
- Strategic architecture decisions: [../docs/README.md](../docs/README.md)
````

## File: packages/infra/AGENTS.md
````markdown
# infra Agent Rules

## ROLE

- The agent MUST treat packages/infra as the home for local infra primitives used across the repo.
- The agent MUST keep infra focused on reusable technical primitives, not external service wrappers or business logic.

## DOMAIN BOUNDARIES

- The agent MUST keep client-state, date, form, http, query, serialization, state, table, trpc, uuid, virtual, and zod primitives inside packages/infra.
- The agent MUST route external-service wrappers to integration packages.

## TOOL USAGE

- The agent MUST validate child package paths before edits.
- The agent MUST keep subpackage references synchronized with actual directories.

## EXECUTION FLOW

- The agent MUST read [../AGENTS.md](../AGENTS.md) first.
- The agent MUST select the correct infra child before editing leaf docs.
- The agent MUST update [README.md](README.md) with this file when routing changes.

## DATA CONTRACT

- The agent MUST keep primitive package purpose descriptions explicit and stable.

## CONSTRAINTS

- The agent MUST NOT place service credentials, SDK wrappers, or business rules in packages/infra.

## Route Here When

- You update local infra primitive routing or governance.

## Route Elsewhere When

- External integrations: [../integration-ai/AGENTS.md](../integration-ai/AGENTS.md)
````

## File: packages/infra/date/AGENTS.md
````markdown
# infra/date — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/date/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


此套件提供 **日期處理原語**，封裝 `date-fns` 的解析、格式化、比較與區間工具。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 日期格式化 | `format`、`formatISO`、`formatDistance` |
| 日期解析 | `parse`、`parseISO` |
| 日期比較 | `isBefore`、`isAfter`、`compareAsc` |
| 日期區間邊界 | `startOfDay`、`endOfMonth`、`startOfWeek` |
| 日期運算 | `addDays`、`subMonths`、`differenceInDays` |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務日曆規則、排程語意 | `src/modules/<context>/domain/` 或 `application/` |
| 時區 / locale 業務決策 | owning module `interfaces/` 或 `application/` |
| Server-state 快取 | `packages/infra/query/` |

---

## 嚴禁

- 不得在此套件加入業務判斷或 workflow 規則
- 不得 import `src/modules/*`
- 不得依賴任何外部服務或 I/O

## Alias

```ts
import { format, parseISO, addDays } from '@infra/date'
```
````

## File: packages/infra/date/README.md
````markdown
# @infra/date

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


Date manipulation utilities via **date-fns v4**.

## Purpose

提供純函式的日期原語，供 `interfaces/`、`application/` 與共享套件做格式化、比較與日期區間計算。
這裡只封裝通用日期能力，不承載任何業務日曆規則。

## Import

```ts
import {
  format,
  parseISO,
  addDays,
  startOfMonth,
  differenceInDays,
  type Locale,
} from '@infra/date'
```

## Key Exports

| 類別 | 代表函式 |
|---|---|
| Parsing & formatting | `parse`, `parseISO`, `format`, `formatISO` |
| Validation | `isValid`, `isDate` |
| Arithmetic | `addDays`, `subWeeks`, `addMonths`, `subYears` |
| Boundaries | `startOfDay`, `endOfWeek`, `startOfMonth`, `endOfYear` |
| Comparison | `isBefore`, `isAfter`, `isEqual`, `compareAsc` |
| Difference | `differenceInDays`, `differenceInHours`, `differenceInMonths` |

## Guardrails

- 只放通用日期工具，不放業務時程邏輯
- 保持純函式，避免副作用
- 業務語意（例如工作日、需求優先級日曆）屬於 owning module
````

## File: packages/infra/query/AGENTS.md
````markdown
# infra/query — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/query/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


此套件提供 **TanStack Query v5 server-state 原語**。
它負責 query client、query hook 與型別安全的 options factory，不負責業務資料模型。

---

## Route Here

| 類型 | 說明 |
|---|---|
| Query client 與 provider | `QueryClient`、`QueryClientProvider` |
| Query hooks | `useQuery`、`useMutation`、`useInfiniteQuery` |
| Query factory helpers | `queryOptions`、`infiniteQueryOptions` |
| Server-state 型別 | `UseQueryOptions`、`QueryKey`、`InfiniteData` |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 具業務語意的 query key / query function | `src/modules/<context>/interfaces/queries/` |
| UI toggle / panel state | `src/modules/<context>/interfaces/stores/` 或 `@infra/state` |
| 業務 invariant | `src/modules/<context>/domain/` |

---

## 嚴禁

- 不得在此套件加入業務 query key 或資料轉換規則
- 不得把 TanStack Query 資料鏡像到本地 store
- 不得 import `src/modules/*`

## Alias

```ts
import { useQuery, useMutation, queryOptions } from '@infra/query'
```
````

## File: packages/infra/query/README.md
````markdown
# @infra/query

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


Server-state management via **TanStack Query v5**.

## Purpose

提供查詢快取、mutation lifecycle 與 options factory，作為 `interfaces/` 層處理 server-state 的標準入口。
資料的業務語意與 query key 命名仍由 owning module 決定。

## Import

```ts
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  queryOptions,
  type QueryKey,
} from '@infra/query'
```

## Key Exports

| Export | 類型 | 說明 |
|---|---|---|
| `QueryClient` | Class | 建立全域 query client |
| `QueryClientProvider` | Component | React provider |
| `useQuery` | Hook | 讀取 server-state |
| `useMutation` | Hook | 提交寫入 / side effect |
| `useInfiniteQuery` | Hook | 分頁查詢 |
| `useSuspenseQuery` | Hook | Suspense 查詢 |
| `queryOptions` | Helper | 型別安全 query options factory |
| `infiniteQueryOptions` | Helper | infinite query options factory |

## Guardrails

- TanStack Query 是 server-state authority
- 不把 query result 複製到 Zustand / local store
- 業務 query function 與 query key 留在 owning module
````

## File: packages/README.md
````markdown
# packages

## PURPOSE

packages 目錄承接共享 infra primitive、外部整合封裝與可重用 UI package。
它提供跨模組共用能力，但不承接業務語言所有權。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../AGENTS.md](../AGENTS.md)
3. [../docs/README.md](../docs/README.md)

## ARCHITECTURE

packages 由 infra、integration-* 與 ui-* 三類共享套件構成。
業務規則仍應留在 src/modules，packages 只提供共用技術能力。

## PROJECT STRUCTURE

- [infra](infra)
- [integration-ai](integration-ai)
- [integration-firebase](integration-firebase)
- [integration-queue](integration-queue)
- [ui-components](ui-components)
- [ui-dnd](ui-dnd)
- [ui-editor](ui-editor)
- [ui-markdown](ui-markdown)
- [ui-shadcn](ui-shadcn)
- [ui-vis](ui-vis)
- [ui-visualization](ui-visualization)

## DEVELOPMENT RULES

- MUST keep shared technical capability in packages.
- MUST keep business ownership in src/modules.
- MUST keep package boundaries explicit and stable.
- MUST avoid duplicating strategic docs here.

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Infra subgroup: [infra/README.md](infra/README.md)
- Strategic authority: [../docs/README.md](../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內判斷共享能力應放在 infra、integration 或 ui 套件。
- 可在 3 分鐘內定位適合的 package 子樹。
````

## File: packages/infra/README.md
````markdown
# packages/infra

## PURPOSE

packages/infra 提供 repo 內共用的本地 infra primitive，例如 state、query、http、serialization 與 zod helpers。
它只承接技術原語，不承接外部服務整合或業務規則。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../README.md](../README.md)
3. [../../docs/README.md](../../docs/README.md)

## ARCHITECTURE

packages/infra 由多個本地 primitive 子套件構成，供 modules 與其他 packages 重用。
外部 SDK 或服務封裝應留在 integration packages，而不是 infra。

## PROJECT STRUCTURE

- [client-state](client-state)
- [date](date)
- [form](form)
- [http](http)
- [query](query)
- [serialization](serialization)
- [state](state)
- [table](table)
- [trpc](trpc)
- [uuid](uuid)
- [virtual](virtual)
- [zod](zod)

## DEVELOPMENT RULES

- MUST keep only local technical primitives in packages/infra.
- MUST route external integrations to integration packages.
- MUST keep package purposes explicit and stable.
- MUST avoid business ownership here.

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Parent package index: [../README.md](../README.md)
- Strategic authority: [../../docs/README.md](../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內判斷某個共享技術能力是否應落在 infra。
- 可在 3 分鐘內定位對應 primitive 子套件。
````