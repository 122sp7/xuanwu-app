/**
 * Module: notion/subdomains/knowledge-database
 * Layer: application/use-cases
 * Purpose: View use cases — create, update, delete, list.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { ViewRepository } from "../../domain/repositories/ViewRepository";
import { CreateViewSchema, UpdateViewSchema, DeleteViewSchema } from "../dto/DatabaseDto";
import type { CreateViewDto, UpdateViewDto, DeleteViewDto } from "../dto/DatabaseDto";

export class CreateViewUseCase {
  constructor(private readonly repo: ViewRepository) {}
  async execute(input: CreateViewDto): Promise<CommandResult> {
    const parsed = CreateViewSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    const result = await this.repo.create(parsed.data);
    return commandSuccess(result.id, 1);
  }
}

export class UpdateViewUseCase {
  constructor(private readonly repo: ViewRepository) {}
  async execute(input: UpdateViewDto): Promise<CommandResult> {
    const parsed = UpdateViewSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    const result = await this.repo.update(parsed.data);
    return commandSuccess(result.id, 0);
  }
}

export class DeleteViewUseCase {
  constructor(private readonly repo: ViewRepository) {}
  async execute(input: DeleteViewDto): Promise<CommandResult> {
    const parsed = DeleteViewSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.delete(parsed.data.id, parsed.data.accountId);
    return commandSuccess(parsed.data.id, 0);
  }
}

// Re-export read queries for backward compatibility
export { ListViewsUseCase } from "../queries/view.queries";
