/**
 * Organization Partner Use Cases — external partner group workflows.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";

export class CreatePartnerGroupUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string, groupName: string): Promise<CommandResult> {
    try {
      const teamId = await this.orgRepo.createTeam({ organizationId, name: groupName, description: "", type: "external" });
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom("CREATE_PARTNER_GROUP_FAILED", err instanceof Error ? err.message : "Failed to create partner group");
    }
  }
}

export class SendPartnerInviteUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string, teamId: string, email: string): Promise<CommandResult> {
    try {
      const inviteId = await this.orgRepo.sendPartnerInvite(organizationId, teamId, email);
      return commandSuccess(inviteId, Date.now());
    } catch (err) {
      return commandFailureFrom("SEND_PARTNER_INVITE_FAILED", err instanceof Error ? err.message : "Failed to send partner invite");
    }
  }
}

export class DismissPartnerMemberUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string, teamId: string, memberId: string): Promise<CommandResult> {
    try {
      await this.orgRepo.dismissPartnerMember(organizationId, teamId, memberId);
      return commandSuccess(memberId, Date.now());
    } catch (err) {
      return commandFailureFrom("DISMISS_PARTNER_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to dismiss partner member");
    }
  }
}
