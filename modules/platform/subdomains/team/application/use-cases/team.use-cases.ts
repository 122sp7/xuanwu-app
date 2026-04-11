/**
 * Module: platform/subdomains/team
 * Layer: application/use-cases
 * Purpose: Team management use cases — create, delete, and member updates.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { TeamRepository } from "../../domain/repositories/TeamRepository";
import type { CreateTeamInput } from "../../domain/entities/Team";

export class CreateTeamUseCase {
  constructor(private readonly teamRepo: TeamRepository) {}

  async execute(input: CreateTeamInput): Promise<CommandResult> {
    try {
      const teamId = await this.teamRepo.createTeam(input);
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom("CREATE_TEAM_FAILED", err instanceof Error ? err.message : "Failed to create team");
    }
  }
}

export class DeleteTeamUseCase {
  constructor(private readonly teamRepo: TeamRepository) {}

  async execute(organizationId: string, teamId: string): Promise<CommandResult> {
    try {
      await this.teamRepo.deleteTeam(organizationId, teamId);
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom("DELETE_TEAM_FAILED", err instanceof Error ? err.message : "Failed to delete team");
    }
  }
}

export class UpdateTeamMembersUseCase {
  constructor(private readonly teamRepo: TeamRepository) {}

  async execute(
    organizationId: string,
    teamId: string,
    memberId: string,
    action: "add" | "remove",
  ): Promise<CommandResult> {
    try {
      if (action === "add") {
        await this.teamRepo.addMemberToTeam(organizationId, teamId, memberId);
      } else {
        await this.teamRepo.removeMemberFromTeam(organizationId, teamId, memberId);
      }
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom("UPDATE_TEAM_MEMBERS_FAILED", err instanceof Error ? err.message : "Failed to update team members");
    }
  }
}
