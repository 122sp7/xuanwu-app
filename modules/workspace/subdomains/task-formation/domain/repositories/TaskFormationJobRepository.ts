/**
 * @module task-formation/domain/repositories
 * @file TaskFormationJobRepository.ts
 * @description Repository port for task formation batch jobs.
 */

import type {
  CompleteTaskFormationJobInput,
  CreateTaskFormationJobInput,
  TaskFormationJob,
} from "../entities/TaskFormationJob";

export interface TaskFormationJobRepository {
  create(input: CreateTaskFormationJobInput): Promise<TaskFormationJob>;
  findById(jobId: string): Promise<TaskFormationJob | null>;
  findByWorkspaceId(workspaceId: string): Promise<TaskFormationJob[]>;
  markRunning(jobId: string): Promise<TaskFormationJob | null>;
  markCompleted(
    jobId: string,
    input: CompleteTaskFormationJobInput,
  ): Promise<TaskFormationJob | null>;
  markFailed(
    jobId: string,
    errorCode: string,
    errorMessage: string,
  ): Promise<TaskFormationJob | null>;
}
