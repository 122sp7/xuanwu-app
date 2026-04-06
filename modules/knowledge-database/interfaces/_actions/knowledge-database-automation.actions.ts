"use server";

/**
 * Module: knowledge-database
 * Layer: interfaces/_actions
 * Purpose: Server Actions for DatabaseAutomation CRUD.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { FirebaseAutomationRepository } from "../../infrastructure/firebase/FirebaseAutomationRepository";
import {
  CreateAutomationUseCase,
  UpdateAutomationUseCase,
  DeleteAutomationUseCase,
} from "../../application/use-cases/automation.use-cases";
import type { CreateAutomationInput, UpdateAutomationInput } from "../../domain/entities/database-automation.entity";

function makeAutomationRepo() { return new FirebaseAutomationRepository(); }

export async function createAutomation(input: CreateAutomationInput): Promise<CommandResult> {
  try {
    return await new CreateAutomationUseCase(makeAutomationRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("AUTOMATION_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateAutomation(input: UpdateAutomationInput): Promise<CommandResult> {
  try {
    return await new UpdateAutomationUseCase(makeAutomationRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("AUTOMATION_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteAutomation(
  id: string,
  accountId: string,
  databaseId: string,
): Promise<CommandResult> {
  try {
    return await new DeleteAutomationUseCase(makeAutomationRepo()).execute(id, accountId, databaseId);
  } catch (err) {
    return commandFailureFrom("AUTOMATION_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
