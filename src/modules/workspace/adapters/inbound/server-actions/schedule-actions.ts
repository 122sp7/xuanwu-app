"use server";

import { z } from "zod";
import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { CreateWorkDemandSchema } from "../../../subdomains/schedule/application/dto/ScheduleDTO";
import { createClientScheduleUseCases } from "../../outbound/firebase-composition";
import type { WorkDemandSnapshot } from "../../../subdomains/schedule/domain/entities/WorkDemand";

// actorId injection from session is pending GAP-05 ADR decision.
// Until platform.AuthAPI.requireAuth() is available, workspaceId membership is
// not verified here — tracked as GAP-05.

const AssignWorkDemandSchema = z.object({
  assignedUserId: z.string().min(1),
});

export async function createWorkDemandAction(rawInput: unknown): Promise<CommandResult> {
  try {
    const input = CreateWorkDemandSchema.parse(rawInput);
    const { createWorkDemand } = createClientScheduleUseCases();
    return createWorkDemand.execute(input);
  } catch (err) {
    return commandFailureFrom("SCHEDULE_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function assignWorkDemandAction(demandId: string, rawInput: unknown): Promise<CommandResult> {
  try {
    const { assignedUserId } = AssignWorkDemandSchema.parse(rawInput);
    const { assignWorkDemand } = createClientScheduleUseCases();
    return assignWorkDemand.execute(demandId, assignedUserId);
  } catch (err) {
    return commandFailureFrom("SCHEDULE_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function listWorkDemandsByWorkspaceAction(workspaceId: string): Promise<WorkDemandSnapshot[]> {
  try {
    const { listWorkDemandsByWorkspace } = createClientScheduleUseCases();
    return listWorkDemandsByWorkspace.execute(workspaceId);
  } catch {
    return [];
  }
}
