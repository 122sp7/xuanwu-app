# Files

## File: src/modules/workspace/adapters/inbound/react/index.ts
````typescript
/**
 * workspace inbound React adapter — barrel.
 *
 * Public surface for all workspace React inbound adapters.
 * Consumed by src/app/ route shims and platform/adapters/inbound/react/.
 */
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceContext.tsx
````typescript
/**
 * WorkspaceContext — workspace inbound adapter (React).
 *
 * Defines workspace scope state, context, and the WorkspaceContextProvider.
 * Consumed by WorkspaceScopeProvider and useWorkspaceScope in this adapter layer.
 */
⋮----
import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
⋮----
import type { WorkspaceSnapshot } from "../../../subdomains/lifecycle/domain/entities/Workspace";
⋮----
export type WorkspaceEntity = WorkspaceSnapshot;
⋮----
export interface WorkspaceContextState {
  readonly workspaces: Record<string, WorkspaceEntity>;
  readonly activeWorkspaceId: string | null;
  readonly workspacesHydrated: boolean;
}
⋮----
export type WorkspaceContextAction =
  | { type: "SET_ACTIVE_WORKSPACE"; payload: string | null }
  | { type: "SET_WORKSPACES"; payload: Record<string, WorkspaceEntity> }
  | { type: "RESET" };
⋮----
export interface WorkspaceContextValue {
  readonly state: WorkspaceContextState;
  readonly dispatch: Dispatch<WorkspaceContextAction>;
}
⋮----
function reducer(
  state: WorkspaceContextState,
  action: WorkspaceContextAction,
): WorkspaceContextState
⋮----
export function WorkspaceContextProvider({
  children,
}: {
  children: ReactNode;
})
⋮----
export function useWorkspaceContext(): WorkspaceContextValue
````

## File: src/modules/workspace/adapters/outbound/FirebaseWorkspaceQueryRepository.ts
````typescript
/**
 * FirebaseWorkspaceQueryRepository — workspace module outbound adapter (read side).
 *
 * Provides real-time Firestore subscription for workspace data belonging to a
 * given account.  Lives at workspace/adapters/outbound/ so @integration-firebase
 * is permitted per ESLint boundary rules
 * (src/modules/<context>/adapters/outbound/**).
 *
 * Firestore collection contract:
 *   workspaces/{workspaceId} → WorkspaceSnapshot shape
 *
 * Design:
 *  - Uses onSnapshot for live updates (no polling).
 *  - Maps raw Firestore data defensively; all unknown values fall back to safe defaults.
 *  - Timestamps may arrive as Firestore Timestamp objects or ISO strings — both handled.
 */
⋮----
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  type Timestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type {
  WorkspaceSnapshot,
  WorkspaceLifecycleState,
  WorkspaceVisibility,
} from "../../subdomains/lifecycle/domain/entities/Workspace";
⋮----
export type Unsubscribe = () => void;
⋮----
// ── Timestamp helper ──────────────────────────────────────────────────────────
⋮----
function toISO(v: unknown): string
⋮----
// ── Firestore data → WorkspaceSnapshot mapper ─────────────────────────────────
⋮----
function toWorkspaceSnapshot(
  id: string,
  data: Record<string, unknown>,
): WorkspaceSnapshot
⋮----
// ── Repository ────────────────────────────────────────────────────────────────
⋮----
export class FirebaseWorkspaceQueryRepository {
⋮----
/**
   * Opens a real-time Firestore listener for all workspaces belonging to
   * `accountId`.  Calls `onUpdate` immediately with the current snapshot and
   * again on every subsequent change.
   *
   * Returns an unsubscribe function — call it when the subscriber unmounts.
   */
subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: Record<string, WorkspaceSnapshot>) => void,
): Unsubscribe
````

## File: src/modules/workspace/shared/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/activity/adapters/outbound/firestore/FirestoreActivityRepository.ts
````typescript
import type { ActivityRepository } from "../../../domain/repositories/ActivityRepository";
import type { ActivityEventSnapshot } from "../../../domain/entities/ActivityEvent";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreActivityRepository implements ActivityRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async save(entry: ActivityEventSnapshot): Promise<void>
⋮----
async listByWorkspace(workspaceId: string, limit = 50): Promise<ActivityEventSnapshot[]>
⋮----
async listByResource(workspaceId: string, resourceType: string, resourceId: string): Promise<ActivityEventSnapshot[]>
````

## File: src/modules/workspace/subdomains/activity/domain/events/ActivityDomainEvent.ts
````typescript
export interface ActivityDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface ActivityRecordedEvent extends ActivityDomainEvent {
  readonly type: "workspace.activity.recorded";
  readonly payload: { readonly activityId: string; readonly workspaceId: string; readonly activityType: string };
}
⋮----
export type ActivityDomainEventType = ActivityRecordedEvent;
````

## File: src/modules/workspace/subdomains/activity/domain/repositories/ActivityRepository.ts
````typescript
import type { ActivityEventSnapshot } from "../entities/ActivityEvent";
⋮----
export interface ActivityRepository {
  save(entry: ActivityEventSnapshot): Promise<void>;
  listByWorkspace(workspaceId: string, limit?: number): Promise<ActivityEventSnapshot[]>;
  listByResource(workspaceId: string, resourceType: string, resourceId: string): Promise<ActivityEventSnapshot[]>;
}
⋮----
save(entry: ActivityEventSnapshot): Promise<void>;
listByWorkspace(workspaceId: string, limit?: number): Promise<ActivityEventSnapshot[]>;
listByResource(workspaceId: string, resourceType: string, resourceId: string): Promise<ActivityEventSnapshot[]>;
````

## File: src/modules/workspace/subdomains/api-key/adapters/outbound/firestore/FirestoreApiKeyRepository.ts
````typescript
import type { ApiKeyRepository } from "../../../domain/repositories/ApiKeyRepository";
import type { ApiKeySnapshot } from "../../../domain/entities/ApiKey";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreApiKeyRepository implements ApiKeyRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(keyId: string): Promise<ApiKeySnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<ApiKeySnapshot[]>
⋮----
async findByHash(keyHash: string): Promise<ApiKeySnapshot | null>
⋮----
async save(key: ApiKeySnapshot): Promise<void>
⋮----
async revoke(keyId: string, nowISO: string): Promise<void>
````

## File: src/modules/workspace/subdomains/api-key/domain/events/ApiKeyDomainEvent.ts
````typescript
export interface ApiKeyDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface ApiKeyCreatedEvent extends ApiKeyDomainEvent {
  readonly type: "workspace.api-key.created";
  readonly payload: { readonly apiKeyId: string; readonly workspaceId: string };
}
⋮----
export interface ApiKeyRevokedEvent extends ApiKeyDomainEvent {
  readonly type: "workspace.api-key.revoked";
  readonly payload: { readonly apiKeyId: string; readonly workspaceId: string };
}
⋮----
export type ApiKeyDomainEventType = ApiKeyCreatedEvent | ApiKeyRevokedEvent;
````

## File: src/modules/workspace/subdomains/api-key/domain/repositories/ApiKeyRepository.ts
````typescript
import type { ApiKeySnapshot } from "../entities/ApiKey";
⋮----
export interface ApiKeyRepository {
  findById(keyId: string): Promise<ApiKeySnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<ApiKeySnapshot[]>;
  findByHash(keyHash: string): Promise<ApiKeySnapshot | null>;
  save(key: ApiKeySnapshot): Promise<void>;
  revoke(keyId: string, nowISO: string): Promise<void>;
}
⋮----
findById(keyId: string): Promise<ApiKeySnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<ApiKeySnapshot[]>;
findByHash(keyHash: string): Promise<ApiKeySnapshot | null>;
save(key: ApiKeySnapshot): Promise<void>;
revoke(keyId: string, nowISO: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/approval/domain/repositories/ApprovalRepository.ts
````typescript
export type ApprovalTaskStatus = "draft" | "in_progress" | "qa" | "acceptance" | "accepted" | "archived" | "cancelled";
export type ApprovalIssueStatus = "open" | "fixing" | "retest" | "resolved" | "wont_fix" | "closed";
⋮----
export interface ApprovalTaskLike {
  readonly id: string;
  readonly status: ApprovalTaskStatus;
}
⋮----
export interface ApprovalIssueLike {
  readonly id: string;
  readonly taskId: string;
  readonly status: ApprovalIssueStatus;
}
⋮----
export interface ApprovalTaskRepository {
  findById(taskId: string): Promise<ApprovalTaskLike | null>;
  updateStatus(taskId: string, to: ApprovalTaskStatus, nowISO: string): Promise<ApprovalTaskLike | null>;
}
⋮----
findById(taskId: string): Promise<ApprovalTaskLike | null>;
updateStatus(taskId: string, to: ApprovalTaskStatus, nowISO: string): Promise<ApprovalTaskLike | null>;
⋮----
export interface ApprovalIssueRepository {
  findById(issueId: string): Promise<ApprovalIssueLike | null>;
  countOpenByTaskId(taskId: string): Promise<number>;
  updateStatus(issueId: string, to: ApprovalIssueStatus, nowISO: string): Promise<ApprovalIssueLike | null>;
}
⋮----
findById(issueId: string): Promise<ApprovalIssueLike | null>;
countOpenByTaskId(taskId: string): Promise<number>;
updateStatus(issueId: string, to: ApprovalIssueStatus, nowISO: string): Promise<ApprovalIssueLike | null>;
````

## File: src/modules/workspace/subdomains/audit/adapters/outbound/firestore/FirestoreAuditRepository.ts
````typescript
import type { AuditRepository } from "../../../domain/repositories/AuditRepository";
import type { AuditEntrySnapshot } from "../../../domain/entities/AuditEntry";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreAuditRepository implements AuditRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async save(entry: AuditEntrySnapshot): Promise<void>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<AuditEntrySnapshot[]>
⋮----
async findByWorkspaceIds(workspaceIds: string[], maxCount = 100): Promise<AuditEntrySnapshot[]>
````

## File: src/modules/workspace/subdomains/audit/domain/events/AuditDomainEvent.ts
````typescript
export interface AuditDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface AuditEntryRecordedEvent extends AuditDomainEvent {
  readonly type: "workspace.audit.entry-recorded";
  readonly payload: {
    readonly auditId: string;
    readonly workspaceId: string;
    readonly actorId: string;
    readonly action: string;
    readonly severity: string;
  };
}
⋮----
export type AuditDomainEventType = AuditEntryRecordedEvent;
````

## File: src/modules/workspace/subdomains/audit/domain/repositories/AuditRepository.ts
````typescript
import type { AuditEntrySnapshot } from "../entities/AuditEntry";
⋮----
export interface AuditRepository {
  save(entry: AuditEntrySnapshot): Promise<void>;
  findByWorkspaceId(workspaceId: string): Promise<AuditEntrySnapshot[]>;
  findByWorkspaceIds(workspaceIds: string[], maxCount?: number): Promise<AuditEntrySnapshot[]>;
}
⋮----
save(entry: AuditEntrySnapshot): Promise<void>;
findByWorkspaceId(workspaceId: string): Promise<AuditEntrySnapshot[]>;
findByWorkspaceIds(workspaceIds: string[], maxCount?: number): Promise<AuditEntrySnapshot[]>;
````

## File: src/modules/workspace/subdomains/feed/adapters/outbound/firestore/FirestoreFeedRepository.ts
````typescript
import type { FeedPostRepository } from "../../../domain/repositories/FeedPostRepository";
import type { FeedPostSnapshot } from "../../../domain/entities/FeedPost";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
  increment(collection: string, id: string, field: string, delta: number): Promise<void>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
increment(collection: string, id: string, field: string, delta: number): Promise<void>;
⋮----
export class FirestoreFeedRepository implements FeedPostRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(accountId: string, postId: string): Promise<FeedPostSnapshot | null>
⋮----
async listByWorkspaceId(accountId: string, workspaceId: string, limit: number): Promise<FeedPostSnapshot[]>
⋮----
async listByAccountId(accountId: string, limit: number): Promise<FeedPostSnapshot[]>
⋮----
async save(post: FeedPostSnapshot): Promise<void>
⋮----
async incrementCounter(
    accountId: string,
    postId: string,
    field: "likeCount" | "replyCount" | "repostCount" | "viewCount" | "bookmarkCount" | "shareCount",
    delta: number,
): Promise<void>
````

## File: src/modules/workspace/subdomains/feed/domain/events/FeedDomainEvent.ts
````typescript
export interface FeedDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface FeedPostCreatedEvent extends FeedDomainEvent {
  readonly type: "workspace.feed.post-created";
  readonly payload: { readonly postId: string; readonly workspaceId: string; readonly authorAccountId: string };
}
⋮----
export type FeedDomainEventType = FeedPostCreatedEvent;
````

## File: src/modules/workspace/subdomains/feed/domain/repositories/FeedPostRepository.ts
````typescript
import type { FeedPostSnapshot } from "../entities/FeedPost";
⋮----
export interface FeedPostRepository {
  findById(accountId: string, postId: string): Promise<FeedPostSnapshot | null>;
  listByWorkspaceId(accountId: string, workspaceId: string, limit: number): Promise<FeedPostSnapshot[]>;
  listByAccountId(accountId: string, limit: number): Promise<FeedPostSnapshot[]>;
  save(post: FeedPostSnapshot): Promise<void>;
  incrementCounter(accountId: string, postId: string, field: "likeCount" | "replyCount" | "repostCount" | "viewCount" | "bookmarkCount" | "shareCount", delta: number): Promise<void>;
}
⋮----
findById(accountId: string, postId: string): Promise<FeedPostSnapshot | null>;
listByWorkspaceId(accountId: string, workspaceId: string, limit: number): Promise<FeedPostSnapshot[]>;
listByAccountId(accountId: string, limit: number): Promise<FeedPostSnapshot[]>;
save(post: FeedPostSnapshot): Promise<void>;
incrementCounter(accountId: string, postId: string, field: "likeCount" | "replyCount" | "repostCount" | "viewCount" | "bookmarkCount" | "shareCount", delta: number): Promise<void>;
````

## File: src/modules/workspace/subdomains/invitation/adapters/outbound/firestore/FirestoreInvitationRepository.ts
````typescript
import type { InvitationRepository } from "../../../domain/repositories/InvitationRepository";
import type { WorkspaceInvitationSnapshot } from "../../../domain/entities/WorkspaceInvitation";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreInvitationRepository implements InvitationRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(invitationId: string): Promise<WorkspaceInvitationSnapshot | null>
⋮----
async findByToken(token: string): Promise<WorkspaceInvitationSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<WorkspaceInvitationSnapshot[]>
⋮----
async save(invitation: WorkspaceInvitationSnapshot): Promise<void>
⋮----
async delete(invitationId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/invitation/domain/events/InvitationDomainEvent.ts
````typescript
export interface InvitationDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface InvitationCreatedEvent extends InvitationDomainEvent {
  readonly type: "workspace.invitation.created";
  readonly payload: { readonly invitationId: string; readonly workspaceId: string; readonly invitedEmail: string };
}
⋮----
export interface InvitationAcceptedEvent extends InvitationDomainEvent {
  readonly type: "workspace.invitation.accepted";
  readonly payload: { readonly invitationId: string; readonly workspaceId: string; readonly invitedEmail: string };
}
⋮----
export type InvitationDomainEventType = InvitationCreatedEvent | InvitationAcceptedEvent;
````

## File: src/modules/workspace/subdomains/invitation/domain/repositories/InvitationRepository.ts
````typescript
import type { WorkspaceInvitationSnapshot } from "../entities/WorkspaceInvitation";
⋮----
export interface InvitationRepository {
  findById(invitationId: string): Promise<WorkspaceInvitationSnapshot | null>;
  findByToken(token: string): Promise<WorkspaceInvitationSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceInvitationSnapshot[]>;
  save(invitation: WorkspaceInvitationSnapshot): Promise<void>;
  delete(invitationId: string): Promise<void>;
}
⋮----
findById(invitationId: string): Promise<WorkspaceInvitationSnapshot | null>;
findByToken(token: string): Promise<WorkspaceInvitationSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<WorkspaceInvitationSnapshot[]>;
save(invitation: WorkspaceInvitationSnapshot): Promise<void>;
delete(invitationId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/issue/adapters/inbound/http/IssueController.ts
````typescript
import type { IssueRepository } from "../../../domain/repositories/IssueRepository";
import { OpenIssueUseCase, TransitionIssueStatusUseCase } from "../../../application/use-cases/IssueUseCases";
⋮----
export class IssueController {
⋮----
constructor(issueRepo: IssueRepository)
````

## File: src/modules/workspace/subdomains/issue/adapters/outbound/firestore/FirestoreIssueRepository.ts
````typescript
import type { IssueRepository } from "../../../domain/repositories/IssueRepository";
import type { IssueSnapshot } from "../../../domain/entities/Issue";
import type { IssueStatus } from "../../../domain/value-objects/IssueStatus";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(
    collection: string,
    filters: Array<{ field: string; op: string; value: unknown }>,
  ): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(
    collection: string,
    filters: Array<{ field: string; op: string; value: unknown }>,
  ): Promise<Record<string, unknown>[]>;
⋮----
export class FirestoreIssueRepository implements IssueRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(issueId: string): Promise<IssueSnapshot | null>
⋮----
async findByTaskId(taskId: string): Promise<IssueSnapshot[]>
⋮----
async countOpenByTaskId(taskId: string): Promise<number>
⋮----
async save(issue: IssueSnapshot): Promise<void>
⋮----
async updateStatus(
    issueId: string,
    to: IssueStatus,
    nowISO: string,
): Promise<IssueSnapshot | null>
⋮----
async delete(issueId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/issue/domain/events/IssueDomainEvent.ts
````typescript
import type { IssueStage } from "../value-objects/IssueStage";
import type { IssueStatus } from "../value-objects/IssueStatus";
⋮----
export interface IssueDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface IssueOpenedEvent extends IssueDomainEvent {
  readonly type: "workspace.issue.opened";
  readonly payload: {
    readonly issueId: string;
    readonly taskId: string;
    readonly stage: IssueStage;
    readonly createdBy: string;
  };
}
⋮----
export interface IssueStatusChangedEvent extends IssueDomainEvent {
  readonly type: "workspace.issue.status-changed";
  readonly payload: {
    readonly issueId: string;
    readonly taskId: string;
    readonly to: IssueStatus;
  };
}
⋮----
export interface IssueClosedEvent extends IssueDomainEvent {
  readonly type: "workspace.issue.closed";
  readonly payload: {
    readonly issueId: string;
    readonly taskId: string;
  };
}
⋮----
export type IssueDomainEventType =
  | IssueOpenedEvent
  | IssueStatusChangedEvent
  | IssueClosedEvent;
````

## File: src/modules/workspace/subdomains/issue/domain/repositories/IssueRepository.ts
````typescript
import type { IssueSnapshot } from "../entities/Issue";
import type { IssueStatus } from "../value-objects/IssueStatus";
⋮----
export interface IssueRepository {
  findById(issueId: string): Promise<IssueSnapshot | null>;
  findByTaskId(taskId: string): Promise<IssueSnapshot[]>;
  countOpenByTaskId(taskId: string): Promise<number>;
  save(issue: IssueSnapshot): Promise<void>;
  updateStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<IssueSnapshot | null>;
  delete(issueId: string): Promise<void>;
}
⋮----
findById(issueId: string): Promise<IssueSnapshot | null>;
findByTaskId(taskId: string): Promise<IssueSnapshot[]>;
countOpenByTaskId(taskId: string): Promise<number>;
save(issue: IssueSnapshot): Promise<void>;
updateStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<IssueSnapshot | null>;
delete(issueId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/issue/domain/value-objects/IssueStage.ts
````typescript
export type IssueStage = "task" | "qa" | "acceptance";
````

## File: src/modules/workspace/subdomains/issue/domain/value-objects/IssueStatus.ts
````typescript
export type IssueStatus =
  | "open"
  | "investigating"
  | "fixing"
  | "retest"
  | "resolved"
  | "closed";
⋮----
export function canTransitionIssueStatus(from: IssueStatus, to: IssueStatus): boolean
⋮----
export function isTerminalIssueStatus(status: IssueStatus): boolean
````

## File: src/modules/workspace/subdomains/lifecycle/adapters/inbound/http/WorkspaceController.ts
````typescript
import type { WorkspaceRepository } from "../../../domain/repositories/WorkspaceRepository";
import { CreateWorkspaceUseCase, ActivateWorkspaceUseCase, StopWorkspaceUseCase } from "../../../application/use-cases/WorkspaceLifecycleUseCases";
⋮----
export class WorkspaceController {
⋮----
constructor(workspaceRepo: WorkspaceRepository)
````

## File: src/modules/workspace/subdomains/lifecycle/adapters/outbound/firestore/FirestoreWorkspaceRepository.ts
````typescript
import type { WorkspaceRepository } from "../../../domain/repositories/WorkspaceRepository";
import type { WorkspaceSnapshot } from "../../../domain/entities/Workspace";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreWorkspaceRepository implements WorkspaceRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(workspaceId: string): Promise<WorkspaceSnapshot | null>
⋮----
async findByAccountId(accountId: string): Promise<WorkspaceSnapshot[]>
⋮----
async save(workspace: WorkspaceSnapshot): Promise<void>
⋮----
async delete(workspaceId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/lifecycle/domain/events/WorkspaceDomainEvent.ts
````typescript
export interface WorkspaceDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface WorkspaceCreatedEvent extends WorkspaceDomainEvent {
  readonly type: "workspace.lifecycle.created";
  readonly payload: { readonly workspaceId: string; readonly accountId: string; readonly name: string };
}
⋮----
export interface WorkspaceActivatedEvent extends WorkspaceDomainEvent {
  readonly type: "workspace.lifecycle.activated";
  readonly payload: { readonly workspaceId: string };
}
⋮----
export interface WorkspaceStoppedEvent extends WorkspaceDomainEvent {
  readonly type: "workspace.lifecycle.stopped";
  readonly payload: { readonly workspaceId: string };
}
⋮----
export type WorkspaceDomainEventType =
  | WorkspaceCreatedEvent
  | WorkspaceActivatedEvent
  | WorkspaceStoppedEvent;
````

## File: src/modules/workspace/subdomains/lifecycle/domain/repositories/WorkspaceRepository.ts
````typescript
import type { WorkspaceSnapshot } from "../entities/Workspace";
⋮----
export interface WorkspaceRepository {
  findById(workspaceId: string): Promise<WorkspaceSnapshot | null>;
  findByAccountId(accountId: string): Promise<WorkspaceSnapshot[]>;
  save(workspace: WorkspaceSnapshot): Promise<void>;
  delete(workspaceId: string): Promise<void>;
}
⋮----
findById(workspaceId: string): Promise<WorkspaceSnapshot | null>;
findByAccountId(accountId: string): Promise<WorkspaceSnapshot[]>;
save(workspace: WorkspaceSnapshot): Promise<void>;
delete(workspaceId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/membership/adapters/inbound/http/MembershipController.ts
````typescript
import type { WorkspaceMemberRepository } from "../../../domain/repositories/WorkspaceMemberRepository";
import { AddMemberUseCase, ChangeMemberRoleUseCase, RemoveMemberUseCase } from "../../../application/use-cases/MembershipUseCases";
⋮----
export class MembershipController {
⋮----
constructor(memberRepo: WorkspaceMemberRepository)
````

## File: src/modules/workspace/subdomains/membership/adapters/outbound/firestore/FirestoreMemberRepository.ts
````typescript
import type { WorkspaceMemberRepository } from "../../../domain/repositories/WorkspaceMemberRepository";
import type { WorkspaceMemberSnapshot } from "../../../domain/entities/WorkspaceMember";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreMemberRepository implements WorkspaceMemberRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(memberId: string): Promise<WorkspaceMemberSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberSnapshot[]>
⋮----
async findByActorAndWorkspace(actorId: string, workspaceId: string): Promise<WorkspaceMemberSnapshot | null>
⋮----
async save(member: WorkspaceMemberSnapshot): Promise<void>
⋮----
async delete(memberId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/membership/domain/events/MembershipDomainEvent.ts
````typescript
import type { MemberRole } from "../entities/WorkspaceMember";
⋮----
export interface MembershipDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface MemberAddedEvent extends MembershipDomainEvent {
  readonly type: "workspace.membership.member-added";
  readonly payload: { readonly memberId: string; readonly workspaceId: string; readonly actorId: string; readonly role: MemberRole };
}
⋮----
export interface MemberRemovedEvent extends MembershipDomainEvent {
  readonly type: "workspace.membership.member-removed";
  readonly payload: { readonly memberId: string; readonly workspaceId: string };
}
⋮----
export type MembershipDomainEventType = MemberAddedEvent | MemberRemovedEvent;
````

## File: src/modules/workspace/subdomains/membership/domain/repositories/WorkspaceMemberRepository.ts
````typescript
import type { WorkspaceMemberSnapshot } from "../entities/WorkspaceMember";
⋮----
export interface WorkspaceMemberRepository {
  findById(memberId: string): Promise<WorkspaceMemberSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberSnapshot[]>;
  findByActorAndWorkspace(actorId: string, workspaceId: string): Promise<WorkspaceMemberSnapshot | null>;
  save(member: WorkspaceMemberSnapshot): Promise<void>;
  delete(memberId: string): Promise<void>;
}
⋮----
findById(memberId: string): Promise<WorkspaceMemberSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberSnapshot[]>;
findByActorAndWorkspace(actorId: string, workspaceId: string): Promise<WorkspaceMemberSnapshot | null>;
save(member: WorkspaceMemberSnapshot): Promise<void>;
delete(memberId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/orchestration/adapters/inbound/http/OrchestrationController.ts
````typescript
import type { TaskMaterializationJobRepository } from "../../../domain/repositories/TaskMaterializationJobRepository";
import { CreateMaterializationJobUseCase } from "../../../application/use-cases/OrchestrationUseCases";
⋮----
export class OrchestrationController {
⋮----
constructor(jobRepo: TaskMaterializationJobRepository)
````

## File: src/modules/workspace/subdomains/orchestration/adapters/outbound/firestore/FirestoreJobRepository.ts
````typescript
import type { TaskMaterializationJobRepository } from "../../../domain/repositories/TaskMaterializationJobRepository";
import type { TaskMaterializationJobSnapshot, CompleteJobInput } from "../../../domain/entities/TaskMaterializationJob";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreJobRepository implements TaskMaterializationJobRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(jobId: string): Promise<TaskMaterializationJobSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<TaskMaterializationJobSnapshot[]>
⋮----
async save(job: TaskMaterializationJobSnapshot): Promise<void>
⋮----
async markRunning(jobId: string): Promise<TaskMaterializationJobSnapshot | null>
⋮----
async markCompleted(jobId: string, input: CompleteJobInput): Promise<TaskMaterializationJobSnapshot | null>
⋮----
async markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskMaterializationJobSnapshot | null>
````

## File: src/modules/workspace/subdomains/orchestration/domain/events/JobDomainEvent.ts
````typescript
export interface JobDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface JobCreatedEvent extends JobDomainEvent {
  readonly type: "workspace.orchestration.job-created";
  readonly payload: { readonly jobId: string; readonly workspaceId: string; readonly correlationId: string };
}
⋮----
export interface JobCompletedEvent extends JobDomainEvent {
  readonly type: "workspace.orchestration.job-completed";
  readonly payload: { readonly jobId: string; readonly workspaceId: string };
}
⋮----
export type JobDomainEventType = JobCreatedEvent | JobCompletedEvent;
````

## File: src/modules/workspace/subdomains/orchestration/domain/repositories/TaskMaterializationJobRepository.ts
````typescript
import type { TaskMaterializationJobSnapshot, CompleteJobInput } from "../entities/TaskMaterializationJob";
⋮----
export interface TaskMaterializationJobRepository {
  findById(jobId: string): Promise<TaskMaterializationJobSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<TaskMaterializationJobSnapshot[]>;
  save(job: TaskMaterializationJobSnapshot): Promise<void>;
  markRunning(jobId: string): Promise<TaskMaterializationJobSnapshot | null>;
  markCompleted(jobId: string, input: CompleteJobInput): Promise<TaskMaterializationJobSnapshot | null>;
  markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskMaterializationJobSnapshot | null>;
}
⋮----
findById(jobId: string): Promise<TaskMaterializationJobSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<TaskMaterializationJobSnapshot[]>;
save(job: TaskMaterializationJobSnapshot): Promise<void>;
markRunning(jobId: string): Promise<TaskMaterializationJobSnapshot | null>;
markCompleted(jobId: string, input: CompleteJobInput): Promise<TaskMaterializationJobSnapshot | null>;
markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskMaterializationJobSnapshot | null>;
````

## File: src/modules/workspace/subdomains/quality/domain/repositories/QualityTaskRepository.ts
````typescript
export type QualityTaskStatus = "draft" | "in_progress" | "qa" | "acceptance" | "accepted" | "archived" | "cancelled";
⋮----
export interface QualityTaskLike {
  readonly id: string;
  readonly status: QualityTaskStatus;
}
⋮----
export interface QualityTaskRepository {
  findById(taskId: string): Promise<QualityTaskLike | null>;
  updateStatus(taskId: string, to: QualityTaskStatus, nowISO: string): Promise<QualityTaskLike | null>;
}
⋮----
findById(taskId: string): Promise<QualityTaskLike | null>;
updateStatus(taskId: string, to: QualityTaskStatus, nowISO: string): Promise<QualityTaskLike | null>;
````

## File: src/modules/workspace/subdomains/resource/adapters/outbound/firestore/FirestoreQuotaRepository.ts
````typescript
import type { ResourceQuotaRepository } from "../../../domain/repositories/ResourceQuotaRepository";
import type { ResourceQuotaSnapshot, ResourceKind } from "../../../domain/entities/ResourceQuota";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreQuotaRepository implements ResourceQuotaRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(quotaId: string): Promise<ResourceQuotaSnapshot | null>
⋮----
async findByWorkspaceAndKind(workspaceId: string, resourceKind: ResourceKind): Promise<ResourceQuotaSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<ResourceQuotaSnapshot[]>
⋮----
async save(quota: ResourceQuotaSnapshot): Promise<void>
⋮----
async updateUsage(quotaId: string, current: number, nowISO: string): Promise<void>
````

## File: src/modules/workspace/subdomains/resource/domain/events/ResourceQuotaDomainEvent.ts
````typescript
import type { ResourceKind } from "../entities/ResourceQuota";
⋮----
export interface ResourceQuotaDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface QuotaProvisionedEvent extends ResourceQuotaDomainEvent {
  readonly type: "workspace.resource.quota-provisioned";
  readonly payload: { readonly quotaId: string; readonly workspaceId: string; readonly resourceKind: ResourceKind; readonly limit: number };
}
⋮----
export interface QuotaExceededEvent extends ResourceQuotaDomainEvent {
  readonly type: "workspace.resource.quota-exceeded";
  readonly payload: { readonly quotaId: string; readonly workspaceId: string; readonly resourceKind: ResourceKind };
}
⋮----
export type ResourceQuotaDomainEventType = QuotaProvisionedEvent | QuotaExceededEvent;
````

## File: src/modules/workspace/subdomains/resource/domain/repositories/ResourceQuotaRepository.ts
````typescript
import type { ResourceQuotaSnapshot } from "../entities/ResourceQuota";
import type { ResourceKind } from "../entities/ResourceQuota";
⋮----
export interface ResourceQuotaRepository {
  findById(quotaId: string): Promise<ResourceQuotaSnapshot | null>;
  findByWorkspaceAndKind(workspaceId: string, resourceKind: ResourceKind): Promise<ResourceQuotaSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<ResourceQuotaSnapshot[]>;
  save(quota: ResourceQuotaSnapshot): Promise<void>;
  updateUsage(quotaId: string, current: number, nowISO: string): Promise<void>;
}
⋮----
findById(quotaId: string): Promise<ResourceQuotaSnapshot | null>;
findByWorkspaceAndKind(workspaceId: string, resourceKind: ResourceKind): Promise<ResourceQuotaSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<ResourceQuotaSnapshot[]>;
save(quota: ResourceQuotaSnapshot): Promise<void>;
updateUsage(quotaId: string, current: number, nowISO: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/schedule/adapters/outbound/firestore/FirestoreDemandRepository.ts
````typescript
import type { DemandRepository } from "../../../domain/repositories/DemandRepository";
import type { WorkDemandSnapshot } from "../../../domain/entities/WorkDemand";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreDemandRepository implements DemandRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(id: string): Promise<WorkDemandSnapshot | null>
⋮----
async listByWorkspace(workspaceId: string): Promise<WorkDemandSnapshot[]>
⋮----
async listByAccount(accountId: string): Promise<WorkDemandSnapshot[]>
⋮----
async save(demand: WorkDemandSnapshot): Promise<void>
⋮----
async update(demand: WorkDemandSnapshot): Promise<void>
````

## File: src/modules/workspace/subdomains/schedule/domain/events/ScheduleDomainEvent.ts
````typescript
export interface ScheduleDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface DemandCreatedEvent extends ScheduleDomainEvent {
  readonly type: "workspace.schedule.demand-created";
  readonly payload: { readonly demandId: string; readonly workspaceId: string };
}
⋮----
export type ScheduleDomainEventType = DemandCreatedEvent;
````

## File: src/modules/workspace/subdomains/schedule/domain/repositories/DemandRepository.ts
````typescript
import type { WorkDemandSnapshot } from "../entities/WorkDemand";
⋮----
export interface DemandRepository {
  findById(id: string): Promise<WorkDemandSnapshot | null>;
  listByWorkspace(workspaceId: string): Promise<WorkDemandSnapshot[]>;
  listByAccount(accountId: string): Promise<WorkDemandSnapshot[]>;
  save(demand: WorkDemandSnapshot): Promise<void>;
  update(demand: WorkDemandSnapshot): Promise<void>;
}
⋮----
findById(id: string): Promise<WorkDemandSnapshot | null>;
listByWorkspace(workspaceId: string): Promise<WorkDemandSnapshot[]>;
listByAccount(accountId: string): Promise<WorkDemandSnapshot[]>;
save(demand: WorkDemandSnapshot): Promise<void>;
update(demand: WorkDemandSnapshot): Promise<void>;
````

## File: src/modules/workspace/subdomains/settlement/adapters/outbound/firestore/FirestoreInvoiceRepository.ts
````typescript
import type { InvoiceRepository } from "../../../domain/repositories/InvoiceRepository";
import type { InvoiceSnapshot } from "../../../domain/entities/Invoice";
import type { InvoiceStatus } from "../../../domain/value-objects/InvoiceStatus";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreInvoiceRepository implements InvoiceRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(invoiceId: string): Promise<InvoiceSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<InvoiceSnapshot[]>
⋮----
async save(invoice: InvoiceSnapshot): Promise<void>
⋮----
async transitionStatus(invoiceId: string, to: InvoiceStatus, nowISO: string): Promise<InvoiceSnapshot | null>
⋮----
async delete(invoiceId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/settlement/domain/events/InvoiceDomainEvent.ts
````typescript
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
⋮----
export interface InvoiceDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface InvoiceCreatedEvent extends InvoiceDomainEvent {
  readonly type: "workspace.settlement.invoice-created";
  readonly payload: { readonly invoiceId: string; readonly workspaceId: string };
}
⋮----
export interface InvoiceStatusChangedEvent extends InvoiceDomainEvent {
  readonly type: "workspace.settlement.invoice-status-changed";
  readonly payload: { readonly invoiceId: string; readonly workspaceId: string; readonly to: InvoiceStatus };
}
⋮----
export type InvoiceDomainEventType = InvoiceCreatedEvent | InvoiceStatusChangedEvent;
````

## File: src/modules/workspace/subdomains/settlement/domain/repositories/InvoiceRepository.ts
````typescript
import type { InvoiceSnapshot } from "../entities/Invoice";
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
⋮----
export interface InvoiceRepository {
  findById(invoiceId: string): Promise<InvoiceSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<InvoiceSnapshot[]>;
  save(invoice: InvoiceSnapshot): Promise<void>;
  transitionStatus(invoiceId: string, to: InvoiceStatus, nowISO: string): Promise<InvoiceSnapshot | null>;
  delete(invoiceId: string): Promise<void>;
}
⋮----
findById(invoiceId: string): Promise<InvoiceSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<InvoiceSnapshot[]>;
save(invoice: InvoiceSnapshot): Promise<void>;
transitionStatus(invoiceId: string, to: InvoiceStatus, nowISO: string): Promise<InvoiceSnapshot | null>;
delete(invoiceId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/settlement/domain/value-objects/InvoiceStatus.ts
````typescript
export type InvoiceStatus = "draft" | "submitted" | "finance_review" | "approved" | "paid" | "closed";
⋮----
export function canTransitionInvoiceStatus(from: InvoiceStatus, to: InvoiceStatus): boolean
⋮----
export function isTerminalInvoiceStatus(status: InvoiceStatus): boolean
````

## File: src/modules/workspace/subdomains/share/adapters/outbound/firestore/FirestoreShareRepository.ts
````typescript
import type { WorkspaceShareRepository } from "../../../domain/repositories/WorkspaceShareRepository";
import type { WorkspaceShareSnapshot } from "../../../domain/entities/WorkspaceShare";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreShareRepository implements WorkspaceShareRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(shareId: string): Promise<WorkspaceShareSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<WorkspaceShareSnapshot[]>
⋮----
async save(share: WorkspaceShareSnapshot): Promise<void>
⋮----
async delete(shareId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/share/domain/events/ShareDomainEvent.ts
````typescript
import type { ShareScope } from "../entities/WorkspaceShare";
⋮----
export interface ShareDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface ShareGrantedEvent extends ShareDomainEvent {
  readonly type: "workspace.share.granted";
  readonly payload: { readonly shareId: string; readonly workspaceId: string; readonly scope: ShareScope };
}
⋮----
export interface ShareRevokedEvent extends ShareDomainEvent {
  readonly type: "workspace.share.revoked";
  readonly payload: { readonly shareId: string; readonly workspaceId: string };
}
⋮----
export type ShareDomainEventType = ShareGrantedEvent | ShareRevokedEvent;
````

## File: src/modules/workspace/subdomains/share/domain/repositories/WorkspaceShareRepository.ts
````typescript
import type { WorkspaceShareSnapshot } from "../entities/WorkspaceShare";
⋮----
export interface WorkspaceShareRepository {
  findById(shareId: string): Promise<WorkspaceShareSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceShareSnapshot[]>;
  save(share: WorkspaceShareSnapshot): Promise<void>;
  delete(shareId: string): Promise<void>;
}
⋮----
findById(shareId: string): Promise<WorkspaceShareSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<WorkspaceShareSnapshot[]>;
save(share: WorkspaceShareSnapshot): Promise<void>;
delete(shareId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/task-formation/adapters/outbound/firestore/FirestoreTaskFormationJobRepository.ts
````typescript
import type { TaskFormationJobRepository } from "../../../domain/repositories/TaskFormationJobRepository";
import type { TaskFormationJobSnapshot, CompleteTaskFormationJobInput } from "../../../domain/entities/TaskFormationJob";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
query(collection: string, filters: Array<
⋮----
export class FirestoreTaskFormationJobRepository implements TaskFormationJobRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(jobId: string): Promise<TaskFormationJobSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<TaskFormationJobSnapshot[]>
⋮----
async save(job: TaskFormationJobSnapshot): Promise<void>
⋮----
async markRunning(jobId: string): Promise<TaskFormationJobSnapshot | null>
⋮----
async markCompleted(jobId: string, input: CompleteTaskFormationJobInput): Promise<TaskFormationJobSnapshot | null>
⋮----
async markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskFormationJobSnapshot | null>
````

## File: src/modules/workspace/subdomains/task-formation/domain/events/TaskFormationDomainEvent.ts
````typescript
export interface TaskFormationDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface TaskFormationJobCreatedEvent extends TaskFormationDomainEvent {
  readonly type: "workspace.task-formation.job-created";
  readonly payload: { readonly jobId: string; readonly workspaceId: string; readonly correlationId: string };
}
⋮----
export type TaskFormationDomainEventType = TaskFormationJobCreatedEvent;
````

## File: src/modules/workspace/subdomains/task-formation/domain/repositories/TaskFormationJobRepository.ts
````typescript
import type { TaskFormationJobSnapshot, CompleteTaskFormationJobInput } from "../entities/TaskFormationJob";
⋮----
export interface TaskFormationJobRepository {
  findById(jobId: string): Promise<TaskFormationJobSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<TaskFormationJobSnapshot[]>;
  save(job: TaskFormationJobSnapshot): Promise<void>;
  markRunning(jobId: string): Promise<TaskFormationJobSnapshot | null>;
  markCompleted(jobId: string, input: CompleteTaskFormationJobInput): Promise<TaskFormationJobSnapshot | null>;
  markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskFormationJobSnapshot | null>;
}
⋮----
findById(jobId: string): Promise<TaskFormationJobSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<TaskFormationJobSnapshot[]>;
save(job: TaskFormationJobSnapshot): Promise<void>;
markRunning(jobId: string): Promise<TaskFormationJobSnapshot | null>;
markCompleted(jobId: string, input: CompleteTaskFormationJobInput): Promise<TaskFormationJobSnapshot | null>;
markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskFormationJobSnapshot | null>;
````

## File: src/modules/workspace/subdomains/task-formation/domain/value-objects/TaskCandidate.ts
````typescript
export type TaskCandidateSource = "rule" | "ai";
⋮----
export interface ExtractedTaskCandidate {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
  readonly source: TaskCandidateSource;
  readonly confidence: number;
  readonly sourceBlockId?: string;
  readonly sourceSnippet?: string;
}
````

## File: src/modules/workspace/subdomains/task-formation/domain/value-objects/TaskFormationJobStatus.ts
````typescript
export type TaskFormationJobStatus = "queued" | "running" | "partially_succeeded" | "succeeded" | "failed" | "cancelled";
````

## File: src/modules/workspace/subdomains/task/adapters/inbound/http/TaskController.ts
````typescript
import type { TaskRepository } from "../../../domain/repositories/TaskRepository";
import { CreateTaskUseCase, UpdateTaskUseCase, TransitionTaskStatusUseCase } from "../../../application/use-cases/TaskUseCases";
⋮----
export class TaskController {
⋮----
constructor(taskRepo: TaskRepository)
````

## File: src/modules/workspace/subdomains/task/adapters/index.ts
````typescript
// task — adapters aggregate
````

## File: src/modules/workspace/subdomains/task/adapters/outbound/firestore/FirestoreTaskRepository.ts
````typescript
import type { TaskRepository } from "../../../domain/repositories/TaskRepository";
import type { TaskSnapshot } from "../../../domain/entities/Task";
import type { TaskStatus } from "../../../domain/value-objects/TaskStatus";
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(
    collection: string,
    filters: Array<{ field: string; op: string; value: unknown }>,
  ): Promise<Record<string, unknown>[]>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
query(
    collection: string,
    filters: Array<{ field: string; op: string; value: unknown }>,
  ): Promise<Record<string, unknown>[]>;
⋮----
export class FirestoreTaskRepository implements TaskRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(taskId: string): Promise<TaskSnapshot | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<TaskSnapshot[]>
⋮----
async save(task: TaskSnapshot): Promise<void>
⋮----
async updateStatus(
    taskId: string,
    to: TaskStatus,
    nowISO: string,
): Promise<TaskSnapshot | null>
⋮----
async delete(taskId: string): Promise<void>
````

## File: src/modules/workspace/subdomains/task/domain/events/TaskDomainEvent.ts
````typescript
import type { TaskStatus } from "../value-objects/TaskStatus";
⋮----
export interface TaskDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface TaskCreatedEvent extends TaskDomainEvent {
  readonly type: "workspace.task.created";
  readonly payload: {
    readonly taskId: string;
    readonly workspaceId: string;
    readonly title: string;
  };
}
⋮----
export interface TaskStatusChangedEvent extends TaskDomainEvent {
  readonly type: "workspace.task.status-changed";
  readonly payload: {
    readonly taskId: string;
    readonly workspaceId: string;
    readonly from: TaskStatus;
    readonly to: TaskStatus;
  };
}
⋮----
export interface TaskArchivedEvent extends TaskDomainEvent {
  readonly type: "workspace.task.archived";
  readonly payload: {
    readonly taskId: string;
    readonly workspaceId: string;
    readonly archivedAtISO: string;
  };
}
⋮----
export type TaskDomainEventType =
  | TaskCreatedEvent
  | TaskStatusChangedEvent
  | TaskArchivedEvent;
````

## File: src/modules/workspace/subdomains/task/domain/repositories/TaskRepository.ts
````typescript
import type { TaskSnapshot } from "../entities/Task";
import type { TaskStatus } from "../value-objects/TaskStatus";
⋮----
export interface TaskRepository {
  findById(taskId: string): Promise<TaskSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<TaskSnapshot[]>;
  save(task: TaskSnapshot): Promise<void>;
  updateStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<TaskSnapshot | null>;
  delete(taskId: string): Promise<void>;
}
⋮----
findById(taskId: string): Promise<TaskSnapshot | null>;
findByWorkspaceId(workspaceId: string): Promise<TaskSnapshot[]>;
save(task: TaskSnapshot): Promise<void>;
updateStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<TaskSnapshot | null>;
delete(taskId: string): Promise<void>;
````

## File: src/modules/workspace/subdomains/task/domain/value-objects/TaskStatus.ts
````typescript
export type TaskStatus =
  | "draft"
  | "in_progress"
  | "qa"
  | "acceptance"
  | "accepted"
  | "archived";
⋮----
export function canTransitionTaskStatus(from: TaskStatus, to: TaskStatus): boolean
⋮----
export function nextTaskStatus(current: TaskStatus): TaskStatus | null
⋮----
export function isTerminalTaskStatus(status: TaskStatus): boolean
````

## File: src/modules/workspace/adapters/inbound/react/AccountRouteDispatcher.tsx
````typescript
/**
 * AccountRouteDispatcher — workspace inbound adapter (React).
 *
 * Receives accountId + slug props from the Server Component shim and
 * dispatches to the appropriate route screen.
 *
 * Ported from: app/(shell)/(account)/[accountId]/[[...slug]]/page.tsx
 */
⋮----
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
⋮----
import { useAuth } from "../../../../iam/adapters/inbound/react/AuthContext";
import {
  useAccountRouteContext,
  OrganizationMembersRouteScreen,
  OrganizationOverviewRouteScreen,
  OrganizationPermissionsRouteScreen,
} from "../../../../platform/adapters/inbound/react/platform-ui-stubs";
import { useApp } from "../../../../platform/adapters/inbound/react/AppContext";
import {
  AccountDashboardRouteScreen,
  OrganizationWorkspacesRouteScreen,
  WorkspaceDetailRouteScreen,
  WorkspaceHubScreen,
} from "./workspace-ui-stubs";
⋮----
// Lazy imports to avoid hard-coupling modules that may not yet be available
⋮----
// These screens live in workspace/platform stubs — import dynamically to
// allow partial availability during incremental migration.
// eslint-disable-next-line @typescript-eslint/no-require-imports
⋮----
// eslint-disable-next-line @typescript-eslint/no-require-imports
⋮----
// Gracefully degrade if screens are not yet available
⋮----
export interface AccountRouteDispatcherProps {
  accountId: string;
  slug: string[];
}
⋮----
interface RedirectingRouteProps {
  readonly href: string;
  readonly message: string;
}
⋮----
function RedirectingRoute(
⋮----
function NotFound()
⋮----
export function AccountRouteDispatcher({
  accountId: accountIdFromParams,
  slug,
}: AccountRouteDispatcherProps)
⋮----
// Legacy redirect: /organization/... → /<accountId>/...
⋮----
// Legacy redirect: /workspace/... → /<accountId>/...
⋮----
// Root: /<accountId>
⋮----
if (accountType === "organization")
⋮----
// Single-segment routes: /<accountId>/<segment>
⋮----
// Two-segment routes
⋮----
// Fallback
````

## File: src/modules/workspace/adapters/inbound/react/useWorkspaceScope.ts
````typescript
/**
 * useWorkspaceScope — workspace inbound adapter (React).
 *
 * Canonical hook for reading the active workspace scope in the src/ layer.
 * Aliases useWorkspaceContext() from the workspace module.
 *
 * Returns: { state: WorkspaceContextState, dispatch: Dispatch<WorkspaceContextAction> }
 */
````

## File: src/modules/workspace/index.ts
````typescript
/**
 * Workspace Module — public API surface.
 * All cross-module consumers must import from here only.
 */
⋮----
// lifecycle (workspace CRUD)
⋮----
// membership
⋮----
// task
⋮----
// issue
⋮----
// shared types and errors
````

## File: src/modules/workspace/orchestration/index.ts
````typescript
/**
 * workspace — orchestration layer
 * Cross-subdomain coordination and facade composition.
 */
````

## File: src/modules/workspace/shared/errors/index.ts
````typescript
export class WorkspaceNotFoundError extends Error {
⋮----
constructor(workspaceId: string)
⋮----
export class WorkspaceMemberNotFoundError extends Error {
⋮----
constructor(memberId: string)
⋮----
export class WorkspaceQuotaExceededError extends Error {
⋮----
constructor(resourceKind: string)
⋮----
export class WorkspaceInvalidTransitionError extends Error {
⋮----
constructor(from: string, to: string)
````

## File: src/modules/workspace/shared/events/index.ts
````typescript
// Workspace cross-subdomain domain event type re-exports
````

## File: src/modules/workspace/shared/types/index.ts
````typescript
export type WorkspaceId = string & { readonly __brand: "WorkspaceId" };
export type ActorId = string & { readonly __brand: "ActorId" };
export type MemberId = string & { readonly __brand: "MemberId" };
⋮----
export interface WorkspaceReference {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name: string;
}
⋮----
export interface WorkspaceScopeProps {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly currentUserId?: string;
}
````

## File: src/modules/workspace/subdomains/activity/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/activity/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/activity/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/activity/application/dto/ActivityDTO.ts
````typescript
import { z } from "zod";
⋮----
export type RecordActivityDTO = z.infer<typeof RecordActivitySchema>;
````

## File: src/modules/workspace/subdomains/activity/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/activity/application/use-cases/ActivityUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { ActivityRepository } from "../../domain/repositories/ActivityRepository";
import { ActivityEvent } from "../../domain/entities/ActivityEvent";
import type { RecordActivityInput } from "../../domain/entities/ActivityEvent";
⋮----
export class RecordActivityUseCase {
⋮----
constructor(private readonly activityRepo: ActivityRepository)
⋮----
async execute(input: RecordActivityInput): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/activity/domain/entities/ActivityEvent.ts
````typescript
import { v4 as uuid } from "uuid";
import type { ActivityDomainEventType } from "../events/ActivityDomainEvent";
⋮----
export type ActivityEventType =
  | "task.created" | "task.status_changed" | "task.assigned"
  | "issue.opened" | "issue.resolved"
  | "member.added" | "member.removed"
  | "workspace.created" | "workspace.activated";
⋮----
export interface ActivityEventSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly activityType: ActivityEventType;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly occurredAtISO: string;
}
⋮----
export interface RecordActivityInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly activityType: ActivityEventType;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly metadata?: Record<string, unknown>;
}
⋮----
export class ActivityEvent {
⋮----
private constructor(private readonly _props: ActivityEventSnapshot)
⋮----
static record(id: string, input: RecordActivityInput): ActivityEvent
⋮----
static reconstitute(snapshot: ActivityEventSnapshot): ActivityEvent
⋮----
get id(): string
get workspaceId(): string
get activityType(): ActivityEventType
⋮----
getSnapshot(): Readonly<ActivityEventSnapshot>
⋮----
pullDomainEvents(): ActivityDomainEventType[]
````

## File: src/modules/workspace/subdomains/activity/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/api-key/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/api-key/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/api-key/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/api-key/application/dto/ApiKeyDTO.ts
````typescript
import { z } from "zod";
⋮----
export type CreateApiKeyDTO = z.infer<typeof CreateApiKeySchema>;
````

## File: src/modules/workspace/subdomains/api-key/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/api-key/application/use-cases/ApiKeyUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { ApiKeyRepository } from "../../domain/repositories/ApiKeyRepository";
import { ApiKey } from "../../domain/entities/ApiKey";
⋮----
export class GenerateApiKeyUseCase {
⋮----
constructor(private readonly keyRepo: ApiKeyRepository)
⋮----
async execute(workspaceId: string, actorId: string, label: string, expiresAtISO?: string): Promise<CommandResult>
⋮----
export class RevokeApiKeyUseCase {
⋮----
async execute(keyId: string): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/api-key/domain/entities/ApiKey.ts
````typescript
import { v4 as uuid } from "uuid";
import type { ApiKeyDomainEventType } from "../events/ApiKeyDomainEvent";
⋮----
export type ApiKeyStatus = "active" | "revoked";
⋮----
export interface ApiKeySnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly label: string;
  readonly keyPrefix: string;
  readonly keyHash: string;
  readonly status: ApiKeyStatus;
  readonly lastUsedAtISO: string | null;
  readonly expiresAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateApiKeyInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly label: string;
  readonly keyPrefix: string;
  readonly keyHash: string;
  readonly expiresAtISO?: string;
}
⋮----
export class ApiKey {
⋮----
private constructor(private _props: ApiKeySnapshot)
⋮----
static create(id: string, input: CreateApiKeyInput): ApiKey
⋮----
static reconstitute(snapshot: ApiKeySnapshot): ApiKey
⋮----
revoke(): void
⋮----
isExpired(): boolean
⋮----
get id(): string
get status(): ApiKeyStatus
⋮----
getSnapshot(): Readonly<ApiKeySnapshot>
⋮----
pullDomainEvents(): ApiKeyDomainEventType[]
````

## File: src/modules/workspace/subdomains/api-key/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/api-key/domain/value-objects/ApiKeyId.ts
````typescript
import { z } from "zod";
⋮----
export type ApiKeyId = z.infer<typeof ApiKeyIdSchema>;
⋮----
export function createApiKeyId(raw: string): ApiKeyId
````

## File: src/modules/workspace/subdomains/approval/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/approval/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/approval/adapters/outbound/index.ts
````typescript
// Approval subdomain delegates persistence to task/issue subdomains
````

## File: src/modules/workspace/subdomains/approval/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/approval/application/use-cases/ApprovalUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { ApprovalTaskRepository, ApprovalIssueRepository, ApprovalTaskStatus, ApprovalIssueStatus } from "../../domain/repositories/ApprovalRepository";
⋮----
function canTransitionTask(from: ApprovalTaskStatus, to: ApprovalTaskStatus): boolean
⋮----
function canTransitionIssue(from: ApprovalIssueStatus, to: ApprovalIssueStatus): boolean
⋮----
export class ApproveTaskAcceptanceUseCase {
⋮----
constructor(
async execute(taskId: string): Promise<CommandResult>
⋮----
export class SubmitIssueRetestUseCase {
⋮----
constructor(private readonly issueRepo: ApprovalIssueRepository)
async execute(issueId: string): Promise<CommandResult>
⋮----
export class PassIssueRetestUseCase {
⋮----
export class FailIssueRetestUseCase {
````

## File: src/modules/workspace/subdomains/approval/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/audit/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/audit/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/audit/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/audit/application/dto/AuditDTO.ts
````typescript
import { z } from "zod";
import { AUDIT_ACTIONS } from "../../domain/value-objects/AuditAction";
import { AUDIT_SEVERITIES } from "../../domain/value-objects/AuditSeverity";
⋮----
export type RecordAuditEntryDTO = z.infer<typeof RecordAuditEntrySchema>;
````

## File: src/modules/workspace/subdomains/audit/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/audit/application/use-cases/AuditUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { AuditRepository } from "../../domain/repositories/AuditRepository";
import { AuditEntry } from "../../domain/entities/AuditEntry";
import type { RecordAuditEntryInput } from "../../domain/entities/AuditEntry";
⋮----
export class RecordAuditEntryUseCase {
⋮----
constructor(private readonly auditRepo: AuditRepository)
⋮----
async execute(input: RecordAuditEntryInput): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/audit/domain/entities/AuditEntry.ts
````typescript
import { v4 as uuid } from "uuid";
import type { AuditAction } from "../value-objects/AuditAction";
import type { AuditSeverity } from "../value-objects/AuditSeverity";
import type { AuditDomainEventType } from "../events/AuditDomainEvent";
⋮----
export type AuditLogSource = "workspace" | "finance" | "notification" | "system";
⋮----
export interface ChangeRecord {
  readonly field: string;
  readonly oldValue: unknown;
  readonly newValue: unknown;
}
⋮----
export interface AuditEntrySnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly action: AuditAction;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly severity: AuditSeverity;
  readonly detail: string;
  readonly source: AuditLogSource;
  readonly changes: readonly ChangeRecord[];
  readonly recordedAtISO: string;
}
⋮----
export interface RecordAuditEntryInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly action: AuditAction;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly severity: AuditSeverity;
  readonly detail: string;
  readonly source: AuditLogSource;
  readonly changes?: readonly ChangeRecord[];
}
⋮----
export class AuditEntry {
⋮----
private constructor(private readonly _props: AuditEntrySnapshot)
⋮----
static record(id: string, input: RecordAuditEntryInput): AuditEntry
⋮----
static reconstitute(snapshot: AuditEntrySnapshot): AuditEntry
⋮----
isCritical(): boolean
⋮----
get id(): string
get workspaceId(): string
get actorId(): string
get action(): AuditAction
get severity(): AuditSeverity
get recordedAtISO(): string
⋮----
getSnapshot(): Readonly<AuditEntrySnapshot>
⋮----
pullDomainEvents(): AuditDomainEventType[]
````

## File: src/modules/workspace/subdomains/audit/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/audit/domain/value-objects/AuditAction.ts
````typescript
import { z } from "zod";
⋮----
export type AuditAction = z.infer<typeof AuditActionSchema>;
⋮----
export function createAuditAction(raw: string): AuditAction
````

## File: src/modules/workspace/subdomains/audit/domain/value-objects/AuditSeverity.ts
````typescript
import { z } from "zod";
⋮----
export type AuditSeverity = z.infer<typeof AuditSeveritySchema>;
⋮----
export function createAuditSeverity(raw: string): AuditSeverity
⋮----
export function severityLevel(severity: AuditSeverity): number
````

## File: src/modules/workspace/subdomains/feed/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/feed/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/feed/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/feed/application/dto/FeedDTO.ts
````typescript
import { z } from "zod";
⋮----
export type CreateFeedPostDTO = z.infer<typeof CreateFeedPostSchema>;
````

## File: src/modules/workspace/subdomains/feed/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/feed/application/use-cases/FeedUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { FeedPostRepository } from "../../domain/repositories/FeedPostRepository";
import { FeedPost } from "../../domain/entities/FeedPost";
import type { CreateFeedPostInput } from "../../domain/entities/FeedPost";
⋮----
export class CreateFeedPostUseCase {
⋮----
constructor(private readonly feedRepo: FeedPostRepository)
⋮----
async execute(input: CreateFeedPostInput): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/feed/domain/entities/FeedPost.ts
````typescript
import { v4 as uuid } from "uuid";
import type { FeedDomainEventType } from "../events/FeedDomainEvent";
⋮----
export type FeedPostType = "post" | "reply" | "repost";
⋮----
export interface FeedPostSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId: string;
  readonly authorAccountId: string;
  readonly type: FeedPostType;
  readonly content: string;
  readonly replyToPostId: string | null;
  readonly repostOfPostId: string | null;
  readonly likeCount: number;
  readonly replyCount: number;
  readonly repostCount: number;
  readonly viewCount: number;
  readonly bookmarkCount: number;
  readonly shareCount: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateFeedPostInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly authorAccountId: string;
  readonly content: string;
  readonly replyToPostId?: string;
  readonly repostOfPostId?: string;
}
⋮----
export class FeedPost {
⋮----
private constructor(private _props: FeedPostSnapshot)
⋮----
static create(id: string, input: CreateFeedPostInput): FeedPost
⋮----
static reconstitute(snapshot: FeedPostSnapshot): FeedPost
⋮----
get id(): string
get workspaceId(): string
⋮----
getSnapshot(): Readonly<FeedPostSnapshot>
⋮----
pullDomainEvents(): FeedDomainEventType[]
````

## File: src/modules/workspace/subdomains/feed/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/invitation/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/invitation/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/invitation/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/invitation/application/dto/InvitationDTO.ts
````typescript
import { z } from "zod";
⋮----
export type CreateInvitationDTO = z.infer<typeof CreateInvitationSchema>;
````

## File: src/modules/workspace/subdomains/invitation/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/invitation/application/use-cases/InvitationUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { InvitationRepository } from "../../domain/repositories/InvitationRepository";
import { WorkspaceInvitation } from "../../domain/entities/WorkspaceInvitation";
import type { CreateInvitationInput } from "../../domain/entities/WorkspaceInvitation";
⋮----
export class CreateInvitationUseCase {
⋮----
constructor(private readonly invitationRepo: InvitationRepository)
⋮----
async execute(input: CreateInvitationInput): Promise<CommandResult>
⋮----
export class AcceptInvitationUseCase {
⋮----
async execute(token: string): Promise<CommandResult>
⋮----
export class CancelInvitationUseCase {
⋮----
async execute(invitationId: string): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/invitation/domain/entities/WorkspaceInvitation.ts
````typescript
import { v4 as uuid } from "uuid";
import type { InvitationDomainEventType } from "../events/InvitationDomainEvent";
⋮----
export type InvitationStatus = "pending" | "accepted" | "rejected" | "expired" | "cancelled";
⋮----
export interface WorkspaceInvitationSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly invitedEmail: string;
  readonly invitedByActorId: string;
  readonly role: string;
  readonly status: InvitationStatus;
  readonly token: string;
  readonly expiresAtISO: string;
  readonly acceptedAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateInvitationInput {
  readonly workspaceId: string;
  readonly invitedEmail: string;
  readonly invitedByActorId: string;
  readonly role: string;
  readonly expiresAtISO: string;
}
⋮----
export class WorkspaceInvitation {
⋮----
private constructor(private _props: WorkspaceInvitationSnapshot)
⋮----
static create(id: string, input: CreateInvitationInput): WorkspaceInvitation
⋮----
static reconstitute(snapshot: WorkspaceInvitationSnapshot): WorkspaceInvitation
⋮----
accept(): void
⋮----
reject(): void
⋮----
cancel(): void
⋮----
get id(): string
get status(): InvitationStatus
get token(): string
⋮----
getSnapshot(): Readonly<WorkspaceInvitationSnapshot>
⋮----
pullDomainEvents(): InvitationDomainEventType[]
````

## File: src/modules/workspace/subdomains/invitation/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/issue/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/issue/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/issue/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/issue/application/dto/IssueDTO.ts
````typescript
import { z } from "zod";
import { ISSUE_STATUSES } from "../../domain/value-objects/IssueStatus";
import { ISSUE_STAGES } from "../../domain/value-objects/IssueStage";
⋮----
export type OpenIssueDTO = z.infer<typeof OpenIssueInputSchema>;
export type TransitionIssueDTO = z.infer<typeof TransitionIssueInputSchema>;
````

## File: src/modules/workspace/subdomains/issue/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/issue/application/use-cases/IssueUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { Issue } from "../../domain/entities/Issue";
import type { OpenIssueInput } from "../../domain/entities/Issue";
import { canTransitionIssueStatus } from "../../domain/value-objects/IssueStatus";
import type { IssueStatus } from "../../domain/value-objects/IssueStatus";
⋮----
export class OpenIssueUseCase {
⋮----
constructor(private readonly issueRepo: IssueRepository)
⋮----
async execute(input: OpenIssueInput): Promise<CommandResult>
⋮----
export class TransitionIssueStatusUseCase {
⋮----
async execute(issueId: string, to: IssueStatus): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/issue/domain/entities/Issue.ts
````typescript
import { v4 as uuid } from "uuid";
import type { IssueStatus } from "../value-objects/IssueStatus";
import { canTransitionIssueStatus } from "../value-objects/IssueStatus";
import type { IssueStage } from "../value-objects/IssueStage";
import type { IssueDomainEventType } from "../events/IssueDomainEvent";
⋮----
export interface IssueSnapshot {
  readonly id: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly title: string;
  readonly description: string;
  readonly status: IssueStatus;
  readonly createdBy: string;
  readonly assignedTo: string | null;
  readonly resolvedAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface OpenIssueInput {
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly title: string;
  readonly description?: string;
  readonly createdBy: string;
  readonly assignedTo?: string;
}
⋮----
export class Issue {
⋮----
private constructor(private _props: IssueSnapshot)
⋮----
static open(id: string, input: OpenIssueInput): Issue
⋮----
static reconstitute(snapshot: IssueSnapshot): Issue
⋮----
transition(to: IssueStatus): void
⋮----
get id(): string
get taskId(): string
get status(): IssueStatus
⋮----
getSnapshot(): Readonly<IssueSnapshot>
⋮----
pullDomainEvents(): IssueDomainEventType[]
````

## File: src/modules/workspace/subdomains/issue/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/issue/domain/value-objects/IssueId.ts
````typescript
import { z } from "zod";
⋮----
export type IssueId = z.infer<typeof IssueIdSchema>;
⋮----
export function createIssueId(raw: string): IssueId
````

## File: src/modules/workspace/subdomains/lifecycle/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/lifecycle/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/lifecycle/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/lifecycle/application/dto/WorkspaceDTO.ts
````typescript
import { z } from "zod";
⋮----
export type CreateWorkspaceDTO = z.infer<typeof CreateWorkspaceInputSchema>;
export type UpdateWorkspaceSettingsDTO = z.infer<typeof UpdateWorkspaceSettingsSchema>;
````

## File: src/modules/workspace/subdomains/lifecycle/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/lifecycle/application/use-cases/WorkspaceLifecycleUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository";
import { Workspace } from "../../domain/entities/Workspace";
import type { CreateWorkspaceInput } from "../../domain/entities/Workspace";
⋮----
export class CreateWorkspaceUseCase {
⋮----
constructor(private readonly workspaceRepo: WorkspaceRepository)
⋮----
async execute(input: CreateWorkspaceInput): Promise<CommandResult>
⋮----
export class ActivateWorkspaceUseCase {
⋮----
async execute(workspaceId: string): Promise<CommandResult>
⋮----
export class StopWorkspaceUseCase {
⋮----
export class DeleteWorkspaceUseCase {
````

## File: src/modules/workspace/subdomains/lifecycle/domain/entities/Workspace.ts
````typescript
import { v4 as uuid } from "uuid";
import type { WorkspaceDomainEventType } from "../events/WorkspaceDomainEvent";
⋮----
export type WorkspaceLifecycleState = "preparatory" | "active" | "stopped";
⋮----
export function canTransitionLifecycle(from: WorkspaceLifecycleState, to: WorkspaceLifecycleState): boolean
⋮----
export type WorkspaceVisibility = "private" | "internal" | "public";
⋮----
export interface WorkspaceSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly accountType: "user" | "organization";
  readonly name: string;
  readonly lifecycleState: WorkspaceLifecycleState;
  readonly visibility: WorkspaceVisibility;
  readonly photoURL: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateWorkspaceInput {
  readonly accountId: string;
  readonly accountType: "user" | "organization";
  readonly name: string;
  readonly visibility?: WorkspaceVisibility;
  readonly photoURL?: string;
}
⋮----
export class Workspace {
⋮----
private constructor(private _props: WorkspaceSnapshot)
⋮----
static create(id: string, input: CreateWorkspaceInput): Workspace
⋮----
static reconstitute(snapshot: WorkspaceSnapshot): Workspace
⋮----
activate(): void
⋮----
stop(): void
⋮----
updateSettings(input:
⋮----
get id(): string
get lifecycleState(): WorkspaceLifecycleState
get name(): string
⋮----
getSnapshot(): Readonly<WorkspaceSnapshot>
⋮----
pullDomainEvents(): WorkspaceDomainEventType[]
````

## File: src/modules/workspace/subdomains/lifecycle/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/membership/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/membership/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/membership/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/membership/application/dto/MembershipDTO.ts
````typescript
import { z } from "zod";
import { MEMBER_ROLES } from "../../domain/entities/WorkspaceMember";
⋮----
export type AddMemberDTO = z.infer<typeof AddMemberInputSchema>;
export type ChangeMemberRoleDTO = z.infer<typeof ChangeMemberRoleSchema>;
````

## File: src/modules/workspace/subdomains/membership/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/membership/application/use-cases/MembershipUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { WorkspaceMemberRepository } from "../../domain/repositories/WorkspaceMemberRepository";
import { WorkspaceMember } from "../../domain/entities/WorkspaceMember";
import type { AddMemberInput, MemberRole } from "../../domain/entities/WorkspaceMember";
⋮----
export class AddMemberUseCase {
⋮----
constructor(private readonly memberRepo: WorkspaceMemberRepository)
⋮----
async execute(input: AddMemberInput): Promise<CommandResult>
⋮----
export class ChangeMemberRoleUseCase {
⋮----
async execute(memberId: string, role: MemberRole): Promise<CommandResult>
⋮----
export class RemoveMemberUseCase {
⋮----
async execute(memberId: string): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/membership/domain/entities/WorkspaceMember.ts
````typescript
import { v4 as uuid } from "uuid";
import type { MembershipDomainEventType } from "../events/MembershipDomainEvent";
⋮----
export type MemberRole = "owner" | "admin" | "member" | "guest";
⋮----
export type MembershipStatus = "active" | "suspended" | "removed";
⋮----
export interface WorkspaceMemberSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly role: MemberRole;
  readonly status: MembershipStatus;
  readonly displayName: string;
  readonly email: string | null;
  readonly joinedAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface AddMemberInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly role: MemberRole;
  readonly displayName: string;
  readonly email?: string;
}
⋮----
export class WorkspaceMember {
⋮----
private constructor(private _props: WorkspaceMemberSnapshot)
⋮----
static add(id: string, input: AddMemberInput): WorkspaceMember
⋮----
static reconstitute(snapshot: WorkspaceMemberSnapshot): WorkspaceMember
⋮----
changeRole(role: MemberRole): void
⋮----
remove(): void
⋮----
get id(): string
get workspaceId(): string
get role(): MemberRole
⋮----
getSnapshot(): Readonly<WorkspaceMemberSnapshot>
⋮----
pullDomainEvents(): MembershipDomainEventType[]
````

## File: src/modules/workspace/subdomains/membership/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/orchestration/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/orchestration/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/orchestration/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/orchestration/application/dto/OrchestrationDTO.ts
````typescript
import { z } from "zod";
⋮----
export type CreateJobDTO = z.infer<typeof CreateJobInputSchema>;
````

## File: src/modules/workspace/subdomains/orchestration/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/orchestration/application/use-cases/OrchestrationUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { TaskMaterializationJobRepository } from "../../domain/repositories/TaskMaterializationJobRepository";
import { TaskMaterializationJob } from "../../domain/entities/TaskMaterializationJob";
import type { CreateJobInput } from "../../domain/entities/TaskMaterializationJob";
⋮----
export class CreateMaterializationJobUseCase {
⋮----
constructor(private readonly jobRepo: TaskMaterializationJobRepository)
⋮----
async execute(input: CreateJobInput): Promise<CommandResult>
⋮----
export class StartMaterializationJobUseCase {
⋮----
async execute(jobId: string): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/orchestration/domain/entities/TaskMaterializationJob.ts
````typescript
import { v4 as uuid } from "uuid";
import type { JobDomainEventType } from "../events/JobDomainEvent";
⋮----
export type JobStatus = "queued" | "running" | "partially_succeeded" | "succeeded" | "failed" | "cancelled";
⋮----
export interface TaskMaterializationJobSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
  readonly totalItems: number;
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
  readonly status: JobStatus;
  readonly startedAtISO: string | null;
  readonly completedAtISO: string | null;
  readonly errorCode: string | null;
  readonly errorMessage: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateJobInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
}
⋮----
export interface CompleteJobInput {
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
}
⋮----
export class TaskMaterializationJob {
⋮----
private constructor(private _props: TaskMaterializationJobSnapshot)
⋮----
static create(id: string, input: CreateJobInput): TaskMaterializationJob
⋮----
static reconstitute(snapshot: TaskMaterializationJobSnapshot): TaskMaterializationJob
⋮----
markRunning(): void
⋮----
markCompleted(input: CompleteJobInput): void
⋮----
markFailed(errorCode: string, errorMessage: string): void
⋮----
get id(): string
get status(): JobStatus
⋮----
getSnapshot(): Readonly<TaskMaterializationJobSnapshot>
⋮----
pullDomainEvents(): JobDomainEventType[]
````

## File: src/modules/workspace/subdomains/orchestration/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/quality/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/quality/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/quality/adapters/outbound/index.ts
````typescript
// Quality subdomain delegates persistence to task subdomain
````

## File: src/modules/workspace/subdomains/quality/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/quality/application/use-cases/QualityUseCases.ts
````typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { QualityTaskRepository, QualityTaskStatus } from "../../domain/repositories/QualityTaskRepository";
⋮----
function canTransition(from: QualityTaskStatus, to: QualityTaskStatus): boolean
⋮----
export class SubmitTaskToQaUseCase {
⋮----
constructor(private readonly taskRepo: QualityTaskRepository)
async execute(taskId: string): Promise<CommandResult>
⋮----
export class PassTaskQaUseCase {
````

## File: src/modules/workspace/subdomains/quality/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/resource/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/resource/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/resource/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/resource/application/dto/ResourceDTO.ts
````typescript
import { z } from "zod";
import { RESOURCE_KINDS } from "../../domain/entities/ResourceQuota";
⋮----
export type ProvisionQuotaDTO = z.infer<typeof ProvisionQuotaSchema>;
export type ConsumeQuotaDTO = z.infer<typeof ConsumeQuotaSchema>;
````

## File: src/modules/workspace/subdomains/resource/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/resource/application/use-cases/ResourceUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { ResourceQuotaRepository } from "../../domain/repositories/ResourceQuotaRepository";
import { ResourceQuota } from "../../domain/entities/ResourceQuota";
import type { ProvisionResourceQuotaInput, ResourceKind } from "../../domain/entities/ResourceQuota";
⋮----
export class ProvisionResourceQuotaUseCase {
⋮----
constructor(private readonly quotaRepo: ResourceQuotaRepository)
⋮----
async execute(input: ProvisionResourceQuotaInput): Promise<CommandResult>
⋮----
export class ConsumeResourceQuotaUseCase {
⋮----
async execute(workspaceId: string, resourceKind: ResourceKind, amount: number): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/resource/domain/entities/ResourceQuota.ts
````typescript
import { v4 as uuid } from "uuid";
import type { ResourceQuotaDomainEventType } from "../events/ResourceQuotaDomainEvent";
⋮----
export type ResourceKind =
  | "members"
  | "storage_bytes"
  | "ai_requests_monthly"
  | "tasks"
  | "workspaces";
⋮----
export interface ResourceQuotaSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly resourceKind: ResourceKind;
  readonly limit: number;
  readonly current: number;
  readonly reservedAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface ProvisionResourceQuotaInput {
  readonly workspaceId: string;
  readonly resourceKind: ResourceKind;
  readonly limit: number;
}
⋮----
export class ResourceQuota {
⋮----
private constructor(private _props: ResourceQuotaSnapshot)
⋮----
static provision(id: string, input: ProvisionResourceQuotaInput): ResourceQuota
⋮----
static reconstitute(snapshot: ResourceQuotaSnapshot): ResourceQuota
⋮----
consume(amount: number): void
⋮----
release(amount: number): void
⋮----
isExceeded(): boolean
⋮----
get id(): string
get workspaceId(): string
get resourceKind(): ResourceKind
get limit(): number
get current(): number
⋮----
getSnapshot(): Readonly<ResourceQuotaSnapshot>
⋮----
pullDomainEvents(): ResourceQuotaDomainEventType[]
````

## File: src/modules/workspace/subdomains/resource/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/schedule/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/schedule/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/schedule/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/schedule/application/dto/ScheduleDTO.ts
````typescript
import { z } from "zod";
import { DEMAND_PRIORITIES } from "../../domain/entities/WorkDemand";
⋮----
export type CreateWorkDemandDTO = z.infer<typeof CreateWorkDemandSchema>;
````

## File: src/modules/workspace/subdomains/schedule/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/schedule/application/use-cases/ScheduleUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { DemandRepository } from "../../domain/repositories/DemandRepository";
import { WorkDemand } from "../../domain/entities/WorkDemand";
import type { CreateWorkDemandInput } from "../../domain/entities/WorkDemand";
⋮----
export class CreateWorkDemandUseCase {
⋮----
constructor(private readonly demandRepo: DemandRepository)
⋮----
async execute(input: CreateWorkDemandInput): Promise<CommandResult>
⋮----
export class AssignWorkDemandUseCase {
⋮----
async execute(demandId: string, assignedUserId: string): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/schedule/domain/entities/WorkDemand.ts
````typescript
import { v4 as uuid } from "uuid";
import type { ScheduleDomainEventType } from "../events/ScheduleDomainEvent";
⋮----
export type DemandStatus = "draft" | "open" | "in_progress" | "completed";
export type DemandPriority = "low" | "medium" | "high";
⋮----
export interface WorkDemandSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly requesterId: string;
  readonly title: string;
  readonly description: string;
  readonly status: DemandStatus;
  readonly priority: DemandPriority;
  readonly scheduledAt: string;
  readonly assignedUserId: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateWorkDemandInput {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly requesterId: string;
  readonly title: string;
  readonly description: string;
  readonly priority: DemandPriority;
  readonly scheduledAt: string;
}
⋮----
export class WorkDemand {
⋮----
private constructor(private _props: WorkDemandSnapshot)
⋮----
static create(id: string, input: CreateWorkDemandInput): WorkDemand
⋮----
static reconstitute(snapshot: WorkDemandSnapshot): WorkDemand
⋮----
assign(userId: string): void
⋮----
get id(): string
get workspaceId(): string
get status(): DemandStatus
⋮----
getSnapshot(): Readonly<WorkDemandSnapshot>
⋮----
pullDomainEvents(): ScheduleDomainEventType[]
````

## File: src/modules/workspace/subdomains/schedule/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/settlement/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/settlement/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/settlement/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/settlement/application/dto/SettlementDTO.ts
````typescript
import { z } from "zod";
import { INVOICE_STATUSES } from "../../domain/value-objects/InvoiceStatus";
⋮----
export type CreateInvoiceDTO = z.infer<typeof CreateInvoiceSchema>;
export type TransitionInvoiceDTO = z.infer<typeof TransitionInvoiceSchema>;
````

## File: src/modules/workspace/subdomains/settlement/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/settlement/application/use-cases/SettlementUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { Invoice } from "../../domain/entities/Invoice";
import { canTransitionInvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import type { InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
⋮----
export class CreateInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepo: InvoiceRepository)
⋮----
async execute(workspaceId: string): Promise<CommandResult>
⋮----
export class TransitionInvoiceStatusUseCase {
⋮----
async execute(invoiceId: string, to: InvoiceStatus): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/settlement/domain/entities/Invoice.ts
````typescript
import { v4 as uuid } from "uuid";
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
import { canTransitionInvoiceStatus } from "../value-objects/InvoiceStatus";
import type { InvoiceDomainEventType } from "../events/InvoiceDomainEvent";
⋮----
export interface InvoiceSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly status: InvoiceStatus;
  readonly totalAmount: number;
  readonly submittedAtISO: string | null;
  readonly approvedAtISO: string | null;
  readonly paidAtISO: string | null;
  readonly closedAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateInvoiceInput {
  readonly workspaceId: string;
}
⋮----
export class Invoice {
⋮----
private constructor(private _props: InvoiceSnapshot)
⋮----
static create(id: string, input: CreateInvoiceInput): Invoice
⋮----
static reconstitute(snapshot: InvoiceSnapshot): Invoice
⋮----
transition(to: InvoiceStatus): void
⋮----
get id(): string
get status(): InvoiceStatus
⋮----
getSnapshot(): Readonly<InvoiceSnapshot>
⋮----
pullDomainEvents(): InvoiceDomainEventType[]
````

## File: src/modules/workspace/subdomains/settlement/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/share/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/share/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/share/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/share/application/dto/ShareDTO.ts
````typescript
import { z } from "zod";
import { SHARE_SCOPES } from "../../domain/entities/WorkspaceShare";
⋮----
export type GrantShareDTO = z.infer<typeof GrantShareSchema>;
````

## File: src/modules/workspace/subdomains/share/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/share/application/use-cases/ShareUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { WorkspaceShareRepository } from "../../domain/repositories/WorkspaceShareRepository";
import { WorkspaceShare } from "../../domain/entities/WorkspaceShare";
import type { GrantShareInput } from "../../domain/entities/WorkspaceShare";
⋮----
export class GrantWorkspaceShareUseCase {
⋮----
constructor(private readonly shareRepo: WorkspaceShareRepository)
⋮----
async execute(input: GrantShareInput): Promise<CommandResult>
⋮----
export class RevokeWorkspaceShareUseCase {
⋮----
async execute(shareId: string): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/share/domain/entities/WorkspaceShare.ts
````typescript
import { v4 as uuid } from "uuid";
import type { ShareDomainEventType } from "../events/ShareDomainEvent";
⋮----
export type ShareScope = "read" | "write" | "admin";
⋮----
export interface WorkspaceShareSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly grantedToId: string;
  readonly grantedToType: "user" | "team";
  readonly scope: ShareScope;
  readonly grantedByActorId: string;
  readonly expiresAtISO: string | null;
  readonly createdAtISO: string;
}
⋮----
export interface GrantShareInput {
  readonly workspaceId: string;
  readonly grantedToId: string;
  readonly grantedToType: "user" | "team";
  readonly scope: ShareScope;
  readonly grantedByActorId: string;
  readonly expiresAtISO?: string;
}
⋮----
export class WorkspaceShare {
⋮----
private constructor(private readonly _props: WorkspaceShareSnapshot)
⋮----
static grant(id: string, input: GrantShareInput): WorkspaceShare
⋮----
static reconstitute(snapshot: WorkspaceShareSnapshot): WorkspaceShare
⋮----
isExpired(): boolean
⋮----
get id(): string
get workspaceId(): string
get scope(): ShareScope
⋮----
getSnapshot(): Readonly<WorkspaceShareSnapshot>
⋮----
pullDomainEvents(): ShareDomainEventType[]
````

## File: src/modules/workspace/subdomains/share/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task-formation/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task-formation/adapters/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task-formation/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task-formation/application/dto/TaskFormationDTO.ts
````typescript
import { z } from "zod";
⋮----
export type CreateTaskFormationJobDTO = z.infer<typeof CreateTaskFormationJobSchema>;
````

## File: src/modules/workspace/subdomains/task-formation/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task-formation/application/use-cases/TaskFormationUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { TaskFormationJobRepository } from "../../domain/repositories/TaskFormationJobRepository";
import { TaskFormationJob } from "../../domain/entities/TaskFormationJob";
import type { CreateTaskFormationJobInput, CompleteTaskFormationJobInput } from "../../domain/entities/TaskFormationJob";
⋮----
export class CreateTaskFormationJobUseCase {
⋮----
constructor(private readonly jobRepo: TaskFormationJobRepository)
⋮----
async execute(input: CreateTaskFormationJobInput): Promise<CommandResult>
⋮----
export class CompleteTaskFormationJobUseCase {
⋮----
async execute(jobId: string, input: CompleteTaskFormationJobInput): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/task-formation/domain/entities/TaskFormationJob.ts
````typescript
import { v4 as uuid } from "uuid";
import type { TaskFormationJobStatus } from "../value-objects/TaskFormationJobStatus";
import type { TaskFormationDomainEventType } from "../events/TaskFormationDomainEvent";
⋮----
export interface TaskFormationJobSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
  readonly totalItems: number;
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
  readonly status: TaskFormationJobStatus;
  readonly startedAtISO: string | null;
  readonly completedAtISO: string | null;
  readonly errorCode: string | null;
  readonly errorMessage: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateTaskFormationJobInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
}
⋮----
export interface CompleteTaskFormationJobInput {
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
}
⋮----
export class TaskFormationJob {
⋮----
private constructor(private _props: TaskFormationJobSnapshot)
⋮----
static create(id: string, input: CreateTaskFormationJobInput): TaskFormationJob
⋮----
static reconstitute(snapshot: TaskFormationJobSnapshot): TaskFormationJob
⋮----
markRunning(): void
⋮----
markCompleted(input: CompleteTaskFormationJobInput): void
⋮----
markFailed(errorCode: string, errorMessage: string): void
⋮----
get id(): string
get status(): TaskFormationJobStatus
⋮----
getSnapshot(): Readonly<TaskFormationJobSnapshot>
⋮----
pullDomainEvents(): TaskFormationDomainEventType[]
````

## File: src/modules/workspace/subdomains/task-formation/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task/adapters/inbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task/adapters/outbound/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task/application/dto/TaskDTO.ts
````typescript
import { z } from "zod";
import { TASK_STATUSES } from "../../domain/value-objects/TaskStatus";
⋮----
export type CreateTaskDTO = z.infer<typeof CreateTaskInputSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskInputSchema>;
export type TransitionTaskDTO = z.infer<typeof TransitionTaskInputSchema>;
````

## File: src/modules/workspace/subdomains/task/application/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task/application/use-cases/TaskUseCases.ts
````typescript
import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { Task } from "../../domain/entities/Task";
import type { CreateTaskInput, UpdateTaskInput } from "../../domain/entities/Task";
import { canTransitionTaskStatus } from "../../domain/value-objects/TaskStatus";
import type { TaskStatus } from "../../domain/value-objects/TaskStatus";
⋮----
export class CreateTaskUseCase {
⋮----
constructor(private readonly taskRepo: TaskRepository)
⋮----
async execute(input: CreateTaskInput): Promise<CommandResult>
⋮----
export class UpdateTaskUseCase {
⋮----
async execute(taskId: string, input: UpdateTaskInput): Promise<CommandResult>
⋮----
export class TransitionTaskStatusUseCase {
⋮----
async execute(taskId: string, to: TaskStatus): Promise<CommandResult>
⋮----
export class DeleteTaskUseCase {
⋮----
async execute(taskId: string): Promise<CommandResult>
````

## File: src/modules/workspace/subdomains/task/domain/entities/Task.ts
````typescript
import { v4 as uuid } from "uuid";
import type { TaskStatus } from "../value-objects/TaskStatus";
import { canTransitionTaskStatus } from "../value-objects/TaskStatus";
import type { TaskDomainEventType } from "../events/TaskDomainEvent";
⋮----
export interface SourceReference {
  readonly knowledgePageId: string;
  readonly knowledgePageTitle: string;
  readonly sourceBlockId?: string;
  readonly sourceSnippet?: string;
}
⋮----
export interface TaskSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly assigneeId: string | null;
  readonly dueDateISO: string | null;
  readonly acceptedAtISO: string | null;
  readonly archivedAtISO: string | null;
  readonly sourceReference: SourceReference | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateTaskInput {
  readonly workspaceId: string;
  readonly title: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
  readonly sourceReference?: SourceReference;
}
⋮----
export interface UpdateTaskInput {
  readonly title?: string;
  readonly description?: string;
  readonly assigneeId?: string | null;
  readonly dueDateISO?: string | null;
}
⋮----
export class Task {
⋮----
private constructor(private _props: TaskSnapshot)
⋮----
static create(id: string, input: CreateTaskInput): Task
⋮----
static reconstitute(snapshot: TaskSnapshot): Task
⋮----
update(input: UpdateTaskInput): void
⋮----
transition(to: TaskStatus): void
⋮----
get id(): string
get workspaceId(): string
get title(): string
get description(): string
get status(): TaskStatus
get assigneeId(): string | null
⋮----
getSnapshot(): Readonly<TaskSnapshot>
⋮----
pullDomainEvents(): TaskDomainEventType[]
````

## File: src/modules/workspace/subdomains/task/domain/index.ts
````typescript

````

## File: src/modules/workspace/subdomains/task/domain/value-objects/TaskId.ts
````typescript
import { z } from "zod";
⋮----
export type TaskId = z.infer<typeof TaskIdSchema>;
⋮----
export function createTaskId(raw: string): TaskId
````

## File: src/modules/workspace/adapters/inbound/react/workspace-ui-stubs.tsx
````typescript
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Brain,
  CalendarDays,
  FileText,
  FolderOpen,
  Home,
  MessageSquare,
  Notebook,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Badge } from "@ui-shadcn/ui/badge";
⋮----
import type { WorkspaceEntity } from "./WorkspaceContext";
import { useWorkspaceContext } from "./WorkspaceContext";
import { createClientWorkspaceLifecycleUseCases } from "../../outbound/firebase-composition";
⋮----
export interface NavPreferences {
  readonly pinnedWorkspace: string[];
  readonly pinnedPersonal: string[];
  readonly showLimitedWorkspaces: boolean;
  readonly maxWorkspaces: number;
}
⋮----
export type SidebarLocaleBundle = Record<string, string>;
⋮----
type WorkspaceTabValue =
  | "Overview"
  | "Daily"
  | "Schedule"
  | "Audit"
  | "Files"
  | "Members"
  | "Knowledge"
  | "Notebook"
  | "AiChat"
  | "WorkspaceSettings";
⋮----
interface WorkspaceTabItem {
  id: string;
  value: WorkspaceTabValue;
  label: string;
}
⋮----
function resolveWorkspaceTabValue(value: string | null | undefined): WorkspaceTabValue | null
⋮----
function sanitizeNavPreferences(input: Partial<NavPreferences> | null | undefined): NavPreferences
⋮----
function writeNavPreferences(prefs: NavPreferences): void
⋮----
export function readNavPreferences(): NavPreferences
⋮----
export function supportsWorkspaceSearchContext(pathname: string): boolean
⋮----
export function getWorkspaceIdFromPath(pathname: string): string | null
⋮----
export function appendWorkspaceContextQuery(
  href: string,
  context: { accountId: string | null; workspaceId: string | null },
): string
⋮----
interface WorkspaceQuickAccessMatcherOptions {
  panel: string | null;
  tab: string | null;
}
⋮----
interface WorkspaceQuickAccessItem {
  id: string;
  href: string;
  label: string;
  icon: ReactNode;
  isActive?: (pathname: string, options?: WorkspaceQuickAccessMatcherOptions) => boolean;
}
⋮----
export function buildWorkspaceQuickAccessItems(
  workspaceId: string,
  accountId: string | undefined,
): WorkspaceQuickAccessItem[]
⋮----
interface WorkspaceLink {
  id: string;
  name: string;
  href: string;
}
⋮----
function getRecentStorageKey(accountId: string): string
⋮----
function readRecentWorkspaceIds(accountId: string): string[]
⋮----
function persistRecentWorkspaceIds(accountId: string, workspaceIds: string[]): void
⋮----
function trackWorkspaceFromPath(pathname: string, accountId: string): void
⋮----
export function useRecentWorkspaces(
  accountId: string | undefined,
  pathname: string,
  workspaces: WorkspaceEntity[],
):
⋮----
export function useSidebarLocale(): SidebarLocaleBundle | null
⋮----
interface WorkspaceQuickAccessRowProps {
  items: WorkspaceQuickAccessItem[];
  pathname: string;
  currentPanel: string | null;
  currentWorkspaceTab: string | null;
  workspaceSettingsHref: string;
  isActiveRoute: (href: string) => boolean;
}
⋮----
className=
⋮----
onSelectWorkspace(workspace.id);
⋮----
setDraft((prev) => (
⋮----
setDraft(DEFAULT_NAV_PREFS);
⋮----
function reset()
⋮----
async function handleSubmit(event: FormEvent<HTMLFormElement>)
⋮----
onOpenChange(isOpen);
⋮----
reset();
onOpenChange(false);
⋮----
if (!accountsHydrated || !workspaceState.workspacesHydrated)
⋮----
<Badge variant=
⋮----
onClick=
⋮----
router.push(href);
⋮----
return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Teams (stub)
    </div>
  ) as React.ReactElement;
````

## File: src/modules/workspace/adapters/inbound/react/WorkspaceScopeProvider.tsx
````typescript
/**
 * WorkspaceScopeProvider — workspace inbound adapter (React).
 *
 * Canonical workspace scope provider for the src/ layer.
 *
 * Responsibilities:
 *  1. Mount a WorkspaceContextProvider (holds workspace state + dispatch).
 *  2. Subscribe to real-time Firestore workspace updates for the currently
 *     active account (via the outbound Firebase composition root).
 *  3. Dispatch SET_WORKSPACES when data arrives; RESET when the account is
 *     cleared (e.g. on sign-out).
 *
 * Design notes:
 *  - The subscription is managed by an inner WorkspaceSubscription component so
 *    the effect only re-runs when activeAccountId changes, not on every render.
 *  - WorkspaceScopeProvider reads the active account from AccountScopeProvider
 *    (useApp). The dependency direction workspace → platform is correct:
 *    platform is upstream of workspace.
 *  - The composition root (PlatformBootstrap) mounts WorkspaceScopeProvider
 *    inside AccountScopeProvider, so useApp() is always available here.
 */
⋮----
import { type ReactNode } from "react";
import { useEffect } from "react";
⋮----
import { WorkspaceContextProvider, useWorkspaceContext } from "./WorkspaceContext";
import { useApp } from "../../../../platform/adapters/inbound/react/AppContext";
import { subscribeToWorkspacesForAccount } from "../../outbound/firebase-composition";
⋮----
// ── WorkspaceSubscription ─────────────────────────────────────────────────────
// Isolated inner component so the subscription effect's dependency array is
// minimal — only activeAccountId triggers a new subscription, not the full
// app state object.
⋮----
function WorkspaceSubscription(
⋮----
// ── WorkspaceScopeProvider ────────────────────────────────────────────────────
⋮----
export function WorkspaceScopeProvider(
````

## File: src/modules/workspace/adapters/outbound/firebase-composition.ts
````typescript
/**
 * firebase-composition — workspace module outbound composition root.
 *
 * Single entry point for all Firebase operations owned by the workspace module.
 * Mirrors the pattern established by iam/adapters/outbound/firebase-composition.ts.
 *
 * ESLint: @integration-firebase is allowed here because this file lives at
 * src/modules/workspace/adapters/outbound/ which matches the permitted glob
 * (src/modules/<context>/adapters/outbound/**).
 *
 * Consumers (e.g. WorkspaceScopeProvider) import from this file — they must not
 * import directly from FirebaseWorkspaceQueryRepository or firebase/firestore.
 */
⋮----
import {
  FirebaseWorkspaceQueryRepository,
  type Unsubscribe,
} from "./FirebaseWorkspaceQueryRepository";
import type { WorkspaceSnapshot } from "../../subdomains/lifecycle/domain/entities/Workspace";
import {
  getFirebaseFirestore,
  firestoreApi,
} from "@integration-firebase";
import {
  FirestoreWorkspaceRepository,
  type FirestoreLike,
} from "../../subdomains/lifecycle/adapters/outbound/firestore/FirestoreWorkspaceRepository";
import {
  CreateWorkspaceUseCase,
  ActivateWorkspaceUseCase,
  StopWorkspaceUseCase,
} from "../../subdomains/lifecycle/application/use-cases/WorkspaceLifecycleUseCases";
⋮----
type FirestoreWhereOperator =
  | "<"
  | "<="
  | "=="
  | "!="
  | ">="
  | ">"
  | "array-contains"
  | "in"
  | "array-contains-any"
  | "not-in";
⋮----
// ── Singleton repository ───────────────────────────────────────────────────────
⋮----
function getWorkspaceQueryRepo(): FirebaseWorkspaceQueryRepository
⋮----
function createFirestoreLikeAdapter(): FirestoreLike
⋮----
async get(collectionName: string, id: string): Promise<Record<string, unknown> | null>
async set(
      collectionName: string,
      id: string,
      data: Record<string, unknown>,
): Promise<void>
async delete(collectionName: string, id: string): Promise<void>
async query(
      collectionName: string,
      filters: Array<{ field: string; op: string; value: unknown }>,
): Promise<Record<string, unknown>[]>
⋮----
function getWorkspaceLifecycleRepo(): FirestoreWorkspaceRepository
⋮----
// ── Public subscriptions ───────────────────────────────────────────────────────
⋮----
/**
 * Subscribes to real-time workspace updates for the given account.
 * Calls `onUpdate` immediately with the current dataset and again on every
 * subsequent Firestore change.
 *
 * Returns an unsubscribe function — call it when the subscriber unmounts to
 * avoid memory leaks and unnecessary Firestore reads.
 */
export function subscribeToWorkspacesForAccount(
  accountId: string,
  onUpdate: (workspaces: Record<string, WorkspaceSnapshot>) => void,
): Unsubscribe
⋮----
export function createClientWorkspaceLifecycleUseCases()
````

## File: src/modules/workspace/README.md
````markdown
# Workspace Module

> `workspace-workflow` 子域已移除（2026-04-15）。其能力已分散至 task、issue、settlement、approval、quality、orchestration、task-formation。

## 子域清單（名詞域）

> **子域設計原則：** 每個子域以**名詞**命名（`approval` 不用 `approve`；`schedule` 不用 `scheduling`；`share` 不用 `sharing`）。

| 子域 | 狀態 | 說明 |
|---|---|---|
| `activity` | 🔨 骨架建立，實作進行中 | 活動記錄實體 |
| `api-key` | 🔨 骨架建立，實作進行中 | API 金鑰生命週期 |
| `approval` | 🔨 骨架建立，實作進行中 | 審批實體（審批流程與決策記錄）|
| `audit` | 🔨 骨架建立，實作進行中 | 稽核紀錄實體 |
| `feed` | 🔨 骨架建立，實作進行中 | 活動動態實體 |
| `invitation` | 🔨 骨架建立，實作進行中 | 邀請實體（邀請連結、邀請狀態）|
| `issue` | 🔨 骨架建立，實作進行中 | 議題實體（議題管理）|
| `lifecycle` | 🔨 骨架建立，實作進行中 | 生命週期實體（工作區生命週期）|
| `membership` | 🔨 骨架建立，實作進行中 | 成員資格實體（Membership）|
| `orchestration` | 🔨 骨架建立，實作進行中 | 跨子域編排（原 workspace-workflow）|
| `quality` | 🔨 骨架建立，實作進行中 | 品質管控實體 |
| `resource` | 🔨 骨架建立，實作進行中 | 資源實體（工作區資源配額與管理）|
| `schedule` | 🔨 骨架建立，實作進行中 | 排程實體 |
| `settlement` | 🔨 骨架建立，實作進行中 | 結算實體 |
| `share` | 🔨 骨架建立，實作進行中 | 分享實體（對外發布）|
| `task` | 🔨 骨架建立，實作進行中 | 任務實體（任務管理）|
| `task-formation` | 🔨 骨架建立，實作進行中 | 任務生成實體（AI 輔助 + 使用者確認流程）|

---

## 目錄結構

```
src/modules/workspace/
  index.ts
  README.md
  AGENT.md
  orchestration/
    WorkspaceFacade.ts
    WorkspaceCoordinator.ts     ← 跨子域流程（task→settlement 等）
  shared/
    domain/index.ts             ← WorkspaceId、MembershipRef 等共用 VO
    events/index.ts             ← Published Language Events
    types/index.ts
  subdomains/
    lifecycle/
      domain/
      application/
      adapters/outbound/
    task/
    issue/
    membership/
    orchestration/
    activity/
    api-key/
    approval/
    invitation/
    resource/
    settlement/
    quality/
    task-formation/
    schedule/
    share/
    feed/
    audit/
```

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 新建或恢復 `workspace-workflow` 子域 | 已拆解，禁止回歸 |
| 使用 `approve` / `scheduling` / `sharing` 作為子域名 | 已更正為名詞（`approval` / `schedule` / `share`）|
| 混用 Membership（工作區參與）與 Actor（身份）術語 | 違反 Ubiquitous Language |
| workspace 直接呼叫 Firestore | 必須透過 `src/modules/platform/index.ts`（FileAPI、PermissionAPI）|

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
````

## File: src/modules/workspace/AGENT.md
````markdown
# Workspace Module — Agent Guide

## Purpose

`src/modules/workspace` 是 **Workspace 協作容器能力模組**，為 Xuanwu 系統提供任務（Task）、議題（Issue）、生命週期（Lifecycle）、編排（Orchestration）、成員資格（Membership）等工作區協作能力的實作落點。

> **注意：** `workspace-workflow` 子域已移除（2026-04-15）。其能力已分散至 task、issue、settlement、approval、quality、orchestration、task-formation 七個子域。

## 子域清單（名詞域）

| 子域 | 說明 | 狀態 |
|---|---|---|
| `activity` | 活動記錄實體（使用者操作歷程）| 🔨 骨架建立，實作進行中 |
| `api-key` | API 金鑰管理實體 | 🔨 骨架建立，實作進行中 |
| `approval` | 審批實體（審批流程與決策）| 🔨 骨架建立，實作進行中 |
| `audit` | 稽核紀錄實體 | 🔨 骨架建立，實作進行中 |
| `feed` | 活動動態實體 | 🔨 骨架建立，實作進行中 |
| `invitation` | 邀請實體（工作區邀請管理）| 🔨 骨架建立，實作進行中 |
| `issue` | 議題實體（議題管理）| 🔨 骨架建立，實作進行中 |
| `lifecycle` | 生命週期實體（工作區生命週期）| 🔨 骨架建立，實作進行中 |
| `membership` | 成員資格實體（Membership）| 🔨 骨架建立，實作進行中 |
| `orchestration` | 跨子域編排（原 workspace-workflow）| 🔨 骨架建立，實作進行中 |
| `quality` | 品質管控實體 | 🔨 骨架建立，實作進行中 |
| `resource` | 資源實體（工作區資源配額與管理）| 🔨 骨架建立，實作進行中 |
| `schedule` | 排程實體 | 🔨 骨架建立，實作進行中 |
| `settlement` | 結算實體 | 🔨 骨架建立，實作進行中 |
| `share` | 分享實體（對外發布）| 🔨 骨架建立，實作進行中 |
| `task` | 任務實體（任務管理）| 🔨 骨架建立，實作進行中 |
| `task-formation` | 任務生成實體（AI 輔助任務生成）| 🔨 骨架建立，實作進行中 |

## task-formation 歸屬決策

`task-formation` 屬於 **`workspace`** 子域，理由：
- 輸出物（Task entities）是 workspace 的領域物件
- 業務流程（使用者確認候選任務）是 workspace 層關注點
- AI 生成能力由 `ai/generation` Port 注入（透過 `src/modules/ai/index.ts`），workspace 消費

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK 或任何框架。
- `Membership`（工作區參與）≠ `Actor`（身份）：前者屬於 workspace，後者屬於 iam。
- `orchestration/` 是跨子域流程協調層，不包含業務規則。
- workspace 不直接呼叫 Firestore；透過 `src/modules/platform/index.ts`（FileAPI、PermissionAPI）。

## Route Here When

- 撰寫 workspace 的新 use case、entity、adapter 實作。
- 實作 task / issue / lifecycle 等子域骨架。

## Route Elsewhere When

- 讀取邊界規則 → `src/modules/workspace/AGENT.md`
- 跨模組 API boundary → `src/modules/workspace/index.ts`
- AI 任務提取能力 → `src/modules/ai/index.ts`（generation）
- 成員身份驗證 → `src/modules/iam/index.ts`

## 路由規則

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/workspace/AGENT.md` |
| 撰寫新 use case / adapter / entity | `src/modules/workspace/`（本層）|
| 跨模組 API boundary | `src/modules/workspace/index.ts` |

**嚴禁事項：**
- ❌ 新建或恢復 `workspace-workflow` 子域（已拆解）
- ❌ 在 workspace 直接呼叫 Firestore（透過 src/modules/platform/index.ts）
- ❌ 使用 `approve` 作為子域名（已更正為名詞 `approval`）
- ❌ 在 barrel 使用 `export *`

## 文件網絡

- [README.md](README.md) — 模組目錄結構
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
````