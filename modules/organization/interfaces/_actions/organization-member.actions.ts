"use server";

/**
 * Module: organization
 * Layer: interfaces/_actions
 * Purpose: Organization member server actions — invite, recruit, dismiss, update role.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { InviteMemberInput } from "../../domain/entities/Organization";
import {
  InviteMemberUseCase,
  RecruitMemberUseCase,
  RemoveMemberUseCase,
  UpdateMemberRoleUseCase,
} from "../../application/use-cases/organization.use-cases";
import { FirebaseOrganizationRepository } from "../../infrastructure/firebase/FirebaseOrganizationRepository";
import type { UpdateMemberRoleInput } from "../../domain/entities/Organization";

const orgRepo = new FirebaseOrganizationRepository();

export async function inviteMember(input: InviteMemberInput): Promise<CommandResult> {
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
