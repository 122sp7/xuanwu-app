/**
 * Module: knowledge-database
 * Layer: application/use-cases
 * Use cases for View (database view) lifecycle.
 */

import { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IViewRepository } from "../../domain/repositories/IViewRepository";
import {
  CreateViewSchema,
  UpdateViewSchema,
  DeleteViewSchema,
} from "../dto/knowledge-database.dto";

export class CreateViewUseCase {
  constructor(private readonly viewRepo: IViewRepository) {}

  async execute(input: z.infer<typeof CreateViewSchema>): Promise<CommandResult> {
    const parsed = CreateViewSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("VIEW_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const view = await this.viewRepo.create(parsed.data);
    return commandSuccess(view.id, 1);
  }
}

export class UpdateViewUseCase {
  constructor(private readonly viewRepo: IViewRepository) {}

  async execute(input: z.infer<typeof UpdateViewSchema>): Promise<CommandResult> {
    const parsed = UpdateViewSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("VIEW_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const view = await this.viewRepo.update(parsed.data);
    if (!view) {
      return commandFailureFrom("VIEW_NOT_FOUND", "View not found");
    }
    return commandSuccess(view.id, 1);
  }
}

export class DeleteViewUseCase {
  constructor(private readonly viewRepo: IViewRepository) {}

  async execute(input: z.infer<typeof DeleteViewSchema>): Promise<CommandResult> {
    const parsed = DeleteViewSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("VIEW_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    await this.viewRepo.delete(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id, 1);
  }
}

export class ListViewsUseCase {
  constructor(private readonly viewRepo: IViewRepository) {}

  async execute(accountId: string, databaseId: string) {
    return this.viewRepo.listByDatabase(accountId, databaseId);
  }
}
