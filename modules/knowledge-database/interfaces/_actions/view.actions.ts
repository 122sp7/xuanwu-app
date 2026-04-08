"use server";

/**
 * Module: knowledge-database
 * Layer: interfaces/_actions
 * Purpose: View Aggregate Server Actions — create, update, delete.
 * Database actions: see database.actions.ts
 * Record actions: see record.actions.ts
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { FirebaseViewRepository } from "../../infrastructure/firebase/FirebaseViewRepository";
import {
  CreateViewUseCase,
  UpdateViewUseCase,
  DeleteViewUseCase,
} from "../../application/use-cases/view.use-cases";
import type {
  CreateViewInput,
  UpdateViewInput,
} from "../../domain/repositories/IViewRepository";

function makeViewRepo() { return new FirebaseViewRepository(); }

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
