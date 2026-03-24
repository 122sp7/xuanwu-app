/**
 * @module workspace-flow/api
 * @file contracts.ts
 * @description Public contracts exposed through the workspace-flow module boundary.
 *
 * All types, DTOs, and projection helpers that external consumers need are
 * re-exported from this single file.  XState internals (canTransition*, nextStatus,
 * isTerminal*) are intentionally NOT exposed here — status machines are internal.
 *
 * @author workspace-flow
 * @created 2026-03-24
 */

// ── Entity types ──────────────────────────────────────────────────────────────

export type { Task } from "../domain/entities/Task";
export type { Issue } from "../domain/entities/Issue";
export type { Invoice } from "../domain/entities/Invoice";
export type { InvoiceItem } from "../domain/entities/InvoiceItem";

// ── Value objects (enum / list only — no transition helpers) ──────────────────

export type { TaskStatus } from "../domain/value-objects/TaskStatus";
export { TASK_STATUSES } from "../domain/value-objects/TaskStatus";

export type { IssueStatus } from "../domain/value-objects/IssueStatus";
export { ISSUE_STATUSES } from "../domain/value-objects/IssueStatus";

export type { IssueStage } from "../domain/value-objects/IssueStage";
export { ISSUE_STAGES } from "../domain/value-objects/IssueStage";

export type { InvoiceStatus } from "../domain/value-objects/InvoiceStatus";
export { INVOICE_STATUSES } from "../domain/value-objects/InvoiceStatus";

// ── Summary projections ───────────────────────────────────────────────────────

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

// ── CRUD / command DTOs ───────────────────────────────────────────────────────

export type { CreateTaskDto } from "../application/dto/create-task.dto";
export type { UpdateTaskDto } from "../application/dto/update-task.dto";

export type { OpenIssueDto } from "../application/dto/open-issue.dto";
export type { ResolveIssueDto } from "../application/dto/resolve-issue.dto";

export type { AddInvoiceItemDto } from "../application/dto/add-invoice-item.dto";
export type { UpdateInvoiceItemDto } from "../application/dto/update-invoice-item.dto";
export type { RemoveInvoiceItemDto } from "../application/dto/remove-invoice-item.dto";

// ── Query / pagination DTOs ───────────────────────────────────────────────────

export type { TaskQueryDto } from "../application/dto/task-query.dto";
export type { IssueQueryDto } from "../application/dto/issue-query.dto";
export type { InvoiceQueryDto } from "../application/dto/invoice-query.dto";
export type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";

// ── Command / operation result ────────────────────────────────────────────────

export type { CommandResult } from "@shared-types";
