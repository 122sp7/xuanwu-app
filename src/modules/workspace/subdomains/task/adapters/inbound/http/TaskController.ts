import type { TaskRepository } from "../../../domain/repositories/TaskRepository";
import { CreateTaskUseCase, UpdateTaskUseCase, TransitionTaskStatusUseCase } from "../../../application/use-cases/TaskUseCases";

export class TaskController {
  private readonly createTask: CreateTaskUseCase;
  private readonly updateTask: UpdateTaskUseCase;
  private readonly transitionTask: TransitionTaskStatusUseCase;

  constructor(taskRepo: TaskRepository) {
    this.createTask = new CreateTaskUseCase(taskRepo);
    this.updateTask = new UpdateTaskUseCase(taskRepo);
    this.transitionTask = new TransitionTaskStatusUseCase(taskRepo);
  }
}
