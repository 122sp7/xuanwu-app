/**
 * Public API boundary for the organization subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * NOTE: We avoid `export * from "../infrastructure"` here because the
 * infrastructure barrel pulls in Firebase repository constructors during
 * module evaluation, which causes failures during Next.js static
 * prerendering. Infrastructure exports are available in the server barrel
 * (./server.ts) or via direct import from action / service files.
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

// --- Application use cases ---
export {
  CreateOrganizationUseCase,
  CreateOrganizationWithTeamUseCase,
  UpdateOrganizationSettingsUseCase,
  DeleteOrganizationUseCase,
} from "../application";
export {
  InviteMemberUseCase,
  RecruitMemberUseCase,
  RemoveMemberUseCase,
  UpdateMemberRoleUseCase,
} from "../application";
export {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
} from "../application";
export {
  CreatePartnerGroupUseCase,
  SendPartnerInviteUseCase,
  DismissPartnerMemberUseCase,
} from "../application";
export {
  CreateOrgPolicyUseCase,
  UpdateOrgPolicyUseCase,
  DeleteOrgPolicyUseCase,
} from "../application";

// --- Infrastructure (lazy, safe for SSR) ---
export { organizationService, organizationQueryService } from "../infrastructure";

// --- Interfaces (UI, queries, actions) ---
export * from "../interfaces";
