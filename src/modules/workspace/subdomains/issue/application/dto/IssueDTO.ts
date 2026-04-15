import { z } from "@lib-zod";
import { ISSUE_STATUSES } from "../../domain/value-objects/IssueStatus";
import { ISSUE_STAGES } from "../../domain/value-objects/IssueStage";

export const OpenIssueInputSchema = z.object({
  taskId: z.string().uuid(),
  stage: z.enum(ISSUE_STAGES),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  createdBy: z.string(),
  assignedTo: z.string().optional(),
});

export const TransitionIssueInputSchema = z.object({
  issueId: z.string().uuid(),
  to: z.enum(ISSUE_STATUSES),
});

export type OpenIssueDTO = z.infer<typeof OpenIssueInputSchema>;
export type TransitionIssueDTO = z.infer<typeof TransitionIssueInputSchema>;
