"use server";

/**
 * Module: knowledge-base
 * Layer: interfaces/_actions
 * Purpose: Category Server Actions — thin adapter over category use cases.
 * Article actions: see article.actions.ts
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { FirebaseCategoryRepository } from "../../infrastructure/firebase/FirebaseCategoryRepository";
import {
  CreateCategoryUseCase,
  RenameCategoryUseCase,
  MoveCategoryUseCase,
} from "../../application/use-cases/category.use-cases";
import type { z } from "@lib-zod";
import type {
  CreateCategorySchema,
  RenameCategorySchema,
  MoveCategorySchema,
} from "../../application/dto/knowledge-base.dto";

function makeCategoryRepo(accountId: string) {
  return new FirebaseCategoryRepository().withAccountId(accountId);
}

export async function createCategory(input: z.infer<typeof CreateCategorySchema>): Promise<CommandResult> {
  try {
    return await new CreateCategoryUseCase(makeCategoryRepo(input.accountId)).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_CREATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function renameCategory(input: z.infer<typeof RenameCategorySchema>): Promise<CommandResult> {
  try {
    return await new RenameCategoryUseCase(makeCategoryRepo(input.accountId)).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_RENAME_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function moveCategory(input: z.infer<typeof MoveCategorySchema>): Promise<CommandResult> {
  try {
    return await new MoveCategoryUseCase(makeCategoryRepo(input.accountId)).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_MOVE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function deleteCategory(accountId: string, categoryId: string): Promise<CommandResult> {
  try {
    await makeCategoryRepo(accountId).delete(categoryId);
    return commandSuccess(categoryId, 1);
  } catch (e) {
    return commandFailureFrom("CATEGORY_DELETE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}
