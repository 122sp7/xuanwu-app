import { v4 as uuid } from "@lib-uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { TaskMaterializationJobRepository } from "../../domain/repositories/TaskMaterializationJobRepository";
import { TaskMaterializationJob } from "../../domain/entities/TaskMaterializationJob";
import type { CreateJobInput } from "../../domain/entities/TaskMaterializationJob";

export class CreateMaterializationJobUseCase {
  constructor(private readonly jobRepo: TaskMaterializationJobRepository) {}

  async execute(input: CreateJobInput): Promise<CommandResult> {
    try {
      const job = TaskMaterializationJob.create(uuid(), input);
      await this.jobRepo.save(job.getSnapshot());
      return commandSuccess(job.id, Date.now());
    } catch (err) {
      return commandFailureFrom("JOB_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create job.");
    }
  }
}

export class StartMaterializationJobUseCase {
  constructor(private readonly jobRepo: TaskMaterializationJobRepository) {}

  async execute(jobId: string): Promise<CommandResult> {
    try {
      const result = await this.jobRepo.markRunning(jobId);
      if (!result) return commandFailureFrom("JOB_NOT_FOUND", "Job not found.");
      return commandSuccess(jobId, Date.now());
    } catch (err) {
      return commandFailureFrom("JOB_START_FAILED", err instanceof Error ? err.message : "Failed to start job.");
    }
  }
}
