"use server";

/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow.actions.ts
 * @description Server Actions for workspace-flow write operations.
 * @author workspace-flow
 * @created 2026-03-24
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { CreateTaskDto } from "../../application/dto/create-task.dto";
import type { UpdateTaskDto } from "../../application/dto/update-task.dto";
import type { OpenIssueDto } from "../../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../../application/dto/resolve-issue.dto";
import type { AddInvoiceItemDto } from "../../application/dto/add-invoice-item.dto";
import type { UpdateInvoiceItemDto } from "../../application/dto/update-invoice-item.dto";
import type { RemoveInvoiceItemDto } from "../../application/dto/remove-invoice-item.dto";
import { CreateTaskUseCase } from "../../application/use-cases/create-task.use-case";
import { UpdateTaskUseCase } from "../../application/use-cases/update-task.use-case";
import { AssignTaskUseCase } from "../../application/use-cases/assign-task.use-case";
import { SubmitTaskToQaUseCase } from "../../application/use-cases/submit-task-to-qa.use-case";
import { PassTaskQaUseCase } from "../../application/use-cases/pass-task-qa.use-case";
import { ApproveTaskAcceptanceUseCase } from "../../application/use-cases/approve-task-acceptance.use-case";
import { ArchiveTaskUseCase } from "../../application/use-cases/archive-task.use-case";
import { OpenIssueUseCase } from "../../application/use-cases/open-issue.use-case";
import { StartIssueUseCase } from "../../application/use-cases/start-issue.use-case";
import { FixIssueUseCase } from "../../application/use-cases/fix-issue.use-case";
import { SubmitIssueRetestUseCase } from "../../application/use-cases/submit-issue-retest.use-case";
import { PassIssueRetestUseCase } from "../../application/use-cases/pass-issue-retest.use-case";
import { FailIssueRetestUseCase } from "../../application/use-cases/fail-issue-retest.use-case";
import { ResolveIssueUseCase } from "../../application/use-cases/resolve-issue.use-case";
import { CloseIssueUseCase } from "../../application/use-cases/close-issue.use-case";
import { CreateInvoiceUseCase } from "../../application/use-cases/create-invoice.use-case";
import { AddInvoiceItemUseCase } from "../../application/use-cases/add-invoice-item.use-case";
import { UpdateInvoiceItemUseCase } from "../../application/use-cases/update-invoice-item.use-case";
import { RemoveInvoiceItemUseCase } from "../../application/use-cases/remove-invoice-item.use-case";
import { SubmitInvoiceUseCase } from "../../application/use-cases/submit-invoice.use-case";
import { ReviewInvoiceUseCase } from "../../application/use-cases/review-invoice.use-case";
import { ApproveInvoiceUseCase } from "../../application/use-cases/approve-invoice.use-case";
import { RejectInvoiceUseCase } from "../../application/use-cases/reject-invoice.use-case";
import { PayInvoiceUseCase } from "../../application/use-cases/pay-invoice.use-case";
import { CloseInvoiceUseCase } from "../../application/use-cases/close-invoice.use-case";
import { FirebaseTaskRepository } from "../../infrastructure/repositories/FirebaseTaskRepository";
import { FirebaseIssueRepository } from "../../infrastructure/repositories/FirebaseIssueRepository";
import { FirebaseInvoiceRepository } from "../../infrastructure/repositories/FirebaseInvoiceRepository";

// ── Repository factories ──────────────────────────────────────────────────────

function makeTaskRepo() { return new FirebaseTaskRepository(); }
function makeIssueRepo() { return new FirebaseIssueRepository(); }
function makeInvoiceRepo() { return new FirebaseInvoiceRepository(); }

// ── Task actions ──────────────────────────────────────────────────────────────

export async function wfCreateTask(dto: CreateTaskDto): Promise<CommandResult> {
  try {
    return await new CreateTaskUseCase(makeTaskRepo()).execute(dto);
  } catch (err) {
    return commandFailureFrom("WF_TASK_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfUpdateTask(taskId: string, dto: UpdateTaskDto): Promise<CommandResult> {
  try {
    return await new UpdateTaskUseCase(makeTaskRepo()).execute(taskId, dto);
  } catch (err) {
    return commandFailureFrom("WF_TASK_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfAssignTask(taskId: string, assigneeId: string): Promise<CommandResult> {
  try {
    return await new AssignTaskUseCase(makeTaskRepo()).execute(taskId, assigneeId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_ASSIGN_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfSubmitTaskToQa(taskId: string): Promise<CommandResult> {
  try {
    return await new SubmitTaskToQaUseCase(makeTaskRepo()).execute(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_SUBMIT_QA_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPassTaskQa(taskId: string): Promise<CommandResult> {
  try {
    return await new PassTaskQaUseCase(makeTaskRepo(), makeIssueRepo()).execute(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_PASS_QA_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfApproveTaskAcceptance(taskId: string): Promise<CommandResult> {
  try {
    return await new ApproveTaskAcceptanceUseCase(makeTaskRepo(), makeIssueRepo()).execute(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_APPROVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfArchiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult> {
  try {
    return await new ArchiveTaskUseCase(makeTaskRepo()).execute(taskId, invoiceStatus);
  } catch (err) {
    return commandFailureFrom("WF_TASK_ARCHIVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// ── Issue actions ─────────────────────────────────────────────────────────────

export async function wfOpenIssue(dto: OpenIssueDto): Promise<CommandResult> {
  try {
    return await new OpenIssueUseCase(makeIssueRepo()).execute(dto);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_OPEN_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfStartIssue(issueId: string): Promise<CommandResult> {
  try {
    return await new StartIssueUseCase(makeIssueRepo()).execute(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_START_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfFixIssue(issueId: string): Promise<CommandResult> {
  try {
    return await new FixIssueUseCase(makeIssueRepo()).execute(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_FIX_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfSubmitIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await new SubmitIssueRetestUseCase(makeIssueRepo()).execute(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_SUBMIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPassIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await new PassIssueRetestUseCase(makeIssueRepo()).execute(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_PASS_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfFailIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await new FailIssueRetestUseCase(makeIssueRepo()).execute(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_FAIL_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfResolveIssue(dto: ResolveIssueDto): Promise<CommandResult> {
  try {
    return await new ResolveIssueUseCase(makeIssueRepo()).execute(dto);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RESOLVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfCloseIssue(issueId: string): Promise<CommandResult> {
  try {
    return await new CloseIssueUseCase(makeIssueRepo()).execute(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_CLOSE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

// ── Invoice actions ───────────────────────────────────────────────────────────

export async function wfCreateInvoice(workspaceId: string): Promise<CommandResult> {
  try {
    return await new CreateInvoiceUseCase(makeInvoiceRepo()).execute(workspaceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfAddInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult> {
  try {
    return await new AddInvoiceItemUseCase(makeInvoiceRepo()).execute(dto);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_ADD_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfUpdateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult> {
  try {
    return await new UpdateInvoiceItemUseCase(makeInvoiceRepo()).execute(invoiceItemId, dto);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_UPDATE_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfRemoveInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult> {
  try {
    return await new RemoveInvoiceItemUseCase(makeInvoiceRepo()).execute(dto.invoiceId, dto.invoiceItemId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REMOVE_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfSubmitInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await new SubmitInvoiceUseCase(makeInvoiceRepo()).execute(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_SUBMIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfReviewInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await new ReviewInvoiceUseCase(makeInvoiceRepo()).execute(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REVIEW_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfApproveInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await new ApproveInvoiceUseCase(makeInvoiceRepo()).execute(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_APPROVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfRejectInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await new RejectInvoiceUseCase(makeInvoiceRepo()).execute(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REJECT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPayInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await new PayInvoiceUseCase(makeInvoiceRepo()).execute(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_PAY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfCloseInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await new CloseInvoiceUseCase(makeInvoiceRepo()).execute(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_CLOSE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
