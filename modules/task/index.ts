// ── Domain: entity ────────────────────────────────────────────────────────────
export type { TaskEntity, CreateTaskInput, UpdateTaskInput } from "./domain/entities/Task";

// ── Domain: lifecycle status & state machine ──────────────────────────────────
export type { TaskLifecycleStatus } from "./domain/value-objects/task-state";
export {
  TASK_LIFECYCLE_STATUSES,
  canTransitionTask,
  nextTaskStatus,
  isTerminalTaskStatus,
} from "./domain/value-objects/task-state";

// ── Domain: events ────────────────────────────────────────────────────────────
export type {
  TaskDomainEvent,
  TaskCreatedEvent,
  TaskUpdatedEvent,
  TaskAssignedEvent,
  TaskStatusChangedEvent,
  TaskAcceptedEvent,
  TaskArchivedEvent,
} from "./domain/events/task.events";

// ── Domain: repository port ───────────────────────────────────────────────────
export type { TaskRepository } from "./domain/repositories/TaskRepository";

// ── Application: DTOs ─────────────────────────────────────────────────────────
export type {
  CreateTaskInput as CreateTaskInputDto,
  UpdateTaskInput as UpdateTaskInputDto,
  TransitionTaskStatusInput,
} from "./application/dto/task.dto";
export {
  CreateTaskInputSchema,
  UpdateTaskInputSchema,
  TransitionTaskStatusInputSchema,
  TaskLifecycleStatusSchema,
} from "./application/dto/task.dto";

// ── Application: use-cases ────────────────────────────────────────────────────
export {
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  TransitionTaskStatusUseCase,
  ListTasksUseCase,
} from "./application/use-cases/task.use-cases";

// ── Infrastructure ────────────────────────────────────────────────────────────
export { FirebaseTaskRepository } from "./infrastructure/firebase/FirebaseTaskRepository";

// ── Interfaces: Server Actions ────────────────────────────────────────────────
export { createTask, updateTask, deleteTask, transitionTaskStatus } from "./interfaces/_actions/task.actions";

// ── Interfaces: queries ───────────────────────────────────────────────────────
export { getTasks } from "./interfaces/queries/task.queries";

// ── Interfaces: UI component ──────────────────────────────────────────────────
export { WorkspaceTaskTab } from "./interfaces/components/WorkspaceTaskTab";
