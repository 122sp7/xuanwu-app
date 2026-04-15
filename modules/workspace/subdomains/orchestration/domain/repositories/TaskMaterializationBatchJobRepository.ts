/**
 * @module workspace-flow/domain/repositories
 * @file TaskMaterializationBatchJobRepository.ts
 * @description Repository port for task materialization batch jobs.
 */

import type {
  CompleteTaskMaterializationBatchJobInput,
  CreateTaskMaterializationBatchJobInput,
  TaskMaterializationBatchJob,
} from "../entities/TaskMaterializationBatchJob";

export interface TaskMaterializationBatchJobRepository {
  create(input: CreateTaskMaterializationBatchJobInput): Promise<TaskMaterializationBatchJob>;
  findById(jobId: string): Promise<TaskMaterializationBatchJob | null>;
  findByWorkspaceId(workspaceId: string): Promise<TaskMaterializationBatchJob[]>;
  markRunning(jobId: string): Promise<TaskMaterializationBatchJob | null>;
  markCompleted(
    jobId: string,
    input: CompleteTaskMaterializationBatchJobInput,
  ): Promise<TaskMaterializationBatchJob | null>;
  markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskMaterializationBatchJob | null>;
}
