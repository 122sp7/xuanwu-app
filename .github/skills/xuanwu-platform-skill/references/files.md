# Files

## File: src/modules/platform/adapters/inbound/react/shell/index.ts
````typescript
/**
 * Shell UI components barrel — platform inbound React adapter.
 *
 * Shell chrome: app-rail, sidebar, header, and contextual nav.
 * Consumed internally by ShellFrame (parent directory).
 */
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellGuard.tsx
````typescript
/**
 * ShellGuard — platform inbound adapter (React).
 *
 * Auth guard for the authenticated shell layout.
 * Renders nothing (redirects) while auth is initialising or when the user is
 * unauthenticated; renders children only for authenticated sessions.
 *
 * Redirect behaviour:
 *  - initializing → show full-screen spinner (do not redirect — avoids flash
 *    for returning users whose Firebase token is resolving)
 *  - unauthenticated | anonymous without explicit access → redirect to "/"
 *  - authenticated → render children
 *
 * Anonymous sessions (Continue as Guest) are currently treated as
 * authenticated at the shell level; individual routes may restrict further.
 */
⋮----
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
⋮----
import { useAuth } from "../../../../../iam/adapters/inbound/react/AuthContext";
⋮----
interface ShellGuardProps {
  children: ReactNode;
}
⋮----
export function ShellGuard(
⋮----
// Redirect is in-flight — render spinner to prevent content flash.
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellSidebarHeader.tsx
````typescript
/**
 * ShellSidebarHeader — app/(shell)/_shell composition layer.
 * Moved from modules/platform alongside sibling shell files.
 * Pure UI component with no downstream imports.
 */
⋮----
import { PanelLeftClose, SlidersHorizontal } from "lucide-react";
⋮----
interface ShellSidebarHeaderProps {
  sectionLabel: string;
  sectionIcon: React.ReactNode;
  onOpenCustomize: () => void;
  onToggleCollapsed: () => void;
}
⋮----
export function ShellSidebarHeader({
  sectionLabel,
  sectionIcon,
  onOpenCustomize,
  onToggleCollapsed,
}: ShellSidebarHeaderProps)
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellThemeToggle.tsx
````typescript
/**
 * ShellThemeToggle — platform inbound adapter (React).
 *
 * Toggles between light, dark, and system themes in the shell header.
 * Relies on ThemeProvider (next-themes) being mounted at the layout root.
 *
 * Rendered by ShellHeaderControls in the top-right header area.
 */
⋮----
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
⋮----
export function ShellThemeToggle(): React.ReactElement
⋮----
function toggle()
````

## File: src/modules/platform/adapters/inbound/react/useAccountRouteContext.ts
````typescript
/**
 * useAccountRouteContext — platform inbound adapter (React).
 *
 * Derives route-level account context by combining:
 *  - URL params (`accountId` segment from Next.js routing)
 *  - Auth state (current authenticated user)
 *  - App state (loaded organisation accounts + activeAccount)
 *
 * Consumed by AccountRouteDispatcher (workspace) and any route component that
 * needs to know whether the active route is a personal or organisation scope.
 *
 * Design invariants:
 *  - routeAccountId  : raw value from the URL, never derived
 *  - resolvedAccountId: equals routeAccountId; exists for explicit intent
 *  - accountType     : null while accounts are still loading (hydration guard)
 *  - No mutations — read-only derived state
 */
⋮----
import { useParams } from "next/navigation";
import { useApp, type ActiveAccount } from "./AppContext";
import { useAuth } from "../../../../iam/adapters/inbound/react/AuthContext";
⋮----
// ── Public contract ───────────────────────────────────────────────────────────
⋮----
export interface AccountRouteContextValue {
  /** Raw accountId segment from the URL (e.g. `/[accountId]/...`). */
  readonly routeAccountId: string;
  /**
   * Resolved account ID — currently mirrors routeAccountId.
   * Reserved for future alias / slug resolution without breaking callers.
   */
  readonly resolvedAccountId: string;
  /** UID of the currently authenticated user; null when unauthenticated. */
  readonly currentUserId: string | null;
  /**
   * Whether the route account is an organisation or personal account.
   * null while the account list has not yet been hydrated from Firestore.
   */
  readonly accountType: "organization" | "user" | null;
  /** True once the organisation account list has been loaded from Firestore. */
  readonly accountsHydrated: boolean;
  /** Currently active account (personal AuthUser or AccountEntity). */
  readonly activeAccount: ActiveAccount | null;
}
⋮----
/** Raw accountId segment from the URL (e.g. `/[accountId]/...`). */
⋮----
/**
   * Resolved account ID — currently mirrors routeAccountId.
   * Reserved for future alias / slug resolution without breaking callers.
   */
⋮----
/** UID of the currently authenticated user; null when unauthenticated. */
⋮----
/**
   * Whether the route account is an organisation or personal account.
   * null while the account list has not yet been hydrated from Firestore.
   */
⋮----
/** True once the organisation account list has been loaded from Firestore. */
⋮----
/** Currently active account (personal AuthUser or AccountEntity). */
⋮----
// ── Hook ──────────────────────────────────────────────────────────────────────
⋮----
export function useAccountRouteContext(): AccountRouteContextValue
⋮----
// Determine account type from available state.
// We only commit to a type once data is available to avoid transient
// misrouting while accounts are still loading.
⋮----
// The URL account is a known organisation — use the stored accountType
// (could be "user" personal account stored in Firestore or "organization").
⋮----
// The URL account is the authenticated user's personal (Firebase Auth) account.
⋮----
// else: either accounts not yet hydrated or an unknown ID — stay null
````

## File: src/modules/platform/shared/index.ts
````typescript

````

## File: src/modules/platform/subdomains/background-job/adapters/index.ts
````typescript
// background-job — adapters aggregate
````

## File: src/modules/platform/subdomains/background-job/adapters/outbound/firestore-like/InMemoryBackgroundJobRepository.ts
````typescript
import type { BackgroundJob, BackgroundJobStatus } from "../../../domain/entities/BackgroundJob";
import type { BackgroundJobRepository } from "../../../domain/repositories/BackgroundJobRepository";
⋮----
export class InMemoryBackgroundJobRepository implements BackgroundJobRepository {
⋮----
async findByDocumentId(documentId: string): Promise<BackgroundJob | null>
⋮----
async listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
}): Promise<readonly BackgroundJob[]>
⋮----
async save(job: BackgroundJob): Promise<void>
⋮----
async updateStatus(input: {
    readonly documentId: string;
    readonly status: BackgroundJobStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
}): Promise<BackgroundJob | null>
````

## File: src/modules/platform/subdomains/background-job/domain/entities/BackgroundJob.ts
````typescript
import type { JobDocument } from "./JobDocument";
⋮----
export type BackgroundJobStatus =
  | "uploaded"
  | "parsing"
  | "chunking"
  | "embedding"
  | "indexed"
  | "stale"
  | "re-indexing"
  | "failed";
⋮----
export function canTransitionJobStatus(from: BackgroundJobStatus, to: BackgroundJobStatus): boolean
⋮----
export interface BackgroundJob {
  readonly id: string;
  readonly document: JobDocument;
  readonly status: BackgroundJobStatus;
  readonly statusMessage?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
````

## File: src/modules/platform/subdomains/background-job/domain/entities/JobChunk.ts
````typescript
export interface JobChunkMetadata {
  readonly sourceDocId: string;
  readonly section?: string;
  readonly pageNumber?: number;
}
⋮----
export interface JobChunk {
  readonly id: string;
  readonly documentId: string;
  readonly chunkIndex: number;
  readonly content: string;
  readonly metadata: JobChunkMetadata;
}
````

## File: src/modules/platform/subdomains/background-job/domain/entities/JobDocument.ts
````typescript
export interface JobDocument {
  readonly id: string;
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly title: string;
  readonly mimeType: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
````

## File: src/modules/platform/subdomains/background-job/domain/events/BackgroundJobDomainEvent.ts
````typescript
import type { BackgroundJobStatus } from "../entities/BackgroundJob";
⋮----
export interface BackgroundJobDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface BackgroundJobRegisteredEvent extends BackgroundJobDomainEvent {
  readonly type: "platform.background-job.job_registered";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly title: string;
    readonly mimeType: string;
  };
}
⋮----
export interface BackgroundJobAdvancedEvent extends BackgroundJobDomainEvent {
  readonly type: "platform.background-job.job_advanced";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly previousStatus: BackgroundJobStatus;
    readonly nextStatus: BackgroundJobStatus;
  };
}
⋮----
export interface BackgroundJobFailedEvent extends BackgroundJobDomainEvent {
  readonly type: "platform.background-job.job_failed";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly reason: string;
  };
}
⋮----
export type BackgroundJobDomainEventType =
  | BackgroundJobRegisteredEvent
  | BackgroundJobAdvancedEvent
  | BackgroundJobFailedEvent;
````

## File: src/modules/platform/subdomains/background-job/domain/repositories/BackgroundJobRepository.ts
````typescript
import type { BackgroundJob, BackgroundJobStatus } from "../entities/BackgroundJob";
⋮----
export interface BackgroundJobRepository {
  findByDocumentId(documentId: string): Promise<BackgroundJob | null>;
  listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly BackgroundJob[]>;
  save(job: BackgroundJob): Promise<void>;
  updateStatus(input: {
    readonly documentId: string;
    readonly status: BackgroundJobStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<BackgroundJob | null>;
}
⋮----
findByDocumentId(documentId: string): Promise<BackgroundJob | null>;
listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly BackgroundJob[]>;
save(job: BackgroundJob): Promise<void>;
updateStatus(input: {
    readonly documentId: string;
    readonly status: BackgroundJobStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<BackgroundJob | null>;
````

## File: src/modules/platform/subdomains/cache/adapters/index.ts
````typescript
// cache — adapters aggregate
````

## File: src/modules/platform/subdomains/cache/adapters/outbound/memory/InMemoryCacheRepository.ts
````typescript
import type { CacheEntry } from "../../../domain/entities/CacheEntry";
import type { CacheRepository } from "../../../domain/repositories/CacheRepository";
⋮----
export class InMemoryCacheRepository implements CacheRepository {
⋮----
async get(key: string): Promise<CacheEntry | null>
⋮----
async set(entry: CacheEntry): Promise<void>
⋮----
async delete(key: string): Promise<void>
````

## File: src/modules/platform/subdomains/cache/application/use-cases/CacheUseCases.ts
````typescript
import type { CacheEntry } from "../../domain/entities/CacheEntry";
import type { CacheRepository } from "../../domain/repositories/CacheRepository";
⋮----
export interface WriteCacheEntryInput {
  readonly key: string;
  readonly value: unknown;
  readonly ttlSeconds?: number;
}
⋮----
export interface ReadCacheEntryInput {
  readonly key: string;
}
⋮----
export interface RemoveCacheEntryInput {
  readonly key: string;
}
⋮----
export class WriteCacheEntryUseCase {
⋮----
constructor(private readonly repository: CacheRepository)
⋮----
async execute(input: WriteCacheEntryInput): Promise<void>
⋮----
export class ReadCacheEntryUseCase {
⋮----
async execute(input: ReadCacheEntryInput): Promise<CacheEntry | null>
⋮----
export class RemoveCacheEntryUseCase {
⋮----
async execute(input: RemoveCacheEntryInput): Promise<void>
````

## File: src/modules/platform/subdomains/cache/domain/entities/CacheEntry.ts
````typescript
export interface CacheEntry {
  readonly key: string;
  readonly value: unknown;
  readonly expiresAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
````

## File: src/modules/platform/subdomains/cache/domain/repositories/CacheRepository.ts
````typescript
import type { CacheEntry } from "../entities/CacheEntry";
⋮----
export interface CacheRepository {
  get(key: string): Promise<CacheEntry | null>;
  set(entry: CacheEntry): Promise<void>;
  delete(key: string): Promise<void>;
}
⋮----
get(key: string): Promise<CacheEntry | null>;
set(entry: CacheEntry): Promise<void>;
delete(key: string): Promise<void>;
````

## File: src/modules/platform/subdomains/file-storage/adapters/index.ts
````typescript
// file-storage — adapters aggregate
````

## File: src/modules/platform/subdomains/file-storage/adapters/outbound/memory/InMemoryFileStorageRepository.ts
````typescript
import type { StoredFile } from "../../../domain/entities/StoredFile";
import type { FileStorageRepository } from "../../../domain/repositories/FileStorageRepository";
⋮----
export class InMemoryFileStorageRepository implements FileStorageRepository {
⋮----
async save(file: StoredFile): Promise<void>
⋮----
async findById(fileId: string): Promise<StoredFile | null>
⋮----
async listByOwner(ownerId: string): Promise<StoredFile[]>
⋮----
async delete(fileId: string): Promise<void>
````

## File: src/modules/platform/subdomains/file-storage/domain/entities/StoredFile.ts
````typescript
export interface StoredFile {
  readonly fileId: string;
  readonly ownerId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly url: string;
  readonly createdAtISO: string;
  readonly deletedAtISO: string | null;
}
````

## File: src/modules/platform/subdomains/file-storage/domain/repositories/FileStorageRepository.ts
````typescript
import type { StoredFile } from "../entities/StoredFile";
⋮----
export interface FileStorageRepository {
  save(file: StoredFile): Promise<void>;
  findById(fileId: string): Promise<StoredFile | null>;
  listByOwner(ownerId: string): Promise<StoredFile[]>;
  delete(fileId: string): Promise<void>;
}
⋮----
save(file: StoredFile): Promise<void>;
findById(fileId: string): Promise<StoredFile | null>;
listByOwner(ownerId: string): Promise<StoredFile[]>;
delete(fileId: string): Promise<void>;
````

## File: src/modules/platform/subdomains/notification/adapters/index.ts
````typescript
// notification — adapters aggregate
````

## File: src/modules/platform/subdomains/notification/adapters/outbound/memory/InMemoryWorkspaceNotificationPreferenceRepository.ts
````typescript
import type { WorkspaceNotificationPreference } from "../../../domain/entities/WorkspaceNotificationPreference";
import type { WorkspaceNotificationPreferenceRepository } from "../../../domain/repositories/WorkspaceNotificationPreferenceRepository";
⋮----
export class InMemoryWorkspaceNotificationPreferenceRepository implements WorkspaceNotificationPreferenceRepository {
⋮----
async findByMember(workspaceId: string, memberId: string): Promise<WorkspaceNotificationPreference | undefined>
⋮----
async save(preference: WorkspaceNotificationPreference): Promise<void>
⋮----
async findSubscribersByEventType(workspaceId: string, eventType: string): Promise<string[]>
⋮----
private key(workspaceId: string, memberId: string): string
````

## File: src/modules/platform/subdomains/notification/application/dto/notification.dto.ts
````typescript

````

## File: src/modules/platform/subdomains/notification/application/queries/notification.queries.ts
````typescript
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import type { NotificationEntity } from "../../domain/entities/Notification";
⋮----
export class GetNotificationsForRecipientUseCase {
⋮----
constructor(private readonly repo: NotificationRepository)
⋮----
async execute(recipientId: string, limit?: number): Promise<NotificationEntity[]>
⋮----
export class GetUnreadCountUseCase {
⋮----
async execute(recipientId: string): Promise<number>
````

## File: src/modules/platform/subdomains/notification/application/queries/workspace-notification-preferences.queries.ts
````typescript
import type { WorkspaceNotificationPreferenceRepository } from "../../domain/repositories/WorkspaceNotificationPreferenceRepository";
import type { WorkspaceNotificationEventType } from "../../domain/value-objects/WorkspaceNotificationEventType";
import { WORKSPACE_NOTIFICATION_EVENT_TYPES } from "../../domain/value-objects/WorkspaceNotificationEventType";
⋮----
export interface WorkspaceNotificationPreferenceDto {
  readonly workspaceId: string;
  readonly memberId: string;
  readonly subscribedEvents: WorkspaceNotificationEventType[];
  readonly updatedAtISO: string;
}
⋮----
export class GetWorkspaceNotificationPreferencesQuery {
⋮----
constructor(private readonly repo: WorkspaceNotificationPreferenceRepository)
⋮----
async execute(workspaceId: string, memberId: string): Promise<WorkspaceNotificationPreferenceDto>
````

## File: src/modules/platform/subdomains/notification/domain/entities/Notification.ts
````typescript
export type NotificationType = "info" | "alert" | "success" | "warning";
⋮----
export interface NotificationEntity {
  readonly id: string;
  readonly recipientId: string;
  readonly title: string;
  readonly message: string;
  readonly type: NotificationType;
  readonly read: boolean;
  readonly timestamp: number;
  readonly sourceEventType?: string;
  readonly metadata?: Record<string, unknown>;
}
⋮----
export interface DispatchNotificationInput {
  readonly recipientId: string;
  readonly title: string;
  readonly message: string;
  readonly type: NotificationType;
  readonly sourceEventType?: string;
  readonly metadata?: Record<string, unknown>;
}
````

## File: src/modules/platform/subdomains/notification/domain/entities/WorkspaceNotificationPreference.ts
````typescript
import type { WorkspaceNotificationEventType } from "../value-objects/WorkspaceNotificationEventType";
import { WORKSPACE_NOTIFICATION_EVENT_TYPES } from "../value-objects/WorkspaceNotificationEventType";
⋮----
export interface WorkspaceNotificationPreferenceProps {
  readonly workspaceId: string;
  readonly memberId: string;
  readonly subscribedEvents: ReadonlySet<WorkspaceNotificationEventType>;
  readonly updatedAtISO: string;
}
⋮----
export class WorkspaceNotificationPreference {
⋮----
private constructor(private readonly _props: WorkspaceNotificationPreferenceProps)
⋮----
static create(workspaceId: string, memberId: string): WorkspaceNotificationPreference
⋮----
static reconstitute(props: WorkspaceNotificationPreferenceProps): WorkspaceNotificationPreference
⋮----
withSubscriptions(events: ReadonlySet<WorkspaceNotificationEventType>): WorkspaceNotificationPreference
⋮----
isSubscribedTo(eventType: WorkspaceNotificationEventType): boolean
⋮----
get workspaceId(): string
⋮----
get memberId(): string
⋮----
get subscribedEvents(): ReadonlySet<WorkspaceNotificationEventType>
⋮----
get updatedAtISO(): string
⋮----
getSnapshot(): Readonly<WorkspaceNotificationPreferenceProps>
````

## File: src/modules/platform/subdomains/notification/domain/events/NotificationDomainEvent.ts
````typescript
import type { NotificationType } from "../entities/Notification";
⋮----
export interface NotificationDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface NotificationDispatchedEvent extends NotificationDomainEvent {
  readonly type: "platform.notification.dispatched";
  readonly payload: {
    readonly notificationId: string;
    readonly recipientId: string;
    readonly notificationType: NotificationType;
  };
}
⋮----
export interface NotificationReadEvent extends NotificationDomainEvent {
  readonly type: "platform.notification.read";
  readonly payload: {
    readonly notificationId: string;
    readonly recipientId: string;
  };
}
⋮----
export interface AllNotificationsReadEvent extends NotificationDomainEvent {
  readonly type: "platform.notification.all_read";
  readonly payload: {
    readonly recipientId: string;
  };
}
⋮----
export type NotificationDomainEventType =
  | NotificationDispatchedEvent
  | NotificationReadEvent
  | AllNotificationsReadEvent;
````

## File: src/modules/platform/subdomains/notification/domain/repositories/NotificationRepository.ts
````typescript
import type { DispatchNotificationInput, NotificationEntity } from "../entities/Notification";
⋮----
export interface NotificationRepository {
  dispatch(input: DispatchNotificationInput): Promise<NotificationEntity>;
  markAsRead(notificationId: string, recipientId: string): Promise<void>;
  markAllAsRead(recipientId: string): Promise<void>;
  findByRecipient(recipientId: string, limit?: number): Promise<NotificationEntity[]>;
  getUnreadCount(recipientId: string): Promise<number>;
}
⋮----
dispatch(input: DispatchNotificationInput): Promise<NotificationEntity>;
markAsRead(notificationId: string, recipientId: string): Promise<void>;
markAllAsRead(recipientId: string): Promise<void>;
findByRecipient(recipientId: string, limit?: number): Promise<NotificationEntity[]>;
getUnreadCount(recipientId: string): Promise<number>;
````

## File: src/modules/platform/subdomains/notification/domain/repositories/WorkspaceNotificationPreferenceRepository.ts
````typescript
import type { WorkspaceNotificationPreference } from "../entities/WorkspaceNotificationPreference";
⋮----
export interface WorkspaceNotificationPreferenceRepository {
  findByMember(workspaceId: string, memberId: string): Promise<WorkspaceNotificationPreference | undefined>;
  save(preference: WorkspaceNotificationPreference): Promise<void>;
  findSubscribersByEventType(workspaceId: string, eventType: string): Promise<string[]>;
}
⋮----
findByMember(workspaceId: string, memberId: string): Promise<WorkspaceNotificationPreference | undefined>;
save(preference: WorkspaceNotificationPreference): Promise<void>;
findSubscribersByEventType(workspaceId: string, eventType: string): Promise<string[]>;
````

## File: src/modules/platform/subdomains/platform-config/adapters/index.ts
````typescript
// platform-config — adapters aggregate
````

## File: src/modules/platform/subdomains/search/adapters/index.ts
````typescript
// search — adapters aggregate
````

## File: src/modules/platform/subdomains/search/application/services/shell-command-catalog.ts
````typescript
export interface ShellCommandCatalogItem {
  readonly href: string;
  readonly label: string;
  readonly group: "導覽" | "Knowledge" | "Source";
}
⋮----
export function listShellCommandCatalogItems(): readonly ShellCommandCatalogItem[]
````

## File: src/modules/platform/adapters/inbound/react/AppContext.tsx
````typescript
/**
 * AppContext — platform inbound adapter (React).
 *
 * Defines app-level account state, context, and subscription helpers.
 * Firebase-backed implementations are consumed via the iam module's
 * outbound composition to preserve boundary direction.
 */
⋮----
import { createContext, useContext, type Dispatch } from "react";
import {
  subscribeToAccountsForUser as iamSubscribeToAccountsForUser,
} from "../../../../iam/adapters/outbound/firebase-composition";
import type { AccountSnapshot } from "../../../../iam/subdomains/account/domain/entities/Account";
import type { AccountProfile } from "../../../../iam/subdomains/account/domain/entities/AccountProfile";
⋮----
import type { AuthUser } from "../../../../iam/adapters/inbound/react/AuthContext";
⋮----
// ── Account types ─────────────────────────────────────────────────────────────
⋮----
export type AccountType = "user" | "organization";
⋮----
export interface AccountEntity {
  readonly id: string;
  readonly name: string;
  readonly accountType: AccountType;
  readonly email?: string;
  readonly photoURL?: string;
}
⋮----
export type ActiveAccount = AccountEntity | AuthUser;
⋮----
export type BootstrapPhase = "idle" | "seeded" | "hydrated";
⋮----
// ── AccountProfile (read-model) ───────────────────────────────────────────────
⋮----
// ── App state & actions ───────────────────────────────────────────────────────
⋮----
export interface AppState {
  readonly accounts: Record<string, AccountEntity>;
  readonly accountsHydrated: boolean;
  readonly activeAccount: ActiveAccount | null;
  readonly bootstrapPhase: BootstrapPhase;
}
⋮----
export type AppAction =
  | { type: "SEED_ACTIVE_ACCOUNT"; payload: { user: AuthUser } }
  | {
      type: "SET_ACCOUNTS";
      payload: {
        accounts: Record<string, AccountEntity>;
        user: AuthUser;
        preferredActiveAccountId: string | null;
      };
    }
  | { type: "SET_ACTIVE_ACCOUNT"; payload: ActiveAccount | null }
  | { type: "RESET_STATE" };
⋮----
export interface AppContextValue {
  readonly state: AppState;
  readonly dispatch: Dispatch<AppAction>;
}
⋮----
export function useApp(): AppContextValue
⋮----
// ── Account helpers ───────────────────────────────────────────────────────────
⋮----
export function isOrganizationActor(
  account: ActiveAccount | null | undefined,
): boolean
⋮----
export function isActiveOrganizationAccount(
  account: ActiveAccount | null | undefined,
): boolean
⋮----
export function resolveOrganizationRouteFallback(
  _pathname: string,
  _account: ActiveAccount | null | undefined,
): string | null
⋮----
export function resolveActiveAccount(opts: {
  currentActiveAccount: ActiveAccount | null;
  accounts: Record<string, AccountEntity>;
  personalAccount: AuthUser;
  preferredActiveAccountId: string | null;
  bootstrapPhase: BootstrapPhase;
}): ActiveAccount
⋮----
// ── Subscriptions ─────────────────────────────────────────────────────────────
⋮----
/**
 * Subscribes to real-time organisation account updates for the given userId.
 * Maps iam AccountSnapshot → platform AccountEntity (view model).
 */
export function subscribeToAccountsForUser(
  userId: string,
  onUpdate: (accounts: Record<string, AccountEntity>) => void,
): () => void
⋮----
/**
 * Stub — profile subscriptions are available via the iam AccountQueryRepository
 * when a profile panel requires them. Wire from firebase-composition if needed.
 */
export function subscribeToProfile(
  _actorId: string,
  _onUpdate: (profile: AccountProfile | null) => void,
): () => void
````

## File: src/modules/platform/adapters/inbound/react/index.ts
````typescript
/**
 * platform inbound React adapter — barrel.
 *
 * Public surface for all platform React inbound adapters.
 * Consumed by src/app/ route shims.
 */
````

## File: src/modules/platform/adapters/inbound/react/PlatformBootstrap.tsx
````typescript
/**
 * PlatformBootstrap — platform inbound adapter (React).
 *
 * Self-contained provider tree for the src/ migration layer.
 * Assembles: IamSessionProvider → AccountScopeProvider → WorkspaceScopeProvider + Toaster.
 *
 * src/app/layout.tsx mounts this as the single composition root.
 * After this point, the rest of the tree can use:
 *   - useIamSession()     (iam)
 *   - useAccountScope()   (platform)
 *   - useWorkspaceScope() (workspace)
 */
⋮----
import type { ReactNode } from "react";
import { Toaster } from "@/packages/ui-shadcn/ui/sonner";
⋮----
import { IamSessionProvider } from "@/src/modules/iam/adapters/inbound/react";
import { AccountScopeProvider } from "./AccountScopeProvider";
import { WorkspaceScopeProvider } from "@/src/modules/workspace/adapters/inbound/react";
⋮----
export function PlatformBootstrap(
````

## File: src/modules/platform/adapters/inbound/react/shell/CreateOrganizationDialog.tsx
````typescript
/**
 * CreateOrganizationDialog — platform inbound adapter (React).
 *
 * Dialog for creating a new organisation.
 * Uses CreateOrganizationUseCase via the iam Firebase composition root.
 *
 * On success, the new organisation document is written to Firestore with the
 * creator listed in `ownerId` and `memberIds`.  The existing
 * `subscribeToAccountsForUser` query picks it up automatically, so the
 * AccountSwitcher refreshes without an explicit refetch.
 */
⋮----
import { useState, useMemo } from "react";
import { Building2, Loader2 } from "lucide-react";
⋮----
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@ui-shadcn/ui/dialog";
⋮----
import { createClientOrganizationUseCases } from "../../../../../iam/adapters/outbound/firebase-composition";
import type { AuthUser } from "../../../../../iam/adapters/inbound/react/AuthContext";
import type { AccountEntity } from "../AppContext";
⋮----
// ── Types ─────────────────────────────────────────────────────────────────────
⋮----
interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthUser | null;
  onOrganizationCreated?: (account: AccountEntity) => void;
  onNavigate?: (href: string) => void;
}
⋮----
// ── Component ─────────────────────────────────────────────────────────────────
⋮----
export function CreateOrganizationDialog({
  open,
  onOpenChange,
  user,
  onOrganizationCreated,
  onNavigate,
}: CreateOrganizationDialogProps): React.ReactElement | null
⋮----
async function handleSubmit(e: React.FormEvent)
````

## File: src/modules/platform/adapters/inbound/react/shell/shell-quick-create.ts
````typescript
/**
 * shell-quick-create — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it imports notion's createKnowledgePage.
 * Kept as a composition adapter at the app boundary.
 */
⋮----
import { createKnowledgePage } from "../../../../../notion/adapters/outbound/notion-page-stub";
⋮----
export interface QuickCreatePageInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
}
⋮----
export interface QuickCreatePageResult {
  readonly success: boolean;
  readonly error?: { message: string };
}
⋮----
export async function quickCreateKnowledgePage(
  input: QuickCreatePageInput,
): Promise<QuickCreatePageResult>
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellContextNavSection.tsx
````typescript
/**
 * ShellContextNavSection — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it imports from workspace module.
 */
⋮----
import Link from "next/link";
import { appendWorkspaceContextQuery } from "../../../../../workspace/adapters/inbound/react/workspace-ui-stubs";
import { buildShellContextualHref } from "../../../../index";
⋮----
interface ContextScopedNavItem {
  href: string;
  label: string;
}
⋮----
interface ShellContextNavSectionProps {
  title: string;
  items: readonly ContextScopedNavItem[];
  isActiveRoute: (href: string) => boolean;
  activeAccountId: string | null;
  activeWorkspaceId: string | null;
}
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellLanguageSwitcher.tsx
````typescript
/**
 * ShellLanguageSwitcher — platform inbound adapter (React).
 *
 * Lets users explicitly override the display language.
 *
 * Firebase Hosting i18n rewrites honour the `firebase-language-override`
 * cookie to select the content locale. Setting this cookie and reloading
 * the page asks Firebase Hosting to serve the matching localized files
 * (configured under hosting.i18n in firebase.json).
 *
 * Supported locales are defined in SUPPORTED_LOCALES below.
 * Add entries here when new locale directories are added to /localized-files.
 *
 * Rendered by ShellHeaderControls in the top-right header area.
 */
⋮----
import { Languages } from "lucide-react";
import { useState } from "react";
⋮----
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
⋮----
// ── Locale catalogue ──────────────────────────────────────────────────────────
⋮----
type LocaleCode = (typeof SUPPORTED_LOCALES)[number]["code"];
⋮----
// ── Helpers ───────────────────────────────────────────────────────────────────
⋮----
function getStoredLocale(): LocaleCode | null
⋮----
// Check cookie first (Firebase Hosting override), then localStorage fallback.
⋮----
function applyLocale(code: LocaleCode): void
⋮----
// Set the Firebase Hosting language override cookie (1 year, root path).
⋮----
// Also persist in localStorage as a UI fallback.
⋮----
// Reload so Firebase Hosting can serve the correct locale variant.
⋮----
// ── Component ─────────────────────────────────────────────────────────────────
⋮----
// Lazy initializer: reads from storage on first client render only.
// typeof window guard ensures SSR safety.
⋮----
function handleSelect(code: LocaleCode): void
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellRootLayout.tsx
````typescript
/**
 * ShellRootLayout — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it composes downstream modules.
 *
 * Uses useApp() from platform (accounts/auth) and useWorkspaceContext()
 * from workspace (workspaces/activeWorkspaceId).
 */
⋮----
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PanelLeftOpen, Search } from "lucide-react";
⋮----
import { useAuth } from "../../../../../iam/adapters/inbound/react/AuthContext";
import {
  type AccountProfile,
  isOrganizationActor,
  resolveOrganizationRouteFallback,
  subscribeToProfile,
  type AccountEntity,
  useApp,
} from "../AppContext";
import {
  ShellGuard,
  AccountSwitcher,
  ShellAppBreadcrumbs,
  ShellGlobalSearchDialog,
  useShellGlobalSearch,
  ShellHeaderControls,
  ShellUserAvatar,
} from "../platform-ui-stubs";
import {
  resolveShellPageTitle,
  isExactOrChildPath,
  buildShellContextualHref,
  SHELL_MOBILE_NAV_ITEMS,
  SHELL_ORG_PRIMARY_NAV_ITEMS,
  SHELL_ORG_SECONDARY_NAV_ITEMS,
} from "../../../../index";
import type { WorkspaceEntity } from "../../../../../workspace/adapters/inbound/react/WorkspaceContext";
import { useWorkspaceContext } from "../../../../../workspace/adapters/inbound/react/WorkspaceContext";
⋮----
import { AppRail } from "./ShellAppRail";
import { ShellDashboardSidebar } from "./ShellDashboardSidebar";
⋮----
function toggleSidebar()
⋮----
function handleSelectOrganization(account: AccountEntity)
⋮----
function handleSelectPersonal()
⋮----
function handleOrganizationCreated(account: AccountEntity)
⋮----
function handleSelectWorkspace(workspaceId: string | null)
⋮----
async function handleLogout()
⋮----
void handleLogout();
````

## File: src/modules/platform/adapters/inbound/react/useAccountScope.ts
````typescript
/**
 * useAccountScope — platform inbound adapter (React).
 *
 * Canonical hook for reading the active account scope in the src/ layer.
 * Aliases useApp() from the platform module.
 *
 * Returns: { state: AppState, dispatch: Dispatch<AppAction> }
 */
````

## File: src/modules/platform/index.ts
````typescript
/**
 * Platform Module — public API surface.
 * All cross-module consumers must import from here only.
 */
````

## File: src/modules/platform/orchestration/index.ts
````typescript
import {
  InMemoryBackgroundJobRepository,
} from "../subdomains/background-job/adapters/outbound";
import {
  RegisterJobDocumentUseCase,
  AdvanceJobStageUseCase,
  ListWorkspaceJobsUseCase,
  type RegisterJobDocumentInput,
  type AdvanceJobStageInput,
  type ListWorkspaceJobsInput,
  type JobResult,
} from "../subdomains/background-job/application";
import type { BackgroundJob } from "../subdomains/background-job/domain";
⋮----
export class PlatformFacade {
⋮----
registerBackgroundJob(input: RegisterJobDocumentInput): Promise<JobResult<BackgroundJob>>
⋮----
advanceBackgroundJob(input: AdvanceJobStageInput): Promise<JobResult<BackgroundJob>>
⋮----
listWorkspaceBackgroundJobs(input: ListWorkspaceJobsInput): Promise<readonly BackgroundJob[]>
````

## File: src/modules/platform/shared/errors/index.ts
````typescript
export class PlatformConfigurationError extends Error {
⋮----
constructor(message: string)
⋮----
export class PlatformAuthorizationError extends Error {
⋮----
constructor(message = "Platform access denied.")
⋮----
export class PlatformResourceNotFoundError extends Error {
````

## File: src/modules/platform/shared/events/index.ts
````typescript
export interface PlatformDomainEvent<TType extends string, TPayload extends object> {
  readonly type: TType;
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: TPayload;
}
⋮----
export type PlatformPublishedEvent =
  | PlatformDomainEvent<"platform.background-job.job_registered", {
      readonly jobId: string;
      readonly documentId: string;
      readonly organizationId: string;
      readonly workspaceId: string;
      readonly title: string;
      readonly mimeType: string;
    }>
  | PlatformDomainEvent<"platform.background-job.job_advanced", {
      readonly jobId: string;
      readonly documentId: string;
      readonly previousStatus: string;
      readonly nextStatus: string;
    }>
  | PlatformDomainEvent<"platform.notification.dispatched", {
      readonly notificationId: string;
      readonly recipientId: string;
      readonly notificationType: string;
    }>;
````

## File: src/modules/platform/shared/types/index.ts
````typescript
export interface PlatformScopeProps {
  readonly accountId: string;
  readonly organizationId?: string;
  readonly workspaceId?: string;
}
````

## File: src/modules/platform/subdomains/background-job/adapters/inbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/background-job/adapters/outbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/background-job/application/index.ts
````typescript

````

## File: src/modules/platform/subdomains/background-job/application/use-cases/background-job.use-cases.ts
````typescript
import { v4 as randomUUID } from "uuid";
import type { DomainError } from "../../../../../shared";
import type { JobDocument } from "../../domain/entities/JobDocument";
import {
  canTransitionJobStatus,
  type BackgroundJob,
  type BackgroundJobStatus,
} from "../../domain/entities/BackgroundJob";
import type { BackgroundJobRepository } from "../../domain/repositories/BackgroundJobRepository";
⋮----
export type JobResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: DomainError };
⋮----
function ok<T>(data: T): JobResult<T>
⋮----
function fail(code: string, message: string): JobResult<never>
⋮----
export interface RegisterJobDocumentInput {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly title: string;
  readonly mimeType: string;
}
⋮----
export class RegisterJobDocumentUseCase {
⋮----
constructor(private readonly repo: BackgroundJobRepository)
⋮----
async execute(input: RegisterJobDocumentInput): Promise<JobResult<BackgroundJob>>
⋮----
export interface AdvanceJobStageInput {
  readonly documentId: string;
  readonly nextStatus: BackgroundJobStatus;
  readonly statusMessage?: string;
}
⋮----
export class AdvanceJobStageUseCase {
⋮----
async execute(input: AdvanceJobStageInput): Promise<JobResult<BackgroundJob>>
⋮----
export interface ListWorkspaceJobsInput {
  readonly organizationId: string;
  readonly workspaceId: string;
}
⋮----
export class ListWorkspaceJobsUseCase {
⋮----
async execute(input: ListWorkspaceJobsInput): Promise<readonly BackgroundJob[]>
````

## File: src/modules/platform/subdomains/background-job/domain/index.ts
````typescript

````

## File: src/modules/platform/subdomains/cache/adapters/inbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/cache/adapters/outbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/cache/application/index.ts
````typescript

````

## File: src/modules/platform/subdomains/cache/domain/index.ts
````typescript

````

## File: src/modules/platform/subdomains/file-storage/adapters/inbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/file-storage/adapters/outbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/file-storage/application/index.ts
````typescript

````

## File: src/modules/platform/subdomains/file-storage/application/use-cases/FileStorageUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import type { StoredFile } from "../../domain/entities/StoredFile";
import type { FileStorageRepository } from "../../domain/repositories/FileStorageRepository";
⋮----
export interface CreateStoredFileInput {
  readonly ownerId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly url: string;
}
⋮----
export interface GetStoredFileInput {
  readonly fileId: string;
}
⋮----
export interface ListStoredFilesInput {
  readonly ownerId: string;
}
⋮----
export interface DeleteStoredFileInput {
  readonly fileId: string;
}
⋮----
export class CreateStoredFileUseCase {
⋮----
constructor(private readonly repository: FileStorageRepository)
⋮----
async execute(input: CreateStoredFileInput): Promise<StoredFile>
⋮----
export class GetStoredFileUseCase {
⋮----
async execute(input: GetStoredFileInput): Promise<StoredFile | null>
⋮----
export class ListStoredFilesUseCase {
⋮----
async execute(input: ListStoredFilesInput): Promise<StoredFile[]>
⋮----
export class DeleteStoredFileUseCase {
⋮----
async execute(input: DeleteStoredFileInput): Promise<void>
````

## File: src/modules/platform/subdomains/file-storage/domain/index.ts
````typescript

````

## File: src/modules/platform/subdomains/notification/adapters/inbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/notification/adapters/outbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/notification/adapters/outbound/memory/InMemoryNotificationRepository.ts
````typescript
import { v4 as uuid } from "uuid";
import type { DispatchNotificationInput, NotificationEntity } from "../../../domain/entities/Notification";
import type { NotificationRepository } from "../../../domain/repositories/NotificationRepository";
⋮----
export class InMemoryNotificationRepository implements NotificationRepository {
⋮----
async dispatch(input: DispatchNotificationInput): Promise<NotificationEntity>
⋮----
async markAsRead(notificationId: string, recipientId: string): Promise<void>
⋮----
async markAllAsRead(recipientId: string): Promise<void>
⋮----
async findByRecipient(recipientId: string, limit = 50): Promise<NotificationEntity[]>
⋮----
async getUnreadCount(recipientId: string): Promise<number>
````

## File: src/modules/platform/subdomains/notification/application/index.ts
````typescript

````

## File: src/modules/platform/subdomains/notification/application/use-cases/notification.use-cases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import type { DispatchNotificationInput } from "../../domain/entities/Notification";
⋮----
export class DispatchNotificationUseCase {
⋮----
constructor(private readonly repo: NotificationRepository)
⋮----
async execute(input: DispatchNotificationInput): Promise<CommandResult>
⋮----
export class MarkNotificationReadUseCase {
⋮----
async execute(notificationId: string, recipientId: string): Promise<CommandResult>
⋮----
export class MarkAllNotificationsReadUseCase {
⋮----
async execute(recipientId: string): Promise<CommandResult>
````

## File: src/modules/platform/subdomains/notification/application/use-cases/workspace-notification-preferences.use-case.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { WorkspaceNotificationPreferenceRepository } from "../../domain/repositories/WorkspaceNotificationPreferenceRepository";
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import { WorkspaceNotificationPreference } from "../../domain/entities/WorkspaceNotificationPreference";
import type { WorkspaceNotificationEventType } from "../../domain/value-objects/WorkspaceNotificationEventType";
⋮----
export interface UpdateNotificationPreferencesCommand {
  readonly workspaceId: string;
  readonly memberId: string;
  readonly subscribedEvents: WorkspaceNotificationEventType[];
}
⋮----
export class UpdateNotificationPreferencesUseCase {
⋮----
constructor(private readonly repo: WorkspaceNotificationPreferenceRepository)
⋮----
async execute(command: UpdateNotificationPreferencesCommand): Promise<CommandResult>
⋮----
export interface WorkspaceEventPayload {
  readonly eventType: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly message: string;
  readonly metadata?: Record<string, unknown>;
}
⋮----
export class NotifyWorkspaceMembersUseCase {
⋮----
constructor(
⋮----
async execute(event: WorkspaceEventPayload): Promise<void>
````

## File: src/modules/platform/subdomains/notification/domain/aggregates/NotificationAggregate.ts
````typescript
import { v4 as uuid } from "uuid";
import type {
  NotificationDomainEventType,
  NotificationDispatchedEvent,
  NotificationReadEvent,
} from "../events/NotificationDomainEvent";
import type { DispatchNotificationInput, NotificationEntity } from "../entities/Notification";
⋮----
export interface NotificationAggregateSnapshot {
  readonly id: string;
  readonly recipientId: string;
  readonly title: string;
  readonly message: string;
  readonly type: NotificationEntity["type"];
  readonly read: boolean;
  readonly timestamp: number;
  readonly sourceEventType: string | undefined;
  readonly metadata: Record<string, unknown> | undefined;
}
⋮----
export class NotificationAggregate {
⋮----
private constructor(private _props: NotificationAggregateSnapshot)
⋮----
static create(id: string, input: DispatchNotificationInput): NotificationAggregate
⋮----
static reconstitute(snapshot: NotificationAggregateSnapshot): NotificationAggregate
⋮----
markRead(): void
⋮----
getSnapshot(): Readonly<NotificationAggregateSnapshot>
⋮----
pullDomainEvents(): NotificationDomainEventType[]
⋮----
private recordEvent<TEvent extends NotificationDomainEventType>(event: TEvent): void
````

## File: src/modules/platform/subdomains/notification/domain/index.ts
````typescript

````

## File: src/modules/platform/subdomains/notification/domain/value-objects/WorkspaceNotificationEventType.ts
````typescript
import { z } from "zod";
⋮----
export type WorkspaceNotificationEventType = (typeof WORKSPACE_NOTIFICATION_EVENT_TYPES)[number];
⋮----
export function createWorkspaceNotificationEventType(raw: string): WorkspaceNotificationEventType
````

## File: src/modules/platform/subdomains/platform-config/adapters/inbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/platform-config/adapters/outbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/platform-config/application/index.ts
````typescript

````

## File: src/modules/platform/subdomains/search/adapters/inbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/search/adapters/outbound/index.ts
````typescript

````

## File: src/modules/platform/subdomains/search/application/index.ts
````typescript

````

## File: src/modules/platform/adapters/inbound/react/AccountScopeProvider.tsx
````typescript
/**
 * AccountScopeProvider — platform inbound adapter (React).
 *
 * Manages platform-owned account lifecycle: auth → accounts → activeAccount.
 * Ported from: app/(shell)/_providers/AppProvider.tsx
 *
 * Consumers use useAccountScope() to read account state.
 */
⋮----
import { useReducer, useEffect, type ReactNode } from "react";
⋮----
import {
  AppContext,
  APP_INITIAL_STATE,
  type AppState,
  type AppAction,
} from "./AppContext";
import {
  resolveActiveAccount,
  subscribeToAccountsForUser,
} from "./AppContext";
import { useAuth } from "../../../../iam/adapters/inbound/react/AuthContext";
⋮----
function appReducer(state: AppState, action: AppAction): AppState
⋮----
export function AccountScopeProvider(
⋮----
// eslint-disable-next-line react-hooks/exhaustive-deps
````

## File: src/modules/platform/adapters/inbound/react/platform-ui-stubs.tsx
````typescript
/**
 * platform-ui-stubs — platform inbound adapter (React).
 *
 * Remaining stubs for platform UI elements not yet implemented as real
 * components.  Items that have been promoted to real implementations are
 * re-exported from their canonical files below.
 */
⋮----
import { useState } from "react";
⋮----
// ── Shell theme toggle + language switcher ────────────────────────────────────
// Imported locally so they can be composed in ShellHeaderControls below,
// then re-exported so callers that want direct access can import from here.
⋮----
import { ShellThemeToggle } from "./shell/ShellThemeToggle";
import { ShellLanguageSwitcher } from "./shell/ShellLanguageSwitcher";
⋮----
// ── Real implementations (promoted from stubs) ────────────────────────────────
⋮----
// ── Account route context ─────────────────────────────────────────────────────
⋮----
// ── Shell breadcrumbs ─────────────────────────────────────────────────────────
⋮----
export function ShellAppBreadcrumbs(): null
⋮----
// ── Shell header controls (theme toggle + language switcher) ──────────────────
⋮----
export function ShellHeaderControls(): React.ReactElement
⋮----
// ── Global search ─────────────────────────────────────────────────────────────
⋮----
export function ShellGlobalSearchDialog(
  _props: ShellGlobalSearchDialogProps,
): null
⋮----
export function useShellGlobalSearch():
⋮----
// ── Stub route screens ────────────────────────────────────────────────────────
⋮----
export function OrganizationMembersRouteScreen(): React.ReactElement
⋮----
export function OrganizationOverviewRouteScreen(): React.ReactElement
⋮----
export function OrganizationPermissionsRouteScreen(): React.ReactElement
⋮----
export function SettingsNotificationsRouteScreen(): React.ReactElement
````

## File: src/modules/platform/adapters/inbound/react/shell/AccountSwitcher.tsx
````typescript
/**
 * AccountSwitcher — platform inbound adapter (React).
 *
 * Renders an account switcher control that lets the user toggle between their
 * personal (Firebase Auth) account and any organisation accounts they belong to.
 *
 * Design:
 *  - Current active account is shown as the trigger label.
 *  - Dropdown lists personal account first, then organisation accounts.
 *  - Active item is visually highlighted (check mark).
 *  - "Create organisation" entry at the bottom opens CreateOrganizationDialog.
 *
 * Props follow the same interface established in the stubs so callers
 * (ShellRootLayout, ShellAppRail) need no changes.
 */
⋮----
import { useState } from "react";
import { Building2, Check, ChevronsUpDown, Plus, UserRound } from "lucide-react";
⋮----
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
⋮----
import type { AuthUser } from "../../../../../iam/adapters/inbound/react/AuthContext";
import type { AccountEntity } from "../AppContext";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";
⋮----
// ── Types ─────────────────────────────────────────────────────────────────────
⋮----
interface AccountSwitcherProps {
  personalAccount: AuthUser | null;
  organizationAccounts: AccountEntity[];
  activeAccountId: string | null;
  onSelectPersonal: () => void;
  onSelectOrganization: (account: AccountEntity) => void;
  onOrganizationCreated?: (account: AccountEntity) => void;
}
⋮----
// ── Helpers ───────────────────────────────────────────────────────────────────
⋮----
function getActiveLabel(
  activeAccountId: string | null,
  personalAccount: AuthUser | null,
  organizationAccounts: AccountEntity[],
): string
⋮----
// ── Component ─────────────────────────────────────────────────────────────────
⋮----
{/* Personal account */}
⋮----
{/* Organisation accounts */}
⋮----
onClick=
⋮----
onOrganizationCreated=
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellUserAvatar.tsx
````typescript
/**
 * ShellUserAvatar — platform inbound adapter (React).
 *
 * Displays the authenticated user's avatar or initials in the shell header.
 * Opens a dropdown menu with the user's name, email, and a sign-out action.
 *
 * Design:
 *  - Avatar shows initials (up to 2 characters) derived from the display name.
 *  - Dropdown follows shadcn/ui DropdownMenu conventions.
 *  - Sign-out delegates to the onSignOut prop (ShellRootLayout handles the
 *    async logout and error state; this component stays presentation-only).
 */
⋮----
import { LogOut, UserRound } from "lucide-react";
⋮----
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
⋮----
// ── Helpers ───────────────────────────────────────────────────────────────────
⋮----
function getInitials(name: string): string
⋮----
// ── Component ─────────────────────────────────────────────────────────────────
⋮----
interface ShellUserAvatarProps {
  name: string;
  email: string;
  onSignOut: () => void;
}
⋮----
export function ShellUserAvatar({
  name,
  email,
  onSignOut,
}: ShellUserAvatarProps): React.ReactElement
````

## File: src/modules/platform/adapters/inbound/react/ShellFrame.tsx
````typescript
/**
 * ShellFrame — platform inbound adapter (React).
 *
 * Shell chrome wrapper: app-rail, sidebar, top header, and main content slot.
 * Lives in src/modules/platform/adapters/inbound/react/ alongside sibling shell files.
 */
````

## File: src/modules/platform/subdomains/platform-config/domain/index.ts
````typescript
// platform-config — domain layer
// Owns shell navigation configuration: route contexts, nav sections, breadcrumbs.
⋮----
export interface NavConfigEntry {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}
⋮----
export interface PlatformNavSection {
  readonly sectionId: string;
  readonly label: string;
  readonly items: readonly NavConfigEntry[];
}
⋮----
export interface PlatformConfigRepository {
  getNavSections(): Promise<readonly PlatformNavSection[]>;
}
⋮----
getNavSections(): Promise<readonly PlatformNavSection[]>;
````

## File: src/modules/platform/subdomains/search/domain/index.ts
````typescript
// search — domain layer
// Owns shell command catalog: searchable navigation items for quick-open palette.
⋮----
export interface SearchItem {
  readonly href: string;
  readonly label: string;
  readonly group: string;
}
⋮----
export interface SearchCatalogPort {
  listItems(): readonly SearchItem[];
}
⋮----
listItems(): readonly SearchItem[];
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellDashboardSidebar.tsx
````typescript
/**
 * ShellDashboardSidebar — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it composes workspace module components.
 */
⋮----
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
⋮----
import {
  buildWorkspaceQuickAccessItems,
  CustomizeNavigationDialog,
  getWorkspaceIdFromPath,
  MAX_VISIBLE_RECENT_WORKSPACES,
  readNavPreferences,
  supportsWorkspaceSearchContext,
  type NavPreferences,
  useRecentWorkspaces,
  useSidebarLocale,
  WorkspaceQuickAccessRow,
} from "../../../../../workspace/adapters/inbound/react/workspace-ui-stubs";
⋮----
import {
  type DashboardSidebarProps,
  ORGANIZATION_MANAGEMENT_ITEMS,
  ACCOUNT_NAV_ITEMS,
  SECTION_TITLES,
  resolveNavSection,
  isActiveRoute,
  isActiveOrganizationAccount,
} from "./ShellSidebarNavData";
import { ShellSidebarHeader } from "./ShellSidebarHeader";
import { DashboardSidebarBody } from "./ShellSidebarBody";
⋮----
export function ShellDashboardSidebar({
  pathname,
  activeAccount,
  workspaces,
  activeWorkspaceId,
  collapsed,
  onToggleCollapsed,
  onSelectWorkspace,
}: DashboardSidebarProps)
⋮----
isActiveRoute={(href) => isActiveRoute(pathname, href)}
          activeAccountId={activeAccount?.id ?? null}
          showAccountManagement={showAccountManagement}
          visibleAccountItems={visibleAccountItems}
          visibleOrganizationManagementItems={visibleOrganizationManagementItems}
          workspacePathId={workspacePathId}
          navPrefs={navPrefs}
          localeBundle={localeBundle}
          showRecentWorkspaces={showRecentWorkspaces}
          visibleRecentWorkspaceLinks={visibleRecentWorkspaceLinks}
          hasOverflow={hasOverflow}
          isExpanded={isExpanded}
          activeWorkspaceId={activeWorkspaceId}
          onSelectWorkspace={onSelectWorkspace}
onToggleExpanded=
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellSidebarNavData.tsx
````typescript
import {
  Building2,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  NotebookText,
  Settings2,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
⋮----
import {
  type ActiveAccount,
  isOrganizationActor,
  isActiveOrganizationAccount,
} from "../AppContext";
import {
  SHELL_ACCOUNT_SECTION_MATCHERS,
  SHELL_ACCOUNT_NAV_ITEMS,
  SHELL_ORGANIZATION_MANAGEMENT_ITEMS,
  SHELL_SECTION_LABELS,
  isExactOrChildPath,
  resolveShellNavSection,
  type ShellNavSection,
} from "../../../../index";
import type { WorkspaceEntity } from "../../../../../workspace/adapters/inbound/react/WorkspaceContext";
⋮----
// ── Types ─────────────────────────────────────────────────────────────────────
⋮----
export interface DashboardSidebarProps {
  readonly pathname: string;
  readonly userId: string | null;
  readonly activeAccount: ActiveAccount | null;
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly activeWorkspaceId: string | null;
  readonly collapsed: boolean;
  readonly onToggleCollapsed: () => void;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
}
⋮----
export type NavSection = ShellNavSection;
⋮----
// ── Static nav constants ──────────────────────────────────────────────────────
⋮----
// ── CSS class helpers ─────────────────────────────────────────────────────────
⋮----
export function sidebarItemClass(active: boolean)
⋮----
// ── Pure section helpers ──────────────────────────────────────────────────────
⋮----
export function resolveNavSection(pathname: string): NavSection
⋮----
export function isActiveRoute(pathname: string, href: string)
⋮----
// ── Simple section nav component ──────────────────────────────────────────────
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellAppRail.tsx
````typescript
/**
 * ShellAppRail — app/(shell)/_shell composition layer.
 * Moved from modules/platform/interfaces/web/shell/sidebar/ShellAppRail.tsx
 * because it composes downstream modules (workspace).
 *
 * Platform is upstream and must not import downstream modules.
 * app/ is the designated composition layer.
 */
⋮----
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  NotebookText,
  Plus,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
⋮----
import type { AuthUser, ActiveAccount, AccountEntity } from "../AppContext";
import { CreateOrganizationDialog } from "../platform-ui-stubs";
import {
  listShellRailCatalogItems,
  isExactOrChildPath,
  resolveShellNavSection,
  buildShellContextualHref,
  type ShellRailCatalogItem,
} from "../../../../index";
import type { WorkspaceEntity } from "../../../../../workspace/adapters/inbound/react/WorkspaceContext";
import { CreateWorkspaceDialogRail } from "../../../../../workspace/adapters/inbound/react/workspace-ui-stubs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/packages/ui-shadcn/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/packages/ui-shadcn/ui/tooltip";
⋮----
interface AppRailProps {
  readonly pathname: string;
  readonly user: AuthUser | null;
  readonly activeAccount: ActiveAccount | null;
  readonly organizationAccounts: AccountEntity[];
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly isOrganizationAccount: boolean;
  readonly onSelectPersonal: () => void;
  readonly onSelectOrganization: (account: AccountEntity) => void;
  readonly activeWorkspaceId: string | null;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
  readonly onOrganizationCreated?: (account: AccountEntity) => void;
  readonly onSignOut: () => void;
}
⋮----
interface RailItem {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  show?: boolean;
  isActive?: (pathname: string) => boolean;
}
⋮----
function getInitial(name: string | undefined | null): string
⋮----
function isActive(href: string)
⋮----
function buildWorkspaceDetailHref(workspaceId: string): string
⋮----
onClick=
⋮----
onSelectWorkspace(workspace.id);
````

## File: src/modules/platform/subdomains/platform-config/application/services/shell-navigation-catalog.ts
````typescript
// ── Types ──────────────────────────────────────────────────────────────────────
⋮----
export type ShellNavSection =
  | "workspace"
  | "dashboard"
  | "account"
  | "schedule"
  | "daily"
  | "audit"
  | "members"
  | "teams"
  | "permissions"
  | "organization"
  | "other";
⋮----
export interface ShellNavItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}
⋮----
export interface ShellRailCatalogItem {
  readonly id: string;
  readonly href: string;
  readonly label: string;
  /** If true, this item is only visible to organization accounts. */
  readonly requiresOrganization: boolean;
  /** Route prefix for active-state matching. When absent, defaults to href. */
  readonly activeRoutePrefix?: string;
}
⋮----
/** If true, this item is only visible to organization accounts. */
⋮----
/** Route prefix for active-state matching. When absent, defaults to href. */
⋮----
export interface ShellContextSectionConfig {
  readonly title: string;
  readonly items: readonly { href: string; label: string }[];
}
⋮----
export interface ShellRouteContext {
  readonly accountId?: string | null;
  readonly workspaceId?: string | null;
}
⋮----
function parseHref(href: string):
⋮----
function joinHref(path: string, query: string): string
⋮----
function isAccountScopedWorkspacePath(pathname: string): boolean
⋮----
export function normalizeShellRoutePath(pathname: string): string
⋮----
export function buildShellContextualHref(
  href: string,
  context: ShellRouteContext,
): string
⋮----
// ── Route-matching utility ────────────────────────────────────────────────────
⋮----
export function isExactOrChildPath(targetPath: string, pathname: string): boolean
⋮----
// ── Account section matchers ──────────────────────────────────────────────────
⋮----
// ── Route titles & breadcrumb labels ──────────────────────────────────────────
⋮----
// Workspace task-lifecycle tabs (query-param based, resolved in resolveShellPageTitle)
⋮----
// ── Organization management items ─────────────────────────────────────────────
⋮----
// ── Account nav items ─────────────────────────────────────────────────────────
⋮----
// ── Section labels ────────────────────────────────────────────────────────────
⋮----
// ── Rail catalog ──────────────────────────────────────────────────────────────
⋮----
export function listShellRailCatalogItems(isOrganization: boolean): readonly ShellRailCatalogItem[]
⋮----
// ── Context section config ────────────────────────────────────────────────────
⋮----
// ── Mobile & organization nav items ───────────────────────────────────────────
⋮----
// ── Section resolvers ─────────────────────────────────────────────────────────
⋮----
export function resolveShellNavSection(pathname: string): ShellNavSection
⋮----
export function resolveShellPageTitle(pathname: string, tab?: string | null): string
⋮----
export function resolveShellBreadcrumbLabel(segment: string): string
````

## File: src/modules/platform/adapters/inbound/react/shell/ShellSidebarBody.tsx
````typescript
/**
 * ShellSidebarBody — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it imports from workspace and notion modules.
 */
⋮----
import Link from "next/link";
⋮----
import {
  WorkspaceSectionContent,
  type NavPreferences,
  type SidebarLocaleBundle,
} from "../../../../../workspace/adapters/inbound/react/workspace-ui-stubs";
import { SHELL_CONTEXT_SECTION_CONFIG, buildShellContextualHref } from "../../../../index";
⋮----
import {
  type NavSection,
  sidebarItemClass,
  sidebarSectionTitleClass,
} from "./ShellSidebarNavData";
import { ShellContextNavSection } from "./ShellContextNavSection";
⋮----
interface NavItem {
  id: string;
  label: string;
  href: string;
}
⋮----
interface WorkspaceLink {
  id: string;
  name: string;
  href: string;
}
⋮----
interface ShellSidebarBodyProps {
  section: NavSection;
  isActiveRoute: (href: string) => boolean;
  activeAccountId: string | null;
  showAccountManagement: boolean;
  visibleAccountItems: readonly NavItem[];
  visibleOrganizationManagementItems: readonly NavItem[];
  workspacePathId: string | null;
  navPrefs: NavPreferences;
  localeBundle: SidebarLocaleBundle | null;
  showRecentWorkspaces: boolean;
  visibleRecentWorkspaceLinks: WorkspaceLink[];
  hasOverflow: boolean;
  isExpanded: boolean;
  activeWorkspaceId: string | null;
  onSelectWorkspace: (workspaceId: string | null) => void;
  onToggleExpanded: () => void;
  currentSearchWorkspaceId: string;
}
⋮----
className=
⋮----
// Show the context section only when a workspace is actually in scope.
````

## File: src/modules/platform/README.md
````markdown
# Platform Module

> **account / organization 子域已遷入 `src/modules/iam/`**。在 `src/modules/platform/` 中**不得**重建這些子域。

## 子域清單

| 子域 | 狀態 | 說明 |
|---|---|---|
| `background-job` | ✅ 完成 | 背景工作排程（BackgroundJob / JobDocument / JobChunk）|
| `cache` | ✅ 完成 | 鍵值快取、TTL 設定 |
| `file-storage` | ✅ 完成 | 上傳、下載、檔案生命週期 |
| `notification` | ✅ 完成 | 通知發送 |
| `platform-config` | ✅ 完成 | 平台設定 |
| `search` | ✅ 完成 | 跨域搜尋 |

**已遷移（不在 platform）：**

| 子域 | 遷移目標 |
|---|---|
| `account` | `src/modules/iam/subdomains/account/` |
| `organization` | `src/modules/iam/subdomains/organization/` |

---

## 目錄結構

```
src/modules/platform/
  index.ts
  README.md
  AGENT.md
  orchestration/
    PlatformFacade.ts
  shared/
    domain/index.ts
    events/index.ts             ← Platform Published Language Events
    types/index.ts
  subdomains/
    notification/
      domain/
      application/
      adapters/outbound/
    background-job/
      domain/                   ← BackgroundJob / JobDocument / JobChunk
      application/
      adapters/outbound/
    cache/
    file-storage/
    platform-config/
    search/
```

---

## 依賴方向

Platform 是 T1 operational support，依賴方向固定：

```
iam     → platform
billing → platform (entitlement governance)
platform → workspace
(platform 也被 notion, notebooklm 以 Service API 形式消費)
```

Platform 不可依賴下游模組（workspace、notion、notebooklm、analytics）。

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 在 `src/modules/platform/` 重建 account / org 子域 | 已遷入 iam |
| 使用 `Ingestion*` 命名 | 已語意化為 BackgroundJob / JobDocument / JobChunk |
| platform 依賴 workspace / notion / notebooklm | 違反上游依賴方向 |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
````

## File: src/modules/platform/AGENT.md
````markdown
# Platform Module — Agent Guide

## Purpose

`src/modules/platform` 是 **Platform 橫切治理能力模組**，為 Xuanwu 系統提供通知（Notification）、背景工作（Background Job）、平台設定（Platform Config）、搜尋（Search）等橫切服務能力的實作落點。

> **注意：** `platform/subdomains/account` 與 `platform/subdomains/organization` 已**完全遷入** `src/modules/iam/`。在 `src/modules/platform/` 中**不得**重建這些子域。

## 子域清單

| 子域 | 說明 | 狀態 |
|---|---|---|
| `background-job` | 背景工作排程（BackgroundJob / JobDocument / JobChunk）| ✅ 完成 |
| `cache` | 快取管理（鍵值快取、TTL 設定）| ✅ 完成 |
| `file-storage` | 檔案儲存服務（上傳、下載、生命週期）| ✅ 完成 |
| `notification` | 通知發送 | ✅ 完成 |
| `platform-config` | 平台設定 | ✅ 完成 |
| `search` | 跨域搜尋 | ✅ 完成 |

**已遷移子域（不在 platform）：**
- `account` → `src/modules/iam/subdomains/account/`
- `organization` → `src/modules/iam/subdomains/organization/`

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK 或任何框架。
- Platform 是 T1 operational support（iam/billing 為其上游），不可依賴下游模組（workspace、notion、notebooklm、analytics）。
- `background-job` 使用泛化命名（BackgroundJob / JobDocument / JobChunk），不使用已棄用的 Ingestion* 命名。

## Route Here When

- 撰寫 platform 橫切服務的新 use case、entity、adapter 實作。
- 實作 notification、background-job 等骨架。

## Route Elsewhere When

- 讀取邊界規則 → `src/modules/platform/AGENT.md`
- Account / Organization → `src/modules/iam/`（已遷入）
- 跨模組 API boundary → `src/modules/platform/index.ts`

## 路由規則

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/platform/AGENT.md` |
| 撰寫新 use case / adapter / entity | `src/modules/platform/`（本層）|
| 跨模組 API boundary | `src/modules/platform/index.ts` |

**嚴禁事項：**
- ❌ 在 `src/modules/platform/` 重建 account / org 子域（已遷入 iam）
- ❌ 使用 `Ingestion*` 命名（已語意化為 BackgroundJob / JobDocument / JobChunk）
- ❌ platform 依賴 workspace / notion / notebooklm（違反上游方向）

## 文件網絡

- [README.md](README.md) — 模組目錄結構
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
````