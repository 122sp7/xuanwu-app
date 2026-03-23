export { WorkspaceTaskTab } from "./interfaces/components/WorkspaceTaskTab";
export type {
  WorkspaceTaskEntity,
  WorkspaceTaskStatus,
  WorkspaceTaskPriority,
  CreateWorkspaceTaskInput,
  UpdateWorkspaceTaskInput,
} from "./domain/entities/Task";
export type { TaskRepository } from "./domain/repositories/TaskRepository";
export {
  CreateWorkspaceTaskUseCase,
  UpdateWorkspaceTaskUseCase,
  DeleteWorkspaceTaskUseCase,
  ListWorkspaceTasksUseCase,
} from "./application/use-cases/task.use-cases";
export { FirebaseTaskRepository } from "./infrastructure/firebase/FirebaseTaskRepository";
export {
  createWorkspaceTask,
  updateWorkspaceTask,
  deleteWorkspaceTask,
} from "./interfaces/_actions/task.actions";
export { getWorkspaceTasks } from "./interfaces/queries/task.queries";

// ── MDDD Domain: lifecycle status & state machine ─────────────────────────────
export type { TaskLifecycleStatus } from "./domain/value-objects/task-state";
export {
  TASK_LIFECYCLE_STATUSES,
  canTransitionTask,
  nextTaskStatus,
  isTerminalTaskStatus,
} from "./domain/value-objects/task-state";

// ── MDDD Domain: events ───────────────────────────────────────────────────────
export type {
  TaskDomainEvent,
  TaskCreatedEvent,
  TaskUpdatedEvent,
  TaskAssignedEvent,
  TaskStatusChangedEvent,
  TaskAcceptedEvent,
  TaskArchivedEvent,
} from "./domain/events/task.events";

// ── MDDD Application: DTOs ────────────────────────────────────────────────────
export type {
  CreateTaskInput,
  UpdateTaskInput,
  TransitionTaskStatusInput,
} from "./application/dto/task.dto";
export {
  CreateTaskInputSchema,
  UpdateTaskInputSchema,
  TransitionTaskStatusInputSchema,
  TaskLifecycleStatusSchema,
} from "./application/dto/task.dto";
