import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { CreateAcceptanceRecordInput } from "../../domain/entities/AcceptanceRecord";
import type { AcceptanceLifecycleStatus } from "../../domain/value-objects/acceptance-state";
import type { AcceptanceRecordTransitionExtra } from "../../domain/repositories/AcceptanceRecordRepository";
import {
  CreateAcceptanceRecordUseCase,
  TransitionAcceptanceRecordUseCase,
} from "../../application/use-cases/acceptance-record.use-cases";
import { FirebaseAcceptanceRecordRepository } from "../../infrastructure/firebase/FirebaseAcceptanceRecordRepository";

function makeRepo() {
  return new FirebaseAcceptanceRecordRepository();
}

export async function createAcceptanceRecord(input: CreateAcceptanceRecordInput): Promise<CommandResult> {
  try {
    return await new CreateAcceptanceRecordUseCase(makeRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("AR_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function transitionAcceptanceRecord(
  recordId: string,
  to: AcceptanceLifecycleStatus,
  extra?: AcceptanceRecordTransitionExtra,
): Promise<CommandResult> {
  try {
    return await new TransitionAcceptanceRecordUseCase(makeRepo()).execute(recordId, to, extra);
  } catch (err) {
    return commandFailureFrom("AR_TRANSITION_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
