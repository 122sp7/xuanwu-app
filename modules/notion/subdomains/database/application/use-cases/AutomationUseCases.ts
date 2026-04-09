/**
 * Module: notion/subdomains/database
 * Layer: application/use-cases
 * Purpose: Automation CRUD use cases.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { DatabaseAutomationSnapshot } from "../../domain/aggregates/DatabaseAutomation";
import type { IAutomationRepository, CreateAutomationInput, UpdateAutomationInput } from "../../domain/repositories/IAutomationRepository";

export class CreateAutomationUseCase {
  constructor(private readonly repo: IAutomationRepository) {}

  async execute(input: CreateAutomationInput): Promise<CommandResult> {
    if (!input.name.trim()) {
      return commandFailureFrom("AUTOMATION_INVALID_INPUT", "Automation name is required.");
    }
    const automation = await this.repo.create(input);
    return commandSuccess(automation.id, Date.now());
  }
}

export class UpdateAutomationUseCase {
  constructor(private readonly repo: IAutomationRepository) {}

  async execute(input: UpdateAutomationInput): Promise<CommandResult> {
    const result = await this.repo.update(input);
    if (!result) return commandFailureFrom("AUTOMATION_NOT_FOUND", "Automation not found.");
    return commandSuccess(result.id, Date.now());
  }
}

export class DeleteAutomationUseCase {
  constructor(private readonly repo: IAutomationRepository) {}

  async execute(id: string, accountId: string, databaseId: string): Promise<CommandResult> {
    await this.repo.delete(id, accountId, databaseId);
    return commandSuccess(id, Date.now());
  }
}

export class ListAutomationsUseCase {
  constructor(private readonly repo: IAutomationRepository) {}

  async execute(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]> {
    return this.repo.listByDatabase(accountId, databaseId);
  }
}
