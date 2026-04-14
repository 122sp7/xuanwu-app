/**
 * platform/api/ui.ts
 *
 * UI component and React-hook surface for the platform bounded context.
 * App-layer consumers that need shell UI, organisation UI, or app-context
 * hooks should import from this file — NOT from the main api/index.ts.
 *
 * api/index.ts is reserved for cross-module semantic capability contracts
 * (service facades, domain types, use-case classes, command/query inputs).
 *
 * @see ADR-1200 Boundary Violation — UI components in api/index.ts
 */

// ── Shell UI components ───────────────────────────────────────────────────────
export { ShellHeaderControls } from "../interfaces/web/shell/header/components/ShellHeaderControls";
export { ShellThemeToggle } from "../interfaces/web/shell/header/components/ShellThemeToggle";
export { ShellNotificationButton } from "../interfaces/web/shell/header/components/ShellNotificationButton";
export { ShellUserAvatar } from "../interfaces/web/shell/header/components/ShellUserAvatar";
export { ShellTranslationSwitcher } from "../interfaces/web/shell/header/components/ShellTranslationSwitcher";
export { ShellAppBreadcrumbs } from "../interfaces/web/shell/breadcrumbs/ShellAppBreadcrumbs";
export {
  ShellGlobalSearchDialog,
  useShellGlobalSearch,
} from "../interfaces/web/shell/search/ShellGlobalSearchDialog";

// ── Shell hooks ───────────────────────────────────────────────────────────────
export {
  useAccountRouteContext,
  type AccountRouteContext,
} from "../interfaces/web/hooks/useAccountRouteContext";

// ── App context (platform-owned, shell UI layer) ──────────────────────────────
export {
  AppContext,
  APP_INITIAL_STATE,
  useApp,
  type AppState,
  type AppAction,
  type AppContextValue,
} from "../interfaces/web/providers/ShellAppContext";

// ── Organisation UI components ────────────────────────────────────────────────
export { AccountSwitcher } from "../subdomains/organization/interfaces/components/AccountSwitcher";
export { CreateOrganizationDialog } from "../subdomains/organization/interfaces/components/CreateOrganizationDialog";
export { OrganizationOverviewRouteScreen } from "../subdomains/organization/interfaces/components/screens/OrganizationOverviewRouteScreen";
export { MembersPage, type MembersPageProps } from "../subdomains/organization/interfaces/components/MembersPage";
export { OrganizationMembersRouteScreen } from "../subdomains/organization/interfaces/components/screens/OrganizationMembersRouteScreen";
export { TeamsPage, type TeamsPageProps } from "../subdomains/organization/interfaces/components/TeamsPage";
export { OrganizationTeamsRouteScreen } from "../subdomains/organization/interfaces/components/screens/OrganizationTeamsRouteScreen";
export {
  PermissionsPage,
  type PermissionsPageProps,
} from "../subdomains/organization/interfaces/components/PermissionsPage";
export { OrganizationPermissionsRouteScreen } from "../subdomains/organization/interfaces/components/screens/OrganizationPermissionsRouteScreen";

// ── Notification UI components ────────────────────────────────────────────────
// TODO(ADR-1400): notification/api/index.ts still uses export * from "../application"
// (wildcard leak); moved UI re-exports here to keep api/index.ts free of UI concerns.
export { NotificationBell } from "../subdomains/notification/interfaces/components/NotificationBell";
export {
  NotificationsPage,
  type NotificationsPageProps,
} from "../subdomains/notification/interfaces/components/NotificationsPage";
export { SettingsNotificationsRouteScreen } from "../subdomains/notification/interfaces/components/screens/SettingsNotificationsRouteScreen";
