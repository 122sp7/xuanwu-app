import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import type { IssueEntity, CreateIssueInput, UpdateIssueInput } from "../../domain/entities/Issue";
import { canTransitionIssue, type IssueLifecycleStatus } from "../../domain/value-objects/issue-state";

export class CreateIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(input: CreateIssueInput): Promise<CommandResult> {
    const tenantId = input.tenantId.trim();
    const teamId = input.teamId.trim();
    const workspaceId = input.workspaceId.trim();
    const title = input.title.trim();
    const relatedId = input.relatedId.trim();

    if (!tenantId) return commandFailureFrom("ISSUE_TENANT_REQUIRED", "Tenant is required.");
    if (!teamId) return commandFailureFrom("ISSUE_TEAM_REQUIRED", "Team is required.");
    if (!workspaceId) return commandFailureFrom("ISSUE_WORKSPACE_REQUIRED", "Workspace is required.");
    if (!title) return commandFailureFrom("ISSUE_TITLE_REQUIRED", "Issue title is required.");
    if (!relatedId) return commandFailureFrom("ISSUE_RELATED_REQUIRED", "relatedId is required.");

    const issue = await this.issueRepository.create({
      ...input,
      tenantId,
      teamId,
      workspaceId,
      title,
      relatedId,
    });
    return commandSuccess(issue.id, Date.now());
  }
}

export class UpdateIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string, input: UpdateIssueInput): Promise<CommandResult> {
    const normalizedId = issueId.trim();
    if (!normalizedId) return commandFailureFrom("ISSUE_ID_REQUIRED", "Issue id is required.");

    const nextTitle = typeof input.title === "string" ? input.title.trim() : undefined;
    if (typeof nextTitle === "string" && !nextTitle) {
      return commandFailureFrom("ISSUE_TITLE_REQUIRED", "Issue title is required.");
    }

    const updated = await this.issueRepository.update(normalizedId, {
      ...input,
      ...(typeof nextTitle === "string" ? { title: nextTitle } : {}),
    });
    if (!updated) return commandFailureFrom("ISSUE_NOT_FOUND", "Issue not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class DeleteIssueUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    const normalizedId = issueId.trim();
    if (!normalizedId) return commandFailureFrom("ISSUE_ID_REQUIRED", "Issue id is required.");
    await this.issueRepository.delete(normalizedId);
    return commandSuccess(normalizedId, Date.now());
  }
}

export class TransitionIssueStatusUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string, to: IssueLifecycleStatus): Promise<CommandResult> {
    const normalizedId = issueId.trim();
    if (!normalizedId) return commandFailureFrom("ISSUE_ID_REQUIRED", "Issue id is required.");

    const issue = await this.issueRepository.findById(normalizedId);
    if (!issue) return commandFailureFrom("ISSUE_NOT_FOUND", "Issue not found.");

    if (!canTransitionIssue(issue.status, to)) {
      return commandFailureFrom(
        "ISSUE_INVALID_TRANSITION",
        `Cannot transition from "${issue.status}" to "${to}".`,
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(normalizedId, to, nowISO);
    if (!updated) return commandFailureFrom("ISSUE_NOT_FOUND", "Issue not found after transition.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class ListIssuesUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(workspaceId: string): Promise<IssueEntity[]> {
    const normalizedId = workspaceId.trim();
    if (!normalizedId) return [];
    return this.issueRepository.findByWorkspaceId(normalizedId);
  }
}
