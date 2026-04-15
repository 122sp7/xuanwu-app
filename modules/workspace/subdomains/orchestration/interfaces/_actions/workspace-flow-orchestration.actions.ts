"use server";

/**
 * @module orchestration/interfaces/_actions
 * @file workspace-flow-orchestration.actions.ts
 * @description Server Actions for task materialization batch job orchestration.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import type {
  ExtractTaskCandidatesFromKnowledgeDto,
  ExtractTaskCandidatesFromKnowledgeResult,
} from "../../application/dto/extract-task-candidates-from-knowledge.dto";
import type { SubmitTaskMaterializationBatchJobDto } from "../../application/dto/submit-task-materialization-batch-job.dto";
import type { TaskMaterializationBatchJob } from "../../domain/entities/TaskMaterializationBatchJob";
import { SubmitTaskMaterializationBatchJobUseCase } from "../../application/use-cases/submit-task-materialization-batch-job.use-case";
import { ExtractTaskCandidatesFromKnowledgeUseCase } from "../../application/use-cases/extract-task-candidates-from-knowledge.use-case";
import { makeTaskMaterializationBatchJobRepo } from "../../api/factories";
import { AiTaskCandidateExtractionAdapter } from "../../infrastructure/ai/AiTaskCandidateExtractionAdapter";

export async function wfSubmitTaskMaterializationBatchJob(
  dto: SubmitTaskMaterializationBatchJobDto,
): Promise<CommandResult> {
  try {
    return await new SubmitTaskMaterializationBatchJobUseCase(
      makeTaskMaterializationBatchJobRepo(),
    ).execute(dto);
  } catch (err) {
    return commandFailureFrom(
      "WF_BATCH_JOB_SUBMIT_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function wfGetTaskMaterializationBatchJob(
  jobId: string,
): Promise<TaskMaterializationBatchJob | null> {
  try {
    return await makeTaskMaterializationBatchJobRepo().findById(jobId);
  } catch {
    return null;
  }
}

export async function wfListTaskMaterializationBatchJobs(
  workspaceId: string,
): Promise<TaskMaterializationBatchJob[]> {
  try {
    return await makeTaskMaterializationBatchJobRepo().findByWorkspaceId(workspaceId);
  } catch {
    return [];
  }
}

export async function wfExtractTaskCandidatesFromKnowledge(
  dto: ExtractTaskCandidatesFromKnowledgeDto,
): Promise<ExtractTaskCandidatesFromKnowledgeResult> {
  return new ExtractTaskCandidatesFromKnowledgeUseCase(
    new AiTaskCandidateExtractionAdapter(),
  ).execute(dto);
}
