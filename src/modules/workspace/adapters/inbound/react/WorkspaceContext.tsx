"use client";

/**
 * WorkspaceContext — workspace inbound adapter (React).
 *
 * Defines workspace scope state, context, and the WorkspaceContextProvider.
 * Consumed by WorkspaceScopeProvider and useWorkspaceScope in this adapter layer.
 */

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

import type { WorkspaceSnapshot } from "../../../subdomains/lifecycle/domain/entities/Workspace";

export type WorkspaceEntity = WorkspaceSnapshot;

export interface WorkspaceContextState {
  readonly workspaces: Record<string, WorkspaceEntity>;
  readonly activeWorkspaceId: string | null;
  readonly workspacesHydrated: boolean;
}

export type WorkspaceContextAction =
  | { type: "SET_ACTIVE_WORKSPACE"; payload: string | null }
  | { type: "SET_WORKSPACES"; payload: Record<string, WorkspaceEntity> }
  | { type: "RESET" };

export interface WorkspaceContextValue {
  readonly state: WorkspaceContextState;
  readonly dispatch: Dispatch<WorkspaceContextAction>;
}

const INITIAL_STATE: WorkspaceContextState = {
  workspaces: {},
  activeWorkspaceId: null,
  workspacesHydrated: false,
};

function reducer(
  state: WorkspaceContextState,
  action: WorkspaceContextAction,
): WorkspaceContextState {
  switch (action.type) {
    case "SET_ACTIVE_WORKSPACE":
      return { ...state, activeWorkspaceId: action.payload };
    case "SET_WORKSPACES":
      return { ...state, workspaces: action.payload, workspacesHydrated: true };
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return (
    <WorkspaceContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx)
    throw new Error(
      "useWorkspaceContext must be used within WorkspaceContextProvider",
    );
  return ctx;
}
