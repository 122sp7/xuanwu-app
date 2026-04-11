export { ShellHeaderControls } from "./components/ShellHeaderControls";
export { ShellThemeToggle } from "./components/ShellThemeToggle";
export { ShellNotificationButton } from "./components/ShellNotificationButton";
export { ShellUserAvatar } from "./components/ShellUserAvatar";
export { ShellTranslationSwitcher } from "./components/ShellTranslationSwitcher";
export { ShellAppBreadcrumbs } from "./components/ShellAppBreadcrumbs";
export { ShellGlobalSearchDialog, useShellGlobalSearch } from "./components/ShellGlobalSearchDialog";
export { AppRail } from "./components/ShellAppRail";
export { ShellDashboardSidebar } from "./components/ShellDashboardSidebar";
export { ShellLayout } from "./components/ShellRootLayout";
export type { DashboardSidebarProps, NavSection } from "./navigation/ShellSidebarNavData";
export {
  resolveNavSection,
  isActiveOrganizationAccount,
  SECTION_TITLES,
  ACCOUNT_NAV_ITEMS,
  ACCOUNT_SECTION_MATCHERS,
  ORGANIZATION_MANAGEMENT_ITEMS,
  sidebarItemClass,
  sidebarSectionTitleClass,
  sidebarGroupButtonClass,
  SimpleNavLinks,
} from "./navigation/ShellSidebarNavData";

// providers
export {
  AppContext,
  type AppState,
  type AppAction,
  type AppContextValue,
  type ActiveAccount,
} from "./providers/app-context";
export { AppProvider, useApp } from "./providers/app-provider";
export { Providers } from "./providers/providers";
