"use server";

/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow-issue.actions.ts
 * @description Server Actions for Issue aggregate write operations.
 *   Delegates exclusively to WorkspaceFlowFacade per IDDD Application Service pattern.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { WorkspaceFlowFacade } from "../../api/workspace-flow.facade";
import { FirebaseTaskRepository } from "../../infrastructure/repositories/FirebaseTaskRepository";
import { FirebaseIssueRepository } from "../../infrastructure/repositories/FirebaseIssueRepository";
import { FirebaseInvoiceRepository } from "../../infrastructure/repositories/FirebaseInvoiceRepository";
import type { OpenIssueDto } from "../../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../../application/dto/resolve-issue.dto";

function makeFacade(): WorkspaceFlowFacade {
  return new WorkspaceFlowFacade(
    new FirebaseTaskRepository(),
    new FirebaseIssueRepository(),
    new FirebaseInvoiceRepository(),
  );
}

export async function wfOpenIssue(dto: OpenIssueDto): Promise<CommandResult> {
  try {
    return await makeFacade().openIssue(dto);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_OPEN_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfStartIssue(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().startIssue(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_START_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfFixIssue(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().fixIssue(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_FIX_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfSubmitIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().submitIssueRetest(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_SUBMIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPassIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().passIssueRetest(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_PASS_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfFailIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().failIssueRetest(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_FAIL_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfResolveIssue(dto: ResolveIssueDto): Promise<CommandResult> {
  try {
    return await makeFacade().resolveIssue(dto);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RESOLVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfCloseIssue(issueId: string): Promise<CommandResult> {
  try {
    return await makeFacade().closeIssue(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_CLOSE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
