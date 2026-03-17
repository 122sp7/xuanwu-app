import type { TaskEntity } from "../domain/TaskEntity";
import type { TaskRepository } from "../ports/TaskRepository";

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getTaskById(id: string): Promise<TaskEntity | null> {
    return this.taskRepository.findById(id);
  }

  async getAllTasks(): Promise<TaskEntity[]> {
    return this.taskRepository.findAll();
  }
}
