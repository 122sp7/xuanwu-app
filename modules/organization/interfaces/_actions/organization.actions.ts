"use server";

/**
 * Organization Core Server Actions — thin adapter: Server Actions → Application Use Cases.
 * Covers: org lifecycle (create, update settings, delete).
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
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
} from "../../application/use-cases/organization.use-cases";
import {
  CreateOrgPolicyUseCase,
  UpdateOrgPolicyUseCase,
  DeleteOrgPolicyUseCase,
} from "../../application/use-cases/organization-policy.use-cases";
import { FirebaseOrganizationRepository } from "../../infrastructure/firebase/FirebaseOrganizationRepository";
import type {
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  UpdateMemberRoleInput,
  CreateTeamInput,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
} from "../../domain/entities/Organization";

const orgRepo = new FirebaseOrganizationRepository();

// ─── Org Lifecycle ────────────────────────────────────────────────────────────

export async function createOrganization(
  command: CreateOrganizationCommand,
): Promise<CommandResult> {
  try {
    return await new CreateOrganizationUseCase(orgRepo).execute(command);
  } catch (err) {
    return commandFailureFrom("CREATE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function createOrganizationWithTeam(
  command: CreateOrganizationCommand,
  teamName: string,
  teamType: "internal" | "external" = "internal",
): Promise<CommandResult> {
  try {
    return await new CreateOrganizationWithTeamUseCase(orgRepo).execute(command, teamName, teamType);
  } catch (err) {
    return commandFailureFrom("SETUP_ORGANIZATION_WITH_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateOrganizationSettings(
  command: UpdateOrganizationSettingsCommand,
): Promise<CommandResult> {
  try {
    return await new UpdateOrganizationSettingsUseCase(orgRepo).execute(command);
  } catch (err) {
    return commandFailureFrom("UPDATE_ORGANIZATION_SETTINGS_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteOrganization(organizationId: string): Promise<CommandResult> {
  try {
    return await new DeleteOrganizationUseCase(orgRepo).execute(organizationId);
  } catch (err) {
    return commandFailureFrom("DELETE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// ─── Members ─────────────────────────────────────────────────────────────────

export async function inviteMember(input: import("../../domain/entities/Organization").InviteMemberInput): Promise<CommandResult> {
  try {
    return await new InviteMemberUseCase(orgRepo).execute(input);
  } catch (err) {
    return commandFailureFrom("INVITE_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function recruitMember(
  organizationId: string,
  memberId: string,
  name: string,
  email: string,
): Promise<CommandResult> {
  try {
    return await new RecruitMemberUseCase(orgRepo).execute(organizationId, memberId, name, email);
  } catch (err) {
    return commandFailureFrom("RECRUIT_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function dismissMember(
  organizationId: string,
  memberId: string,
): Promise<CommandResult> {
  try {
    return await new RemoveMemberUseCase(orgRepo).execute(organizationId, memberId);
  } catch (err) {
    return commandFailureFrom("DISMISS_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateMemberRole(input: UpdateMemberRoleInput): Promise<CommandResult> {
  try {
    return await new UpdateMemberRoleUseCase(orgRepo).execute(input);
  } catch (err) {
    return commandFailureFrom("UPDATE_MEMBER_ROLE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// ─── Teams ───────────────────────────────────────────────────────────────────

export async function createTeam(input: CreateTeamInput): Promise<CommandResult> {
  try {
    return await new CreateTeamUseCase(orgRepo).execute(input);
  } catch (err) {
    return commandFailureFrom("CREATE_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteTeam(
  organizationId: string,
  teamId: string,
): Promise<CommandResult> {
  try {
    return await new DeleteTeamUseCase(orgRepo).execute(organizationId, teamId);
  } catch (err) {
    return commandFailureFrom("DELETE_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateTeamMembers(
  organizationId: string,
  teamId: string,
  memberId: string,
  action: "add" | "remove",
): Promise<CommandResult> {
  try {
    return await new UpdateTeamMembersUseCase(orgRepo).execute(organizationId, teamId, memberId, action);
  } catch (err) {
    return commandFailureFrom("UPDATE_TEAM_MEMBERS_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// ─── Partners ─────────────────────────────────────────────────────────────────

export async function createPartnerGroup(
  organizationId: string,
  groupName: string,
): Promise<CommandResult> {
  try {
    return await new CreatePartnerGroupUseCase(orgRepo).execute(organizationId, groupName);
  } catch (err) {
    return commandFailureFrom("CREATE_PARTNER_GROUP_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function sendPartnerInvite(
  organizationId: string,
  teamId: string,
  email: string,
): Promise<CommandResult> {
  try {
    return await new SendPartnerInviteUseCase(orgRepo).execute(organizationId, teamId, email);
  } catch (err) {
    return commandFailureFrom("SEND_PARTNER_INVITE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function dismissPartnerMember(
  organizationId: string,
  teamId: string,
  memberId: string,
): Promise<CommandResult> {
  try {
    return await new DismissPartnerMemberUseCase(orgRepo).execute(organizationId, teamId, memberId);
  } catch (err) {
    return commandFailureFrom("DISMISS_PARTNER_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// ─── Policy ───────────────────────────────────────────────────────────────────

export async function createOrgPolicy(input: CreateOrgPolicyInput): Promise<CommandResult> {
  try {
    return await new CreateOrgPolicyUseCase(orgRepo).execute(input);
  } catch (err) {
    return commandFailureFrom("CREATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateOrgPolicy(
  policyId: string,
  data: UpdateOrgPolicyInput,
): Promise<CommandResult> {
  try {
    return await new UpdateOrgPolicyUseCase(orgRepo).execute(policyId, data);
  } catch (err) {
    return commandFailureFrom("UPDATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteOrgPolicy(policyId: string): Promise<CommandResult> {
  try {
    return await new DeleteOrgPolicyUseCase(orgRepo).execute(policyId);
  } catch (err) {
    return commandFailureFrom("DELETE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
