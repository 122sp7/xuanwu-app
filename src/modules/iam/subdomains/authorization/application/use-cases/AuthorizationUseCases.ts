import type { PermissionDecision, PermissionCheckPort } from "../../domain/index";

export class CheckPermissionUseCase {
  constructor(private readonly permissionPort: PermissionCheckPort) {}

  async execute(input: {
    actorId: string;
    action: string;
    resource: string;
  }): Promise<PermissionDecision> {
    return this.permissionPort.can(input.actorId, input.action, input.resource);
  }
}

export class BatchCheckPermissionsUseCase {
  constructor(private readonly permissionPort: PermissionCheckPort) {}

  async execute(
    checks: Array<{ actorId: string; action: string; resource: string }>,
  ): Promise<PermissionDecision[]> {
    return Promise.all(
      checks.map((c) => this.permissionPort.can(c.actorId, c.action, c.resource)),
    );
  }
}
