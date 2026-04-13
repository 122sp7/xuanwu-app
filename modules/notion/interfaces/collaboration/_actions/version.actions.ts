"use server";

/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/_actions
 * Purpose: Version aggregate server actions — create, delete.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeVersionRepo } from "../composition/repositories";
import { CreateVersionUseCase, DeleteVersionUseCase } from "../../../subdomains/collaboration/application/use-cases/manage-version.use-cases";
import type { CreateVersionDto, DeleteVersionDto } from "../../../subdomains/collaboration/application/dto/CollaborationDto";

export async function createVersion(input: CreateVersionDto): Promise<CommandResult> {
  try {
    return await new CreateVersionUseCase(makeVersionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("VERSION_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteVersion(input: DeleteVersionDto): Promise<CommandResult> {
  try {
    return await new DeleteVersionUseCase(makeVersionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("VERSION_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
