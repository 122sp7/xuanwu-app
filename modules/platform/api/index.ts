/**
 * platform public API boundary.
 *
 * account is listed before organization to establish canonical definitions for
 * shared type names (OrganizationRole, PolicyEffect, ThemeConfig, Unsubscribe).
 * Organization re-exports are explicit to avoid TS2308 ambiguity errors.
 */

export * from "./contracts";
export * from "./facade";
export * from "../subdomains/identity/api";
export * from "../subdomains/account/api";
export * from "../subdomains/notification/api";

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
  CreateOrganizationUseCase,
  CreateOrganizationWithTeamUseCase,
  UpdateOrganizationSettingsUseCase,
  DeleteOrganizationUseCase,
  InviteMemberUseCase,
  RecruitMemberUseCase,
  RemoveMemberUseCase,
  UpdateMemberRoleUseCase,
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
  CreatePartnerGroupUseCase,
  SendPartnerInviteUseCase,
  DismissPartnerMemberUseCase,
  CreateOrgPolicyUseCase,
  UpdateOrgPolicyUseCase,
  DeleteOrgPolicyUseCase,
  // UI components
  AccountSwitcher,
  CreateOrganizationDialog,
  MembersPage,
  TeamsPage,
  PermissionsPage,
  OrganizationAuditPage,
} from "../subdomains/organization/api";
export type { MembersPageProps, TeamsPageProps, PermissionsPageProps, OrganizationAuditPageProps } from "../subdomains/organization/api";

// background-job — knowledge ingestion pipeline management
export * from "../subdomains/background-job/api";

// platform-level interfaces (HeaderControls, TranslationSwitcher)
export * from "../interfaces";