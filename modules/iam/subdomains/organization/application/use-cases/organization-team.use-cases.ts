/**
 * Organization Team Use Cases — team-scoped operations owned by the organization subdomain.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { OrganizationTeamPort } from "../../domain/ports/OrganizationTeamPort";
import type { CreateTeamInput } from "../../domain/entities/Organization";

export class CreateTeamUseCase {
  constructor(private readonly teamPort: OrganizationTeamPort) {}

  async execute(input: CreateTeamInput): Promise<CommandResult> {
    try {
      const teamId = await this.teamPort.createTeam(input);
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom("CREATE_TEAM_FAILED", err instanceof Error ? err.message : "Failed to create team");
    }
  }
}

export class DeleteTeamUseCase {
  constructor(private readonly teamPort: OrganizationTeamPort) {}

  async execute(organizationId: string, teamId: string): Promise<CommandResult> {
    try {
      await this.teamPort.deleteTeam(organizationId, teamId);
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom("DELETE_TEAM_FAILED", err instanceof Error ? err.message : "Failed to delete team");
    }
  }
}

export class UpdateTeamMembersUseCase {
  constructor(private readonly teamPort: OrganizationTeamPort) {}

  async execute(organizationId: string, teamId: string, memberId: string, action: "add" | "remove"): Promise<CommandResult> {
    try {
      if (action === "add") {
        await this.teamPort.addMemberToTeam(organizationId, teamId, memberId);
      } else {
        await this.teamPort.removeMemberFromTeam(organizationId, teamId, memberId);
      }
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom("UPDATE_TEAM_MEMBERS_FAILED", err instanceof Error ? err.message : "Failed to update team members");
    }
  }
}
