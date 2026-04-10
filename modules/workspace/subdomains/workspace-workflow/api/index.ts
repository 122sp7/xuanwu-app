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
 
