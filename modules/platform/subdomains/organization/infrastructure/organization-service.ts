/**
 * OrganizationService — Composition root for organization use cases.
 */

import { FirebaseOrganizationRepository } from "./firebase/FirebaseOrganizationRepository";
import { FirebaseOrgPolicyRepository } from "./firebase/FirebaseOrgPolicyRepository";
import {
  CreateOrganizationUseCase,
  CreateOrganizationWithTeamUseCase,
  UpdateOrganizationSettingsUseCase,
  DeleteOrganizationUseCase,
} from "../application/use-cases/organization-lifecycle.use-cases";
import {
  InviteMemberUseCase,
  RecruitMemberUseCase,
  RemoveMemberUseCase,
  UpdateMemberRoleUseCase,
} from "../application/use-cases/organization-member.use-cases";
import {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
} from "../application/use-cases/organization-team.use-cases";
import type { OrganizationTeamPort } from "../domain/ports/OrganizationTeamPort";
import {
  CreatePartnerGroupUseCase,
  SendPartnerInviteUseCase,
  DismissPartnerMemberUseCase,
} from "../application/use-cases/organization-partner.use-cases";
import {
  CreateOrgPolicyUseCase,
  UpdateOrgPolicyUseCase,
  DeleteOrgPolicyUseCase,
} from "../application/use-cases/organization-policy.use-cases";
import type {
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
} from "../domain/entities/Organization";
import type { CreateTeamInput } from "../domain/entities/Organization";
import type { CommandResult } from "@shared-types";

let _orgRepo: FirebaseOrganizationRepository | undefined;
let _policyRepo: FirebaseOrgPolicyRepository | undefined;
let _teamPort: OrganizationTeamPort | undefined;
let _teamPortFactory: (() => OrganizationTeamPort) | undefined;

export function configureOrganizationTeamPortFactory(
  factory: () => OrganizationTeamPort,
): void {
  _teamPortFactory = factory;
  _teamPort = undefined;
}

function getOrgRepo(): FirebaseOrganizationRepository {
  if (!_orgRepo) _orgRepo = new FirebaseOrganizationRepository();
  return _orgRepo;
}

function getPolicyRepo(): FirebaseOrgPolicyRepository {
  if (!_policyRepo) _policyRepo = new FirebaseOrgPolicyRepository();
  return _policyRepo;
}

function getTeamPort(): OrganizationTeamPort {
  if (!_teamPortFactory) {
    throw new Error("Organization team port factory is not configured.");
  }
  if (!_teamPort) _teamPort = _teamPortFactory();
  return _teamPort;
}

export const organizationService = {
  createOrganization: (cmd: CreateOrganizationCommand): Promise<CommandResult> =>
    new CreateOrganizationUseCase(getOrgRepo()).execute(cmd),

  createOrganizationWithTeam: (
    cmd: CreateOrganizationCommand,
    teamName: string,
    teamType: "internal" | "external" = "internal",
  ): Promise<CommandResult> =>
    new CreateOrganizationWithTeamUseCase(getOrgRepo()).execute(cmd, teamName, teamType),

  updateSettings: (cmd: UpdateOrganizationSettingsCommand): Promise<CommandResult> =>
    new UpdateOrganizationSettingsUseCase(getOrgRepo()).execute(cmd),

  deleteOrganization: (orgId: string): Promise<CommandResult> =>
    new DeleteOrganizationUseCase(getOrgRepo()).execute(orgId),

  inviteMember: (input: InviteMemberInput): Promise<CommandResult> =>
    new InviteMemberUseCase(getOrgRepo()).execute(input),

  recruitMember: (orgId: string, memberId: string, name: string, email: string): Promise<CommandResult> =>
    new RecruitMemberUseCase(getOrgRepo()).execute(orgId, memberId, name, email),

  removeMember: (orgId: string, memberId: string): Promise<CommandResult> =>
    new RemoveMemberUseCase(getOrgRepo()).execute(orgId, memberId),

  updateMemberRole: (input: UpdateMemberRoleInput): Promise<CommandResult> =>
    new UpdateMemberRoleUseCase(getOrgRepo()).execute(input),

  createTeam: (input: CreateTeamInput): Promise<CommandResult> =>
    new CreateTeamUseCase(getTeamPort()).execute(input),

  deleteTeam: (orgId: string, teamId: string): Promise<CommandResult> =>
    new DeleteTeamUseCase(getTeamPort()).execute(orgId, teamId),

  updateTeamMembers: (orgId: string, teamId: string, memberId: string, action: "add" | "remove"): Promise<CommandResult> =>
    new UpdateTeamMembersUseCase(getTeamPort()).execute(orgId, teamId, memberId, action),

  createPartnerGroup: (orgId: string, groupName: string): Promise<CommandResult> =>
    new CreatePartnerGroupUseCase(getOrgRepo()).execute(orgId, groupName),

  sendPartnerInvite: (orgId: string, teamId: string, email: string): Promise<CommandResult> =>
    new SendPartnerInviteUseCase(getOrgRepo()).execute(orgId, teamId, email),

  dismissPartnerMember: (orgId: string, teamId: string, memberId: string): Promise<CommandResult> =>
    new DismissPartnerMemberUseCase(getOrgRepo()).execute(orgId, teamId, memberId),

  createOrgPolicy: (input: CreateOrgPolicyInput): Promise<CommandResult> =>
    new CreateOrgPolicyUseCase(getPolicyRepo()).execute(input),

  updateOrgPolicy: (policyId: string, data: UpdateOrgPolicyInput): Promise<CommandResult> =>
    new UpdateOrgPolicyUseCase(getPolicyRepo()).execute(policyId, data),

  deleteOrgPolicy: (policyId: string): Promise<CommandResult> =>
    new DeleteOrgPolicyUseCase(getPolicyRepo()).execute(policyId),
};

/**
 * OrganizationQueryService — read-model queries for client-side data.
 * Composition root: wires Firebase repos for queries; interfaces/ must use this
 * via the subdomain api/ boundary instead of importing infrastructure directly.
 */
export const organizationQueryService = {
  getMembers: (organizationId: string) => getOrgRepo().getMembers(organizationId),
  getTeams: (organizationId: string) => getOrgRepo().getTeams(organizationId),
  getOrgPolicies: (orgId: string) => getPolicyRepo().getPolicies(orgId),
};
