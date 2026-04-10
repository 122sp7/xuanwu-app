/**
 * @module workspace-flow/api
 * @file workspace-flow-task.facade.ts
 * @description Focused facade for Task aggregate write and summary-read operations.
 *
 * Consumers that only need Task operations should use this class directly
 * instead of the composite {@link WorkspaceFlowFacade}.
 *
 * Note: `issueRepository` is required because `passTaskQa` and
 * `approveTaskAcceptance` are cross-aggregate operations that create issues
 * as a side-effect of task state transitions.
 *
 * @author workspace-flow
 * @since 2026-04-06
 */

import type { TaskRepository } from "../domain/repositories/TaskRepository";
import type { IssueRepository } from "../domain/repositories/IssueRepository";

import { CreateTaskUseCase } from "../application/use-cases/create-task.use-case";
import { UpdateTaskUseCase } from "../application/use-cases/update-task.use-case";
import { AssignTaskUseCase } from "../application/use-cases/assign-task.use-case";
import { SubmitTaskToQaUseCase } from "../application/use-cases/submit-task-to-qa.use-case";
import { PassTaskQaUseCase } from "../application/use-cases/pass-task-qa.use-case";
import { ApproveTaskAcceptanceUseCase } from "../application/use-cases/approve-task-acceptance.use-case";
import { ArchiveTaskUseCase } from "../application/use-cases/archive-task.use-case";

import type { CreateTaskDto } from "../application/dto/create-task.dto";
import type { UpdateTaskDto } from "../application/dto/update-task.dto";
import type { TaskQueryDto } from "../application/dto/task-query.dto";
import type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";

import type { TaskSummary } from "../interfaces/contracts/workspace-flow.contract";
import { toTaskSummary } from "../interfaces/contracts/workspace-flow.contract";

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
 * WorkspaceFlowTaskFacade
 *
 * Single entry point for all Task write and summary-read operations.
 * Requires both TaskRepository and IssueRepository because QA pass and
 * acceptance approval are cross-aggregate transitions that produce issues.
 */
export class WorkspaceFlowTaskFacade {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly issueRepository: IssueRepository,
  ) {}

  // ── Write operations ─────────────────────────────────────────────────────────

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

  /** Cross-aggregate: transitions task to qa_passed and creates a linked issue. */
  async passTaskQa(taskId: string): Promise<CommandResult> {
    return new PassTaskQaUseCase(this.taskRepository, this.issueRepository).execute(taskId);
  }

  /** Cross-aggregate: transitions task to accepted and closes the linked issue. */
  async approveTaskAcceptance(taskId: string): Promise<CommandResult> {
    return new ApproveTaskAcceptanceUseCase(this.taskRepository, this.issueRepository).execute(taskId);
  }

  async archiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult> {
    return new ArchiveTaskUseCase(this.taskRepository).execute(taskId, invoiceStatus);
  }

  // ── Read operations ──────────────────────────────────────────────────────────

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
}
 
