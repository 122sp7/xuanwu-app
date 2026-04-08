"use server";

/**
 * Module: knowledge-database
 * Layer: interfaces/_actions
 * Purpose: Record Aggregate Server Actions — create, update, delete.
 * Database actions: see database.actions.ts
 * View actions: see view.actions.ts
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { FirebaseRecordRepository } from "../../infrastructure/firebase/FirebaseRecordRepository";
import {
  CreateRecordUseCase,
  UpdateRecordUseCase,
  DeleteRecordUseCase,
} from "../../application/use-cases/record.use-cases";
import type {
  CreateRecordInput,
  UpdateRecordInput,
} from "../../domain/repositories/IDatabaseRecordRepository";

function makeRecordRepo() { return new FirebaseRecordRepository(); }

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
