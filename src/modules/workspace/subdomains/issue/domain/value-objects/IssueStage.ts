export type IssueStage = "task" | "qa" | "acceptance";

export const ISSUE_STAGES = ["task", "qa", "acceptance"] as const satisfies readonly IssueStage[];
