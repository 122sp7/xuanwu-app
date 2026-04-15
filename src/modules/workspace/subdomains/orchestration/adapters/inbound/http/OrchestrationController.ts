import type { TaskMaterializationJobRepository } from "../../../domain/repositories/TaskMaterializationJobRepository";
import { CreateMaterializationJobUseCase } from "../../../application/use-cases/OrchestrationUseCases";

export class OrchestrationController {
  private readonly createJob: CreateMaterializationJobUseCase;

  constructor(jobRepo: TaskMaterializationJobRepository) {
    this.createJob = new CreateMaterializationJobUseCase(jobRepo);
  }
}
