"use server";

import { z } from "zod";
import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { createClientApprovalUseCases } from "../../outbound/firebase-composition";
import type { ApprovalDecisionSnapshot } from "../../../subdomains/approval/domain/entities/ApprovalDecision";

const CreateApprovalDecisionSchema = z.object({
  taskId: z.string().min(1),
  workspaceId: z.string().min(1),
  approverId: z.string().min(1),
  comments: z.string().max(2000).optional(),
});

const ApprovalCommentSchema = z.object({
  comments: z.string().max(2000).optional(),
});

export async function createApprovalDecisionAction(rawInput: unknown): Promise<CommandResult> {
  try {
    const input = CreateApprovalDecisionSchema.parse(rawInput);
    const { createApprovalDecision } = createClientApprovalUseCases();
    return createApprovalDecision.execute(input);
  } catch (err) {
    return commandFailureFrom("APPROVAL_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function approveTaskAction(decisionId: string, rawInput?: unknown): Promise<CommandResult> {
  try {
    const { comments } = rawInput ? ApprovalCommentSchema.parse(rawInput) : { comments: undefined };
    const { approveTask } = createClientApprovalUseCases();
    return approveTask.execute(decisionId, comments);
  } catch (err) {
    return commandFailureFrom("APPROVAL_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function rejectApprovalAction(decisionId: string, rawInput?: unknown): Promise<CommandResult> {
  try {
    const { comments } = rawInput ? ApprovalCommentSchema.parse(rawInput) : { comments: undefined };
    const { rejectApproval } = createClientApprovalUseCases();
    return rejectApproval.execute(decisionId, comments);
  } catch (err) {
    return commandFailureFrom("APPROVAL_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function listApprovalDecisionsAction(workspaceId: string): Promise<ApprovalDecisionSnapshot[]> {
  try {
    const { listApprovalDecisions } = createClientApprovalUseCases();
    return listApprovalDecisions.execute(workspaceId);
  } catch {
    return [];
  }
}
