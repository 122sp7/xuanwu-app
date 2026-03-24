/**
 * @module workspace-flow
 * @file index.ts
 * @description Local module barrel for workspace-flow.
 *
 * This file is for same-module convenience only.
 * Cross-module consumers MUST import from @/modules/workspace-flow/api instead.
 *
 * @author workspace-flow
 * @created 2026-03-24
 */

// ── Domain: entities ──────────────────────────────────────────────────────────
export type { Task, CreateTaskInput, UpdateTaskInput } from "./domain/entities/Task";
export type { Issue, OpenIssueInput, UpdateIssueInput } from "./domain/entities/Issue";
export type { Invoice, CreateInvoiceInput } from "./domain/entities/Invoice";
export type { InvoiceItem, AddInvoiceItemInput } from "./domain/entities/InvoiceItem";

// ── Domain: value objects (enum lists only — no XState helpers) ───────────────
export type { TaskStatus } from "./domain/value-objects/TaskStatus";
export { TASK_STATUSES } from "./domain/value-objects/TaskStatus";

export type { IssueStatus } from "./domain/value-objects/IssueStatus";
export { ISSUE_STATUSES } from "./domain/value-objects/IssueStatus";

export type { IssueStage } from "./domain/value-objects/IssueStage";
export { ISSUE_STAGES } from "./domain/value-objects/IssueStage";

export type { InvoiceStatus } from "./domain/value-objects/InvoiceStatus";
export { INVOICE_STATUSES } from "./domain/value-objects/InvoiceStatus";

// ── Domain: repository interfaces ─────────────────────────────────────────────
export type { TaskRepository } from "./domain/repositories/TaskRepository";
export type { IssueRepository } from "./domain/repositories/IssueRepository";
export type { InvoiceRepository } from "./domain/repositories/InvoiceRepository";

// ── Domain: events ────────────────────────────────────────────────────────────
export type { TaskEvent } from "./domain/events/TaskEvent";
export type { IssueEvent } from "./domain/events/IssueEvent";
export type { InvoiceEvent } from "./domain/events/InvoiceEvent";

// ── Application: DTOs ─────────────────────────────────────────────────────────
export type { CreateTaskDto } from "./application/dto/create-task.dto";
export type { UpdateTaskDto } from "./application/dto/update-task.dto";
export type { OpenIssueDto } from "./application/dto/open-issue.dto";
export type { ResolveIssueDto } from "./application/dto/resolve-issue.dto";
export type { AddInvoiceItemDto } from "./application/dto/add-invoice-item.dto";
export type { UpdateInvoiceItemDto } from "./application/dto/update-invoice-item.dto";
export type { RemoveInvoiceItemDto } from "./application/dto/remove-invoice-item.dto";
export type { TaskQueryDto } from "./application/dto/task-query.dto";
export type { IssueQueryDto } from "./application/dto/issue-query.dto";
export type { InvoiceQueryDto } from "./application/dto/invoice-query.dto";
export type { PaginationDto, PagedResult } from "./application/dto/pagination.dto";

// ── API: Facade ───────────────────────────────────────────────────────────────
export { WorkspaceFlowFacade } from "./api/workspace-flow.facade";

// ── Infrastructure: repositories ──────────────────────────────────────────────
export { FirebaseTaskRepository } from "./infrastructure/repositories/FirebaseTaskRepository";
export { FirebaseIssueRepository } from "./infrastructure/repositories/FirebaseIssueRepository";
export { FirebaseInvoiceRepository } from "./infrastructure/repositories/FirebaseInvoiceRepository";
export { FirebaseInvoiceItemRepository } from "./infrastructure/repositories/FirebaseInvoiceItemRepository";

// ── Interfaces: Server Actions ────────────────────────────────────────────────
export {
  wfCreateTask,
  wfUpdateTask,
  wfAssignTask,
  wfSubmitTaskToQa,
  wfPassTaskQa,
  wfApproveTaskAcceptance,
  wfArchiveTask,
  wfOpenIssue,
  wfResolveIssue,
  wfStartIssue,
  wfFixIssue,
  wfSubmitIssueRetest,
  wfPassIssueRetest,
  wfFailIssueRetest,
  wfCloseIssue,
  wfCreateInvoice,
  wfAddInvoiceItem,
  wfUpdateInvoiceItem,
  wfRemoveInvoiceItem,
  wfSubmitInvoice,
  wfReviewInvoice,
  wfApproveInvoice,
  wfRejectInvoice,
  wfPayInvoice,
  wfCloseInvoice,
} from "./interfaces/_actions/workspace-flow.actions";

// ── Interfaces: Queries ───────────────────────────────────────────────────────
export {
  getWorkspaceFlowTasks,
  getWorkspaceFlowTask,
  getWorkspaceFlowIssues,
  getWorkspaceFlowInvoices,
  getWorkspaceFlowInvoiceItems,
} from "./interfaces/queries/workspace-flow.queries";
