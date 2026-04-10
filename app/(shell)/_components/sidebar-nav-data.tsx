/**
 * @deprecated Moved to modules/platform/interfaces/web/navigation/sidebar-nav-data.tsx
 * Re-exported here for backward compatibility with existing app/(shell)/ imports.
 */
export type {
  DashboardSidebarProps,
  NavSection,
} from "@/modules/platform/api";
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
} from "@/modules/platform/api";
