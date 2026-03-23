// ── Domain: entity ────────────────────────────────────────────────────────────
export type { IssueEntity, CreateIssueInput, UpdateIssueInput } from "./domain/entities/Issue";

// ── Domain: lifecycle status, stage & state machine ──────────────────────────
export type { IssueLifecycleStatus, IssueStage } from "./domain/value-objects/issue-state";
export {
  ISSUE_LIFECYCLE_STATUSES,
  ISSUE_STAGES,
  canTransitionIssue,
  isTerminalIssueStatus,
} from "./domain/value-objects/issue-state";

// ── Domain: events (cross-domain) ─────────────────────────────────────────────
export type {
  IssueDomainEvent,
  IssueCreatedEvent,
  IssueStatusChangedEvent,
  IssueAssignedEvent,
  IssueResolvedEvent,
  IssueClosedEvent,
} from "./domain/events/issue.events";

// ── Domain: repository port ───────────────────────────────────────────────────
export type { IssueRepository } from "./domain/repositories/IssueRepository";

// ── Application: DTOs ─────────────────────────────────────────────────────────
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

// ── Application: use-cases ────────────────────────────────────────────────────
export {
  CreateIssueUseCase,
  UpdateIssueUseCase,
  DeleteIssueUseCase,
  TransitionIssueStatusUseCase,
  ListIssuesUseCase,
} from "./application/use-cases/issue.use-cases";

// ── Infrastructure ────────────────────────────────────────────────────────────
export { FirebaseIssueRepository } from "./infrastructure/firebase/FirebaseIssueRepository";

// ── Interfaces: Server Actions ────────────────────────────────────────────────
export { createIssue, updateIssue, deleteIssue, transitionIssueStatus } from "./interfaces/_actions/issue.actions";

// ── Interfaces: queries ───────────────────────────────────────────────────────
export { getIssues } from "./interfaces/queries/issue.queries";

// ── Interfaces: UI component ──────────────────────────────────────────────────
export { WorkspaceIssueTab } from "./interfaces/components/WorkspaceIssueTab";
