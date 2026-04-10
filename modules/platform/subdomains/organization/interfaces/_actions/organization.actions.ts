"use server";

/**
 * Organization Server Actions — thin adapters over use cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { organizationService } from "../../infrastructure/organization-service";
import type {
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
} from "../../domain/entities/Organization";

export async function createOrganization(cmd: CreateOrganizationCommand): Promise<CommandResult> {
  try { return await organizationService.createOrganization(cmd); }
  catch (err) { return commandFailureFrom("CREATE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function createOrganizationWithTeam(
  cmd: CreateOrganizationCommand,
  teamName: string,
  teamType: "internal" | "external" = "internal",
): Promise<CommandResult> {
  try { return await organizationService.createOrganizationWithTeam(cmd, teamName, teamType); }
  catch (err) { return commandFailureFrom("SETUP_ORGANIZATION_WITH_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function updateOrganizationSettings(cmd: UpdateOrganizationSettingsCommand): Promise<CommandResult> {
  try { return await organizationService.updateSettings(cmd); }
  catch (err) { return commandFailureFrom("UPDATE_ORGANIZATION_SETTINGS_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function deleteOrganization(organizationId: string): Promise<CommandResult> {
  try { return await organizationService.deleteOrganization(organizationId); }
  catch (err) { return commandFailureFrom("DELETE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function inviteMember(input: InviteMemberInput): Promise<CommandResult> {
  try { return await organizationService.inviteMember(input); }
  catch (err) { return commandFailureFrom("INVITE_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function recruitMember(
  organizationId: string,
  memberId: string,
  name: string,
  email: string,
): Promise<CommandResult> {
  try { return await organizationService.recruitMember(organizationId, memberId, name, email); }
  catch (err) { return commandFailureFrom("RECRUIT_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function dismissMember(organizationId: string, memberId: string): Promise<CommandResult> {
  try { return await organizationService.removeMember(organizationId, memberId); }
  catch (err) { return commandFailureFrom("REMOVE_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function updateMemberRole(input: UpdateMemberRoleInput): Promise<CommandResult> {
  try { return await organizationService.updateMemberRole(input); }
  catch (err) { return commandFailureFrom("UPDATE_MEMBER_ROLE_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function createTeam(input: CreateTeamInput): Promise<CommandResult> {
  try { return await organizationService.createTeam(input); }
  catch (err) { return commandFailureFrom("CREATE_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function deleteTeam(organizationId: string, teamId: string): Promise<CommandResult> {
  try { return await organizationService.deleteTeam(organizationId, teamId); }
  catch (err) { return commandFailureFrom("DELETE_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function updateTeamMembers(
  organizationId: string,
  teamId: string,
  memberId: string,
  action: "add" | "remove",
): Promise<CommandResult> {
  try { return await organizationService.updateTeamMembers(organizationId, teamId, memberId, action); }
  catch (err) { return commandFailureFrom("UPDATE_TEAM_MEMBERS_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function createPartnerGroup(organizationId: string, groupName: string): Promise<CommandResult> {
  try { return await organizationService.createPartnerGroup(organizationId, groupName); }
  catch (err) { return commandFailureFrom("CREATE_PARTNER_GROUP_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function sendPartnerInvite(
  organizationId: string,
  teamId: string,
  email: string,
): Promise<CommandResult> {
  try { return await organizationService.sendPartnerInvite(organizationId, teamId, email); }
  catch (err) { return commandFailureFrom("SEND_PARTNER_INVITE_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function dismissPartnerMember(
  organizationId: string,
  teamId: string,
  memberId: string,
): Promise<CommandResult> {
  try { return await organizationService.dismissPartnerMember(organizationId, teamId, memberId); }
  catch (err) { return commandFailureFrom("DISMISS_PARTNER_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}
