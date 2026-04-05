/**
 * Module: knowledge-database
 * Layer: application/use-cases
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { DatabaseRecord } from "../../domain/entities/record.entity";
import type { IDatabaseRecordRepository } from "../../domain/repositories/IDatabaseRecordRepository";
import {
  CreateRecordSchema, type CreateRecordDto,
  UpdateRecordSchema, type UpdateRecordDto,
  DeleteRecordSchema, type DeleteRecordDto,
} from "../dto/knowledge-database.dto";

export class CreateRecordUseCase {
  constructor(private readonly repo: IDatabaseRecordRepository) {}

  async execute(input: CreateRecordDto): Promise<CommandResult> {
    const parsed = CreateRecordSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("RECORD_INVALID_INPUT", parsed.error.message);
    const { accountId, workspaceId, databaseId, properties = {}, createdByUserId } = parsed.data;
    const rec = await this.repo.create({ accountId, workspaceId, databaseId, properties, createdByUserId });
    return commandSuccess(rec.id, Date.now());
  }
}

export class UpdateRecordUseCase {
  constructor(private readonly repo: IDatabaseRecordRepository) {}

  async execute(input: UpdateRecordDto): Promise<CommandResult> {
    const parsed = UpdateRecordSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("RECORD_INVALID_INPUT", parsed.error.message);
    const result = await this.repo.update(parsed.data);
    if (!result) return commandFailureFrom("RECORD_NOT_FOUND", "Record not found.");
    return commandSuccess(result.id, Date.now());
  }
}

export class DeleteRecordUseCase {
  constructor(private readonly repo: IDatabaseRecordRepository) {}

  async execute(input: DeleteRecordDto): Promise<CommandResult> {
    const parsed = DeleteRecordSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("RECORD_INVALID_INPUT", parsed.error.message);
    await this.repo.delete(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id, Date.now());
  }
}

export class ListRecordsUseCase {
  constructor(private readonly repo: IDatabaseRecordRepository) {}

  async execute(accountId: string, databaseId: string): Promise<DatabaseRecord[]> {
    if (!accountId.trim() || !databaseId.trim()) return [];
    return this.repo.listByDatabase(accountId, databaseId);
  }
}
