/**
 * @module workspace-flow/api
 * @file workspace-flow-task-batch-job.facade.ts
 * @description Focused facade for task materialization batch jobs.
 */

import type { CommandResult } from "@shared-types";
import type { SubmitTaskMaterializationBatchJobDto } from "../application/dto/submit-task-materialization-batch-job.dto";
import { SubmitTaskMaterializationBatchJobUseCase } from "../application/use-cases/submit-task-materialization-batch-job.use-case";
import type { TaskMaterializationBatchJob } from "../domain/entities/TaskMaterializationBatchJob";
import type { TaskMaterializationBatchJobRepository } from "../domain/repositories/TaskMaterializationBatchJobRepository";

export class WorkspaceFlowTaskBatchJobFacade {
  constructor(private readonly repository: TaskMaterializationBatchJobRepository) {}

  async submitBatchJob(dto: SubmitTaskMaterializationBatchJobDto): Promise<CommandResult> {
    return new SubmitTaskMaterializationBatchJobUseCase(this.repository).execute(dto);
  }

  async getBatchJob(jobId: string): Promise<TaskMaterializationBatchJob | null> {
    return this.repository.findById(jobId);
  }

  async listBatchJobs(workspaceId: string): Promise<TaskMaterializationBatchJob[]> {
    return this.repository.findByWorkspaceId(workspaceId);
  }
}
