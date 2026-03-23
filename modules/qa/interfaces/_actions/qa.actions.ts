"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { CreateTestCaseInput } from "../../domain/entities/TestCase";
import {
  CreateTestCaseUseCase,
  DeleteTestCaseUseCase,
} from "../../application/use-cases/quality-check.use-cases";
import { FirebaseTestCaseRepository } from "../../infrastructure/firebase/FirebaseTestCaseRepository";

function makeRepo() {
  return new FirebaseTestCaseRepository();
}

export async function createTestCase(input: CreateTestCaseInput): Promise<CommandResult> {
  try {
    return await new CreateTestCaseUseCase(makeRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("TC_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteTestCase(testCaseId: string): Promise<CommandResult> {
  try {
    return await new DeleteTestCaseUseCase(makeRepo()).execute(testCaseId);
  } catch (err) {
    return commandFailureFrom("TC_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
