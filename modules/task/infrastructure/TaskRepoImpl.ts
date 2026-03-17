import type { TaskEntity } from "../domain/TaskEntity";
import type { TaskRepository } from "../domain/repositories/TaskRepository";

export class TaskRepoImpl implements TaskRepository {
  private static readonly tasks = new Map<string, TaskEntity>();

  private static cloneTask(task: TaskEntity): TaskEntity {
    return {
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    };
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const task = TaskRepoImpl.tasks.get(id);
    return task ? TaskRepoImpl.cloneTask(task) : null;
  }

  async findAll(): Promise<TaskEntity[]> {
    return Array.from(TaskRepoImpl.tasks.values()).map(TaskRepoImpl.cloneTask);
  }

  async save(task: TaskEntity): Promise<void> {
    TaskRepoImpl.tasks.set(task.id, TaskRepoImpl.cloneTask(task));
  }

  async delete(id: string): Promise<void> {
    TaskRepoImpl.tasks.delete(id);
  }
}
