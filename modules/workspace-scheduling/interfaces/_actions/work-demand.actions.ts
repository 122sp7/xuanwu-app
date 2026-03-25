"use server";

/**
 * Module: workspace-scheduling
 * Layer: interfaces/_actions
 * Purpose: Server Actions — the authorised write surface for the UI.
 *
 * UI MUST call these actions for all mutations.
 * They validate input, invoke use cases, and return CommandResult.
 */

import type { CommandResult } from "@shared-types";
import { commandFailureFrom } from "@shared-types";

import { CreateDemandSchema, AssignMemberSchema } from "../../api/schema";
import type { CreateDemandInput, AssignMemberInput } from "../../api/schema";
import {
  SubmitWorkDemandUseCase,
  AssignWorkDemandUseCase,
} from "../../application/work-demand.use-cases";
import { FirebaseDemandRepository } from "../../infrastructure/firebase/FirebaseDemandRepository";

function makeRepo() {
  return new FirebaseDemandRepository();
}

export async function submitWorkDemand(raw: CreateDemandInput): Promise<CommandResult> {
  const parsed = CreateDemandSchema.safeParse(raw);
  if (!parsed.success) {
    return commandFailureFrom("VALIDATION_FAILED", parsed.error.issues[0]?.message ?? "Validation failed");
  }
  try {
    return await new SubmitWorkDemandUseCase(makeRepo()).execute(parsed.data);
  } catch (err) {
    return commandFailureFrom(
      "WORK_DEMAND_ACTION_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function assignWorkDemand(raw: AssignMemberInput): Promise<CommandResult> {
  const parsed = AssignMemberSchema.safeParse(raw);
  if (!parsed.success) {
    return commandFailureFrom("VALIDATION_FAILED", parsed.error.issues[0]?.message ?? "Validation failed");
  }
  try {
    return await new AssignWorkDemandUseCase(makeRepo()).execute(parsed.data);
  } catch (err) {
    return commandFailureFrom(
      "WORK_DEMAND_ACTION_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}
