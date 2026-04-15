/**
 * @module workspace-flow/application/use-cases
 * @file open-issue.use-case.ts
 * @description Use case: Open a new issue against a task.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueOpenedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import type { OpenIssueDto } from "../dto/open-issue.dto";

export class OpenIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(dto: OpenIssueDto): Promise<CommandResult> {
    if (!dto.taskId.trim()) {
      return commandFailureFrom("WF_ISSUE_TASK_REQUIRED", "Task id is required.");
    }
    if (!dto.title.trim()) {
      return commandFailureFrom("WF_ISSUE_TITLE_REQUIRED", "Issue title is required.");
    }
    if (!dto.createdBy.trim()) {
      return commandFailureFrom("WF_ISSUE_CREATED_BY_REQUIRED", "Creator id is required.");
    }

    const issue = await this.issueRepository.create({
      ...dto,
      taskId: dto.taskId.trim(),
      title: dto.title.trim(),
    });
    return commandSuccess(issue.id, Date.now());
  }
}
 
