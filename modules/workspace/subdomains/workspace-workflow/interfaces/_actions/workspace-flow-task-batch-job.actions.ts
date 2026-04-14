"use server";

/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow-task-batch-job.actions.ts
 * @description Server Actions for task materialization batch job operations.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { WorkspaceFlowTaskBatchJobFacade } from "../../api/workspace-flow-task-batch-job.facade";
import { makeTaskMaterializationBatchJobRepo } from "../../api/factories";
import { AiTaskCandidateExtractionAdapter } from "../../infrastructure/ai/AiTaskCandidateExtractionAdapter";
import type {
  ExtractTaskCandidatesFromKnowledgeDto,
  ExtractTaskCandidatesFromKnowledgeResult,
} from "../../application/dto/extract-task-candidates-from-knowledge.dto";
import type { SubmitTaskMaterializationBatchJobDto } from "../../application/dto/submit-task-materialization-batch-job.dto";
import type { TaskMaterializationBatchJob } from "../../application/dto/workflow.dto";

function makeFacade(): WorkspaceFlowTaskBatchJobFacade {
  return new WorkspaceFlowTaskBatchJobFacade(
    makeTaskMaterializationBatchJobRepo(),
    new AiTaskCandidateExtractionAdapter(),
  );
}

export async function wfSubmitTaskMaterializationBatchJob(
  dto: SubmitTaskMaterializationBatchJobDto,
): Promise<CommandResult> {
  try {
    return await makeFacade().submitBatchJob(dto);
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
  return makeFacade().getBatchJob(jobId);
}

export async function wfListTaskMaterializationBatchJobs(
  workspaceId: string,
): Promise<TaskMaterializationBatchJob[]> {
  return makeFacade().listBatchJobs(workspaceId);
}

export async function wfExtractTaskCandidatesFromKnowledge(
  dto: ExtractTaskCandidatesFromKnowledgeDto,
): Promise<ExtractTaskCandidatesFromKnowledgeResult> {
  return makeFacade().extractTaskCandidates(dto);
}
