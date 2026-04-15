/**
 * @module task-formation/application/use-cases
 * @file submit-task-formation-job.use-case.ts
 * @description Submit a task formation batch job (queued status).
 */

import { v7 as generateId } from "@lib-uuid";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskFormationJobRepository } from "../../domain/repositories/TaskFormationJobRepository";
import type { SubmitTaskFormationJobDto } from "../dto/index";

export class SubmitTaskFormationJobUseCase {
  constructor(private readonly repository: TaskFormationJobRepository) {}

  async execute(dto: SubmitTaskFormationJobDto): Promise<CommandResult> {
    if (!dto.workspaceId.trim()) {
      return commandFailureFrom("TF_JOB_WORKSPACE_REQUIRED", "workspaceId is required.");
    }
    if (!dto.actorId.trim()) {
      return commandFailureFrom("TF_JOB_ACTOR_REQUIRED", "actorId is required.");
    }

    const uniquePageIds = [
      ...new Set(dto.knowledgePageIds.map((id) => id.trim()).filter(Boolean)),
    ];
    if (uniquePageIds.length === 0) {
      return commandFailureFrom(
        "TF_JOB_PAGES_REQUIRED",
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
