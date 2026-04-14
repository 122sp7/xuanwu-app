/**
 * Module: notion/subdomains/knowledge-database
 * Layer: application/use-cases
 * Purpose: Automation CRUD use cases.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { AutomationRepository, CreateAutomationInput, UpdateAutomationInput } from "../../domain/repositories/AutomationRepository";

export class CreateAutomationUseCase {
  constructor(private readonly repo: AutomationRepository) {}

  async execute(input: CreateAutomationInput): Promise<CommandResult> {
    if (!input.name.trim()) {
      return commandFailureFrom("AUTOMATION_INVALID_INPUT", "Automation name is required.");
    }
    const automation = await this.repo.create(input);
    return commandSuccess(automation.id, Date.now());
  }
}

export class UpdateAutomationUseCase {
  constructor(private readonly repo: AutomationRepository) {}

  async execute(input: UpdateAutomationInput): Promise<CommandResult> {
    const result = await this.repo.update(input);
    if (!result) return commandFailureFrom("AUTOMATION_NOT_FOUND", "Automation not found.");
    return commandSuccess(result.id, Date.now());
  }
}

export class DeleteAutomationUseCase {
  constructor(private readonly repo: AutomationRepository) {}

  async execute(id: string, accountId: string, databaseId: string): Promise<CommandResult> {
    await this.repo.delete(id, accountId, databaseId);
    return commandSuccess(id, Date.now());
  }
}

// Re-export read queries for backward compatibility
export { ListAutomationsUseCase } from "../queries/automation.queries";
