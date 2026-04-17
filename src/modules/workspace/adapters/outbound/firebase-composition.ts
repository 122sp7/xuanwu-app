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

// ── Singleton repository ───────────────────────────────────────────────────────

let _workspaceQueryRepo: FirebaseWorkspaceQueryRepository | undefined;

function getWorkspaceQueryRepo(): FirebaseWorkspaceQueryRepository {
  if (!_workspaceQueryRepo) {
    _workspaceQueryRepo = new FirebaseWorkspaceQueryRepository();
  }
  return _workspaceQueryRepo;
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

export type { Unsubscribe };
