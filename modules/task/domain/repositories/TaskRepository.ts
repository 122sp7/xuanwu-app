import type { TaskEntity } from "../TaskEntity";

export interface TaskRepository {
  findById(id: string): Promise<TaskEntity | null>;
  findAll(): Promise<TaskEntity[]>;
  save(task: TaskEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
