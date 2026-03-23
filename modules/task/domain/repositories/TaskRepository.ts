import type { TaskEntity, CreateTaskInput, UpdateTaskInput } from "../entities/Task";
import type { TaskLifecycleStatus } from "../value-objects/task-state";

export interface TaskRepository {
  create(input: CreateTaskInput): Promise<TaskEntity>;
  update(taskId: string, input: UpdateTaskInput): Promise<TaskEntity | null>;
  delete(taskId: string): Promise<void>;
  findById(taskId: string): Promise<TaskEntity | null>;
  findByWorkspaceId(workspaceId: string): Promise<TaskEntity[]>;
  /** Persists a lifecycle status transition and stamps acceptedAtISO if to==="accepted". */
  transitionStatus(taskId: string, to: TaskLifecycleStatus, nowISO: string): Promise<TaskEntity | null>;
}
