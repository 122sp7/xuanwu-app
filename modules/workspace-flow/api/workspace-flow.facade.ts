/**
 * @module workspace-flow/api
 * @file workspace-flow.facade.ts
 * @description Public facade for executing workspace-flow operations from external consumers.
 *
 * All CRUD and workflow write operations are exposed exclusively through this class.
 * List operations return {@link PagedResult} for uniform pagination.
 * Scalar-get summary operations return the appropriate {@link *Summary} projection.
 *
 * @author workspace-flow
 * @since 2026-03-24
 */

import type { TaskRepository } from "../domain/repositories/TaskRepository";
import type { IssueRepository } from "../domain/repositories/IssueRepository";
import type { InvoiceRepository } from "../domain/repositories/InvoiceRepository";

import { CreateTaskUseCase } from "../application/use-cases/create-task.use-case";
import { UpdateTaskUseCase } from "../application/use-cases/update-task.use-case";
import { AssignTaskUseCase } from "../application/use-cases/assign-task.use-case";
import { SubmitTaskToQaUseCase } from "../application/use-cases/submit-task-to-qa.use-case";
import { PassTaskQaUseCase } from "../application/use-cases/pass-task-qa.use-case";
import { ApproveTaskAcceptanceUseCase } from "../application/use-cases/approve-task-acceptance.use-case";
import { ArchiveTaskUseCase } from "../application/use-cases/archive-task.use-case";

import { OpenIssueUseCase } from "../application/use-cases/open-issue.use-case";
import { StartIssueUseCase } from "../application/use-cases/start-issue.use-case";
import { FixIssueUseCase } from "../application/use-cases/fix-issue.use-case";
import { SubmitIssueRetestUseCase } from "../application/use-cases/submit-issue-retest.use-case";
import { PassIssueRetestUseCase } from "../application/use-cases/pass-issue-retest.use-case";
import { FailIssueRetestUseCase } from "../application/use-cases/fail-issue-retest.use-case";
import { ResolveIssueUseCase } from "../application/use-cases/resolve-issue.use-case";
import { CloseIssueUseCase } from "../application/use-cases/close-issue.use-case";

import { CreateInvoiceUseCase } from "../application/use-cases/create-invoice.use-case";
import { AddInvoiceItemUseCase } from "../application/use-cases/add-invoice-item.use-case";
import { UpdateInvoiceItemUseCase } from "../application/use-cases/update-invoice-item.use-case";
import { RemoveInvoiceItemUseCase } from "../application/use-cases/remove-invoice-item.use-case";
import { SubmitInvoiceUseCase } from "../application/use-cases/submit-invoice.use-case";
import { ReviewInvoiceUseCase } from "../application/use-cases/review-invoice.use-case";
import { ApproveInvoiceUseCase } from "../application/use-cases/approve-invoice.use-case";
import { RejectInvoiceUseCase } from "../application/use-cases/reject-invoice.use-case";
import { PayInvoiceUseCase } from "../application/use-cases/pay-invoice.use-case";
import { CloseInvoiceUseCase } from "../application/use-cases/close-invoice.use-case";

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
import {
  toTaskSummary,
  toIssueSummary,
  toInvoiceSummary,
} from "../interfaces/contracts/workspace-flow.contract";

import type { CommandResult } from "@shared-types";

// ── Pagination helper ─────────────────────────────────────────────────────────

function toPagedResult<T>(items: T[], pagination?: PaginationDto): PagedResult<T> {
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? (items.length || 20);
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);
  return { items: paged, total: items.length, page, pageSize, hasMore: start + pageSize < items.length };
}

/**
 * WorkspaceFlowFacade
 *
 * Single entry point for all workspace-flow write and read-summary operations.
 * External consumers must construct this with concrete repository implementations.
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
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly issueRepository: IssueRepository,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  // ── Task write operations ────────────────────────────────────────────────────

  async createTask(dto: CreateTaskDto): Promise<CommandResult> {
    return new CreateTaskUseCase(this.taskRepository).execute(dto);
  }

  async updateTask(taskId: string, dto: UpdateTaskDto): Promise<CommandResult> {
    return new UpdateTaskUseCase(this.taskRepository).execute(taskId, dto);
  }

  async assignTask(taskId: string, assigneeId: string): Promise<CommandResult> {
    return new AssignTaskUseCase(this.taskRepository).execute(taskId, assigneeId);
  }

  async submitTaskToQa(taskId: string): Promise<CommandResult> {
    return new SubmitTaskToQaUseCase(this.taskRepository).execute(taskId);
  }

  async passTaskQa(taskId: string): Promise<CommandResult> {
    return new PassTaskQaUseCase(this.taskRepository, this.issueRepository).execute(taskId);
  }

  async approveTaskAcceptance(taskId: string): Promise<CommandResult> {
    return new ApproveTaskAcceptanceUseCase(this.taskRepository, this.issueRepository).execute(taskId);
  }

  async archiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult> {
    return new ArchiveTaskUseCase(this.taskRepository).execute(taskId, invoiceStatus);
  }

  // ── Task read operations ─────────────────────────────────────────────────────

  async listTasks(query: TaskQueryDto, pagination?: PaginationDto): Promise<PagedResult<TaskSummary>> {
    const all = await this.taskRepository.findByWorkspaceId(query.workspaceId);
    const filtered = query.status ? all.filter((t) => t.status === query.status) : all;
    const assigneeFiltered = query.assigneeId
      ? filtered.filter((t) => t.assigneeId === query.assigneeId)
      : filtered;
    return toPagedResult(assigneeFiltered.map(toTaskSummary), pagination);
  }

  async getTaskSummary(taskId: string): Promise<TaskSummary | null> {
    const task = await this.taskRepository.findById(taskId);
    return task ? toTaskSummary(task) : null;
  }

  // ── Issue write operations ───────────────────────────────────────────────────

  async openIssue(dto: OpenIssueDto): Promise<CommandResult> {
    return new OpenIssueUseCase(this.issueRepository).execute(dto);
  }

  async startIssue(issueId: string): Promise<CommandResult> {
    return new StartIssueUseCase(this.issueRepository).execute(issueId);
  }

  async fixIssue(issueId: string): Promise<CommandResult> {
    return new FixIssueUseCase(this.issueRepository).execute(issueId);
  }

  async submitIssueRetest(issueId: string): Promise<CommandResult> {
    return new SubmitIssueRetestUseCase(this.issueRepository).execute(issueId);
  }

  async passIssueRetest(issueId: string): Promise<CommandResult> {
    return new PassIssueRetestUseCase(this.issueRepository).execute(issueId);
  }

  async failIssueRetest(issueId: string): Promise<CommandResult> {
    return new FailIssueRetestUseCase(this.issueRepository).execute(issueId);
  }

  async resolveIssue(dto: ResolveIssueDto): Promise<CommandResult> {
    return new ResolveIssueUseCase(this.issueRepository).execute(dto);
  }

  async closeIssue(issueId: string): Promise<CommandResult> {
    return new CloseIssueUseCase(this.issueRepository).execute(issueId);
  }

  // ── Issue read operations ────────────────────────────────────────────────────

  async listIssues(query: IssueQueryDto, pagination?: PaginationDto): Promise<PagedResult<IssueSummary>> {
    const all = await this.issueRepository.findByTaskId(query.taskId);
    const filtered = query.status ? all.filter((i) => i.status === query.status) : all;
    return toPagedResult(filtered.map(toIssueSummary), pagination);
  }

  async getIssueSummary(issueId: string): Promise<IssueSummary | null> {
    const issue = await this.issueRepository.findById(issueId);
    return issue ? toIssueSummary(issue) : null;
  }

  // ── Invoice write operations ─────────────────────────────────────────────────

  async createInvoice(workspaceId: string): Promise<CommandResult> {
    return new CreateInvoiceUseCase(this.invoiceRepository).execute(workspaceId);
  }

  async addInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult> {
    return new AddInvoiceItemUseCase(this.invoiceRepository).execute(dto);
  }

  async updateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult> {
    return new UpdateInvoiceItemUseCase(this.invoiceRepository).execute(invoiceItemId, dto);
  }

  async removeInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult> {
    return new RemoveInvoiceItemUseCase(this.invoiceRepository).execute(dto.invoiceId, dto.invoiceItemId);
  }

  async submitInvoice(invoiceId: string): Promise<CommandResult> {
    return new SubmitInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async reviewInvoice(invoiceId: string): Promise<CommandResult> {
    return new ReviewInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async approveInvoice(invoiceId: string): Promise<CommandResult> {
    return new ApproveInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async rejectInvoice(invoiceId: string): Promise<CommandResult> {
    return new RejectInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async payInvoice(invoiceId: string): Promise<CommandResult> {
    return new PayInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async closeInvoice(invoiceId: string): Promise<CommandResult> {
    return new CloseInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  // ── Invoice read operations ──────────────────────────────────────────────────

  async listInvoices(query: InvoiceQueryDto, pagination?: PaginationDto): Promise<PagedResult<InvoiceSummary>> {
    const all = await this.invoiceRepository.findByWorkspaceId(query.workspaceId);
    const filtered = query.status ? all.filter((inv) => inv.status === query.status) : all;
    return toPagedResult(filtered.map(toInvoiceSummary), pagination);
  }

  async getInvoiceSummary(invoiceId: string): Promise<InvoiceSummary | null> {
    const invoice = await this.invoiceRepository.findById(invoiceId);
    return invoice ? toInvoiceSummary(invoice) : null;
  }
}
