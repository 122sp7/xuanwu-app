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

export type Unsubscribe = () => void;

// ── Timestamp helper ──────────────────────────────────────────────────────────

function toISO(v: unknown): string {
  if (v && typeof v === "object" && "toDate" in v) {
    return (v as Timestamp).toDate().toISOString();
  }
  if (typeof v === "string") return v;
  return new Date().toISOString();
}

// ── Firestore data → WorkspaceSnapshot mapper ─────────────────────────────────

const LIFECYCLE_STATES: readonly WorkspaceLifecycleState[] = [
  "preparatory",
  "active",
  "stopped",
];

const VISIBILITY_VALUES: readonly WorkspaceVisibility[] = [
  "private",
  "internal",
  "public",
];

function toWorkspaceSnapshot(
  id: string,
  data: Record<string, unknown>,
): WorkspaceSnapshot {
  const rawLifecycle = data.lifecycleState as WorkspaceLifecycleState;
  const lifecycleState: WorkspaceLifecycleState = LIFECYCLE_STATES.includes(rawLifecycle)
    ? rawLifecycle
    : "active";

  const rawVisibility = data.visibility as WorkspaceVisibility;
  const visibility: WorkspaceVisibility = VISIBILITY_VALUES.includes(rawVisibility)
    ? rawVisibility
    : "private";

  return {
    id,
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    accountType:
      data.accountType === "organization" ? "organization" : "user",
    name: typeof data.name === "string" ? data.name : "",
    lifecycleState,
    visibility,
    photoURL: typeof data.photoURL === "string" ? data.photoURL : null,
    createdAtISO: toISO(data.createdAtISO ?? data.createdAt),
    updatedAtISO: toISO(data.updatedAtISO ?? data.updatedAt),
  };
}

// ── Repository ────────────────────────────────────────────────────────────────

export class FirebaseWorkspaceQueryRepository {
  private readonly collectionName = "workspaces";

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
  ): Unsubscribe {
    const db = getFirestore(firebaseClientApp);
    const q = query(
      collection(db, this.collectionName),
      where("accountId", "==", accountId),
    );

    return onSnapshot(q, (snapshot) => {
      const workspaces: Record<string, WorkspaceSnapshot> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        workspaces[docSnap.id] = toWorkspaceSnapshot(docSnap.id, data);
      });
      onUpdate(workspaces);
    });
  }
}
