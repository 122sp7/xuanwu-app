"use client";

/**
 * WorkspaceContextProvider — workspace/interfaces/web layer
 *
 * Owns workspace-scoped state for the authenticated shell:
 *   - workspaces visible under the active account
 *   - active workspace selection and localStorage persistence
 *
 * Reads `activeAccount` from platform's useApp(); subscribes to workspaces
 * via workspace-owned query functions. This keeps workspace state ownership
 * inside the workspace bounded context instead of leaking into platform.
 */

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

import { useApp } from "@/modules/platform/api/ui";
import type { WorkspaceEntity } from "../../contracts";
import { subscribeToWorkspacesForAccount } from "../../facades/workspace.facade";
import { toWorkspaceMap } from "../utils/workspace-map";
import { getWorkspaceStorageKey } from "../state/workspace-session";

// ── State ────────────────────────────────────────────────────────────────────

export interface WorkspaceContextState {
  /** Workspaces visible under the active account. */
  workspaces: Record<string, WorkspaceEntity>;
  /** True once the first active-account workspace snapshot has been received. */
  workspacesHydrated: boolean;
  /** Currently selected workspace context under the active account. */
  activeWorkspaceId: string | null;
}

export type WorkspaceContextAction =
  | {
      type: "SET_WORKSPACES";
      payload: { workspaces: Record<string, WorkspaceEntity>; hydrated: boolean };
    }
  | { type: "SET_ACTIVE_WORKSPACE"; payload: string | null }
  | { type: "RESET" };

export interface WorkspaceContextValue {
  state: WorkspaceContextState;
  dispatch: Dispatch<WorkspaceContextAction>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const initialState: WorkspaceContextState = {
  workspaces: {},
  workspacesHydrated: false,
  activeWorkspaceId: null,
};

function workspaceReducer(
  state: WorkspaceContextState,
  action: WorkspaceContextAction,
): WorkspaceContextState {
  switch (action.type) {
    case "SET_WORKSPACES":
      return {
        ...state,
        workspaces: action.payload.workspaces,
        workspacesHydrated: action.payload.hydrated,
      };
    case "SET_ACTIVE_WORKSPACE":
      if (state.activeWorkspaceId === action.payload) return state;
      return { ...state, activeWorkspaceId: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function WorkspaceContextProvider({ children }: { children: ReactNode }) {
  const { state: appState } = useApp();
  const activeAccountId = appState.activeAccount?.id ?? null;
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  // Reset workspace state when account changes
  useEffect(() => {
    if (!activeAccountId) {
      dispatch({ type: "RESET" });
      return;
    }
    dispatch({ type: "SET_WORKSPACES", payload: { workspaces: {}, hydrated: false } });
  }, [activeAccountId]);

  // Restore active workspace from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!activeAccountId) {
      dispatch({ type: "SET_ACTIVE_WORKSPACE", payload: null });
      return;
    }
    const storedWorkspaceId = window.localStorage.getItem(
      getWorkspaceStorageKey(activeAccountId),
    );
    dispatch({ type: "SET_ACTIVE_WORKSPACE", payload: storedWorkspaceId || null });
  }, [activeAccountId]);

  // Persist active workspace to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!activeAccountId) return;
    const storageKey = getWorkspaceStorageKey(activeAccountId);
    if (!state.activeWorkspaceId) {
      window.localStorage.removeItem(storageKey);
      return;
    }
    window.localStorage.setItem(storageKey, state.activeWorkspaceId);
  }, [activeAccountId, state.activeWorkspaceId]);

  // Subscribe to workspaces for the active account
  useEffect(() => {
    if (!activeAccountId) {
      dispatch({ type: "SET_WORKSPACES", payload: { workspaces: {}, hydrated: true } });
      return;
    }

    const unsubscribe = subscribeToWorkspacesForAccount(
      activeAccountId,
      (workspaces) => {
        dispatch({
          type: "SET_WORKSPACES",
          payload: { workspaces: toWorkspaceMap(workspaces), hydrated: true },
        });
      },
    );

    return () => unsubscribe();
  }, [activeAccountId]);

  return (
    <WorkspaceContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useWorkspaceContext() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspaceContext must be used within WorkspaceContextProvider");
  }
  return ctx;
}
