/**
 * Organization Use Cases — pure business workflows.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@/shared/types";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";
import type {
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
} from "../../domain/entities/Organization";

export class InviteMemberUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(input: InviteMemberInput): Promise<CommandResult> {
    try {
      const inviteId = await this.orgRepo.inviteMember(input);
      return commandSuccess(inviteId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "INVITE_MEMBER_FAILED",
        err instanceof Error ? err.message : "Failed to invite member",
      );
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
      return commandFailureFrom(
        "REMOVE_MEMBER_FAILED",
        err instanceof Error ? err.message : "Failed to remove member",
      );
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
      return commandFailureFrom(
        "UPDATE_MEMBER_ROLE_FAILED",
        err instanceof Error ? err.message : "Failed to update member role",
      );
    }
  }
}

export class CreateTeamUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(input: CreateTeamInput): Promise<CommandResult> {
    try {
      const teamId = await this.orgRepo.createTeam(input);
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_TEAM_FAILED",
        err instanceof Error ? err.message : "Failed to create team",
      );
    }
  }
}

export class DeleteTeamUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string, teamId: string): Promise<CommandResult> {
    try {
      await this.orgRepo.deleteTeam(organizationId, teamId);
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "DELETE_TEAM_FAILED",
        err instanceof Error ? err.message : "Failed to delete team",
      );
    }
  }
}
