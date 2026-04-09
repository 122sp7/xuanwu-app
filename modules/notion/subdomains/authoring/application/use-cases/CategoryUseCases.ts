/**
 * Module: notion/subdomains/authoring
 * Layer: application/use-cases
 * Purpose: Category use cases ??create, rename, move, delete.
 */

import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
import { Category } from "../../domain/aggregates/Category";
import type { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import {
  CreateCategorySchema,
  RenameCategorySchema,
  MoveCategorySchema,
  DeleteCategorySchema,
} from "../dto/CategoryDto";

export class CreateCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}

  async execute(input: z.infer<typeof CreateCategorySchema>): Promise<CommandResult> {
    const parsed = CreateCategorySchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CATEGORY_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const category = Category.create(generateId(), {
      accountId: parsed.data.accountId,
      workspaceId: parsed.data.workspaceId,
      name: parsed.data.name,
      parentCategoryId: parsed.data.parentCategoryId,
      depth: parsed.data.depth,
      description: parsed.data.description,
      createdByUserId: parsed.data.createdByUserId,
    });
    await this.repo.save(category.getSnapshot());
    return commandSuccess(category.id, 1);
  }
}

export class RenameCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}

  async execute(input: z.infer<typeof RenameCategorySchema>): Promise<CommandResult> {
    const parsed = RenameCategorySchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CATEGORY_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const snapshot = await this.repo.getById(parsed.data.accountId, parsed.data.id);
    if (!snapshot) return commandFailureFrom("CATEGORY_NOT_FOUND", "Category not found");
    const category = Category.reconstitute(snapshot);
    category.rename(parsed.data.name);
    await this.repo.save(category.getSnapshot());
    return commandSuccess(category.id, 1);
  }
}

export class MoveCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}

  async execute(input: z.infer<typeof MoveCategorySchema>): Promise<CommandResult> {
    const parsed = MoveCategorySchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CATEGORY_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const snapshot = await this.repo.getById(parsed.data.accountId, parsed.data.id);
    if (!snapshot) return commandFailureFrom("CATEGORY_NOT_FOUND", "Category not found");
    const category = Category.reconstitute(snapshot);
    category.move(parsed.data.newParentCategoryId, parsed.data.newDepth);
    await this.repo.save(category.getSnapshot());
    return commandSuccess(category.id, 1);
  }
}

export class DeleteCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}

  async execute(input: z.infer<typeof DeleteCategorySchema>): Promise<CommandResult> {
    const parsed = DeleteCategorySchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CATEGORY_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    await this.repo.delete(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id, 0);
  }
}
