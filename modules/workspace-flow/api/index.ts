/**
 * @module workspace-flow/api
 * @file index.ts
 * @description Public cross-module boundary for workspace-flow.
 *
 * External consumers MUST import only from this path:
 *   @/modules/workspace-flow/api
 *
 * Never import from domain/, application/, infrastructure/, or interfaces/ directly.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Narrow exports as module stabilises
 */

// ── Facade (write surface) ────────────────────────────────────────────────────

export { WorkspaceFlowFacade } from "./workspace-flow.facade";

// ── Public contracts ──────────────────────────────────────────────────────────

export type {
  Task,
  Issue,
  Invoice,
  InvoiceItem,
  TaskStatus,
  IssueStatus,
  IssueStage,
  InvoiceStatus,
  TaskSummary,
  IssueSummary,
  InvoiceSummary,
  InvoiceItemSummary,
  CreateTaskDto,
  OpenIssueDto,
  AddInvoiceItemDto,
  TaskQueryDto,
  IssueQueryDto,
  InvoiceQueryDto,
} from "./contracts";

export {
  TASK_STATUSES,
  canTransitionTaskStatus,
  nextTaskStatus,
  isTerminalTaskStatus,
  ISSUE_STATUSES,
  canTransitionIssueStatus,
  isTerminalIssueStatus,
  ISSUE_STAGES,
  INVOICE_STATUSES,
  canTransitionInvoiceStatus,
  isTerminalInvoiceStatus,
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
