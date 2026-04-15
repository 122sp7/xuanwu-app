/**
 * Public API boundary for the IAM organization subdomain.
 */

export * from "../application";
export { organizationService } from "../interfaces/composition/organization-service";
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
} from "../domain/entities/Organization";
export type { OrganizationRepository } from "../domain/repositories/OrganizationRepository";
export type { OrgPolicyRepository } from "../domain/repositories/OrgPolicyRepository";
export * from "../interfaces";
