/**
 * workspace api/contracts.ts
 *
 * Canonical public type surface for the workspace bounded context.
 * Cross-module and app-layer consumers should import types from here.
 *
 * Internal source: interfaces/contracts/
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
  WorkspaceNotificationEventType,
  WorkspaceNotificationPreferenceDto,
  UpdateNotificationPreferencesCommand,
  WorkspaceEventPayload,
} from "@/modules/platform/subdomains/notification/api";

export { WORKSPACE_NOTIFICATION_EVENT_TYPES } from "@/modules/platform/subdomains/notification/api";

export type { Task, TaskStatus, TaskSummary, CreateTaskDto, UpdateTaskDto, TaskQueryDto, PaginationDto, PagedResult } from "../subdomains/task/api";
export { TASK_STATUSES, toTaskSummary } from "../subdomains/task/api";

export type { Issue, IssueStatus, IssueStage, IssueSummary, OpenIssueDto, ResolveIssueDto, IssueQueryDto } from "../subdomains/issue/api";
export { ISSUE_STATUSES, ISSUE_STAGES, toIssueSummary } from "../subdomains/issue/api";

export type {
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  InvoiceSummary,
  InvoiceItemSummary,
  AddInvoiceItemDto,
  UpdateInvoiceItemDto,
  RemoveInvoiceItemDto,
  InvoiceQueryDto,
} from "../subdomains/settlement/api";
export { INVOICE_STATUSES, toInvoiceSummary, toInvoiceItemSummary } from "../subdomains/settlement/api";

export type { CommandResult } from "@shared-types";
