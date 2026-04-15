import type { TaskFormationJob } from "../../application/dto";
import { makeTaskFormationJobRepo } from "../../api/factories";

export async function getTaskFormationJob(
  jobId: string,
): Promise<TaskFormationJob | null> {
  return makeTaskFormationJobRepo().findById(jobId);
}

export async function listTaskFormationJobs(
  workspaceId: string,
): Promise<TaskFormationJob[]> {
  return makeTaskFormationJobRepo().findByWorkspaceId(workspaceId);
}
