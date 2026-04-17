import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";
import type { CreateTeamInput } from "../../domain/entities/Organization";

export class CreateTeamUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}
  async execute(input: CreateTeamInput): Promise<CommandResult> {
    try {
      const teamId = await this.orgRepo.createTeam(input);
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom("CREATE_TEAM_FAILED", err instanceof Error ? err.message : "Failed to create team");
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
      return commandFailureFrom("DELETE_TEAM_FAILED", err instanceof Error ? err.message : "Failed to delete team");
    }
  }
}

export class AddMemberToTeamUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}
  async execute(organizationId: string, teamId: string, memberId: string): Promise<CommandResult> {
    try {
      await this.orgRepo.addMemberToTeam(organizationId, teamId, memberId);
      return commandSuccess(memberId, Date.now());
    } catch (err) {
      return commandFailureFrom("ADD_TEAM_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to add member to team");
    }
  }
}

export class RemoveMemberFromTeamUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}
  async execute(organizationId: string, teamId: string, memberId: string): Promise<CommandResult> {
    try {
      await this.orgRepo.removeMemberFromTeam(organizationId, teamId, memberId);
      return commandSuccess(memberId, Date.now());
    } catch (err) {
      return commandFailureFrom("REMOVE_TEAM_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to remove member from team");
    }
  }
}
