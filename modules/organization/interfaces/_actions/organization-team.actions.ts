"use server";

/**
 * @module organization/interfaces/_actions
 * @file organization-team.actions.ts
 * @description Server Actions for Organization team management (create, delete, members).
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
} from "../../application/use-cases/organization.use-cases";
import { FirebaseOrganizationRepository } from "../../infrastructure/firebase/FirebaseOrganizationRepository";
import type { CreateTeamInput } from "../../domain/entities/Organization";

const orgRepo = new FirebaseOrganizationRepository();

export async function createTeam(input: CreateTeamInput): Promise<CommandResult> {
  try {
    return await new CreateTeamUseCase(orgRepo).execute(input);
  } catch (err) {
    return commandFailureFrom("CREATE_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteTeam(
  organizationId: string,
  teamId: string,
): Promise<CommandResult> {
  try {
    return await new DeleteTeamUseCase(orgRepo).execute(organizationId, teamId);
  } catch (err) {
    return commandFailureFrom("DELETE_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateTeamMembers(
  organizationId: string,
  teamId: string,
  memberId: string,
  action: "add" | "remove",
): Promise<CommandResult> {
  try {
    return await new UpdateTeamMembersUseCase(orgRepo).execute(organizationId, teamId, memberId, action);
  } catch (err) {
    return commandFailureFrom("UPDATE_TEAM_MEMBERS_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
