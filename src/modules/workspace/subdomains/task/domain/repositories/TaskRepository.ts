import type { TaskSnapshot } from "../entities/Task";
import type { TaskStatus } from "../value-objects/TaskStatus";

export interface TaskRepository {
  findById(taskId: string): Promise<TaskSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<TaskSnapshot[]>;
  save(task: TaskSnapshot): Promise<void>;
  updateStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<TaskSnapshot | null>;
  delete(taskId: string): Promise<void>;
}
