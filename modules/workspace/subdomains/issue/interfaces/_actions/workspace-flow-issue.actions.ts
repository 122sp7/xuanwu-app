"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeIssueRepo } from "../../api/factories";
import { OpenIssueUseCase } from "../../application/use-cases/open-issue.use-case";
import { StartIssueUseCase } from "../../application/use-cases/start-issue.use-case";
import { FixIssueUseCase } from "../../application/use-cases/fix-issue.use-case";
import { ResolveIssueUseCase } from "../../application/use-cases/resolve-issue.use-case";
import { CloseIssueUseCase } from "../../application/use-cases/close-issue.use-case";
import type { OpenIssueDto } from "../../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../../application/dto/resolve-issue.dto";

export async function wfOpenIssue(dto: OpenIssueDto): Promise<CommandResult> {
  try {
    return await new OpenIssueUseCase(makeIssueRepo()).execute(dto);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_OPEN_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfStartIssue(issueId: string): Promise<CommandResult> {
  try {
    return await new StartIssueUseCase(makeIssueRepo()).execute(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_START_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfFixIssue(issueId: string): Promise<CommandResult> {
  try {
    return await new FixIssueUseCase(makeIssueRepo()).execute(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_FIX_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfResolveIssue(dto: ResolveIssueDto): Promise<CommandResult> {
  try {
    return await new ResolveIssueUseCase(makeIssueRepo()).execute(dto);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RESOLVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfCloseIssue(issueId: string): Promise<CommandResult> {
  try {
    return await new CloseIssueUseCase(makeIssueRepo()).execute(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_CLOSE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
