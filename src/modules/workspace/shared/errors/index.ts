export class WorkspaceNotFoundError extends Error {
  constructor(workspaceId: string) {
    super(`Workspace '${workspaceId}' not found.`);
    this.name = "WorkspaceNotFoundError";
  }
}

export class WorkspaceMemberNotFoundError extends Error {
  constructor(memberId: string) {
    super(`Member '${memberId}' not found.`);
    this.name = "WorkspaceMemberNotFoundError";
  }
}

export class WorkspaceQuotaExceededError extends Error {
  constructor(resourceKind: string) {
    super(`Quota exceeded for resource '${resourceKind}'.`);
    this.name = "WorkspaceQuotaExceededError";
  }
}

export class WorkspaceInvalidTransitionError extends Error {
  constructor(from: string, to: string) {
    super(`Cannot transition from '${from}' to '${to}'.`);
    this.name = "WorkspaceInvalidTransitionError";
  }
}
