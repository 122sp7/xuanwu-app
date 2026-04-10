"use server";

/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow-task.actions.ts
 * @description Server Actions for workspace-flow Task write operations.
 * Delegates exclusively to WorkspaceFlowFacade.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { WorkspaceFlowTaskFacade } from "../../api/workspace-flow-task.facade";
import { makeIssueRepo, makeTaskRepo } from "../../api/factories";
import type { CreateTaskDto } from "../../application/dto/create-task.dto";
import type { UpdateTaskDto } from "../../application/dto/update-task.dto";

function makeFacade(): WorkspaceFlowTaskFacade {
  return new WorkspaceFlowTaskFacade(
    makeTaskRepo(),
    makeIssueRepo(),
  );
}

export async function wfCreateTask(dto: CreateTaskDto): Promise<CommandResult> {
  try {
    return await makeFacade().createTask(dto);
  } catch (err) {
    return commandFailureFrom("WF_TASK_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfUpdateTask(taskId: string, dto: UpdateTaskDto): Promise<CommandResult> {
  try {
    return await makeFacade().updateTask(taskId, dto);
  } catch (err) {
    return commandFailureFrom("WF_TASK_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfAssignTask(taskId: string, assigneeId: string): Promise<CommandResult> {
  try {
    return await makeFacade().assignTask(taskId, assigneeId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_ASSIGN_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfSubmitTaskToQa(taskId: string): Promise<CommandResult> {
  try {
    return await makeFacade().submitTaskToQa(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_SUBMIT_QA_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPassTaskQa(taskId: string): Promise<CommandResult> {
  try {
    return await makeFacade().passTaskQa(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_PASS_QA_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfApproveTaskAcceptance(taskId: string): Promise<CommandResult> {
  try {
    return await makeFacade().approveTaskAcceptance(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_APPROVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfArchiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult> {
  try {
    return await makeFacade().archiveTask(taskId, invoiceStatus);
  } catch (err) {
    return commandFailureFrom("WF_TASK_ARCHIVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
 
