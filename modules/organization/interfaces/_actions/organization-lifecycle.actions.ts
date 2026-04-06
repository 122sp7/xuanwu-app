"use server";

/**
 * @module organization/interfaces/_actions
 * @file organization-lifecycle.actions.ts
 * @description Server Actions for Organization lifecycle (create, settings, delete).
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateOrganizationUseCase,
  CreateOrganizationWithTeamUseCase,
  UpdateOrganizationSettingsUseCase,
  DeleteOrganizationUseCase,
} from "../../application/use-cases/organization.use-cases";
import { FirebaseOrganizationRepository } from "../../infrastructure/firebase/FirebaseOrganizationRepository";
import type {
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
} from "../../domain/entities/Organization";

const orgRepo = new FirebaseOrganizationRepository();

export async function createOrganization(
  command: CreateOrganizationCommand,
): Promise<CommandResult> {
  try {
    return await new CreateOrganizationUseCase(orgRepo).execute(command);
  } catch (err) {
    return commandFailureFrom("CREATE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function createOrganizationWithTeam(
  command: CreateOrganizationCommand,
  teamName: string,
  teamType: "internal" | "external" = "internal",
): Promise<CommandResult> {
  try {
    return await new CreateOrganizationWithTeamUseCase(orgRepo).execute(command, teamName, teamType);
  } catch (err) {
    return commandFailureFrom("SETUP_ORGANIZATION_WITH_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateOrganizationSettings(
  command: UpdateOrganizationSettingsCommand,
): Promise<CommandResult> {
  try {
    return await new UpdateOrganizationSettingsUseCase(orgRepo).execute(command);
  } catch (err) {
    return commandFailureFrom("UPDATE_ORGANIZATION_SETTINGS_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteOrganization(organizationId: string): Promise<CommandResult> {
  try {
    return await new DeleteOrganizationUseCase(orgRepo).execute(organizationId);
  } catch (err) {
    return commandFailureFrom("DELETE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
