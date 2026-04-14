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
⋮----
// ── Entity types ──────────────────────────────────────────────────────────────
⋮----
// ── Value objects (enum / list only — no transition helpers) ──────────────────
⋮----
// ── Source reference (content → workspace-flow provenance) ────────────────────
⋮----
// ── Summary projections ───────────────────────────────────────────────────────
⋮----
// ── CRUD / command DTOs ───────────────────────────────────────────────────────
⋮----
// ── Query / pagination DTOs ───────────────────────────────────────────────────
⋮----
// ── Command / operation result ────────────────────────────────────────────────
````

## File: modules/workspace/subdomains/workspace-workflow/api/factories.ts
````typescript
import { FirebaseInvoiceRepository } from "../infrastructure/repositories/FirebaseInvoiceRepository";
import { FirebaseIssueRepository } from "../infrastructure/repositories/FirebaseIssueRepository";
import { FirebaseTaskMaterializationBatchJobRepository } from "../infrastructure/repositories/FirebaseTaskMaterializationBatchJobRepository";
import { FirebaseTaskRepository } from "../infrastructure/repositories/FirebaseTaskRepository";
⋮----
export function makeTaskRepo()
⋮----
export function makeIssueRepo()
⋮----
export function makeInvoiceRepo()
⋮----
export function makeTaskMaterializationBatchJobRepo()
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
⋮----
import type { InvoiceRepository } from "../domain/repositories/InvoiceRepository";
⋮----
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
⋮----
import type { AddInvoiceItemDto } from "../application/dto/add-invoice-item.dto";
import type { UpdateInvoiceItemDto } from "../application/dto/update-invoice-item.dto";
import type { RemoveInvoiceItemDto } from "../application/dto/remove-invoice-item.dto";
import type { InvoiceQueryDto } from "../application/dto/invoice-query.dto";
import type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";
⋮----
import type { InvoiceSummary } from "../interfaces/contracts/workspace-flow.contract";
import { toInvoiceSummary } from "../interfaces/contracts/workspace-flow.contract";
⋮----
import type { CommandResult } from "@shared-types";
⋮----
// ── Pagination helper ─────────────────────────────────────────────────────────
⋮----
function toPagedResult<T>(items: T[], pagination?: PaginationDto): PagedResult<T>
⋮----
/**
 * WorkspaceFlowInvoiceFacade
 *
 * Single entry point for all Invoice write and summary-read operations.
 * Requires only InvoiceRepository — no cross-aggregate dependencies.
 */
export class WorkspaceFlowInvoiceFacade {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
⋮----
// ── Write operations ─────────────────────────────────────────────────────────
⋮----
async createInvoice(workspaceId: string): Promise<CommandResult>
⋮----
async addInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult>
⋮----
async updateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult>
⋮----
async removeInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult>
⋮----
async submitInvoice(invoiceId: string): Promise<CommandResult>
⋮----
async reviewInvoice(invoiceId: string): Promise<CommandResult>
⋮----
async approveInvoice(invoiceId: string): Promise<CommandResult>
⋮----
async rejectInvoice(invoiceId: string): Promise<CommandResult>
⋮----
async payInvoice(invoiceId: string): Promise<CommandResult>
⋮----
async closeInvoice(invoiceId: string): Promise<CommandResult>
⋮----
// ── Read operations ──────────────────────────────────────────────────────────
⋮----
async listInvoices(query: InvoiceQueryDto, pagination?: PaginationDto): Promise<PagedResult<InvoiceSummary>>
⋮----
async getInvoiceSummary(invoiceId: string): Promise<InvoiceSummary | null>
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
⋮----
import type { IssueRepository } from "../domain/repositories/IssueRepository";
⋮----
import { OpenIssueUseCase } from "../application/use-cases/open-issue.use-case";
import { StartIssueUseCase } from "../application/use-cases/start-issue.use-case";
import { FixIssueUseCase } from "../application/use-cases/fix-issue.use-case";
import { SubmitIssueRetestUseCase } from "../application/use-cases/submit-issue-retest.use-case";
import { PassIssueRetestUseCase } from "../application/use-cases/pass-issue-retest.use-case";
import { FailIssueRetestUseCase } from "../application/use-cases/fail-issue-retest.use-case";
import { ResolveIssueUseCase } from "../application/use-cases/resolve-issue.use-case";
import { CloseIssueUseCase } from "../application/use-cases/close-issue.use-case";
⋮----
import type { OpenIssueDto } from "../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../application/dto/resolve-issue.dto";
import type { IssueQueryDto } from "../application/dto/issue-query.dto";
import type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";
⋮----
import type { IssueSummary } from "../interfaces/contracts/workspace-flow.contract";
import { toIssueSummary } from "../interfaces/contracts/workspace-flow.contract";
⋮----
import type { CommandResult } from "@shared-types";
⋮----
// ── Pagination helper ─────────────────────────────────────────────────────────
⋮----
function toPagedResult<T>(items: T[], pagination?: PaginationDto): PagedResult<T>
⋮----
/**
 * WorkspaceFlowIssueFacade
 *
 * Single entry point for all Issue write and summary-read operations.
 * Requires only IssueRepository — no cross-aggregate dependencies.
 */
export class WorkspaceFlowIssueFacade {
⋮----
constructor(private readonly issueRepository: IssueRepository)
⋮----
// ── Write operations ─────────────────────────────────────────────────────────
⋮----
async openIssue(dto: OpenIssueDto): Promise<CommandResult>
⋮----
async startIssue(issueId: string): Promise<CommandResult>
⋮----
async fixIssue(issueId: string): Promise<CommandResult>
⋮----
async submitIssueRetest(issueId: string): Promise<CommandResult>
⋮----
async passIssueRetest(issueId: string): Promise<CommandResult>
⋮----
async failIssueRetest(issueId: string): Promise<CommandResult>
⋮----
async resolveIssue(dto: ResolveIssueDto): Promise<CommandResult>
⋮----
async closeIssue(issueId: string): Promise<CommandResult>
⋮----
// ── Read operations ──────────────────────────────────────────────────────────
⋮----
async listIssues(query: IssueQueryDto, pagination?: PaginationDto): Promise<PagedResult<IssueSummary>>
⋮----
async getIssueSummary(issueId: string): Promise<IssueSummary | null>
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
⋮----
import type { TaskRepository } from "../domain/repositories/TaskRepository";
import type { IssueRepository } from "../domain/repositories/IssueRepository";
⋮----
import { CreateTaskUseCase } from "../application/use-cases/create-task.use-case";
import { UpdateTaskUseCase } from "../application/use-cases/update-task.use-case";
import { AssignTaskUseCase } from "../application/use-cases/assign-task.use-case";
import { SubmitTaskToQaUseCase } from "../application/use-cases/submit-task-to-qa.use-case";
import { PassTaskQaUseCase } from "../application/use-cases/pass-task-qa.use-case";
import { ApproveTaskAcceptanceUseCase } from "../application/use-cases/approve-task-acceptance.use-case";
import { ArchiveTaskUseCase } from "../application/use-cases/archive-task.use-case";
⋮----
import type { CreateTaskDto } from "../application/dto/create-task.dto";
import type { UpdateTaskDto } from "../application/dto/update-task.dto";
import type { TaskQueryDto } from "../application/dto/task-query.dto";
import type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";
⋮----
import type { TaskSummary } from "../interfaces/contracts/workspace-flow.contract";
import { toTaskSummary } from "../interfaces/contracts/workspace-flow.contract";
⋮----
import type { CommandResult } from "@shared-types";
⋮----
// ── Pagination helper ─────────────────────────────────────────────────────────
⋮----
function toPagedResult<T>(items: T[], pagination?: PaginationDto): PagedResult<T>
⋮----
/**
 * WorkspaceFlowTaskFacade
 *
 * Single entry point for all Task write and summary-read operations.
 * Requires both TaskRepository and IssueRepository because QA pass and
 * acceptance approval are cross-aggregate transitions that produce issues.
 */
export class WorkspaceFlowTaskFacade {
⋮----
constructor(
⋮----
// ── Write operations ─────────────────────────────────────────────────────────
⋮----
async createTask(dto: CreateTaskDto): Promise<CommandResult>
⋮----
async updateTask(taskId: string, dto: UpdateTaskDto): Promise<CommandResult>
⋮----
async assignTask(taskId: string, assigneeId: string): Promise<CommandResult>
⋮----
async submitTaskToQa(taskId: string): Promise<CommandResult>
⋮----
/** Cross-aggregate: transitions task to qa_passed and creates a linked issue. */
async passTaskQa(taskId: string): Promise<CommandResult>
⋮----
/** Cross-aggregate: transitions task to accepted and closes the linked issue. */
async approveTaskAcceptance(taskId: string): Promise<CommandResult>
⋮----
async archiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult>
⋮----
// ── Read operations ──────────────────────────────────────────────────────────
⋮----
async listTasks(query: TaskQueryDto, pagination?: PaginationDto): Promise<PagedResult<TaskSummary>>
⋮----
async getTaskSummary(taskId: string): Promise<TaskSummary | null>
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
⋮----
import type { TaskRepository } from "../domain/repositories/TaskRepository";
import type { IssueRepository } from "../domain/repositories/IssueRepository";
import type { InvoiceRepository } from "../domain/repositories/InvoiceRepository";
⋮----
import { WorkspaceFlowTaskFacade } from "./workspace-flow-task.facade";
import { WorkspaceFlowIssueFacade } from "./workspace-flow-issue.facade";
import { WorkspaceFlowInvoiceFacade } from "./workspace-flow-invoice.facade";
⋮----
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
⋮----
import type {
  TaskSummary,
  IssueSummary,
  InvoiceSummary,
} from "../interfaces/contracts/workspace-flow.contract";
⋮----
import type { CommandResult } from "@shared-types";
⋮----
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
⋮----
constructor(
    taskRepository: TaskRepository,
    issueRepository: IssueRepository,
    invoiceRepository: InvoiceRepository,
)
⋮----
// ── Task operations (delegated) ──────────────────────────────────────────────
⋮----
createTask(dto: CreateTaskDto): Promise<CommandResult>
updateTask(taskId: string, dto: UpdateTaskDto): Promise<CommandResult>
assignTask(taskId: string, assigneeId: string): Promise<CommandResult>
submitTaskToQa(taskId: string): Promise<CommandResult>
passTaskQa(taskId: string): Promise<CommandResult>
approveTaskAcceptance(taskId: string): Promise<CommandResult>
archiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult>
listTasks(query: TaskQueryDto, pagination?: PaginationDto): Promise<PagedResult<TaskSummary>>
getTaskSummary(taskId: string): Promise<TaskSummary | null>
⋮----
// ── Issue operations (delegated) ─────────────────────────────────────────────
⋮----
openIssue(dto: OpenIssueDto): Promise<CommandResult>
startIssue(issueId: string): Promise<CommandResult>
fixIssue(issueId: string): Promise<CommandResult>
submitIssueRetest(issueId: string): Promise<CommandResult>
passIssueRetest(issueId: string): Promise<CommandResult>
failIssueRetest(issueId: string): Promise<CommandResult>
resolveIssue(dto: ResolveIssueDto): Promise<CommandResult>
closeIssue(issueId: string): Promise<CommandResult>
listIssues(query: IssueQueryDto, pagination?: PaginationDto): Promise<PagedResult<IssueSummary>>
getIssueSummary(issueId: string): Promise<IssueSummary | null>
⋮----
// ── Invoice operations (delegated) ───────────────────────────────────────────
⋮----
createInvoice(workspaceId: string): Promise<CommandResult>
addInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult>
updateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult>
removeInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult>
submitInvoice(invoiceId: string): Promise<CommandResult>
reviewInvoice(invoiceId: string): Promise<CommandResult>
approveInvoice(invoiceId: string): Promise<CommandResult>
rejectInvoice(invoiceId: string): Promise<CommandResult>
payInvoice(invoiceId: string): Promise<CommandResult>
closeInvoice(invoiceId: string): Promise<CommandResult>
listInvoices(query: InvoiceQueryDto, pagination?: PaginationDto): Promise<PagedResult<InvoiceSummary>>
getInvoiceSummary(invoiceId: string): Promise<InvoiceSummary | null>
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
⋮----
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
⋮----
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
⋮----
export interface InvoiceQueryDto {
  /** Filter invoices by workspace. Required for scoped queries. */
  readonly workspaceId: string;
  /** Optional status filter. */
  readonly status?: string;
}
⋮----
/** Filter invoices by workspace. Required for scoped queries. */
⋮----
/** Optional status filter. */
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
⋮----
export interface IssueQueryDto {
  /** Filter issues by task. */
  readonly taskId: string;
  /** Optional status filter. */
  readonly status?: string;
}
⋮----
/** Filter issues by task. */
⋮----
/** Optional status filter. */
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
⋮----
import type { IssueStage } from "../../domain/value-objects/IssueStage";
⋮----
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
⋮----
export interface PaginationDto {
  /** 1-based page number. Defaults to 1. */
  readonly page?: number;
  /** Items per page. Defaults to 20. */
  readonly pageSize?: number;
}
⋮----
/** 1-based page number. Defaults to 1. */
⋮----
/** Items per page. Defaults to 20. */
⋮----
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
⋮----
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
⋮----
export interface ResolveIssueDto {
  readonly issueId: string;
  readonly resolutionNote?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/submit-task-materialization-batch-job.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file submit-task-materialization-batch-job.dto.ts
 * @description Command DTO for submitting a task materialization batch job.
 */
⋮----
export interface SubmitTaskMaterializationBatchJobDto {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId?: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
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
⋮----
export interface TaskQueryDto {
  /** Filter tasks by workspace. Required for scoped queries. */
  readonly workspaceId: string;
  /** Optional status filter. */
  readonly status?: string;
  /** Optional assignee filter. */
  readonly assigneeId?: string;
}
⋮----
/** Filter tasks by workspace. Required for scoped queries. */
⋮----
/** Optional status filter. */
⋮----
/** Optional assignee filter. */
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
⋮----
export interface UpdateInvoiceItemDto {
  /** Updated billing amount (must be > 0). */
  readonly amount: number;
}
⋮----
/** Updated billing amount (must be > 0). */
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
⋮----
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";
import type { AddInvoiceItemDto } from "../dto/add-invoice-item.dto";
⋮----
export class AddInvoiceItemUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
⋮----
async execute(dto: AddInvoiceItemDto): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
⋮----
export class ApproveInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
⋮----
async execute(invoiceId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { hasNoOpenIssues } from "../../domain/services/task-guards";
⋮----
export class ApproveTaskAcceptanceUseCase {
⋮----
constructor(
⋮----
async execute(taskId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { invoiceAllowsArchive } from "../../domain/services/task-guards";
⋮----
export class ArchiveTaskUseCase {
⋮----
constructor(private readonly taskRepository: TaskRepository)
⋮----
/**
   * @param taskId       - ID of the task to archive
   * @param invoiceStatus - Status of the linked invoice, or undefined if none
   */
async execute(taskId: string, invoiceStatus?: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
⋮----
export class AssignTaskUseCase {
⋮----
constructor(private readonly taskRepository: TaskRepository)
⋮----
async execute(taskId: string, assigneeId: string): Promise<CommandResult>
⋮----
// Persist the assignee before transitioning status
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
⋮----
export class CloseInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
⋮----
async execute(invoiceId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
⋮----
export class CloseIssueUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
⋮----
async execute(issueId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
⋮----
export class CreateInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
⋮----
async execute(workspaceId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { CreateTaskDto } from "../dto/create-task.dto";
⋮----
export class CreateTaskUseCase {
⋮----
constructor(private readonly taskRepository: TaskRepository)
⋮----
async execute(dto: CreateTaskDto): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
⋮----
export class FailIssueRetestUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
⋮----
async execute(issueId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
⋮----
export class FixIssueUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
⋮----
async execute(issueId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import type { OpenIssueDto } from "../dto/open-issue.dto";
⋮----
export class OpenIssueUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
⋮----
async execute(dto: OpenIssueDto): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
⋮----
export class PassIssueRetestUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
⋮----
async execute(issueId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { hasNoOpenIssues } from "../../domain/services/task-guards";
⋮----
export class PassTaskQaUseCase {
⋮----
constructor(
⋮----
async execute(taskId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
⋮----
export class PayInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
⋮----
async execute(invoiceId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
⋮----
export class RejectInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
⋮----
async execute(invoiceId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";
⋮----
export class RemoveInvoiceItemUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
⋮----
async execute(invoiceId: string, invoiceItemId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
import type { ResolveIssueDto } from "../dto/resolve-issue.dto";
⋮----
export class ResolveIssueUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
⋮----
async execute(dto: ResolveIssueDto): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
⋮----
export class ReviewInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
⋮----
async execute(invoiceId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
⋮----
export class StartIssueUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
⋮----
async execute(issueId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
import { invoiceHasItems } from "../../domain/services/invoice-guards";
⋮----
export class SubmitInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
⋮----
async execute(invoiceId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
⋮----
export class SubmitIssueRetestUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
⋮----
async execute(issueId: string): Promise<CommandResult>
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/submit-task-materialization-batch-job.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file submit-task-materialization-batch-job.use-case.ts
 * @description Submit a task materialization batch job in queued status.
 */
⋮----
import { v7 as generateId } from "@lib-uuid";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskMaterializationBatchJobRepository } from "../../domain/repositories/TaskMaterializationBatchJobRepository";
import type { SubmitTaskMaterializationBatchJobDto } from "../dto/submit-task-materialization-batch-job.dto";
⋮----
export class SubmitTaskMaterializationBatchJobUseCase {
⋮----
constructor(
⋮----
async execute(dto: SubmitTaskMaterializationBatchJobDto): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
⋮----
export class SubmitTaskToQaUseCase {
⋮----
constructor(private readonly taskRepository: TaskRepository)
⋮----
async execute(taskId: string): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";
import type { UpdateInvoiceItemDto } from "../dto/update-invoice-item.dto";
⋮----
export class UpdateInvoiceItemUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
⋮----
async execute(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult>
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
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { UpdateTaskDto } from "../dto/update-task.dto";
⋮----
export class UpdateTaskUseCase {
⋮----
constructor(private readonly taskRepository: TaskRepository)
⋮----
async execute(taskId: string, dto: UpdateTaskDto): Promise<CommandResult>
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
⋮----
// ── Entity ────────────────────────────────────────────────────────────────────
⋮----
export interface InvoiceItem {
  readonly id: string;
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
// ── Inputs ────────────────────────────────────────────────────────────────────
⋮----
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
⋮----
import type { IssueStatus } from "../value-objects/IssueStatus";
import type { IssueStage } from "../value-objects/IssueStage";
⋮----
// ── Aggregate ─────────────────────────────────────────────────────────────────
⋮----
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
⋮----
/** Which stage of the task workflow this issue was raised in. */
⋮----
// ── Inputs ────────────────────────────────────────────────────────────────────
⋮----
export interface OpenIssueInput {
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly title: string;
  readonly description?: string;
  readonly createdBy: string;
  readonly assignedTo?: string;
}
⋮----
export interface UpdateIssueInput {
  readonly title?: string;
  readonly description?: string;
  readonly assignedTo?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/entities/TaskMaterializationBatchJob.ts
````typescript
/**
 * @module workspace-flow/domain/entities
 * @file TaskMaterializationBatchJob.ts
 * @description Batch job aggregate for task materialization orchestration.
 */
⋮----
import type { TaskMaterializationBatchJobStatus } from "../value-objects/TaskMaterializationBatchJobStatus";
⋮----
export interface TaskMaterializationBatchJob {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
  readonly totalItems: number;
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
  readonly status: TaskMaterializationBatchJobStatus;
  readonly startedAtISO?: string;
  readonly completedAtISO?: string;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateTaskMaterializationBatchJobInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
}
⋮----
export interface CompleteTaskMaterializationBatchJobInput {
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
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
⋮----
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
⋮----
// ── Individual event shapes ───────────────────────────────────────────────────
⋮----
export interface InvoiceCreatedEvent {
  readonly type: "workspace-flow.invoice.created";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}
⋮----
export interface InvoiceItemAddedEvent {
  readonly type: "workspace-flow.invoice.item_added";
  readonly invoiceId: string;
  readonly invoiceItemId: string;
  readonly taskId: string;
  readonly amount: number;
  readonly occurredAtISO: string;
}
⋮----
export interface InvoiceItemRemovedEvent {
  readonly type: "workspace-flow.invoice.item_removed";
  readonly invoiceId: string;
  readonly invoiceItemId: string;
  readonly occurredAtISO: string;
}
⋮----
export interface InvoiceSubmittedEvent {
  readonly type: "workspace-flow.invoice.submitted";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly submittedAtISO: string;
  readonly occurredAtISO: string;
}
⋮----
export interface InvoiceReviewedEvent {
  readonly type: "workspace-flow.invoice.reviewed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}
⋮----
export interface InvoiceApprovedEvent {
  readonly type: "workspace-flow.invoice.approved";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly approvedAtISO: string;
  readonly occurredAtISO: string;
}
⋮----
export interface InvoiceRejectedEvent {
  readonly type: "workspace-flow.invoice.rejected";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}
⋮----
export interface InvoicePaidEvent {
  readonly type: "workspace-flow.invoice.paid";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly paidAtISO: string;
  readonly occurredAtISO: string;
}
⋮----
export interface InvoiceClosedEvent {
  readonly type: "workspace-flow.invoice.closed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly closedAtISO: string;
  readonly occurredAtISO: string;
}
⋮----
export interface InvoiceStatusChangedEvent {
  readonly type: "workspace-flow.invoice.status_changed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly from: InvoiceStatus;
  readonly to: InvoiceStatus;
  readonly occurredAtISO: string;
}
⋮----
// ── Discriminated union ───────────────────────────────────────────────────────
⋮----
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
⋮----
import type { IssueStatus } from "../value-objects/IssueStatus";
import type { IssueStage } from "../value-objects/IssueStage";
⋮----
// ── Individual event shapes ───────────────────────────────────────────────────
⋮----
export interface IssueOpenedEvent {
  readonly type: "workspace-flow.issue.opened";
  readonly issueId: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly createdBy: string;
  readonly occurredAtISO: string;
}
⋮----
export interface IssueStartedEvent {
  readonly type: "workspace-flow.issue.started";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}
⋮----
export interface IssueFixedEvent {
  readonly type: "workspace-flow.issue.fixed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}
⋮----
export interface IssueRetestSubmittedEvent {
  readonly type: "workspace-flow.issue.retest_submitted";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}
⋮----
export interface IssueRetestPassedEvent {
  readonly type: "workspace-flow.issue.retest_passed";
  readonly issueId: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly occurredAtISO: string;
}
⋮----
export interface IssueRetestFailedEvent {
  readonly type: "workspace-flow.issue.retest_failed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}
⋮----
export interface IssueClosedEvent {
  readonly type: "workspace-flow.issue.closed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}
⋮----
export interface IssueStatusChangedEvent {
  readonly type: "workspace-flow.issue.status_changed";
  readonly issueId: string;
  readonly taskId: string;
  readonly from: IssueStatus;
  readonly to: IssueStatus;
  readonly occurredAtISO: string;
}
⋮----
// ── Discriminated union ───────────────────────────────────────────────────────
⋮----
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
⋮----
import type { TaskStatus } from "../value-objects/TaskStatus";
⋮----
// ── Individual event shapes ───────────────────────────────────────────────────
⋮----
export interface TaskCreatedEvent {
  readonly type: "workspace-flow.task.created";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly occurredAtISO: string;
}
⋮----
export interface TaskAssignedEvent {
  readonly type: "workspace-flow.task.assigned";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly assigneeId: string;
  readonly occurredAtISO: string;
}
⋮----
export interface TaskSubmittedToQaEvent {
  readonly type: "workspace-flow.task.submitted_to_qa";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}
⋮----
export interface TaskQaPassedEvent {
  readonly type: "workspace-flow.task.qa_passed";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}
⋮----
export interface TaskAcceptanceApprovedEvent {
  readonly type: "workspace-flow.task.acceptance_approved";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly acceptedAtISO: string;
  readonly occurredAtISO: string;
}
⋮----
export interface TaskArchivedEvent {
  readonly type: "workspace-flow.task.archived";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly archivedAtISO: string;
  readonly occurredAtISO: string;
}
⋮----
export interface TaskStatusChangedEvent {
  readonly type: "workspace-flow.task.status_changed";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly from: TaskStatus;
  readonly to: TaskStatus;
  readonly occurredAtISO: string;
}
⋮----
// ── Discriminated union ───────────────────────────────────────────────────────
⋮----
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
⋮----
import type { Invoice, CreateInvoiceInput } from "../entities/Invoice";
import type { InvoiceItem, AddInvoiceItemInput } from "../entities/InvoiceItem";
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
⋮----
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
⋮----
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
⋮----
import type { Issue, OpenIssueInput, UpdateIssueInput } from "../entities/Issue";
import type { IssueStatus } from "../value-objects/IssueStatus";
⋮----
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
⋮----
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
````

## File: modules/workspace/subdomains/workspace-workflow/domain/repositories/TaskMaterializationBatchJobRepository.ts
````typescript
/**
 * @module workspace-flow/domain/repositories
 * @file TaskMaterializationBatchJobRepository.ts
 * @description Repository port for task materialization batch jobs.
 */
⋮----
import type {
  CompleteTaskMaterializationBatchJobInput,
  CreateTaskMaterializationBatchJobInput,
  TaskMaterializationBatchJob,
} from "../entities/TaskMaterializationBatchJob";
⋮----
export interface TaskMaterializationBatchJobRepository {
  create(input: CreateTaskMaterializationBatchJobInput): Promise<TaskMaterializationBatchJob>;
  findById(jobId: string): Promise<TaskMaterializationBatchJob | null>;
  findByWorkspaceId(workspaceId: string): Promise<TaskMaterializationBatchJob[]>;
  markRunning(jobId: string): Promise<TaskMaterializationBatchJob | null>;
  markCompleted(
    jobId: string,
    input: CompleteTaskMaterializationBatchJobInput,
  ): Promise<TaskMaterializationBatchJob | null>;
  markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskMaterializationBatchJob | null>;
}
⋮----
create(input: CreateTaskMaterializationBatchJobInput): Promise<TaskMaterializationBatchJob>;
findById(jobId: string): Promise<TaskMaterializationBatchJob | null>;
findByWorkspaceId(workspaceId: string): Promise<TaskMaterializationBatchJob[]>;
markRunning(jobId: string): Promise<TaskMaterializationBatchJob | null>;
markCompleted(
    jobId: string,
    input: CompleteTaskMaterializationBatchJobInput,
  ): Promise<TaskMaterializationBatchJob | null>;
markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskMaterializationBatchJob | null>;
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
⋮----
import type { Task, CreateTaskInput, UpdateTaskInput } from "../entities/Task";
import type { TaskStatus } from "../value-objects/TaskStatus";
⋮----
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
⋮----
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
⋮----
// ── Guard: item count > 0 before submit ───────────────────────────────────────
⋮----
/**
 * Asserts that an invoice has at least one item before allowing submission.
 *
 * @param itemCount - Number of items currently on the invoice
 * @returns true if the invoice may be submitted; false if it has no items
 */
export function invoiceHasItems(itemCount: number): boolean
⋮----
// ── Guard: invoice is in draft before item mutation ───────────────────────────
⋮----
/**
 * Asserts that an invoice is in draft status before allowing item add/remove.
 *
 * @param status - Current invoice status
 * @returns true if items may be mutated; false otherwise
 */
export function invoiceIsEditable(status: string): boolean
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
⋮----
import { canTransitionInvoiceStatus, type InvoiceStatus } from "../value-objects/InvoiceStatus";
⋮----
export type InvoiceTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };
⋮----
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
): InvoiceTransitionResult
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
⋮----
import { canTransitionIssueStatus, type IssueStatus } from "../value-objects/IssueStatus";
⋮----
export type IssueTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };
⋮----
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
): IssueTransitionResult
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
⋮----
// ── Guard: no open issues ─────────────────────────────────────────────────────
⋮----
/**
 * Asserts that a task has no open issues before allowing QA-pass or acceptance-approve.
 *
 * @param openIssueCount - The number of open issues currently linked to the task
 * @returns true if the task may proceed; false if blocked by open issues
 */
export function hasNoOpenIssues(openIssueCount: number): boolean
⋮----
// ── Guard: invoice closed or none ─────────────────────────────────────────────
⋮----
/**
 * Asserts that any linked invoice is closed (or none exists) before allowing archive.
 *
 * @param invoiceStatus - The status of the linked invoice, or undefined if none
 * @returns true if the task may be archived; false if blocked by an active invoice
 */
export function invoiceAllowsArchive(
  invoiceStatus: string | undefined,
): boolean
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
⋮----
import { canTransitionTaskStatus, type TaskStatus } from "../value-objects/TaskStatus";
⋮----
export type TaskTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };
⋮----
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
): TaskTransitionResult
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
⋮----
/** Branded string that prevents mixing Invoice IDs with other string IDs. */
export type InvoiceId = string & { readonly [InvoiceIdBrand]: void };
⋮----
/** Creates an InvoiceId from a plain string (e.g. a Firestore document ID). */
export function invoiceId(raw: string): InvoiceId
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
⋮----
/** Branded string that prevents mixing InvoiceItem IDs with other string IDs. */
export type InvoiceItemId = string & { readonly [InvoiceItemIdBrand]: void };
⋮----
/** Creates an InvoiceItemId from a plain string (e.g. a Firestore document ID). */
export function invoiceItemId(raw: string): InvoiceItemId
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
⋮----
// ── Status ─────────────────────────────────────────────────────────────────────
⋮----
export type InvoiceStatus =
  | "draft"
  | "submitted"
  | "finance_review"
  | "approved"
  | "paid"
  | "closed";
⋮----
// ── Transition table ──────────────────────────────────────────────────────────
⋮----
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
⋮----
/** Returns true if moving from `from` to `to` is a valid transition. */
export function canTransitionInvoiceStatus(from: InvoiceStatus, to: InvoiceStatus): boolean
⋮----
/** Returns true when the invoice has reached a terminal state and cannot progress. */
export function isTerminalInvoiceStatus(status: InvoiceStatus): boolean
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
⋮----
/** Branded string that prevents mixing Issue IDs with other string IDs. */
export type IssueId = string & { readonly [IssueIdBrand]: void };
⋮----
/** Creates an IssueId from a plain string (e.g. a Firestore document ID). */
export function issueId(raw: string): IssueId
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
⋮----
// ── IssueStage ─────────────────────────────────────────────────────────────────
⋮----
/**
 * Indicates which stage of the task workflow this issue was raised in.
 * Used to route issue resolution back to the originating workflow step.
 */
export type IssueStage = "task" | "qa" | "acceptance";
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
⋮----
// ── Status ─────────────────────────────────────────────────────────────────────
⋮----
export type IssueStatus =
  | "open"
  | "investigating"
  | "fixing"
  | "retest"
  | "resolved"
  | "closed";
⋮----
// ── Transition table ──────────────────────────────────────────────────────────
⋮----
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
⋮----
/** Returns true if moving from `from` to `to` is a valid transition. */
export function canTransitionIssueStatus(from: IssueStatus, to: IssueStatus): boolean
⋮----
/** Returns true when the issue has reached a terminal state and cannot progress. */
export function isTerminalIssueStatus(status: IssueStatus): boolean
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
⋮----
/** Branded string that prevents mixing Task IDs with other string IDs. */
export type TaskId = string & { readonly [TaskIdBrand]: void };
⋮----
/** Creates a TaskId from a plain string (e.g. a Firestore document ID). */
export function taskId(raw: string): TaskId
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/TaskMaterializationBatchJobStatus.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file TaskMaterializationBatchJobStatus.ts
 * @description Lifecycle statuses for task materialization batch jobs.
 */
⋮----
export type TaskMaterializationBatchJobStatus =
  (typeof TASK_MATERIALIZATION_BATCH_JOB_STATUSES)[number];
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
⋮----
// ── Status ─────────────────────────────────────────────────────────────────────
⋮----
export type TaskStatus =
  | "draft"
  | "in_progress"
  | "qa"
  | "acceptance"
  | "accepted"
  | "archived";
⋮----
/** Ordered tuple used by Zod schemas (z.enum needs a const tuple). */
⋮----
// ── Transition table ──────────────────────────────────────────────────────────
⋮----
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
⋮----
/** Returns true if moving from `from` to `to` is a valid forward transition. */
export function canTransitionTaskStatus(from: TaskStatus, to: TaskStatus): boolean
⋮----
/** Returns the next status in the main flow, or null if already terminal. */
export function nextTaskStatus(current: TaskStatus): TaskStatus | null
⋮----
/** Returns true when the task has reached a terminal state and cannot progress. */
export function isTerminalTaskStatus(status: TaskStatus): boolean
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
⋮----
/** Branded string that prevents mixing User IDs with other string IDs. */
export type UserId = string & { readonly [UserIdBrand]: void };
⋮----
/** Creates a UserId from a plain string (e.g. a Firebase Auth UID). */
export function userId(raw: string): UserId
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
⋮----
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
⋮----
/**
 * Converts a raw Firestore document data map into a typed InvoiceItem entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toInvoiceItem(id: string, data: Record<string, unknown>): InvoiceItem
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
⋮----
import type { Invoice } from "../../domain/entities/Invoice";
import { INVOICE_STATUSES, type InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import { toSourceReference } from "./sourceReference.converter";
⋮----
/**
 * Converts a raw Firestore document data map into a typed Invoice entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toInvoice(id: string, data: Record<string, unknown>): Invoice
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
⋮----
import type { Issue } from "../../domain/entities/Issue";
import { ISSUE_STATUSES, type IssueStatus } from "../../domain/value-objects/IssueStatus";
import { ISSUE_STAGES, type IssueStage } from "../../domain/value-objects/IssueStage";
⋮----
/**
 * Converts a raw Firestore document data map into a typed Issue entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toIssue(id: string, data: Record<string, unknown>): Issue
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/firebase/sourceReference.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file sourceReference.converter.ts
 * @description Firestore document-to-value-object converter for SourceReference.
 * Shared by task.converter.ts and invoice.converter.ts.
 */
⋮----
import type { SourceReference } from "../../domain/value-objects/SourceReference";
⋮----
/**
 * Convert a raw Firestore field value to a typed SourceReference value object.
 * Returns `undefined` if the value is absent or does not conform to the expected shape.
 */
export function toSourceReference(raw: unknown): SourceReference | undefined
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/firebase/task-materialization-batch-job.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file task-materialization-batch-job.converter.ts
 * @description Firestore document-to-entity converter for task materialization batch jobs.
 */
⋮----
import type { TaskMaterializationBatchJob } from "../../domain/entities/TaskMaterializationBatchJob";
import {
  TASK_MATERIALIZATION_BATCH_JOB_STATUSES,
  type TaskMaterializationBatchJobStatus,
} from "../../domain/value-objects/TaskMaterializationBatchJobStatus";
⋮----
export function toTaskMaterializationBatchJob(
  id: string,
  raw: Record<string, unknown>,
): TaskMaterializationBatchJob
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
⋮----
import type { Task } from "../../domain/entities/Task";
import { TASK_STATUSES, type TaskStatus } from "../../domain/value-objects/TaskStatus";
import { toSourceReference } from "./sourceReference.converter";
⋮----
/**
 * Converts a raw Firestore document data map into a typed Task entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toTask(id: string, data: Record<string, unknown>): Task
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
⋮----
/** Top-level Firestore collection for workspace-flow tasks. */
⋮----
/** Top-level Firestore collection for workspace-flow issues. */
⋮----
/** Top-level Firestore collection for workspace-flow invoices. */
⋮----
/** Top-level Firestore collection for workspace-flow invoice items. */
⋮----
/** Top-level Firestore collection for task materialization batch jobs. */
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/_actions/workspace-flow-invoice.actions.ts
````typescript
/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow-invoice.actions.ts
 * @description Server Actions for workspace-flow Invoice write operations.
 * Delegates exclusively to WorkspaceFlowFacade.
 */
⋮----
import { commandFailureFrom, type CommandResult } from "@shared-types";
import { WorkspaceFlowInvoiceFacade } from "../../api/workspace-flow-invoice.facade";
import { makeInvoiceRepo } from "../../api/factories";
import type { AddInvoiceItemDto } from "../../application/dto/add-invoice-item.dto";
import type { UpdateInvoiceItemDto } from "../../application/dto/update-invoice-item.dto";
import type { RemoveInvoiceItemDto } from "../../application/dto/remove-invoice-item.dto";
⋮----
function makeFacade(): WorkspaceFlowInvoiceFacade
⋮----
export async function wfCreateInvoice(workspaceId: string): Promise<CommandResult>
⋮----
export async function wfAddInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult>
⋮----
export async function wfUpdateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult>
⋮----
export async function wfRemoveInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult>
⋮----
export async function wfSubmitInvoice(invoiceId: string): Promise<CommandResult>
⋮----
export async function wfReviewInvoice(invoiceId: string): Promise<CommandResult>
⋮----
export async function wfApproveInvoice(invoiceId: string): Promise<CommandResult>
⋮----
export async function wfRejectInvoice(invoiceId: string): Promise<CommandResult>
⋮----
export async function wfPayInvoice(invoiceId: string): Promise<CommandResult>
⋮----
export async function wfCloseInvoice(invoiceId: string): Promise<CommandResult>
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/_actions/workspace-flow-issue.actions.ts
````typescript
/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow-issue.actions.ts
 * @description Server Actions for workspace-flow Issue write operations.
 * Delegates exclusively to WorkspaceFlowFacade.
 */
⋮----
import { commandFailureFrom, type CommandResult } from "@shared-types";
import { WorkspaceFlowIssueFacade } from "../../api/workspace-flow-issue.facade";
import { makeIssueRepo } from "../../api/factories";
import type { OpenIssueDto } from "../../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../../application/dto/resolve-issue.dto";
⋮----
function makeFacade(): WorkspaceFlowIssueFacade
⋮----
export async function wfOpenIssue(dto: OpenIssueDto): Promise<CommandResult>
⋮----
export async function wfStartIssue(issueId: string): Promise<CommandResult>
⋮----
export async function wfFixIssue(issueId: string): Promise<CommandResult>
⋮----
export async function wfSubmitIssueRetest(issueId: string): Promise<CommandResult>
⋮----
export async function wfPassIssueRetest(issueId: string): Promise<CommandResult>
⋮----
export async function wfFailIssueRetest(issueId: string): Promise<CommandResult>
⋮----
export async function wfResolveIssue(dto: ResolveIssueDto): Promise<CommandResult>
⋮----
export async function wfCloseIssue(issueId: string): Promise<CommandResult>
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/_actions/workspace-flow-task.actions.ts
````typescript
/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow-task.actions.ts
 * @description Server Actions for workspace-flow Task write operations.
 * Delegates exclusively to WorkspaceFlowFacade.
 */
⋮----
import { commandFailureFrom, type CommandResult } from "@shared-types";
import { WorkspaceFlowTaskFacade } from "../../api/workspace-flow-task.facade";
import { makeIssueRepo, makeTaskRepo } from "../../api/factories";
import type { CreateTaskDto } from "../../application/dto/create-task.dto";
import type { UpdateTaskDto } from "../../application/dto/update-task.dto";
⋮----
function makeFacade(): WorkspaceFlowTaskFacade
⋮----
export async function wfCreateTask(dto: CreateTaskDto): Promise<CommandResult>
⋮----
export async function wfUpdateTask(taskId: string, dto: UpdateTaskDto): Promise<CommandResult>
⋮----
export async function wfAssignTask(taskId: string, assigneeId: string): Promise<CommandResult>
⋮----
export async function wfSubmitTaskToQa(taskId: string): Promise<CommandResult>
⋮----
export async function wfPassTaskQa(taskId: string): Promise<CommandResult>
⋮----
export async function wfApproveTaskAcceptance(taskId: string): Promise<CommandResult>
⋮----
export async function wfArchiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult>
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
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/AssignTaskDialog.tsx
````typescript
import { useState } from "react";
⋮----
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
⋮----
import { wfAssignTask } from "../_actions/workspace-flow.actions";
⋮----
export interface AssignTaskDialogProps {
  open: boolean;
  taskId: string;
  onClose: () => void;
  onDone: () => void;
}
⋮----
function handleClose()
⋮----
async function handleSubmit(e: React.FormEvent)
⋮----
onChange=
⋮----
// eslint-disable-next-line jsx-a11y/no-autofocus
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/CreateTaskDialog.tsx
````typescript
import { useState } from "react";
⋮----
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
⋮----
import { wfCreateTask } from "../_actions/workspace-flow.actions";
⋮----
export interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  workspaceId: string;
}
⋮----
function handleClose()
⋮----
async function handleSubmit(e: React.FormEvent)
⋮----
onChange=
⋮----
// eslint-disable-next-line jsx-a11y/no-autofocus
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/InvoiceRow.tsx
````typescript
import { useState } from "react";
⋮----
import type { CommandResult } from "@shared-types";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
⋮----
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
⋮----
function formatShortDate(iso: string | undefined): string
⋮----
function formatCurrency(amount: number): string
⋮----
export interface InvoiceRowProps {
  invoice: Invoice;
  onTransitioned: () => void;
}
⋮----
export function InvoiceRow(
⋮----
async function runAction(action: () => Promise<CommandResult>)
⋮----
return <Button size="sm" variant="outline" disabled=
⋮----
<Button size="sm" variant="outline" disabled=
⋮----
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/IssueRow.tsx
````typescript
import { useState } from "react";
⋮----
import type { CommandResult } from "@shared-types";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
⋮----
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
⋮----
export interface IssueRowProps {
  issue: Issue;
  onTransitioned: () => void;
}
⋮----
export function IssueRow(
⋮----
async function runAction(action: () => Promise<CommandResult>)
⋮----
return <Button size="sm" variant="outline" disabled=
⋮----
<Button size="sm" variant="outline" disabled=
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/OpenIssueDialog.tsx
````typescript
import { useState } from "react";
⋮----
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
⋮----
import type { IssueStage } from "../../application/dto/workflow.dto";
import { wfOpenIssue } from "../_actions/workspace-flow.actions";
import { ISSUE_STAGE_LABEL } from "./IssueRow";
⋮----
export interface OpenIssueDialogProps {
  open: boolean;
  taskId: string;
  currentUserId: string;
  onClose: () => void;
  onCreated: () => void;
}
⋮----
function handleClose()
⋮----
async function handleSubmit(e: React.FormEvent)
⋮----
onChange=
⋮----
// eslint-disable-next-line jsx-a11y/no-autofocus
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/WorkspaceFlowTab.tsx
````typescript
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
⋮----
import { useCallback, useEffect, useMemo, useState } from "react";
⋮----
import { Plus } from "lucide-react";
⋮----
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Separator } from "@ui-shadcn/ui/separator";
⋮----
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
⋮----
// ── Types ──────────────────────────────────────────────────────────────────────
⋮----
type FlowSection = "tasks" | "qa" | "acceptance" | "issues" | "invoices";
⋮----
interface WorkspaceFlowTabProps {
  readonly workspaceId: string;
  readonly currentUserId?: string;
  readonly initialSection?: FlowSection;
}
⋮----
// ── Main Component ─────────────────────────────────────────────────────────────
⋮----
async function handleCreateInvoice()
⋮----
{/* ── Section switcher ─────────────────────────────────────────── */}
⋮----
{/* ── Loading state ─────────────────────────────────────────────── */}
⋮----
{/* ── Error state ───────────────────────────────────────────────── */}
⋮----
{/* ── Tasks section ─────────────────────────────────────────────── */}
⋮----
{/* ── QA section ────────────────────────────────────────────────── */}
⋮----
{/* ── Acceptance section ────────────────────────────────────────── */}
⋮----
{/* ── Issues section ────────────────────────────────────────────── */}
⋮----
{/* ── Invoices section ──────────────────────────────────────────── */}
⋮----
{/* ── Create Task Dialog ─────────────────────────────────────────── */}
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
⋮----
import type { Task } from "../../application/dto/workflow.dto";
import type { Issue } from "../../application/dto/workflow.dto";
import type { Invoice } from "../../application/dto/workflow.dto";
import type { InvoiceItem } from "../../application/dto/workflow.dto";
import type { TaskMaterializationBatchJob } from "../../application/dto/workflow.dto";
⋮----
// ── Summary read models (lean projections for UI) ─────────────────────────────
⋮----
export interface TaskSummary {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly status: Task["status"];
  readonly assigneeId?: string;
}
⋮----
export interface IssueSummary {
  readonly id: string;
  readonly taskId: string;
  readonly title: string;
  readonly status: Issue["status"];
  readonly stage: Issue["stage"];
}
⋮----
export interface InvoiceSummary {
  readonly id: string;
  readonly workspaceId: string;
  readonly status: Invoice["status"];
  readonly totalAmount: number;
}
⋮----
export interface InvoiceItemSummary {
  readonly id: string;
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: InvoiceItem["amount"];
}
⋮----
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
⋮----
// ── Projection helpers ────────────────────────────────────────────────────────
⋮----
export function toTaskSummary(task: Task): TaskSummary
⋮----
export function toIssueSummary(issue: Issue): IssueSummary
⋮----
export function toInvoiceSummary(invoice: Invoice): InvoiceSummary
⋮----
export function toInvoiceItemSummary(item: InvoiceItem): InvoiceItemSummary
⋮----
export function toTaskMaterializationBatchJobSummary(
  job: TaskMaterializationBatchJob,
): TaskMaterializationBatchJobSummary
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
⋮----
import type { Task } from "../../application/dto/workflow.dto";
import type { Issue } from "../../application/dto/workflow.dto";
import type { Invoice } from "../../application/dto/workflow.dto";
import type { InvoiceItem } from "../../application/dto/workflow.dto";
import type { TaskMaterializationBatchJob } from "../../application/dto/workflow.dto";
import {
  makeInvoiceRepo,
  makeIssueRepo,
  makeTaskMaterializationBatchJobRepo,
  makeTaskRepo,
} from "../../api/factories";
⋮----
/**
 * List all tasks for a workspace.
 *
 * @param workspaceId - The workspace to query
 */
export async function getWorkspaceFlowTasks(workspaceId: string): Promise<Task[]>
⋮----
/**
 * Get a single task by id.
 *
 * @param taskId - The task identifier
 */
export async function getWorkspaceFlowTask(taskId: string): Promise<Task | null>
⋮----
/**
 * List all issues for a task.
 *
 * @param taskId - The task identifier
 */
export async function getWorkspaceFlowIssues(taskId: string): Promise<Issue[]>
⋮----
/**
 * List all invoices for a workspace.
 *
 * @param workspaceId - The workspace to query
 */
export async function getWorkspaceFlowInvoices(workspaceId: string): Promise<Invoice[]>
⋮----
/**
 * Get items for an invoice.
 *
 * @param invoiceId - The invoice identifier
 */
export async function getWorkspaceFlowInvoiceItems(invoiceId: string): Promise<InvoiceItem[]>
⋮----
/**
 * List task materialization batch jobs for a workspace.
 */
export async function getWorkspaceFlowTaskMaterializationBatchJobs(
  workspaceId: string,
): Promise<TaskMaterializationBatchJob[]>
⋮----
/**
 * Get a single task materialization batch job by id.
 */
export async function getWorkspaceFlowTaskMaterializationBatchJob(
  jobId: string,
): Promise<TaskMaterializationBatchJob | null>
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
⋮----
// ── Facade (write + summary-read surface) ────────────────────────────────────
⋮----
// Composite facade (all three aggregates)
⋮----
// Focused facades (prefer these when only one aggregate is needed)
⋮----
// ── Public contracts ──────────────────────────────────────────────────────────
⋮----
// Entities
⋮----
// Value objects
⋮----
// Summary projections
⋮----
// CRUD / command DTOs
⋮----
// Query / pagination DTOs
⋮----
// Command result
⋮----
// Value object lists (enum arrays)
⋮----
// Summary projection helpers
⋮----
// ── Read queries (server-side) ────────────────────────────────────────────────
⋮----
// ── Public write-side commands for knowledge → task flow ────────────────────
⋮----
// ── UI components ─────────────────────────────────────────────────────────────
⋮----
// ── Event listeners (knowledge → workspace-flow integration) ─────────────────
````

## File: modules/workspace/subdomains/workspace-workflow/api/workspace-flow-task-batch-job.facade.ts
````typescript
/**
 * @module workspace-flow/api
 * @file workspace-flow-task-batch-job.facade.ts
 * @description Focused facade for task materialization batch jobs.
 */
⋮----
import type { CommandResult } from "@shared-types";
import type {
  ExtractTaskCandidatesFromKnowledgeDto,
  ExtractTaskCandidatesFromKnowledgeResult,
} from "../application/dto/extract-task-candidates-from-knowledge.dto";
import type { SubmitTaskMaterializationBatchJobDto } from "../application/dto/submit-task-materialization-batch-job.dto";
import type { TaskCandidateExtractionAiPort } from "../domain/ports/TaskCandidateExtractionAiPort";
import { ExtractTaskCandidatesFromKnowledgeUseCase } from "../application/use-cases/extract-task-candidates-from-knowledge.use-case";
import { SubmitTaskMaterializationBatchJobUseCase } from "../application/use-cases/submit-task-materialization-batch-job.use-case";
import type { TaskMaterializationBatchJob } from "../domain/entities/TaskMaterializationBatchJob";
import type { TaskMaterializationBatchJobRepository } from "../domain/repositories/TaskMaterializationBatchJobRepository";
⋮----
export class WorkspaceFlowTaskBatchJobFacade {
⋮----
constructor(
⋮----
async submitBatchJob(dto: SubmitTaskMaterializationBatchJobDto): Promise<CommandResult>
⋮----
async getBatchJob(jobId: string): Promise<TaskMaterializationBatchJob | null>
⋮----
async listBatchJobs(workspaceId: string): Promise<TaskMaterializationBatchJob[]>
⋮----
async extractTaskCandidates(
    dto: ExtractTaskCandidatesFromKnowledgeDto,
): Promise<ExtractTaskCandidatesFromKnowledgeResult>
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/extract-task-candidates-from-knowledge.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file extract-task-candidates-from-knowledge.dto.ts
 * @description Application-layer DTOs for the ExtractTaskCandidatesFromKnowledge use case.
 *
 * Pure value types (KnowledgeTextBlockInput, ExtractedTaskCandidate, TaskCandidateSource)
 * now live in domain/value-objects/TaskCandidate.ts. They are re-exported here so existing
 * application-layer import paths continue to resolve.
 *
 * @see ADR-5201 Accidental Complexity — workspace-workflow application structure
 */
⋮----
import type {
  KnowledgeTextBlockInput,
  ExtractedTaskCandidate,
} from "../../domain/value-objects/TaskCandidate";
⋮----
export interface ExtractTaskCandidatesFromKnowledgeDto {
  readonly knowledgePageId: string;
  readonly blocks: ReadonlyArray<KnowledgeTextBlockInput>;
  readonly enableAiFallback?: boolean;
}
⋮----
export interface ExtractTaskCandidatesFromKnowledgeResult {
  readonly candidates: ReadonlyArray<ExtractedTaskCandidate>;
  readonly usedAiFallback: boolean;
}
````

## File: modules/workspace/subdomains/workspace-workflow/application/dto/materialize-from-knowledge.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file materialize-from-knowledge.dto.ts
 * @description Command DTO for materializing Tasks and Invoices from a
 * `notion.knowledge.page-approved` event payload.
 *
 * This DTO is used by both:
 *  - MaterializeTasksFromKnowledgeUseCase
 *  - KnowledgeToWorkflowMaterializer (Process Manager)
 */
⋮----
import type { SourceReference } from "../../domain/value-objects/SourceReference";
⋮----
export interface ExtractedTaskItem {
  readonly title: string;
  readonly dueDate?: string;
  readonly description?: string;
}
⋮----
export interface ExtractedInvoiceItem {
  readonly amount: number;
  readonly description: string;
  readonly currency?: string;
}
⋮----
export interface MaterializeFromKnowledgeDto {
  readonly workspaceId: string;
  /** ID of the KnowledgePage that was approved (same as sourceReference.id). */
  readonly knowledgePageId: string;
  /** Pre-built SourceReference value object to attach to every created entity. */
  readonly sourceReference: SourceReference;
  readonly extractedTasks: ReadonlyArray<ExtractedTaskItem>;
  readonly extractedInvoices: ReadonlyArray<ExtractedInvoiceItem>;
}
⋮----
/** ID of the KnowledgePage that was approved (same as sourceReference.id). */
⋮----
/** Pre-built SourceReference value object to attach to every created entity. */
````

## File: modules/workspace/subdomains/workspace-workflow/application/ports/InvoiceService.ts
````typescript
/**
 * @module workspace-flow/application/ports
 * @file InvoiceService.ts
 * @description Application-layer port interface for Invoice operations.
 *
 * @applicationPort This is an Application-layer Port (not a Domain-layer Port) because
 * its method signatures depend on application DTOs (AddInvoiceItemDto, InvoiceQueryDto)
 * defined in application/dto/. It must remain in application/ports/ and must NOT be
 * moved to domain/ports/. See ADR-1102 §3.
 *
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */
⋮----
import type { Invoice } from "../../domain/entities/Invoice";
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
import type { InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import type { AddInvoiceItemDto } from "../dto/add-invoice-item.dto";
import type { InvoiceQueryDto } from "../dto/invoice-query.dto";
⋮----
export interface InvoiceService {
  createInvoice(workspaceId: string): Promise<Invoice>;
  addItem(dto: AddInvoiceItemDto): Promise<InvoiceItem>;
  removeItem(invoiceItemId: string): Promise<void>;
  transitionStatus(invoiceId: string, to: InvoiceStatus): Promise<Invoice>;
  listInvoices(query: InvoiceQueryDto): Promise<Invoice[]>;
  getInvoice(invoiceId: string): Promise<Invoice | null>;
}
⋮----
createInvoice(workspaceId: string): Promise<Invoice>;
addItem(dto: AddInvoiceItemDto): Promise<InvoiceItem>;
removeItem(invoiceItemId: string): Promise<void>;
transitionStatus(invoiceId: string, to: InvoiceStatus): Promise<Invoice>;
listInvoices(query: InvoiceQueryDto): Promise<Invoice[]>;
getInvoice(invoiceId: string): Promise<Invoice | null>;
````

## File: modules/workspace/subdomains/workspace-workflow/application/ports/IssueService.ts
````typescript
/**
 * @module workspace-flow/application/ports
 * @file IssueService.ts
 * @description Application-layer port interface for Issue operations.
 *
 * @applicationPort This is an Application-layer Port (not a Domain-layer Port) because
 * its method signatures depend on application DTOs (OpenIssueDto, IssueQueryDto) defined
 * in application/dto/. It must remain in application/ports/ and must NOT be moved to
 * domain/ports/. See ADR-1102 §3.
 *
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */
⋮----
import type { Issue } from "../../domain/entities/Issue";
import type { IssueStatus } from "../../domain/value-objects/IssueStatus";
import type { OpenIssueDto } from "../dto/open-issue.dto";
import type { IssueQueryDto } from "../dto/issue-query.dto";
⋮----
export interface IssueService {
  openIssue(dto: OpenIssueDto): Promise<Issue>;
  transitionStatus(issueId: string, to: IssueStatus): Promise<Issue>;
  listIssues(query: IssueQueryDto): Promise<Issue[]>;
  getIssue(issueId: string): Promise<Issue | null>;
}
⋮----
openIssue(dto: OpenIssueDto): Promise<Issue>;
transitionStatus(issueId: string, to: IssueStatus): Promise<Issue>;
listIssues(query: IssueQueryDto): Promise<Issue[]>;
getIssue(issueId: string): Promise<Issue | null>;
````

## File: modules/workspace/subdomains/workspace-workflow/application/ports/TaskService.ts
````typescript
/**
 * @module workspace-flow/application/ports
 * @file TaskService.ts
 * @description Application-layer port interface for Task operations.
 *
 * @applicationPort This is an Application-layer Port (not a Domain-layer Port) because
 * its method signatures depend on application DTOs (CreateTaskDto, TaskQueryDto) defined
 * in application/dto/. It must remain in application/ports/ and must NOT be moved to
 * domain/ports/. See ADR-1102 §3.
 *
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */
⋮----
import type { Task } from "../../domain/entities/Task";
import type { TaskStatus } from "../../domain/value-objects/TaskStatus";
import type { CreateTaskDto } from "../dto/create-task.dto";
import type { TaskQueryDto } from "../dto/task-query.dto";
⋮----
export interface TaskService {
  createTask(dto: CreateTaskDto): Promise<Task>;
  assignTask(taskId: string, assigneeId: string): Promise<Task>;
  transitionStatus(taskId: string, to: TaskStatus): Promise<Task>;
  listTasks(query: TaskQueryDto): Promise<Task[]>;
  getTask(taskId: string): Promise<Task | null>;
}
⋮----
createTask(dto: CreateTaskDto): Promise<Task>;
assignTask(taskId: string, assigneeId: string): Promise<Task>;
transitionStatus(taskId: string, to: TaskStatus): Promise<Task>;
listTasks(query: TaskQueryDto): Promise<Task[]>;
getTask(taskId: string): Promise<Task | null>;
````

## File: modules/workspace/subdomains/workspace-workflow/application/process-managers/README.md
````markdown
# workspace-workflow / application / process-managers

## Purpose

This directory contains **process managers** — long-lived, event-driven
application services that coordinate cross-module integration flows across
multiple use-case boundaries.

A process manager is **not** a use case (it does not have a single actor
goal and a single main-success-scenario). It listens to domain events and
orchestrates downstream reactions, managing process state across multiple
aggregates or modules.

## Current Process Managers

| File | Role |
|------|------|
| `knowledge-to-workflow-materializer.ts` | Listens to `notion.knowledge.*` events and materialises work-demand entities in the workspace-workflow subdomain. Confirmed process manager — retains application-layer placement. |

## Placement Rationale

`knowledge-to-workflow-materializer.ts` was reviewed against the query
"read-model projection vs. process manager" in **ADR-5201** and confirmed
to be a genuine process manager: it owns temporal coordination, multi-step
side-effects, and cross-module event/command dispatch.  It therefore
remains here and is **not** moved to `interfaces/` or `infrastructure/`.

> See: `docs/decisions/5201-accidental-complexity-workspace-workflow-application.md`
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/materialize-tasks-from-knowledge.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file materialize-tasks-from-knowledge.use-case.ts
 * @description Use case: Batch-create Tasks (and optionally Invoices) from a
 * `notion.knowledge.page-approved` event payload.
 *
 * Idempotency: callers must ensure the same `sourceReference.causationId` is
 * not processed twice. This use case does NOT check for duplicates itself;
 * that responsibility belongs to the KnowledgeToWorkflowMaterializer process
 * manager which wraps this use case.
 */
⋮----
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import type { MaterializeFromKnowledgeDto } from "../dto/materialize-from-knowledge.dto";
⋮----
export class MaterializeTasksFromKnowledgeUseCase {
⋮----
constructor(
⋮----
async execute(dto: MaterializeFromKnowledgeDto): Promise<CommandResult>
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
⋮----
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
import type { SourceReference } from "../value-objects/SourceReference";
⋮----
// ── Aggregate ─────────────────────────────────────────────────────────────────
⋮----
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
   * `notion.knowledge.page-approved` event. Provides full provenance traceability.
   */
  readonly sourceReference?: SourceReference;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
/**
   * Present when this Invoice was materialized from a KnowledgePage via the
   * `notion.knowledge.page-approved` event. Provides full provenance traceability.
   */
⋮----
// ── Inputs ────────────────────────────────────────────────────────────────────
⋮----
export interface CreateInvoiceInput {
  readonly workspaceId: string;
  readonly sourceReference?: SourceReference;
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
⋮----
import type { TaskStatus } from "../value-objects/TaskStatus";
import type { SourceReference } from "../value-objects/SourceReference";
⋮----
// ── Aggregate ─────────────────────────────────────────────────────────────────
⋮----
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
   * `notion.knowledge.page-approved` event. Provides full provenance traceability.
   */
  readonly sourceReference?: SourceReference;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
/**
   * Present when this Task was materialized from a KnowledgePage via the
   * `notion.knowledge.page-approved` event. Provides full provenance traceability.
   */
⋮----
// ── Inputs ────────────────────────────────────────────────────────────────────
⋮----
export interface CreateTaskInput {
  readonly workspaceId: string;
  readonly title: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
  readonly sourceReference?: SourceReference;
}
⋮----
export interface UpdateTaskInput {
  readonly title?: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/domain/ports/TaskCandidateExtractionAiPort.ts
````typescript
/**
 * @module workspace-flow/domain/ports
 * @file TaskCandidateExtractionAiPort.ts
 * @description Driven port interface for AI task candidate extraction.
 */
⋮----
export interface AIExtractedTaskCandidate {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
  readonly confidence?: number;
  readonly sourceSnippet?: string;
}
⋮----
export interface TaskCandidateExtractionAiPort {
  extractTaskCandidates(input: {
    readonly knowledgePageId: string;
    readonly content: string;
    readonly maxCandidates?: number;
  }): Promise<ReadonlyArray<AIExtractedTaskCandidate>>;
}
⋮----
extractTaskCandidates(input: {
    readonly knowledgePageId: string;
    readonly content: string;
    readonly maxCandidates?: number;
  }): Promise<ReadonlyArray<AIExtractedTaskCandidate>>;
````

## File: modules/workspace/subdomains/workspace-workflow/domain/services/TaskCandidateRuleExtractor.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file TaskCandidateRuleExtractor.ts
 * @description Pure, stateless rule engine that extracts task candidates from
 *   plain-text knowledge blocks using pattern matching.
 *
 * Moved from application/services/ to domain/services/ because the extractor
 * contains only domain rules and has no application or infrastructure
 * dependencies.
 *
 * @see ADR-5201 Accidental Complexity — workspace-workflow application structure
 */
⋮----
import type { ExtractedTaskCandidate, KnowledgeTextBlockInput } from "../value-objects/TaskCandidate";
⋮----
function normalizeTitle(value: string): string
⋮----
function normalizeDueDate(raw: string | undefined): string | undefined
⋮----
export class TaskCandidateRuleExtractor {
⋮----
extract(blocks: ReadonlyArray<KnowledgeTextBlockInput>): ReadonlyArray<ExtractedTaskCandidate>
````

## File: modules/workspace/subdomains/workspace-workflow/domain/value-objects/TaskCandidate.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file TaskCandidate.ts
 * @description Domain value types for extracted task candidates from knowledge content.
 *
 * Moved from application/dto to domain so the stateless rule engine
 * (TaskCandidateRuleExtractor) can live in domain/services/ without
 * depending on the application layer.
 *
 * @see ADR-5201 Accidental Complexity — workspace-workflow application structure
 */
⋮----
export type TaskCandidateSource = "rule" | "ai";
⋮----
export interface KnowledgeTextBlockInput {
  readonly blockId: string;
  readonly text: string;
  readonly pageIndex?: number;
}
⋮----
export interface ExtractedTaskCandidate {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
  readonly source: TaskCandidateSource;
  readonly confidence: number;
  readonly sourceBlockId?: string;
  readonly sourceSnippet?: string;
}
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/ai/AiTaskCandidateExtractionAdapter.ts
````typescript
import { extractTasksFromContent } from "@/modules/ai/api/server";
import type { TaskCandidateExtractionAiPort } from "../../domain/ports/TaskCandidateExtractionAiPort";
import type { AIExtractedTaskCandidate } from "../../domain/ports/TaskCandidateExtractionAiPort";
⋮----
/**
 * @module workspace-workflow/infrastructure/ai
 * @file AiTaskCandidateExtractionAdapter.ts
 * @description Infrastructure adapter implementing TaskCandidateExtractionAiPort.
 *
 * Delegates to the shared AI bounded context (`modules/ai/api/server`) so that
 * the workspace-workflow subdomain never depends on Genkit directly.
 */
export class AiTaskCandidateExtractionAdapter implements TaskCandidateExtractionAiPort {
⋮----
async extractTaskCandidates(input: {
    readonly knowledgePageId: string;
    readonly content: string;
    readonly maxCandidates?: number;
}): Promise<ReadonlyArray<AIExtractedTaskCandidate>>
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
⋮----
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
import { toInvoiceItem } from "../firebase/invoice-item.converter";
import { WF_INVOICE_ITEMS_COLLECTION } from "../firebase/workspace-flow.collections";
⋮----
export class FirebaseInvoiceItemRepository {
⋮----
private itemPath(itemId: string): string
⋮----
async findById(itemId: string): Promise<InvoiceItem | null>
⋮----
async findByInvoiceId(invoiceId: string): Promise<InvoiceItem[]>
⋮----
async delete(itemId: string): Promise<void>
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
⋮----
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
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
⋮----
export class FirebaseInvoiceRepository implements InvoiceRepository {
⋮----
private invoicePath(invoiceId: string): string
⋮----
private itemPath(itemId: string): string
⋮----
async create(input: CreateInvoiceInput): Promise<Invoice>
⋮----
async delete(invoiceId: string): Promise<void>
⋮----
async findById(invoiceId: string): Promise<Invoice | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<Invoice[]>
⋮----
async transitionStatus(
    invoiceId: string,
    to: InvoiceStatus,
    nowISO: string,
): Promise<Invoice | null>
⋮----
async addItem(input: AddInvoiceItemInput): Promise<InvoiceItem>
⋮----
// Update invoice totalAmount
⋮----
async findItemById(invoiceItemId: string): Promise<InvoiceItem | null>
⋮----
async updateItem(invoiceItemId: string, amount: number): Promise<InvoiceItem | null>
⋮----
async removeItem(invoiceItemId: string): Promise<void>
⋮----
async listItems(invoiceId: string): Promise<InvoiceItem[]>
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
⋮----
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
import { v7 as generateId } from "@lib-uuid";
import type { Issue, OpenIssueInput, UpdateIssueInput } from "../../domain/entities/Issue";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { ISSUE_STATUSES, type IssueStatus } from "../../domain/value-objects/IssueStatus";
import { toIssue } from "../firebase/issue.converter";
import { WF_ISSUES_COLLECTION } from "../firebase/workspace-flow.collections";
⋮----
export class FirebaseIssueRepository implements IssueRepository {
⋮----
private issuePath(issueId: string): string
⋮----
async create(input: OpenIssueInput): Promise<Issue>
⋮----
async update(issueId: string, input: UpdateIssueInput): Promise<Issue | null>
⋮----
async delete(issueId: string): Promise<void>
⋮----
async findById(issueId: string): Promise<Issue | null>
⋮----
async findByTaskId(taskId: string): Promise<Issue[]>
⋮----
async countOpenByTaskId(taskId: string): Promise<number>
⋮----
async transitionStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<Issue | null>
````

## File: modules/workspace/subdomains/workspace-workflow/infrastructure/repositories/FirebaseTaskMaterializationBatchJobRepository.ts
````typescript
/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseTaskMaterializationBatchJobRepository.ts
 * @description Firestore implementation for TaskMaterializationBatchJobRepository.
 */
⋮----
import { v7 as generateId } from "@lib-uuid";
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import type {
  CompleteTaskMaterializationBatchJobInput,
  CreateTaskMaterializationBatchJobInput,
  TaskMaterializationBatchJob,
} from "../../domain/entities/TaskMaterializationBatchJob";
import type { TaskMaterializationBatchJobRepository } from "../../domain/repositories/TaskMaterializationBatchJobRepository";
import { toTaskMaterializationBatchJob } from "../firebase/task-materialization-batch-job.converter";
import { WF_TASK_MATERIALIZATION_BATCH_JOBS_COLLECTION } from "../firebase/workspace-flow.collections";
⋮----
export class FirebaseTaskMaterializationBatchJobRepository implements TaskMaterializationBatchJobRepository {
⋮----
private path(jobId: string): string
⋮----
async create(input: CreateTaskMaterializationBatchJobInput): Promise<TaskMaterializationBatchJob>
⋮----
async findById(jobId: string): Promise<TaskMaterializationBatchJob | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<TaskMaterializationBatchJob[]>
⋮----
async markRunning(jobId: string): Promise<TaskMaterializationBatchJob | null>
⋮----
async markCompleted(
    jobId: string,
    input: CompleteTaskMaterializationBatchJobInput,
): Promise<TaskMaterializationBatchJob | null>
⋮----
async markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskMaterializationBatchJob | null>
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
⋮----
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
import { v7 as generateId } from "@lib-uuid";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../../domain/entities/Task";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { TASK_STATUSES, type TaskStatus } from "../../domain/value-objects/TaskStatus";
import { toTask } from "../firebase/task.converter";
import { WF_TASKS_COLLECTION } from "../firebase/workspace-flow.collections";
⋮----
export class FirebaseTaskRepository implements TaskRepository {
⋮----
private taskPath(taskId: string): string
⋮----
async create(input: CreateTaskInput): Promise<Task>
⋮----
async update(taskId: string, input: UpdateTaskInput): Promise<Task | null>
⋮----
async delete(taskId: string): Promise<void>
⋮----
async findById(taskId: string): Promise<Task | null>
⋮----
async findByWorkspaceId(workspaceId: string): Promise<Task[]>
⋮----
async transitionStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<Task | null>
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/_actions/workspace-flow-task-batch-job.actions.ts
````typescript
/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow-task-batch-job.actions.ts
 * @description Server Actions for task materialization batch job operations.
 */
⋮----
import { commandFailureFrom, type CommandResult } from "@shared-types";
import { WorkspaceFlowTaskBatchJobFacade } from "../../api/workspace-flow-task-batch-job.facade";
import { makeTaskMaterializationBatchJobRepo } from "../../api/factories";
import { AiTaskCandidateExtractionAdapter } from "../../infrastructure/ai/AiTaskCandidateExtractionAdapter";
import type {
  ExtractTaskCandidatesFromKnowledgeDto,
  ExtractTaskCandidatesFromKnowledgeResult,
} from "../../application/dto/extract-task-candidates-from-knowledge.dto";
import type { SubmitTaskMaterializationBatchJobDto } from "../../application/dto/submit-task-materialization-batch-job.dto";
import type { TaskMaterializationBatchJob } from "../../application/dto/workflow.dto";
⋮----
function makeFacade(): WorkspaceFlowTaskBatchJobFacade
⋮----
export async function wfSubmitTaskMaterializationBatchJob(
  dto: SubmitTaskMaterializationBatchJobDto,
): Promise<CommandResult>
⋮----
export async function wfGetTaskMaterializationBatchJob(
  jobId: string,
): Promise<TaskMaterializationBatchJob | null>
⋮----
export async function wfListTaskMaterializationBatchJobs(
  workspaceId: string,
): Promise<TaskMaterializationBatchJob[]>
⋮----
export async function wfExtractTaskCandidatesFromKnowledge(
  dto: ExtractTaskCandidatesFromKnowledgeDto,
): Promise<ExtractTaskCandidatesFromKnowledgeResult>
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/EditTaskDialog.tsx
````typescript
import { useEffect, useState } from "react";
⋮----
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
⋮----
import type { Task } from "../../application/dto/workflow.dto";
import { wfUpdateTask } from "../_actions/workspace-flow.actions";
⋮----
export interface EditTaskDialogProps {
  open: boolean;
  task: Task;
  onClose: () => void;
  onUpdated: () => void;
}
⋮----
async function handleSubmit(event: React.FormEvent)
````

## File: modules/workspace/subdomains/workspace-workflow/interfaces/components/TaskRow.tsx
````typescript
import { useCallback, useState } from "react";
⋮----
import { ChevronDown, ChevronRight, Pencil, Plus } from "lucide-react";
⋮----
import type { CommandResult } from "@shared-types";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
⋮----
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
import { EditTaskDialog } from "./EditTaskDialog";
import { IssueRow } from "./IssueRow";
import { OpenIssueDialog } from "./OpenIssueDialog";
⋮----
function formatShortDate(iso: string | undefined): string
⋮----
export interface TaskRowProps {
  task: Task;
  currentUserId: string;
  onTransitioned: () => void;
}
⋮----
export function TaskRow(
⋮----
// non-fatal
⋮----
async function toggleIssues()
⋮----
async function runAction(action: () => Promise<CommandResult>)
⋮----
<Button size="sm" variant="outline" disabled=
⋮----
return <Button size="sm" variant="outline" disabled=
⋮----
{/* ── Task header ─────────────────────── */}
⋮----
{/* ── Action row ──────────────────────── */}
⋮----
<Button
⋮----
{/* ── Issues sub-list ─────────────────── */}
⋮----
{/* ── Dialogs ─────────────────────────── */}
⋮----
onClose=
⋮----
onCreated=
await loadIssues();
if (!issuesExpanded) setIssuesExpanded(true);
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
 * eventBus.subscribe("notion.knowledge.page-approved", (event) => listener.handle(event));
 * ```
 *
 * @see ADR-001: docs/architecture/adr/ADR-001-knowledge-to-workflow-boundary.md
 */
⋮----
import { getSharedEventBus, type SimpleEventBus } from "@shared-events";
import { KnowledgeToWorkflowMaterializer } from "../application/process-managers/knowledge-to-workflow-materializer";
import { FirebaseTaskRepository } from "../infrastructure/repositories/FirebaseTaskRepository";
import { FirebaseInvoiceRepository } from "../infrastructure/repositories/FirebaseInvoiceRepository";
import type { PageApprovedEvent } from "@/modules/notion/api";
⋮----
// ── Public listener factory ───────────────────────────────────────────────────
⋮----
/**
 * Creates a pre-wired `KnowledgeToWorkflowMaterializer` backed by Firebase repos.
 * Call `handle(event, workspaceId)` from your event bus subscriber.
 */
export function createKnowledgeToWorkflowListener(): KnowledgeToWorkflowMaterializer
⋮----
/**
 * Registers the workspace workflow materializer on the shared in-process bus.
 * Safe to call multiple times; registration happens only once per server runtime.
 */
export function registerKnowledgeToWorkflowListener(
  bus: SimpleEventBus = getSharedEventBus(),
): void
⋮----
// ── Listener type contracts ───────────────────────────────────────────────────
⋮----
/** Shape of any handler that can process a `notion.knowledge.page-approved` event. */
export interface KnowledgePageApprovedHandler {
  handle(event: PageApprovedEvent, workspaceId?: string): Promise<boolean>;
}
⋮----
handle(event: PageApprovedEvent, workspaceId?: string): Promise<boolean>;
````

## File: modules/workspace/subdomains/workspace-workflow/application/process-managers/knowledge-to-workflow-materializer.ts
````typescript
/**
 * @module workspace-flow/application/process-managers
 * @file knowledge-to-workflow-materializer.ts
 * @description Process Manager (Saga) that listens for `notion.knowledge.page-approved`
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
⋮----
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { MaterializeTasksFromKnowledgeUseCase } from "../use-cases/materialize-tasks-from-knowledge.use-case";
import type { ExtractedInvoiceItem, ExtractedTaskItem } from "../dto/materialize-from-knowledge.dto";
import type { SourceReference } from "../../domain/value-objects/SourceReference";
⋮----
interface PageApprovedEvent {
  payload: {
    pageId: string;
    workspaceId?: string;
    causationId: string;
    correlationId: string;
    extractedTasks: ReadonlyArray<ExtractedTaskItem>;
    extractedInvoices: ReadonlyArray<ExtractedInvoiceItem>;
  };
}
⋮----
export class KnowledgeToWorkflowMaterializer {
⋮----
/**
   * In-memory idempotency guard.
   * Replace with a persistent store in production.
   */
⋮----
constructor(
⋮----
/**
   * Handle a `notion.knowledge.page-approved` event.
   *
   * @param event - The full event payload from the knowledge module's public API.
   * @param workspaceId - Target workspace where Tasks/Invoices will be created.
   *   Typically resolved from the event's `workspaceId` field if present.
   * @returns true if materialization succeeded, false if skipped (idempotency) or failed.
   */
async handle(event: PageApprovedEvent, workspaceId?: string): Promise<boolean>
````

## File: modules/workspace/subdomains/workspace-workflow/application/use-cases/extract-task-candidates-from-knowledge.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file extract-task-candidates-from-knowledge.use-case.ts
 * @description Extract task candidates from knowledge blocks with rule-first strategy.
 */
⋮----
import type {
  ExtractTaskCandidatesFromKnowledgeDto,
  ExtractTaskCandidatesFromKnowledgeResult,
  ExtractedTaskCandidate,
} from "../dto/extract-task-candidates-from-knowledge.dto";
import type { TaskCandidateExtractionAiPort } from "../../domain/ports/TaskCandidateExtractionAiPort";
import { TaskCandidateRuleExtractor } from "../../domain/services/TaskCandidateRuleExtractor";
⋮----
function mergeUnique(candidates: ReadonlyArray<ExtractedTaskCandidate>): ReadonlyArray<ExtractedTaskCandidate>
⋮----
export class ExtractTaskCandidatesFromKnowledgeUseCase {
⋮----
constructor(private readonly aiPort?: TaskCandidateExtractionAiPort)
⋮----
async execute(
    dto: ExtractTaskCandidatesFromKnowledgeDto,
): Promise<ExtractTaskCandidatesFromKnowledgeResult>
````

## File: modules/workspace/subdomains/workspace-workflow/domain/ports/index.ts
````typescript
/**
 * workspace/workspace-workflow domain/ports — driven port interfaces for the workflow subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 *
 * Application-layer ports (contracts whose method signatures depend on application/dto/ types)
 * live in ../application/ports/:
 *   - IssueService   — Issue operations (uses OpenIssueDto, IssueQueryDto)
 *   - InvoiceService — Invoice operations (uses AddInvoiceItemDto, InvoiceQueryDto)
 *   - TaskService    — Task operations (uses CreateTaskDto, TaskQueryDto)
 * These must not be moved here; see ADR-1102 §3.
 */
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
 * `notion.knowledge.page-approved` event. It provides full audit traceability:
 *
 *   Task → sourceReference → KnowledgePage → BackgroundJob → source PDF
 */
⋮----
export type SourceReferenceType = "KnowledgePage";
⋮----
export interface SourceReference {
  /** The type of the source aggregate. */
  readonly type: SourceReferenceType;
  /** The ID of the source aggregate (e.g. KnowledgePage.id). */
  readonly id: string;
  /**
   * causationId from the `notion.knowledge.page-approved` event that triggered
   * materialization.  Stored for idempotency checks and audit trails.
   */
  readonly causationId: string;
  /**
   * correlationId tracing the entire business flow:
   *   ingestion → human review → approval → materialization.
   */
  readonly correlationId: string;
}
⋮----
/** The type of the source aggregate. */
⋮----
/** The ID of the source aggregate (e.g. KnowledgePage.id). */
⋮----
/**
   * causationId from the `notion.knowledge.page-approved` event that triggered
   * materialization.  Stored for idempotency checks and audit trails.
   */
⋮----
/**
   * correlationId tracing the entire business flow:
   *   ingestion → human review → approval → materialization.
   */
````