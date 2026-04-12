/**
 * @module workspace-flow/api
 * @file workspace-flow-task-batch-job.facade.ts
 * @description Focused facade for task materialization batch jobs.
 */

import type { CommandResult } from "@shared-types";
import type {
  ExtractTaskCandidatesFromKnowledgeDto,
  ExtractTaskCandidatesFromKnowledgeResult,
} from "../application/dto/extract-task-candidates-from-knowledge.dto";
import type { SubmitTaskMaterializationBatchJobDto } from "../application/dto/submit-task-materialization-batch-job.dto";
import type { TaskCandidateExtractionAiPort } from "../application/ports/TaskCandidateExtractionAiPort";
import { ExtractTaskCandidatesFromKnowledgeUseCase } from "../application/use-cases/extract-task-candidates-from-knowledge.use-case";
import { SubmitTaskMaterializationBatchJobUseCase } from "../application/use-cases/submit-task-materialization-batch-job.use-case";
import type { TaskMaterializationBatchJob } from "../domain/entities/TaskMaterializationBatchJob";
import type { TaskMaterializationBatchJobRepository } from "../domain/repositories/TaskMaterializationBatchJobRepository";

export class WorkspaceFlowTaskBatchJobFacade {
  constructor(
    private readonly repository: TaskMaterializationBatchJobRepository,
    private readonly aiPort?: TaskCandidateExtractionAiPort,
  ) {}

  async submitBatchJob(dto: SubmitTaskMaterializationBatchJobDto): Promise<CommandResult> {
    return new SubmitTaskMaterializationBatchJobUseCase(this.repository).execute(dto);
  }

  async getBatchJob(jobId: string): Promise<TaskMaterializationBatchJob | null> {
    return this.repository.findById(jobId);
  }

  async listBatchJobs(workspaceId: string): Promise<TaskMaterializationBatchJob[]> {
    return this.repository.findByWorkspaceId(workspaceId);
  }

  async extractTaskCandidates(
    dto: ExtractTaskCandidatesFromKnowledgeDto,
  ): Promise<ExtractTaskCandidatesFromKnowledgeResult> {
    return new ExtractTaskCandidatesFromKnowledgeUseCase(this.aiPort).execute(dto);
  }
}
