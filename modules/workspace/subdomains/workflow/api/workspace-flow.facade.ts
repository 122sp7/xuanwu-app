/**
 * @module workspace-flow/api
 * @file workspace-flow.facade.ts
 * @description Composite facade aggregating Task, Issue, and Invoice operations.
 *
 * Delegates entirely to the three focused facades:
 *   - {@link WorkspaceFlowTaskFacade}   — Task aggregate
 *   - {@link WorkspaceFlowIssueFacade}  — Issue aggregate
 *   - {@link WorkspaceFlowInvoiceFacade} — Invoice aggregate
 *
 * Prefer the focused facades when only one aggregate is needed.
 * Use this composite facade only when all three aggregates must be
 * available through a single construction point.
 *
 * @author workspace-flow
 * @since 2026-03-24
 */

import type { TaskRepository } from "../domain/repositories/TaskRepository";
import type { IssueRepository } from "../domain/repositories/IssueRepository";
import type { InvoiceRepository } from "../domain/repositories/InvoiceRepository";

import { WorkspaceFlowTaskFacade } from "./workspace-flow-task.facade";
import { WorkspaceFlowIssueFacade } from "./workspace-flow-issue.facade";
import { WorkspaceFlowInvoiceFacade } from "./workspace-flow-invoice.facade";

import type { CreateTaskDto } from "../application/dto/create-task.dto";
import type { UpdateTaskDto } from "../application/dto/update-task.dto";
import type { OpenIssueDto } from "../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../application/dto/resolve-issue.dto";
import type { AddInvoiceItemDto } from "../application/dto/add-invoice-item.dto";
import type { UpdateInvoiceItemDto } from "../application/dto/update-invoice-item.dto";
import type { RemoveInvoiceItemDto } from "../application/dto/remove-invoice-item.dto";
import type { TaskQueryDto } from "../application/dto/task-query.dto";
import type { IssueQueryDto } from "../application/dto/issue-query.dto";
import type { InvoiceQueryDto } from "../application/dto/invoice-query.dto";
import type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";

import type {
  TaskSummary,
  IssueSummary,
  InvoiceSummary,
} from "../interfaces/contracts/workspace-flow.contract";

import type { CommandResult } from "@shared-types";

/**
 * WorkspaceFlowFacade
 *
 * Composite entry point for all workspace-flow write and read-summary operations.
 * Delegates to {@link WorkspaceFlowTaskFacade}, {@link WorkspaceFlowIssueFacade},
 * and {@link WorkspaceFlowInvoiceFacade}.
 *
 * @example
 * ```ts
 * const facade = new WorkspaceFlowFacade(
 *   new FirebaseTaskRepository(),
 *   new FirebaseIssueRepository(),
 *   new FirebaseInvoiceRepository(),
 * );
 * await facade.createTask({ workspaceId, title: "My task" });
 * ```
 */
export class WorkspaceFlowFacade {
  private readonly taskFacade: WorkspaceFlowTaskFacade;
  private readonly issueFacade: WorkspaceFlowIssueFacade;
  private readonly invoiceFacade: WorkspaceFlowInvoiceFacade;

  constructor(
    taskRepository: TaskRepository,
    issueRepository: IssueRepository,
    invoiceRepository: InvoiceRepository,
  ) {
    this.taskFacade = new WorkspaceFlowTaskFacade(taskRepository, issueRepository);
    this.issueFacade = new WorkspaceFlowIssueFacade(issueRepository);
    this.invoiceFacade = new WorkspaceFlowInvoiceFacade(invoiceRepository);
  }

  // ── Task operations (delegated) ──────────────────────────────────────────────

  createTask(dto: CreateTaskDto): Promise<CommandResult> { return this.taskFacade.createTask(dto); }
  updateTask(taskId: string, dto: UpdateTaskDto): Promise<CommandResult> { return this.taskFacade.updateTask(taskId, dto); }
  assignTask(taskId: string, assigneeId: string): Promise<CommandResult> { return this.taskFacade.assignTask(taskId, assigneeId); }
  submitTaskToQa(taskId: string): Promise<CommandResult> { return this.taskFacade.submitTaskToQa(taskId); }
  passTaskQa(taskId: string): Promise<CommandResult> { return this.taskFacade.passTaskQa(taskId); }
  approveTaskAcceptance(taskId: string): Promise<CommandResult> { return this.taskFacade.approveTaskAcceptance(taskId); }
  archiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult> { return this.taskFacade.archiveTask(taskId, invoiceStatus); }
  listTasks(query: TaskQueryDto, pagination?: PaginationDto): Promise<PagedResult<TaskSummary>> { return this.taskFacade.listTasks(query, pagination); }
  getTaskSummary(taskId: string): Promise<TaskSummary | null> { return this.taskFacade.getTaskSummary(taskId); }

  // ── Issue operations (delegated) ─────────────────────────────────────────────

  openIssue(dto: OpenIssueDto): Promise<CommandResult> { return this.issueFacade.openIssue(dto); }
  startIssue(issueId: string): Promise<CommandResult> { return this.issueFacade.startIssue(issueId); }
  fixIssue(issueId: string): Promise<CommandResult> { return this.issueFacade.fixIssue(issueId); }
  submitIssueRetest(issueId: string): Promise<CommandResult> { return this.issueFacade.submitIssueRetest(issueId); }
  passIssueRetest(issueId: string): Promise<CommandResult> { return this.issueFacade.passIssueRetest(issueId); }
  failIssueRetest(issueId: string): Promise<CommandResult> { return this.issueFacade.failIssueRetest(issueId); }
  resolveIssue(dto: ResolveIssueDto): Promise<CommandResult> { return this.issueFacade.resolveIssue(dto); }
  closeIssue(issueId: string): Promise<CommandResult> { return this.issueFacade.closeIssue(issueId); }
  listIssues(query: IssueQueryDto, pagination?: PaginationDto): Promise<PagedResult<IssueSummary>> { return this.issueFacade.listIssues(query, pagination); }
  getIssueSummary(issueId: string): Promise<IssueSummary | null> { return this.issueFacade.getIssueSummary(issueId); }

  // ── Invoice operations (delegated) ───────────────────────────────────────────

  createInvoice(workspaceId: string): Promise<CommandResult> { return this.invoiceFacade.createInvoice(workspaceId); }
  addInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult> { return this.invoiceFacade.addInvoiceItem(dto); }
  updateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult> { return this.invoiceFacade.updateInvoiceItem(invoiceItemId, dto); }
  removeInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult> { return this.invoiceFacade.removeInvoiceItem(dto); }
  submitInvoice(invoiceId: string): Promise<CommandResult> { return this.invoiceFacade.submitInvoice(invoiceId); }
  reviewInvoice(invoiceId: string): Promise<CommandResult> { return this.invoiceFacade.reviewInvoice(invoiceId); }
  approveInvoice(invoiceId: string): Promise<CommandResult> { return this.invoiceFacade.approveInvoice(invoiceId); }
  rejectInvoice(invoiceId: string): Promise<CommandResult> { return this.invoiceFacade.rejectInvoice(invoiceId); }
  payInvoice(invoiceId: string): Promise<CommandResult> { return this.invoiceFacade.payInvoice(invoiceId); }
  closeInvoice(invoiceId: string): Promise<CommandResult> { return this.invoiceFacade.closeInvoice(invoiceId); }
  listInvoices(query: InvoiceQueryDto, pagination?: PaginationDto): Promise<PagedResult<InvoiceSummary>> { return this.invoiceFacade.listInvoices(query, pagination); }
  getInvoiceSummary(invoiceId: string): Promise<InvoiceSummary | null> { return this.invoiceFacade.getInvoiceSummary(invoiceId); }
}
 
