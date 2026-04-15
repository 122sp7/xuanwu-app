/**
 * @module workspace-flow/application/use-cases
 * @file submit-task-materialization-batch-job.use-case.ts
 * @description Submit a task materialization batch job in queued status.
 */

import { v7 as generateId } from "@lib-uuid";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskMaterializationBatchJobRepository } from "../../domain/repositories/TaskMaterializationBatchJobRepository";
import type { SubmitTaskMaterializationBatchJobDto } from "../dto/submit-task-materialization-batch-job.dto";

export class SubmitTaskMaterializationBatchJobUseCase {
  constructor(
    private readonly repository: TaskMaterializationBatchJobRepository,
  ) {}

  async execute(dto: SubmitTaskMaterializationBatchJobDto): Promise<CommandResult> {
    if (!dto.workspaceId.trim()) {
      return commandFailureFrom("WF_BATCH_JOB_WORKSPACE_REQUIRED", "workspaceId is required.");
    }
    if (!dto.actorId.trim()) {
      return commandFailureFrom("WF_BATCH_JOB_ACTOR_REQUIRED", "actorId is required.");
    }

    const uniquePageIds = [...new Set(dto.knowledgePageIds.map((item) => item.trim()).filter(Boolean))];
    if (uniquePageIds.length === 0) {
      return commandFailureFrom(
        "WF_BATCH_JOB_PAGES_REQUIRED",
        "At least one knowledgePageId is required.",
      );
    }

    const correlationId = dto.correlationId?.trim() || generateId();
    const job = await this.repository.create({
      workspaceId: dto.workspaceId.trim(),
      actorId: dto.actorId.trim(),
      correlationId,
      knowledgePageIds: uniquePageIds,
    });

    return commandSuccess(job.id, Date.now());
  }
}
