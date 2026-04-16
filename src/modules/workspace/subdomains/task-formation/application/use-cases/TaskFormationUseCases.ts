import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { TaskFormationJobRepository } from "../../domain/repositories/TaskFormationJobRepository";
import { TaskFormationJob } from "../../domain/entities/TaskFormationJob";
import type { CreateTaskFormationJobInput, CompleteTaskFormationJobInput } from "../../domain/entities/TaskFormationJob";

export class CreateTaskFormationJobUseCase {
  constructor(private readonly jobRepo: TaskFormationJobRepository) {}

  async execute(input: CreateTaskFormationJobInput): Promise<CommandResult> {
    try {
      const job = TaskFormationJob.create(uuid(), input);
      await this.jobRepo.save(job.getSnapshot());
      return commandSuccess(job.id, Date.now());
    } catch (err) {
      return commandFailureFrom("TASK_FORMATION_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create job.");
    }
  }
}

export class CompleteTaskFormationJobUseCase {
  constructor(private readonly jobRepo: TaskFormationJobRepository) {}

  async execute(jobId: string, input: CompleteTaskFormationJobInput): Promise<CommandResult> {
    try {
      const result = await this.jobRepo.markCompleted(jobId, input);
      if (!result) return commandFailureFrom("TASK_FORMATION_NOT_FOUND", "Job not found.");
      return commandSuccess(jobId, Date.now());
    } catch (err) {
      return commandFailureFrom("TASK_FORMATION_COMPLETE_FAILED", err instanceof Error ? err.message : "Failed to complete job.");
    }
  }
}
