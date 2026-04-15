import type { TaskFormationJobSnapshot, CompleteTaskFormationJobInput } from "../entities/TaskFormationJob";

export interface TaskFormationJobRepository {
  findById(jobId: string): Promise<TaskFormationJobSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<TaskFormationJobSnapshot[]>;
  save(job: TaskFormationJobSnapshot): Promise<void>;
  markRunning(jobId: string): Promise<TaskFormationJobSnapshot | null>;
  markCompleted(jobId: string, input: CompleteTaskFormationJobInput): Promise<TaskFormationJobSnapshot | null>;
  markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskFormationJobSnapshot | null>;
}
