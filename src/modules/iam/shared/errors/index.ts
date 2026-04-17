// iam shared errors
export class IamError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "IamError";
  }
}

export class IamNotFoundError extends IamError {
  constructor(resource: string, id: string) {
    super("IAM_NOT_FOUND", `${resource} not found: ${id}`);
  }
}

export class IamPermissionDeniedError extends IamError {
  constructor(action: string) {
    super("IAM_PERMISSION_DENIED", `Permission denied for action: ${action}`);
  }
}
