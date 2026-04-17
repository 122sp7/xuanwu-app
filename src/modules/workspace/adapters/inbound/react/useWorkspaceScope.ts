"use client";

/**
 * useWorkspaceScope — workspace inbound adapter (React).
 *
 * Canonical hook for reading the active workspace scope in the src/ layer.
 * Aliases useWorkspaceContext() from the workspace module.
 *
 * Returns: { state: WorkspaceContextState, dispatch: Dispatch<WorkspaceContextAction> }
 */

export {
  useWorkspaceContext as useWorkspaceScope,
} from "./WorkspaceContext";

export type {
  WorkspaceContextState,
  WorkspaceContextAction,
  WorkspaceContextValue,
} from "./WorkspaceContext";
