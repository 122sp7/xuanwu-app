/**
 * Organization Lifecycle Use Cases — org CRUD workflows.
 * No React, no Firebase, no UI framework.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";
import type {
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
} from "../../domain/entities/Organization";

export class CreateOrganizationUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(command: CreateOrganizationCommand): Promise<CommandResult> {
    try {
      const orgId = await this.orgRepo.create(command);
      return commandSuccess(orgId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_ORGANIZATION_FAILED",
        err instanceof Error ? err.message : "Failed to create organization",
      );
    }
  }
}

export class CreateOrganizationWithTeamUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(
    command: CreateOrganizationCommand,
    teamName: string,
    teamType: "internal" | "external" = "internal",
  ): Promise<CommandResult> {
    try {
      const organizationId = await this.orgRepo.create(command);
      await this.orgRepo.createTeam({
        organizationId,
        name: teamName,
        description: "",
        type: teamType,
      });
      return commandSuccess(organizationId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "SETUP_ORGANIZATION_WITH_TEAM_FAILED",
        err instanceof Error ? err.message : "Failed to setup organization with team",
      );
    }
  }
}

export class UpdateOrganizationSettingsUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(command: UpdateOrganizationSettingsCommand): Promise<CommandResult> {
    try {
      await this.orgRepo.updateSettings(command);
      return commandSuccess(command.organizationId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_ORGANIZATION_SETTINGS_FAILED",
        err instanceof Error ? err.message : "Failed to update organization settings",
      );
    }
  }
}

export class DeleteOrganizationUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string): Promise<CommandResult> {
    try {
      await this.orgRepo.delete(organizationId);
      return commandSuccess(organizationId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "DELETE_ORGANIZATION_FAILED",
        err instanceof Error ? err.message : "Failed to delete organization",
      );
    }
  }
}
