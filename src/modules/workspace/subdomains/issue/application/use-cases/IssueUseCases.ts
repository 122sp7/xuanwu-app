import { v4 as uuid } from "@lib-uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { Issue } from "../../domain/entities/Issue";
import type { OpenIssueInput } from "../../domain/entities/Issue";
import { canTransitionIssueStatus } from "../../domain/value-objects/IssueStatus";
import type { IssueStatus } from "../../domain/value-objects/IssueStatus";

export class OpenIssueUseCase {
  constructor(private readonly issueRepo: IssueRepository) {}

  async execute(input: OpenIssueInput): Promise<CommandResult> {
    try {
      const issue = Issue.open(uuid(), input);
      await this.issueRepo.save(issue.getSnapshot());
      return commandSuccess(issue.id, Date.now());
    } catch (err) {
      return commandFailureFrom("ISSUE_OPEN_FAILED", err instanceof Error ? err.message : "Failed to open issue.");
    }
  }
}

export class TransitionIssueStatusUseCase {
  constructor(private readonly issueRepo: IssueRepository) {}

  async execute(issueId: string, to: IssueStatus): Promise<CommandResult> {
    try {
      const snapshot = await this.issueRepo.findById(issueId);
      if (!snapshot) return commandFailureFrom("ISSUE_NOT_FOUND", "Issue not found.");
      if (!canTransitionIssueStatus(snapshot.status, to)) {
        return commandFailureFrom("ISSUE_INVALID_TRANSITION", `Cannot transition from '${snapshot.status}' to '${to}'.`);
      }
      const issue = Issue.reconstitute(snapshot);
      issue.transition(to);
      await this.issueRepo.save(issue.getSnapshot());
      return commandSuccess(issueId, Date.now());
    } catch (err) {
      return commandFailureFrom("ISSUE_TRANSITION_FAILED", err instanceof Error ? err.message : "Failed to transition issue.");
    }
  }
}
