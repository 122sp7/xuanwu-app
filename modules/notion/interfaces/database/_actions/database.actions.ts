"use server";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/_actions
 * Purpose: Database, Record, View, and Automation server actions.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  makeAutomationRepo,
  makeDatabaseRepo,
  makeRecordRepo,
  makeViewRepo,
} from "../composition/repositories";
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
  CreateAutomationUseCase,
  UpdateAutomationUseCase,
  DeleteAutomationUseCase,
} from "../../../subdomains/database/application/use-cases";
import type { CreateAutomationInput, UpdateAutomationInput } from "../../../subdomains/database/application/dto/database.dto";
import type {
  CreateDatabaseDto,
  UpdateDatabaseDto,
  AddFieldDto,
  ArchiveDatabaseDto,
  CreateRecordDto,
  UpdateRecordDto,
  CreateViewDto,
  UpdateViewDto,
  DeleteViewDto,
} from "../../../subdomains/database/application/dto/DatabaseDto";

// — — — Database — — —

export async function createDatabase(input: CreateDatabaseDto): Promise<CommandResult> {
  try {
    return await new CreateDatabaseUseCase(makeDatabaseRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("DATABASE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateDatabase(input: UpdateDatabaseDto): Promise<CommandResult> {
  try {
    return await new UpdateDatabaseUseCase(makeDatabaseRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("DATABASE_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function addDatabaseField(input: AddFieldDto): Promise<CommandResult> {
  try {
    return await new AddFieldUseCase(makeDatabaseRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("DATABASE_ADD_FIELD_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function archiveDatabase(input: ArchiveDatabaseDto): Promise<CommandResult> {
  try {
    return await new ArchiveDatabaseUseCase(makeDatabaseRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("DATABASE_ARCHIVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// — — — Record — — —

export async function createRecord(input: CreateRecordDto): Promise<CommandResult> {
  try {
    return await new CreateRecordUseCase(makeRecordRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("RECORD_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateRecord(input: UpdateRecordDto): Promise<CommandResult> {
  try {
    return await new UpdateRecordUseCase(makeRecordRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("RECORD_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteRecord(accountId: string, id: string): Promise<CommandResult> {
  try {
    return await new DeleteRecordUseCase(makeRecordRepo()).execute({ id, accountId });
  } catch (err) {
    return commandFailureFrom("RECORD_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// — — — View — — —

export async function createView(input: CreateViewDto): Promise<CommandResult> {
  try {
    return await new CreateViewUseCase(makeViewRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("VIEW_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateView(input: UpdateViewDto): Promise<CommandResult> {
  try {
    return await new UpdateViewUseCase(makeViewRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("VIEW_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteView(input: DeleteViewDto): Promise<CommandResult> {
  try {
    return await new DeleteViewUseCase(makeViewRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("VIEW_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// — — — Automation — — —

export async function createAutomation(input: CreateAutomationInput): Promise<CommandResult> {
  try {
    return await new CreateAutomationUseCase(makeAutomationRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("AUTOMATION_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateAutomation(input: UpdateAutomationInput): Promise<CommandResult> {
  try {
    return await new UpdateAutomationUseCase(makeAutomationRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("AUTOMATION_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteAutomation(id: string, accountId: string, databaseId: string): Promise<CommandResult> {
  try {
    return await new DeleteAutomationUseCase(makeAutomationRepo()).execute(id, accountId, databaseId);
  } catch (err) {
    return commandFailureFrom("AUTOMATION_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
