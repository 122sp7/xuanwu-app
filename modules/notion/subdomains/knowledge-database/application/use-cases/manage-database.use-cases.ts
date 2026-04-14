/**
 * Module: notion/subdomains/knowledge-database
 * Layer: application/use-cases
 * Purpose: Database aggregate use cases — create, update, addField, archive, get, list.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { DatabaseRepository } from "../../domain/repositories/DatabaseRepository";
import { CreateDatabaseSchema, UpdateDatabaseSchema, AddFieldSchema, ArchiveDatabaseSchema } from "../dto/DatabaseDto";
import type { CreateDatabaseDto, UpdateDatabaseDto, AddFieldDto, ArchiveDatabaseDto } from "../dto/DatabaseDto";

export class CreateDatabaseUseCase {
  constructor(private readonly repo: DatabaseRepository) {}
  async execute(input: CreateDatabaseDto): Promise<CommandResult> {
    const parsed = CreateDatabaseSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    const result = await this.repo.create(parsed.data);
    return commandSuccess(result.id, 1);
  }
}

export class UpdateDatabaseUseCase {
  constructor(private readonly repo: DatabaseRepository) {}
  async execute(input: UpdateDatabaseDto): Promise<CommandResult> {
    const parsed = UpdateDatabaseSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    const result = await this.repo.update(parsed.data);
    return commandSuccess(result?.id ?? parsed.data.id, 0);
  }
}

export class AddFieldUseCase {
  constructor(private readonly repo: DatabaseRepository) {}
  async execute(input: AddFieldDto): Promise<CommandResult> {
    const parsed = AddFieldSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.addField(parsed.data);
    return commandSuccess(parsed.data.databaseId, 0);
  }
}

export class ArchiveDatabaseUseCase {
  constructor(private readonly repo: DatabaseRepository) {}
  async execute(input: ArchiveDatabaseDto): Promise<CommandResult> {
    const parsed = ArchiveDatabaseSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.archive(parsed.data.id, parsed.data.accountId);
    return commandSuccess(parsed.data.id, 0);
  }
}

// Re-export read queries for backward compatibility
export { GetDatabaseUseCase, ListDatabasesUseCase } from "../queries/database.queries";
