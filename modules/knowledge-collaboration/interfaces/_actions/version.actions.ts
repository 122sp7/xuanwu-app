"use server";

/**
 * Module: knowledge-collaboration
 * Layer: interfaces/_actions
 * Purpose: Version Aggregate Server Actions — create, delete.
 * Comment actions: see comment.actions.ts
 * Permission actions: see permission.actions.ts
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateVersionUseCase,
  DeleteVersionUseCase,
} from "../../application/use-cases/version.use-cases";
import { FirebaseVersionRepository } from "../../infrastructure/firebase/FirebaseVersionRepository";
import type {
  CreateVersionDto,
  DeleteVersionDto,
} from "../../application/dto/knowledge-collaboration.dto";

function makeVersionRepo() { return new FirebaseVersionRepository(); }

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
