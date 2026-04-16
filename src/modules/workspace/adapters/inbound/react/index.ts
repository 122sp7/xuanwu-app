/**
 * workspace inbound React adapter — barrel.
 *
 * Public surface for all workspace React inbound adapters.
 * Consumed by src/app/ route shims and platform/adapters/inbound/react/.
 */

export {
  WorkspaceScopeProvider,
} from "./WorkspaceScopeProvider";

export {
  useWorkspaceScope,
  type WorkspaceContextState,
  type WorkspaceContextAction,
  type WorkspaceContextValue,
} from "./useWorkspaceScope";

export {
  AccountRouteDispatcher,
  type AccountRouteDispatcherProps,
} from "./AccountRouteDispatcher";
