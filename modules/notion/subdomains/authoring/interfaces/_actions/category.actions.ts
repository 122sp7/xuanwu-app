"use server";

/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/_actions
 * Purpose: Category Server Actions — thin adapter over category use cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { FirebaseCategoryRepository } from "../../infrastructure/firebase/FirebaseCategoryRepository";
import {
  CreateCategoryUseCase,
  RenameCategoryUseCase,
  MoveCategoryUseCase,
  DeleteCategoryUseCase,
} from "../../application/use-cases/CategoryUseCases";
import type { z } from "@lib-zod";
import type {
  CreateCategorySchema,
  RenameCategorySchema,
  MoveCategorySchema,
  DeleteCategorySchema,
} from "../../application/dto/CategoryDto";

function makeRepo() {
  return new FirebaseCategoryRepository();
}

export async function createCategory(input: z.infer<typeof CreateCategorySchema>): Promise<CommandResult> {
  try {
    return await new CreateCategoryUseCase(makeRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_CREATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function renameCategory(input: z.infer<typeof RenameCategorySchema>): Promise<CommandResult> {
  try {
    return await new RenameCategoryUseCase(makeRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_RENAME_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function moveCategory(input: z.infer<typeof MoveCategorySchema>): Promise<CommandResult> {
  try {
    return await new MoveCategoryUseCase(makeRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_MOVE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function deleteCategory(input: z.infer<typeof DeleteCategorySchema>): Promise<CommandResult> {
  try {
    return await new DeleteCategoryUseCase(makeRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_DELETE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}
