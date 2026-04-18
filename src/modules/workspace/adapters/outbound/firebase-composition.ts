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
import { FirestoreTaskFormationJobRepository } from "../../subdomains/task-formation/adapters/outbound/firestore/FirestoreTaskFormationJobRepository";
import { FirebaseCallableTaskCandidateExtractor } from "../../subdomains/task-formation/adapters/outbound/callable/FirebaseCallableTaskCandidateExtractor";
import {
  ExtractTaskCandidatesUseCase,
  ConfirmCandidatesUseCase,
} from "../../subdomains/task-formation/application/use-cases/TaskFormationUseCases";
import { FirestoreTaskRepository } from "../../subdomains/task/adapters/outbound/firestore/FirestoreTaskRepository";
import { CreateTaskUseCase } from "../../subdomains/task/application/use-cases/TaskUseCases";

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

function getWorkspaceQueryRepo(): FirebaseWorkspaceQueryRepository {
  if (!_workspaceQueryRepo) {
    _workspaceQueryRepo = new FirebaseWorkspaceQueryRepository();
  }
  return _workspaceQueryRepo;
}

function createFirestoreLikeAdapter(): FirestoreLike {
  const {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    collection,
    query,
    where,
    getDocs,
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
  };
}

function getWorkspaceLifecycleRepo(): FirestoreWorkspaceRepository {
  if (!_workspaceLifecycleRepo) {
    _workspaceLifecycleRepo = new FirestoreWorkspaceRepository(createFirestoreLikeAdapter());
  }
  return _workspaceLifecycleRepo;
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
  return {
    createWorkspaceUseCase: new CreateWorkspaceUseCase(repo),
    activateWorkspaceUseCase: new ActivateWorkspaceUseCase(repo),
    stopWorkspaceUseCase: new StopWorkspaceUseCase(repo),
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

export type { Unsubscribe };
