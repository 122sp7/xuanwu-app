/**
 * platform public API boundary — semantic capability contracts only.
 *
 * account is listed before organization to establish canonical definitions for
 * shared type names (OrganizationRole, PolicyEffect, ThemeConfig, Unsubscribe).
 * Organization re-exports are explicit to avoid TS2308 ambiguity errors.
 *
 * Shell UI components, React hooks, and app-context types live in api/ui.ts.
 * @see ADR-1200 Boundary Violation — UI components separated from capability contracts.
 */

export * from "./contracts";
export * from "./facade";
export {
  authApi,
  permissionApi,
  fileApi,
} from "./service-api";
export * from "../../iam/api";
export * from "../subdomains/account/api";
export * from "../subdomains/notification/api";
export * from "../subdomains/platform-config/api";

export {
  getProfile,
  subscribeToProfile,
  updateProfile,
  getAccountProfile,
  subscribeToAccountProfile,
  updateAccountProfile,
} from "../subdomains/account-profile/api";

export type {
  AccountProfile,
  UpdateAccountProfileInput,
} from "../subdomains/account-profile/api";

// organization — explicit to avoid re-export conflicts with account subdomain
export type {
  OrganizationEntity,
  Presence,
  InviteState,
  MemberReference,
  Team,
  PartnerInvite,
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
  OrganizationRepository,
  OrgPolicyRepository,
} from "../subdomains/organization/api";
export {
  organizationService,
  getOrganizationMembers,
  getOrganizationTeams,
  getOrgPolicies,
  createOrganization,
  createOrganizationWithTeam,
  updateOrganizationSettings,
  deleteOrganization,
  inviteMember,
  recruitMember,
  dismissMember,
  updateMemberRole,
  createTeam,
  deleteTeam,
  updateTeamMembers,
  createPartnerGroup,
  sendPartnerInvite,
  dismissPartnerMember,
  createOrgPolicy,
  updateOrgPolicy,
  deleteOrgPolicy,
  // UI components belong in api/ui.ts — see ADR-1200
} from "../subdomains/organization/api";

// background-job — knowledge ingestion pipeline management
export * from "../subdomains/background-job/api";

// Shell UI components, React hooks, and app-context types are in api/ui.ts.
// @see ADR-1200 — UI components removed from capability-contract boundary.

// IAM-owned access and identity exports are re-exposed from ../../iam/api
// for backward compatibility while consumers migrate to the IAM boundary.