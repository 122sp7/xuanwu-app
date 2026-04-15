/**
 * @module orchestration/interfaces/queries
 * @file workspace-flow-orchestration.queries.ts
 * @description Server-side read queries for task materialization batch jobs.
 */

import type { TaskMaterializationBatchJob } from "../../domain/entities/TaskMaterializationBatchJob";
import { makeTaskMaterializationBatchJobRepo } from "../../api/factories";

export async function getWorkspaceFlowTaskMaterializationBatchJobs(
  workspaceId: string,
): Promise<TaskMaterializationBatchJob[]> {
  return makeTaskMaterializationBatchJobRepo().findByWorkspaceId(workspaceId);
}

export async function getWorkspaceFlowTaskMaterializationBatchJob(
  jobId: string,
): Promise<TaskMaterializationBatchJob | null> {
  return makeTaskMaterializationBatchJobRepo().findById(jobId);
}
