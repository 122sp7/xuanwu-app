/**
 * Public API boundary for the organization subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Team port wiring is deferred: the organization-service auto-configures its
 * team port factory on first use via lazy require, eliminating the previous
 * import-time side effect (configureOrganizationTeamPortFactory call).
 */

// --- Domain types ---
export type {
  OrganizationEntity,
  OrganizationRole,
  Presence,
  InviteState,
  PolicyEffect,
  MemberReference,
  Team,
  PartnerInvite,
  ThemeConfig,
  OrgPolicy,
  OrgPolicyRule,
  OrgPolicyScope,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
} from "../domain";
export type { OrganizationRepository, Unsubscribe } from "../domain";
export type { OrgPolicyRepository } from "../domain";

// --- Composition (lazy, safe for SSR) ---
export { organizationService, organizationQueryService } from "../interfaces/composition/organization-service";

// --- Interfaces (UI, queries, actions) ---
export * from "../interfaces";
