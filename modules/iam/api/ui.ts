/**
 * iam/api/ui.ts
 *
 * UI component public surface for the IAM bounded context.
 * App-layer and cross-module consumers that need IAM UI components
 * must import from this file — NOT from internal subdomain paths.
 *
 * This parallel surface to api/index.ts separates UI concerns (React
 * components, hooks) from semantic capability contracts (types, use-cases).
 *
 * Rule 49 enforcement: other modules must import iam UI via this path only.
 */

// ── Organization UI components ────────────────────────────────────────────────
export { AccountSwitcher } from "../subdomains/organization/interfaces/components/AccountSwitcher";
export { CreateOrganizationDialog } from "../subdomains/organization/interfaces/components/CreateOrganizationDialog";
export { MembersPage, type MembersPageProps } from "../subdomains/organization/interfaces/components/MembersPage";
export { TeamsPage, type TeamsPageProps } from "../subdomains/organization/interfaces/components/TeamsPage";
export {
  PermissionsPage,
  type PermissionsPageProps,
} from "../subdomains/organization/interfaces/components/PermissionsPage";

// ── Organization screen components ───────────────────────────────────────────
export { OrganizationOverviewRouteScreen } from "../subdomains/organization/interfaces/components/screens/OrganizationOverviewRouteScreen";
export { OrganizationMembersRouteScreen } from "../subdomains/organization/interfaces/components/screens/OrganizationMembersRouteScreen";
export { OrganizationTeamsRouteScreen } from "../subdomains/organization/interfaces/components/screens/OrganizationTeamsRouteScreen";
export { OrganizationPermissionsRouteScreen } from "../subdomains/organization/interfaces/components/screens/OrganizationPermissionsRouteScreen";
