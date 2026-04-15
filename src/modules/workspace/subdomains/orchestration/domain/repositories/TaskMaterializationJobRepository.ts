import type { TaskMaterializationJobSnapshot, CompleteJobInput } from "../entities/TaskMaterializationJob";

export interface TaskMaterializationJobRepository {
  findById(jobId: string): Promise<TaskMaterializationJobSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<TaskMaterializationJobSnapshot[]>;
  save(job: TaskMaterializationJobSnapshot): Promise<void>;
  markRunning(jobId: string): Promise<TaskMaterializationJobSnapshot | null>;
  markCompleted(jobId: string, input: CompleteJobInput): Promise<TaskMaterializationJobSnapshot | null>;
  markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskMaterializationJobSnapshot | null>;
}
