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
  CreateTeamInput,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
} from "../domain/entities/Organization";
import type { CommandResult } from "@shared-types";

const orgRepo = new FirebaseOrganizationRepository();
const policyRepo = new FirebaseOrgPolicyRepository();

export const organizationService = {
  createOrganization: (cmd: CreateOrganizationCommand): Promise<CommandResult> =>
    new CreateOrganizationUseCase(orgRepo).execute(cmd),

  createOrganizationWithTeam: (
    cmd: CreateOrganizationCommand,
    teamName: string,
    teamType: "internal" | "external" = "internal",
  ): Promise<CommandResult> =>
    new CreateOrganizationWithTeamUseCase(orgRepo).execute(cmd, teamName, teamType),

  updateSettings: (cmd: UpdateOrganizationSettingsCommand): Promise<CommandResult> =>
    new UpdateOrganizationSettingsUseCase(orgRepo).execute(cmd),

  deleteOrganization: (orgId: string): Promise<CommandResult> =>
    new DeleteOrganizationUseCase(orgRepo).execute(orgId),

  inviteMember: (input: InviteMemberInput): Promise<CommandResult> =>
    new InviteMemberUseCase(orgRepo).execute(input),

  recruitMember: (orgId: string, memberId: string, name: string, email: string): Promise<CommandResult> =>
    new RecruitMemberUseCase(orgRepo).execute(orgId, memberId, name, email),

  removeMember: (orgId: string, memberId: string): Promise<CommandResult> =>
    new RemoveMemberUseCase(orgRepo).execute(orgId, memberId),

  updateMemberRole: (input: UpdateMemberRoleInput): Promise<CommandResult> =>
    new UpdateMemberRoleUseCase(orgRepo).execute(input),

  createTeam: (input: CreateTeamInput): Promise<CommandResult> =>
    new CreateTeamUseCase(orgRepo).execute(input),

  deleteTeam: (orgId: string, teamId: string): Promise<CommandResult> =>
    new DeleteTeamUseCase(orgRepo).execute(orgId, teamId),

  updateTeamMembers: (orgId: string, teamId: string, memberId: string, action: "add" | "remove"): Promise<CommandResult> =>
    new UpdateTeamMembersUseCase(orgRepo).execute(orgId, teamId, memberId, action),

  createPartnerGroup: (orgId: string, groupName: string): Promise<CommandResult> =>
    new CreatePartnerGroupUseCase(orgRepo).execute(orgId, groupName),

  sendPartnerInvite: (orgId: string, teamId: string, email: string): Promise<CommandResult> =>
    new SendPartnerInviteUseCase(orgRepo).execute(orgId, teamId, email),

  dismissPartnerMember: (orgId: string, teamId: string, memberId: string): Promise<CommandResult> =>
    new DismissPartnerMemberUseCase(orgRepo).execute(orgId, teamId, memberId),

  createOrgPolicy: (input: CreateOrgPolicyInput): Promise<CommandResult> =>
    new CreateOrgPolicyUseCase(policyRepo).execute(input),

  updateOrgPolicy: (policyId: string, data: UpdateOrgPolicyInput): Promise<CommandResult> =>
    new UpdateOrgPolicyUseCase(policyRepo).execute(policyId, data),

  deleteOrgPolicy: (policyId: string): Promise<CommandResult> =>
    new DeleteOrgPolicyUseCase(policyRepo).execute(policyId),
};
