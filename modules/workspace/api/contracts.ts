/**
 * workspace api/contracts.ts
 *
 * Canonical public type surface for the workspace bounded context.
 * Cross-module and app-layer consumers should import types from here.
 *
 * Internal source: interfaces/api/contracts/
 */

export type {
  Address,
  AddressInput,
  Capability,
  CapabilitySpec,
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceEntity,
  WorkspaceGrant,
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
  WorkspaceLocation,
  WorkspaceName,
  WorkspaceNameInput,
  WorkspacePersonnel,
  WorkspacePersonnelCustomRole,
  WorkspaceVisibility,
  WorkspaceVisibilityInput,
} from "../domain/aggregates/Workspace";

export type {
  WorkspaceMemberAccessChannel,
  WorkspaceMemberAccessSource,
  WorkspaceMemberPresence,
  WorkspaceMemberView,
} from "../domain/entities/WorkspaceMemberView";

export type {
  WikiAccountContentNode,
  WikiAccountSeed,
  WikiAccountType,
  WikiContentItemNode,
  WikiWorkspaceContentNode,
  WikiWorkspaceRef,
} from "../domain/entities/WikiContentTree";

export {
  WORKSPACE_LIFECYCLE_STATES,
  WORKSPACE_VISIBILITIES,
  createAddress,
  createWorkspaceLifecycleState,
  createWorkspaceName,
  createWorkspaceVisibility,
  formatAddress,
  isTerminalWorkspaceLifecycleState,
  isWorkspaceVisible,
  workspaceNameEquals,
} from "../domain/value-objects";

export type {
  WorkspaceCreatedEvent,
  WorkspaceDomainEvent,
  WorkspaceLifecycleTransitionedEvent,
  WorkspaceVisibilityChangedEvent,
} from "../domain/events/workspace.events";

export {
  WORKSPACE_CREATED_EVENT_TYPE,
  WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE,
  WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE,
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../domain/events/workspace.events";

export type {
  AuditAction,
  AuditLog,
  AuditLogEntity,
  AuditLogSource,
  AuditSeverity,
  ChangeRecord,
} from "../subdomains/audit/api";

export { AuditLogSchema, AUDIT_ACTIONS, AUDIT_SEVERITIES } from "../subdomains/audit/api";

export type {
  WorkspaceFeedPost,
  WorkspaceFeedPostType,
} from "../subdomains/feed/api";

export { WORKSPACE_FEED_POST_TYPES } from "../subdomains/feed/api";

export type {
  AssignWorkDemandCommand,
  CreateWorkDemandCommand,
  DemandPriority,
  DemandStatus,
  WorkDemand,
  WorkDemandDomainEvent,
} from "../subdomains/scheduling/api";

export {
  DEMAND_PRIORITIES,
  DEMAND_PRIORITY_LABELS,
  DEMAND_STATUSES,
  DEMAND_STATUS_LABELS,
} from "../subdomains/scheduling/api";

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
  UpdateTaskDto,
  OpenIssueDto,
  ResolveIssueDto,
  AddInvoiceItemDto,
  UpdateInvoiceItemDto,
  RemoveInvoiceItemDto,
  TaskQueryDto,
  IssueQueryDto,
  InvoiceQueryDto,
  PaginationDto,
  PagedResult,
  CommandResult,
} from "../subdomains/workspace-workflow/api";

export {
  TASK_STATUSES,
  ISSUE_STATUSES,
  ISSUE_STAGES,
  INVOICE_STATUSES,
  toTaskSummary,
  toIssueSummary,
  toInvoiceSummary,
  toInvoiceItemSummary,
} from "../subdomains/workspace-workflow/api";
