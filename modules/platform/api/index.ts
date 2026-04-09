/**
 * platform public API boundary.
 *
 * account is listed before organization to establish canonical definitions for
 * shared type names (OrganizationRole, PolicyEffect, ThemeConfig, Unsubscribe).
 * Organization re-exports are explicit to avoid TS2308 ambiguity errors.
 */

export * from "./contracts";
export * from "./facade";
export * from "../subdomains/identity";
export * from "../subdomains/account";
export * from "../subdomains/notification";

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
} from "../subdomains/organization";
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
} from "../subdomains/organization";