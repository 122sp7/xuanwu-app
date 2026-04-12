# Files

## File: modules/workspace/subdomains/workspace-workflow/api/contracts.ts
````typescript
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
 * @since 2026-03-24
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

// ── Source reference (content → workspace-flow provenance) ────────────────────

export type { SourceReference, SourceReferenceType } from "../domain/value-objects/SourceReference";

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
````

## File: modules/workspace/subdomains/workspace-workflow/api/factories.ts
````typescript
import { FirebaseInvoiceRepository } from "../infrastructure/repositories/FirebaseInvoiceRepository";
import { FirebaseIssueRepository } from "../infrastructure/repositories/FirebaseIssueRepository";
import { FirebaseTaskRepository } from "../infrastructure/repositories/FirebaseTaskRepository";

export function makeTaskRepo() {
  return new FirebaseTaskRepository();
}

export function makeIssueRepo() {
  return new FirebaseIssueRepository();
}

export function makeInvoiceRepo() {
  return new FirebaseInvoiceRepository();
}
````

## File: modules/workspace/subdomains/workspace-workflow/api/index.ts
````typescript
/**
 * @module workspace-flow/api
 * @file index.ts
 * @description Public cross-module boundary for workspace-flow.
 *
 * External consumers MUST import only from this path:
 *   @/modules/workspace/api
 *
 * Never import from domain/, application/, infrastructure/, or interfaces/ directly.
 * @author workspace-flow
 * @since 2026-03-24
 */

// ── Facade (write + summary-read surface) ────────────────────────────────────

// Composite facade (all three aggregates)
export { WorkspaceFlowFacade } from "./workspace-flow.facade";

// Focused facades (prefer these when only one aggregate is needed)
export { WorkspaceFlowTaskFacade } from "./workspace-flow-task.facade";
export { WorkspaceFlowIssueFacade } from "./workspace-flow-issue.facade";
export { WorkspaceFlowInvoiceFacade } from "./workspace-flow-invoice.facade";

// ── Public contracts ──────────────────────────────────────────────────────────

export type {
  // Entities
  Task,
  Issue,
  Invoice,
  InvoiceItem,
  // Value objects
  TaskStatus,
  IssueStatus,
  IssueStage,
  InvoiceStatus,
  // Summary projections
  TaskSummary,
  IssueSummary,
  InvoiceSummary,
  InvoiceItemSummary,
  // CRUD / command DTOs
  CreateTaskDto,
  UpdateTaskDto,
  OpenIssueDto,
  ResolveIssueDto,
  AddInvoiceItemDto,
  UpdateInvoiceItemDto,
  RemoveInvoiceItemDto,
  // Query / pagination DTOs
  TaskQueryDto,
  IssueQueryDto,
  InvoiceQueryDto,
  PaginationDto,
  PagedResult,
  // Command result
  CommandResult,
} from "./contracts";

export {
  // Value object lists (enum arrays)
  TASK_STATUSES,
  ISSUE_STATUSES,
  ISSUE_STAGES,
  INVOICE_STATUSES,
  // Summary projection helpers
  toTaskSummary,
  toIssueSummary,
  toInvoiceSummary,
  toInvoiceItemSummary,
} from "./contracts";

// ── Read queries (server-side) ────────────────────────────────────────────────

export {
  getWorkspaceFlowTasks,
  getWorkspaceFlowTask,
  getWorkspaceFlowIssues,
  getWorkspaceFlowInvoices,
  getWorkspaceFlowInvoiceItems,
} from "../interfaces/queries/workspace-flow.queries";

// ── UI components ─────────────────────────────────────────────────────────────

export { WorkspaceFlowTab } from "../interfaces/components/WorkspaceFlowTab";

// ── Event listeners (knowledge → workspace-flow integration) ─────────────────

export {
  createKnowledgeToWorkflowListener,
} from "./listeners";

export type {
  KnowledgePageApprovedHandler,
} from "./listeners";
````

## File: modules/workspace/subdomains/workspace-workflow/api/listeners.ts
````typescript
/**
 * @module workspace-flow/api
 * @file listeners.ts
 * @description Public event listener interface for workspace-flow.
 *
 * External modules (primarily the `knowledge` module's event bus) subscribe to
 * workspace-flow through this surface.  The concrete implementation is the
 * `KnowledgeToWorkflowMaterializer` process manager.
 *
 * ## Usage
 * ```ts
 * import { createKnowledgeToWorkflowListener } from "@/modules/workspace/api";
 *
 * const listener = createKnowledgeToWorkflowListener();
 * eventBus.subscribe("knowledge.page_approved", (event) => listener.handle(event));
 * ```
 *
 * @see ADR-001: docs/architecture/adr/ADR-001-knowledge-to-workflow-boundary.md
 */

import { KnowledgeToWorkflowMaterializer } from "../application/process-managers/knowledge-to-workflow-materializer";
import { FirebaseTaskRepository } from "../infrastructure/repositories/FirebaseTaskRepository";
import { FirebaseInvoiceRepository } from "../infrastructure/repositories/FirebaseInvoiceRepository";
import type { PageApprovedEvent } from "@/modules/notion/api";

// ── Public listener factory ───────────────────────────────────────────────────

/**
 * Creates a pre-wired `KnowledgeToWorkflowMaterializer` backed by Firebase repos.
 * Call `handle(event, workspaceId)` from your event bus subscriber.
 */
export function createKnowledgeToWorkflowListener(): KnowledgeToWorkflowMaterializer {
  return new KnowledgeToWorkflowMaterializer(
    new FirebaseTaskRepository(),
    new FirebaseInvoiceRepository(),
  );
}

// ── Listener type contracts ───────────────────────────────────────────────────

/** Shape of any handler that can process a `notion.knowledge.page_approved` event. */
export interface KnowledgePageApprovedHandler {
  handle(event: PageApprovedEvent, workspaceId: string): Promise<boolean>;
}

export type { PageApprovedEvent };
````

## File: modules/workspace/subdomains/workspace-workflow/api/workspace-flow-invoice.facade.ts
````typescript
/**
 * @module workspace-flow/api
 * @file workspace-flow-invoice.facade.ts
 * @description Focused facade for Invoice aggregate write and summary-read operations.
 *
 * Consumers that only need Invoice operations should use this class directly
 * instead of the composite {@link WorkspaceFlowFacade}.
 *
 * @author workspace-flow
 * @since 2026-04-06
 */

import type { InvoiceRepository } from "../domain/repositories/InvoiceRepository";

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

import type { AddInvoiceItemDto } from "../application/dto/add-invoice-item.dto";
import type { UpdateInvoiceItemDto } from "../application/dto/update-invoice-item.dto";
import type { RemoveInvoiceItemDto } from "../application/dto/remove-invoice-item.dto";
import type { InvoiceQueryDto } from "../application/dto/invoice-query.dto";
import type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";

import type { InvoiceSummary } from "../interfaces/contracts/workspace-flow.contract";
import { toInvoiceSummary } from "../interfaces/contracts/workspace-flow.contract";

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
 * WorkspaceFlowInvoiceFacade
 *
 * Single entry point for all Invoice write and summary-read operations.
 * Requires only InvoiceRepository — no cross-aggregate dependencies.
 */
export class WorkspaceFlowInvoiceFacade {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  // ── Write operations ─────────────────────────────────────────────────────────

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

  // ── Read operations ──────────────────────────────────────────────────────────

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
````

## File: modules/workspace/subdomains/workspace-workflow/api/workspace-flow-issue.facade.ts
````typescript
/**
 * @module workspace-flow/api
 * @file workspace-flow-issue.facade.ts
 * @description Focused facade for Issue aggregate write and summary-read operations.
 *
 * Consumers that only need Issue operations should use this class directly
 * instead of the composite {@link WorkspaceFlowFacade}.
 *
 * @author workspace-flow
 * @since 2026-04-06
 */

import type { IssueRepository } from "../domain/repositories/IssueRepository";

import { OpenIssueUseCase } from "../application/use-cases/open-issue.use-case";
import { StartIssueUseCase } from "../application/use-cases/start-issue.use-case";
import { FixIssueUseCase } from "../application/use-cases/fix-issue.use-case";
import { SubmitIssueRetestUseCase } from "../application/use-cases/submit-issue-retest.use-case";
import { PassIssueRetestUseCase } from "../application/use-cases/pass-issue-retest.use-case";
import { FailIssueRetestUseCase } from "../application/use-cases/fail-issue-retest.use-case";
import { ResolveIssueUseCase } from "../application/use-cases/resolve-issue.use-case";
import { CloseIssueUseCase } from "../application/use-cases/close-issue.use-case";

import type { OpenIssueDto } from "../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../application/dto/resolve-issue.dto";
import type { IssueQueryDto } from "../application/dto/issue-query.dto";
import type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";

import type { IssueSummary } from "../interfaces/contracts/workspace-flow.contract";
import { toIssueSummary } from "../interfaces/contracts/workspace-flow.contract";

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
 * WorkspaceFlowIssueFacade
 *
 * Single entry point for all Issue write and summary-read operations.
 * Requires only IssueRepository — no cross-aggregate dependencies.
 */
export class WorkspaceFlowIssueFacade {
  constructor(private readonly issueRepository: IssueRepository) {}

  // ── Write operations ─────────────────────────────────────────────────────────

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

  // ── Read operations ──────────────────────────────────────────────────────────

  async listIssues(query: IssueQueryDto, pagination?: PaginationDto): Promise<PagedResult<IssueSummary>> {
    const all = await this.issueRepository.findByTaskId(query.taskId);
    const filtered = query.status ? all.filter((i) => i.status === query.status) : all;
    return toPagedResult(filtered.map(toIssueSummary), pagination);
  }

  async getIssueSummary(issueId: string): Promise<IssueSummary | null> {
    const issue = await this.issueRepository.findById(issueId);
    return issue ? toIssueSummary(issue) : null;
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/api/workspace-flow-task.facade.ts
````typescript
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
````

## File: modules/workspace/subdomains/workspace-workflow/api/workspace-flow.facade.ts
````typescript
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
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/add-invoice-item.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file add-invoice-item.dto.ts
 * @description Command DTO for adding an item to an invoice.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add Zod schema when validation layer is wired in
 */

export interface AddInvoiceItemDto {
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: number;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/create-task.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file create-task.dto.ts
 * @description Command DTO for creating a new task.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add Zod schema when validation layer is wired in
 */

export interface CreateTaskDto {
  readonly workspaceId: string;
  readonly title: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/invoice-query.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file invoice-query.dto.ts
 * @description Query parameters DTO for listing invoices.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add pagination support when invoice lists grow large
 */

export interface InvoiceQueryDto {
  /** Filter invoices by workspace. Required for scoped queries. */
  readonly workspaceId: string;
  /** Optional status filter. */
  readonly status?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/issue-query.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file issue-query.dto.ts
 * @description Query parameters DTO for listing issues.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add pagination support when issue lists grow large
 */

export interface IssueQueryDto {
  /** Filter issues by task. */
  readonly taskId: string;
  /** Optional status filter. */
  readonly status?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/materialize-from-knowledge.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file materialize-from-knowledge.dto.ts
 * @description Command DTO for materializing Tasks and Invoices from a
 * `knowledge.page_approved` event payload.
 *
 * This DTO is used by both:
 *  - MaterializeTasksFromKnowledgeUseCase
 *  - KnowledgeToWorkflowMaterializer (Process Manager)
 */

import type { SourceReference } from "../../domain/value-objects/SourceReference";

export interface ExtractedTaskItem {
  readonly title: string;
  readonly dueDate?: string;
  readonly description?: string;
}

export interface ExtractedInvoiceItem {
  readonly amount: number;
  readonly description: string;
  readonly currency?: string;
}

export interface MaterializeFromKnowledgeDto {
  readonly workspaceId: string;
  /** ID of the KnowledgePage that was approved (same as sourceReference.id). */
  readonly knowledgePageId: string;
  /** Pre-built SourceReference value object to attach to every created entity. */
  readonly sourceReference: SourceReference;
  readonly extractedTasks: ReadonlyArray<ExtractedTaskItem>;
  readonly extractedInvoices: ReadonlyArray<ExtractedInvoiceItem>;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/open-issue.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file open-issue.dto.ts
 * @description Command DTO for opening a new issue against a task.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add Zod schema when validation layer is wired in
 */

import type { IssueStage } from "../../domain/value-objects/IssueStage";

export interface OpenIssueDto {
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly title: string;
  readonly description?: string;
  readonly createdBy: string;
  readonly assignedTo?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/pagination.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file pagination.dto.ts
 * @description Shared pagination request / response DTOs for workspace-flow list queries.
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface PaginationDto {
  /** 1-based page number. Defaults to 1. */
  readonly page?: number;
  /** Items per page. Defaults to 20. */
  readonly pageSize?: number;
}

export interface PagedResult<T> {
  readonly items: T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly hasMore: boolean;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/remove-invoice-item.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file remove-invoice-item.dto.ts
 * @description Command DTO for removing an item from an invoice.
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface RemoveInvoiceItemDto {
  readonly invoiceId: string;
  readonly invoiceItemId: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/resolve-issue.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file resolve-issue.dto.ts
 * @description Command DTO for resolving an issue (retest passed → resolved).
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface ResolveIssueDto {
  readonly issueId: string;
  readonly resolutionNote?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/task-query.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file task-query.dto.ts
 * @description Query parameters DTO for listing tasks.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add pagination support when task lists grow large
 */

export interface TaskQueryDto {
  /** Filter tasks by workspace. Required for scoped queries. */
  readonly workspaceId: string;
  /** Optional status filter. */
  readonly status?: string;
  /** Optional assignee filter. */
  readonly assigneeId?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/update-invoice-item.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file update-invoice-item.dto.ts
 * @description Command DTO for updating the amount of an existing invoice item.
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface UpdateInvoiceItemDto {
  /** Updated billing amount (must be > 0). */
  readonly amount: number;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/update-task.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file update-task.dto.ts
 * @description Command DTO for updating mutable fields on an existing task.
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface UpdateTaskDto {
  readonly title?: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/workflow.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the workspace-workflow subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { Task } from "../../domain/entities/Task";
export type { Issue } from "../../domain/entities/Issue";
export type { Invoice } from "../../domain/entities/Invoice";
export type { InvoiceItem } from "../../domain/entities/InvoiceItem";
export type { TaskStatus } from "../../domain/value-objects/TaskStatus";
export type { InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
export type { IssueStage } from "../../domain/value-objects/IssueStage";
````

## File: modules/workspace/subdomains/workspace-workflow/application/ports/InvoiceService.ts
````typescript
/**
 * @module workspace-flow/application/ports
 * @file InvoiceService.ts
 * @description Application port interface for Invoice operations.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */

import type { Invoice } from "../../domain/entities/Invoice";
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
import type { InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import type { AddInvoiceItemDto } from "../dto/add-invoice-item.dto";
import type { InvoiceQueryDto } from "../dto/invoice-query.dto";

export interface InvoiceService {
  createInvoice(workspaceId: string): Promise<Invoice>;
  addItem(dto: AddInvoiceItemDto): Promise<InvoiceItem>;
  removeItem(invoiceItemId: string): Promise<void>;
  transitionStatus(invoiceId: string, to: InvoiceStatus): Promise<Invoice>;
  listInvoices(query: InvoiceQueryDto): Promise<Invoice[]>;
  getInvoice(invoiceId: string): Promise<Invoice | null>;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/ports/IssueService.ts
````typescript
/**
 * @module workspace-flow/application/ports
 * @file IssueService.ts
 * @description Application port interface for Issue operations.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */

import type { Issue } from "../../domain/entities/Issue";
import type { IssueStatus } from "../../domain/value-objects/IssueStatus";
import type { OpenIssueDto } from "../dto/open-issue.dto";
import type { IssueQueryDto } from "../dto/issue-query.dto";

export interface IssueService {
  openIssue(dto: OpenIssueDto): Promise<Issue>;
  transitionStatus(issueId: string, to: IssueStatus): Promise<Issue>;
  listIssues(query: IssueQueryDto): Promise<Issue[]>;
  getIssue(issueId: string): Promise<Issue | null>;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/ports/TaskService.ts
````typescript
/**
 * @module workspace-flow/application/ports
 * @file TaskService.ts
 * @description Application port interface for Task operations.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */

import type { Task } from "../../domain/entities/Task";
import type { TaskStatus } from "../../domain/value-objects/TaskStatus";
import type { CreateTaskDto } from "../dto/create-task.dto";
import type { TaskQueryDto } from "../dto/task-query.dto";

export interface TaskService {
  createTask(dto: CreateTaskDto): Promise<Task>;
  assignTask(taskId: string, assigneeId: string): Promise<Task>;
  transitionStatus(taskId: string, to: TaskStatus): Promise<Task>;
  listTasks(query: TaskQueryDto): Promise<Task[]>;
  getTask(taskId: string): Promise<Task | null>;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/process-managers/knowledge-to-workflow-materializer.ts
````typescript
/**
 * @module workspace-flow/application/process-managers
 * @file knowledge-to-workflow-materializer.ts
 * @description Process Manager (Saga) that listens for `knowledge.page_approved`
 * events and orchestrates the creation of Tasks and Invoices in workspace-flow.
 *
 * ## Responsibility
 * This class is the single entry point for the cross-module event-driven
 * integration between the `knowledge` and `workspace-flow` bounded contexts.
 *
 * ## Idempotency
 * The process manager tracks processed `causationId` values to prevent
 * duplicate materialization if the same event is delivered more than once.
 * The seen-set is in-memory by default; production implementations should
 * persist to Firestore at:
 *   `workspaces/{workspaceId}/materializedEvents/{causationId}`
 * using a Firestore transaction to provide atomic idempotency guarantees.
 *
 * ## Placement
 * - Wired in: Cloud Function trigger (Firestore `onDocumentUpdated`) or
 *   `SimpleEventBus` subscriber registered at application startup.
 * - Alternative: a shared saga registry if cross-module saga coordination is needed.
 *
 * @see ADR-001: docs/architecture/adr/ADR-001-knowledge-to-workflow-boundary.md
 */

import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { MaterializeTasksFromKnowledgeUseCase } from "../use-cases/materialize-tasks-from-knowledge.use-case";
import type { ExtractedInvoiceItem, ExtractedTaskItem } from "../dto/materialize-from-knowledge.dto";
import type { SourceReference } from "../../domain/value-objects/SourceReference";

interface PageApprovedEvent {
  payload: {
    pageId: string;
    causationId: string;
    correlationId: string;
    extractedTasks: ReadonlyArray<ExtractedTaskItem>;
    extractedInvoices: ReadonlyArray<ExtractedInvoiceItem>;
  };
}

export class KnowledgeToWorkflowMaterializer {
  /**
   * In-memory idempotency guard.
   * Replace with a persistent store in production.
   */
  private readonly processedCausationIds = new Set<string>();

  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  /**
   * Handle a `knowledge.page_approved` event.
   *
   * @param event - The full event payload from the knowledge module's public API.
   * @param workspaceId - Target workspace where Tasks/Invoices will be created.
   *   Typically resolved from the event's `workspaceId` field if present.
   * @returns true if materialization succeeded, false if skipped (idempotency) or failed.
   */
  async handle(event: PageApprovedEvent, workspaceId: string): Promise<boolean> {
    if (this.processedCausationIds.has(event.payload.causationId)) {
      return false;
    }

    if (!workspaceId.trim()) return false;

    const sourceReference: SourceReference = {
      type: "KnowledgePage",
      id: event.payload.pageId,
      causationId: event.payload.causationId,
      correlationId: event.payload.correlationId,
    };

    const useCase = new MaterializeTasksFromKnowledgeUseCase(
      this.taskRepository,
      this.invoiceRepository,
    );

    const result = await useCase.execute({
      workspaceId,
      knowledgePageId: event.payload.pageId,
      sourceReference,
      extractedTasks: event.payload.extractedTasks,
      extractedInvoices: event.payload.extractedInvoices,
    });

    if (result.success) {
      this.processedCausationIds.add(event.payload.causationId);
      return true;
    }

    return false;
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/add-invoice-item.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file add-invoice-item.use-case.ts
 * @description Use case: Add an item to a draft invoice.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceItemAddedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";
import type { AddInvoiceItemDto } from "../dto/add-invoice-item.dto";

export class AddInvoiceItemUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(dto: AddInvoiceItemDto): Promise<CommandResult> {
    if (!dto.invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }
    if (!dto.taskId.trim()) {
      return commandFailureFrom("WF_INVOICE_TASK_REQUIRED", "Task id is required.");
    }
    if (dto.amount <= 0) {
      return commandFailureFrom("WF_INVOICE_AMOUNT_INVALID", "Amount must be greater than zero.");
    }

    const invoice = await this.invoiceRepository.findById(dto.invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }
    if (!invoiceIsEditable(invoice.status)) {
      return commandFailureFrom(
        "WF_INVOICE_NOT_EDITABLE",
        "Items can only be added to draft invoices.",
      );
    }

    const item = await this.invoiceRepository.addItem(dto);
    return commandSuccess(item.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/approve-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file approve-invoice.use-case.ts
 * @description Use case: Approve an invoice in finance review (finance_review → approved).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceApprovedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";

export class ApproveInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }

    const guard = evaluateInvoiceTransition(invoice.status, "approved");
    if (!guard.allowed) {
      return commandFailureFrom("WF_INVOICE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(invoiceId, "approved", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/approve-task-acceptance.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file approve-task-acceptance.use-case.ts
 * @description Use case: Approve a task at acceptance stage (acceptance → accepted). Requires no open issues.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit TaskAcceptanceApprovedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { hasNoOpenIssues } from "../../domain/services/task-guards";

export class ApproveTaskAcceptanceUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly issueRepository: IssueRepository,
  ) {}

  async execute(taskId: string): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const guard = evaluateTaskTransition(task.status, "accepted");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    const openIssues = await this.issueRepository.countOpenByTaskId(taskId);
    if (!hasNoOpenIssues(openIssues)) {
      return commandFailureFrom(
        "WF_TASK_HAS_OPEN_ISSUES",
        "Task cannot be accepted: there are open issues that must be resolved first.",
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "accepted", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/archive-task.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file archive-task.use-case.ts
 * @description Use case: Archive a task (accepted → archived). Requires invoice closed or none.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit TaskArchivedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { invoiceAllowsArchive } from "../../domain/services/task-guards";

export class ArchiveTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  /**
   * @param taskId       - ID of the task to archive
   * @param invoiceStatus - Status of the linked invoice, or undefined if none
   */
  async execute(taskId: string, invoiceStatus?: string): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const guard = evaluateTaskTransition(task.status, "archived");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    if (!invoiceAllowsArchive(invoiceStatus)) {
      return commandFailureFrom(
        "WF_TASK_INVOICE_NOT_CLOSED",
        "Task cannot be archived: the linked invoice must be closed first.",
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "archived", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/assign-task.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file assign-task.use-case.ts
 * @description Use case: Assign a task to a user and transition status to in_progress.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add permission check for assignee
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";

export class AssignTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string, assigneeId: string): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }
    if (!assigneeId.trim()) {
      return commandFailureFrom("WF_TASK_ASSIGNEE_REQUIRED", "Assignee id is required.");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const guard = evaluateTaskTransition(task.status, "in_progress");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    // Persist the assignee before transitioning status
    await this.taskRepository.update(taskId, { assigneeId: assigneeId.trim() });

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "in_progress", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/close-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file close-invoice.use-case.ts
 * @description Use case: Close a paid invoice (paid → closed).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceClosedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";

export class CloseInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }

    const guard = evaluateInvoiceTransition(invoice.status, "closed");
    if (!guard.allowed) {
      return commandFailureFrom("WF_INVOICE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(invoiceId, "closed", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/close-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file close-issue.use-case.ts
 * @description Use case: Close a resolved issue (resolved → closed).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueClosedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";

export class CloseIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    if (!issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "closed");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(issueId, "closed", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/create-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file create-invoice.use-case.ts
 * @description Use case: Create a new invoice for a workspace.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceCreatedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";

export class CreateInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(workspaceId: string): Promise<CommandResult> {
    if (!workspaceId.trim()) {
      return commandFailureFrom("WF_INVOICE_WORKSPACE_REQUIRED", "Workspace is required.");
    }

    const invoice = await this.invoiceRepository.create({ workspaceId: workspaceId.trim() });
    return commandSuccess(invoice.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/create-task.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file create-task.use-case.ts
 * @description Use case: Create a new task in the workspace-flow context.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add input validation with Zod schema
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { CreateTaskDto } from "../dto/create-task.dto";

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(dto: CreateTaskDto): Promise<CommandResult> {
    const workspaceId = dto.workspaceId.trim();
    const title = dto.title.trim();

    if (!workspaceId) {
      return commandFailureFrom("WF_TASK_WORKSPACE_REQUIRED", "Workspace is required.");
    }
    if (!title) {
      return commandFailureFrom("WF_TASK_TITLE_REQUIRED", "Task title is required.");
    }

    const task = await this.taskRepository.create({ ...dto, workspaceId, title });
    return commandSuccess(task.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/fail-issue-retest.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file fail-issue-retest.use-case.ts
 * @description Use case: Fail an issue's retest (retest → fixing).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueRetestFailedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";

export class FailIssueRetestUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    if (!issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "fixing");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(issueId, "fixing", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/fix-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file fix-issue.use-case.ts
 * @description Use case: Mark an issue as being fixed (investigating → fixing).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueFixedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";

export class FixIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    if (!issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "fixing");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(issueId, "fixing", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/materialize-tasks-from-knowledge.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file materialize-tasks-from-knowledge.use-case.ts
 * @description Use case: Batch-create Tasks (and optionally Invoices) from a
 * `knowledge.page_approved` event payload.
 *
 * Idempotency: callers must ensure the same `sourceReference.causationId` is
 * not processed twice. This use case does NOT check for duplicates itself;
 * that responsibility belongs to the KnowledgeToWorkflowMaterializer process
 * manager which wraps this use case.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import type { MaterializeFromKnowledgeDto } from "../dto/materialize-from-knowledge.dto";

export class MaterializeTasksFromKnowledgeUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(dto: MaterializeFromKnowledgeDto): Promise<CommandResult> {
    if (!dto.workspaceId.trim()) {
      return commandFailureFrom("WF_MATERIALIZE_WORKSPACE_REQUIRED", "workspaceId is required.");
    }
    if (!dto.knowledgePageId.trim()) {
      return commandFailureFrom("WF_MATERIALIZE_PAGE_REQUIRED", "knowledgePageId is required.");
    }

    const taskIds: string[] = [];
    for (const item of dto.extractedTasks) {
      if (!item.title.trim()) continue;
      const task = await this.taskRepository.create({
        workspaceId: dto.workspaceId,
        title: item.title.trim(),
        description: item.description ?? "",
        dueDateISO: item.dueDate,
        sourceReference: dto.sourceReference,
      });
      taskIds.push(task.id);
    }

    const invoiceIds: string[] = [];
    for (const item of dto.extractedInvoices) {
      if (item.amount <= 0) continue;
      const invoice = await this.invoiceRepository.create({
        workspaceId: dto.workspaceId,
        sourceReference: dto.sourceReference,
      });
      await this.invoiceRepository.addItem({
        invoiceId: invoice.id,
        amount: item.amount,
        taskId: "",
      });
      invoiceIds.push(invoice.id);
    }

    return commandSuccess(dto.knowledgePageId, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/open-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file open-issue.use-case.ts
 * @description Use case: Open a new issue against a task.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueOpenedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import type { OpenIssueDto } from "../dto/open-issue.dto";

export class OpenIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(dto: OpenIssueDto): Promise<CommandResult> {
    if (!dto.taskId.trim()) {
      return commandFailureFrom("WF_ISSUE_TASK_REQUIRED", "Task id is required.");
    }
    if (!dto.title.trim()) {
      return commandFailureFrom("WF_ISSUE_TITLE_REQUIRED", "Issue title is required.");
    }
    if (!dto.createdBy.trim()) {
      return commandFailureFrom("WF_ISSUE_CREATED_BY_REQUIRED", "Creator id is required.");
    }

    const issue = await this.issueRepository.create({
      ...dto,
      taskId: dto.taskId.trim(),
      title: dto.title.trim(),
    });
    return commandSuccess(issue.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/pass-issue-retest.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file pass-issue-retest.use-case.ts
 * @description Use case: Pass an issue's retest (retest → resolved).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueRetestPassedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";

export class PassIssueRetestUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    if (!issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "resolved");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(issueId, "resolved", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/pass-task-qa.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file pass-task-qa.use-case.ts
 * @description Use case: Pass a task's QA review (qa → acceptance). Requires no open issues.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit TaskQaPassedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { hasNoOpenIssues } from "../../domain/services/task-guards";

export class PassTaskQaUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly issueRepository: IssueRepository,
  ) {}

  async execute(taskId: string): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const guard = evaluateTaskTransition(task.status, "acceptance");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    const openIssues = await this.issueRepository.countOpenByTaskId(taskId);
    if (!hasNoOpenIssues(openIssues)) {
      return commandFailureFrom(
        "WF_TASK_HAS_OPEN_ISSUES",
        "Task cannot advance: there are open issues that must be resolved first.",
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "acceptance", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/pay-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file pay-invoice.use-case.ts
 * @description Use case: Mark an approved invoice as paid (approved → paid).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoicePaidEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";

export class PayInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }

    const guard = evaluateInvoiceTransition(invoice.status, "paid");
    if (!guard.allowed) {
      return commandFailureFrom("WF_INVOICE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(invoiceId, "paid", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/reject-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file reject-invoice.use-case.ts
 * @description Use case: Reject an invoice back to submitted (finance_review → submitted).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceRejectedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";

export class RejectInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }

    const guard = evaluateInvoiceTransition(invoice.status, "submitted");
    if (!guard.allowed) {
      return commandFailureFrom("WF_INVOICE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(invoiceId, "submitted", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/remove-invoice-item.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file remove-invoice-item.use-case.ts
 * @description Use case: Remove an item from a draft invoice.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceItemRemovedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";

export class RemoveInvoiceItemUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string, invoiceItemId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }
    if (!invoiceItemId.trim()) {
      return commandFailureFrom("WF_INVOICE_ITEM_ID_REQUIRED", "Invoice item id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }
    if (!invoiceIsEditable(invoice.status)) {
      return commandFailureFrom(
        "WF_INVOICE_NOT_EDITABLE",
        "Items can only be removed from draft invoices.",
      );
    }

    await this.invoiceRepository.removeItem(invoiceItemId);
    return commandSuccess(invoiceItemId, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/resolve-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file resolve-issue.use-case.ts
 * @description Use case: Resolve an issue (retest-pending → resolved).
 * @author workspace-flow
 * @since 2026-03-24
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
import type { ResolveIssueDto } from "../dto/resolve-issue.dto";

export class ResolveIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(dto: ResolveIssueDto): Promise<CommandResult> {
    if (!dto.issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(dto.issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "resolved");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(dto.issueId, "resolved", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/review-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file review-invoice.use-case.ts
 * @description Use case: Move an invoice into finance review (submitted → finance_review).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceReviewedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";

export class ReviewInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }

    const guard = evaluateInvoiceTransition(invoice.status, "finance_review");
    if (!guard.allowed) {
      return commandFailureFrom("WF_INVOICE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(invoiceId, "finance_review", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/start-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file start-issue.use-case.ts
 * @description Use case: Start investigating an issue (open → investigating).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueStartedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";

export class StartIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    if (!issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "investigating");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(issueId, "investigating", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/submit-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file submit-invoice.use-case.ts
 * @description Use case: Submit an invoice for review (draft → submitted). Requires at least one item.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit InvoiceSubmittedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
import { invoiceHasItems } from "../../domain/services/invoice-guards";

export class SubmitInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<CommandResult> {
    if (!invoiceId.trim()) {
      return commandFailureFrom("WF_INVOICE_ID_REQUIRED", "Invoice id is required.");
    }

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }

    const guard = evaluateInvoiceTransition(invoice.status, "submitted");
    if (!guard.allowed) {
      return commandFailureFrom("WF_INVOICE_INVALID_TRANSITION", guard.reason);
    }

    const items = await this.invoiceRepository.listItems(invoiceId);
    if (!invoiceHasItems(items.length)) {
      return commandFailureFrom(
        "WF_INVOICE_NO_ITEMS",
        "Invoice cannot be submitted: at least one item is required.",
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.invoiceRepository.transitionStatus(invoiceId, "submitted", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/submit-issue-retest.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file submit-issue-retest.use-case.ts
 * @description Use case: Submit an issue for retest (fixing → retest).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueRetestSubmittedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";

export class SubmitIssueRetestUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    if (!issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "retest");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(issueId, "retest", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/submit-task-to-qa.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file submit-task-to-qa.use-case.ts
 * @description Use case: Submit a task for QA review (in_progress → qa).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add pre-submission checks (e.g. assignee present)
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";

export class SubmitTaskToQaUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const guard = evaluateTaskTransition(task.status, "qa");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "qa", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/update-invoice-item.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file update-invoice-item.use-case.ts
 * @description Use case: Update the amount of an existing invoice item on a draft invoice.
 * @author workspace-flow
 * @since 2026-03-24
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";
import type { UpdateInvoiceItemDto } from "../dto/update-invoice-item.dto";

export class UpdateInvoiceItemUseCase {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult> {
    if (!invoiceItemId.trim()) {
      return commandFailureFrom("WF_INVOICE_ITEM_ID_REQUIRED", "Invoice item id is required.");
    }
    if (dto.amount <= 0) {
      return commandFailureFrom("WF_INVOICE_AMOUNT_INVALID", "Amount must be greater than zero.");
    }

    const item = await this.invoiceRepository.findItemById(invoiceItemId);
    if (!item) {
      return commandFailureFrom("WF_INVOICE_ITEM_NOT_FOUND", "Invoice item not found.");
    }

    const invoice = await this.invoiceRepository.findById(item.invoiceId);
    if (!invoice) {
      return commandFailureFrom("WF_INVOICE_NOT_FOUND", "Invoice not found.");
    }
    if (!invoiceIsEditable(invoice.status)) {
      return commandFailureFrom(
        "WF_INVOICE_NOT_EDITABLE",
        "Items can only be updated on draft invoices.",
      );
    }

    const updated = await this.invoiceRepository.updateItem(invoiceItemId, dto.amount);
    if (!updated) {
      return commandFailureFrom("WF_INVOICE_ITEM_NOT_FOUND", "Invoice item not found after update.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/update-task.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file update-task.use-case.ts
 * @description Use case: Update mutable fields on an existing task.
 * @author workspace-flow
 * @since 2026-03-24
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { UpdateTaskDto } from "../dto/update-task.dto";

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string, dto: UpdateTaskDto): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }

    const existing = await this.taskRepository.findById(taskId);
    if (!existing) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const updated = await this.taskRepository.update(taskId, dto);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after update.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/entities/Invoice.ts
````typescript
/**
 * @module workspace-flow/domain/entities
 * @file Invoice.ts
 * @description Invoice aggregate entity representing a billing record for accepted tasks.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add domain validation methods as billing rules expand
 */

import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
import type { SourceReference } from "../value-objects/SourceReference";

// ── Aggregate ─────────────────────────────────────────────────────────────────

export interface Invoice {
  readonly id: string;
  readonly workspaceId: string;
  readonly status: InvoiceStatus;
  readonly totalAmount: number;
  readonly submittedAtISO?: string;
  readonly approvedAtISO?: string;
  readonly paidAtISO?: string;
  readonly closedAtISO?: string;
  /**
   * Present when this Invoice was materialized from a KnowledgePage via the
   * `knowledge.page_approved` event. Provides full provenance traceability.
   */
  readonly sourceReference?: SourceReference;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface CreateInvoiceInput {
  readonly workspaceId: string;
  readonly sourceReference?: SourceReference;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/entities/InvoiceItem.ts
````typescript
/**
 * @module workspace-flow/domain/entities
 * @file InvoiceItem.ts
 * @description InvoiceItem entity linking a task to an invoice with an amount.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add domain validation methods as billing rules expand
 */

// ── Entity ────────────────────────────────────────────────────────────────────

export interface InvoiceItem {
  readonly id: string;
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface AddInvoiceItemInput {
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: number;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/entities/Issue.ts
````typescript
/**
 * @module workspace-flow/domain/entities
 * @file Issue.ts
 * @description Issue aggregate entity representing a defect or anomaly raised during workflow.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add domain validation methods as business rules expand
 */

import type { IssueStatus } from "../value-objects/IssueStatus";
import type { IssueStage } from "../value-objects/IssueStage";

// ── Aggregate ─────────────────────────────────────────────────────────────────

export interface Issue {
  readonly id: string;
  readonly taskId: string;
  /** Which stage of the task workflow this issue was raised in. */
  readonly stage: IssueStage;
  readonly title: string;
  readonly description: string;
  readonly status: IssueStatus;
  readonly createdBy: string;
  readonly assignedTo?: string;
  readonly resolvedAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface OpenIssueInput {
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly title: string;
  readonly description?: string;
  readonly createdBy: string;
  readonly assignedTo?: string;
}

export interface UpdateIssueInput {
  readonly title?: string;
  readonly description?: string;
  readonly assignedTo?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/entities/Task.ts
````typescript
/**
 * @module workspace-flow/domain/entities
 * @file Task.ts
 * @description Task aggregate entity representing a work unit and its lifecycle.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add domain validation methods as business rules expand
 */

import type { TaskStatus } from "../value-objects/TaskStatus";
import type { SourceReference } from "../value-objects/SourceReference";

// ── Aggregate ─────────────────────────────────────────────────────────────────

export interface Task {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
  readonly acceptedAtISO?: string;
  readonly archivedAtISO?: string;
  /**
   * Present when this Task was materialized from a KnowledgePage via the
   * `knowledge.page_approved` event. Provides full provenance traceability.
   */
  readonly sourceReference?: SourceReference;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface CreateTaskInput {
  readonly workspaceId: string;
  readonly title: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
  readonly sourceReference?: SourceReference;
}

export interface UpdateTaskInput {
  readonly title?: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/events/InvoiceEvent.ts
````typescript
/**
 * @module workspace-flow/domain/events
 * @file InvoiceEvent.ts
 * @description Discriminated-union event types emitted by the Invoice aggregate.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire to event bus via @/modules/event IEventBusRepository
 */

import type { InvoiceStatus } from "../value-objects/InvoiceStatus";

// ── Individual event shapes ───────────────────────────────────────────────────

export interface InvoiceCreatedEvent {
  readonly type: "workspace-flow.invoice.created";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface InvoiceItemAddedEvent {
  readonly type: "workspace-flow.invoice.item_added";
  readonly invoiceId: string;
  readonly invoiceItemId: string;
  readonly taskId: string;
  readonly amount: number;
  readonly occurredAtISO: string;
}

export interface InvoiceItemRemovedEvent {
  readonly type: "workspace-flow.invoice.item_removed";
  readonly invoiceId: string;
  readonly invoiceItemId: string;
  readonly occurredAtISO: string;
}

export interface InvoiceSubmittedEvent {
  readonly type: "workspace-flow.invoice.submitted";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly submittedAtISO: string;
  readonly occurredAtISO: string;
}

export interface InvoiceReviewedEvent {
  readonly type: "workspace-flow.invoice.reviewed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface InvoiceApprovedEvent {
  readonly type: "workspace-flow.invoice.approved";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly approvedAtISO: string;
  readonly occurredAtISO: string;
}

export interface InvoiceRejectedEvent {
  readonly type: "workspace-flow.invoice.rejected";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface InvoicePaidEvent {
  readonly type: "workspace-flow.invoice.paid";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly paidAtISO: string;
  readonly occurredAtISO: string;
}

export interface InvoiceClosedEvent {
  readonly type: "workspace-flow.invoice.closed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly closedAtISO: string;
  readonly occurredAtISO: string;
}

export interface InvoiceStatusChangedEvent {
  readonly type: "workspace-flow.invoice.status_changed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly from: InvoiceStatus;
  readonly to: InvoiceStatus;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type InvoiceEvent =
  | InvoiceCreatedEvent
  | InvoiceItemAddedEvent
  | InvoiceItemRemovedEvent
  | InvoiceSubmittedEvent
  | InvoiceReviewedEvent
  | InvoiceApprovedEvent
  | InvoiceRejectedEvent
  | InvoicePaidEvent
  | InvoiceClosedEvent
  | InvoiceStatusChangedEvent;
````

## File: modules/workspace/subdomains/workspace-workflow/domain/events/IssueEvent.ts
````typescript
/**
 * @module workspace-flow/domain/events
 * @file IssueEvent.ts
 * @description Discriminated-union event types emitted by the Issue aggregate.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire to event bus via @/modules/event IEventBusRepository
 */

import type { IssueStatus } from "../value-objects/IssueStatus";
import type { IssueStage } from "../value-objects/IssueStage";

// ── Individual event shapes ───────────────────────────────────────────────────

export interface IssueOpenedEvent {
  readonly type: "workspace-flow.issue.opened";
  readonly issueId: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly createdBy: string;
  readonly occurredAtISO: string;
}

export interface IssueStartedEvent {
  readonly type: "workspace-flow.issue.started";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueFixedEvent {
  readonly type: "workspace-flow.issue.fixed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueRetestSubmittedEvent {
  readonly type: "workspace-flow.issue.retest_submitted";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueRetestPassedEvent {
  readonly type: "workspace-flow.issue.retest_passed";
  readonly issueId: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly occurredAtISO: string;
}

export interface IssueRetestFailedEvent {
  readonly type: "workspace-flow.issue.retest_failed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueClosedEvent {
  readonly type: "workspace-flow.issue.closed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}

export interface IssueStatusChangedEvent {
  readonly type: "workspace-flow.issue.status_changed";
  readonly issueId: string;
  readonly taskId: string;
  readonly from: IssueStatus;
  readonly to: IssueStatus;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type IssueEvent =
  | IssueOpenedEvent
  | IssueStartedEvent
  | IssueFixedEvent
  | IssueRetestSubmittedEvent
  | IssueRetestPassedEvent
  | IssueRetestFailedEvent
  | IssueClosedEvent
  | IssueStatusChangedEvent;
````

## File: modules/workspace/subdomains/workspace-workflow/domain/events/TaskEvent.ts
````typescript
/**
 * @module workspace-flow/domain/events
 * @file TaskEvent.ts
 * @description Discriminated-union event types emitted by the Task aggregate.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire to event bus via @/modules/event IEventBusRepository
 */

import type { TaskStatus } from "../value-objects/TaskStatus";

// ── Individual event shapes ───────────────────────────────────────────────────

export interface TaskCreatedEvent {
  readonly type: "workspace-flow.task.created";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly occurredAtISO: string;
}

export interface TaskAssignedEvent {
  readonly type: "workspace-flow.task.assigned";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly assigneeId: string;
  readonly occurredAtISO: string;
}

export interface TaskSubmittedToQaEvent {
  readonly type: "workspace-flow.task.submitted_to_qa";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface TaskQaPassedEvent {
  readonly type: "workspace-flow.task.qa_passed";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface TaskAcceptanceApprovedEvent {
  readonly type: "workspace-flow.task.acceptance_approved";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly acceptedAtISO: string;
  readonly occurredAtISO: string;
}

export interface TaskArchivedEvent {
  readonly type: "workspace-flow.task.archived";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly archivedAtISO: string;
  readonly occurredAtISO: string;
}

export interface TaskStatusChangedEvent {
  readonly type: "workspace-flow.task.status_changed";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly from: TaskStatus;
  readonly to: TaskStatus;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type TaskEvent =
  | TaskCreatedEvent
  | TaskAssignedEvent
  | TaskSubmittedToQaEvent
  | TaskQaPassedEvent
  | TaskAcceptanceApprovedEvent
  | TaskArchivedEvent
  | TaskStatusChangedEvent;
````

## File: modules/workspace/subdomains/workspace-workflow/domain/index.ts
````typescript
/**
 * workspace/workspace-workflow domain — public exports.
 */
export type { InvoiceRepository } from "./repositories/InvoiceRepository";
export type { IssueRepository } from "./repositories/IssueRepository";
export type { TaskRepository } from "./repositories/TaskRepository";
export * from "./events/TaskEvent";
export * from "./events/IssueEvent";
export * from "./events/InvoiceEvent";
export * from "./value-objects/InvoiceId";
export * from "./value-objects/InvoiceItemId";
export * from "./value-objects/InvoiceStatus";
export * from "./value-objects/IssueId";
export * from "./value-objects/IssueStage";
export * from "./value-objects/IssueStatus";
export * from "./value-objects/SourceReference";
export * from "./value-objects/TaskId";
export * from "./value-objects/TaskStatus";
export * from "./value-objects/UserId";
// Ports layer — driven port aliases
export type { IInvoicePort, IIssuePort, ITaskPort } from "./ports";
````

## File: modules/workspace/subdomains/workspace-workflow/domain/ports/index.ts
````typescript
/**
 * workspace/workspace-workflow domain/ports — driven port interfaces for the workflow subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { InvoiceRepository as IInvoicePort } from "../repositories/InvoiceRepository";
export type { IssueRepository as IIssuePort } from "../repositories/IssueRepository";
export type { TaskRepository as ITaskPort } from "../repositories/TaskRepository";
````

## File: modules/workspace/subdomains/workspace-workflow/domain/repositories/InvoiceRepository.ts
````typescript
/**
 * @module workspace-flow/domain/repositories
 * @file InvoiceRepository.ts
 * @description Repository port interface for Invoice persistence.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Implement in infrastructure/repositories/FirebaseInvoiceRepository
 */

import type { Invoice, CreateInvoiceInput } from "../entities/Invoice";
import type { InvoiceItem, AddInvoiceItemInput } from "../entities/InvoiceItem";
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";

export interface InvoiceRepository {
  /** Persist a new invoice and return the created aggregate. */
  create(input: CreateInvoiceInput): Promise<Invoice>;
  /** Hard-delete an invoice by id. */
  delete(invoiceId: string): Promise<void>;
  /** Retrieve an invoice by its id. Returns null if not found. */
  findById(invoiceId: string): Promise<Invoice | null>;
  /** List all invoices for a given workspace. */
  findByWorkspaceId(workspaceId: string): Promise<Invoice[]>;
  /** Persist a lifecycle status transition and stamp relevant timestamp. */
  transitionStatus(invoiceId: string, to: InvoiceStatus, nowISO: string): Promise<Invoice | null>;
  /** Add an item to an invoice and recalculate totalAmount. */
  addItem(input: AddInvoiceItemInput): Promise<InvoiceItem>;
  /** Retrieve a single invoice item by its id. Returns null if not found. */
  findItemById(invoiceItemId: string): Promise<InvoiceItem | null>;
  /** Update the amount of an existing item and recalculate totalAmount. Returns null if not found. */
  updateItem(invoiceItemId: string, amount: number): Promise<InvoiceItem | null>;
  /** Remove an item from an invoice and recalculate totalAmount. */
  removeItem(invoiceItemId: string): Promise<void>;
  /** List all items for an invoice. */
  listItems(invoiceId: string): Promise<InvoiceItem[]>;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/repositories/IssueRepository.ts
````typescript
/**
 * @module workspace-flow/domain/repositories
 * @file IssueRepository.ts
 * @description Repository port interface for Issue persistence.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Implement in infrastructure/repositories/FirebaseIssueRepository
 */

import type { Issue, OpenIssueInput, UpdateIssueInput } from "../entities/Issue";
import type { IssueStatus } from "../value-objects/IssueStatus";

export interface IssueRepository {
  /** Persist a new issue and return the created aggregate. */
  create(input: OpenIssueInput): Promise<Issue>;
  /** Update mutable fields on an existing issue. Returns null if not found. */
  update(issueId: string, input: UpdateIssueInput): Promise<Issue | null>;
  /** Hard-delete an issue by id. */
  delete(issueId: string): Promise<void>;
  /** Retrieve an issue by its id. Returns null if not found. */
  findById(issueId: string): Promise<Issue | null>;
  /** List all issues for a given task. */
  findByTaskId(taskId: string): Promise<Issue[]>;
  /** Count open issues for a given task (used in guard conditions). */
  countOpenByTaskId(taskId: string): Promise<number>;
  /** Persist a lifecycle status transition and stamp resolvedAtISO if to==="resolved". */
  transitionStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<Issue | null>;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/repositories/TaskRepository.ts
````typescript
/**
 * @module workspace-flow/domain/repositories
 * @file TaskRepository.ts
 * @description Repository port interface for Task persistence.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Implement in infrastructure/repositories/FirebaseTaskRepository
 */

import type { Task, CreateTaskInput, UpdateTaskInput } from "../entities/Task";
import type { TaskStatus } from "../value-objects/TaskStatus";

export interface TaskRepository {
  /** Persist a new task and return the created aggregate. */
  create(input: CreateTaskInput): Promise<Task>;
  /** Update mutable fields on an existing task. Returns null if not found. */
  update(taskId: string, input: UpdateTaskInput): Promise<Task | null>;
  /** Hard-delete a task by id. */
  delete(taskId: string): Promise<void>;
  /** Retrieve a task by its id. Returns null if not found. */
  findById(taskId: string): Promise<Task | null>;
  /** List all tasks belonging to a workspace, ordered by updatedAtISO desc. */
  findByWorkspaceId(workspaceId: string): Promise<Task[]>;
  /** Persist a lifecycle status transition and stamp acceptedAtISO / archivedAtISO as appropriate. */
  transitionStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<Task | null>;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/services/invoice-guards.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file invoice-guards.ts
 * @description Pure domain guards for invoice lifecycle invariants.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add guards for additional billing invariants as rules evolve
 */

// ── Guard: item count > 0 before submit ───────────────────────────────────────

/**
 * Asserts that an invoice has at least one item before allowing submission.
 *
 * @param itemCount - Number of items currently on the invoice
 * @returns true if the invoice may be submitted; false if it has no items
 */
export function invoiceHasItems(itemCount: number): boolean {
  return itemCount > 0;
}

// ── Guard: invoice is in draft before item mutation ───────────────────────────

/**
 * Asserts that an invoice is in draft status before allowing item add/remove.
 *
 * @param status - Current invoice status
 * @returns true if items may be mutated; false otherwise
 */
export function invoiceIsEditable(status: string): boolean {
  return status === "draft";
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/services/invoice-transition-policy.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file invoice-transition-policy.ts
 * @description Pure domain service encapsulating allowed Invoice status transitions.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Expand with additional guard conditions as billing rules evolve
 */

import { canTransitionInvoiceStatus, type InvoiceStatus } from "../value-objects/InvoiceStatus";

export type InvoiceTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };

/**
 * Evaluates whether an invoice lifecycle transition is permitted.
 *
 * @param from - Current invoice status
 * @param to   - Requested next status
 * @returns InvoiceTransitionResult indicating whether the transition is allowed
 */
export function evaluateInvoiceTransition(
  from: InvoiceStatus,
  to: InvoiceStatus,
): InvoiceTransitionResult {
  if (!canTransitionInvoiceStatus(from, to)) {
    return {
      allowed: false,
      reason: `Invoice transition from "${from}" to "${to}" is not permitted.`,
    };
  }
  return { allowed: true };
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/services/issue-transition-policy.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file issue-transition-policy.ts
 * @description Pure domain service encapsulating allowed Issue status transitions.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Expand with additional guard conditions as business rules evolve
 */

import { canTransitionIssueStatus, type IssueStatus } from "../value-objects/IssueStatus";

export type IssueTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };

/**
 * Evaluates whether an issue lifecycle transition is permitted.
 *
 * @param from - Current issue status
 * @param to   - Requested next status
 * @returns IssueTransitionResult indicating whether the transition is allowed
 */
export function evaluateIssueTransition(
  from: IssueStatus,
  to: IssueStatus,
): IssueTransitionResult {
  if (!canTransitionIssueStatus(from, to)) {
    return {
      allowed: false,
      reason: `Issue transition from "${from}" to "${to}" is not permitted.`,
    };
  }
  return { allowed: true };
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/services/task-guards.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file task-guards.ts
 * @description Pure domain guards for task lifecycle invariants.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add guards for additional business invariants as rules evolve
 */

// ── Guard: no open issues ─────────────────────────────────────────────────────

/**
 * Asserts that a task has no open issues before allowing QA-pass or acceptance-approve.
 *
 * @param openIssueCount - The number of open issues currently linked to the task
 * @returns true if the task may proceed; false if blocked by open issues
 */
export function hasNoOpenIssues(openIssueCount: number): boolean {
  return openIssueCount === 0;
}

// ── Guard: invoice closed or none ─────────────────────────────────────────────

/**
 * Asserts that any linked invoice is closed (or none exists) before allowing archive.
 *
 * @param invoiceStatus - The status of the linked invoice, or undefined if none
 * @returns true if the task may be archived; false if blocked by an active invoice
 */
export function invoiceAllowsArchive(
  invoiceStatus: string | undefined,
): boolean {
  if (invoiceStatus === undefined) return true;
  return invoiceStatus === "closed";
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/services/task-transition-policy.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file task-transition-policy.ts
 * @description Pure domain service encapsulating allowed Task status transitions.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Expand with multi-branch transitions if workflow rules evolve
 */

import { canTransitionTaskStatus, type TaskStatus } from "../value-objects/TaskStatus";

export type TaskTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };

/**
 * Evaluates whether a task lifecycle transition is permitted.
 *
 * @param from - Current task status
 * @param to   - Requested next status
 * @returns TaskTransitionResult indicating whether the transition is allowed
 */
export function evaluateTaskTransition(
  from: TaskStatus,
  to: TaskStatus,
): TaskTransitionResult {
  if (!canTransitionTaskStatus(from, to)) {
    return {
      allowed: false,
      reason: `Task transition from "${from}" to "${to}" is not permitted.`,
    };
  }
  return { allowed: true };
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/InvoiceId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file InvoiceId.ts
 * @description Branded string value object for Invoice identifiers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const InvoiceIdBrand: unique symbol;

/** Branded string that prevents mixing Invoice IDs with other string IDs. */
export type InvoiceId = string & { readonly [InvoiceIdBrand]: void };

/** Creates an InvoiceId from a plain string (e.g. a Firestore document ID). */
export function invoiceId(raw: string): InvoiceId {
  return raw as InvoiceId;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/InvoiceItemId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file InvoiceItemId.ts
 * @description Branded string value object for InvoiceItem identifiers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const InvoiceItemIdBrand: unique symbol;

/** Branded string that prevents mixing InvoiceItem IDs with other string IDs. */
export type InvoiceItemId = string & { readonly [InvoiceItemIdBrand]: void };

/** Creates an InvoiceItemId from a plain string (e.g. a Firestore document ID). */
export function invoiceItemId(raw: string): InvoiceItemId {
  return raw as InvoiceItemId;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/InvoiceStatus.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file InvoiceStatus.ts
 * @description Invoice lifecycle status union, transition table, and helpers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add additional transition guards as billing rules evolve
 */

// ── Status ─────────────────────────────────────────────────────────────────────

export type InvoiceStatus =
  | "draft"
  | "submitted"
  | "finance_review"
  | "approved"
  | "paid"
  | "closed";

export const INVOICE_STATUSES = [
  "draft",
  "submitted",
  "finance_review",
  "approved",
  "paid",
  "closed",
] as const satisfies readonly InvoiceStatus[];

// ── Transition table ──────────────────────────────────────────────────────────

/**
 * Multi-successor transition map for invoice lifecycle.
 *
 * draft → submitted (SUBMIT / item_count > 0)
 * submitted → finance_review (REVIEW)
 * finance_review → approved (APPROVE)
 * finance_review → submitted (REJECT — back to submitted for resubmission)
 * approved → paid (PAY)
 * paid → closed (CLOSE)
 */
const INVOICE_NEXT: Readonly<Record<InvoiceStatus, readonly InvoiceStatus[]>> = {
  draft: ["submitted"],
  submitted: ["finance_review"],
  finance_review: ["approved", "submitted"],
  approved: ["paid"],
  paid: ["closed"],
  closed: [],
};

/** Returns true if moving from `from` to `to` is a valid transition. */
export function canTransitionInvoiceStatus(from: InvoiceStatus, to: InvoiceStatus): boolean {
  return INVOICE_NEXT[from].includes(to);
}

/** Returns true when the invoice has reached a terminal state and cannot progress. */
export function isTerminalInvoiceStatus(status: InvoiceStatus): boolean {
  return INVOICE_NEXT[status].length === 0;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/IssueId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file IssueId.ts
 * @description Branded string value object for Issue identifiers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const IssueIdBrand: unique symbol;

/** Branded string that prevents mixing Issue IDs with other string IDs. */
export type IssueId = string & { readonly [IssueIdBrand]: void };

/** Creates an IssueId from a plain string (e.g. a Firestore document ID). */
export function issueId(raw: string): IssueId {
  return raw as IssueId;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/IssueStage.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file IssueStage.ts
 * @description Cross-domain stage reference indicating at which task-flow stage an issue was raised.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Extend stage list if workflow introduces additional stages
 */

// ── IssueStage ─────────────────────────────────────────────────────────────────

/**
 * Indicates which stage of the task workflow this issue was raised in.
 * Used to route issue resolution back to the originating workflow step.
 */
export type IssueStage = "task" | "qa" | "acceptance";

export const ISSUE_STAGES = [
  "task",
  "qa",
  "acceptance",
] as const satisfies readonly IssueStage[];
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/IssueStatus.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file IssueStatus.ts
 * @description Issue lifecycle status union, multi-successor transition table, and helpers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add additional transition guards as business rules evolve
 */

// ── Status ─────────────────────────────────────────────────────────────────────

export type IssueStatus =
  | "open"
  | "investigating"
  | "fixing"
  | "retest"
  | "resolved"
  | "closed";

export const ISSUE_STATUSES = [
  "open",
  "investigating",
  "fixing",
  "retest",
  "resolved",
  "closed",
] as const satisfies readonly IssueStatus[];

// ── Transition table ──────────────────────────────────────────────────────────

/**
 * Multi-successor transition map for issue lifecycle.
 *
 * open → investigating (START)
 * investigating → fixing (FIX)
 * fixing → retest (SUBMIT_RETEST)
 * retest → resolved (PASS_RETEST)
 * retest → fixing (FAIL_RETEST — back-edge within the Issue fix cycle)
 * resolved → closed (CLOSE)
 */
const ISSUE_NEXT: Readonly<Record<IssueStatus, readonly IssueStatus[]>> = {
  open: ["investigating"],
  investigating: ["fixing"],
  fixing: ["retest"],
  retest: ["resolved", "fixing"],
  resolved: ["closed"],
  closed: [],
};

/** Returns true if moving from `from` to `to` is a valid transition. */
export function canTransitionIssueStatus(from: IssueStatus, to: IssueStatus): boolean {
  return ISSUE_NEXT[from].includes(to);
}

/** Returns true when the issue has reached a terminal state and cannot progress. */
export function isTerminalIssueStatus(status: IssueStatus): boolean {
  return ISSUE_NEXT[status].length === 0;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/SourceReference.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file SourceReference.ts
 * @description Value object representing the origin of a materialized entity (Task or Invoice).
 *
 * A SourceReference is attached to Task and Invoice entities that were created
 * by the KnowledgeToWorkflowMaterializer Process Manager in response to a
 * `knowledge.page_approved` event. It provides full audit traceability:
 *
 *   Task → sourceReference → KnowledgePage → IngestionJob → source PDF
 */

export type SourceReferenceType = "KnowledgePage";

export interface SourceReference {
  /** The type of the source aggregate. */
  readonly type: SourceReferenceType;
  /** The ID of the source aggregate (e.g. KnowledgePage.id). */
  readonly id: string;
  /**
   * causationId from the `knowledge.page_approved` event that triggered
   * materialization.  Stored for idempotency checks and audit trails.
   */
  readonly causationId: string;
  /**
   * correlationId tracing the entire business flow:
   *   ingestion → human review → approval → materialization.
   */
  readonly correlationId: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/TaskId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file TaskId.ts
 * @description Branded string value object for Task identifiers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const TaskIdBrand: unique symbol;

/** Branded string that prevents mixing Task IDs with other string IDs. */
export type TaskId = string & { readonly [TaskIdBrand]: void };

/** Creates a TaskId from a plain string (e.g. a Firestore document ID). */
export function taskId(raw: string): TaskId {
  return raw as TaskId;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/TaskStatus.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file TaskStatus.ts
 * @description Task lifecycle status union, transition table, and pure helper functions.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add additional transition guards as business rules evolve
 */

// ── Status ─────────────────────────────────────────────────────────────────────

export type TaskStatus =
  | "draft"
  | "in_progress"
  | "qa"
  | "acceptance"
  | "accepted"
  | "archived";

/** Ordered tuple used by Zod schemas (z.enum needs a const tuple). */
export const TASK_STATUSES = [
  "draft",
  "in_progress",
  "qa",
  "acceptance",
  "accepted",
  "archived",
] as const satisfies readonly TaskStatus[];

// ── Transition table ──────────────────────────────────────────────────────────

/**
 * Maps each status to its single valid successor (null = terminal).
 *
 * The flow is intentionally forward-only.
 * draft → in_progress (ASSIGN)
 * in_progress → qa (SUBMIT_QA)
 * qa → acceptance (PASS_QA)
 * acceptance → accepted (APPROVE_ACCEPTANCE)
 * accepted → archived (ARCHIVE)
 */
const TASK_NEXT: Readonly<Record<TaskStatus, TaskStatus | null>> = {
  draft: "in_progress",
  in_progress: "qa",
  qa: "acceptance",
  acceptance: "accepted",
  accepted: "archived",
  archived: null,
};

/** Returns true if moving from `from` to `to` is a valid forward transition. */
export function canTransitionTaskStatus(from: TaskStatus, to: TaskStatus): boolean {
  return TASK_NEXT[from] === to;
}

/** Returns the next status in the main flow, or null if already terminal. */
export function nextTaskStatus(current: TaskStatus): TaskStatus | null {
  return TASK_NEXT[current];
}

/** Returns true when the task has reached a terminal state and cannot progress. */
export function isTerminalTaskStatus(status: TaskStatus): boolean {
  return TASK_NEXT[status] === null;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/UserId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file UserId.ts
 * @description Branded string value object for User identifiers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const UserIdBrand: unique symbol;

/** Branded string that prevents mixing User IDs with other string IDs. */
export type UserId = string & { readonly [UserIdBrand]: void };

/** Creates a UserId from a plain string (e.g. a Firebase Auth UID). */
export function userId(raw: string): UserId {
  return raw as UserId;
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/firebase/invoice-item.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file invoice-item.converter.ts
 * @description Firestore document-to-entity converter for InvoiceItem.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */

import type { InvoiceItem } from "../../domain/entities/InvoiceItem";

/**
 * Converts a raw Firestore document data map into a typed InvoiceItem entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toInvoiceItem(id: string, data: Record<string, unknown>): InvoiceItem {
  return {
    id,
    invoiceId: typeof data.invoiceId === "string" ? data.invoiceId : "",
    taskId: typeof data.taskId === "string" ? data.taskId : "",
    amount: typeof data.amount === "number" ? data.amount : 0,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/firebase/invoice.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file invoice.converter.ts
 * @description Firestore document-to-entity converter for Invoice.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */

import type { Invoice } from "../../domain/entities/Invoice";
import { INVOICE_STATUSES, type InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import { toSourceReference } from "./sourceReference.converter";

const VALID_STATUSES = new Set<InvoiceStatus>(INVOICE_STATUSES);
const DEFAULT_STATUS: InvoiceStatus = "draft";

/**
 * Converts a raw Firestore document data map into a typed Invoice entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toInvoice(id: string, data: Record<string, unknown>): Invoice {
  const rawStatus = data.status as InvoiceStatus;
  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    status: VALID_STATUSES.has(rawStatus) ? rawStatus : DEFAULT_STATUS,
    totalAmount: typeof data.totalAmount === "number" ? data.totalAmount : 0,
    submittedAtISO: typeof data.submittedAtISO === "string" ? data.submittedAtISO : undefined,
    approvedAtISO: typeof data.approvedAtISO === "string" ? data.approvedAtISO : undefined,
    paidAtISO: typeof data.paidAtISO === "string" ? data.paidAtISO : undefined,
    closedAtISO: typeof data.closedAtISO === "string" ? data.closedAtISO : undefined,
    sourceReference: toSourceReference(data.sourceReference),
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/firebase/issue.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file issue.converter.ts
 * @description Firestore document-to-entity converter for Issue.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */

import type { Issue } from "../../domain/entities/Issue";
import { ISSUE_STATUSES, type IssueStatus } from "../../domain/value-objects/IssueStatus";
import { ISSUE_STAGES, type IssueStage } from "../../domain/value-objects/IssueStage";

const VALID_STATUSES = new Set<IssueStatus>(ISSUE_STATUSES);
const VALID_STAGES = new Set<IssueStage>(ISSUE_STAGES);
const DEFAULT_STATUS: IssueStatus = "open";
const DEFAULT_STAGE: IssueStage = "task";

/**
 * Converts a raw Firestore document data map into a typed Issue entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toIssue(id: string, data: Record<string, unknown>): Issue {
  const rawStatus = data.status as IssueStatus;
  const rawStage = data.stage as IssueStage;
  return {
    id,
    taskId: typeof data.taskId === "string" ? data.taskId : "",
    stage: VALID_STAGES.has(rawStage) ? rawStage : DEFAULT_STAGE,
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    status: VALID_STATUSES.has(rawStatus) ? rawStatus : DEFAULT_STATUS,
    createdBy: typeof data.createdBy === "string" ? data.createdBy : "",
    assignedTo: typeof data.assignedTo === "string" ? data.assignedTo : undefined,
    resolvedAtISO: typeof data.resolvedAtISO === "string" ? data.resolvedAtISO : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/firebase/sourceReference.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file sourceReference.converter.ts
 * @description Firestore document-to-value-object converter for SourceReference.
 * Shared by task.converter.ts and invoice.converter.ts.
 */

import type { SourceReference } from "../../domain/value-objects/SourceReference";

/**
 * Convert a raw Firestore field value to a typed SourceReference value object.
 * Returns `undefined` if the value is absent or does not conform to the expected shape.
 */
export function toSourceReference(raw: unknown): SourceReference | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  if (r.type !== "KnowledgePage") return undefined;
  if (
    typeof r.id !== "string" ||
    typeof r.causationId !== "string" ||
    typeof r.correlationId !== "string"
  ) {
    return undefined;
  }
  return { type: "KnowledgePage", id: r.id, causationId: r.causationId, correlationId: r.correlationId };
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/firebase/task.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file task.converter.ts
 * @description Firestore document-to-entity converter for Task.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */

import type { Task } from "../../domain/entities/Task";
import { TASK_STATUSES, type TaskStatus } from "../../domain/value-objects/TaskStatus";
import { toSourceReference } from "./sourceReference.converter";

const VALID_STATUSES = new Set<TaskStatus>(TASK_STATUSES);
const DEFAULT_STATUS: TaskStatus = "draft";

/**
 * Converts a raw Firestore document data map into a typed Task entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toTask(id: string, data: Record<string, unknown>): Task {
  const rawStatus = data.status as TaskStatus;
  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    status: VALID_STATUSES.has(rawStatus) ? rawStatus : DEFAULT_STATUS,
    assigneeId: typeof data.assigneeId === "string" ? data.assigneeId : undefined,
    dueDateISO: typeof data.dueDateISO === "string" ? data.dueDateISO : undefined,
    acceptedAtISO: typeof data.acceptedAtISO === "string" ? data.acceptedAtISO : undefined,
    archivedAtISO: typeof data.archivedAtISO === "string" ? data.archivedAtISO : undefined,
    sourceReference: toSourceReference(data.sourceReference),
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/firebase/workspace-flow.collections.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file workspace-flow.collections.ts
 * @description Firestore collection path constants for the workspace-flow module.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Update collection names to match production Firestore schema
 */

/** Top-level Firestore collection for workspace-flow tasks. */
export const WF_TASKS_COLLECTION = "workspaceFlowTasks" as const;

/** Top-level Firestore collection for workspace-flow issues. */
export const WF_ISSUES_COLLECTION = "workspaceFlowIssues" as const;

/** Top-level Firestore collection for workspace-flow invoices. */
export const WF_INVOICES_COLLECTION = "workspaceFlowInvoices" as const;

/** Top-level Firestore collection for workspace-flow invoice items. */
export const WF_INVOICE_ITEMS_COLLECTION = "workspaceFlowInvoiceItems" as const;
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/repositories/FirebaseInvoiceItemRepository.ts
````typescript
/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseInvoiceItemRepository.ts
 * @description Firebase Firestore repository for InvoiceItem CRUD operations.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add query pagination support
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
import { toInvoiceItem } from "../firebase/invoice-item.converter";
import { WF_INVOICE_ITEMS_COLLECTION } from "../firebase/workspace-flow.collections";

export class FirebaseInvoiceItemRepository {
  private itemPath(itemId: string): string {
    return `${WF_INVOICE_ITEMS_COLLECTION}/${itemId}`;
  }

  async findById(itemId: string): Promise<InvoiceItem | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.itemPath(itemId));
    if (!data) return null;
    return toInvoiceItem(itemId, data);
  }

  async findByInvoiceId(invoiceId: string): Promise<InvoiceItem[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_INVOICE_ITEMS_COLLECTION,
      [{ field: "invoiceId", op: "==", value: invoiceId }],
    );
    return docs.map((d) => toInvoiceItem(d.id, d.data));
  }

  async delete(itemId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(this.itemPath(itemId));
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/repositories/FirebaseInvoiceRepository.ts
````typescript
/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseInvoiceRepository.ts
 * @description Firebase Firestore implementation of InvoiceRepository for workspace-flow.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add query pagination support and composite indexes
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { Invoice, CreateInvoiceInput } from "../../domain/entities/Invoice";
import type { InvoiceItem, AddInvoiceItemInput } from "../../domain/entities/InvoiceItem";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { INVOICE_STATUSES, type InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import { toInvoice } from "../firebase/invoice.converter";
import { toInvoiceItem } from "../firebase/invoice-item.converter";
import {
  WF_INVOICES_COLLECTION,
  WF_INVOICE_ITEMS_COLLECTION,
} from "../firebase/workspace-flow.collections";

const VALID_STATUSES = new Set<InvoiceStatus>(INVOICE_STATUSES);
const DEFAULT_STATUS: InvoiceStatus = "draft";

export class FirebaseInvoiceRepository implements InvoiceRepository {
  private invoicePath(invoiceId: string): string {
    return `${WF_INVOICES_COLLECTION}/${invoiceId}`;
  }

  private itemPath(itemId: string): string {
    return `${WF_INVOICE_ITEMS_COLLECTION}/${itemId}`;
  }

  async create(input: CreateInvoiceInput): Promise<Invoice> {
    const nowISO = new Date().toISOString();
    const docData: Record<string, unknown> = {
      workspaceId: input.workspaceId,
      status: DEFAULT_STATUS,
      totalAmount: 0,
      submittedAtISO: null,
      approvedAtISO: null,
      paidAtISO: null,
      closedAtISO: null,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
    if (input.sourceReference) {
      docData.sourceReference = { ...input.sourceReference };
    }

    const id = generateId();
    await firestoreInfrastructureApi.set(this.invoicePath(id), docData);

    return {
      id,
      workspaceId: input.workspaceId,
      status: DEFAULT_STATUS,
      totalAmount: 0,
      sourceReference: input.sourceReference,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async delete(invoiceId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(this.invoicePath(invoiceId));
  }

  async findById(invoiceId: string): Promise<Invoice | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.invoicePath(invoiceId));
    if (!data) return null;
    return toInvoice(invoiceId, data);
  }

  async findByWorkspaceId(workspaceId: string): Promise<Invoice[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_INVOICES_COLLECTION,
      [{ field: "workspaceId", op: "==", value: workspaceId }],
    );
    const invoices = docs.map((d) => toInvoice(d.id, d.data));
    return invoices.sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO));
  }

  async transitionStatus(
    invoiceId: string,
    to: InvoiceStatus,
    nowISO: string,
  ): Promise<Invoice | null> {
    const path = this.invoicePath(invoiceId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const validTo = VALID_STATUSES.has(to) ? to : DEFAULT_STATUS;
    const patch: Record<string, unknown> = {
      status: validTo,
      updatedAtISO: nowISO,
    };
    if (validTo === "submitted") patch.submittedAtISO = nowISO;
    if (validTo === "approved") patch.approvedAtISO = nowISO;
    if (validTo === "paid") patch.paidAtISO = nowISO;
    if (validTo === "closed") patch.closedAtISO = nowISO;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toInvoice(invoiceId, updated);
  }

  async addItem(input: AddInvoiceItemInput): Promise<InvoiceItem> {
    const nowISO = new Date().toISOString();
    const itemId = generateId();
    await firestoreInfrastructureApi.set(this.itemPath(itemId), {
      invoiceId: input.invoiceId,
      taskId: input.taskId,
      amount: input.amount,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    });

    // Update invoice totalAmount
    const invoicePath = this.invoicePath(input.invoiceId);
    const invoice = await firestoreInfrastructureApi.get<Record<string, unknown>>(invoicePath);
    if (invoice) {
      const totalAmount = typeof invoice.totalAmount === "number" ? invoice.totalAmount : 0;
      await firestoreInfrastructureApi.update(invoicePath, {
        totalAmount: totalAmount + input.amount,
        updatedAtISO: nowISO,
      });
    }

    return {
      id: itemId,
      invoiceId: input.invoiceId,
      taskId: input.taskId,
      amount: input.amount,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async findItemById(invoiceItemId: string): Promise<InvoiceItem | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.itemPath(invoiceItemId));
    if (!data) return null;
    return toInvoiceItem(invoiceItemId, data);
  }

  async updateItem(invoiceItemId: string, amount: number): Promise<InvoiceItem | null> {
    const itemPath = this.itemPath(invoiceItemId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(itemPath);
    if (!data) return null;

    const oldAmount = typeof data.amount === "number" ? data.amount : 0;
    const invoiceId = typeof data.invoiceId === "string" ? data.invoiceId : "";
    const nowISO = new Date().toISOString();

    await firestoreInfrastructureApi.update(itemPath, { amount, updatedAtISO: nowISO });

    if (invoiceId) {
      const invoicePath = this.invoicePath(invoiceId);
      const invoice = await firestoreInfrastructureApi.get<Record<string, unknown>>(invoicePath);
      if (invoice) {
        const totalAmount = typeof invoice.totalAmount === "number" ? invoice.totalAmount : 0;
        await firestoreInfrastructureApi.update(invoicePath, {
          totalAmount: totalAmount + (amount - oldAmount),
          updatedAtISO: nowISO,
        });
      }
    }

    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(itemPath);
    if (!updated) return null;
    return toInvoiceItem(invoiceItemId, updated);
  }

  async removeItem(invoiceItemId: string): Promise<void> {
    const itemPath = this.itemPath(invoiceItemId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(itemPath);
    if (!data) return;

    const amount = typeof data.amount === "number" ? data.amount : 0;
    const invoiceId = typeof data.invoiceId === "string" ? data.invoiceId : "";

    await firestoreInfrastructureApi.delete(itemPath);

    if (invoiceId) {
      const invoicePath = this.invoicePath(invoiceId);
      const invoice = await firestoreInfrastructureApi.get<Record<string, unknown>>(invoicePath);
      if (invoice) {
        const totalAmount = typeof invoice.totalAmount === "number" ? invoice.totalAmount : 0;
        await firestoreInfrastructureApi.update(invoicePath, {
          totalAmount: totalAmount - amount,
          updatedAtISO: new Date().toISOString(),
        });
      }
    }
  }

  async listItems(invoiceId: string): Promise<InvoiceItem[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_INVOICE_ITEMS_COLLECTION,
      [{ field: "invoiceId", op: "==", value: invoiceId }],
    );
    return docs.map((d) => toInvoiceItem(d.id, d.data));
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/repositories/FirebaseIssueRepository.ts
````typescript
/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseIssueRepository.ts
 * @description Firebase Firestore implementation of IssueRepository for workspace-flow.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add query pagination support and composite indexes
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { Issue, OpenIssueInput, UpdateIssueInput } from "../../domain/entities/Issue";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { ISSUE_STATUSES, type IssueStatus } from "../../domain/value-objects/IssueStatus";
import { toIssue } from "../firebase/issue.converter";
import { WF_ISSUES_COLLECTION } from "../firebase/workspace-flow.collections";

const VALID_STATUSES = new Set<IssueStatus>(ISSUE_STATUSES);
const DEFAULT_STATUS: IssueStatus = "open";
const OPEN_STATUSES: IssueStatus[] = ["open", "investigating", "fixing", "retest"];

export class FirebaseIssueRepository implements IssueRepository {
  private issuePath(issueId: string): string {
    return `${WF_ISSUES_COLLECTION}/${issueId}`;
  }

  async create(input: OpenIssueInput): Promise<Issue> {
    const nowISO = new Date().toISOString();
    const issueId = generateId();
    await firestoreInfrastructureApi.set(this.issuePath(issueId), {
      taskId: input.taskId,
      stage: input.stage,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      createdBy: input.createdBy,
      assignedTo: input.assignedTo ?? null,
      resolvedAtISO: null,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    });

    return {
      id: issueId,
      taskId: input.taskId,
      stage: input.stage,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      createdBy: input.createdBy,
      assignedTo: input.assignedTo,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async update(issueId: string, input: UpdateIssueInput): Promise<Issue | null> {
    const path = this.issuePath(issueId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const patch: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
    };
    if (typeof input.title === "string") patch.title = input.title;
    if (typeof input.description === "string") patch.description = input.description;
    if (typeof input.assignedTo === "string") patch.assignedTo = input.assignedTo;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toIssue(issueId, updated);
  }

  async delete(issueId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(this.issuePath(issueId));
  }

  async findById(issueId: string): Promise<Issue | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.issuePath(issueId));
    if (!data) return null;
    return toIssue(issueId, data);
  }

  async findByTaskId(taskId: string): Promise<Issue[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_ISSUES_COLLECTION,
      [{ field: "taskId", op: "==", value: taskId }],
      { orderBy: [{ field: "createdAtISO", direction: "desc" }] },
    );
    return docs.map((d) => toIssue(d.id, d.data));
  }

  async countOpenByTaskId(taskId: string): Promise<number> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_ISSUES_COLLECTION,
      [
        { field: "taskId", op: "==", value: taskId },
        { field: "status", op: "in", value: OPEN_STATUSES },
      ],
    );
    return docs.length;
  }

  async transitionStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<Issue | null> {
    const path = this.issuePath(issueId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const validTo = VALID_STATUSES.has(to) ? to : DEFAULT_STATUS;
    const patch: Record<string, unknown> = {
      status: validTo,
      updatedAtISO: nowISO,
    };
    if (validTo === "resolved") patch.resolvedAtISO = nowISO;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toIssue(issueId, updated);
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/repositories/FirebaseTaskRepository.ts
````typescript
/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseTaskRepository.ts
 * @description Firebase Firestore implementation of TaskRepository for workspace-flow.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add query pagination support and composite indexes
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../../domain/entities/Task";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { TASK_STATUSES, type TaskStatus } from "../../domain/value-objects/TaskStatus";
import { toTask } from "../firebase/task.converter";
import { WF_TASKS_COLLECTION } from "../firebase/workspace-flow.collections";

const VALID_STATUSES = new Set<TaskStatus>(TASK_STATUSES);
const DEFAULT_STATUS: TaskStatus = "draft";

export class FirebaseTaskRepository implements TaskRepository {
  private taskPath(taskId: string): string {
    return `${WF_TASKS_COLLECTION}/${taskId}`;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const nowISO = new Date().toISOString();
    const docData: Record<string, unknown> = {
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      assigneeId: input.assigneeId ?? null,
      dueDateISO: input.dueDateISO ?? null,
      acceptedAtISO: null,
      archivedAtISO: null,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
    if (input.sourceReference) {
      docData.sourceReference = { ...input.sourceReference };
    }

    const taskId = generateId();
    await firestoreInfrastructureApi.set(this.taskPath(taskId), docData);

    return {
      id: taskId,
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      assigneeId: input.assigneeId,
      dueDateISO: input.dueDateISO,
      sourceReference: input.sourceReference,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async update(taskId: string, input: UpdateTaskInput): Promise<Task | null> {
    const path = this.taskPath(taskId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const patch: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
    };
    if (typeof input.title === "string") patch.title = input.title;
    if (typeof input.description === "string") patch.description = input.description;
    if (typeof input.assigneeId === "string") patch.assigneeId = input.assigneeId;
    if (typeof input.dueDateISO === "string") patch.dueDateISO = input.dueDateISO;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toTask(taskId, updated);
  }

  async delete(taskId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(this.taskPath(taskId));
  }

  async findById(taskId: string): Promise<Task | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.taskPath(taskId));
    if (!data) return null;
    return toTask(taskId, data);
  }

  async findByWorkspaceId(workspaceId: string): Promise<Task[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_TASKS_COLLECTION,
      [{ field: "workspaceId", op: "==", value: workspaceId }],
    );
    const tasks = docs.map((d) => toTask(d.id, d.data));
    return tasks.sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO));
  }

  async transitionStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<Task | null> {
    const path = this.taskPath(taskId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const validTo = VALID_STATUSES.has(to) ? to : DEFAULT_STATUS;
    const patch: Record<string, unknown> = {
      status: validTo,
      updatedAtISO: nowISO,
    };
    if (validTo === "accepted") patch.acceptedAtISO = nowISO;
    if (validTo === "archived") patch.archivedAtISO = nowISO;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toTask(taskId, updated);
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/_actions/workspace-flow-invoice.actions.ts
````typescript
"use server";

/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow-invoice.actions.ts
 * @description Server Actions for workspace-flow Invoice write operations.
 * Delegates exclusively to WorkspaceFlowFacade.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { WorkspaceFlowInvoiceFacade } from "../../api/workspace-flow-invoice.facade";
import { makeInvoiceRepo } from "../../api/factories";
import type { AddInvoiceItemDto } from "../../application/dto/add-invoice-item.dto";
import type { UpdateInvoiceItemDto } from "../../application/dto/update-invoice-item.dto";
import type { RemoveInvoiceItemDto } from "../../application/dto/remove-invoice-item.dto";

function makeFacade(): WorkspaceFlowInvoiceFacade {
  return new WorkspaceFlowInvoiceFacade(
    makeInvoiceRepo(),
  );
}

export async function wfCreateInvoice(workspaceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().createInvoice(workspaceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfAddInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult> {
  try {
    return await makeFacade().addInvoiceItem(dto);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_ADD_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfUpdateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult> {
  try {
    return await makeFacade().updateInvoiceItem(invoiceItemId, dto);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_UPDATE_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfRemoveInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult> {
  try {
    return await makeFacade().removeInvoiceItem(dto);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REMOVE_ITEM_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfSubmitInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().submitInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_SUBMIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfReviewInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().reviewInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REVIEW_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfApproveInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().approveInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_APPROVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfRejectInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().rejectInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_REJECT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPayInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().payInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_PAY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfCloseInvoice(invoiceId: string): Promise<CommandResult> {
  try {
    return await makeFacade().closeInvoice(invoiceId);
  } catch (err) {
    return commandFailureFrom("WF_INVOICE_CLOSE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/_actions/workspace-flow-issue.actions.ts
````typescript
"use server";

/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow-issue.actions.ts
 * @description Server Actions for workspace-flow Issue write operations.
 * Delegates exclusively to WorkspaceFlowFacade.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { WorkspaceFlowIssueFacade } from "../../api/workspace-flow-issue.facade";
import { makeIssueRepo } from "../../api/factories";
import type { OpenIssueDto } from "../../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../../application/dto/resolve-issue.dto";

function makeFacade(): WorkspaceFlowIssueFacade {
  return new WorkspaceFlowIssueFacade(
    makeIssueRepo(),
  );
}

export async function wfOpenIssue(dto: OpenIssueDto): Promise<CommandResult> {
  try {
    return await makeFacade().openIssue(dto);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_OPEN_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfStartIssue(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().startIssue(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_START_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfFixIssue(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().fixIssue(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_FIX_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfSubmitIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().submitIssueRetest(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_SUBMIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPassIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().passIssueRetest(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_PASS_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfFailIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().failIssueRetest(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_FAIL_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfResolveIssue(dto: ResolveIssueDto): Promise<CommandResult> {
  try {
    return await makeFacade().resolveIssue(dto);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RESOLVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfCloseIssue(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().closeIssue(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_CLOSE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/_actions/workspace-flow-task.actions.ts
````typescript
"use server";

/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow-task.actions.ts
 * @description Server Actions for workspace-flow Task write operations.
 * Delegates exclusively to WorkspaceFlowFacade.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { WorkspaceFlowTaskFacade } from "../../api/workspace-flow-task.facade";
import { makeIssueRepo, makeTaskRepo } from "../../api/factories";
import type { CreateTaskDto } from "../../application/dto/create-task.dto";
import type { UpdateTaskDto } from "../../application/dto/update-task.dto";

function makeFacade(): WorkspaceFlowTaskFacade {
  return new WorkspaceFlowTaskFacade(
    makeTaskRepo(),
    makeIssueRepo(),
  );
}

export async function wfCreateTask(dto: CreateTaskDto): Promise<CommandResult> {
  try {
    return await makeFacade().createTask(dto);
  } catch (err) {
    return commandFailureFrom("WF_TASK_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfUpdateTask(taskId: string, dto: UpdateTaskDto): Promise<CommandResult> {
  try {
    return await makeFacade().updateTask(taskId, dto);
  } catch (err) {
    return commandFailureFrom("WF_TASK_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfAssignTask(taskId: string, assigneeId: string): Promise<CommandResult> {
  try {
    return await makeFacade().assignTask(taskId, assigneeId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_ASSIGN_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfSubmitTaskToQa(taskId: string): Promise<CommandResult> {
  try {
    return await makeFacade().submitTaskToQa(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_SUBMIT_QA_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPassTaskQa(taskId: string): Promise<CommandResult> {
  try {
    return await makeFacade().passTaskQa(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_PASS_QA_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfApproveTaskAcceptance(taskId: string): Promise<CommandResult> {
  try {
    return await makeFacade().approveTaskAcceptance(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_APPROVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfArchiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult> {
  try {
    return await makeFacade().archiveTask(taskId, invoiceStatus);
  } catch (err) {
    return commandFailureFrom("WF_TASK_ARCHIVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/_actions/workspace-flow.actions.ts
````typescript
/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow.actions.ts
 * @description Re-export barrel for all workspace-flow Server Actions.
 *              Each sub-file carries its own "use server" directive; this barrel
 *              must NOT repeat it — Turbopack cannot resolve re-exports from a
 *              "use server" barrel that itself re-exports other "use server" files.
 *  - workspace-flow-task.actions.ts    (create, update, assign, qa, approve, archive)
 *  - workspace-flow-issue.actions.ts   (open, start, fix, retest, resolve, close)
 *  - workspace-flow-invoice.actions.ts (create, add/update/remove item, submit, review, approve, reject, pay, close)
 */

export {
  wfCreateTask,
  wfUpdateTask,
  wfAssignTask,
  wfSubmitTaskToQa,
  wfPassTaskQa,
  wfApproveTaskAcceptance,
  wfArchiveTask,
} from "./workspace-flow-task.actions";

export {
  wfOpenIssue,
  wfStartIssue,
  wfFixIssue,
  wfSubmitIssueRetest,
  wfPassIssueRetest,
  wfFailIssueRetest,
  wfResolveIssue,
  wfCloseIssue,
} from "./workspace-flow-issue.actions";

export {
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
} from "./workspace-flow-invoice.actions";
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/AssignTaskDialog.tsx
````typescript
"use client";

import { useState } from "react";

import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";

import { wfAssignTask } from "../_actions/workspace-flow.actions";

export interface AssignTaskDialogProps {
  open: boolean;
  taskId: string;
  onClose: () => void;
  onDone: () => void;
}

export function AssignTaskDialog({ open, taskId, onClose, onDone }: AssignTaskDialogProps) {
  const [assigneeId, setAssigneeId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setAssigneeId("");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const a = assigneeId.trim();
    if (!a) { setError("請輸入指派人 ID。"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const result = await wfAssignTask(taskId, a);
      if (!result.success) { setError(result.error.message ?? "指派失敗"); return; }
      onDone();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "指派失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>指派任務</DialogTitle>
          <DialogDescription>填入負責人 ID，任務將進入進行中。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="assignee-id">指派人 ID *</Label>
            <Input
              id="assignee-id"
              placeholder="用戶 ID"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              disabled={submitting}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>取消</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "指派中…" : "指派"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/CreateTaskDialog.tsx
````typescript
"use client";

import { useState } from "react";

import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";

import { wfCreateTask } from "../_actions/workspace-flow.actions";

export interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  workspaceId: string;
}

export function CreateTaskDialog({ open, onClose, onCreated, workspaceId }: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDateISO, setDueDateISO] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setTitle("");
    setDescription("");
    setAssigneeId("");
    setDueDateISO("");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) { setError("請輸入任務標題。"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const result = await wfCreateTask({
        workspaceId,
        title: t,
        description: description.trim() || undefined,
        assigneeId: assigneeId.trim() || undefined,
        dueDateISO: dueDateISO || undefined,
      });
      if (!result.success) { setError(result.error.message ?? "建立失敗"); return; }
      onCreated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>建立任務</DialogTitle>
          <DialogDescription>新增一個工作任務到此工作區。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">標題 *</Label>
            <Input
              id="task-title"
              placeholder="任務名稱"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-description">描述（選填）</Label>
            <Textarea
              id="task-description"
              placeholder="任務詳情或驗收條件…"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-assignee">指派人 ID（選填）</Label>
              <Input
                id="task-assignee"
                placeholder="用戶 ID"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-due">截止日期（選填）</Label>
              <Input
                id="task-due"
                type="date"
                value={dueDateISO}
                onChange={(e) => setDueDateISO(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>取消</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "建立中…" : "建立任務"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/InvoiceRow.tsx
````typescript
"use client";

import { useState } from "react";

import type { CommandResult } from "@shared-types";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

import type { Invoice } from "../../application/dto/workflow.dto";
import type { InvoiceStatus } from "../../application/dto/workflow.dto";
import {
  wfApproveInvoice,
  wfCloseInvoice,
  wfPayInvoice,
  wfRejectInvoice,
  wfReviewInvoice,
  wfSubmitInvoice,
} from "../_actions/workspace-flow.actions";

const INVOICE_STATUS_VARIANT: Record<
  InvoiceStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "outline",
  submitted: "secondary",
  finance_review: "secondary",
  approved: "default",
  paid: "default",
  closed: "outline",
};

const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: "草稿",
  submitted: "已提交",
  finance_review: "財務審核",
  approved: "已核准",
  paid: "已付款",
  closed: "已結清",
};

function formatShortDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `TWD ${amount}`;
  }
}

export interface InvoiceRowProps {
  invoice: Invoice;
  onTransitioned: () => void;
}

export function InvoiceRow({ invoice, onTransitioned }: InvoiceRowProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAction(action: () => Promise<CommandResult>) {
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      if (!result.success) { setError(result.error.message ?? "操作失敗"); }
      else { onTransitioned(); }
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失敗");
    } finally {
      setBusy(false);
    }
  }

  function renderActions() {
    switch (invoice.status) {
      case "draft":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfSubmitInvoice(invoice.id))}>提交</Button>;
      case "submitted":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfReviewInvoice(invoice.id))}>送審</Button>;
      case "finance_review":
        return (
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfApproveInvoice(invoice.id))}>核准</Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfRejectInvoice(invoice.id))}>退回</Button>
          </div>
        );
      case "approved":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfPayInvoice(invoice.id))}>付款</Button>;
      case "paid":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfCloseInvoice(invoice.id))}>結清</Button>;
      default:
        return null;
    }
  }

  return (
    <div className="rounded-xl border border-border/40 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            #{invoice.id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground">建立：{formatShortDate(invoice.createdAtISO)}</p>
          {invoice.paidAtISO && (
            <p className="text-xs text-muted-foreground">付款：{formatShortDate(invoice.paidAtISO)}</p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Badge variant={INVOICE_STATUS_VARIANT[invoice.status]}>
            {INVOICE_STATUS_LABEL[invoice.status]}
          </Badge>
          <p className="text-sm font-semibold text-foreground">{formatCurrency(invoice.totalAmount)}</p>
          {renderActions()}
        </div>
      </div>
    </div>
  );
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/IssueRow.tsx
````typescript
"use client";

import { useState } from "react";

import type { CommandResult } from "@shared-types";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

import type { Issue } from "../../application/dto/workflow.dto";
import type { IssueStage } from "../../application/dto/workflow.dto";
import {
  wfCloseIssue,
  wfFailIssueRetest,
  wfFixIssue,
  wfPassIssueRetest,
  wfStartIssue,
  wfSubmitIssueRetest,
} from "../_actions/workspace-flow.actions";

export const ISSUE_STAGE_LABEL: Record<IssueStage, string> = {
  task: "任務",
  qa: "QA",
  acceptance: "驗收",
};

const ISSUE_STATUS_VARIANT: Record<
  Issue["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  open: "destructive",
  investigating: "destructive",
  fixing: "secondary",
  retest: "secondary",
  resolved: "default",
  closed: "outline",
};

const ISSUE_STATUS_LABEL: Record<Issue["status"], string> = {
  open: "開啟",
  investigating: "調查中",
  fixing: "修復中",
  retest: "重測中",
  resolved: "已解決",
  closed: "已關閉",
};

export interface IssueRowProps {
  issue: Issue;
  onTransitioned: () => void;
}

export function IssueRow({ issue, onTransitioned }: IssueRowProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAction(action: () => Promise<CommandResult>) {
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      if (!result.success) { setError(result.error.message ?? "操作失敗"); }
      else { onTransitioned(); }
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失敗");
    } finally {
      setBusy(false);
    }
  }

  function renderActions() {
    switch (issue.status) {
      case "open":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfStartIssue(issue.id))}>開始調查</Button>;
      case "investigating":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfFixIssue(issue.id))}>開始修復</Button>;
      case "fixing":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfSubmitIssueRetest(issue.id))}>送重測</Button>;
      case "retest":
        return (
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfPassIssueRetest(issue.id))}>通過</Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfFailIssueRetest(issue.id))}>失敗</Button>
          </div>
        );
      case "resolved":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfCloseIssue(issue.id))}>關閉</Button>;
      default:
        return null;
    }
  }

  return (
    <div className="rounded-lg border border-border/30 px-3 py-2.5 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={ISSUE_STATUS_VARIANT[issue.status]} className="text-xs">
              {ISSUE_STATUS_LABEL[issue.status]}
            </Badge>
            <Badge variant="outline" className="text-xs">{ISSUE_STAGE_LABEL[issue.stage]}</Badge>
            <span className="font-medium text-foreground truncate">{issue.title}</span>
          </div>
          {issue.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">{issue.description}</p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <div className="shrink-0">{renderActions()}</div>
      </div>
    </div>
  );
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/OpenIssueDialog.tsx
````typescript
"use client";

import { useState } from "react";

import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";

import type { IssueStage } from "../../application/dto/workflow.dto";
import { wfOpenIssue } from "../_actions/workspace-flow.actions";
import { ISSUE_STAGE_LABEL } from "./IssueRow";

export interface OpenIssueDialogProps {
  open: boolean;
  taskId: string;
  currentUserId: string;
  onClose: () => void;
  onCreated: () => void;
}

export function OpenIssueDialog({ open, taskId, currentUserId, onClose, onCreated }: OpenIssueDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<IssueStage>("task");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setTitle("");
    setDescription("");
    setStage("task");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) { setError("請輸入議題標題。"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const result = await wfOpenIssue({
        taskId,
        stage,
        title: t,
        description: description.trim() || undefined,
        createdBy: currentUserId,
      });
      if (!result.success) { setError(result.error.message ?? "建立失敗"); return; }
      onCreated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>開啟議題</DialogTitle>
          <DialogDescription>記錄此任務發現的問題或異常。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="issue-title">標題 *</Label>
            <Input
              id="issue-title"
              placeholder="問題簡述"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="issue-description">描述（選填）</Label>
            <Textarea
              id="issue-description"
              placeholder="問題詳情、重現步驟…"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="space-y-1.5">
            <Label>發生階段</Label>
            <div className="flex gap-2">
              {(["task", "qa", "acceptance"] as const).map((s) => (
                <Button
                  key={s}
                  type="button"
                  size="sm"
                  variant={stage === s ? "default" : "outline"}
                  onClick={() => setStage(s)}
                  disabled={submitting}
                >
                  {ISSUE_STAGE_LABEL[s]}
                </Button>
              ))}
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>取消</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "建立中…" : "開啟議題"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/TaskRow.tsx
````typescript
"use client";

import { useCallback, useState } from "react";

import { ChevronDown, ChevronRight, Plus } from "lucide-react";

import type { CommandResult } from "@shared-types";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

import type { Issue } from "../../application/dto/workflow.dto";
import type { Task } from "../../application/dto/workflow.dto";
import type { TaskStatus } from "../../application/dto/workflow.dto";
import {
  wfApproveTaskAcceptance,
  wfArchiveTask,
  wfPassTaskQa,
  wfSubmitTaskToQa,
} from "../_actions/workspace-flow.actions";
import { getWorkspaceFlowIssues } from "../queries/workspace-flow.queries";
import { AssignTaskDialog } from "./AssignTaskDialog";
import { IssueRow } from "./IssueRow";
import { OpenIssueDialog } from "./OpenIssueDialog";

const TASK_STATUS_VARIANT: Record<
  TaskStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "outline",
  in_progress: "secondary",
  qa: "secondary",
  acceptance: "default",
  accepted: "default",
  archived: "outline",
};

const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  draft: "草稿",
  in_progress: "進行中",
  qa: "QA 審查",
  acceptance: "驗收中",
  accepted: "已驗收",
  archived: "已歸檔",
};

function formatShortDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export interface TaskRowProps {
  task: Task;
  currentUserId: string;
  onTransitioned: () => void;
}

export function TaskRow({ task, currentUserId, onTransitioned }: TaskRowProps) {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [issuesExpanded, setIssuesExpanded] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [issuesLoaded, setIssuesLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadIssues = useCallback(async () => {
    try {
      const data = await getWorkspaceFlowIssues(task.id);
      setIssues(data);
      setIssuesLoaded(true);
    } catch {
      // non-fatal
    }
  }, [task.id]);

  async function toggleIssues() {
    if (!issuesExpanded && !issuesLoaded) {
      await loadIssues();
    }
    setIssuesExpanded((v) => !v);
  }

  async function runAction(action: () => Promise<CommandResult>) {
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      if (!result.success) { setError(result.error.message ?? "操作失敗"); }
      else { onTransitioned(); }
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失敗");
    } finally {
      setBusy(false);
    }
  }

  function renderTaskAction() {
    switch (task.status) {
      case "draft":
        return (
          <Button size="sm" variant="outline" disabled={busy} onClick={() => setAssignDialogOpen(true)}>
            指派任務
          </Button>
        );
      case "in_progress":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfSubmitTaskToQa(task.id))}>送 QA</Button>;
      case "qa":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfPassTaskQa(task.id))}>QA 通過</Button>;
      case "acceptance":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfApproveTaskAcceptance(task.id))}>驗收通過</Button>;
      case "accepted":
        return <Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfArchiveTask(task.id))}>歸檔</Button>;
      default:
        return null;
    }
  }

  return (
    <div className="rounded-xl border border-border/40 px-4 py-4 space-y-3">
      {/* ── Task header ─────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{task.title}</p>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          )}
          {task.assigneeId && (
            <p className="text-xs text-muted-foreground">指派：{task.assigneeId}</p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Badge variant={TASK_STATUS_VARIANT[task.status]}>{TASK_STATUS_LABEL[task.status]}</Badge>
          {task.dueDateISO && (
            <p className="text-xs text-muted-foreground">截止：{formatShortDate(task.dueDateISO)}</p>
          )}
        </div>
      </div>

      {/* ── Action row ──────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {renderTaskAction()}
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => setIssueDialogOpen(true)}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          開議題
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground ml-auto"
          onClick={toggleIssues}
        >
          {issuesExpanded ? (
            <ChevronDown className="mr-1 h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="mr-1 h-3.5 w-3.5" />
          )}
          議題{issuesLoaded ? ` (${issues.length})` : ""}
        </Button>
      </div>

      {/* ── Issues sub-list ─────────────────── */}
      {issuesExpanded && (
        <div className="space-y-2 pl-1">
          {issues.length === 0 ? (
            <p className="text-xs text-muted-foreground">此任務目前無議題。</p>
          ) : (
            issues.map((issue) => (
              <IssueRow
                key={issue.id}
                issue={issue}
                onTransitioned={loadIssues}
              />
            ))
          )}
        </div>
      )}

      {/* ── Dialogs ─────────────────────────── */}
      <AssignTaskDialog
        open={assignDialogOpen}
        taskId={task.id}
        onClose={() => setAssignDialogOpen(false)}
        onDone={onTransitioned}
      />
      <OpenIssueDialog
        open={issueDialogOpen}
        taskId={task.id}
        currentUserId={currentUserId}
        onClose={() => setIssueDialogOpen(false)}
        onCreated={async () => {
          await loadIssues();
          if (!issuesExpanded) setIssuesExpanded(true);
        }}
      />
    </div>
  );
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/WorkspaceFlowTab.tsx
````typescript
"use client";

/**
 * @module workspace-flow/interfaces/components
 * @file WorkspaceFlowTab.tsx
 * @description Workspace-level tab displaying Tasks, Issues, and Invoices managed by workspace-flow.
 *
 * MVP interactive surface:
 * - Create Task dialog
 * - Task lifecycle transition buttons (assign → QA → acceptance → archive)
 * - Per-task expandable Issue sub-list with transition buttons
 * - Open Issue dialog
 * - Create Invoice button + Invoice lifecycle transitions
 *
 * @author workspace-flow
 * @since 2026-03-27
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Separator } from "@ui-shadcn/ui/separator";

import type { Invoice } from "../../application/dto/workflow.dto";
import type { Issue } from "../../application/dto/workflow.dto";
import type { Task } from "../../application/dto/workflow.dto";
import { wfCreateInvoice } from "../_actions/workspace-flow.actions";
import {
  getWorkspaceFlowIssues,
  getWorkspaceFlowInvoices,
  getWorkspaceFlowTasks,
} from "../queries/workspace-flow.queries";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { IssueRow } from "./IssueRow";
import { InvoiceRow } from "./InvoiceRow";
import { TaskRow } from "./TaskRow";

// ── Types ──────────────────────────────────────────────────────────────────────

type FlowSection = "tasks" | "qa" | "acceptance" | "issues" | "invoices";

interface WorkspaceFlowTabProps {
  readonly workspaceId: string;
  readonly currentUserId?: string;
  readonly initialSection?: FlowSection;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function WorkspaceFlowTab({
  workspaceId,
  currentUserId = "anonymous",
  initialSection = "tasks",
}: WorkspaceFlowTabProps) {
  const [section, setSection] = useState<FlowSection>(initialSection);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoadState("loading");
    try {
      const [nextTasks, nextInvoices] = await Promise.all([
        getWorkspaceFlowTasks(workspaceId),
        getWorkspaceFlowInvoices(workspaceId),
      ]);
      const issueMatrix = await Promise.all(
        nextTasks.map(async (task) => {
          try {
            return await getWorkspaceFlowIssues(task.id);
          } catch {
            return [] as Issue[];
          }
        }),
      );
      setTasks(nextTasks);
      setInvoices(nextInvoices);
      setIssues(issueMatrix.flat());
      setLoadState("loaded");
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[WorkspaceFlowTab] Failed to load flow data:", err);
      }
      setLoadState("error");
    }
  }, [workspaceId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection]);

  const qaTasks = useMemo(
    () => tasks.filter((task) => task.status === "qa"),
    [tasks],
  );

  const acceptanceTasks = useMemo(
    () => tasks.filter((task) => task.status === "acceptance" || task.status === "accepted"),
    [tasks],
  );

  async function handleCreateInvoice() {
    setCreatingInvoice(true);
    setActionError(null);
    try {
      const result = await wfCreateInvoice(workspaceId);
      if (!result.success) { setActionError(result.error.message ?? "建立發票失敗"); }
      else { await loadData(); }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "建立發票失敗");
    } finally {
      setCreatingInvoice(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* ── Section switcher ─────────────────────────────────────────── */}
      <div className="flex gap-2">
        <Button
          variant={section === "tasks" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("tasks")}
        >
          任務{loadState === "loaded" ? ` (${tasks.length})` : ""}
        </Button>
        <Button
          variant={section === "qa" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("qa")}
        >
          質檢{loadState === "loaded" ? ` (${qaTasks.length})` : ""}
        </Button>
        <Button
          variant={section === "acceptance" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("acceptance")}
        >
          驗收{loadState === "loaded" ? ` (${acceptanceTasks.length})` : ""}
        </Button>
        <Button
          variant={section === "issues" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("issues")}
        >
          問題單{loadState === "loaded" ? ` (${issues.length})` : ""}
        </Button>
        <Button
          variant={section === "invoices" ? "default" : "outline"}
          size="sm"
          onClick={() => setSection("invoices")}
        >
          財務{loadState === "loaded" ? ` (${invoices.length})` : ""}
        </Button>
      </div>

      {/* ── Loading state ─────────────────────────────────────────────── */}
      {loadState === "loading" && (
        <Card className="border border-border/50">
          <CardContent className="px-6 py-5 text-sm text-muted-foreground">載入中…</CardContent>
        </Card>
      )}

      {/* ── Error state ───────────────────────────────────────────────── */}
      {loadState === "error" && (
        <Card className="border border-destructive/30">
          <CardContent className="px-6 py-5 text-sm text-destructive">
            無法載入資料，請重新整理頁面後再試。
          </CardContent>
        </Card>
      )}

      {/* ── Tasks section ─────────────────────────────────────────────── */}
      {loadState === "loaded" && section === "tasks" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>任務</CardTitle>
                <CardDescription>工作區所有任務與其進度狀態。</CardDescription>
              </div>
              <Button size="sm" onClick={() => setCreateTaskOpen(true)}>
                <Plus className="mr-1.5 h-4 w-4" />
                建立任務
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前尚無任務，點擊右上角「建立任務」開始。</p>
            ) : (
              tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  onTransitioned={loadData}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* ── QA section ────────────────────────────────────────────────── */}
      {loadState === "loaded" && section === "qa" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle>質檢</CardTitle>
            <CardDescription>等待 QA 審查或處於 QA 階段的任務。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {qaTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前沒有等待質檢的任務。</p>
            ) : (
              qaTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  onTransitioned={loadData}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Acceptance section ────────────────────────────────────────── */}
      {loadState === "loaded" && section === "acceptance" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle>驗收</CardTitle>
            <CardDescription>進行驗收中與已完成驗收的任務。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {acceptanceTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前沒有驗收中的任務。</p>
            ) : (
              acceptanceTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  onTransitioned={loadData}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Issues section ────────────────────────────────────────────── */}
      {loadState === "loaded" && section === "issues" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle>問題單</CardTitle>
            <CardDescription>跨任務檢視所有議題狀態與處理進度。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {issues.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前沒有問題單。</p>
            ) : (
              issues.map((issue) => (
                <IssueRow
                  key={issue.id}
                  issue={issue}
                  onTransitioned={loadData}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Invoices section ──────────────────────────────────────────── */}
      {loadState === "loaded" && section === "invoices" && (
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>財務</CardTitle>
                <CardDescription>工作區帳務請款紀錄。</CardDescription>
              </div>
              <Button size="sm" disabled={creatingInvoice} onClick={handleCreateInvoice}>
                <Plus className="mr-1.5 h-4 w-4" />
                {creatingInvoice ? "建立中…" : "建立發票"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionError && (
              <p role="alert" className="text-sm text-destructive">{actionError}</p>
            )}
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">目前尚無發票紀錄，點擊右上角「建立發票」開始。</p>
            ) : (
              <>
                <Separator />
                {invoices.map((invoice) => (
                  <InvoiceRow
                    key={invoice.id}
                    invoice={invoice}
                    onTransitioned={loadData}
                  />
                ))}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Create Task Dialog ─────────────────────────────────────────── */}
      <CreateTaskDialog
        open={createTaskOpen}
        workspaceId={workspaceId}
        onClose={() => setCreateTaskOpen(false)}
        onCreated={loadData}
      />
    </div>
  );
}
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/contracts/workspace-flow.contract.ts
````typescript
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
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/queries/workspace-flow.queries.ts
````typescript
/**
 * @module workspace-flow/interfaces/queries
 * @file workspace-flow.queries.ts
 * @description Server-side read queries for workspace-flow entities.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add pagination support and caching layer
 */

import type { Task } from "../../application/dto/workflow.dto";
import type { Issue } from "../../application/dto/workflow.dto";
import type { Invoice } from "../../application/dto/workflow.dto";
import type { InvoiceItem } from "../../application/dto/workflow.dto";
import { makeInvoiceRepo, makeIssueRepo, makeTaskRepo } from "../../api/factories";

/**
 * List all tasks for a workspace.
 *
 * @param workspaceId - The workspace to query
 */
export async function getWorkspaceFlowTasks(workspaceId: string): Promise<Task[]> {
  return makeTaskRepo().findByWorkspaceId(workspaceId);
}

/**
 * Get a single task by id.
 *
 * @param taskId - The task identifier
 */
export async function getWorkspaceFlowTask(taskId: string): Promise<Task | null> {
  return makeTaskRepo().findById(taskId);
}

/**
 * List all issues for a task.
 *
 * @param taskId - The task identifier
 */
export async function getWorkspaceFlowIssues(taskId: string): Promise<Issue[]> {
  return makeIssueRepo().findByTaskId(taskId);
}

/**
 * List all invoices for a workspace.
 *
 * @param workspaceId - The workspace to query
 */
export async function getWorkspaceFlowInvoices(workspaceId: string): Promise<Invoice[]> {
  return makeInvoiceRepo().findByWorkspaceId(workspaceId);
}

/**
 * Get items for an invoice.
 *
 * @param invoiceId - The invoice identifier
 */
export async function getWorkspaceFlowInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
  return makeInvoiceRepo().listItems(invoiceId);
}
````

## File: modules/workspace/subdomains/workspace-workflow/README.md
````markdown
# Workspace Workflow

Workflow orchestration for workspace processes.

## Ownership

- **Bounded Context**: workspace
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Local public boundary for same bounded context access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, events, repositories, and business rules |

> By default, `infrastructure/` and `interfaces/` live at the bounded-context root and are grouped by subdomain. Add local `infrastructure/` or `interfaces/` inside a subdomain only when the mini-module gate is explicitly justified.

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````