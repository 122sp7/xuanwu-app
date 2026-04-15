import type { Issue } from "../../application/dto/workflow.dto";

export interface IssueSummary {
  readonly id: string;
  readonly taskId: string;
  readonly title: string;
  readonly status: Issue["status"];
  readonly stage: Issue["stage"];
}

export function toIssueSummary(issue: Issue): IssueSummary {
  return {
    id: issue.id,
    taskId: issue.taskId,
    title: issue.title,
    status: issue.status,
    stage: issue.stage,
  };
}
