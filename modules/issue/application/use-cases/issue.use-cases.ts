import { commandFailureFrom, commandSuccess, type CommandResult } from "@/shared/types";

import type {
  CreateWorkspaceIssueInput,
  UpdateWorkspaceIssueInput,
  WorkspaceIssueEntity,
} from "../../domain/entities/Issue";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";

export class CreateWorkspaceIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(input: CreateWorkspaceIssueInput): Promise<CommandResult> {
    const workspaceId = input.workspaceId.trim();
    const title = input.title.trim();

    if (!workspaceId) {
      return commandFailureFrom("ISSUE_WORKSPACE_REQUIRED", "Workspace is required.");
    }

    if (!title) {
      return commandFailureFrom("ISSUE_TITLE_REQUIRED", "Issue title is required.");
    }

    const issue = await this.issueRepository.create({
      ...input,
      workspaceId,
      title,
    });

    return commandSuccess(issue.id, Date.now());
  }
}

export class UpdateWorkspaceIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string, input: UpdateWorkspaceIssueInput): Promise<CommandResult> {
    const normalizedIssueId = issueId.trim();
    if (!normalizedIssueId) {
      return commandFailureFrom("ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const nextTitle = typeof input.title === "string" ? input.title.trim() : undefined;
    if (typeof nextTitle === "string" && !nextTitle) {
      return commandFailureFrom("ISSUE_TITLE_REQUIRED", "Issue title is required.");
    }

    const updatedIssue = await this.issueRepository.update(normalizedIssueId, {
      ...input,
      ...(typeof nextTitle === "string" ? { title: nextTitle } : {}),
    });

    if (!updatedIssue) {
      return commandFailureFrom("ISSUE_NOT_FOUND", "Issue not found.");
    }

    return commandSuccess(updatedIssue.id, Date.now());
  }
}

export class DeleteWorkspaceIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    const normalizedIssueId = issueId.trim();
    if (!normalizedIssueId) {
      return commandFailureFrom("ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    await this.issueRepository.delete(normalizedIssueId);
    return commandSuccess(normalizedIssueId, Date.now());
  }
}

export class ListWorkspaceIssuesUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(workspaceId: string): Promise<WorkspaceIssueEntity[]> {
    const normalizedWorkspaceId = workspaceId.trim();
    if (!normalizedWorkspaceId) {
      return [];
    }

    return this.issueRepository.findByWorkspaceId(normalizedWorkspaceId);
  }
}
