import { useParams } from "next/navigation";

import { useAuth } from "@/modules/platform/api";
import { useApp } from "@/modules/platform/api/ui";

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

function normalizeRouteParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }
  return value?.trim() ?? "";
}

/**
 * Provides normalized account/workspace actor context for app route shims.
 * This keeps route-level composition thin and moves orchestration into workspace API.
 */
export function useWorkspaceOrchestrationContext(
  options: UseWorkspaceOrchestrationContextOptions = {},
): WorkspaceOrchestrationContext {
  const routeParams = useParams<{ accountId?: string | string[]; workspaceId?: string | string[] }>();
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const { state: workspaceState } = useWorkspaceContext();

  const routeAccountId = normalizeRouteParam(routeParams.accountId);
  const routeWorkspaceId = normalizeRouteParam(routeParams.workspaceId);

  const accountId = routeAccountId || appState.activeAccount?.id || authState.user?.id || "";
  const currentUserId = authState.user?.id ?? "";
  const activeWorkspaceId = workspaceState.activeWorkspaceId ?? routeWorkspaceId;

  const requestedWorkspaceId = options.requestedWorkspaceId?.trim() || routeWorkspaceId;
  const resolvedWorkspace = resolveWorkspaceFromMap(
    workspaceState.workspaces,
    requestedWorkspaceId,
  );
  const workspaceId = resolvedWorkspace?.id ?? requestedWorkspaceId ?? activeWorkspaceId;

  return {
    accountId,
    currentUserId,
    activeWorkspaceId,
    workspaceId,
  };
}
