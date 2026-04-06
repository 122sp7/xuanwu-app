/**
 * Module: knowledge-database
 * Layer: application/use-cases
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { Database } from "../../domain/entities/database.entity";
import type { IDatabaseRepository } from "../../domain/repositories/IDatabaseRepository";
import {
  CreateDatabaseSchema, type CreateDatabaseDto,
  UpdateDatabaseSchema, type UpdateDatabaseDto,
  AddFieldSchema, type AddFieldDto,
  ArchiveDatabaseSchema, type ArchiveDatabaseDto,
} from "../dto/knowledge-database.dto";

export class CreateDatabaseUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}

  async execute(input: CreateDatabaseDto): Promise<CommandResult> {
    const parsed = CreateDatabaseSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("DATABASE_INVALID_INPUT", parsed.error.message);
    const { accountId, workspaceId, name, description, createdByUserId } = parsed.data;
    const db = await this.repo.create({ accountId, workspaceId, name: name.trim(), description, createdByUserId });
    return commandSuccess(db.id, Date.now());
  }
}

export class UpdateDatabaseUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}

  async execute(input: UpdateDatabaseDto): Promise<CommandResult> {
    const parsed = UpdateDatabaseSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("DATABASE_INVALID_INPUT", parsed.error.message);
    const result = await this.repo.update(parsed.data);
    if (!result) return commandFailureFrom("DATABASE_NOT_FOUND", "Database not found.");
    return commandSuccess(result.id, Date.now());
  }
}

export class AddFieldUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}

  async execute(input: AddFieldDto): Promise<CommandResult> {
    const parsed = AddFieldSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("DATABASE_INVALID_INPUT", parsed.error.message);
    const { databaseId, accountId, name, type, config = {}, required = false } = parsed.data;
    const result = await this.repo.addField({ databaseId, accountId, field: { name, type, config, required } });
    if (!result) return commandFailureFrom("DATABASE_NOT_FOUND", "Database not found.");
    return commandSuccess(result.id, Date.now());
  }
}

export class ArchiveDatabaseUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}

  async execute(input: ArchiveDatabaseDto): Promise<CommandResult> {
    const parsed = ArchiveDatabaseSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("DATABASE_INVALID_INPUT", parsed.error.message);
    await this.repo.archive(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id, Date.now());
  }
}

export class GetDatabaseUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}

  async execute(accountId: string, databaseId: string): Promise<Database | null> {
    return this.repo.findById(accountId, databaseId);
  }
}

export class ListDatabasesUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}

  async execute(accountId: string, workspaceId: string): Promise<Database[]> {
    if (!accountId.trim() || !workspaceId.trim()) return [];
    return this.repo.listByWorkspace(accountId, workspaceId);
  }
}
