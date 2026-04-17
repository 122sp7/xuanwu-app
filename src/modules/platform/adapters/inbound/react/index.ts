/**
 * platform inbound React adapter — barrel.
 *
 * Public surface for all platform React inbound adapters.
 * Consumed by src/app/ route shims.
 */

export { PlatformBootstrap } from "./PlatformBootstrap";
export { AccountScopeProvider } from "./AccountScopeProvider";
export { ShellFrame } from "./ShellFrame";
export {
  useAccountScope,
  type AppState,
  type AppAction,
  type AppContextValue,
} from "./useAccountScope";
export {
  useAccountRouteContext,
  type AccountRouteContextValue,
} from "./useAccountRouteContext";
