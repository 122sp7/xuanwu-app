/**
 * @module workspace-flow/application/use-cases
 * @file pass-issue-retest.use-case.ts
 * @description Use case: Pass an issue's retest (retest → resolved).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit IssueRetestPassedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../../issue/domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../../issue/domain/services/issue-transition-policy";

export class PassIssueRetestUseCase {
  constructor(private readonly issueRepository: IssueRepository) {}

  async execute(issueId: string): Promise<CommandResult> {
    if (!issueId.trim()) {
      return commandFailureFrom("WF_ISSUE_ID_REQUIRED", "Issue id is required.");
    }

    const issue = await this.issueRepository.findById(issueId);
    if (!issue) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found.");
    }

    const guard = evaluateIssueTransition(issue.status, "resolved");
    if (!guard.allowed) {
      return commandFailureFrom("WF_ISSUE_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.issueRepository.transitionStatus(issueId, "resolved", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_ISSUE_NOT_FOUND", "Issue not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
 
