"use server";

/**
 * Module: knowledge-database
 * Layer: interfaces/_actions
 * Purpose: Database Aggregate Server Actions — create, update, addField, archive.
 * Record actions: see record.actions.ts
 * View actions: see view.actions.ts
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { FirebaseDatabaseRepository } from "../../infrastructure/firebase/FirebaseDatabaseRepository";
import {
  CreateDatabaseUseCase,
  UpdateDatabaseUseCase,
  AddFieldUseCase,
  ArchiveDatabaseUseCase,
} from "../../application/use-cases/database.use-cases";
import type {
  CreateDatabaseInput,
  UpdateDatabaseInput,
  AddFieldInput,
} from "../../domain/repositories/IDatabaseRepository";

function makeDatabaseRepo() { return new FirebaseDatabaseRepository(); }

export async function createDatabase(input: CreateDatabaseInput): Promise<CommandResult> {
  try {
    return await new CreateDatabaseUseCase(makeDatabaseRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("DATABASE_CREATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function updateDatabase(input: UpdateDatabaseInput): Promise<CommandResult> {
  try {
    return await new UpdateDatabaseUseCase(makeDatabaseRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("DATABASE_UPDATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function addDatabaseField(input: AddFieldInput): Promise<CommandResult> {
  try {
    return await new AddFieldUseCase(makeDatabaseRepo()).execute({
      databaseId: input.databaseId,
      accountId: input.accountId,
      name: input.field.name,
      type: input.field.type,
      config: input.field.config,
      required: input.field.required,
    });
  } catch (e) {
    return commandFailureFrom("DATABASE_ADD_FIELD_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function archiveDatabase(accountId: string, databaseId: string): Promise<CommandResult> {
  try {
    return await new ArchiveDatabaseUseCase(makeDatabaseRepo()).execute({ accountId, id: databaseId });
  } catch (e) {
    return commandFailureFrom("DATABASE_ARCHIVE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}
