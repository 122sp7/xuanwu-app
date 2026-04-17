"use client";

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

import { type ReactNode } from "react";
import { useEffect } from "react";

import { WorkspaceContextProvider, useWorkspaceContext } from "./WorkspaceContext";
import { useApp } from "../../../../platform/adapters/inbound/react/AppContext";
import { subscribeToWorkspacesForAccount } from "../../outbound/firebase-composition";

// ── WorkspaceSubscription ─────────────────────────────────────────────────────
// Isolated inner component so the subscription effect's dependency array is
// minimal — only activeAccountId triggers a new subscription, not the full
// app state object.

function WorkspaceSubscription({ children }: { children: ReactNode }) {
  const { state: appState } = useApp();
  const { dispatch } = useWorkspaceContext();
  const activeAccountId = appState.activeAccount?.id ?? null;

  useEffect(() => {
    if (!activeAccountId) {
      dispatch({ type: "RESET" });
      return;
    }

    const unsubscribe = subscribeToWorkspacesForAccount(
      activeAccountId,
      (workspaces) => {
        dispatch({ type: "SET_WORKSPACES", payload: workspaces });
      },
    );

    return () => unsubscribe();
  }, [activeAccountId, dispatch]);

  return <>{children}</>;
}

// ── WorkspaceScopeProvider ────────────────────────────────────────────────────

export function WorkspaceScopeProvider({ children }: { children: ReactNode }) {
  return (
    <WorkspaceContextProvider>
      <WorkspaceSubscription>{children}</WorkspaceSubscription>
    </WorkspaceContextProvider>
  );
}

