/**
 * @module workspace-flow/api
 * @file contracts.ts
 * @description Public read-model contracts exposed through the workspace-flow module boundary.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Narrow exports as the module stabilises
 */

// ── Public entity types ───────────────────────────────────────────────────────

export type { Task } from "../domain/entities/Task";
export type { Issue } from "../domain/entities/Issue";
export type { Invoice } from "../domain/entities/Invoice";
export type { InvoiceItem } from "../domain/entities/InvoiceItem";

// ── Public status / value-object types ───────────────────────────────────────

export type { TaskStatus } from "../domain/value-objects/TaskStatus";
export { TASK_STATUSES, canTransitionTaskStatus, nextTaskStatus, isTerminalTaskStatus } from "../domain/value-objects/TaskStatus";

export type { IssueStatus } from "../domain/value-objects/IssueStatus";
export { ISSUE_STATUSES, canTransitionIssueStatus, isTerminalIssueStatus } from "../domain/value-objects/IssueStatus";

export type { IssueStage } from "../domain/value-objects/IssueStage";
export { ISSUE_STAGES } from "../domain/value-objects/IssueStage";

export type { InvoiceStatus } from "../domain/value-objects/InvoiceStatus";
export { INVOICE_STATUSES, canTransitionInvoiceStatus, isTerminalInvoiceStatus } from "../domain/value-objects/InvoiceStatus";

// ── Public summary projections ────────────────────────────────────────────────

export type {
  TaskSummary,
  IssueSummary,
  InvoiceSummary,
  InvoiceItemSummary,
} from "../interfaces/contracts/workspace-flow.contract";

export {
  toTaskSummary,
  toIssueSummary,
  toInvoiceSummary,
  toInvoiceItemSummary,
} from "../interfaces/contracts/workspace-flow.contract";

// ── Public DTOs ───────────────────────────────────────────────────────────────

export type { CreateTaskDto } from "../application/dto/create-task.dto";
export type { OpenIssueDto } from "../application/dto/open-issue.dto";
export type { AddInvoiceItemDto } from "../application/dto/add-invoice-item.dto";
export type { TaskQueryDto } from "../application/dto/task-query.dto";
export type { IssueQueryDto } from "../application/dto/issue-query.dto";
export type { InvoiceQueryDto } from "../application/dto/invoice-query.dto";
