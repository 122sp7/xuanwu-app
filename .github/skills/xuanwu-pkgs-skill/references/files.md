# Files

## File: packages/api-contracts/index.ts
````typescript
// ─── REST API Route Registry ──────────────────────────────────────────────────
⋮----
// ─── GraphQL Schema ───────────────────────────────────────────────────────────
````

## File: packages/integration-firebase/admin.ts
````typescript
/**
 * @module libs/firebase/admin
 */
````

## File: packages/integration-firebase/analytics.ts
````typescript
/**
 * @module libs/firebase/analytics
 * Firebase Analytics wrapper (browser-only).
 * All exports are safe to import in SSR; actual SDK calls are no-ops on the server.
 */
⋮----
import {
  getAnalytics,
  isSupported,
  logEvent,
  setCurrentScreen,
  setUserId,
  setUserProperties,
  setAnalyticsCollectionEnabled,
  type Analytics,
  type EventParams,
} from "firebase/analytics";
import { firebaseClientApp } from "./client";
⋮----
/**
 * Returns the singleton Analytics instance.
 * Returns null in SSR or when Analytics is not supported.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null>
````

## File: packages/integration-firebase/appcheck.ts
````typescript
/**
 * @module libs/firebase/appcheck
 * Firebase App Check wrapper.
 * Must be initialised before any other Firebase service is used.
 * Uses ReCaptchaEnterpriseProvider in production and debug provider in dev/test.
 */
⋮----
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  getToken,
  onTokenChanged,
  setTokenAutoRefreshEnabled,
  type AppCheck,
  type AppCheckToken,
} from "firebase/app-check";
import { firebaseClientApp } from "./client";
⋮----
/**
 * Lazily initialise App Check (browser-only).
 * Call once at app bootstrap (e.g. inside the root Provider).
 */
export function initFirebaseAppCheck(): AppCheck | null
⋮----
// Enable debug token in non-production environments.
// Set NEXT_PUBLIC_FIREBASE_APP_CHECK_DEBUG_TOKEN=true in .env.local to
// get an auto-generated token printed to the browser console.
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
````

## File: packages/integration-firebase/auth.ts
````typescript
/**
 * @module libs/firebase/auth
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
 * @module libs/firebase/client
 */
⋮----
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
````

## File: packages/integration-firebase/database.ts
````typescript
/**
 * @module libs/firebase/database
 * Firebase Realtime Database wrapper.
 */
⋮----
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  update,
  remove,
  onValue,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  off,
  query,
  orderByChild,
  orderByKey,
  orderByValue,
  startAt,
  startAfter,
  endAt,
  endBefore,
  equalTo,
  limitToFirst,
  limitToLast,
  serverTimestamp,
  increment,
  runTransaction,
  connectDatabaseEmulator,
  type Database,
  type DatabaseReference,
  type DataSnapshot,
} from "firebase/database";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseDatabase(): Database
````

## File: packages/integration-firebase/firestore.ts
````typescript
/**
 * @module libs/firebase/firestore
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
  type Firestore,
} from "firebase/firestore";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseFirestore()
````

## File: packages/integration-firebase/functions.ts
````typescript
/**
 * @module libs/firebase/functions-client
 * Firebase callable client wrapper.
 */
⋮----
import {
  getFunctions,
  httpsCallable,
  httpsCallableFromURL,
  connectFunctionsEmulator,
  type Functions,
  type HttpsCallable,
  type HttpsCallableOptions,
} from "firebase/functions";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseFunctions(regionOrCustomDomain?: string): Functions
⋮----
// 只有在明確設定 emulator host 時才連接，否則直接用雲端
````

## File: packages/integration-firebase/index.ts
````typescript
/**
 * @module libs/firebase
 * Client-side Firebase SDK barrel.
 * Server-side (Admin) wrappers live in functions/src/firebase.
 */
````

## File: packages/integration-firebase/messaging.ts
````typescript
/**
 * @module libs/firebase/messaging
 * Firebase Cloud Messaging (FCM) wrapper (browser / service-worker only).
 */
⋮----
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  type Messaging,
  type MessagePayload,
} from "firebase/messaging";
import { firebaseClientApp } from "./client";
⋮----
/**
 * Returns the singleton Messaging instance.
 * Returns null in SSR or unsupported environments.
 */
export async function getFirebaseMessaging(): Promise<Messaging | null>
````

## File: packages/integration-firebase/performance.ts
````typescript
/**
 * @module libs/firebase/performance
 * Firebase Performance Monitoring wrapper (browser-only).
 */
⋮----
import {
  getPerformance,
  trace,
  type FirebasePerformance,
  type PerformanceTrace,
} from "firebase/performance";
import { firebaseClientApp } from "./client";
⋮----
/**
 * Returns the singleton Performance instance (browser-only).
 */
export function getFirebasePerformance(): FirebasePerformance | null
````

## File: packages/integration-firebase/remote-config.ts
````typescript
/**
 * @module libs/firebase/remote-config
 * Firebase Remote Config wrapper.
 */
⋮----
import {
  getRemoteConfig,
  fetchAndActivate,
  fetchConfig,
  activate,
  ensureInitialized,
  getValue,
  getString,
  getNumber,
  getBoolean,
  getAll,
  type RemoteConfig,
  type Value,
} from "firebase/remote-config";
import { firebaseClientApp } from "./client";
⋮----
/**
 * Returns the singleton Remote Config instance (browser-only).
 * Sets a sensible default `minimumFetchIntervalMillis` of 30 s in dev.
 */
export function getFirebaseRemoteConfig(): RemoteConfig | null
````

## File: packages/integration-firebase/storage.ts
````typescript
/**
 * @module libs/firebase/storage
 * Firebase Cloud Storage wrapper.
 */
⋮----
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  list,
  getMetadata,
  updateMetadata,
  getBlob,
  getStream,
  type FirebaseStorage,
  type StorageReference,
  type UploadTask,
  type FullMetadata,
  type SettableMetadata,
  type ListResult,
} from "firebase/storage";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseStorage(bucketUrl?: string): FirebaseStorage
````

## File: packages/integration-http/index.ts
````typescript
import axios from "axios";
⋮----
// TODO: attach auth token
⋮----
// TODO: global error handling
````

## File: packages/lib-date-fns/index.ts
````typescript
/**
 * @module libs/date-fns
 * Thin wrapper for date-fns v4.
 *
 * Provides a single import path for the most commonly used date utility
 * functions in the project.  All exports are pure functions (no side effects),
 * safe to import from Server Components, Client Components, and utilities.
 *
 * Usage:
 *   import { format, parseISO, formatDistanceToNow } from "@/libs/date-fns";
 *   const label = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
 */
⋮----
// ── Formatting ─────────────────────────────────────────────────────────────
⋮----
// ── Parsing ────────────────────────────────────────────────────────────────
⋮----
// ── Arithmetic – add ───────────────────────────────────────────────────────
⋮----
// ── Arithmetic – subtract ──────────────────────────────────────────────────
⋮----
// ── Comparison ─────────────────────────────────────────────────────────────
⋮----
// ── Difference ─────────────────────────────────────────────────────────────
⋮----
// ── Start / End of interval ────────────────────────────────────────────────
⋮----
// ── Getters ────────────────────────────────────────────────────────────────
⋮----
// ── Utilities ──────────────────────────────────────────────────────────────
⋮----
// ── Types ──────────────────────────────────────────────────────────────────
````

## File: packages/lib-dragdrop/index.ts
````typescript
/**
 * @module libs/dragdrop
 * Thin wrapper for Atlaskit Pragmatic Drag and Drop.
 *
 * Provides a single import path for all drag-and-drop primitives:
 *   - Element drag adapter     — draggable, dropTargetForElements, monitorForElements
 *   - External drag adapter    — dropTargetForExternal, monitorForExternal
 *   - Utilities                — combine, reorder, preventUnhandled, once
 *   - Preview helpers          — setCustomNativeDragPreview, disableNativeDragPreview, etc.
 *   - Hitbox                   — closest-edge (flat lists), list-item / tree-item (reorderable trees)
 *   - Drop indicator           — DropIndicator React component for box targets
 *
 * All exports are client-side.  Do not use in Server Components.
 *
 * Usage:
 *   import { draggable, dropTargetForElements, DropIndicator } from "@/libs/dragdrop";
 *   import { attachClosestEdge, extractClosestEdge } from "@/libs/dragdrop";
 */
⋮----
// ── Combine ────────────────────────────────────────────────────────────────
⋮----
// ── Element adapter ────────────────────────────────────────────────────────
⋮----
// ── Element preview helpers ────────────────────────────────────────────────
⋮----
// ── Utilities ──────────────────────────────────────────────────────────────
⋮----
// ── Hitbox — flat closest-edge (cards, columns) ───────────────────────────
⋮----
// ── Hitbox — list / tree item (reorderable lists and trees) ───────────────
⋮----
// ── Drop indicator React component ────────────────────────────────────────
// Note: imports CSS at runtime; only use inside Client Components.
````

## File: packages/lib-react-markdown/index.ts
````typescript
/**
 * @module libs/react-markdown
 * Thin wrapper for react-markdown.
 *
 * Provides a single import path for Markdown rendering in React with both
 * sync and async renderers, plus URL sanitization helper.
 *
 * Usage:
 *   import { ReactMarkdown, remarkPlugins } from "@/libs/react-markdown";
 *   import { remarkGfm } from "@/libs/remark-gfm";
 *
 *   <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
 */
````

## File: packages/lib-remark-gfm/index.ts
````typescript
/**
 * @module libs/remark-gfm
 * Thin wrapper for remark-gfm.
 *
 * Adds GitHub Flavored Markdown support for react-markdown / unified:
 * tables, autolinks, task lists, and strikethrough.
 */
````

## File: packages/lib-superjson/index.ts
````typescript
/**
 * @module libs/superjson
 * Thin wrapper for superjson serialization.
 *
 * superjson extends JSON to support more types: Date, Map, Set, BigInt,
 * Infinity, -0, undefined, NaN, and custom serialization hooks.
 *
 * Usage:
 *   import { stringify, parse } from "@/libs/superjson";
 *   const json = stringify(data);
 *   const result = parse<MyType>(json);
 */
````

## File: packages/lib-tanstack/index.ts
````typescript
/**
 * @module libs/tanstack
 * Thin wrapper for TanStack React contracts.
 */
⋮----
// React Query
⋮----
// React Form
⋮----
// React Table
⋮----
// React Virtual
````

## File: packages/lib-uuid/index.ts
````typescript
/**
 * @module libs/uuid
 * Thin wrapper for uuid v13.
 *
 * Provides stable import paths for RFC-compliant UUID generation and
 * validation.  All functions are pure and safe to import from any layer.
 *
 *   v4  — random UUID (general-purpose, most common)
 *   v7  — time-ordered random UUID (preferred for database primary keys;
 *          monotonically increasing within the same millisecond)
 *
 * Usage:
 *   import { v4, v7 } from "@/libs/uuid";
 *   const id     = v4();            // "110e8400-e29b-41d4-a716-446655440000"
 *   const dbKey  = v7();            // time-sortable UUID for Firestore docs
 *   const isUUID = validate(id);    // true
 */
⋮----
// ── Generators ─────────────────────────────────────────────────────────────
⋮----
// ── Validation & parsing ───────────────────────────────────────────────────
⋮----
// ── Constants ──────────────────────────────────────────────────────────────
⋮----
// ── Rare generators (included for completeness) ────────────────────────────
// v1 — timestamp MAC-address; v6 — reordered timestamp; v3/v5 — name-based
````

## File: packages/lib-vis/data.ts
````typescript
/**
 * @module libs/vis/data
 * Thin wrapper for vis-data.
 *
 * vis-data provides DataSet and DataView for managing and synchronizing
 * large collections of structured data with change notifications.
 *
 * Usage:
 *   import { DataSet } from "@/libs/vis/data";
 *   const dataSet = new DataSet([{ id: 1, label: "Node 1" }]);
 */
````

## File: packages/lib-vis/graph3d.ts
````typescript
/**
 * @module libs/vis/graph3d
 * Thin wrapper for vis-graph3d.
 *
 * vis-graph3d provides interactive 3D graph visualization with surfaces,
 * lines, dots, and blocks with extensive styling options.
 *
 * Usage:
 *   import { Graph3d } from "@/libs/vis/graph3d";
 *   const graph3d = new Graph3d(container, data, options);
 */
⋮----
import type { Graph3d as Graph3dType } from "vis-graph3d";
⋮----
type Graph3dClass = typeof Graph3dType;
export type Graph3dOptions = InstanceType<Graph3dClass> extends { setOptions(opts: infer T): void } ? T : never;
````

## File: packages/lib-vis/index.ts
````typescript
/**
 * @module libs/vis
 * Unified Vis.js visualization library barrel.
 *
 * Provides thin wrappers for all vis.js core libraries:
 *   - vis-data      — DataSet/DataView for structured data management
 *   - vis-network   — Interactive network graphs with physics
 *   - vis-timeline  — Interactive timelines and 2D graphs
 *   - vis-graph3d   — Interactive 3D graph visualization
 *
 * All exports are client-side. Do not import from Server Components
 * without proper use-client boundary.
 *
 * Usage:
 *   import { DataSet, Network, Timeline, Graph3d } from "@/libs/vis";
 */
````

## File: packages/lib-vis/network.ts
````typescript
/**
 * @module libs/vis/network
 * Thin wrapper for vis-network.
 *
 * vis-network provides interactive visualization of network graphs with nodes,
 * edges, physics simulation, and extensive customization options.
 *
 * Usage:
 *   import { Network } from "@/libs/vis/network";
 *   const network = new Network(container, data, options);
 */
⋮----
import type { Network as NetworkType } from "vis-network";
⋮----
type NetworkClass = typeof NetworkType;
export type NetworkOptions = InstanceType<NetworkClass> extends { setOptions(opts: infer T): void } ? T : never;
````

## File: packages/lib-vis/timeline.ts
````typescript
/**
 * @module libs/vis/timeline
 * Thin wrapper for vis-timeline.
 *
 * vis-timeline provides interactive, fully customizable timelines and 2D graphs
 * with items, ranges, and comprehensive event handling.
 *
 * Usage:
 *   import { Timeline } from "@/libs/vis/timeline";
 *   const timeline = new Timeline(container, items, options);
 */
⋮----
import type { Timeline as TimelineType, Graph2d as Graph2dType } from "vis-timeline";
⋮----
type TimelineClass = typeof TimelineType;
type Graph2dClass = typeof Graph2dType;
⋮----
export type TimelineOptions = InstanceType<TimelineClass> extends { setOptions(opts: infer T): void } ? T : never;
export type Graph2dOptions = InstanceType<Graph2dClass> extends { setOptions(opts: infer T): void } ? T : never;
````

## File: packages/lib-xstate/index.ts
````typescript
/**
 * @module libs/xstate
 * Thin wrapper for XState v5 + @xstate/react.
 *
 * Provides a single import path for state machine creation, actor execution,
 * and React integration hooks.  All exports are isomorphic (server + client)
 * except for React hooks which require a Client Component boundary.
 *
 * Machine definition:
 *   import { setup, fromPromise } from "@/libs/xstate";
 *   const machine = setup({ actors: { fetch: fromPromise(…) } }).createMachine(…);
 *
 * React integration:
 *   import { useMachine, useActorRef, useSelector } from "@/libs/xstate";
 */
⋮----
// ── Core factories ─────────────────────────────────────────────────────────
⋮----
// ── Actions ────────────────────────────────────────────────────────────────
⋮----
// ── Guards ─────────────────────────────────────────────────────────────────
⋮----
// ── Actor logic creators ───────────────────────────────────────────────────
⋮----
// ── Utilities ──────────────────────────────────────────────────────────────
⋮----
// ── Runtime helpers / compatibility aliases ───────────────────────────────
⋮----
// ── Types ──────────────────────────────────────────────────────────────────
⋮----
// ── React hooks (Client Component only) ───────────────────────────────────
````

## File: packages/lib-zod/index.ts
````typescript
/**
 * @module libs/zod
 * Thin wrapper for Zod v4 schema validation.
 *
 * Provides a single import path for schema definition, validation, and error
 * handling.  Safe to import from Server Components, Client Components,
 * utilities, and domain layers.
 *
 * Usage:
 *   import { z } from "@/libs/zod";
 *
 *   const UserSchema = z.object({
 *     id:    z.string().uuid(),
 *     email: z.email(),
 *     age:   z.number().int().min(0),
 *   });
 *
 *   type User = z.infer<typeof UserSchema>;
 *
 * Coercion (e.g. query-string params):
 *   import { z, coerce } from "@/libs/zod";
 *   const schema = z.object({ page: coerce.number().default(1) });
 */
⋮----
// ── Primary namespace (covers ~95 % of usage) ──────────────────────────────
⋮----
// ── Coercion namespace ─────────────────────────────────────────────────────
⋮----
// ── Error helpers ──────────────────────────────────────────────────────────
⋮----
// ── Base class (for `instanceof` checks and custom refinements) ────────────
⋮----
// ── JSON Schema interop ────────────────────────────────────────────────────
⋮----
// ── Types ──────────────────────────────────────────────────────────────────
````

## File: packages/lib-zustand/index.ts
````typescript
/**
 * @module libs/zustand
 * Thin wrapper for Zustand v5 state management.
 *
 * Provides a single import path for creating React stores, vanilla stores,
 * and middleware (persist, devtools, immer).  The React hook (`create`) must
 * only be used inside Client Components; the vanilla `createStore` is safe on
 * the server.
 *
 * Usage — React store (requires "use client"):
 *   import { create } from "@/libs/zustand";
 *
 *   const useCounter = create<{ count: number; inc: () => void }>((set) => ({
 *     count: 0,
 *     inc: () => set((s) => ({ count: s.count + 1 })),
 *   }));
 *
 * Usage — with persist middleware:
 *   import { create, persist, createJSONStorage } from "@/libs/zustand";
 *
 *   const useStore = create(persist((set) => ({ … }), {
 *     name: "my-store",
 *     storage: createJSONStorage(() => sessionStorage),
 *   }));
 *
 * Usage — vanilla store (server-safe):
 *   import { createStore, useStore } from "@/libs/zustand";
 *   const store = createStore<State>()((set) => ({ … }));
 */
⋮----
// ── Core ───────────────────────────────────────────────────────────────────
⋮----
// ── Middleware ─────────────────────────────────────────────────────────────
⋮----
// ── Types ──────────────────────────────────────────────────────────────────
````

## File: packages/shared-constants/index.ts
````typescript

````

## File: packages/shared-events/index.ts
````typescript
/**
 * Shared events — cross-module event infrastructure primitives.
 *
 * Provides:
 *   - EventRecord entity and repository port interfaces (event store)
 *   - PublishDomainEventUseCase (write-side orchestration)
 *   - InMemoryEventStoreRepository (dev / test adapter)
 *   - NoopEventBusRepository (test / scaffold adapter)
 *   - QStashEventBusRepository (production transport)
 *   - SimpleEventBus (in-process pub/sub)
 */
⋮----
import type { DomainEvent } from "@shared-types";
⋮----
// ── EventRecord ───────────────────────────────────────────────────────────────
⋮----
export interface EventMetadata {
  correlationId?: string;
  causationId?: string;
  actorId?: string;
  organizationId?: string;
  workspaceId?: string;
  traceId?: string;
}
⋮----
export interface EventRecordPayload {
  [key: string]: unknown;
}
⋮----
export class EventRecord {
⋮----
constructor(
    public readonly id: string,
    public readonly eventName: string,
    public readonly aggregateType: string,
    public readonly aggregateId: string,
    public readonly occurredAt: Date,
    public readonly payload: EventRecordPayload,
    public readonly metadata: EventMetadata = {},
    public dispatchedAt: Date | null = null,
)
⋮----
markDispatched(dispatchedAt: Date = new Date()): void
⋮----
get isDispatched(): boolean
⋮----
// ── Repository ports ──────────────────────────────────────────────────────────
⋮----
export interface IEventStoreRepository {
  save(event: EventRecord): Promise<void>;
  findById(id: string): Promise<EventRecord | null>;
  findByAggregate(aggregateType: string, aggregateId: string): Promise<EventRecord[]>;
  findUndispatched(limit: number): Promise<EventRecord[]>;
  markDispatched(id: string, dispatchedAt: Date): Promise<void>;
}
⋮----
save(event: EventRecord): Promise<void>;
findById(id: string): Promise<EventRecord | null>;
findByAggregate(aggregateType: string, aggregateId: string): Promise<EventRecord[]>;
findUndispatched(limit: number): Promise<EventRecord[]>;
markDispatched(id: string, dispatchedAt: Date): Promise<void>;
⋮----
export interface IEventBusRepository {
  publish(event: EventRecord): Promise<void>;
}
⋮----
publish(event: EventRecord): Promise<void>;
⋮----
export interface PublishedDomainEvent<TPayload = EventRecordPayload> extends DomainEvent {
  readonly aggregateType: string;
  readonly payload: TPayload;
  readonly metadata: EventMetadata;
}
⋮----
// ── PublishDomainEventUseCase ─────────────────────────────────────────────────
⋮----
export interface PublishDomainEventDTO {
  id: string;
  eventName: string;
  aggregateType: string;
  aggregateId: string;
  payload: EventRecordPayload;
  metadata?: EventMetadata;
  occurredAt?: Date;
}
⋮----
export class PublishDomainEventUseCase {
⋮----
async execute(dto: PublishDomainEventDTO): Promise<EventRecord>
⋮----
// ── InMemoryEventStoreRepository ──────────────────────────────────────────────
⋮----
export class InMemoryEventStoreRepository implements IEventStoreRepository {
⋮----
async save(event: EventRecord): Promise<void>
⋮----
async findById(id: string): Promise<EventRecord | null>
⋮----
async findByAggregate(aggregateType: string, aggregateId: string): Promise<EventRecord[]>
⋮----
async findUndispatched(limit: number): Promise<EventRecord[]>
⋮----
async markDispatched(id: string, dispatchedAt: Date): Promise<void>
⋮----
// ── NoopEventBusRepository ────────────────────────────────────────────────────
⋮----
export class NoopEventBusRepository implements IEventBusRepository {
⋮----
async publish(_event: EventRecord): Promise<void>
⋮----
// Intentional no-op: replace with a real transport adapter when needed.
⋮----
export function getSharedEventBus(): SimpleEventBus
⋮----
export class InProcessEventBusRepository implements IEventBusRepository {
⋮----
constructor(private readonly bus: SimpleEventBus = getSharedEventBus())
⋮----
async publish(event: EventRecord): Promise<void>
⋮----
export class CompositeEventBusRepository implements IEventBusRepository {
⋮----
constructor(private readonly delegates: ReadonlyArray<IEventBusRepository>)
⋮----
// ── QStashEventBusRepository ──────────────────────────────────────────────────
⋮----
export class QStashEventBusRepository implements IEventBusRepository {
⋮----
// ── SimpleEventBus ────────────────────────────────────────────────────────────
⋮----
export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void>;
⋮----
export class SimpleEventBus {
⋮----
subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void
⋮----
async publish<T extends DomainEvent>(event: T): Promise<void>
⋮----
clear(): void
````

## File: packages/shared-hooks/index.ts
````typescript
import { create } from "zustand";
⋮----
interface AppState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}
````

## File: packages/shared-types/index.ts
````typescript
import { z } from "@lib-zod";
⋮----
// ─── Domain Event base interface ─────────────────────────────────────────────
⋮----
/** All domain events must implement this interface. */
export interface DomainEvent {
  /** Unique event identifier */
  readonly eventId: string;
  /** Event type discriminant (e.g. "workspace.created") */
  readonly type: string;
  /** Aggregate root ID that triggered the event */
  readonly aggregateId: string;
  /** ISO 8601 occurrence timestamp */
  readonly occurredAt: string;
}
⋮----
/** Unique event identifier */
⋮----
/** Event type discriminant (e.g. "workspace.created") */
⋮----
/** Aggregate root ID that triggered the event */
⋮----
/** ISO 8601 occurrence timestamp */
⋮----
// ─── Base entity schema ───────────────────────────────────────────────────────
⋮----
/**
 * Shared base fields for all domain entities.
 * Includes tenant isolation (accountId / workspaceId) and audit trail (createdBy).
 */
⋮----
export type BaseEntity = z.infer<typeof BaseEntitySchema>;
export type CreatedBy = z.infer<typeof CreatedBySchema>;
⋮----
/**
 * Query scope for account-level or workspace-level queries.
 * When workspaceId is omitted, the query spans all workspaces for the tenant.
 */
export interface QueryScope {
  accountId: string;
  workspaceId?: string;
}
⋮----
// ─── Primitive types ──────────────────────────────────────────────────────────
⋮----
export type ID = string;
⋮----
export interface PaginationParams {
  page: number;
  limit: number;
}
⋮----
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
⋮----
// ─── Domain Error ─────────────────────────────────────────────────────────────
⋮----
/**
 * Structured domain error returned in CommandFailure.
 * Consumers MUST NOT use raw Error objects for command results.
 */
export interface DomainError {
  readonly code: string;
  readonly message: string;
  readonly context?: Record<string, unknown>;
}
⋮----
// ─── Command Result Contract [R4] ─────────────────────────────────────────────
⋮----
export interface CommandSuccess {
  readonly success: true;
  readonly aggregateId: string;
  readonly version: number;
}
⋮----
export interface CommandFailure {
  readonly success: false;
  readonly error: DomainError;
}
⋮----
/** Union returned by every Command Handler / use-case / _actions.ts export. */
export type CommandResult = CommandSuccess | CommandFailure;
⋮----
export function commandSuccess(aggregateId: string, version: number): CommandSuccess
⋮----
export function commandFailure(error: DomainError): CommandFailure
⋮----
export function commandFailureFrom(
  code: string,
  message: string,
  context?: Record<string, unknown>,
): CommandFailure
⋮----
// ─── Firestore Timestamp shim ─────────────────────────────────────────────────
⋮----
/** Opaque Firestore Timestamp — Domain only carries seconds/nanoseconds, no SDK types. */
export interface Timestamp {
  readonly seconds: number;
  readonly nanoseconds: number;
  toDate(): Date;
}
⋮----
toDate(): Date;
````

## File: packages/shared-utils/index.test.ts
````typescript
import { describe, expect, it } from "vitest";
⋮----
import { cn, formatDate, generateId } from "./index";
````

## File: packages/shared-utils/index.ts
````typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
⋮----
export function cn(...inputs: ClassValue[])
⋮----
export function formatDate(date: Date): string
⋮----
export function generateId(): string
````

## File: packages/shared-validators/index.ts
````typescript
import { z } from "zod";
⋮----
// Note: .default() fills missing fields during .parse(). Use .optional() instead
// if you need strict validation without automatic default injection.
⋮----
export type TaskSchemaType = z.infer<typeof taskSchema>;
⋮----
// ─── Identity schemas ─────────────────────────────────────────────────────────
⋮----
export type SignInInput = z.infer<typeof signInSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
⋮----
// ─── Workspace schemas ────────────────────────────────────────────────────────
⋮----
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
````

## File: packages/ui-shadcn/hooks/use-mobile.ts
````typescript
export function useIsMobile()
⋮----
const onChange = () =>
````

## File: packages/ui-shadcn/hooks/use-toast.ts
````typescript
// Inspired by react-hot-toast library
⋮----
type ToastActionElement = React.ReactElement
type ToastProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
⋮----
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}
⋮----
function genId()
⋮----
type ActionType = typeof actionTypes
⋮----
type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }
⋮----
interface State {
  toasts: ToasterToast[]
}
⋮----
const addToRemoveQueue = (toastId: string) =>
⋮----
export const reducer = (state: State, action: Action): State =>
⋮----
// ! Side effects ! - This could be extracted into a dismissToast() action,
// but I'll keep it here for simplicity
⋮----
function dispatch(action: Action)
⋮----
type Toast = Omit<ToasterToast, "id">
⋮----
function toast(
⋮----
const update = (props: ToasterToast)
const dismiss = () => dispatch(
⋮----
function useToast()
````

## File: packages/ui-shadcn/index.ts
````typescript
/**
 * @package ui-shadcn
 * shadcn/ui component library — public barrel export.
 *
 * All UI primitives are re-exported from this package.
 * Internal components use relative imports; external consumers use @ui-shadcn.
 */
⋮----
// ─── Utility ──────────────────────────────────────────────────────────────────
⋮----
// ─── Hooks ────────────────────────────────────────────────────────────────────
````

## File: packages/ui-shadcn/ui/accordion.tsx
````typescript
import { Accordion as AccordionPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
⋮----
function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>)
⋮----
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>)
⋮----
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>)
⋮----
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>)
````

## File: packages/ui-shadcn/ui/alert-dialog.tsx
````typescript
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
import { Button } from "./button"
⋮----
function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>)
⋮----
function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>)
⋮----
className=
````

## File: packages/ui-shadcn/ui/alert.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/aspect-ratio.tsx
````typescript
import { AspectRatio as AspectRatioPrimitive } from "radix-ui"
````

## File: packages/ui-shadcn/ui/avatar.tsx
````typescript
import { Avatar as AvatarPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/badge.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
⋮----
import { cn } from "../utils"
⋮----
function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
VariantProps<typeof badgeVariants> &
⋮----
className=
````

## File: packages/ui-shadcn/ui/breadcrumb.tsx
````typescript
import { Slot } from "radix-ui"
⋮----
import { cn } from "../utils"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
⋮----
function Breadcrumb(
⋮----
className=
````

## File: packages/ui-shadcn/ui/button.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
⋮----
import { cn } from "../utils"
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
import { cn } from "../utils"
import { Button, buttonVariants } from "./button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/card.tsx
````typescript
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/carousel.tsx
````typescript
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
⋮----
import { cn } from "../utils"
import { Button } from "./button"
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
import { cn } from "../utils"
⋮----
// Format: { THEME_NAME: CSS_SELECTOR }
⋮----
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}
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
import { Checkbox as CheckboxPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
import { CheckIcon } from "lucide-react"
⋮----
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>)
````

## File: packages/ui-shadcn/ui/collapsible.tsx
````typescript
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
⋮----
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>)
⋮----
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>)
````

## File: packages/ui-shadcn/ui/command.tsx
````typescript
import { Command as CommandPrimitive } from "cmdk"
⋮----
import { cn } from "../utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog"
import {
  InputGroup,
  InputGroupAddon,
} from "./input-group"
import { SearchIcon, CheckIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/context-menu.tsx
````typescript
import { ContextMenu as ContextMenuPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
import { ChevronRightIcon, CheckIcon } from "lucide-react"
⋮----
function ContextMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>)
⋮----
function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>)
⋮----
function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>)
⋮----
function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>)
⋮----
className=
⋮----
function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem> & {
  inset?: boolean
})
````

## File: packages/ui-shadcn/ui/dialog.tsx
````typescript
import { Dialog as DialogPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
import { Button } from "./button"
import { XIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/drawer.tsx
````typescript
import { Drawer as DrawerPrimitive } from "vaul"
⋮----
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/dropdown-menu.tsx
````typescript
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
⋮----
function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>)
⋮----
function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>)
⋮----
return (
⋮----
className=
````

## File: packages/ui-shadcn/ui/hover-card.tsx
````typescript
import { HoverCard as HoverCardPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
⋮----
function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>)
````

## File: packages/ui-shadcn/ui/input-group.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "../utils"
import { Button } from "./button"
import { Input } from "./input"
import { Textarea } from "./textarea"
⋮----
className=
⋮----
// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- intentional focus delegation to child input
````

## File: packages/ui-shadcn/ui/input-otp.tsx
````typescript
import { OTPInput, OTPInputContext } from "input-otp"
⋮----
import { cn } from "../utils"
import { MinusIcon } from "lucide-react"
⋮----
containerClassName=
className=
````

## File: packages/ui-shadcn/ui/input.tsx
````typescript
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/kbd.tsx
````typescript
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/label.tsx
````typescript
import { Label as LabelPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
⋮----
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>)
````

## File: packages/ui-shadcn/ui/menubar.tsx
````typescript
import { Menubar as MenubarPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
⋮----
return (
⋮----
className=
````

## File: packages/ui-shadcn/ui/navigation-menu.tsx
````typescript
import { cva } from "class-variance-authority"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
import { ChevronDownIcon } from "lucide-react"
⋮----
className=
⋮----
function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>)
````

## File: packages/ui-shadcn/ui/pagination.tsx
````typescript
import { cn } from "../utils"
import { Button } from "./button"
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
{/* eslint-disable-next-line jsx-a11y/anchor-has-content -- children provided via props spread */}
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
import { Popover as PopoverPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/progress.tsx
````typescript
import { Progress as ProgressPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
````

## File: packages/ui-shadcn/ui/radio-group.tsx
````typescript
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
⋮----
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>)
⋮----
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>)
````

## File: packages/ui-shadcn/ui/scroll-area.tsx
````typescript
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
⋮----
function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>)
⋮----
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>)
````

## File: packages/ui-shadcn/ui/select.tsx
````typescript
import { Select as SelectPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"
⋮----
function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>)
⋮----
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
})
className=
⋮----
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>)
⋮----
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>)
⋮----
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>)
````

## File: packages/ui-shadcn/ui/separator.tsx
````typescript
import { Separator as SeparatorPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
⋮----
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>)
````

## File: packages/ui-shadcn/ui/sheet.tsx
````typescript
import { Dialog as SheetPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
import { Button } from "./button"
import { XIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/sidebar.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
⋮----
import { useIsMobile } from "../hooks/use-mobile"
import { cn } from "../utils"
import { Button } from "./button"
import { Input } from "./input"
import { Separator } from "./separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet"
import { Skeleton } from "./skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./tooltip"
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
// Random width between 50 to 90%.
````

## File: packages/ui-shadcn/ui/skeleton.tsx
````typescript
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/slider.tsx
````typescript
import { Slider as SliderPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
⋮----
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>)
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
import { cn } from "../utils"
import { Loader2Icon } from "lucide-react"
⋮----
<Loader2Icon role="status" aria-label="Loading" className=
````

## File: packages/ui-shadcn/ui/switch.tsx
````typescript
import { Switch as SwitchPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
⋮----
function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
})
⋮----
className=
````

## File: packages/ui-shadcn/ui/table.tsx
````typescript
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/tabs.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
⋮----
function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>)
⋮----
className=
````

## File: packages/ui-shadcn/ui/textarea.tsx
````typescript
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/toggle-group.tsx
````typescript
import { type VariantProps } from "class-variance-authority"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
import { toggleVariants } from "./toggle"
⋮----
function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  orientation = "horizontal",
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
})
⋮----
className=
````

## File: packages/ui-shadcn/ui/toggle.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
````

## File: packages/ui-shadcn/ui/tooltip.tsx
````typescript
import { Tooltip as TooltipPrimitive } from "radix-ui"
⋮----
import { cn } from "../utils"
⋮----
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>)
````

## File: packages/ui-shadcn/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
⋮----
export function cn(...inputs: ClassValue[])
````

## File: packages/ui-vis/index.ts
````typescript
/**
 * @package ui-vis
 * React components for vis.js visualization.
 */
````

## File: packages/ui-vis/network.tsx
````typescript
/**
 * @module ui/vis/network
 * React wrapper for vis-network.
 *
 * Provides a drop-in React component for interactive network visualization.
 * Simplifies ref management and event handling for Next.js environments.
 */
⋮----
import { useRef, useEffect, type FC } from "react";
import Graph from "react-graph-vis";
import type { Network, Options } from "vis-network";
⋮----
export interface VisNetworkProps {
  /**
   * Nodes data array
   */
  nodes?: Array<{ id: string | number; label?: string; [key: string]: unknown }>;

  /**
   * Edges data array
   */
  edges?: Array<{ from: string | number; to: string | number; [key: string]: unknown }>;

  /**
   * vis-network options
   */
  options?: Options;

  /**
   * Fired when a node is clicked
   */
  onSelectNode?: (nodeId: string | number) => void;

  /**
   * Fired when a node is double-clicked
   */
  onDoubleClickNode?: (nodeId: string | number) => void;

  /**
   * Fired when physics simulation finishes
   */
  onPhysicsStabilized?: () => void;

  /**
   * Container CSS class
   */
  className?: string;

  /**
   * Container CSS styles
   */
  style?: React.CSSProperties;
}
⋮----
/**
   * Nodes data array
   */
⋮----
/**
   * Edges data array
   */
⋮----
/**
   * vis-network options
   */
⋮----
/**
   * Fired when a node is clicked
   */
⋮----
/**
   * Fired when a node is double-clicked
   */
⋮----
/**
   * Fired when physics simulation finishes
   */
⋮----
/**
   * Container CSS class
   */
⋮----
/**
   * Container CSS styles
   */
⋮----
/**
 * VisNetwork component - interactive network graph with React integration.
 *
 * @example
 * ```tsx
 * <VisNetwork
 *   nodes={[{ id: 1, label: "Node 1" }]}
 *   edges={[{ from: 1, to: 2 }]}
 *   options={{ physics: { enabled: true } }}
 *   onSelectNode={(id) => console.log("Selected:", id)}
 * />
 * ```
 */
⋮----
const handleSelectNode = (event:
⋮----
const handleDoubleClickNode = (event:
⋮----
const handlePhysicsStabilized = () =>
````

## File: packages/ui-vis/react-graph-vis.d.ts
````typescript
import type { ComponentType } from "react";
import type { Data, Network, Options } from "vis-network";
⋮----
interface GraphEvents {
    [eventName: string]: (...args: unknown[]) => void;
  }
⋮----
export interface GraphProps {
    graph: Pick<Data, "nodes" | "edges">;
    options?: Options;
    events?: GraphEvents;
    getNetwork?: (network: Network) => void;
    getEdges?: (edges: unknown) => void;
    getNodes?: (nodes: unknown) => void;
    style?: React.CSSProperties;
    className?: string;
  }
````

## File: packages/ui-vis/timeline.tsx
````typescript
/**
 * @module ui/vis/timeline
 * React wrapper for vis-timeline.
 *
 * Provides a drop-in React component for interactive timeline visualization.
 */
⋮----
import { useRef, useEffect, type FC } from "react";
import { Timeline, DataSet } from "@lib-vis";
⋮----
export interface VisTimelineProps {
  /**
   * Timeline items (events)
   */
  items?: Array<{
    id: string | number;
    content: string;
    start: string | Date;
    end?: string | Date;
    [key: string]: unknown;
  }>;

  /**
   * Timeline groups (categories)
   */
  groups?: Array<{
    id: string | number;
    content: string;
    [key: string]: unknown;
  }>;

  /**
   * Timeline options
   */
  options?: Record<string, unknown>;

  /**
   * Fired when selection changes
   */
  onSelect?: (selection: (string | number)[]) => void;

  /**
   * Container CSS class
   */
  className?: string;

  /**
   * Container CSS styles
   */
  style?: React.CSSProperties;
}
⋮----
/**
   * Timeline items (events)
   */
⋮----
/**
   * Timeline groups (categories)
   */
⋮----
/**
   * Timeline options
   */
⋮----
/**
   * Fired when selection changes
   */
⋮----
/**
   * Container CSS class
   */
⋮----
/**
   * Container CSS styles
   */
⋮----
/**
 * VisTimeline component - interactive timeline with React integration.
 *
 * @example
 * ```tsx
 * <VisTimeline
 *   items={[{ id: 1, content: "Event 1", start: new Date() }]}
 *   options={{ height: "100%" }}
 *   onSelect={(ids) => console.log("Selected:", ids)}
 * />
 * ```
 */
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
⋮----
const handleSelect = (event:
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
````