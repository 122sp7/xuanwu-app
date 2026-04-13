"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
} from "../../api";
import type { CreateTeamInput } from "../../api";
import { createTeamRepository } from "../../api";

function getRepo() {
  return createTeamRepository();
}

export async function createTeamAction(input: CreateTeamInput): Promise<CommandResult> {
  try {
    return await new CreateTeamUseCase(getRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CREATE_TEAM_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function deleteTeamAction(
  organizationId: string,
  teamId: string,
): Promise<CommandResult> {
  try {
    return await new DeleteTeamUseCase(getRepo()).execute(organizationId, teamId);
  } catch (err) {
    return commandFailureFrom(
      "DELETE_TEAM_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function updateTeamMembersAction(
  organizationId: string,
  teamId: string,
  memberId: string,
  action: "add" | "remove",
): Promise<CommandResult> {
  try {
    return await new UpdateTeamMembersUseCase(getRepo()).execute(
      organizationId,
      teamId,
      memberId,
      action,
    );
  } catch (err) {
    return commandFailureFrom(
      "UPDATE_TEAM_MEMBERS_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}
