import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";
import type { InviteMemberInput, UpdateMemberRoleInput } from "../../domain/entities/Organization";

export class InviteMemberUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}
  async execute(input: InviteMemberInput): Promise<CommandResult> {
    try {
      const inviteId = await this.orgRepo.inviteMember(input);
      return commandSuccess(inviteId, Date.now());
    } catch (err) {
      return commandFailureFrom("INVITE_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to invite member");
    }
  }
}

export class RecruitMemberUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}
  async execute(organizationId: string, memberId: string, name: string, email: string): Promise<CommandResult> {
    try {
      await this.orgRepo.recruitMember(organizationId, memberId, name, email);
      return commandSuccess(memberId, Date.now());
    } catch (err) {
      return commandFailureFrom("RECRUIT_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to recruit member");
    }
  }
}

export class RemoveMemberUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}
  async execute(organizationId: string, memberId: string): Promise<CommandResult> {
    try {
      await this.orgRepo.removeMember(organizationId, memberId);
      return commandSuccess(memberId, Date.now());
    } catch (err) {
      return commandFailureFrom("REMOVE_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to remove member");
    }
  }
}

export class UpdateMemberRoleUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}
  async execute(input: UpdateMemberRoleInput): Promise<CommandResult> {
    try {
      await this.orgRepo.updateMemberRole(input);
      return commandSuccess(input.memberId, Date.now());
    } catch (err) {
      return commandFailureFrom("UPDATE_MEMBER_ROLE_FAILED", err instanceof Error ? err.message : "Failed to update member role");
    }
  }
}
