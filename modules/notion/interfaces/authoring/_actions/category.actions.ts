"use server";

/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/_actions
 * Purpose: Category Server Actions — thin adapter over category use cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeCategoryRepo } from "../../../subdomains/authoring/api/factories";
import {
  CreateCategoryUseCase,
  RenameCategoryUseCase,
  MoveCategoryUseCase,
  DeleteCategoryUseCase,
} from "../../../subdomains/authoring/application/use-cases/CategoryUseCases";
import type { z } from "@lib-zod";
import type {
  CreateCategorySchema,
  RenameCategorySchema,
  MoveCategorySchema,
  DeleteCategorySchema,
} from "../../../subdomains/authoring/application/dto/CategoryDto";

export async function createCategory(input: z.infer<typeof CreateCategorySchema>): Promise<CommandResult> {
  try {
    return await new CreateCategoryUseCase(makeCategoryRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_CREATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function renameCategory(input: z.infer<typeof RenameCategorySchema>): Promise<CommandResult> {
  try {
    return await new RenameCategoryUseCase(makeCategoryRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_RENAME_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function moveCategory(input: z.infer<typeof MoveCategorySchema>): Promise<CommandResult> {
  try {
    return await new MoveCategoryUseCase(makeCategoryRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_MOVE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function deleteCategory(input: z.infer<typeof DeleteCategorySchema>): Promise<CommandResult> {
  try {
    return await new DeleteCategoryUseCase(makeCategoryRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_DELETE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}
