/**
 * Module: notion/subdomains/database
 * Layer: application/use-cases
 * Purpose: Database aggregate use cases — create, update, addField, archive, get, list.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { IDatabaseRepository } from "../../domain/repositories/IDatabaseRepository";
import type { DatabaseSnapshot, Field } from "../../domain/aggregates/Database";
import { CreateDatabaseSchema, UpdateDatabaseSchema, AddFieldSchema, ArchiveDatabaseSchema, GetDatabaseSchema, ListDatabasesSchema } from "../dto/DatabaseDto";
import type { CreateDatabaseDto, UpdateDatabaseDto, AddFieldDto, ArchiveDatabaseDto, GetDatabaseDto, ListDatabasesDto } from "../dto/DatabaseDto";

export class CreateDatabaseUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}
  async execute(input: CreateDatabaseDto): Promise<CommandResult> {
    const parsed = CreateDatabaseSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.create(parsed.data);
    return commandSuccess();
  }
}

export class UpdateDatabaseUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}
  async execute(input: UpdateDatabaseDto): Promise<CommandResult> {
    const parsed = UpdateDatabaseSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.update(parsed.data);
    return commandSuccess();
  }
}

export class AddFieldUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}
  async execute(input: AddFieldDto): Promise<CommandResult> {
    const parsed = AddFieldSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.addField(parsed.data);
    return commandSuccess();
  }
}

export class ArchiveDatabaseUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}
  async execute(input: ArchiveDatabaseDto): Promise<CommandResult> {
    const parsed = ArchiveDatabaseSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("INVALID_INPUT", parsed.error.message);
    await this.repo.archive(parsed.data.id, parsed.data.accountId);
    return commandSuccess();
  }
}

export class GetDatabaseUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}
  async execute(input: GetDatabaseDto): Promise<DatabaseSnapshot | null> {
    const parsed = GetDatabaseSchema.safeParse(input);
    if (!parsed.success) return null;
    return this.repo.findById(parsed.data.id, parsed.data.accountId);
  }
}

export class ListDatabasesUseCase {
  constructor(private readonly repo: IDatabaseRepository) {}
  async execute(input: ListDatabasesDto): Promise<DatabaseSnapshot[]> {
    const parsed = ListDatabasesSchema.safeParse(input);
    if (!parsed.success) return [];
    return this.repo.listByWorkspace(parsed.data.accountId, parsed.data.workspaceId);
  }
}
