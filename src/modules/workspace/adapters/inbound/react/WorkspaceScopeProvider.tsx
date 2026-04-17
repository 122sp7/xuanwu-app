"use client";

/**
 * WorkspaceScopeProvider — workspace inbound adapter (React).
 *
 * Canonical workspace scope provider for the src/ migration layer.
 * Aliases WorkspaceContextProvider from the workspace module.
 *
 * Consumers use useWorkspaceScope() to read workspace state.
 * Ported from: modules/workspace/interfaces/web/providers/WorkspaceContextProvider.tsx
 */

export {
  WorkspaceContextProvider as WorkspaceScopeProvider,
} from "./WorkspaceContext";
