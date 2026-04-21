/**
 * Workspace Module — public API surface.
 * All cross-module consumers must import from here only.
 */

// lifecycle (workspace CRUD)
export type { WorkspaceSnapshot, CreateWorkspaceInput, WorkspaceLifecycleState } from "./subdomains/lifecycle/domain/entities/Workspace";
export { Workspace } from "./subdomains/lifecycle/domain/entities/Workspace";
export { CreateWorkspaceUseCase, ActivateWorkspaceUseCase, StopWorkspaceUseCase } from "./subdomains/lifecycle/application/use-cases/WorkspaceLifecycleUseCases";
export type { WorkspaceRepository } from "./subdomains/lifecycle/domain/repositories/WorkspaceRepository";

// membership
export type { WorkspaceMemberSnapshot, AddMemberInput, MemberRole } from "./subdomains/membership/domain/entities/WorkspaceMember";
export { WorkspaceMember } from "./subdomains/membership/domain/entities/WorkspaceMember";
export { AddMemberUseCase, ChangeMemberRoleUseCase, RemoveMemberUseCase } from "./subdomains/membership/application/use-cases/MembershipUseCases";
export type { WorkspaceMemberRepository } from "./subdomains/membership/domain/repositories/WorkspaceMemberRepository";

// task
export type { TaskSnapshot, CreateTaskInput } from "./subdomains/task/domain/entities/Task";
export { Task } from "./subdomains/task/domain/entities/Task";
export { CreateTaskUseCase, UpdateTaskUseCase, TransitionTaskStatusUseCase } from "./subdomains/task/application/use-cases/TaskUseCases";
export type { TaskRepository } from "./subdomains/task/domain/repositories/TaskRepository";
export type { TaskStatus } from "./subdomains/task/domain/value-objects/TaskStatus";
export type { ExtractedTaskCandidate } from "./subdomains/task-formation/domain/value-objects/TaskCandidate";

// issue
export type { IssueSnapshot, OpenIssueInput } from "./subdomains/issue/domain/entities/Issue";
export { Issue } from "./subdomains/issue/domain/entities/Issue";
export { OpenIssueUseCase, TransitionIssueStatusUseCase } from "./subdomains/issue/application/use-cases/IssueUseCases";
export type { IssueRepository } from "./subdomains/issue/domain/repositories/IssueRepository";

// shared types and errors
export type { WorkspaceScopeProps } from "./shared/types/index";
export { WorkspaceNotFoundError, WorkspaceMemberNotFoundError, WorkspaceQuotaExceededError } from "./shared/errors/index";
