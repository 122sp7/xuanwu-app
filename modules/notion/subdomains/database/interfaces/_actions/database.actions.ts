"use server";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/_actions
 * Purpose: Database aggregate server actions — create, update, addField, archive.
 *          Record server actions — create, update, delete.
 *          View server actions — create, update, delete.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateDatabaseUseCase,
  UpdateDatabaseUseCase,
  AddFieldUseCase,
  ArchiveDatabaseUseCase,
  CreateRecordUseCase,
  UpdateRecordUseCase,
  DeleteRecordUseCase,
  CreateViewUseCase,
  UpdateViewUseCase,
  DeleteViewUseCase,
} from "../../application/use-cases/index";
import { FirebaseDatabaseRepository } from "../../infrastructure/firebase/FirebaseDatabaseRepository";
import { FirebaseDatabaseRecordRepository } from "../../infrastructure/firebase/FirebaseDatabaseRecordRepository";
import { FirebaseViewRepository } from "../../infrastructure/firebase/FirebaseViewRepository";
import type {
  CreateDatabaseDto,
  UpdateDatabaseDto,
  AddFieldDto,
  ArchiveDatabaseDto,
  CreateRecordDto,
  UpdateRecordDto,
  DeleteRecordDto,
  CreateViewDto,
  UpdateViewDto,
  DeleteViewDto,
} from "../../application/dto/DatabaseDto";

// — — — Database — — —

export async function createDatabase(input: CreateDatabaseDto): Promise<CommandResult> {
  try {
    return await new CreateDatabaseUseCase(new FirebaseDatabaseRepository()).execute(input);
  } catch (err) {
    return commandFailureFrom("DATABASE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateDatabase(input: UpdateDatabaseDto): Promise<CommandResult> {
  try {
    return await new UpdateDatabaseUseCase(new FirebaseDatabaseRepository()).execute(input);
  } catch (err) {
    return commandFailureFrom("DATABASE_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function addDatabaseField(input: AddFieldDto): Promise<CommandResult> {
  try {
    return await new AddFieldUseCase(new FirebaseDatabaseRepository()).execute(input);
  } catch (err) {
    return commandFailureFrom("DATABASE_ADD_FIELD_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function archiveDatabase(input: ArchiveDatabaseDto): Promise<CommandResult> {
  try {
    return await new ArchiveDatabaseUseCase(new FirebaseDatabaseRepository()).execute(input);
  } catch (err) {
    return commandFailureFrom("DATABASE_ARCHIVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// — — — Record — — —

export async function createRecord(input: CreateRecordDto): Promise<CommandResult> {
  try {
    return await new CreateRecordUseCase(new FirebaseDatabaseRecordRepository()).execute(input);
  } catch (err) {
    return commandFailureFrom("RECORD_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateRecord(input: UpdateRecordDto): Promise<CommandResult> {
  try {
    return await new UpdateRecordUseCase(new FirebaseDatabaseRecordRepository()).execute(input);
  } catch (err) {
    return commandFailureFrom("RECORD_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteRecord(accountId: string, id: string): Promise<CommandResult> {
  try {
    return await new DeleteRecordUseCase(new FirebaseDatabaseRecordRepository()).execute({ id, accountId });
  } catch (err) {
    return commandFailureFrom("RECORD_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// — — — View — — —

export async function createView(input: CreateViewDto): Promise<CommandResult> {
  try {
    return await new CreateViewUseCase(new FirebaseViewRepository()).execute(input);
  } catch (err) {
    return commandFailureFrom("VIEW_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateView(input: UpdateViewDto): Promise<CommandResult> {
  try {
    return await new UpdateViewUseCase(new FirebaseViewRepository()).execute(input);
  } catch (err) {
    return commandFailureFrom("VIEW_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteView(input: DeleteViewDto): Promise<CommandResult> {
  try {
    return await new DeleteViewUseCase(new FirebaseViewRepository()).execute(input);
  } catch (err) {
    return commandFailureFrom("VIEW_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
