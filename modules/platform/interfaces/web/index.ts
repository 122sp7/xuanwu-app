export { ShellHeaderControls } from "./shell/header/components/ShellHeaderControls";
export { ShellThemeToggle } from "./shell/header/components/ShellThemeToggle";
export { ShellNotificationButton } from "./shell/header/components/ShellNotificationButton";
export { ShellUserAvatar } from "./shell/header/components/ShellUserAvatar";
export { ShellTranslationSwitcher } from "./shell/header/components/ShellTranslationSwitcher";
export { ShellAppBreadcrumbs } from "./shell/breadcrumbs/ShellAppBreadcrumbs";
export { ShellGlobalSearchDialog, useShellGlobalSearch } from "./shell/search/ShellGlobalSearchDialog";
export { useAccountRouteContext, type AccountRouteContext } from "./hooks/useAccountRouteContext";

// providers — context and useApp from platform-only ShellAppContext
export {
  AppContext,
  APP_INITIAL_STATE,
  useApp,
  type AppState,
  type AppAction,
  type AppContextValue,
} from "./providers/ShellAppContext";
export type { ActiveAccount } from "../../api/contracts";
