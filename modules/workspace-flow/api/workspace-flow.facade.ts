/**
 * @module workspace-flow/api
 * @file workspace-flow.facade.ts
 * @description Public facade for executing workspace-flow operations from external consumers.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add authorization / permission checks before delegating to use cases
 */

import type { Task } from "../domain/entities/Task";
import type { Issue } from "../domain/entities/Issue";
import type { Invoice } from "../domain/entities/Invoice";
import type { InvoiceItem } from "../domain/entities/InvoiceItem";
import type { TaskRepository } from "../domain/repositories/TaskRepository";
import type { IssueRepository } from "../domain/repositories/IssueRepository";
import type { InvoiceRepository } from "../domain/repositories/InvoiceRepository";
import { CreateTaskUseCase } from "../application/use-cases/create-task.use-case";
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
import { CloseIssueUseCase } from "../application/use-cases/close-issue.use-case";
import { CreateInvoiceUseCase } from "../application/use-cases/create-invoice.use-case";
import { AddInvoiceItemUseCase } from "../application/use-cases/add-invoice-item.use-case";
import { RemoveInvoiceItemUseCase } from "../application/use-cases/remove-invoice-item.use-case";
import { SubmitInvoiceUseCase } from "../application/use-cases/submit-invoice.use-case";
import { ReviewInvoiceUseCase } from "../application/use-cases/review-invoice.use-case";
import { ApproveInvoiceUseCase } from "../application/use-cases/approve-invoice.use-case";
import { RejectInvoiceUseCase } from "../application/use-cases/reject-invoice.use-case";
import { PayInvoiceUseCase } from "../application/use-cases/pay-invoice.use-case";
import { CloseInvoiceUseCase } from "../application/use-cases/close-invoice.use-case";
import type { CreateTaskDto } from "../application/dto/create-task.dto";
import type { OpenIssueDto } from "../application/dto/open-issue.dto";
import type { AddInvoiceItemDto } from "../application/dto/add-invoice-item.dto";
import type { CommandResult } from "@shared-types";

/**
 * WorkspaceFlowFacade
 *
 * Single entry point for all workspace-flow write operations.
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

  // ── Task operations ─────────────────────────────────────────────────────────

  async createTask(dto: CreateTaskDto): Promise<CommandResult> {
    return new CreateTaskUseCase(this.taskRepository).execute(dto);
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

  async getTask(taskId: string): Promise<Task | null> {
    return this.taskRepository.findById(taskId);
  }

  async listTasks(workspaceId: string): Promise<Task[]> {
    return this.taskRepository.findByWorkspaceId(workspaceId);
  }

  // ── Issue operations ────────────────────────────────────────────────────────

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

  async closeIssue(issueId: string): Promise<CommandResult> {
    return new CloseIssueUseCase(this.issueRepository).execute(issueId);
  }

  async listIssues(taskId: string): Promise<Issue[]> {
    return this.issueRepository.findByTaskId(taskId);
  }

  // ── Invoice operations ──────────────────────────────────────────────────────

  async createInvoice(workspaceId: string): Promise<CommandResult> {
    return new CreateInvoiceUseCase(this.invoiceRepository).execute(workspaceId);
  }

  async addInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult> {
    return new AddInvoiceItemUseCase(this.invoiceRepository).execute(dto);
  }

  async removeInvoiceItem(invoiceId: string, itemId: string): Promise<CommandResult> {
    return new RemoveInvoiceItemUseCase(this.invoiceRepository).execute(invoiceId, itemId);
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

  async getInvoice(invoiceId: string): Promise<Invoice | null> {
    return this.invoiceRepository.findById(invoiceId);
  }

  async listInvoices(workspaceId: string): Promise<Invoice[]> {
    return this.invoiceRepository.findByWorkspaceId(workspaceId);
  }

  async listInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
    return this.invoiceRepository.listItems(invoiceId);
  }
}
