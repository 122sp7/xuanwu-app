import type { TaskEntity } from "../domain/TaskEntity";
import type { TaskRepository } from "../domain/repositories/TaskRepository";

export class TaskRepoImpl implements TaskRepository {
  private readonly tasks = new Map<string, TaskEntity>();

  private toDate(value: Date | string | number): Date {
    return value instanceof Date ? new Date(value.getTime()) : new Date(value);
  }

  private cloneTask(task: TaskEntity): TaskEntity {
    return {
      ...task,
      createdAt: this.toDate(task.createdAt),
      updatedAt: this.toDate(task.updatedAt),
    };
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const task = this.tasks.get(id);
    return task ? this.cloneTask(task) : null;
  }

  async findAll(): Promise<TaskEntity[]> {
    return Array.from(this.tasks.values()).map((task) => this.cloneTask(task));
  }

  async save(task: TaskEntity): Promise<void> {
    this.tasks.set(task.id, this.cloneTask(task));
  }

  async delete(id: string): Promise<void> {
    this.tasks.delete(id);
  }
}
