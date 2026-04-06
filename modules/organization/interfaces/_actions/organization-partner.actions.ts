"use server";

/**
 * Module: organization
 * Layer: interfaces/_actions
 * Purpose: Organization partner server actions — create group, invite, dismiss.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreatePartnerGroupUseCase,
  SendPartnerInviteUseCase,
  DismissPartnerMemberUseCase,
} from "../../application/use-cases/organization.use-cases";
import { FirebaseOrganizationRepository } from "../../infrastructure/firebase/FirebaseOrganizationRepository";

const orgRepo = new FirebaseOrganizationRepository();

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
