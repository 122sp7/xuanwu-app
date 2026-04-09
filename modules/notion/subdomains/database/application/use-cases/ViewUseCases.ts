/**
 * Module: notion/subdomains/database
 * Layer: application/use-cases
 * Purpose: View use cases — create, update, delete, list.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { IViewRepository } from "../../domain/repositories/IViewRepository";
import type { ViewSnapshot } from "../../domain/aggregates/View";
import { CreateViewSchema, UpdateViewSchema, DeleteViewSchema, ListViewsSchema } from "../dto/DatabaseDto";
import type { CreateViewDto, UpdateViewDto, DeleteViewDto, ListViewsDto } from "../dto/DatabaseDto";

export class CreateViewUseCase {
  constructor(private readonly repo: IViewRepository) {}
  async execute(input: CreateViewDto): Promise<CommandResult> {
    const parsed = CreateViewSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.create(parsed.data);
    return commandSuccess();
  }
}

export class UpdateViewUseCase {
  constructor(private readonly repo: IViewRepository) {}
  async execute(input: UpdateViewDto): Promise<CommandResult> {
    const parsed = UpdateViewSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.update(parsed.data);
    return commandSuccess();
  }
}

export class DeleteViewUseCase {
  constructor(private readonly repo: IViewRepository) {}
  async execute(input: DeleteViewDto): Promise<CommandResult> {
    const parsed = DeleteViewSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.delete(parsed.data.id, parsed.data.accountId);
    return commandSuccess();
  }
}

export class ListViewsUseCase {
  constructor(private readonly repo: IViewRepository) {}
  async execute(input: ListViewsDto): Promise<ViewSnapshot[]> {
    const parsed = ListViewsSchema.safeParse(input);
    if (!parsed.success) return [];
    return this.repo.listByDatabase(parsed.data.accountId, parsed.data.databaseId);
  }
}
