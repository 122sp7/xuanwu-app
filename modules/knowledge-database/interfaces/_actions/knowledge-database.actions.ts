"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { FirebaseDatabaseRepository } from "../../infrastructure/firebase/FirebaseDatabaseRepository";
import { FirebaseRecordRepository } from "../../infrastructure/firebase/FirebaseRecordRepository";
import { FirebaseViewRepository } from "../../infrastructure/firebase/FirebaseViewRepository";
import { CreateDatabaseUseCase, UpdateDatabaseUseCase, AddFieldUseCase, ArchiveDatabaseUseCase } from "../../application/use-cases/database.use-cases";
import { CreateRecordUseCase, UpdateRecordUseCase, DeleteRecordUseCase } from "../../application/use-cases/record.use-cases";
import { CreateViewUseCase, UpdateViewUseCase, DeleteViewUseCase } from "../../application/use-cases/view.use-cases";
import type {
  CreateDatabaseInput,
  UpdateDatabaseInput,
  AddFieldInput,
} from "../../domain/repositories/IDatabaseRepository";
import type {
  CreateRecordInput,
  UpdateRecordInput,
} from "../../domain/repositories/IDatabaseRecordRepository";
import type {
  CreateViewInput,
  UpdateViewInput,
} from "../../domain/repositories/IViewRepository";

function makeDatabaseRepo() { return new FirebaseDatabaseRepository(); }
function makeRecordRepo() { return new FirebaseRecordRepository(); }
function makeViewRepo() { return new FirebaseViewRepository(); }

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

export async function createRecord(input: CreateRecordInput): Promise<CommandResult> {
  try {
    return await new CreateRecordUseCase(makeRecordRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("RECORD_CREATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function updateRecord(input: UpdateRecordInput): Promise<CommandResult> {
  try {
    return await new UpdateRecordUseCase(makeRecordRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("RECORD_UPDATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function deleteRecord(accountId: string, recordId: string): Promise<CommandResult> {
  try {
    return await new DeleteRecordUseCase(makeRecordRepo()).execute({ accountId, id: recordId });
  } catch (e) {
    return commandFailureFrom("RECORD_DELETE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function createView(input: CreateViewInput): Promise<CommandResult> {
  try {
    return await new CreateViewUseCase(makeViewRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("VIEW_CREATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function updateView(input: UpdateViewInput): Promise<CommandResult> {
  try {
    return await new UpdateViewUseCase(makeViewRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("VIEW_UPDATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function deleteView(accountId: string, viewId: string): Promise<CommandResult> {
  try {
    return await new DeleteViewUseCase(makeViewRepo()).execute({ accountId, id: viewId });
  } catch (e) {
    return commandFailureFrom("VIEW_DELETE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}
