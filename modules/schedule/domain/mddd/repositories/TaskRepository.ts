import type { Task } from "../entities/Task";

export interface ScheduleMdddTaskRepository {
  findById(taskId: string): Promise<Task | null>;
  listByRequestId(requestId: string): Promise<readonly Task[]>;
  save(task: Task): Promise<Task>;
}
