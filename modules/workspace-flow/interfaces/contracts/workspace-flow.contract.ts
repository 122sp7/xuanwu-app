/**
 * @module workspace-flow/interfaces/contracts
 * @file workspace-flow.contract.ts
 * @description Module-local interface contracts for workspace-flow UI adapters.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Expand with view-model contracts as UI adapters are added
 */

import type { Task } from "../../domain/entities/Task";
import type { Issue } from "../../domain/entities/Issue";
import type { Invoice } from "../../domain/entities/Invoice";
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";

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
