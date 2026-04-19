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

import { getFirebaseFirestore, firestoreApi } from "@packages";
import {
  FirebaseWorkspaceQueryRepository,
  type Unsubscribe,
} from "./FirebaseWorkspaceQueryRepository";
import type { WorkspaceSnapshot } from "../../subdomains/lifecycle/domain/entities/Workspace";

import {
  FirestoreWorkspaceRepository,
  type FirestoreLike,
} from "../../subdomains/lifecycle/adapters/outbound/firestore/FirestoreWorkspaceRepository";
import {
  CreateWorkspaceUseCase,
  CreateWorkspaceWithOwnerUseCase,
  ActivateWorkspaceUseCase,
  StopWorkspaceUseCase,
} from "../../subdomains/lifecycle/application/use-cases/WorkspaceLifecycleUseCases";
import { FirestoreMemberRepository } from "../../subdomains/membership/adapters/outbound/firestore/FirestoreMemberRepository";
import {
  AddMemberUseCase,
  ChangeMemberRoleUseCase,
  ListWorkspaceMembersUseCase,
  RemoveMemberUseCase,
} from "../../subdomains/membership/application/use-cases/MembershipUseCases";
import { FirestoreTaskFormationJobRepository } from "../../subdomains/task-formation/adapters/outbound/firestore/FirestoreTaskFormationJobRepository";
import { FirebaseCallableTaskCandidateExtractor } from "../../subdomains/task-formation/adapters/outbound/callable/FirebaseCallableTaskCandidateExtractor";
import {
  ExtractTaskCandidatesUseCase,
  ConfirmCandidatesUseCase,
} from "../../subdomains/task-formation/application/use-cases/TaskFormationUseCases";
import { FirestoreTaskRepository } from "../../subdomains/task/adapters/outbound/firestore/FirestoreTaskRepository";
import {
  CreateTaskUseCase,
  UpdateTaskUseCase,
  TransitionTaskStatusUseCase,
  DeleteTaskUseCase,
} from "../../subdomains/task/application/use-cases/TaskUseCases";
import { FirestoreIssueRepository } from "../../subdomains/issue/adapters/outbound/firestore/FirestoreIssueRepository";
import {
  OpenIssueUseCase,
  TransitionIssueStatusUseCase,
  ResolveIssueUseCase,
  CloseIssueUseCase,
} from "../../subdomains/issue/application/use-cases/IssueUseCases";
import { FirestoreQualityReviewRepository } from "../../subdomains/quality/adapters/outbound/firestore/FirestoreQualityReviewRepository";
import {
  StartQualityReviewUseCase,
  PassQualityReviewUseCase,
  FailQualityReviewUseCase,
  ListQualityReviewsUseCase,
} from "../../subdomains/quality/application/use-cases/QualityUseCases";
import { FirestoreApprovalDecisionRepository } from "../../subdomains/approval/adapters/outbound/firestore/FirestoreApprovalDecisionRepository";
import {
  CreateApprovalDecisionUseCase,
  ApproveTaskUseCase,
  RejectApprovalUseCase,
  ListApprovalDecisionsUseCase,
} from "../../subdomains/approval/application/use-cases/ApprovalUseCases";
import { FirestoreFeedRepository } from "../../subdomains/feed/adapters/outbound/firestore/FirestoreFeedRepository";
import { CreateFeedPostUseCase, ListFeedPostsUseCase } from "../../subdomains/feed/application/use-cases/FeedUseCases";
import { FirestoreDemandRepository } from "../../subdomains/schedule/adapters/outbound/firestore/FirestoreDemandRepository";
import {
  AssignWorkDemandUseCase,
  CreateWorkDemandUseCase,
  ListWorkspaceDemandsUseCase,
} from "../../subdomains/schedule/application/use-cases/ScheduleUseCases";
import { FirestoreAuditRepository } from "../../subdomains/audit/adapters/outbound/firestore/FirestoreAuditRepository";
import {
  ListWorkspaceAuditEntriesUseCase,
  RecordAuditEntryUseCase,
} from "../../subdomains/audit/application/use-cases/AuditUseCases";
import { FirestoreInvoiceRepository } from "../../subdomains/settlement/adapters/outbound/firestore/FirestoreInvoiceRepository";
import { CreateInvoiceUseCase, TransitionInvoiceStatusUseCase } from "../../subdomains/settlement/application/use-cases/SettlementUseCases";

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

// ── Singleton repository ───────────────────────────────────────────────────────

let _workspaceQueryRepo: FirebaseWorkspaceQueryRepository | undefined;
let _workspaceLifecycleRepo: FirestoreWorkspaceRepository | undefined;
let _workspaceMemberRepo: FirestoreMemberRepository | undefined;

function getWorkspaceQueryRepo(): FirebaseWorkspaceQueryRepository {
  if (!_workspaceQueryRepo) {
    _workspaceQueryRepo = new FirebaseWorkspaceQueryRepository();
  }
  return _workspaceQueryRepo;
}

export function createFirestoreLikeAdapter() {
  const {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    increment,
  } = firestoreApi;

  return {
    async get(collectionName: string, id: string): Promise<Record<string, unknown> | null> {
      const db = getFirebaseFirestore();
      const snap = await getDoc(doc(db, collectionName, id));
      return snap.exists() ? (snap.data() as Record<string, unknown>) : null;
    },
    async set(
      collectionName: string,
      id: string,
      data: Record<string, unknown>,
    ): Promise<void> {
      const db = getFirebaseFirestore();
      await setDoc(doc(db, collectionName, id), data, { merge: true });
    },
    async delete(collectionName: string, id: string): Promise<void> {
      const db = getFirebaseFirestore();
      await deleteDoc(doc(db, collectionName, id));
    },
    async query(
      collectionName: string,
      filters: Array<{ field: string; op: string; value: unknown }>,
    ): Promise<Record<string, unknown>[]> {
      const db = getFirebaseFirestore();
      const constraints = filters.map((filter) =>
        where(
          filter.field,
          filter.op as FirestoreWhereOperator,
          filter.value,
        ));
      const snap = await getDocs(query(collection(db, collectionName), ...constraints));
      return snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    },
    async increment(collectionName: string, id: string, field: string, delta: number): Promise<void> {
      const db = getFirebaseFirestore();
      await updateDoc(doc(db, collectionName, id), { [field]: increment(delta) });
    },
  };
}

function getWorkspaceLifecycleRepo(): FirestoreWorkspaceRepository {
  if (!_workspaceLifecycleRepo) {
    _workspaceLifecycleRepo = new FirestoreWorkspaceRepository(createFirestoreLikeAdapter());
  }
  return _workspaceLifecycleRepo;
}

function getWorkspaceMemberRepo(): FirestoreMemberRepository {
  if (!_workspaceMemberRepo) {
    _workspaceMemberRepo = new FirestoreMemberRepository(createFirestoreLikeAdapter());
  }
  return _workspaceMemberRepo;
}

// ── Public subscriptions ───────────────────────────────────────────────────────

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
): Unsubscribe {
  return getWorkspaceQueryRepo().subscribeToWorkspacesForAccount(
    accountId,
    onUpdate,
  );
}

export function createClientWorkspaceLifecycleUseCases() {
  const repo = getWorkspaceLifecycleRepo();
  const memberRepo = getWorkspaceMemberRepo();
  return {
    createWorkspaceUseCase: new CreateWorkspaceUseCase(repo),
    createWorkspaceWithOwnerUseCase: new CreateWorkspaceWithOwnerUseCase(repo, memberRepo),
    activateWorkspaceUseCase: new ActivateWorkspaceUseCase(repo),
    stopWorkspaceUseCase: new StopWorkspaceUseCase(repo),
  };
}

export function createClientMembershipUseCases() {
  const repo = getWorkspaceMemberRepo();
  return {
    addMember: new AddMemberUseCase(repo),
    changeMemberRole: new ChangeMemberRoleUseCase(repo),
    removeMember: new RemoveMemberUseCase(repo),
    listMembersByWorkspace: new ListWorkspaceMembersUseCase(repo),
  };
}

export function createClientTaskFormationUseCases() {
  const db = createFirestoreLikeAdapter();
  const jobRepo = new FirestoreTaskFormationJobRepository(db);
  const taskRepo = new FirestoreTaskRepository(db);
  const createTaskUseCase = new CreateTaskUseCase(taskRepo);
  const extractor = new FirebaseCallableTaskCandidateExtractor();
  return {
    extractTaskCandidates: new ExtractTaskCandidatesUseCase(jobRepo, extractor),
    confirmCandidates: new ConfirmCandidatesUseCase(jobRepo, {
      createTask: (input) => createTaskUseCase.execute(input),
    }),
    getJobSnapshot: (jobId: string) => jobRepo.findById(jobId),
  };
}

export function createClientTaskUseCases() {
  const db = createFirestoreLikeAdapter();
  const taskRepo = new FirestoreTaskRepository(db);
  return {
    createTask: new CreateTaskUseCase(taskRepo),
    updateTask: new UpdateTaskUseCase(taskRepo),
    transitionTaskStatus: new TransitionTaskStatusUseCase(taskRepo),
    deleteTask: new DeleteTaskUseCase(taskRepo),
    listTasksByWorkspace: (workspaceId: string) => taskRepo.findByWorkspaceId(workspaceId),
  };
}

export function createClientIssueUseCases() {
  const db = createFirestoreLikeAdapter();
  const issueRepo = new FirestoreIssueRepository(db);
  return {
    openIssue: new OpenIssueUseCase(issueRepo),
    transitionIssueStatus: new TransitionIssueStatusUseCase(issueRepo),
    resolveIssue: new ResolveIssueUseCase(issueRepo),
    closeIssue: new CloseIssueUseCase(issueRepo),
    listIssuesByTask: (taskId: string) => issueRepo.findByTaskId(taskId),
    listIssuesByWorkspace: (workspaceId: string) => issueRepo.findByWorkspaceId(workspaceId),
  };
}

export function createClientQualityUseCases() {
  const db = createFirestoreLikeAdapter();
  const reviewRepo = new FirestoreQualityReviewRepository(db);
  const taskRepo = new FirestoreTaskRepository(db);
  const issueRepo = new FirestoreIssueRepository(db);
  return {
    startQualityReview: new StartQualityReviewUseCase(reviewRepo, taskRepo),
    passQualityReview: new PassQualityReviewUseCase(reviewRepo, taskRepo, issueRepo),
    failQualityReview: new FailQualityReviewUseCase(reviewRepo, taskRepo),
    listQualityReviews: new ListQualityReviewsUseCase(reviewRepo),
  };
}

export function createClientApprovalUseCases() {
  const db = createFirestoreLikeAdapter();
  const decisionRepo = new FirestoreApprovalDecisionRepository(db);
  const taskRepo = new FirestoreTaskRepository(db);
  const issueRepo = new FirestoreIssueRepository(db);
  return {
    createApprovalDecision: new CreateApprovalDecisionUseCase(decisionRepo, taskRepo),
    approveTask: new ApproveTaskUseCase(decisionRepo, taskRepo, issueRepo),
    rejectApproval: new RejectApprovalUseCase(decisionRepo, taskRepo),
    listApprovalDecisions: new ListApprovalDecisionsUseCase(decisionRepo),
  };
}

export function createClientFeedUseCases() {
  const db = createFirestoreLikeAdapter();
  const feedRepo = new FirestoreFeedRepository(db);
  return {
    createFeedPost: new CreateFeedPostUseCase(feedRepo),
    listFeedPosts: new ListFeedPostsUseCase(feedRepo),
  };
}

export function createClientScheduleUseCases() {
  const db = createFirestoreLikeAdapter();
  const demandRepo = new FirestoreDemandRepository(db);
  return {
    createWorkDemand: new CreateWorkDemandUseCase(demandRepo),
    assignWorkDemand: new AssignWorkDemandUseCase(demandRepo),
    listWorkDemandsByWorkspace: new ListWorkspaceDemandsUseCase(demandRepo),
  };
}

export function createClientAuditUseCases() {
  const db = createFirestoreLikeAdapter();
  const auditRepo = new FirestoreAuditRepository(db);
  return {
    recordAuditEntry: new RecordAuditEntryUseCase(auditRepo),
    listAuditEntriesByWorkspace: new ListWorkspaceAuditEntriesUseCase(auditRepo),
  };
}

export function createClientSettlementUseCases() {
  const db = createFirestoreLikeAdapter();
  const invoiceRepo = new FirestoreInvoiceRepository(db);
  return {
    createInvoice: new CreateInvoiceUseCase(invoiceRepo),
    transitionInvoiceStatus: new TransitionInvoiceStatusUseCase(invoiceRepo),
    listInvoicesByWorkspace: (workspaceId: string) => invoiceRepo.findByWorkspaceId(workspaceId),
  };
}

export type { Unsubscribe };
