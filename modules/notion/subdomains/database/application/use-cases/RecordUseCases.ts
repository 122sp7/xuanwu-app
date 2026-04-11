/**
 * Module: notion/subdomains/database
 * Layer: application/use-cases
 * Purpose: DatabaseRecord use cases — create, update, delete, list.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { IDatabaseRecordRepository } from "../../domain/repositories/IDatabaseRecordRepository";
import type { DatabaseRecordSnapshot } from "../../domain/aggregates/DatabaseRecord";
import { CreateRecordSchema, UpdateRecordSchema, DeleteRecordSchema, ListRecordsSchema } from "../dto/DatabaseDto";
import type { CreateRecordDto, UpdateRecordDto, DeleteRecordDto, ListRecordsDto } from "../dto/DatabaseDto";

export class CreateRecordUseCase {
  constructor(private readonly repo: IDatabaseRecordRepository) {}
  async execute(input: CreateRecordDto): Promise<CommandResult> {
    const parsed = CreateRecordSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    const result = await this.repo.create(parsed.data);
    return commandSuccess(result.id, 1);
  }
}

export class UpdateRecordUseCase {
  constructor(private readonly repo: IDatabaseRecordRepository) {}
  async execute(input: UpdateRecordDto): Promise<CommandResult> {
    const parsed = UpdateRecordSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    const result = await this.repo.update(parsed.data);
    return commandSuccess(result.id, 0);
  }
}

export class DeleteRecordUseCase {
  constructor(private readonly repo: IDatabaseRecordRepository) {}
  async execute(input: DeleteRecordDto): Promise<CommandResult> {
    const parsed = DeleteRecordSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.delete(parsed.data.id, parsed.data.accountId);
    return commandSuccess(parsed.data.id, 0);
  }
}

// Re-export read queries for backward compatibility
export { ListRecordsUseCase } from "../queries/record.queries";
