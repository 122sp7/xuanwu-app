import { useApp, useAuth } from "@/modules/platform/api";

import { resolveWorkspaceFromMap } from "../utils/workspace-map";
import { useWorkspaceContext } from "../providers/WorkspaceContextProvider";

export interface WorkspaceOrchestrationContext {
  readonly accountId: string;
  readonly currentUserId: string;
  readonly activeWorkspaceId: string;
  readonly workspaceId: string;
}

export interface UseWorkspaceOrchestrationContextOptions {
  readonly requestedWorkspaceId?: string;
}

/**
 * Provides normalized account/workspace actor context for app route shims.
 * This keeps route-level composition thin and moves orchestration into workspace API.
 */
export function useWorkspaceOrchestrationContext(
  options: UseWorkspaceOrchestrationContextOptions = {},
): WorkspaceOrchestrationContext {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const { state: workspaceState } = useWorkspaceContext();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const currentUserId = authState.user?.id ?? "";
  const activeWorkspaceId = workspaceState.activeWorkspaceId ?? "";

  const requestedWorkspaceId = options.requestedWorkspaceId?.trim() ?? "";
  const resolvedWorkspace = resolveWorkspaceFromMap(
    workspaceState.workspaces,
    requestedWorkspaceId,
  );
  const workspaceId = resolvedWorkspace?.id ?? activeWorkspaceId;

  return {
    accountId,
    currentUserId,
    activeWorkspaceId,
    workspaceId,
  };
}
