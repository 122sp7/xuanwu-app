/**
 * Module: knowledge-base
 * Layer: application/use-cases
 * Category lifecycle use cases.
 */

import { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { ICategoryRepository } from "../../domain/repositories/CategoryRepository";
import type { Category } from "../../domain/entities/category.entity";
import {
  CreateCategorySchema,
  RenameCategorySchema,
  MoveCategorySchema,
  DeleteCategorySchema,
} from "../dto/knowledge-base.dto";
import { v7 as generateId } from "@lib-uuid";

export class CreateCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}

  async execute(input: z.infer<typeof CreateCategorySchema>): Promise<CommandResult> {
    const parsed = CreateCategorySchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CATEGORY_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const now = new Date().toISOString();
    const depth = parsed.data.parentCategoryId ? 1 : 0;
    const category: Category = {
      id: generateId(),
      accountId: parsed.data.accountId,
      workspaceId: parsed.data.workspaceId,
      name: parsed.data.name,
      slug: parsed.data.slug,
      parentCategoryId: parsed.data.parentCategoryId,
      depth,
      articleIds: [],
      description: parsed.data.description,
      createdByUserId: parsed.data.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    };
    await this.repo.save(category);
    return commandSuccess(category.id, now);
  }
}

export class RenameCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}

  async execute(input: z.infer<typeof RenameCategorySchema>): Promise<CommandResult> {
    const parsed = RenameCategorySchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CATEGORY_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const existing = await this.repo.getById(parsed.data.id);
    if (!existing) return commandFailureFrom("CATEGORY_NOT_FOUND", "Category not found");
    const now = new Date().toISOString();
    await this.repo.save({ ...existing, name: parsed.data.name, updatedAtISO: now });
    return commandSuccess(parsed.data.id, now);
  }
}

export class MoveCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}

  async execute(input: z.infer<typeof MoveCategorySchema>): Promise<CommandResult> {
    const parsed = MoveCategorySchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CATEGORY_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const existing = await this.repo.getById(parsed.data.id);
    if (!existing) return commandFailureFrom("CATEGORY_NOT_FOUND", "Category not found");
    const now = new Date().toISOString();
    const depth = parsed.data.parentCategoryId ? 1 : 0;
    await this.repo.save({
      ...existing,
      parentCategoryId: parsed.data.parentCategoryId,
      depth,
      updatedAtISO: now,
    });
    return commandSuccess(parsed.data.id, now);
  }
}

export class DeleteCategoryUseCase {
  constructor(private readonly repo: ICategoryRepository) {}

  async execute(input: z.infer<typeof DeleteCategorySchema>): Promise<CommandResult> {
    const parsed = DeleteCategorySchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CATEGORY_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const existing = await this.repo.getById(parsed.data.id);
    if (!existing) return commandFailureFrom("CATEGORY_NOT_FOUND", "Category not found");
    await this.repo.delete(parsed.data.id);
    return commandSuccess(parsed.data.id, new Date().toISOString());
  }
}

export class ListCategoriesUseCase {
  constructor(private readonly repo: ICategoryRepository) {}

  async execute(workspaceId: string, accountId: string) {
    return this.repo.listByWorkspace(workspaceId, accountId);
  }
}
