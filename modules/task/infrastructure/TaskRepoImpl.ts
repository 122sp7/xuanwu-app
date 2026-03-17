import type { TaskEntity } from "../domain/TaskEntity";
import type { TaskRepository } from "../ports/TaskRepository";

export class TaskRepoImpl implements TaskRepository {
  async findById(_id: string): Promise<TaskEntity | null> {
    // TODO: implement with DB
    return null;
  }

  async findAll(): Promise<TaskEntity[]> {
    // TODO: implement with DB
    return [];
  }

  async save(_task: TaskEntity): Promise<void> {
    // TODO: implement with DB
  }

  async delete(_id: string): Promise<void> {
    // TODO: implement with DB
  }
}
