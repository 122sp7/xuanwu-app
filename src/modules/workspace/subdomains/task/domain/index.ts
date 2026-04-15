export type { TaskSnapshot, CreateTaskInput, UpdateTaskInput, SourceReference } from "./entities/Task";
export { Task } from "./entities/Task";
export type { TaskStatus } from "./value-objects/TaskStatus";
export { TASK_STATUSES, canTransitionTaskStatus, nextTaskStatus, isTerminalTaskStatus } from "./value-objects/TaskStatus";
export type { TaskId } from "./value-objects/TaskId";
export { createTaskId } from "./value-objects/TaskId";
export type { TaskDomainEventType, TaskCreatedEvent, TaskStatusChangedEvent, TaskArchivedEvent } from "./events/TaskDomainEvent";
export type { TaskRepository } from "./repositories/TaskRepository";

