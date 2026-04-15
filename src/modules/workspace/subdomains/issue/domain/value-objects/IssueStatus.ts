export type IssueStatus =
  | "open"
  | "investigating"
  | "fixing"
  | "retest"
  | "resolved"
  | "closed";

export const ISSUE_STATUSES = [
  "open",
  "investigating",
  "fixing",
  "retest",
  "resolved",
  "closed",
] as const satisfies readonly IssueStatus[];

const ISSUE_NEXT: Readonly<Record<IssueStatus, readonly IssueStatus[]>> = {
  open: ["investigating"],
  investigating: ["fixing"],
  fixing: ["retest"],
  retest: ["resolved", "fixing"],
  resolved: ["closed"],
  closed: [],
};

export function canTransitionIssueStatus(from: IssueStatus, to: IssueStatus): boolean {
  return ISSUE_NEXT[from].includes(to);
}

export function isTerminalIssueStatus(status: IssueStatus): boolean {
  return ISSUE_NEXT[status].length === 0;
}
