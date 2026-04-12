/**
 * @module workspace-flow/application/dto
 * @file submit-task-materialization-batch-job.dto.ts
 * @description Command DTO for submitting a task materialization batch job.
 */

export interface SubmitTaskMaterializationBatchJobDto {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId?: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
}
