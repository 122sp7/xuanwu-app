"use server";

/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow.actions.ts
 * @description Server Actions for workspace-flow write operations.
 *
 * Per IDDD Application Service pattern, each action delegates exclusively to
 * WorkspaceFlowFacade — the single authoritative entry point from the api/ boundary.
 * This file must not wire infrastructure or use-case classes directly.
 *
 * @author workspace-flow
 * @since 2026-03-24
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { WorkspaceFlowFacade } from "../../api/workspace-flow.facade";
import { FirebaseTaskRepository } from "../../infrastructure/repositories/FirebaseTaskRepository";
import { FirebaseIssueRepository } from "../../infrastructure/repositories/FirebaseIssueRepository";
import { FirebaseInvoiceRepository } from "../../infrastructure/repositories/FirebaseInvoiceRepository";
import type { CreateTaskDto } from "../../application/dto/create-task.dto";
import type { UpdateTaskDto } from "../../application/dto/update-task.dto";
import type { OpenIssueDto } from "../../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../../application/dto/resolve-issue.dto";
import type { AddInvoiceItemDto } from "../../application/dto/add-invoice-item.dto";
import type { UpdateInvoiceItemDto } from "../../application/dto/update-invoice-item.dto";
import type { RemoveInvoiceItemDto } from "../../application/dto/remove-invoice-item.dto";

// ── Facade factory ────────────────────────────────────────────────────────────

function makeFacade(): WorkspaceFlowFacade {
  return new WorkspaceFlowFacade(
    new FirebaseTaskRepository(),
    new FirebaseIssueRepository(),
    new FirebaseInvoiceRepository(),
  );
}

// ── Task actions ──────────────────────────────────────────────────────────────

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

// ── Issue actions ─────────────────────────────────────────────────────────────

export async function wfOpenIssue(dto: OpenIssueDto): Promise<CommandResult> {
  try {
    return await makeFacade().openIssue(dto);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_OPEN_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfStartIssue(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().startIssue(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_START_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfFixIssue(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().fixIssue(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_FIX_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfSubmitIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().submitIssueRetest(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_SUBMIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPassIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().passIssueRetest(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_PASS_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfFailIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().failIssueRetest(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_FAIL_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfResolveIssue(dto: ResolveIssueDto): Promise<CommandResult> {
  try {
    return await makeFacade().resolveIssue(dto);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RESOLVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfCloseIssue(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().closeIssue(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_CLOSE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// ── Invoice actions ───────────────────────────────────────────────────────────

export async function wfCreateInvoice(workspaceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().createInvoice(workspaceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfAddInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult> {
  try {
    return await makeFacade().addInvoiceItem(dto);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_ADD_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfUpdateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult> {
  try {
    return await makeFacade().updateInvoiceItem(invoiceItemId, dto);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_UPDATE_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfRemoveInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult> {
  try {
    return await makeFacade().removeInvoiceItem(dto);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REMOVE_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfSubmitInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().submitInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_SUBMIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfReviewInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().reviewInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REVIEW_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfApproveInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().approveInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_APPROVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfRejectInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().rejectInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REJECT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPayInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().payInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_PAY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfCloseInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().closeInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_CLOSE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
