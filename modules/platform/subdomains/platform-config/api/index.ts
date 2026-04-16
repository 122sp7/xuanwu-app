/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Explicit exports only — no wildcard re-exports of application/ (ADR 1404/5203).
 */

// ── Shell navigation catalog (configuration constants + pure functions) ───────
export {
  SHELL_ACCOUNT_SECTION_MATCHERS,
  SHELL_ACCOUNT_NAV_ITEMS,
  SHELL_ORGANIZATION_MANAGEMENT_ITEMS,
  SHELL_SECTION_LABELS,
  SHELL_RAIL_CATALOG_ITEMS,
  SHELL_CONTEXT_SECTION_CONFIG,
  SHELL_MOBILE_NAV_ITEMS,
  SHELL_ORG_PRIMARY_NAV_ITEMS,
  SHELL_ORG_SECONDARY_NAV_ITEMS,
  buildShellContextualHref,
  normalizeShellRoutePath,
  isExactOrChildPath,
  listShellRailCatalogItems,
  resolveShellBreadcrumbLabel,
  resolveShellNavSection,
  resolveShellPageTitle,
  type ShellNavItem,
  type ShellNavSection,
  type ShellRailCatalogItem,
  type ShellContextSectionConfig,
  type ShellRouteContext,
} from "../application/services/shell-navigation-catalog";
