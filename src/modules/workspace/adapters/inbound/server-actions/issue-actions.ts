"use server";

import { z } from "zod";
import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { createClientIssueUseCases } from "../../outbound/firebase-composition";
import type { IssueSnapshot } from "../../../subdomains/issue/domain/entities/Issue";

const OpenIssueSchema = z.object({
  taskId: z.string().min(1),
  stage: z.enum(["task", "qa", "acceptance"]),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  createdBy: z.string().min(1),
  assignedTo: z.string().optional(),
});

const TransitionIssueSchema = z.object({
  to: z.enum(["open", "investigating", "fixing", "retest", "resolved", "closed"]),
});

export async function openIssueAction(rawInput: unknown): Promise<CommandResult> {
  try {
    const input = OpenIssueSchema.parse(rawInput);
    const { openIssue } = createClientIssueUseCases();
    return openIssue.execute(input);
  } catch (err) {
    return commandFailureFrom("ISSUE_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function transitionIssueStatusAction(issueId: string, rawInput: unknown): Promise<CommandResult> {
  try {
    const { to } = TransitionIssueSchema.parse(rawInput);
    const { transitionIssueStatus } = createClientIssueUseCases();
    return transitionIssueStatus.execute(issueId, to);
  } catch (err) {
    return commandFailureFrom("ISSUE_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function resolveIssueAction(issueId: string): Promise<CommandResult> {
  try {
    const { resolveIssue } = createClientIssueUseCases();
    return resolveIssue.execute(issueId);
  } catch (err) {
    return commandFailureFrom("ISSUE_RESOLVE_FAILED", err instanceof Error ? err.message : "Failed to resolve issue.");
  }
}

export async function listIssuesByTaskAction(taskId: string): Promise<IssueSnapshot[]> {
  try {
    const { listIssuesByTask } = createClientIssueUseCases();
    return listIssuesByTask(taskId);
  } catch {
    return [];
  }
}
