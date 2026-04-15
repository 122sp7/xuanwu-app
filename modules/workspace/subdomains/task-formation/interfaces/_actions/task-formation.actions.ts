"use server";

/**
 * @module task-formation/interfaces/_actions
 * @file task-formation.actions.ts
 * @description Server Actions for task formation job operations.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeTaskFormationJobRepo } from "../../api/factories";
import { AiTaskCandidateExtractionAdapter } from "../../infrastructure/ai/AiTaskCandidateExtractionAdapter";
import { SubmitTaskFormationJobUseCase } from "../../application/use-cases/submit-task-formation-job.use-case";
import { ExtractTaskCandidatesUseCase } from "../../application/use-cases/extract-task-candidates.use-case";
import type {
  SubmitTaskFormationJobDto,
  ExtractTaskCandidatesDto,
  ExtractTaskCandidatesResult,
  TaskFormationJob,
} from "../../application/dto";

export async function tfSubmitFormationJob(
  dto: SubmitTaskFormationJobDto,
): Promise<CommandResult> {
  try {
    return await new SubmitTaskFormationJobUseCase(
      makeTaskFormationJobRepo(),
    ).execute(dto);
  } catch (err) {
    return commandFailureFrom(
      "TF_JOB_SUBMIT_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function tfExtractTaskCandidates(
  dto: ExtractTaskCandidatesDto,
): Promise<ExtractTaskCandidatesResult> {
  return new ExtractTaskCandidatesUseCase(
    new AiTaskCandidateExtractionAdapter(),
  ).execute(dto);
}

export async function tfGetFormationJob(
  jobId: string,
): Promise<TaskFormationJob | null> {
  return makeTaskFormationJobRepo().findById(jobId);
}

export async function tfListFormationJobs(
  workspaceId: string,
): Promise<TaskFormationJob[]> {
  return makeTaskFormationJobRepo().findByWorkspaceId(workspaceId);
}
