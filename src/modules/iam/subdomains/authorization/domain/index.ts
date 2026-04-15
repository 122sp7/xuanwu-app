// authorization — domain layer
// Owns permission evaluation, RBAC policies, and entitlement signals.

export interface PermissionDecision {
  readonly allowed: boolean;
  readonly reason: string;
}

export function allowDecision(reason = "Allowed"): PermissionDecision {
  return { allowed: true, reason };
}

export function denyDecision(reason = "Denied"): PermissionDecision {
  return { allowed: false, reason };
}

export interface PermissionCheckPort {
  can(actorId: string, action: string, resource: string): Promise<PermissionDecision>;
}
