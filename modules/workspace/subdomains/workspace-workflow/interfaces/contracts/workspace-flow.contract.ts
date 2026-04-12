/**
 * @module workspace-flow/interfaces/contracts
 * @file workspace-flow.contract.ts
 * @description Module-local interface contracts for workspace-flow UI adapters.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Expand with view-model contracts as UI adapters are added
 */

import type { Task } from "../../application/dto/workflow.dto";
import type { Issue } from "../../application/dto/workflow.dto";
import type { Invoice } from "../../application/dto/workflow.dto";
import type { InvoiceItem } from "../../application/dto/workflow.dto";
import type { TaskMaterializationBatchJob } from "../../application/dto/workflow.dto";

// ── Summary read models (lean projections for UI) ─────────────────────────────

export interface TaskSummary {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly status: Task["status"];
  readonly assigneeId?: string;
}

export interface IssueSummary {
  readonly id: string;
  readonly taskId: string;
  readonly title: string;
  readonly status: Issue["status"];
  readonly stage: Issue["stage"];
}

export interface InvoiceSummary {
  readonly id: string;
  readonly workspaceId: string;
  readonly status: Invoice["status"];
  readonly totalAmount: number;
}

export interface InvoiceItemSummary {
  readonly id: string;
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: InvoiceItem["amount"];
}

export interface TaskMaterializationBatchJobSummary {
  readonly id: string;
  readonly workspaceId: string;
  readonly status: TaskMaterializationBatchJob["status"];
  readonly totalItems: number;
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
  readonly updatedAtISO: string;
}

// ── Projection helpers ────────────────────────────────────────────────────────

export function toTaskSummary(task: Task): TaskSummary {
  return {
    id: task.id,
    workspaceId: task.workspaceId,
    title: task.title,
    status: task.status,
    assigneeId: task.assigneeId,
  };
}

export function toIssueSummary(issue: Issue): IssueSummary {
  return {
    id: issue.id,
    taskId: issue.taskId,
    title: issue.title,
    status: issue.status,
    stage: issue.stage,
  };
}

export function toInvoiceSummary(invoice: Invoice): InvoiceSummary {
  return {
    id: invoice.id,
    workspaceId: invoice.workspaceId,
    status: invoice.status,
    totalAmount: invoice.totalAmount,
  };
}

export function toInvoiceItemSummary(item: InvoiceItem): InvoiceItemSummary {
  return {
    id: item.id,
    invoiceId: item.invoiceId,
    taskId: item.taskId,
    amount: item.amount,
  };
}

export function toTaskMaterializationBatchJobSummary(
  job: TaskMaterializationBatchJob,
): TaskMaterializationBatchJobSummary {
  return {
    id: job.id,
    workspaceId: job.workspaceId,
    status: job.status,
    totalItems: job.totalItems,
    processedItems: job.processedItems,
    succeededItems: job.succeededItems,
    failedItems: job.failedItems,
    updatedAtISO: job.updatedAtISO,
  };
}
 
