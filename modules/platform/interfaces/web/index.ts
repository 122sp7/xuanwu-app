export { HeaderControls as ShellHeaderControls } from "./shell/header/components/HeaderControls";
export { ShellThemeToggle } from "./shell/header/components/ShellThemeToggle";
export { ShellNotificationButton } from "./shell/header/components/ShellNotificationButton";
export { ShellUserAvatar } from "./shell/header/components/ShellUserAvatar";
export { ShellTranslationSwitcher } from "./shell/header/components/ShellTranslationSwitcher";
export { ShellAppBreadcrumbs } from "./shell/breadcrumbs/ShellAppBreadcrumbs";
export { ShellGlobalSearchDialog, useShellGlobalSearch } from "./shell/search/ShellGlobalSearchDialog";
export { AppRail } from "./shell/sidebar/ShellAppRail";
export { ShellDashboardSidebar } from "./shell/navigation/components/ShellDashboardSidebar";
export { ShellLayout } from "./shell/layout/ShellRootLayout";
export type { DashboardSidebarProps, NavSection } from "./shell/navigation/data/ShellSidebarNavData";
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
} from "./shell/navigation/data/ShellSidebarNavData";

// providers
export {
  AppContext,
  type AppState,
  type AppAction,
  type AppContextValue,
  type ActiveAccount,
} from "./providers/ShellAppProvider";
export { AppProvider, useApp } from "./providers/ShellAppProvider";
export { Providers } from "./providers/ShellProviders";
