export { WorkspaceIssueTab } from "./interfaces/components/WorkspaceIssueTab";
export type {
  WorkspaceIssueEntity,
  WorkspaceIssueSeverity,
  WorkspaceIssueStatus,
  CreateWorkspaceIssueInput,
  UpdateWorkspaceIssueInput,
} from "./domain/entities/Issue";
export type { IssueRepository } from "./domain/repositories/IssueRepository";
export {
  CreateWorkspaceIssueUseCase,
  UpdateWorkspaceIssueUseCase,
  DeleteWorkspaceIssueUseCase,
  ListWorkspaceIssuesUseCase,
} from "./application/use-cases/issue.use-cases";
export { FirebaseIssueRepository } from "./infrastructure/firebase/FirebaseIssueRepository";
export {
  createWorkspaceIssue,
  updateWorkspaceIssue,
  deleteWorkspaceIssue,
} from "./interfaces/_actions/issue.actions";
export { getWorkspaceIssues } from "./interfaces/queries/issue.queries";

// ── MDDD Domain: lifecycle status & state machine ─────────────────────────────
export type { IssueLifecycleStatus, IssueStage } from "./domain/value-objects/issue-state";
export {
  ISSUE_LIFECYCLE_STATUSES,
  ISSUE_STAGES,
  canTransitionIssue,
  isTerminalIssueStatus,
} from "./domain/value-objects/issue-state";

// ── MDDD Domain: events (cross-domain) ───────────────────────────────────────
export type {
  IssueDomainEvent,
  IssueCreatedEvent,
  IssueStatusChangedEvent,
  IssueAssignedEvent,
  IssueResolvedEvent,
  IssueClosedEvent,
} from "./domain/events/issue.events";

// ── MDDD Application: DTOs ────────────────────────────────────────────────────
export type {
  CreateIssueInputDto,
  UpdateIssueInputDto,
  TransitionIssueStatusInputDto,
} from "./application/dto/issue.dto";
export {
  CreateIssueInputSchema,
  UpdateIssueInputSchema,
  TransitionIssueStatusInputSchema,
  IssueLifecycleStatusSchema,
  IssueStageSchema,
} from "./application/dto/issue.dto";
